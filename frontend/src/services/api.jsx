// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Generic API request handler
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token'); 
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Movie API
export const movieAPI = {
  // Get movie by ID
  getMovieById: async (movieId) => {
    return apiRequest(`/movies/${movieId}`);
  },

  // Get all movies (with optional filters)
  getMovies: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/movies${queryString ? `?${queryString}` : ''}`);
  },
};

// Review API
export const reviewAPI = {
  // Get reviews for a specific movie
  getMovieReviews: async (movieId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/movies/${movieId}/reviews${queryString ? `?${queryString}` : ''}`);
  },

  // Create a new review for a movie
  createReview: async (movieId, reviewData) => {
    return apiRequest(`/movies/${movieId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Update an existing review
  updateReview: async (reviewId, reviewData) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Get reviews by user
  getUserReviews: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users/${userId}/reviews${queryString ? `?${queryString}` : ''}`);
  },
};


export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    // Handle unauthorized - redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Handle forbidden
    alert('You do not have permission to perform this action.');
  } else if (error.message.includes('404')) {
    // Handle not found
    alert('The requested resource was not found.');
  } else if (error.message.includes('500')) {
    // Handle server error
    alert('Server error. Please try again later.');
  } else {
    // Handle other errors
    alert(error.message || 'An unexpected error occurred.');
  }
};