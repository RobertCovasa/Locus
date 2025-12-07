// --- CONFIGURATION ---
const MODES = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

// --- STATE ---
let timeLeft = MODES.focus;
let isRunning = false;
let currentMode = 'focus';
let timerInterval = null;
let lastTime = 0;
let sessionsCompleted = 0; // Tracks sets of 4

// --- ELEMENTS ---
const timerDisplay = document.getElementById('timer');
const intentInput = document.getElementById('intent-input');
const dotsContainer = document.getElementById('dots-container');
const body = document.body;
const faviconLink = document.getElementById('favicon');

// --- CORE FUNCTIONS ---

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    const formatted = formatTime(timeLeft);
    timerDisplay.textContent = formatted;
    
    // Update Browser Tab Title
    const intent = intentInput.value ? `(${intentInput.value})` : '';
    document.title = `${formatted} ${intent}`;

    updateFavicon();
}

// FEATURE: Dynamic Favicon
function updateFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Calculate percentage
    const total = MODES[currentMode];
    const pct = 1 - (timeLeft / total);

    // Background circle
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fillStyle = currentMode === 'focus' ? '#333' : '#b2dfdb'; // Dark for focus, Light Green for break
    ctx.fill();

    // Pie chart slice (Progress)
    ctx.beginPath();
    ctx.moveTo(16, 16);
    // Start at top (-PI/2), draw arc based on pct
    ctx.arc(16, 16, 14, -Math.PI / 2, (-Math.PI / 2) + (pct * 2 * Math.PI));
    ctx.lineTo(16, 16);
    ctx.fillStyle = currentMode === 'focus' ? '#f0f0f0' : '#00695c';
    ctx.fill();

    faviconLink.href = canvas.toDataURL();
}

// FEATURE: Update Dots UI
function updateDots() {
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
        if (i < sessionsCompleted) {
            dots[i].classList.add('filled');
        } else {
            dots[i].classList.remove('filled');
        }
    }
}

function switchMode(mode) {
    pauseTimer();
    currentMode = mode;
    timeLeft = MODES[mode];
    
    if (mode === 'focus') {
        body.classList.remove('break-mode');
        intentInput.style.display = 'block'; // Show input in focus
    } else {
        body.classList.add('break-mode');
        // Optional: Hide input during break to reduce clutter
        // intentInput.style.display = 'none'; 
    }
    
    updateDisplay();
}

function handleTimerComplete() {
    playSound();
    pauseTimer();

    if (currentMode === 'focus') {
        sessionsCompleted++;
        if (sessionsCompleted >= 4) {
            sessionsCompleted = 0; // Reset cycle
            switchMode('long');
        } else {
            switchMode('short');
        }
    } else {
        // Break is over, back to focus
        switchMode('focus');
    }
    updateDots();
}

function playSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
}

function tick() {
    const now = Date.now();
    const delta = (now - lastTime) / 1000;
    
    if (delta >= 1) {
        timeLeft--;
        lastTime = now;

        if (timeLeft <= 0) {
            timeLeft = 0;
            handleTimerComplete();
        }
        updateDisplay();
    }
}

function startTimer() {
    if (isRunning) return;
    
    // FEATURE: Blur input on start so typing 'r' doesn't reset
    intentInput.blur();
    
    isRunning = true;
    lastTime = Date.now();
    timerInterval = setInterval(tick, 100);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function toggleTimer() {
    if (isRunning) pauseTimer();
    else startTimer();
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode];
    updateDisplay();
}

// --- EVENT LISTENERS ---

// 1. Controls
document.getElementById('btn-focus').onclick = () => { sessionsCompleted = 0; updateDots(); switchMode('focus'); };
document.getElementById('btn-short').onclick = () => switchMode('short');
document.getElementById('btn-long').onclick = () => switchMode('long');
document.getElementById('btn-reset').onclick = () => resetTimer();

// 2. Click Timer to Start/Stop
timerDisplay.onclick = toggleTimer;

// 3. Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // If user is typing in the input box, ignore shortcuts (except Enter)
    if (document.activeElement === intentInput) {
        if (e.key === 'Enter') {
            startTimer();
        }
        return;
    }

    if (e.code === 'Space') {
        toggleTimer();
    }
    if (e.key.toLowerCase() === 'r') {
        resetTimer();
    }
});

// Initialize
updateDisplay();
updateDots();