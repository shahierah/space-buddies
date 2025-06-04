<template>
  <div class="sorting-game">

    <h2 style="font-weight: bold;">Sorting Game</h2>

    <div class="sorting-controls">
      <label for="sortType">Choose sorting type:</label>
      <select id="sortType" v-model="sortType">
        <option value="size">Sort by Size</option>
        <option value="arrangement">Sort by Planet Arrangement</option>
      </select>
    </div>

    <div class="drag-area">
      <div
        v-for="planet in planets"
        :key="planet.name"
        class="planet"
        draggable="true"
        @dragstart="startDrag(planet)"
        @touchstart="touchStart(planet, $event)"
        @touchmove="touchMove($event)"
        @touchend="touchEnd($event)"
      >
        <img :src="planet.img" :alt="planet.name || 'Planet'" />
        <p>{{ planet.name }}</p>
      </div>
    </div>

    <div class="drop-area" @dragover.prevent @drop="dropPlanet">
      <div
        v-for="planet in sortedPlanets"
        :key="planet.name"
        class="sorted-planet"
      >
        <img :src="planet.img" :alt="planet.name || 'Planet'" />
        <p>{{ planet.name }}</p>
      </div>
    </div>

    <button @click="checkAnswer" class="check-btn">Check Answer</button>
    <button @click="resetGame" class="reset-btn">Reset</button>

    <div v-if="showWinPopup" class="popup-overlay">
      <div class="popup">
        <h2>🎉 Congratulations!</h2>
        <p>You sorted all the planets!</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>

    <div v-if="showErrorPopup" class="popup-overlay">
      <div class="popup">
        <h2>❌ Please try again!</h2>
        <p>You got it wrong!</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// mercury < mars < venus < earth < neptune < uranus < saturn < jupiter
const originalPlanets = [
  { name: 'Mercury', size: 4879, img: '/pic/merc trans.png' },
  { name: 'Venus', size: 12104, img: '/pic/venus trans.png' },
  { name: 'Earth', size: 12742, img: '/pic/earth trans.png' },
  { name: 'Mars', size: 6779, img: '/pic/mars trans.png' },
  { name: 'Jupiter', size: 139820, img: '/pic/jupiter trans.png' },
  { name: 'Saturn', size: 116460, img: '/pic/saturn trans.png' },
  { name: 'Uranus', size: 50724, img: '/pic/uranus trans.png' },
  { name: 'Neptune', size: 49244, img: '/pic/neptune trans.png' },
]

const planets = ref([...originalPlanets])
const draggedPlanet = ref(null)
const sortedPlanets = ref([])
const sortType = ref('size')
const showWinPopup = ref(false)
const showErrorPopup = ref(false)

const pickupSound = new Audio('src/sounds/take-it-90781 (mp3cut.net).mp3')

function playPickupSound() {
  pickupSound.currentTime = 0
  pickupSound.play()
}

function startDrag(planet) {
  draggedPlanet.value = planet
  playPickupSound()
}

function dropPlanet() {
  if (draggedPlanet.value) {
    sortedPlanets.value.push(draggedPlanet.value)
    planets.value = planets.value.filter(p => p.name !== draggedPlanet.value.name)
    draggedPlanet.value = null
  }
}

function resetGame() {
  planets.value = shuffleArray(originalPlanets)
  sortedPlanets.value = []
  showErrorPopup.value = false
  showWinPopup.value = false
}

function closePopup() {
  showErrorPopup.value = false
  showWinPopup.value = false
}

const planetOrder = [
  'Mercury', 'Venus', 'Earth', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune'
]

function checkAnswer() {
  showErrorPopup.value = false
  showWinPopup.value = false

  if (sortedPlanets.value.length !== 8) {
    showErrorPopup.value = true
    return
  }

  if (sortType.value === 'size') {
    for (let i = 0; i < sortedPlanets.value.length - 1; i++) {
      if (sortedPlanets.value[i].size > sortedPlanets.value[i + 1].size) {
        showErrorPopup.value = true
        return
      }
    }
  } else if (sortType.value === 'arrangement') {
    for (let i = 0; i < sortedPlanets.value.length; i++) {
      if (sortedPlanets.value[i].name !== planetOrder[i]) {
        showErrorPopup.value = true
        return
      }
    }
  }

  showWinPopup.value = true
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

watch(sortType, () => {
  resetGame()
})

let touchElement = null

function touchStart(planet, event) {
  draggedPlanet.value = planet
  touchElement = event.target.closest('.planet')
  playPickupSound()
}

function touchMove(event) {
  if (touchElement) {
    touchElement.style.position = 'absolute'
    touchElement.style.zIndex = 999
    touchElement.style.left = `${event.touches[0].clientX - 40}px`
    touchElement.style.top = `${event.touches[0].clientY - 40}px`
  }
}

function touchEnd(event) {
  const dropArea = document.querySelector('.drop-area')
  const dropRect = dropArea.getBoundingClientRect()
  const touch = event.changedTouches[0]

  if (
    touch.clientX > dropRect.left &&
    touch.clientX < dropRect.right &&
    touch.clientY > dropRect.top &&
    touch.clientY < dropRect.bottom
  ) {
    dropPlanet()
  }

  if (touchElement) {
    touchElement.style = null
    touchElement = null
  }
}

</script>

<!------------------------------- S T Y L E ------------------------------>
<style scoped>
  .sorting-game {
    text-align: center;
    padding: 2rem;
    color: white;
    font-family: 'Fredoka', sans-serif;
    background-image: url('/pic/just bg1.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
  }
  
  .drag-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    touch-action: none;
  }
  
  .planet {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
    width: 100px;
    text-align: center;
    cursor: grab;
  }
  
  .planet img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .drop-area {
    min-height: 150px;
    border: 2px dashed #42b983;
    padding: 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }
  
  .sorted-planet {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    padding: 10px;
    border-radius: 10px;
    width: 100px;
    text-align: center;
  }
  
  .sorted-planet img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .congratulations {
    margin-top: 2rem;
    font-size: 1.5rem;
    color: #42b983;
  }

  .check-btn, .reset-btn {
    margin: 1rem 0.5rem;
    padding: 0.5rem 1.5rem;
    background-color: #fecf08;
    border: 2px solid #ff8800;
    border-radius: 12px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.3s;
  }

  .check-btn:hover, .reset-btn:hover {
    background-color: #ffd84d;
  }

  .error-popup {
    margin-top: 1rem;
    color: #ff4444;
    font-weight: bold;
    font-size: 1.2rem;
  }

  label, select {
    font-size: 1rem;
    margin-bottom: 1rem;
    display: block;
  }

  select {
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    border: 2px solid #42b983;
    font-family: 'Fredoka', sans-serif;
  }

  .sorting-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  button:active {
    transform: scale(0.96);
    background-color: #e6b800;
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

  @media (max-width: 600px) {
  .planet,
  .sorted-planet {
    width: 80px;
  }

  .planet img,
  .sorted-planet img {
    width: 50px;
    height: 50px;
  }

  .check-btn,
  .reset-btn {
    width: 90%;
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .sorting-controls {
    width: 100%;
    padding: 0 1rem;
  }
}

  </style>
