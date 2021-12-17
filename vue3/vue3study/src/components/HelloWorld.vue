<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, toRefs } from "vue"

interface UserInfo {
  id: number
  name: string
  age: number
}

type Todo = {
  id: number
  name: string
  completed: boolean
}

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const data = reactive({
      todoList: [] as Todo[],
    })
    const count = ref(0)
    // 约束输入和输出类型
    const newTodo = (name: string): Todo => {
      return {
        id: count.value++,
        name,
        completed: false,
      }
    }

    const addTodo = (todo: Todo): void => {
      data.todoList.push(todo)
    }

    return {
      ...toRefs(data),
      count,
      newTodo,
      addTodo,
    }
  },
  props: {
    msg: {
      type: String,
    },
    userInfo: {
      type: Object as PropType<UserInfo>, // 泛型类型
      required: true,
    },
  },
})
</script>
