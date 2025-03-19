// Audio Tracks Data
const tracks = [
  {
    id: 1,
    name: "GLOW",
    artist: "dzynsbysoham",
    number: "01",
    url: "audios/dzynsbysoham 1 - GLOW.mp3"
  },
  {
    id: 2,
    name: "SHADOW",
    artist: "dzynsbysoham",
    number: "02",
    url: "audios/dzynsbysoham 2 - SHADOW.mp3"
  },
  {
    id: 3,
    name: "CHARACTER",
    artist: "dzynsbysoham",
    number: "03",
    url: "audios/dzynsbysoham 3 - CHARACTER.mp3"
  },
  {
    id: 4,
    name: "GAMING ASSET",
    artist: "dzynsbysoham",
    number: "04",
    url: "audios/dzynsbysoham 4 - GAMING ASSET.mp3"
  },
  {
    id: 5,
    name: "POOKIE",
    artist: "dzynsbysoham",
    number: "05",
    url: "audios/dzynsbysoham 5 - POOKIE.mp3"
  },
  {
    id: 6,
    name: "FIRE",
    artist: "dzynsbysoham",
    number: "06",
    url: "audios/dzynsbysoham 6 - FIRE.mp3"
  },
  {
    id: 7,
    name: "CLOUD",
    artist: "dzynsbysoham",
    number: "07",
    url: "audios/dzynsbysoham 7 - CLOUD.mp3"
  },
  {
    id: 8,
    name: "BACKGROUND",
    artist: "dzynsbysoham",
    number: "08",
    url: "audios/dzynsbysoham 8 - BACKGROUND.mp3"
  },
  {
    id: 9,
    name: "CRICKET",
    artist: "dzynsbysoham",
    number: "09",
    url: "audios/dzynsbysoham 9 - CRICKET.mp3"
  },
  {
    id: 10,
    name: "FOOTBALL",
    artist: "dzynsbysoham",
    number: "10",
    url: "audios/dzynsbysoham 10 - FOOTBALL.mp3"
  }
];

// DOM Elements
const audioElement = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackNumber = document.getElementById('track-number');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const trackListContainer = document.getElementById('track-list');
const waveformCanvas = document.getElementById('waveform-canvas');
const visualizerCanvas = document.getElementById('visualizer-canvas');
const themeToggle = document.getElementById('theme-toggle');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

// Audio Context and Analyzer
let audioContext;
let analyser;
let source;
let waveformData = [];
let isPlaying = false;
let currentTrackIndex = 0;

// Initialize the application
function init() {
  // Render track list
  renderTrackList();
  
  // Set up initial track
  loadTrack(currentTrackIndex);
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up audio context for visualizer
  setupAudioContext();
  
  // Set up waveform canvas
  setupWaveformCanvas();
  
  // Set up visualizer canvas
  setupVisualizerCanvas();
  
  // Check for saved theme preference
  checkThemePreference();
}

// Render the track list
function renderTrackList() {
  trackListContainer.innerHTML = '';
  
  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
    trackItem.dataset.index = index;
    
    trackItem.innerHTML = `
      <div class="track-item-header">
        <div class="track-number">${track.number}</div>
        <div class="track-item-info">
          <h4 class="track-item-title">${track.name}</h4>
          <p class="track-item-artist">${track.artist}</p>
        </div>
      </div>
      <div class="track-item-actions">
        <button class="track-item-play">
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="track-item-download">
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Download
        </button>
      </div>
    `;
    
    trackListContainer.appendChild(trackItem);
    
    // Add event listeners to track item
    const playButton = trackItem.querySelector('.track-item-play');
    playButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (index === currentTrackIndex && isPlaying) {
        pauseAudio();
      } else {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playAudio();
      }
    });
    
    const downloadButton = trackItem.querySelector('.track-item-download');
    downloadButton.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadTrack(tracks[index]);
    });
    
    trackItem.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playAudio();
    });
  });
}

// Load a track
function loadTrack(index) {
  const track = tracks[index];
  
  // Update audio source
  audioElement.src = track.url;
  audioElement.load();
  
  // Update track info
  trackTitle.textContent = track.name;
  trackArtist.textContent = track.artist;
  trackNumber.textContent = track.number;
  
  // Update track list
  document.querySelectorAll('.track-item').forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Reset time displays
  currentTimeDisplay.textContent = '0:00';
  durationDisplay.textContent = '0:00';
  
  // Generate waveform data
  generateWaveformData(track.url);
}

// Play audio
function playAudio() {
  audioElement.play();
  isPlaying = true;
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  
  // Connect audio to analyzer if not already connected
  if (audioContext && !source) {
    connectAudioSource();
  }
  
  // Start visualizer animation
  animateVisualizer();
}

// Pause audio
function pauseAudio() {
  audioElement.pause();
  isPlaying = false;
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
}

// Play next track
function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    playAudio();
  }
}

// Play previous track
function playPrevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    playAudio();
  }
}

// Download track
function downloadTrack(track) {
  const link = document.createElement('a');
  link.href = track.url;
  link.download = `${track.artist} ${track.number} - ${track.name}.mp3`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Set up event listeners
function setupEventListeners() {
  // Play/Pause button
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });
  
  // Previous button
  prevBtn.addEventListener('click', playPrevTrack);
  
  // Next button
  nextBtn.addEventListener('click', playNextTrack);
  
  // Download button
  downloadBtn.addEventListener('click', () => {
    downloadTrack(tracks[currentTrackIndex]);
  });
  
  // Volume slider
  volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value;
  });
  
  // Audio element events
  audioElement.addEventListener('timeupdate', () => {
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    updateWaveformProgress();
  });
  
  audioElement.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audioElement.duration);
  });
  
  audioElement.addEventListener('ended', playNextTrack);
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Waveform canvas click for seeking
  waveformCanvas.addEventListener('click', (e) => {
    const rect = waveformCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const seekPercentage = x / rect.width;
    audioElement.currentTime = audioElement.duration * seekPercentage;
  });
}

// Set up audio context for visualizer
function setupAudioContext() {
  // Create audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create analyzer
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  
  // Connect audio element to analyzer
  connectAudioSource();
}

// Connect audio source to analyzer
function connectAudioSource() {
  if (!audioContext || !analyser || !audioElement) return;
  
  try {
    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  } catch (error) {
    console.error('Error connecting audio source:', error);
  }
}

// Set up waveform canvas
function setupWaveformCanvas() {
  const ctx = waveformCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas dimensions
  const rect = waveformCanvas.getBoundingClientRect();
  waveformCanvas.width = rect.width * dpr;
  waveformCanvas.height = rect.height * dpr;
  
  // Scale context
  ctx.scale(dpr, dpr);
  
  // Initial draw
  drawWaveform();
}

// Set up visualizer canvas
function setupVisualizerCanvas() {
  const ctx = visualizerCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas dimensions
  const rect = visualizerCanvas.getBoundingClientRect();
  visualizerCanvas.width = rect.width * dpr;
  visualizerCanvas.height = rect.height * dpr;
  
  // Scale context
  ctx.scale(dpr, dpr);
}

// Generate waveform data for a track
function generateWaveformData(url) {
  // Reset waveform data
  waveformData = [];
  
  // Create a temporary audio context
  const tempContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Fetch the audio file
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => tempContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      // Get the audio data
      const channelData = audioBuffer.getChannelData(0);
      
      // Reduce the data to a manageable size
      const samples = 100;
      const blockSize = Math.floor(channelData.length / samples);
      const dataPoints = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(channelData[i * blockSize + j]);
        }
        dataPoints.push(sum / blockSize);
      }
      
      // Normalize the data
      const maxValue = Math.max(...dataPoints);
      waveformData = dataPoints.map(point => point / maxValue);
      
      // Draw the waveform
      drawWaveform();
    })
    .catch(error => {
      console.error('Error generating waveform data:', error);
      // Generate random waveform data as fallback
      waveformData = Array.from({ length: 100 }, () => Math.random() * 0.8);
      drawWaveform();
    });
}

// Draw waveform on canvas
function drawWaveform() {
  if (!waveformCanvas || waveformData.length === 0) return;
  
  const ctx = waveformCanvas.getContext('2d');
  const width = waveformCanvas.width / window.devicePixelRatio;
  const height = waveformCanvas.height / window.devicePixelRatio;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  const barWidth = width / waveformData.length;
  const barGap = 2;
  const barWidthWithGap = barWidth - barGap;
  
  // Calculate progress percentage
  const progress = audioElement.duration > 0 ? audioElement.currentTime / audioElement.duration : 0;
  const progressIndex = Math.floor(waveformData.length * progress);
  
  // Draw waveform
  waveformData.forEach((value, index) => {
    const barHeight = value * height * 0.8;
    const x = index * barWidth;
    const y = (height - barHeight) / 2;
    
    // Set gradient colors based on whether the bar is before or after the current playback position
    if (index <= progressIndex) {
      // Played part - gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#a855f7'); // purple-500
      gradient.addColorStop(1, '#db2777'); // pink-600
      ctx.fillStyle = gradient;
    } else {
      // Unplayed part - gray
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    }
    
    // Draw bar with rounded corners
    ctx.beginPath();
    ctx.roundRect(x, y, barWidthWithGap, barHeight, 2);
    ctx.fill();
  });
}

// Update waveform progress
function updateWaveformProgress() {
  drawWaveform();
}

// Animate visualizer
function animateVisualizer() {
  if (!isPlaying || !visualizerCanvas || !analyser) return;
  
  const ctx = visualizerCanvas.getContext('2d');
  const width = visualizerCanvas.width / window.devicePixelRatio;
  const height = visualizerCanvas.height / window.devicePixelRatio;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get frequency data
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  
  // Calculate bar width and spacing
  const barCount = 32;
  const barWidth = width / barCount;
  const barGap = 2;
  const barWidthWithGap = barWidth - barGap;
  
  // Draw bars
  for (let i = 0; i < barCount; i++) {
    // Get average value for a range of frequencies
    const startIndex = Math.floor(i * bufferLength / barCount);
    const endIndex = Math.floor((i + 1) * bufferLength / barCount);
    let sum = 0;
    for (let j = startIndex; j < endIndex; j++) {
      sum += dataArray[j];
    }
    const average = sum / (endIndex - startIndex);
    
    // Calculate bar height
    const barHeight = (average / 255) * height * 0.8;
    
    // Calculate position
    const x = i * barWidth;
    const y = (height - barHeight) / 2;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)'); // purple-500
    gradient.addColorStop(1, 'rgba(219, 39, 119, 0.8)'); // pink-600
    
    // Draw bar
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidthWithGap, barHeight, 2);
    ctx.fill();
  }
  
  // Request next frame
  requestAnimationFrame(animateVisualizer);
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  
  // Save theme preference
  const isDarkTheme = !document.body.classList.contains('light-theme');
  localStorage.setItem('darkTheme', isDarkTheme);
}

// Check theme preference
function checkThemePreference() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('darkTheme');
  
  if (savedTheme === 'false' || (savedTheme === null && !prefersDark)) {
    document.body.classList.add('light-theme');
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  setupWaveformCanvas();
  setupVisualizerCanvas();
  drawWaveform();
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);