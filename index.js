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
// ========== RENDER FUNCTIONS ==========
function renderMovies(movies) {
    // Hide all wrappers initially
    movieListWrappers.forEach(wrapper => wrapper.classList.add('hidden'));
    
    // Calculate how many carousels we need
    const carouselsNeeded = Math.ceil(movies.length / 5);
    
    for (let i = 0; i < carouselsNeeded; i++) {
        const wrapper = movieListWrappers[i];
        const list = wrapper.querySelector('.movie-list');
        
        // Clear the list
        list.innerHTML = '';
        
        // Add new movies
        const startIdx = i * 5;
        const endIdx = startIdx + 5;
        const moviesToAdd = movies.slice(startIdx, endIdx);
        
        // Show this wrapper
        wrapper.classList.remove('hidden');
        
        moviesToAdd.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-list-item';
            movieItem.innerHTML = `
                <img class="movie-list-item-img" src="${movie.image}" alt="${movie.title}">
                <span class="movie-list-item-title">${movie.title}</span>
                <p class="movie-list-item-desc">${movie.description.substring(0, 100)}...</p>
                <button class="movie-list-item-button">WATCH</button>
            `;
            list.appendChild(movieItem);
        });
        
        // Reset carousel state
        if (carouselStates[i]) {
            carouselStates[i].position = 0;
            carouselStates[i].clickCounter = 0;
        }
        list.style.transform = 'translateX(0)';
    }
    
    displayedMovies = movies;
    addMovieHoverEffects();
    initCarousels();
}

