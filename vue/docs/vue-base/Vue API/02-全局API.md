### 全局API

- ##### Vue.extend( options )

  - 参数

    {Object} options

  - 用法
    使用基础 Vue 构造器，创造一个“子类”。参数是一个包含组件选项的对象。

    data 选项是特例，需要注意 ：在 Vue.extend() 中它必须是函数

    ```html
    <div id="mount-point"></div>
    ```

    ```js
    // 创建构造器
    var Profile = Vue.extend({
      template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
      data: function() {
        return {
          firstName: 'Walter',
          lastName: 'White',
          alias: 'Heisenberg'
        }
      }
    })
    
    // 创建 Profile 实例，并挂载到一个元素上
    new Profile().$mount('#mount-point')
    ```

    结果如下

    ```html
    <p>Walter White aka Heisenberg</p>
    ```

- ##### Vue.nextTick( [callback, context] ) 

  - 参数

    {Function} [callback]

    {Object} [context]

  - 用法

    在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM

    ```js
    // 修改数据
    vm.msg = "Hello"
    // DOM 还没更新
    Vue.nextTick(function() {
      // DOM 更新了
    })
    
    // 作为一个 Promise 使用
    Vue.nextTick()
    	.then(function() {
      // DOM 更新了
    })
    ```

- ##### Vue.set( target, propertyName/index, value )

  - 参数

    {Objecet | Array} target

    {string | number} propertyName/index

    {any} value

  - 返回值

    设置的值

  - 用法

    响应式对象中添加一个 property， 并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property （如：this.myObject.newProperty = 'hi'）

  - 注意

    对象不能是 Vue 实例，或者 Vue 实例的根数据对象

- ##### Vue.delete( target, propertyName/index )

  - 参数

    {Object | Array} target

    {string | number} propertyName/index

  - 用法

    删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制

  - 注意

    对象不能是 Vue 实例，或者 Vue 实例的根数据对象

- ##### Vue.directive( id, [definition] )

  - 参数

    {string} id

    {Function | Object} [definition]

  - 用法

    注册或获取全局指令

    ```js
    // 注册
    Vue.directive('my-directive', {
      bind: function() {},
      inserted: function() {},
      componentUpdated: function() {},
      unbind: function() {}
    })
    
    // 注册(指令函数)
    Vue.directive('my-directive', function() {
      // 这里将会被 'bind' 和 'update' 调用
    })
    
    // getter， 返回已注册的指令
    var myDirective = Vue.directive('my-directive')
    ```

- ##### Vue.filter( id, [definition] )

  - 参数

    {string} id

    {Function} [definition]

  - 用法

    注册或获取全局过滤器

    ```js
    // 注册
    Vue.filter('my-filter', function(value) {
      // 返回处理后的值
    })
    // getter,返回已注册的过滤器
    var myFilter = Vue.filter('my-filter')
    ```

- ##### Vue.component( id, [definition] )

  - 参数

    {string} id

    {Function | Object} [definition]

  - 用法

    注册或获取全局组件。注册还会自动使用给定的 id 设置组件的名称

    ```js
    // 注册组件，传入一个扩展过的构造器
    Vue.component('my-component', Vue.extend({/* ... */}))
    
    // 注册组件，传入一个选项对象(自动调用 Vue.extend）
    Vue.component('my-component', {/* ... */})
    
    // 获取注册的组件(始终返回构造器)
    var MyComponent = Vue.component('my-component')
    ```

- ##### Vue.use( plugin )

  - 参数

    { Object | Function } plugin

  - 用法

    安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入

    该方法需要在调用 new Vue() 之前被调用

    当 install 方法被同一个插件多次调用，插件将只会被安装一次

- ##### Vue.mixin( mixin )

  - 参数

    { Object } mixin

  - 用法

    全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可疑使用混入，向组件注入自定义的行为(不推荐使用)

- ##### Vue.compile( template ) 

  - ##### 参数

    { string } template

  - 用法

    将一个模板字符串编译成 render 函数。只在完整版可用

    ```js
    var res = Vue.compile('<div><span>{{ msg }}</span></div>')
    
    new Vue({
      data: {
        msg: 'hello'
      },
      render: res.render,
      staticRenderFns: res.staticRenderFns
    })
    ```

- ##### Vue.observable( object )

  - 参数

    { Object } object

  - 用法

    让一个对象可响应。Vue内部会用它来处理 data 函数返回的对象

    返回的对象可以直接用于 渲染函数 和 计算属性 内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单场景

    ```js
    const state = Vue.observable( {count: 0} )
    const Demo = {
      render(h) {
        return h('button', {
          on: { click: () => { state.count++ } }
        }, 'count is: ${state.count}')
      }
    }
    ```

- ##### Vue.version

  - 细节

    提供字符串形式的 Vue 安装版本号

  - 用法

    ```js
    var version = Number(Vue.version.split('.')[0])
    if (version === 2) {
      // Vue v2.x.x
    } else if(version === 1) {
      // Vue v1.x.x
    } else {
      // Unsupported versions of Vue
    }
    
    ```

    

