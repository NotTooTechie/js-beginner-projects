const moviesUrl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
let movieList;
let currentPage = 1;
let maxPages;

window.onload = async () => {
    movieList = document.getElementById ("movieList");
    let movies = await fetchMovies (currentPage);
    maxPages = movies.total_pages;
    displayMovies (movies);
}

window.addEventListener('scroll', async () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && currentPage <= maxPages) {
            console.log ("Bottom of the page. Scrolling");
            currentPage++;
            let movies = await fetchMovies (currentPage);
            displayMovies (movies);
    }
}, {
    passive: true
});

async function fetchMovies (page) {
    let currentPage = page ? page : 1;
    console.log ("fetchMovies. Page " + page);
    let movieRespnonse = await fetch (moviesUrl + currentPage);
    let movies = await movieRespnonse.json ();
    return movies;
}

function displayMovies (movies) {
    console.log (movies.results);
    movies.results.forEach(movie => {
       addMovie (movie); 
    });
}

function addMovie (movie) {
    let card = addNewElement ("div","card m-3 shadow-sm ",movieList);
    card.style = "width: 300px";
    let image = addNewElement ("img","card-img-top",card)
    image.src = imageBaseUrl + movie.backdrop_path;
    let cardBody = addNewElement ("div","card-body",card);
    let cardTitle = addNewElement ("h4","card-title",cardBody,movie.original_title);
    let cardTest = addNewElement ("p","card-text",cardBody,movie.overview);
}


function addNewElement (type,className, parent, innerText) {
    element = document.createElement (type);
    element.className = className;
    if (innerText) {
        element.innerText = innerText;    
    }

    if (parent) {
        parent.appendChild (element);
    }
    
    return element;
}