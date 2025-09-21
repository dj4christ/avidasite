const playImage = document.getElementById("buttonImage");
const audioPlayer = document.getElementById("audioPlayer");
const searchBar = document.getElementById("songSearch");
const slider = document.querySelector('input[type="range"]');
const tracker = document.getElementById("tracker");
const songDiv = document.getElementById("songsList");
const loadingMessage = document.getElementById("loadingMessage");
let topTenSongs = [];

audioPlayer.addEventListener("timeupdate", () => {
    tracker.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    updateTrack();
});

tracker.addEventListener("change", changeTime);

function changeTime() {
    audioPlayer.currentTime = (tracker.value / 100) * audioPlayer.duration;
}

function skipBack() {
    if (audioPlayer.currentTime >= 2) {
        audioPlayer.currentTime = 0;
    }
}

function listSongs(songLists) {
    const songsList = document.querySelector(".songsList");
    songsList.innerHTML = "";
    loadingMessage.innerText = ""
    songLists.forEach((song, index) => {
        const button = document.createElement("button");
        var songname = song.filename.split("-")[1].replace(".mp3", "");
        var songname =  songname.charAt(0).toUpperCase() + songname.slice(1);
        var artistname = song.filename.split("-")[0]
        var artistname = artistname.charAt(0).toUpperCase() + artistname.slice(1);

        button.textContent = `${songname} - ${artistname} - ${song.views}`;
        button.className = "topTenClass";
        button.id = song.filename;
        button.addEventListener("click", () => playSong(button.id));
        songDiv.appendChild(button);
    });
}

function renderSongs(songs) {
  const songsList = document.querySelector(".songsList");
  songsList.innerHTML = "";

  if (songs.length === 0) {
    songsList.innerHTML = "<p>No results found</p>";
    return;
  }

  listSongs(songs);
}


function searchSongs(query) {
  fetch(`https://avida.onrender.com/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(results => {
      renderSongs(results);
    })
    .catch(err => {
      console.error("Search error:", err);
      showError("Failed to search songs");
    });
}

searchBar.addEventListener("input", () => {
    let query = searchBar.value.trim();
    const songsList = document.querySelector(".songsList");

    if (query.length > 0) {
        searchSongs(query);
    } else {
        songsList.innerHTML = "";
        fetch("https://avida.onrender.com/songs").then(response => response.json()).then(data => {
            topTenSongs = data.slice(0, 10);

            listSongs(topTenSongs);
        });
    }
});


function playButtonClicked(run) {
    if (playImage.getAttribute("src").split("/").slice(-1)[0] == "playIcon.png") {
    if (audioPlayer.getAttribute("src") == "" || audioPlayer.getAttribute("src") == null) {
        showError("No track selected")
    } else {
        if (!run) {
            playImage.setAttribute("src", "assets/graphics/pauseIcon.png");
            audioPlayer.play();
        } else {
            playImage.setAttribute("src", "assets/graphics/pauseIcon.png");
            audioPlayer.play();
        }
        
    }

    } else {
    if (!run) {
        playImage.setAttribute("src", "assets/graphics/playIcon.png");
        audioPlayer.pause();
        } else {
        audioPlayer.play();
        }
    }
}

function playSong(songName) {
    const button = document.getElementById(songName);
    button.background = "#d60b37";
    audioPlayer.src =  `https://avida.onrender.com/music/${songName}`;
    audioPlayer.currentTime = 0;
    playButtonClicked(true);
}

fetch("https://avida.onrender.com/songs").then(response => response.json()).then(data => {
    topTenSongs = data.slice(0, 10);

    listSongs(topTenSongs);
});

function updateTrack() {
    const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #d37211 ${val}%, #333 ${val}%)`;
    audioPlayer.setTime = slider.value;
}

slider.addEventListener('input', updateTrack);
updateTrack();

function showError(message) {
    const errorContainer = document.getElementById("error-container");
    if (!document.getElementById("box")) {
    const box = document.createElement("div");
    box.id = "box"
    box.className = "error-box";
    box.innerText = message;

    errorContainer.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 4000);
    }
    
}