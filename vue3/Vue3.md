## 创建项目

- 使用 vue-cli 创建并选择 vue3 + ts

## 基础语法

### 定义data

- script标签上lang="ts"
- 定义一个类型`type`或者接口`interface`来约束`data`
- 可以使用`ref`或者`toRefs`来定义响应式数据
- 使用`ref`在`setup`读取的时候需要获取`xxx.value`,但在`template`中不需要
- 使用`reactive`时，可以用`toRefs`解构导出，在`template`就可以直接使用了

```vue
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';

type Todo = {
  id: number,
  name: string,
  completed: boolean
}

export default defineComponent({
  const data = reactive({
    todoList: [] as Todo[]
  })
  const count = ref(0);
  console.log(count.value)
  return {
    ...toRefs(data)
  }
})
</script>
```

