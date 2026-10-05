import { useState, useRef, useEffect } from "react";

export default function SongInput({ catalog, onGuess, disabled, t }) {
  const [inputText, setInputText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!inputText.trim()) {
      setFiltered([]);
      setShowList(false);
      setActiveIndex(-1);
      return;
    }

    const query = inputText.toLowerCase();
    const results = catalog
      .filter((track) => track.name.toLowerCase().includes(query))
      .slice(0, 8);

    setFiltered(results);
    setShowList(results.length > 0);
    setActiveIndex(-1);
  }, [inputText, catalog]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setShowList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (event) => {
    setInputText(event.target.value);
    setSelected(null);
    setError("");
  };

  const handleSelectSuggestion = (track) => {
    setSelected(track);
    setInputText(track.name);
    setShowList(false);
    setError("");
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!selected) {
      setError(t("guessError"));
      return;
    }

    onGuess(selected.id);
    setInputText("");
    setSelected(null);
    setFiltered([]);
    setError("");
  };

  const handleKeyDown = (event) => {
    if (!showList) {
      if (event.key === "Enter") handleSubmit();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((previous) => Math.min(previous + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((previous) => Math.max(previous - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelectSuggestion(filtered[activeIndex]);
      } else {
        handleSubmit();
      }
    } else if (event.key === "Escape") {
      setShowList(false);
    }
  };

  const fieldState = selected ? " song-picker--selected" : focused ? " song-picker--focused" : "";

  return (
    <div className="song-entry">
      <div className="song-entry__row">
        <div className={`song-picker${fieldState}`}>
          <svg className="song-picker__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 14.7V5.8l8-1.8v8.2" />
            <circle cx="5" cy="14.7" r="2" />
            <circle cx="13" cy="12.2" r="2" />
          </svg>

          <input
            ref={inputRef}
            className="song-picker__input"
            type="text"
            placeholder={t("songInputPlaceholder")}
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setFocused(true);
              if (filtered.length) setShowList(true);
            }}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
          />

          {selected && (
            <span className="song-picker__check" aria-hidden="true">✓</span>
          )}

          {showList && (
            <ul ref={listRef} className="song-results" role="listbox">
              {filtered.map((track, index) => (
                <li key={track.id}>
                  <button
                    className={`song-result${index === activeIndex ? " song-result--active" : ""}`}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelectSuggestion(track);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {track.album.image ? (
                      <img className="song-result__art" src={track.album.image} alt="" />
                    ) : (
                      <span className="song-result__art song-result__art--empty" />
                    )}

                    <span className="song-result__copy">
                      <span className="song-result__name">{track.name}</span>
                      <span className="song-result__album">{track.album.name}</span>
                    </span>

                    <span className="song-result__arrow" aria-hidden="true">↵</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="guess-button"
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !selected}
        >
          <span>{t("guessButton")}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {error && <p className="form-error form-error--guess">{error}</p>}
    </div>
  );
}
