import React, { useState, useEffect } from 'react';
import SingleMovie from '../components/SingleMovie';
import { Link } from 'react-router-dom';
const MovieListing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    genre: '',
    year: '',
    minRating: '',
    maxRating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  
  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 
    'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
  ];

  // Year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/movies?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
        setPagination(data.pagination);
        setError(null);
      } else {
        setError('Failed to fetch movies');
      }
    } catch (err) {
      setError('Error fetching movies');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      genre: '',
      year: '',
      minRating: '',
      maxRating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
       

        {/* Filters Section */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
         
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="">All Genres</option>
                {genreOptions.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

       
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="releaseYear-desc">Release Year (New)</option>
                <option value="releaseYear-asc">Release Year (Old)</option>
                <option value="averageRating-desc">Rating (High)</option>
                <option value="averageRating-asc">Rating (Low)</option>
              </select>
            </div>

            
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  placeholder="Min"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-500"
                />
                <input
                  type="number"
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                  placeholder="Max"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>

     
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm border border-gray-200 hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

      
        {pagination.totalItems > 0 && (
          <div className="mb-6 text-gray-600 text-sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} movies
          </div>
        )}

       
        {error && (
          <div className="text-center py-8">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        )}

      
        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 mb-4">No movies found</div>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Movies Grid */}
        {movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {movies.map((movie) => (
                <Link to={`/movie/${movie._id}`} className="no-underline"><SingleMovie key={movie._id} movie={movie} /> </Link>
              
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className={`px-3 py-2 border border-gray-300 text-sm ${
                pagination.hasPrev 
                  ? 'bg-white text-gray-700 hover:bg-gray-50' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </button>

      
            {[...Array(pagination.totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isCurrentPage = pageNum === pagination.page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border border-gray-300 text-sm ${
                    isCurrentPage
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className={`px-3 py-2 border border-gray-300 text-sm ${
                pagination.hasNext 
                  ? 'bg-white text-gray-700 hover:bg-gray-50' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListing;