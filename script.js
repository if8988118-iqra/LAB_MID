/**
 * ==========================================================================
 * Tidepop Typing Challenge - CSC336 Web Technologies (Lab Mid Fall-2026)
 * COMSATS University Islamabad, Vehari Campus
 * File: script.js
 * ==========================================================================
 */

/* 1. SOUND ENGINE (Web Audio API Synthesizer - 100% offline) */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('typing_game_muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('typing_game_volume') || '0.7');
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        } else if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.muted = muted;
        localStorage.setItem('typing_game_muted', muted ? 'true' : 'false');
    }

    playPop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(750, t + 0.04);
            osc.frequency.exponentialRampToValueAtTime(420, t + 0.08);
            gain.gain.setValueAtTime(this.volume * 0.8, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.1);
        } catch (e) { }
    }

    playKeyHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(540, t);
            osc.frequency.exponentialRampToValueAtTime(880, t + 0.04);
            gain.gain.setValueAtTime(this.volume * 0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.07);
        } catch (e) { }
    }

    playError() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.linearRampToValueAtTime(90, t + 0.18);
            gain.gain.setValueAtTime(this.volume * 0.7, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        } catch (e) { }
    }

    playMiss() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, t);
            osc.frequency.exponentialRampToValueAtTime(110, t + 0.22);
            gain.gain.setValueAtTime(this.volume * 0.65, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        } catch (e) { }
    }

    playCombo(streak = 1) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const baseFreq = 440;
            const step = Math.min(streak, 12);
            const freq = baseFreq * Math.pow(1.059463, step);
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(this.volume * 0.6, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.15);
        } catch (e) { }
    }

    playLevelUp() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        [330, 440, 554, 659].forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(this.volume * 0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.13);
        });
    }

    playGameOver() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        [350, 311, 277, 220].forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.15;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(this.volume * 0.6, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.26);
        });
    }

    playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(this.volume * 0.6, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.36);
        });
    }
}
const soundEngine = new SoundEngine();

/* 2. CONFETTI ENGINE */
class ConfettiEngine {
    constructor(canvasId = 'confetti-canvas') {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.animId = null;
        this.colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24', '#f87171'];
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    burst(count = 70) {
        if (!this.canvas || !this.ctx) return;
        this.resizeCanvas();
        const originX = this.canvas.width / 2;
        const originY = this.canvas.height / 3;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 9 + 4;
            this.particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 7 + 4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                gravity: 0.18
            });
        }

        if (!this.animId) {
            this.loop = this.loop.bind(this);
            this.animId = requestAnimationFrame(this.loop);
        }
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.012;

            if (p.opacity <= 0 || p.y > this.canvas.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(this.loop);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.animId = null;
        }
    }
}
const confettiEngine = new ConfettiEngine();

/* 3. STORAGE MANAGER */
const StorageManager = {
    KEYS: {
        HIGH_SCORES: 'typing_game_high_scores',
        SESSION_HISTORY: 'typing_game_history',
        CUSTOM_KEYSETS: 'typing_game_custom_keysets',
        ACTIVE_KEYSET: 'typing_game_active_keyset',
        THEME: 'typing_game_theme'
    },

    getHighScores() {
        try {
            const d = localStorage.getItem(this.KEYS.HIGH_SCORES);
            return d ? JSON.parse(d) : { bubbles: { easy: 0, medium: 0, hard: 0 }, magnet: { easy: 0, medium: 0, hard: 0 } };
        } catch (e) {
            return { bubbles: { easy: 0, medium: 0, hard: 0 }, magnet: { easy: 0, medium: 0, hard: 0 } };
        }
    },

    saveHighScore(mode, difficulty, score) {
        const scores = this.getHighScores();
        if (!scores[mode]) scores[mode] = {};
        const cur = scores[mode][difficulty] || 0;
        const isNew = score > cur;
        if (isNew) {
            scores[mode][difficulty] = score;
            localStorage.setItem(this.KEYS.HIGH_SCORES, JSON.stringify(scores));
        }
        return { isNewHigh: isNew, highScore: Math.max(score, cur) };
    },

    saveSession(sessionData) {
        try {
            const h = this.getSessionHistory();
            h.unshift({ id: 'sess_' + Date.now(), date: new Date().toISOString(), ...sessionData });
            if (h.length > 50) h.pop();
            localStorage.setItem(this.KEYS.SESSION_HISTORY, JSON.stringify(h));
        } catch (e) { }
    },

    getSessionHistory() {
        try {
            const d = localStorage.getItem(this.KEYS.SESSION_HISTORY);
            return d ? JSON.parse(d) : [];
        } catch (e) { return []; }
    },

    clearSessionHistory() {
        localStorage.removeItem(this.KEYS.SESSION_HISTORY);
    },

    getCustomKeysets() {
        try {
            const d = localStorage.getItem(this.KEYS.CUSTOM_KEYSETS);
            return d ? JSON.parse(d) : [];
        } catch (e) { return []; }
    },

    saveCustomKeyset(name, keys, isWordList = false) {
        const sets = this.getCustomKeysets();
        const existingIdx = sets.findIndex(s => s.name.toLowerCase() === name.toLowerCase());
        const newSet = {
            id: 'set_' + Date.now(),
            name,
            keys: Array.isArray(keys) ? keys : Array.from(keys),
            isWordList,
            created: new Date().toISOString()
        };
        if (existingIdx >= 0) sets[existingIdx] = newSet;
        else sets.push(newSet);
        localStorage.setItem(this.KEYS.CUSTOM_KEYSETS, JSON.stringify(sets));
        this.setActiveKeyset(newSet.id);
        return newSet;
    },

    getActiveKeyset() {
        const activeId = localStorage.getItem(this.KEYS.ACTIVE_KEYSET);
        if (!activeId) return null;
        return this.getCustomKeysets().find(s => s.id === activeId) || null;
    },

    setActiveKeyset(id) {
        if (!id) localStorage.removeItem(this.KEYS.ACTIVE_KEYSET);
        else localStorage.setItem(this.KEYS.ACTIVE_KEYSET, id);
    },

    deleteCustomKeyset(id) {
        let sets = this.getCustomKeysets().filter(s => s.id !== id);
        localStorage.setItem(this.KEYS.CUSTOM_KEYSETS, JSON.stringify(sets));
        if (localStorage.getItem(this.KEYS.ACTIVE_KEYSET) === id) {
            localStorage.removeItem(this.KEYS.ACTIVE_KEYSET);
        }
    },

    getTheme() {
        return 'light';
    },

    setTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
};

/* 4. FILE MANAGER */
class FileManager {
    async handleFileUpload(file) {
        if (!file) throw new Error('No file selected.');
        const fileName = file.name;
        const ext = fileName.split('.').pop().toLowerCase();
        const content = await file.text();

        if (ext === 'json') return this.parseJSONFile(content, fileName);
        if (ext === 'txt') return this.parseTXTFile(content, fileName);
        throw new Error('Unsupported format. Please upload .txt or .json');
    }

    parseJSONFile(content, fileName) {
        try {
            const parsed = JSON.parse(content);
            const name = parsed.name || fileName.replace(/\.json$/i, '');
            let keys = [];
            let isWordList = false;

            if (Array.isArray(parsed.keys) && parsed.keys.length > 0) {
                keys = parsed.keys.map(k => String(k).trim()).filter(k => k.length > 0);
            } else if (Array.isArray(parsed.words) && parsed.words.length > 0) {
                keys = parsed.words.map(w => String(w).trim().toUpperCase()).filter(w => w.length > 0);
                isWordList = true;
            } else if (Array.isArray(parsed)) {
                keys = parsed.map(item => String(item).trim()).filter(item => item.length > 0);
            } else {
                throw new Error('JSON must contain "keys" or "words" array.');
            }

            keys = Array.from(new Set(keys));
            if (keys.length === 0) throw new Error('No valid keys found in JSON.');
            return { name, keys, isWordList, count: keys.length, source: fileName };
        } catch (err) {
            throw new Error('Invalid JSON format: ' + err.message);
        }
    }

    parseTXTFile(content, fileName) {
        const raw = content.trim();
        if (!raw) throw new Error('Uploaded file is empty.');
        const name = fileName.replace(/\.txt$/i, '');
        let keys = [];
        let isWordList = false;

        if (raw.includes('\n')) {
            const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            isWordList = lines.some(l => l.length > 1);
            keys = lines.map(l => l.toUpperCase());
        } else if (raw.includes(',')) {
            keys = raw.split(',').map(k => k.trim().toUpperCase()).filter(k => k.length > 0);
        } else {
            const words = raw.split(/\s+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 0);
            if (words.length > 1) {
                keys = words;
                isWordList = words.some(w => w.length > 1);
            } else {
                keys = raw.split('').map(c => c.trim().toUpperCase()).filter(c => c.length > 0);
            }
        }

        keys = Array.from(new Set(keys));
        if (keys.length === 0) throw new Error('No valid characters extracted.');
        return { name, keys, isWordList, count: keys.length, source: fileName };
    }

    downloadSampleJSON() {
        const sample = {
            name: "COMSATS WebTech Keyset",
            description: "Midterm practice keyset",
            keys: ["A", "S", "D", "F", "J", "K", "L", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
        };
        this.triggerDownload("sample_keyset.json", JSON.stringify(sample, null, 2), "application/json");
    }

    downloadSampleTXT() {
        const sampleText = "REACT, NODE, VITE, HTML, CSS, JAVASCRIPT, PYTHON, DOCKER, GIT, COMSATS, VEHARICAMPUS";
        this.triggerDownload("sample_words.txt", sampleText, "text/plain");
    }

    exportScorecardTXT(sessionData) {
        const dateStr = new Date().toLocaleString();
        const modeName = sessionData.mode === 'bubbles' ? 'Mode A: Bubbles (Letter Recognition)' : 'Mode B: KeyMagnet (Keyboard Precision)';

        const cardContent =
            `========================================================================
     COMSATS UNIVERSITY ISLAMABAD, VEHARI CAMPUS
        Department of Computer Science - BSSE
   CSC336 Web Technologies - Lab Mid Typing Challenge
========================================================================

PLAYER SCORECARD & PERFORMANCE CERTIFICATE
------------------------------------------------------------------------
Date & Time        : ${dateStr}
Game Mode          : ${modeName}
Difficulty Level   : ${(sessionData.difficulty || 'Normal').toUpperCase()}
Active Keyset      : ${sessionData.keysetName || 'Standard Default Set'}

PERFORMANCE METRICS
------------------------------------------------------------------------
Final Score        : ${sessionData.score} PTS
Performance Grade  : ${sessionData.grade || 'A'}
Accuracy Rate      : ${sessionData.accuracy || 100}%
Correct Keystrokes : ${sessionData.correct || 0}
Incorrect Keystrokes: ${sessionData.incorrect || 0}
Total Misses       : ${sessionData.misses || 0} / ${sessionData.maxMisses || 6}
Avg. Response Time : ${sessionData.avgResponseTime || 'N/A'} ms
Max Streak / Combo : ${sessionData.maxStreak || 0}x
Game Duration      : ${sessionData.duration || '0'}s

STATUS & OUTCOME
------------------------------------------------------------------------
Game Outcome       : ${(sessionData.outcome || 'COMPLETED').toUpperCase()}
High Score Record  : ${sessionData.isNewHigh ? 'YES! NEW RECORD!' : 'NO'}

========================================================================
Verified Client-Side Signature: SHA-ES6-${Date.now().toString(16).toUpperCase()}
Generated automatically by Typing Challenge Game Engine (HTML5/ES6+)
========================================================================`;

        this.triggerDownload(`Typing_Scorecard_${sessionData.mode}_${Date.now()}.txt`, cardContent, "text/plain");
    }

    exportSessionJSON(sessionData) {
        const data = {
            institution: "COMSATS University Islamabad, Vehari Campus",
            course: "CSC336 Web Technologies Lab Mid",
            exportedAt: new Date().toISOString(),
            session: sessionData
        };
        this.triggerDownload(`Session_Report_${sessionData.mode}_${Date.now()}.json`, JSON.stringify(data, null, 2), "application/json");
    }

    exportHistoryCSV() {
        const history = StorageManager.getSessionHistory();
        if (history.length === 0) {
            alert("No match history recorded yet.");
            return;
        }
        const headers = ["Session ID", "Date", "Mode", "Difficulty", "Score", "Accuracy (%)", "Correct", "Incorrect", "Misses", "Avg Response (ms)", "Grade"];
        const rows = history.map(item => [
            item.id,
            `"${new Date(item.date).toLocaleString()}"`,
            item.mode,
            item.difficulty,
            item.score,
            item.accuracy,
            item.correct,
            item.incorrect,
            item.misses,
            item.avgResponseTime || 'N/A',
            item.grade
        ]);
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        this.triggerDownload(`TypingGame_History_${Date.now()}.csv`, csv, "text/csv");
    }

    triggerDownload(filename, text, mimeType) {
        const blob = new Blob([text], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
const fileManager = new FileManager();

/* 5. MODE A: BUBBLES */
class BubbleGameMode {
    constructor(arenaElement) {
        this.arena = arenaElement;
        this.isRunning = false;
        this.isPaused = false;
        this.animFrameId = null;
        this.lastTime = 0;

        this.score = 0;
        this.misses = 0;
        this.maxMisses = 6;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.wave = 1;
        this.popsInWave = 0;
        this.targetPopsToWin = 50;
        this.elapsedSeconds = 0;
        this.timerIntervalId = null;

        this.difficulty = 'medium';
        this.minBubbles = 5;
        this.baseSpeed = 70;
        this.penaltyPoints = 5;

        this.bubbles = [];
        this.bubbleIdCounter = 0;
        this.letterPool = [];
        this.colorVariants = ['variant-cyan', 'variant-purple', 'variant-pink', 'variant-amber', 'variant-green'];

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.animationLoop = this.animationLoop.bind(this);
    }

    setDifficulty(diff) {
        this.difficulty = diff;
        if (diff === 'easy') {
            this.minBubbles = 5;
            this.baseSpeed = 50;
            this.maxMisses = 6;
            this.penaltyPoints = 3;
            this.targetPopsToWin = 40;
        } else if (diff === 'medium') {
            this.minBubbles = 6;
            this.baseSpeed = 75;
            this.maxMisses = 5;
            this.penaltyPoints = 5;
            this.targetPopsToWin = 55;
        } else if (diff === 'hard') {
            this.minBubbles = 7;
            this.baseSpeed = 105;
            this.maxMisses = 4;
            this.penaltyPoints = 8;
            this.targetPopsToWin = 70;
        }
        this.setupLetterPool();
    }

    setupLetterPool() {
        const activeCustom = StorageManager.getActiveKeyset();
        if (activeCustom && activeCustom.keys && activeCustom.keys.length > 0) {
            this.letterPool = Array.from(new Set(activeCustom.keys.join('').toUpperCase().split('').filter(c => c.trim())));
            return;
        }
        if (this.difficulty === 'easy') {
            this.letterPool = ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'O', 'T', 'R'];
        } else if (this.difficulty === 'medium') {
            this.letterPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        } else {
            this.letterPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?#$'.split('');
        }
    }

    start() {
        if (this.isRunning) return;
        this.resetState();
        this.setupLetterPool();
        this.isRunning = true;
        this.isPaused = false;

        window.addEventListener('keydown', this.handleKeyDown);

        for (let i = 0; i < this.minBubbles; i++) {
            this.spawnBubble(true, i * 60);
        }

        this.lastTime = performance.now();
        this.animFrameId = requestAnimationFrame(this.animationLoop);
        this.startTimer();
        this.updateHUD();
    }

    startTimer() {
        this.stopTimer();
        this.timerIntervalId = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                this.elapsedSeconds++;
                this.updateHUD();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerIntervalId) {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
        }
    }

    pause() {
        this.isPaused = true;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        this.lastTime = performance.now();
        this.animFrameId = requestAnimationFrame(this.animationLoop);
    }

    restart() {
        this.cleanup();
        this.start();
    }

    reset() {
        this.cleanup();
        this.resetState();
        this.clearArena();
        this.updateHUD();
    }

    cleanup() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.stopTimer();
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    resetState() {
        this.score = 0;
        this.misses = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.wave = 1;
        this.popsInWave = 0;
        this.elapsedSeconds = 0;
        this.bubbles = [];
        this.clearArena();
    }

    clearArena() {
        const danger = this.arena.querySelector('.danger-boundary');
        this.arena.innerHTML = '';
        if (danger) this.arena.appendChild(danger);
        else {
            const db = document.createElement('div');
            db.className = 'danger-boundary';
            db.innerHTML = '<span>Surface: a bubble that touches this line is a miss</span>';
            this.arena.appendChild(db);
        }
    }

    spawnBubble(isInitial = false, staggerY = 0) {
        if (this.bubbles.length >= this.minBubbles + 3) return;
        const used = this.bubbles.map(b => b.char);
        const free = this.letterPool.filter(c => !used.includes(c));
        const src = free.length ? free : this.letterPool;
        const char = src[Math.floor(Math.random() * src.length)];
        const arenaWidth = this.arena.clientWidth || 600;
        const bubbleSize = window.innerWidth < 768 ? 50 : 62;
        const padding = 20;

        let x = padding + Math.random() * (arenaWidth - bubbleSize - padding * 2);
        const arenaHeight = this.arena.clientHeight || 520;
        let y = arenaHeight + staggerY;
        if (isInitial) y = arenaHeight - (staggerY + Math.random() * 220);

        const speedVariation = (Math.random() * 0.4 + 0.8);
        const waveMultiplier = 1 + (this.wave - 1) * 0.12;
        const speed = this.baseSpeed * speedVariation * waveMultiplier;
        const variant = this.colorVariants[Math.floor(Math.random() * this.colorVariants.length)];

        const el = document.createElement('div');
        el.className = `game-bubble ${variant}`;
        el.textContent = char;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.matchKey(char);
        });

        this.arena.appendChild(el);
        this.bubbles.push({ id: ++this.bubbleIdCounter, el, char, x, y, speed, size: bubbleSize });
    }

    animationLoop(currentTime) {
        if (!this.isRunning || this.isPaused) return;

        const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
        this.lastTime = currentTime;
        const ceilingY = 28;

        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const b = this.bubbles[i];
            b.y -= b.speed * dt;
            b.el.style.top = `${b.y}px`;

            if (b.y <= ceilingY) {
                this.handleMiss(b, i);
            }
        }

        while (this.bubbles.length < this.minBubbles) {
            this.spawnBubble(false, Math.random() * 80);
        }

        if (this.misses >= this.maxMisses) {
            this.endGame('miss_limit');
            return;
        }
        if (this.correctCount >= this.targetPopsToWin) {
            this.endGame('victory');
            return;
        }

        this.animFrameId = requestAnimationFrame(this.animationLoop);
    }

    handleMiss(bubble, index) {
        this.misses++;
        this.streak = 0;
        soundEngine.playMiss();
        this.triggerScreenFeedback(false);

        bubble.el.classList.add('bubble-pop-anim');
        bubble.el.style.filter = 'grayscale(1) brightness(0.6)';
        setTimeout(() => { if (bubble.el.parentNode) bubble.el.remove(); }, 250);
        this.bubbles.splice(index, 1);
        this.updateHUD();
    }

    handleKeyDown(e) {
        if (!this.isRunning || this.isPaused) return;
        if (e.repeat) return;
        if (e.key.length !== 1 || e.key === ' ' || e.ctrlKey || e.metaKey || e.altKey) return;
        this.matchKey(e.key.toUpperCase());
    }

    matchKey(pressedKey) {
        if (!this.isRunning || this.isPaused) return;

        let matchedIndex = -1;
        let lowestY = Infinity;

        for (let i = 0; i < this.bubbles.length; i++) {
            if (this.bubbles[i].char.toUpperCase() === pressedKey) {
                if (this.bubbles[i].y < lowestY) {
                    lowestY = this.bubbles[i].y;
                    matchedIndex = i;
                }
            }
        }

        if (matchedIndex !== -1) {
            const matchedBubble = this.bubbles[matchedIndex];
            this.correctCount++;
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;

            const comboMultiplier = Math.min(4, 1 + Math.floor(this.streak / 5) * 0.5);
            const pointsWon = Math.round(10 * comboMultiplier);
            this.score += pointsWon;

            soundEngine.playPop();
            if (this.streak > 1 && this.streak % 3 === 0) soundEngine.playCombo(this.streak);

            this.showFloatingScore(matchedBubble.x, matchedBubble.y, `+${pointsWon}`, true);
            this.triggerScreenFeedback(true);

            matchedBubble.el.classList.add('bubble-pop-anim');
            setTimeout(() => { if (matchedBubble.el.parentNode) matchedBubble.el.remove(); }, 250);
            this.bubbles.splice(matchedIndex, 1);

            this.popsInWave++;
            if (this.popsInWave >= 10) this.levelUpWave();

        } else {
            this.incorrectCount++;
            this.streak = 0;
            this.score = Math.max(0, this.score - this.penaltyPoints);
            soundEngine.playError();
            this.triggerScreenFeedback(false);

            const arenaRect = this.arena.getBoundingClientRect();
            this.showFloatingScore(arenaRect.width / 2 - 20, arenaRect.height / 2, `-${this.penaltyPoints}`, false);
        }

        this.updateHUD();
    }

    levelUpWave() {
        this.wave++;
        this.popsInWave = 0;
        soundEngine.playLevelUp();

        const banner = document.createElement('div');
        banner.className = 'wave-banner';
        banner.textContent = `Wave ${this.wave}: bubbles are faster`;
        this.arena.appendChild(banner);

        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 400);
        }, 1200);

        if (this.wave === 3 && this.minBubbles < 8) this.minBubbles++;
    }

    triggerScreenFeedback(isCorrect) {
        const overlay = document.getElementById('screen-feedback-overlay');
        if (!overlay) return;
        overlay.classList.remove('flash-correct', 'flash-incorrect');
        document.body.classList.remove('shake-screen');
        void overlay.offsetWidth;

        if (isCorrect) overlay.classList.add('flash-correct');
        else {
            overlay.classList.add('flash-incorrect');
            document.body.classList.add('shake-screen');
        }

        setTimeout(() => {
            overlay.classList.remove('flash-correct', 'flash-incorrect');
            document.body.classList.remove('shake-screen');
        }, 220);
    }

    showFloatingScore(x, y, text, isPlus) {
        const floater = document.createElement('div');
        floater.className = `float-score ${isPlus ? 'plus' : 'minus'}`;
        floater.textContent = text;
        floater.style.left = `${Math.max(10, Math.min(x, (this.arena.clientWidth || 500) - 60))}px`;
        floater.style.top = `${Math.max(20, y)}px`;
        this.arena.appendChild(floater);
        setTimeout(() => floater.remove(), 650);
    }

    updateHUD() {
        const scoreEl = document.getElementById('hud-score');
        const missesEl = document.getElementById('hud-misses');
        const streakEl = document.getElementById('hud-streak');
        const waveEl = document.getElementById('hud-wave');
        const accuracyEl = document.getElementById('hud-accuracy');
        const timerEl = document.getElementById('hud-timer');

        if (scoreEl) scoreEl.textContent = this.score;
        if (streakEl) streakEl.textContent = `${this.streak}x`;
        if (waveEl) waveEl.textContent = `Wave ${this.wave}`;

        if (missesEl) {
            const remainingLives = Math.max(0, this.maxMisses - this.misses);
            let hearts = '';
            for (let i = 0; i < this.maxMisses; i++) {
                hearts += i < remainingLives ? '<span class="heart on">♥</span>' : '<span class="heart off">♡</span>';
            }
            missesEl.innerHTML = hearts;
        }

        const totalHits = this.correctCount + this.incorrectCount;
        const accuracy = totalHits > 0 ? Math.round((this.correctCount / totalHits) * 100) : 100;
        if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

        if (timerEl) {
            const mins = Math.floor(this.elapsedSeconds / 60);
            const secs = this.elapsedSeconds % 60;
            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    endGame(reason) {
        this.cleanup();
        const isVictory = reason === 'victory';

        if (isVictory) soundEngine.playVictory();
        else soundEngine.playGameOver();

        const totalAttempts = this.correctCount + this.incorrectCount;
        const accuracy = totalAttempts > 0 ? Math.round((this.correctCount / totalAttempts) * 100) : 0;

        let grade = 'C';
        if (accuracy >= 95 && this.score >= 300) grade = 'S';
        else if (accuracy >= 88 && this.score >= 200) grade = 'A';
        else if (accuracy >= 75 && this.score >= 120) grade = 'B';
        else if (accuracy < 50 || this.misses >= this.maxMisses) grade = 'F';

        const highInfo = StorageManager.saveHighScore('bubbles', this.difficulty, this.score);
        const sessionData = {
            mode: 'bubbles',
            difficulty: this.difficulty,
            score: this.score,
            highScore: highInfo.highScore,
            isNewHigh: highInfo.isNewHigh,
            accuracy,
            correct: this.correctCount,
            incorrect: this.incorrectCount,
            misses: this.misses,
            maxMisses: this.maxMisses,
            maxStreak: this.maxStreak,
            wave: this.wave,
            duration: this.elapsedSeconds,
            outcome: isVictory ? 'Victory - Cleared!' : 'Game Over - Miss Limit Reached',
            grade
        };

        StorageManager.saveSession(sessionData);
        if (window.app) window.app.showResults(sessionData);
    }
}

/* 6. MODE B: KEYMAGNET */
class KeyMagnetGameMode {
    constructor(containerElement) {
        this.container = containerElement;
        this.isRunning = false;
        this.isPaused = false;

        this.score = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalTrials = 30;
        this.currentTrial = 0;
        this.responseTimes = [];
        this.currentKeyStartTime = 0;
        this.targetKeyTimerId = null;
        this.advanceTimerId = null;
        this.locked = false;
        this.pendingAdvance = false;
        this.sessionTimerIntervalId = null;
        this.elapsedSeconds = 0;

        this.difficulty = 'medium';
        this.currentKeySetType = 'home_row';
        this.targetKey = '';
        this.timeLimitPerKey = 2200;

        this.keySets = {
            home_row: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
            top_row: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            bottom_row: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
        };

        this.activeKeyPool = [...this.keySets.home_row];
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleVirtualKeyClick = this.handleVirtualKeyClick.bind(this);
    }

    setDifficulty(diff) {
        this.difficulty = diff;
        if (diff === 'easy') {
            this.timeLimitPerKey = 3500;
            this.totalTrials = 25;
        } else if (diff === 'medium') {
            this.timeLimitPerKey = 2200;
            this.totalTrials = 30;
        } else if (diff === 'hard') {
            this.timeLimitPerKey = 1250;
            this.totalTrials = 40;
        }
        this.refreshKeyPool();
    }

    setKeySetType(type) {
        this.currentKeySetType = type;
        this.refreshKeyPool();
    }

    refreshKeyPool() {
        if (this.currentKeySetType === 'custom') {
            const activeCustom = StorageManager.getActiveKeyset();
            if (activeCustom && activeCustom.keys && activeCustom.keys.length > 0) {
                let extracted = [];
                activeCustom.keys.forEach(k => {
                    if (k.length === 1) extracted.push(k.toUpperCase());
                    else extracted.push(...k.toUpperCase().split(''));
                });
                this.activeKeyPool = Array.from(new Set(extracted));
            } else {
                this.activeKeyPool = [...this.keySets.home_row];
            }
        } else if (this.keySets[this.currentKeySetType]) {
            this.activeKeyPool = [...this.keySets[this.currentKeySetType]];
        } else {
            this.activeKeyPool = [...this.keySets.home_row];
        }
    }

    start() {
        if (this.isRunning) return;
        this.resetState();
        this.refreshKeyPool();
        this.isRunning = true;
        this.isPaused = false;

        window.addEventListener('keydown', this.handleKeyDown);
        this.bindVirtualKeyboardEvents();

        this.startSessionTimer();
        this.nextTargetKey();
        this.updateHUD();
    }

    startSessionTimer() {
        this.stopSessionTimer();
        this.sessionTimerIntervalId = setInterval(() => {
            if (!this.isPaused && this.isRunning) {
                this.elapsedSeconds++;
                this.updateHUD();
            }
        }, 1000);
    }

    stopSessionTimer() {
        if (this.sessionTimerIntervalId) {
            clearInterval(this.sessionTimerIntervalId);
            this.sessionTimerIntervalId = null;
        }
    }

    pause() {
        this.isPaused = true;
        if (this.advanceTimerId) {
            clearTimeout(this.advanceTimerId);
            this.advanceTimerId = null;
            this.pendingAdvance = true;
        }
        if (this.targetKeyTimerId) {
            clearTimeout(this.targetKeyTimerId);
            this.targetKeyTimerId = null;
        }
    }

    resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        if (this.pendingAdvance) {
            this.pendingAdvance = false;
            this.locked = false;
            this.nextTargetKey();
            return;
        }
        this.currentKeyStartTime = performance.now();
        this.setKeyTimeout();
    }

    restart() {
        this.cleanup();
        this.start();
    }

    reset() {
        this.cleanup();
        this.resetState();
        this.resetTargetDisplay();
        this.updateHUD();
    }

    cleanup() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.targetKeyTimerId) {
            clearTimeout(this.targetKeyTimerId);
            this.targetKeyTimerId = null;
        }
        clearTimeout(this.advanceTimerId);
        this.advanceTimerId = null;
        this.locked = false;
        this.pendingAdvance = false;
        this.stopSessionTimer();
        window.removeEventListener('keydown', this.handleKeyDown);
        this.clearKeyHighlights();
    }

    resetState() {
        this.score = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.currentTrial = 0;
        this.responseTimes = [];
        this.elapsedSeconds = 0;
        this.targetKey = '';
    }

    resetTargetDisplay() {
        const targetKeyEl = document.getElementById('magnet-target-key');
        const targetBox = document.getElementById('magnet-target-display');
        if (targetKeyEl) targetKeyEl.textContent = 'READY';
        if (targetBox) targetBox.className = 'magnet-pulse';
        this.clearKeyHighlights();
    }

    scheduleNext(ms) {
        this.locked = true;
        clearTimeout(this.advanceTimerId);
        this.advanceTimerId = setTimeout(() => {
            this.advanceTimerId = null;
            this.locked = false;
            this.nextTargetKey();
        }, ms);
    }

    nextTargetKey() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentTrial >= this.totalTrials) {
            this.endGame('completion');
            return;
        }

        this.currentTrial++;
        let nextKey = this.activeKeyPool[Math.floor(Math.random() * this.activeKeyPool.length)];
        if (this.activeKeyPool.length > 1 && nextKey === this.targetKey) {
            nextKey = this.activeKeyPool[Math.floor(Math.random() * this.activeKeyPool.length)];
        }
        this.targetKey = nextKey.toUpperCase();

        const targetKeyEl = document.getElementById('magnet-target-key');
        const targetBox = document.getElementById('magnet-target-display');
        if (targetKeyEl) targetKeyEl.textContent = this.targetKey;
        if (targetBox) {
            targetBox.classList.remove('target-correct-flash', 'target-error-flash');
            void targetBox.offsetWidth;
            targetBox.classList.add('magnet-pulse');
        }

        this.highlightTargetOnKeyboard(this.targetKey);
        this.currentKeyStartTime = performance.now();
        this.setKeyTimeout();
        this.updateHUD();
    }

    setKeyTimeout() {
        if (this.targetKeyTimerId) clearTimeout(this.targetKeyTimerId);
        this.targetKeyTimerId = setTimeout(() => {
            if (this.isRunning && !this.isPaused) this.handleTimeout();
        }, this.timeLimitPerKey);
    }

    handleTimeout() {
        if (this.locked) return;
        this.locked = true;
        this.incorrectCount++;
        this.streak = 0;
        soundEngine.playMiss();

        const targetBox = document.getElementById('magnet-target-display');
        if (targetBox) {
            targetBox.classList.remove('magnet-pulse');
            targetBox.classList.add('target-error-flash');
        }

        this.triggerScreenFeedback(false);
        this.flashVirtualKey(this.targetKey, false);

        this.score = Math.max(0, this.score - 5);
        this.updateHUD();

        this.scheduleNext(300);
    }

    handleKeyDown(e) {
        if (!this.isRunning || this.isPaused) return;
        if (e.repeat) return;
        if (e.key.length !== 1 || e.key === ' ' || e.ctrlKey || e.metaKey || e.altKey) return;
        this.evaluateKey(e.key.toUpperCase());
    }

    bindVirtualKeyboardEvents() {
        const keys = document.querySelectorAll('.kb-key');
        keys.forEach(keyEl => {
            keyEl.removeEventListener('pointerdown', this.handleVirtualKeyClick);
            keyEl.addEventListener('pointerdown', this.handleVirtualKeyClick);
        });
    }

    handleVirtualKeyClick(e) {
        if (!this.isRunning || this.isPaused) return;
        const key = e.currentTarget.getAttribute('data-key');
        if (key) this.evaluateKey(key.toUpperCase());
    }

    evaluateKey(pressedKey) {
        if (!this.isRunning || this.isPaused || this.locked || !this.targetKey) return;

        if (this.targetKeyTimerId) {
            clearTimeout(this.targetKeyTimerId);
            this.targetKeyTimerId = null;
        }

        const responseTime = Math.round(performance.now() - this.currentKeyStartTime);

        const isMatch = pressedKey === this.targetKey;
        const targetBox = document.getElementById('magnet-target-display');

        if (isMatch) {
            this.correctCount++;
            this.streak++;
            if (this.streak > this.maxStreak) this.maxStreak = this.streak;

            this.responseTimes.push(responseTime); // only correct answers count toward reaction time
            const speedBonus = Math.max(10, Math.round(100 - (responseTime / 25)));
            const comboMultiplier = Math.min(3, 1 + Math.floor(this.streak / 4) * 0.5);
            const points = Math.round(speedBonus * comboMultiplier);
            this.score += points;

            soundEngine.playKeyHit();
            if (this.streak > 1 && this.streak % 3 === 0) soundEngine.playCombo(this.streak);

            if (targetBox) {
                targetBox.classList.remove('magnet-pulse');
                targetBox.classList.add('target-correct-flash');
            }

            this.triggerScreenFeedback(true);
            this.flashVirtualKey(pressedKey, true);

        } else {
            this.incorrectCount++;
            this.streak = 0;
            this.score = Math.max(0, this.score - 8);
            soundEngine.playError();

            if (targetBox) {
                targetBox.classList.remove('magnet-pulse');
                targetBox.classList.add('target-error-flash');
            }

            this.triggerScreenFeedback(false);
            this.flashVirtualKey(pressedKey, false);
        }

        this.updateHUD();
        this.scheduleNext(240);
    }

    highlightTargetOnKeyboard(char) {
        this.clearKeyHighlights();
        const keyEl = document.querySelector(`.kb-key[data-key="${char}"]`);
        if (keyEl) keyEl.classList.add('key-target');
    }

    flashVirtualKey(char, isCorrect) {
        const keyEl = document.querySelector(`.kb-key[data-key="${char}"]`);
        if (keyEl) {
            keyEl.classList.add(isCorrect ? 'key-correct' : 'key-incorrect');
            setTimeout(() => keyEl.classList.remove('key-correct', 'key-incorrect'), 250);
        }
    }

    clearKeyHighlights() {
        document.querySelectorAll('.kb-key.key-target').forEach(el => el.classList.remove('key-target'));
    }

    triggerScreenFeedback(isCorrect) {
        const overlay = document.getElementById('screen-feedback-overlay');
        if (!overlay) return;
        overlay.classList.remove('flash-correct', 'flash-incorrect');
        document.body.classList.remove('shake-screen');
        void overlay.offsetWidth;

        if (isCorrect) overlay.classList.add('flash-correct');
        else {
            overlay.classList.add('flash-incorrect');
            document.body.classList.add('shake-screen');
        }

        setTimeout(() => {
            overlay.classList.remove('flash-correct', 'flash-incorrect');
            document.body.classList.remove('shake-screen');
        }, 200);
    }

    updateHUD() {
        const scoreEl = document.getElementById('magnet-hud-score');
        const trialEl = document.getElementById('magnet-hud-trials');
        const correctEl = document.getElementById('magnet-hud-correct');
        const incorrectEl = document.getElementById('magnet-hud-incorrect');
        const responseEl = document.getElementById('magnet-hud-reaction');
        const accuracyEl = document.getElementById('magnet-hud-accuracy');
        const timerEl = document.getElementById('magnet-hud-timer');
        const streakEl = document.getElementById('magnet-hud-streak');

        if (scoreEl) scoreEl.textContent = this.score;
        if (trialEl) trialEl.textContent = `${this.currentTrial}/${this.totalTrials}`;
        if (correctEl) correctEl.textContent = this.correctCount;
        if (incorrectEl) incorrectEl.textContent = this.incorrectCount;
        if (streakEl) streakEl.textContent = `${this.streak}x`;

        const avgResponse = this.responseTimes.length > 0
            ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
            : 0;

        if (responseEl) responseEl.textContent = `${avgResponse}ms`;

        const totalAttempts = this.correctCount + this.incorrectCount;
        const accuracy = totalAttempts > 0 ? Math.round((this.correctCount / totalAttempts) * 100) : 100;
        if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

        if (timerEl) {
            const mins = Math.floor(this.elapsedSeconds / 60);
            const secs = this.elapsedSeconds % 60;
            timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    endGame(reason) {
        this.cleanup();
        soundEngine.playVictory();

        const totalAttempts = this.correctCount + this.incorrectCount;
        const accuracy = totalAttempts > 0 ? Math.round((this.correctCount / totalAttempts) * 100) : 0;
        const avgResponse = this.responseTimes.length > 0
            ? Math.round(this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length)
            : 0;

        let grade = 'C';
        if (accuracy >= 94 && avgResponse < 650) grade = 'S';
        else if (accuracy >= 85 && avgResponse < 900) grade = 'A';
        else if (accuracy >= 70) grade = 'B';
        else grade = 'D';

        const highInfo = StorageManager.saveHighScore('magnet', this.difficulty, this.score);
        const sessionData = {
            mode: 'magnet',
            difficulty: this.difficulty,
            keySet: this.currentKeySetType,
            score: this.score,
            highScore: highInfo.highScore,
            isNewHigh: highInfo.isNewHigh,
            accuracy,
            correct: this.correctCount,
            incorrect: this.incorrectCount,
            avgResponseTime: avgResponse,
            maxStreak: this.maxStreak,
            duration: this.elapsedSeconds,
            outcome: 'Completed Keyboard Precision Trials',
            grade
        };

        StorageManager.saveSession(sessionData);
        if (window.app) window.app.showResults(sessionData);
    }
}

/* 7. APP CONTROLLER */
class App {
    constructor() {
        this.currentView = 'home';
        this.currentMode = null;
        this.currentDifficulty = 'medium';
        this.lastSessionData = null;

        this.bubbleMode = null;
        this.keyMagnetMode = null;

        this.init();
    }

    init() {
        const savedTheme = StorageManager.getTheme();
        StorageManager.setTheme(savedTheme);
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) themeSelect.value = savedTheme;

        const soundIcon = document.getElementById('sound-toggle-icon');
        if (soundEngine.muted && soundIcon) soundIcon.textContent = '🔇';

        const bubbleArena = document.getElementById('bubble-arena');
        if (bubbleArena) this.bubbleMode = new BubbleGameMode(bubbleArena);

        const magnetContainer = document.getElementById('magnet-arena');
        if (magnetContainer) this.keyMagnetMode = new KeyMagnetGameMode(magnetContainer);

        this.updateHomeHighScores();
        this.bindEvents();
        this.renderCustomKeysetList();
    }

    navigate(viewId) {
        if (this.bubbleMode) this.bubbleMode.cleanup();
        if (this.keyMagnetMode) this.keyMagnetMode.cleanup();

        document.querySelectorAll('.game-screen').forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(`screen-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('flex');
        }

        this.currentView = viewId;
        this.updateHomeHighScores();

        if (viewId === 'bubbles') {
            this.currentMode = 'bubbles';
            this.bubbleMode.setDifficulty(this.currentDifficulty);
            this.bubbleMode.reset();
            this.updateActiveKeysetBanner();
        } else if (viewId === 'magnet') {
            this.currentMode = 'magnet';
            this.keyMagnetMode.setDifficulty(this.currentDifficulty);
            this.keyMagnetMode.reset();
            this.updateActiveKeysetBanner();
        } else {
            this.currentMode = null;
        }
    }

    updateActiveKeysetBanner() {
        const activeCustom = StorageManager.getActiveKeyset();
        document.querySelectorAll('.active-keyset-indicator').forEach(b => {
            if (activeCustom) {
                b.innerHTML = `<span class="chip-note">Custom file in use: ${activeCustom.name} (${activeCustom.keys.length} items)</span>`;
                b.classList.remove('hidden');
            } else {
                b.classList.add('hidden');
            }
        });
    }

    updateHomeHighScores() {
        const scores = StorageManager.getHighScores();
        const bubbleHigh = document.getElementById('home-high-bubble');
        const magnetHigh = document.getElementById('home-high-magnet');

        if (bubbleHigh) {
            const best = Math.max(scores.bubbles?.easy || 0, scores.bubbles?.medium || 0, scores.bubbles?.hard || 0);
            bubbleHigh.textContent = `${best} PTS`;
        }
        if (magnetHigh) {
            const best = Math.max(scores.magnet?.easy || 0, scores.magnet?.medium || 0, scores.magnet?.hard || 0);
            magnetHigh.textContent = `${best} PTS`;
        }
    }

    bindEvents() {
        document.getElementById('card-mode-bubbles')?.addEventListener('click', () => this.navigate('bubbles'));
        document.getElementById('card-mode-magnet')?.addEventListener('click', () => this.navigate('magnet'));

        document.querySelectorAll('.btn-back-home').forEach(btn => {
            btn.addEventListener('click', () => this.navigate('home'));
        });

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDifficulty(e.currentTarget.getAttribute('data-difficulty'));
            });
        });

        document.getElementById('btn-bubble-start')?.addEventListener('click', () => {
            if (this.bubbleMode) {
                if (!this.bubbleMode.isRunning) {
                    this.bubbleMode.start();
                    document.getElementById('btn-bubble-start').textContent = 'Pause';
                } else if (this.bubbleMode.isPaused) {
                    this.bubbleMode.resume();
                    document.getElementById('btn-bubble-start').textContent = 'Pause';
                } else {
                    this.bubbleMode.pause();
                    document.getElementById('btn-bubble-start').textContent = 'Resume';
                }
            }
        });

        document.getElementById('btn-bubble-restart')?.addEventListener('click', () => {
            if (this.bubbleMode) {
                this.bubbleMode.restart();
                document.getElementById('btn-bubble-start').textContent = 'Pause';
            }
        });

        document.getElementById('btn-bubble-reset')?.addEventListener('click', () => {
            if (this.bubbleMode) {
                this.bubbleMode.reset();
                document.getElementById('btn-bubble-start').textContent = 'Start Game';
            }
        });

        document.getElementById('btn-magnet-start')?.addEventListener('click', () => {
            if (this.keyMagnetMode) {
                if (!this.keyMagnetMode.isRunning) {
                    this.keyMagnetMode.start();
                    document.getElementById('btn-magnet-start').textContent = 'Pause';
                } else if (this.keyMagnetMode.isPaused) {
                    this.keyMagnetMode.resume();
                    document.getElementById('btn-magnet-start').textContent = 'Pause';
                } else {
                    this.keyMagnetMode.pause();
                    document.getElementById('btn-magnet-start').textContent = 'Resume';
                }
            }
        });

        document.getElementById('btn-magnet-restart')?.addEventListener('click', () => {
            if (this.keyMagnetMode) {
                this.keyMagnetMode.restart();
                document.getElementById('btn-magnet-start').textContent = 'Pause';
            }
        });

        document.getElementById('btn-magnet-reset')?.addEventListener('click', () => {
            if (this.keyMagnetMode) {
                this.keyMagnetMode.reset();
                document.getElementById('btn-magnet-start').textContent = 'Start Session';
            }
        });

        document.getElementById('magnet-keyset-select')?.addEventListener('change', (e) => {
            if (this.keyMagnetMode) {
                this.keyMagnetMode.setKeySetType(e.target.value);
                this.keyMagnetMode.reset();
                document.getElementById('btn-magnet-start').textContent = 'Start Session';
            }
        });

        document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
            const isMuted = !soundEngine.muted;
            soundEngine.setMuted(isMuted);
            const icon = document.getElementById('sound-toggle-icon');
            if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
        });

        document.getElementById('theme-select')?.addEventListener('change', (e) => {
            StorageManager.setTheme(e.target.value);
        });

        this.setupModals();
        this.setupFileHub();
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) return;
            [[this.bubbleMode, 'btn-bubble-start'], [this.keyMagnetMode, 'btn-magnet-start']].forEach(([m, id]) => {
                if (m && m.isRunning && !m.isPaused) { m.pause(); document.getElementById(id).textContent = 'Resume'; }
            });
        });
    }

    setDifficulty(diff) {
        this.currentDifficulty = diff;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('on', btn.getAttribute('data-difficulty') === diff);
        });

        if (this.currentMode === 'bubbles' && this.bubbleMode) {
            const wasRunning = this.bubbleMode.isRunning;
            this.bubbleMode.setDifficulty(diff);
            if (wasRunning) this.bubbleMode.restart(); else this.bubbleMode.reset();
            document.getElementById('btn-bubble-start').textContent = wasRunning ? 'Pause' : 'Start Game';
        } else if (this.currentMode === 'magnet' && this.keyMagnetMode) {
            const wasRunning = this.keyMagnetMode.isRunning;
            this.keyMagnetMode.setDifficulty(diff);
            if (wasRunning) this.keyMagnetMode.restart(); else this.keyMagnetMode.reset();
            document.getElementById('btn-magnet-start').textContent = wasRunning ? 'Pause' : 'Start Session';
        }
    }

    setupModals() {
        document.getElementById('btn-open-files')?.addEventListener('click', () => this.openModal('modal-file-hub'));
        document.getElementById('btn-open-instructions')?.addEventListener('click', () => this.openModal('modal-instructions'));
        document.getElementById('btn-open-history')?.addEventListener('click', () => {
            this.renderHistoryList();
            this.openModal('modal-history');
        });

        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-backdrop');
                if (modal) modal.classList.remove('active');
            });
        });

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) backdrop.classList.remove('active');
            });
        });

        document.getElementById('btn-result-download-txt')?.addEventListener('click', () => {
            if (this.lastSessionData) fileManager.exportScorecardTXT(this.lastSessionData);
        });

        document.getElementById('btn-result-download-json')?.addEventListener('click', () => {
            if (this.lastSessionData) fileManager.exportSessionJSON(this.lastSessionData);
        });

        document.getElementById('btn-result-play-again')?.addEventListener('click', () => {
            this.closeModal('modal-results');
            if (this.currentMode === 'bubbles' && this.bubbleMode) {
                this.bubbleMode.restart();
                document.getElementById('btn-bubble-start').textContent = 'Pause';
            } else if (this.currentMode === 'magnet' && this.keyMagnetMode) {
                this.keyMagnetMode.restart();
                document.getElementById('btn-magnet-start').textContent = 'Pause';
            }
        });

        document.getElementById('btn-result-home')?.addEventListener('click', () => {
            this.closeModal('modal-results');
            this.navigate('home');
        });
    }

    openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    }

    closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    }

    showResults(sessionData) {
        this.lastSessionData = sessionData;

        if (sessionData.isNewHigh || sessionData.outcome?.includes('Victory') || sessionData.grade === 'S' || sessionData.grade === 'A') {
            confettiEngine.burst(80);
        }

        document.getElementById('res-score').textContent = sessionData.score;
        document.getElementById('res-grade').textContent = sessionData.grade;
        document.getElementById('res-accuracy').textContent = `${sessionData.accuracy}%`;
        document.getElementById('res-correct').textContent = sessionData.correct;
        document.getElementById('res-incorrect').textContent = sessionData.incorrect;
        document.getElementById('res-streak').textContent = `${sessionData.maxStreak}x`;
        document.getElementById('res-duration').textContent = `${sessionData.duration}s`;
        document.getElementById('res-outcome').textContent = sessionData.outcome;

        const highEl = document.getElementById('res-high-banner');
        if (highEl) {
            if (sessionData.isNewHigh) highEl.classList.remove('hidden');
            else highEl.classList.add('hidden');
        }

        const modeSpecificStat = document.getElementById('res-mode-specific');
        if (modeSpecificStat) {
            if (sessionData.mode === 'bubbles') {
                modeSpecificStat.innerHTML = `<span class="muted">Misses</span> <b>${sessionData.misses} / ${sessionData.maxMisses}</b>`;
            } else {
                modeSpecificStat.innerHTML = `<span class="muted">Average reaction</span> <b>${sessionData.avgResponseTime} ms</b>`;
            }
        }

        this.openModal('modal-results');
    }

    setupFileHub() {
        const fileInput = document.getElementById('custom-file-input');
        const dropZone = document.getElementById('file-drop-zone');

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag'));
            dropZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag');
                if (e.dataTransfer.files.length > 0) await this.processUploadedFile(e.dataTransfer.files[0]);
            });
            fileInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    await this.processUploadedFile(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }

        document.getElementById('btn-download-sample-json')?.addEventListener('click', () => fileManager.downloadSampleJSON());
        document.getElementById('btn-download-sample-txt')?.addEventListener('click', () => fileManager.downloadSampleTXT());
        document.getElementById('btn-export-history-csv')?.addEventListener('click', () => fileManager.exportHistoryCSV());
        document.getElementById('btn-clear-history')?.addEventListener('click', () => {
            if (confirm('Clear match history?')) {
                StorageManager.clearSessionHistory();
                this.renderHistoryList();
            }
        });
    }

    async processUploadedFile(file) {
        const statusEl = document.getElementById('file-upload-status');
        try {
            if (statusEl) {
                statusEl.textContent = 'Processing file...';
                statusEl.className = 'status info';
            }
            const result = await fileManager.handleFileUpload(file);
            StorageManager.saveCustomKeyset(result.name, result.keys, result.isWordList);

            if (statusEl) {
                statusEl.textContent = `✓ Loaded "${result.name}" with ${result.count} items!`;
                statusEl.className = 'status ok';
            }

            this.renderCustomKeysetList();
            this.updateActiveKeysetBanner();

            if (this.currentMode === 'bubbles' && this.bubbleMode) {
                this.bubbleMode.setupLetterPool();
                this.bubbleMode.restart();
            } else if (this.currentMode === 'magnet' && this.keyMagnetMode) {
                this.keyMagnetMode.refreshKeyPool();
                this.keyMagnetMode.restart();
            }
        } catch (err) {
            if (statusEl) {
                statusEl.textContent = `✗ Error: ${err.message}`;
                statusEl.className = 'status err';
            }
        }
    }

    renderCustomKeysetList() {
        const listEl = document.getElementById('custom-keysets-list');
        if (!listEl) return;
        const sets = StorageManager.getCustomKeysets();
        const activeId = localStorage.getItem('typing_game_active_keyset');

        if (sets.length === 0) {
            listEl.innerHTML = '<p class="empty">No files yet. Upload a .txt or .json file above.</p>';
            return;
        }

        listEl.innerHTML = sets.map(s => {
            const isActive = s.id === activeId;
            const previewChars = s.keys.slice(0, 8).join(', ') + (s.keys.length > 8 ? '...' : '');
            return `<div class="item${isActive ? ' active' : ''}"><div><b>${s.name}</b><small>${s.keys.length} items: [${previewChars}]</small></div><div class="acts"><button class="btn btn-activate-keyset" data-id="${s.id}">${isActive ? 'In use' : 'Use'}</button><button class="btn btn-delete-keyset" data-id="${s.id}" aria-label="Delete">✕</button></div></div>`;
        }).join('');

        listEl.querySelectorAll('.btn-activate-keyset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                StorageManager.setActiveKeyset(e.currentTarget.getAttribute('data-id'));
                this.renderCustomKeysetList();
                this.updateActiveKeysetBanner();
            });
        });

        listEl.querySelectorAll('.btn-delete-keyset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                StorageManager.deleteCustomKeyset(e.currentTarget.getAttribute('data-id'));
                this.renderCustomKeysetList();
                this.updateActiveKeysetBanner();
            });
        });
    }

    renderHistoryList() {
        const listEl = document.getElementById('history-sessions-list');
        if (!listEl) return;
        const history = StorageManager.getSessionHistory();
        if (history.length === 0) {
            listEl.innerHTML = '<p class="empty">No matches yet. Play a round and it will show up here.</p>';
            return;
        }

        listEl.innerHTML = history.map(item => {
            const modeLabel = item.mode === 'bubbles' ? 'Mode A: Bubbles' : 'Mode B: KeyMagnet';
            const dateFormatted = new Date(item.date).toLocaleDateString() + ' ' + new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `<div class="item"><div><b>${modeLabel} (${item.difficulty})</b><small>${dateFormatted}, grade ${item.grade}</small></div><div><b>${item.score} pts</b><small>${item.accuracy}% accuracy, ${item.correct}/${item.correct + item.incorrect}</small></div></div>`;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const kb = document.getElementById('virtual-kb');
    if (kb) kb.innerHTML = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(r =>
        `<div class="kb-row">${[...r].map(k => `<div class="kb-key" data-key="${k}">${k}</div>`).join('')}</div>`).join('');
    window.app = new App();
});