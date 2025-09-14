
import React from "react";
import StarRating from "./StarRating";

const SingleMovie = ({ movie }) => {
    return (
        <div 
            key={movie._id} 
            className="border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 hover:-translate-y-1 transform transition-transform"
        >
            <div className="aspect-[2/3] overflow-hidden">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{movie.title.substring(0,25)}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genres?.slice(0, 2).map((genre, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs border border-indigo-100"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {movie.description?.length > 100
                        ? `${movie.description.substring(0, 100)}...`
                        : movie.description
                    }
                </p>
                <StarRating rating={movie.averageRating || 0} />
            </div>
        </div>
    )
}

export default SingleMovie;