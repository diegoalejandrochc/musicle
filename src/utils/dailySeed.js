export function getTodayString() {
  return new Date().toISOString().split("T")[0]; // "2024-03-15"
}

export function getDailySeed(artistId, dateString) {
  const str = `${artistId}-${dateString}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailySong(catalog, artistId) {
  const today = getTodayString();
  const seed  = getDailySeed(artistId, today);
  return catalog[seed % catalog.length];
}

export function getStorageKey(artistId) {
  const today = getTodayString();
  return `musicle_daily_${artistId}_${today}`;
}

// Tiempo restante hasta medianoche en ms
export function getMsUntilMidnight() {
  const now       = new Date();
  const midnight  = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

// Formatea ms a "HHh MMm"
export function formatCountdown(ms) {
  if (ms <= 0) return "00h 00m";
  const totalSeconds = Math.floor(ms / 1000);
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}