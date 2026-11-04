# 💖 Birthday Surprise Website for a Best Friend

A fully animated, single-page birthday surprise for a best friend ("My Demon"): countdown → welcome → login → 8 romantic pages, with background music, confetti, floating hearts and cute couple stickers.

## ▶️ How to open it
1. Unzip the folder.
2. Double-click **`index.html`** (works in Chrome, Edge, Safari, Firefox — on phone or computer).
3. The countdown starts by itself. 🎉

> Tip: to share it with him, upload the whole folder to any free host (Netlify Drop, GitHub Pages, Vercel…) and send him the link.
> The music only starts after she taps **"Unlock My Surprise"** (browsers don't allow music before a tap).

## 📁 Folder structure
```
birthday-site/
├── index.html            ← all pages/screens (gallery captions + timeline stories are edited here)
├── css/style.css         ← colours, animations, layout
├── js/
│   ├── content.js        ← ✏️ EASIEST FILE TO EDIT: letter, reasons, wishes, final messages
│   ├── stickers.js       ← the cartoon couple + cake drawings (SVG)
│   └── script.js         ← all the logic (music, navigation, animations)
└── assets/
    ├── images/           ← your photos go here (photo1.jpg … photo8.jpg, story1.jpg … story6.jpg, hidden-photo.jpg)
    └── audio/            ← put  birthday-song.mp3  here
```

## 📸 Replace the photos
Copy your pictures into `assets/images/` using **the same file names**:

| File | Where it appears |
|------|------------------|
| `photo1.jpg` … `photo8.jpg` | Page 2 — gallery (portrait 4:5 looks best) |
| `story1.jpg` … `story6.jpg` | Page 5 — timeline (landscape 16:10 looks best) |
| `hidden-photo.jpg` | Page 8 — "One More Surprise" |

The files currently there are pink placeholders. If a file is missing the site shows a pretty "add your photo" card instead of a broken image.

**Captions:** open `index.html`, search for `CAPTION` — each gallery card has a comment above it and the text is inside `<figcaption>`.
**Timeline:** search for `MILESTONE` in `index.html` — edit the date, title and paragraph.

## ✍️ Replace the words
Open **`js/content.js`**. Everything is explained inside:
- `letter` → paragraphs of the typewriter love letter (Page 3)
- `reasons` → the 8 flip cards (Page 4)
- `wishes` → the birthday wish (Page 7)
- `coupleSurprise`, `finalSurprise`, `finalLine` → pages 6 and 8

`{him}` is replaced by your friend's name ("My Demon" by default) and `{me}` by your name (typed on the login screen).

## 🎵 Change the song
1. Put your MP3 in `assets/audio/` and name it **`birthday-song.mp3`**
   — or change `src="assets/audio/birthday-song.mp3"` on the `<audio>` tag near the bottom of `index.html`.
2. That's it. It loops automatically. If the file is missing, a small note appears under the music button.

## 🧸 Use your own friends cartoons (optional)
The two friends are drawn in code. To use your own pictures instead, save PNG/JPG/SVG files as:
`assets/images/friends-hug.png`, `friends-highfive.png`, `friends-selfie.png`
They replace the built-in drawings automatically.

## 🎨 Quick tweaks
- Colours: the top of `css/style.css` (`:root` variables and the `.bg-layer[data-t="…"]` gradients).
- Countdown speed: `runCountdown()` in `js/script.js` (the `1150` is milliseconds per number).
- Fonts load from Google Fonts (needs internet); offline it falls back to system fonts.

## ♿ Notes
- Respects "reduce motion" settings (animations, hearts and confetti are turned off).
- Fully responsive: phone, tablet, desktop.
- Keyboard: ← / → change page, Esc closes the photo viewer.

Made with love for a best friend 🤝
