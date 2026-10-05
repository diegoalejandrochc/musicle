import { useState, useCallback, useEffect } from "react";
import { getDailySong, getStorageKey } from "../utils/dailySeed";

// ── Helpers de comparación (misma lógica que useGame) ───────

function buildAlbumIndex(catalog) {
  const seen = new Set();
  const albums = [];
  for (const track of catalog) {
    if (!seen.has(track.album.id)) {
      seen.add(track.album.id);
      albums.push(track.album);
    }
  }
  albums.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  const index = {};
  albums.forEach((album, i) => { index[album.id] = i; });
  return index;
}

function compareSong(guess, target) {
  const isGreen =
    guess.id === target.id ||
    guess.name.toLowerCase() === target.name.toLowerCase();
  return { color: isGreen ? "green" : "gray", arrow: null };
}

function compareAlbum(guess, target, albumIndex) {
  const idxGuess  = albumIndex[guess.album.id]  ?? -1;
  const idxTarget = albumIndex[target.album.id] ?? -1;
  const diff = Math.abs(idxGuess - idxTarget);
  const color = diff === 0 ? "green" : diff <= 2 ? "yellow" : "gray";
  const arrow = diff === 0 ? null : idxTarget > idxGuess ? "up" : "down";
  return { color, arrow };
}

function compareTrackNumber(guess, target) {
  const diff = Math.abs(guess.trackNumber - target.trackNumber);
  const color = diff === 0 ? "green" : diff <= 2 ? "yellow" : "gray";
  const arrow = diff === 0 ? null : target.trackNumber > guess.trackNumber ? "up" : "down";
  return { color, arrow };
}

function compareDuration(guess, target) {
  const diffMs = Math.abs(guess.duration - target.duration);
  const color  = diffMs === 0 ? "green" : diffMs <= 30_000 ? "yellow" : "gray";
  const arrow  = diffMs === 0 ? null : target.duration > guess.duration ? "up" : "down";
  return { color, arrow };
}

function compareFeatures(guess, target, artistName) {
  const normalize  = (name) => name.toLowerCase().trim();
  const mainArtist = normalize(artistName);
  const featGuess  = guess.artists.map(normalize).filter((a) => a !== mainArtist);
  const featTarget = target.artists.map(normalize).filter((a) => a !== mainArtist);

  if (featGuess.length === 0 && featTarget.length === 0) return { color: "green", arrow: null };

  const sameLength  = featGuess.length === featTarget.length;
  const sameContent = featGuess.every((a) => featTarget.includes(a));
  if (sameLength && sameContent) return { color: "green", arrow: null };

  const sharesOne = featGuess.some((a) => featTarget.includes(a));
  return { color: sharesOne ? "yellow" : "gray", arrow: null };
}

function evaluateGuess(guessTrack, target, albumIndex, artistName) {
  return {
    track: guessTrack,
    result: {
      song:        compareSong(guessTrack, target),
      album:       compareAlbum(guessTrack, target, albumIndex),
      trackNumber: compareTrackNumber(guessTrack, target),
      duration:    compareDuration(guessTrack, target),
      features:    compareFeatures(guessTrack, target, artistName),
    },
  };
}

// ── Hook ────────────────────────────────────────────────────

const MAX_GUESSES = 6;

export function useDailyGame() {
  const [artist,     setArtist]     = useState(null);
  const [catalog,    setCatalog]    = useState([]);
  const [albumIndex, setAlbumIndex] = useState({});
  const [target,     setTarget]     = useState(null);
  const [guesses,    setGuesses]    = useState([]);
  const [status,     setStatus]     = useState("idle");
  const [remaining,  setRemaining]  = useState(MAX_GUESSES);

  // Guardar estado en localStorage después de cada cambio relevante
  useEffect(() => {
    if (!artist || status === "idle") return;
    const key = getStorageKey(artist.id);
    localStorage.setItem(key, JSON.stringify({
      targetId: target?.id,
      guesses,
      status,
    }));
  }, [guesses, status, artist, target]);

  const initGame = useCallback((artistData, catalogData) => {
    const index      = buildAlbumIndex(catalogData);
    const dailySong  = getDailySong(catalogData, artistData.id);
    const key        = getStorageKey(artistData.id);
    const saved      = localStorage.getItem(key);

    setArtist(artistData);
    setCatalog(catalogData);
    setAlbumIndex(index);

    if (saved) {
      // Restaurar partida guardada
      const parsed = JSON.parse(saved);

      // Verificar que el target guardado existe en el catálogo actual
      const savedTarget = catalogData.find((t) => t.id === parsed.targetId);
      const resolvedTarget = savedTarget ?? dailySong;

      setTarget(resolvedTarget);
      setGuesses(parsed.guesses ?? []);
      setStatus(parsed.status ?? "playing");
      setRemaining(MAX_GUESSES - (parsed.guesses?.length ?? 0));
    } else {
      // Partida nueva
      setTarget(dailySong);
      setGuesses([]);
      setStatus("playing");
      setRemaining(MAX_GUESSES);
    }
  }, []);

  const guess = useCallback((trackId) => {
    if (status !== "playing") return;

    const guessTrack = catalog.find((t) => t.id === trackId);
    if (!guessTrack) return;

    const alreadyGuessed = guesses.some((g) => g.track.id === trackId);
    if (alreadyGuessed) return;

    const evaluated    = evaluateGuess(guessTrack, target, albumIndex, artist.name);
    const newGuesses   = [...guesses, evaluated];
    const newRemaining = remaining - 1;
    const isWin        = evaluated.result.song.color === "green";

    setGuesses(newGuesses);
    setRemaining(newRemaining);
    setStatus(isWin ? "won" : newRemaining === 0 ? "lost" : "playing");
  }, [status, catalog, guesses, target, albumIndex, artist, remaining]);

  // Saber si el jugador ya terminó la partida de hoy
  const alreadyPlayed = status === "won" || status === "lost";

  return {
    artist, catalog, target,
    guesses, status, remaining,
    alreadyPlayed,
    initGame,
    guess,
  };
}