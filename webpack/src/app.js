import './assets/css/style.css'
import avatarImg from './assets/img/avatar.jpg'

(() => {
  console.log('test')
  const img = document.createElement('img')
  console.log(img)
  img.src=avatarImg

  console.log(avatarImg)
})()

// import Vue from 'vue'
// import App from './App.vue'
//
// new Vue({
//   render: h => h(App)
// }).$mount('#app')