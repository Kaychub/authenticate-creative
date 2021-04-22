<template>
  <div id="app">
    <div class='logo-login'>
      <img src='/vue-creative-logo.svg' />
      <div class='login-info'>
        <div class='logged-in' v-if='this.$root.$data.user'>
          <h4>{{this.$root.$data.user.displayName}}</h4>
          <button @click='logout'>Log out</button>
        </div>
      </div>
    </div>
    <div class='log-in-here' v-if='!this.$root.$data.user && this.$route.name != "Login"'>
      <button @click='goToLogin()'>Log in here</button>
    </div>
    <div v-else-if='!this.$root.$data.user'>
      <h2>Log in or register here</h2>
      <p>Or view others' palettes without logging in</p>
    </div>
    <div id="nav">
      <div class='select-palette'>
        <router-link to="/Select">Select Palette</router-link>
      </div>
      <div class='other-nav' v-if='this.$root.$data.selectedPaletteID'>
        <span class='user-logged-in-nav' v-if='this.$root.$data.user && this.$root.$data.selectedPaletteUserID === this.$root.$data.user._id'>
          <router-link to="/create">Create Swatches</router-link> |
          <router-link to="/edit/:paletteID/:swatchID">Edit Swatches</router-link> |
        </span>
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
        this.$root.$data.selectedPaletteID = 0;
        this.$root.$data.selectedPaletteUserID = 0;
        this.$router.push({ path: '/' });
      } catch (error) {
        console.log(error);
      }
    },
    goToLogin() {
      this.$root.$data.user = null;
      this.$root.$data.selectedPaletteID = 0;
      this.$root.$data.selectedPaletteUserID = 0;
      this.$router.push({ path: '/' });
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

.logo-login {
  display: grid;
  grid-template-columns: 48% 25% 25%;
  grid-template-areas: "None logo login";
}

img {
  max-width: 30px;
  grid-area: logo;
}

#nav {
  padding: 30px;
  padding-top: 10px;
}

.router-link {
  color: #1099B9;
}

.login-info {
  grid-area: login;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.logged-in {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
}

.logged-in h4 {
  margin: 5px 5px;
}

.logged-in button {
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.log-in-here {
  margin: 10px 0;
}

@media (max-width:500px) {
  .other-nav {
    display: flex;
    flex-direction: column;
  }
  .user-logged-in-nav {
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
