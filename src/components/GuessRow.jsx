import { formatDuration, arrowToChar } from "../utils/formatters";

export default function GuessRow({ guessEntry, artistName, t }) {
  const { track, result } = guessEntry;
  const mainArtist = artistName.toLowerCase().trim();
  const features = track.artists.filter((artist) => artist.toLowerCase().trim() !== mainArtist);

  return (
    <tr className="guess-row">
      <Cell color={result.song.color} arrow={null} colIndex={0}>
        <span className="guess-cell__song">{track.name}</span>
      </Cell>

      <Cell color={result.album.color} arrow={result.album.arrow} colIndex={1}>
        <div className="guess-cell__album">
          {track.album.image && (
            <img className="guess-cell__album-art" src={track.album.image} alt="" />
          )}
          <span className="guess-cell__album-name">{track.album.name}</span>
        </div>
      </Cell>

      <Cell color={result.trackNumber.color} arrow={result.trackNumber.arrow} colIndex={2}>
        <span className="guess-cell__number">{track.trackNumber}</span>
      </Cell>

      <Cell color={result.duration.color} arrow={result.duration.arrow} colIndex={3}>
        <span className="guess-cell__number">{formatDuration(track.duration)}</span>
      </Cell>

      <Cell color={result.features.color} arrow={null} colIndex={4}>
        <span className="guess-cell__features">
          {features.length > 0 ? features.join(", ") : t("noFeatures")}
        </span>
      </Cell>
    </tr>
  );
}

function Cell({ color, arrow, children, colIndex }) {
  const arrowChar = arrowToChar(arrow);

  return (
    <td className={`guess-cell guess-cell--${color}`}>
      <div
        className="guess-cell__inner"
        style={{ animationDelay: `${colIndex * 110}ms` }}
      >
        {children}
        {arrowChar && <span className="guess-cell__arrow">{arrowChar}</span>}
      </div>
    </td>
  );
}
