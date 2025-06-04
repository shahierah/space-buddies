<template>
  <div class="planet-builder">
    <h2 style="font-weight: bold;">Build Your Own Planet</h2>

    <!-- test -->
    <div class="editor">
      <div class="sidebar">
        <h3>Choose Elements</h3>
        <button @click="toggleRings">Toggle Rings</button>

        <div class="color-picker">
          <label>Color:</label>
          <input type="color" v-model="planetColor" />
        </div>

        <button @click="addMoon">Add Moon</button>
        <button @click="removeMoon">Remove Moon</button>
        <button @click="showCanvas = true">Draw Pattern</button>
      </div>

<div class="planet-frame">
  <div class="planet-preview">
    <div class="planet-container">
      <div class="planet" :style="{ backgroundColor: planetColor }"></div>
    <canvas
      ref="patternCanvas"
      class="pattern-canvas"
      v-show="showCanvas"
      width="150"
      height="150"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      ></canvas>
    </div>

    <div v-if="hasRings" class="ring-back"></div>

    <div
      v-for="(moon, index) in moonPositions"
      :key="index"
      class="moon"
      :style="moon"
    ></div>

    <div v-if="hasRings" class="ring-front"></div>
  </div>

  <div class="draw-controls">
    <!-- <button @click="toggleEraser">
      {{ isErasing ? 'Disable Eraser' : 'Enable Eraser' }}
    </button> -->
    <button @click="resetCanvas">Reset Drawing</button>
    <button @click="undo">Undo</button>
    <button @click="redo">Redo</button>
  </div>
</div>


    <p class="fact">{{ factMessage }}</p>
  </div>
</div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'

const hasRings = ref(false)
const planetColor = ref('#ffcc00')
const moons = ref(1)
const moonPositions = ref([])
const showCanvas = ref(false)

const patternCanvas = ref(null)
let context = null

const isDrawing = ref(false)
const isErasing = ref(false)

let drawingHistory = []
let redoHistory = []

function toggleRings() {
  hasRings.value = !hasRings.value
}

function addMoon() {
  if (moons.value < 10) moons.value++
}

function removeMoon() {
  if (moons.value > 0) moons.value--
}

function generateMoonPositions(count) {
  const positions = []
  const radius = 100
  const usedAngles = []

  for (let i = 0; i < count; i++) {
    let angle
    do {
      angle = Math.random() * 2 * Math.PI
    } while (usedAngles.some(a => Math.abs(a - angle) < 0.6))
    usedAngles.push(angle)
    const x = Math.cos(angle) * radius + 110
    const y = Math.sin(angle) * radius + 110
    positions.push({
      top: `${y}px`,
      left: `${x}px`,
    })
  }

  moonPositions.value = positions
}

watch(moons, (newVal) => {
  generateMoonPositions(newVal)
}, { immediate: true })

watch(showCanvas, (visible) => {
  if (visible) {
    nextTick(() => {
      const canvas = patternCanvas.value
      if (canvas) {
        context = canvas.getContext('2d')
        context.lineWidth = 2
        context.lineCap = 'round'
        context.strokeStyle = 'white'
        saveState() // Save initial state
      }
    })
  }
})

let lastX = 0
let lastY = 0

function startDrawing(event) {
  if (!context) return
  isDrawing.value = true

  const rect = patternCanvas.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  lastX = clientX - rect.left
  lastY = clientY - rect.top

  context.beginPath()
  context.moveTo(lastX, lastY)

  // Prevent page scroll on touch
  if (event.touches) event.preventDefault()
}

function draw(event) {
  if (!isDrawing.value || !context) return

  const rect = patternCanvas.value.getBoundingClientRect()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY

  const x = clientX - rect.left
  const y = clientY - rect.top

  context.strokeStyle = isErasing.value ? '#000000' : 'white'
  context.lineTo(x, y)
  context.stroke()

  lastX = x
  lastY = y

  // Prevent scrolling on mobile while drawing
  if (event.touches) event.preventDefault()
}

function stopDrawing() {
  if (isDrawing.value && context) {
    context.closePath()
    isDrawing.value = false
    saveState()
  }
}

function toggleEraser() {
  isErasing.value = !isErasing.value
}

function resetCanvas() {
  const canvas = patternCanvas.value
  if (canvas && context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawingHistory = []
    redoHistory = []
    saveState()
  }
}

function saveState() {
  const canvas = patternCanvas.value
  if (!canvas) return
  const data = canvas.toDataURL()
  drawingHistory.push(data)
  // Limit history to last 20 states
  if (drawingHistory.length > 20) {
    drawingHistory.shift()
  }
  redoHistory = [] // clear redo when new stroke is added
}

function restoreState(dataUrl) {
  const canvas = patternCanvas.value
  if (!canvas || !context) return
  const img = new Image()
  img.src = dataUrl
  img.onload = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(img, 0, 0)
  }
}

function undo() {
  if (drawingHistory.length > 1) {
    const last = drawingHistory.pop()
    redoHistory.push(last)
    restoreState(drawingHistory[drawingHistory.length - 1])
  }
}

function redo() {
  if (redoHistory.length > 0) {
    const state = redoHistory.pop()
    restoreState(state)
    drawingHistory.push(state)
  }
}

// Optional: keyboard shortcuts
function handleKeydown(e) {
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault()
    undo()
  } else if (e.ctrlKey && e.key === 'y') {
    e.preventDefault()
    redo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.planet-builder {
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

.editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.sidebar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
}

.sidebar button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar button:hover {
  background-color: #2e8b6d;
}

.planet-frame {
  padding: 3rem;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.planet-preview {
  width: 220px;
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.planet-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
}

.planet {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.pattern-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  border-radius: 50%;
  /* border: 2px solid red; */
}

.ring-back,
.ring-front {
  width: 300px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(60deg);
  border-radius: 50%;
}

.ring-back {
  border: 6px solid rgba(255, 255, 255, 0.3);
  z-index: 0;
}

.ring-front {
  border-top: 6px solid rgba(255, 255, 255, 0.6);
  border-left: transparent;
  border-right: transparent;
  border-bottom: transparent;
  z-index: 3;
}

.moon {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px #fff;
  z-index: 4;
}

.fact {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color: #ffccaa;
}

.draw-controls {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.draw-controls button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.draw-controls button:hover {
  background-color: #2e8b6d;
}

</style>
