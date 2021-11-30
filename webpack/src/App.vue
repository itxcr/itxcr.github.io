<template>
  <div id="app">
    <h1>{{ title }}</h1>
    <img src="./assets/img/avatar.jpg" alt="">
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        title: 'Vue App'
      }
    }
  }
</script>

<style lang="css">
  h1 {
    color: #09c;
  }
</style>