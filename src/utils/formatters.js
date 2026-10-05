// Convierte milisegundos a mm:ss
export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Convierte color del resultado a variable CSS
export function colorToStyle(color) {
  switch (color) {
    case "green":  return "var(--green)";
    case "yellow": return "var(--yellow)";
    default:       return "var(--gray)";
  }
}

// Convierte arrow a carácter unicode
export function arrowToChar(arrow) {
  if (arrow === "up")   return "↑";
  if (arrow === "down") return "↓";
  return null;
}