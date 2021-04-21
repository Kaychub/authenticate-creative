<template>
  <div id="app">
    <img src='/vue-creative-logo.svg' />
    <div id="nav">
      <div class='select-palette'>
        <router-link to="/">Select Palette</router-link>
      </div>
      <div class='other-nav' v-if='this.$root.$data.selectedPaletteID != 0'>
        <!-- <router-link to="/">Home</router-link> | -->
        <router-link to="/create">Create Swatches</router-link> |
        <router-link to="/edit/:paletteID/:swatchID">Edit Swatches</router-link> |
        <router-link to="/palette">View Palette</router-link>
      </div>
    </div>
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer.vue';

export default {
  components: {
    Footer,
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}

img {
  max-width: 30px;
}

#nav {
  padding: 30px;
  padding-top: 10px;
}

.router-link {
  color: #1099B9;
}

@media (max-width:500px) {
  .other-nav {
    display: flex;
    flex-direction: column;
  }
} 

#nav a {
  font-weight: bold;
  /* color: #2c3e50; */
  color: #1099B9;
}

#nav a.router-link-exact-active {
  padding: 10px;
  border-radius: 10px;
  background-color: #1099B9;
  color: white;
}

.select-palette {
  margin-bottom: 20px;
}

button {
  color: white;
  background-color: #1099B9;
}
</style>
