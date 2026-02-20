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

function removeFavorite(imdbID) {
    const favs = getFavorites().filter((id) => id !== imdbID);
    localStorage.setItem("omdb_favorites", JSON.stringify(favs));
    window.dispatchEvent(new Event("favoritesChanged"));
}

export default function FavoritesPage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ids, setIds] = useState([]);

    useEffect(() => {
        const saved = getFavorites();
        setIds(saved);

        if (saved.length === 0) {
            setLoading(false);
            return;
        }

        async function fetchAll() {
            try {
                const results = await Promise.all(
                    saved.map((id) =>
                        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
                            .then((r) => r.json())
                            .then((d) => (d.Response === "True" ? d : null))
                            .catch(() => null)
                    )
                );
                setMovies(results.filter(Boolean));
            } catch {
                setMovies([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, []);

    function handleRemove(imdbID) {
        removeFavorite(imdbID);
        setMovies((prev) => prev.filter((m) => m.imdbID !== imdbID));
        setIds((prev) => prev.filter((id) => id !== imdbID));
    }

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
            <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>
                ❤️ Favorite Movies
            </h1>
            <p style={{ opacity: 0.6, marginBottom: 36 }}>
                {ids.length > 0
                    ? `${ids.length} movie${ids.length !== 1 ? "s" : ""} saved`
                    : "Your favorites list"}
            </p>

            {loading && (
                <p style={{ opacity: 0.6, textAlign: "center", fontSize: 16 }}>
                    Loading your favorites…
                </p>
            )}

            {!loading && movies.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>🎞️</div>
                    <p style={{ fontSize: 18, opacity: 0.7, marginBottom: 24 }}>
                        No favorite movies added.
                    </p>
                    <Link
                        href="/"
                        style={{
                            padding: "12px 28px",
                            borderRadius: 10,
                            background: "var(--accent, #e50914)",
                            color: "#fff",
                            fontWeight: 700,
                            textDecoration: "none",
                            fontSize: 15,
                        }}
                    >
                        Explore Movies
                    </Link>
                </div>
            )}

            {!loading && movies.length > 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 24,
                    }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.imdbID}
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: 12,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                                transition: "transform 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "translateY(-4px)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "translateY(0)")
                            }
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
                            <div
                                style={{
                                    padding: "14px 12px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    flex: 1,
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                                    {movie.Title}
                                </h3>
                                <div style={{ fontSize: 13, opacity: 0.6 }}>
                                    {movie.Year} • {movie.Type}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        marginTop: "auto",
                                        paddingTop: 8,
                                    }}
                                >
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
                                        onClick={() => handleRemove(movie.imdbID)}
                                        title="Remove from Favorites"
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            border: "1px solid rgba(255,100,100,0.4)",
                                            background: "rgba(229,9,20,0.15)",
                                            color: "#ff8888",
                                            cursor: "pointer",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            transition: "background 0.2s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = "rgba(229,9,20,0.4)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "rgba(229,9,20,0.15)")
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
