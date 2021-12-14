同级（兄弟）组件间不能直接传递数据，需要建立一个类似桥梁的载体去实现。

1、定义一个公共文件public.js，创建位置工程src目录下与main.js同级（代码内容是创建一个空的vue实例）：

```js
import Vue from 'vue'
export default new Vue()
```

2、创建好以后，同级（兄弟）组件分别引入public.js这个文件：

```js
import Public from '../public.js'
```

3、例如现在有**A.vue**和**B.vue**两个同级（兄弟）组件，假设A.vue组件发送数据，通过$emit将事件和参数’传递’给B.vue（实际上是传递数据到public.js内）：

```js
price(newPrice){
    Public.$emit('xx',（yy，zz）)		//xx:定义传参，yy：所要传递的数据 zz：所要传递的数据
} 
```

4、在B.vue组件里接收数据，通过$on将事件和数据从A.vue接收过来：

```js
Public.$on("xx", val=> {
    this.插值语句中需要渲染的变量名 = val
});
```

