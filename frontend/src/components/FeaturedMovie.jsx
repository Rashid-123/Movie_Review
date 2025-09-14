
import React from "react";
import StarRating from "./StarRating";

const FeaturedMovie = ({ featuredMovie }) => {
    return (

        <div className="w-full border border-gray-300 mb-12 relative">
            {/* Featured Icon */}
            <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white px-3 py-1 text-sm font-bold flex items-center gap-1 shadow-lg">
                <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                FEATURED
            </div>
            
            <div className="flex flex-col lg:flex-row min-h-[500px]">
                <div className="lg:w-1/3 xl:w-1/3">
                    <img
                        src={featuredMovie.posterUrl}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 p-8">
                    <h2 className="text-2xl font-bold mb-4">{featuredMovie.title}</h2>
                    <div className="mb-4">
                        <p className="text-gray-600">
                            <span className="font-medium">Released:</span> {featuredMovie.releaseYear}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Directed by:</span> {featuredMovie.director}
                        </p>
                    </div>


                    <div className="flex flex-wrap gap-2 mb-4">
                        {featuredMovie.genres?.map((genre, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-500 text-sm font-medium border border-indigo-100  shadow-xs "
                            >
                                {genre}
                            </span>
                        ))}
                    </div>


                    <div className="py-3">
                        <StarRating rating={featuredMovie.averageRating || 0} size="w-5 h-5" />
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        {featuredMovie.description}
                    </p>

                    {/* Cast */}
                    {featuredMovie.cast && featuredMovie.cast.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Cast</h3>
                            <div className="flex flex-wrap gap-4">
                                {featuredMovie.cast.slice(0, 5).map((actor, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <img
                                            src={actor.profileUrl}
                                            alt={actor.name}
                                            className="w-12 h-12 object-cover border border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">{actor.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                    {/* Trailer Link */}
                    {featuredMovie.trailerUrl && (
                        <div className="">
                            <a
                                href={featuredMovie.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 no-underline bg-black text-white hover:bg-gray-800 transition-colors border border-black"
                            >
                                Watch Trailer
                            </a>

                            {/* Rating below trailer */}

                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default FeaturedMovie;