<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="logo">space buddies</div>
      <button class="hamburger" @click="toggleNavbar">☰</button>
    </div>
    <nav :class="['nav-links', { open: isNavOpen }]">
      <RouterLink to="/" exact-active-class="active-link" @click="closeMenu">Home</RouterLink>
      <RouterLink to="/match" exact-active-class="active-link" @click="closeMenu">Planet Match</RouterLink>
      <RouterLink to="/wordsearch" exact-active-class="active-link" @click="closeMenu">Word Search</RouterLink>
      <RouterLink to="/sort" exact-active-class="active-link" @click="closeMenu">Sorting Game</RouterLink>
      <RouterLink to="/planetbuilder" exact-active-class="active-link" @click="closeMenu">Build a Planet</RouterLink>
      <RouterLink to="/facts" exact-active-class="active-link" @click="closeMenu">Planet Facts</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
    <AudioPlayer />
  </main>

  <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top">↑</button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AudioPlayer from './views/AudioPlayer.vue'

const isNavOpen = ref(false)

const openSound = new Audio('src/sounds/8-bit-game-sfx-sound-6-269965.mp3')
const closeSound = new Audio('src/sounds/8-bit-game-sfx-sound-6-269965.mp3')
openSound.volume = 1
closeSound.volume = 1

function toggleNavbar() {
  isNavOpen.value = !isNavOpen.value
  const sound = isNavOpen.value ? openSound : closeSound
  sound.currentTime = 0
  sound.play()
}

function closeMenu() {
  closeSound.currentTime = 0
  closeSound.play()
  isNavOpen.value = false
}

const showBackToTop = ref(false)

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  background-color: #232a52;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: 'Fredoka', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.hamburger {
  display: none;
  font-size: 1.5rem;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 20px;
}

.nav-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.active-link {
  background-color: #FECF08;
  color: #232a52 !important;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease;
  }

  .nav-links.open {
    max-height: 300px;
    opacity: 1;
  }
}

.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: white;
  color: #232a52;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.back-to-top:hover {
  background-color: #FECF08;
}
</style>
