// hand-renderer.js - SVG Dorsal Hand Generator with realistic phalanx joint articulation

/**
 * Dorsal Hand Perspective (Musician facing conductor):
 * - Pinkies are INSIDE (towards center).
 * - Indexes are OUTSIDE (outer edges).
 * - Thumbs are tucked on the OUTSIDE (behind outer edge).
 * 
 * Left Hand (Screen-Left):
 *   - Outer edge (left): Tucked thumb
 *   - Index (finger 1): outer-left
 *   - Middle (finger 2)
 *   - Ring (finger 3)
 *   - Pinky (finger 4): inner-right (facing center)
 *
 * Right Hand (Screen-Right):
 *   - Pinky (finger 4): inner-left (facing center)
 *   - Ring (finger 3)
 *   - Middle (finger 2)
 *   - Index (finger 1): outer-right
 *   - Outer edge (right): Tucked thumb
 */

export class HandRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.labelMode = 'numbers'; // 'numbers' | 'solfege' | 'hidden'
    this.divisionMode = 'binary'; // 'binary' (4 fingers) | 'ternary' (3 fingers)
    this.handCountMode = 'two'; // 'one' | 'two'
    this.currentMask = "1111";
  }

  setSettings(divisionMode, handCountMode, labelMode) {
    this.divisionMode = divisionMode;
    this.handCountMode = handCountMode;
    this.labelMode = labelMode;
    this.render();
    this.applySign(this.currentMask);
  }

  setLabelMode(labelMode) {
    this.labelMode = labelMode;
    this.updateLabels();
  }

  createHandSvg(side = 'left') {
    const isLeft = side === 'left';
    const svgId = `hand-svg-${side}`;

    // Finger coordinate mapping on dorsal view
    // Left hand: Index on outer-left (82), Pinky on inner-right (242). Thumb tucked at outer-left (~35).
    // Right hand: Pinky on inner-left (98), Index on outer-right (258). Thumb tucked at outer-right (~305).
    const fingerDefs = isLeft ? [
      { id: 1, name: 'index',  x: 82,  width: 33, len: 165, baseAngle: -2 },
      { id: 2, name: 'middle', x: 136, width: 35, len: 185, baseAngle: 0 },
      { id: 3, name: 'ring',   x: 190, width: 32, len: 170, baseAngle: 2 },
      { id: 4, name: 'pinky',  x: 242, width: 28, len: 140, baseAngle: 4 }
    ] : [
      { id: 4, name: 'pinky',  x: 98,  width: 28, len: 140, baseAngle: -4 },
      { id: 3, name: 'ring',   x: 150, width: 32, len: 170, baseAngle: -2 },
      { id: 2, name: 'middle', x: 204, width: 35, len: 185, baseAngle: 0 },
      { id: 1, name: 'index',  x: 258, width: 33, len: 165, baseAngle: 2 }
    ];

    // Tucked thumbs on outer edges
    const thumbSvg = isLeft 
      ? `<g class="tucked-thumb tucked-thumb-left">
           <path d="M 66 280 C 42 285, 18 315, 20 355 C 22 380, 50 390, 72 375 C 82 350, 78 300, 66 280 Z" 
                 fill="url(#skin-dark)" stroke="#8d5b4c" stroke-width="2"/>
           <path d="M 30 335 C 28 355, 40 368, 54 365" stroke="#75473a" stroke-width="2" fill="none" opacity="0.6"/>
         </g>`
      : `<g class="tucked-thumb tucked-thumb-right">
           <path d="M 274 280 C 298 285, 322 315, 320 355 C 318 380, 290 390, 268 375 C 258 350, 262 300, 274 280 Z" 
                 fill="url(#skin-dark)" stroke="#8d5b4c" stroke-width="2"/>
           <path d="M 310 335 C 312 355, 300 368, 286 365" stroke="#75473a" stroke-width="2" fill="none" opacity="0.6"/>
         </g>`;

    let fingersHtml = '';
    fingerDefs.forEach(f => {
      const pLen = f.len * 0.44; // proximal phalanx
      const mLen = f.len * 0.32; // middle phalanx
      const dLen = f.len * 0.24; // distal phalanx with nail

      const baseY = 258;
      const w = f.width;
      const hw = w / 2;

      fingersHtml += `
        <g class="finger-container finger-slot-${f.id}" data-finger-id="${f.id}" data-side="${side}">
          <!-- Knuckle shadow at MCP joint -->
          <ellipse cx="${f.x}" cy="${baseY + 4}" rx="${hw + 3}" ry="9" class="knuckle-shadow" fill="transparent" opacity="0"/>

          <!-- PROXIMAL PHALANX -->
          <g class="phalanx-group proximal-joint" style="transform-origin: ${f.x}px ${baseY}px;">
            <path class="phalanx-body" 
                  d="M ${f.x - hw} ${baseY} 
                     C ${f.x - hw - 2} ${baseY - pLen * 0.5}, ${f.x - hw + 1} ${baseY - pLen}, ${f.x - hw + 2} ${baseY - pLen} 
                     L ${f.x + hw - 2} ${baseY - pLen} 
                     C ${f.x + hw - 1} ${baseY - pLen}, ${f.x + hw + 2} ${baseY - pLen * 0.5}, ${f.x + hw} ${baseY} Z" 
                  fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>
            
            <!-- Knuckle dorsal wrinkles -->
            <path d="M ${f.x - hw + 4} ${baseY - 4} Q ${f.x} ${baseY - 7} ${f.x + hw - 4} ${baseY - 4}" 
                  stroke="#78473a" stroke-width="1.6" fill="none" opacity="0.75"/>
            <path d="M ${f.x - hw + 6} ${baseY - pLen + 4} Q ${f.x} ${baseY - pLen + 1} ${f.x + hw - 6} ${baseY - pLen + 4}" 
                  stroke="#78473a" stroke-width="1.4" fill="none" opacity="0.6"/>

            <!-- MIDDLE PHALANX -->
            <g class="phalanx-group middle-joint" style="transform-origin: ${f.x}px ${baseY - pLen}px;">
              <path class="phalanx-body" 
                    d="M ${f.x - hw + 2} ${baseY - pLen} 
                       L ${f.x - hw + 3} ${baseY - pLen - mLen} 
                       L ${f.x + hw - 3} ${baseY - pLen - mLen} 
                       L ${f.x + hw - 2} ${baseY - pLen} Z" 
                    fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>

              <!-- Middle joint crease -->
              <path d="M ${f.x - hw + 6} ${baseY - pLen - mLen + 4} Q ${f.x} ${baseY - pLen - mLen + 1} ${f.x + hw - 6} ${baseY - pLen - mLen + 4}" 
                    stroke="#78473a" stroke-width="1.4" fill="none" opacity="0.6"/>

              <!-- DISTAL PHALANX & NAIL -->
              <g class="phalanx-group distal-joint" style="transform-origin: ${f.x}px ${baseY - pLen - mLen}px;">
                <path class="phalanx-body" 
                      d="M ${f.x - hw + 3} ${baseY - pLen - mLen} 
                         C ${f.x - hw + 2} ${baseY - f.len + 16}, ${f.x - hw + 4} ${baseY - f.len + 4}, ${f.x} ${baseY - f.len} 
                         C ${f.x + hw - 4} ${baseY - f.len + 4}, ${f.x + hw - 2} ${baseY - f.len + 16}, ${f.x + hw - 3} ${baseY - pLen - mLen} Z" 
                      fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="1.8"/>

                <!-- Fingernail on Dorsal Side -->
                <path class="fingernail" 
                      d="M ${f.x - hw + 7} ${baseY - f.len + 18} 
                         C ${f.x - hw + 7} ${baseY - f.len + 7}, ${f.x - hw + 9} ${baseY - f.len + 3}, ${f.x} ${baseY - f.len + 2} 
                         C ${f.x + hw - 9} ${baseY - f.len + 3}, ${f.x + hw - 7} ${baseY - f.len + 7}, ${f.x + hw - 7} ${baseY - f.len + 18} 
                         C ${f.x + hw - 10} ${baseY - f.len + 19}, ${f.x - hw + 10} ${baseY - f.len + 19}, ${f.x - hw + 7} ${baseY - f.len + 18} Z" 
                      fill="url(#nail-grad)" stroke="#b88d80" stroke-width="1.2"/>
                <ellipse cx="${f.x}" cy="${baseY - f.len + 7}" rx="4" ry="1.5" fill="rgba(255,255,255,0.4)"/>
              </g>
            </g>
          </g>

          <!-- Finger Label Overlay (1 2 3 4 or Ta Ka Di Mi) -->
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
      : `M 82 260 C 88 250, 272 250, 276 254 C 282 275, 278 375, 260 435 C 250 460, 240 480, 235 480 L 125 480 C 120 480, 110 460, 100 435 C 80 375, 76 275, 82 260 Z`;

    return `
      <svg id="${svgId}" class="hand-svg hand-${side}" viewBox="0 0 340 480" preserveAspectRatio="xMidYMid meet">
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
            <stop offset="0%" stop-color="#f5d6cc"/>
            <stop offset="60%" stop-color="#e9b9aa"/>
            <stop offset="100%" stop-color="#d69f91"/>
          </linearGradient>
          
          <filter id="hand-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
        </defs>

        <g filter="url(#hand-glow)">
          ${thumbSvg}
          <g class="palm-group">
            <path d="${palmPath}" fill="url(#skin-grad)" stroke="#8f5c4c" stroke-width="2"/>
            
            <!-- Tendon contour highlights on dorsal back of hand -->
            ${isLeft ? `
              <path d="M 85 260 C 95 330, 120 410, 130 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="4" fill="none"/>
              <path d="M 136 260 C 142 330, 150 410, 155 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="5" fill="none"/>
              <path d="M 190 260 C 185 330, 175 410, 175 460" stroke="rgba(240, 190, 175, 0.35)" stroke-width="4" fill="none"/>
              <path d="M 242 260 C 230 330, 205 410, 195 460" stroke="rgba(240, 190, 175, 0.3)" stroke-width="3" fill="none"/>
            ` : `
              <path d="M 98 260 C 110 330, 135 410, 145 460" stroke="rgba(240, 190, 175, 0.3)" stroke-width="3" fill="none"/>
              <path d="M 150 260 C 155 330, 165 410, 165 460" stroke="rgba(240, 190, 175, 0.35)" stroke-width="4" fill="none"/>
              <path d="M 204 260 C 198 330, 190 410, 185 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="5" fill="none"/>
              <path d="M 255 260 C 245 330, 220 410, 210 460" stroke="rgba(240, 190, 175, 0.4)" stroke-width="4" fill="none"/>
            `}

            <!-- Dorsal wrist lines -->
            <path d="M 115 445 Q 170 455 225 445" stroke="#75473a" stroke-width="1.8" fill="none" opacity="0.5"/>
            <path d="M 125 465 Q 170 472 215 465" stroke="#75473a" stroke-width="1.5" fill="none" opacity="0.4"/>
          </g>

          <g class="fingers-layer">
            ${fingersHtml}
          </g>
        </g>
      </svg>
    `;
  }

  render() {
    let html = '';
    if (this.handCountMode === 'one') {
      html = `<div class="hands-stage single-hand-stage">${this.createHandSvg('left')}</div>`;
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
    const labelsMap = {
      binary: {
        numbers: ['1', '2', '3', '4'],
        solfege: ['Ta', 'Ka', 'Di', 'Mi'],
        hidden: ['', '', '', '']
      },
      ternary: {
        numbers: ['1', '2', '3', ''],
        solfege: ['Ta', 'Ki', 'Da', ''],
        hidden: ['', '', '', '']
      }
    };

    const currentList = labelsMap[this.divisionMode][this.labelMode];
    const labelElements = this.container.querySelectorAll('.finger-label-text');
    
    labelElements.forEach(el => {
      const fingerId = parseInt(el.getAttribute('data-finger-num'), 10);
      const text = currentList[fingerId - 1] || '';
      el.textContent = text;
      
      const badgeWrap = el.closest('.finger-label-wrap');
      if (badgeWrap) {
        if (!text || this.labelMode === 'hidden' || (this.divisionMode === 'ternary' && fingerId === 4)) {
          badgeWrap.classList.add('hidden');
        } else {
          badgeWrap.classList.remove('hidden');
        }
      }
    });
  }

  applySign(bitmask) {
    this.currentMask = bitmask;
    const isTernary = this.divisionMode === 'ternary';
    
    for (let f = 1; f <= 4; f++) {
      let isExtended = false;
      if (isTernary) {
        if (f <= 3) {
          isExtended = bitmask.charAt(f - 1) === '1';
        } else {
          isExtended = false; // Pinky permanently curled in ternary
        }
      } else {
        isExtended = bitmask.charAt(f - 1) === '1';
      }

      const fingerContainers = this.container.querySelectorAll(`.finger-slot-${f}`);
      fingerContainers.forEach(container => {
        if (isExtended) {
          container.classList.remove('finger-curled');
          container.classList.add('finger-extended');
        } else {
          container.classList.remove('finger-extended');
          container.classList.add('finger-curled');
        }
      });
    }
  }

  getKnucklePositions() {
    const primaryHand = this.container.querySelector('.hand-left') || this.container.querySelector('.hand-svg');
    if (!primaryHand) return [];

    const result = [];
    const count = this.divisionMode === 'ternary' ? 3 : 4;

    for (let f = 1; f <= count; f++) {
      const slot = primaryHand.querySelector(`.finger-slot-${f} .knuckle-shadow`);
      if (slot) {
        const slotRect = slot.getBoundingClientRect();
        result.push({
          fingerId: f,
          x: slotRect.left + slotRect.width / 2,
          y: slotRect.top + slotRect.height / 2
        });
      }
    }
    return result;
  }
}
