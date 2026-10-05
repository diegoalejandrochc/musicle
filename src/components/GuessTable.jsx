import GuessRow from "./GuessRow";

export default function GuessTable({ guesses, artistName, t }) {
  if (!guesses.length) return null;

  const headers = [
    t("colSong"),
    t("colAlbum"),
    t("colTrack"),
    t("colDuration"),
    t("colFeatures"),
  ];

  return (
    <section className="guess-history">
      <div className="guess-history__topline">
        <span className="guess-history__label">{String(guesses.length).padStart(2, "0")}</span>
        <span className="guess-history__rule" aria-hidden="true" />
      </div>

      <div className="guess-table-wrap">
        <table className="guess-table">
          <thead>
            <tr>
              {headers.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guesses.map((entry, index) => (
              <GuessRow
                key={`${entry.track.id}-${index}`}
                guessEntry={entry}
                artistName={artistName}
                t={t}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
