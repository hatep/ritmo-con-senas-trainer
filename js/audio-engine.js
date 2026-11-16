// audio-engine.js - High-precision Web Audio API scheduler & synthesizers

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.lookaheadMs = 25.0; // scheduling loop interval in ms
    this.scheduleAheadTime = 0.12; // schedule audio 120ms ahead
    this.timerId = null;

    // Calibration & audio settings
    this.latencyOffsetMs = 0; // user adjustable hardware offset
    this.woodClickFreq = 950;
    this.tapWoodFreq = 720;
    this.subdivisionFreq = 1600;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureRunning() {
    this.init();
    if (this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  getCurrentTime() {
    if (!this.ctx) return 0;
    return this.ctx.currentTime;
  }

  // Play high resonant woodblock click (metronome quarter/main beat)
  playMetronomeClick(time, isAccent = true) {
    if (!this.ctx) return;
    const t = Math.max(time, this.ctx.currentTime);
    
    // Resonant pulse for authentic woodblock feel
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isAccent ? 1200 : this.woodClickFreq, t);
    filter.Q.setValueAtTime(4.5, t);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isAccent ? 880 : 660, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);

    gain.gain.setValueAtTime(isAccent ? 0.9 : 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.065);
  }

  // Play soft subtle tick for subdivision (16th notes or triplets)
  playSubdivisionTick(time) {
    if (!this.ctx) return;
    const t = Math.max(time, this.ctx.currentTime);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2200, t);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.subdivisionFreq, t);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.03);
  }

  // Play synthesized rhythm demo sound (Pass 1 - "Hear rhythm first")
  playDemoRhythmHit(time) {
    if (!this.ctx) return;
    const t = Math.max(time, this.ctx.currentTime);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);

    gain.gain.setValueAtTime(0.85, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Instant tactile feedback sound when user taps the button or spacebar ("taps when you tap")
  playUserTap() {
    this.ensureRunning();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2600, t);
    noiseFilter.Q.setValueAtTime(3.0, t);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.tapWoodFreq, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.07);

    gain.gain.setValueAtTime(0.95, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    osc.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.08);
  }
}

export const audioEngine = new AudioEngine();
