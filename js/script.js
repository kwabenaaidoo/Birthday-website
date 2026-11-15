/* ==========================================================================
   BIRTHDAY WEBSITE — SCRIPT
   --------------------------------------------------------------------------
   ✏️ Everything you normally need to change is in the CONFIG block right below.
   Text content (about paragraph, letter, memories, gallery captions, reasons)
   lives in the HTML files — look for the “✏️ EDIT HERE” comments.
   ========================================================================== */

/* ╔════════════════════════════════════════════════════════════════════════╗
   ║  ✏️  CONFIG — EDIT THIS PART                                           ║
   ╚════════════════════════════════════════════════════════════════════════╝ */
const birthdayConfig = {
  // Her name — shown in the title, nav, countdown page, finale…
  name: "My Love",

  // Your name — used for the signature on the letter (“Forever yours, …”)
  from: "Kobby",

  // Her birthday, as YYYY-MM-DD (or YYYY-MM-DDTHH:MM:SS to set a time).
  // The countdown switches to “Today is your day!” when this moment arrives.
  birthday: "2026-12-20",

  // Background music (put your own song at this path, keep the .mp3 name or change it here)
  music: "assets/music/birthday-song.mp3",
  musicVolume: 0.5,            // 0 (silent) … 1 (full)

  // Letter reveal speed: milliseconds per word (lower = faster)
  typeSpeed: 90,

  // Show the little “✏️ Note to you” reminders? Set to false before you send it to her.
  showEditNotes: true,

  // Optional colour overrides (leave empty to use the palette in css/style.css).
  // Example:  colors: { wine: "#4a1226", rose: "#e8a5b3", blush: "#f9e6e6", gold: "#c9a24b", cream: "#fdf7f0" }
  colors: {}
};
/* ╔════════════════════════════════════════════════════════════════════════╗
   ║  END OF CONFIG — you shouldn’t need to touch anything below this line  ║
   ╚════════════════════════════════════════════════════════════════════════╝ */

(function () {
  "use strict";

  const cfg = birthdayConfig;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const html = document.documentElement;
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => reducedQuery.matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const cleanups = []; // functions run before a page is swapped out

  /* ---------- storage helpers (never throw) ---------- */
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- inline icons ---------- */
  const SVG = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-8.5-5.6-8.5-11.4A4.9 4.9 0 0 1 12 7.2a4.9 4.9 0 0 1 8.5 2.4C20.5 15.4 12 21 12 21z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1l2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2z"/></svg>',
    flower: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="5.5" r="4"/><circle cx="12" cy="18.5" r="4"/><circle cx="5.5" cy="12" r="4"/><circle cx="18.5" cy="12" r="4"/></g><circle cx="12" cy="12" r="2.6" fill="#f3d27a"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };

  /* ======================================================================
     1 · APPLY CONFIG (name, colours, notes)
     ====================================================================== */
  function applyColors() {
    Object.keys(cfg.colors || {}).forEach((k) => html.style.setProperty("--" + k, cfg.colors[k]));
    html.style.setProperty("--step", (Number(cfg.typeSpeed) || 90) + "ms");
  }
  function applyText() {
    $$("[data-name]").forEach((el) => { el.textContent = cfg.name; });
    $$("[data-from]").forEach((el) => { el.textContent = cfg.from; });
    if (!cfg.showEditNotes) $$(".todo-note").forEach((n) => n.remove());
  }

  /* ======================================================================
     2 · FLOATING HEARTS, AMBIENT DECOR, CONFETTI
     ====================================================================== */
  const HEART_COLORS = ["#e8a5b3", "#f4c9d0", "#c9667d", "#f8d7dc", "#d98b9c"];

  function floatHearts(count) {
    const layer = $("#fx");
    if (!layer || count <= 0) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement("span");
        const size = rand(14, 32);
        h.className = "fx-heart";
        h.innerHTML = SVG.heart;
        h.style.left = rand(2, 96) + "%";
        h.style.width = h.style.height = size + "px";
        h.style.setProperty("--c", HEART_COLORS[Math.floor(rand(0, HEART_COLORS.length))]);
        h.style.setProperty("--d", rand(5.5, 9) + "s");
        h.style.setProperty("--sway", rand(-60, 60) + "px");
        h.style.setProperty("--rot", rand(-30, 30) + "deg");
        h.addEventListener("animationend", () => h.remove());
        layer.appendChild(h);
      }, i * 130);
    }
  }

  function initAmbient() {
    $$(".ambient[data-ambient]").forEach((box) => {
      if (box.dataset.ready) return;
      box.dataset.ready = "1";
      let n = parseInt(box.dataset.ambient, 10) || 10;
      if (reduced()) n = Math.ceil(n / 3);
      for (let i = 0; i < n; i++) {
        const r = Math.random();
        const type = r < 0.34 ? "heart" : r < 0.66 ? "sparkle" : r < 0.8 ? "flower" : "dot";
        const el = document.createElement("span");
        const size = type === "dot" ? rand(60, 140) : type === "sparkle" ? rand(8, 16) : rand(12, 24);
        el.className = "amb amb--" + type;
        el.style.left = rand(0, 96) + "%";
        el.style.top = rand(0, 94) + "%";
        el.style.width = el.style.height = size + "px";
        el.style.setProperty("--dur", rand(6, 14) + "s");
        el.style.setProperty("--delay", "-" + rand(0, 10) + "s");
        el.style.setProperty("--dx", rand(-16, 16) + "px");
        if (type !== "dot") el.innerHTML = SVG[type];
        box.appendChild(el);
      }
    });
  }

  /* confetti: a small canvas particle system (no libraries) */
  let confettiRaf = 0;
  function confetti() {
    const canvas = $("#confetti");
    if (!canvas || reduced()) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);
    const colors = ["#f8d7dc", "#e8a5b3", "#c9667d", "#7b2342", "#c9a24b", "#f0d88e", "#fdf7f0"];
    const total = window.innerWidth < 600 ? 120 : 190;
    const parts = [];
    const spawn = (n, burst) => {
      for (let i = 0; i < n; i++) {
        parts.push({
          x: burst ? W / 2 + rand(-80, 80) * dpr : rand(0, W),
          y: burst ? H * 0.72 : rand(-H * 0.4, -10),
          vx: burst ? rand(-7, 7) * dpr : rand(-1.2, 1.2) * dpr,
          vy: burst ? rand(-17, -8) * dpr : rand(1.5, 4) * dpr,
          g: 0.16 * dpr, drag: burst ? 0.985 : 0.995,
          s: rand(6, 12) * dpr, rot: rand(0, 6.28), vr: rand(-0.2, 0.2),
          c: colors[Math.floor(rand(0, colors.length))],
          shape: Math.random() < 0.3 ? "heart" : Math.random() < 0.5 ? "rect" : "dot",
          flip: rand(0, 6.28)
        });
      }
    };
    spawn(Math.round(total * 0.45), true);
    setTimeout(() => spawn(Math.round(total * 0.55), false), 350);
    const start = performance.now();
    cancelAnimationFrame(confettiRaf);
    (function frame(now) {
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.flip += 0.12;
        if (p.y > H + 30) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.shape === "rect") { ctx.scale(1, Math.cos(p.flip)); ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66); }
        else if (p.shape === "dot") { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.4, 0, 6.28); ctx.fill(); }
        else {
          const s = p.s * 0.75;
          ctx.beginPath(); ctx.moveTo(0, s * 0.35);
          ctx.bezierCurveTo(-s * 0.9, -s * 0.3, -s * 0.5, -s * 0.95, 0, -s * 0.45);
          ctx.bezierCurveTo(s * 0.5, -s * 0.95, s * 0.9, -s * 0.3, 0, s * 0.35);
          ctx.fill();
        }
        ctx.restore();
      }
      if (parts.length && now - start < 9000) confettiRaf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    })(start);
  }

  /* ======================================================================
     3 · MUSIC
     ====================================================================== */
  const music = (function () {
    const box = $("#music"), toggle = $("#musicToggle"), mute = $("#musicMute");
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = Math.min(Math.max(Number(cfg.musicVolume) || 0.5, 0), 1);
    audio.src = cfg.music;

    function ui() {
      const playing = !audio.paused;
      box.classList.toggle("is-playing", playing);
      toggle.setAttribute("aria-pressed", String(playing));
      toggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      mute.setAttribute("aria-pressed", String(audio.muted));
      mute.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    }
    function play() {
      const p = audio.play();
      if (p && p.then) p.then(ui).catch(ui); // browser may block → stay paused, no error
      else ui();
    }
    function pause() { audio.pause(); ui(); }
    function save() {
      store.set("bdayMusic", JSON.stringify({ p: !audio.paused, t: audio.currentTime, m: audio.muted }));
    }

    toggle.addEventListener("click", () => (audio.paused ? play() : pause()));
    mute.addEventListener("click", () => { audio.muted = !audio.muted; ui(); save(); });
    ["play", "pause", "volumechange"].forEach((ev) => audio.addEventListener(ev, ui));
    audio.addEventListener("error", () => {
      box.classList.add("is-unavailable");
      toggle.title = "Add your song at " + cfg.music;
    });
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });

    // restore state after a full page load (e.g. when opened from file://)
    try {
      const s = JSON.parse(store.get("bdayMusic") || "null");
      if (s) {
        audio.muted = !!s.m;
        if (s.t) audio.addEventListener("loadedmetadata", () => { try { audio.currentTime = s.t; } catch (e) { /* ignore */ } }, { once: true });
        if (s.p) play();
      }
    } catch (e) { /* ignore */ }
    ui();
    return { play, pause };
  })();

  /* ======================================================================
     4 · COUNTDOWN
     ====================================================================== */
  function parseBirthday(v) {
    const s = String(v || "").trim();
    const d = new Date(/T/.test(s) ? s : s + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }
  let warnedDate = false;
  function initCountdown() {
    const box = $("#countdown");
    if (!box) return;
    const label = $("#cdLabel"), grid = $("#cdGrid");
    const out = { d: $("#cdD"), h: $("#cdH"), m: $("#cdM"), s: $("#cdS") };
    const target = parseBirthday(cfg.birthday);
    if (!target && !warnedDate) { warnedDate = true; console.warn("birthdayConfig.birthday is not a valid date (use YYYY-MM-DD)."); }
    const pad = (n) => String(n).padStart(2, "0");

    function tick() {
      const now = Date.now();
      const diff = target ? target.getTime() - now : 1;
      if (!target) {
        label.textContent = "Your special day is almost here…";
        Object.values(out).forEach((el) => { el.textContent = "--"; });
        return;
      }
      if (diff > 0) {
        const s = Math.floor(diff / 1000);
        out.d.textContent = pad(Math.floor(s / 86400));
        out.h.textContent = pad(Math.floor((s % 86400) / 3600));
        out.m.textContent = pad(Math.floor((s % 3600) / 60));
        out.s.textContent = pad(s % 60);
        label.textContent = "Your special day is almost here…";
        grid.hidden = false; box.classList.remove("is-today");
      } else if (-diff < 864e5) {
        label.textContent = "Today is your day! 🎂❤️";
        grid.hidden = true; box.classList.add("is-today");
      } else {
        label.textContent = "Celebrating you, always ❤️";
        grid.hidden = true; box.classList.add("is-today");
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    cleanups.push(() => clearInterval(id));
  }

  /* ======================================================================
     5 · HOME — opening the surprise
     ====================================================================== */
  const isOpen = () => html.classList.contains("is-open");

  function openSurprise() {
    if (isOpen()) return;
    store.set("bdayOpened", "1");
    html.classList.add("is-open");
    floatHearts(reduced() ? 0 : 22);
    music.play(); // allowed: this runs inside her click
    setTimeout(() => { const t = $("#revealTitle"); if (t) t.focus({ preventScroll: true }); }, 1100);
  }

  function initHome() {
    const btn = $("#openBtn");
    if (!btn) return;
    btn.addEventListener("click", openSurprise);
    initCountdown();
  }

  /* ======================================================================
     6 · SCROLL REVEAL
     ====================================================================== */
  function initReveal() {
    const items = $$(".reveal:not(.in)");
    if (!items.length) return;
    if (reduced() || !("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = e.target;
          t.classList.add("in"); io.unobserve(t);
          setTimeout(() => { t.style.transitionDelay = ""; }, 1300); // don't delay later hover effects
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el, i) => {
      // tiny stagger for items revealed together (gallery, reasons)
      el.style.transitionDelay = ((i % 4) * 70) + "ms";
      io.observe(el);
    });
    cleanups.push(() => io.disconnect());
  }

  /* ======================================================================
     7 · GALLERY + LIGHTBOX
     ====================================================================== */
  const lightbox = (function () {
    const el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Photo viewer");
    el.innerHTML =
      '<button class="lb-btn lb-close" type="button" aria-label="Close photo viewer">' + SVG.close + "</button>" +
      '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">' + SVG.prev + "</button>" +
      '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next photo">' + SVG.next + "</button>" +
      '<p class="lb-count" aria-live="polite"></p>';
    document.body.appendChild(el);

    const img = $(".lb-img", el), cap = $(".lb-cap", el), count = $(".lb-count", el);
    const btnClose = $(".lb-close", el), btnPrev = $(".lb-prev", el), btnNext = $(".lb-next", el);
    let list = [], idx = 0, opener = null, open = false;

    function show(i, instant) {
      idx = (i + list.length) % list.length;
      const item = list[idx];
      const apply = () => {
        img.src = item.src; img.alt = item.alt;
        cap.textContent = item.cap;
        count.textContent = (idx + 1) + " / " + list.length;
        img.classList.remove("is-changing");
      };
      if (instant || reduced()) { apply(); } else {
        img.classList.add("is-changing");
        setTimeout(apply, 220);
      }
      // warm the neighbours
      [idx + 1, idx - 1].forEach((n) => { const p = list[(n + list.length) % list.length]; if (p) new Image().src = p.src; });
    }
    function openAt(items, i, from) {
      list = items; opener = from; open = true;
      show(i, true);
      el.classList.add("is-open");
      html.classList.add("lb-open");
      btnClose.focus({ preventScroll: true });
    }
    function close() {
      if (!open) return;
      open = false;
      el.classList.remove("is-open");
      html.classList.remove("lb-open");
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    }
    const next = () => show(idx + 1);
    const prev = () => show(idx - 1);

    btnClose.addEventListener("click", close);
    btnNext.addEventListener("click", next);
    btnPrev.addEventListener("click", prev);
    el.addEventListener("click", (e) => { if (e.target === el || e.target === $(".lb-fig", el)) close(); });

    document.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Tab") { // keep focus inside the viewer
        const f = [btnClose, btnPrev, btnNext];
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    // swipe (touch + pen + mouse drag)
    let sx = 0, sy = 0, tracking = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".lb-btn")) return;
      tracking = true; sx = e.clientX; sy = e.clientY;
    });
    el.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
    });
    el.addEventListener("pointercancel", () => { tracking = false; });

    return { open: openAt, close };
  })();

  function initGallery() {
    const figs = $$(".g-item");
    if (!figs.length) return;
    const data = figs.map((f) => {
      const im = $("img", f);
      const c = $("figcaption", f);
      return { src: im.currentSrc || im.src, alt: im.alt, cap: c ? c.textContent.trim() : "" };
    });
    figs.forEach((f, i) => {
      const b = $(".g-open", f);
      b.setAttribute("aria-label", "View photo " + (i + 1) + " of " + figs.length + (data[i].cap ? ": " + data[i].cap : ""));
      b.addEventListener("click", () => lightbox.open(data, i, b));
    });
    cleanups.push(() => lightbox.close());
  }

  /* ======================================================================
     8 · LOVE LETTER
     ====================================================================== */
  // wrap every word in a span so it can fade in one after another
  function prepareWords(root) {
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";
    let i = 0;
    $$("p", root).forEach((p) => {
      i += 3; // a breath between paragraphs
      Array.from(p.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w"; w.style.setProperty("--i", i++); w.textContent = part;
            frag.appendChild(w);
          });
          node.replaceWith(frag);
        } else if (node.nodeType === 1) {
          node.classList.add("w"); node.style.setProperty("--i", i++);
        }
      });
    });
  }

  function initLetter() {
    const btn = $("#openLetterBtn");
    if (!btn) return;
    const wrap = $("#envelopeWrap"), env = $("#envelope"), paper = $("#letterPaper"), body = $("#letterBody");
    prepareWords(body);

    btn.addEventListener("click", async () => {
      btn.disabled = true;
      btn.setAttribute("aria-expanded", "true");
      const quick = reduced();
      env.classList.add("is-open");
      floatHearts(quick ? 0 : 8);
      await wait(quick ? 0 : 1500);
      wrap.classList.add("is-gone");
      await wait(quick ? 0 : 600);
      wrap.hidden = true;
      paper.hidden = false;
      void paper.offsetWidth; // flush styles so the fade-in transition runs
      requestAnimationFrame(() => {
        paper.classList.add("is-shown");
        paper.scrollIntoView({ behavior: quick ? "auto" : "smooth", block: "start" });
        paper.focus({ preventScroll: true });
        setTimeout(() => body.classList.add("is-typing"), quick ? 0 : 600);
      });
    });
    // tap the letter to skip the slow reveal
    paper.addEventListener("click", () => body.classList.add("is-instant"));
  }

  /* ======================================================================
     9 · FINALE
     ====================================================================== */
  function initFinale() {
    const btn = $("#finaleBtn");
    if (!btn) return;
    const msg = $("#finaleMsg");
    btn.addEventListener("click", () => {
      confetti();
      floatHearts(reduced() ? 0 : 28);
      msg.textContent = msg.dataset.message || "";
      requestAnimationFrame(() => msg.classList.add("is-shown"));
      btn.textContent = "Once more? ✨";
      msg.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
    });
  }

  /* ======================================================================
     10 · HEADER, MENU, NAV STATE
     ====================================================================== */
  const header = $("#siteHeader"), menuBtn = $("#menuBtn"), siteNav = $("#siteNav");
  const pageName = () => document.body.dataset.page || "home";

  function updateHeader() {
    const solid = pageName() !== "home" || window.scrollY > 30 || html.classList.contains("menu-open");
    header.classList.toggle("is-solid", solid);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });

  function setMenu(openIt) {
    html.classList.toggle("menu-open", openIt);
    siteNav.classList.toggle("is-open", openIt);
    menuBtn.setAttribute("aria-expanded", String(openIt));
    menuBtn.setAttribute("aria-label", openIt ? "Close menu" : "Open menu");
    updateHeader();
    if (openIt) { const first = $("a", siteNav); if (first) setTimeout(() => first.focus({ preventScroll: true }), 60); }
  }
  menuBtn.addEventListener("click", () => setMenu(!siteNav.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (!siteNav.classList.contains("is-open")) return;
    if (e.key === "Escape") { setMenu(false); menuBtn.focus(); }
    else if (e.key === "Tab") {
      const f = [menuBtn].concat($$("a", siteNav));
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.matchMedia("(min-width: 860px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  function markNav() {
    $$("a", siteNav).forEach((a) => {
      const u = new URL(a.getAttribute("href"), location.href);
      const current = !u.hash && fileOf(u.pathname) === fileOf(location.pathname);
      if (current) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* ======================================================================
     11 · PAGE TRANSITIONS (soft fade + blur between pages)
          Music keeps playing because only <main> is swapped.
          Falls back to normal navigation (e.g. opening the files directly).
     ====================================================================== */
  const main = $("#main");
  const fileOf = (p) => { const f = p.split("/").pop(); return f || "index.html"; };

  function initPage() {
    applyText();
    initAmbient();
    initHome();
    initGallery();
    initLetter();
    initFinale();
    initReveal();
    updateHeader();
    markNav();
  }

  function scrollToHash(hash, smooth) {
    const t = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (t) t.scrollIntoView({ behavior: smooth && !reduced() ? "smooth" : "auto", block: "start" });
    else window.scrollTo({ top: 0, behavior: smooth && !reduced() ? "smooth" : "auto" });
  }

  async function go(href, push) {
    const u = new URL(href, location.href);
    setMenu(false);

    // same page (or only the #hash changes) → just scroll
    if (fileOf(u.pathname) === fileOf(location.pathname)) {
      if (u.hash === "#about" && pageName() === "home" && !isOpen()) { openSurprise(); await wait(900); }
      if (push && u.href !== location.href) history.pushState({}, "", u.href);
      scrollToHash(u.hash, true);
      return;
    }

    main.classList.add("is-leaving");
    await wait(reduced() ? 0 : 360);

    if (location.protocol === "file:") { location.href = u.href; return; }
    try {
      const res = await fetch(u.href, { credentials: "same-origin" });
      if (!res.ok) throw new Error("bad response");
      const doc = new DOMParser().parseFromString(await res.text(), "text/html");
      const next = $("#main", doc);
      if (!next) throw new Error("no main");

      cleanups.splice(0).forEach((fn) => { try { fn(); } catch (e) { /* ignore */ } });
      main.innerHTML = next.innerHTML;
      document.title = doc.title;
      document.body.dataset.page = doc.body.dataset.page || "";
      if (push) history.pushState({}, "", u.href);

      scrollToHash(u.hash && u.hash !== "#about" ? u.hash : "", false);
      initPage();
      main.classList.remove("is-leaving");
      main.classList.add("is-entering");
      main.addEventListener("animationend", () => main.classList.remove("is-entering"), { once: true });
      if (u.hash === "#about" && pageName() === "home") {
        if (!isOpen()) openSurprise();
        setTimeout(() => scrollToHash("#about", true), 700);
      }
    } catch (err) {
      location.href = u.href; // graceful fallback
    }
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin && location.protocol !== "file:") return;
    if (location.protocol === "file:" && u.protocol !== "file:") return;
    if (!/\.html?$|\/$/.test(u.pathname) && !(u.hash && fileOf(u.pathname) === fileOf(location.pathname))) return;
    e.preventDefault();
    go(a.href, true);
  });
  window.addEventListener("popstate", () => { if (location.protocol !== "file:") go(location.href, false); });

  /* ======================================================================
     BOOT
     ====================================================================== */
  applyColors();
  initPage();
  main.classList.add("is-entering");
  main.addEventListener("animationend", () => main.classList.remove("is-entering"), { once: true });
})();
