<template>
  <div class="planet-match">
    <h2 style="font-weight: bold;">Drag and Match the Planet Pictures to Their Names!</h2>

    <div class="game-area">
      <div class="images">
        <div
          v-for="planet in planets"
          :key="planet.name"
          class="planet-image"
          draggable="true"
          @dragstart="startDrag(planet.name)"
          @touchstart.prevent="startTouchDrag(planet.name, $event)"
          @touchmove.prevent="onTouchMove($event)"
          @touchend.prevent="onTouchEnd($event)"
        >
          <img :src="planet.img" :alt="planet.name" />
        </div>
      </div>

      <div class="drop-areas">
        <div
          v-for="planet in dropZones"
          :key="planet.name"
          class="drop-box"
          @dragover.prevent
          @drop="dropPlanet(planet.name)"
        >
          <span>{{ planet.name }}</span>
          <div v-if="matchedPlanets[planet.name]" class="matched-image">
            <img :src="matchedPlanets[planet.name]" alt="matched planet" />
          </div>
        </div>
      </div>
    </div>

    <button @click="resetGame" class="reset-button">↻ Play Again</button>

    <div v-if="showWinPopup" class="popup-overlay">
      <div class="popup">
        <h2>🎉 Congratulations!</h2>
        <p>You matched all the planets!</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const planets = ref([
  { name: 'Mercury', img: '/pic/merc trans.png' },
  { name: 'Venus', img: '/pic/venus trans.png' },
  { name: 'Earth', img: '/pic/earth trans.png' },
  { name: 'Mars', img: '/pic/mars trans.png' },
  { name: 'Jupiter', img: '/pic/jupiter trans.png' },
  { name: 'Saturn', img: '/pic/saturn trans.png' },
  { name: 'Uranus', img: '/pic/uranus trans.png' },
  { name: 'Neptune', img: '/pic/neptune trans.png' }
])

const dropZones = ref([])

const draggedPlanet = ref(null)
const matchedPlanets = ref({})

const dropSound = new Audio('src/sounds/select-sound-121244.mp3')
dropSound.volume = 1.0

const wrongSound = new Audio('src/sounds/casual-click-pop-ui-8-262125.mp3')
wrongSound.volume = 1.0

const showWinPopup = ref(false)

function closePopup() {
  showWinPopup.value = false
}

function startDrag(planetName) {
  draggedPlanet.value = planetName
}

function dropPlanet(targetName) {
  const planet = planets.value.find(p => p.name === draggedPlanet.value)
  if (planet && planet.name === targetName) {
    matchedPlanets.value[targetName] = planet.img
    dropSound.currentTime = 0
    dropSound.play()

    if (allMatched.value) {
      showWinPopup.value = true
    }
  } else {
    wrongSound.currentTime = 0
    wrongSound.play()
  }
  draggedPlanet.value = null
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const allMatched = computed(() => {
  return planets.value.every(planet => matchedPlanets.value[planet.name])
})

function resetGame() {
  matchedPlanets.value = {}
  shuffleArray(planets.value)
  dropZones.value = [...planets.value]
  shuffleArray(dropZones.value)
}

// Mobile touch drag-and-drop logic:

const touchDraggedPlanet = ref(null)
const touchDragElement = ref(null)

function startTouchDrag(planetName, event) {
  touchDraggedPlanet.value = planetName
  const touch = event.touches[0]
  createFloatingImage(planetName, touch.clientX, touch.clientY)
}

function createFloatingImage(planetName, x, y) {
  if (!touchDragElement.value) {
    touchDragElement.value = document.createElement('img')
    touchDragElement.value.style.position = 'fixed'
    touchDragElement.value.style.pointerEvents = 'none'
    touchDragElement.value.style.width = '80px'
    touchDragElement.value.style.height = '80px'
    touchDragElement.value.style.zIndex = 1000
    touchDragElement.value.style.borderRadius = '10px'
    touchDragElement.value.style.border = '1px solid #ccc'
    touchDragElement.value.style.background = 'rgba(255,255,255,0.1)'
    touchDragElement.value.style.backdropFilter = 'blur(4px)'
    document.body.appendChild(touchDragElement.value)
  }
  const planet = planets.value.find(p => p.name === planetName)
  if (planet) {
    touchDragElement.value.src = planet.img
  }
  moveFloatingImage(x, y)
}

function moveFloatingImage(x, y) {
  if (touchDragElement.value) {
    touchDragElement.value.style.left = `${x - 40}px`
    touchDragElement.value.style.top = `${y - 40}px`
  }
}

function onTouchMove(event) {
  const touch = event.touches[0]
  moveFloatingImage(touch.clientX, touch.clientY)
}

function onTouchEnd(event) {
  if (!touchDraggedPlanet.value) return

  const touch = event.changedTouches[0]
  const element = document.elementFromPoint(touch.clientX, touch.clientY)

  if (element) {
    const dropBox = element.closest('.drop-box')
    if (dropBox) {
      const targetName = dropBox.querySelector('span').textContent.trim()
      // Set draggedPlanet before calling dropPlanet, because it uses draggedPlanet
      draggedPlanet.value = touchDraggedPlanet.value
      dropPlanet(targetName)
    }
  }

  if (touchDragElement.value) {
    document.body.removeChild(touchDragElement.value)
    touchDragElement.value = null
  }
  touchDraggedPlanet.value = null
}

onMounted(() => {
  shuffleArray(planets.value)
  dropZones.value = [...planets.value]
  shuffleArray(dropZones.value)
})
</script>

<style scoped>
.planet-match {
  text-align: center;
  padding: 2rem;
  color: white;
  font-family: 'Fredoka', sans-serif;
  background-image: url('/pic/just bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
}

.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: none;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.planet-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid #ccc;
  border-radius: 10px;
  cursor: grab;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid #ccc;
  user-select: none; /* Prevents text selection on touch */
}

.drop-areas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.drop-box {
  width: 120px;
  height: 120px;
  border: 2px dashed #42b983;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 0.5rem;
}

.drop-box span {
  margin-bottom: 0.5rem;
}

.matched-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-top: 5px;
  border-radius: 5px;
}

.congratulations {
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #42b983;
}

  button {
  /* margin: 1rem 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #fecf08;
  border: 2px solid #ff8800;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer; */

    background-color: #FECF08;
    border: 2px solid #ff8800;
    padding: 0.5rem 1.5rem;
    border-radius: 12px;
    text-decoration: none;
    color: #000000;
    font-weight: bold;
    font-size: 1rem;
    width: 80%;
    max-width: 160px;
    box-shadow: 0 5px 0 #c27000;
    transition: all 0.2s ease;
    position: relative;
  }
  
.reset-button {
  margin: 1rem 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #fecf08;
  border: 2px solid #ff8800;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  width: 80%;
  max-width: 150px;
}

.reset-button:hover {
  background-color: #ffd84d;
}

button:active {
  transform: scale(0.96);
  background-color: #e6b800;
}

.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  background-color: #fecf08;
  padding: 30px 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

/* Responsive for mobile */
@media (max-width: 600px) {
  .planet-image img {
    width: 60px;
    height: 60px;
  }
  .drop-box {
    width: 100px;
    height: 100px;
  }
  .reset-button {
    width: 100%;
    max-width: none;
  }
}
</style>
