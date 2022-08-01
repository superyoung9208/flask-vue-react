<template>
  <div id="app">
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
</style>

<script>
import Navbar from './components/Base/Navbar.vue'

export default {
  name: 'App',
  components: {
    navbar: Navbar
  }
}
</script>
