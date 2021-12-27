import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from 'v-viewer'

Vue.config.productionTip = false

// 引入 ant-design
import './themes/ant-design'
// 引入 moment
import moment from 'moment'

Vue.config.productionTip = false

// 设置 moment
Vue.prototype.$moment = moment

// 图片预览插件
import '@/assets/css/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false,
    title: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 4,
      reset: 4,
      prev: 0,
      next: 0,
      rotateLeft: 4,
      rotateRight: 4,
      flipHorizontal: 4,
      flipVertical: 4,
    },
  },
})
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
