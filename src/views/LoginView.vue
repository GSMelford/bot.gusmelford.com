<template>
  <div class="main-container">
    <div class="login-form">
      <h2>Welcom to GusMelfordBot!</h2>
      <input v-model="telegramId" type="text" placeholder="TelegramId" required>
      <input v-model="password" type="password" placeholder="Password" required>
      <GusButton text="Login"></GusButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GusButton from '@/components/buttons/gusButton.vue'

export default defineComponent({
  name: 'LoginView',
  components: { GusButton },
  data () {
    return {
      telegramId: '',
      password: ''
    }
  },
  methods: {
  }
})
</script>

<style>
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body{
  background-color: #151414;
  margin: 0;
  padding: 0;
}

.main-container {
  width: 400px;
  font-family: 'Open Sans', sans-serif;
  color: snow;
  background-color: #232323;
  border-radius: 10px;
  box-shadow: #b92433 0 1px 4px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 50px 35px;
}

.login-form {
  text-align: center;
}

input {
  text-align: center;
  width: 80%;
  margin: 10px;
  height: 32px;
}

</style>
