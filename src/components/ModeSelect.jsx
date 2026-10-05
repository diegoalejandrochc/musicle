export default function ModeSelect({ onSelectMode, t }) {
  return (
    <div className="mode-select">
      <div className="section-heading section-heading--centered">
        <span className="section-eyebrow">Musicle</span>
        <p className="section-title">{t("selectMode")}</p>
      </div>

      <div className="mode-grid">
        <button
          className="mode-card mode-card--daily"
          type="button"
          onClick={() => onSelectMode("daily")}
        >
          <span className="mode-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
              <path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
              <path d="m9.5 15 1.7 1.7 3.5-3.7" />
            </svg>
          </span>

          <span className="mode-card__copy">
            <span className="mode-card__name">{t("modeDaily")}</span>
            <span className="mode-card__meta">01</span>
          </span>

          <span className="mode-card__arrow" aria-hidden="true">↗</span>
        </button>

        <button
          className="mode-card mode-card--infinite"
          type="button"
          onClick={() => onSelectMode("infinite")}
        >
          <span className="mode-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7.4 8.3c-2.5 0-4.4 1.6-4.4 3.7s1.9 3.7 4.4 3.7c4.5 0 4.8-7.4 9.2-7.4 2.5 0 4.4 1.6 4.4 3.7s-1.9 3.7-4.4 3.7c-4.4 0-4.8-7.4-9.2-7.4Z" />
            </svg>
          </span>

          <span className="mode-card__copy">
            <span className="mode-card__name">{t("modeInfinite")}</span>
            <span className="mode-card__meta">∞</span>
          </span>

          <span className="mode-card__arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
