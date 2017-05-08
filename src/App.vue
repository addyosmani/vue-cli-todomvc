<template>
  <div id="app">
    <Todos></Todos>
  </div>
</template>

<script>
import Todos from './components/Todos'

export default {
    name: 'app',
    components: {
        Todos
    }
}
</script>
<style>
  #app {
    width: 400px;
    margin: 0 40px;
  }
</style>
