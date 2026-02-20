"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("omdb_favorites") || "[]");
  } catch {
    return [];
  }
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await res.json();
        if (data.Response === "True") {
          setMovie(data);
          setIsFav(getFavorites().includes(data.imdbID));
        } else {
          setError(data.Error || "Movie not found.");
        }
      } catch {
        setError("Failed to fetch movie details.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  function handleAddFavorite() {
    if (!movie) return;
    const favs = getFavorites();
    if (!favs.includes(movie.imdbID)) {
      const updated = [...favs, movie.imdbID];
      localStorage.setItem("omdb_favorites", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritesChanged"));
      setIsFav(true);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", opacity: 0.6, fontSize: 18 }}>
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <p style={{ color: "#ff6b6b", marginBottom: 20 }}>{error}</p>
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            background: "var(--accent, #e50914)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!movie) return null;

  const ratingIMDB = movie.Ratings?.find((r) => r.Source === "Internet Movie Database");

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "40px auto",
        padding: "0 24px 80px",
        color: "var(--text, #fff)",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: 28,
          padding: "8px 18px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.07)",
          color: "#fff",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Poster */}
        <img
          src={
            movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster"
          }
          alt={movie.Title}
          style={{
            width: 280,
            borderRadius: 14,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            flexShrink: 0,
          }}
        />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
            {movie.Title}
          </h1>

          {/* Meta badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {[
              movie.Year,
              movie.Genre,
              movie.Rated,
              movie.Runtime,
            ]
              .filter(Boolean)
              .filter((v) => v !== "N/A")
              .map((val) => (
                <span
                  key={val}
                  style={{
                    padding: "4px 14px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.1)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {val}
                </span>
              ))}
          </div>

          {/* Rating */}
          {ratingIMDB && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                background: "rgba(255, 200, 0, 0.12)",
                border: "1px solid rgba(255, 200, 0, 0.3)",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 22 }}>⭐</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#ffd700" }}>
                {ratingIMDB.Value}
              </span>
              <span style={{ fontSize: 13, opacity: 0.6 }}>IMDb</span>
            </div>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== "N/A" && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Plot</h2>
              <p style={{ lineHeight: 1.8, opacity: 0.85, margin: 0 }}>{movie.Plot}</p>
            </div>
          )}

          {/* Details grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 24px",
              marginBottom: 28,
            }}
          >
            {[
              ["Director", movie.Director],
              ["Actors", movie.Actors],
              ["Language", movie.Language],
              ["Country", movie.Country],
              ["Awards", movie.Awards],
              ["Box Office", movie.BoxOffice],
            ]
              .filter(([, v]) => v && v !== "N/A")
              .map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>{value}</div>
                </div>
              ))}
          </div>

          {/* Add to Favorites */}
          <button
            onClick={handleAddFavorite}
            disabled={isFav}
            style={{
              padding: "13px 30px",
              borderRadius: 10,
              border: "none",
              background: isFav
                ? "rgba(229,9,20,0.3)"
                : "var(--accent, #e50914)",
              color: isFav ? "#ff8888" : "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: isFav ? "default" : "pointer",
              transition: "background 0.2s, transform 0.1s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isFav ? "❤️ Added to Favorites" : "🤍 Add to Favorites"}
          </button>

          {justAdded && (
            <p style={{ color: "#4caf50", marginTop: 10, fontSize: 14 }}>
              ✓ Added to your favorites!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
