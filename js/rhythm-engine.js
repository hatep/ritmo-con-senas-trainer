// rhythm-engine.js - Game loop, 2-measure imitate cycle, tap evaluation & precision scheduler

import { audioEngine } from './audio-engine.js';
import { getRandomSign } from './rhythm-data.js';

export class RhythmEngine {
  constructor(handRenderer, onStateChange, onEvaluation) {
    this.handRenderer = handRenderer;
    this.onStateChange = onStateChange; // callback for UI beat/measure updates
    this.onEvaluation = onEvaluation;   // callback for hit dot feedback

    // Configuration
    this.bpm = 70;
    this.divisionMode = 'binary'; // 'binary' (4) | 'ternary' (3)
    this.level = 1;
    this.isMetronomeOn = true;
    this.isSubdivisionOn = false;
    this.hearRhythmFirst = true; // demo on Pass 1
    this.repeatOnError = false;

    // Timing thresholds (can be tweaked live in Debug HUD)
    this.thresholdPerfectMs = 35; // |delta| <= 35ms -> Perfect (Green)
    this.thresholdMaxMs = 85;     // 35ms < |delta| <= 85ms -> Early / Late (Orange/Red)

    // State machine
    this.isRunning = false;
    this.timerId = null;
    
    // Musical clock tracking
    this.startTime = 0;
    this.nextBeatTime = 0;
    this.currentBeatInBar = 0;        // 0..3 (for 4/4)
    this.currentBarInCycle = 0;       // 0..1 (Pass 1) or 2..3 (Pass 2)
    this.activePass = 1;              // 1 = Demonstration (2 bars), 2 = Imitation (2 bars)
    
    // Pattern tracking
    this.currentSign = "1000";
    this.previousPassFailed = false;

    // Tap logging for the current imitation pass
    this.expectedHits = [];
    this.userTaps = [];
  }

  setSettings(settings) {
    if (settings.bpm !== undefined) this.bpm = settings.bpm;
    if (settings.divisionMode !== undefined) this.divisionMode = settings.divisionMode;
    if (settings.level !== undefined) this.level = settings.level;
    if (settings.isMetronomeOn !== undefined) this.isMetronomeOn = settings.isMetronomeOn;
    if (settings.isSubdivisionOn !== undefined) this.isSubdivisionOn = settings.isSubdivisionOn;
    if (settings.hearRhythmFirst !== undefined) this.hearRhythmFirst = settings.hearRhythmFirst;
    if (settings.repeatOnError !== undefined) this.repeatOnError = settings.repeatOnError;
  }

  get subdivisionsPerBeat() {
    return this.divisionMode === 'ternary' ? 3 : 4;
  }

  get secondsPerBeat() {
    return 60.0 / this.bpm;
  }

  get secondsPerSubdivision() {
    return this.secondsPerBeat / this.subdivisionsPerBeat;
  }

  start() {
    if (this.isRunning) return;
    audioEngine.ensureRunning();

    this.isRunning = true;
    this.currentBarInCycle = 0;
    this.currentBeatInBar = 0;
    this.activePass = 1;
    this.previousPassFailed = false;

    this.pickNextSign();

    this.nextBeatTime = audioEngine.getCurrentTime() + 0.1;
    this.runScheduler();
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  pickNextSign() {
    if (this.repeatOnError && this.previousPassFailed && this.currentSign) {
      // Repeat the exact same sign
    } else {
      this.currentSign = getRandomSign(this.divisionMode, this.level);
    }
    this.previousPassFailed = false;
    this.handRenderer.applySign(this.currentSign);
  }

  runScheduler() {
    if (!this.isRunning) return;

    const currentTime = audioEngine.getCurrentTime();
    while (this.nextBeatTime < currentTime + audioEngine.scheduleAheadTime) {
      this.scheduleBeat(this.nextBeatTime, this.currentBeatInBar, this.currentBarInCycle);
      this.advanceBeat();
    }

    this.timerId = setTimeout(() => this.runScheduler(), audioEngine.lookaheadMs);
  }

  scheduleBeat(beatTime, beatNum, barNum) {
    const isAccent = beatNum === 0;
    const subsPerBeat = this.subdivisionsPerBeat;
    const subDuration = this.secondsPerSubdivision;

    // 1. Metronome Quarter Note
    if (this.isMetronomeOn) {
      audioEngine.playMetronomeClick(beatTime, isAccent);
    }

    // 2. Subdivisions (16ths or Triplets)
    for (let s = 0; s < subsPerBeat; s++) {
      const subTime = beatTime + s * subDuration;
      const isTargetSub = this.currentSign.charAt(s) === '1';

      if (s > 0 && this.isSubdivisionOn) {
        audioEngine.playSubdivisionTick(subTime);
      }

      // Pass 1: "Hear rhythm first" audio demo
      if (this.activePass === 1 && this.hearRhythmFirst && isTargetSub) {
        audioEngine.playDemoRhythmHit(subTime);
      }

      // Pass 2: Register expected hit slots for real-time player tap evaluation
      if (this.activePass === 2 && isTargetSub) {
        this.expectedHits.push({
          time: subTime,
          subdivision: s,
          beat: beatNum,
          bar: barNum,
          hitDone: false
        });
      }
    }

    // UI Synchronized Tick
    const timeUntilBeat = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
    setTimeout(() => {
      if (!this.isRunning) return;
      if (this.onStateChange) {
        this.onStateChange({
          pass: this.activePass,
          bar: this.currentBarInCycle + 1,
          beat: this.currentBeatInBar + 1,
          sign: this.currentSign,
          bpm: this.bpm
        });
      }
    }, timeUntilBeat);
  }

  advanceBeat() {
    this.nextBeatTime += this.secondsPerBeat;
    this.currentBeatInBar++;

    // 4 beats per bar
    if (this.currentBeatInBar >= 4) {
      this.currentBeatInBar = 0;
      this.currentBarInCycle++;

      // Each pass is exactly 2 measures
      if (this.currentBarInCycle === 2) {
        // Transition: Pass 1 (Demo, 2 bars) -> Pass 2 (Imitate, 2 bars)
        this.activePass = 2;
        this.expectedHits = [];
        this.userTaps = [];
      } else if (this.currentBarInCycle >= 4) {
        // End of Pass 2: Evaluate accuracy
        this.evaluateFullPass();

        // New cycle: back to Pass 1
        this.currentBarInCycle = 0;
        this.activePass = 1;
        this.pickNextSign();
      }
    }
  }

  handleUserTap() {
    audioEngine.playUserTap();

    if (!this.isRunning || this.activePass !== 2) {
      return;
    }

    const tapTime = audioEngine.getCurrentTime();
    this.userTaps.push(tapTime);

    const maxSearchWindow = this.secondsPerSubdivision * 1.2;
    let closestExpected = null;
    let minAbsDiff = Infinity;

    for (const exp of this.expectedHits) {
      const diff = tapTime - exp.time;
      const absDiff = Math.abs(diff);
      if (absDiff < maxSearchWindow && absDiff < minAbsDiff) {
        minAbsDiff = absDiff;
        closestExpected = exp;
      }
    }

    if (closestExpected) {
      const deltaSec = tapTime - closestExpected.time;
      const deltaMs = deltaSec * 1000;
      closestExpected.hitDone = true;

      let rating = 'perfect';
      if (Math.abs(deltaMs) <= this.thresholdPerfectMs) {
        rating = 'perfect'; // Green
      } else if (deltaMs < 0) {
        rating = 'early';   // Red-orange (left of knuckle)
      } else {
        rating = 'late';    // Red-orange (right of knuckle)
      }

      if (this.onEvaluation) {
        this.onEvaluation({
          subdivision: closestExpected.subdivision,
          deltaMs: deltaMs,
          rating: rating,
          time: tapTime
        });
      }
    } else {
      if (this.onEvaluation) {
        this.onEvaluation({
          subdivision: -1,
          deltaMs: 999,
          rating: 'late',
          time: tapTime
        });
      }
    }
  }

  evaluateFullPass() {
    let successfulHits = 0;
    const totalRequired = this.expectedHits.length;

    for (const exp of this.expectedHits) {
      if (exp.hitDone) successfulHits++;
    }

    const accuracy = totalRequired > 0 ? (successfulHits / totalRequired) : 1;
    this.previousPassFailed = accuracy < 0.75;
  }
}
