import type { VercelRequest, VercelResponse } from "@vercel/node";

interface DetailRequest {
  titles: string[];
}

interface MovieDetail {
  title: string;
  poster: string;
  year: number;
  rating: number;
  synopsis: string;
}

interface DetailSuccess {
  movies: MovieDetail[];
}

interface DetailError {
  error: string;
}

type DetailResponse = DetailSuccess | DetailError;

async function fetchMovie(title: string): Promise<MovieDetail | null> {
  const searchUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
    title
  )}`;

  const response = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) return null;

  return {
    title: result.title || result.name,
    poster: result.poster_path
      ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
      : "",
    year: parseInt((result.release_date || result.first_air_date || "").slice(0, 4)) || 0,
    rating: result.vote_average || 0,
    synopsis: result.overview || "No synopsis available.",
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse<DetailResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { titles } = req.body as DetailRequest;

  if (!titles || titles.length === 0) {
    return res.status(400).json({ error: "Missing titles field" });
  }

  try {
    const results = await Promise.all(titles.map((title) => fetchMovie(title)));
    const movies = results.filter((m): m is MovieDetail => m !== null);

    return res.status(200).json({ movies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch movie details" });
  }
}