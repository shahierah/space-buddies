<template>
  <div class="facts-page">
    <h1 style="font-weight: bold;">Planet Facts</h1>
    <div class="planet-list">
      <div v-for="planet in planets" :key="planet.name" class="planet-card">
        <img :src="planet.image" :alt="planet.name" class="planet-img" />
        <h2>{{ planet.name }}</h2>
        <p><strong>Color:</strong> {{ planet.color }}</p>
        <p><strong>Size:</strong> {{ planet.size }}</p>
        <ul>
          <li v-for="(fact, index) in planet.facts" :key="index">{{ fact }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<!------------------------------- S C R I P T ------------------------------>
<script setup>
const planets = [
  {
    name: 'Mercury',
    image: '/pic/merc trans.png',
    color: 'Gray',
    size: '4879 km, smallest planet, 1st in size',
    facts: [
      'It is closest to the Sun.',
      'A year on Mercury is just 88 days.',
    ],
  },
  {
    name: 'Venus',
    image: '/pic/venus trans.png',
    color: 'Yellowish-white',
    size: '12104 km, third smallest planet, 3rd in size',
    facts: [
      'It spins in the opposite direction of most planets.',
      'It is the hottest planet.',
    ],
  },
  {
    name: 'Earth',
    image: '/pic/earth trans.png',
    color: 'Blue and Green',
    size: '12742 km, Fourth smallest planet, 4th in size',
    facts: [
      'It is the only planet with organic life.',
      '70% of Earth is covered by water.',
    ],
  },
  {
    name: 'Mars',
    image: '/pic/mars trans.png',
    color: 'Red',
    size: '6779 km, second smallest planet,  2nd in size',
    facts: [
      'It is known as the Red Planet.',
      'It has the tallest volcano in the solar system.',
    ],
  },
  {
    name: 'Jupiter',
    image: '/pic/jupiter trans.png',
    color: 'White and Orange',
    size: '139820 km, the biggest planet, 8th in size',
    facts: [
      'It is very stormy',
      'It has 79 moons.',
    ],
  },
  {
    name: 'Saturn',
    image: '/pic/saturn trans.png',
    color: 'Brown',
    size: '116460 km, second biggest planet, 7th in size',
    facts: [
      'It has many rings.',
      'Can be seen from Earth with a telescope.',
    ],
  },
  {
    name: 'Uranus',
    image: '/pic/uranus trans.png',
    color: 'Light Blue',
    size: '50724 km, third biggest planet, 6th in size',
    facts: [
      'It is the coldest planet.',
      'It spins backward and on it side.',
    ],
  },
  {
    name: 'Neptune',
    image: '/pic/neptune trans.png',
    color: 'Dark Blue',
    size: '49244 km, fourth biggest planet, 5th in size',
    facts: [
      'It has a very fast wind',
      'It has 13 moons.',
    ],
  }
]
</script>

<!------------------------------- S T Y L E ------------------------------>
<style scoped>
.facts-page {
  padding: 2rem;
  background-image: url('/pic/just bg1.png');
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  font-family: 'Fredoka', sans-serif;
  text-align: center;
}

.planet-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.planet-card {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #FECF08;
  border-radius: 20px;
  padding: 1rem;
  width: 250px;
  text-align: center;
  backdrop-filter: blur(6px);
}

.planet-img {
  width: 120px;
  height: auto;
  margin-bottom: 1rem;
}
</style>
