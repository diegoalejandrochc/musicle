import { useState, useEffect } from "react";
import { formatDuration } from "../utils/formatters";
import { getMsUntilMidnight, formatCountdown } from "../utils/dailySeed";

export default function GameStatus({
  status,
  target,
  guesses,
  onReset,
  onClose,
  artistName,
  isDaily = false,
  t,
}) {
  const [countdown, setCountdown] = useState(formatCountdown(getMsUntilMidnight()));

  useEffect(() => {
    if (!isDaily) return;
    const interval = setInterval(() => {
      setCountdown(formatCountdown(getMsUntilMidnight()));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDaily]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (status !== "won" && status !== "lost") return null;

  const isWon = status === "won";
  const attemptCount = guesses.length;
  const mainArtist = artistName.toLowerCase().trim();
  const features = target.artists.filter(
    (artist) => artist.toLowerCase().trim() !== mainArtist
  );

  return (
    <div className="modal-layer" role="presentation">
      <button className="modal-backdrop" type="button" onClick={onClose} aria-label={t("viewAttempts")} />

      <div className="modal-positioner">
        <section
          className={`result-modal result-modal--${isWon ? "won" : "lost"}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
        >
          <button className="modal-close" type="button" onClick={onClose} aria-label={t("viewAttempts")}>
            <span aria-hidden="true">×</span>
          </button>

          <div className="result-modal__hero">
            <span className="result-modal__status-icon" aria-hidden="true">
              {isWon ? "✓" : "♪"}
            </span>
            <div>
              <h2 id="result-title" className="result-modal__title">
                {isWon ? t("youWon") : t("youLost")}
              </h2>
              <p className="result-modal__subtitle">
                {isWon ? t("wonSubtitle", attemptCount) : t("lostSubtitle")}
              </p>
            </div>
          </div>

          <div className="result-track">
            {target.album.image ? (
              <img className="result-track__art" src={target.album.image} alt="" />
            ) : (
              <div className="result-track__art result-track__art--empty" />
            )}

            <div className="result-track__copy">
              <span className="result-track__eyebrow">{artistName}</span>
              <p className="result-track__name">{target.name}</p>
              <p className="result-track__album">{target.album.name}</p>
              <p className="result-track__meta">
                {t("trackLabel", target.trackNumber)}
                <span aria-hidden="true">•</span>
                {formatDuration(target.duration)}
                {features.length > 0 && (
                  <>
                    <span aria-hidden="true">•</span>
                    {t("featLabel", features.join(", "))}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="result-grid" aria-label={`${attemptCount} attempts`}>
            {guesses.map((guess, rowIndex) => (
              <div key={`${guess.track.id}-${rowIndex}`} className="result-grid__row">
                {[
                  guess.result.song,
                  guess.result.album,
                  guess.result.trackNumber,
                  guess.result.duration,
                  guess.result.features,
                ].map((column, columnIndex) => (
                  <span
                    key={columnIndex}
                    className={`result-grid__cell result-grid__cell--${column.color}`}
                    title={colorToEmoji(column.color)}
                  />
                ))}
              </div>
            ))}
          </div>

          {isDaily && (
            <div className="countdown-card">
              <span className="countdown-card__label">{t("nextSongIn")}</span>
              <span className="countdown-card__time">{countdown}</span>
            </div>
          )}

          <div className="result-modal__actions">
            <button className="secondary-button secondary-button--wide" type="button" onClick={onClose}>
              {t("viewAttempts")}
            </button>

            {!isDaily && (
              <button className="primary-button primary-button--wide" type="button" onClick={onReset}>
                {t("playAgain")}
                <span aria-hidden="true">↻</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function colorToEmoji(color) {
  if (color === "green") return "🟩";
  if (color === "yellow") return "🟨";
  return "⬛";
}
