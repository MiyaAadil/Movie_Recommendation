import type { MovieDetail } from "./types";

interface MovieCardProps {
  movie: MovieDetail;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <article className="border rounded-xl overflow-hidden shadow-sm">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={`Poster for ${movie.title}`}
          loading="lazy"
          className="w-full h-72 object-cover hover:scale-104 transition-all duration-400"
        />
      ) : (
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">
          No poster available
        </div>
      )}
      <div className="p-3">
        <h2 className="font-bold text-lg">{movie.title}</h2>
        <p className="text-sm text-gray-500">
          {movie.year > 0 ? movie.year : "Year unknown"} · ⭐ {movie.rating.toFixed(1)}
        </p>
        <p className="text-sm mt-2 line-clamp-3">{movie.synopsis}</p>
      </div>
    </article>
  );
};

export default MovieCard;