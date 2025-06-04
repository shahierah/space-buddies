<template>
  <div class="word-search">
    <h2 style="font-weight: bold;">Word Search: Find the Planet Names!</h2>

    <div class="difficulty-selector">
      <label for="difficulty">Choose difficulty:</label>
      <select v-model="selectedLevel" id="difficulty" @change="loadLevel">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <div class="words-to-find">
      <h3>Words to Find:</h3>
      <ul>
        <li
          v-for="(word, index) in words"
          :key="index"
          :class="{ found: foundWords.includes(word) }"
        >
          {{ word }}
        </li>
      </ul>
    </div>

    <div class="grid" :style="{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }">
      <div
        v-for="(letter, index) in grid"
        :key="index"
        class="cell"
        :class="{ selected: selectedIndices.includes(index), found: foundCells.includes(index) }"
        @click="selectLetter(index)"
      >
        {{ letter }}
      </div>
    </div>

    <div class="message" v-if="message">{{ message }}</div>

    <div class="button-group">
      <button @click="resetSelection">Clear Letters</button>
      <button @click="restartGame">Reset</button>
    </div>

    <div v-if="showWinPopup" class="popup-overlay">
      <div class="popup">
        <h2>🎉 Congratulations!</h2>
        <p>You found all the planets!</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const selectedLevel = ref('easy')
const numRows = ref(9)
const numCols = ref(8)
const grid = ref([])
const words = ref([])
const foundWords = ref([])
const selectedIndices = ref([])
const message = ref('')
const foundCells = ref([])
const showWinPopup = ref(false)

const levels = {
  easy: ['EARTH', 'MARS', 'VENUS'],
  medium: ['EARTH', 'MARS', 'VENUS', 'JUPITER'],
  hard: ['MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE']
}

watch(selectedLevel, loadLevel)

function loadLevel() {
  if (selectedLevel.value === 'easy') {
    numRows.value = 7
    numCols.value = 6
  } else if (selectedLevel.value === 'medium') {
    numRows.value = 9
    numCols.value = 8
  } else if (selectedLevel.value === 'hard') {
    numRows.value = 11
    numCols.value = 10
  }

  const levelWords = levels[selectedLevel.value]
  words.value = levelWords
  foundWords.value = []
  foundCells.value = []
  selectedIndices.value = []
  message.value = ''
  generateGrid(levelWords)
}

function restartGame() {
  loadLevel()
}

function getRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function generateGrid(wordList) {
  const totalCells = numRows.value * numCols.value
  const tempGrid = Array(totalCells).fill(null)

  for (const word of wordList) {
    let placed = false
    let attempts = 0

    while (!placed && attempts < 100) {
      const isHorizontal = Math.random() > 0.5
      const rowLimit = numRows.value - (isHorizontal ? 0 : word.length)
      const colLimit = numCols.value - (isHorizontal ? word.length : 0)
      const row = Math.floor(Math.random() * rowLimit)
      const col = Math.floor(Math.random() * colLimit)

      let canPlace = true
      for (let i = 0; i < word.length; i++) {
        const index =
          (row + (isHorizontal ? 0 : i)) * numCols.value +
          (col + (isHorizontal ? i : 0))
        if (tempGrid[index] && tempGrid[index] !== word[i]) {
          canPlace = false
          break
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const index =
            (row + (isHorizontal ? 0 : i)) * numCols.value +
            (col + (isHorizontal ? i : 0))
          tempGrid[index] = word[i]
        }
        placed = true
      }

      attempts++
    }
  }

  for (let i = 0; i < tempGrid.length; i++) {
    if (!tempGrid[i]) tempGrid[i] = getRandomLetter()
  }

  grid.value = tempGrid
}

function selectLetter(index) {
  if (selectedIndices.value.includes(index)) return
  selectedIndices.value.push(index)

  const selectedHorizontal = buildWordHorizontal()
  const selectedVertical = buildWordVertical()

  if (words.value.includes(selectedHorizontal) && !foundWords.value.includes(selectedHorizontal)) {
    foundWords.value.push(selectedHorizontal)
    foundCells.value.push(...selectedIndices.value)
    message.value = `✅ Good job! You found "${selectedHorizontal}"!`
    selectedIndices.value = []
  } else if (words.value.includes(selectedVertical) && !foundWords.value.includes(selectedVertical)) {
    foundWords.value.push(selectedVertical)
    foundCells.value.push(...selectedIndices.value)
    message.value = `✅ Good job! You found "${selectedVertical}"!`
    selectedIndices.value = []
  }

  if (selectedIndices.value.length > 10) {
    selectedIndices.value = []
    message.value = ''
  }

  if (foundWords.value.length === words.value.length) {
    showWinPopup.value = true
  }
}

function closePopup() {
  showWinPopup.value = false
}

function buildWordHorizontal() {
  const rows = selectedIndices.value.map(i => Math.floor(i / numCols.value))
  const sameRow = rows.every(r => r === rows[0])
  if (!sameRow) return ''
  const sortedIndices = [...selectedIndices.value].sort((a, b) => a - b)
  return sortedIndices.map(i => grid.value[i]).join('')
}

function buildWordVertical() {
  const cols = selectedIndices.value.map(i => i % numCols.value)
  const sameCol = cols.every(c => c === cols[0])
  if (!sameCol) return ''
  const sortedIndices = [...selectedIndices.value].sort((a, b) => a - b)
  return sortedIndices.map(i => grid.value[i]).join('')
}

function resetSelection() {
  selectedIndices.value = []
  message.value = ''
}

loadLevel()
</script>

<style scoped>
.word-search {
  text-align: center;
  padding: 2rem;
  font-family: 'Fredoka', sans-serif;
  color: white;
  background-image: url('/pic/just bg.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
  gap: 5px;
  margin: 1rem auto;
  width: 100%;
  max-width: 100vw;
  padding: 0 1rem;
  box-sizing: border-box;
  overflow-x: auto;
}

.cell {
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ccc;
  font-weight: bold;
  font-size: clamp(12px, 3vw, 1.3rem);
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.cell.selected {
  background: #ffd700;
}

.cell.found {
  background-color: #4caf50 !important;
  color: white;
}

.words-to-find ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  list-style: none;
  padding: 0;
}

.words-to-find li.found {
  text-decoration: line-through;
  color: rgb(0, 185, 0);
}

.message {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: rgb(0, 255, 100);
  font-weight: bold;
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
  max-width: 150px;
  box-shadow: 0 5px 0 #c27000;
  transition: all 0.2s ease;
  position: relative;
}

button:active {
  transform: scale(0.96);
  background-color: #e6b800;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.difficulty-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

label, select {
  font-size: 1rem;
}

select {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 2px solid #42b983;
  font-family: 'Fredoka', sans-serif;
}

.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
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

</style>