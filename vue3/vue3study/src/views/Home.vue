<template>
  {{ datamsg }}
  {{ setupmsg }}
  <div>
    <input v-model="keyword" />
    <p>{{ keyword }}</p>
  </div>

  <ul>
    <li class="li_1"></li>
    <li class="li_2"></li>
    <li class="li_3"></li>
  </ul>
  <teleport :to="target">
    <img src="https://img0.baidu.com/it/u=3077713857,1222307962&fm=26&fmt=auto&gp=0.jpg" style="width: 30px" />
  </teleport>
  <div class="btnGroup">
    <button @click="target = '.li_1'">传送1</button>
    <button @click="target = '.li_2'">传送2</button>
    <button @click="target = '.li_3'">传送3</button>
    <button @click="target = '.mumu'">传送4</button>
  </div>
  <div class="mumu"></div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, customRef, ref } from "vue"
function useDebouncedRef<T>(value: T, delay = 200) {
  let timeout: number
  return customRef((track, trigger) => {
    return {
      get() {
        // 告诉Vue追踪数据
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          // 告诉Vue去触发界面更新
          trigger()
        }, delay)
      },
    }
  })
}

export default defineComponent({
  name: "Home",
  components: {},
  data() {
    return {
      datamsg: this.setupmsg + "2",
    }
  },
  setup() {
    const keyword = useDebouncedRef("")
    let target = ref(".li_1")
    const user = reactive({
      name: "小浪",
      age: 21,
    })

    let userObj = toRefs(user)
    console.log(userObj, user)

    return {
      setupmsg: "这是setup的数据1",
      ...userObj,
      keyword,
      target,
    }
  },
})
</script>
