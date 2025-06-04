// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Use the exact view components you listed
import AboutView         from '@/views/AboutView.vue'
import HomeView          from '@/views/HomeView.vue'
import PlanetMatchView   from '@/views/MatchView.vue'
import WordSearchView    from '@/views/WordSearchView.vue'
import SortingGameView    from '@/views/SortingGameView.vue'
import PlanetBuilder    from '@/views/PlanetBuilder.vue'
import PlanetFactsView   from '@/views/PlanetFactsView.vue'

const routes = [
  { path: '/',              name: 'Home',            component: HomeView },
  { path: '/about',         name: 'About',           component: AboutView },
  { path: '/match',         name: 'PlanetMatch',     component: PlanetMatchView },
  { path: '/wordsearch',    name: 'WordSearch',      component: WordSearchView },
  { path: '/sort',          name: 'SortingGame',     component: SortingGameView },
  { path: '/planetbuilder', name: 'PlanetBuilder',   component: PlanetBuilder },
  { path: '/facts',         name: 'PlanetFacts',     component: PlanetFactsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router