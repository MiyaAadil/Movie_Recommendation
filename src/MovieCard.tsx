import type { MovieDetail } from "./types";
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: MovieDetail;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <article className="bg-[#1F1F1F] rounded-xl overflow-hidden hover:shadow-sm shadow-teal-300 transition-all duration-300">
      <div className="relative aspect-[2/2.8]">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`Poster for ${movie.title}`}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-104 transition-all duration-400"
          />
        ) : (
          <div className="w-full h-50 bg-gray-200 flex items-center justify-center text-gray-500">
            No poster available
          </div>
        )}
      </div>
      <div className="p-3">
        <h2 className="font-bold text-lg text-center">{movie.title}</h2>
        <p className="text-sm text-gray-400 flex flex-col">
          {movie.year > 0 ? movie.year : "Year unknown"}
          <div className="flex gap-1 mt-2">
            <Star className="text-yellow-400 fill-yellow-400" size={15} />
          {movie.rating.toFixed(1)}
          </div>
        </p>
        <p className="text-xs mt-2 line-clamp-2">{movie.synopsis}</p>
      </div>
    </article>
  );
};

export default MovieCard;