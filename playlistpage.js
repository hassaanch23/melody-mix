document.addEventListener('DOMContentLoaded', () => {
    const createPlaylistButton = document.getElementById('create-playlist-button');
    const playlistDetails = document.getElementById('playlist-details');
    const playlistNameInput = document.getElementById('playlist-name');
    const searchSongInput = document.getElementById('search-song');
    const confirmPlaylistButton = document.getElementById('confirm-playlist-button');
    const songListContainer = document.querySelector('.song-list-container');
    const playlistContainer = document.querySelector('.playlist-container');
    const selectedSongsContainer = document.querySelector('.selected-songs-container');
    const selectedSongsList = document.getElementById('selected-songs-list');
    const username = localStorage.getItem('currentUsername');
    const playlists = {}; // Object to store playlists and their associated songs
    let playlistCreated = false; // Flag to track if a playlist is created
    let songsData; // Array to store song data
    const selectedSongs = []; // Array to store selected songs

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
      // You can add logic to load content from a server or handle it as needed for each page
      if (pageName === 'home') {
          // Redirect to the settings page
          window.location.href = 'homepage.html';
      } else if (pageName === 'settings') {
          // Redirect to the playlist page
          window.location.href = 'settingspage.html';
      } else if (pageName === 'favourites') {
          // Redirect to the favourites page
          window.location.href = 'favouritespage.html';
      } else {
          // Default to the home page
          // You can handle this as needed
      }
  }



function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function loadPlaylists() {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
        playlists = JSON.parse(savedPlaylists);
        Object.keys(playlists).forEach(name => {
            addNewPlaylist(name);
        });
    }
}



    // Function to add a new playlist
    function addNewPlaylist(name) {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');
        playlistElement.textContent = name; // Set playlist name
        playlistContainer.appendChild(playlistElement);

        // Create an empty array for this playlist to store songs
        playlists[name] = [];

        // Add click event listener to dynamically populate selected songs when a playlist is clicked
        playlistElement.addEventListener('click', () => {
            const playlistName = playlistElement.textContent;
            displayPlaylistSongs(playlistName);
            
            savePlaylists();
            loadPlaylists();
            
        });
       
        
    }

    // Function to display the songs in a playlist
    function displayPlaylistSongs(playlistName) {
        // Clear previous results
        selectedSongsList.innerHTML = '';

        // Get the songs associated with the selected playlist
        const playlistSongs = playlists[playlistName];

        if (playlistSongs.length > 0) {
            playlistSongs.forEach(songTitle => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<i class="play-button">&#9654;</i> ${songTitle}`;
                selectedSongsList.appendChild(listItem);
            });
        } else {
            // Display a message when the playlist is empty
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'This playlist is empty.';
            selectedSongsList.appendChild(emptyMessage);
        }

        // Show the selected songs container
        selectedSongsContainer.style.display = 'block';
        // Hide the song list container
        songListContainer.style.display = 'none';
    }

    // Function to display matching songs based on the search query
    function displayMatchingSongs(searchQuery) {
        // Clear previous results
        songListContainer.innerHTML = '';

        // Ensure the search query is not empty
        if (searchQuery.trim() === '') {
            songListContainer.style.display = 'none'; // Hide the song container
            return;
        }

        // Find songs that start with the searchQuery
        const matchingSongs = songsData.filter(song => {
            return song.title.toLowerCase().startsWith(searchQuery) || song.artist.toLowerCase().startsWith(searchQuery);
        });

        if (matchingSongs.length > 0) {
            matchingSongs.forEach(matchingSong => {
                const songElement = document.createElement('div');
                songElement.classList.add('song');

                // Create a checkbox for the song
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('song-checkbox');
                songElement.appendChild(checkbox);

                // Create a label for the matching song title and artist
                const label = document.createElement('label');
                label.textContent = matchingSong.title + ' - ' + matchingSong.artist;
                songElement.appendChild(label);

                // Hide the selected songs from the search results
                if (selectedSongs.includes(label.textContent)) {
                    songElement.style.display = 'none';
                }

                songListContainer.appendChild(songElement);

                // Event listener for checkbox
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        handleSongSelection(label.textContent);
                        songElement.style.display = 'none'; // Hide the song in the search results
                    }
                });
            });
        } else {
            // Display a message when no matching songs are found
            const noMatchMessage = document.createElement('div');
            noMatchMessage.textContent = 'No matching songs found.';
            songListContainer.appendChild(noMatchMessage);
        }

        // Show the song list container
        songListContainer.style.display = 'block';
    }

    // Function to load JSON data from a file
    function loadJSONFile(filename, callback) {
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', filename, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(null);
    }

    // Function to show the song added popup
    function showSongAddedPopup() {
        const popup = document.getElementById('song-added-popup');
        const closePopupButton = document.getElementById('close-song-added-popup');

        popup.style.display = 'block';

        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        // Hide the popup after 3 seconds (adjust as needed)
        setTimeout(() => {
            popup.style.display = 'none';
        }, 2000);
    }

    // Function to handle song selection
    function handleSongSelection(songTitle) {
        // Check if the song is already selected
        if (!selectedSongs.includes(songTitle)) {
            selectedSongs.push(songTitle);

            // Create a list item for the selected song
            const listItem = document.createElement('li');
            listItem.innerHTML = `<i class="play-button">&#9654;</i> ${songTitle}`;            // Add play button icon
            selectedSongsList.appendChild(listItem);

            // Show the song added popup
            showSongAddedPopup();
        }
    }

    // Function to handle playlist confirmation
    function confirmPlaylist() {
        // Create a new playlist using selectedSongs array
        if (selectedSongs.length > 0) {
            const playlistName = playlistNameInput.value;
            addNewPlaylist(playlistName);

            // Add selected songs to the new playlist
            playlists[playlistName] = selectedSongs.slice();

            // Clear the selected songs list and array
            selectedSongsList.innerHTML = '';
            selectedSongs.length = 0;

            // Hide the selected songs container and show the playlist creation elements
            selectedSongsContainer.style.display = 'none';
            playlistDetails.style.display = 'none'; // Hide playlist details
            confirmPlaylistButton.style.display = 'none';

            // Hide the search bar and "Give your playlist name" input
            searchSongInput.style.display = 'none';
            playlistNameInput.style.display = 'none';

            // Show the playlist container
            playlistContainer.style.display = 'block'; // Show the playlist container after confirmation

            // Reset playlistCreated flag
            playlistCreated = false;
        }
    }

    // Event listener for creating the playlist
    createPlaylistButton.addEventListener('click', () => {
        // Toggle the display of the playlist container
        if (playlistContainer.style.display === 'none') {
            playlistContainer.style.display = 'block';
            selectedSongsContainer.style.display = 'none'; // Hide the selected songs container
        } else {
            playlistContainer.style.display = 'none';
            // If the playlist container is already displayed, also hide other related elements
            playlistDetails.style.display = 'none';
            searchSongInput.style.display = 'none';
            playlistNameInput.style.display = 'none';
            selectedSongsContainer.style.display = 'none';
            confirmPlaylistButton.style.display = 'none';

            // Clear the selected songs list and array
            selectedSongsList.innerHTML = '';
            selectedSongs.length = 0;
        }

        if (!playlistCreated) {
            playlistDetails.style.display = 'block';
            confirmPlaylistButton.style.display = 'block';
            searchSongInput.style.display = 'block'; // Show the search bar
            playlistNameInput.style.display = 'block'; // Show the playlist name input
            playlistCreated = true;

            // Clear the selected songs list and array when creating a new playlist
            selectedSongsList.innerHTML = '';
            selectedSongs.length = 0;

            // Load songs from JSON file and display them
            loadJSONFile('songsdata.json', data => {
                songsData = data;
            });
        }
    });

    // Event listener for confirming the playlist
    confirmPlaylistButton.addEventListener('click', () => {
        confirmPlaylist();
    });

    // Event listener for searching songs
    searchSongInput.addEventListener('input', () => {
        const searchQuery = searchSongInput.value.trim().toLowerCase();
        displayMatchingSongs(searchQuery);
    });

    selectedSongsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('play-button')) {
            console.log('Play button clicked');
    
            // The song title is next to the play button, usually in a sibling element
            let songTitleAndArtist = event.target.parentElement.textContent.trim();
            console.log('Song title and artist:', songTitleAndArtist);
            
            // Separate the song title and artist
            let [songTitle, songArtist] = songTitleAndArtist.split(' - ');
            songTitle = songTitle.trim();
            songArtist = songArtist.trim();
    
            console.log('Song title:', songTitle);
            console.log('Song artist:', songArtist);
    
            // Find the selected song in the songsData array
            const selectedSong = songsData.find(song => song.title === songTitle && song.artist === songArtist);
    
            console.log('Selected song:', selectedSong);
    
            if (selectedSong) {
                // Construct the URL with query parameters
                const songUrl = `songplaying.html?title=${encodeURIComponent(selectedSong.title)}&artist=${encodeURIComponent(selectedSong.artist)}&file=${encodeURIComponent(selectedSong.file)}&thumbnail=${encodeURIComponent(selectedSong.thumbnail)}`;
                window.location.href = songUrl;
            }
        }
    });
    



    // Add more JavaScript functionality as needed
});
