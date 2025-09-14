

import React, { useState, useEffect } from 'react';
import SingleMovie from "../components/SingleMovie"
import FeaturedMovie from '@components/FeaturedMovie';
import { Link } from 'react-router-dom';
const MovieHomepage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/featured?limit=13`);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
      } else {
        setError('Failed to fetch movies');
      }
    } catch (err) {
      setError('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const featuredMovie = movies[0];
  const gridMovies = movies.slice(1, 13);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
       

        {/* Featured Movie - Full Width */}
        {featuredMovie && (
          <Link  to= {`/movie/${featuredMovie._id}`} className='no-underline' ><FeaturedMovie featuredMovie={featuredMovie} /></Link>
          
        )}

        
        {gridMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gridMovies.map((movie) => (
              <Link to={`/movie/${movie._id}`} className='no-underline'> <SingleMovie movie={movie} /> </Link>
          
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieHomepage;