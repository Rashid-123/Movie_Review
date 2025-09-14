
import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';

const MovieInfo = ({ movie }) => {
    const { user, token } = useAuth();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [checkingWatchlist, setCheckingWatchlist] = useState(false);

    useEffect(() => {
        if (user && movie?._id) {
            checkWatchlistStatus();
        }
    }, [user, movie]);

    const checkWatchlistStatus = async () => {
        if (!user || !movie?._id) return;

        try {
            setCheckingWatchlist(true);
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/${user._id}/watchlist/${movie._id}/status`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setIsInWatchlist(data.data.isInWatchlist);
            }
        } catch (error) {
            console.error('Error checking watchlist status:', error);
        } finally {
            setCheckingWatchlist(false);
        }
    };

    const handleWatchlistToggle = async () => {
        if (!user) {
            alert('Please log in to manage your watchlist');
            return;
        }

        try {
            setWatchlistLoading(true);

            const url = isInWatchlist
                ? `http://localhost:5000/api/users/${user._id}/watchlist/${movie._id}`
                : `http://localhost:5000/api/users/${user._id}/watchlist`;

            const options = {
                method: isInWatchlist ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (!isInWatchlist) {
                options.body = JSON.stringify({ movieId: movie._id });
            }

            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok && data.success) {
                setIsInWatchlist(!isInWatchlist);
                // Show success message
                const action = isInWatchlist ? 'removed from' : 'added to';
                alert(`Movie ${action} watchlist successfully!`);
            } else {
                alert(data.message || 'Failed to update watchlist');
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
            alert('Failed to update watchlist');
        } finally {
            setWatchlistLoading(false);
        }
    };

    if (!movie) return null;

    return (
        <div className="w-full border border-gray-300 mb-8">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
                <div className="lg:w-1/3 xl:w-1/3">
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1  p-5 sm:p-8">
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

                    {/* Release Year and Director */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            <span className="font-medium">Released:</span> {movie.releaseYear}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Directed by:</span> {movie.director}
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres?.map((genre, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-500 text-sm font-medium border border-indigo-100 shadow-xs"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <StarRating rating={movie.averageRating || 0} size="w-6 h-6" />
                            <span className="text-gray-600">
                                ({movie.totalReviews || 0} review{movie.totalReviews !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        {movie.description}
                    </p>

                    {/* Cast */}
                    {movie.cast && movie.cast.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Cast</h3>
                            <div className="flex flex-wrap gap-4">
                                {movie.cast.slice(0, 6).map((actor, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        {actor.profileUrl ? (
                                            <img
                                                src={actor.profileUrl}
                                                alt={actor.name}
                                                className="w-12 h-12 object-cover border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600 text-xs">
                                                    {actor.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-700">{actor.name}</span>
                                    </div>
                                ))}
                                {movie.cast.length > 6 && (
                                    <span className="text-sm text-gray-500 self-center">
                                        +{movie.cast.length - 6} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">

                        {/* Trailer Link */}
                        {movie.trailerUrl && (
                            <a
                                href={movie.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 no-underline bg-black text-white hover:bg-gray-800 transition-colors border border-black"
                            >
                                Watch Trailer
                            </a>
                        )}

                     

                        {user && (
                            <button
                                onClick={handleWatchlistToggle}
                                disabled={watchlistLoading || checkingWatchlist}
                                className={`inline-flex items-center gap-2 px-4 py-2 no-underline transition-colors border-2 ${isInWatchlist
                                    ? 'bg-red-50 text-red-500 hover:bg-red-100 border-red-400'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                    } ${(watchlistLoading || checkingWatchlist) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <div className={`w-5 h-5 border-2 flex items-center justify-center ${isInWatchlist
                                    ? 'border-red-500 bg-red-400'
                                    : 'border-gray-400 bg-white'
                                    }`}>
                                    {isInWatchlist ? (
                                        <span className="text-white text-sm font-bold">✓</span>
                                    ) : (
                                        <span className="text-transparent">✓</span>
                                    )}
                                </div>
                                <span className="font-medium">
                                    {watchlistLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            {isInWatchlist ? 'Removing...' : 'Adding...'}
                                        </span>
                                    ) : checkingWatchlist ? (
                                        'Checking...'
                                    ) : (
                                        'Watchlist'
                                    )}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInfo;