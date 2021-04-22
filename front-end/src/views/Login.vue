<template>
  <div class="home">
    <div class='reg-login'>
      <div class='register'>
        <h2>Register</h2>
        <div class='names'>
          <input type='text' v-model='displayName' placeholder="Display Name" />
        </div>
        <div class='username-password'>
          <input type='text' v-model='username' placeholder='Username' />
          <input type='password' v-model='password' placeholder='Password' />
        </div>
        <button @click='register()'>Register</button>
      </div>
      <div class='login'>
        <h2>Login</h2>
        <div class='username-password'>
          <input type='text' v-model='usernameLogin' placeholder='Username' />
          <input type='password' v-model='passwordLogin' placeholder='Password' />
        </div>
        <button @click='login()'>Login</button>
      </div>
    </div>
    <div class='error' v-if='this.error || this.errorLogin'>
      <h2>Something went wrong!</h2>
      <p v-if='this.error'>{{ this.error }}</p>
      <p v-if='this.errorLogin'>{{ this.errorLogin }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Home',
  data() { return {
    error: '',
    errorLogin: '',
    displayName: '',
    username: '',
    password: '',
    usernameLogin: '',
    passwordLogin: '',
  }},
  components: {
  },
  methods: {
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.displayName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          displayName: this.displayName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.displayName = '';
        this.username = '';
        this.password = '';
        this.$router.push({ path: '/Select' });
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
        this.usernameLogin = '';
        this.passwordLogin = '';
        this.$router.push({ path: '/Select' });
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    }
  }
}
</script>

<style scoped>
/*
TODO
-> Add media queries
--> When screen gets small, make reg/login stack vertical
*/
@media (max-width:500px) {
  .reg-login {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
  }
  .register, .login {
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }
  .register {
    margin-bottom: 20px;
  }
}

@media (min-width:500px) {
  .reg-login {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 18px;
  }
  .register, .login {
    border: 1px solid black;
    border-radius: 10px;
    width: 35%;

    display: flex;
    flex-direction: column;
  }
}

.register button, .login button {
  margin-top: auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

input {
  /* border: none; */
  margin-bottom: 2px;
  padding: 8px 0;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  width: 95%;
  /* border-top-left-radius: 10px;
  border-top-right-radius: 10px; */
  border-radius: 10px;
}

input:focus {
  outline: none;
}

button {
  height: 30px;
  font-size: 18px;
}

</style>