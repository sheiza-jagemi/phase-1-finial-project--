// ========== API CONFIGURATION ==========
const API_URL = "https://api.tvmaze.com/shows";
const API_BASE_URL = "http://localhost:3000/movies";

// ========== MOVIE DATA MANAGEMENT ==========
let allMovies = [];
let displayedMovies = [];
let carouselStates = [];

// DOM Elements
const arrow = document.querySelectorAll('.arrow');
const movieLists = document.querySelectorAll('.movie-list');
const movieListWrappers = document.querySelectorAll('.movie-list-wrapper');
const searchInput = document.querySelector('.search-input');
const searchIcon = document.querySelector('.search-icon');

// ========== DATA FETCHING ==========
async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        let data = await response.json();
        
        // Format the data to match our structure
        data = data.map(show => ({
            id: show.id,
            title: show.name,
            year: show.premiered ? new Date(show.premiered).getFullYear() : 'N/A',
            rating: show.rating?.average || 0,
            seasons: 1, // TVMaze doesn't provide season count directly
            description: show.summary?.replace(/<[^>]+>/g, '') || 'No description available',
            image: show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image',
            genre: show.genres || ['Unknown']
        })).slice(0, 20); // Limit to 20 shows
        
        return data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}
