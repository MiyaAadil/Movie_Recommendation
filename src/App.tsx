import { useState } from "react";
import type { MovieDetail, AppStatus } from "./types";
import MovieCard from "./MovieCard";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Step 1: get title suggestions from Gemini
      const recommendRes = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      const recommendData = await recommendRes.json();

      if (!recommendRes.ok || "error" in recommendData) {
        throw new Error(recommendData.error || "Failed to get recommendations");
      }

      // Step 2: get real movie data from TMDB
      const detailsRes = await fetch("/api/movie-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titles: recommendData.titles }),
      });
      const detailsData = await detailsRes.json();

      if (!detailsRes.ok || "error" in detailsData) {
        throw new Error(detailsData.error || "Failed to fetch movie details");
      }

      setMovies(detailsData.movies);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Movie Mood</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you're in the mood for..."
          className="flex-1 border-2 p-3 rounded-xl"
        />
        <button
          onClick={handleSearch}
          disabled={status === "loading"}
          className="bg-red-600 text-white px-6 rounded-xl disabled:opacity-50 cursor-pointer hover:bg-red-500 transition-colors duration-200 active:scale-95"
        >
          {status === "loading" ? "Searching..." : "Search"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-center mb-6">{errorMessage}</p>
      )}

      {status === "success" && movies.length === 0 && (
        <p className="text-center text-gray-500">No matches found — try a different mood.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.title} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default App;