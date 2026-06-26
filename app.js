const player = document.querySelector(".player");
const video = document.querySelector(".video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play-btn");
const rewindBtn = document.getElementById("rewind-btn");
const forwardBtn = document.getElementById("forward-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullScreenBtn = document.getElementById("fullscreen-icon");
const playbackSpeed = document.querySelector(".playback-speed");

// VIDEO PAUSE/PLAY
function showPlayIcon() {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
}
function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
  } else {
    video.pause();
    showPlayIcon();
  }
}

// REWIND-FORWARD
function rewind() {
  video.currentTime -= 10;
}
function forward() {
  video.currentTime += 10;
}

// VIDEO PROGRESS BAR
function updateProgress() {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = `${displayTime(video.currentTime)}`;
  duration.textContent = `${displayTime(video.duration)}`;
}
function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  progressBar.style.width = `${newTime * 100}%`;
  video.currentTime = newTime * video.duration;
}

// TIME STAMPS
function displayTime(time) {
  const mins = Math.floor(time / 60);
  const secs = String(Math.floor(time % 60)).padStart(2, "0");
  return `${mins}:${secs}`;
}

// VOLUME CHANGE FUNCTIONS
let lastVolume = 1;
// volume icon change
function volumeIconChange(volume) {
  volumeIcon.className = "fa-solid";
  if (volume >= 0.7) {
    volumeIcon.classList.add("fa-volume-high");
    volumeIcon.setAttribute("title", "Mute");
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add("fa-volume-low");
    volumeIcon.setAttribute("title", "Mute");
  } else if (volume === 0) {
    volumeIcon.classList.add("fa-volume-xmark");
    volumeIcon.setAttribute("title", "Unmute");
  }
}
// upddate volume bar ui
function updateVolumeUI(v) {
  const volume = Math.min(1, Math.max(0, v));
  video.volume = volume;
  volumeBar.style.width = `${volume * 100}%`;
  volumeIconChange(volume);
}
// volume update
function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  if (volume < 0.1) volume = 0;
  if (volume > 0.9) volume = 1;

  updateVolumeUI(volume);
}
// mute-unmute
function volumeToggle() {
  if (video.volume > 0) {
    lastVolume = video.volume; // Save current volume before muting
    updateVolumeUI(0);
  } else {
    updateVolumeUI(lastVolume > 0 ? lastVolume : 1);
  }
}
// volume increment by keys
function changeVolumeBy(amount) {
  updateVolumeUI(video.volume + amount);
}

// PLAYBACK SPEED
function changeSpeed() {
  video.playbackRate = playbackSpeed.value;
}

// FULSCREEN FUNCTIONS
// toggle fullscreen
function fullscreenToggle() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
// change fullscreen-icon
function fullscreenIcon() {
  if (document.fullscreenElement) {
    fullScreenBtn.classList.replace(
      "fa-up-right-and-down-left-from-center",
      "fa-down-left-and-up-right-to-center",
    );
    fullScreenBtn.setAttribute("title", "Exit Fullscreen");
  } else {
    fullScreenBtn.classList.replace(
      "fa-down-left-and-up-right-to-center",
      "fa-up-right-and-down-left-from-center",
    );
    fullScreenBtn.setAttribute("title", "Fullscreen");
  }
}

// KEYBOARD CONTROLS HANDLER
const keyActions = {
  arrowright: () => forward(),
  arrowleft: () => rewind(),
  " ": () => togglePlay(),
  arrowup: () => changeVolumeBy(0.1),
  arrowdown: () => changeVolumeBy(-0.1),
  m: () => volumeToggle(),
  f: () => fullscreenToggle(),
};
function handleKeypress(e) {
  const key = e.key.toLowerCase();

  if (keyActions[key]) {
    e.preventDefault();
    keyActions[key](); // run function
  }
}

playBtn.addEventListener("click", togglePlay);
rewindBtn.addEventListener("click", rewind);
forwardBtn.addEventListener("click", forward);
video.addEventListener("click", togglePlay);
video.addEventListener("ended", showPlayIcon);
video.addEventListener("timeupdate", updateProgress);
video.addEventListener("canplay", updateProgress);
progressRange.addEventListener("click", setProgress);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", volumeToggle);
playbackSpeed.addEventListener("change", changeSpeed);
fullScreenBtn.addEventListener("click", fullscreenToggle);
document.addEventListener("fullscreenchange", fullscreenIcon);
document.addEventListener("keydown", handleKeypress);
