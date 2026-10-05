import { useState } from "react";
import { useSpotify } from "./hooks/useSpotify";
import { useGame } from "./hooks/useGame";
import { useDailyGame } from "./hooks/useDailyGame";
import { useLanguage } from "./hooks/useLanguage";
import ArtistSearch from "./components/ArtistSearch";
import ModeSelect from "./components/ModeSelect";
import GameBoard from "./components/GameBoard";
import HowToPlay from "./components/HowToPlay";
import "./App.css";

export default function App() {
  const { searchArtists, loadFeaturedArtists, loadAllTracks } = useSpotify();
  const infiniteGame = useGame();
  const dailyGame = useDailyGame();
  const { lang, t, toggleLanguage } = useLanguage();

  const [view, setView] = useState("mode");
  const [mode, setMode] = useState(null);
  const [loadError, setLoadError] = useState("");

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
    setView("search");
  };

  const handleSelectArtist = async (artist) => {
    setView("loading");
    setLoadError("");

    try {
      const catalog = await loadAllTracks(artist.id);

      if (!catalog.length) {
        setLoadError(t("artistNoAlbums"));
        setView("search");
        return;
      }

      if (mode === "daily") {
        dailyGame.initGame(artist, catalog);
        setView("daily");
      } else {
        infiniteGame.initGame(artist, catalog);
        setView("game");
      }
    } catch {
      setLoadError(t("artistLoadError"));
      setView("search");
    }
  };

  const handleChangeArtist = () => setView("search");
  const handleChangeMode = () => {
    setMode(null);
    setView("mode");
  };

  const activeArtist =
    view === "game"
      ? infiniteGame.artist
      : view === "daily"
        ? dailyGame.artist
        : null;

  const activeCatalog =
    view === "game"
      ? infiniteGame.catalog
      : view === "daily"
        ? dailyGame.catalog
        : [];

  const isPlaying = view === "game" || view === "daily";

  return (
    <div className="app-shell" data-view={view}>
      <div className="app-ambient" aria-hidden="true" />

      <button
        className="language-button"
        type="button"
        onClick={toggleLanguage}
        aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
      >
        {lang === "en" ? "ES" : "EN"}
      </button>

      <HowToPlay artist={activeArtist} catalog={activeCatalog} t={t} />

      <header className={`app-header${isPlaying ? " app-header--compact" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="brand-copy">
            <h1 className="app-title">{t("appTitle")}</h1>
            <p className="app-subtitle">{t("appSubtitle")}</p>
          </div>
        </div>
      </header>

      <main className={`app-main app-main--${view}`}>
        {view === "mode" && (
          <section className="app-stage app-stage--intro">
            <ModeSelect onSelectMode={handleSelectMode} t={t} />
          </section>
        )}

        {view === "search" && (
          <section className="app-stage app-stage--search">
            <button className="back-button" type="button" onClick={handleChangeMode}>
              <span aria-hidden="true">←</span>
              <span>{t(mode === "daily" ? "modeDaily" : "modeInfinite")}</span>
            </button>

            <ArtistSearch
              onSearch={searchArtists}
              onSelect={handleSelectArtist}
              loadFeaturedArtists={loadFeaturedArtists}
              error={loadError}
              t={t}
            />
          </section>
        )}

        {view === "loading" && (
          <section className="loading-state" role="status" aria-live="polite">
            <div className="loading-disc" aria-hidden="true">
              <span className="loading-disc__center" />
            </div>
            <p className="loading-text">{t("artistLoading")}</p>
          </section>
        )}

        {view === "game" && (
          <section className="game-stage">
            <GameBoard
              game={infiniteGame}
              onChangeArtist={handleChangeArtist}
              t={t}
              isDaily={false}
            />
          </section>
        )}

        {view === "daily" && (
          <section className="game-stage">
            <GameBoard
              game={dailyGame}
              onChangeArtist={handleChangeArtist}
              t={t}
              isDaily={true}
            />
          </section>
        )}
      </main>
    </div>
  );
}
