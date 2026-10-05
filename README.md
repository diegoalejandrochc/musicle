# Musicle

**A Wordle-inspired music guessing game powered by the Spotify Web API.**

Musicle lets you choose an artist and try to identify a mystery song from their discography in **six attempts**.

Each guess reveals clues about the song, album, track number, duration, and featured artists, helping you narrow down the answer.

> 🎮 **[Play Musicle](https://mellow-mochi-8b1b74.netlify.app/)**

---

## How to Play

1. Choose **Daily** or **Infinite** mode.
2. Search for any supported Spotify artist.
3. Select a song from that artist's catalogue.
4. Use the feedback from each guess to find the mystery song within six attempts.

Each guess is evaluated across five attributes:

| Attribute | What it compares |
|---|---|
| **Song** | Exact song match |
| **Album** | Album and chronological proximity |
| **Track** | Track number |
| **Duration** | Song length |
| **Features** | Featured artists |

### Feedback

- 🟩 **Green** — Exact match
- 🟨 **Yellow** — Close or partial match
- ⬛ **Gray** — No match
- ↑ ↓ — Indicates whether the target value is higher/later or lower/earlier

---

## Game Modes

### Daily

A deterministic song is generated using the selected artist and the current date.

Players who choose the same artist receive the same mystery song for that day.

Daily progress is stored locally in the browser, so refreshing the page does not reset the game.

### Infinite

A new mystery song is randomly selected for every game.

After finishing a round, the player can immediately start another game with the same artist.

---

## Features

- Search for artists dynamically through the **Spotify Web API**
- Play using real Spotify artist discographies
- Daily and Infinite game modes
- Six-attempt Wordle-style gameplay
- Album chronology hints
- Track-number hints
- Song-duration proximity hints
- Featured-artist comparison
- Catalogue filtering and deduplication
- Persistent Daily progress using `localStorage`
- English and Spanish interface
- Responsive dark-mode UI
- Keyboard-enabled song autocomplete
- Animated guess reveals
- Dynamic artist artwork and album covers

---

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**API**
- Spotify Web API

**Backend / Serverless**
- Netlify Functions

**Deployment**
- Netlify

---

## Architecture

Musicle separates the game logic, Spotify integration, and presentation layer into reusable components and custom React hooks.

```text
musicle/
├── netlify/
│   └── functions/          # Serverless Spotify authentication
│
├── public/
│
├── src/
│   ├── components/         # Game UI components
│   │   ├── ArtistSearch.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameStatus.jsx
│   │   ├── GuessRow.jsx
│   │   ├── GuessTable.jsx
│   │   ├── HowToPlay.jsx
│   │   ├── ModeSelect.jsx
│   │   └── SongInput.jsx
│   │
│   ├── hooks/
│   │   ├── useSpotify.js
│   │   ├── useGame.js
│   │   ├── useDailyGame.js
│   │   └── useLanguage.js
│   │
│   ├── i18n/               # English / Spanish translations
│   ├── utils/              # Catalogue processing and utilities
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── netlify.toml
├── package.json
└── vite.config.js
```

---

## Spotify Integration

Musicle retrieves artist and track information dynamically from Spotify.

Spotify authentication uses the **Client Credentials Flow**.

The Spotify `client_secret` is never exposed in the React application. Authentication is handled by a Netlify serverless function, which returns an access token to the frontend when Spotify data is needed.

---

## Catalogue Processing

Raw Spotify discographies often contain duplicate or alternate versions of the same song.

Musicle processes an artist's catalogue before starting a game by filtering or prioritizing releases such as:

- Live recordings
- Remixes
- Acoustic versions
- Demos
- Instrumentals
- Sped-up versions
- Deluxe and anniversary editions
- Duplicate releases

Tracks are normalized and deduplicated using information including song names, release metadata, and duration.

This helps the playable catalogue better represent the artist's primary studio discography.

---

## Guess Evaluation

### Song

An exact song match is green.

### Album

Albums are ordered chronologically.

An exact album is green, while nearby albums can produce a yellow result. Directional arrows indicate whether the target comes earlier or later in the artist's discography.

### Track Number

An exact track number is green.

Nearby track numbers receive partial feedback, while arrows indicate whether the mystery track number is higher or lower.

### Duration

The duration is compared with the mystery song.

Songs close to the target duration receive partial feedback, while arrows indicate whether the target is longer or shorter.

### Featured Artists

Featured artists are compared separately from the main artist.

Exact matches are green, while partial overlap can result in yellow.

---

## Daily Mode

Daily mode does not require a game database.

The mystery song is selected deterministically using:

```text
artist ID + current date
```

As a result, different players selecting the same artist receive the same Daily song.

Game progress is stored with `localStorage`, allowing the browser to restore attempts after refreshing or reopening the game.

---

## Internationalization

Musicle includes a lightweight custom internationalization system.

Currently supported languages:

- 🇺🇸 English
- 🇪🇸 Spanish

The translation architecture can be extended with additional languages.

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/diegoalejandrochc/musicle.git
cd musicle
```

Install dependencies:

```bash
npm install
```

Create a local `.env` containing the environment variables expected by the Spotify authentication function.

Spotify credentials are intentionally excluded from this repository.

Because the application uses Netlify Functions, run the development environment with:

```bash
npx netlify dev
```

Then open the local address provided by Netlify.

---

## Environment Variables

A Spotify Developer application is required when running your own copy of Musicle.

Provide the Spotify Client ID and Client Secret using environment variables.

**Never commit a `.env` file or Spotify Client Secret to GitHub.**

---

## Building

Create a production build with:

```bash
npm run build
```

Vite outputs the production application to:

```text
dist/
```

---

## Deployment

Musicle is designed to be deployed through **Netlify**.

The GitHub repository can be connected directly to Netlify so that pushes to the `main` branch automatically trigger new production deployments.

The Spotify credentials are configured as Netlify environment variables and are not stored in the GitHub repository.

---

## Project Status

Musicle is an actively developed personal project combining:

- Frontend engineering
- API integration
- Serverless architecture
- Game design
- Data cleaning
- State management
- Responsive UI/UX

---

## Author

**Diego Chuquillanqui**

Built as a personal software engineering project.