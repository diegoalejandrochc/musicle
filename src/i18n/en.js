export default {
  // App
  appTitle: "MUSICLE",
  appSubtitle: "Guess the song",

  // ArtistSearch
  artistSearchLabel: "Choose an artist to play",
  artistSearchPlaceholder: "Search artist...",
  artistFollowers: (n) => `${n.toLocaleString()} followers`,
  artistNoAlbums: "No albums found for this artist. Try another one.",
  artistLoadError: "Error loading songs. Please try again.",
  artistLoading: "Loading songs...",

  // Featured
  featuredArtists: "Popular artists",

  // GameBoard
  changeArtist: "Change artist",
  remainingPlural: (n) => `${n} attempts remaining`,
  remainingSingular: "1 attempt remaining",
  wonMessage: (n) => `You won in ${n} ${n !== 1 ? "attempts" : "attempt"}!`,
  lostMessage: "Better luck next time!",
  playAgain: "Play again",

  // SongInput
  songInputPlaceholder: "Type a song name...",
  guessButton: "Guess",
  guessError: "Select a song from the list before guessing.",

  // GuessTable headers
  colSong: "Song",
  colAlbum: "Album",
  colTrack: "Track #",
  colDuration: "Duration",
  colFeatures: "Features",

  // GuessRow
  noFeatures: "—",

  // GameStatus modal
  youWon: "You won!",
  youLost: "You lost",
  wonSubtitle: (n) => `Guessed in ${n} ${n !== 1 ? "attempts" : "attempt"}`,
  lostSubtitle: "The song was:",
  trackLabel: (n) => `Track ${n}`,
  featLabel: (artists) => `feat. ${artists}`,
  viewAttempts: "View attempts",

  // HowToPlay
  howToPlayTitle: "How to play?",
  activeArtist: "Active artist",
  howToPlayIntro: (artist, count) =>
    `Guess the mystery song by ${artist} in 6 attempts. Songs come from ${count} ${count !== 1 ? "albums" : "album"}.`,
  availableAlbums: (n) => `Available albums (${n})`,

  ruleGreenBadge: "Green in any column",
  ruleGreenText: "indicates an exact match!",

  ruleYellowAlbumBadge: "Yellow in album or track #",
  ruleYellowAlbumText:
    "indicates that attribute is within 2 (albums or tracks), with an arrow hinting if it is higher (↑) or lower (↓).",

  ruleYellowDurationBadge: "Yellow in duration",
  ruleYellowDurationText:
    "indicates the song length is within 30 seconds, with an arrow hinting if it is higher (↑) or lower (↓).",

  ruleYellowFeaturesBadge: "Yellow in features",
  ruleYellowFeaturesText:
    "indicates that at least one of the featured artists is correct.",

  // Mode select
  selectMode:       "Choose a mode",
  modeDaily:        "Daily",
  modeDailyDesc:    "One song per day. Same for everyone.",
  modeInfinite:     "Infinite",
  modeInfiniteDesc: "New random song every round.",

  // Daily completed screen
  nextSongIn:       "Next song in",
  dailyWonTitle:    "You won today!",
  dailyLostTitle:   "Better luck tomorrow!",

  trendingArtists: "Trending Artists",
};
