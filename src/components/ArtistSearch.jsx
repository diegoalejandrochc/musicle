import { useState, useRef, useEffect } from "react";

/* Samples the artwork and returns a restrained RGB accent for each card. */
function extractColor(imageUrl) {
  return new Promise((resolve) => {
    const FALLBACK = "137, 146, 155";

    if (!imageUrl) return resolve(FALLBACK);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const SIZE = 24;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

        let bestR = 0;
        let bestG = 0;
        let bestB = 0;
        let bestSat = -1;
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const brightness = max / 255;
          const sat = max === 0 ? 0 : (max - min) / max;

          if (brightness < 0.12 || brightness > 0.96) continue;

          sumR += r;
          sumG += g;
          sumB += b;
          count++;

          if (sat > bestSat) {
            bestSat = sat;
            bestR = r;
            bestG = g;
            bestB = b;
          }
        }

        if (count === 0) return resolve(FALLBACK);

        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;
        const r = Math.round(avgR * 0.68 + bestR * 0.32);
        const g = Math.round(avgG * 0.68 + bestG * 0.32);
        const b = Math.round(avgB * 0.68 + bestB * 0.32);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const finalSat = max === 0 ? 0 : (max - min) / max;

        resolve(finalSat < 0.12 ? FALLBACK : `${r}, ${g}, ${b}`);
      } catch {
        resolve(FALLBACK);
      }
    };

    img.onerror = () => resolve(FALLBACK);
    img.src = imageUrl;
  });
}

export default function ArtistSearch({ onSearch, onSelect, loadFeaturedArtists, error, t }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [artistColors, setArtistColors] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const debounceRef = useRef(null);
  const searchBlockRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBlockRef.current && !searchBlockRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingTrending(true);

    loadFeaturedArtists(8).then(async (artists) => {
      if (cancelled) return;
      setTrending(artists);
      setLoadingTrending(false);

      const entries = await Promise.all(
        artists.map(async (artist) => [artist.id, await extractColor(artist.image)])
      );

      if (!cancelled) setArtistColors(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [loadFeaturedArtists]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await onSearch(value);
      setSuggestions(results);
      setSearching(false);
    }, 400);
  };

  const handleSelect = (artist) => {
    setSuggestions([]);
    setQuery("");
    onSelect(artist);
  };

  const handleTrendingSelect = async (artist) => {
    if (loadingId) return;
    setLoadingId(artist.id);
    await onSelect(artist);
    setLoadingId(null);
  };

  return (
    <div className="artist-search">
      <div className="section-heading">
        <span className="section-eyebrow">Spotify</span>
        <p className="section-title">{t("artistSearchLabel")}</p>
      </div>

      <div ref={searchBlockRef} className="artist-search__block">
        <div className={`search-field${searching ? " search-field--loading" : ""}`}>
          <svg className="search-field__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.7" cy="8.7" r="5.4" />
            <path d="m12.7 12.7 4 4" />
          </svg>

          <input
            className="search-field__input"
            type="text"
            placeholder={t("artistSearchPlaceholder")}
            value={query}
            onChange={handleChange}
            autoComplete="off"
            spellCheck="false"
            aria-label={t("artistSearchLabel")}
          />

          {searching && <span className="mini-spinner" aria-hidden="true" />}
        </div>

        {error && <p className="form-error">{error}</p>}

        {suggestions.length > 0 && (
          <ul className="artist-results" role="listbox">
            {suggestions.map((artist) => (
              <li key={artist.id} className="artist-results__row">
                <button
                  className="artist-result"
                  type="button"
                  onClick={() => handleSelect(artist)}
                >
                  {artist.image ? (
                    <img className="artist-result__avatar" src={artist.image} alt="" />
                  ) : (
                    <span className="artist-result__avatar artist-result__avatar--empty" />
                  )}

                  <span className="artist-result__copy">
                    <span className="artist-result__name">{artist.name}</span>
                    <span className="artist-result__meta">
                      {t("artistFollowers", artist.followers)}
                    </span>
                  </span>

                  <span className="artist-result__arrow" aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="trending-section">
        <div className="trending-section__header">
          <p className="trending-section__title">{t("trendingArtists")}</p>
          <span className="trending-section__line" aria-hidden="true" />
        </div>

        <div className="artist-grid">
          {loadingTrending
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="artist-card-skeleton skeleton" />
              ))
            : trending.map((artist, index) => {
                const isLoading = loadingId === artist.id;
                const rgb = artistColors[artist.id] ?? "137, 146, 155";

                return (
                  <button
                    key={artist.id}
                    className={`artist-card${isLoading ? " artist-card--loading" : ""}`}
                    style={{ "--artist-rgb": rgb }}
                    type="button"
                    onClick={() => handleTrendingSelect(artist)}
                    disabled={!!loadingId}
                  >
                    <span className="artist-card__media">
                      {artist.image ? (
                        <img className="artist-card__image" src={artist.image} alt="" />
                      ) : (
                        <span className="artist-card__placeholder" />
                      )}
                      <span className="artist-card__scrim" aria-hidden="true" />

                      {isLoading && (
                        <span className="artist-card__loading" aria-hidden="true">
                          <span className="mini-spinner mini-spinner--light" />
                        </span>
                      )}
                    </span>

                    <span className="artist-card__footer">
                      <span className="artist-card__index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="artist-card__name">{artist.name}</span>
                    </span>
                  </button>
                );
              })}
        </div>
      </section>
    </div>
  );
}
