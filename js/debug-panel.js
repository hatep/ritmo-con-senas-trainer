// debug-panel.js - Keyboard 'D' toggleable HUD with on-demand collapsible sections

export class DebugPanel {
  constructor(rhythmEngine, handRenderer, onVisualTogglesChange, onTestGesture, onConductorSettingsChange, onTestScore) {
    this.engine = rhythmEngine;
    this.renderer = handRenderer;
    this.onVisualTogglesChange = onVisualTogglesChange;
    this.onTestGesture = onTestGesture;
    this.onConductorSettingsChange = onConductorSettingsChange;
    this.onTestScore = onTestScore;

    this.isOpen = false;
    this.showKnuckleLine = false;
    this.showSubdivisionGuides = false;

    this.initDom();
    this.bindEvents();
  }

  initDom() {
    const presetVal = (this.engine && this.engine.conductorGesturePreset !== undefined) ? this.engine.conductorGesturePreset : 1;
    const liftVal = (this.engine && this.engine.conductorLiftHeight !== undefined) ? this.engine.conductorLiftHeight : 95;
    const autoVal = (this.engine && this.engine.conductorGestureAuto !== undefined) ? this.engine.conductorGestureAuto : true;

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
        <!-- Section 1: Visual Knuckle Guides & Feedback Lines -->
        <div class="debug-section">
          <div class="debug-section-header" data-target="debug-sec-visual">
            <span class="chevron">▶</span> 1. Visual Guides & Knuckle Scale
          </div>
          <div id="debug-sec-visual" class="debug-section-body collapsed">
            <label class="debug-toggle-row">
              <input type="checkbox" id="dbg-toggle-line">
              <span>Show Knuckle Alignment Line</span>
            </label>
            <label class="debug-toggle-row">
              <input type="checkbox" id="dbg-toggle-guides">
              <span>Show Subdivision Guides (Ta Ka Di Mi / 1 2 3 4)</span>
            </label>
            <div class="debug-hint">
              When enabled, the horizontal timing line and knuckle-aligned markers are displayed beneath the hands.
            </div>
          </div>
        </div>

        <!-- Section 2: Timing Windows & Threshold Sliders -->
        <div class="debug-section">
          <div class="debug-section-header" data-target="debug-sec-timing">
            <span class="chevron">▶</span> 2. Timing Tolerances & Audio Latency
          </div>
          <div id="debug-sec-timing" class="debug-section-body collapsed">
            <div class="debug-slider-row">
              <label>Perfect Window: <span id="dbg-val-perfect">±45ms</span></label>
              <input type="range" id="dbg-slider-perfect" min="15" max="65" value="45" step="1">
            </div>
            <div class="debug-slider-row">
              <label>Max Window (Early/Late): <span id="dbg-val-max">±85ms</span></label>
              <input type="range" id="dbg-slider-max" min="40" max="140" value="85" step="5">
            </div>
            <div class="debug-slider-row">
              <label>Hardware Audio Offset: <span id="dbg-val-latency">0ms</span></label>
              <input type="range" id="dbg-slider-latency" min="-60" max="60" value="0" step="2">
            </div>
          </div>
        </div>

        <!-- Section 3: Engine State & Real-Time Monitor -->
        <div class="debug-section">
          <div class="debug-section-header" data-target="debug-sec-state">
            <span class="chevron">▶</span> 3. Real-Time Engine State
          </div>
          <div id="debug-sec-state" class="debug-section-body collapsed">
            <div class="debug-data-grid">
              <div class="data-item"><span class="lbl">BPM:</span> <span id="dbg-rt-bpm" class="val">--</span></div>
              <div class="data-item"><span class="lbl">Pass:</span> <span id="dbg-rt-pass" class="val">--</span></div>
              <div class="data-item"><span class="lbl">Bar/Beat:</span> <span id="dbg-rt-barbeat" class="val">--</span></div>
              <div class="data-item"><span class="lbl">Sign (Binary):</span> <span id="dbg-rt-sign" class="val highlight">--</span></div>
              <div class="data-item"><span class="lbl">Last Tap Offset:</span> <span id="dbg-rt-delta" class="val">--</span></div>
              <div class="data-item"><span class="lbl">Rating:</span> <span id="dbg-rt-rating" class="val">--</span></div>
            </div>
          </div>
        </div>

        <!-- Section 4: Manual Finger Tests -->
        <div class="debug-section">
          <div class="debug-section-header" data-target="debug-sec-fingers">
            <span class="chevron">▶</span> 4. Manual Finger Articulation Test
          </div>
          <div id="debug-sec-fingers" class="debug-section-body collapsed">
            <div class="debug-btn-row">
              <button class="dbg-finger-btn" data-f="1">Index (1)</button>
              <button class="dbg-finger-btn" data-f="2">Middle (2)</button>
              <button class="dbg-finger-btn" data-f="3">Ring (3)</button>
              <button class="dbg-finger-btn" data-f="4">Pinky (4)</button>
            </div>
            <div class="debug-hint">Click individual fingers to test instant joint transitions.</div>
          </div>
        </div>

        <!-- Section 5: Conductor Activation & Beat Pulse Gestures (Purely Vertical) -->
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
                <label>BPM Cutoff (Animation & Finger Transition): <span id="dbg-val-conductor-cutoff">${(this.engine && this.engine.conductorBpmCutoff) || 100} BPM</span></label>
                <input type="range" id="dbg-slider-conductor-cutoff" min="60" max="160" value="${(this.engine && this.engine.conductorBpmCutoff) || 100}" step="5">
              </div>
              <div class="debug-slider-row">
                <label>Activation Lift Amplitude: <span id="dbg-val-conductor-lift">${liftVal}px</span></label>
                <input type="range" id="dbg-slider-conductor-lift" min="40" max="150" value="${liftVal}" step="5">
              </div>
              <div class="debug-slider-row">
                <label>Beat Pulse Amplitude: <span id="dbg-val-conductor-pulse-lift">${(this.engine && this.engine.conductorPulseLiftHeight) || 6}px</span></label>
                <input type="range" id="dbg-slider-conductor-pulse-lift" min="2" max="30" value="${(this.engine && this.engine.conductorPulseLiftHeight) || 6}" step="1">
              </div>

              <div id="dbg-pulse-fast-group" class="debug-pulse-group ${(this.engine && (this.engine.bpm || 70) < (this.engine.conductorBpmCutoff || 100)) ? 'pulse-group-disabled' : ''}">
                <div class="debug-sub-label">
                  Fast Tempo (&ge;${(this.engine && this.engine.conductorBpmCutoff) || 100} BPM) Pulse Motion Start:
                  <span class="sub-caption-badge" id="dbg-pulse-fast-status">${(this.engine && (this.engine.bpm || 70) < (this.engine.conductorBpmCutoff || 100)) ? '(Active when &ge;100 BPM)' : '(Currently Active)'}</span>
                </div>
                <div class="debug-radio-group">
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="1" ${(this.engine && (this.engine.conductorPulseFastStyle || 1) === 1) ? 'checked' : ''}>
                    <span>1: Normal at Pulse (Ta, full beat)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="2" ${(this.engine && this.engine.conductorPulseFastStyle === 2) ? 'checked' : ''}>
                    <span>2: Delayed 0.5 sub (Rests at center)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="3" ${(this.engine && this.engine.conductorPulseFastStyle === 3) ? 'checked' : ''}>
                    <span>3: Delayed 1.0 sub (Starts at Ka)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="4" ${(this.engine && this.engine.conductorPulseFastStyle === 4) ? 'checked' : ''}>
                    <span>4: Delayed 1.5 sub (Midway Ka &rarr; Di)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="5" ${(this.engine && this.engine.conductorPulseFastStyle === 5) ? 'checked' : ''}>
                    <span>5: Delayed 2.0 sub (Starts at Di)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="6" ${(this.engine && this.engine.conductorPulseFastStyle === 6) ? 'checked' : ''}>
                    <span>6: Delayed 2.5 sub (Midway Di &rarr; Mi)</span>
                  </label>
                  <label class="debug-radio-opt">
                    <input type="radio" name="dbg-pulse-fast-style" value="7" ${(this.engine && this.engine.conductorPulseFastStyle === 7) ? 'checked' : ''}>
                    <span>7: Delayed 3.0 sub (Starts at Mi, snap)</span>
                  </label>
                </div>
              </div>

              <!-- 12 Pulse Animation Style Proposals (Colored Buttons) -->
              <div class="debug-pulse-styles-section" style="margin-top: 12px; padding: 10px; background: rgba(15, 23, 42, 0.65); border-radius: 8px; border: 1px solid rgba(148, 163, 184, 0.2);">
                <div style="font-weight: 700; color: #38bdf8; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;">
                  <span>Beat Pulse Animation Styles (12 Proposals)</span>
                  <span id="dbg-lbl-current-pulse-style" style="font-size: 10px; color: #e2e8f0; font-weight: normal;">Active: #${(this.engine && this.engine.conductorPulseStyle) || 1}</span>
                </div>
                <div class="debug-hint" style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
                  Click any colored button to select and preview that distinct dynamics, rebound, and acceleration curve.
                </div>
                <div class="pulse-styles-grid">
                  <button type="button" class="dbg-style-btn c1 ${(this.engine && (this.engine.conductorPulseStyle || 1) === 1) ? 'active' : ''}" data-pulse-style="1">
                    <span class="btn-num">1. Subtle Dip + Classic Drop</span>
                    <span class="btn-desc">8% dip, apex at 38%, late gravity drop</span>
                  </button>
                  <button type="button" class="dbg-style-btn c2 ${(this.engine && this.engine.conductorPulseStyle === 2) ? 'active' : ''}" data-pulse-style="2">
                    <span class="btn-num">2. Standard Hybrid (2+12)</span>
                    <span class="btn-desc">12% dip, direct ascent, terminal plunge</span>
                  </button>
                  <button type="button" class="dbg-style-btn c3 ${(this.engine && this.engine.conductorPulseStyle === 3) ? 'active' : ''}" data-pulse-style="3">
                    <span class="btn-num">3. Deeper Crouch & Heavy Plunge</span>
                    <span class="btn-desc">16% tactile crouch, fast spring, heavy drop</span>
                  </button>
                  <button type="button" class="dbg-style-btn c4 ${(this.engine && this.engine.conductorPulseStyle === 4) ? 'active' : ''}" data-pulse-style="4">
                    <span class="btn-num">4. Micro-Dip & Floating Apex</span>
                    <span class="btn-desc">10% fast dip, hangs aloft to 58%, late drop</span>
                  </button>
                  <button type="button" class="dbg-style-btn c5 ${(this.engine && this.engine.conductorPulseStyle === 5) ? 'active' : ''}" data-pulse-style="5">
                    <span class="btn-num">5. Balanced Curve to Dead Drop</span>
                    <span class="btn-desc">12% dip, apex at 36%, smooth parabolic freefall</span>
                  </button>
                  <button type="button" class="dbg-style-btn c6 ${(this.engine && this.engine.conductorPulseStyle === 6) ? 'active' : ''}" data-pulse-style="6">
                    <span class="btn-num">6. Snappy Whip & Max Acceleration</span>
                    <span class="btn-desc">14% dip, delayed apex, extreme velocity plunge</span>
                  </button>
                </div>
              </div>

              <label class="debug-toggle-row">
                <input type="checkbox" id="dbg-toggle-conductor-auto" ${autoVal ? 'checked' : ''}>
                <span>Auto-trigger Activation Gesture (Demo Beat 2)</span>
              </label>
              <label class="debug-toggle-row">
                <input type="checkbox" id="dbg-toggle-conductor-pulse" ${(this.engine && this.engine.conductorPulseAuto) !== false ? 'checked' : ''}>
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
      </div>
    `;

    document.body.appendChild(el);
    this.panelEl = el;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
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

    const sliderPerf = document.getElementById('dbg-slider-perfect');
    const sliderMax = document.getElementById('dbg-slider-max');
    const sliderLat = document.getElementById('dbg-slider-latency');

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

    sliderLat.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      document.getElementById('dbg-val-latency').textContent = `${v > 0 ? '+' : ''}${v}ms`;
    });

    this.panelEl.querySelectorAll('.dbg-finger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fingerIdx = parseInt(btn.getAttribute('data-f'), 10) - 1;
        const currentArr = (this.engine.currentSign || "1111").split('');
        currentArr[fingerIdx] = currentArr[fingerIdx] === '1' ? '0' : '1';
        const newMask = currentArr.join('');
        this.engine.currentSign = newMask;
        this.renderer.applySign(newMask);
        this.updateStateView({ sign: newMask });
      });
    });

    // BPM Cutoff slider
    const sliderCutoff = document.getElementById('dbg-slider-conductor-cutoff');
    if (sliderCutoff) {
      sliderCutoff.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        if (this.engine) this.engine.conductorBpmCutoff = v;
        document.getElementById('dbg-val-conductor-cutoff').textContent = `${v} BPM`;
        if (this.onConductorSettingsChange) {
          this.onConductorSettingsChange({ cutoff: v });
        }
      });
    }

    // Activation Lift Amplitude slider
    const sliderLift = document.getElementById('dbg-slider-conductor-lift');
    if (sliderLift) {
      sliderLift.addEventListener('input', (e) => {
        const v = parseInt(e.target.value, 10);
        if (this.engine) this.engine.conductorLiftHeight = v;
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
        if (this.engine) this.engine.conductorPulseLiftHeight = v;
        document.getElementById('dbg-val-conductor-pulse-lift').textContent = `${v}px`;
        if (this.onConductorSettingsChange) {
          this.onConductorSettingsChange({ pulseLift: v });
        }
      });
    }

    // Fast tempo pulse start style radios
    this.panelEl.querySelectorAll('input[name="dbg-pulse-fast-style"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          const val = parseInt(e.target.value, 10);
          if (this.engine) this.engine.conductorPulseFastStyle = val;
          if (this.onConductorSettingsChange) {
            this.onConductorSettingsChange({ pulseFastStyle: val });
          }
        }
      });
    });

    // 12 Pulse style proposal buttons
    this.panelEl.querySelectorAll('.dbg-style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const styleId = parseInt(btn.getAttribute('data-pulse-style'), 10);
        if (this.engine) this.engine.conductorPulseStyle = styleId;
        this.panelEl.querySelectorAll('.dbg-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lbl = document.getElementById('dbg-lbl-current-pulse-style');
        if (lbl) lbl.textContent = `Active: #${styleId}`;
        if (this.onConductorSettingsChange) {
          this.onConductorSettingsChange({ pulseStyle: styleId });
        }
        if (this.onTestGesture) {
          this.onTestGesture(`pulse-style-${styleId}`);
        }
      });
    });

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
      const pulseGroup = document.getElementById('dbg-pulse-fast-group');
      const pulseStatus = document.getElementById('dbg-pulse-fast-status');
      if (pulseGroup) {
        const cutoff = (this.engine && this.engine.conductorBpmCutoff) || 100;
        const isSlow = data.bpm < cutoff;
        if (isSlow) {
          pulseGroup.classList.add('pulse-group-disabled');
          if (pulseStatus) pulseStatus.textContent = `(Active when ≥${cutoff} BPM)`;
        } else {
          pulseGroup.classList.remove('pulse-group-disabled');
          if (pulseStatus) pulseStatus.textContent = '(Currently Active)';
        }
      }
    }
    if (data.pass !== undefined) document.getElementById('dbg-rt-pass').textContent = data.pass === 1 ? '1 (Demo)' : '2 (Imitate)';
    if (data.bar !== undefined && data.beat !== undefined) {
      document.getElementById('dbg-rt-barbeat').textContent = `Bar ${data.bar} / Beat ${data.beat}`;
    }
    if (data.sign !== undefined) document.getElementById('dbg-rt-sign').textContent = data.sign;
    if (data.deltaMs !== undefined) {
      const signStr = data.deltaMs > 0 ? `+${data.deltaMs.toFixed(1)}ms` : `${data.deltaMs.toFixed(1)}ms`;
      document.getElementById('dbg-rt-delta').textContent = signStr;
    }
    if (data.rating !== undefined) {
      const ratingEl = document.getElementById('dbg-rt-rating');
      ratingEl.textContent = data.rating.toUpperCase();
      ratingEl.className = `val ${data.rating}`;
    }
  }
}
