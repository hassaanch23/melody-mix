document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('currentUsername');
    const navButtons = document.querySelectorAll('.nav-item');
    const container = document.querySelector('.container');
    
    let favoriteSongs = JSON.parse(localStorage.getItem('favoriteSongs')) || []; // Get favorite songs from localStorage

    if (username) {
        const userNameElement = document.getElementById('user-name-placeholder');
        userNameElement.textContent = username;
    }

    // Add click event listeners to navigation buttons
    document.querySelectorAll('.nav-item').forEach((button) => {
        button.addEventListener('click', function () {
            const targetPage = this.getAttribute('data-target');
            loadPageContent(targetPage);
        });
    });
  
    // Function to load and display the content of a page
    function loadPageContent(pageName) {
        if (pageName === 'home') {
            window.location.href = 'homepage.html';
        } else if (pageName === 'playlist') {
            window.location.href = 'playlistpage.html';
        } else if (pageName === 'settings') {
            window.location.href = 'settingspage.html';
        }
    }

    // Function to create a favorite card for a song
    function createFavoriteCard(song) {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');
    
        // Create and set thumbnail image
        const thumbnail = document.createElement('img');
        thumbnail.src = song.thumbnail;
        thumbnail.alt = 'Song Thumbnail';
    
        // Create and set song details
        const songDetails = document.createElement('div');
        songDetails.classList.add('song-details');
        songDetails.innerHTML = `
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;
    
        // Create a heart icon
        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = '&#x2764;'; // Unicode for a red heart symbol
        heartIcon.style.color = favoriteSongs.some(favSong => favSong.title === song.title) ? 'red' : 'gray'; // Check if song is in favorites
    
        // Add a click event listener to the heart icon
        heartIcon.addEventListener('click', () => {
            if (favoriteSongs.some(favSong => favSong.title === song.title)) {
                // If the song is already a favorite, remove it
                favoriteSongs = favoriteSongs.filter(favSong => favSong.title !== song.title);
                heartIcon.style.color = 'gray'; // Change icon color back to gray
            } else {
                // Otherwise, add it to favorites
                favoriteSongs.push(song);
                heartIcon.style.color = 'red'; // Change icon color to red
            }
            // Save the updated favorite songs to localStorage
            localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
        });
    
        // Add a click event listener to the song card to navigate to the song-playing page
        favoriteCard.addEventListener('click', () => {
            window.location.href = `songplaying.html?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&file=${encodeURIComponent(song.file)}&thumbnail=${encodeURIComponent(song.thumbnail)}`;
        });
    
        // Append elements to the favorite card
        favoriteCard.appendChild(thumbnail);
        favoriteCard.appendChild(songDetails);
        favoriteCard.appendChild(heartIcon);

        return favoriteCard;
    }

    // Fetch songs from 'favourites.json' and store them in favoriteSongs array
    fetch('favorites.json')
    .then(response => response.json())
    .then(data => {
        const favoriteSongsData = data; // Update the favoriteSongs array with fetched data

        // Add liked songs to the container
        favoriteSongsData.forEach((song) => {
            const favoriteCard = createFavoriteCard(song);
            container.appendChild(favoriteCard);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
});
