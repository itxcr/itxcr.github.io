### 简单的 Vuex

- state 设置初始变量

- getters

  - 接受 state 作为其第一个参数
  - 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算

- mutations

  - 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation

  - 接受 state 作为第一个参数

  - 使用常量替代 mutation 事件类型

    ```js
    // mutation-types.js
    export const SOME_MUTATION = 'SOME_MUTATION'
    ```

    ```js
    // store.js
    import Vuex from 'vuex'
    import { SOME_MUTATION } from './mutation-types'
    
    const store = new Vuex.Store({
      state: { ... },
      mutations: {
        // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
        [SOME_MUTATION] (state) {
          // mutate state
        }
      }
    })
    ```

  - mutation 必须是同步函数

- actions

  - action 提交的是 mutation，而不是直接变更状态

  - action 可以包含任意异步操作

    ```js
    // 注册一个 action
    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      },
      actions: {
        increment (context) {
          context.commit('increment')
        }
      }
    }) 
    // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
    ```

  - 实践中，我们会经常用到 ES2015 的 [参数解构 (opens new window)](https://github.com/lukehoban/es6features#destructuring)来简化代码（特别是我们需要调用 `commit` 很多次的时候）：

    ```js
    actions: {
      increment ({ commit }) {
        commit('increment')
      }
    }
    ```

  - Action 通过 `store.dispatch` 方法触发：

- modules

  ```js
  import state, { AppState } from '@/store/modules/app/state'
  import { RootState } from '@/store'
  import { Module } from 'vuex'
  import actions from '@/store/modules/app/actions'
  import mutations from '@/store/modules/app/mutations'
  import getters from '@/store/modules/app/getters'
  
  const app: Module<AppState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  }
  
  export default app
  ```

  ```js
  import { Module } from 'vuex'
  import state, { ChatState } from '@/store/modules/chat/state'
  import { RootState } from '@/store'
  import actions from '@/store/modules/chat/actions'
  import mutations from '@/store/modules/chat/mutations'
  import getters from '@/store/modules/chat/getters'
  
  const chat: Module<ChatState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  }
  
  export default chat
  ```

  ```js
  import Vue from 'vue'
  import Vuex, { ModuleTree } from 'vuex'
  // app
  import app from '@/store/modules/app'
  import { AppState } from '@/store/modules/app/state'
  
  // chat
  import chat from '@/store/modules/chat'
  import { ChatState } from '@/store/modules/chat/state'
  
  export type RootState = {
    app: AppState,
    chat: ChatState
  }
  
  Vue.use(Vuex)
  
  const modules: ModuleTree<RootState> = {
    app,
    chat,
  }
  
  export default new Vuex.Store({
    modules,
  })
  ```

### 项目结构

1. 应用层级的状态应该集中到单个 store 对象中
2. 提交 **mutation** 是更改状态的唯一方法，并且这个过程是同步的
3. 异步逻辑都应该封装到 **action** 里面











### 1. state

state就是根据你项目的需求，自己定义的一个数据结构，里面可以放些通用的状态。

```csharp
const state = {
  openId:"",
  storeId:"",
  storeName:''
}
```

例如上面所写的，这些状态可以在各个页面通过vuex访问。如下：

```kotlin
this.$store.state.openId = "111"
```

之前我一直通过上面的方式来修改state里面的状态值，行，肯定能用，但是好像官方并不建议我们这样使用，而是建议使用mutations来改变state里面的值，因为不通过mutations改变state，状态不会被同步。至于mutations下面会讲到。

### 2. getter

getter怎么理解呢？通俗的理解可以认为是getter里的函数就是vuex里的计算属性，类似于computed函数。

```jsx
const store = new Vuex.Store({ 
       state: {
            count: 0 
       },
       getters: {  // getters
            countAdd: function (state) {
                 return state.count++
            }
       },
       mutations: {
            increment (state) { 
                state.count++ 
            } 
      }
 })
```

getter函数怎么用呢？如上vuex里定义了一个getter函数countAdd。我们可以在vue文件里的computed计算属性里引用，如下。

```jsx
computed: {
     ...mapGetters{["countAdd"]} 
     show：function(){
           alert("这个是测试页面")
     }
}
```

这样我们可以直接在vue页面里取到countAdd的值{{countAdd}}即为1。

### 3. mutations

官方定义：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```cpp
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

```bash
store.commit('increment')
```

也可以向store.commit传入第二参数，也就是mutation的payload:

```bash
mutaion: {
    increment (state, n) {
        state.count += n;
    }
}
store.commit('increment', 10);
```

但是有时候，单个传入n可能并不能满足我们的业务需要，这时候我们可以选择传入一个payload对象：

```bash
mutation: { 
     increment (state, payload) { 
            state.totalPrice += payload.price + payload.count; 
     } 
} 
store.commit({
     type: 'increment', 
     price: 10, 
     count: 8
 })
```

不例外，mutations也有映射函数mapMutations，帮助我们简化代码，使用mapMutations辅助函数将组件中的methods映射为store.commit调用。

```csharp
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations({
        add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
这样我们可以在vue文件里直接调用函数：this.add()而不用this.$store.commit('increment')这样写了，简化了很多。
需要注意：Mutations必须是同步函数。
如果我们需要异步操作，Mutations就不能满足我们需求了，这时候我们就需要Actions了。
```

### 4. action

Action 类似于 mutation，不同在于：
Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。
官方demo如下：

```csharp
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

如果我在vue页面里想用action，我们可以分发 Action，Action 通过 store.dispatch 方法触发：

```bash
store.dispatch('increment')
```

Actions 支持同样的载荷方式和对象方式进行分发：

```go
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

我们也可以运用其映射函数：mapActions

```kotlin
methods:{
     ...mapActions{[
           "add":"increment "//函数命名不相同
       //  "increment ":"increment "//函数命名相同
     ]}
}
调用：this.add()即可。相同时候调用：this.increment()
```

### Modules

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

```cpp
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

总结起来：mutation 只管存，你给我（dispatch）我就存；action只管中间处理，处理完我就给你，你怎么存我不管（所有的改变state状态的都是mutation 来操作）；Getter 我只管取，我不改的（类似计算属性）。

