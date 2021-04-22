<template>
  <div id="app">
    <img src='/vue-creative-logo.svg' />
    <div class='login-info'>
      <div v-if='this.$root.$data.user'>
        <p>Logged in as {{this.$root.$data.user.displayName}}</p>
        <button @click='logout'>Log out</button>
      </div>
      <div v-else>
        <router-link to='/'>Log in here</router-link>
      </div>
    </div>
    <div id="nav">
      <div class='select-palette'>
        <router-link to="/Select">Select Palette</router-link>
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
import axios from 'axios';

export default {
  components: {
    Footer,
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete('/api/users');
        this.$root.$data.user = null;
      } catch (error) {
        console.log(error);
      }
    }
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
