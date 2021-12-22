import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HelloWorld from "@/components/HelloWorld.vue"
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HelloWorld,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
