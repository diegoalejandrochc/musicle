import { useState, useMemo, useEffect } from "react";

export default function HowToPlay({ artist, catalog, t }) {
  const [open, setOpen] = useState(false);

  const albums = useMemo(() => {
    if (!catalog?.length) return [];

    const seen = new Set();
    const list = [];

    for (const track of catalog) {
      if (!seen.has(track.album.id)) {
        seen.add(track.album.id);
        list.push(track.album);
      }
    }

    return list.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  }, [catalog]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {artist && (
        <button
          className="howto-trigger"
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("howToPlayTitle")}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M7.9 7.8a2.35 2.35 0 0 1 4.55.82c0 1.75-2.45 1.78-2.45 3.38" />
            <path d="M10 14.6h.01" />
          </svg>
        </button>
      )}

      {open && (
        <div className="modal-layer" role="presentation">
          <button
            className="modal-backdrop"
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("howToPlayTitle")}
          />

          <div className="modal-positioner modal-positioner--sheet">
            <section
              className="howto-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="howto-title"
            >
              <header className="howto-modal__header">
                <div>
                  <span className="section-eyebrow">Musicle</span>
                  <h2 id="howto-title" className="howto-modal__title">
                    {t("howToPlayTitle")}
                  </h2>
                </div>

                <button
                  className="modal-close modal-close--static"
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("howToPlayTitle")}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </header>

              <div className="howto-artist">
                {artist.image ? (
                  <img className="howto-artist__art" src={artist.image} alt="" />
                ) : (
                  <span className="howto-artist__art howto-artist__art--empty" />
                )}

                <div>
                  <span className="howto-artist__label">{t("activeArtist")}</span>
                  <p className="howto-artist__name">{artist.name}</p>
                </div>
              </div>

              <p className="howto-modal__intro">
                {t("howToPlayIntro", artist.name, albums.length)}
              </p>

              <div className="rules-list">
                <Rule color="green" badge={t("ruleGreenBadge")} text={t("ruleGreenText")} />
                <Rule color="yellow" badge={t("ruleYellowAlbumBadge")} text={t("ruleYellowAlbumText")} />
                <Rule color="yellow" badge={t("ruleYellowDurationBadge")} text={t("ruleYellowDurationText")} />
                <Rule color="yellow" badge={t("ruleYellowFeaturesBadge")} text={t("ruleYellowFeaturesText")} />
              </div>

              <div className="howto-divider" />

              <section className="album-guide">
                <div className="album-guide__header">
                  <p className="album-guide__title">{t("availableAlbums", albums.length)}</p>
                  <span className="album-guide__count">{String(albums.length).padStart(2, "0")}</span>
                </div>

                <div className="album-strip">
                  {albums.map((album) => (
                    <div key={album.id} className="album-guide-card">
                      {album.image ? (
                        <img
                          className="album-guide-card__cover"
                          src={album.image}
                          alt={album.name}
                          title={`${album.name} (${album.releaseYear})`}
                        />
                      ) : (
                        <div className="album-guide-card__cover album-guide-card__cover--empty" />
                      )}
                      <span className="album-guide-card__year">{album.releaseYear}</span>
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

function Rule({ color, badge, text }) {
  return (
    <div className="rule-card">
      <span className={`rule-card__swatch rule-card__swatch--${color}`} aria-hidden="true" />
      <div className="rule-card__copy">
        <span className="rule-card__badge">{badge}</span>
        <span className="rule-card__text">{text}</span>
      </div>
    </div>
  );
}
