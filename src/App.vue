<template>
  <div id="app">
    <Header />
		<Section/>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Section from './components/Section.vue'

export default {
  name: 'App',
  components: {
		Header,
		Section
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
