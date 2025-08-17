import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

// Movie and TV show requests
const requests = {
  // Movies
  fetchTrending: '/trending/all/week',
  fetchNetflixOriginals: '/discover/tv?with_networks=213',
  fetchTopRated: '/movie/top_rated',
  fetchActionMovies: '/discover/movie?with_genres=28',
  fetchComedyMovies: '/discover/movie?with_genres=35',
  fetchHorrorMovies: '/discover/movie?with_genres=27',
  fetchRomanceMovies: '/discover/movie?with_genres=10749',
  fetchDocumentaries: '/discover/movie?with_genres=99',
  fetchThrillerMovies: '/discover/movie?with_genres=53',
  fetchSciFiMovies: '/discover/movie?with_genres=878',
  fetchAnimatedMovies: '/discover/movie?with_genres=16',
  
  // TV Shows
  fetchPopularTVShows: '/tv/popular',
  fetchTopRatedTVShows: '/tv/top_rated',
  fetchDramaTVShows: '/discover/tv?with_genres=18',
  fetchCrimeTVShows: '/discover/tv?with_genres=80',
  fetchFamilyTVShows: '/discover/tv?with_genres=10751',
  
  // Search
  searchMulti: '/search/multi',
  searchMovies: '/search/movie',
  searchTVShows: '/search/tv',
  searchPeople: '/search/person'
};

// Fetch functions
export const fetchMovies = async (endpoint) => {
  try {
    const response = await tmdbApi.get(endpoint);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Failed to fetch movies');
  }
};

export const fetchMovieDetails = async (movieId, mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,recommendations,similar'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const fetchMovieVideos = async (movieId, mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/${movieId}/videos`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw new Error('Failed to fetch movie videos');
  }
};

export const searchContent = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get(requests.searchMulti, {
      params: {
        query,
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw new Error('Failed to search content');
  }
};

export const fetchPersonDetails = async (personId) => {
  try {
    const response = await tmdbApi.get(`/person/${personId}`, {
      params: {
        append_to_response: 'movie_credits,tv_credits'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw new Error('Failed to fetch person details');
  }
};

export const fetchGenres = async (mediaType = 'movie') => {
  try {
    const response = await tmdbApi.get(`/genre/${mediaType}/list`);
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres');
  }
};

export const discoverContent = async (mediaType = 'movie', filters = {}) => {
  try {
    const response = await tmdbApi.get(`/discover/${mediaType}`, {
      params: {
        ...filters,
        sort_by: filters.sort_by || 'popularity.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error discovering content:', error);
    throw new Error('Failed to discover content');
  }
};

// Helper functions
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-image.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatReleaseDate = (date) => {
  if (!date) return 'Unknown';
  return new Date(date).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const getTrailerUrl = (videos) => {
  if (!videos || videos.length === 0) return null;
  
  // Look for official trailer first
  const trailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube' && 
    video.official === true
  );
  
  // Fallback to any trailer
  const anyTrailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube'
  );
  
  return trailer?.key || anyTrailer?.key || null;
};

export default requests;
