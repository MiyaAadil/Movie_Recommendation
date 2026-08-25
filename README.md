# Movie Mood

An AI-powered movie/TV recommendation app that takes a free-text mood or craving — "something like Inception but shorter," "feel-good comfort show for a rainy day" — and returns real, accurate recommendations with posters, ratings, and synopses.

**Live demo:** [https://moviemood-rec.vercel.app/]

## Why this project

Most "AI recommendation" demos are a thin wrapper around a single LLM call, which means they're prone to hallucinated titles, made-up ratings, and outdated posters. This project deliberately splits the problem in two: use an LLM for what it's actually good at (interpreting vague, subjective intent), and use a real movie database for what it's actually good at (accurate facts). Neither piece is trusted to do the other's job.

## Features

- Free-text mood/craving input instead of rigid genre filters
- LLM-interpreted recommendations, returned as structured, validated data — not prose
- Real poster, rating, year, and synopsis data pulled from TMDB, so results are never hallucinated
- Fully responsive, dark cinema-themed UI with lazy-loaded images
- Accessible markup (semantic `<article>` elements, descriptive alt text on every poster)

## Tech stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini API, with structured JSON output (`responseSchema`) enforced server-side
- **Movie data:** TMDB API
- **Deployment:** Vercel

## Architecture decisions worth knowing

**Why two API calls instead of one.** The user's request first goes to Gemini, which returns a strict array of movie titles (not prose — the request explicitly constrains the response shape via `responseSchema`, so there's no unreliable prompt-and-hope JSON parsing). Those titles are then used to query TMDB directly for the actual poster, rating, synopsis, and release year. This means the final data shown to the user is always real and current, even though the initial matching came from an LLM that could in principle hallucinate details.

**Why the API keys live in serverless functions, not the frontend.** Both the Gemini and TMDB keys are used server-side only, inside Vercel serverless functions (`/api/recommend`, `/api/movie-details`). The browser never sees either key. This is a deliberate architectural boundary, not an afterthought — any key shipped in frontend JavaScript is visible to anyone who opens dev tools.

**Why titles are fetched from TMDB in parallel, not sequentially.** The six (or so) TMDB lookups triggered by Gemini's suggestions are independent of each other, so they're run concurrently with `Promise.all()` rather than awaited one at a time — cutting total response time roughly to the duration of the single slowest request instead of the sum of all of them.

**Graceful handling of missing data.** Not every title Gemini suggests will have a poster or full metadata in TMDB. Missing posters render a fallback state instead of a broken image, and results with no match at all are filtered out before reaching the UI, rather than surfacing empty or malformed cards.

## Data flow

```
User types a mood
      ↓
POST /api/recommend  →  Gemini (structured JSON: string[] of titles)
      ↓
POST /api/movie-details  →  TMDB search, run in parallel per title
      ↓
Real movie data rendered as cards
```

## Running locally

```bash
git clone [https://github.com/MiyaAadil/Movie_Recommendation]
cd movie-recs
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key
TMDB_API_KEY=your_tmdb_read_access_token
```

Run with the Vercel CLI (required for the `/api` serverless functions to work locally):

```bash
npm install -g vercel
vercel dev
```

## What I'd add next

- Cache TMDB results for repeated titles to reduce redundant API calls
- Let users save favorites/watchlist (would reuse the `useContext` pattern from earlier projects)
- Filter results by streaming availability