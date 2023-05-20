const API_KEY = '44598aebba3bfab2ae6fd15921bff2d6'
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=1`
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`
const MOVIE_BY_ID = `https://api.themoviedb.org/3/movie/`
const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')
const fallbackImg = '/5ik4ATKmNtmJU6AYD0bLm56BCVM.jpg'
const modalCont = document.getElementById('modal-container')
const closeBtn = document.getElementById('close-btn')
const modal = document.getElementById('modal-overlay')
const modalTitle = document.getElementById('modal-title')
const modalImg = document.getElementById('modal-img')
const modalOverview = document.getElementById('modal-overview')
const popularity = document.getElementById('modal-popularity')
const genresCont = document.getElementById('genres')
const taglineTxt = document.getElementById('tagline')

// Votes
const getClassByVote = (vote) => {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else return 'red'
}

// Truncate text
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
  
    const truncatedText = text.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
  
    if (lastSpaceIndex === -1) {
      return truncatedText;
    }
  
    return truncatedText.slice(0, lastSpaceIndex) + '...';
  };
  

// Show movies
const showMovies = (movies) => {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { id, title, poster_path, vote_average, overview } = movie
        
        let newText = truncateText(overview, 200)

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
        <img src="${IMG_PATH + poster_path}" alt="${title}" onerror="this.src='${IMG_PATH + fallbackImg}'">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByVote(vote_average)}">${vote_average.toFixed(2)}</span>
        </div>
        <div class="overview">
            <h3>overview</h3>
            ${newText}<button class="read-more modal-btn" id="modal-btn">Read more</button>
        </div>
        `
        // Open modal
        const modalBtn = movieEl.querySelector('.modal-btn')
        

        modalBtn.addEventListener('click', async () => {
            modal.classList.add('open-modal')
            const movieID = id
            const movieDetailsURL = `${MOVIE_BY_ID}${movieID}?api_key=${API_KEY}`
            try {
                const res = await fetch(movieDetailsURL)
                const data = await res.json()
                
                const { title, overview, poster_path, genres, tagline } = data

                modalTitle.textContent = `${title}`
                modalImg.src = `${IMG_PATH + poster_path}`
                modalImg.alt = `${title}`
                modalImg.onerror  = function() {
                    this.src = IMG_PATH + fallbackImg;
                  };

                if (overview.length === 0) {
                    modalOverview.innerHTML = "Craft beer dreamcatcher, kale chips activated charcoal trust fund. Vinyl pour-over hella shabby chic migas quinoa slow-carb echo park. Poutine synth polaroid stumptown, ethical banh mi sriracha godard deep v gluten-free. Sustainable hoodie franzen, selvage farm-to-table venmo single-origin coffee biodiesel. Beard skateboard sriracha, messenger bag scenester blog master cleanse. "
                } else {
                    let newText = truncateText(overview, 500)
                    modalOverview.innerHTML = `${newText}`
                }
                const genreEl = genres.map((genre) => {
                    
                    return `
                    <span class='single-genre' key=${genre.id}>${genre.name}</span>
                ` 
            }).join(' ')
            genresCont.innerHTML = `Categories: ${genreEl}`
            
            if (tagline.length === 0) {
                return taglineTxt.innerHTML = `Buckle up for a laughter-filled thrill ride where gravity takes a break and comedic chaos reigns supreme. Prepare to LOL!`
            } else {
                taglineTxt.innerHTML = `"${tagline}.."`
            }
            } catch (error) {
                console.log(error);
            }
        })
        // Append the grids
        main.appendChild(movieEl)
    })
}


// Initial Data
const getMovies = async (url) => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        
        showMovies(data.results)
    } catch (error) {
        console.log(error);
    }
}

getMovies(API_URL)

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_URL + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

// Close Modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('open-modal')
})