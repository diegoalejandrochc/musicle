export default {
  // App
  appTitle: "MUSICLE",
  appSubtitle: "Adivina la canción",

  // ArtistSearch
  artistSearchLabel: "Elige un artista para jugar",
  artistSearchPlaceholder: "Buscar artista...",
  artistFollowers: (n) => `${n.toLocaleString()} seguidores`,
  artistNoAlbums: "No se encontraron álbumes para este artista. Prueba con otro artista.",
  artistLoadError: "Error al cargar canciones. Intenta de nuevo.",
  artistLoading: "Cargando canciones...",

  // Featured
  featuredArtists: "Artistas populares",

  // GameBoard
  changeArtist: "Cambiar artista",
  remainingPlural: (n) => `${n} intentos restantes`,
  remainingSingular: "1 intento restante",
  wonMessage: (n) => `¡Ganaste en ${n} ${n !== 1 ? "intentos" : "intento"}!`,
  lostMessage: "¡Mejor suerte la próxima vez!",
  playAgain: "Jugar de nuevo",

  // SongInput
  songInputPlaceholder: "Escribe el nombre de una canción...",
  guessButton: "Adivinar",
  guessError: "Elige una canción de la lista antes de adivinar.",

  // GuessTable headers
  colSong: "Canción",
  colAlbum: "Álbum",
  colTrack: "Pista #",
  colDuration: "Duración",
  colFeatures: "Features",

  // GuessRow
  noFeatures: "—",

  // GameStatus modal
  youWon: "¡Ganaste!",
  youLost: "Perdiste",
  wonSubtitle: (n) => `Adivinaste en ${n} ${n !== 1 ? "intentos" : "intento"}`,
  lostSubtitle: "La canción era:",
  trackLabel: (n) => `Pista ${n}`,
  featLabel: (artists) => `feat. ${artists}`,
  viewAttempts: "Ver intentos",

  // HowToPlay
  howToPlayTitle: "¿Cómo se juega?",
  activeArtist: "Artista activo",
  howToPlayIntro: (artist, count) =>
    `Adivina la canción misteriosa de ${artist} en 6 intentos. Las canciones provienen de ${count} ${count !== 1 ? "álbumes" : "álbum"}.`,
  availableAlbums: (n) => `Álbumes disponibles (${n})`,

  ruleGreenBadge: "Verde en cualquier columna",
  ruleGreenText: "indica una coincidencia exacta.",

  ruleYellowAlbumBadge: "Amarillo en álbum o pista #",
  ruleYellowAlbumText:
    "indica que ese atributo está dentro de 2 (álbumes o pistas), con una flecha indicando si es mayor (↑) o menor (↓).",

  ruleYellowDurationBadge: "Amarillo en duración",
  ruleYellowDurationText:
    "indica que la duración está dentro de 30 segundos, con una flecha indicando si es mayor (↑) o menor (↓).",

  ruleYellowFeaturesBadge: "Amarillo en features",
  ruleYellowFeaturesText:
    "indica que al menos uno de los artistas invitados es correcto.",

  // Mode select
  selectMode:       "Elige un modo",
  modeDaily:        "Daily",
  modeDailyDesc:    "Una canción por día. La misma para todos.",
  modeInfinite:     "Infinito",
  modeInfiniteDesc: "Una canción nueva en cada ronda.",

  // Daily completed screen
  nextSongIn:       "Próxima canción en",
  dailyWonTitle:    "¡Ganaste hoy!",
  dailyLostTitle:   "¡Mejor suerte mañana!",

  trendingArtists: "Artistas tendencia",
};
