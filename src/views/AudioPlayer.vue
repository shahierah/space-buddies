<template>
  <div class="audio-controls">
    <button @click="showControls = !showControls" class="toggle-button">
      {{ showControls ? 'X' : '🕪' }}
    </button>

    <div v-if="showControls" class="controls-wrapper">
      <select v-model="selectedBGM" @change="changeBGM">
        <option v-for="track in bgmList" :key="track.name" :value="track.src">
          {{ track.name }}
        </option>
      </select>

      <button @click="toggleMute">
        {{ isMuted ? 'Unmute' : 'Mute' }}
      </button>

      <button @click="showSlider = !showSlider">Volume</button>

      <input
        v-if="showSlider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        class="volume-slider"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const bgmList = [
  { name: 'ABCDLOVE', src: 'src/sounds/bgm ABCDLOVE.mp3' },
  { name: 'Magnetic', src: 'src/sounds/bgm magnetic.mp3' },
  { name: 'Twinkle Little Star', src: 'src/sounds/bgm Twinkle, twinkle, Little Star.mp3' },
  { name: 'OUR', src: 'src/sounds/bgm OUR.mp3' },
  { name: 'Tick-Tack', src: 'src/sounds/bgm Tick-Tack.mp3' }
]

const selectedBGM = ref(bgmList[0].src)
const isMuted = ref(false)
const volume = ref(0.5)

const audio = new Audio()
audio.loop = true
const showSlider = ref(false)
const showControls = ref(true)

onMounted(() => {
  audio.src = selectedBGM.value
  audio.volume = volume.value
  if (!isMuted.value) audio.play()
})

onBeforeUnmount(() => {
  audio.pause()
})

watch(selectedBGM, (newSrc) => {
  audio.src = newSrc
  if (!isMuted.value) audio.play()
})

watch(volume, (newVolume) => {
  audio.volume = newVolume
})

function toggleMute() {
  isMuted.value = !isMuted.value
  audio.muted = isMuted.value
  if (!isMuted.value) audio.play()
}

function changeBGM() {
  audio.src = selectedBGM.value
  if (!isMuted.value) audio.play()
}
</script>

<style scoped>
.audio-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 12px;
  color: white;
  font-family: 'Fredoka', sans-serif;
  z-index: 9999;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  max-width: 95vw;
  box-sizing: border-box;
}

/* Adjust layout for small screens */
@media (max-width: 480px) {
  .audio-controls {
    flex-direction: column;
    align-items: flex-start;
    right: 10px;
    bottom: 10px;
  }

  .volume-slider {
    width: 100%;
  }

  .controls-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }
}

.toggle-button {
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: #FECF08;
  border: none;
  border-radius: 6px;
  /* width: 30px;
  height: 30px; */
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 10000;
}

select {
  background-color: white;
  color: #232a52;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
  font-family: inherit;
}

button {
  background-color: #FECF08;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  color: #232a52;
}

input[type='range'] {
  cursor: pointer;
  accent-color: #FECF08;
}

button:active {
  transform: scale(0.96);
  background-color: #e6b800;
}

/* .volume-slider {
  width: 100px;
} */

.toggle-button {
  background-color: #FECF08;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
  color: #232a52;
}

.controls-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

</style>