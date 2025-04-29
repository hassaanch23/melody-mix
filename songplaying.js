document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const songThumbnail = document.querySelector('.song-thumbnail');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalTimeDisplay = document.querySelector('.total-time');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.querySelector('.progress');
    const progressSlider = document.querySelector('.progress-slider');
    const backButton = document.querySelector('.back-btn');

    // New: Store the source page in local storage or URL parameter
    const sourcePage = localStorage.getItem('sourcePage') || new URLSearchParams(window.location.search).get('source');


    backButton.addEventListener('click', function() {
    
          window.location.href = `homepage.html`; // Redirect to the source page
  });

  const selectedSong = getSelectedSong();
  let doubleClickTimer = null;
  let isDragging = false;

    if (selectedSong) {
        songThumbnail.src = selectedSong.thumbnail;
        songTitle.textContent = selectedSong.title;
        songArtist.textContent = selectedSong.artist;
        audioPlayer.src = selectedSong.file;
        audioPlayer.play(); 
       
    }

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

      // Slider drag functionality
      progressSlider.addEventListener('mousedown', function(e) {
        isDragging = true;
        updateSlider(e);
        e.preventDefault();
  });
window.addEventListener('mousemove', function(e) {
    if (isDragging) {
      updateSlider(e);
    }
  });

  window.addEventListener('mouseup', function(e) {
    if (isDragging) {
      isDragging = false;
      updateSlider(e);
    }
  });

  audioPlayer.addEventListener('loadedmetadata', function() {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
  });

   // Play/pause button functionality
   playPauseBtn.addEventListener('click', function() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      this.innerHTML = '&#8214;&#8214;';
    } else {
      audioPlayer.pause();
      this.innerHTML = '&#9654;';
    }
  });

  // Update progress bar and time display as the audio plays
  audioPlayer.addEventListener('timeupdate', function() {
    if (!isDragging) {
      const progressPercentage = (this.currentTime / this.duration) * 100;
      progress.style.width = `${progressPercentage}%`;
      progressSlider.style.left = `${progressPercentage}%`;
      currentTimeDisplay.textContent = formatTime(this.currentTime);
    }
  });

  // Click to seek functionality
  progressBar.addEventListener('click', function(e) {
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

function getSelectedSong() {
  const queryParams = new URLSearchParams(window.location.search);
  const songTitle = queryParams.get('title');
  const songArtist = queryParams.get('artist');
  const songFile = queryParams.get('file');
  const songThumbnail = queryParams.get('thumbnail'); // Retrieve the thumbnail

  if (songTitle && songArtist && songFile && songThumbnail) {
      return { title: songTitle, artist: songArtist, file: songFile, thumbnail: songThumbnail };
  }

  // If using localStorage, ensure it includes thumbnail data
  // return JSON.parse(localStorage.getItem('selectedSong'));

  return null;
}

function initializePlayerWithSong(song) {
  songThumbnail.src = song.thumbnail; // Ensure this is correctly setting the src attribute
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  audioPlayer.src = song.file;
  audioPlayer.play();
}


audioPlayer.addEventListener('play', function() {
  updatePlayPauseButton(true);
});

audioPlayer.addEventListener('pause', function() {
  updatePlayPauseButton(false);
});

function playNextSong() {
  let currentIndex = songQueue.indexOf(songQueue.find(song => song.file === audioPlayer.src));
  if (currentIndex + 1 < songQueue.length) {
      playSong(currentIndex + 1);
  } else {
      // Restart from the first song if at the end of the queue
      playSong(0);
  }
}

// Function to play the previous song
function playPreviousSong() {
  let currentIndex = songQueue.indexOf(songQueue.find(song => song.file === audioPlayer.src));
  if (currentIndex > 0) {
      playSong(currentIndex - 1);
  } else {
      // Go to the last song if at the beginning of the queue
      playSong(songQueue.length - 1);
  }
}

function handleDoubleClick(action) {
  if (doubleClickTimer) {
      clearTimeout(doubleClickTimer);
      doubleClickTimer = null;
      action(); // Execute the action (play next or previous song)
  } else {
      doubleClickTimer = setTimeout(() => { doubleClickTimer = null; }, 300);
      // Single click functionality (if any) goes here
  }
}

// Add double-click event listeners for previous and next buttons
document.querySelector('.next-btn').addEventListener('click', function() {
  handleDoubleClick(playNextSong); // Play next song on double click
});

document.querySelector('.prev-btn').addEventListener('click', function() {
  handleDoubleClick(playPreviousSong); // Play previous song on double click
});


    console.log('Loaded Song:', selectedSong);
});
