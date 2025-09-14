import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieInfo from '../components/MovieInfo';
import ReviewsSection from '../components/ReviewsSection';
 import { useAuth } from '../context/AuthContext';

const MovieDetailsPage = () => {
  const { id: movieId } = useParams();
  const { user, token } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 console.log(user)
  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMovie(data.data);
      } else {
        setError(data.message || 'Failed to load movie details');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-xl">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchMovieDetails()}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors border border-black"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-600 mb-4 text-xl">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Movie Not Found</h2>
          <p className="text-gray-600">The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
     
        <MovieInfo movie={movie} />
        
      
        <ReviewsSection movieId={movieId} currentUser={user} />
      </div>
    </div>
  );
};

export default MovieDetailsPage;
        