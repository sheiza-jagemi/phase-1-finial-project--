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