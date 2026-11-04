"use strict";
/* EXTRAS: intro + mascot (Pip), Mode C Word Rush, Mode D Speed Test, profile level, badges, progress reset.
   Loaded after script.js, so it reuses App, StorageManager, soundEngine and the results modal. */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id),
    app = window.app;
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  };
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const LABEL = {
    bubbles: "Bubbles",
    magnet: "KeyMagnet",
    words: "Word Rush",
    typing: "Speed Test",
  };

  /* ---------- Pip: original cartoon mascot ---------- */
  const pip =
    () => `<svg class="pip" viewBox="0 0 200 200" aria-hidden="true"><ellipse class="shadow" cx="100" cy="186" rx="46" ry="8"/>
    <g class="bod"><path class="stem" d="M100 36 Q98 18 112 10"/><circle class="leaf" cx="114" cy="9" r="7"/>
    <circle class="skin" cx="100" cy="108" r="72"/><path class="shine" d="M48 82 Q58 52 92 44"/>
    <ellipse class="blush" cx="56" cy="128" rx="12" ry="7"/><ellipse class="blush" cx="144" cy="128" rx="12" ry="7"/>
    <g class="eyes"><ellipse class="eye" cx="74" cy="104" rx="13" ry="19"/><circle class="gl" cx="70" cy="96" r="5.5"/><circle class="gl" cx="78" cy="113" r="2.6"/>
    <ellipse class="eye" cx="126" cy="104" rx="13" ry="19"/><circle class="gl" cx="122" cy="96" r="5.5"/><circle class="gl" cx="130" cy="113" r="2.6"/></g>
    <g class="eyes-happy"><path d="M60 106 Q74 88 88 106"/><path d="M112 106 Q126 88 140 106"/></g>
    <path class="smile" d="M86 132 Q100 148 114 132"/><path class="sad" d="M88 142 Q100 128 112 142"/>
    <circle class="hand" cx="172" cy="112" r="11"/></g></svg>`;

  /* ---------- Pip's voice: the browser's built-in speech (Web Speech API) ---------- */
  const voiceOn = () =>
    localStorage.getItem("tidepop_voice") !== "off" && !soundEngine.muted;
  function speak(text, face) {
    if (!("speechSynthesis" in window) || !voiceOn()) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text),
      en = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
    u.voice =
      en.find((v) =>
        /female|zira|samantha|aria|jenny|google uk english female/i.test(
          v.name,
        ),
      ) ||
      en[0] ||
      null;
    u.lang = u.voice ? u.voice.lang : "en-US";
    u.pitch = 1.5;
    u.rate = 1.05; // higher pitch = cute cartoon voice
    u.onstart = () => face && face.classList.add("talk"); // mouth moves while speaking
    u.onend = u.onerror = () => face && face.classList.remove("talk");
    speechSynthesis.speak(u);
  }
  if ("speechSynthesis" in window) speechSynthesis.getVoices();

  function showIntro() {
    const sparks = Array.from(
      { length: 12 },
      () =>
        `<span class="sp" style="left:${Math.random() * 96}%;top:${Math.random() * 90}%;font-size:${12 + Math.random() * 18}px;animation-delay:${Math.random() * 2}s">✦</span>`,
    ).join("");
    const bubs = Array.from(
      { length: 9 },
      (_, i) =>
        `<i class="rb" style="left:${i * 11 + Math.random() * 6}%;--s:${30 + Math.random() * 40}px;--d:${7 + Math.random() * 6}s;--c:var(--b${(i % 5) + 1});animation-delay:-${Math.random() * 8}s"></i>`,
    ).join("");
    const d =
      el(`<div id="intro" role="dialog" aria-label="Welcome"><div class="rays"></div>${sparks}${bubs}
      <div class="istage"><div class="say"><span id="say-t"></span></div>${pip()}<h2 class="ititle">Tidepop</h2>
      <div class="ibtns"><button class="btn main" id="intro-meet">Tap to meet Pip</button><button class="btn main" id="intro-go" hidden>Let’s play</button><button class="link" id="intro-skip">Skip</button></div></div></div>`);
    document.body.append(d);
    sessionStorage.setItem("tidepop_intro", "1");
    const msg = "Hi! I’m Pip. Ready to pop some letters?",
      face = d.querySelector(".pip");
    let iv,
      met = false;
    const meet = () => {
      // runs on a click, so the browser allows sound
      if (met) return;
      met = true;
      $("intro-meet").hidden = true;
      $("intro-go").hidden = false;
      speak(msg, face);
      let i = 0;
      iv = setInterval(() => {
        $("say-t").textContent = msg.slice(0, ++i);
        if (i >= msg.length) {
          clearInterval(iv);
          face.classList.add("happy");
          setTimeout(() => face.classList.remove("happy"), 900);
        }
      }, 55);
    };
    const close = () => {
      clearInterval(iv);
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      removeEventListener("keydown", kd);
      d.classList.add("out");
      setTimeout(() => d.remove(), 500);
    };
    const kd = (e) => {
      if (e.key === "Escape") close();
    };
    addEventListener("keydown", kd);
    $("intro-meet").onclick = meet;
    $("intro-go").onclick = close;
    $("intro-skip").onclick = close;
  }

  // small Pip in the corner reacts to the existing correct/wrong screen flash
  document.body.append(el(`<div id="pip-mini">${pip()}</div>`));
  const mini = $("pip-mini").firstElementChild,
    ov = $("screen-feedback-overlay");
  let pt;
  new MutationObserver(() => {
    const m = ov.className.includes("flash-correct")
      ? "happy"
      : ov.className.includes("flash-incorrect")
        ? "oops"
        : null;
    if (!m) return;
    mini.classList.remove("happy", "oops");
    void mini.getBoundingClientRect();
    mini.classList.add(m);
    clearTimeout(pt);
    pt = setTimeout(() => mini.classList.remove("happy", "oops"), 700);
  }).observe(ov, { attributes: true, attributeFilter: ["class"] });
  const flash = (ok) => {
    ov.classList.remove("flash-correct", "flash-incorrect");
    void ov.offsetWidth;
    ov.classList.add(ok ? "flash-correct" : "flash-incorrect");
  };

  /* ---------- Toast ---------- */
  const toast = el('<div id="toast" role="status"></div>');
  document.body.append(toast);
  let queue = [],
    busy = false;
  function say(list) {
    if (list.length) speak(list.join(". "), mini);
    queue.push(...list);
    if (!busy) nextToast();
  }
  function nextToast() {
    if (!queue.length) {
      busy = false;
      return;
    }
    busy = true;
    toast.textContent = queue.shift();
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(nextToast, 400);
    }, 2600);
  }

  /* ---------- Modes C and D: Word Rush and Speed Test ---------- */
  const WORDS = {
    easy: "cat sun book fish tree moon star lamp rain boat milk cake bird door".split(
      " ",
    ),
    medium:
      "keyboard internet website browser network layout screen cursor button window server".split(
        " ",
      ),
    hard: "programming javascript responsive application interface algorithm developer framework database".split(
      " ",
    ),
  };
  const TEXTS = {
    easy: [
      "The quick brown fox jumps over the lazy dog.",
      "Practice makes a person perfect.",
      "Type slowly first, then speed up.",
    ],
    medium: [
      "Good typists keep their eyes on the screen and let their fingers find the keys.",
      "A steady rhythm matters more than raw speed when you are learning.",
    ],
    hard: [
      "Responsive layouts adapt gracefully, whether the viewport is 360px or 1440px wide!",
      '"Accuracy first," said the coach; "speed follows, usually within 2-3 weeks."',
    ],
  };
  const LIMITS = {
    words: { easy: 45, medium: 30, hard: 25 },
    typing: { easy: 60, medium: 45, hard: 30 },
  };
  const TIPS = [
    "Keep your eyes on the screen, not on the keys.",
    "Accuracy first. Speed comes by itself.",
    "Rest your fingers on the home row: A S D F and J K L.",
    "Relax your shoulders and type with a steady rhythm.",
    "A wrong letter turns red. Press Backspace to fix it.",
  ];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  class TextMode {
    constructor(id, kind, title, sub, desc, cls) {
      Object.assign(this, {
        id,
        kind,
        title,
        diff: "medium",
        running: false,
        iv: null,
      });
      const diffs = ["easy", "medium", "hard"]
        .map(
          (d) =>
            `<button class="difficulty-btn${d === "medium" ? " on" : ""}" data-difficulty="${d}">${cap(d)}</button>`,
        )
        .join("");
      const field =
        kind === "words"
          ? '<input class="tin" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the word here">'
          : '<textarea class="tin" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Start typing the text above"></textarea>';
      this.sec =
        el(`<section id="screen-${id}" class="game-screen hidden col"><div class="bar"><button class="btn btn-back-home">Home</button><h2>${title}</h2>
        <div class="seg" role="group" aria-label="Difficulty">${diffs}</div>
        <div class="ctrl"><button class="btn main b-start">Start Game</button><button class="btn b-restart">Restart</button><button class="btn b-reset">Reset</button></div></div>
        <div class="hud"></div><div class="tbox"><div class="tshow${kind === "words" ? " w" : ""}"></div>${field}<p class="tip"></p></div></section>`);
      $("screen-magnet").after(this.sec);
      this.hud = this.sec.querySelector(".hud");
      this.show = this.sec.querySelector(".tshow");
      this.inp = this.sec.querySelector(".tin");
      this.tip = this.sec.querySelector(".tip");
      this.card =
        el(`<article id="card-mode-${id}" class="card ${cls}" tabindex="0" role="button"><h2>${title}</h2><p class="sub">${sub}</p><p>${desc}</p>
        <p class="best">Best score: <b id="home-high-${id}">0 PTS</b></p><span class="btn main">Start ${title}</span></article>`);
      document.querySelector(".cards").append(this.card);
      this.card.addEventListener("click", () => app.navigate(id));
      this.sec.querySelector(".btn-back-home").onclick = () =>
        app.navigate("home");
      this.sec.querySelectorAll(".difficulty-btn").forEach(
        (b) =>
          (b.onclick = () => {
            app.setDifficulty(b.dataset.difficulty);
            this.diff = b.dataset.difficulty;
            this.reset();
          }),
      );
      this.sec.querySelector(".b-start").onclick = () => this.start();
      this.sec.querySelector(".b-restart").onclick = () => {
        this.cleanup();
        this.running = false;
        this.start();
      };
      this.sec.querySelector(".b-reset").onclick = () => this.reset();
      this.inp.addEventListener("input", () => this.onInput());
    }

    cleanup() {
      clearInterval(this.iv);
      this.iv = null;
    } // the only timer is always cleared here

    reset() {
      // clears ALL state, no page reload
      this.cleanup();
      this.running = false;
      Object.assign(this, {
        score: 0,
        good: 0,
        wrong: 0,
        streak: 0,
        best: 0,
        words: 0,
        prev: 0,
        target: "",
        limit: LIMITS[this.kind][this.diff],
      });
      this.left = this.limit;
      this.inp.value = "";
      this.inp.disabled = true;
      this.show.innerHTML = '<span class="ready">Press Start Game</span>';
      this.tip.textContent = "Tip: " + rnd(TIPS);
      this.sec.querySelector(".b-start").disabled = false;
      this.draw();
    }

    start() {
      if (this.running) return;
      this.reset();
      this.running = true;
      this.inp.disabled = false;
      this.inp.focus();
      this.sec.querySelector(".b-start").disabled = true;
      this.next();
      this.t0 = performance.now();
      this.iv = setInterval(() => {
        this.left = Math.max(
          0,
          this.limit - (performance.now() - this.t0) / 1000,
        );
        this.draw();
        if (this.left <= 0) this.end("time");
      }, 200);
    }

    next() {
      this.target =
        this.kind === "words"
          ? rnd(WORDS[this.diff].filter((w) => w !== this.target))
          : rnd(TEXTS[this.diff]);
      this.inp.value = "";
      this.prev = 0;
      this.paint();
    }

    paint() {
      const v = this.inp.value,
        t = this.target,
        cs = this.kind === "typing";
      this.show.innerHTML = [...t]
        .map((c, i) => {
          const x = v[i];
          const cls =
            x == null
              ? i === v.length
                ? "cur"
                : ""
              : (cs ? x === c : x.toLowerCase() === c)
                ? "ok"
                : "bad";
          return `<span class="${cls}">${c === " " ? "&nbsp;" : c}</span>`;
        })
        .join("");
    }

    onInput() {
      if (!this.running) return;
      const v = this.inp.value,
        t = this.target,
        cs = this.kind === "typing";
      if (v.length > this.prev) {
        // judge only the newly typed letter
        const i = v.length - 1;
        if (cs ? v[i] === t[i] : v[i].toLowerCase() === t[i]) {
          this.good++;
          this.streak++;
          this.best = Math.max(this.best, this.streak);
        } else {
          this.wrong++;
          this.streak = 0;
          flash(false);
          soundEngine.playError();
        }
      }
      this.prev = v.length;
      this.paint();
      if (cs ? v === t : v.toLowerCase() === t) {
        if (this.kind === "words") {
          this.words++;
          this.score += 10 + t.length;
          flash(true);
          soundEngine.playPop();
          this.next();
        } else return this.end("victory");
      }
      this.draw();
    }

    get acc() {
      const n = this.good + this.wrong;
      return n ? Math.round((this.good / n) * 100) : 100;
    }
    get wpm() {
      return Math.round(
        this.good / 5 / (Math.max(this.limit - this.left, 1) / 60),
      );
    }

    draw() {
      const sc =
        this.kind === "typing"
          ? Math.round((this.wpm * this.acc) / 10)
          : this.score;
      const chip = (k, v) =>
        `<div class="stat-chip"><span class="stat-chip-label">${k}</span><span class="stat-chip-value">${v}</span></div>`;
      this.hud.innerHTML =
        chip("Score", sc) +
        chip("Time", Math.ceil(this.left) + "s") +
        chip("WPM", this.wpm) +
        chip("Accuracy", this.acc + "%") +
        (this.kind === "words"
          ? chip("Words", this.words)
          : chip("Streak", this.streak + "x"));
    }

    end(reason) {
      if (!this.running) return;
      const el = Math.round(this.limit - this.left),
        acc = this.acc,
        wpm = this.wpm,
        win = reason === "victory";
      this.cleanup();
      this.running = false;
      this.inp.disabled = true;
      this.sec.querySelector(".b-start").disabled = false;
      if (this.kind === "typing") this.score = Math.round((wpm * acc) / 10);
      const grade =
        acc < 50
          ? "F"
          : wpm >= 50 && acc >= 95
            ? "S"
            : wpm >= 35 && acc >= 90
              ? "A"
              : wpm >= 20 && acc >= 80
                ? "B"
                : "C";
      const hi = StorageManager.saveHighScore(this.id, this.diff, this.score);
      const sd = {
        mode: this.id,
        difficulty: this.diff,
        score: this.score,
        highScore: hi.highScore,
        isNewHigh: hi.isNewHigh,
        accuracy: acc,
        correct: this.good,
        incorrect: this.wrong,
        maxStreak: this.best,
        duration: el,
        wpm,
        words: this.words,
        grade,
        outcome: win ? "Victory - Text completed" : "Time is up",
      };
      win ? soundEngine.playVictory() : soundEngine.playGameOver();
      StorageManager.saveSession(sd);
      app.showResults(sd);
      this.draw();
    }
  }

  const modes = {
    words: new TextMode(
      "words",
      "words",
      "Word Rush",
      "Mode C: word typing",
      "A word appears. Type it exactly, then the next one comes. Wrong letters turn red. Beat the clock.",
      "c",
    ),
    typing: new TextMode(
      "typing",
      "typing",
      "Speed Test",
      "Mode D: speed and accuracy",
      "Type a full sentence as fast and cleanly as you can. Your WPM and accuracy decide the score.",
      "d",
    ),
  };

  /* ---------- Level, badges, profile ---------- */
  const XPK = "tidepop_xp",
    ACHK = "tidepop_ach",
    num = (k) => +localStorage.getItem(k) || 0;
  const level = (xp) => Math.floor(Math.sqrt(xp / 60)) + 1,
    startXP = (l) => (l - 1) ** 2 * 60;
  const ACH = [
    {
      id: "first",
      name: "First splash",
      desc: "Finish any game",
      t: (h) => h.length >= 1,
    },
    {
      id: "sharp",
      name: "Sharpshooter",
      desc: "95% accuracy in a game",
      t: (h) => h.some((s) => s.accuracy >= 95 && s.score > 0),
    },
    {
      id: "streak",
      name: "On a roll",
      desc: "Reach a 15 streak",
      t: (h) => h.some((s) => s.maxStreak >= 15),
    },
    {
      id: "speed",
      name: "Speed demon",
      desc: "40 WPM in Speed Test",
      t: (h) => h.some((s) => s.mode === "typing" && s.wpm >= 40),
    },
    {
      id: "words",
      name: "Word wizard",
      desc: "15 words in Word Rush",
      t: (h) => h.some((s) => s.mode === "words" && s.words >= 15),
    },
    {
      id: "hard",
      name: "Deep diver",
      desc: "Score 100+ on Hard",
      t: (h) => h.some((s) => s.difficulty === "hard" && s.score >= 100),
    },
    {
      id: "all",
      name: "Explorer",
      desc: "Play all four modes",
      t: (h) => new Set(h.map((s) => s.mode)).size >= 4,
    },
    {
      id: "ten",
      name: "Regular",
      desc: "Play 10 games",
      t: (h) => h.length >= 10,
    },
  ];

  // home dashboard strip + profile button + profile window
  document
    .querySelector(".cards")
    .before(el('<div id="home-stats" class="hud"></div>'));
  $("btn-open-settings").before(
    el('<button id="btn-open-profile" class="btn">Profile</button>'),
  );
  const prof =
    el(`<div id="modal-profile" class="modal-backdrop"><div class="modal-container">
    <div class="mhead"><h3>Your profile</h3><button class="btn icon btn-close-modal" aria-label="Close">✕</button></div><div id="prof-body"></div>
    <div class="mfoot"><button id="prof-reset" class="link danger">Reset progress</button><button class="btn main btn-close-modal">Close</button></div></div></div>`);
  document.body.append(prof);
  prof
    .querySelectorAll(".btn-close-modal")
    .forEach((b) => (b.onclick = () => app.closeModal("modal-profile")));
  prof.addEventListener("click", (e) => {
    if (e.target === prof) app.closeModal("modal-profile");
  });

  function refresh() {
    const xp = num(XPK),
      l = level(xp),
      h = StorageManager.getSessionHistory(),
      hs = StorageManager.getHighScores();
    const chip = (k, v) =>
      `<div class="stat-chip"><span class="stat-chip-label">${k}</span><span class="stat-chip-value">${v}</span></div>`;
    $("home-stats").innerHTML =
      chip("Level", l) +
      chip("XP", xp) +
      chip("Games played", h.length) +
      chip(
        "Best accuracy",
        (h.length ? Math.max(...h.map((s) => s.accuracy)) : 0) + "%",
      );
    Object.keys(modes).forEach((id) => {
      const o = hs[id] || {};
      $("home-high-" + id).textContent =
        Math.max(0, o.easy || 0, o.medium || 0, o.hard || 0) + " PTS";
    });
  }
  function renderProfile() {
    const xp = num(XPK),
      l = level(xp),
      a = startXP(l),
      b = startXP(l + 1),
      h = StorageManager.getSessionHistory(),
      got = JSON.parse(localStorage.getItem(ACHK) || "[]");
    const top = [...h].sort((x, y) => y.score - x.score).slice(0, 5);
    $("prof-body").innerHTML =
      `<div class="lvl"><b>Level ${l}</b><span class="muted">${xp} XP, ${b - xp} to next level</span><div class="xpbar"><i style="width:${((xp - a) / (b - a)) * 100}%"></i></div></div>
      <h4>Top scores</h4><div class="list">${top.length ? top.map((s, i) => `<div class="item"><div><b>#${i + 1} ${LABEL[s.mode] || s.mode}</b><small>${s.difficulty}, ${s.accuracy}% accuracy</small></div><b>${s.score} pts</b></div>`).join("") : '<p class="empty">Play a game to enter the leaderboard.</p>'}</div>
      <h4>Badges</h4><div class="badges">${ACH.map((x) => `<div class="badge${got.includes(x.id) ? " on" : ""}"><b>${x.name}</b><small>${x.desc}</small></div>`).join("")}</div>`;
  }
  $("btn-open-profile").onclick = () => {
    renderProfile();
    app.openModal("modal-profile");
  };
  $("prof-reset").onclick = () => {
    if (!confirm("Reset your level, badges, history and high scores?")) return;
    [XPK, ACHK, StorageManager.KEYS.HIGH_SCORES].forEach((k) =>
      localStorage.removeItem(k),
    );
    StorageManager.clearSessionHistory();
    app.updateHomeHighScores();
    refresh();
    renderProfile();
  };

  /* ---------- Hook into the existing App ---------- */
  const nav = app.navigate.bind(app);
  app.navigate = (v) => {
    Object.values(modes).forEach((m) => m.cleanup());
    nav(v);
    if (modes[v]) {
      app.currentView = v;
      modes[v].diff = app.currentDifficulty;
      app.setDifficulty(app.currentDifficulty);
      modes[v].reset();
    }
    refresh();
  };
  const showRes = app.showResults.bind(app);
  app.showResults = (sd) => {
    // every mode: add XP, check badges, show toasts
    showRes(sd);
    if (modes[sd.mode])
      $("res-mode-specific").innerHTML =
        `<span class="muted">Speed</span> <b>${sd.wpm} WPM${sd.words ? ", " + sd.words + " words" : ""}</b>`;
    const before = level(num(XPK));
    localStorage.setItem(XPK, num(XPK) + sd.score);
    const got = JSON.parse(localStorage.getItem(ACHK) || "[]"),
      h = StorageManager.getSessionHistory(),
      fresh = ACH.filter((a) => !got.includes(a.id) && a.t(h));
    localStorage.setItem(
      ACHK,
      JSON.stringify([...got, ...fresh.map((a) => a.id)]),
    );
    const msgs = fresh.map((a) => "Badge unlocked: " + a.name);
    if (level(num(XPK)) > before)
      msgs.unshift("Level up! You are level " + level(num(XPK)));
    say(msgs);
    refresh();
  };
  $("btn-result-play-again").addEventListener("click", () => {
    const m = modes[app.currentView];
    if (m) {
      m.cleanup();
      m.running = false;
      m.start();
    }
  });
  document.querySelectorAll(".card").forEach((c) =>
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter") c.click();
    }),
  ); // keyboard access for cards

  const replay = el('<button class="link">Replay intro</button>');
  replay.onclick = showIntro;
  document.querySelector(".foot").append(" ", replay);
  const vt = el('<button class="link"></button>');
  const vLabel = () => {
    vt.textContent =
      "Pip voice: " +
      (localStorage.getItem("tidepop_voice") === "off" ? "off" : "on");
  };
  vt.onclick = () => {
    localStorage.setItem(
      "tidepop_voice",
      localStorage.getItem("tidepop_voice") === "off" ? "on" : "off",
    );
    vLabel();
  };
  vLabel();
  document.querySelector(".foot").append(" ", vt);
  refresh();
  if (
    !sessionStorage.getItem("tidepop_intro") &&
    !(window.settings && window.settings.s.calm)
  )
    showIntro();
});
