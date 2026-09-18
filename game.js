/**
 * ============================================================================
 * GLITCH RUNNER v1.0 - Complete Core Engine & Gameplay Systems
 * Pure Vanilla JavaScript - Offline & GitHub Pages Ready
 * Systems:
 *  - Player Physics & Multi-Device Inputs (Desktop, Touch D-Pad, Touch/Drag)
 *  - HiDPI / Retina Scaled HTML5 Canvas
 *  - Native Web Audio API Synthesizer (Zero External Assets)
 *  - Memory Shards & Risk/Reward Collectibles (Corrupted, Recovery, Power Shards)
 *  - Enemy Variety (Chaser, Drifter, Dasher)
 *  - Connected Power-Up System (Shield, Overclock, Glitch Purge)
 *  - 10 Reality Shift Anomalies (5 Core + 5 New Balanced Events)
 *  - Run-Based Missions & Mini Challenges
 *  - Combo Scaling & Milestone Fanfares
 *  - Persistent High Scores & Player Stats (localStorage)
 *  - Game Feel & Visual Juice (Screen Trauma, Particles, Floating Combat Text)
 * ============================================================================
 */

// ============================================================================
// 1. CONSTANTS & LOGICAL COORDINATES
// ============================================================================
const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 450;
const SHARD_COUNT = 3;

// ============================================================================
// 2. DOM REFERENCES
// ============================================================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasViewport = document.getElementById("canvasViewport");

// Control Bar Buttons
const btnStart = document.getElementById("btnStart");
const btnPause = document.getElementById("btnPause");
const btnRestart = document.getElementById("btnRestart");
const btnAudio = document.getElementById("btnAudio");
const audioGlyph = document.getElementById("audioGlyph");
const audioText = document.getElementById("audioText");

// HUD Elements
const scoreDisplay = document.getElementById("scoreDisplay");
const bestScoreDisplay = document.getElementById("bestScoreDisplay");
const comboDisplay = document.getElementById("comboDisplay");
const healthDisplay = document.getElementById("healthDisplay");
const healthFill = document.getElementById("healthFill");
const levelDisplay = document.getElementById("levelDisplay");

// Status Strip: Reality Shift
const realityPanel = document.getElementById("realityPanel");
const realityDot = document.getElementById("realityDot");
const realityStatusText = document.getElementById("realityStatusText");
const realityEventBox = document.getElementById("realityEventBox");
const realityEventName = document.getElementById("realityEventName");
const realityEventTime = document.getElementById("realityEventTime");

// Status Strip: Power-Up
const powerPanel = document.getElementById("powerPanel");
const powerDot = document.getElementById("powerDot");
const powerStatusText = document.getElementById("powerStatusText");
const powerDetailBox = document.getElementById("powerDetailBox");
const powerDetailText = document.getElementById("powerDetailText");

// Mission Strip
const missionStrip = document.getElementById("missionStrip");
const missionText = document.getElementById("missionText");
const missionProgress = document.getElementById("missionProgress");
const missionBounty = document.getElementById("missionBounty");

// System Status Bar
const statusMessage = document.getElementById("statusMessage");
const statusDot = document.getElementById("statusDot");

// Touch Controls
const touchControlsContainer = document.getElementById("touchControlsContainer");
const btnModeButtons = document.getElementById("btnModeButtons");
const btnModeDrag = document.getElementById("btnModeDrag");
const virtualDpad = document.getElementById("virtualDpad");
const touchDragHint = document.getElementById("touchDragHint");
const dpadUp = document.getElementById("dpadUp");
const dpadDown = document.getElementById("dpadDown");
const dpadLeft = document.getElementById("dpadLeft");
const dpadRight = document.getElementById("dpadRight");

// Mobile-only interface
const mobileHomeScreen = document.getElementById("mobileHomeScreen");
const mobilePlayActions = document.getElementById("mobilePlayActions");
const mobilePauseScreen = document.getElementById("mobilePauseScreen");
const mobileGameOverScreen = document.getElementById("mobileGameOverScreen");
const mobileBestScore = document.getElementById("mobileBestScore");
const mobileFinalScore = document.getElementById("mobileFinalScore");
const mobileFinalBest = document.getElementById("mobileFinalBest");
const mobileFinalCombo = document.getElementById("mobileFinalCombo");
const mobileFinalLevel = document.getElementById("mobileFinalLevel");
const mobilePlayBtn = document.getElementById("mobilePlayBtn");
const mobilePauseBtn = document.getElementById("mobilePauseBtn");
const mobileResumeBtn = document.getElementById("mobileResumeBtn");
const mobilePauseRestartBtn = document.getElementById("mobilePauseRestartBtn");
const mobilePauseHomeBtn = document.getElementById("mobilePauseHomeBtn");
const mobilePlayAgainBtn = document.getElementById("mobilePlayAgainBtn");
const mobileGameOverHomeBtn = document.getElementById("mobileGameOverHomeBtn");
const mobileAudioBtn = document.getElementById("mobileAudioBtn");
const mobilePlayAudioBtn = document.getElementById("mobilePlayAudioBtn");
const mobileAudioGlyph = document.getElementById("mobileAudioGlyph");
const mobileAudioText = document.getElementById("mobileAudioText");
const mobilePlayAudioGlyph = document.getElementById("mobilePlayAudioGlyph");
const mobileGameDpad = document.getElementById("mobileGameDpad");
const mobileDragMessage = document.getElementById("mobileDragMessage");
const mobileModeButtons = document.getElementById("mobileModeButtons");
const mobileModeDrag = document.getElementById("mobileModeDrag");
const mobileComboBanner = document.getElementById("mobileComboBanner");
const mobileAlertBanner = document.getElementById("mobileAlertBanner");
let mobileComboBannerTimer = null;
let mobileAlertBannerTimer = null;

const mobileArcadeHud = document.getElementById("mobileArcadeHud");
const mobileLiveScore = document.getElementById("mobileLiveScore");
const mobileLiveLevel = document.getElementById("mobileLiveLevel");
const mobileLiveCombo = document.getElementById("mobileLiveCombo");
const mobileComboFill = document.getElementById("mobileComboFill");
const mobileLiveHealth = document.getElementById("mobileLiveHealth");
const mobileHealthFill = document.getElementById("mobileHealthFill");
const mobileRealityBadge = document.getElementById("mobileRealityBadge");
const mobilePowerBadge = document.getElementById("mobilePowerBadge");
const mobileObjectiveText = document.getElementById("mobileObjectiveText");
const mobileObjectiveProgress = document.getElementById("mobileObjectiveProgress");


// ============================================================================
// 3. STORAGE & PERSISTENT METRICS (SAFE LOCALSTORAGE)
// ============================================================================
const Storage = {
  get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // Ignore private browsing storage quota restrictions
    }
  }
};

let bestScore = Storage.get("glitch_runner_best_score", 0);
let bestCombo = Storage.get("glitch_runner_best_combo", 0);
let highestLevel = Storage.get("glitch_runner_highest_level", 1);
let touchMode = Storage.get("glitch_runner_touch_mode", "buttons"); // "buttons" | "drag"
let audioEnabled = Storage.get("glitch_runner_audio_enabled", true);

function isMobileTouchDevice() {
  return window.matchMedia("(max-width: 520px) and (pointer: coarse)").matches;
}

function syncMobileInterface() {
  if (!isMobileTouchDevice()) return;

  document.body.classList.toggle("mobile-play-active", gameState === "PLAYING" || gameState === "PAUSED");

  mobileHomeScreen.classList.toggle("visible", gameState === "READY");
  mobilePlayActions.classList.toggle("visible", gameState === "PLAYING");
  mobilePauseScreen.classList.toggle("visible", gameState === "PAUSED");
  mobileGameOverScreen.classList.toggle("visible", gameState === "GAME_OVER");

  mobileBestScore.textContent = String(bestScore).padStart(5, "0");
  mobileFinalScore.textContent = String(score).padStart(5, "0");
  mobileFinalBest.textContent = String(bestScore).padStart(5, "0");
  mobileFinalCombo.textContent = `${maxCombo}x`;
  mobileFinalLevel.textContent = String(level).padStart(2, "0");

  const audioLabel = audioEnabled ? "AUDIO ON" : "AUDIO OFF";
  mobileAudioText.textContent = audioLabel;
  mobileAudioGlyph.textContent = audioEnabled ? "🔊" : "🔇";
  mobilePlayAudioGlyph.textContent = audioEnabled ? "🔊" : "🔇";
  mobileAudioBtn.classList.toggle("muted", !audioEnabled);

  mobileModeButtons?.classList.toggle("mode-active", touchMode === "buttons");
  mobileModeDrag?.classList.toggle("mode-active", touchMode === "drag");
  mobileGameDpad?.classList.toggle("drag-hidden", touchMode === "drag");
  mobileDragMessage?.classList.toggle("active", touchMode === "drag");
  mobilePlayAudioBtn.classList.toggle("muted", !audioEnabled);
  if (mobileArcadeHud) mobileArcadeHud.classList.toggle("visible", gameState === "PLAYING" || gameState === "PAUSED");
  if (mobileObjectiveText && currentMission) mobileObjectiveText.textContent = currentMission.text;
  if (mobileObjectiveProgress && currentMission) mobileObjectiveProgress.textContent = `(${Math.min(currentMission.count, currentMission.target)}/${currentMission.target})`;
}

function mobileGoHome() {
  stopGameLoop();
  gameState = "READY";
  isNewHighScore = false;
  resetGameObjects();
  resetRealityShift();
  resetPowerUp();
  pickNextMission();
  syncMobileInterface();
  renderReadyScreen();
}

// ============================================================================
// 4. CENTRALIZED GAME STATE & LIFECYCLE
// ============================================================================
let gameState = "READY"; // "READY" | "PLAYING" | "PAUSED" | "GAME_OVER"
let animationFrameId = null;
let lastTimestamp = null;
let screenShakeTimer = 0;
let isNewHighScore = false;

// Session Metrics
let score = 0;
let health = 100;
let level = 1;
let combo = 0;
let maxCombo = 0;
let missionsCompleted = 0;

// Collections
let shards = [];
let glitches = [];
let particles = [];
let floatingTexts = [];
let rainHazards = []; // Used by GLITCH_RAIN event
let stormShards = []; // Used by SHARD_STORM event

// Accessibility setting
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================================================
// 5. SYNTHESIZED WEB AUDIO ENGINE (ZERO EXTERNAL ASSETS)
// ============================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play synth audio safely with web audio nodes
function playSynthSound(fn) {
  if (!audioEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    fn(ctx);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

const AudioSFX = {
  playShard() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1160, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    });
  },

  playCorrupted() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.08);
      osc.frequency.linearRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    });
  },

  playRecovery() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.1, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.16);
      });
    });
  },

  playPowerUp() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    });
  },

  playDamage() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.2);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    });
  },

  playLevelUp() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.14, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    });
  },

  playComboMilestone() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      [587.33, 739.99, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.18);
      });
    });
  },

  playShiftWarning() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.setValueAtTime(500, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    });
  },

  playShiftActive() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  },

  playGameOver() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.55);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    });
  },

  playHighScore() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    });
  },

  playButton() {
    playSynthSound((ctx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(720, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    });
  }
};

function updateAudioButtonUI() {
  if (audioEnabled) {
    btnAudio.classList.remove("muted");
    audioGlyph.textContent = "🔊";
    audioText.textContent = "AUDIO ON";
  } else {
    btnAudio.classList.add("muted");
    audioGlyph.textContent = "🔇";
    audioText.textContent = "AUDIO OFF";
  }
}

btnAudio.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  Storage.set("glitch_runner_audio_enabled", audioEnabled);
  updateAudioButtonUI();
  if (audioEnabled) {
    getAudioContext();
    AudioSFX.playButton();
  }
});

// ============================================================================
// 6. HiDPI CANVAS SCALING & SCREEN TRAUMA
// ============================================================================
function setupHiDPICanvas() {
  const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
  canvas.width = LOGICAL_WIDTH * dpr;
  canvas.height = LOGICAL_HEIGHT * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Scale context to match logical buffer
}

function triggerScreenShake(duration = 0.28) {
  if (prefersReducedMotion) return;
  screenShakeTimer = duration;
  if (canvasViewport) {
    canvasViewport.classList.remove("screen-shake");
    // Force reflow
    void canvasViewport.offsetWidth;
    canvasViewport.classList.add("screen-shake");
    setTimeout(() => {
      if (canvasViewport) canvasViewport.classList.remove("screen-shake");
    }, duration * 1000);
  }
}

// ============================================================================
// 7. MULTI-DEVICE CONTROLS (DESKTOP & TOUCH MODES)
// ============================================================================
const keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

const touchDragState = {
  active: false,
  targetX: LOGICAL_WIDTH / 2,
  targetY: LOGICAL_HEIGHT / 2
};

function resetInputKeys() {
  keys.up = false;
  keys.down = false;
  keys.left = false;
  keys.right = false;
  touchDragState.active = false;
  if (dpadUp) dpadUp.classList.remove("pressed");
  if (dpadDown) dpadDown.classList.remove("pressed");
  if (dpadLeft) dpadLeft.classList.remove("pressed");
  if (dpadRight) dpadRight.classList.remove("pressed");
}

// Keyboard input tracking
window.addEventListener("keydown", (e) => {
  // Prevent browser scrolling on game keys
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
    e.preventDefault();
  }

  // Audio unmute / init on first key
  getAudioContext();

  // Global game shortcuts
  if (e.code === "KeyM") {
    btnAudio.click();
    return;
  }

  if (e.code === "Space") {
    if (gameState === "READY" || gameState === "GAME_OVER") {
      startGame();
      return;
    } else if (gameState === "PAUSED") {
      resumeGame();
      return;
    }
  }

  if (e.code === "KeyP" || e.code === "Escape") {
    if (gameState === "PLAYING") {
      pauseGame();
      return;
    } else if (gameState === "PAUSED") {
      resumeGame();
      return;
    }
  }

  if (e.code === "Enter") {
    if (gameState === "READY" || gameState === "GAME_OVER") {
      startGame();
      return;
    }
  }

  if (gameState !== "PLAYING") return;

  if (e.code === "KeyW" || e.code === "ArrowUp") keys.up = true;
  if (e.code === "KeyS" || e.code === "ArrowDown") keys.down = true;
  if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = true;
  if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyW" || e.code === "ArrowUp") keys.up = false;
  if (e.code === "KeyS" || e.code === "ArrowDown") keys.down = false;
  if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = false;
  if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = false;
});

// Touch Device Detection
function detectTouchDevice() {
  const hasTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 900);
  if (hasTouch) {
    document.body.classList.add("has-touch");
    if (touchControlsContainer) touchControlsContainer.classList.add("visible");
  }
}

// Touch Mode Switching (Buttons vs Touch/Drag)
function applyTouchMode(mode) {
  touchMode = mode;
  Storage.set("glitch_runner_touch_mode", mode);

  if (mode === "buttons") {
    btnModeButtons.classList.add("active");
    btnModeDrag.classList.remove("active");
    virtualDpad.style.display = "flex";
    touchDragHint.style.display = "none";
    if (mobileGameDpad) mobileGameDpad.style.display = "flex";
    if (mobileDragMessage) mobileDragMessage.classList.remove("active");
  } else {
    btnModeDrag.classList.add("active");
    btnModeButtons.classList.remove("active");
    virtualDpad.style.display = "none";
    touchDragHint.style.display = "block";
    if (mobileGameDpad) mobileGameDpad.style.display = "none";
    if (mobileDragMessage) mobileDragMessage.classList.add("active");
  }
}

btnModeButtons.addEventListener("click", () => {
  AudioSFX.playButton();
  applyTouchMode("buttons");
});

btnModeDrag.addEventListener("click", () => {
  AudioSFX.playButton();
  applyTouchMode("drag");
});

// Setup Virtual D-Pad Pointer Handlers (Hold-to-move)
function bindDpadButton(btn, keyName) {
  if (!btn) return;

  const startPress = (e) => {
    e.preventDefault();
    getAudioContext();
    keys[keyName] = true;
    btn.classList.add("pressed");
  };

  const endPress = (e) => {
    e.preventDefault();
    keys[keyName] = false;
    btn.classList.remove("pressed");
  };

  btn.addEventListener("pointerdown", startPress);
  btn.addEventListener("pointerup", endPress);
  btn.addEventListener("pointercancel", endPress);
  btn.addEventListener("pointerleave", endPress);
}

bindDpadButton(dpadUp, "up");
bindDpadButton(dpadDown, "down");
bindDpadButton(dpadLeft, "left");
bindDpadButton(dpadRight, "right");

// Setup Touch / Drag Direct Arena Steering
function mapClientToCanvasCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = LOGICAL_WIDTH / rect.width;
  const scaleY = LOGICAL_HEIGHT / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("pointerdown", (e) => {
  getAudioContext();

  if (gameState === "READY" || gameState === "GAME_OVER") {
    startGame();
    return;
  }

  if (touchMode === "drag" && gameState === "PLAYING") {
    e.preventDefault();
    const coords = mapClientToCanvasCoords(e.clientX, e.clientY);
    touchDragState.active = true;
    touchDragState.targetX = coords.x;
    touchDragState.targetY = coords.y;
  }
});

window.addEventListener("pointermove", (e) => {
  if (touchDragState.active && touchMode === "drag" && gameState === "PLAYING") {
    e.preventDefault();
    const coords = mapClientToCanvasCoords(e.clientX, e.clientY);
    touchDragState.targetX = coords.x;
    touchDragState.targetY = coords.y;
  }
});

const stopTouchDrag = () => {
  touchDragState.active = false;
};
window.addEventListener("pointerup", stopTouchDrag);
window.addEventListener("pointercancel", stopTouchDrag);

// ============================================================================
// 8. PLAYER ENTITY
// ============================================================================
const player = {
  x: LOGICAL_WIDTH / 2,
  y: LOGICAL_HEIGHT / 2,
  width: 34,
  height: 34,
  radius: 16,
  baseSpeed: 5,
  speed: 5,
  animTimer: 0,
  invulnerableTimer: 0,
  vx: 0,
  vy: 0
};

function clampPlayerBounds() {
  const halfW = player.width / 2;
  const halfH = player.height / 2;
  player.x = Math.max(halfW, Math.min(LOGICAL_WIDTH - halfW, player.x));
  player.y = Math.max(halfH, Math.min(LOGICAL_HEIGHT - halfH, player.y));
}

function updatePlayer() {
  if (gameState !== "PLAYING") return;

  const isGravityFlux = realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "GRAVITY_FLUX";
  const isMirrorWorld = realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "MIRROR_WORLD";
  const isReverseWorld = realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "REVERSE_WORLD";

  let dx = 0;
  let dy = 0;

  if (touchMode === "drag" && touchDragState.active) {
    // Direct Touch / Drag tracking
    const diffX = touchDragState.targetX - player.x;
    const diffY = touchDragState.targetY - player.y;
    const dist = Math.hypot(diffX, diffY);

    if (dist > 4) {
      dx = diffX / dist;
      dy = diffY / dist;
      const step = Math.min(dist, player.speed);
      dx *= step / player.speed;
      dy *= step / player.speed;
    }
  } else {
    // Keyboard or Virtual D-Pad buttons
    if (keys.up) dy -= 1;
    if (keys.down) dy += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }
  }

  // EVENT MODIFIERS
  if (isReverseWorld) {
    dx = -dx;
    dy = -dy;
  }
  if (isMirrorWorld) {
    dx = -dx; // Mirror horizontal steering
  }

  if (isGravityFlux) {
    // Heavy momentum / low friction glide
    player.vx = (player.vx || 0) * 0.94 + dx * player.speed * 0.18;
    player.vy = (player.vy || 0) * 0.94 + dy * player.speed * 0.18;
    player.x += player.vx;
    player.y += player.vy;
  } else {
    player.vx = dx * player.speed;
    player.vy = dy * player.speed;
    player.x += player.vx;
    player.y += player.vy;
  }

  clampPlayerBounds();
  player.animTimer++;

  if (player.invulnerableTimer > 0) {
    player.invulnerableTimer--;
  }

  // Create subtle engine thruster trail
  if (player.animTimer % 3 === 0 && (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1)) {
    particles.push({
      x: player.x + (Math.random() - 0.5) * 6,
      y: player.y + player.height / 2,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.2 + Math.random() * 1.5,
      color: powerUp.type === "OVERCLOCK" ? "#ffb703" : "#00f0ff",
      radius: 2,
      life: 14,
      maxLife: 14
    });
  }
}

function drawPlayer() {
  if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 4) % 2 === 0) {
    ctx.save();
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(player.x, player.y);

  const halfW = player.width / 2;
  const halfH = player.height / 2;
  const flameLength = 10 + Math.sin(player.animTimer * 0.35) * 5;

  // Thruster Flame
  ctx.save();
  ctx.shadowColor = powerUp.type === "OVERCLOCK" ? "#ffb703" : "#00f0ff";
  ctx.shadowBlur = 15;
  ctx.fillStyle = powerUp.type === "OVERCLOCK" ? "#ffb703" : "#00f0ff";
  ctx.beginPath();
  ctx.moveTo(-6, halfH - 4);
  ctx.lineTo(0, halfH + flameLength);
  ctx.lineTo(6, halfH - 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ff0055";
  ctx.beginPath();
  ctx.moveTo(-3, halfH - 4);
  ctx.lineTo(0, halfH + (flameLength * 0.55));
  ctx.lineTo(3, halfH - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Ship Hull
  ctx.shadowColor = powerUp.type === "OVERCLOCK" ? "#ffb703" : "#00f0ff";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#0e1428";
  ctx.strokeStyle = powerUp.type === "OVERCLOCK" ? "#ffb703" : "#00f0ff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, -halfH);
  ctx.lineTo(halfW, halfH);
  ctx.lineTo(halfW * 0.45, halfH - 6);
  ctx.lineTo(0, halfH - 3);
  ctx.lineTo(-halfW * 0.45, halfH - 6);
  ctx.lineTo(-halfW, halfH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cockpit Core
  ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-halfW * 0.5, halfH - 2);
  ctx.lineTo(0, -halfH * 0.3);
  ctx.lineTo(halfW * 0.5, halfH - 2);
  ctx.stroke();

  const pulseRadius = 4 + Math.sin(player.animTimer * 0.12) * 1.5;
  ctx.shadowColor = "#ff0055";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ff0055";
  ctx.beginPath();
  ctx.arc(0, 2, Math.max(2, pulseRadius), 0, Math.PI * 2);
  ctx.fill();

  // SHIELD POWER-UP AURA
  if (powerUp.type === "SHIELD") {
    ctx.strokeStyle = "rgba(0, 240, 255, 0.9)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 16;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// 9. CONNECTED POWER-UP SYSTEM (SHIELD, OVERCLOCK, GLITCH PURGE)
// ============================================================================
const powerUp = {
  type: "NONE", // "NONE" | "SHIELD" | "OVERCLOCK"
  timer: 0,
  maxDuration: 0,
  charges: 0
};

function activatePowerUp(type) {
  AudioSFX.playPowerUp();

  if (type === "PURGE") {
    // Instant Glitch Purge EMP
    triggerGlitchPurge();
    return;
  }

  powerUp.type = type;
  if (type === "SHIELD") {
    powerUp.timer = 10.0;
    powerUp.maxDuration = 10.0;
    powerUp.charges = 1;
    createFloatingText("SHIELD ACTIVE!", player.x, player.y - 35, "#00f0ff");
  } else if (type === "OVERCLOCK") {
    powerUp.timer = 7.0;
    powerUp.maxDuration = 7.0;
    player.speed = player.baseSpeed * 1.45;
    createFloatingText("OVERCLOCK: 2X SPEED & SCORE!", player.x, player.y - 35, "#ffb703");
  }

  updatePowerUpHUD();
  checkMissionProgress("POWER_UP");
}

function triggerGlitchPurge() {
  const count = glitches.length;
  if (count > 0) {
    for (const g of glitches) {
      createParticleBurst(g.x, g.y, "#ff0055", 14);
      createParticleBurst(g.x, g.y, "#00f0ff", 8);
    }
    glitches = [];
    const bonus = count * 25;
    score += bonus;
    createFloatingText(`GLITCH PURGE: +${bonus} PTS!`, player.x, player.y - 38, "#ff0055");
    triggerScreenShake(0.35);
  } else {
    createFloatingText("PURGE: ARENA CLEAR!", player.x, player.y - 35, "#00f0ff");
  }

  // Respawn a baseline enemy after 1.5s
  setTimeout(() => {
    if (gameState === "PLAYING" && glitches.length === 0) {
      spawnGlitch("CHASER");
    }
  }, 1500);

  updatePowerUpHUD();
  updateHUD();
  checkMissionProgress("POWER_UP");
}

function updatePowerUp(deltaTime) {
  if (powerUp.type === "NONE" || gameState !== "PLAYING") return;

  powerUp.timer -= deltaTime;
  if (powerUp.timer <= 0) {
    resetPowerUp();
  } else {
    updatePowerUpHUD();
  }
}

function resetPowerUp() {
  if (powerUp.type === "OVERCLOCK") {
    player.speed = player.baseSpeed;
  }
  powerUp.type = "NONE";
  powerUp.timer = 0;
  powerUp.maxDuration = 0;
  powerUp.charges = 0;
  updatePowerUpHUD();
}

function updatePowerUpHUD() {
  if (!powerPanel || !powerDot || !powerStatusText || !powerDetailBox) return;

  if (powerUp.type === "NONE") {
    powerStatusText.textContent = "POWER: NONE";
    powerStatusText.style.color = "var(--text-muted)";
    powerDot.style.backgroundColor = "#64748b";
    powerDot.style.boxShadow = "none";
    powerDetailBox.style.display = "none";
  } else if (powerUp.type === "SHIELD") {
    powerStatusText.textContent = "SHIELD MATRIX";
    powerStatusText.style.color = "var(--neon-cyan)";
    powerDot.style.backgroundColor = "var(--neon-cyan)";
    powerDot.style.boxShadow = "0 0 8px var(--neon-cyan)";
    powerDetailBox.style.display = "flex";
    powerDetailText.textContent = `${Math.ceil(powerUp.timer)}s`;
    powerDetailText.style.color = "var(--neon-cyan)";
  } else if (powerUp.type === "OVERCLOCK") {
    powerStatusText.textContent = "OVERCLOCK 2X";
    powerStatusText.style.color = "var(--neon-amber)";
    powerDot.style.backgroundColor = "var(--neon-amber)";
    powerDot.style.boxShadow = "0 0 8px var(--neon-amber)";
    powerDetailBox.style.display = "flex";
    powerDetailText.textContent = `${Math.ceil(powerUp.timer)}s`;
    powerDetailText.style.color = "var(--neon-amber)";
  }

  if (mobilePowerBadge) {
    mobilePowerBadge.textContent = powerUp.type === "NONE"
      ? "POWER: NONE"
      : `${powerUp.type} ${Math.ceil(powerUp.timer)}s`;
  }
}

// ============================================================================
// 10. RUN-BASED MISSIONS & MINI CHALLENGES
// ============================================================================
const MISSION_POOL = [
  { id: "SHARDS_10", text: "COLLECT 10 MEMORY SHARDS", target: 10, count: 0, bounty: 120 },
  { id: "COMBO_5", text: "REACH 5X COMBO STREAK", target: 5, count: 0, bounty: 150 },
  { id: "SURVIVE_SHIFT", text: "SURVIVE A REALITY SHIFT", target: 1, count: 0, bounty: 200 },
  { id: "CORRUPTED_1", text: "COLLECT A CORRUPTED SHARD", target: 1, count: 0, bounty: 180 },
  { id: "POWER_UP", text: "ACTIVATE ANY POWER-UP", target: 1, count: 0, bounty: 150 },
  { id: "REACH_LVL_3", text: "ADVANCE TO LEVEL 03", target: 3, count: 1, bounty: 250 },
  { id: "RECOVERY_1", text: "COLLECT A RECOVERY SHARD", target: 1, count: 0, bounty: 140 }
];

let currentMission = null;

function pickNextMission() {
  const available = MISSION_POOL.filter(m => !currentMission || m.id !== currentMission.id);
  const picked = available[Math.floor(Math.random() * available.length)];
  currentMission = {
    ...picked,
    count: picked.id === "REACH_LVL_3" ? level : 0
  };
  updateMissionHUD();
}

function checkMissionProgress(action, value = 1) {
  if (!currentMission || gameState !== "PLAYING") return;

  if (action === currentMission.id) {
    currentMission.count += value;
  } else if (currentMission.id === "SHARDS_10" && action === "SHARD") {
    currentMission.count += value;
  } else if (currentMission.id === "COMBO_5" && combo >= 5) {
    currentMission.count = 5;
  } else if (currentMission.id === "REACH_LVL_3") {
    currentMission.count = level;
  }

  updateMissionHUD();

  if (currentMission.count >= currentMission.target) {
    // Mission Complete!
    missionsCompleted++;
    score += currentMission.bounty;
    AudioSFX.playLevelUp();
    createFloatingText(`MISSION COMPLETE! +${currentMission.bounty} PTS`, player.x, player.y - 40, "#00ff88");
    statusMessage.textContent = `MISSION ACCOMPLISHED — BOUNTY +${currentMission.bounty} AWARDED`;
    updateHUD();

    setTimeout(() => {
      if (gameState === "PLAYING") pickNextMission();
    }, 2200);
  }
}

function updateMissionHUD() {
  if (!missionStrip || !currentMission) return;
  missionText.textContent = currentMission.text;
  missionProgress.textContent = `(${Math.min(currentMission.count, currentMission.target)}/${currentMission.target})`;
  missionBounty.textContent = `+${currentMission.bounty} PTS`;
}

// ============================================================================
// 11. SHARDS & RISK/REWARD COLLECTIBLES
// ============================================================================
/**
 * Shard Types:
 * - NORMAL (Cyan, +10 pts)
 * - CORRUPTED (Crimson/Violet, +30 pts, hazard threat)
 * - RECOVERY (Emerald, +20 HP)
 * - OVERCLOCK (Amber, activates Overclock)
 * - SHIELD (Neon Cyan, activates Shield)
 * - PURGE (Deep Magenta, activates Glitch Purge)
 */
function spawnMemoryShard() {
  const padding = 40;
  let attempts = 0;
  let x = 0;
  let y = 0;
  let isSafe = false;

  while (!isSafe && attempts < 30) {
    x = padding + Math.random() * (LOGICAL_WIDTH - padding * 2);
    y = padding + Math.random() * (LOGICAL_HEIGHT - padding * 2);

    const distPlayer = Math.hypot(x - player.x, y - player.y);
    if (distPlayer < 110) {
      attempts++;
      continue;
    }

    let tooClose = false;
    for (const shard of shards) {
      if (Math.hypot(x - shard.x, y - shard.y) < 45) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) isSafe = true;
    attempts++;
  }

  // Roll shard type
  const roll = Math.random();
  let type = "NORMAL";
  if (roll < 0.14) {
    type = "CORRUPTED";
  } else if (roll < 0.24 && health < 90) {
    type = "RECOVERY";
  } else if (roll < 0.31) {
    type = "OVERCLOCK";
  } else if (roll < 0.38) {
    type = "SHIELD";
  } else if (roll < 0.43) {
    type = "PURGE";
  }

  shards.push({
    x,
    y,
    type,
    radius: 12,
    pulseTimer: Math.random() * 100,
    rotation: Math.random() * Math.PI
  });
}

function updateShards() {
  const isMagnet = realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "MAGNETIC_FIELD";

  for (const shard of shards) {
    shard.pulseTimer += 1;
    shard.rotation += 0.02;

    // EVENT 4: MAGNETIC FIELD - Shards smoothly glide toward player
    if (isMagnet) {
      const angle = Math.atan2(player.y - shard.y, player.x - shard.x);
      shard.x += Math.cos(angle) * 2.4;
      shard.y += Math.sin(angle) * 2.4;

      const r = shard.radius;
      shard.x = Math.max(r, Math.min(LOGICAL_WIDTH - r, shard.x));
      shard.y = Math.max(r, Math.min(LOGICAL_HEIGHT - r, shard.y));
    }
  }

  // Update SHARD_STORM extra shards
  for (let i = stormShards.length - 1; i >= 0; i--) {
    const s = stormShards[i];
    s.x += s.vx;
    s.y += s.vy;
    s.pulseTimer += 1;
    if (s.x < 10 || s.x > LOGICAL_WIDTH - 10) s.vx *= -1;
    if (s.y < 10 || s.y > LOGICAL_HEIGHT - 10) s.vy *= -1;
  }
}

function drawMemoryShard(shard) {
  ctx.save();
  ctx.translate(shard.x, shard.y);
  ctx.rotate(shard.rotation);

  const pulse = Math.sin(shard.pulseTimer * 0.08) * 2;
  const size = shard.radius + pulse;

  let strokeColor = "#00f0ff";
  let fillColor = "rgba(0, 240, 255, 0.25)";

  if (shard.type === "CORRUPTED") {
    strokeColor = "#ff0055";
    fillColor = "rgba(255, 0, 85, 0.3)";
  } else if (shard.type === "RECOVERY") {
    strokeColor = "#00ff88";
    fillColor = "rgba(0, 255, 136, 0.3)";
  } else if (shard.type === "OVERCLOCK") {
    strokeColor = "#ffb703";
    fillColor = "rgba(255, 183, 3, 0.3)";
  } else if (shard.type === "SHIELD") {
    strokeColor = "#38bdf8";
    fillColor = "rgba(56, 189, 248, 0.3)";
  } else if (shard.type === "PURGE") {
    strokeColor = "#ec4899";
    fillColor = "rgba(236, 72, 153, 0.3)";
  }

  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.75, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.75, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Core Diamond or Icon
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.45);
  ctx.lineTo(size * 0.35, 0);
  ctx.lineTo(0, size * 0.45);
  ctx.lineTo(-size * 0.35, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function collectMemoryShard(index, fromStorm = false) {
  const shard = fromStorm ? stormShards[index] : shards[index];
  if (fromStorm) {
    stormShards.splice(index, 1);
  } else {
    shards.splice(index, 1);
  }

  // Multiplier from combo and events
  let comboMult = 1.0;
  if (combo >= 30) comboMult = 3.0;
  else if (combo >= 20) comboMult = 2.5;
  else if (combo >= 10) comboMult = 2.0;
  else if (combo >= 5) comboMult = 1.5;

  if (powerUp.type === "OVERCLOCK") comboMult *= 2.0;
  if (realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "DATA_RUSH") comboMult *= 3.0;

  combo += 1;
  if (combo > maxCombo) maxCombo = combo;

  // Check Combo Milestones
  if ([5, 10, 20, 30].includes(combo)) {
    AudioSFX.playComboMilestone();
    createFloatingText(`★ ${combo}X COMBO MILESTONE! ★`, player.x, player.y - 45, "#ffb703");
    if (mobileComboBanner) {
      mobileComboBanner.textContent = `★ ${combo}X COMBO! ★`;
      mobileComboBanner.classList.add("show");
      clearTimeout(mobileComboBannerTimer);
      mobileComboBannerTimer = setTimeout(() => mobileComboBanner.classList.remove("show"), 900);
    }
    mobileHaptic(24);
  }

  if (shard.type === "NORMAL") {
    const gained = Math.round(10 * comboMult);
    score += gained;
    AudioSFX.playShard();
    createFloatingText(`+${gained}`, shard.x, shard.y - 12, "#00f0ff");
    createParticleBurst(shard.x, shard.y, "#00f0ff", 8);
    checkMissionProgress("SHARD");
  } else if (shard.type === "CORRUPTED") {
    const gained = Math.round(30 * comboMult);
    score += gained;
    AudioSFX.playCorrupted();
    createFloatingText(`CORRUPTED! +${gained}`, shard.x, shard.y - 12, "#ff0055");
    createParticleBurst(shard.x, shard.y, "#ff0055", 12);
    checkMissionProgress("CORRUPTED_1");
    // Risk: Slight threat speed spike or spawn mini glitch
    if (glitches.length < 4 && Math.random() < 0.6) {
      spawnGlitch("DRIFTER");
    }
  } else if (shard.type === "RECOVERY") {
    health = Math.min(100, health + 20);
    score += Math.round(5 * comboMult);
    AudioSFX.playRecovery();
    createFloatingText("+20 HEALTH RECOVERED", shard.x, shard.y - 12, "#00ff88");
    createParticleBurst(shard.x, shard.y, "#00ff88", 10);
    checkMissionProgress("RECOVERY_1");
  } else if (shard.type === "OVERCLOCK") {
    score += Math.round(15 * comboMult);
    activatePowerUp("OVERCLOCK");
    createParticleBurst(shard.x, shard.y, "#ffb703", 12);
  } else if (shard.type === "SHIELD") {
    score += Math.round(15 * comboMult);
    activatePowerUp("SHIELD");
    createParticleBurst(shard.x, shard.y, "#38bdf8", 12);
  } else if (shard.type === "PURGE") {
    activatePowerUp("PURGE");
    createParticleBurst(shard.x, shard.y, "#ec4899", 14);
  }

  if (combo > 1) {
    createFloatingText(`${combo}x COMBO`, player.x, player.y - 28, "#ffb703");
  }

  if (!fromStorm) {
    spawnMemoryShard();
  }

  updateLevel();
  updateHUD();
}

// ============================================================================
// 12. ENEMY VARIETY (CHASER, DRIFTER, DASHER)
// ============================================================================
function spawnGlitch(type = "CHASER") {
  const padding = 45;
  let attempts = 0;
  let x = 0;
  let y = 0;
  let isSafe = false;

  while (!isSafe && attempts < 35) {
    x = padding + Math.random() * (LOGICAL_WIDTH - padding * 2);
    y = padding + Math.random() * (LOGICAL_HEIGHT - padding * 2);

    const distPlayer = Math.hypot(x - player.x, y - player.y);
    if (distPlayer >= 200) {
      isSafe = true;
    }
    attempts++;
  }

  let baseSpeed = 1.25 + (level - 1) * 0.2;
  if (realityShift.state === "ACTIVE") {
    if (realityShift.currentEvent.id === "HYPER_MODE") baseSpeed *= 1.5;
    if (realityShift.currentEvent.id === "TIME_FRACTURE") baseSpeed = 0.12;
  }

  glitches.push({
    x,
    y,
    type,
    radius: type === "DASHER" ? 18 : 16,
    speed: baseSpeed,
    animTimer: Math.random() * 100,
    jitterX: 0,
    jitterY: 0,
    // Drifter properties
    vx: (Math.random() - 0.5) * 2.2,
    vy: (Math.random() - 0.5) * 2.2,
    // Dasher properties
    dashState: "NORMAL", // "NORMAL" | "TELEGRAPH" | "DASH"
    dashTimer: 3.0 + Math.random() * 2.0,
    dashAngle: 0
  });
}

function updateGlitches(deltaTime) {
  for (const glitch of glitches) {
    glitch.animTimer += 1;

    if (glitch.type === "CHASER") {
      // Direct chase toward player
      const angle = Math.atan2(player.y - glitch.y, player.x - glitch.x);
      glitch.x += Math.cos(angle) * glitch.speed;
      glitch.y += Math.sin(angle) * glitch.speed;
    } else if (glitch.type === "DRIFTER") {
      // Predictable drifting with bounce
      glitch.x += glitch.vx * (glitch.speed / 1.25);
      glitch.y += glitch.vy * (glitch.speed / 1.25);

      if (glitch.x <= glitch.radius || glitch.x >= LOGICAL_WIDTH - glitch.radius) glitch.vx *= -1;
      if (glitch.y <= glitch.radius || glitch.y >= LOGICAL_HEIGHT - glitch.radius) glitch.vy *= -1;
    } else if (glitch.type === "DASHER") {
      // Telegraphs dash then lunges
      glitch.dashTimer -= deltaTime;
      if (glitch.dashState === "NORMAL") {
        const angle = Math.atan2(player.y - glitch.y, player.x - glitch.x);
        glitch.x += Math.cos(angle) * (glitch.speed * 0.7);
        glitch.y += Math.sin(angle) * (glitch.speed * 0.7);

        if (glitch.dashTimer <= 0.8) {
          glitch.dashState = "TELEGRAPH";
          glitch.dashAngle = angle;
        }
      } else if (glitch.dashState === "TELEGRAPH") {
        // Frozen briefly telegraphing
        if (glitch.dashTimer <= 0) {
          glitch.dashState = "DASH";
          glitch.dashTimer = 0.45; // 0.45s dash burst
        }
      } else if (glitch.dashState === "DASH") {
        glitch.x += Math.cos(glitch.dashAngle) * (glitch.speed * 3.8);
        glitch.y += Math.sin(glitch.dashAngle) * (glitch.speed * 3.8);

        if (glitch.dashTimer <= 0) {
          glitch.dashState = "NORMAL";
          glitch.dashTimer = 3.5 + Math.random() * 2.0;
        }
      }
    }

    const r = glitch.radius;
    glitch.x = Math.max(r, Math.min(LOGICAL_WIDTH - r, glitch.x));
    glitch.y = Math.max(r, Math.min(LOGICAL_HEIGHT - r, glitch.y));

    if (glitch.animTimer % 3 === 0) {
      glitch.jitterX = (Math.random() - 0.5) * 5;
      glitch.jitterY = (Math.random() - 0.5) * 5;
    }
  }
}

function drawGlitch(glitch) {
  ctx.save();
  ctx.translate(glitch.x + glitch.jitterX, glitch.y + glitch.jitterY);

  const r = glitch.radius;
  const pulse = Math.sin(glitch.animTimer * 0.15) * 2;

  // Dasher Telegraph Warning Ring
  if (glitch.type === "DASHER" && glitch.dashState === "TELEGRAPH") {
    ctx.strokeStyle = "#ffb703";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Chromatic Aberration Underlayer
  ctx.fillStyle = glitch.type === "DRIFTER" ? "rgba(139, 92, 246, 0.4)" : "rgba(0, 240, 255, 0.4)";
  ctx.beginPath();
  ctx.moveTo(2, -r - pulse);
  ctx.lineTo(r + pulse + 2, 2);
  ctx.lineTo(2, r + pulse);
  ctx.lineTo(-r - pulse + 2, 2);
  ctx.closePath();
  ctx.fill();

  // Corrupted Polygon Hull
  ctx.shadowColor = glitch.type === "DASHER" ? "#ffb703" : "#ff0055";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#120208";
  ctx.strokeStyle = glitch.type === "DASHER" ? "#ffb703" : (glitch.type === "DRIFTER" ? "#8b5cf6" : "#ff0055");
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, -r - pulse);
  ctx.lineTo(r * 0.6, -r * 0.4);
  ctx.lineTo(r + pulse, 0);
  ctx.lineTo(r * 0.5, r * 0.5);
  ctx.lineTo(0, r + pulse);
  ctx.lineTo(-r * 0.6, r * 0.4);
  ctx.lineTo(-r - pulse, 0);
  ctx.lineTo(-r * 0.5, -r * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Core Eye
  ctx.shadowColor = "#ffaa00";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ffaa00";
  ctx.beginPath();
  ctx.arc(0, 0, 4 + Math.abs(pulse * 0.5), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ============================================================================
// 13. COLLISION DETECTION & DAMAGE
// ============================================================================
function checkCollisions() {
  // 1. Shards
  for (let i = 0; i < shards.length; i++) {
    const shard = shards[i];
    const dist = Math.hypot(player.x - shard.x, player.y - shard.y);
    if (dist < player.radius + shard.radius) {
      collectMemoryShard(i, false);
      break;
    }
  }

  // 2. Storm Shards
  for (let i = 0; i < stormShards.length; i++) {
    const shard = stormShards[i];
    const dist = Math.hypot(player.x - shard.x, player.y - shard.y);
    if (dist < player.radius + shard.radius) {
      collectMemoryShard(i, true);
      break;
    }
  }

  // 3. Falling Glitch Rain Hazards
  for (let i = rainHazards.length - 1; i >= 0; i--) {
    const h = rainHazards[i];
    const dist = Math.hypot(player.x - h.x, player.y - h.y);
    if (dist < player.radius + h.radius) {
      rainHazards.splice(i, 1);
      takeDamage(10, h.x, h.y);
      break;
    }
  }

  // 4. Glitch Enemies
  for (let i = 0; i < glitches.length; i++) {
    const glitch = glitches[i];
    const dist = Math.hypot(player.x - glitch.x, player.y - glitch.y);
    if (dist < player.radius + glitch.radius) {
      takeDamage(10, glitch.x, glitch.y);
      break;
    }
  }
}

function takeDamage(amount, sourceX, sourceY) {
  if (player.invulnerableTimer > 0) return;

  // SHIELD ABSORPTION
  if (powerUp.type === "SHIELD") {
    powerUp.charges--;
    createFloatingText("SHIELD DEFLECT!", player.x, player.y - 25, "#00f0ff");
    createParticleBurst(player.x, player.y, "#00f0ff", 14);
    AudioSFX.playDamage();
    triggerScreenShake(0.18);
    player.invulnerableTimer = 45;
    if (powerUp.charges <= 0) {
      resetPowerUp();
    }
    return;
  }

  health = Math.max(0, health - amount);
  combo = 0;
  player.invulnerableTimer = 65;

  AudioSFX.playDamage();
  triggerScreenShake(0.3);

  // Knockback
  const knockAngle = Math.atan2(player.y - sourceY, player.x - sourceX);
  const knockDist = 32;
  player.x += Math.cos(knockAngle) * knockDist;
  player.y += Math.sin(knockAngle) * knockDist;
  clampPlayerBounds();

  createFloatingText("-10 HEALTH", player.x, player.y - 25, "#ff3344");
  createParticleBurst(player.x, player.y, "#ff0055", 10);
  if (mobileAlertBanner) {
    mobileAlertBanner.textContent = "⚠ GLITCH IMPACT // -10 HP";
    mobileAlertBanner.classList.add("show");
    clearTimeout(mobileAlertBannerTimer);
    mobileAlertBannerTimer = setTimeout(() => mobileAlertBanner.classList.remove("show"), 650);
  }
  mobileHaptic(18);

  updateHUD();

  if (health <= 0) {
    endGame();
  }
}

// ============================================================================
// 14. 10 REALITY SHIFT ANOMALIES (5 CORE + 5 NEW)
// ============================================================================
const REALITY_EVENTS = [
  // --- EXISTING 5 CORE EVENTS ---
  {
    id: "REVERSE_WORLD",
    name: "REVERSE WORLD",
    subtitle: "CONTROLS INVERTED",
    duration: 5.0,
    themeColor: "#ff0055",
    onStart: () => {},
    onEnd: () => {}
  },
  {
    id: "HYPER_MODE",
    name: "HYPER MODE",
    subtitle: "SPEED INCREASED",
    duration: 6.0,
    themeColor: "#ffb703",
    onStart: () => {
      player.speed = player.baseSpeed * 1.5;
      glitches.forEach(g => { g.speed = (1.25 + (level - 1) * 0.2) * 1.5; });
    },
    onEnd: () => {
      player.speed = player.baseSpeed;
      const normalSpeed = 1.25 + (level - 1) * 0.2;
      glitches.forEach(g => { g.speed = normalSpeed; });
    }
  },
  {
    id: "BLACKOUT",
    name: "BLACKOUT",
    subtitle: "VISIBILITY REDUCED",
    duration: 5.0,
    themeColor: "#8b5cf6",
    onStart: () => {},
    onEnd: () => {}
  },
  {
    id: "MAGNETIC_FIELD",
    name: "MAGNETIC FIELD",
    subtitle: "SHARDS ARE MOVING",
    duration: 6.0,
    themeColor: "#00ff88",
    onStart: () => {},
    onEnd: () => {}
  },
  {
    id: "TIME_FRACTURE",
    name: "TIME FRACTURE",
    subtitle: "THREATS FROZEN",
    duration: 4.0,
    themeColor: "#00f0ff",
    onStart: () => {
      glitches.forEach(g => { g.speed = 0.12; });
    },
    onEnd: () => {
      const normalSpeed = 1.25 + (level - 1) * 0.2;
      glitches.forEach(g => { g.speed = normalSpeed; });
    }
  },

  // --- 5 NEW BALANCED EVENTS ---
  {
    id: "SHARD_STORM",
    name: "SHARD STORM",
    subtitle: "COLLECTIBLES RAINING",
    duration: 6.0,
    themeColor: "#38bdf8",
    onStart: () => {
      stormShards = [];
      for (let i = 0; i < 4; i++) {
        stormShards.push({
          x: 60 + Math.random() * (LOGICAL_WIDTH - 120),
          y: 60 + Math.random() * (LOGICAL_HEIGHT - 120),
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          type: "NORMAL",
          radius: 12,
          pulseTimer: Math.random() * 100,
          rotation: 0
        });
      }
    },
    onEnd: () => {
      stormShards = [];
    }
  },
  {
    id: "GLITCH_RAIN",
    name: "GLITCH RAIN",
    subtitle: "AVOID DATA HAZARDS",
    duration: 5.0,
    themeColor: "#ff0055",
    onStart: () => {
      rainHazards = [];
    },
    onEnd: () => {
      rainHazards = [];
    }
  },
  {
    id: "MIRROR_WORLD",
    name: "MIRROR WORLD",
    subtitle: "HORIZONTAL AXIS FLIPPED",
    duration: 5.5,
    themeColor: "#a855f7",
    onStart: () => {},
    onEnd: () => {}
  },
  {
    id: "GRAVITY_FLUX",
    name: "GRAVITY FLUX",
    subtitle: "LOW-FRICTION GLIDE",
    duration: 6.0,
    themeColor: "#06b6d4",
    onStart: () => {},
    onEnd: () => {
      player.vx = 0;
      player.vy = 0;
    }
  },
  {
    id: "DATA_RUSH",
    name: "DATA RUSH",
    subtitle: "3X SCORE MULTIPLIER",
    duration: 6.0,
    themeColor: "#fbbf24",
    onStart: () => {
      glitches.forEach(g => { g.speed = (1.25 + (level - 1) * 0.2) * 1.2; });
    },
    onEnd: () => {
      const normalSpeed = 1.25 + (level - 1) * 0.2;
      glitches.forEach(g => { g.speed = normalSpeed; });
    }
  }
];

const realityShift = {
  state: "INACTIVE", // "INACTIVE" | "WARNING" | "ACTIVE"
  cooldownTimer: 24.0, // 24 seconds baseline
  currentEvent: null,
  warningTimer: 0,
  activeTimer: 0,
  flashAlpha: 0,
  lastEventId: null
};

function selectRealityShift() {
  const available = REALITY_EVENTS.filter(e => e.id !== realityShift.lastEventId);
  const selected = available[Math.floor(Math.random() * available.length)];
  realityShift.lastEventId = selected.id;
  return selected;
}

function triggerRealityShift() {
  if (realityShift.state !== "INACTIVE" || gameState !== "PLAYING") return;

  const event = selectRealityShift();
  realityShift.currentEvent = event;
  realityShift.state = "WARNING";
  realityShift.warningTimer = 1.8;
  realityShift.flashAlpha = prefersReducedMotion ? 0.2 : 0.45;

  AudioSFX.playShiftWarning();
  triggerScreenShake(0.2);

  statusMessage.textContent = `⚠ WARNING: REALITY SHIFT DETECTED — [${event.name}]`;
  statusDot.style.backgroundColor = "var(--neon-amber)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-amber)";

  updateRealityShiftHUD();
}

function startRealityShift() {
  if (!realityShift.currentEvent || gameState !== "PLAYING") return;

  realityShift.state = "ACTIVE";
  realityShift.activeTimer = realityShift.currentEvent.duration;
  realityShift.flashAlpha = prefersReducedMotion ? 0.25 : 0.55;

  AudioSFX.playShiftActive();
  triggerScreenShake(0.25);

  realityShift.currentEvent.onStart();

  createFloatingText(`ANOMALY: ${realityShift.currentEvent.name}!`, player.x, player.y - 32, realityShift.currentEvent.themeColor);

  statusMessage.textContent = `ANOMALY ENGAGED: ${realityShift.currentEvent.name} — ${realityShift.currentEvent.subtitle}`;
  statusDot.style.backgroundColor = realityShift.currentEvent.themeColor;
  statusDot.style.boxShadow = `0 0 10px ${realityShift.currentEvent.themeColor}`;

  updateRealityShiftHUD();
}

function updateRealityShift(deltaTime) {
  if (gameState !== "PLAYING") return;

  if (realityShift.flashAlpha > 0) {
    realityShift.flashAlpha = Math.max(0, realityShift.flashAlpha - deltaTime * 1.5);
  }

  // Glitch Rain hazard generator during GLITCH_RAIN event
  if (realityShift.state === "ACTIVE" && realityShift.currentEvent?.id === "GLITCH_RAIN") {
    if (Math.random() < 0.18) {
      rainHazards.push({
        x: 20 + Math.random() * (LOGICAL_WIDTH - 40),
        y: 0,
        radius: 8,
        vy: 3.5 + Math.random() * 2.5
      });
    }

    for (let i = rainHazards.length - 1; i >= 0; i--) {
      const h = rainHazards[i];
      h.y += h.vy;
      if (h.y > LOGICAL_HEIGHT) {
        rainHazards.splice(i, 1);
      }
    }
  }

  // 1. INACTIVE
  if (realityShift.state === "INACTIVE") {
    realityShift.cooldownTimer -= deltaTime;
    if (realityShift.cooldownTimer <= 0) {
      triggerRealityShift();
    }
  }
  // 2. WARNING
  else if (realityShift.state === "WARNING") {
    realityShift.warningTimer -= deltaTime;
    if (realityShift.warningTimer <= 0) {
      startRealityShift();
    }
  }
  // 3. ACTIVE
  else if (realityShift.state === "ACTIVE") {
    realityShift.activeTimer -= deltaTime;
    if (realityShift.activeTimer <= 0) {
      endRealityShift();
    }
  }

  updateRealityShiftHUD();
  if (mobileRealityBadge) {
    const state = realityShift.state;
    mobileRealityBadge.textContent = state === "ACTIVE" && realityShift.currentEvent
      ? `⚡ ${realityShift.currentEvent.name}`
      : state === "WARNING" && realityShift.currentEvent
        ? `⚠ INCOMING: ${realityShift.currentEvent.name}`
        : "REALITY: STABLE";
  }
}

function endRealityShift() {
  if (realityShift.currentEvent) {
    realityShift.currentEvent.onEnd();
  }

  // Restore baseline parameters
  player.speed = powerUp.type === "OVERCLOCK" ? player.baseSpeed * 1.45 : player.baseSpeed;
  const normalSpeed = 1.25 + (level - 1) * 0.2;
  glitches.forEach(g => { g.speed = normalSpeed; });

  rainHazards = [];
  stormShards = [];

  createFloatingText("REALITY STABILIZED", player.x, player.y - 30, "#00f0ff");

  realityShift.state = "INACTIVE";
  realityShift.currentEvent = null;
  realityShift.activeTimer = 0;
  realityShift.warningTimer = 0;
  realityShift.cooldownTimer = 22.0 + Math.random() * 6.0;

  statusMessage.textContent = "SIMULATION STABILIZED — ANOMALY CLEARED";
  statusDot.style.backgroundColor = "var(--neon-green)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-green)";

  updateRealityShiftHUD();
  checkMissionProgress("SURVIVE_SHIFT");
}

function resetRealityShift() {
  if (realityShift.currentEvent) {
    realityShift.currentEvent.onEnd();
  }

  player.speed = player.baseSpeed;
  realityShift.state = "INACTIVE";
  realityShift.cooldownTimer = 24.0;
  realityShift.currentEvent = null;
  realityShift.warningTimer = 0;
  realityShift.activeTimer = 0;
  realityShift.flashAlpha = 0;
  realityShift.lastEventId = null;
  rainHazards = [];
  stormShards = [];

  updateRealityShiftHUD();
}

function updateRealityShiftHUD() {
  if (!realityStatusText || !realityDot || !realityEventBox) return;

  if (realityShift.state === "INACTIVE") {
    realityStatusText.textContent = "REALITY: STABLE";
    realityStatusText.style.color = "var(--neon-cyan)";
    realityDot.style.backgroundColor = "var(--neon-cyan)";
    realityDot.style.boxShadow = "0 0 8px var(--neon-cyan)";
    realityEventBox.style.display = "none";
  } else if (realityShift.state === "WARNING") {
    realityStatusText.textContent = "REALITY: WARPING";
    realityStatusText.style.color = "var(--neon-amber)";
    realityDot.style.backgroundColor = "var(--neon-amber)";
    realityDot.style.boxShadow = "0 0 10px var(--neon-amber)";
    realityEventBox.style.display = "flex";
    realityEventName.textContent = `INCOMING: ${realityShift.currentEvent.name}`;
    realityEventName.style.color = "var(--neon-amber)";
    realityEventTime.textContent = "⚠ DETECTED";
    realityEventTime.style.color = "var(--neon-amber)";
  } else if (realityShift.state === "ACTIVE") {
    realityStatusText.textContent = "REALITY: UNSTABLE";
    realityStatusText.style.color = realityShift.currentEvent.themeColor;
    realityDot.style.backgroundColor = realityShift.currentEvent.themeColor;
    realityDot.style.boxShadow = `0 0 10px ${realityShift.currentEvent.themeColor}`;
    realityEventBox.style.display = "flex";
    realityEventName.textContent = `EVENT: ${realityShift.currentEvent.name}`;
    realityEventName.style.color = realityShift.currentEvent.themeColor;
    realityEventTime.textContent = `TIME: ${Math.max(0, realityShift.activeTimer).toFixed(1)}s`;
    realityEventTime.style.color = "var(--neon-amber)";
  }
}

function drawRealityShiftEffects() {
  // 1. Screen Flash
  if (realityShift.flashAlpha > 0) {
    ctx.save();
    ctx.fillStyle = realityShift.state === "WARNING"
      ? `rgba(255, 183, 3, ${realityShift.flashAlpha})`
      : `rgba(255, 0, 85, ${realityShift.flashAlpha})`;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    ctx.restore();
  }

  // 2. WARNING BANNER
  if (realityShift.state === "WARNING" && realityShift.currentEvent) {
    ctx.save();
    ctx.fillStyle = "rgba(10, 6, 18, 0.88)";
    ctx.fillRect(0, LOGICAL_HEIGHT * 0.32, LOGICAL_WIDTH, 110);

    ctx.strokeStyle = "#ffb703";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ffb703";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(0, LOGICAL_HEIGHT * 0.32);
    ctx.lineTo(LOGICAL_WIDTH, LOGICAL_HEIGHT * 0.32);
    ctx.moveTo(0, LOGICAL_HEIGHT * 0.32 + 110);
    ctx.lineTo(LOGICAL_WIDTH, LOGICAL_HEIGHT * 0.32 + 110);
    ctx.stroke();

    ctx.fillStyle = "#ffb703";
    ctx.font = "bold 24px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚠ REALITY SHIFT DETECTED ⚠", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.32 + 38);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px 'Consolas', monospace";
    ctx.fillText(`ANOMALY: ${realityShift.currentEvent.name}`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.32 + 68);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px 'Consolas', monospace";
    ctx.shadowBlur = 0;
    ctx.fillText(`PREPARE: ${realityShift.currentEvent.subtitle}`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT * 0.32 + 92);
    ctx.restore();
  }

  // 3. ACTIVE ANOMALY SHADERS & OVERLAYS
  if (realityShift.state === "ACTIVE" && realityShift.currentEvent) {
    const event = realityShift.currentEvent;

    // EVENT: BLACKOUT SPOTLIGHT
    if (event.id === "BLACKOUT") {
      ctx.save();
      const spotlightRadius = 140;
      const gradient = ctx.createRadialGradient(
        player.x, player.y, 40,
        player.x, player.y, spotlightRadius
      );
      gradient.addColorStop(0, "rgba(2, 4, 10, 0)");
      gradient.addColorStop(0.65, "rgba(2, 4, 10, 0.45)");
      gradient.addColorStop(1, "rgba(2, 4, 10, 0.96)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
      ctx.restore();
    }

    // EVENT: GLITCH RAIN HAZARDS
    if (event.id === "GLITCH_RAIN") {
      ctx.save();
      ctx.fillStyle = "#ff0055";
      ctx.shadowColor = "#ff0055";
      ctx.shadowBlur = 10;
      for (const h of rainHazards) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // EVENT: MIRROR WORLD DIVIDER LINE
    if (event.id === "MIRROR_WORLD") {
      ctx.save();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(LOGICAL_WIDTH / 2, 0);
      ctx.lineTo(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT);
      ctx.stroke();
      ctx.restore();
    }

    // EVENT: TIME FRACTURE FROST RINGS
    if (event.id === "TIME_FRACTURE") {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 240, 255, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 10;
      for (const g of glitches) {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // EVENT: MAGNETIC FIELD FLUX BEAMS
    if (event.id === "MAGNETIC_FIELD") {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 255, 136, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      for (const shard of shards) {
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(shard.x, shard.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Top-Center Active Event HUD Pill
    ctx.save();
    const pillW = 320;
    const pillH = 46;
    const pillX = (LOGICAL_WIDTH - pillW) / 2;
    const pillY = 12;

    ctx.fillStyle = "rgba(10, 14, 28, 0.9)";
    ctx.strokeStyle = event.themeColor;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = event.themeColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(pillX, pillY, pillW, pillH);
    ctx.strokeRect(pillX, pillY, pillW, pillH);

    ctx.fillStyle = event.themeColor;
    ctx.font = "bold 13px 'Consolas', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${event.name} — ${Math.max(0, realityShift.activeTimer).toFixed(1)}s`, LOGICAL_WIDTH / 2, pillY + 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "11px 'Segoe UI', sans-serif";
    ctx.fillText(event.subtitle, LOGICAL_WIDTH / 2, pillY + 32);

    const progress = Math.max(0, realityShift.activeTimer / event.duration);
    ctx.fillStyle = event.themeColor;
    ctx.fillRect(pillX + 2, pillY + pillH - 3, (pillW - 4) * progress, 2);
    ctx.restore();
  }
}

// ============================================================================
// 15. LEVEL PROGRESSION & ENEMY SCALING
// ============================================================================
const LEVEL_THRESHOLDS = [
  { level: 10, minScore: 7500 },
  { level: 9,  minScore: 6200 },
  { level: 8,  minScore: 5000 },
  { level: 7,  minScore: 4000 },
  { level: 6,  minScore: 3100 },
  { level: 5,  minScore: 2300 },
  { level: 4,  minScore: 1600 },
  { level: 3,  minScore: 1000 },
  { level: 2,  minScore: 500 },
  { level: 1,  minScore: 0 }
];

function getLevelForScore(currentScore) {
  if (currentScore >= 7500) {
    return 10 + Math.floor((currentScore - 7500) / 1500);
  }
  for (const threshold of LEVEL_THRESHOLDS) {
    if (currentScore >= threshold.minScore) {
      return threshold.level;
    }
  }
  return 1;
}

function updateLevel() {
  const calculatedLevel = getLevelForScore(score);

  if (calculatedLevel > level) {
    level = calculatedLevel;
    if (level > highestLevel) {
      highestLevel = level;
      Storage.set("glitch_runner_highest_level", highestLevel);
    }

    AudioSFX.playLevelUp();
    createFloatingText(`LEVEL UP! LVL ${level}`, player.x, player.y - 45, "#00ff88");
    statusMessage.textContent = `ALERT: LEVEL ${level} ENGAGED — THREAT ELEVATED`;

    if (realityShift.state !== "ACTIVE" || (realityShift.currentEvent.id !== "HYPER_MODE" && realityShift.currentEvent.id !== "TIME_FRACTURE")) {
      const newSpeed = 1.25 + (level - 1) * 0.2;
      glitches.forEach(g => { g.speed = newSpeed; });
    }

    // Scale enemy types with level
    const targetCount = Math.min(4, 1 + Math.floor((level - 1) / 2));
    while (glitches.length < targetCount) {
      const type = glitches.length === 1 ? "DRIFTER" : (glitches.length === 2 ? "DASHER" : "CHASER");
      spawnGlitch(type);
      createFloatingText("! THREAT MULTIPLIED !", player.x, player.y - 65, "#ff0055");
    }

    checkMissionProgress("REACH_LVL_3");
    updateHUD();
  }
}

// ============================================================================
// 16. PARTICLES & FLOATING COMBAT TEXT
// ============================================================================
function mobileHaptic(duration = 10) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function" && isMobileTouchDevice()) {
    try { navigator.vibrate(duration); } catch {}
  }
}

function createParticleBurst(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      radius: 2.5 + Math.random() * 2,
      life: 25,
      maxLife: 25
    });
  }
}

function createFloatingText(text, x, y, color) {
  floatingTexts.push({
    text,
    x,
    y,
    color,
    life: 45,
    maxLife: 45
  });
}

function updateParticlesAndFloatingTexts() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y -= 0.8;
    ft.life--;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFloatingTexts() {
  for (const ft of floatingTexts) {
    ctx.save();
    ctx.globalAlpha = ft.life / ft.maxLife;
    ctx.fillStyle = ft.color;
    ctx.shadowColor = ft.color;
    ctx.shadowBlur = 10;
    ctx.font = "bold 13px 'Consolas', monospace";
    ctx.textAlign = "center";
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

// ============================================================================
// 17. CANVAS ARENA & IN-CANVAS OVERLAYS
// ============================================================================
function drawArenaBackground() {
  ctx.fillStyle = "#050711";
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  const horizonY = LOGICAL_HEIGHT * 0.72;
  const horizonGlow = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY);
  horizonGlow.addColorStop(0, "transparent");
  horizonGlow.addColorStop(1, "rgba(0, 240, 255, 0.18)");
  ctx.fillStyle = horizonGlow;
  ctx.fillRect(0, horizonY - 40, LOGICAL_WIDTH, 40);

  ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(LOGICAL_WIDTH, horizonY);
  ctx.stroke();

  ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
  ctx.lineWidth = 1;

  for (let y = horizonY + 18; y < LOGICAL_HEIGHT; y += (y - horizonY) * 0.35 + 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(LOGICAL_WIDTH, y);
    ctx.stroke();
  }

  const centerX = LOGICAL_WIDTH / 2;
  for (let x = -LOGICAL_WIDTH; x <= LOGICAL_WIDTH * 2; x += 100) {
    ctx.beginPath();
    ctx.moveTo(centerX, horizonY);
    ctx.lineTo(x, LOGICAL_HEIGHT);
    ctx.stroke();
  }
}

function renderReadyScreen() {
  drawArenaBackground();
  shards.forEach(drawMemoryShard);
  glitches.forEach(drawGlitch);
  drawPlayer();

  ctx.save();
  const boxW = 540;
  const boxH = 190;
  const boxX = (LOGICAL_WIDTH - boxW) / 2;
  const boxY = (LOGICAL_HEIGHT * 0.72 - boxH) / 2 - 15;

  ctx.fillStyle = "rgba(14, 18, 34, 0.94)";
  ctx.strokeStyle = "rgba(0, 240, 255, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = "#00f0ff";
  ctx.font = "bold 15px 'Consolas', monospace";
  ctx.textAlign = "center";
  ctx.fillText("■ GLITCH RUNNER // MISSION READY ■", LOGICAL_WIDTH / 2, boxY + 28);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 19px 'Segoe UI', sans-serif";
  ctx.fillText("PRESS [START GAME] OR TAP ARENA", LOGICAL_WIDTH / 2, boxY + 58);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px 'Consolas', monospace";
  ctx.fillText("OBJECTIVE: COLLECT SHARDS • EVADE GLITCHES • SURVIVE REALITY SHIFTS", LOGICAL_WIDTH / 2, boxY + 86);

  ctx.fillStyle = "#38bdf8";
  ctx.fillText("DESKTOP: [WASD] or [ARROWS]  |  TOUCH: BUTTONS or TOUCH / DRAG", LOGICAL_WIDTH / 2, boxY + 112);

  ctx.fillStyle = "#ffb703";
  ctx.font = "bold 13px 'Consolas', monospace";
  ctx.fillText(`ALL-TIME BEST SCORE: ${String(bestScore).padStart(5, "0")}  |  BEST COMBO: ${bestCombo}x`, LOGICAL_WIDTH / 2, boxY + 144);

  ctx.fillStyle = "#00ff88";
  ctx.font = "11px 'Segoe UI', sans-serif";
  ctx.fillText("SHORTCUTS: [SPACE] START/PAUSE  |  [P/ESC] PAUSE  |  [M] MUTE", LOGICAL_WIDTH / 2, boxY + 170);

  ctx.restore();
}

function drawPauseOverlay() {
  ctx.save();
  ctx.fillStyle = "rgba(4, 6, 14, 0.82)";
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  ctx.fillStyle = "#ffb703";
  ctx.font = "bold 34px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 183, 3, 0.6)";
  ctx.shadowBlur = 18;
  ctx.fillText("SIMULATION PAUSED", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 16);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px 'Consolas', monospace";
  ctx.shadowBlur = 0;
  ctx.fillText("PRESS [PAUSE], [SPACE], OR CLICK START TO RESUME", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 20);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "12px 'Consolas', monospace";
  ctx.fillText("ALL TIMERS, ANOMALIES & THREATS ARE FROZEN", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 45);

  ctx.restore();
}

function drawGameOverOverlay() {
  ctx.save();
  ctx.fillStyle = "rgba(10, 2, 6, 0.92)";
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  ctx.fillStyle = "#ff0055";
  ctx.font = "bold 34px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255, 0, 85, 0.8)";
  ctx.shadowBlur = 20;
  ctx.fillText("CRITICAL FAILURE // GAME OVER", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 75);

  if (isNewHighScore) {
    ctx.fillStyle = "#ffb703";
    ctx.font = "bold 16px 'Consolas', monospace";
    ctx.shadowColor = "#ffb703";
    ctx.shadowBlur = 15;
    ctx.fillText("★ NEW ALL-TIME HIGH SCORE! ★", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 38);
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#00f0ff";
  ctx.font = "bold 15px 'Consolas', monospace";
  ctx.fillText(`FINAL SCORE: ${String(score).padStart(5, "0")}   |   BEST SCORE: ${String(bestScore).padStart(5, "0")}`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 - 8);

  ctx.fillStyle = "#ffb703";
  ctx.fillText(`MAX COMBO: ${maxCombo}x   |   BEST COMBO: ${bestCombo}x`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 18);

  ctx.fillStyle = "#00ff88";
  ctx.fillText(`LEVEL REACHED: ${level}   |   BOUNTIES WON: ${missionsCompleted}`, LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 44);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "13px 'Consolas', monospace";
  ctx.fillText("PRESS [SPACE] / [ENTER] OR CLICK RESTART TO REBOOT", LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2 + 82);

  ctx.restore();
}

// ============================================================================
// 18. STATE LIFECYCLE & ENGINE CONTROL
// ============================================================================
function stopGameLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  lastTimestamp = null;
}

function startGame() {
  if (gameState === "PLAYING") return;
  getAudioContext();
  stopGameLoop();

  gameState = "PLAYING";
  isNewHighScore = false;
  resetGameObjects();
  resetRealityShift();
  resetPowerUp();
  pickNextMission();

  setPauseButtonLabel("PAUSE", "⏸");

  statusMessage.textContent = "SIMULATION ACTIVE — RUNNER ENGAGED";
  statusDot.style.backgroundColor = "var(--neon-green)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-green)";

  lastTimestamp = performance.now();
  animationFrameId = requestAnimationFrame(gameLoop);
  syncMobileInterface();
}

function pauseGame() {
  if (gameState !== "PLAYING") return;

  gameState = "PAUSED";
  stopGameLoop();
  resetInputKeys();

  setPauseButtonLabel("RESUME", "▶");

  statusMessage.textContent = "SIMULATION PAUSED — ALL THREATS & TIMERS FROZEN";
  statusDot.style.backgroundColor = "var(--neon-amber)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-amber)";

  drawPauseOverlay();
  syncMobileInterface();
}

function resumeGame() {
  if (gameState !== "PAUSED") return;

  gameState = "PLAYING";
  stopGameLoop();
  resetInputKeys();

  setPauseButtonLabel("PAUSE", "⏸");

  statusMessage.textContent = "SIMULATION RESUMED — RUNNER ENGAGED";
  statusDot.style.backgroundColor = "var(--neon-green)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-green)";

  lastTimestamp = performance.now();
  animationFrameId = requestAnimationFrame(gameLoop);
  syncMobileInterface();
}

function restartGame() {
  stopGameLoop();
  gameState = "READY";

  resetGameObjects();
  resetRealityShift();
  resetPowerUp();
  setPauseButtonLabel("PAUSE", "⏸");

  statusMessage.textContent = "SYSTEM REBOOTED — READY FOR INITIALIZATION";
  statusDot.style.backgroundColor = "var(--neon-cyan)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-cyan)";

  renderReadyScreen();
  syncMobileInterface();
}

function endGame() {
  if (gameState === "GAME_OVER") return;

  gameState = "GAME_OVER";
  stopGameLoop();
  resetInputKeys();
  resetRealityShift();
  resetPowerUp();

  // Save High Scores
  if (score > bestScore) {
    bestScore = score;
    isNewHighScore = true;
    Storage.set("glitch_runner_best_score", bestScore);
  }
  if (maxCombo > bestCombo) {
    bestCombo = maxCombo;
    Storage.set("glitch_runner_best_combo", bestCombo);
  }

  setPauseButtonLabel("PAUSE", "⏸");

  if (isNewHighScore) {
    AudioSFX.playHighScore();
  } else {
    AudioSFX.playGameOver();
  }

  statusMessage.textContent = "CRITICAL FAILURE — SYSTEM OFFLINE";
  statusDot.style.backgroundColor = "var(--neon-red)";
  statusDot.style.boxShadow = "0 0 10px var(--neon-red)";

  updateHUD();

  // Clean render before game over overlay
  drawArenaBackground();
  shards.forEach(drawMemoryShard);
  glitches.forEach(drawGlitch);
  drawPlayer();
  drawGameOverOverlay();
  syncMobileInterface();
}

function resetGameObjects() {
  score = 0;
  health = 100;
  level = 1;
  combo = 0;
  maxCombo = 0;
  missionsCompleted = 0;

  player.x = LOGICAL_WIDTH / 2;
  player.y = LOGICAL_HEIGHT / 2;
  player.speed = player.baseSpeed;
  player.animTimer = 0;
  player.invulnerableTimer = 0;
  player.vx = 0;
  player.vy = 0;

  shards = [];
  glitches = [];
  particles = [];
  floatingTexts = [];
  stormShards = [];
  rainHazards = [];

  resetInputKeys();
  updateHUD();

  for (let i = 0; i < SHARD_COUNT; i++) {
    spawnMemoryShard();
  }
  spawnGlitch("CHASER");
}

function setPauseButtonLabel(text, glyph) {
  const btnText = btnPause.querySelector(".btn-text");
  const btnGlyph = btnPause.querySelector(".btn-glyph");
  if (btnText) btnText.textContent = text;
  if (btnGlyph) btnGlyph.textContent = glyph;
}

function updateHUD() {
  scoreDisplay.textContent = String(score).padStart(5, "0");
  bestScoreDisplay.textContent = String(bestScore).padStart(5, "0");

  if (comboDisplay) {
    comboDisplay.textContent = `${combo}x`;
    comboDisplay.style.color = combo > 2 ? "var(--neon-amber)" : "var(--neon-cyan)";
  }

  healthDisplay.textContent = `${Math.max(0, health)}%`;
  healthFill.style.width = `${Math.max(0, health)}%`;
  levelDisplay.textContent = String(level).padStart(2, "0");

  if (mobileLiveScore) mobileLiveScore.textContent = String(score).padStart(5, "0");
  if (mobileLiveLevel) mobileLiveLevel.textContent = String(level).padStart(2, "0");
  if (mobileLiveCombo) mobileLiveCombo.textContent = `${combo}x`;
  if (mobileComboFill) mobileComboFill.style.width = `${Math.min(100, (combo / 30) * 100)}%`;
  if (mobileLiveHealth) mobileLiveHealth.textContent = `${Math.max(0, health)}%`;
  if (mobileHealthFill) mobileHealthFill.style.width = `${Math.max(0, health)}%`;
}

// Button listeners
btnStart.addEventListener("click", () => {
  AudioSFX.playButton();
  if (gameState === "PLAYING") return;
  if (gameState === "PAUSED") {
    resumeGame();
  } else if (gameState === "READY" || gameState === "GAME_OVER") {
    startGame();
  }
});

btnPause.addEventListener("click", () => {
  AudioSFX.playButton();
  if (gameState === "PLAYING") {
    pauseGame();
  } else if (gameState === "PAUSED") {
    resumeGame();
  }
});

btnRestart.addEventListener("click", () => {
  AudioSFX.playButton();
  restartGame();
});


// Dedicated mobile D-pad. It directly drives the same input flags used by WASD/arrows.
if (mobileGameDpad) {
  mobileGameDpad.querySelectorAll("[data-mobile-key]").forEach((button) => {
    const keyName = button.dataset.mobileKey;
    const press = (event) => {
      event.preventDefault();
      event.stopPropagation();
      getAudioContext();
      if (gameState !== "PLAYING" || touchMode !== "buttons") return;
      if (button.setPointerCapture) {
        try { button.setPointerCapture(event.pointerId); } catch {}
      }
      keys[keyName] = true;
      button.classList.add("pressed");
    };
    const release = (event) => {
      event.preventDefault();
      event.stopPropagation();
      keys[keyName] = false;
      button.classList.remove("pressed");
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });
}

// Dedicated mobile interface actions
if (mobilePlayBtn) {
  mobilePlayBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    startGame();
  });
}

if (mobilePauseBtn) {
  mobilePauseBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    pauseGame();
  });
}

if (mobileResumeBtn) {
  mobileResumeBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    resumeGame();
  });
}

if (mobilePauseRestartBtn) {
  mobilePauseRestartBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    restartGame();
    startGame();
  });
}

if (mobilePauseHomeBtn) {
  mobilePauseHomeBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    mobileGoHome();
  });
}

if (mobilePlayAgainBtn) {
  mobilePlayAgainBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    startGame();
  });
}

if (mobileGameOverHomeBtn) {
  mobileGameOverHomeBtn.addEventListener("click", () => {
    AudioSFX.playButton();
    mobileGoHome();
  });
}

function toggleAudioFromMobile() {
  audioEnabled = !audioEnabled;
  Storage.set("glitch_runner_audio_enabled", audioEnabled);
  updateAudioButtonUI();
  if (audioEnabled) {
    AudioSFX.playButton();
  }
  syncMobileInterface();
}

if (mobileAudioBtn) {
  mobileAudioBtn.addEventListener("click", toggleAudioFromMobile);
}

if (mobilePlayAudioBtn) {
  mobilePlayAudioBtn.addEventListener("click", toggleAudioFromMobile);
}

if (mobileModeButtons) {
  mobileModeButtons.addEventListener("click", () => {
    AudioSFX.playButton();
    applyTouchMode("buttons");
    syncMobileInterface();
  });
}

if (mobileModeDrag) {
  mobileModeDrag.addEventListener("click", () => {
    AudioSFX.playButton();
    applyTouchMode("drag");
    syncMobileInterface();
  });
}

// ============================================================================
// 19. MAIN GAME LOOP
// ============================================================================
function gameLoop(timestamp) {
  if (gameState !== "PLAYING") {
    animationFrameId = null;
    lastTimestamp = null;
    return;
  }

  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  // 1. UPDATE
  updateRealityShift(deltaTime);
  updatePowerUp(deltaTime);
  updatePlayer();
  updateShards();
  updateGlitches(deltaTime);
  checkCollisions();
  updateParticlesAndFloatingTexts();

  if (health <= 0) {
    endGame();
    return;
  }

  // 2. RENDER
  drawArenaBackground();
  shards.forEach(drawMemoryShard);
  stormShards.forEach(drawMemoryShard);
  glitches.forEach(drawGlitch);
  drawPlayer();
  drawRealityShiftEffects();
  drawParticles();
  drawFloatingTexts();

  // 3. NEXT FRAME
  animationFrameId = requestAnimationFrame(gameLoop);
}

// ============================================================================
// 20. INITIALIZATION
// ============================================================================
window.addEventListener("DOMContentLoaded", () => {
  gameState = "READY";
  setupHiDPICanvas();
  detectTouchDevice();
  applyTouchMode(touchMode);
  updateAudioButtonUI();

  resetGameObjects();
  resetRealityShift();
  resetPowerUp();
  pickNextMission();
  renderReadyScreen();
  syncMobileInterface();

  console.log("⚡ GLITCH RUNNER v1.1 mobile interface armed and ready.");
});

window.addEventListener("resize", () => {
  setupHiDPICanvas();
  detectTouchDevice();
  syncMobileInterface();
  if (gameState === "READY") {
    renderReadyScreen();
  } else if (gameState === "PAUSED") {
    drawPauseOverlay();
  } else if (gameState === "GAME_OVER") {
    drawGameOverOverlay();
  }
});
