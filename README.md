# Evoqryn — landing page

React 19 + Vite + Tailwind CSS v4 + Motion. Cinematic dark landing page with video hero.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Before launch
- Add your hero video at `public/hero.mp4` (looping, muted, ~1080p, under ~10 MB).
- `src/data/site.js`: brand name, email, services, process, values.
- `src/components/About.jsx`: replace the TODO with your real story.
- `index.html` + `public/robots.txt` + `public/sitemap.xml`: replace `yourdomain.com`; add `public/og-image.png` (1200x630).
- Contact form opens the visitor's mail app; connect Formspree/EmailJS/your API for real submissions.

## Structure
```
src/
  components/  Navbar, Hero, VideoBackground, Services, About, Process, Contact, Footer, ui
  data/site.js
  index.css    Tailwind, theme tokens, glass styles
```
