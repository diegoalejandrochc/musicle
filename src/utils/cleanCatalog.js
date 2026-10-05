// ============================================================
// PASO 1 — Patrones que descalifican una canción
// ============================================================
const BLOCKED_PATTERNS = [
  /\blive\b/i,
  /\bremix\b/i,
  /\bremixed\b/i,
  /\bacoustic\b/i,
  /\bdemo\b/i,
  /\bsped.?up\b/i,
  /\bslowed\b/i,
  /\binstrumental\b/i,
  /\bkaraoke\b/i,
];

function isBlocked(trackName) {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(trackName));
}

// ============================================================
// PASO 2 — Normalizar nombre para comparación interna
// ============================================================
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s*(feat\.|ft\.|featuring|with)\s+.*/gi, "")
    .replace(/\(.*?(remix|edit|version|live|acoustic|remaster|feat\.|ft\.).*?\)/gi, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\s*-\s*(remaster(ed)?|live|acoustic|remix|edit|version|demo)(\s+\d{4})?/gi, "")
    .trim()
    .replace(/\s+/g, " ");
}

// ============================================================
// PASO 3 — Puntaje de prioridad para elegir ganador
// ============================================================
function getEditionPriority(albumName) {
  const lower = albumName.toLowerCase();
  if (/anniversary|expanded|collector|complete|box set/.test(lower)) return 2;
  if (/deluxe/.test(lower)) return 1;
  return 0;
}

function getExplicitPriority(isExplicit) {
  return isExplicit ? 0 : 1;
}

// ============================================================
// PASO 4 — Elegir el ganador entre dos tracks del mismo grupo
// ============================================================
function pickWinner(a, b) {
  const editionDiff = getEditionPriority(a.album.name) - getEditionPriority(b.album.name);
  if (editionDiff !== 0) return editionDiff < 0 ? a : b;

  const explicitDiff = getExplicitPriority(a.explicit) - getExplicitPriority(b.explicit);
  if (explicitDiff !== 0) return explicitDiff < 0 ? a : b;

  // 👇 usar releaseDate completo en lugar de releaseYear
  const dateA = new Date(a.album.releaseDate ?? "9999-12-31");
  const dateB = new Date(b.album.releaseDate ?? "9999-12-31");
  if (dateA.getTime() !== dateB.getTime()) return dateA < dateB ? a : b;

  return a;
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================
export function cleanCatalog(rawTracks) {
  // Paso 1: eliminar versiones bloqueadas
  const filtered = rawTracks.filter((track) => !isBlocked(track.name));

  // Agregar nombre normalizado para agrupar
  const withNorm = filtered.map((track) => ({
    ...track,
    _normalizedName: normalizeName(track.name),
  }));

  // Paso 2: agrupar por nombre normalizado + duración ±30s
  const groups = [];

  for (const track of withNorm) {
    const existingGroup = groups.find(
      (group) =>
        group[0]._normalizedName === track._normalizedName &&
        Math.abs(group[0].duration - track.duration) <= 5_000
    );

    if (existingGroup) {
      existingGroup.push(track);
    } else {
      groups.push([track]);
    }
  }

  // Paso 3: elegir ganador de cada grupo
  const catalog = groups.map((group) => {
    const winner = group.reduce((best, current) => pickWinner(best, current));
    const { _normalizedName, ...cleanTrack } = winner;
    return cleanTrack;
  });

  // Ordenar alfabéticamente
  return catalog.sort((a, b) => a.name.localeCompare(b.name));
}