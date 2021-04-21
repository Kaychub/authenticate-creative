<template>
  <div class="home">
      <Swatches :swatches='this.$root.$data.swatches' />
  </div>
</template>

<script>
// @ is an alias to /src
import Swatches from '../components/Swatches.vue'

export default {
  name: 'Home',
  components: {
    Swatches
  },
}
</script>

<style scoped>
</style>