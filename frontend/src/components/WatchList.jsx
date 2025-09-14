import React, { useState, useEffect } from 'react';
import { Trash2, Clock, Film } from 'lucide-react';
import { useAuth } from '../context/authContext';

const Watchlist = () => {
  const { user, token } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingMovieId, setDeletingMovieId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;

    try {
      setWatchlistLoading(true);
      setWatchlistError('');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user._id}/watchlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWatchlist(data.data || []);
      } else {
        setWatchlistError(data.message || 'Failed to load watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlistError('Failed to load watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleDeleteFromWatchlist = async (movieId) => {
    try {
      setDeletingMovieId(movieId);
      
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the movie from the local state
        setWatchlist(prev => prev.filter(movie => movie._id !== movieId));
        setSuccess('Movie removed from watchlist successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setWatchlistError(data.message || 'Failed to remove movie from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      setWatchlistError('Failed to remove movie from watchlist');
    } finally {
      setDeletingMovieId(null);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-300 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Film className="mr-3" size={24} />
          My Watchlist
        </h2>
        <span className="text-sm text-gray-600">
          {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Watchlist Error */}
      {watchlistError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {watchlistError}
        </div>
      )}

      {/* Watchlist Loading */}
      {watchlistLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading watchlist...</span>
        </div>
      ) : watchlist.length === 0 ? (
        // Empty Watchlist
        <div className="text-center py-12">
          <Film className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No movies in watchlist</h3>
          <p className="text-gray-600">Start adding movies to your watchlist to see them here!</p>
        </div>
      ) : (
        // Watchlist Items
        <div className="space-y-4">
          {watchlist.map((movie) => (
            <div key={movie._id} className="flex items-center p-3 sm:p-4 border border-gray-200 hover:bg-gray-50 transition-colors">
              {/* Movie Poster */}
              <div className="flex-shrink-0 w-16 h-24 mr-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover border border-gray-300"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {movie.releaseYear} • Directed by {movie.director}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={14} className="mr-1" />
                  Added {formatDateTime(movie.addedToWatchlistAt)}
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex-shrink-0 ml-4">
                <button
                  onClick={() => handleDeleteFromWatchlist(movie._id)}
                  disabled={deletingMovieId === movie._id}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingMovieId === movie._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      <span className="text-sm">Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span className="text-sm">Remove</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;