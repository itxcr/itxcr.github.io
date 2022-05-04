<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <about-view />
    <button @click="send"></button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import AboutView from '@/views/AboutView'
import Public from '@/utils/public'
export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    AboutView
  },
  methods: {
    send () {
      Public.$emit('test', '发送的数据')
    }
  }
}
</script>
