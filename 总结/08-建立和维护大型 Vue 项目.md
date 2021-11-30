### 1. 使用插槽 （slot） 使组件更易于理解并且功能更强大

需要创建一个弹出窗口，乍一看，没有什么真正发杂的，只是包括标题，描述和一些按钮。所以把所有东西都当作属性。最后，使用三个属性来定制组件，当单机按钮时会发生一个事件，十分简单。

但是，随着项目的不断发展，团队要求在其中显示许多其他新内容：表单字段，不同的按钮（取决于显示在哪个页面上），卡片，页脚和列表。如果继续使用属性来使这个组件不断扩展，似乎也可以。但是，该组件很快就变得太复杂了，以至于无法理解，因为它包含了无数的子组件，使用了太多的属性并发出了大量事件。有一种可怕的情况，当在某处进行更改时，它最终以某种方式破坏了另一页上的其他内容。

如果一开始就依赖插槽，情况可能会更好。下面这个小组件更易于维护，可扩展性更高。

```vue
<template>
  <div class="c-base-popup">
    <div v-if="$slots.header" class="c-base-popup__header">
      <slot name="header">
    </div>
    <div v-if="$slots.subheader" class="c-base-popup__subheader">
      <slot name="subheader">
    </div>
    <div class="c-base-popup__body">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="c-base-popup__actions">
      <slot name="actions">
    </div>
    <div v-if="$slots.footer" class="c-base-popup__footer">
      <slot name="footer">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    }
  }
} 
</script> 
```

根据经验，由知道何时使用插槽的开发人员构建的项目确实对其未来的可维护性有很大的影响。这样就可以减少发出事件的次数，使代码更易于理解，并且可以在内部显示所需的任何组件时提供更大的灵活性。

### 2. 正确组织 Vuex 存储

根据它们从 API 提取的数据模型来组织它们更容易理解

- 用户数
- 队伍
- 留言内容
- 小部件
- 文章

从长远来看，组织良好的 Vuex 存储将使团队更具生产力。

### 3. 使用操作 （Vuex Actions）进行 API 调用和提交数据

大多数 API 调用都在 Vuex 操作 (vuex actions ) 中进行，

这么做的原因仅仅是因为它们中的大多数都提取了需要存储 (vuex store) 中提交的数据。此外，它还提供了封装性和可重用性。这么做，还有一些其他原因：

- 如果需要在两个不同的地方（例如博客和首页）获取文章的首页，则可以使用正确的参数调用适当的调度程序。数据将被提取，提交和返回，除了调度程序调用外，没有重复代码
- 如果需要创建一些逻辑来避免在提取第一页时提取它，则可以在一个地方进行。除了减少服务器上的负载之外，还有信心它可以在任何地方使用
- 可以在这些操作（vuex actions） 中跟踪大多数 Mixpanel 事件，从而使分析代码库真正易于维护。

### 4. 使用 mapState、mapGetters、mapMutations 和 mapAction 简化代码库

当只需要访问 `state/getter` 或在组件内部调用 `action/mutation` 时，通常无需创建多个计算属性或方法。使用 `mapState mapGetters mapMutations 和 mapActions` 可帮助缩短代码，通过分组来化繁为简，在存储模块一个地方就能掌握全局

```js
// NPM
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  computed: {
    // Accessing root properties
    ...mapState("my_module", ["property"]),
    // Accessing getters
    ...mapGetters("my_module", ["property"]),
    // Accessing non-root properties
    ...mapState("my_module", {
      property: state => state.object.nested.property
    })
  },
  methods: {
    // Accessing actions
    ...mapActions("my_module", ["myAction"]),
    // Accessing mutations
    ...mapMutations("my_module", ["myMutation"])
  }
}; 
```

### 5. 使用 API 工厂

建一个 `this.$api` 可以在任何地方调用以获取 API 端点的助手。在项目的根目录下，有一个 `api` 包含所有类的文件夹

```
api
├── auth.js
├── notifications.js
└── teams.js 
```

每个节点都将其类别的所有端点分组。这是使用 Nuxt 程序中使用插件初始化此模式的方式

```js
// PROJECT: API
import Auth from "@/api/auth";
import Teams from "@/api/teams";
import Notifications from "@/api/notifications";
export default (context, inject) => {
  if (process.client) {
    const token = localStorage.getItem("token");
    // Set token when defined
    if (token) {
      context.$axios.setToken(token, "Bearer");
    }
  }
  // Initialize API repositories
  const repositories = {
    auth: Auth(context.$axios),
    teams: Teams(context.$axios),
    notifications: Notifications(context.$axios)
  };
  inject("api", repositories);
}; 
```

```js
export default $axios => ({
  forgotPassword(email) {
    return $axios.$post("/auth/password/forgot", { email });
  },
  login(email, password) {
    return $axios.$post("/auth/login", { email, password });
  },
  logout() {
    return $axios.$get("/auth/logout");
  },
  register(payload) {
    return $axios.$post("/auth/register", payload);
  }
}); 
```

现在，我可以简单地在我的组件或 Vuex 操作中调用它们，如下所示：

```js
export default {
  methods: {
    onSubmit() {
      try {
        this.$api.auth.login(this.email, this.password);
      } catch (error) {
        console.error(error);
      }
    }
  }
}; 
```

### 6. 使用 $config 访问环境变量

```
config
├── development.json
└── production.json 
```

可以通过 `this.$config` 快速访问它们

```js
// NPM
import Vue from "vue";
// PROJECT: COMMONS
import development from "@/config/development.json";
import production from "@/config/production.json";
if (process.env.NODE_ENV === "production") {
  Vue.prototype.$config = Object.freeze(production);
} else {
  Vue.prototype.$config = Object.freeze(development);
} 
```

### 7. 遵循一个约定来写提交注释

随着项目的发展，需要定期浏览组件的提交历史记录。如果没有遵循相同的约定来书写提交说明，那么将很难理解每个团队成员的行为

推荐使用 Angular commit 消息准则

遵循这些准则会导致更具可读性的消息，从而在查看项目历史记录时更易于跟踪提交：

```git
git commit -am "<type>(<scope>): <subject>"
# Here are some samples
git commit -am "docs(changelog): update changelog to beta.5"
git commit -am "fix(release): need to depend on latest rxjs and zone.js" 
```

看看他们的README文件以了解更多约定

### 8. 始终在生产项目时冻结软件包的版本 

所有软件包都应遵循语义版本控制规则。但实际情况是，其中一些并非如此

为避免因一个依赖项在半夜醒来破坏了整个项目，锁定所有软件包的版本会使工作压力减轻

它的意思很简单：避免使用以`^`开头的版本：

```json
{
  "name": "my project",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "0.19.0",
    "imagemin-mozjpeg": "8.0.0",
    "imagemin-pngquant": "8.0.0",
    "imagemin-svgo": "7.0.0",
    "nuxt": "2.8.1",
  },
  "devDependencies": {
    "autoprefixer": "9.6.1",
    "babel-eslint": "10.0.2",
    "eslint": "6.1.0",
    "eslint-friendly-formatter": "4.0.1",
    "eslint-loader": "2.2.1",
    "eslint-plugin-vue": "5.2.3"
  }
} 
```

### 9. 显示大量数据时使用 Vue 虚拟滚动条

当需要在给定页面中显示很多行或需要循环访问大量数据时，可使用 `vue-virtual-scoller`

```bash
yarn add vue-virtual-scroller
```

它将仅渲染列表中的可见项，并重用组件和dom元素，以使其尽可能高效。它真的很容易使用，顺滑得很！

```html
<template>
 <RecycleScroller
  class="scroller"
  :items="list"
  :item-size="32"
  key-field="id"
  v-slot="{ item }"
 \>
  <div class="user">
   {{ item.name }}
  </div>
 </RecycleScroller>
</template> 
```

