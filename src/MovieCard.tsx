import type { MovieDetail } from "./types";
import { Star } from 'lucide-react';

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
        <p className="text-sm text-gray-800 flex flex-col">
          {movie.year > 0 ? movie.year : "Year unknown"}
          <div className="flex gap-2 mt-2">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
          {movie.rating.toFixed(1)}
          </div>
        </p>
        <p className="text-sm mt-2 line-clamp-3">{movie.synopsis}</p>
      </div>
    </article>
  );
};

export default MovieCard;