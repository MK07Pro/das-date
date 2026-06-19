# Das Date 💕

Eine romantische interaktive Date-Planungs-Website mit Hollywood-Intro, Passwortschutz und 4 Mini-Spielen.

## Features

- 🔐 Passwortschutz (nur für Louisa)
- 🎬 ~30-sekündiges Kino-Intro mit Typewriter-Effekt, Partikel-Explosion & Glow-Titel
- 🎮 4 Mini-Spiele mit Retry-Mechanik (Herzfang, Memory, Quiz, Sternenhimmel)
- 💕 Kompletter Date-Planer mit Datum, Uhrzeit, Aktivität, Essen & mehr
- 📋 Kopierbarer Date-Plan am Ende

---

## Lokal starten

```bash
# 1. Dependencies installieren
npm install

# 2. Entwicklungsserver starten
npm run dev
```

Dann im Browser: `http://localhost:5173`

---

## Auf GitHub Pages deployen

### Schritt 1 – Repository erstellen
Erstelle ein neues Repository auf GitHub (z.B. `das-date`).

### Schritt 2 – Code hochladen
```bash
git init
git add .
git commit -m "Initial commit 💕"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/das-date.git
git push -u origin main
```

### Schritt 3 – GitHub Pages aktivieren
1. Gehe zu **Settings → Pages**
2. Bei **Source** wähle **GitHub Actions**
3. Der nächste Push deployt automatisch!

🌐 Deine Website ist dann unter:
`https://DEIN-USERNAME.github.io/das-date/`

---

## Alternativer Deploy: Netlify (noch einfacher)

1. Gehe zu [netlify.com](https://netlify.com) und logge dich ein
2. Klicke **"Add new site" → "Import an existing project"**
3. Verbinde dein GitHub-Repository
4. Build-Befehl: `npm run build`, Publish-Directory: `dist`
5. Fertig! 🎉

---

## Passwort anpassen

In `src/DatePlanner.jsx`, Zeile mit `"louisa"` suchen und ändern:

```js
if(val.trim().toLowerCase() === "louisa") {
```

---

## Projekt-Struktur

```
date-planner/
├── .github/
│   └── workflows/
│       └── deploy.yml      ← Auto-Deploy zu GitHub Pages
├── src/
│   ├── main.jsx            ← React Entry Point
│   └── DatePlanner.jsx     ← Gesamte App (552 Zeilen)
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

*Made with ❤️ – kein großes Ding.*
