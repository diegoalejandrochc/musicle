import { useState, useCallback } from "react";

// ============================================================
// HELPERS
// ============================================================

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildAlbumIndex(catalog) {
  // Extraer álbumes únicos y ordenarlos por año de lanzamiento
  const seen = new Set();
  const albums = [];

  for (const track of catalog) {
    if (!seen.has(track.album.id)) {
      seen.add(track.album.id);
      albums.push(track.album);
    }
  }

  albums.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  // Asignar índice ordinal a cada álbum
  const index = {};
  albums.forEach((album, i) => {
    index[album.id] = i;
  });

  return index;
}

// ============================================================
// LÓGICA DE COMPARACIÓN
// ============================================================

function compareSong(guess, target) {
  const isGreen =
    guess.id === target.id ||
    guess.name.toLowerCase() === target.name.toLowerCase();

  return {
    color: isGreen ? "green" : "gray",
    arrow: null,
  };
}

function compareAlbum(guess, target, albumIndex) {
  const idxGuess  = albumIndex[guess.album.id]  ?? -1;
  const idxTarget = albumIndex[target.album.id] ?? -1;
  const diff = Math.abs(idxGuess - idxTarget);

  let color;
  if (diff === 0)      color = "green";
  else if (diff <= 2)  color = "yellow";
  else                 color = "gray";

  let arrow = null;
  if (diff !== 0) {
    arrow = idxTarget > idxGuess ? "up" : "down";
  }

  return { color, arrow };
}

function compareTrackNumber(guess, target) {
  const diff = Math.abs(guess.trackNumber - target.trackNumber);

  let color;
  if (diff === 0)      color = "green";
  else if (diff <= 2)  color = "yellow";
  else                 color = "gray";

  let arrow = null;
  if (diff !== 0) {
    arrow = target.trackNumber > guess.trackNumber ? "up" : "down";
  }

  return { color, arrow };
}

function compareDuration(guess, target) {
  // Trabajamos en milisegundos internamente
  const diffMs = Math.abs(guess.duration - target.duration);

  let color;
  if (diffMs === 0)          color = "green";
  else if (diffMs <= 30_000) color = "yellow";
  else                       color = "gray";

  let arrow = null;
  if (diffMs !== 0) {
    arrow = target.duration > guess.duration ? "up" : "down";
  }

  return { color, arrow };
}

function compareFeatures(guess, target, artistName) {
  // Filtrar el artista principal de ambas listas
  const normalize = (name) => name.toLowerCase().trim();
  const mainArtist = normalize(artistName);

  const featGuess  = guess.artists
    .map(normalize)
    .filter((a) => a !== mainArtist);

  const featTarget = target.artists
    .map(normalize)
    .filter((a) => a !== mainArtist);

  // Ambos sin features → verde
  if (featGuess.length === 0 && featTarget.length === 0) {
    return { color: "green", arrow: null };
  }

  // Exactamente los mismos features → verde
  const sameLength = featGuess.length === featTarget.length;
  const sameContent = featGuess.every((a) => featTarget.includes(a));
  if (sameLength && sameContent) {
    return { color: "green", arrow: null };
  }

  // Comparten al menos uno → amarillo
  const sharesOne = featGuess.some((a) => featTarget.includes(a));
  if (sharesOne) {
    return { color: "yellow", arrow: null };
  }

  // Ninguno coincide → gris
  return { color: "gray", arrow: null };
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

// ============================================================
// HOOK
// ============================================================

const MAX_GUESSES = 6;

export function useGame() {
  const [artist,       setArtist]       = useState(null);
  const [catalog,      setCatalog]      = useState([]);
  const [albumIndex,   setAlbumIndex]   = useState({});
  const [target,       setTarget]       = useState(null);
  const [guesses,      setGuesses]      = useState([]);
  const [status,       setStatus]       = useState("idle"); // idle | playing | won | lost
  const [remaining,    setRemaining]    = useState(MAX_GUESSES);

  // Iniciar partida con un artista y su catálogo ya cargado
  const initGame = useCallback((artistData, catalogData) => {
    const index  = buildAlbumIndex(catalogData);
    const chosen = pickRandom(catalogData);

    setArtist(artistData);
    setCatalog(catalogData);
    setAlbumIndex(index);
    setTarget(chosen);
    setGuesses([]);
    setStatus("playing");
    setRemaining(MAX_GUESSES);
  }, []);

  // Resetear partida con el mismo artista y catálogo
  const resetGame = useCallback(() => {
    if (!catalog.length) return;
    const chosen = pickRandom(catalog);
    setTarget(chosen);
    setGuesses([]);
    setStatus("playing");
    setRemaining(MAX_GUESSES);
  }, [catalog]);

  // Realizar un intento
  const guess = useCallback((trackId) => {
    if (status !== "playing") return;

    // Buscar el track en el catálogo
    const guessTrack = catalog.find((t) => t.id === trackId);
    if (!guessTrack) return;

    // Evitar repetir un intento ya realizado
    const alreadyGuessed = guesses.some((g) => g.track.id === trackId);
    if (alreadyGuessed) return;

    // Evaluar el intento
    const evaluated = evaluateGuess(guessTrack, target, albumIndex, artist.name);
    const newGuesses = [...guesses, evaluated];
    const newRemaining = remaining - 1;

    // Verificar victoria
    const isWin = evaluated.result.song.color === "green";

    // Actualizar estado
    setGuesses(newGuesses);
    setRemaining(newRemaining);

    if (isWin) {
      setStatus("won");
    } else if (newRemaining === 0) {
      setStatus("lost");
    }
  }, [status, catalog, guesses, target, albumIndex, artist, remaining]);

  return {
    // Estado
    artist,
    catalog,
    target,
    guesses,
    status,
    remaining,
    // Acciones
    initGame,
    resetGame,
    guess,
  };
}