### 自动转换 px 到 rem

`postcss` 是 `css` 的 `transpiler（转换编译器，转译器）`，它对于 `css` 就像 `babel`对于 `js` 一样，能够做 `css` 代码的分析和转换。同时，他也提供了插件机制来做自定义的转换。

### `postcss` 的原理

`postcss` 是 `css` 到 `css` 的转译器，它也和 `babel` 一样，分为 `parse、transform、generate` 3个阶段。各种转换插件都是工作在 `transform` 阶段，基于 `AST` 做分析和转换。

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111241700747.webp)

`css` 的 `AST` 比 `js` 的简单多了，主要有以下几种：

**atrule**：以 `@` 开头的规则，比如：

```css
@media screen and (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
}
```

**rule**：选择器开头的规则，比如：

```css
ul li {
 padding: 5px;
}
```

**decl**：具体的样式，比如：

```css
padding: 5px;
```

### postcss 插件的写法

postcss 插件是工作在 transform 阶段，处理 ast 节点，插件的形式是这样的：

```js
const plugin = (options = {}) => {
  return {
    postcssPlugin: '插件名字',

    Rule (node) {},
    Declaration (node) {},
    AtRule (node) {}
  }
}
```

外层函数接受 options，返回一个插件的对象，声明对什么节点做处理的 listener，然后在对应的 listener 里写处理逻辑就行。

还可以这样写：

```js
module.exports = (opts = {}) => {
  return {
    postcssPlugin: '插件名字',
    prepare (result) {
      // 这里可以放一些公共的逻辑
      return {
        Declaration (node) {},
        Rule (node) {},
        AtRule (node) {}
      }
    }
  }
}
```

在 prepare 里返回各种 listener，这样比起第一种来，好处是可以存放一些公共的逻辑。

然后可以这样来运行插件：

```js
const postcss = require('postcss');

postcss([plugin({
    // options
})]).process('a { font-size: 20px; }').then(result => {
    console.log(result.css);
})
```

### 实战  px 自动转 rem

rem 的本质就是等比缩放，相对于 html 元素的 font-size。比如 html 的 font-size 设置为 100px，那 1rem 就等于 100px，之后的样式如果是 200px 就写为 2rem。这样我们只需要修改 html 的 font-size 就可以适配各种屏幕宽度的显示，具体的单位会做等比缩放。我们要根据 html 的 font-size 值来把所有的 px 转换为 rem，一般都是手动来做这件事情的，但比较繁琐，知道了计算方式之后，完全可以用 postcss 插件来自动做。接下来我们就实现下这个 postcss 插件：

我们搭一下插件的基本结构，只需要声明对 Declaration 处理的 listener：

```js
const plugin = (options) => {
    return {
        postcssPlugin: 'postcss-simple-px2rem',
        Declaration (decl) {
           
        }
    }
}
```

然后要做的就是把 decl 的样式值中的 px 转换为 rem，简单的正则替换就行：

```js
const plugin = (options) => {
    const pxReg = /(\d+)px/ig;
    return {
        postcssPlugin: 'postcss-simple-px2rem',
        Declaration (decl) {
            decl.value = decl.value.replace(pxReg, (matchStr, num) => {
                return num/options.base + 'rem';
            });
        }
    }
}
```

通过字符串的 replace 方法来做替换，第一个参数是匹配的字符串，后面的参数是分组，第一个分组就是 px 的值。

计算 px 对应的 rem 需要 1rem 对应的 px 值，可以支持通过 options 来传入。

然后我们测试下：

```js
postcss([plugin({
    base: 100
})]).process('a { font-size: 20px; }').then(result => {
    console.log(result.css);
})
```

### 总结

postcss 是 css 的 transpiler，就像 babel 是 js 的 transpiler 一样，而且 postcss 的 AST 只有几种节点，比较简单，也可以通过 astexplorer.net 来可视化的查看。

postcss 也提供了插件功能，可以做一些自定义的分析和转换。

我们实现了简单的 px 自动转 rem 的插件：

rem 是通过等比缩放的方式来达到一套样式适配不同设备宽度的显示的方案，需要做 px 到 rem 的转换，这件事可以用 postcss 插件来自动来做。

其实 postcss 插件的分析和转换功能还有很多的应用，比如切换主题色，从白到黑，完全就可以用 postcss 自动分析颜色的值，然后做转换。

postcss 分析和转换 css 的能力还是很强大很有用的，有很多在业务中的应用场景等你去发掘。