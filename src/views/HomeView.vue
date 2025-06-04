<template>
  <div class="home">

    <img
      src="/pic/space%20buddies%20logo.png"
      alt="Space Buddies Logo"
      class="title-logo"
    />

    <div class="buttons">
      <RouterLink to="/match" class="game-button" @click="playClickSound">Planet Match</RouterLink>
      <RouterLink to="/wordsearch" class="game-button" @click="playClickSound">Word Search</RouterLink>
      <RouterLink to="/sort" class="game-button" @click="playClickSound">Sorting Game</RouterLink>
      <RouterLink to="/planetbuilder" class="game-button" @click="playClickSound">Build a Planet</RouterLink>
      <RouterLink to="/facts" class="game-button" @click="playClickSound">Planet Facts</RouterLink>
    </div>
  </div>
</template>

<!------------------------------- S C R I P T ------------------------------>
<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isSoundOn = ref(true)
const clickSound = new Audio('src/sounds/8-bit-game-sfx-sound-6-269965.mp3')

function toggleSound() {
  isSoundOn.value = !isSoundOn.value
}

function playClickSound() {
  if (isSoundOn.value) {
    clickSound.currentTime = 0
    clickSound.play()
  }
}
</script>

<!------------------------------- S T Y L E ------------------------------>
<style scoped>
.home {
  position: relative;
  text-align: center;
  padding: 2rem;
  height: 100vh;
  width: auto;
  background-image: url('/pic/just bg1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  font-family: 'Fredoka', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-logo {
  max-width: 100%;
  height: auto;
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.game-button {
  background-color: #FECF08;
  border: 2px solid #ff8800;
  padding: 0.8rem 2rem;
  border-radius: 20px;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  font-size: 1rem;
  width: 80%;
  max-width: 300px;
  box-shadow: 0 5px 0 #c27000;
  transition: all 0.2s ease;
  position: relative;
}

.game-button:active {
  top: 3px;
  box-shadow: 0 2px 0 #c27000;
}

@media (min-width: 600px) {
  .buttons {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .game-button {
    width: auto;
    min-width: 180px;
  }
}

.game-button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}


/* .sound-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  color: #fff;
  font-size: 1.5rem;
  border: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 10;
}

.sound-toggle:hover {
  background-color: rgba(255, 255, 255, 0.2);
} */

@font-face {
  font-family: 'Fredoka';
  src: url('@/assets/fonts/Fredoka.ttf') format('truetype');
}
</style>