import { useState, useCallback } from "react";
import { cleanCatalog } from "../utils/cleanCatalog";

const BASE_URL = "https://api.spotify.com/v1";

function isValidTrack(track) {
  if (!track.id) return false;
  if (!track.name || track.name.trim() === "") return false;
  if (!track.duration_ms || track.duration_ms === 0) return false;
  if (!track.artists || track.artists.length === 0) return false;
  if (!track.artists[0].name || track.artists[0].name.trim() === "") return false;
  if (track.is_local === true) return false;
  return true;
}

export function useSpotify() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = useCallback(async () => {
    if (token) return token;
    const res = await fetch("/.netlify/functions/spotify-token");
    const data = await res.json();
    setToken(data.access_token);
    return data.access_token;
  }, [token]);

  const searchArtists = useCallback(async (query) => {
    if (!query) return [];
    setLoading(true);
    try {
      const t = await getToken();
      const res = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      const data = await res.json();
      return data.artists.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url ?? null,
        followers: artist.followers.total,
      }));
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Carga artistas ordenados por popularity (0-100), que es el proxy más cercano
  // a monthly listeners disponible en la API pública de Spotify.
  // Usa queries amplias y neutras para obtener un pool grande sin sesgo de género.
  const loadFeaturedArtists = useCallback(async (limit = 12) => {
    try {
      const t = await getToken();

      const queries = ["a", "e", "i", "the", "young", "lil"];

      const requests = queries.map((q) =>
        fetch(
          `${BASE_URL}/search?q=${encodeURIComponent(q)}&type=artist&limit=50`,
          { headers: { Authorization: `Bearer ${t}` } }
        ).then((r) => r.json())
      );

      const results = await Promise.all(requests);

      const allArtists = results.flatMap((data) =>
        (data.artists?.items ?? []).map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[1]?.url ?? artist.images?.[0]?.url ?? null,
          followers: artist.followers?.total ?? 0,
          popularity: artist.popularity ?? 0,
        }))
      );

      // Deduplicar por ID
      const seen = new Set();
      const unique = allArtists.filter((a) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });

      // Ordenar por popularity desc — calculado por Spotify según streams recientes,
      // que es la misma señal que impulsa el ranking de monthly listeners
      unique.sort((a, b) => b.popularity - a.popularity);

      return unique.slice(0, limit);
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, [getToken]);

  const loadAllTracks = useCallback(async (artistId) => {
    setLoading(true);
    try {
      const t = await getToken();

      let albums = [];
      let url = `${BASE_URL}/artists/${artistId}/albums?include_groups=album&limit=50&market=US`;

      while (url) {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json();
        albums = [...albums, ...data.items];
        url = data.next;
      }

      albums.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

      const uniqueAlbums = albums.filter(
        (album, index, self) =>
          index === self.findIndex((a) => a.name === album.name)
      );

      const allTracks = [];

      for (const album of uniqueAlbums) {
        const res = await fetch(
          `${BASE_URL}/albums/${album.id}/tracks?limit=50`,
          { headers: { Authorization: `Bearer ${t}` } }
        );
        const data = await res.json();

        data.items.forEach((track) => {
          if (!isValidTrack(track)) return;

          allTracks.push({
            id: track.id,
            name: track.name,
            trackNumber: track.track_number,
            duration: track.duration_ms,
            explicit: track.explicit,
            artists: track.artists.map((a) => a.name),
            album: {
              id: album.id,
              name: album.name,
              type: album.album_type,
              image: album.images?.[1]?.url ?? album.images?.[0]?.url ?? null,
              releaseDate: album.release_date,
              releaseYear: album.release_date?.split("-")[0],
            },
          });
        });
      }

      return cleanCatalog(allTracks);

    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  return { searchArtists, loadFeaturedArtists, loadAllTracks, loading, error };
}
