export default function AboutPage() {
    return (
        <div
            style={{
                maxWidth: 700,
                margin: "60px auto",
                padding: "0 24px",
                color: "var(--text, #fff)",
            }}
        >
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>
                🎬 About Cinephiles Watch
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.8, opacity: 0.85, marginBottom: 24 }}>
                Cinephiles Watch is a Movie Explorer app built with{" "}
                <strong>Next.js 14</strong> and the free{" "}
                <strong>OMDB API</strong>. It lets you search movies, explore detailed
                information, and save your favorite films — all stored locally in your
                browser.
            </p>

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Features</h2>
            <ul style={{ lineHeight: 2, opacity: 0.85, paddingLeft: 20 }}>
                <li>🔍 Search movies by title</li>
                <li>🎞️ Filter results by type (Movie / Series)</li>
                <li>📄 View detailed movie information</li>
                <li>❤️ Add / remove movies from Favorites</li>
                <li>💾 Favorites persisted in localStorage</li>
                <li>📱 Responsive design</li>
            </ul>

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, marginTop: 32 }}>
                API Used
            </h2>
            <p style={{ opacity: 0.85, lineHeight: 1.8 }}>
                This app uses the{" "}
                <a
                    href="https://www.omdbapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent, #e50914)", textDecoration: "underline" }}
                >
                    OMDB API
                </a>{" "}
                — a free RESTful web service to obtain movie information.
            </p>

            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, marginTop: 32 }}>
                Tech Stack
            </h2>
            <ul style={{ lineHeight: 2, opacity: 0.85, paddingLeft: 20 }}>
                <li>Next.js 14 (App Router)</li>
                <li>React 18 with Hooks (useState, useEffect, useParams)</li>
                <li>OMDB REST API</li>
                <li>localStorage for favorites</li>
                <li>Vanilla CSS for styling</li>
            </ul>
        </div>
    );
}
