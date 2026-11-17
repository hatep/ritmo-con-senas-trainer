// app.js - Phase-Locked Cycle Architecture, Perfect Demo Audio Sync & Deterministic Repeat on Error
(function() {
  'use strict';

  /* ==========================================================================
     1. RHYTHMIC DICTIONARIES & LEVEL DATA
     ========================================================================== */
  const BINARY_LEVELS = {
    1: { name: "Level 1 (Easy)", signs: ["0000", "1000", "1010", "1111"] },
    2: {
      name: "Level 2 (Medium)",
      signs: ["0000", "1000", "1010", "1111", "1100", "1001", "0110", "0010", "1110", "1011"]
    },
    3: {
      name: "Level 3 (Hard)",
      signs: [
        "0000", "1000", "1010", "1111", "1100", "1001", "0110", "0010", "1110", "1011",
        "0100", "0001", "0101", "0011", "0111", "1101"
      ]
    }
  };

  const TERNARY_LEVELS = {
    1: { name: "Level 1 (Easy)", signs: ["000", "100", "111"] },
    2: { name: "Level 2 (Medium)", signs: ["000", "100", "111", "101", "110"] },
    3: { name: "Level 3 (Hard)", signs: ["000", "100", "111", "101", "110", "001", "010", "011"] }
  };

  function getRandomSign(mode, level) {
    const dictionary = mode === 'ternary' ? TERNARY_LEVELS : BINARY_LEVELS;
    const signs = (dictionary[level] && dictionary[level].signs) || dictionary[1].signs;
    return signs[Math.floor(Math.random() * signs.length)];
  }

  /* ==========================================================================
     TRANSLATIONS DICTIONARY (FR Default, ES, EN)
     ========================================================================== */
  const TRANSLATIONS = {
    fr: {
      drawerTitle: "PARAMÈTRES",
      navSettings: "Paramètres",
      openSettingsTooltip: "Ouvrir les paramètres (Esc)",
      closeSettingsTooltip: "Fermer les paramètres (Esc)",
      tempoTooltip: "Cliquer pour modifier le tempo",
      btnStart: "Démarrer",
      btnStop: "Arrêter",
      practiceMode: "Répétition",
      practiceDesc: "Travaillez un rythme jusqu'à le réussir",
      mode: "Mode",
      modeImitate: "Imiter",
      modeContinuous: "Continu",
      view: "Vue",
      viewLeft: "Gauche",
      viewRight: "Droite",
      viewTwo: "Deux mains",
      subdivision: "Subdivision",
      level: "Niveau",
      levelEasy: "Facile",
      levelMedium: "Intermédiaire",
      levelHard: "Avancé",
      levelCustom: "Personnalisé",
      customSeqTitle: "Séquence personnalisée",
      customHint: "Cliquez sur les doigts pour lever/baisser, puis appuyez sur + pour l'ajouter à la séquence.",
      metronome: "Métronome",
      fingerLabels: "Noms des doigts",
      labelSolfege: "Solfège",
      labelNumbers: "1 2 3 4",
      labelHidden: "Masqué",
      tapRhythm: "TAPEZ LE RYTHME",
      listenRead: "ÉCOUTEZ & LISEZ",
      tapHint: "Appuyez sur <kbd>Espace</kbd> pour taper &bull; Appuyez sur <kbd>S</kbd> pour Démarrer/Arrêter",
      handProgress: (cur, total) => `Main ${cur} / ${total}`,
      scoreTitle: "Exercice terminé",
      scoreHeadlineZero: "Pas terrible...",
      scoreHeadlineLow: "Pas mal !",
      scoreHeadlineGood: "Bien joué !",
      scoreHeadlineAdvanced: "Superbe performance !",
      scoreHeadlinePerfect: "10/10 ! Score sans faute !",
      scoreHeadlinePerfectAdv: "10/10 ! Un sans-faute remarquable !",
      scoreTextPractice: 'Vous pouvez vous entraîner en <a href="#" class="score-interactive-link" data-action="practice">Mode Répétition</a> pour continuer à progresser.',
      scoreTextDiff: 'Vous pouvez augmenter la <a href="#" class="score-interactive-link" data-action="difficulty">difficulté</a> dans les paramètres.',
      scoreTextDiffPerfect: 'Prêt pour la suite ? Passez à la <a href="#" class="score-interactive-link" data-action="difficulty">difficulté</a> supérieure !',
      scoreTextAdvanced: "Vous tenez un très bon niveau sur les rythmes les plus exigeants.",
      scoreTextAdvancedPerfect: "Une précision impeccable du début à la fin de la série.",
      // Normal Mode End-of-Exercise recommendations
      scoreTextCalibrationAhead: 'Vous semblez frapper systématiquement en avance. Pensez à <a href="#" class="score-interactive-link" data-action="calibrate">calibrer la latence</a> de votre appareil.',
      scoreTextCalibrationBehind: 'Vous semblez frapper systématiquement en retard. Pensez à <a href="#" class="score-interactive-link" data-action="calibrate">calibrer la latence</a> de votre appareil.',
      btnRetry: "Réessayer",
      btnClose: "Fermer",
      btnAdd: "Ajouter",
      tabTutorial: "Tutoriel",
      tabHistory: "Histoire",
      closeModalTooltip: "Fermer (Esc)",
      addPatternTooltip: "Ajouter le motif actuel à la liste",
      shuffleTooltip: "Mélanger (🔀)",
      helpTooltip: "Tutoriel & Histoire",
      emptyPlaylist: "Aucun motif pour l'instant. Cliquez sur les doigts puis appuyez sur +",
      chipTitle: "Glisser pour réordonner • Cliquer pour charger",
      removePatternTooltip: "Supprimer le motif",
      tooltipPracticeToggle: "Boucler jusqu'à réussite",
      tooltipModeImitate: "2 temps d'écoute, 2 temps de jeu",
      tooltipModeContinuous: "Déchiffrage en continu",
      tooltipViewLeft: "Main gauche seule",
      tooltipViewRight: "Main droite seule",
      tooltipViewTwo: "Coordination des deux mains",
      tooltipLabelSolfege: "TaKaDiMi",
      tooltipLabelNumbers: "Numéro",
      tooltipLabelHidden: "Sans repère",
      latencySettingBtn: "Calibrer la latence",
      latencyCurrentPrefix: "Actuelle : ",
      latencyModalTitle: "Calibrage de la latence",
      latencyInitialHelp: "Le métronome bat à 60 BPM. Cliquez sur TAP en rythme 8 fois pour mesurer la latence de votre appareil.",
      latencyRemainingHelp: (count) => `Cliquez encore ${count} fois`,
      latencyFinishedHelp: "Vous pouvez continuer à cliquer sur TAP pour affiner la précision du résultat.",
      latencyDetectedLabel: "Latence détectée :",
      latencyBtnTap: "TAP",
      latencyBtnRestart: "Recommencer",
      latencyBtnLetsGo: "C'est parti !",
      latencyExplainer: "Chaque écran et casque a un léger temps de réaction. Calibrer permet d’aligner vos oreilles, vos doigts et le jeu sur la même seconde."
    },
    es: {
      drawerTitle: "CONFIGURACIÓN",
      navSettings: "Ajustes",
      openSettingsTooltip: "Abrir ajustes (Esc)",
      closeSettingsTooltip: "Cerrar ajustes (Esc)",
      tempoTooltip: "Clic para editar el tempo",
      btnStart: "Iniciar",
      btnStop: "Detener",
      practiceMode: "Práctica",
      practiceDesc: "Trabaja un ritmo hasta lograrlo",
      mode: "Modo",
      modeImitate: "Imitar",
      modeContinuous: "Continuo",
      view: "Vista",
      viewLeft: "Izquierda",
      viewRight: "Derecha",
      viewTwo: "Dos manos",
      subdivision: "Subdivisión",
      level: "Nivel",
      levelEasy: "Fácil",
      levelMedium: "Intermedio",
      levelHard: "Avanzado",
      levelCustom: "Personalizado",
      customSeqTitle: "Secuencia personalizada",
      customHint: "Haz clic en los dedos para subir/bajar, luego presiona + para agregarlo a la secuencia.",
      metronome: "Metrónomo",
      fingerLabels: "Nombres de los dedos",
      labelSolfege: "Solfeo",
      labelNumbers: "1 2 3 4",
      labelHidden: "Oculto",
      tapRhythm: "TOCA EL RITMO",
      listenRead: "ESCUCHA Y LEE",
      tapHint: "Presiona <kbd>Espacio</kbd> para tocar &bull; Presiona <kbd>S</kbd> para Iniciar/Detener",
      handProgress: (cur, total) => `Mano ${cur} / ${total}`,
      scoreTitle: "Ejercicio completado",
      scoreHeadlineZero: "No muy bien...",
      scoreHeadlineLow: "¡No está mal!",
      scoreHeadlineGood: "¡Bien hecho!",
      scoreHeadlineAdvanced: "¡Excelente desempeño!",
      scoreHeadlinePerfect: "¡10/10! ¡Puntaje perfecto!",
      scoreHeadlinePerfectAdv: "¡10/10! ¡Una serie impecable!",
      scoreTextPractice: 'Puedes entrenar en el <a href="#" class="score-interactive-link" data-action="practice">Modo Práctica</a> para seguir progresando.',
      scoreTextDiff: 'Puedes aumentar la <a href="#" class="score-interactive-link" data-action="difficulty">dificultad</a> en la configuración.',
      scoreTextDiffPerfect: '¿Listo para más? ¡Pasa a la siguiente <a href="#" class="score-interactive-link" data-action="difficulty">dificultad</a>!',
      scoreTextAdvanced: "Mantienes un nivel muy sólido en los ritmos más exigentes.",
      scoreTextAdvancedPerfect: "Precisión impecable de principio a fin.",
      scoreTextCalibrationAhead: 'Parece que estás tocando sistemáticamente adelantado. Recuerda que puedes <a href="#" class="score-interactive-link" data-action="calibrate">calibrar la latencia</a> de tu dispositivo.',
      scoreTextCalibrationBehind: 'Parece que estás tocando sistemáticamente retrasado. Recuerda que puedes <a href="#" class="score-interactive-link" data-action="calibrate">calibrar la latencia</a> de tu dispositivo.',
      btnRetry: "Reintentar",
      btnClose: "Cerrar",
      btnAdd: "Añadir",
      tabTutorial: "Tutorial",
      tabHistory: "Historia",
      closeModalTooltip: "Cerrar (Esc)",
      addPatternTooltip: "Añadir el patrón actual a la lista",
      shuffleTooltip: "Mezclar (🔀)",
      helpTooltip: "Tutorial e Historia",
      emptyPlaylist: "Aún no hay patrones. Haz clic en los dedos y presiona +",
      chipTitle: "Arrastrar para reordenar • Clic para cargar",
      removePatternTooltip: "Eliminar patrón",
      tooltipPracticeToggle: "Repetir hasta lograrlo",
      tooltipModeImitate: "2 tiempos escucha, 2 tiempos toque",
      tooltipModeContinuous: "Lectura continua sin pausa",
      tooltipViewLeft: "Solo mano izquierda",
      tooltipViewRight: "Solo mano derecha",
      tooltipViewTwo: "Ambas manos juntas",
      tooltipLabelSolfege: "TaKaDiMi",
      tooltipLabelNumbers: "Números",
      tooltipLabelHidden: "Sin marcas",
      latencySettingBtn: "Calibrar latencia",
      latencyCurrentPrefix: "Actual: ",
      latencyModalTitle: "Calibración de latencia",
      latencyInitialHelp: "El metrónomo late a 60 BPM. Haz clic en TAP al ritmo 8 veces para medir la latencia de tu dispositivo.",
      latencyRemainingHelp: (count) => `Haz clic ${count} veces más`,
      latencyFinishedHelp: "Puedes seguir presionando TAP para afinar la precisión del resultado.",
      latencyDetectedLabel: "Latencia detectada:",
      latencyBtnTap: "TAP",
      latencyBtnRestart: "Reiniciar",
      latencyBtnLetsGo: "¡Vamos!",
      latencyExplainer: "Cada pantalla y auricular tiene un breve tiempo de reacción. Calibrar permite alinear tus oídos, tus dedos y el juego en el mismo segundo."
    },
    en: {
      drawerTitle: "SETTINGS",
      navSettings: "Settings",
      openSettingsTooltip: "Open settings (Esc)",
      closeSettingsTooltip: "Close settings (Esc)",
      tempoTooltip: "Click to edit tempo",
      btnStart: "Start",
      btnStop: "Stop",
      practiceMode: "Practice",
      practiceDesc: "Work on a rhythm until you get it right",
      mode: "Mode",
      modeImitate: "Imitate",
      modeContinuous: "Continuous",
      view: "View",
      viewLeft: "Left",
      viewRight: "Right",
      viewTwo: "Two Hands",
      subdivision: "Subdivision",
      level: "Level",
      levelEasy: "Easy",
      levelMedium: "Intermediate",
      levelHard: "Advanced",
      levelCustom: "Custom",
      customSeqTitle: "Custom Sequence",
      customHint: "Click fingers to raise/lower, then press + to add to playlist.",
      metronome: "Metronome",
      fingerLabels: "Finger Labels",
      labelSolfege: "Solfege",
      labelNumbers: "1 2 3 4",
      labelHidden: "Hidden",
      tapRhythm: "TAP RHYTHM",
      listenRead: "LISTEN & READ",
      tapHint: "Press <kbd>Space</kbd> to tap &bull; Press <kbd>S</kbd> to Start/Stop",
      handProgress: (cur, total) => `Hand ${cur} / ${total}`,
      scoreTitle: "Exercise Completed",
      scoreHeadlineZero: "Not great...",
      scoreHeadlineLow: "Not bad!",
      scoreHeadlineGood: "Well done!",
      scoreHeadlineAdvanced: "Great performance!",
      scoreHeadlinePerfect: "10/10! Flawless score!",
      scoreHeadlinePerfectAdv: "10/10! Remarkable flawless run!",
      scoreTextPractice: 'You can train in <a href="#" class="score-interactive-link" data-action="practice">Practice mode</a> to progress further.',
      scoreTextDiff: 'You can increase <a href="#" class="score-interactive-link" data-action="difficulty">difficulty</a> in the settings.',
      scoreTextDiffPerfect: 'Ready for more? Increase the <a href="#" class="score-interactive-link" data-action="difficulty">difficulty</a>!',
      scoreTextAdvanced: "You have a strong grasp on the most demanding patterns.",
      scoreTextAdvancedPerfect: "Impeccable timing from start to finish.",
      scoreTextCalibrationAhead: 'You seem to be tapping consistently ahead of time. You might want to <a href="#" class="score-interactive-link" data-action="calibrate">calibrate device latency</a>.',
      scoreTextCalibrationBehind: 'You seem to be tapping consistently behind time. You might want to <a href="#" class="score-interactive-link" data-action="calibrate">calibrate device latency</a>.',
      btnRetry: "Retry",
      btnClose: "Close",
      btnAdd: "Add",
      tabTutorial: "Tutorial",
      tabHistory: "History",
      closeModalTooltip: "Close (Esc)",
      addPatternTooltip: "Add current pattern to playlist",
      shuffleTooltip: "Shuffle (🔀)",
      helpTooltip: "Tutorial & History",
      emptyPlaylist: "No patterns yet. Click fingers to shape rhythm, then press +",
      chipTitle: "Drag to reorder • Click to load",
      removePatternTooltip: "Remove pattern",
      tooltipPracticeToggle: "Loop until mastered",
      tooltipModeImitate: "2 beats listen, 2 beats tap",
      tooltipModeContinuous: "Non-stop sight-reading",
      tooltipViewLeft: "Left hand only",
      tooltipViewRight: "Right hand only",
      tooltipViewTwo: "Both hands together",
      tooltipLabelSolfege: "TaKaDiMi",
      tooltipLabelNumbers: "Numbers",
      tooltipLabelHidden: "No labels",
      latencySettingBtn: "Calibrate latency",
      latencyCurrentPrefix: "Current: ",
      latencyModalTitle: "Latency Calibration",
      latencyInitialHelp: "The metronome runs at 60 BPM. Tap in rhythm 8 times to measure your device's latency.",
      latencyRemainingHelp: (count) => `Click ${count} more times`,
      latencyFinishedHelp: "You can keep on pressing TAP to get a more accurate result.",
      latencyDetectedLabel: "Detected latency:",
      latencyBtnTap: "TAP",
      latencyBtnRestart: "Restart",
      latencyBtnLetsGo: "Let's Go !",
      latencyExplainer: "Every screen and headphone has a tiny reaction time. Calibrating aligns your ears, fingers, and the game on the exact same second."
    }
  };

  /* ==========================================================================
     2. AUDIO ENGINE (Layered Bass-Tom + High Harmonic Snap)
     ========================================================================== */
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.metronomeGain = null;
      this.subdivisionGain = null;
      this.demoGain = null;
      this.tapGain = null;

      this.lookaheadMs = 20.0;
      this.scheduleAheadTime = 0.08;

      this.isSubdivisionEnabled = true;
      this.isHearRhythmEnabled = true;

      this.metronomeSound = 'bass-tom'; // Bass-tom + harmonic stick attack
      this.subdivisionSound = 'shaker'; // Percussion Shaker as default
      this.imitateSound = 'handclap'; // Default sound when listening in imitate mode
      this.tapSound = 'bongo'; // Bongo slap as preferred by user
    }

    init() {
      if (this.ctx) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Dedicated Gain Buses for Instantaneous Real-Time Control
      this.metronomeGain = this.ctx.createGain();
      this.metronomeGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.metronomeGain.connect(this.masterGain);

      this.subdivisionGain = this.ctx.createGain();
      this.subdivisionGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.subdivisionGain.connect(this.masterGain);

      this.demoGain = this.ctx.createGain();
      this.demoGain.gain.setValueAtTime(this.isHearRhythmEnabled ? 1.0 : 0.0, this.ctx.currentTime);
      this.demoGain.connect(this.masterGain);

      this.tapGain = this.ctx.createGain();
      this.tapGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.tapGain.connect(this.masterGain);
    }

    setSubdivisionEnabled(enabled) {
      this.isSubdivisionEnabled = !!enabled;
      if (this.ctx && this.subdivisionGain) {
        this.subdivisionGain.gain.setValueAtTime(this.isSubdivisionEnabled ? 1.0 : 0.0, this.ctx.currentTime);
      }
    }

    setHearRhythmEnabled(enabled) {
      this.isHearRhythmEnabled = !!enabled;
      if (this.ctx && this.demoGain) {
        this.demoGain.gain.setValueAtTime(this.isHearRhythmEnabled ? 1.0 : 0.0, this.ctx.currentTime);
      }
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

    getHardwareLatencyMs() {
      if (!this.ctx) return 35;
      const base = (this.ctx.baseLatency || 0) * 1000;
      const out = (this.ctx.outputLatency || 0) * 1000;
      const total = Math.round(base + out);
      if (total >= 10) return total;
      return 35; // Standard desktop OS audio buffer latency fallback
    }

    // Metronome Quarter Note: Deep Bass-Tom with High Harmonic Stick Snap
    playMetronomeClick(time, isAccent = true) {
      if (!this.ctx) return;
      const t = Math.max(time, this.ctx.currentTime);
      const dest = this.metronomeGain || this.masterGain;

      switch (this.metronomeSound) {
        case 'bass-tom': {
          // Layer 1: Low warm resonant tom body
          const oscBody = this.ctx.createOscillator();
          const gainBody = this.ctx.createGain();
          oscBody.type = 'sine';
          const startFreq = isAccent ? 190 : 150;
          const endFreq = isAccent ? 65 : 52;
          oscBody.frequency.setValueAtTime(startFreq, t);
          oscBody.frequency.exponentialRampToValueAtTime(endFreq, t + 0.12);

          gainBody.gain.setValueAtTime(isAccent ? 1.0 : 0.78, t);
          gainBody.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

          oscBody.connect(gainBody);
          gainBody.connect(dest);
          oscBody.start(t);
          oscBody.stop(t + 0.16);

          // Layer 2: Higher harmonic stick attack transient
          const oscClick = this.ctx.createOscillator();
          const filterClick = this.ctx.createBiquadFilter();
          const gainClick = this.ctx.createGain();

          oscClick.type = 'triangle';
          oscClick.frequency.setValueAtTime(isAccent ? 1400 : 1050, t);
          oscClick.frequency.exponentialRampToValueAtTime(450, t + 0.035);

          filterClick.type = 'bandpass';
          filterClick.frequency.setValueAtTime(isAccent ? 1800 : 1350, t);
          filterClick.Q.setValueAtTime(3.5, t);

          gainClick.gain.setValueAtTime(isAccent ? 0.75 : 0.55, t);
          gainClick.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

          oscClick.connect(filterClick);
          filterClick.connect(gainClick);
          gainClick.connect(dest);

          oscClick.start(t);
          oscClick.stop(t + 0.045);
          break;
        }

        case 'kick': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isAccent ? 145 : 115, t);
          osc.frequency.exponentialRampToValueAtTime(38, t + 0.08);
          gain.gain.setValueAtTime(1.1, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.19);
          break;
        }

        case 'cowbell': {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc1.type = 'square';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(isAccent ? 580 : 540, t);
          osc2.frequency.setValueAtTime(isAccent ? 840 : 800, t);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800, t);
          filter.Q.setValueAtTime(6.0, t);

          gain.gain.setValueAtTime(0.65, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 0.11);
          osc2.stop(t + 0.11);
          break;
        }

        case 'digital-beep': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(isAccent ? 1760 : 880, t);
          gain.gain.setValueAtTime(0.6, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.045);
          break;
        }

        case 'woodblock':
        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(isAccent ? 1200 : 950, t);
          filter.Q.setValueAtTime(4.5, t);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(isAccent ? 880 : 660, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);

          gain.gain.setValueAtTime(isAccent ? 0.9 : 0.65, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(t);
          osc.stop(t + 0.065);
          break;
        }
      }
    }

    playSubdivisionTick(time) {
      if (!this.ctx) return;
      const t = Math.max(time, this.ctx.currentTime);
      const dest = this.subdivisionGain || this.masterGain;

      switch (this.subdivisionSound) {
        case 'wood-tap': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1400, t);
          osc.frequency.exponentialRampToValueAtTime(320, t + 0.025);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }

        case 'shaker': {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(4500, t);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          noise.start(t);
          break;
        }

        case 'high-blip': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2600, t);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.02);
          break;
        }

        case 'soft-tick':
        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(2200, t);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1700, t);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }
      }
    }

    playDemoRhythmHit(time) {
      if (!this.ctx) return;
      const t = Math.max(time, this.ctx.currentTime);
      const dest = this.demoGain || this.masterGain;

      switch (this.imitateSound) {
        case 'woodblock': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1100, t);
          filter.Q.setValueAtTime(4.0, t);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(160, t + 0.05);
          gain.gain.setValueAtTime(0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.065);
          break;
        }

        case 'marimba': {
          const osc = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, t); // C5
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1569.75, t); // C5 overtone
          gain.gain.setValueAtTime(0.85, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc2.start(t);
          osc.stop(t + 0.13);
          osc2.stop(t + 0.13);
          break;
        }

        case 'bongo': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(450, t);
          osc.frequency.exponentialRampToValueAtTime(170, t + 0.06);
          gain.gain.setValueAtTime(0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.075);
          break;
        }

        case 'clave': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2450, t);
          filter.Q.setValueAtTime(12.0, t);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2450, t);
          gain.gain.setValueAtTime(0.85, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }

        case 'cowbell': {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();
          osc1.type = 'square';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(560, t);
          osc2.frequency.setValueAtTime(820, t);
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800, t);
          filter.Q.setValueAtTime(5.0, t);
          gain.gain.setValueAtTime(0.7, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + 0.1);
          osc2.stop(t + 0.1);
          break;
        }

        case 'rimshot': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.02);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2100, t);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);
          gain.gain.setValueAtTime(0.85, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
          noise.connect(filter);
          filter.connect(gain);
          osc.connect(gain);
          gain.connect(dest);
          noise.start(t);
          osc.start(t);
          osc.stop(t + 0.055);
          break;
        }

        case 'handclap': {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, t);
          filter.Q.setValueAtTime(1.8, t);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          noise.start(t);
          break;
        }

        case 'synth-blip':
        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(480, t);
          osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);
          gain.gain.setValueAtTime(0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }
      }
    }

    playUserTap() {
      this.ensureRunning();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const dest = this.tapGain || this.masterGain;

      switch (this.tapSound) {
        case 'bongo': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
          gain.gain.setValueAtTime(0.95, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.075);
          break;
        }

        case 'snare-side': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, t);
          osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);

          const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1800, t);

          gain.gain.setValueAtTime(0.9, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

          noise.connect(filter);
          filter.connect(gain);
          osc.connect(gain);
          gain.connect(dest);

          noise.start(t);
          osc.start(t);
          osc.stop(t + 0.065);
          break;
        }

        case 'hihat': {
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.025);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(7000, t);
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.85, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(dest);
          noise.start(t);
          break;
        }

        case 'wood-rim':
        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(2600, t);
          noiseFilter.Q.setValueAtTime(3.0, t);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(720, t);
          osc.frequency.exponentialRampToValueAtTime(160, t + 0.07);

          gain.gain.setValueAtTime(0.95, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

          noise.connect(noiseFilter);
          noiseFilter.connect(gain);
          osc.connect(gain);
          gain.connect(dest);

          noise.start(t);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }
      }
    }
  }

  const audioEngine = new AudioEngine();

  /* ==========================================================================
     3. HAND RENDERER (Strict Left-to-Right 1->2->3->4 Finger Mapping)
     ========================================================================== */
  class HandRenderer {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.labelMode = 'solfege';
      this.divisionMode = 'binary';
      this.handViewMode = 'two';
      this.currentMask1 = "1000";
      this.currentMask2 = "1000";
      this.onFingerClick = null;

      if (this.container) {
        this.container.addEventListener('click', (e) => {
          const fingerGroup = e.target.closest('.finger-container');
          if (!fingerGroup) return;
          const side = fingerGroup.getAttribute('data-side');
          const fingerId = parseInt(fingerGroup.getAttribute('data-finger-id'), 10);
          if (this.onFingerClick && side && fingerId) {
            this.onFingerClick(side, fingerId);
          }
        });
      }
    }

    setSettings(divisionMode, handViewMode, labelMode) {
      this.divisionMode = divisionMode;
      this.handViewMode = handViewMode;
      this.labelMode = labelMode;
      this.render();
      this.applySigns(this.currentMask1, this.currentMask2);
    }

    setLabelMode(labelMode) {
      this.labelMode = labelMode;
      this.updateLabels();
    }

    createHandSvg(side) {
      const isLeft = side === 'left';
      const svgId = `hand-svg-${side}`;

      // Left-to-Right: Index (1) at x=82 -> Middle (2) at x=136 -> Ring (3) at x=190 -> Pinky (4) at x=242
      const fingerDefs = [
        { id: 1, name: 'index',  x: 82,  width: 33, len: 165 },
        { id: 2, name: 'middle', x: 136, width: 35, len: 185 },
        { id: 3, name: 'ring',   x: 190, width: 32, len: 170 },
        { id: 4, name: 'pinky',  x: 242, width: 28, len: 140 }
      ];

      const thumbSvg = isLeft 
        ? `<g class="tucked-thumb tucked-thumb-left">
             <path d="M 64 275 C 56 275, 48 296, 48 335 C 48 365, 58 382, 68 382 C 72 382, 74 360, 74 320 C 74 285, 70 275, 64 275 Z" 
                   fill="url(#skin-dark)" stroke="#8d5b4c" stroke-width="1.8"/>
             <ellipse cx="58" cy="330" rx="2.5" ry="14" fill="rgba(60, 25, 18, 0.35)"/>
           </g>`
        : `<g class="tucked-thumb tucked-thumb-right">
             <path d="M 260 275 C 268 275, 276 296, 276 335 C 276 365, 266 382, 256 382 C 252 382, 250 360, 250 320 C 250 285, 254 275, 260 275 Z" 
                   fill="url(#skin-dark)" stroke="#8d5b4c" stroke-width="1.8"/>
             <ellipse cx="266" cy="330" rx="2.5" ry="14" fill="rgba(60, 25, 18, 0.35)"/>
           </g>`;

      let fingersHtml = '';
      fingerDefs.forEach(f => {
        const pLen = f.len * 0.44;
        const mLen = f.len * 0.32;
        const baseY = 258;
        const hw = f.width / 2;
        const roundRadius = hw - 2;

        fingersHtml += `
          <g class="finger-container finger-slot-${f.id}" data-finger-id="${f.id}" data-side="${side}">
            <ellipse cx="${f.x}" cy="${baseY + 4}" rx="${hw + 3}" ry="9" class="knuckle-shadow" fill="transparent" opacity="0"/>

            <g class="phalanx-group proximal-joint" style="transform-origin: ${f.x}px ${baseY}px;">
              <path class="folded-knuckle-dome" 
                    d="M ${f.x - hw + 1} ${baseY - pLen + 4} 
                       C ${f.x - hw + 1} ${baseY - pLen - roundRadius}, ${f.x + hw - 1} ${baseY - pLen - roundRadius}, ${f.x + hw - 1} ${baseY - pLen + 4} Z" 
                    fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.6"/>

              <path class="phalanx-body" 
                    d="M ${f.x - hw} ${baseY} 
                       L ${f.x - hw + 1} ${baseY - pLen} 
                       L ${f.x + hw - 1} ${baseY - pLen} 
                       L ${f.x + hw} ${baseY} Z" 
                    fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>
              
              <line x1="${f.x - hw + 4}" y1="${baseY - 4}" x2="${f.x + hw - 4}" y2="${baseY - 4}" 
                    stroke="#78473a" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
              <line x1="${f.x - hw + 6}" y1="${baseY - pLen + 4}" x2="${f.x + hw - 6}" y2="${baseY - pLen + 4}" 
                    stroke="#78473a" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>

              <g class="phalanx-group middle-joint" style="transform-origin: ${f.x}px ${baseY - pLen}px;">
                <path class="phalanx-body" 
                      d="M ${f.x - hw + 1} ${baseY - pLen} 
                         L ${f.x - hw + 2} ${baseY - pLen - mLen} 
                         L ${f.x + hw - 2} ${baseY - pLen - mLen} 
                         L ${f.x + hw - 1} ${baseY - pLen} Z" 
                      fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>

                <line x1="${f.x - hw + 5}" y1="${baseY - pLen - mLen + 4}" x2="${f.x + hw - 5}" y2="${baseY - pLen - mLen + 4}" 
                      stroke="#78473a" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>

                <g class="phalanx-group distal-joint" style="transform-origin: ${f.x}px ${baseY - pLen - mLen}px;">
                  <path class="phalanx-body" 
                        d="M ${f.x - hw + 2} ${baseY - pLen - mLen} 
                           C ${f.x - hw + 1} ${baseY - f.len + 16}, ${f.x - hw + 3} ${baseY - f.len + 3}, ${f.x} ${baseY - f.len} 
                           C ${f.x + hw - 3} ${baseY - f.len + 3}, ${f.x + hw - 1} ${baseY - f.len + 16}, ${f.x + hw - 2} ${baseY - pLen - mLen} Z" 
                        fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>

                  <path class="fingernail-path" 
                        d="M ${f.x - hw + 5} ${baseY - f.len + 22} 
                           C ${f.x - hw + 5} ${baseY - f.len + 8}, ${f.x - hw + 7} ${baseY - f.len + 2}, ${f.x} ${baseY - f.len + 1} 
                           C ${f.x + hw - 7} ${baseY - f.len + 2}, ${f.x + hw - 5} ${baseY - f.len + 8}, ${f.x + hw - 5} ${baseY - f.len + 22} 
                           C ${f.x + hw - 8} ${baseY - f.len + 23}, ${f.x - hw + 8} ${baseY - f.len + 23}, ${f.x - hw + 5} ${baseY - f.len + 22} Z" />
                  
                  <path d="M ${f.x - hw + 6} ${baseY - f.len + 22} Q ${f.x} ${baseY - f.len + 24} ${f.x + hw - 6} ${baseY - f.len + 22}" 
                        stroke="#9b695d" stroke-width="1.4" fill="none" opacity="0.8"/>
                  <ellipse cx="${f.x - 2}" cy="${baseY - f.len + 8}" rx="4.5" ry="2" fill="rgba(255,255,255,0.45)"/>
                </g>
              </g>
            </g>

            <g class="finger-label-wrap" transform="translate(${f.x}, ${baseY + 28})">
              <circle cx="0" cy="0" r="14" class="label-badge-bg"/>
              <text x="0" y="5" text-anchor="middle" class="finger-label-text" data-finger-num="${f.id}">
                ${f.id}
              </text>
            </g>
          </g>
        `;
      });

      const palmPath = isLeft 
        ? `M 64 254 C 68 250, 252 250, 258 260 C 264 275, 260 375, 240 435 C 230 460, 220 480, 215 480 L 105 480 C 100 480, 90 460, 80 435 C 62 375, 58 275, 64 254 Z`
        : `M 66 260 C 72 250, 256 250, 260 254 C 266 275, 262 375, 244 435 C 234 460, 224 480, 219 480 L 109 480 C 104 480, 94 460, 84 435 C 64 375, 60 275, 66 260 Z`;

      return `
        <svg id="${svgId}" class="hand-svg hand-${side}" viewBox="0 0 324 480" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="skin-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#dfa48f"/>
              <stop offset="45%" stop-color="#c98a76"/>
              <stop offset="100%" stop-color="#b0705d"/>
            </linearGradient>

            <linearGradient id="skin-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#af7260"/>
              <stop offset="100%" stop-color="#8a5343"/>
            </linearGradient>

            <linearGradient id="nail-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fae3db"/>
              <stop offset="55%" stop-color="#f0c2b4"/>
              <stop offset="100%" stop-color="#dba294"/>
            </linearGradient>
            
            <filter id="hand-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(0,0,0,0.55)"/>
            </filter>
          </defs>

          <g filter="url(#hand-shadow)">
            ${thumbSvg}
            <g class="palm-group">
              <path d="${palmPath}" fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="2"/>
              <path d="M 85 260 C 95 330, 120 410, 130 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="4" fill="none"/>
              <path d="M 136 260 C 142 330, 150 410, 155 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="5" fill="none"/>
              <path d="M 190 260 C 185 330, 175 410, 175 460" stroke="rgba(240, 190, 175, 0.35)" stroke-width="4" fill="none"/>
              <path d="M 242 260 C 230 330, 205 410, 195 460" stroke="rgba(240, 190, 175, 0.3)" stroke-width="3" fill="none"/>
              <path d="M 115 445 Q 170 455 225 445" stroke="#75473a" stroke-width="1.8" fill="none" opacity="0.5"/>
            </g>

            <g class="fingers-layer">
              ${fingersHtml}
            </g>
          </g>
        </svg>
      `;
    }

    render() {
      if (!this.container) return;
      let html = '';
      if (this.handViewMode === 'left') {
        html = `<div class="hands-stage single-hand-stage">${this.createHandSvg('left')}</div>`;
      } else if (this.handViewMode === 'right') {
        html = `<div class="hands-stage single-hand-stage">${this.createHandSvg('right')}</div>`;
      } else {
        html = `
          <div class="hands-stage dual-hands-stage">
            ${this.createHandSvg('left')}
            ${this.createHandSvg('right')}
          </div>
        `;
      }
      this.container.innerHTML = html;
      this.updateLabels();
    }

    updateLabels() {
      if (!this.container) return;
      const isTernary = this.divisionMode === 'ternary';

      const updateHandLabels = (handEl, side) => {
        if (!handEl) return;
        const isRightHand = side === 'right';

        let fingerLabels = [];
        if (!isTernary) {
          fingerLabels = this.labelMode === 'solfege' ? ['Ta', 'Ka', 'Di', 'Mi']
                       : this.labelMode === 'numbers' ? ['1', '2', '3', '4']
                       : ['', '', '', ''];
        } else {
          if (isRightHand) {
            // Right Hand in Ternary: Slot 1 is unused! Slots 2, 3, 4 are Knuckles 1, 2, 3 (Ta, Ki, Da)
            fingerLabels = this.labelMode === 'solfege' ? ['', 'Ta', 'Ki', 'Da']
                         : this.labelMode === 'numbers' ? ['', '1', '2', '3']
                         : ['', '', '', ''];
          } else {
            // Left Hand in Ternary: Slot 4 is unused (pinky)! Slots 1, 2, 3 are Knuckles 1, 2, 3 (Ta, Ki, Da)
            fingerLabels = this.labelMode === 'solfege' ? ['Ta', 'Ki', 'Da', '']
                         : this.labelMode === 'numbers' ? ['1', '2', '3', '']
                         : ['', '', '', ''];
          }
        }

        for (let f = 1; f <= 4; f++) {
          const slot = handEl.querySelector(`.finger-slot-${f}`);
          if (!slot) continue;
          const textEl = slot.querySelector('.finger-label-text');
          const badgeWrap = slot.querySelector('.finger-label-wrap');
          const text = fingerLabels[f - 1] || '';
          if (textEl) textEl.textContent = text;
          if (badgeWrap) {
            if (!text || this.labelMode === 'hidden') {
              badgeWrap.classList.add('hidden');
            } else {
              badgeWrap.classList.remove('hidden');
            }
          }
        }
      };

      const leftHand = this.container.querySelector('.hand-left');
      const rightHand = this.container.querySelector('.hand-right');
      if (leftHand) updateHandLabels(leftHand, 'left');
      if (rightHand) updateHandLabels(rightHand, 'right');
    }

    applySigns(mask1, mask2) {
      this.currentMask1 = mask1;
      this.currentMask2 = mask2 || mask1;
      const isTernary = this.divisionMode === 'ternary';
      if (!this.container) return;

      const applyToHand = (side, mask) => {
        const handEl = this.container.querySelector(`.hand-${side}`);
        if (!handEl) return;
        const isRightHand = side === 'right';

        for (let f = 1; f <= 4; f++) {
          let isExtended = false;
          let isDisabled = false;
          if (isTernary) {
            if (isRightHand) {
              // Right hand in ternary: slot 1 is unused (always curled)
              // slot 2 is Knuckle 1, slot 3 is Knuckle 2, slot 4 is Knuckle 3
              if (f === 1) {
                isExtended = false;
                isDisabled = true;
              } else {
                isExtended = mask.charAt(f - 2) === '1';
              }
            } else {
              // Left hand in ternary: slot 4 is unused (pinky, always curled)
              // slot 1 is Knuckle 1, slot 2 is Knuckle 2, slot 3 is Knuckle 3
              if (f === 4) {
                isExtended = false;
                isDisabled = true;
              } else {
                isExtended = mask.charAt(f - 1) === '1';
              }
            }
          } else {
            isExtended = mask.charAt(f - 1) === '1';
          }

          const fingerContainer = handEl.querySelector(`.finger-slot-${f}`);
          if (fingerContainer) {
            if (isDisabled) {
              fingerContainer.classList.add('finger-disabled');
            } else {
              fingerContainer.classList.remove('finger-disabled');
            }
            if (isExtended) {
              fingerContainer.classList.remove('finger-curled');
              fingerContainer.classList.add('finger-extended');
            } else {
              fingerContainer.classList.remove('finger-extended');
              fingerContainer.classList.add('finger-curled');
            }
          }
        }
      };

      if (this.handViewMode === 'left') {
        applyToHand('left', this.currentMask1);
      } else if (this.handViewMode === 'right') {
        applyToHand('right', this.currentMask1);
      } else {
        applyToHand('left', this.currentMask1);
        applyToHand('right', this.currentMask2);
      }
    }

    getKnucklePositions() {
      if (!this.container) return { hand1: [], hand2: [] };
      const isTernary = this.divisionMode === 'ternary';

      const getForHand = (side) => {
        const handEl = this.container.querySelector(`.hand-${side}`);
        if (!handEl) return [];
        const isRightHand = side === 'right';

        let fingerSlots = [];
        if (!isTernary) {
          fingerSlots = [1, 2, 3, 4];
        } else {
          // In ternary:
          // Left hand: slots 1, 2, 3 (slot 4 is unused pinky)
          // Right hand: slots 2, 3, 4 (slot 1 is unused knuckle)
          fingerSlots = isRightHand ? [2, 3, 4] : [1, 2, 3];
        }

        const res = [];
        fingerSlots.forEach((f, idx) => {
          const slot = handEl.querySelector(`.finger-slot-${f} .knuckle-shadow`);
          if (slot) {
            const rect = slot.getBoundingClientRect();
            res.push({
              fingerId: f,
              subdivisionIndex: idx,
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2
            });
          }
        });
        return res;
      };

      if (this.handViewMode === 'left') {
        return { hand1: getForHand('left'), hand2: [] };
      } else if (this.handViewMode === 'right') {
        return { hand1: getForHand('right'), hand2: [] };
      } else {
        return {
          hand1: getForHand('left'),
          hand2: getForHand('right')
        };
      }
    }
  }

  /* ==========================================================================
     4. RHYTHM ENGINE (Deterministic Cycle Architecture - ZERO Audio/Visual Desync)
     ========================================================================== */
  class RhythmEngine {
    constructor(handRenderer, onStateChange, onEvaluation) {
      this.handRenderer = handRenderer;
      this.onStateChange = onStateChange;
      this.onEvaluation = onEvaluation;

      this.mode = 'imitate'; // 'imitate' or 'continuous'
      this.bpm = 70;
      this.handViewMode = 'two';
      this.divisionMode = 'binary';
      this.level = 1;
      this.customPlaylist = [];
      this.customPlaylistIndex = 0;
      this.isShuffleOn = false;
      this.isSubdivisionOn = false;
      this.metronomeSubdivision = localStorage.getItem('rcs_metronome_subdivision') || 'quarter';
      this.hearRhythmFirst = localStorage.getItem('rcs_hear_rhythm_first') !== 'false';
      this.isPracticeMode = localStorage.getItem('rcs_practice_mode') === 'true';
      this.repeatOnError = this.isPracticeMode;
      this.forceReshuffle = false;

      this.thresholdPerfectMs = 45;
      this.thresholdMaxMs = 85;

      // Normal Mode 10-Hand Exercise tracking
      this.handCountGoal = 10;
      this.completedHandsCount = 0;
      this.exerciseResults = [];
      this.isCountingDown = false;
      this.onCountdown = null;
      this.onExerciseComplete = null;

      // Real-time hardware audio latency compensation (ms)
      const savedLatency = localStorage.getItem('rcs_latency_offset');
      this.latencyOffsetMs = savedLatency !== null ? parseInt(savedLatency, 10) : 0;

      this.isRunning = false;
      this.timerId = null;

      // Audio scheduler tracking
      this.nextBeatTime = 0;
      this.scheduledBeatCount = 0;

      // Cycle-level state dictionary: cycleIndex -> { sign1, sign2 }
      this.cycles = new Map();

      // Tap analysis buffer for active imitate pass
      this.activeCycleIndex = 0;
      this.activePassNumber = 1; // 1 = Demo, 2 = Imitate
      this.activePassStartTime = 0;
      this.expectedTargetSlots = new Set();
      this.perfectTargetSlots = new Set();
      this.measureErrors = new Set();
      this.hasError = false;

      // Conductor activation & beat pulse gesture settings
      this.conductorGestureAuto = localStorage.getItem('rcs_conductor_auto') !== 'false';
      this.conductorLiftHeight = parseInt(localStorage.getItem('rcs_conductor_lift') || '60', 10);
      this.conductorPulseLiftHeight = parseInt(localStorage.getItem('rcs_conductor_pulse_lift') || '6', 10);
      this.conductorPulseAuto = localStorage.getItem('rcs_conductor_pulse_auto') !== 'false';
      this.conductorPulseFastStyle = parseInt(localStorage.getItem('rcs_conductor_pulse_fast_style') || '1', 10); // 1..7
      this.conductorPulseStyle = parseInt(localStorage.getItem('rcs_conductor_pulse_style') || '1', 10); // 1..6 distinct pulse animation styles
      this.conductorTernaryProposal = parseInt(localStorage.getItem('rcs_conductor_ternary_proposal') || '3', 10); // 1..5 rebound tweak variations
      this.conductorBpmCutoff = parseInt(localStorage.getItem('rcs_conductor_cutoff') || '100', 10);
      this.fingerTransitionSubSlow = parseFloat(localStorage.getItem('rcs_finger_transition_sub_slow') || '0.25'); // 3rd subdivision (0-indexed: 2.0 = Di / Da)
      this.fingerTransitionSubFast = parseFloat(localStorage.getItem('rcs_finger_transition_sub_fast') || '0.25'); // 1st subdivision (0-indexed: 0.0 = Ta)
      this.onConductorGesture = null;
      this.onConductorCancel = null;
    }

    setSettings(settings) {
      if (settings.fingerTransitionSubSlow !== undefined) {
        this.fingerTransitionSubSlow = settings.fingerTransitionSubSlow;
      }
      if (settings.fingerTransitionSubFast !== undefined) {
        this.fingerTransitionSubFast = settings.fingerTransitionSubFast;
      }
      if (settings.mode !== undefined && settings.mode !== this.mode) {
        this.mode = settings.mode;
        this.forceReshuffle = true;
        if (this.isRunning) {
          this.stop();
          this.start();
        }
      }
      if (settings.bpm !== undefined) this.bpm = settings.bpm;
      if (settings.handViewMode !== undefined && settings.handViewMode !== this.handViewMode) {
        this.handViewMode = settings.handViewMode;
        this.forceReshuffle = true;
      }
      if (settings.divisionMode !== undefined && settings.divisionMode !== this.divisionMode) {
        this.divisionMode = settings.divisionMode;
        this.forceReshuffle = true;
      }
      if (settings.level !== undefined && settings.level !== this.level) {
        this.level = settings.level;
        this.forceReshuffle = true;
      }
      if (settings.customPlaylist !== undefined) {
        this.customPlaylist = settings.customPlaylist;
      }
      if (settings.isShuffleOn !== undefined) {
        this.isShuffleOn = settings.isShuffleOn;
      }
      if (settings.latencyOffsetMs !== undefined) {
        this.latencyOffsetMs = settings.latencyOffsetMs;
      }
      if (settings.isSubdivisionOn !== undefined) {
        this.isSubdivisionOn = settings.isSubdivisionOn;
        audioEngine.setSubdivisionEnabled(this.isSubdivisionOn);
      }
      if (settings.metronomeSubdivision !== undefined) {
        this.metronomeSubdivision = settings.metronomeSubdivision;
      }
      if (settings.hearRhythmFirst !== undefined) {
        this.hearRhythmFirst = !!settings.hearRhythmFirst;
        audioEngine.setHearRhythmEnabled(this.hearRhythmFirst);
      }
      if (settings.isPracticeMode !== undefined) {
        this.isPracticeMode = !!settings.isPracticeMode;
        this.repeatOnError = this.isPracticeMode;
      }
      if (settings.repeatOnError !== undefined) this.repeatOnError = settings.repeatOnError;
    }

    getNextSigns() {
      if (this.level === 'custom') {
        const fallback1 = this.divisionMode === 'ternary' ? "100" : "1000";
        const fallback2 = this.divisionMode === 'ternary' ? "100" : "1000";
        if (!this.customPlaylist || this.customPlaylist.length === 0) {
          return { sign1: fallback1, sign2: fallback2, id: null };
        }
        let pattern;
        if (this.isShuffleOn) {
          const randIdx = Math.floor(Math.random() * this.customPlaylist.length);
          pattern = this.customPlaylist[randIdx];
        } else {
          if (this.customPlaylistIndex >= this.customPlaylist.length) {
            this.customPlaylistIndex = 0;
          }
          pattern = this.customPlaylist[this.customPlaylistIndex];
          this.customPlaylistIndex = (this.customPlaylistIndex + 1) % this.customPlaylist.length;
        }
        return {
          sign1: pattern.sign1 || fallback1,
          sign2: this.isTwoHands ? (pattern.sign2 || pattern.sign1 || fallback2) : (pattern.sign1 || fallback1),
          id: pattern.id
        };
      } else {
        const sign1 = getRandomSign(this.divisionMode, this.level);
        const sign2 = this.isTwoHands ? getRandomSign(this.divisionMode, this.level) : sign1;
        return { sign1, sign2, id: null };
      }
    }

    get isTwoHands() {
      return this.handViewMode === 'two';
    }

    get beatsPerPass() {
      return this.isTwoHands ? 2 : 1;
    }

    get beatsPerCycle() {
      if (this.mode === 'continuous') {
        return this.beatsPerPass;
      }
      return 2 * this.beatsPerPass; // Pass 1 (Demo) + Pass 2 (Imitate)
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
      this.cycles.clear();
      this.forceReshuffle = false;

      this.expectedTargetSlots.clear();
      this.perfectTargetSlots.clear();
      this.measureErrors.clear();
      this.hasError = false;

      this.customPlaylistIndex = 0;
      this.completedHandsCount = 0;
      this.exerciseResults = [];

      const initial = this.getNextSigns();
      this.cycles.set(0, { sign1: initial.sign1, sign2: initial.sign2, patternId: initial.id });
      this.handRenderer.applySigns(initial.sign1, initial.sign2);
      this.prepareExpectedTargets(initial, 0);

      // In continuous mode, pre-generate cycle 1 immediately so lookahead finger transition is ready
      if (this.mode === 'continuous') {
        if (!this.isPracticeMode) {
          const next1 = this.getNextSigns();
          this.cycles.set(1, { sign1: next1.sign1, sign2: next1.sign2, patternId: next1.id });
        } else {
          // In practice mode, cycle 1 starts as a repeat of cycle 0 until cycle 0 is played properly
          this.cycles.set(1, { sign1: initial.sign1, sign2: initial.sign2, patternId: initial.id });
        }
      }

      const startTime = audioEngine.getCurrentTime() + 0.08;
      const beatSec = this.secondsPerBeat;

      if (!this.isPracticeMode) {
        // Normal function: 2-beat countdown ("1", then "2" across screen)
        this.isCountingDown = true;
        this.scheduledBeatCount = -2;
        this.sessionStartTime = startTime + 2 * beatSec;
        this.nextBeatTime = startTime;
      } else {
        this.isCountingDown = false;
        this.scheduledBeatCount = 0;
        this.sessionStartTime = startTime;
        this.nextBeatTime = startTime;
      }

      this.activePassStartTime = this.sessionStartTime;
      this.activePassNumber = this.mode === 'continuous' ? 2 : 1;
      this.activeCycleIndex = 0;

      this.runScheduler();
    }

    stop() {
      this.isRunning = false;
      this.isCountingDown = false;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.onConductorCancel) {
        this.onConductorCancel();
      }
    }

    // Precision Lookahead Scheduler
    runScheduler() {
      if (!this.isRunning) return;

      const currentTime = audioEngine.getCurrentTime();
      while (this.nextBeatTime < currentTime + audioEngine.scheduleAheadTime) {
        const globalBeat = this.scheduledBeatCount;

        // COUNTDOWN PHASE (beats -2 and -1 in Normal Mode)
        if (globalBeat < 0) {
          const countVal = (globalBeat === -2) ? 1 : 2;
          audioEngine.playMetronomeClick(this.nextBeatTime, countVal === 1);

          const timeUntilBeat = Math.max(0, (this.nextBeatTime - audioEngine.getCurrentTime()) * 1000);
          setTimeout(() => {
            if (!this.isRunning) return;
            if (this.onCountdown) {
              this.onCountdown(countVal);
            }
          }, timeUntilBeat);

          // Activation gesture on the preparatory beat right before exercise starts (beat -1, count 2)
          if (globalBeat === -1 && this.conductorGestureAuto) {
            const beatDurationMs = this.secondsPerBeat * 1000;
            setTimeout(() => {
              if (!this.isRunning) return;
              if (this.onConductorGesture) {
                this.onConductorGesture(beatDurationMs, 'activation', this.conductorLiftHeight);
              }
            }, timeUntilBeat);
          }

          this.nextBeatTime += this.secondsPerBeat;
          this.scheduledBeatCount++;
          continue;
        }

        // When globalBeat reaches 0, dismiss countdown overlay
        if (this.isCountingDown && globalBeat === 0) {
          this.isCountingDown = false;
          const timeUntilBeat = Math.max(0, (this.nextBeatTime - audioEngine.getCurrentTime()) * 1000);
          setTimeout(() => {
            if (!this.isRunning) return;
            if (this.onCountdown) {
              this.onCountdown(null);
            }
            this.isCountingDown = false;
          }, timeUntilBeat);
        }

        const beatsInCycle = this.beatsPerCycle;
        const cycleIdx = Math.floor(globalBeat / beatsInCycle);
        const beatInCycle = globalBeat % beatsInCycle;

        if (this.mode === 'continuous') {
          // Continuous Sight-Reading Mode: 1 cycle = 1 measure
          if (!this.isPracticeMode && globalBeat >= this.handCountGoal * beatsInCycle) {
            // All 10 hands have been scheduled!
            // Wait until the final measure (Hand 10, index 9) finishes playing in real time:
            const finalEndTime = this.sessionStartTime + this.handCountGoal * (beatsInCycle * this.secondsPerBeat);
            const timeUntilEnd = Math.max(0, (finalEndTime - audioEngine.getCurrentTime()) * 1000);
            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'continuous') return;
              const lastMeasure = this.handCountGoal - 1;
              if (!this.exerciseResults.some(r => r.handIndex === lastMeasure + 1)) {
                this.exerciseResults.push(this.evaluateContinuousMeasure(lastMeasure));
              }
              const allCurled = this.divisionMode === 'ternary' ? '000' : '0000';
              this.handRenderer.applySigns(allCurled, allCurled);
              this.stop();
              if (this.onExerciseComplete) {
                this.onExerciseComplete({
                  total: this.handCountGoal,
                  correct: this.exerciseResults.filter(r => r.success).length,
                  details: [...this.exerciseResults]
                });
              }
            }, timeUntilEnd);
            return;
          }

          if (!this.cycles.has(cycleIdx)) {
            if (this.isPracticeMode && cycleIdx > 0) {
              const prev = this.cycles.get(cycleIdx - 1);
              this.cycles.set(cycleIdx, { sign1: prev.sign1, sign2: prev.sign2, patternId: prev.patternId });
            } else {
              const next = this.getNextSigns();
              this.cycles.set(cycleIdx, { sign1: next.sign1, sign2: next.sign2, patternId: next.id });
            }
          }
          if (!this.cycles.has(cycleIdx + 1)) {
            if (this.isPracticeMode) {
              const cur = this.cycles.get(cycleIdx);
              this.cycles.set(cycleIdx + 1, { sign1: cur.sign1, sign2: cur.sign2, patternId: cur.patternId });
            } else {
              this.forceReshuffle = false;
              const nextLookahead = this.getNextSigns();
              this.cycles.set(cycleIdx + 1, {
                sign1: nextLookahead.sign1,
                sign2: nextLookahead.sign2,
                patternId: nextLookahead.id
              });
            }
          }

          const passType = 2; // Continuous play (no demo)
          const beatIndexInPass = beatInCycle;
          const cycleSigns = this.cycles.get(cycleIdx);
          this.scheduleSingleBeat(this.nextBeatTime, beatIndexInPass, passType, cycleIdx, cycleSigns);

          this.nextBeatTime += this.secondsPerBeat;
          this.scheduledBeatCount++;
        } else {
          // Imitate Mode (Demo + Imitate passes)
          // Transition to a brand new cycle (cycleIdx > 0 and beatInCycle === 0)
          if (beatInCycle === 0 && globalBeat > 0 && !this.cycles.has(cycleIdx)) {
            // VICTORY CONDITION:
            // All active knuckles on all hands must be perfect (within 45ms).
            // Zero wrong taps, zero duplicate taps, zero missed notes, zero imperfect (orange) taps.
            const prevCycle = cycleIdx - 1;
            const prevSigns = this.cycles.get(prevCycle);
            const hadError = this.measureErrors.has(prevCycle);
            let allPerfect = true;
            let expectedCount = 0;
            for (const slot of this.expectedTargetSlots) {
              if (slot.startsWith(`${prevCycle}_`)) {
                expectedCount++;
                if (!this.perfectTargetSlots.has(slot)) {
                  allPerfect = false;
                }
              }
            }
            const prevSucceeded = !hadError && (expectedCount > 0 ? allPerfect : true);

            if (!this.isPracticeMode) {
              this.exerciseResults.push({
                handIndex: cycleIdx,
                success: prevSucceeded
              });

              if (cycleIdx >= this.handCountGoal) {
                const timeUntilEnd = Math.max(0, (this.nextBeatTime - audioEngine.getCurrentTime()) * 1000);
                setTimeout(() => {
                  if (!this.isRunning) return;
                  const allCurled = this.divisionMode === 'ternary' ? '000' : '0000';
                  this.handRenderer.applySigns(allCurled, allCurled);
                  this.stop();
                  if (this.onExerciseComplete) {
                    this.onExerciseComplete({
                      total: this.handCountGoal,
                      correct: this.exerciseResults.filter(r => r.success).length,
                      details: [...this.exerciseResults]
                    });
                  }
                }, timeUntilEnd);
                return;
              }

              this.forceReshuffle = false;
              const next = this.getNextSigns();
              this.cycles.set(cycleIdx, {
                sign1: next.sign1,
                sign2: next.sign2,
                patternId: next.id
              });
            } else {
              // Practice mode: repeat on error
              if (!this.forceReshuffle && this.repeatOnError && !prevSucceeded && prevSigns) {
                // Keep the EXACT SAME signs as previous cycle!
                this.cycles.set(cycleIdx, {
                  sign1: prevSigns.sign1,
                  sign2: prevSigns.sign2,
                  patternId: prevSigns.patternId
                });
              } else {
                this.forceReshuffle = false;
                const next = this.getNextSigns();
                this.cycles.set(cycleIdx, {
                  sign1: next.sign1,
                  sign2: next.sign2,
                  patternId: next.id
                });
              }
            }
          }

          const isDemo = beatInCycle < this.beatsPerPass;
          const passType = isDemo ? 1 : 2;
          const beatIndexInPass = beatInCycle % this.beatsPerPass; // 0 (Beat 1) or 1 (Beat 2)

          const cycleSigns = this.cycles.get(cycleIdx);
          this.scheduleSingleBeat(this.nextBeatTime, beatIndexInPass, passType, cycleIdx, cycleSigns);
          
          this.nextBeatTime += this.secondsPerBeat;
          this.scheduledBeatCount++;
        }
      }

      this.timerId = setTimeout(() => this.runScheduler(), audioEngine.lookaheadMs);
    }

    scheduleSingleBeat(beatTime, beatIndex, passType, cycleIdx, cycleSigns) {
      const subsPerBeat = this.subdivisionsPerBeat;
      const subDuration = this.secondsPerSubdivision;

      // Beat 0 = Hand 1 (sign1), Beat 1 = Hand 2 (sign2)
      const activeSign = (this.isTwoHands && beatIndex === 1) ? cycleSigns.sign2 : cycleSigns.sign1;

      // 1. Metronome Quarter Note
      audioEngine.playMetronomeClick(beatTime, beatIndex === 0);

      // 2. Subdivisions: Metronome selection & Demo audio
      for (let s = 0; s < subsPerBeat; s++) {
        const subTime = beatTime + s * subDuration;
        const isTargetSub = activeSign.charAt(s) === '1';

        // Metronome subdivision clicks (s > 0)
        if (s > 0) {
          let shouldClick = false;
          if (subsPerBeat === 4) {
            // Binary mode:
            // Option 1 ('quarter'): beat only -> shouldClick = false
            // Option 2 ('eighth'): beat + Di subdivision -> shouldClick on s === 2
            // Option 3 ('sixteenth'): beat + each 16th note -> shouldClick on s = 1, 2, 3
            if (this.metronomeSubdivision === 'eighth' && s === 2) {
              shouldClick = true;
            } else if (this.metronomeSubdivision === 'sixteenth') {
              shouldClick = true;
            }
          } else {
            // Ternary mode (subsPerBeat === 3):
            // Option 1 ('quarter'): beat only -> shouldClick = false
            // Option 2 ('ternary-all', or carried 'sixteenth'/'eighth'): 3 8th notes tied -> shouldClick on s = 1 (Ki) and s = 2 (Da)
            if (this.metronomeSubdivision === 'ternary-all' || this.metronomeSubdivision === 'sixteenth' || this.metronomeSubdivision === 'eighth') {
              shouldClick = true;
            }
          }
          if (shouldClick) {
            audioEngine.playSubdivisionTick(subTime);
          }
        }

        // Pass 1: Demo Audio (Locked directly to cycleSigns, only if hearRhythmFirst is true)
        if (passType === 1 && isTargetSub && this.hearRhythmFirst) {
          audioEngine.playDemoRhythmHit(subTime);
        }
      }

      if (this.mode === 'continuous') {
        // CONTINUOUS MODE:
        // On final beat of this measure (Beat 2 in two-hands, Beat 1 in one-hand):
        if (beatIndex === this.beatsPerPass - 1) {
          const cutoff = this.conductorBpmCutoff || 100;
          const isSlow = this.bpm < cutoff;
          // Configurable transition timing in subdivisions (0-indexed: 0 = Ta, 1 = Ka/Ki, 2 = Di/Da, 3 = Mi)
          const chosenSub = isSlow 
            ? (this.fingerTransitionSubSlow !== undefined ? this.fingerTransitionSubSlow : 0.25)
            : (this.fingerTransitionSubFast !== undefined ? this.fingerTransitionSubFast : 0.25);
          
          let transitionOffsetSec = 0;
          if (this.isTwoHands) {
            // In two-hands view, transition occurs on Beat 2 at the chosen subdivision offset
            transitionOffsetSec = Math.max(0, Math.min(subsPerBeat - 0.1, chosenSub)) * subDuration;
          } else {
            // Single-hand view (1 beat measure):
            const maxSub = subsPerBeat - 0.1;
            transitionOffsetSec = Math.max(0, Math.min(maxSub, chosenSub)) * subDuration;
          }

          const fingerChangeTime = beatTime + transitionOffsetSec;
          const timeUntilFingerChange = Math.max(0, (fingerChangeTime - audioEngine.getCurrentTime()) * 1000);

          const isLastMeasureOfNormalExercise = !this.isPracticeMode && (cycleIdx === this.handCountGoal - 1);
          const nextCycleSigns = this.cycles.get(cycleIdx + 1);

          if (isLastMeasureOfNormalExercise) {
            // At the end of Measure 10, both hands always curl all fingers and do not activate
            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'continuous') return;
              const allCurled = this.divisionMode === 'ternary' ? '000' : '0000';
              this.handRenderer.applySigns(allCurled, allCurled);
            }, timeUntilFingerChange);
          } else {
            if (nextCycleSigns) {
              setTimeout(() => {
                if (!this.isRunning || this.mode !== 'continuous') return;
                // Transition visual fingers to next measure's gesture (in Normal mode only)
                if (!this.isPracticeMode) {
                  this.handRenderer.applySigns(nextCycleSigns.sign1, nextCycleSigns.sign2);
                }
              }, timeUntilFingerChange);
            }

            // Conductor Activation Vertical Gesture on final beat leading into next measure downbeat
            if (this.conductorGestureAuto) {
              const beatDurationMs = this.secondsPerBeat * 1000;
              const timeUntilGesture = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
              setTimeout(() => {
                if (!this.isRunning || this.mode !== 'continuous') return;
                if (this.onConductorGesture) {
                  this.onConductorGesture(beatDurationMs, 'activation', this.conductorLiftHeight);
                }
              }, timeUntilGesture);
            }

            // Pre-arm expected targets for next measure
            const nextMeasureStart = beatTime + this.secondsPerBeat;
            const earlyOpenTime = nextMeasureStart - (0.5 * subDuration);
            const timeUntilEarlyOpen = Math.max(0, (earlyOpenTime - audioEngine.getCurrentTime()) * 1000);
            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'continuous') return;
              if (this.isPracticeMode) {
                // In Practice Mode: Evaluate whether cycleIdx was played properly!
                const evalResult = this.evaluateContinuousMeasure(cycleIdx);
                const prevSigns = this.cycles.get(cycleIdx);
                let targetSigns;

                if (!this.forceReshuffle && this.repeatOnError && !evalResult.success && prevSigns) {
                  // FAILED: Do NOT move to next set of hands! Repeat cycleIdx!
                  targetSigns = {
                    sign1: prevSigns.sign1,
                    sign2: prevSigns.sign2,
                    patternId: prevSigns.patternId
                  };
                } else {
                  // PLAYED PROPERLY: Move to next set of hands!
                  this.forceReshuffle = false;
                  const next = this.getNextSigns();
                  targetSigns = {
                    sign1: next.sign1,
                    sign2: next.sign2,
                    patternId: next.id
                  };
                }

                this.cycles.set(cycleIdx + 1, targetSigns);
                this.handRenderer.applySigns(targetSigns.sign1, targetSigns.sign2);
                this.prepareExpectedTargets(targetSigns, cycleIdx + 1);
              } else {
                if (nextCycleSigns) {
                  this.prepareExpectedTargets(nextCycleSigns, cycleIdx + 1);
                }
              }
            }, timeUntilEarlyOpen);
          }
        } else {
          // Regular beat in continuous mode: pulse gesture if enabled
          if (this.conductorPulseAuto) {
            const beatDurationMs = this.secondsPerBeat * 1000;
            const timeUntilGesture = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'continuous') return;
              if (this.onConductorGesture) {
                this.onConductorGesture(beatDurationMs, 'pulse', this.conductorPulseLiftHeight);
              }
            }, timeUntilGesture);
          }
        }
      } else {
        // IMITATE MODE:
        const isActivationBeat = (passType === 1 && beatIndex === this.beatsPerPass - 1);

        if (isActivationBeat) {
          // One subdivision before Pass 2 starts, open the tap window & activate tap button early!
          const pass2Start = beatTime + this.secondsPerBeat;
          const openTime = pass2Start - subDuration;
          const timeUntilOpen = Math.max(0, (openTime - audioEngine.getCurrentTime()) * 1000);
          setTimeout(() => {
            if (!this.isRunning || this.mode !== 'imitate') return;
            this.onImitateWindowOpen(cycleIdx);
          }, timeUntilOpen);

          // Conductor Activation Vertical Gesture on Demo Beat 2 (or final demo beat)
          if (this.conductorGestureAuto) {
            const beatDurationMs = this.secondsPerBeat * 1000;
            const timeUntilGesture = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'imitate') return;
              if (this.onConductorGesture) {
                this.onConductorGesture(beatDurationMs, 'activation', this.conductorLiftHeight);
              }
            }, timeUntilGesture);
          }
        } else {
          // Regular beat in imitate mode:
          // In Pass 2 on the final beat of Measure 10 (eg the last set of hands in normal mode),
          // both hands always curl all fingers and do not activate.
          const isFinalImitateBeat = (passType === 2 && beatIndex === this.beatsPerPass - 1);
          const isLastMeasureOfNormalExercise = !this.isPracticeMode && (cycleIdx === this.handCountGoal - 1);

          if (isFinalImitateBeat && isLastMeasureOfNormalExercise) {
            const cutoff = this.conductorBpmCutoff || 100;
            const isSlow = this.bpm < cutoff;
            const chosenSub = isSlow 
              ? (this.fingerTransitionSubSlow !== undefined ? this.fingerTransitionSubSlow : 0.25)
              : (this.fingerTransitionSubFast !== undefined ? this.fingerTransitionSubFast : 0.25);
            
            let transitionOffsetSec = 0;
            if (this.isTwoHands) {
              transitionOffsetSec = Math.max(0, Math.min(subsPerBeat - 0.1, chosenSub)) * subDuration;
            } else {
              const maxSub = subsPerBeat - 0.1;
              transitionOffsetSec = Math.max(0, Math.min(maxSub, chosenSub)) * subDuration;
            }
            const fingerChangeTime = beatTime + transitionOffsetSec;
            const timeUntilFingerChange = Math.max(0, (fingerChangeTime - audioEngine.getCurrentTime()) * 1000);

            setTimeout(() => {
              if (!this.isRunning || this.mode !== 'imitate') return;
              const allCurled = this.divisionMode === 'ternary' ? '000' : '0000';
              this.handRenderer.applySigns(allCurled, allCurled);
            }, timeUntilFingerChange);
          } else {
            // small pulse gesture
            if (this.conductorPulseAuto) {
              const beatDurationMs = this.secondsPerBeat * 1000;
              const timeUntilGesture = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
              setTimeout(() => {
                if (!this.isRunning || this.mode !== 'imitate') return;
                if (this.onConductorGesture) {
                  this.onConductorGesture(beatDurationMs, 'pulse', this.conductorPulseLiftHeight);
                }
              }, timeUntilGesture);
            }
          }
        }
      }

      // Synchronize visual state at exact wall-clock audio time
      const timeUntilBeat = Math.max(0, (beatTime - audioEngine.getCurrentTime()) * 1000);
      setTimeout(() => {
        if (!this.isRunning) return;

        // Start of a new Pass / Measure:
        if (beatIndex === 0) {
          this.activePassStartTime = beatTime;
          this.activePassNumber = passType;
          this.activeCycleIndex = cycleIdx;

          if (this.mode === 'continuous') {
            const currentSigns = this.cycles.get(cycleIdx) || cycleSigns;
            // Evaluate previous measure at the exact downbeat of the next measure:
            if (cycleIdx > 0 && !this.isPracticeMode) {
              const prevMeasure = cycleIdx - 1;
              if (!this.exerciseResults.some(r => r.handIndex === prevMeasure + 1)) {
                this.exerciseResults.push(this.evaluateContinuousMeasure(prevMeasure));
              }
            }
            // Re-apply to ensure exact downbeat visual sync
            if (currentSigns) {
              this.handRenderer.applySigns(currentSigns.sign1, currentSigns.sign2);
              this.prepareExpectedTargets(currentSigns, cycleIdx);
            }
          } else {
            // Visually display the EXACT signs for this cycle!
            this.handRenderer.applySigns(cycleSigns.sign1, cycleSigns.sign2);

            if (passType === 2) {
              // Ensure expected targets are populated if not already pre-armed by early window
              if (this.expectedTargetSlots.size === 0) {
                this.prepareExpectedTargets(cycleSigns, cycleIdx);
              }
            }
          }
        }

        const effectiveSigns = (this.mode === 'continuous') ? (this.cycles.get(cycleIdx) || cycleSigns) : cycleSigns;

        if (this.onStateChange) {
          this.onStateChange({
            mode: this.mode,
            pass: passType,
            measure: cycleIdx + 1,
            isReady: false,
            beat: beatIndex + 1,
            totalBeats: this.beatsPerPass,
            sign1: effectiveSigns.sign1,
            sign2: effectiveSigns.sign2,
            patternId: effectiveSigns.patternId || null,
            bpm: this.bpm,
            isPracticeMode: this.isPracticeMode,
            currentHand: cycleIdx + 1,
            totalHands: this.handCountGoal
          });
        }
      }, timeUntilBeat);
    }

    onImitateWindowOpen(cycleIdx) {
      if (!this.isRunning) return;
      const cycleSigns = this.cycles.get(cycleIdx);
      if (cycleSigns) {
        // Pre-arm the expected targets so early taps can be registered immediately!
        this.prepareExpectedTargets(cycleSigns, cycleIdx);
      }
      if (this.onStateChange) {
        this.onStateChange({
          mode: this.mode,
          pass: 2,
          measure: cycleIdx + 1,
          isReady: true,
          beat: 1,
          totalBeats: this.beatsPerPass,
          sign1: cycleSigns ? cycleSigns.sign1 : '',
          sign2: cycleSigns ? cycleSigns.sign2 : '',
          patternId: cycleSigns ? (cycleSigns.patternId || null) : null,
          bpm: this.bpm,
          isPracticeMode: this.isPracticeMode,
          currentHand: cycleIdx + 1,
          totalHands: this.handCountGoal
        });
      }
    }

    prepareExpectedTargets(cycleSigns, cycleIdx = 0) {
      if (this.mode !== 'continuous') {
        this.expectedTargetSlots.clear();
        this.perfectTargetSlots.clear();
        this.hasError = false;
      } else {
        // Clear any slots previously registered for this exact cycleIdx to prevent duplicates on repeat/rearm
        for (const k of this.expectedTargetSlots) {
          if (k.startsWith(`${cycleIdx}_`)) {
            this.expectedTargetSlots.delete(k);
          }
        }
      }

      const subs = this.subdivisionsPerBeat;
      for (let s = 0; s < subs; s++) {
        if (cycleSigns.sign1.charAt(s) === '1') {
          this.expectedTargetSlots.add(`${cycleIdx}_0_${s}`);
        }
      }
      if (this.isTwoHands) {
        for (let s = 0; s < subs; s++) {
          if (cycleSigns.sign2.charAt(s) === '1') {
            this.expectedTargetSlots.add(`${cycleIdx}_1_${s}`);
          }
        }
      }

      // Memory cleanup for long-running continuous sessions
      if (this.mode === 'continuous' && cycleIdx > 5) {
        const minCycle = cycleIdx - 4;
        for (const k of this.expectedTargetSlots) {
          const c = parseInt(k.split('_')[0], 10);
          if (c < minCycle) this.expectedTargetSlots.delete(k);
        }
        for (const k of this.perfectTargetSlots) {
          const c = parseInt(k.split('_')[0], 10);
          if (c < minCycle) this.perfectTargetSlots.delete(k);
        }
        for (const c of this.measureErrors) {
          if (c < minCycle) this.measureErrors.delete(c);
        }
      }
    }

    evaluateContinuousMeasure(c) {
      const hadError = this.measureErrors.has(c);
      let allPerfect = true;
      let expectedCount = 0;
      for (const slot of this.expectedTargetSlots) {
        if (slot.startsWith(`${c}_`)) {
          expectedCount++;
          if (!this.perfectTargetSlots.has(slot)) {
            allPerfect = false;
          }
        }
      }
      const success = !hadError && (expectedCount > 0 ? allPerfect : true);
      return { handIndex: c + 1, success };
    }

    handleUserTap(eventTimeStamp) {
      // 1. Immediate tactile sound (sub-millisecond Web Audio)
      audioEngine.playUserTap();

      // Measure exact hardware keypress arrival time to bypass JS task queue jitter
      let eventAgeSec = 0;
      if (eventTimeStamp && typeof performance !== 'undefined' && performance.now) {
        eventAgeSec = Math.max(0, (performance.now() - eventTimeStamp) / 1000);
      }

      // Audio clock time of the tap minus hardware event arrival delay
      const rawTapTime = audioEngine.getCurrentTime() - eventAgeSec;
      // Hardware audio output buffer latency compensation (converts physical sound time to timeline time)
      const latencyCompSec = (this.latencyOffsetMs || 0) / 1000;
      const tapTime = rawTapTime - latencyCompSec;

      // If training is stopped / idle, give instant visual feedback on Knuckle 1 (Zero-drop testing!)
      if (!this.isRunning) {
        if (this.onEvaluation) {
          this.onEvaluation({
            beat: 0,
            fractionalSub: 0,
            deltaMs: 0,
            rating: 'perfect',
            isTest: true
          });
        }
        return;
      }

      // Ignore taps during countdown
      if (this.isCountingDown) {
        return;
      }

      const subDuration = this.secondsPerSubdivision;
      const beatDuration = this.secondsPerBeat;
      const cycleDuration = this.beatsPerCycle * beatDuration;

      const timeSinceStart = tapTime - this.sessionStartTime;

      let matchedCycle = null;
      let passStartTime = 0;
      let relTime = 0;
      let isImitatePass = false;

      if (this.mode === 'continuous') {
        // CONTINUOUS SIGHT-READING MODE:
        // Every measure is played live. Window boundary is halfway between the last sub of Measure c
        // and the downbeat of Measure c+1: [cStart - 0.5 * subDuration, cStart + cycleDuration - 0.5 * subDuration)
        const estMeasure = Math.floor((timeSinceStart + 0.5 * subDuration) / cycleDuration);
        const candidates = [estMeasure, estMeasure - 1, estMeasure + 1];

        for (const c of candidates) {
          if (c < 0) continue;
          const cStart = this.sessionStartTime + c * cycleDuration;
          const winOpen = (c === 0) ? (cStart - subDuration) : (cStart - 0.5 * subDuration);
          const winClose = cStart + cycleDuration - 0.5 * subDuration;

          if (tapTime >= winOpen && tapTime < winClose) {
            matchedCycle = c;
            passStartTime = cStart;
            relTime = tapTime - cStart;
            isImitatePass = true;
            break;
          }
        }

        if (matchedCycle === null) {
          matchedCycle = Math.max(0, estMeasure);
          const cStart = this.sessionStartTime + matchedCycle * cycleDuration;
          passStartTime = cStart;
          relTime = tapTime - cStart;
          isImitatePass = true;
        }
      } else {
        // IMITATE MODE:
        // Find the matched cycle whose imitation or demo window covers tapTime
        const currentCycleIdx = Math.max(0, Math.floor(timeSinceStart / cycleDuration));
        const candidates = [currentCycleIdx, currentCycleIdx - 1, currentCycleIdx + 1];

        // 1. Primary check: Active Imitation Window (Pass 2)
        for (const c of candidates) {
          if (c < 0) continue;
          const cPass2Start = this.sessionStartTime + (c * this.beatsPerCycle + this.beatsPerPass) * beatDuration;
          // Window opens 1 full subdivision before Pass 2 starts!
          const winOpen = cPass2Start - subDuration;
          // Window closes 0.5 subdivision after Pass 2 ends
          const winClose = cPass2Start + (this.beatsPerPass * beatDuration) + (0.5 * subDuration);

          if (tapTime >= winOpen && tapTime <= winClose) {
            matchedCycle = c;
            passStartTime = cPass2Start;
            relTime = tapTime - cPass2Start;
            isImitatePass = true;
            break;
          }
        }

        // 2. Secondary check: Demo Phase (Pass 1)
        if (matchedCycle === null) {
          for (const c of candidates) {
            if (c < 0) continue;
            const cDemoStart = this.sessionStartTime + (c * this.beatsPerCycle) * beatDuration;
            const demoWinOpen = cDemoStart - (0.5 * subDuration);
            const demoWinClose = cDemoStart + (this.beatsPerPass * beatDuration);

            if (tapTime >= demoWinOpen && tapTime <= demoWinClose) {
              matchedCycle = c;
              passStartTime = cDemoStart;
              relTime = tapTime - cDemoStart;
              isImitatePass = false;
              break;
            }
          }
        }

        if (matchedCycle === null) {
          matchedCycle = currentCycleIdx;
          const cPass2Start = this.sessionStartTime + (matchedCycle * this.beatsPerCycle + this.beatsPerPass) * beatDuration;
          passStartTime = cPass2Start;
          relTime = tapTime - cPass2Start;
          isImitatePass = false;
        }
      }

      let targetBeat = 0;
      let beatRelTime = relTime;

      if (this.isTwoHands) {
        if (relTime >= beatDuration - 0.5 * subDuration) {
          targetBeat = 1;
          beatRelTime = relTime - beatDuration;
        } else {
          targetBeat = 0;
          beatRelTime = relTime;
        }
      } else {
        targetBeat = 0;
        beatRelTime = relTime;
      }

      const fractionalSub = beatRelTime / subDuration;
      const nearestSub = Math.round(fractionalSub);
      const subDeltaSec = beatRelTime - (nearestSub * subDuration);
      const subDeltaMs = subDeltaSec * 1000;

      const cycleSigns = this.cycles.get(matchedCycle);
      if (!cycleSigns) return;

      const activeSign = (targetBeat === 1) ? cycleSigns.sign2 : cycleSigns.sign1;
      const isValidSub = nearestSub >= 0 && nearestSub < this.subdivisionsPerBeat;
      const isExpectedNote = isValidSub && (activeSign.charAt(nearestSub) === '1');

      if (!isImitatePass) {
        // Tap occurred during Demo phase!
        // Show immediate visual confirmation on the timeline with demo timing without penalizing score!
        if (this.onEvaluation) {
          this.onEvaluation({
            beat: targetBeat,
            fractionalSub: fractionalSub,
            deltaMs: subDeltaMs,
            rating: Math.abs(subDeltaMs) <= this.thresholdPerfectMs ? 'perfect' : 'demo-tap',
            isDemoTap: true
          });
        }
        return;
      }

      let rating = 'perfect';

      if (isExpectedNote) {
        const slotKey = `${matchedCycle}_${targetBeat}_${nearestSub}`;
        if (this.perfectTargetSlots.has(slotKey)) {
          // Extra duplicate tap on an already-hit knuckle is an error!
          rating = 'error';
          this.hasError = true;
          this.measureErrors.add(matchedCycle);
        } else if (Math.abs(subDeltaMs) <= this.thresholdPerfectMs) {
          // Tier 1: Perfect (Green) - within ±45ms!
          rating = 'perfect';
          this.perfectTargetSlots.add(slotKey);
        } else if (Math.abs(subDeltaMs) <= this.thresholdMaxMs) {
          // Tier 2: Near-miss (Orange) - between ±45ms and ±85ms (early < or late >)
          rating = (subDeltaMs < 0) ? 'early' : 'late';
          this.hasError = true;
          this.measureErrors.add(matchedCycle);
        } else {
          // Tier 3: Gross timing error (> 85ms) -> Red
          rating = 'error';
          this.hasError = true;
          this.measureErrors.add(matchedCycle);
        }
      } else {
        // Tapped on silence / curled knuckle or outside valid subdivision -> Red
        rating = 'error';
        this.hasError = true;
        this.measureErrors.add(matchedCycle);
      }

      if (this.onEvaluation) {
        this.onEvaluation({
          beat: targetBeat,
          fractionalSub: fractionalSub,
          deltaMs: subDeltaMs,
          rating: rating
        });
      }
    }
  }

  /* ==========================================================================
     5. DEBUG PANEL (Press 'D' HUD)
     ========================================================================== */
  class DebugPanel {
    constructor(rhythmEngine, onVisualTogglesChange, onTestGesture, onConductorSettingsChange, onTestScore) {
      this.engine = rhythmEngine;
      this.onVisualTogglesChange = onVisualTogglesChange;
      this.onTestGesture = onTestGesture;
      this.onConductorSettingsChange = onConductorSettingsChange;
      this.onTestScore = onTestScore;
      this.isOpen = false;
      this.showKnuckleLine = false;
      this.showSubdivisionGuides = false;

      // Statistics tracking state for Section 4
      this.recentTaps = []; // Circular/sliding buffer of last 10 tap deltas (ms)
      this.exerciseTaps = []; // All tap deltas (ms) in current 10-hand exercise set
      this.exerciseRatings = { perfect: 0, early: 0, late: 0, miss: 0 };
      this.exerciseHandsCompleted = 0;

      this.initDom();
      this.bindEvents();
    }

    formatSubdivisionLabel(val) {
      const v = parseFloat(val);
      const isTernary = (this.engine && this.engine.divisionMode === 'ternary');
      let name = '';
      if (!isTernary) {
        if (v === 0) name = 'Beat Start (Ta)';
        else if (v === 1) name = 'Sub 2 (Ka)';
        else if (v === 2) name = 'Sub 3 (Di)';
        else if (v === 3) name = 'Sub 4 (Mi)';
        else if (v === 0.25) name = 'Ta + 0.25';
        else if (v === 0.5) name = 'Ta + 0.5';
        else if (v === 1.5) name = 'Ka + 0.5';
        else if (v === 2.5) name = 'Di + 0.5';
        else name = `Sub ${v.toFixed(2)}`;
      } else {
        if (v === 0) name = 'Beat Start (Ta)';
        else if (v === 1) name = 'Sub 2 (Ki)';
        else if (v === 2) name = 'Sub 3 (Da)';
        else if (v === 0.25) name = 'Ta + 0.25';
        else if (v === 0.5) name = 'Ta + 0.5';
        else if (v === 1.5) name = 'Ki + 0.5';
        else name = `Sub ${v.toFixed(2)}`;
      }
      return `${v} (${name})`;
    }

    initDom() {
      const el = document.createElement('div');
      el.id = 'debug-hud';
      el.className = 'debug-hud hidden';
      el.innerHTML = `
        <div class="debug-header">
          <div class="debug-title">
            <span class="debug-icon">⚙</span> DEBUG HUD (Press 'D' to toggle)
          </div>
          <button id="debug-close-btn" class="debug-close-btn">&times;</button>
        </div>

        <div class="debug-content">
          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-visual">
              <span class="chevron">▶</span> 1. Visual Knuckle Line & Scale
            </div>
            <div id="debug-sec-visual" class="debug-section-body collapsed">
              <label class="debug-toggle-row">
                <input type="checkbox" id="dbg-toggle-line">
                <span>Show Bounded Knuckle Lines</span>
              </label>
              <label class="debug-toggle-row">
                <input type="checkbox" id="dbg-toggle-guides">
                <span>Show Knuckle Scale Ticks (Ta Ka Di Mi)</span>
              </label>
            </div>
          </div>

          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-sounds">
              <span class="chevron">▶</span> 2. Synthesizer & Sound Presets
            </div>
            <div id="debug-sec-sounds" class="debug-section-body collapsed">
              <div class="debug-select-row">
                <label>Metronome Sound:</label>
                <select id="dbg-select-metro" class="dbg-select">
                  <option value="bass-tom" selected>Bass / Tom + Harmonic Attack</option>
                  <option value="kick">Electronic Punchy Kick</option>
                  <option value="woodblock">Woodblock / Clave</option>
                  <option value="cowbell">Latin Cowbell / Agogô</option>
                  <option value="digital-beep">Digital High Beep</option>
                </select>
              </div>

              <div class="debug-select-row">
                <label>Subdivision Sound:</label>
                <select id="dbg-select-sub" class="dbg-select">
                  <option value="shaker" selected>Percussion Shaker</option>
                  <option value="wood-tap">Wood Tap</option>
                  <option value="soft-tick">Soft Ambient Tick</option>
                  <option value="high-blip">High Digital Blip</option>
                </select>
              </div>

              <div class="debug-select-row">
                <label>Imitate Sound:</label>
                <select id="dbg-select-imitate" class="dbg-select">
                  <option value="handclap" selected>Hand Clap</option>
                  <option value="synth-blip">Synth Blip</option>
                  <option value="woodblock">Woodblock</option>
                  <option value="marimba">Marimba</option>
                  <option value="bongo">Bongo</option>
                  <option value="clave">Clave</option>
                  <option value="cowbell">Cowbell</option>
                  <option value="rimshot">Rimshot</option>
                </select>
              </div>

              <div class="debug-select-row">
                <label>Tap Feedback Sound:</label>
                <select id="dbg-select-tap" class="dbg-select">
                  <option value="bongo" selected>Bongo Slap</option>
                  <option value="wood-rim">Acoustic Wood Rim</option>
                  <option value="snare-side">Snare Side-Stick</option>
                  <option value="hihat">Crisp Closed Hi-Hat</option>
                </select>
              </div>

              <label class="debug-toggle-row" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                <input type="checkbox" id="dbg-toggle-hear-first" ${this.engine.hearRhythmFirst ? 'checked' : ''}>
                <span>Hear Rhythm First (Demo Audio)</span>
              </label>
            </div>
          </div>

          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-timing">
              <span class="chevron">▶</span> 3. Timing Windows & Latency Calibration
            </div>
            <div id="debug-sec-timing" class="debug-section-body collapsed">
              <div class="debug-slider-row">
                <label>Audio Latency Comp: <span id="dbg-val-latency">${this.engine.latencyOffsetMs}ms</span></label>
                <input type="range" id="dbg-slider-latency" min="0" max="120" value="${this.engine.latencyOffsetMs}" step="1">
              </div>
              <div class="debug-slider-row">
                <label>Perfect Window: <span id="dbg-val-perfect">±45ms</span></label>
                <input type="range" id="dbg-slider-perfect" min="15" max="65" value="45" step="1">
              </div>
              <div class="debug-slider-row">
                <label>Max Window (Early/Late): <span id="dbg-val-max">±85ms</span></label>
                <input type="range" id="dbg-slider-max" min="40" max="140" value="85" step="5">
              </div>
            </div>
          </div>

          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-state">
              <span class="chevron">▶</span> 4. Real-Time Engine State & Statistics
            </div>
            <div id="debug-sec-state" class="debug-section-body collapsed">
              <!-- Engine General Status -->
              <div class="debug-data-grid">
                <div class="data-item"><span class="lbl">BPM:</span> <span id="dbg-rt-bpm" class="val">--</span></div>
                <div class="data-item"><span class="lbl">Pass:</span> <span id="dbg-rt-pass" class="val">--</span></div>
                <div class="data-item"><span class="lbl">Signs:</span> <span id="dbg-rt-sign" class="val highlight">--</span></div>
                <div class="data-item"><span class="lbl">Last Offset:</span> <span id="dbg-rt-delta" class="val">--</span></div>
                <div class="data-item"><span class="lbl">Last Rating:</span> <span id="dbg-rt-rating" class="val">--</span></div>
                <div class="data-item"><span class="lbl">Exercise Progress:</span> <span id="dbg-stat-hands-count" class="val">0 / 10</span></div>
              </div>

              <!-- Offset Analytics Sub-Card -->
              <div class="debug-stats-card">
                <div class="debug-stats-card-title">OFFSET & PRECISION ANALYTICS</div>
                <div class="debug-data-grid debug-grid-3col">
                  <div class="data-item" title="Running average of last 10 player taps">
                    <span class="lbl">Sliding Avg (10)</span>
                    <span id="dbg-stat-sliding-avg" class="val highlight">--</span>
                  </div>
                  <div class="data-item" title="Arithmetic mean across all exercise taps">
                    <span class="lbl">Exercise Mean</span>
                    <span id="dbg-stat-mean" class="val">--</span>
                  </div>
                  <div class="data-item" title="Median offset across all exercise taps (outlier-proof)">
                    <span class="lbl">Exercise Median</span>
                    <span id="dbg-stat-median" class="val">--</span>
                  </div>
                </div>

                <div class="debug-data-grid debug-grid-3col" style="margin-top: 4px;">
                  <div class="data-item" title="Timing consistency (standard deviation)">
                    <span class="lbl">Jitter (StdDev)</span>
                    <span id="dbg-stat-stddev" class="val">--</span>
                  </div>
                  <div class="data-item" title="Tendency: Rushing vs Dragging">
                    <span class="lbl">Timing Bias</span>
                    <span id="dbg-stat-bias" class="val">--</span>
                  </div>
                  <div class="data-item" title="Min and Max offset recorded in exercise">
                    <span class="lbl">Min / Max Range</span>
                    <span id="dbg-stat-range" class="val">--</span>
                  </div>
                </div>

                <!-- Last 10 Taps Visual Trend Strip -->
                <div class="debug-sparkline-row">
                  <span class="lbl">Last 10 Taps Trend (Center = Exact Beat):</span>
                  <div id="dbg-sparkline" class="debug-sparkline"></div>
                </div>
              </div>

              <!-- Exercise Hit Evaluation Counts Sub-Card -->
              <div class="debug-stats-card">
                <div class="debug-stats-card-title" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>EXERCISE HITS BREAKDOWN</span>
                  <button id="btn-dbg-reset-stats" class="btn-dbg-mini" type="button" title="Réinitialiser les statistiques">Reset Stats</button>
                </div>
                <div class="debug-data-grid debug-grid-4col">
                  <div class="data-item"><span class="lbl">Total Taps</span> <span id="dbg-stat-taps-total" class="val">0</span></div>
                  <div class="data-item"><span class="lbl">Perfect</span> <span id="dbg-stat-perfect" class="val perfect">0</span></div>
                  <div class="data-item"><span class="lbl">Early</span> <span id="dbg-stat-early" class="val early">0</span></div>
                  <div class="data-item"><span class="lbl">Late</span> <span id="dbg-stat-late" class="val late">0</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 5: Conductor Activation Gestures (Purely Vertical) -->
          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-conductor">
              <span class="chevron">▶</span> 5. Conductor Activation & Beat Pulse Gestures
            </div>
            <div id="debug-sec-conductor" class="debug-section-body collapsed">
              <div class="debug-hint">
                <strong>Rítmica Consignas:</strong> Pure Parabolic Apex gestures (no stickiness at apex). 
                The main <em>Activation Gesture</em> prepares the upcoming sequence on Beat 2 with a gentle rebound. 
                The subtle <em>Beat Pulse</em> keeps the groove on every beat with zero rebound.
              </div>

              <div id="dbg-conductor-timing-info" class="conductor-timing-badge">
                Tempo: 70 BPM &bull; Mode: Slow (&lt;100 BPM: Rise starts at Di) &bull; Apex: Mi &bull; Arrival: 857ms
              </div>

              <div class="debug-conductor-controls">
                <div class="debug-slider-row">
                  <label>BPM Cutoff (Animation & Finger Transition): <span id="dbg-val-conductor-cutoff">${this.engine.conductorBpmCutoff} BPM</span></label>
                  <input type="range" id="dbg-slider-conductor-cutoff" min="60" max="160" value="${this.engine.conductorBpmCutoff}" step="5">
                </div>
                <!-- Finger Transition Timing Sliders for Continuous Mode (Under & Over BPM Cutoff) -->
                <div class="debug-finger-transition-group" style="margin-top: 6px; padding: 10px; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.2);">
                  <div style="font-weight: 700; color: #a78bfa; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Finger Transition Timing (Continuous Mode)
                  </div>
                  <div class="debug-slider-row" style="margin-bottom: 8px;">
                    <label>Under Cutoff (&lt;${this.engine.conductorBpmCutoff || 100} BPM): <span id="dbg-val-finger-trans-slow">${this.formatSubdivisionLabel(this.engine.fingerTransitionSubSlow !== undefined ? this.engine.fingerTransitionSubSlow : 0.25)}</span></label>
                    <input type="range" id="dbg-slider-finger-trans-slow" min="0" max="3" value="${this.engine.fingerTransitionSubSlow !== undefined ? this.engine.fingerTransitionSubSlow : 0.25}" step="0.25">
                  </div>
                  <div class="debug-slider-row">
                    <label>Over Cutoff (&ge;${this.engine.conductorBpmCutoff || 100} BPM): <span id="dbg-val-finger-trans-fast">${this.formatSubdivisionLabel(this.engine.fingerTransitionSubFast !== undefined ? this.engine.fingerTransitionSubFast : 0.25)}</span></label>
                    <input type="range" id="dbg-slider-finger-trans-fast" min="0" max="3" value="${this.engine.fingerTransitionSubFast !== undefined ? this.engine.fingerTransitionSubFast : 0.25}" step="0.25">
                  </div>
                </div>
                <div class="debug-slider-row">
                  <label>Activation Lift Amplitude: <span id="dbg-val-conductor-lift">${this.engine.conductorLiftHeight}px</span></label>
                  <input type="range" id="dbg-slider-conductor-lift" min="40" max="150" value="${this.engine.conductorLiftHeight}" step="5">
                </div>
                <div class="debug-slider-row">
                  <label>Beat Pulse Amplitude: <span id="dbg-val-conductor-pulse-lift">${this.engine.conductorPulseLiftHeight || 6}px</span></label>
                  <input type="range" id="dbg-slider-conductor-pulse-lift" min="2" max="30" value="${this.engine.conductorPulseLiftHeight || 6}" step="1">
                </div>

                <!-- Beat Pulse Gesture Note (Locked to Proposal #4) -->
                <div class="debug-pulse-section" style="margin-top: 12px; padding: 10px 12px; background: rgba(30, 41, 59, 0.55); border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">
                  <div style="font-weight: 700; color: #38bdf8; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Binary Beat Pulse Animation</span>
                    <span style="font-size: 10px; color: #4ade80; font-weight: 600;">Locked: #4 Micro-Dip &amp; Floating Apex</span>
                  </div>
                  <div style="font-size: 9.5px; color: #94a3b8; margin-top: 3px;">
                    Rests motionless at center until Di (26%&ndash;36%), 10% micro-dip, floats to apex at 50%, Option 12 late gravity drop into 72% with zero rebound.
                  </div>
                </div>

                <!-- Ternary Division Conductor Note (Locked to Recommended #3) -->
                <div class="debug-ternary-section" style="margin-top: 14px; padding: 10px 12px; background: rgba(30, 41, 59, 0.55); border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.2);">
                  <div style="font-weight: 700; color: #38bdf8; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
                    <span>Ternary Activation Gesture</span>
                    <span style="font-size: 10px; color: #4ade80; font-weight: 600;">Locked: #3 (8% Rebound)</span>
                  </div>
                  <div style="font-size: 9.5px; color: #94a3b8; margin-top: 3px;">
                    Authentic Ki dip &rarr; Da crest &rarr; 8% rebound (Activation ~95px). Beat pulses are pegged to the Beat Pulse Amplitude slider (default 6px).
                  </div>
                </div>

                <label class="debug-toggle-row">
                  <input type="checkbox" id="dbg-toggle-conductor-auto" ${this.engine.conductorGestureAuto ? 'checked' : ''}>
                  <span>Auto-trigger Activation Gesture (Demo Beat 2)</span>
                </label>
                <label class="debug-toggle-row">
                  <input type="checkbox" id="dbg-toggle-conductor-pulse" ${this.engine.conductorPulseAuto !== false ? 'checked' : ''}>
                  <span>Auto-trigger Beat Pulse (Every Beat)</span>
                </label>
                <div class="debug-btn-row" style="margin-top: 10px;">
                  <button id="dbg-btn-test-activation" class="dbg-btn-accent" style="flex: 1;">
                    ▶ Test Main Activation
                  </button>
                  <button id="dbg-btn-test-pulse" class="dbg-btn" style="flex: 1;">
                    ▶ Test Beat Pulse
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 6: Score Screen Simulator / Test -->
          <div class="debug-section">
            <div class="debug-section-header" data-target="debug-sec-score-test">
              <span class="chevron">▶</span> 6. Score Screen Simulator
            </div>
            <div id="debug-sec-score-test" class="debug-section-body collapsed">
              <div class="debug-score-row" style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                <input type="number" id="dbg-input-score" min="0" max="10" placeholder="Score (0 - 10)" class="dbg-text-input" style="flex: 1;" value="7">
                <button id="dbg-btn-test-score" class="dbg-btn-accent" style="padding: 6px 14px; white-space: nowrap;">Tester</button>
              </div>
              <div class="debug-hint">
                Entrez un score sur 10 (ex: 0, 2, 7, 10) et appuyez sur <strong>Entrée</strong> pour afficher l'écran de score correspondant.
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(el);
      this.panelEl = el;
    }

    bindEvents() {
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'd' || e.key === 'D') {
          this.toggle();
        }
      });

      document.getElementById('debug-close-btn').addEventListener('click', () => this.hide());

      this.panelEl.querySelectorAll('.debug-section-header').forEach(header => {
        header.addEventListener('click', () => {
          const targetId = header.getAttribute('data-target');
          const body = document.getElementById(targetId);
          const chevron = header.querySelector('.chevron');
          const isCollapsed = body.classList.contains('collapsed');
          if (isCollapsed) {
            body.classList.remove('collapsed');
            chevron.textContent = '▼';
          } else {
            body.classList.add('collapsed');
            chevron.textContent = '▶';
          }
        });
      });

      const toggleLine = document.getElementById('dbg-toggle-line');
      const toggleGuides = document.getElementById('dbg-toggle-guides');

      toggleLine.addEventListener('change', () => {
        this.showKnuckleLine = toggleLine.checked;
        this.notifyVisualToggles();
      });

      toggleGuides.addEventListener('change', () => {
        this.showSubdivisionGuides = toggleGuides.checked;
        this.notifyVisualToggles();
      });

      document.getElementById('dbg-select-metro').addEventListener('change', (e) => {
        audioEngine.metronomeSound = e.target.value;
      });
      document.getElementById('dbg-select-sub').addEventListener('change', (e) => {
        audioEngine.subdivisionSound = e.target.value;
      });
      document.getElementById('dbg-select-imitate').addEventListener('change', (e) => {
        audioEngine.imitateSound = e.target.value;
      });
      document.getElementById('dbg-select-tap').addEventListener('change', (e) => {
        audioEngine.tapSound = e.target.value;
      });

      const chkHear = document.getElementById('dbg-toggle-hear-first');
      if (chkHear) {
        chkHear.addEventListener('change', () => {
          this.engine.setSettings({ hearRhythmFirst: chkHear.checked });
          localStorage.setItem('rcs_hear_rhythm_first', chkHear.checked);
        });
      }

      const sliderPerf = document.getElementById('dbg-slider-perfect');
      const sliderMax = document.getElementById('dbg-slider-max');

      sliderPerf.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        this.engine.thresholdPerfectMs = v;
        document.getElementById('dbg-val-perfect').textContent = `±${v}ms`;
      });

      sliderMax.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        this.engine.thresholdMaxMs = v;
        document.getElementById('dbg-val-max').textContent = `±${v}ms`;
      });

      const sliderLatency = document.getElementById('dbg-slider-latency');
      if (sliderLatency) {
        sliderLatency.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          this.engine.latencyOffsetMs = v;
          localStorage.setItem('rcs_latency_offset', v);
          document.getElementById('dbg-val-latency').textContent = `${v}ms`;
        });
      }

      // BPM Cutoff slider
      const sliderCutoff = document.getElementById('dbg-slider-conductor-cutoff');
      if (sliderCutoff) {
        sliderCutoff.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          this.engine.conductorBpmCutoff = v;
          document.getElementById('dbg-val-conductor-cutoff').textContent = `${v} BPM`;
          const slowLabel = document.querySelector('#dbg-slider-finger-trans-slow')?.closest('.debug-slider-row')?.querySelector('label');
          if (slowLabel) {
            slowLabel.childNodes[0].nodeValue = `Under Cutoff (<${v} BPM): `;
          }
          const fastLabel = document.querySelector('#dbg-slider-finger-trans-fast')?.closest('.debug-slider-row')?.querySelector('label');
          if (fastLabel) {
            fastLabel.childNodes[0].nodeValue = `Over Cutoff (≥${v} BPM): `;
          }
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ cutoff: v });
          }
        });
      }

      // Finger Transition Timing: Under Cutoff slider
      const sliderFingerSlow = document.getElementById('dbg-slider-finger-trans-slow');
      if (sliderFingerSlow) {
        sliderFingerSlow.addEventListener('input', (e) => {
          const v = parseFloat(e.target.value);
          this.engine.fingerTransitionSubSlow = v;
          document.getElementById('dbg-val-finger-trans-slow').textContent = this.formatSubdivisionLabel(v);
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ fingerTransitionSubSlow: v });
          }
        });
      }

      // Finger Transition Timing: Over Cutoff slider
      const sliderFingerFast = document.getElementById('dbg-slider-finger-trans-fast');
      if (sliderFingerFast) {
        sliderFingerFast.addEventListener('input', (e) => {
          const v = parseFloat(e.target.value);
          this.engine.fingerTransitionSubFast = v;
          document.getElementById('dbg-val-finger-trans-fast').textContent = this.formatSubdivisionLabel(v);
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ fingerTransitionSubFast: v });
          }
        });
      }

      // Activation Lift Amplitude slider
      const sliderLift = document.getElementById('dbg-slider-conductor-lift');
      if (sliderLift) {
        sliderLift.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          this.engine.conductorLiftHeight = v;
          document.getElementById('dbg-val-conductor-lift').textContent = `${v}px`;
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ lift: v });
          }
        });
      }

      // Beat Pulse Lift Amplitude slider
      const sliderPulseLift = document.getElementById('dbg-slider-conductor-pulse-lift');
      if (sliderPulseLift) {
        sliderPulseLift.addEventListener('input', (e) => {
          const v = parseInt(e.target.value, 10);
          this.engine.conductorPulseLiftHeight = v;
          document.getElementById('dbg-val-conductor-pulse-lift').textContent = `${v}px`;
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ pulseLift: v });
          }
        });
      }

      // Auto toggle activation
      const toggleAuto = document.getElementById('dbg-toggle-conductor-auto');
      if (toggleAuto) {
        toggleAuto.addEventListener('change', (e) => {
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ auto: e.target.checked });
          }
        });
      }

      // Auto toggle beat pulse
      const togglePulse = document.getElementById('dbg-toggle-conductor-pulse');
      if (togglePulse) {
        togglePulse.addEventListener('change', (e) => {
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ pulseAuto: e.target.checked });
          }
        });
      }

      // Test Activation button
      const btnTestActivation = document.getElementById('dbg-btn-test-activation');
      if (btnTestActivation) {
        btnTestActivation.addEventListener('click', () => {
          if (this.onTestGesture) {
            this.onTestGesture('activation');
          }
        });
      }

      // Test Pulse button
      const btnTestPulse = document.getElementById('dbg-btn-test-pulse');
      if (btnTestPulse) {
        btnTestPulse.addEventListener('click', () => {
          if (this.onTestGesture) {
            this.onTestGesture('pulse');
          }
        });
      }

      // Score Screen Simulator / Test
      const scoreInput = document.getElementById('dbg-input-score');
      const scoreBtn = document.getElementById('dbg-btn-test-score');

      const triggerScoreTest = () => {
        if (!scoreInput) return;
        const raw = scoreInput.value.trim();
        if (raw === '') return;
        const val = parseInt(raw, 10);
        if (!isNaN(val)) {
          const clamped = Math.max(0, Math.min(10, val));
          if (this.onTestScore) {
            this.onTestScore(clamped);
          }
        }
      };

      scoreInput?.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          triggerScoreTest();
        }
      });

      scoreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        triggerScoreTest();
      });

      // Reset statistics button in Section 4
      const btnResetStats = document.getElementById('btn-dbg-reset-stats');
      btnResetStats?.addEventListener('click', () => {
        this.resetStats();
      });
    }

    notifyVisualToggles() {
      if (this.onVisualTogglesChange) {
        this.onVisualTogglesChange({
          showKnuckleLine: this.showKnuckleLine,
          showSubdivisionGuides: this.showSubdivisionGuides
        });
      }
    }

    toggle() {
      this.isOpen ? this.hide() : this.show();
    }

    show() {
      this.isOpen = true;
      this.panelEl.classList.remove('hidden');
    }

    hide() {
      this.isOpen = false;
      this.panelEl.classList.add('hidden');
    }

    markPresetPlaying(presetId) {
      if (!this.panelEl) return;
      this.panelEl.querySelectorAll('.conductor-preset-card').forEach(card => {
        if (card.getAttribute('data-preset') == presetId) {
          card.classList.add('playing');
        } else {
          card.classList.remove('playing');
        }
      });
    }

    clearPresetPlaying() {
      if (!this.panelEl) return;
      this.panelEl.querySelectorAll('.conductor-preset-card.playing').forEach(card => {
        card.classList.remove('playing');
      });
    }

    resetStats() {
      this.recentTaps = [];
      this.exerciseTaps = [];
      this.exerciseRatings = { perfect: 0, early: 0, late: 0, miss: 0 };
      this.renderStatsView();
    }

    recordTapEvaluation(evalData) {
      if (evalData.isTest || evalData.isDemoTap) return;

      const delta = evalData.deltaMs;
      if (typeof delta === 'number' && !isNaN(delta) && Math.abs(delta) < 600) {
        // 1. Sliding window (last 10 taps)
        this.recentTaps.push(delta);
        if (this.recentTaps.length > 10) {
          this.recentTaps.shift();
        }

        // 2. Exercise cumulative taps
        this.exerciseTaps.push(delta);

        // 3. Ratings tally
        const r = evalData.rating || 'miss';
        if (this.exerciseRatings[r] !== undefined) {
          this.exerciseRatings[r]++;
        } else {
          this.exerciseRatings[r] = 1;
        }

        this.renderStatsView();
      }
    }

    renderStatsView() {
      // 1. Sliding Average of last 10 taps
      const elSliding = document.getElementById('dbg-stat-sliding-avg');
      if (elSliding) {
        if (this.recentTaps.length > 0) {
          const sum = this.recentTaps.reduce((acc, v) => acc + v, 0);
          const avg = sum / this.recentTaps.length;
          const sign = avg > 0 ? `+${avg.toFixed(1)}` : avg.toFixed(1);
          elSliding.textContent = `${sign}ms (${this.recentTaps.length}/10)`;
        } else {
          elSliding.textContent = '--';
        }
      }

      // 2. Exercise Mean
      const elMean = document.getElementById('dbg-stat-mean');
      if (elMean) {
        if (this.exerciseTaps.length > 0) {
          const sum = this.exerciseTaps.reduce((acc, v) => acc + v, 0);
          const mean = sum / this.exerciseTaps.length;
          const sign = mean > 0 ? `+${mean.toFixed(1)}` : mean.toFixed(1);
          elMean.textContent = `${sign}ms`;
        } else {
          elMean.textContent = '--';
        }
      }

      // 3. Exercise Median
      const elMedian = document.getElementById('dbg-stat-median');
      if (elMedian) {
        if (this.exerciseTaps.length > 0) {
          const sorted = [...this.exerciseTaps].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          const median = (sorted.length % 2 !== 0) ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2);
          const sign = median > 0 ? `+${median.toFixed(1)}` : median.toFixed(1);
          elMedian.textContent = `${sign}ms`;
        } else {
          elMedian.textContent = '--';
        }
      }

      // 4. Jitter / Standard Deviation
      const elStdDev = document.getElementById('dbg-stat-stddev');
      if (elStdDev) {
        if (this.exerciseTaps.length > 1) {
          const mean = this.exerciseTaps.reduce((acc, v) => acc + v, 0) / this.exerciseTaps.length;
          const variance = this.exerciseTaps.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / this.exerciseTaps.length;
          const stdDev = Math.sqrt(variance);
          elStdDev.textContent = `±${stdDev.toFixed(1)}ms`;
        } else {
          elStdDev.textContent = '--';
        }
      }

      // 5. Timing Bias (Rushing vs Dragging)
      const elBias = document.getElementById('dbg-stat-bias');
      if (elBias) {
        if (this.exerciseTaps.length >= 3) {
          const mean = this.exerciseTaps.reduce((acc, v) => acc + v, 0) / this.exerciseTaps.length;
          if (mean < -12) {
            elBias.textContent = `Ahead (${mean.toFixed(0)}ms)`;
            elBias.style.color = '#38bdf8'; // Blueish
          } else if (mean > 12) {
            elBias.textContent = `Behind (+${mean.toFixed(0)}ms)`;
            elBias.style.color = '#f97316'; // Orange
          } else {
            elBias.textContent = `Locked In (±${Math.abs(mean).toFixed(0)}ms)`;
            elBias.style.color = '#22c55e'; // Green
          }
        } else {
          elBias.textContent = '--';
          elBias.style.color = '';
        }
      }

      // 6. Min / Max Offset Range
      const elRange = document.getElementById('dbg-stat-range');
      if (elRange) {
        if (this.exerciseTaps.length > 0) {
          let min = Infinity;
          let max = -Infinity;
          for (const v of this.exerciseTaps) {
            if (v < min) min = v;
            if (v > max) max = v;
          }
          const minStr = min > 0 ? `+${min.toFixed(0)}` : min.toFixed(0);
          const maxStr = max > 0 ? `+${max.toFixed(0)}` : max.toFixed(0);
          elRange.textContent = `[${minStr} .. ${maxStr}]`;
        } else {
          elRange.textContent = '--';
        }
      }

      // 7. Sparkline / History Strip (last 10 taps)
      const sparkEl = document.getElementById('dbg-sparkline');
      if (sparkEl) {
        sparkEl.innerHTML = '';
        for (let i = 0; i < 10; i++) {
          const slot = document.createElement('div');
          slot.className = 'spark-bar-slot';
          
          const line = document.createElement('div');
          line.className = 'spark-zero-line';
          slot.appendChild(line);

          if (i < this.recentTaps.length) {
            const delta = this.recentTaps[i];
            const dot = document.createElement('div');
            // Clamp offset for visual plotting (-50ms to +50ms -> 10% to 90% top)
            const clamped = Math.max(-60, Math.min(60, delta));
            // delta < 0 is early (above zero line), delta > 0 is late (below zero line)
            const topPct = 50 + (clamped / 60) * 40;
            dot.style.top = `${topPct}%`;

            let rating = 'perfect';
            if (Math.abs(delta) > (this.engine ? this.engine.thresholdPerfectMs : 45)) {
              rating = delta < 0 ? 'early' : 'late';
            }
            dot.className = `spark-dot ${rating}`;
            dot.title = `Tap ${i + 1}: ${delta > 0 ? '+' : ''}${delta.toFixed(1)}ms`;
            slot.appendChild(dot);
          }
          sparkEl.appendChild(slot);
        }
      }

      // 8. Exercise Accuracy Breakdown
      const elTotal = document.getElementById('dbg-stat-taps-total');
      if (elTotal) elTotal.textContent = `${this.exerciseTaps.length}`;

      const elPerf = document.getElementById('dbg-stat-perfect');
      if (elPerf) elPerf.textContent = `${this.exerciseRatings.perfect || 0}`;

      const elEarly = document.getElementById('dbg-stat-early');
      if (elEarly) elEarly.textContent = `${this.exerciseRatings.early || 0}`;

      const elLate = document.getElementById('dbg-stat-late');
      if (elLate) elLate.textContent = `${this.exerciseRatings.late || 0}`;
    }

    updateStateView(data) {
      if (!this.isOpen) return;
      if (data.bpm !== undefined) {
        document.getElementById('dbg-rt-bpm').textContent = `${data.bpm}`;
        const timingEl = document.getElementById('dbg-conductor-timing-info');
        if (timingEl) {
          const cutoff = (this.engine && this.engine.conductorBpmCutoff) || 100;
          const isSlow = data.bpm < cutoff;
          const beatMs = Math.round(60000 / data.bpm);
          const diMs = Math.round(beatMs / 2);
          if (isSlow) {
            timingEl.innerHTML = `Tempo: <strong>${data.bpm} BPM</strong> &bull; Mode: <strong>Slow (&lt;${cutoff} BPM)</strong> &bull; Start: <strong>Di (${diMs}ms)</strong> &bull; Apex: <strong>Mi (${Math.round(diMs * 1.5)}ms)</strong> &bull; Arrival: <strong>${beatMs}ms</strong>`;
          } else {
            timingEl.innerHTML = `Tempo: <strong>${data.bpm} BPM</strong> &bull; Mode: <strong>Fast (&ge;${cutoff} BPM)</strong> &bull; Start: <strong>Ta (0ms)</strong> &bull; Apex: <strong>Di (${diMs}ms)</strong> &bull; Arrival: <strong>${beatMs}ms</strong>`;
          }
        }
      }
      if (data.pass !== undefined) {
        document.getElementById('dbg-rt-pass').textContent = (data.mode === 'continuous') ? `Play (M${data.measure || 1})` : (data.pass === 1 ? '1 (Demo)' : '2 (Imitate)');
      }
      if (data.sign1 !== undefined) {
        document.getElementById('dbg-rt-sign').textContent = `${data.sign1}${data.sign2 ? ' / ' + data.sign2 : ''}`;
      }
      if (data.deltaMs !== undefined) {
        const signStr = data.deltaMs > 0 ? `+${data.deltaMs.toFixed(1)}ms` : `${data.deltaMs.toFixed(1)}ms`;
        const deltaEl = document.getElementById('dbg-rt-delta');
        if (deltaEl) {
          deltaEl.textContent = data.isDemoTap ? `${signStr} (Demo)` : (data.isTest ? '0.0ms (Test)' : signStr);
        }
      }
      if (data.rating !== undefined) {
        const ratingEl = document.getElementById('dbg-rt-rating');
        if (ratingEl) {
          const ratingText = data.isDemoTap ? 'DEMO TAP' : (data.isTest ? 'TEST TAP' : data.rating.toUpperCase());
          ratingEl.textContent = ratingText;
          ratingEl.className = `val ${data.rating}`;
        }
      }
      if (data.completedHands !== undefined) {
        const handsEl = document.getElementById('dbg-stat-hands-count');
        if (handsEl) {
          handsEl.textContent = `${data.completedHands} / 10`;
        }
      }
    }
  }

/* ==========================================================================
     5.5. LATENCY CALIBRATION CONTROLLER
     ========================================================================== */
  class LatencyCalibrator {
    constructor(app) {
      this.app = app;
      this.isOpen = false;
      this.tapCount = 8; // remaining count starting at 8
      this.tapsHistory = []; // array of offsets in ms
      this.timerId = null;
      this.nextBeatTime = 0;
      this.firstBeatTime = 0;
      this.isFirstBeatScheduled = false;

      // DOM elements
      this.backdrop = document.getElementById('latency-modal-backdrop');
      this.modal = document.getElementById('latency-modal');
      this.instructionText = document.getElementById('latency-instruction-text');
      this.tapBtn = document.getElementById('btn-latency-tap');
      this.restartBtn = document.getElementById('btn-latency-restart');
      this.confirmBtn = document.getElementById('btn-latency-confirm');
      this.resultCard = document.getElementById('latency-result-card');
      this.resultVal = document.getElementById('latency-result-val');
      this.beatDot = document.getElementById('latency-beat-dot');
      this.closeBtn = document.getElementById('btn-close-latency');

      this.initEvents();
    }

    initEvents() {
      if (this.tapBtn) {
        this.tapBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.handleTap(e.timeStamp);
        });
      }

      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', () => {
          this.resetCalibration();
        });
      }

      if (this.confirmBtn) {
        this.confirmBtn.addEventListener('click', () => {
          this.saveAndApply();
        });
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => {
          this.close();
        });
      }

      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => {
          this.close();
        });
      }
    }

    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      // Ensure audio context is running
      audioEngine.ensureRunning();

      this.resetCalibration();

      if (this.backdrop) this.backdrop.classList.remove('hidden');
      if (this.modal) this.modal.classList.remove('hidden');

      // Close drawer if open to avoid visual overlap
      if (this.app) {
        this.app.closeDrawer();
      }

      // Start 60 BPM metronome immediately
      this.startMetronome();
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.stopMetronome();

      if (this.backdrop) this.backdrop.classList.add('hidden');
      if (this.modal) this.modal.classList.add('hidden');
    }

    resetCalibration() {
      this.tapCount = 8;
      this.tapsHistory = [];
      if (this.resultCard) this.resultCard.classList.remove('visible');
      if (this.confirmBtn) this.confirmBtn.classList.remove('visible');
      this.updateInstructionText();
    }

    startMetronome() {
      this.stopMetronome();
      this.isFirstBeatScheduled = false;
      // Start slightly in future
      this.nextBeatTime = audioEngine.getCurrentTime() + 0.08;
      this.firstBeatTime = this.nextBeatTime;
      this.isFirstBeatScheduled = true;
      this.scheduleLoop();
    }

    stopMetronome() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }

    scheduleLoop() {
      if (!this.isOpen) return;

      const currentTime = audioEngine.getCurrentTime();
      // Lookahead window of 120ms
      while (this.nextBeatTime < currentTime + 0.12) {
        const beatT = this.nextBeatTime;
        // High click at 60 BPM
        audioEngine.playMetronomeClick(beatT, true);

        // Flash visual beat dot exactly at beat time
        const delayMs = Math.max(0, (beatT - currentTime) * 1000);
        setTimeout(() => {
          if (!this.isOpen || !this.beatDot) return;
          this.beatDot.classList.add('flash');
          setTimeout(() => {
            if (this.beatDot) this.beatDot.classList.remove('flash');
          }, 110);
        }, delayMs);

        // Advance 1.0s (60 BPM = 1 beat/sec)
        this.nextBeatTime += 1.0;
      }

      this.timerId = setTimeout(() => this.scheduleLoop(), 25);
    }

    handleTap(eventTimeStamp) {
      if (!this.isOpen) return;

      // Precise tap time calculation with event arrival delay subtraction
      let eventAgeSec = 0;
      if (eventTimeStamp && typeof performance !== 'undefined' && performance.now) {
        eventAgeSec = Math.max(0, (performance.now() - eventTimeStamp) / 1000);
      }
      const rawTapTime = audioEngine.getCurrentTime() - eventAgeSec;

      // Find closest beat:
      // Since tempo is 60 BPM (interval = 1.0s), beats are at: firstBeatTime + k * 1.0
      // distance from nearest beat:
      const beatInterval = 1.0;
      const beatOffset = rawTapTime - this.firstBeatTime;
      const nearestBeatIndex = Math.round(beatOffset / beatInterval);
      const nearestBeatTime = this.firstBeatTime + (nearestBeatIndex * beatInterval);

      // Delta: tap relative to nearest beat
      const diffSec = rawTapTime - nearestBeatTime;
      // Clamped to [-0.5s, +0.5s] as per requirements
      const clampedDiffSec = Math.max(-0.5, Math.min(0.5, diffSec));
      const offsetMs = clampedDiffSec * 1000;

      // Add to sample history
      this.tapsHistory.push(offsetMs);

      // Decrement countdown
      if (this.tapCount > 0) {
        this.tapCount--;
      }

      // If at zero, show "Let's Go !" button without layout shift
      if (this.tapCount === 0 && this.confirmBtn) {
        this.confirmBtn.classList.add('visible');
      }

      // Update instructions
      this.updateInstructionText();

      // Display detected latency starting from 4th tap without layout shift
      if (this.tapsHistory.length >= 4) {
        const avg = this.getAverageOffset();
        if (this.resultCard) this.resultCard.classList.add('visible');
        if (this.resultVal) {
          // Display formatted average
          this.resultVal.textContent = `${Math.round(avg)} ms`;
        }
      }
    }

    getAverageOffset() {
      if (!this.tapsHistory || this.tapsHistory.length === 0) return 0;
      const sum = this.tapsHistory.reduce((acc, v) => acc + v, 0);
      // Ensure positive hardware latency compensation offset (or 0)
      return Math.max(0, sum / this.tapsHistory.length);
    }

    updateInstructionText() {
      if (!this.instructionText) return;
      if (this.tapCount === 8) {
        this.instructionText.textContent = this.app.t('latencyInitialHelp');
      } else if (this.tapCount > 0) {
        this.instructionText.textContent = this.app.t('latencyRemainingHelp', this.tapCount);
      } else {
        this.instructionText.textContent = this.app.t('latencyFinishedHelp');
      }
    }

    saveAndApply() {
      const finalMs = Math.round(this.getAverageOffset());

      // Save to localStorage
      localStorage.setItem('rcs_latency_offset', finalMs);

      // Apply to rhythmEngine
      if (this.app && this.app.rhythmEngine) {
        this.app.rhythmEngine.latencyOffsetMs = finalMs;
      }

      // Update debug slider and readout if debug panel initialized
      const dbgSlider = document.getElementById('dbg-slider-latency');
      const dbgVal = document.getElementById('dbg-val-latency');
      if (dbgSlider) dbgSlider.value = finalMs;
      if (dbgVal) dbgVal.textContent = `${finalMs}ms`;

      // Update settings drawer display
      if (this.app) {
        this.app.updateLatencyDisplay();
      }

      // Close modal
      this.close();
    }
  }

/* ==========================================================================
     6. MAIN APPLICATION CONTROLLER
     ========================================================================== */
  class App {
    constructor() {
      this.handRenderer = null;
      this.rhythmEngine = null;
      this.debugPanel = null;
      this.latencyCalibrator = null;

      this.cachedKnuckles = null;
      this.cachedTimelineLeft = 0;

      this.customSign1 = "1000";
      this.customSign2 = "1000";
      this.customPlaylist = [];
      this.isShuffleOn = false;

      this.currentLang = localStorage.getItem('rcs_lang') || 'fr';
      this.helpActiveTab = 'tutorial'; // 'tutorial' or 'history'
      this._lastScoreResults = null;

      this.config = {
        mode: 'imitate',
        bpm: 70,
        handViewMode: 'two',
        division: 'binary',
        level: 1,
        labelMode: 'solfege',
        isSubdivisionOn: false,
        metronomeSubdivision: localStorage.getItem('rcs_metronome_subdivision') || 'quarter',
        hearRhythmFirst: localStorage.getItem('rcs_hear_rhythm_first') !== 'false',
        isPracticeMode: localStorage.getItem('rcs_practice_mode') === 'true',
        repeatOnError: localStorage.getItem('rcs_practice_mode') === 'true'
      };
    }

    t(key, ...args) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.fr;
      const val = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.fr[key] || key);
      if (typeof val === 'function') {
        return val(...args);
      }
      return val;
    }

    setLanguage(lang) {
      if (!TRANSLATIONS[lang]) return;
      this.currentLang = lang;
      localStorage.setItem('rcs_lang', lang);
      document.documentElement.lang = lang;
      this.applyLanguage();
    }

    applyLanguage() {
      // 1. Language Flag buttons
      document.querySelectorAll('#ctrl-language .btn-lang-flag').forEach(btn => {
        if (btn.getAttribute('data-lang') === this.currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // 2. Top Nav
      const lblNavSettings = document.getElementById('lbl-nav-settings');
      if (lblNavSettings) lblNavSettings.textContent = this.t('navSettings');
      const btnOpenSettings = document.getElementById('btn-open-settings');
      if (btnOpenSettings) btnOpenSettings.title = this.t('openSettingsTooltip');
      const tempoDisplay = document.getElementById('tempo-display');
      if (tempoDisplay) tempoDisplay.title = this.t('tempoTooltip');
      const btnToggleEngineText = document.getElementById('btn-toggle-engine-text');
      if (btnToggleEngineText) {
        btnToggleEngineText.textContent = (this.rhythmEngine && this.rhythmEngine.isRunning) 
          ? this.t('btnStop') 
          : this.t('btnStart');
      }

      // 3. Settings Drawer
      const drawerTitle = document.getElementById('drawer-title');
      if (drawerTitle) drawerTitle.textContent = this.t('drawerTitle');
      const btnDrawerHelp = document.getElementById('btn-drawer-help');
      if (btnDrawerHelp) btnDrawerHelp.title = this.t('helpTooltip');
      const btnCloseSettings = document.getElementById('btn-close-settings');
      if (btnCloseSettings) btnCloseSettings.title = this.t('closeSettingsTooltip');

      const lblPracticeMode = document.getElementById('lbl-practice-mode');
      if (lblPracticeMode) lblPracticeMode.textContent = this.t('practiceMode');
      const lblPracticeDesc = document.getElementById('lbl-practice-desc');
      if (lblPracticeDesc) lblPracticeDesc.textContent = this.t('practiceDesc');
      const practiceRow = document.getElementById('row-toggle-practice');
      if (practiceRow) {
        practiceRow.title = this.t('tooltipPracticeToggle');
        practiceRow.setAttribute('data-tooltip', this.t('tooltipPracticeToggle'));
      }

      const lblMode = document.getElementById('lbl-mode');
      if (lblMode) lblMode.textContent = this.t('mode');
      const btnModeImitate = document.getElementById('btn-mode-imitate');
      if (btnModeImitate) {
        btnModeImitate.textContent = this.t('modeImitate');
        btnModeImitate.title = this.t('tooltipModeImitate');
        btnModeImitate.setAttribute('data-tooltip', this.t('tooltipModeImitate'));
      }
      const btnModeContinuous = document.getElementById('btn-mode-continuous');
      if (btnModeContinuous) {
        btnModeContinuous.textContent = this.t('modeContinuous');
        btnModeContinuous.title = this.t('tooltipModeContinuous');
        btnModeContinuous.setAttribute('data-tooltip', this.t('tooltipModeContinuous'));
      }

      const lblView = document.getElementById('lbl-view');
      if (lblView) lblView.textContent = this.t('view');
      const btnViewLeft = document.getElementById('btn-view-left');
      if (btnViewLeft) {
        btnViewLeft.textContent = this.t('viewLeft');
        btnViewLeft.title = this.t('tooltipViewLeft');
        btnViewLeft.setAttribute('data-tooltip', this.t('tooltipViewLeft'));
      }
      const btnViewRight = document.getElementById('btn-view-right');
      if (btnViewRight) {
        btnViewRight.textContent = this.t('viewRight');
        btnViewRight.title = this.t('tooltipViewRight');
        btnViewRight.setAttribute('data-tooltip', this.t('tooltipViewRight'));
      }
      const btnViewTwo = document.getElementById('btn-view-two');
      if (btnViewTwo) {
        btnViewTwo.textContent = this.t('viewTwo');
        btnViewTwo.title = this.t('tooltipViewTwo');
        btnViewTwo.setAttribute('data-tooltip', this.t('tooltipViewTwo'));
      }

      const lblSubdivision = document.getElementById('lbl-subdivision');
      if (lblSubdivision) lblSubdivision.textContent = this.t('subdivision');

      const lblLevel = document.getElementById('lbl-level');
      if (lblLevel) lblLevel.textContent = this.t('level');
      const btnLevel1 = document.getElementById('btn-level-1');
      if (btnLevel1) {
        btnLevel1.textContent = "🌱";
        btnLevel1.title = this.t('levelEasy');
        btnLevel1.setAttribute('aria-label', this.t('levelEasy'));
      }
      const btnLevel2 = document.getElementById('btn-level-2');
      if (btnLevel2) {
        btnLevel2.textContent = "🌻";
        btnLevel2.title = this.t('levelMedium');
        btnLevel2.setAttribute('aria-label', this.t('levelMedium'));
      }
      const btnLevel3 = document.getElementById('btn-level-3');
      if (btnLevel3) {
        btnLevel3.textContent = "🌶️";
        btnLevel3.title = this.t('levelHard');
        btnLevel3.setAttribute('aria-label', this.t('levelHard'));
      }
      const btnLevelCustom = document.getElementById('btn-level-custom');
      if (btnLevelCustom) {
        btnLevelCustom.textContent = "🛠️";
        btnLevelCustom.title = this.t('levelCustom');
        btnLevelCustom.setAttribute('aria-label', this.t('levelCustom'));
      }

      const customSecTitle = document.getElementById('custom-sec-title');
      if (customSecTitle) customSecTitle.textContent = this.t('customSeqTitle');
      const customHintText = document.getElementById('custom-hint-text');
      if (customHintText) customHintText.innerHTML = this.t('customHint');

      const lblMetronome = document.getElementById('lbl-metronome');
      if (lblMetronome) lblMetronome.textContent = this.t('metronome');

      const lblFingerLabels = document.getElementById('lbl-finger-labels');
      if (lblFingerLabels) lblFingerLabels.textContent = this.t('fingerLabels');
      const btnLabelSolfege = document.getElementById('btn-label-solfege');
      if (btnLabelSolfege) {
        btnLabelSolfege.textContent = this.t('labelSolfege');
        btnLabelSolfege.title = this.t('tooltipLabelSolfege');
        btnLabelSolfege.setAttribute('data-tooltip', this.t('tooltipLabelSolfege'));
      }
      const btnLabelNumbers = document.getElementById('btn-label-numbers');
      if (btnLabelNumbers) {
        btnLabelNumbers.textContent = this.t('labelNumbers');
        btnLabelNumbers.title = this.t('tooltipLabelNumbers');
        btnLabelNumbers.setAttribute('data-tooltip', this.t('tooltipLabelNumbers'));
      }
      const btnLabelErased = document.getElementById('btn-label-erased');
      if (btnLabelErased) {
        btnLabelErased.textContent = this.t('labelHidden');
        btnLabelErased.title = this.t('tooltipLabelHidden');
        btnLabelErased.setAttribute('data-tooltip', this.t('tooltipLabelHidden'));
      }

      // 4. Main Stage Controls & Tooltips
      const btnAddMainText = document.getElementById('btn-add-main-text');
      if (btnAddMainText) btnAddMainText.textContent = this.t('btnAdd');
      const btnAddMain = document.getElementById('btn-add-pattern-main');
      if (btnAddMain) btnAddMain.title = this.t('addPatternTooltip');
      const btnAddDrawer = document.getElementById('btn-add-pattern-drawer');
      if (btnAddDrawer) btnAddDrawer.title = this.t('addPatternTooltip');
      const btnShuffleMain = document.getElementById('btn-shuffle-playlist-main');
      if (btnShuffleMain) btnShuffleMain.title = this.t('shuffleTooltip');
      const btnShuffleDrawer = document.getElementById('btn-shuffle-playlist-drawer');
      if (btnShuffleDrawer) btnShuffleDrawer.title = this.t('shuffleTooltip');

      const tapHintText = document.getElementById('tap-hint-text');
      if (tapHintText) tapHintText.innerHTML = this.t('tapHint');

      const tapBtnText = document.getElementById('tap-btn-text');
      if (tapBtnText) {
        if (!this.rhythmEngine || !this.rhythmEngine.isRunning) {
          tapBtnText.textContent = this.t('tapRhythm');
        } else if (this.rhythmEngine.mode === 'continuous' || this.rhythmEngine.activePassNumber === 2) {
          tapBtnText.textContent = this.t('tapRhythm');
        } else {
          tapBtnText.textContent = this.t('listenRead');
        }
      }

      // 5. Latency settings & test elements
      const lblLatencyTest = document.getElementById('lbl-latency-test');
      if (lblLatencyTest) lblLatencyTest.textContent = this.t('latencySettingBtn');
      this.updateLatencyDisplay();

      const latencyModalTitle = document.getElementById('latency-modal-title');
      if (latencyModalTitle) latencyModalTitle.textContent = this.t('latencyModalTitle');
      const btnLatencyRestart = document.getElementById('btn-latency-restart');
      if (btnLatencyRestart) btnLatencyRestart.textContent = this.t('latencyBtnRestart');
      const btnLatencyConfirm = document.getElementById('btn-latency-confirm');
      if (btnLatencyConfirm) btnLatencyConfirm.textContent = this.t('latencyBtnLetsGo');
      const latencyResultLabel = document.getElementById('latency-result-label');
      if (latencyResultLabel) latencyResultLabel.textContent = this.t('latencyDetectedLabel');

      if (this.latencyCalibrator && this.latencyCalibrator.isOpen) {
        this.latencyCalibrator.updateInstructionText();
      }

      // 6. Modals (if currently open)
      const helpModal = document.getElementById('help-modal');
      if (helpModal && !helpModal.classList.contains('hidden')) {
        this.renderHelpContent();
      }

      const scoreModal = document.getElementById('score-modal');
      if (scoreModal && !scoreModal.classList.contains('hidden')) {
        const scoreTitle = document.getElementById('score-modal-title');
        if (scoreTitle) scoreTitle.textContent = this.t('scoreTitle');
        const btnRetry = document.getElementById('btn-score-retry');
        if (btnRetry) btnRetry.textContent = this.t('btnRetry');
        const btnClose = document.getElementById('btn-score-close');
        if (btnClose) btnClose.textContent = this.t('btnClose');
        if (this._lastScoreResults) {
          this.updateScoreMessage(this._lastScoreResults);
        }
      }
    }

    updateLatencyDisplay() {
      const displayEl = document.getElementById('latency-current-display');
      if (displayEl) {
        const currentMs = (this.rhythmEngine && this.rhythmEngine.latencyOffsetMs !== undefined)
          ? this.rhythmEngine.latencyOffsetMs
          : (parseInt(localStorage.getItem('rcs_latency_offset') || '0', 10));
        displayEl.textContent = `${this.t('latencyCurrentPrefix')}${currentMs} ms`;
      }
      const explainerEl = document.getElementById('latency-explainer-display');
      if (explainerEl) {
        explainerEl.textContent = this.t('latencyExplainer');
      }
    }

    updateMetronomeButtonsForDivision(division) {
      const isTernary = division === 'ternary';
      const metroContainer = document.getElementById('ctrl-metronome');
      if (!metroContainer) return;

      const binaryBtns = metroContainer.querySelectorAll('.metro-btn-binary');
      const ternaryBtns = metroContainer.querySelectorAll('.metro-btn-ternary');

      if (isTernary) {
        binaryBtns.forEach(b => b.classList.add('hidden'));
        ternaryBtns.forEach(b => b.classList.remove('hidden'));

        if (this.config.metronomeSubdivision === 'eighth' || this.config.metronomeSubdivision === 'sixteenth') {
          this.config.metronomeSubdivision = 'ternary-all';
          localStorage.setItem('rcs_metronome_subdivision', 'ternary-all');
          this.rhythmEngine.setSettings({ metronomeSubdivision: 'ternary-all' });
        }
      } else {
        binaryBtns.forEach(b => b.classList.remove('hidden'));
        ternaryBtns.forEach(b => b.classList.add('hidden'));

        if (this.config.metronomeSubdivision === 'ternary-all') {
          this.config.metronomeSubdivision = 'sixteenth';
          localStorage.setItem('rcs_metronome_subdivision', 'sixteenth');
          this.rhythmEngine.setSettings({ metronomeSubdivision: 'sixteenth' });
        }
      }

      metroContainer.querySelectorAll('.seg-btn').forEach(btn => {
        if (btn.getAttribute('data-val') === this.config.metronomeSubdivision) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    renderHelpContent() {
      const titleEl = document.getElementById('help-modal-title');
      const tabToggleBtn = document.getElementById('btn-toggle-help-tab');
      const contentArea = document.getElementById('help-content-area');
      if (!titleEl || !tabToggleBtn || !contentArea) return;

      if (this.helpActiveTab === 'tutorial') {
        titleEl.textContent = this.t('tabTutorial');
        tabToggleBtn.textContent = this.t('tabHistory');

        if (this.currentLang === 'es') {
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>¡Bienvenido al Ritmo con Señas!</h3>
              <p>Imagina tus manos como una partitura viva que se despliega ante tus ojos en tiempo real. En la vista a dos manos, la mano izquierda interpreta el primer pulso y la mano derecha el segundo. Cada dedo levantado es un golpe activo que debes tocar, y cada dedo replegado es un silencio. La lectura fluye con total naturalidad de izquierda a derecha, acompañando las sílabas del solfeo rítmico: <strong>Ta-Ka-Di-Mi</strong> en binario (índice, medio, anular, meñique) o <strong>Ta-Ki-Da</strong> en ternario.</p>
            </div>

            <div class="help-section">
              <h3>Precisión y puntos de respuesta</h3>
              <p>Cuando comience el ritmo, toca la barra espaciadora o el botón al pulso exacto. Bajo tus dedos, los puntos te responden al instante mediante un sistema de tolerancia de tres niveles: el <strong>verde</strong> premia una frappe precisa. El <strong>naranja</strong> avisa de un golpe cercano pero imperfecto: una flecha hacia la izquierda (<strong>&lt;</strong>) indica que tocaste antes de tiempo, mientras que hacia la derecha (<strong>&gt;</strong>) indica que tocaste tarde. El <strong>rojo</strong> señala un error claro: gran desfase de tiempo, golpe sobre un silencio o golpe duplicado. Recuerda calibrar tu dispositivo en los ajustes para mayor precisión.</p>
            </div>

            <div class="help-section">
              <h3>Entrenamiento y progresión</h3>
              <p>En el modo normal, completas el desafío de una serie de diez compases para obtener tu puntuación final, donde únicamente los compases 100 % verdes son validados. Si prefieres practicar sin presión, activa la opción <strong>Práctica</strong>: el ritmo se repetirá en bucle hasta que tu memoria muscular lo domine por completo.</p>
            </div>

            <div class="help-section">
              <h3>Atajos de teclado</h3>
              <p>Presiona <kbd>S</kbd> para Iniciar o Detener el ritmo, toca con <kbd>Espacio</kbd> y abre los ajustes en cualquier momento con <kbd>Esc</kbd>.</p>
            </div>
          `;
        } else if (this.currentLang === 'en') {
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>Welcome to Rhythm with Signs!</h3>
              <p>Think of the hands on screen as a living sheet of music unfolding right before you in real time. When using two hands, your left hand plays beat one and your right hand plays beat two. A raised finger represents an active rhythmic hit, while a curled finger is a rest. Reading flows naturally from left to right, echoing the rhythm syllables you speak: <strong>Ta-Ka-Di-Mi</strong> in binary (index, middle, ring, pinky) or <strong>Ta-Ki-Da</strong> in ternary.</p>
            </div>

            <div class="help-section">
              <h3>Feedback & Timing Precision</h3>
              <p>As the groove starts, hit the spacebar or tap button right in the pocket. The feedback dots tell you the truth immediately through a three-tier tolerance system: <strong>green</strong> rewards a precise hit. <strong>Orange</strong> signals a near-miss: an arrow pointing left (<strong>&lt;</strong>) shows you were early, while an arrow pointing right (<strong>&gt;</strong>) shows you were late. <strong>Red</strong> flags a clear mistake: gross timing offset, striking a rest, or an extra duplicate tap. Remember to calibrate your device in settings for best precision.</p>
            </div>

            <div class="help-section">
              <h3>Practice & Progression</h3>
              <p>In normal play, you take on a 10-measure challenge to earn your accuracy score, where only entirely green patterns count as a victory. If you would rather shed without pressure, turn on <strong>Practice</strong> to loop patterns seamlessly until your muscle memory takes over.</p>
            </div>

            <div class="help-section">
              <h3>Direct Controls</h3>
              <p>Press <kbd>S</kbd> to start or stop the metronome, tap with <kbd>Space</kbd>, and open settings anytime with <kbd>Esc</kbd>.</p>
            </div>
          `;
        } else {
          // French (Default)
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>Bienvenue dans le Rythme Signé !</h3>
              <p>Imaginez vos mains comme une partition vivante qui défile sous vos yeux en temps réel. Lorsque vous jouez à deux mains, la main gauche représente le premier temps et la main droite le second. Chaque doigt levé est une note active à frapper, chaque doigt replié est un silence. La lecture se fait tout naturellement de gauche à droite, comme si vous chantiez les subdivisions : <strong>Ta-Ka-Di-Mi</strong> en binaire (index, majeur, annulaire, auriculaire) ou <strong>Ta-Ki-Da</strong> en ternaire.</p>
            </div>

            <div class="help-section">
              <h3>La précision au doigt et à l'œil</h3>
              <p>Quand le rythme démarre, frappez la barre d'espace ou le bouton au tempo exact. Sous vos doigts, les pastilles vous répondent instantanément selon un système de tolérance à trois niveaux : le <strong>vert</strong> récompense une frappe précise. L'<strong>orange</strong> vous signale une frappe proche mais imparfaite : une petite flèche vers la gauche (<strong>&lt;</strong>) indique que vous êtes en avance, tandis qu'une flèche vers la droite (<strong>&gt;</strong>) indique un retard. Le <strong>rouge</strong> sanctionne une erreur franche : frappe trop décalée, coup sur un silence ou frappe en trop. Pensez à calibrer votre appareil dans les réglages pour plus de précision.</p>
            </div>

            <div class="help-section">
              <h3>Entraînement & Progression</h3>
              <p>En fonctionnement normal, vous relevez le défi d'une série de dix mesures pour décrocher votre score de précision, où seules les mesures 100 % vertes sont validées. Si vous préférez travailler sans pression, activez l'option <strong>Répétition</strong> : le rythme tournera en boucle jusqu'à ce que votre geste devienne une seconde nature.</p>
            </div>

            <div class="help-section">
              <h3>Commandes directes</h3>
              <p>Appuyez sur <kbd>S</kbd> pour lancer ou arrêter le métronome, frappez avec <kbd>Espace</kbd>, et ouvrez les réglages à tout moment avec <kbd>Échap</kbd>.</p>
            </div>
          `;
        }
      } else {
        // HISTORY TAB
        titleEl.textContent = this.t('tabHistory');
        tabToggleBtn.textContent = this.t('tabTutorial');

        if (this.currentLang === 'es') {
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>Orígenes</h3>
              <p>El <strong>Ritmo con Señas</strong> es un lenguaje de señas musicales creado en <strong>2006</strong> en Buenos Aires (Argentina) por el músico, compositor y director <strong>Santiago Vazquez</strong>.</p>
              <p>Creado originalmente para dirigir en vivo al emblemático grupo de percusión <strong>La Bomba de Tiempo</strong>, este sistema reúne hoy más de 150 señas gestuales que permiten a un director guiar la composición e improvisación rítmica colectiva en tiempo real.</p>
            </div>

            <div class="help-section">
              <h3>Usos y Pedagogía</h3>
              <p>El <strong>Ritmo con Señas</strong> se utiliza en todo el mundo para:</p>
              <ul>
                <li><strong>Ensambles de percusión y orquestas</strong>: Creación espontánea de polirritmias complejas y dirección en vivo.</li>
                <li><strong>Pedagogía del ritmo</strong>: Internalización del pulso, subdivisiones binarias/ternarias y disociación motriz.</li>
                <li><strong>Lectura de dedos</strong>: Cada dedo representa una subdivisión exacta del pulso, transformando la mano en una partitura visual instantánea.</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Español</h3>
              <p><em>En homenaje al creador argentino del Ritmo con Señas, Santiago Vazquez, esta aplicación está completamente disponible en español.</em></p>
            </div>

            <div class="credits-box">
              <div class="credits-authors">Hatep with Gemini</div>
              <div class="credits-license">© 2026 &middot; GNU GPLv3 (Free to share &amp; change with source)</div>
            </div>
          `;
        } else if (this.currentLang === 'en') {
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>Origins</h3>
              <p>The <strong>Ritmo con Señas</strong> (Rhythm with Signs) is a musical sign language created in <strong>2006</strong> in Buenos Aires, Argentina, by musician, composer, and conductor <strong>Santiago Vazquez</strong>.</p>
              <p>Originally designed to direct live collective improvisation with the famous percussion ensemble <strong>La Bomba de Tiempo</strong>, the system comprises over 150 hand gestures enabling a conductor to shape rhythms, polyrhythms, and grooves in real time.</p>
            </div>

            <div class="help-section">
              <h3>Uses & Pedagogy</h3>
              <p><strong>Rhythm with Signs</strong> is practiced worldwide across diverse musical contexts:</p>
              <ul>
                <li><strong>Percussion Ensembles & Bands</strong>: Spontaneous collective composition, dynamic arrangement, and live conducting.</li>
                <li><strong>Rhythm Pedagogy & Education</strong>: Internalizing pulse, binary/ternary subdivision fluency, and motor coordination.</li>
                <li><strong>Finger Reading</strong>: Transforming the human hand into a dynamic living score where each finger represents an exact subdivision.</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Spanish</h3>
              <p><em>To honor the Argentine creator of Ritmo con Señas, Santiago Vazquez, the app is fully available in Spanish.</em></p>
            </div>

            <div class="credits-box">
              <div class="credits-authors">Hatep with Gemini</div>
              <div class="credits-license">© 2026 &middot; GNU GPLv3 (Free to share &amp; change with source)</div>
            </div>
          `;
        } else {
          // French (Default)
          contentArea.innerHTML = `
            <div class="help-section">
              <h3>Origines</h3>
              <p>Le <strong>Ritmo con Señas</strong> (Rythme Signé) est un langage musical gestuel créé en <strong>2006</strong> à Buenos Aires (Argentine) par le musicien, chef d'orchestre et pédagogue <strong>Santiago Vazquez</strong>.</p>
              <p>Conçu à l'origine pour diriger en direct le groupe de percussions culte <strong>La Bomba de Tiempo</strong>, ce langage réunit aujourd'hui plus de 150 signes manuels permettant à un chef de composer et improviser collectivement en temps réel avec un ensemble instrumental.</p>
            </div>

            <div class="help-section">
              <h3>Utilisations & Pédagogie</h3>
              <p>Le <strong>Rythme Signé</strong> s'est répandu dans le monde entier et est utilisé pour :</p>
              <ul>
                <li><strong>La direction d'ensembles & percussions</strong> : Composition collective spontanée, groove et polyrythmies complexes.</li>
                <li><strong>La pédagogie rythmique</strong> : Intériorisation du tempo, maîtrise des subdivisions binaires et ternaires, et travail de dissociation corporelle.</li>
                <li><strong>La lecture des doigts</strong> : Chaque doigt représente une subdivision précise du temps, transformant la main en une partition vivante et immédiate sans support papier.</li>
              </ul>
            </div>

            <div class="help-section">
              <h3>Espagnol</h3>
              <p><em>Pour rendre hommage à Santiago Vazquez, créateur argentin du Ritmo con Señas, cette application est entièrement disponible en espagnol.</em></p>
            </div>

            <div class="credits-box">
              <div class="credits-authors">Hatep with Gemini</div>
              <div class="credits-license">© 2026 &middot; GNU GPLv3 (Free to share &amp; change with source)</div>
            </div>
          `;
        }
      }
    }

    openHelpModal() {
      const backdrop = document.getElementById('help-modal-backdrop');
      const modal = document.getElementById('help-modal');
      if (!backdrop || !modal) return;
      this.renderHelpContent();
      backdrop.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    closeHelpModal() {
      const backdrop = document.getElementById('help-modal-backdrop');
      const modal = document.getElementById('help-modal');
      backdrop?.classList.add('hidden');
      modal?.classList.add('hidden');
    }

    toggleHelpTab() {
      this.helpActiveTab = (this.helpActiveTab === 'tutorial') ? 'history' : 'tutorial';
      this.renderHelpContent();
    }

    openDrawer() {
      const drawer = document.getElementById('settings-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      drawer?.classList.add('open');
      backdrop?.classList.add('open');
    }

    closeDrawer() {
      const drawer = document.getElementById('settings-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      drawer?.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.classList.remove('hands-spotlight');
    }

    triggerElementFlash(el) {
      if (!el) return;
      el.classList.remove('flash-setting-twice');
      // Force DOM reflow to restart animation reliably
      void el.offsetWidth;
      el.classList.add('flash-setting-twice');
      setTimeout(() => {
        el.classList.remove('flash-setting-twice');
      }, 1500);
    }

    activatePracticeModeFromScore() {
      this.closeScoreModal();
      this.openDrawer();

      const practiceToggle = document.getElementById('toggle-practice-mode');
      const practiceRow = document.getElementById('row-toggle-practice');

      if (practiceToggle && !practiceToggle.checked) {
        practiceToggle.checked = true;
        this.config.isPracticeMode = true;
        localStorage.setItem('rcs_practice_mode', true);
        this.rhythmEngine.setSettings({ isPracticeMode: true });
        const progressPill = document.getElementById('exercise-progress-pill');
        if (progressPill) progressPill.classList.add('hidden');
      }

      const targetToFlash = practiceRow || practiceToggle;
      setTimeout(() => {
        targetToFlash?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        this.triggerElementFlash(targetToFlash);
      }, 150);
    }

    increaseDifficultyFromScore() {
      this.closeScoreModal();
      this.openDrawer();

      const currentLevel = (typeof this.config.level === 'number') ? this.config.level : 1;
      const nextLevel = Math.min(3, currentLevel + 1);

      const targetBtn = document.getElementById(`btn-level-${nextLevel}`);
      if (targetBtn) {
        targetBtn.click();
      }

      const ctrlLevel = document.getElementById('ctrl-level');
      setTimeout(() => {
        const toFlash = targetBtn || ctrlLevel;
        toFlash?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        this.triggerElementFlash(toFlash);
      }, 150);
    }

    openLatencyModalFromScore() {
      this.closeScoreModal();
      if (this.latencyCalibrator) {
        this.latencyCalibrator.open();
      }
    }

    updateScoreMessage(results) {
      const headlineEl = document.getElementById('score-modal-headline');
      const subtextEl = document.getElementById('score-modal-subtext');
      if (!headlineEl || !subtextEl) return;

      const correct = results.correct || 0;
      const isAdvancedOrCustom = (this.config.level === 3 || this.config.level === 'custom');

      // Check for consistent timing bias (indicates hardware latency or systematic rushing/dragging)
      let biasNotice = '';
      if (this.debugPanel && Array.isArray(this.debugPanel.exerciseTaps) && this.debugPanel.exerciseTaps.length >= 6) {
        const taps = this.debugPanel.exerciseTaps;
        const mean = taps.reduce((acc, v) => acc + v, 0) / taps.length;

        // Consistent bias (|mean| >= 18ms)
        if (Math.abs(mean) >= 18) {
          biasNotice = (mean < 0)
            ? `<div class="score-bias-notice" style="margin-top: 10px; font-size: 13px; opacity: 0.95;">${this.t('scoreTextCalibrationAhead')}</div>`
            : `<div class="score-bias-notice" style="margin-top: 10px; font-size: 13px; opacity: 0.95;">${this.t('scoreTextCalibrationBehind')}</div>`;
        }
      }

      if (correct === 0) {
        headlineEl.textContent = this.t('scoreHeadlineZero');
        subtextEl.innerHTML = this.t('scoreTextPractice') + biasNotice;
      } else if (correct < 7) {
        headlineEl.textContent = this.t('scoreHeadlineLow');
        subtextEl.innerHTML = this.t('scoreTextPractice') + biasNotice;
      } else if (correct < 10) {
        if (isAdvancedOrCustom) {
          headlineEl.textContent = this.t('scoreHeadlineAdvanced');
          subtextEl.innerHTML = this.t('scoreTextAdvanced') + biasNotice;
        } else {
          headlineEl.textContent = this.t('scoreHeadlineGood');
          subtextEl.innerHTML = this.t('scoreTextDiff') + biasNotice;
        }
      } else {
        // Perfect score (10/10)
        if (isAdvancedOrCustom) {
          headlineEl.textContent = this.t('scoreHeadlinePerfectAdv');
          subtextEl.innerHTML = this.t('scoreTextAdvancedPerfect') + biasNotice;
        } else {
          headlineEl.textContent = this.t('scoreHeadlinePerfect');
          subtextEl.innerHTML = this.t('scoreTextDiffPerfect') + biasNotice;
        }
      }

      // Attach click listeners to interactive links inside the message
      subtextEl.querySelectorAll('.score-interactive-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const action = link.getAttribute('data-action');
          if (action === 'practice') {
            this.activatePracticeModeFromScore();
          } else if (action === 'difficulty') {
            this.increaseDifficultyFromScore();
          } else if (action === 'calibrate') {
            this.openLatencyModalFromScore();
          }
        });
      });
    }

    showScoreModal(results) {
      this._lastScoreResults = results;
      const backdrop = document.getElementById('score-modal-backdrop');
      const modal = document.getElementById('score-modal');
      const valCorrect = document.getElementById('score-val-correct');
      const valPercent = document.getElementById('score-val-percent');
      const title = document.getElementById('score-modal-title');
      const btnRetry = document.getElementById('btn-score-retry');
      const btnClose = document.getElementById('btn-score-close');

      if (!backdrop || !modal) return;

      if (title) title.textContent = this.t('scoreTitle');
      if (btnRetry) btnRetry.textContent = this.t('btnRetry');
      if (btnClose) btnClose.textContent = this.t('btnClose');

      const correct = results.correct || 0;
      const total = results.total || 10;
      const pct = Math.round((correct / total) * 100);

      if (valCorrect) valCorrect.textContent = correct;
      if (valPercent) valPercent.textContent = `${pct}%`;

      this.updateScoreMessage(results);

      backdrop.classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    closeScoreModal() {
      const backdrop = document.getElementById('score-modal-backdrop');
      const modal = document.getElementById('score-modal');
      backdrop?.classList.add('hidden');
      modal?.classList.add('hidden');
    }

    init() {
      this.handRenderer = new HandRenderer('hands-wrapper');
      this.handRenderer.setSettings(this.config.division, this.config.handViewMode, this.config.labelMode);

      this.handRenderer.onFingerClick = (side, fingerId) => {
        if (this.config.level !== 'custom') return;
        if (this.rhythmEngine.isRunning) return;
        this.handleFingerClick(side, fingerId);
      };

      this.rhythmEngine = new RhythmEngine(
        this.handRenderer,
        (state) => this.onEngineStateUpdate(state),
        (evalData) => this.onTapEvaluation(evalData)
      );
      this.rhythmEngine.setSettings(this.config);

      // Countdown sync callback
      this.rhythmEngine.onCountdown = (countVal) => {
        const overlay = document.getElementById('countdown-overlay');
        const numEl = document.getElementById('countdown-number');
        if (!overlay || !numEl) return;

        if (countVal === null) {
          overlay.classList.add('hidden');
        } else {
          overlay.classList.remove('hidden');
          numEl.textContent = countVal;
          numEl.style.animation = 'none';
          void numEl.offsetWidth; // re-trigger animation
          numEl.style.animation = '';
        }
      };

      // 10-Hand Exercise Complete callback
      this.rhythmEngine.onExerciseComplete = (results) => {
        const btnToggle = document.getElementById('btn-toggle-engine');
        const btnToggleText = document.getElementById('btn-toggle-engine-text');
        const tapBtn = document.getElementById('tap-btn');
        const tapBtnSpan = tapBtn ? tapBtn.querySelector('span') : null;
        const progressPill = document.getElementById('exercise-progress-pill');

        btnToggle.className = 'btn-train-action btn-start';
        if (btnToggleText) btnToggleText.textContent = this.t('btnStart');
        document.body.classList.remove('phase-demo', 'phase-imitate');
        if (tapBtnSpan) tapBtnSpan.textContent = this.t('tapRhythm');
        if (progressPill) progressPill.classList.add('hidden');
        this.renderActivePlayingChip(null);

        this.showScoreModal(results);
      };

      this.rhythmEngine.onConductorGesture = (beatDurationMs, presetId, lift) => {
        this.triggerConductorGesture(beatDurationMs, presetId, lift);
      };
      this.rhythmEngine.onConductorCancel = () => {
        this.cancelConductorGesture();
      };

      this.debugPanel = new DebugPanel(
        this.rhythmEngine,
        (toggles) => this.onDebugTogglesChange(toggles),
        (gestureType) => {
          const beatDurationMs = 60000 / this.config.bpm;
          if (gestureType === 'pulse') {
            this.triggerConductorGesture(beatDurationMs, 'pulse', this.rhythmEngine.conductorPulseLiftHeight);
          } else {
            this.triggerConductorGesture(beatDurationMs, 'activation', this.rhythmEngine.conductorLiftHeight);
          }
        },
        (settings) => {
          if (settings.auto !== undefined) {
            this.rhythmEngine.conductorGestureAuto = settings.auto;
            localStorage.setItem('rcs_conductor_auto', settings.auto);
          }
          if (settings.pulseAuto !== undefined) {
            this.rhythmEngine.conductorPulseAuto = settings.pulseAuto;
            localStorage.setItem('rcs_conductor_pulse_auto', settings.pulseAuto);
          }
          if (settings.lift !== undefined) {
            this.rhythmEngine.conductorLiftHeight = settings.lift;
            localStorage.setItem('rcs_conductor_lift', settings.lift);
          }
          if (settings.pulseLift !== undefined) {
            this.rhythmEngine.conductorPulseLiftHeight = settings.pulseLift;
            localStorage.setItem('rcs_conductor_pulse_lift', settings.pulseLift);
          }
          if (settings.cutoff !== undefined) {
            this.rhythmEngine.conductorBpmCutoff = settings.cutoff;
            localStorage.setItem('rcs_conductor_cutoff', settings.cutoff);
          }
          if (settings.fingerTransitionSubSlow !== undefined) {
            this.rhythmEngine.fingerTransitionSubSlow = settings.fingerTransitionSubSlow;
            localStorage.setItem('rcs_finger_transition_sub_slow', settings.fingerTransitionSubSlow);
          }
          if (settings.fingerTransitionSubFast !== undefined) {
            this.rhythmEngine.fingerTransitionSubFast = settings.fingerTransitionSubFast;
            localStorage.setItem('rcs_finger_transition_sub_fast', settings.fingerTransitionSubFast);
          }
          if (settings.pulseFastStyle !== undefined) {
            this.rhythmEngine.conductorPulseFastStyle = settings.pulseFastStyle;
            localStorage.setItem('rcs_conductor_pulse_fast_style', settings.pulseFastStyle);
          }
          if (settings.pulseStyle !== undefined) {
            this.rhythmEngine.conductorPulseStyle = settings.pulseStyle;
            localStorage.setItem('rcs_conductor_pulse_style', settings.pulseStyle);
          }
          if (settings.ternaryProposal !== undefined) {
            this.rhythmEngine.conductorTernaryProposal = settings.ternaryProposal;
            localStorage.setItem('rcs_conductor_ternary_proposal', settings.ternaryProposal);
          }
        },
        (score) => {
          if (this.rhythmEngine.isRunning) {
            this.rhythmEngine.stop();
            const btnToggle = document.getElementById('btn-toggle-engine');
            const btnToggleText = document.getElementById('btn-toggle-engine-text');
            if (btnToggle) btnToggle.className = 'btn-train-action btn-start';
            if (btnToggleText) btnToggleText.textContent = this.t('btnStart');
            document.body.classList.remove('phase-demo', 'phase-imitate');
          }
          this.showScoreModal({
            correct: score,
            total: 10
          });
        }
      );

      // Initialize Latency Calibrator
      this.latencyCalibrator = new LatencyCalibrator(this);

      this.bindUiEvents();
      this.initTouchTooltips();
      this.applyLanguage();
      this.updateMetronomeButtonsForDivision(this.config.division);

      window.addEventListener('resize', () => this.updateKnuckleTimelines());
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => this.updateKnuckleTimelines());
      }
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.updateKnuckleTimelines(), 150);
      });
      setTimeout(() => this.updateKnuckleTimelines(), 200);
    }

    initTouchTooltips() {
      let tooltipEl = document.getElementById('touch-tooltip-bubble');
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'touch-tooltip-bubble';
        tooltipEl.className = 'touch-tooltip-bubble';
        document.body.appendChild(tooltipEl);
      }

      let pressTimer = null;
      let targetEl = null;
      let startX = 0;
      let startY = 0;
      let didShowTooltip = false;

      const hideTooltip = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
        tooltipEl.classList.remove('visible');
        setTimeout(() => {
          if (!tooltipEl.classList.contains('visible')) {
            tooltipEl.style.display = 'none';
          }
        }, 160);
        targetEl = null;
        didShowTooltip = false;
      };

      const showTooltip = (el) => {
        const text = el.getAttribute('data-tooltip') || el.getAttribute('title');
        if (!text) return;

        // If title is used, temporarily store it so native browser title doesn't fight with touch
        if (el.hasAttribute('title')) {
          el.setAttribute('data-tooltip', text);
          el.removeAttribute('title');
        }

        tooltipEl.textContent = text;
        tooltipEl.style.display = 'block';
        tooltipEl.classList.remove('position-below');

        const rect = el.getBoundingClientRect();
        const tooltipWidth = tooltipEl.offsetWidth || 180;
        let left = rect.left + rect.width / 2;
        let top = rect.top;

        // Keep within viewport boundaries
        left = Math.max(tooltipWidth / 2 + 10, Math.min(window.innerWidth - tooltipWidth / 2 - 10, left));

        if (top < 50) {
          // If too close to screen top, show below the element
          top = rect.bottom;
          tooltipEl.classList.add('position-below');
        }

        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;

        void tooltipEl.offsetWidth; // Force reflow
        tooltipEl.classList.add('visible');
        didShowTooltip = true;

        // Subtle haptic feedback if supported on device
        if (navigator.vibrate) {
          try { navigator.vibrate(20); } catch (_) {}
        }
      };

      // Listen on touch/pointer events globally with event delegation
      document.addEventListener('pointerdown', (e) => {
        // Only trigger on primary touch pointers or pen
        if (e.pointerType === 'mouse') return;

        const el = e.target.closest('[title], [data-tooltip]');
        if (!el) return;

        targetEl = el;
        startX = e.clientX;
        startY = e.clientY;
        didShowTooltip = false;

        pressTimer = setTimeout(() => {
          showTooltip(el);
        }, 400); // 400ms long-press threshold
      }, { passive: true });

      document.addEventListener('pointermove', (e) => {
        if (!targetEl) return;
        const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
        // If user scrolls/drags more than 8px, cancel the long press
        if (dist > 8) {
          hideTooltip();
        }
      }, { passive: true });

      document.addEventListener('pointerup', (e) => {
        if (didShowTooltip) {
          // Prevent standard click triggering if long press was active
          e.preventDefault();
        }
        hideTooltip();
      });

      document.addEventListener('pointercancel', hideTooltip);

      // Prevent native context menu from popping up over custom long-press tooltip
      document.addEventListener('contextmenu', (e) => {
        if (didShowTooltip || e.target.closest('[title], [data-tooltip]')) {
          e.preventDefault();
        }
      });
    }

    bindUiEvents() {
      const drawer = document.getElementById('settings-drawer');
      const backdrop = document.getElementById('drawer-backdrop');
      const openDrawer = () => {
        drawer.classList.add('open');
        backdrop.classList.add('open');
      };
      const closeDrawer = () => {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.classList.remove('hands-spotlight');
      };

      document.getElementById('btn-open-settings').addEventListener('click', () => this.openDrawer());
      document.getElementById('btn-close-settings').addEventListener('click', () => this.closeDrawer());
      backdrop.addEventListener('click', () => this.closeDrawer());

      // When settings drawer is open: clicking on a finger keeps it open and allows shaping,
      // but clicking on anything that's NOT a finger closes the settings menu immediately!
      document.addEventListener('pointerdown', (e) => {
        if (!drawer.classList.contains('open')) return;

        // If clicking a finger on the hands, allow shaping without closing drawer
        if (e.target.closest('.finger-container')) {
          return;
        }

        // If clicking inside the drawer itself or on the open button, allow drawer interaction
        if (e.target.closest('#settings-drawer') || e.target.closest('#btn-open-settings')) {
          return;
        }

        // Clicked on something that's NOT a finger:
        // The settings menu disappears and we return to the active screen!
        this.closeDrawer();
      });

      // Language switcher flag buttons
      document.querySelectorAll('#ctrl-language .btn-lang-flag').forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          if (lang) this.setLanguage(lang);
        });
      });

      // Help Modal event listeners
      document.getElementById('btn-drawer-help')?.addEventListener('click', () => this.openHelpModal());
      document.getElementById('btn-toggle-help-tab')?.addEventListener('click', () => this.toggleHelpTab());
      document.getElementById('btn-close-help')?.addEventListener('click', () => this.closeHelpModal());
      document.getElementById('help-modal-backdrop')?.addEventListener('click', () => this.closeHelpModal());

      // Latency Modal trigger event listener
      document.getElementById('btn-open-latency-modal')?.addEventListener('click', () => {
        if (this.latencyCalibrator) {
          this.latencyCalibrator.open();
        }
      });

      // Score Modal event listeners
      document.getElementById('score-modal-close-btn')?.addEventListener('click', () => this.closeScoreModal());
      document.getElementById('btn-score-close')?.addEventListener('click', () => this.closeScoreModal());
      document.getElementById('score-modal-backdrop')?.addEventListener('click', () => this.closeScoreModal());

      const tapBtn = document.getElementById('tap-btn');
      const tapBtnSpan = tapBtn ? tapBtn.querySelector('span') : null;
      const btnToggle = document.getElementById('btn-toggle-engine');
      const btnToggleText = document.getElementById('btn-toggle-engine-text');
      const progressPill = document.getElementById('exercise-progress-pill');

      const toggleTraining = () => {
        if (this.rhythmEngine.isRunning) {
          this.rhythmEngine.stop();
          btnToggle.className = 'btn-train-action btn-start';
          if (btnToggleText) btnToggleText.textContent = this.t('btnStart');
          document.body.classList.remove('phase-demo', 'phase-imitate');
          if (tapBtnSpan) tapBtnSpan.textContent = this.t('tapRhythm');
          if (progressPill) progressPill.classList.add('hidden');
          const countdownOverlay = document.getElementById('countdown-overlay');
          countdownOverlay?.classList.add('hidden');
          this.renderActivePlayingChip(null);
        } else {
          this.closeScoreModal();
          if (this.debugPanel) {
            this.debugPanel.resetStats();
          }
          this.rhythmEngine.start();
          btnToggle.className = 'btn-train-action btn-stop';
          if (btnToggleText) btnToggleText.textContent = this.t('btnStop');
          if (this.config.mode === 'continuous') {
            document.body.classList.remove('phase-demo');
            document.body.classList.add('phase-imitate');
            if (tapBtnSpan) tapBtnSpan.textContent = this.t('tapRhythm');
          }
        }
      };

      btnToggle.addEventListener('click', toggleTraining);

      document.getElementById('btn-score-retry')?.addEventListener('click', () => {
        this.closeScoreModal();
        toggleTraining();
      });

      const triggerTap = (eventTimeStamp) => {
        tapBtn.classList.add('tap-active');
        setTimeout(() => tapBtn.classList.remove('tap-active'), 80);
        this.rhythmEngine.handleUserTap(eventTimeStamp);
      };

      tapBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerTap(e.timeStamp);
      });

      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        if (e.code === 'Space') {
          e.preventDefault();
          if (e.repeat) return; // Prevent OS key repeat delays and unwanted duplicate fires
          if (this.latencyCalibrator && this.latencyCalibrator.isOpen) {
            this.latencyCalibrator.handleTap(e.timeStamp);
          } else {
            triggerTap(e.timeStamp);
          }
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          if (this.latencyCalibrator && this.latencyCalibrator.isOpen) return;
          toggleTraining();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (this.latencyCalibrator && this.latencyCalibrator.isOpen) {
            this.latencyCalibrator.close();
            return;
          }
          const helpModal = document.getElementById('help-modal');
          if (helpModal && !helpModal.classList.contains('hidden')) {
            this.closeHelpModal();
            return;
          }
          const scoreModal = document.getElementById('score-modal');
          if (scoreModal && !scoreModal.classList.contains('hidden')) {
            this.closeScoreModal();
            return;
          }
          if (drawer.classList.contains('open')) {
            this.closeDrawer();
          } else {
            this.openDrawer();
          }
        }
      });

      // Warm up and unblock Web AudioContext on very first user action to eliminate initial audio resume latency
      const unlockAudio = () => {
        audioEngine.ensureRunning();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });

      const tempoDisplay = document.getElementById('tempo-display');
      const updateTempo = (newBpm) => {
        const clamped = Math.max(40, Math.min(180, newBpm));
        this.config.bpm = clamped;
        if (tempoDisplay) {
          tempoDisplay.textContent = `${clamped} BPM`;
        }
        this.rhythmEngine.setSettings({ bpm: clamped });
      };

      // 4 Stepper buttons: "<" (-10), "-" (-2), "+" (+2), ">" (+10)
      const btnTempoDownFast = document.getElementById('btn-tempo-down-fast');
      const btnTempoDown = document.getElementById('btn-tempo-down');
      const btnTempoUp = document.getElementById('btn-tempo-up');
      const btnTempoUpFast = document.getElementById('btn-tempo-up-fast');

      btnTempoDownFast?.addEventListener('click', () => updateTempo(this.config.bpm - 10));
      btnTempoDown?.addEventListener('click', () => updateTempo(this.config.bpm - 2));
      btnTempoUp?.addEventListener('click', () => updateTempo(this.config.bpm + 2));
      btnTempoUpFast?.addEventListener('click', () => updateTempo(this.config.bpm + 10));

      // Inline keyboard edit on click of the BPM tempo display
      if (tempoDisplay) {
        tempoDisplay.addEventListener('click', () => {
          if (tempoDisplay.querySelector('input')) return; // already editing

          const currentVal = this.config.bpm;
          const input = document.createElement('input');
          input.type = 'number';
          input.min = '40';
          input.max = '180';
          input.value = currentVal;
          input.className = 'tempo-input';

          const commitEdit = () => {
            const parsed = parseInt(input.value, 10);
            if (!isNaN(parsed)) {
              updateTempo(parsed);
            } else {
              tempoDisplay.textContent = `${this.config.bpm} BPM`;
            }
          };

          input.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              commitEdit();
            } else if (e.key === 'Escape') {
              tempoDisplay.textContent = `${this.config.bpm} BPM`;
            }
          });

          input.addEventListener('blur', commitEdit);

          tempoDisplay.textContent = '';
          tempoDisplay.appendChild(input);
          input.focus();
          input.select();
        });
      }

      // Practice / Répétition / Práctica (First setting in drawer)
      const practiceToggle = document.getElementById('toggle-practice-mode');
      const practiceRow = document.getElementById('row-toggle-practice');
      if (practiceToggle) {
        practiceToggle.checked = !!this.config.isPracticeMode;
        const setPractice = (enabled) => {
          practiceToggle.checked = enabled;
          this.config.isPracticeMode = enabled;
          localStorage.setItem('rcs_practice_mode', enabled);
          this.rhythmEngine.setSettings({ isPracticeMode: enabled });
          if (progressPill && enabled) {
            progressPill.classList.add('hidden');
          }
        };
        practiceToggle.addEventListener('change', () => {
          setPractice(practiceToggle.checked);
        });
        practiceRow?.addEventListener('click', (e) => {
          if (e.target.closest('.toggle-switch')) return;
          setPractice(!practiceToggle.checked);
        });
      }

      // Training Mode: Imitate vs Continuous
      this.setupSegmentedControl('ctrl-mode', (val) => {
        if (val === 'imitate' || val === 'continuous') {
          this.config.mode = val;
          this.rhythmEngine.setSettings({ mode: val });
        }
      });

      // Hands View: Left, Right, Two Hands
      this.setupSegmentedControl('ctrl-hand-count', (val) => {
        this.config.handViewMode = val;
        this.handRenderer.setSettings(this.config.division, val, this.config.labelMode);
        this.rhythmEngine.setSettings({ handViewMode: val });
        if (this.config.level === 'custom') {
          this.renderPlaylistChips();
        }
        setTimeout(() => this.updateKnuckleTimelines(), 100);
      });

      // Subdivision: Binary vs Ternary
      this.setupSegmentedControl('ctrl-division', (val) => {
        this.config.division = val;

        const isTernary = val === 'ternary';
        const expectedLen = isTernary ? 3 : 4;
        const defaultSign = isTernary ? "100" : "1000";

        if (this.customSign1.length !== expectedLen) {
          this.customSign1 = defaultSign;
          this.customSign2 = defaultSign;
          if (this.config.level === 'custom') {
            this.customPlaylist = [{
              id: 'pat_' + Date.now(),
              sign1: defaultSign,
              sign2: defaultSign
            }];
            this.renderPlaylistChips();
            this.rhythmEngine.setSettings({ customPlaylist: this.customPlaylist });
          }
        }

        this.handRenderer.setSettings(val, this.config.handViewMode, this.config.labelMode);
        this.rhythmEngine.setSettings({ divisionMode: val });
        this.updateMetronomeButtonsForDivision(val);
        setTimeout(() => this.updateKnuckleTimelines(), 100);
      });

      // Difficulty Level: Level 1, Level 2, Level 3, Custom
      this.setupSegmentedControl('ctrl-level', (val) => {
        const customBar = document.getElementById('custom-mode-bar');
        const customDrawerSec = document.getElementById('drawer-custom-section');

        if (val === 'custom') {
          this.config.level = 'custom';
          document.body.classList.add('custom-mode-active');
          document.body.classList.add('hands-spotlight'); // Hands stick out of blurred screen!
          customBar?.classList.remove('hidden');
          customDrawerSec?.classList.remove('hidden');

          const isTernary = this.config.division === 'ternary';
          const defaultSign = isTernary ? "100" : "1000";
          if (!this.customSign1 || this.customSign1.length !== (isTernary ? 3 : 4)) {
            this.customSign1 = defaultSign;
            this.customSign2 = defaultSign;
          }

          if (this.customPlaylist.length === 0) {
            this.customPlaylist.push({
              id: 'pat_' + Date.now(),
              sign1: this.customSign1,
              sign2: this.customSign2
            });
          }

          this.renderPlaylistChips();
          this.handRenderer.applySigns(this.customSign1, this.customSign2);
          this.rhythmEngine.setSettings({
            level: 'custom',
            customPlaylist: this.customPlaylist,
            isShuffleOn: this.isShuffleOn
          });
        } else {
          const lvl = parseInt(val, 10);
          this.config.level = lvl;
          document.body.classList.remove('custom-mode-active');
          document.body.classList.remove('hands-spotlight');
          customBar?.classList.add('hidden');
          customDrawerSec?.classList.add('hidden');
          this.rhythmEngine.setSettings({ level: lvl });
        }
      });

      // Add Pattern buttons (Big Plus on Main & Drawer)
      document.getElementById('btn-add-pattern-main')?.addEventListener('click', () => {
        this.addCurrentPatternToPlaylist();
      });
      document.getElementById('btn-add-pattern-drawer')?.addEventListener('click', () => {
        this.addCurrentPatternToPlaylist();
      });

      // Shuffle Playlist buttons (Main & Drawer)
      document.getElementById('btn-shuffle-playlist-main')?.addEventListener('click', () => {
        this.toggleShuffle();
      });
      document.getElementById('btn-shuffle-playlist-drawer')?.addEventListener('click', () => {
        this.toggleShuffle();
      });

      // Metronome Subdivision switch
      this.setupSegmentedControl('ctrl-metronome', (val) => {
        this.config.metronomeSubdivision = val;
        localStorage.setItem('rcs_metronome_subdivision', val);
        this.rhythmEngine.setSettings({ metronomeSubdivision: val });
      });

      // Finger Labels: Solfège, 1 2 3 4, Erased
      this.setupSegmentedControl('ctrl-labels', (val) => {
        this.config.labelMode = val;
        this.handRenderer.setLabelMode(val);
        this.updateKnuckleTimelines();
      });
    }

    handleFingerClick(side, fingerId) {
      const isTernary = this.config.division === 'ternary';
      let bitIndex = -1;

      if (isTernary) {
        if (side === 'left') {
          if (fingerId === 4) return; // Pinky unused in ternary left hand
          bitIndex = fingerId - 1; // Index(1)->0, Middle(2)->1, Ring(3)->2
        } else {
          if (fingerId === 1) return; // Index unused in ternary right hand
          bitIndex = fingerId - 2; // Middle(2)->0, Ring(3)->1, Pinky(4)->2
        }
      } else {
        bitIndex = fingerId - 1; // 1->0, 2->1, 3->2, 4->3
      }

      if (bitIndex < 0) return;

      const toggleBitAt = (str, idx) => {
        const expectedLen = isTernary ? 3 : 4;
        let s = (str && str.length === expectedLen) ? str : (isTernary ? "100" : "1000");
        const bit = s.charAt(idx) === '1' ? '0' : '1';
        return s.substring(0, idx) + bit + s.substring(idx + 1);
      };

      if (this.config.handViewMode === 'left') {
        this.customSign1 = toggleBitAt(this.customSign1, bitIndex);
      } else if (this.config.handViewMode === 'right') {
        this.customSign1 = toggleBitAt(this.customSign1, bitIndex);
      } else {
        if (side === 'left') {
          this.customSign1 = toggleBitAt(this.customSign1, bitIndex);
        } else {
          this.customSign2 = toggleBitAt(this.customSign2, bitIndex);
        }
      }

      this.handRenderer.applySigns(this.customSign1, this.customSign2);
    }

    addCurrentPatternToPlaylist() {
      const isTernary = this.config.division === 'ternary';
      const expectedLen = isTernary ? 3 : 4;
      const s1 = (this.customSign1 && this.customSign1.length === expectedLen) ? this.customSign1 : (isTernary ? "100" : "1000");
      const s2 = (this.customSign2 && this.customSign2.length === expectedLen) ? this.customSign2 : (isTernary ? "100" : "1000");

      const item = {
        id: 'pat_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        sign1: s1,
        sign2: this.config.handViewMode === 'two' ? s2 : s1
      };

      this.customPlaylist.push(item);
      this.renderPlaylistChips();
      this.rhythmEngine.setSettings({ customPlaylist: this.customPlaylist });

      const btns = [document.getElementById('btn-add-pattern-main'), document.getElementById('btn-add-pattern-drawer')];
      btns.forEach(btn => {
        if (btn) {
          btn.style.transform = 'scale(0.92)';
          setTimeout(() => btn.style.transform = '', 120);
        }
      });
    }

    removePattern(id) {
      this.customPlaylist = this.customPlaylist.filter(p => p.id !== id);
      this.renderPlaylistChips();
      this.rhythmEngine.setSettings({ customPlaylist: this.customPlaylist });
    }

    toggleShuffle() {
      this.isShuffleOn = !this.isShuffleOn;
      const btnMain = document.getElementById('btn-shuffle-playlist-main');
      const btnDrawer = document.getElementById('btn-shuffle-playlist-drawer');
      if (this.isShuffleOn) {
        btnMain?.classList.add('active');
        btnDrawer?.classList.add('active');
      } else {
        btnMain?.classList.remove('active');
        btnDrawer?.classList.remove('active');
      }
      this.rhythmEngine.setSettings({ isShuffleOn: this.isShuffleOn });
    }

    renderPlaylistChips(activePatternId) {
      const mainContainer = document.getElementById('main-chips-container');
      const drawerContainer = document.getElementById('drawer-chips-container');
      if (!mainContainer && !drawerContainer) return;

      if (this.customPlaylist.length === 0) {
        const emptyHtml = `<span class="empty-playlist-msg">${this.t('emptyPlaylist')}</span>`;
        if (mainContainer) mainContainer.innerHTML = emptyHtml;
        if (drawerContainer) drawerContainer.innerHTML = emptyHtml;
        return;
      }

      const isTwoHands = this.config.handViewMode === 'two';

      const buildChipHtml = (item, idx) => {
        const isActive = activePatternId && item.id === activePatternId;
        const renderDots = (sign) => {
          let dots = '';
          for (let i = 0; i < sign.length; i++) {
            dots += `<span class="chip-dot ${sign.charAt(i) === '1' ? 'up' : 'down'}"></span>`;
          }
          return `<span class="chip-visual-hand">${dots}</span>`;
        };

        let visualHtml = renderDots(item.sign1);
        if (isTwoHands) {
          visualHtml += `<span class="chip-divider"></span>` + renderDots(item.sign2 || item.sign1);
        }

        return `
          <div class="pattern-chip ${isActive ? 'active-playing' : ''}" 
               draggable="true" 
               data-id="${item.id}" 
               data-index="${idx}" 
               title="${this.t('chipTitle')}">
            <span class="chip-drag-handle" title="${this.t('chipTitle')}">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
                <circle cx="2" cy="2" r="1.2"/>
                <circle cx="6" cy="2" r="1.2"/>
                <circle cx="2" cy="6" r="1.2"/>
                <circle cx="6" cy="6" r="1.2"/>
                <circle cx="2" cy="10" r="1.2"/>
                <circle cx="6" cy="10" r="1.2"/>
              </svg>
            </span>
            <span class="pattern-chip-seq">#${idx + 1}</span>
            ${visualHtml}
            <button class="btn-remove-chip" data-remove-id="${item.id}" title="${this.t('removePatternTooltip')}">&times;</button>
          </div>
        `;
      };

      const html = this.customPlaylist.map((p, i) => buildChipHtml(p, i)).join('');
      if (mainContainer) mainContainer.innerHTML = html;
      if (drawerContainer) drawerContainer.innerHTML = html;

      let dragSrcIndex = null;

      [mainContainer, drawerContainer].forEach(container => {
        if (!container) return;
        container.querySelectorAll('.btn-remove-chip').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-remove-id');
            this.removePattern(id);
          });
        });

        const chips = container.querySelectorAll('.pattern-chip');
        chips.forEach(chip => {
          chip.addEventListener('dragstart', (e) => {
            if (e.target.closest('.btn-remove-chip')) {
              e.preventDefault();
              return;
            }
            dragSrcIndex = parseInt(chip.getAttribute('data-index'), 10);
            chip.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', String(dragSrcIndex));
          });

          chip.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            chip.classList.add('drag-over');
          });

          chip.addEventListener('dragleave', () => {
            chip.classList.remove('drag-over');
          });

          chip.addEventListener('dragend', () => {
            chip.classList.remove('dragging');
            document.querySelectorAll('.pattern-chip').forEach(c => c.classList.remove('drag-over', 'dragging'));
            dragSrcIndex = null;
          });

          chip.addEventListener('drop', (e) => {
            e.preventDefault();
            chip.classList.remove('drag-over');
            const targetIndex = parseInt(chip.getAttribute('data-index'), 10);
            if (dragSrcIndex !== null && !isNaN(targetIndex) && dragSrcIndex !== targetIndex) {
              const [movedItem] = this.customPlaylist.splice(dragSrcIndex, 1);
              this.customPlaylist.splice(targetIndex, 0, movedItem);
              this.renderPlaylistChips();
              this.rhythmEngine.setSettings({ customPlaylist: this.customPlaylist });
            }
          });

          chip.addEventListener('click', (e) => {
            if (e.target.closest('.btn-remove-chip')) return;
            if (this.rhythmEngine.isRunning) return;
            const id = chip.getAttribute('data-id');
            const found = this.customPlaylist.find(p => p.id === id);
            if (found) {
              this.customSign1 = found.sign1;
              this.customSign2 = found.sign2 || found.sign1;
              this.handRenderer.applySigns(this.customSign1, this.customSign2);
            }
          });
        });
      });
    }

    renderActivePlayingChip(id) {
      document.querySelectorAll('.pattern-chip').forEach(chip => {
        if (id && chip.getAttribute('data-id') === id) {
          chip.classList.add('active-playing');
        } else {
          chip.classList.remove('active-playing');
        }
      });
    }

    setupSegmentedControl(containerId, onChange) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const buttons = container.querySelectorAll('.seg-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          onChange(btn.getAttribute('data-val'));
        });
      });
    }

    onEngineStateUpdate(state) {
      const tapBtn = document.getElementById('tap-btn');
      const tapBtnSpan = tapBtn ? tapBtn.querySelector('span') : null;

      // Update Exercise Progress Pill in Normal Mode
      const progressPill = document.getElementById('exercise-progress-pill');
      const progressText = document.getElementById('exercise-progress-text');
      if (progressPill && progressText) {
        if (!state.isPracticeMode) {
          progressPill.classList.remove('hidden');
          const curHand = Math.min(state.totalHands, state.currentHand || 1);
          progressText.textContent = this.t('handProgress', curHand, state.totalHands);
        } else {
          progressPill.classList.add('hidden');
        }
      }

      if (this.config.mode === 'continuous') {
        document.body.classList.remove('phase-demo');
        document.body.classList.add('phase-imitate');
        if (tapBtnSpan) tapBtnSpan.textContent = this.t('tapRhythm');
      } else if (state.pass === 1) {
        document.body.classList.remove('phase-imitate');
        document.body.classList.add('phase-demo');
        if (tapBtnSpan) tapBtnSpan.textContent = this.t('listenRead');
      } else {
        document.body.classList.remove('phase-demo');
        document.body.classList.add('phase-imitate');
        if (tapBtnSpan) tapBtnSpan.textContent = this.t('tapRhythm');
      }

      if (this.config.level === 'custom' && state.patternId) {
        this.renderActivePlayingChip(state.patternId);
      }

      const curHand = state.currentHand || 1;
      this.debugPanel.updateStateView({
        ...state,
        completedHands: curHand
      });
    }

    updateKnuckleTimelines() {
      const timelineSec = document.getElementById('timeline-section');
      if (!timelineSec) return;
      timelineSec.style.top = '';

      const stageWrapper = document.querySelector('.hands-stage-wrapper');
      const handsWrapper = document.getElementById('hands-wrapper');
      const svgEl = document.querySelector('.hand-svg');

      if (stageWrapper && handsWrapper && svgEl) {
        const isTwoHands = this.config.handViewMode === 'two';
        const stageWidth = Math.min(window.innerWidth, stageWrapper.clientWidth);
        const stageHeight = stageWrapper.clientHeight;

        // Base preferred hand width on wide desktop
        const baseWidth = 285;
        let maxAllowedWidth = baseWidth;
        let targetGap = 40;

        // 1. HORIZONTAL NARROWING & CLOSE DISTANCE (<= 30px at closest)
        // In the SVG (viewBox 0 0 324 480): Left hand pinky right edge is at x=256 (324-256 = 68 units).
        // Right hand index left edge is at x=65.5 (65.5 units).
        // Total internal invisible space between active fingers = 68 + 65.5 = 133.5 units.
        if (isTwoHands) {
          // Visual distance between Left Hand Pinky and Right Hand Index:
          // On wide desktop (>= 850px), visual distance is ~65px.
          // As width narrows down towards 450px, visual distance smoothly closes down to 22px (<= 30px!).
          const widthProgress = Math.max(0, Math.min(1, (stageWidth - 450) / (850 - 450)));
          const targetVisualDistance = Math.round(22 + widthProgress * (65 - 22)); // 65px down to 22px

          const internalPaddingPx = baseWidth * (133.5 / 324);
          targetGap = Math.round(targetVisualDistance - internalPaddingPx);

          // Sizing constraint when narrow:
          // Visual span = 1.588 * W + targetVisualDistance
          const availWidth = Math.max(260, stageWidth - 12);
          const maxWByWidth = Math.floor((availWidth - targetVisualDistance) / 1.588);
          if (maxWByWidth < baseWidth) {
            maxAllowedWidth = Math.max(130, maxWByWidth);
            const scaledInternalPadding = maxAllowedWidth * (133.5 / 324);
            targetGap = Math.round(targetVisualDistance - scaledInternalPadding);
          }
        } else {
          // Single hand mode
          if (stageWidth < baseWidth + 16) {
            maxAllowedWidth = Math.max(160, stageWidth - 16);
          }
        }

        document.documentElement.style.setProperty('--hands-overlap', `${targetGap}px`);
        document.documentElement.style.setProperty('--hands-gap', `${Math.max(0, targetGap)}px`);
        document.documentElement.style.setProperty('--hand-max-width', `${maxAllowedWidth}px`);

        // 2. VERTICAL CENTERING ON UP/DOWN AXIS & SQUEEZED CEILING GAP
        // In SVG, fingertip is at y=73; disks bottom + 15px buffer ≈ y=320.
        const svgRect = svgEl.getBoundingClientRect();
        const currentSvgHeight = svgRect.height;
        const hHead = currentSvgHeight * (73 / 480);
        const hVis = currentSvgHeight - hHead;

        // Essential reading zone height (from fingertips to 15px below disks):
        const essentialZoneFromFingers = currentSvgHeight * ((320 - 73) / 480);
        const fadePadding = 24;
        const minStageHeight = essentialZoneFromFingers + fadePadding;

        // Vertically centered when tall; smoothly eliminate top gap as stage gets squeezed:
        const spareHeight = stageHeight - hVis;
        let marginTop = 0;

        if (spareHeight > 60) {
          // Roomy screen: center the visible hand
          // On mobile portrait, limit top gap to 36px so palms and bottom zone are not pushed down
          const maxGap = stageWidth < 500 ? 36 : 90;
          const centerGap = Math.min(maxGap, Math.round(spareHeight / 2));
          marginTop = Math.round(centerGap - hHead);
        } else if (spareHeight > 0) {
          // Tightening height: smoothly transition from centered to top ceiling
          const t = spareHeight / 60;
          const centerGap = Math.round((spareHeight / 2) * t + 4 * (1 - t));
          marginTop = Math.round(centerGap - hHead);
        } else {
          // Squeezed: fingertips touch the top ceiling (gap = 2px)
          marginTop = Math.round(2 - hHead);
        }

        handsWrapper.style.marginTop = `${marginTop}px`;

        if (stageHeight > 0 && stageHeight < minStageHeight) {
          // Window is vertically too short: scale down hand width so essential zone + 15px cushion fits!
          const vScale = Math.max(0.40, Math.min(1.0, stageHeight / minStageHeight));
          const finalWidth = Math.round(maxAllowedWidth * vScale);
          document.documentElement.style.setProperty('--hand-max-width', `${finalWidth}px`);
          // When shrinking under vertical squeeze, ensure fingertips touch the top ceiling (gap = 0):
          const scaledHHead = (finalWidth * (480 / 324)) * (73 / 480);
          handsWrapper.style.marginTop = `${Math.round(-scaledHHead)}px`;
        }
      }

      const timelineRect = timelineSec.getBoundingClientRect();
      const knuckles = this.handRenderer.getKnucklePositions();

      // Cache positions to eliminate synchronous layout reflow during tapping!
      this.cachedTimelineLeft = timelineRect.left;
      this.cachedKnuckles = knuckles;

      const setupHandLine = (handKnuckles, lineElId, ticksLayerId) => {
        const lineEl = document.getElementById(lineElId);
        const ticksLayer = document.getElementById(ticksLayerId);
        if (!lineEl || !ticksLayer) return;

        if (!handKnuckles || handKnuckles.length < 2) {
          lineEl.style.display = 'none';
          ticksLayer.innerHTML = '';
          return;
        }

        lineEl.style.display = 'block';
        const D = Math.abs(handKnuckles[1].x - handKnuckles[0].x);
        const k1 = handKnuckles[0];
        const kLast = handKnuckles[handKnuckles.length - 1];

        const startX = (k1.x - timelineRect.left) - D / 2;
        const endX = (kLast.x - timelineRect.left) + D / 2;
        const lineWidth = Math.max(10, endX - startX);

        lineEl.style.left = `${startX}px`;
        lineEl.style.width = `${lineWidth}px`;

        const isTernary = this.config.division === 'ternary';
        const solfegeNames = isTernary ? ['Ta', 'Ki', 'Da'] : ['Ta', 'Ka', 'Di', 'Mi'];
        let ticksHtml = '';

        handKnuckles.forEach((kn, idx) => {
          const relX = kn.x - timelineRect.left;
          const label = solfegeNames[idx] || `${idx + 1}`;
          ticksHtml += `
            <div class="debug-knuckle-tick ${this.debugPanel.showSubdivisionGuides ? 'debug-visible' : ''}" style="left: ${relX}px;">
              <div class="tick-notch"></div>
              <span class="tick-caption">${label}</span>
            </div>
          `;
        });
        ticksLayer.innerHTML = ticksHtml;
      };

      setupHandLine(knuckles.hand1, 'debug-line-hand1', 'ticks-layer-hand1');
      setupHandLine(knuckles.hand2, 'debug-line-hand2', 'ticks-layer-hand2');
    }

    onTapEvaluation(evalData) {
      const dotsLayer = document.getElementById('dots-layer');
      if (!dotsLayer || !this.cachedKnuckles) return;

      let targetKnuckles = null;
      if (this.config.handViewMode === 'two') {
        targetKnuckles = (evalData.beat === 1) ? this.cachedKnuckles.hand2 : this.cachedKnuckles.hand1;
      } else {
        targetKnuckles = this.cachedKnuckles.hand1;
      }

      if (!targetKnuckles || targetKnuckles.length < 2) return;

      const D = Math.abs(targetKnuckles[1].x - targetKnuckles[0].x);
      const k1 = targetKnuckles[0];
      const count = targetKnuckles.length;

      // Zero-reflow computation using cached coordinates
      const relativeX = (k1.x - this.cachedTimelineLeft) + (evalData.fractionalSub * D);
      const minX = (k1.x - this.cachedTimelineLeft) - D / 2;
      const maxX = (targetKnuckles[count - 1].x - this.cachedTimelineLeft) + D / 2;
      const targetX = Math.max(minX, Math.min(maxX, relativeX));

      const dot = document.createElement('div');
      dot.className = `feedback-dot ${evalData.rating}`;
      dot.style.left = `${targetX}px`;

      if (evalData.rating === 'early') {
        dot.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 19 8 12 15 5"></polyline></svg>`;
      } else if (evalData.rating === 'late') {
        dot.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 19 16 12 9 5"></polyline></svg>`;
      }

      dotsLayer.appendChild(dot);

      setTimeout(() => {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }, 1400);

      this.debugPanel.updateStateView({
        deltaMs: evalData.deltaMs,
        rating: evalData.rating
      });
      this.debugPanel.recordTapEvaluation(evalData);
    }

    onDebugTogglesChange(toggles) {
      const line1 = document.getElementById('debug-line-hand1');
      const line2 = document.getElementById('debug-line-hand2');
      const ticks = document.querySelectorAll('.debug-knuckle-tick');

      if (toggles.showKnuckleLine) {
        line1?.classList.add('debug-visible');
        line2?.classList.add('debug-visible');
      } else {
        line1?.classList.remove('debug-visible');
        line2?.classList.remove('debug-visible');
      }

      ticks.forEach(tick => {
        if (toggles.showSubdivisionGuides) {
          tick.classList.add('debug-visible');
        } else {
          tick.classList.remove('debug-visible');
        }
      });
    }

    triggerConductorGesture(beatDurationMs, gestureType = 'activation', liftHeight) {
      const wrapper = document.getElementById('hands-wrapper');
      if (!wrapper) return;

      const cutoff = this.rhythmEngine.conductorBpmCutoff || 100;
      const isSlow = this.config.bpm < cutoff;
      const isPulse = gestureType === 'pulse';

      const defaultLift = isPulse ? (this.rhythmEngine.conductorPulseLiftHeight || 6) : this.rhythmEngine.conductorLiftHeight;
      const lift = liftHeight !== undefined ? liftHeight : defaultLift;
      const durationMs = beatDurationMs || (60000 / this.config.bpm);
      const totalDurationMs = Math.round(durationMs / 0.72);

      if (isPulse) {
        wrapper.style.setProperty('--conductor-pulse-lift', `${lift}px`);
      } else {
        wrapper.style.setProperty('--conductor-lift', `${lift}px`);
      }
      wrapper.style.animationDuration = `${totalDurationMs}ms`;

      wrapper.classList.remove('conductor-gesture-activation');
      wrapper.classList.remove('conductor-gesture-activation-late');
      wrapper.classList.remove('conductor-ternary-activation');
      wrapper.classList.remove('conductor-ternary-pulse');
      wrapper.classList.remove('conductor-beat-pulse');
      for (let i = 1; i <= 6; i++) {
        wrapper.classList.remove(`conductor-pulse-style-${i}`);
      }
      void wrapper.offsetWidth;

      let gestureClass = '';
      const isTernary = this.config.division === 'ternary';

      if (isPulse || (gestureType && gestureType.startsWith('pulse-style-'))) {
        if (isTernary) {
          gestureClass = 'conductor-ternary-pulse';
        } else {
          gestureClass = 'conductor-beat-pulse';
        }
      } else {
        if (isTernary) {
          gestureClass = 'conductor-ternary-activation';
        } else {
          gestureClass = isSlow ? 'conductor-gesture-activation-late' : 'conductor-gesture-activation';
        }
      }

      wrapper.classList.add(gestureClass);

      clearTimeout(this._conductorGestureTimer);
      this._conductorGestureTimer = setTimeout(() => {
        wrapper.classList.remove(gestureClass);
        wrapper.style.animationDuration = '';
      }, totalDurationMs + 10);
    }

    cancelConductorGesture() {
      clearTimeout(this._conductorGestureTimer);
      const wrapper = document.getElementById('hands-wrapper');
      if (!wrapper) return;
      wrapper.classList.remove('conductor-gesture-activation');
      wrapper.classList.remove('conductor-gesture-activation-late');
      wrapper.classList.remove('conductor-beat-pulse');
      wrapper.classList.remove('conductor-ternary-activation');
      wrapper.classList.remove('conductor-ternary-pulse');
      for (let i = 1; i <= 6; i++) {
        wrapper.classList.remove(`conductor-pulse-style-${i}`);
      }
      wrapper.style.animationDuration = '';
      wrapper.style.transform = '';
    }
  }

  function boot() {
    const app = new App();
    app.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
