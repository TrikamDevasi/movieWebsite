"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("omdb_favorites") || "[]");
  } catch {
    return [];
  }
}

function addFavorite(imdbID) {
  const favs = getFavorites();
  if (!favs.includes(imdbID)) {
    const updated = [...favs, imdbID];
    localStorage.setItem("omdb_favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesChanged"));
    return true;
  }
  return false;
}

function isFavorite(imdbID) {
  return getFavorites().includes(imdbID);
}

function MovieCard({ movie, onFavChange }) {
  const [fav, setFav] = useState(() => isFavorite(movie.imdbID));

  function handleAddFav() {
    const added = addFavorite(movie.imdbID);
    if (added) setFav(true);
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
      }}
    >
      <img
        src={
          movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster"
        }
        alt={movie.Title}
        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }}
      />
      <div style={{ padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
          {movie.Title}
        </h3>
        <div style={{ fontSize: 13, opacity: 0.6 }}>{movie.Year} • {movie.Type}</div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 8 }}>
          <Link
            href={`/movie/${movie.imdbID}`}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 10px",
              borderRadius: 8,
              background: "var(--accent, #e50914)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            View Details
          </Link>
          <button
            onClick={handleAddFav}
            title={fav ? "Already in Favorites" : "Add to Favorites"}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: fav ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.08)",
              color: fav ? "#ff6b6b" : "#fff",
              cursor: fav ? "default" : "pointer",
              fontSize: 16,
              transition: "background 0.2s",
            }}
          >
            {fav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("batman");
  const [inputVal, setInputVal] = useState("batman");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!query.trim()) return;

    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (data.Response === "True") {
          setMovies(data.Search || []);
        } else {
          setMovies([]);
          setError(data.Error || "No results found.");
        }
      } catch {
        setError("Failed to fetch movies. Please try again.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query]);

  function handleSearch() {
    const trimmed = inputVal.trim();
    if (trimmed) setQuery(trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  const filtered =
    typeFilter === "all"
      ? movies
      : movies.filter((m) => m.Type === typeFilter);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          🎬 Movie Explorer
        </h1>
        <p style={{ opacity: 0.6, margin: 0 }}>
          Discover and save your favorite movies
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          maxWidth: 600,
          margin: "0 auto 24px",
        }}
      >
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a movie..."
          style={{
            flex: 1,
            padding: "12px 18px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "inherit",
            fontSize: 15,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            background: "var(--accent, #e50914)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Search
        </button>
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginBottom: 32,
        }}
      >
        {["all", "movie", "series"].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            style={{
              padding: "7px 20px",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.25)",
              background:
                typeFilter === type
                  ? "var(--accent, #e50914)"
                  : "rgba(255,255,255,0.07)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: typeFilter === type ? 700 : 400,
              fontSize: 14,
              transition: "background 0.2s",
              textTransform: "capitalize",
            }}
          >
            {type === "all" ? "All" : type === "movie" ? "Movies" : "Series"}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p style={{ textAlign: "center", opacity: 0.6, fontSize: 16 }}>
          Loading…
        </p>
      )}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "#ff6b6b" }}>{error}</p>
      )}
      {!loading && !error && filtered.length === 0 && movies.length > 0 && (
        <p style={{ textAlign: "center", opacity: 0.6 }}>
          No {typeFilter} results for &quot;{query}&quot;.
        </p>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
