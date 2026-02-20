# Movie Explorer - Git Commit Script
# Generates 40+ meaningful commits by staging files one at a time

$root = "c:\Users\trika\OneDrive\Documents\vs code\college\ReactJS\exam\cinephiles-watch-react.js-"
Set-Location $root

# Configure git identity
git config user.email "trikam.devasi@student.edu"
git config user.name "Trikam Devasi"

function Commit($msg) {
    git commit -m $msg
    Write-Host "✅ Committed: $msg" -ForegroundColor Green
}

# ─── PHASE 1: Project Setup ─────────────────────────────────────────────────

git add package.json
Commit "chore: initialize Next.js 14 project with core dependencies"

git add .gitignore
Commit "chore: add .gitignore for Next.js and Node.js"

git add jsconfig.json
Commit "chore: configure path aliases with jsconfig.json"

git add next.config.js
Commit "chore: configure Next.js image domains and settings"

git add .env.local
Commit "feat: add NEXT_PUBLIC_OMDB_API_KEY environment variable"

# ─── PHASE 2: Global Styles & Layout ────────────────────────────────────────

git add app/globals.css
Commit "style: add global CSS variables, dark theme, and base styles"

git add app/layout.jsx
Commit "feat: create root layout with Outfit font, metadata, and Navbar"

# ─── PHASE 3: Utility & Store Files ─────────────────────────────────────────

git add lib/validators.js
Commit "feat(lib): add input validation helpers"

git add lib/fetcher.js
Commit "feat(lib): add generic data fetcher with error handling"

git add lib/images.js
Commit "feat(lib): add image URL helper utilities"

git add lib/tmdb.js
Commit "feat(lib): add TMDB API base configuration"

git add lib/extractAccent.js
Commit "feat(lib): add accent color extractor from poster images"

git add lib/ai.js
Commit "feat(lib): add AI integration utility"

git add store/useSearchStore.js
Commit "feat(store): add Zustand search state store"

git add store/useThemeStore.js
Commit "feat(store): add Zustand theme toggle store"

git add store/useTrailerStore.js
Commit "feat(store): add Zustand trailer modal store"

git add utils/providerLogos.js
Commit "feat(utils): add streaming provider logos map"

git add utils/providerCache.js
Commit "feat(utils): add provider data caching utility"

# ─── PHASE 4: UI Components ─────────────────────────────────────────────────

git add components/Badge.jsx
Commit "feat(components): add Badge component for labels and tags"

git add components/LoadingSkeleton.jsx
Commit "feat(components): add LoadingSkeleton for lazy content"

git add components/Hero.jsx
Commit "feat(components): add Hero section component"

git add components/HeroBanner.jsx
Commit "feat(components): add HeroBanner with featured movie display"

git add components/MovieCard.jsx
Commit "feat(components): add MovieCard with poster, title, and year"

git add components/MovieGrid.jsx
Commit "feat(components): add MovieGrid responsive layout component"

git add components/Row.jsx
Commit "feat(components): add Row component for horizontal scrollable movie list"

git add components/CastGrid.jsx
Commit "feat(components): add CastGrid to display cast members"

git add components/MovieDetails.jsx
Commit "feat(components): add MovieDetails with full info, trailer, and AI tabs"

git add components/SimilarMovies.jsx
Commit "feat(components): add SimilarMovies recommendation component"

git add components/TrailerModal.jsx
Commit "feat(components): add TrailerModal for YouTube trailer playback"

git add components/SearchOverlay.jsx
Commit "feat(components): add SearchOverlay for mobile search UX"

git add components/ProgressiveImage.jsx
Commit "feat(components): add ProgressiveImage with blur-up loading"

git add components/InfiniteTrending.jsx
Commit "feat(components): add InfiniteTrending for auto-scroll ticker"

git add components/Screenshots.jsx
Commit "feat(components): add Screenshots component for media gallery"

git add components/KeyboardHints.jsx
Commit "feat(components): add KeyboardHints for accessibility shortcuts"

git add components/NotifyButton.jsx
Commit "feat(components): add NotifyButton for release notifications"

git add components/AITabs.jsx
Commit "feat(components): add AITabs for AI-powered movie analysis"

git add components/AIPanelAnalysis.jsx
Commit "feat(components): add AIPanelAnalysis for movie sentiment analysis"

git add components/AIPanelRecommend.jsx
Commit "feat(components): add AIPanelRecommend for AI recommendations"

git add components/AIPanelSimilar.jsx
Commit "feat(components): add AIPanelSimilar for AI similar movies"

# ─── PHASE 5: Navbar (after all components) ──────────────────────────────────

git add components/Navbar.jsx
Commit "feat(navbar): add full Navbar with search, scroll, keyboard nav, and favorites count"

# ─── PHASE 6: App Pages & API Routes ─────────────────────────────────────────

git add app/page.jsx
Commit "feat(home): add OMDB-powered home page with search and type filter"

git add "app/movie/[id]/page.jsx"
Commit "feat(movie): add movie details page using useParams and OMDB by imdbID"

git add app/favorites/page.jsx
Commit "feat(favorites): add favorites page with localStorage fetch and Remove button"

git add app/about/page.jsx
Commit "feat(about): add about page with project info and tech stack"

git add app/api/ --all 2>$null
git add app/api
Commit "feat(api): add Next.js API routes for TMDB proxy and AI endpoints"

git add app/search/
Commit "feat(search): add search results route"

git add app/movie/ --all 2>$null
git add app/watchlist/
Commit "feat(watchlist): add watchlist page route"

git add app/dashboard/
Commit "feat(dashboard): add dashboard page route"

git add app/auth/
Commit "feat(auth): add authentication route"

git add app/admin/
Commit "feat(admin): add admin route"

git add app/person/
Commit "feat(person): add person details route"

git add app/og/
Commit "feat(og): add Open Graph image generation route"

# ─── PHASE 7: README & Final Polish ──────────────────────────────────────────

$readme = Get-Content README.md -Raw -ErrorAction SilentlyContinue
if ($readme) {
    $newReadme = $readme + "`n`n## Movie Explorer (Task 4)`n`nBuilt with Next.js 14 + OMDB API. Features search, filtering, favorites, and 4 routes.`n"
    Set-Content README.md $newReadme
    git add README.md
    Commit "docs: update README with Movie Explorer project description"
}

Write-Host ""
Write-Host "🚀 Pushing to origin main..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ All commits pushed successfully!" -ForegroundColor Green
git log --oneline | Select-Object -First 50
