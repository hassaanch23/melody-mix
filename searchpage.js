document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const recentSearchList = document.getElementById('recent-search-list');
  const searchResults = document.createElement('ul');
  searchResults.id = 'search-results';
  document.querySelector('.main-content').appendChild(searchResults);
  const username = localStorage.getItem('currentUsername');
    

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
    } else if (pageName === 'playlist') {
        // Redirect to the playlist page
        window.location.href = 'playlistpage.html';
    } else if (pageName === 'favourites') {
        // Redirect to the favourites page
        window.location.href = 'favouritespage.html';
    } else if (pageName === 'settings') {
        // Redirect to the favourites page
        window.location.href = 'settingspage.html';
    }
  }

  
  

  let songData = [];

  // Fetch song data from the JSON file
  fetch('songsdata.json')
    .then(response => response.json())
    .then(data => {
        songData = data; // Update the song data with the loaded data
        renderRecentSearches(); // Render recent searches with updated song data
    })
    .catch(error => console.error('Error loading songs:', error));

    
    // Load recent searches from local storage
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Function to update recent searches
    function updateRecentSearches(searchTerm) {
      if (!recentSearches.includes(searchTerm)) {
          recentSearches.unshift(searchTerm); // Add to the front of the list
          recentSearches = recentSearches.slice(0, 5); // Keep only the last 5 searches
          localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
      }
      renderRecentSearches();
  }

    // Function to render recent searches
    function renderRecentSearches() {
      recentSearchList.innerHTML = '';
      recentSearches.forEach(search => {
          const song = songData.find(song => song.title.toLowerCase() === search.toLowerCase());
          if (song) {
              const listItem = document.createElement('li');
              listItem.innerHTML = `
                  <img src="${song.thumbnail}" alt="${song.title}">
                  <div class="song-info">
                      <div class="song-title">${song.title}</div>
                      <div class="artist-name"> ${song.artist}</div>
                  </div>
              `;
              listItem.addEventListener('click', function() {
                  searchInput.value = search;
                  performSearch(search);
                updateRecentSearches(song.title); // Update recent searches
                // Append query parameters to the URL
                const queryParams = `?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&file=${encodeURIComponent(song.file)}&thumbnail=${encodeURIComponent(song.thumbnail)}`;
                window.location.href = `songplaying.html?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&file=${encodeURIComponent(song.file)}&thumbnail=${encodeURIComponent(song.thumbnail)}`;

              });
              recentSearchList.appendChild(listItem);
          }
      });
  }

  // Initial render of recent searches
  renderRecentSearches();



    // Helper function to format duration from seconds to mm:ss
function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

    // Function to perform the search
   function performSearch(query) {
      searchResults.innerHTML = ''; // Clear previous results
      const searchQuery = query.toLowerCase();
  
      console.log("Search Query: ", searchQuery); // Debugging line
      console.log("Song Data: ", songData); // Debugging line
  
      const filteredSongs = songData.filter(song => 
          song.title.toLowerCase().includes(searchQuery) || 
          song.artist.toLowerCase().includes(searchQuery)
      );
  
      console.log("Filtered Songs: ", filteredSongs); // Debugging line
  
      if (filteredSongs.length > 0) {
          document.getElementById('search-results-heading').style.display = 'block';
          filteredSongs.forEach(song => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `
                  <img src="${song.thumbnail}" alt="Thumbnail for ${song.title}">
                  <div class="song-info">
                      <div class="song-title">${song.title}</div>
                      <div class="artist-name">${song.artist}</div>
                  </div>
              `;
              listItem.addEventListener('click', function() {
                updateRecentSearches(song.title); // Update recent searches
                localStorage.setItem('selectedSong', JSON.stringify(song)); // Save the selected song
               // Assuming 'song' is the object representing the clicked song
window.location.href = `songplaying.html?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&file=${encodeURIComponent(song.file)}&thumbnail=${encodeURIComponent(song.thumbnail)}`;

            });
              searchResults.appendChild(listItem);
          });
      } else {
          document.getElementById('search-results-heading').style.display = 'none';
      }
  }
  
    // Event listener for the search input
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();
      const searchResultsHeading = document.getElementById('search-results-heading'); // Get the search results heading element
  
       if (query.length > 0) {
            performSearch(query);
            updateRecentSearches(query); // Update recent searches when a search is performed
        } else {
          searchResults.classList.remove('search-list-visible'); // Hide the search results
          searchResultsHeading.style.display = 'none'; // Hide the search results heading
          searchResults.innerHTML = ''; // Clear the search results
      }
  });
});
