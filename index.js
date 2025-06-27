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
 ==========.EVENT.HANDLERS. ==========
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
        const filteredMovies = allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            (movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchTerm))) ||
            movie.description.toLowerCase().includes(searchTerm)
        );
        
        if (filteredMovies.length > 0) {
            renderMovies(filteredMovies);
        } else {
            alert('No movies found matching your search');
            renderMovies(allMovies);
        }
    } else {
        renderMovies(allMovies);
    }
}

function toggleDarkMode() {
    const ball = document.querySelector(".toggle-ball");
    const toggleItems = document.querySelectorAll(
        ".container, .movie-list-title, .navbar-container, .sidebar, .left-menu-icon, .toggle, .footer"
    );

    toggleItems.forEach((item) => {
        item.classList.toggle("active");
    });
    ball.classList.toggle("active");
}

function addMovieHoverEffects() {
    document.querySelectorAll('.movie-list-item').forEach(item => {
        // Add event listeners only once
        if (item.dataset.hoverEnabled) return;
        item.dataset.hoverEnabled = true;
        
        const img = item.querySelector('.movie-list-item-img');
        const title = item.querySelector('.movie-list-item-title');
        const desc = item.querySelector('.movie-list-item-desc');
        const btn = item.querySelector('.movie-list-item-button');
        
        item.addEventListener('mouseenter', () => {
            if (img) img.style.transform = 'scale(1.2)';
            if (title) title.style.opacity = '1';
            if (desc) desc.style.opacity = '1';
            if (btn) btn.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            if (img) img.style.transform = 'scale(1)';
            if (title) title.style.opacity = '0';
            if (desc) desc.style.opacity = '0';
            if (btn) btn.style.opacity = '0';
        });
    });
}

function initCarousels() {
    // Initialize carousel states if needed
    if (carouselStates.length === 0) {
        movieLists.forEach((_, i) => {
            carouselStates[i] = {
                position: 0,
                clickCounter: 0
            };
        });
    }

    // Get arrows again to ensure we have current references
    const currentArrows = document.querySelectorAll('.arrow');
    
    currentArrows.forEach((arrow, i) => {
        // Remove existing event listeners
        const newArrow = arrow.cloneNode(true);
        arrow.parentNode.replaceChild(newArrow, arrow);
        
        newArrow.addEventListener("click", () => {
            const list = movieLists[i];
            // Skip if wrapper is hidden or list doesn't exist
            if (!list || list.closest('.movie-list-wrapper')?.classList.contains('hidden')) return;
            
            const items = list.querySelectorAll(".movie-list-item");
            if (items.length <= 4) return;
            
            // Calculate item width including margin
            const itemWidth = items[0].offsetWidth + 30; // 30px margin
            
            // Calculate how many items can be visible
            const visibleItems = Math.floor(list.offsetWidth / itemWidth);
            
            // Calculate max scroll position
            const maxScroll = (items.length - visibleItems) * itemWidth;
            
            if (carouselStates[i].position > -maxScroll) {
                carouselStates[i].position -= itemWidth;
                carouselStates[i].clickCounter++;
                list.style.transform = `translateX(${carouselStates[i].position}px)`;
            } else {
                // Reset to beginning
                carouselStates[i].position = 0;
                carouselStates[i].clickCounter = 0;
                list.style.transform = 'translateX(0)';
            }
        });
    });
}

// ========== INITIALIZATION ==========

