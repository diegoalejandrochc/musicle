import { useState, useEffect, useRef } from "react";
import SongInput from "./SongInput";
import GuessTable from "./GuessTable";
import GameStatus from "./GameStatus";

const MODAL_DELAY_MS = 1050;
const MAX_GUESSES = 6;

export default function GameBoard({ game, onChangeArtist, t, isDaily = false }) {
  const { artist, catalog, status, remaining, guesses, guess, target, resetGame } = game;
  const [showModal, setShowModal] = useState(false);
  const prevStatusRef = useRef(status);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (guesses.length === 0) return;
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 0);
    return () => clearTimeout(timer);
  }, [guesses.length]);

  useEffect(() => {
    const previous = prevStatusRef.current;
    prevStatusRef.current = status;

    if ((status === "won" || status === "lost") && previous === "playing") {
      const timer = setTimeout(() => setShowModal(true), MODAL_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleReset = () => {
    if (!resetGame) return;
    setShowModal(false);
    resetGame();
  };

  const isFinished = status === "won" || status === "lost";
  const usedAttempts = MAX_GUESSES - remaining;
  const remainingTone = remaining <= 1 ? "danger" : remaining <= 2 ? "warning" : "normal";

  return (
    <div className="game-board">
      <section className="player-card">
        <div className="player-card__artist">
          {artist.image ? (
            <div className="player-card__art-wrap">
              <img className="player-card__art" src={artist.image} alt="" />
            </div>
          ) : (
            <div className="player-card__art-wrap player-card__art-wrap--empty" />
          )}

          <div className="player-card__copy">
            <span className="player-card__label">{t("activeArtist")}</span>
            <span className="player-card__name">{artist.name}</span>
          </div>
        </div>

        <div className="player-card__actions">
          <span className={`mode-pill${isDaily ? " mode-pill--daily" : ""}`}>
            <span className="mode-pill__dot" aria-hidden="true" />
            {t(isDaily ? "modeDaily" : "modeInfinite")}
          </span>

          <button className="secondary-button" type="button" onClick={onChangeArtist}>
            {t("changeArtist")}
          </button>
        </div>
      </section>

      {!isFinished ? (
        <section className="guess-panel">
          <div className="attempts-bar">
            <div className="attempts-bar__copy">
              <p className={`attempts-bar__remaining attempts-bar__remaining--${remainingTone}`}>
                {remaining === 1 ? t("remainingSingular") : t("remainingPlural", remaining)}
              </p>
              <span className="attempts-bar__count">{usedAttempts}/{MAX_GUESSES}</span>
            </div>

            <div className={`attempt-meter attempt-meter--${remainingTone}`} aria-hidden="true">
              {Array.from({ length: MAX_GUESSES }).map((_, index) => (
                <span
                  key={index}
                  className={`attempt-meter__segment${index < usedAttempts ? " attempt-meter__segment--used" : ""}`}
                />
              ))}
            </div>
          </div>

          <SongInput catalog={catalog} onGuess={guess} disabled={false} t={t} />
        </section>
      ) : (
        <section className={`finished-panel finished-panel--${status}`} aria-live="polite">
          <div className="finished-panel__copy">
            <span className="finished-panel__icon" aria-hidden="true">
              {status === "won" ? "✓" : "♪"}
            </span>
            <p className="finished-panel__message">
              {status === "won" ? t("wonMessage", guesses.length) : t("lostMessage")}
            </p>
          </div>

          {!isDaily && (
            <button className="primary-button" type="button" onClick={handleReset}>
              {t("playAgain")}
              <span aria-hidden="true">↻</span>
            </button>
          )}
        </section>
      )}

      <GuessTable guesses={guesses} artistName={artist.name} t={t} />
      <div ref={bottomRef} className="game-board__bottom-anchor" />

      {isFinished && showModal && (
        <GameStatus
          status={status}
          target={target}
          guesses={guesses}
          onReset={handleReset}
          onClose={() => setShowModal(false)}
          artistName={artist.name}
          isDaily={isDaily}
          t={t}
        />
      )}
    </div>
  );
}
