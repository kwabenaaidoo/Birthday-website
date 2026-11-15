# 💌 Birthday Website

A static, romantic birthday website: cinematic reveal, countdown, memory timeline, masonry gallery with lightbox, "reasons" cards, an animated love letter, music and a confetti finale.

No backend, no database, no analytics, no tracking, no frameworks. Plain HTML, CSS and JavaScript. The only external request is **Google Fonts** (see "Privacy" below).

```
birthday-website/
├── index.html      Reveal + countdown + "The Girl Behind My Smile"
├── memories.html   Timeline
├── gallery.html    Photo gallery + lightbox + "Reasons" cards
├── letter.html     Envelope + love letter + finale
├── css/style.css   Styles (colour palette at the top)
├── js/script.js    Settings at the top, behaviour below
└── assets/
    ├── images/     hero.jpg, photo1–photo7.jpg
    └── music/      birthday-song.mp3
```

---

## 1. Replace her photos

Put your photos in `assets/images/` and **keep the same file names** (easiest), or change the `src="assets/images/…"` in the HTML.

| File | Where it's used |
|---|---|
| `hero.jpg` | Opening screen, first gallery photo, finale. Use a portrait (phone-shaped) photo with her face in the upper half. |
| `photo1.jpg` | "The Girl Behind My Smile" (arched frame) and gallery |
| `photo2.jpg` – `photo6.jpg` | Memories and gallery |
| `photo7.jpg` | Gallery only |

Tips:
- JPG, roughly 900–1400 px wide, under ~400 KB each keeps it fast on mobile data.
- If you use a different size, update the `width` and `height` attributes on that `<img>` (prevents layout jumping).
- Also update each `alt="…"` to describe the new photo (helps screen readers).
- **Add a photo:** in `gallery.html` copy a whole `<figure class="g-item reveal">…</figure>` block. 8–15 photos looks best.
- **Add a memory:** in `memories.html` copy a whole `<li class="memory reveal">…</li>` block.

The sample photos in this folder are the ones you sent me, resized.

## 2. Change her name

Open `js/script.js` and edit the block at the top:

```js
const birthdayConfig = {
  name: "My Love",        // ← her name
  from: "Kobby",          // ← your name (letter signature)
  ...
```

It updates everywhere automatically (header, hero, footer, finale).

## 3. Change the birthday date

Same block:

```js
birthday: "2026-12-20",   // YYYY-MM-DD  (or "2026-12-20T18:00:00" for a specific time)
```

Before that moment: a live countdown. During her birthday: **"Today is your day! 🎂❤️"**. Afterwards: "Celebrating you, always ❤️". The countdown uses the visitor's own time zone.

## 4. Change the messages

Text lives in the HTML. Search each file for **`✏️`** to jump to the editable spots:

| What | File | Look for |
|---|---|---|
| Main birthday message (after she opens the surprise) | `index.html` | `EDIT HERE: your main birthday message` |
| About her paragraph | `index.html` | `EDIT HERE: write about her` |
| Memory dates, titles, descriptions | `memories.html` | `EDIT HERE: each <li>` |
| Gallery captions (shown in the full-screen viewer) | `gallery.html` | the `<figcaption>` of each photo |
| "Reasons" cards | `gallery.html` | `EDIT HERE: each <li> is one card` |
| **Love letter** | `letter.html` | `EDIT YOUR LETTER HERE` |
| Finale message | `letter.html` | `data-message="…"` on `#finaleMsg` |

> ⚠️ The memory dates ("The very start", "One ordinary day"…), the about paragraph and the letter are **placeholders**. Replace them with your own words and real dates. Before you send the site, set `showEditNotes: false` in `js/script.js` to hide the small "Note to you" box on the letter page.

**Colours:** edit the `--wine`, `--rose`, `--blush`, `--cream`, `--gold` values at the top of `css/style.css` (or override them in `birthdayConfig.colors`).

## 5. Add or change the music

1. Put your song in `assets/music/` and name it `birthday-song.mp3` (or change `music: "…"` in `js/script.js`).
2. Optional: `musicVolume: 0.5` (0 – 1).

The included `birthday-song.mp3` is a short, original music-box loop I generated so the player works out of the box. Replace it with her favourite song. Use a song you have the rights to share, and keep the file small (a 3–4 minute MP3 at 128 kbps is about 3–4 MB).

How it behaves: music starts when she taps **Open Your Surprise**. Browsers block autoplay otherwise, so it never starts on its own. The floating button (bottom-right) has play/pause and mute. Music keeps playing while she moves between pages.

## 6. Run it locally

Simplest: double-click `index.html`. Everything works (page changes then use normal fades).

Best (matches how it will look online, with smooth in-page transitions and uninterrupted music):

```bash
cd birthday-website
python3 -m http.server 8000
# open http://localhost:8000
```

(or `npx serve`)

## 7. Deploy

It's just files, so any static host works. **Upload the whole folder with `index.html` at the top level.**

**Netlify (easiest):** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `birthday-website` folder onto the page. You'll get a link right away.

**GitHub Pages**
1. Create a new repository and upload all files (keep `index.html` in the root).
2. *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.*
3. Your link will be `https://<username>.github.io/<repo-name>/`.

**Vercel**
1. Install the CLI: `npm i -g vercel`, then run `vercel` inside the folder and accept the defaults (no build command, output directory `.`).
2. Or import the GitHub repository at vercel.com/new with *Framework Preset: Other*.

Tip: use a repository/project name that doesn't give the surprise away. Each page also has `noindex`, so search engines are asked not to list it.

---

## Accessibility & performance

- Semantic HTML, one `h1` per page, keyboard-friendly everywhere (the lightbox supports `←` `→` `Esc` and swipe), visible focus outlines, "skip to content" link.
- `prefers-reduced-motion` is respected: animations are removed, confetti is skipped and the letter shows instantly.
- Gallery images are lazy-loaded; there are no libraries, no video, and a small number of decorative particles.

## Privacy

No analytics, trackers, ads, accounts or databases. The only third-party request is the Google Fonts stylesheet (Cormorant Garamond, Jost, Great Vibes). If you want zero external requests, download those fonts, host them in the folder and replace the `<link href="https://fonts.googleapis.com/…">` line in each HTML file with your own `@font-face` rules. The site falls back to elegant system fonts if the fonts can't load.

## Troubleshooting

- **No music?** Check `assets/music/birthday-song.mp3` exists and that she tapped the button first (browsers require a tap).
- **Photo not showing?** File name and capital letters must match exactly (`Photo1.JPG` ≠ `photo1.jpg` online).
- **Want to see the opening screen again?** Close the tab and reopen the link. It remembers she opened the surprise only for that browsing session.
