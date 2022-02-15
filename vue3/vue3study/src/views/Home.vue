<template>
  {{ datamsg }}
  {{ setupmsg }}
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue"

export default defineComponent({
  name: "Home",
  components: {},
  data() {
    return {
      datamsg: this.setupmsg + "2",
    }
  },
  setup() {
    const user = reactive({
      name: "小浪",
      age: 21,
    })

    let userObj = toRefs(user)
    console.log(userObj, user)

    return {
      setupmsg: "这是setup的数据1",
      ...userObj,
    }
  },
})
</script>
