document.addEventListener('DOMContentLoaded', function () {
  const playPauseBtn = document.querySelector('.play-pause-btn');
  const audioPlayer = document.getElementById('audio-player');
  const currentTimeDisplay = document.querySelector('.current-time');
  const totalTimeDisplay = document.querySelector('.total-time');
  const progressBar = document.getElementById('progress-bar');
  const progress = document.querySelector('.progress');
  const progressSlider = document.querySelector('.progress-slider');
  const upNextList = document.getElementById('up-next-list');
  const lyricsBtn = document.querySelector('.lyrics-btn');
  const lyricsContainer = document.querySelector('.lyrics-container');
  const username = localStorage.getItem('currentUsername');
  const navButtons = document.querySelectorAll('.nav-item');
  const contentDivs = document.querySelectorAll('.main-content');
    const likeButton = document.querySelector('.like-btn');
    

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
    if (pageName === 'settings') {
        // Redirect to the settings page
        window.location.href = 'settingspage.html';
    } else if (pageName === 'playlist') {
        // Redirect to the playlist page
        window.location.href = 'playlistpage.html';
    } else if (pageName === 'favourites') {
        // Redirect to the favourites page
        window.location.href = 'favouritespage.html';
    } else {
        // Default to the home page
        // You can handle this as needed
    }
}

  let songQueue = [];
  let isDragging = false;

  // Fetch song data from the JSON file
  fetch('songsdata.json')
      .then(response => response.json())
      .then(data => {
          console.log('Loaded JSON data:', data);
          songQueue = data;
          if (songQueue.length > 0) {
              updatePlayer(songQueue[0]);
              updateUpNextList();
          }
      })
      .catch(error => console.error('Error loading songs:', error));


      // Function to get the currently playing song
function getCurrentSong() {
    const currentSrc = audioPlayer.src;

    console.log('Current Source:', currentSrc);
    const currentSong = songQueue.find(song => currentSrc.includes(song.file));

    if (!currentSong) {
        console.error('No matching song found in songQueue for:', currentSrc);
    }

    return currentSong;
}

  // Update the "Up Next" list with thumbnails and text
  function updateUpNextList() {
      upNextList.innerHTML = '';
      songQueue.forEach((song, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'up-next-item';

          const thumbnail = document.createElement('img');
          thumbnail.src = song.thumbnail;
          thumbnail.alt = song.title;
          thumbnail.className = 'up-next-thumbnail';

          const textContainer = document.createElement('div');
          textContainer.className = 'up-next-text-container';

          const title = document.createElement('div');
          title.textContent = song.title;
          title.className = 'up-next-title';

          const artist = document.createElement('div');
          artist.textContent = song.artist;
          artist.className = 'up-next-artist';

          textContainer.appendChild(title);
          textContainer.appendChild(artist);

          listItem.appendChild(thumbnail);
          listItem.appendChild(textContainer);

          listItem.onclick = function () {
              playSong(index);
          };
          upNextList.appendChild(listItem);
      });
  }

  // Play a song from the queue
  function playSong(index) {
      const song = songQueue[index];
      updatePlayer(song);
      audioPlayer.play();
      songQueue.push(...songQueue.splice(index, 1));
      updateUpNextList();
  }

  // Load the first song from the queue initially
  if (songQueue.length > 0) {
      updatePlayer(songQueue[0]);
  }

  updateUpNextList();

  // Update the slider and progress bar
  function updateSlider(e) {
      const progressBarRect = progressBar.getBoundingClientRect();
      const maxSliderLeft = progressBarRect.width;
      let sliderLeft = e.clientX - progressBarRect.left;
      sliderLeft = Math.min(Math.max(0, sliderLeft), maxSliderLeft);
      const progressPercentage = (sliderLeft / progressBarRect.width) * 100;
      progress.style.width = `${progressPercentage}%`;
      progressSlider.style.left = `${progressPercentage}%`;
      const seekTime = (sliderLeft / progressBarRect.width) * audioPlayer.duration;
      audioPlayer.currentTime = seekTime;
  }

  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); // 3000 milliseconds (3 seconds)
}

function isFavorite(song) {
    const favorites = getFavorites();
    return favorites.some(favorite => favorite.title === song.title);
}

function toggleFavorite(song) {
    const favorites = getFavorites();
    const isCurrentlyLiked = isFavorite(song);

    if (isCurrentlyLiked) {
        // Remove the song from favorites
        const updatedFavorites = favorites.filter(favorite => favorite.title !== song.title);
        saveFavorites(updatedFavorites);
    } else {
        // Add the song to favorites
        favorites.push(song);
        saveFavorites(favorites);
    }
}

function updateLikeButtonState() {
    const currentSong = getCurrentSong();
    if (currentSong) {
        const likeButton = document.querySelector('.like-btn');
        if (isFavorite(currentSong)) {
            likeButton.classList.add('active'); // Add the 'active' class to turn the button red
        } else {
            likeButton.classList.remove('active'); // Remove the 'active' class to reset the button color
        }
    }
}

likeButton.addEventListener('click', function () {
    const currentSong = getCurrentSong();

    if (currentSong) {
        toggleFavorite(currentSong);
        updateLikeButtonState();
    }
});


  // Slider drag functionality
  progressSlider.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateSlider(e);
      e.preventDefault();
  });

  window.addEventListener('mousemove', function (e) {
      if (isDragging) {
          updateSlider(e);
      }
  });

  window.addEventListener('mouseup', function (e) {
      if (isDragging) {
          isDragging = false;
          updateSlider(e);
      }
  });

  // Update the total time display when the audio is loaded
  audioPlayer.addEventListener('loadedmetadata', function () {
      totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
  });

  // Automatically play the next song when the current one ends
  audioPlayer.addEventListener('ended', function () {
      playNextSong();
  });

  // Function to play the next song
  function playNextSong() {
      let currentIndex = songQueue.indexOf(songQueue.find(song => song.file === audioPlayer.src));
      if (currentIndex + 1 < songQueue.length) {
          playSong(currentIndex + 1);
      } else {
          playSong(0);
      }
  }

  // Function to play the previous song
  // Function to play the previous song
function playPreviousSong() {
    let currentIndex = songQueue.indexOf(songQueue.find(song => song.file === audioPlayer.src));
    if (currentIndex > 0) {
        playSong(currentIndex - 2);
    } else {
        // If at the beginning of the queue, play the last song in the up-next list
        playSong(songQueue.length - 3);
    }
}


  // Adding double click event listeners for Previous/Next buttons
  let doubleClickTimer = null;

  document.querySelector('.next-btn').addEventListener('click', function () {
      if (doubleClickTimer) {
          clearTimeout(doubleClickTimer);
          doubleClickTimer = null;
          playNextSong();
      } else {
          doubleClickTimer = setTimeout(() => {
              doubleClickTimer = null;
          }, 300);
      }
  });

  document.querySelector('.prev-btn').addEventListener('click', function () {
      if (doubleClickTimer) {
          clearTimeout(doubleClickTimer);
          doubleClickTimer = null;
          playPreviousSong();
      } else {
          doubleClickTimer = setTimeout(() => {
              doubleClickTimer = null;
          }, 300);
      }
  });

  // Play/pause button functionality
  playPauseBtn.addEventListener('click', function () {
      if (audioPlayer.paused) {
          audioPlayer.play();
          this.innerHTML = '&#8214;&#8214;';
      } else {
          audioPlayer.pause();
          this.innerHTML = '&#9654;';
      }
  });

  // Update progress bar and time display as the audio plays
  audioPlayer.addEventListener('timeupdate', function () {
      if (!isDragging) {
          const progressPercentage = (this.currentTime / this.duration) * 100;
          progress.style.width = `${progressPercentage}%`;
          progressSlider.style.left = `${progressPercentage}%`;
          currentTimeDisplay.textContent = formatTime(this.currentTime);
      }
  });

  // Click to seek functionality
  progressBar.addEventListener('click', function (e) {
      const clickX = e.offsetX;
      const totalWidth = this.offsetWidth;
      const clickTime = (clickX / totalWidth) * audioPlayer.duration;
      audioPlayer.currentTime = clickTime;
  });

  // Format time in minutes and seconds
  function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  function updatePlayPauseButton(isPlaying) {
      if (isPlaying) {
          playPauseBtn.innerHTML = '&#8214;&#8214;'; // Pause icon
      } else {
          playPauseBtn.innerHTML = '&#9654;'; // Play icon
      }
  }

  // Update the player with the current song details
  function updatePlayer(songData) {
      document.querySelector('.song-thumbnail').setAttribute('src', songData.thumbnail);
      document.querySelector('.song-title').textContent = songData.title;
      document.querySelector('.song-artist').textContent = songData.artist;
      audioPlayer.setAttribute('src', songData.file);

      updatePlayPauseButton(false); // Update the play/pause button to show the play icon
  }

  audioPlayer.addEventListener('play', function () {
      updatePlayPauseButton(true);
  });

  audioPlayer.addEventListener('pause', function () {
      updatePlayPauseButton(false);
  });

  // Make navigation item active
  function makeActive(element) {
      document.querySelectorAll('.nav-item').forEach((navItem) => {
          navItem.classList.remove('active');
      });
      element.classList.add('active');
  }

  // Search icon functionality
  document.querySelector('.search-icon').addEventListener('click', function () {
      document.querySelectorAll('.nav-item').forEach((navItem) => {
          navItem.classList.remove('active');
      });
      this.classList.add('active');
  });

  function getCurrentSong() {
      const currentSrc = audioPlayer.src;

     console.log('Current Source:', currentSrc);
      const currentSong = songQueue.find(song => currentSrc.includes(song.file));

      if (!currentSong) {
          console.error('No matching song found in songQueue for:', currentSrc);
      }

      return currentSong;
  }

  function displayLyrics() {
    const currentSong = getCurrentSong();
    console.log('Current Song:', currentSong);

    const lyricsContainer = document.querySelector('.lyrics-container');
    
    if (currentSong && currentSong.hasOwnProperty('lyrics')) {
        console.log('Lyrics Found:', currentSong.lyrics);
        lyricsContainer.innerHTML = currentSong.lyrics;
    } else {
        console.log('Song or Lyrics Not Available');
        lyricsContainer.innerHTML = "Lyrics not available for this song.";
    }
}

  lyricsBtn.addEventListener('click', function () {
      displayLyrics();
  });

  document.querySelector('.search-icon').addEventListener('click', function () {
      window.open('searchpage.html', '_self');
  });

  // Add click event listeners to navigation buttons
  document.querySelectorAll('.nav-item').forEach((button) => {
      button.addEventListener('click', function () {
          const targetPage = this.getAttribute('data-target');
          loadPageContent(targetPage);
      });
  });

  // Function to open the selected page
  function openPage(pageName) {
    // Show the selected window
    const selectedWindow = document.getElementById(`${pageName.toLowerCase()}-window`);
    if (selectedWindow) {
        selectedWindow.classList.add('active');
    }

    // Hide other windows
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        if (window !== selectedWindow) {
            window.classList.remove('active');
        }
    });

    navButtons.forEach(navButton => {
        navButton.classList.remove('active');
        if (navButton.textContent.trim() === pageName) {
            navButton.classList.add('active');
        }
    });

    // Load content from HTML file with the same name
    fetch(`${pageName.toLowerCase()}.html`)
        .then((response) => response.text())
        .then((html) => {
            selectedWindow.innerHTML = html;
        })
        .catch((error) => {
            console.error(`Error loading ${pageName.toLowerCase()}.html: ${error}`);
        });
}

  // Function to find an element containing specific text
  function containsText(element, text) {
      return element.textContent.toLowerCase().includes(text.toLowerCase());
  }
});
