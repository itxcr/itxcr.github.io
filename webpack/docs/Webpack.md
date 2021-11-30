## 何为Webpack

Webpack 是一个开源的 Javascript 模块打包工具，其最核心功能是解决模块之间的依赖，把各个模块按照特定顺序和规则组织在一起，并最终合并为一个 js 文件（有时会有多个）。这个过程就叫做模块打包。

可以把 Webpack 理解为一个模块处理工厂。把源码交给 Webpack，由它去加工、拼装，产出最终的资源文件，然后送往用户。

### 何为模块

比如，在工程中引入一个日期处理的 npm 包，或者编写一个提供工具方法的 JS 文件，这些都可以称为模块。

在设计程序结构时，把所有代码都堆到一起是十分不好的。更好的组织方式是按照特定的功能将其拆分成多个代码段，每个代码段实现一个特定的目的。可以对其进行独立的设计、开发和测试，最终通过接口来将它们组合在一起。这就是基本的模块化思想。

### JavaScript中的模块

在过去很长一段时间里，JavaScript 这门语言并没有模块这一概念。如果工程中有多个 JS 文件，只能通过 script 标签将它们一个一个插入页面中。

随着技术发展，引入多个 script 文件到页面中逐渐成文一种常态，但这种做法有很多缺点：

- 需要手动维护 JavaScript 的加载顺序。页面多个 script 之间通常会有依赖关系，但由于这种关系是隐式的，除了添加注释以外很难清晰地指明谁依赖了谁，这样当页面中加载的文件过多时就很容易出现问题。
- 每一个 script 标签都意味着需要向服务器请求一次静态资源，在HTTP 2 还没出现的时期，建立连接的成本是很高的，过多的请求会严重拖慢网页的渲染速度。
- 在每个 script 标签中，顶层作用域及全局作用域，如果没有任何处理而直接在代码中进行变量或函数声明，就会造成全局作用域的污染。

模块化则解决了上述的所有问题。

- 通过导入和导出语句可以清晰看到模块之间的依赖关系。
- 模块可以借助工具来进行打包，在页面中只需要加载合并后的资源文件，减少了网络开销。
- 多个模块之间的作用域是隔离的，彼此不会有命名冲突。

ES6 模块标准目前已经得到了大多数现代浏览器的支持，但在实际应用方面还需要等待一段时间。主要有以下几个原因：

- 

### 模块打包工具

模块打包工具的任务就是解决模块之间的依赖，使其打包后的结果能运行在浏览器上。它的工作方式有两种：

- 将存在依赖关系的模块按照特定规则合并为单个 js 文件，一次全部加载进页面中。
- 在页面初始时加载一个入口模块，其他模块异步进行加载。

目前比较流行的打包工具有 Webpack、Parcel、Rollup 等。

### Webpack 的优势

1. webpack 默认支持多种模块标准，包括 AMD，CommonJs以及最新的ES6模块，这对于一些同时使用多种模块标准的工程非常有用，webpack会帮助我们处理好不同类型模块之间的依赖关系。
2. webpack 有完备的代码分割（code splitting）解决方案。它可以分割打包后的资源，首屏只加载必要的部分，不太重要的功能放到后面动态地加载。这对于资源体积较大的应用来说尤为重要，可以有效的减小资源体积，提升首页渲染速度。
3. webpack可以处理各种类型的资源。除了 Javascript 外，webpack 还可以处理样式，模版甚至图片等，而开发者仅仅需要导入它们。
4. 庞大的社区支持。

### 使用默认目录配置

Webpack 的默认源代码入口就是 `src/index.js` 。

### 使用配置文件

当项目需要越来越多的配置时，就要往命令中添加更多的参数，到后期维护起来会相当困难。为了解决这个问题，可以把这些参数改为对象的形式专门放在一个配置文件里，在 Webpack 每次打包的时候读取配置文件即可。

Webpack 的默认配置文件为 `webpack.config1.js`。（也可以使用其他文件名，需要用命令行参数指定）。

```js
module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js'
	},
	mode: 'development'
}
```

上面通过 module.exports 导出了一个对象，也就是打包时被 Webpack 接收的配置对象。

Webpack 对于 `output.path` 的要求是使用绝对路径。 

### webpack-dev-server

便捷的本地开发工具

安装

```shell
yarn add webpack-dev-server -D
```

```shell
For webpack-cli 3.x:
"scripts": {
  "start:dev": "webpack-dev-server --mode=development"
}

For webpack-cli 4.x:
"scripts": {
  "start:dev": "webpack serve --mode=development"
}
```

在配置中添加了一个 devServe 对象，它专门用来放 webpack-dev-server 配置的。

```js
module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js'
	},
	mode: 'development',
	devServer: {
		publicPath: './dist'
	}
}
```

webpack-dev-server 可以看作是一个服务者，它的主要工作就是接收浏览器的请求，然后将资源返回。当服务启动时，会先让 Webpack 进行模块打包并将资源准备好。当 webpack-dev-server 接收到浏览器的资源请求时，它会首先进行 URL 地址校验。如果该地址是资源服务地址(上面配置的 publicPath)，就会从 Webpack 的打包结果中寻找该资源并返回给浏览器。反之，如果请求地址不属于资源服务地址，则直接读取硬盘中的源文件并将其返回。

综上可以总结出 webpack-dev-server 的两大职能：

- 令 Webpack 进行模块打包，并处理打包结果的资源请求
- 作为普通的 Web Server，处理静态资源文件请求

直接用 Webpack 开发和用 webpack-dev-server 有一个很大的区别，前者每次都会生成 bundle.js ，而 webpack-dev-server 只是将打包结果放在内存中，并不会写入实际的 bundle.js，在每次 webpack-dev-server 接收到请求时都只是将内存中的打包结果返回给浏览器。

webpack-dev-server 还有一项很便捷的特性就是 `live-reloading` （自动刷新）。

当 webpack-dev-server 发现工程源文件进行了更新操作就会自动刷新浏览器，显示更新后的内容。还有更先进的 `hot-module-replacement` （热模块特换），甚至不需要刷新浏览器就能获取更新之后的内容。

## 模块打包

### `CommonJS`

由 Javascript 社区在2009年提出的包含模块，文件，IO，控制台在内的一系列标准。在 Node.js 的实现中采用了 CommonJS 标准的一部分，并在其基础上做了一些调整。我们所说的 CommonJS 模块和 Node.js 中的实现并不完全一样，现在一般谈到 CommonJS 其实是 Node.js 中的版本，而非它原始定义。

CommonJS 最初只为服务端而设计，直到有了 Browserify —— 一个运行在 Node.js 环境下的模块打包工具，它可以将 CommonJS 模块打包为浏览器可以运行的单个文件。

#### 模块

CommonJS 中规定每个文件是一个模块。将一个 Javascript 文件直接通过 script 标签插入页面中与封装成 CommonJS 模块最大的不同在于，前者的顶层作用域是全局作用域，在进行变量及函数声明时会污染全局变量；而后者会形成一个属于模块自身的作用域，所有的变量及函数只能自己访问，对外是不可见的。

每个模块是拥有各自的作用域的。

#### 导出

导出是一个模块向外暴露自身的唯一方式。在 CommonJS 中，通过 module.exports 可以导出模块中的内容。

CommonJS 模块内部会有一个 module 对象用于存放当前模块的信息，可以理解成在每个模块的最开始定义了以下对象：

```js
var module = {}
module.exports = {
}

# module.exports = {
#    name: 'test',
#    add: function(a, b) {
#        return a + b
#    }
# }
```

module.exports 用来指定该模块要对外暴露哪些内容，在上面代码中导出了一个对象，包含 name 和 add 两个属性。为了书写方便，CommonJS 支持另一种简化的导出方式——直接使用 exports。

```js
exports.name = 'test';
exports.add = function(a, b) {
	return a + b;
}
```

在实现效果上与 module.exports 没有任何不同。其内在机制是将 exports 指向了 module.exports，而 module.exports 在初始化时是一个空对象。可以简单理解为 CommonJS 在每个模块的首部默认添加了以下代码：

```js
var module = {
	exports: {}
}
var exports = module.exports;
```

因此，为 exports.add 赋值相当于在 module.exports 对象上添加了一个属性。

在使用 exports 时要注意一个问题，即不要直接给 exports 赋值，否则会导致其失效。如：

```js
exports = {
	name: 'test'
}
```

上面代码中，由于对 exports 进行了赋值操作，使其指向了新的对象，module.exports 却仍然时原来的空对象，因此 name 属性并不会被导出。

另外一个容易犯错的是不恰当的把 module.exports 与 exports 混用。

```js
exports.add = function (a, b) {
	retudn a + b;
}

module.exports = {
	name: 'test'
}
```

上面先通过 exports 导出了 add 属性，然后将 module.exports 重新赋值为另外一个对象。这会导致原本拥有 add 属性的对象丢失了，最后导出的只有  name。

还要注意导出语句不代表模块的末尾，在 module.exports 或 exports 后面的代码依旧会照常执行。

#### 导入

在 CommomJS 中使用 require 进行模块导入，如：

```js
// test.js
module.exports = {
	add: function(a, b) {return a + b}
}
// index.js
const add = require('./test.js')
const sum = add(1, 2)
console.log(sum) // 3
```

当 require 一个模块的时候会有两种情况

1. require 的模块是第一次被加载，这时会首先执行该模块，然后导出内容。
2. require 的模块曾经被加载过。这时该模块代码不会再次执行，而是直接导出上次执行后得到的结果。

```js
// test.js
console.log('看看打印几次')
module.exports = {
	name: 'test',
	add: function(a, b) {
		return a + b
	}
}

// index.js
const add = require('./test.js').add
const sum = add(1, 2)
console.log(sum)
const moduleName = require('./test.js').name
console.log('end')
```

控制台输出结果如下

```
看看打印几次
index.js:4 3
index.js:6 test
```

从结果可以看出，尽管有两个地方 require 了 test.js，但其内部代码只执行了一次。

模块会有一个 module 对象用来存放其信息，这个对象中有一个属性 loaded 用于记录该模块是否被加载过。它的默认值是 false，当模块第一次被加载和执行过后会设置为 true，后面再次加载时检查到 module.loaded 为 true 时，则不会再次执行模块代码。

有时加载一个模块，不需要获取其导出的内容，只是想通过执行它来产生某种作用，比如把它的接口挂在全局对象上，此时直接使用 require 即可。

```js
require('./test.js')
```

另外, require 函数可以接收表达式，借助这个特性可以动态地指定模块加载路径。

```js
const moduleName = ['test01.js', 'test02.js']
moduleName.forEach(name => {
 require('./' + name);
})
```

### ES6 Module

#### 模块

```js
// test.js
export default {
    name: 'test es6',
    add: function(a, b) {
        return a + b
    }
}

// index.js
import testES6 from './add'
const sum = testES6.add(5, 5)
console.log(sum); // 10
```

ES6 Module 也是将每个文件作为一个模块，每个模块拥有自身的作用域，不同的是导入、导出语句。import 和 export 也作为关键字在 ES6 中加入了进来。(CommonJS 的 module 并不属于关键字)。

ES6 Module 会自动采用严格模式，这在 ES5 中是一个可选项。

#### 导出

在 ES6 Module 中使用 export 命令导出模块。export 有两种形式。

- 命名导出
- 默认导出

一个模块可以有多个命名导出。有两种不同写法：

```js
// 1
export const name = 'test'
export const add = function(a, b) { return a + b }
// 2
const name = 'test'
const add = function(a, b) { return a + b }
export { name, add }
```

在使用命名导出时，可以通过 as 关键字对变量重命名。

```js
const name = 'test'
const add = function(a, b) { return a + b }
export { name, add as Sum }
```

与命名导出不同，模块的默认导出只能有一个。

```js
export default {
    name: 'test es6',
    add: function(a, b) {
        return a + b
    }
}
```

可以将 export default 理解为对外输出了一个名为 default 的变量，因此不需要像命名导出一样进行变量声明，直接导出值即可。

```js
export default 'ES6'
export default class {}
export default function() {}
```

#### 导入

ES6 Module 使用 import 语法导入模块。

```js
// test.js
const name = 'test'
const add = function(a, b) { return a + b }
export { name, add }

// index.js
import { name, add } from './test.js'
add(4, 6) // 10
```

加载带有命名导出的模块时，import 后面要跟一对大括号来将导入的变量名包裹起来，并且这些变量名需要与导出的变量名完全一致。导入变量的效果相当于在当前作用域下声明了这些变量(name 和 add)，并且不可对其进行更改，也就是导入的变量都是只读的。

与命名导出类似，可以通过 as 关键字对导入的变量进行重命名。

```js
import { name, add as Sum } from './test.js'
Sum(3, 3) //6
```

在导入多个变量时还可以使用整体导入。

```js
import * as tst from './test/js'
console.log(tst.name)     // test
console.log(tst.add(1,1)) // 2
```

使用 import * as xxx 可以把所有导入的变量作为属性添加到 xxx 对象中，从而减少对当前作用域的影响。

对于默认导出来说，import 后面直接跟变量名，并且这个名字可以自由指定。从原理上可以这样理解：

```js
import { default as xxx } from './test.js'
```

两种方式混合

```js
// index.js
import React, { Component } from 'react'
```

这里 React 对应默认导出，Component 是其命名导出中的一个变量。

#### 复合写法

在工程中，有时需要把某一个模块导入之后立即导出，比如专门用来集合所有页面或组件的入口文件。此时可以使用复合写法：

```js
export { name, add } from './test.js'
```

复合写法目前只支持当被导入模块通过命名导出的方式暴露出来的变量，默认导出则没有对应的复合形式，只能将导入和导出拆开写。

```js
import txt from './test.js'
export default txt
```

### CommonJS 与 ES6 Module 的区别

#### 动态与静态

- CommonJS 是动态的，模块依赖关系的建立发生在代码运行阶段
  - 当模块 A 加载 模块 B 时，会执行 B 中的代码，并将其 module.exports 对象作为 require 函数的返回值进行返回。并且 require 的模块路径可以动态指定，支持传入一个表达式，甚至可以通过 if 判断是否加载某个模块。因此，在模块被执行前，没有办法确定明确的依赖关系，模块的导入、导出发生在代码的运行阶段。
- ES6 Module 是静态的，模块依赖关系的建立发生在代码编译阶段
  - 导入、导出是声明式的，不支持路径是一个表达式，导入、导出语句必须位于模块的顶层作用域，因此说，ES6 Module 是一种静态的模块结构，在代码编译阶段就可以分析出模块的依赖关系
    - 死代码检测和排除
    - 模块变量类型检查
    - 编译器优化

#### 值拷贝与动态映射

- CommonJS 在导入模块时，获取的是一份导出值的拷贝
  - 对模块导入的值进行操作不会对导出模块中的值造成影响，因为获取的是值的拷贝。
- ES6 Module 在导入模块时，获取的是值的动态映射，并且这个映射是只读的
  - 导入的值是对原有值的动态映射，调用原有模块的方法改变了原有值时，在导入模块的变量中其值也会立即发生变化
  - 不可以对导入的变量进行更改

#### 循环依赖

循环依赖是指模块 A 依赖于 模块 B，同时模块 B 依赖于模块 A。但是当中间模块太多时就很难发现 A 和 B 之间存在隐式的循环依赖。

ES6 Module 的特性可以更好的支持循环依赖。

### 加载其他类型模块

#### 非模块化文件

最常见的就是在`script`标签引入 `jQuery` 及各种插件。

如何使用 `webpack` 打包这类文件呢，只需要直接引入即可，如

`import ./jquery.min.js`

这句代码会直接执行 `jQuery.min.js` ,一般来说这种类库都是将其接口绑定在全局，因此无论从 `script`标签引入，还是使用 `webpack` 打包的方式引入，其最终效果是一样的。

但假如引入的非模块化文件是以隐式全局变量的方式暴露其接口的，则会发生问题。如：

```js
// 通过在顶层作用域声明变量的方式暴露接口
var calculator = {

}
```

由于 `webpack` 在打包时会为每一个文件包装一层函数 作用域来避免全局污染，上面的代码将无法把 `calculator` 对象挂在全局，因此这种隐式全局变量声明需要格外注意。

#### `AMD`

`AMD` 是英文 `Asynchronous Module Definition` （异步模块定义）的缩写，它是由 `Javascript` 社区提出的专注于支持浏览器端模块化的标准。它与 `CommonJS` 和 `ES6 Module` 最大的区别在于它加载模块的方式是异步的。

```js
define('getSum', ['calculator'], function(math) {
	return function(a, b) {
		console.log('sum:' + calculator.add(a, b))
	}
})
```

 在 AMD 中使用 define 函数来定义模块，它可接受 3 个参数。第一个参数是当前模块的 id，相当于模块名；第二个参数是当前模块的依赖，比如上面定义的 getSum 模块需要引入 calculator 模块作为依赖；第三个参数用来描述模块的导出值，可以是函数或对象。如果是函数则导出的是函数的返回值；如果是对象则直接导出对象本身。

和 CommonJS 类似，AMD 也使用 require 函数来加载模块，只不过采用异步形式。

```js
require(['getSum'], function(getSum) {
	getSum(2, 3)
})
```

require 的第 1 个参数指定了加载的模块，第 2 个参数是当模块加载完成后执行的回调函数。

通过 AMD 这种形式定义模块的好处在于其模块加载是非阻塞的，当执行到 require 函数时并不会停下来去执行被加载的模块，而是继续执行 require 后面的代码，这使得模块加载操作并不会阻塞浏览器。

尽管 AMD 设计理念很好，但与同步加载的模块标准相比，其语法要更加冗长。另外异步加载的方式并不如同步显得清晰，并且容易造成回调地狱。

#### UMD

严格来说，UMD 并不是一种模块标准，不如说它是一组模块形式的集合更准确。UMD 全称是 Universal Module Definition ，也就是通用模块标准，它的目标是使一个模块能运行在各种环境下，不论是 CommonJS、AMD，还是非模块化的环境。

```js
// calculator
(function (global, main) {
	// 根据当前环境采取不同的导出方式
	if(typeof define === 'function' && define.amd) {
		// AMD
		defind(...)
	}else if(typeof exports === 'object') {
		// CommonJS
		module.exports = ...
	} else {
		// 非模块化环境
		global.add = ...
	}
})(this, function() {
	// 定义模块主体
	return {...}
})
```

UMD 根据当前全局对象中的值判断目前处于哪种环境。当前环境是 AMD，就以 AMD 的形式导出；当前环境是 CommonJS ，就以 CommonJS 的形式导出。

需要注意，UMD 模块一般最先判断 AMD 环境，也就是全局下是否有 define 函数，而通过 AMD 定义的模块是无法使用 CommonJS 或 ES6 Module 的形式正确引入的。在 webpack 中，由于它同时支持 AMD 及 CommonJS ，也许工程中的所有模块都是 CommonJS，而 UMD 标准却发现当前有 AMD 环境，并使用了 AMD 方式导出，这会使模块导入时出错。当需要这样做时，可以更改 UMD 模块中判断的顺序，使其以 CommonJS 的形式导出即可。

#### 加载 npm 模块

```bash
# 项目初始化
npm init -y
# 安装 lodash
npm install lodash
```

执行完上面命令后，npm 会将 lodash 安装在工程的 node_modules 目录下，并将对该模块的依赖信息记录在 package.json 中。

在使用时，加载一个 npm 模块的方式很简单，只需要引入包名即可。

```js
// index.js
import _ from 'lodash'
```

当 webpack 在打包时解析到这条语句，就会自动去 node_modules 中寻找名为 lodash 的模块，不需要我们写出从源文件 index.js 到 node_modules 中 lodash 的路径。

在实际打包过程中具体加载的是 npm 模块中哪个js文件呢。

每一个 npm 模块都有一个入口。当加载一个模块时，实际上就是加载该模块的入口文件。这个入口文件被维护在模块内部 package.json 文件的 main 字段中。

比如 lodash：

```js
// ./node_modules/undersource/package.json
"name": 'lodash',
"main": "lodash.js"
```

当加载该模块时，实际上加载的是 `node_modules/lodash/lodash.js`

除了直接加载模块以外，也可以通过 `<package_name>/<path>` 的形式单独加载模块内部的某个 JS 文件。如：

```js
import all from 'lodash/fp/all.js'
console.log(all)
```

这样，webpack 最终只会打包 `./node_modules/lodash/fp/all.js`这个文件，而不会打包全部的 lodash 库，通过这种方式可以减小打包资源的体积。

### 模块打包原理

## 资源输入输出

### 资源处理流程

在一切流程的最开始，需要指定一个或多个入口。这些存在依赖关系的模块会在打包时被封装为一个chunk。在webpack中可以理解成被抽象和包装过后的一些模块。

将具有依赖关系的模块生成一颗依赖树，最终得到一个chunk。由这个 chunk 得到的打包产物称之为 bundle。

在工程中可以定义多个入口，每一个入口都会产生一个结果资源。比如两个入口 src/index.js 和src/test.js，在一般情况下会打包生成 dist/index.js 和 dist/test.js，因此可以说，entry 与 bundle 存在着对应关系。

在一些特殊情况下，一个入口也可以产生多个chunk并最终生成多个 bundle。

### 配置资源入口

webpack 通过 context 和 entry 这两个配置项来共同决定入口文件的路径。在配置入口时，实际上做了两件事：

- 确定入口模块的位置，告诉 webpack 从哪里开始进行打包。
- 定义 chunk name。如果工程只有一个入口，那么默认其 chunk name 为 'main'；如果工程有多个入口，需要为每个入口定义 chunk name，来作为该 chunk 的唯一标识。

#### context

context 可以理解为资源入口的路径前缀，在配置时要求必须使用绝对路径的形式。

```js
module.exports = {
	context: path.join(__dirname, './src'),
	entry: './scripts/index.js'
}

module.exports = {
	context: path.join(__dirname, './src/scripts'),
	ebtry: './index.js'
}
```

配置 context 的主要目的是让 entry 的编写更加简洁，尤其是在多入口的情况下。context 可以省略，默认值为当前工程的根目录。

#### entry

entry 的配置可以有多种形式：字符串、数组、对象、函数。

1. 字符串类型入口

   直接传入文件路径

   ```js
   module.exports = {
   	entry: './src/index.js',
   	output: {
   		filename: 'bundle.js'
   	},
   	mode: 'development'
   }
   ```

2. 数组类型入口

   传入一个数组的作用是将多个资源预先合并，在打包时 webpack 会将数组中的最后一个元素作为实际的入口路径。如：

   ```js
   module.exports = {
       entry: ['babel-polyfill', './src/index.js']
   }
   // 等同于
   module.exports = {
       entry: './src/index.js'
   }
   // index.js
   import 'babel-polyfill'
   ```

3. 对象类型入口

   如果要定义多入口，必须使用对象的形式。属性名时chunk name，属性值是入口路径。

   ```js
   module.exports = {
       entry: {
           index: './src/index.js',
           test: './src/test.js'
       }
   }
   
   module.exports = {
       entry: {
           index: ['babel-polyfill', './src/index.js'],
           test: './src/test.js'
       }
   }
   ```

4. 函数类型入口 

   只需要返回上面介绍的任何配置形式即可

   ```js
   module.exports = {
       entry: () => './src/index.js'
   }
   
   module.exports = {
       entry: () => ({
           index: ['babel-polyfill', './src/index.js'],
           test: './src/test.js'
       })
   }
   ```

   传入一个函数的优点在于可以添加一些动态的逻辑来获取工程的入口。函数也支持返回一个 Promise 对象进行异步操作。

   ```js
   module.exports = {
   	entry: () => new Promise((resolve) => {
   		setTimeout(() => {
   			resolve('./src/index.js')
   		}, 1000)
   	})
   }
   ```

#### 实例

##### 单页应用

- 单入口
  - 好处
    - 单一入口引用，只产生一个 js 文件，依赖关系清晰。
  - 弊端
    - 规模过大会产生体积过大的资源，降低渲染速度

##### 提取 vendor

- 将依赖的第三方模块抽取出来生成新的 bundle，不会经常变动，可以利用客户端进行缓存，加快整体的渲染速度。

### 配置资源出口

```js
module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'test',
		path: path.join(__dirname, 'assets'),
		publicPath: '/dist/'
	}
}
```

在多入口场景中，需要为对应产生的每个 bundle 指定不同的名字，webpack 支持使用一种类似模板语言的形式动态生成文件名：

```js
module.exports = {
	entry: {
		app: './src/app.js',
		test: './stc/test/js'
	},
	output: {
		filename: '[name].js'
	}
}
```

在资源输出时，上面的 filename 中的 [name] 会被替换为 chunk name，因此最后实际生成的资源是 app.js 和 test.js。

filename 配置项模板变量

| 变量名称    | 功能描述                                |
| ----------- | --------------------------------------- |
| [hash]      | 指代 webpack 此次打包所有资源生成的hash |
| [chunkhash] | 指代当前 chunk 内容的 hash              |
| [id]        | 指代当前 chunk 的id                     |
| [query]     | 指代 filename 配置项中的 query          |

- 当有多个 chunk 存在时对不同的 chunk 进行区分。如 [name]、[chunkhash]和[id]，他们对于每个 chunk 来说都是不同的。
- 控制客户端缓存。

#### path

path 可以指定输出资源位置，必须时绝对路径。

#### publicPath

用来指定资源的请求位置。

- 输出位置
  - 打包完成后的资源产生的目录
- 请求位置
  - 由 JS 或 CSS 所请求的间接资源路径。资源分两种，一种是HTML页面直接请求的，比如 script 标签加载的 js；另一种是由 JS 或 CSS 请求的，如异步加载 JS、从 CSS 请求图片字体等。publicPath 的作用就是指定这部分间接资源的请求位置。

1. HTML 相关
2. Host 相关
3. CDN 相关

#### 总结

- context 相当于路径前缀
- entry 入口文件路径
- 单入口的 chunk name 不可修改
- 多入口必须为每一个 chunk 指定 chunk name
- 三方依赖较多时，可以提取 vendor 的方法将模块打包到一个单独的 bundle 中，可以利用客户端缓存，加快渲染速度。
- path 和 publicPath 的区别在于path 指定资源输出的位置，publicPath 指定间接资源的请求位置。

## 预处理器

对于工程中其他类型的资源，如HTML、CSS、模板、图片、字体等，Webpack如何处理呢？在日常开发中经常会预编译代码，比如使用Babel来转译ECMAScript新版本中的特性，使用SCSS或者Less来编写样式等。如何让Webpack来对所有的预编译进行统一管理呢？

预处理器（loader），它赋予了 Webpack 可处理不同资源类型的能力，极大丰富了其可扩展性。

- Webpack “一切皆模块” 的思想与loader的概念
- loader 的原理
- 如何引入一个 loader
- 常用loader介绍
- 如何编写一个 loader

### 一切皆模块

一个 Web 工程通常会包含 HTML、JS、CSS、模板、图片、字体等多种类型的静态资源，并且这些资源之间都存在着某种联系。比如，JS 文件之间有互相依赖的关系，在 CSS 中可能会引用图片和字体等。对于 Webpack 来说，所有这些静态资源都是模块，可以像加载一个 JS 文件一样去加载它们，如在 index.js 中加载 style.css：

```js
// index.js
import './style.css'
```

对于刚接触 Webpack 的人来说，可能会认为这个特性很神奇，甚至会觉得不解；从 JS 中加载 CSS 文件具体有怎样的意义呢？从结果来看，其实和之前并没有什么差别，这个 style.css 可以被打包并生成在输出资源目录下，对 index.js 文件也不会产生实质性的影响。这句引用的实际意义是描述了 JS 文件与 CSS 文件之间的依赖关系。

使用 Webpack 将 css 通过 JS 来引入，可将其作为一个整体被页面引入进来，可以更清晰地描述资源之间地关系。当移除这个组件时，也只需要移除对于组件 JS 的引用即可。人为的工作总难免出错，而让 Webpack 维护模块间的关系可以使工程结构更加直观，代码的可维护性更强。

另外，模块使具有高内聚性及可复用性的结构，通过 Webpack 一切皆模块的思想，可以将模块的这些特性应用到每一种静态资源上面，从而设计和实现出更加健壮的系统。

### loader 概述

每个 loader 本质上都是一个函数。在 Webpack 4 之前，函数的输入和输出都必须为字符串·；在 Webpack4 之后，loader 也同时支持抽象语法树(AST) 的传递，通过这种方法来减少重复的代码解析。用公式表达 loader 的本质则为以下形式：

```tex
output = loader(input)
```

这里的 input 可能是工程源文件的字符串，也可能是上一个 loader 转化后的结果，包括转化后的结果、source map，以及 AST 对象；output 同样包含这几种信息，转化后的文件字符串、source map、以及 AST。如果这是最后一个loader，结果将直接被送到 Webpack 进行后续处理，斗、否则将作为下一个 loader 的输入向后传递。

例如，使用 babel-loader 将 ES6+ 的代码转化为 ES5 时

```tex
ES5 = babel-loader(ES6+)
```

loader可以是链式的。可以对一种资源设置多个 loader，第一个 loader 的输入是文件源码，之后所有 loader 的输入都为shangyige loader 的输出。

```tex
output = loaderA(loaderB(loaderC(input)))
```

如在工程中编译 SCSS 时，可能需要如下 loader：

```tex
Style标签 = style-loader(css-loader(sass-loader(scss)))
```

阐述 loader 是如何工作的，看下 loader 的源码结构：

```js
module.exports = function loader(content, map, meta) {
	var callbak = this.async()
    var result = handler(content, map, meta)
    callback(
    	null,                // error
        result.content,      // 转换后的内容
        result.map,          // 转换后的 source-map
        result.meta          // 转换后的 AST
    )
}
```

loader 本身是一个函数，在函数中对接收到的内容进行转换，然后返回转换后的结果(可能包含 source map 和 AST 对象)。

### loader 的配置

loader 的字面意思是装载器，在 Webpack 中它的实际功能则更像是预处理器。Webpack 本身只认识 JavaScript，对于其他类型的资源必须预先定义一个或多个 loader 对其进行转译，输出为 Webpack 能够接收的形式再继续进行，因此 loader 做的实际上是一个预处理的工作。

#### loader 的引入

假设要处理 CSS，首先依照 Webpack 一切皆模块 的思想，从一个 JS 文件加载一个 CSS 文件。如

```css
// app.js
import './style.css'

// style.css
body {
	text-align: center;
	padding: 10px;
	color: #ffffff;
	background-color: #09c;
}
```

此时工程中还没有任何 loader，如果直接打包会报错，Webpack 无法处理 CSS 语法，因此抛出了一个错误，并提示需要使用一个合适的 loader 来处理这种文件。

把 css-loader 加到工程中

```js
module.exports = {
    module: {
      rules: [
          {
              test: /\.css$/,
              use: ['css-loader']
          }
      ]
    }
}
```

与 loader 相关的配置都在 module 对象中，其中 module.rules 代表了模块的处理规则。每条规则内都可以包含很多配置项，这里只使用了最重要的两项——test和use。

- test 可以接收一个正则表达式或者一个元素为正则表达式的数组，只有正则匹配上的模块才会使用这条规则。本例以 `/\.css$/` 来匹配所有以 .css 结尾的文件。
- use 可以接收一个数组，数组包含该规则所使用的 loader。在本例中只配置了一个 css-loader，在只有一个 loader 时也可以简化为字符串 'css-loader'。

此时再进行打包，之前的错误应该已经消失了，但是 CSS 的样式仍然没有在页面上生效。这是因为 css-loader 的作用仅仅是处理CSS的各种加载语法（@import 和 url()函数等），如果要使样式起作用还需要用 style-loader 来把样式插入页面。css-loader 与 style-loader 通常是配合在一起使用的。

#### 链式loader

很多时候，在处理某一类资源时都需要使用多个 loader。如，对于 SCSS 类型的资源来说，需要 sass-loader 来处理其方法，并将其编译为 CSS；接着再用 css-loader 处理 CSS 的各类加载语法；最后使用 style-loader 来将样式字符串包装成 style 标签插入页面。

为了引入 style-loader，先安装
`yarn add style-loader -D`

修改配置规则

```js
module.exports = {
    module: {
      rules: [
          {
              test: /\.css$/,
              use: ['style-loader'， 'css-loader']
          }
      ]
    }
}
```

把 style-loader 加到了 css-loader 前面，这是因为 Webpack 打包时是按照数组从后往前的顺序将资源交给 loader 处理的，因此要把最后生效的放在前面。

此时再进行打包，样式就会生效了，可以看到页面中插入了一个 style 标签，包含了 css 文件的样式，这样就完成了从 JS 文件加载 CSS 文件的配置。

#### loader options

loader 作为预处理器通常会给开发者提供一些配置项，在引入 loader 的时候可以通过 options 将它们引入。如：

```js
module.exports = {
    module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                'style-loader',
                  {
                      loader: 'css-loader',
                      options: {
                          // css-loader 配置项
                      }
                  }
              ]
          }
      ]
    },
}
```

有些loader可能会使用 query 来代替 options，从功能来说它们并没有太大的区别。

#### 更多配置

1. exclude 和 include

   exclude 和 include 是用来排除或包含指定目录下的模块，可接收正则表达式或者字符串（文件绝对路径），以及由它们组成的数组。

   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                     {
                         loader: 'css-loader',
                         options: {
                             // css-loader 配置项
                         }
                     }
                 ],
                 exclude: /node_modules/
             }
         ]
       },
   }
   ```

   上面 exclude 的含义是，所有被正则匹配到的模块都排除在该规则之外，也就是说 node_modules 中的模块不会执行这条规则。该配置项通常是必加的，否则可能拖慢整体打包的速度。

   举个例子，在项目中我们经常会使用 babel-loader 来处理 ES6+ 语言特性，但是对 node_modules 中的 JS 文件来说，很多都是已经编译为 ES5 的，因此没有必要再使用 babel-loader 来进行额外处理。

   除 exclude 外，使用 include 配置也可以达到类似的效果。如：
   
   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                     {
                         loader: 'css-loader',
                         options: {
                             // css-loader 配置项
                         }
                     }
                 ],
                 // exclude: /node_modules/
                 include: /src/
             }
         ]
       },
   }
   ```
   
   include 代表该规则只对正则匹配到的模块生效。假如将 include 设置为工程的源码目录，自然而然就将 node_modules 等目录排除在外了。
   
   exclude 和 include 同时存在时，exclude 的优先级更高。
   
   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                     {
                         loader: 'css-loader',
                         options: {
                             // css-loader 配置项
                         }
                     }
                 ],
                 exclude: /node_modules/,
                 include: /node_modules\/awesome-ui/
             }
         ]
       },
   }
   
   ```
   
   此时，node_modules 已经被排除了，但是假如想要让该规则对 node_modules 中的某一个模块生效，即便加上 include 也是无法覆盖 exclude 配置的。要实现这样的需求可以更改 exclude 中的正则。
   
   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                     {
                         loader: 'css-loader',
                         options: {
                             // css-loader 配置项
                         }
                     }
                 ],
                 // 排除 node_modules 中除了 foo 和 bar 以外的所有模块
                 exclude: /node_modules\/(?!(foo|bar)\/).*/,
             }
         ]
       },
   }
   ```
   
   另外，由于 exclude 优先级更高，可以对 include 中的子目录进行排除。
   
   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                     {
                         loader: 'css-loader',
                         options: {
                             // css-loader 配置项
                         }
                     }
                 ],
                 // 排除 node_modules 中除了 foo 和 bar 以外的所有模块
                 exclude: /src\/lib/,
                 include: /src/
             }
         ]
       },
   }
   ```
   
   通过 include，将该规则配置为仅对 src 目录生效，但是仍然可以通过 exclude 排除其中的 src/lib 目录。
   
2. resource （资源） 和 issuer （发行人）

   resource 和 issuer 可用于更加精确地确定模块规则的作用范围。

   ```js
   // index.js
   import './style.css'
   ```

   在 Webpack 中，我们认为被加载的模块是 resource，而加载者是 issuer。如上面的例子中，resource 为 /path/of/app/style.css，issuer 是 /path/of/app/index.js。

   前面介绍的 test、exclude、include 本质上属于对 resource 也就是被加载者的配置，如果想要对 issuer 加载者也增加条件限制，则要额外写一些配置。比如，如果只想让 src/pages 目录下的 JS 可以引用 CSS，应该如何配置呢？

   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                   'style-loader',
                   'css-loader',
                 ],
                 exclude: /node_modules/,
                 issuer: {
                     test: /\.js$/,
                     include: /src\/pages/
                 }
             }
         ]
       },
   }
   ```

   可以看到，添加了 issuer 配置对象，其形式与之前对 resource 条件的配置并无太大差异。但只有 /src/pages/ 目录下面的 JS 文件引用 CSS 文件，这条规则才会生效；如果不是 JS 文件引用的 CSS，或者是别的目录的 JS 文件引用 CSS，则规则都不会生效。

   上面的配置虽然实现了需求，但是 test、exclude、include 这些配置项分布于不同的层级上，可读性较差。我们还可以将它们改为另一种等价的形式。

   ```js
   module.exports = {
       module: {
         rules: [
             {
                 use: [
                   'style-loader',
                   'css-loader',
                 ],
                 resource: {
                     test: /\.css$/,
                     exclude: /node_modules/
             	  }，
                 issuer: {
                     test: /\.js$/,
                     exclude: /node_modules/,
                 }
             }
         ]
       },
   }
   ```

   通过添加 resource 对象来将外层的配置包起来，区分了 resource 和 issuer 中的规则，这样就一目了然了。上面的配置与把 resource 的配置写在外层在本质上是一样的，然而这两种形式无法并存，只能选择一种风格进行配置。

3. enforce （执行；强制）

   enforce 用来指定一个 loader 的种类，直接收 “pre” 或 “post” 两种字符串类型的值。

   Webpack 中的 loader 按照执行顺序可分为 pre、inline、normal、post 四种类型，上面直接定义的 loader 都属于 normal 类型，inline 形式官方已经不再推荐使用，而 pre 和 post 则需要使用 enforce来指定。

   ```js
   module.exports = {
       module: {
         rules: [
             {
                 test: /\.js$/,
                 enforce: 'pre',
                 use: [
                   'eslint-loader',
                 ],
             }
         ]
       },
   }
   ```

   可以看到，在配置中加了一个 eslint-loader 来对源码进行质量检测，其 enforce 的值为 “pre”，代表它将在所有正常 loader 之前执行，这样可以保证其检测的代码不是被其他 loader 更改过的。类似的，如果某一个 loader 是需要在所有 loader 之后执行的，也可以指定其 enforce 为 “post”。

   事实上，也可以不使用 enforce 而只要保证 loader 顺序是正确的即可。配置 enforce 主要的目的是使模块规则更加清晰，可读性更强，尤其是在实际工程中，配置文件可能达到上百行的情况，难以保证各个 loader 都按照预想的方式工作，使用 enforce 可以强制指定 loader 的作用顺序。

### 常用loader

在使用 Webpack 过程中经常会遇到以下这样的问题：

- 对于 XX 资源应该使用哪个 loader
- 要实现 XX 功能应该使用哪个 loader

#### babel-loader

babel-loader 用来处理 ES6+ 并将其编译为 ES5，它使我们能够在工程中使用最新的语言特性，同时不必特别关注这些特性在不同平台的兼容问题。

安装命令

`yarn add babel-loader @babel/core @babel/preset-env`

各个模块的作用如下：

- babel-loader：它是使 Babel 与 Webpack 协同工作的模块
- @babel/core：它是 Babel 编译器的核心模块
- @babel/preset-env：它是 Babel 官方推荐的预置器，可根据用户设置的目标环境自动添加所需要的插件和补丁来编译 ES6+ 代码

在配置 babel-loader 时有一些需要注意的地方。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', {modules: false}]
            ]
          }
        }
      }
    ]
  },
}

```

1. 由于 babel-loader 通常属于对所有 JS 后缀文件设置的规则，所以需要在 exclude 中添加 node_modules ，否则可能会令 babel-loader 编译其中所有的模块，这将严重拖慢打包的速度，并且有可能改变第三方模块的原有行为。
2. 对于 babel-loader 本身添加了 cacheDirectory 配置项，它会启用缓存机制，在重复打包未改变过的模块时防止二次编译，同样也会加快打包的速度。cacheDirectory 可以接收一个字符串类型的路径来作为缓存路径，这个值也可以为 true，此时期缓存目录会指向 node_modules/.cache/babel-loader。
3. 由于 @babel/preset-env 会将 ES6 Module 转换为 CommonJS 的形式，这会导致 Webpack 中的 tree-shaking 特性失效。将 @babel/preset-env 的modules 配置项设置为 false 会禁用模块语句的转化，而将 ES6 Module 的语法交给 Webpack 本身处理。

babel-loader 支持从 `.babelrc` 文件读取 Babel 配置，因此可以将 presets 和 plugins 从 Webpack 配置文件中提取出来，也能达到相同的效果。

#### ts-loader

ts-loader 与 babel-loader 的性质类似，它是用于连接 Webpack 与 Typescript 的模块。

安装命令：

`yarn add ts-loader typesctipt -D`

Webpack 配置

```js
rules: [
  {
    test: /\.ts$/,
    use: [
      'ts-loader',
      ],
   }
]
```

需要注意 Typescript 本身的配置并不在 ts-loader 中，而是必须放在项目工程目录下的 tsconfig.json 中。如：

```json
{
	"compileOptions": {
		"target": "es5",
		"sourceMap": true
	}
}
```

 通过 Typescript 和 ts-loader，可以实现代码类型检查。更多内容可查看 ts-loader 文档：https://github.com/TypeStrong/ts-loader

#### html-loader

html-loader 用于将 HTML 文件转化为字符串并进行格式化，这让我们可以把一个 HTML 片段通过 JS 加载进来。

安装命令：

`yarn add html-loader -D`

Webpack 配置：

```js
rules: [
  {
    test: /\.html$/,
    use: [
      'html-loader',
      ],
   }
]
```

使用方法：

```html
// header.html
<header>
    <h1>这是一个Header</h1>
</header>
```

```js
// index.js
import headerHtml from './header.html'
document.write(headerHtml)
```

header.html 将会转化为字符串，并通过 document.write 插入页面中。

#### handlebars-loader

handlebars-loader 用于处理 handlebars 模板，在安装时需要额外安装 handlebars。

安装命令：

`yarn add handlebars-loader handlebars -D`

Webpack 配置如下：

```js
rules: [
  {
    test: /\.handlebars$/,
    use: [
      'handlebars-loader',
      ],
   }
]
```

使用示例如下：

```handlebars
<div class="entry">
	<h1>{{ title }}</h1>
	<div class="body"> {{ body }} </div>
</div>
```

```js
import contentTemplate from './content.handlebars'
const div = document.createElement('div')
div.innerHtml = contentTemplate({
    title: 'Title',
    body: "这里是 Body"
})
document.body.appendChild(div)
```

handlebars 文件加载后得到的是一个函数，可以接收一个变量对象并返回最终的字符串。

#### file-loader

file-loader 用于打包文件类型的资源，并返回其 publicPath。

安装命令：

`yarn add file-loader -D`

Webpack 配置：

```js
rules: [
  {
    test: /\.(png|jpg|gif)$/,
    use: [
      'file-loader',
      ],
   }
]
```

上面对 png、jpg、gif 这类图片资源使用 file-loader，然后就可以在 JS 中加载图片了。

```js
import avatarImg from './assets/img/avatar.jpg'
console.log(avatarImg) // 5f93203d589c7c68ae80853f5c8c6cea.jpg
```

output.path 是资源的打包输出路径， output.publicPath 是资源引用路径。使用 Webpack 打包完成后，dist 目录下会生成名为 5f93203d589c7c68ae80853f5c8c6cea.jpg 的图片文件，默认为文件的 hash 值加上文件后缀。

接下来添加 output.publicPath。

```js
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './assets/'
  }
```

此时图片路径会成为如下形式：

```js
import avatarImg from './assets/img/avatar.jpg'
console.log(avatarImg) // ./assets/5f93203d589c7c68ae80853f5c8c6cea.jpg
```

file-loader 也支持配置文件名以及 publicPath(这里的 publicPath 会覆盖原有的 output.publicPath )，通过 loader 的 options 传入。

```js
rules: [
  {
    test: /\.(png|jpg|gif)$/,
	use: {
        loader: 'file-loader',
        options: {
            name: '[name].[ext]',
            publicPath: './another-path/'
        }
    }
   }
]
```

此时图片路径会成为如下形式：

```js
import avatarImg from './assets/img/avatar.jpg'
console.log(avatarImg) // ./another-path/avatar.jpg
```

可以看到，file-loader 中 options.publicPath 覆盖了 Webpack 配置的 publicPath ，因此图片路径为 `./another-path/avatar.jpg`。

#### url-loader

url-loader 与 file-loader 作用类似，唯一的不同在于用户可以设置一个文件大小的阈值，当大于该阈值时于 file-loader 一样返回 publicPath ，而小于该阈值时则返回文件 base64 形式编码。

安装命令：

`yarn add url-loader -D`

```js
rules: [
  {
    test: /\.(png|jpg|gif)$/,
	use: {
        loader: 'url-loader',
        options: {
            limit: 10240,
            name: '[name].[ext]',
            publicPath: './another-path/'
        }
    }
   }
]
```

url-loader 可接收与 file-loader 相同的参数，如 name 和 publicPath 等，同时也可以接收一个 limit 参数。

```js
import avatarImg from './assets/img/avatar.jpg'
console.log(avatarImg) // data:image/jpeg;base64,/9j/4AAQ...
```

由于图片小于 limit，因此经过 url-loader 转化后得到的是 base64 形式的编码。

#### vue-loader

vue-loader 用于处理 vue 组件，类似以下形式：

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        title: 'Vue App'
      }
    }
  }
</script>

<style lang="css">
  h1 {
    color: #09c;
  }
</style>
```

vue-loader 可以将组建的模板、JS及样式进行拆分。在安装时，除了必要的 vue 与 vue-loader 外，还要安装 vue-template-compiler 来编译 Vue 模板，以及 css-loader 来处理样式(如果使用 SCSS 或 LESS 则需要安装对应的 loader)。

安装命令：

`yarn add vue vue-loader vue-template-compiler css-loader -D`

```js
rules: [
   {
      test: /\.vue$/,
      use: 'vue-loader'
   }
]
```

vue-loader 支持更多高级配置，可参阅 https://github.com/vuejs/vue-loader

### 自定义 loader

1. loader 初始化

   实现一个 loader，它会为所有 js 文件启用严格模式。

   在开发一个loader时，可以借助 npm/yarn 的软链接功能进行本地调试。下面，初始化这个loader并配置到工程中。

   创建一个 force-strict-loader 目录，然后进行项目初始化。

   ```shell
   yarn init -y
   ```

   接着创建 index.js 也就是 loader 的主体。

   ```js
   module.exports = function(content){
   	var useStrictPrefix = '\'use strict\';\n\n';
   	return useStrictPrefix + content
   }
   ```

   现在可以在 Webpack 中安装并使用这个 loader。

   ```shell
   yarn add <path-to-loader>/force-strict-loader
   ```

   在 Webpack 工程目录下使用相对路径安装，会在项目的 node_modules 中创建一个指向实际 force-strice-loader 目录的软链，也就是说之后可以随便修改loader源码并且不需要重新安装了。

   下面修改 Webpack 配置:

   ```js
      rules: [
         {
           test:  /\.js$/,
           use: 'force-strict-loader'
         }
   ```

   这个 loader 设置对所有 JS 文件生效。

2. 启用缓存

   当文件输入和其依赖没有发生变化时，应该让 loader 直接使用缓存，而不是重复进行转换的工作。在 Webpack 中可以使用 this.cacheable 进行控制，修改 loader。

   ```js
   module.exports = function (content) {
     if (this.cacheable) {
       this.cacheable()
     }
     var useStrictPrefix = '\'use strict\';\n\n';
     return useStrictPrefix + content
   }
   ```

   通过启用缓存可以加快 Webpack 打包速度，并且可保证相同的输入产生相同的输出。

3. 获取 options

   loader 的配置项通过 'use.options' 传进来：

   ```js
      rules: [
         {
           test:  /\.js$/,
           use: {
             loader: 'force-strict-loader',
             options: {
               sourceMap: true
             }
           }
         }
   ```

   上面为 force-strict-loader 传入了一个配置项 sourceMap，接下来在 loader 中获取它。首先需要安装一个依赖库 loader-utils，它主要用于提供一些帮助函数。在 force-strict-loader 目录安装：

   ```shell
   yarn add loader-utils -D
   ```

   修改 loader

   ```js
   var loaderUtils = require('loader-utils')
   module.exports = function (content) {
     if (this.cacheable) {
       this.cacheable()
     }
     var options = loaderUtils.getOptions(this) || {}
     console.log(options)
     var useStrictPrefix = '\'use strict\';\n\n';
     return useStrictPrefix + content
   }
   ```

   通过 loaderUtils.getOptions 可以获取到配置对象。下面看如何实现一个 source-map 功能。

4. source-map

   source-map 可以便于实际开发者在浏览器控制台查看源码。如果没有对 source-map 进行处理，最终也就无法生成正确的 map 文件，在浏览器 dev tool 中可能就会看到错乱的源码。

   支持 source-map 特性：

   ```js
   var loaderUtils = require('loader-utils')
   var SourceNode = require('source-map').SourceNode
   var SourceMapConsumer = require('source-map').SourceMapConsumer
   module.exports = function (content, sourceMap) {
     var useStrictPrefix = '\'use strict\';\n\n';
     if (this.cacheable) {
       this.cacheable()
     }
     // source-map
     var options = loaderUtils.getOptions(this) || {}
     if (options.sourceMap && sourceMap) {
       var currentRequest = loaderUtils.getCurrentRequest(this)
       var node = SourceNode.fromStringWithSourceMap(
         content,
         new SourceMapConsumer(sourceMap)
       )
       node.prepend(useStrictPrefix)
       var result = node.toStringWithSourceMap({file: currentRequest})
       var callback = this.async()
       callback(null, result.code, result.map.toJSON())
     }
     // 不支持 source-map
     return useStrictPrefix + content
   }
   ```

   首先，在 loader 函数的参数中获取到 sourceMap 对象，这是由 Webpack 或者上一个 loader 传递下来的，只有当它存在时我们的 loader 才能进行继续处理和向下传递。

   之后我们通过 source-map 这个库来对 map 进行操作，包括接收和消费之前的文件内容和 source-map，对内容节点进行修改，最后产生新的 source-map。

   在函数返回的时候要使用 this.async 获取 callback 函数（主要是为了一次性返回多个值）。callback 函数的 3 个参数分别是抛出错误、处理后的源码，以及 source-map。

更多 API 可以查阅 https://webpack.js.org/concepts/loaders/

## 样式处理

### 分离样式文件

通过 style-loader 和 css-loader，在  JS 中引用 CSS 的方式打包样式，可以更清晰的描述模块间的依赖关系。

然而还有一个问题没有解决，我们是通过 style 标签的方式引入样式的，那么如何输出单独的 CSS 文件呢？一般来说，在生产环境下，我们希望样式存在于 CSS 文件中而不是 style 标签中，因为文件更有利于客户端进行缓存。Webpack 社区有专门的插件: extract-text-webpack-plugin 和 mini-css-extract-plugin，它们就是专门用于提取样式到 CSS 文件的。

#### extract-text-webpack-plugin

`yarn add extract-text-webpack-plugin -D`

#### 多样式文件的处理

样式的提取是以资源入口开始的整个 chunk 为单位的。假设应用从 index.js 开始一层层引入了几百个模块，也许其中很多模块都引入了各自的样式，但是最终只会生成一个 CSS 文件，因为它们都来自同一个入口模块。

当工程中有多个入口时就会发生重名问题。也需要对插件提取的 CSS 文件使用类似模板的命名方式。

假设有 foo.js 和 bar.js，并且它们分别引用了 foo-style.js 和 bar-style.css，现在通过配置使他们输出各自的 css 文件。

#### mini-css-extract-plugin

这个插件的最重要特性就是它支持按需加载 CSS。

#### postcss-loader

可以结合 css-loader 使用，也可以单独使用。postcss要求必须有一个单独的配置文件。因此，需要在项目的根目录下创建一个 postcss.config.js。

#### 自动前缀

Autoprefixer 可自动决定是否要为某一特性添加厂商前缀，并且可以由开发者为其指定支持浏览器的范围。

```
yarn add autoprefixer -D
```

在 postcss.config.js 中添加 autoprefixer

```js
const autoprefixer= require('autoprefixer')
module.exports = {
  plugins: [
    autoprefixer({
      grid: true,
      browsers: [
        '> 1%',
        'last 3 versions',
        'android 4.2',
        'ie 8'
      ]
    })
  ]
}
```

####  stylelint

stylelint 是一个 CSS 的质量检测工具，就像 eslint 一样，我们可以为其添加各种规则，来统一项目的代码风格，确保代码质量。

```
yarn add stylelint -D
```

在 postcss.config.js 中添加相应配置

```js
const autoprefixer= require('autoprefixer')
const stylelint = require('stylelint')
module.exports = {
  plugins: [
    stylelint({
      config: {
        rules: {
          'declaration-no-important': true
        }
      }
    }),

    autoprefixer({
      grid: true,
      browsers: [
        '> 1%',
        'last 3 versions',
        'android 4.2',
        'ie 8'
      ]
    })
  ]
}
```

添加了 declaration-no-important 这样一条规则，当代码中出现 “!important” 时就会给出警告。

使用 stylelint 可以检测出代码中的样式问题(语法错误、重复的属性等)，帮助我们写出更加安全并且风格更加一致的代码。

#### CSSNext

PostCss 可以与 CSSNext 结合使用，让我们在应用中使用最新的 CSS 语法特性。

```
yarn add postcss-cssnext -D
```

在 postcss.config.js 中添加配置

```js
const autoprefixer= require('autoprefixer')
const stylelint = require('stylelint')
const postcssCssnext = require('postcss-cssnext')
module.exports = {
  plugins: [
    stylelint({
      config: {
        rules: {
          'declaration-no-important': true
        }
      }
    }),
    postcssCssnext({
      browsers: [
        '> 1%',
        'last 2 versions',
      ]
    }),

    autoprefixer({
      grid: true,
      browsers: [
        '> 1%',
        'last 3 versions',
        'android 4.2',
        'ie 8'
      ]
    })
  ]
}
```

指定好需要支持的浏览器后，就可以顺畅的使用 CSSNext 的特性了。PostCSS 会帮我们把 CSSNext 的语法翻译为浏览器能接受的属性和形式。

### CSS Modules

- 每个 CSS 文件中的样式都拥有单独的作用域，不会和外界发生命名冲突
- 对 CSS 进行依赖管理，可以通过相对路径引入 CSS 文件
- 可以通过 composes 轻松复用其他 CSS 模块

使用 CSS Modules 不需要额外安装模块，只需要开启 css-loader 中的 modules 配置项即可。

```js
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:6]'
            }
          }
        ]
      }
```

需要注意 localIdentName 配置项，它用于指明 CSS 代码中的类名会如何来编译。

```css
.title {
	color: #f938ab
}
```

经过编译后可能将成为 .style_title_1CFy6。

- [name] 指代的是模块名，这里被替换为 style
- [local] 指代的是原本的选择器标识符，这里被替换为 title
- [hash:base64:5] 指代的是一个 5 位的 hash 值，这个 hash 值是根据模块名和标识符计算的，因此不同模块中相同的标识符也不会造成样式冲突。

在 JavaScript 中引入 CSS 的样式，之前只是将 CSS  文件引入就可以了，但使用 CSS Modules 时 CSS 文件会导出一个对象，我们需要把这个对象中的属性添加到 HTML 标签上。

```css
.title {
	color: #f938ab
}
```

```js
import styles from './style.css'
document.write(`<h1> class="${styles.title} My Webpack app </h1>"`)
```

最终这个 HTML 中的 class 才能与我们编译后的 CSS 类名匹配上。

通过 SASS、LESS 等预编译样式语言来提升开发效率，降低代码复杂度。通过 POSTCSS 包含的很多功能强大的插件，可以让我们使用更新的 CSS 特性，保证更好的浏览器兼容性。通过 CSS Modules 可以让 CSS 模块化，避免样式冲突。

## 代码分片

通过代码分片，可以把代码按照特性的形式进行拆分，使用户不必一次全部加载，而是按需加载。

代码分片可以有效降低首屏加载资源的大小，但同时会带来应该对哪些模块进行分片、分片后的资源如何管理等问题。

### 通过入口划分代码

在 Webpack 中每个入口都将生成一个对应的资源文件，通过入口的配置可以进行一些简单有效的代码拆分。

对于 Web 应用来说通常会有一些库和工具是不常变动的，可以把它们放在一个单独的入口中，由该入口产生的资源不会经常更新，因此可以有效地利用客户端缓存，让用户不必在每次请求页面时都重新加载。

```js
// webpack.config1.js
entry: {
    app: './app.js',
    lib: ['lib-a', 'lib-b', 'lib-c']
}
```

```html
<script src="dist/lib.js"></script>
<script src="dist/app.js"></script>
```

这种拆分方法主要适合于那些将接口绑定在全局对象上的库，因为业务代码中的模块无法直接引用库中的模块，二者属于不同的依赖树。

对于多页面应用来说，也可以利用入口划分的方式拆分代码。比如，为每一个页面创建一个入口，并放入只涉及该页面的代码，同时再创建一个入口来包含所有公共模块，并使每个页面都进行加载。但是这样仍会带来公共模块与业务模块处于不同依赖树的问题。另外，很多时候不是所有的页面都需要这些公共模块。比如 A、B 页面需要 lib-a 模块、C、D 需要 lib-b 模块，通过手工的方式去配置和提取公共模块将会变得十分复杂。不过可以使用 Webpack 专门提供的插件来解决这个问题。

### CommonsChunkPlugin

CommonsChunkPlugin 是 Webpack4 之前内部自带的插件(Webpack4 之后替换为了 SplitChunks )。它可以将多个 Chunk 中公共的部分提取出来。公共模块的提取可以为项目带来几个收益：

- 开发过程中减少了重复模块打包，可以提升开发速度
- 减小整体资源体积
- 合理分片后的代码可以更有效地利用客户端缓存

```js
// 添加 CommonsChunkPlugin
const webpack = require('webpack')
module.exports = {
    entry: {
        foo: './foo.js',
        bar: './bar.js'
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'common.js'
        })
    ]
}
```

在配置文件的头部首先引入了 Webpack，接着使用其内部的 CommonsChunkPlugin 函数创建了一个插件实例，并传入配置对象。

- name：用于指定公共 chunk 的名字
- filename：提取后的资源文件名

最后，记得在页面中添加一个 script 标签来引入 common.js ，并且注意，该 JS 文件一定要在其他 JS 之前引入。

#### 提取 vendor

虽然 CommonsChunkPlugin 主要用于提取多入口之间的公共模块，但这不代表对于单入口的应用就无法使用。我们仍然可以用它来提取第三方类库及业务中不常更新的模块，只需要单独为它们创建一个入口即可。

```js
// webpack.config1.js
const webpack = require('webpack')
module.exports = {
    entry: {
        app: './app.js',
        vendor: ['react']
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        })
    ]
}
```

```js
// app.js
import React from 'react'
document.write('app.js', React.version)
```

为了将 react 从 app.js 提取出来，我们在配置中加入了一个入口 vendor，并使其只包含 react，这样就把 react 变为了 app 和 vendor 这两个 chunk 所共有的模块。在插件内部配置中，我们将 name 指定为 vendor，这样由 CommonsChunkPlugin 所产生的资源将覆盖原有的由 vendor 这个入口所产生的资源。

#### 设置提取范围

通过 CommonsChunkPlugin 中的 chunks 配置项可以规定从哪些入口中提取公共模块：

```js
// webpack.config1.js
const webpack = require('webpack')
module.exports = {
    entry: {
        a: './a.js',
        b: './b.js',
        c: './c.js'
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'common.js',
            chunks: ['a', 'b']
        })
    ]
}
```

我们在 chunks 中配置了 a 和 b，这意味着只会从 a.js 和 b.js 中提取公共模块。

对于一个大型应用来说，拥有几十个页面是很正常的，这也就意味着会有几十个资源入口。这些入口所共享的模块也许会有些差异，在这种情况下，可以配置多个 CommonsChunkPlugin，并为每个插件规定提取的范围，来更有效地进行提取。

#### 设置提取规则

CommonsChunkPlugin 的默认规则是只要一个模块被两个入口 chunk 所使用就会被提取出来，比如只要 a 和 b 用了 react，react 就会被提取出来。

然而现实情况是，有些时候我们不希望所有的公共模块都被提取出来，比如项目中一些组件或工具模块，虽然被多次引用，但是可能经常修改，如果将其和 react 这种库放在一起反而不利于客户端缓存。

此时可以通过 CommonsChunkPlugin 的 minChunks 配置项来设置提取的规则。该配置项非常灵活，支持多种输入形式。

1. 数字

   minChunks 可以接受一个数字，当设置 minChunks 为 n 时，只有该模块被 n 个入口同时引用才会进行提取。另外，这个阈值不会影响通过数组形式入口传入模块的提取。

   ```js
   // webpack.config1.js
   const webpack = require('webpack')
   module.exports = {
       entry: {
           foo: './foo.js',
           bar: './bar.js',
           vendor: ['react']
       },
       output: {
           filename: '[name].js'
       },
       plugins: [
           new webpack.optimize.CommonsChunkPlugin({
               name: 'vendor',
               filename: 'vendor.js',
               minChunks: 3
           })
       ]
   }
   ```

   令 foo.js 和 bar.js 共同引用一个 utils.js

   ```js
   // foo.js
   import React from 'react'
   import './util'
   document.write('foo.js', React.version)
   ```

   ```js
   // bar.js
   import React from 'react'
   import './util'
   document.write('bar.js', React.version)
   ```

   ```js
   // util.js
   console.log('util')
   ```

   如果实际打包应该可以发现，由于我们设置 minChunks 为 3，util.js 并不会被提取到 vendor.js 中，然而 react 并不受这个的影响，仍然会出现在 vendor.js 中。这就是所说的数组形式入口的模块会照常提取。

2. Infinity

   设置为无穷代表提取的阈值无限高，也就是说所有模块都不会被提取。

   这个配置项有两个意义。第一个是和上面的情况类似，即我们只想让 Webpack 提取特定的几个模块，并将这些模块通过数组型入口传入，这样做的好处是提取哪些模块是完全可控的；另一个是我们指定 minChunks 为 Infinity，为了生成一个没有任何模块而仅仅包含 Webpack 初始化环境的文件，这个文件我们通常称为 manifest 。

3. 函数

   minChunks 支持传入一个函数，它可以让我们更细粒度地控制公共模块。Webpack 打包过程中的每个模块都会经过这个函数的处理，当函数的返回值是 true 时进行提取。

   ```js
   new webpack.optimize.CommonsChunkPlugin({
       name: "vendor",
       filename: "vendor.js",
       minChunks: function(module, count) {
           // module.context 模块目录路径
           if(module.context && module.context.includes('node_modules')) {
               return true;
           }
           
           // module.resource 包含模块名的完整路径
           if(module.resource && module.resource.endsWith('util.js')) {
               return true;
           }
           
           // count 为模块被引用的次数
           if (count > 5) {
               return true;
           }
       }
   })
   ```

   借助上面的配置，我们可以分别提取 node_modules 目录下的模块、名称名为 util.js 的模块，以及被引用 5 次 (不包含 5 次) 以上的模块。

#### hash 与长效缓存

使用 CommonsChunkPlugin 时，一个绕不开的问题就是 hash 与长效缓存。当我们使用该插件提取公共模块时，提取后的资源内部不仅仅是模块的代码，往往还包含 Webpack 的运行时。Webpack 的运行时指的是初始化环境的代码，如创建模块缓存对象、声明模块加载函数等。

在较早期的 Webpack 版本中，运行时内部也包含模块的 id，并且这个 id 是以数字的方式不断累加的（比如第 1 个模块 id 是 0，第 2 个模块 id 是 1） 。这会造成一个问题，即模块 id 的改变会导致运行时内部的代码发生变动，进一步影响 chunk hash 的生成。一般我们会使用 chunk hash 作为资源的版本号优化客户端的缓存，版本号改变会导致用户频繁地更新资源，即便他们的内容并没有发生变化也会更新。

这个问题的解决方案是：将运行时的代码单独提取出来。如：

```js
// webpack.config1.js
const webpack = require('webpack')
module.exports = {
    entry: {
        app: './app.js',
        vendor: ['react']
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
}
```

上面的配置中，通过添加一个 name 为 manifest 的 CommonsChunkPlugin 来提取 Webpack 的运行时。

注意：

- manifest 的 CommonsChunkPlugin 必须出现在最后，否则 Webpack 将无法正常提取模块。

在我们的页面中，manifest.js 应该最先被引入，用来初始化 Webpack 环境。如：

```html
<!-- index.html -->
<script src="dist/manifest.js"></script>
<script src="dist/vendor.js"></script>
<script src="dist/app.js"></script>
```

通过这种方式，app.js 中的变化将只会影响 manifest.js ，而它只是一个很小的文件，我们的 vendor.js 内容及 hash 都不会变化，因此可以被用户所缓存。

#### CommonsChunkPlugin 的不足

在提取公共模块方面，CommonsChunkPlugin 可以满足很多场景的需求，但是它也有一些欠缺的地方。

1. 一个 CommonsChunkPlugin 只能提取一个 vendor，假如我们想提取多个 vendor 则需要配置多个插件，这会增加很多重复的配置代码。

2. 前面我们提到的 manifest.js 实际上会使浏览器多加载一个资源，这对于页面渲染速度是不友好的。

3. 由于内部设计上的一些缺陷，CommonsChunkPlugin 在提取公共模块的时候会破坏掉原有 chunk 中模块的依赖关系，导致难以进行更多的优化。比如在异步 Chunk 的场景下 CommonsChunkPlugin 并不会按照我们的预期正常工作。如:

   ```js
   // webpack.config1.js
   const webpack = require('webpack')
   module.exports = {
       entry: './foo.js',
       output: {
           filename: 'foo.js'
       },
       plugins: [
           new webpack.optimize.CommonsChunkPlugin({
               name: 'commons',
               filename: 'commons.js'
           })
       ]
   }
   ```

   ```js
   // foo.js
   import React from 'react'
   import('./bar.js')
   document.write('foo.js', React.version)
   ```

   ```js
   // bar.js
   import React from 'react'
   document.write('bar.js', React.version)
   ```

   从结果可以看出，react 仍然在 foo.js 中，并没有按照我们的预期被提取到 commons.js 里。

### optimization.SplitChunks

optimization.SplitChunks 是 Webpack4 为了改进  CommonsChunkPlugin 而重新设计和实现的代码分片特性。它不仅比 CommonsChunkPlugin 功能更加强大，还更简单易用。

比如前面异步加载的例子，在换成 Webpack4 的 SplitChunks 后，就可以自动提取出 react 了。

```js
// webpack.config1.js
module.exports = {
    entry: './foo.js',
    output: {
        filename: 'foo.js',
        publicPath: '/dist/'
    },
    mode: 'development',
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```

```js
// foo.js
import React from 'react'
import('./bar.js')
document.write('foo.js', React.version)
```

```js
// bar.js
import React from 'react'
document.write('bar.js', React.version)
```

此处 Webpack4 的配置与之前相比有两点不同：

- 使用 optimization.splitChunks 替代了 CommonsChunkPlugin，并指定了 chunks 的值为 all，这个配置项的含义是，SplitChunks 将会对所有的 chunks 生效（默认情况下，SplitChunks 只对异步 chunks 生效，并且不需要配置）。
- mode 是 Webpack4 中新增的配置项，可以针对当前是开发环境还是生产环境自动添加对应的一些 Webpack 配置。

#### 从命令式到声明式

在使用 CommonsChunkPlugin 的时候，我们大多数时候是通过配置项将特定入口中的特定模块提取出来，也就是更贴近命令式的方式。而 SplitChunks 的不同之处在于我们只需要设置一些提取条件，如提取的模式、提取模块的体积等，当某些模块达到这些条件后就会自动被提取出来。SplitChunks 的使用更像是声明式的。

以下是 SplitChunks 默认情形下的提取条件：

- 提取后的 chunk 可被共享或者来自 node_modules 目录。这一条很容易理解，被多次引用或处于 node_modules 中的模块更倾向于是通用模块，比较适合被提取出来。
- 提取后的 Javascript chunk 体积大于 30kB (压缩和gzip之前)，CSS chunk 体积大于 50kB。这个也比较容易理解，如果提取后的资源体积太小，那么带来的优化效果也比较一般。
- 在按需加载过程中，并行请求的资源最大值小于等于 5。按需加载指的是，通过动态插入 script 标签的方式加载脚本。我们一般不希望同时加载过多的资源，因为每一个请求都要花费建立链接和释放链接的成本，因此提取的规则只在并行请求不多的时候生效。
- 在首次加载时，并行请求的资源数最大值小于等于 3 。和上一条类似，只不过在页面首次加载时往往对性能的要求更高，因此这里的默认阈值也更低。

在从 foo.js 和 bar.js 提取 react 前，会对这些条件一一进行验证，只有满足了所有条件之后 react 才会被提取出来。下面进行对比：

- react 属于 node_modules 目录下的模块
- react 的体积大于 30kB
- 按需加载时的并行请求数量为 1 ， 为 0.foo.js
- 首次加载时的并行请求数量为 2 ，为 foo.js 和 vendors-main.foo.js 。之所以 vendors-main.foo.js 不算在第 3 条是因为它需要被添加在 HTML 的 script 标签中，在页面初始化的时候就会进行加载。

#### 默认的异步提取

前面对 SplitChunks 添加了一个 chunks:all 的配置，这是为了提取 foo.js 和 bar.js 的公共模块。实际上 SplitChunks 不需要配置也能生效，但仅仅针对异步资源。如：

```js
// webpack.config1.js
module.exports = {
	entry: './foo.js',
	output: {
		filename: 'foo.js',
		publicPath: '/dist/'
	},
	mode: 'development'
}
```

```js
// foo.js
import('./bar.js')
console.log('foo.js')
```

```js
// bar.js
import lodash from 'lodash'
console.log(lodash.flatten([1, [2, 3]]))
```

从结果来看，foo.js 不仅产生了一个 0.foo.js ，还有一个 1.foo.js ，这里面包含的就是 lodash 的内容。再与之前的 4 个条件进行比较：

- lodash 属于 node_modules 目录下的模块，因此即便只有一个 bar.js 引用它，也符合条件。
- lodash 的体积大于 30 kB
- 按需加载时的并行请求数量为 2， 为 0.foo.js 和 1.foo.js
- 首次加载时的并行请求数量为 1，为 foo.js 。这里没有计算 1.foo.js 的原因是它只是被异步资源所需要，并不影响入口资源的加载，也不需要添加额外的 script 标签。

#### 配置

看下 SplitChunks 是怎样工作的，看下默认配置：

```js
splitChunks: {
    chunks: "async",
    minSize: {
        javascript: 30000,
         style: 50000
    },
    maxSize: 0,
    minChunks: 1,
	maxAsyncRequests: 5,
	maxInitialRequests: 3,
	automaticNameDelimiter: '~',
	name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
			priority: -10
        },
        default: {
        	minChunks: 2,        
			priority: -20,
			reuseExistingChunk: true
        }
    }
}
```

1. 匹配模式

   通过 chunks 我们可以配置 SplitChunks 的工作模式。它有 3 个可选值，分别为 async(默认)、initial 和 all。async 即只提取异步 chunk，initial 则只对入口 chunk 生效（如果配置了 initial 则上面异步的例子将失效），all 则是两种模式同时开启。

2. 匹配条件

   minSize、minChunks、maxAsyncRequests、maxInitialRequests 都属于匹配条件。

3. 命名

   配置项 name 默认为 true，它意味着 SplitChunks 可以根据 cacheGroups 和作用范围自动为新生成的 chunk 命名，并以 automaticNameDelimiter 分隔。如 vendor~a~b~c.js 意思是 cacheGroups 为 vendors，并且该 chunk 是由 a、b、c 三个入口 chunk 所产生的。

4. cacheGroups

   可以理解成分离 chunks 时的规则。默认情况下有两种规则—— vendors 和 default 。vendors 用于提取所有 node_modules 中符合条件的模块，default 则作用于被多次引用的模块。我们可以对这些规则进行增加或者修改，如果想要禁用某种规则，也可以直接将其置为 false。当一个模块同时符合多个 cacheGroups 时，则根据其中的 priority 配置项确定优先级。

### 资源异步加载

资源异步加载主要解决的问题是，当模块数量过多、资源体积过大时，可以把一些暂时用不到的模块延迟加载。这样使页面初次渲染的时候用户下载的资源尽可能小，后续的模块等到恰当的时机再去触发加载。因此一般也把这种方法叫作按需加载。

#### import()

在 Webpack 中有两种异步加载的方式——import 函数及 require.ensure。require.ensure 是 Webpack 1 支持的异步加载方式，从 Webpack 2 开始引入了 import 函数，并且官方也更推荐它。

与正常 ES6 中的 import 语法不同，通过 import 函数加载的模块及其依赖会被异步地进行加载，并返回一个 Promise 对象。

看一个正常模块加载的例子：

```js
// foo.js
import {add} from './bar.js'
console.log(add(2, 3))
```

```js
// bar.js
export function add (a, b) {
	return a + b
}
```

假设 bar.js 的资源体积很大，并且在页面初次渲染的时候并不需要使用它，就可以对它进行异步加载。

```js
// foo.js
import('./bar.js').then(({add}) => {
	console.log(add(2, 3))
})
```

```js
// bar.js
export function add(a, b) {
    return a + b
}
```

这里还需要更改下 Webpack 的配置

```js
module.exports = {
    entry: {
        foo: './foo.js'
    },
    output: {
        publicPath: '/dist/',
        filename: '[name].js'
    },
    mode: 'development',
    devServer: {
        publicPath: '/dist/',
        port: 3000
    }
}
```

首屏加载的 JS 资源地址是通过页面中的 script 标签来指定的，而间接资源 （通过首屏 JS 再进一步加载的 JS）的位置则要通过 output.publicPath 来指定。上面我们的 import 函数相当于使 bar.js 成为了一个间接资源，我们需要配置 publicPath 来告诉 Webpack 去哪里获取它。

该技术实现的原理很简单，就是通过 JavaScript 在页面的 head 标签里插入一个 script 标签 /dist/0.js。由于该标签在原本的 HTML 页面中并没有，因此我们称它是动态插入的。

import 函数还有一个比较重要的特性。ES 6 Module 中要求 import 必须出现在代码的顶层作用域，而 Webpack 的 import 函数则可以在任何我们希望的时候调用。如：

```js
if(condition) {
	import('./a.js').then(a => {
		console.log(a)
	})
}else {
	import('./b.js').then(b => {
		console.log(b)
	})
}
```

这种异步加载方式可以赋予应用很强的动态特性，它经常被用来在用户切换到某些特定路由时去渲染相应组件，这样分离之后首屏加载的资源就会小很多。

#### 异步 chunk 的配置

现在我们已经生成了异步资源，但我们会发现产生的资源名称都是数字 id（如 0.js），没有可读性。还需要通过一些 Webpack 的配置来为其添加有意义的名字，以便于管理。

还是上面的例子，我们修改一下 foo.js 及 Webpack 的配置。

```js
// webpack.config1.js
module.exports = {
    entry: {
        foo: './foo.js'
    },
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    mode: 'development'
}
```

```js
// foo.js
import(/* webpackChunkName: "bar" */ './bar.js').then(({add}) => {
    console.log(add(2, 3))
})
```

可以看到，我们在 Webpack 的配置中添加了 output.chunkFilename，用来指定异步 chunk 的文件名。其命名规则与 output.filename 基本一致，不过由于异步 chunk 默认没有名字，其默认值是 [id].js，这也是为什么我们在例子中看到的是 0.js。如果有更多的异步 chunk，则会依次产生 1.js、2.js 等。

在 foo.js 中，我们通过特有的注释来让 Webpack 获取到异步 chunk 的名字，并配置 output.chunkFilename 为 [name].js。

### 小结

Webpack代码分片的几种方式：

- 合理地规划入口，使用 CommonsChunkPlugin 或 SplitChunks
- 资源异步加载

借助这些方法可以有效地缩小资源体积，同时更好地利用缓存，给用户更友好的体验。

## 生产环境配置

### 环境配置的封装

生产环境的配置与开发环境有所不同，比如要设置 mode、环境变量，为文件名添加 chunk hash 作为版本号等。如何让 Webpack 可以按照不同环境采用不同的配置呢？

一般来说有以下两种方式。

1. 使用相同的配置文件

   比如令 Webpack 不管在什么环境下打包都使用 webpack.config1.js，只是在构建开始前将当前所属环境作为一个变量传进去，然后在 webpack.config1.js 中通过各种判断条件来决定具体使用哪个配置。比如：

   ```json
   // package.json
   {
    	...
       "scripts": {
           "dev": "ENV=development webpack-dev-server",
           "build": "ENV=production webpack"
       }
   }
   ```

   ```js
   // webpack.config1.js
   const ENV = process.env.ENV
   const isProd = ENV === 'production'
   module.exports = {
       output: {
           filename: isProd ? 'bundle@[chunkhash].js' : 'bundle.js'
       },
       mode: ENV
   }
   ```

   上面示例通过 npm 脚本命令中传入了一个 ENV 环境变量，webpack.config1.js 则根据它的值来确定具体采用什么配置。

2. 为不同环境创建各自的配置文件。比如，我们可以单独创建一个 webpack.production.config.js ，开发环境的则可以叫 webpack.development.config.js。然后修改 package.json。

   ```json
   {
       ...
   	"scripts": {
           "dev": "webpack-dev-server --config=webpack.development.config.js",
           "build": "webpack --config=webpack.production.config.js"
       }
   }
   ```

   上面通过 --config 指定打包时使用的配置文件。但这种方法存在一个问题，即 webpack.development.config.js 和 webpack.production.config.js 肯定会有重复的部分，一改都要改，不利于维护。在这种情况下可以将公共的配置文件提取出来，比如单独创建一个 webpack.common.config.js。

   ```js
   module.exports = {
   	entry: './src/index.js',
   	// development 和 production 共有配置
   }
   ```

   然后让另外两个 JS 文件分别引用该文件，并添加上自身环境的配置即可。除此之外，也可以使用 webpack-merge ，它是一个专门用来做 Webpack 配置合并的工具，便于我们对繁杂的配置进行管理。

### 开启 production 模式

Webpack4 中直接加了一个 mode 配置项，让开发者可以通过它来直接切换打包模式。如：

```js
// webpack.config1.js
module.exports = {
    mode: 'production'
}
```

这意味着当前处于生产环境模式，Webpack 会自动添加许多适用于生产环境的配置项，减少了人为动手的工作。

Webpack 这样做其实是希望隐藏许多具体配置的细节，而将其转化为更具有语义性、更简洁的配置提供出来。从 Webpack4 开始我们已经能看到它的配置文件不应该越写越多，而是应该越写越少。

### 环境变量

通常我们需要为生产环境和本地环境添加不同的环境变量，在 Webpack 中可以使用 DefinePlugin 进行设置。如：

```js
// webpack.config1.js
const webpack = require('webpack')
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify('production')
        })
    ]
}
```

```js
// app.js
document.write(ENV)
```

上面的配置通过 DefinePlugin 设置了 ENV 环境变量，最终页面上输出的将会是字符串 production。

除字符串类型的值以外，还可以设置其他类型的环境变量。

```js
new webpack.DefinePlugin({
    ENV: JSON.stringify('production'),
    IS_PRODUCTION: true,
    ENV_ID: 130912098,
    CONSTANTS: JSON.stringify({
        TYPES: ['foo', 'bar']
    })
})
```

我们在一些值的外面加上了 JSON.stringify，这是因为 DefinePlugin 在替换环境变量时对于字符串类型的值进行的是完全替换。假如不添加 JSON.stringify 的话，在替换后就会成为变量名，而非字符串值。因此对于字符串环境变量及包含字符串的对象都要加上 JSON.stringify 才行。

许多框架与库都采用 process.env.NODE_ENV 作为一个区别开发环境和生产环境的变量。process.env 是 Node.js 用于存放当前进程环境变量的对象；而 NODE_ENV 则可以让开发者指定当前的运行时环境，当它的值为 production 时即代表当前为生产环境，库和框架在打包时如果发现了它就可以去掉一些开发环境的代码，如警告信息和日志等。这将有助于提升代码运行速度和减小资源体积。具体配置如下：

```js
new webpack.DefinePlugin({
    process.env.NODE_ENV: 'production'
})
```

如果启用了 mode:production，则 Webpack 已经设置好了 process.env.NODE_ENV，不需要再人为添加了。

### source map

source map 指的是将编译、打包、压缩后的代码映射回源代码的过程。经过 Webpack 打包压缩后的代码基本上已经不具备可读性，此时若代码抛出了一个错误，要想回溯它的调用栈是非常困难的。而有了 source map，再加上浏览器调试工具(dev tools)，要做到这一点就非常容易了。同时它对于线上问题的追查也有一定帮助。

#### 原理

Webpack 对于工程源代码的每一步处理都有可能会改变代码的位置、结构，甚至是所处文件，因此每一步都需要生成对应的 source map。若我们启用了 devtool 选项，source map 就会跟随源代码一步步被传递，直到生成最后的 map 文件。这个文件默认就是打包后的文件名加上 .map，如 bundle.js.map。

在生成 mapping 文件的同时，bundle 文件会追加上一句注释来标识 map 文件的位置。如：

```js
// bundle.js
(function() {
    // bundle 的内容
})()
//# sourceMappingURL=bundle.js.mp
```

当我们打开了浏览器的开发者工具时，map 文件会同时被加载，这时浏览器会使用它来对打包后的 bundle 文件进行解析，分析出源代码的目录结构和内容。

map 文件有时会很大，但是不用担心，只要不打开开发者工具，浏览器是不会加载这些文件的，因此对于普通用户来说并没有影响。但是使用 source map 会有一定的安全隐患，即任何人都可以通过 dev tools 看到工程源码。

#### source map配置

Javascript 的 source map 的配置很简单，只要在 webpack.config1.js 中添加 devtool 即可。

```js
module.exports = {
	// ...
	devtool: 'source-map'
}
```

对于 CSS、SCSS、Less 来说，则需要添加额外的 source map 配置项。如下面例子所示：

```js
const path = require('path')
module.exports = {
    // ...
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
}
```

开启 source map 之后，打开 Chrome 的开发者工具，在 "Sources" 选项卡下面的  "webpack://" 目录中可以找到解析后的工程源码。

 Webpack 支持多种 source map 的形式。除了配置为 devtool: 'source-map' 以外，还可以根据不同的需求选择 cheap-source-map、eval-source-map 等。通常它们都是 source map 的一些简略版本，因为生成完整的 source map 会延长整体构建时间，如果对打包速度需求比较高的话，建议选择一个简化版的 source map。比如，在开发环境中，cheap-module-eval-source-map 通常是一个不错的选择，属于打包速度和源码信息还原程度的一个良好折中。

在生产环境中会对代码进行压缩，而最常见的压缩插件 UglifyjsWebpackPlugin 目前只支持完全的 source-map，因此没有那么多选择，只能用 source-map、hidder-source-map、nosources-source-map 这三者之一。

#### 安全

source map 不仅可以帮助开发者调试源码，当线上有问题产生时也有助于查看调用栈信息，是线上查错十分重要的线索。同时，有了 source map 也就意味着任何人通过浏览器的开发者工具都可以看到工程源码，对于安全性来说也是极大的隐患。那么如何才能在保持其功能的同时，防止暴露源码给用户呢？Webpack 提供了 hidden-source-map 及 nosources-source-map 两种策略来提升 source-map 的安全性。

hidden-source-map 意味着 Webpack 仍然会产生出完整的 map 文件，只不过不会在 bundle 文件中添加对于 map 文件的引用。这样一来，当打开浏览器的开发者工具时，我们是看不到 map 文件的，浏览器自然也无法对 bundle 进行解析。如果我们想要追溯源码，则要利用一些第三方服务，将 map 文件上传到那上面。目前最流行的解决方案是 Sentry。

Sentry 是一个错误跟踪平台，开发者接入后可以进行错误的收集和聚类，以便于更好地发现和解决线上问题。Sentry 支持 JavaScript 的 source map，我们可以通过它所提供的命令行工具或者 Webpack 插件来自动上传 map 文件。同时我们还要在工程代码中添加 Sentry 对应的工具包，每当 JavaScript 执行出错时就会上报给 Sentry。Sentry 在接收到错误后，就会去找对应的 map 文件进行源码解析，并给出源码中的错误栈。

另一种配置是 nosources-source-map，它对于安全性的保护性则没那么强，但是使用方式相对简单。打包部署后，可以在浏览器开发者工具的 Sources 选项卡中看到源码的目录结构，但是文件的具体内容会被隐藏起来。对于错误来说，我们仍然可以在 Console 控制台中查看源代码的错误栈，或者 console 日志的准确行数，它对于追溯错误来说基本足够，并且其安全性相对于可以看到整个源码的 source-map 配置来说要略高一些。

在所有这些配置之外还有一种选择，就是我们可以正常打包出 source map，然后通过服务器的 nginx 设置（或其他类似工具） 将 .map 文件只对固定的白名单（比如公司内网）开放，这样我们仍然可以看到源码，而在一般用户的浏览器中就无法获取到它们了。

### 资源压缩

在将资源发布到线上环境之前，我们通常都会进行代码压缩，或者叫 uglify，意思是移除多余的空格、换行及执行不到的代码，缩短变量名，在执行结果不变的前提下将代码替换为更短的形式。一般正常的代码在 uglify 之后整体体积都将会显著缩小。同时，uglify 之后的代码将基本上不可读，在一定程度上提升了代码的安全性。

#### 压缩 JavaScript

压缩 JavaScript 大多数时候使用的工具有两个，一个是 UglifyJS（Webpack3 已集成），另一个是 terser （Webpack4 已集成）。后者由于支持 ES6+ 代码的压缩，更加面向于未来，因此官方在 Webpack4 中默认使用了 terser 的插件 terser-webpack-plugin。

在 Webpack3 中的话，开启压缩需要调用 webpack.optimize.UglifyJsPlugin。如下面：

```js
// webpack version < 4
const webpack = require('webpack')
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
}
```

从 Webpack4 之后，这项配置被移到了 config.optimization.minimize。下面是 Webpack 4 的示例（如果开启了 mode: production ，则不需要人为配置）:

```js
module.exports = {
	entry: './app.js',
	output: {
		filename: 'bundle.js'
	},
	optimization: {
		minimize: true
	}
}
```

 terser-webpack-plugin 插件支持自定义配置。下面为常用配置：

| 配置项        | 类型                                  | 默认值            | 功能描述                                                     |
| ------------- | ------------------------------------- | ----------------- | ------------------------------------------------------------ |
| test          | String\|RegExp\|Array<String\|RegExp> | /\.m?js(\?.*)?$/i | terser的作用范围                                             |
| include       | String\|RegExp\|Array<String\|RegExp> | undefined         | 使 terser 额外对某些文件或目录生效                           |
| exclude       | String\|RegExp\|Array<String\|RegExp> | undefined         | 排除某些文件或目录                                           |
| cache         | Boolean\|String                       | false             | 是否开启缓存。默认的缓存目录为 node_modules/.cache/terser-webpack-plugin，通过传入字符串类型的值可以修改 |
| parallel      | Boolean\|String                       | false             | 强烈建议开启，允许使用多个进程来进行压缩（可以通过传入数字类型的值来指定） |
| sourceMap     | Boolean                               | false             | 是否生成 source map（需同时存在 devtool 配置）               |
| terserOptions | Object                                | {...default}      | terser 压缩配置，如是否可对变量重命名，是否兼容 IE8 等       |

下面的例子展示了如何定义 terser-webpack-plugin 插件配置。

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    // ...
    optimization: {
        // 覆盖默认的 minimizer
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                exclude: /\/excludes/
            })
        ]
    }
}
```

#### 压缩 CSS

压缩 CSS 文件的前提是使用 extract-text-webpack-plugin 或 mini-css-extract-plugin 将样式提取出来，接着使用 optimize-css-assets-webpack-plugin 来进行压缩，这个插件本质上使用的是压缩器 cssnano，当然我们也可以通过其配置进行切换。

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ],
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                // 生效范围，只压缩匹配到的资源
                assetNameRegExp: /\.optimize\.css$/g,
                // 压缩处理器，默认为 cssnano
                cssProcessor: require('cssnano'),
                // 压缩处理器的配置
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                // 是否展示 log
                canPrint: true
            })
        ]
    }
}
```

### 缓存

缓存是指重复利用浏览器已经获取过的资源。合理地使用缓存是提升客户端性能的一个关键因素。具体的缓存策略（如指定缓存时间等）由服务器来决定，浏览器会在资源过期前一直使用本地缓存进行响应。

这同时也带来一个问题，假如开发者想要对代码进行了一个 bug fix，并希望立即更新到所有用户的浏览器上，而不要让他们使用旧的缓存资源应该怎么做？此时最好的办法是更改资源的 URL，这样可迫使所有客户端都去下载最新的资源。

#### 资源 hash

一个常用的方法是在每次打包的过程中对资源的内容计算一次 hash，并作为版本号存放在文件名中，如 bundle@2e0a691e769.js。bundle 是文件本身的名字，@ 后面跟的则是文件内容 hash 值，每当代码发生变化时相应的 hash 也会变化。

我们通常使用 chunkhash 来作为文件版本号，因为它会为每一个 chunk 单独计算一个 hash。如：

```js
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle@[chunkhash].js'
    },
    mode: 'production'
}
```

#### 输出动态 HTML

接下来我们面临的问题是，资源名的改变也就意味着 HTML 中的引用路径的改变。每次更改后都要手动地去维护它是很困难的，理想的情况是在打包结束后自动把最新的资源名同步过去。使用 html-webpack-plugin 可以帮助我们做到这一点。如：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
```

打包结果中多出了一个 index.html 。

html-webpack-plugin 会自动地将我们打包出来的资源名放入生成的 index.html 中，这样就不必手动地更新资源 URL 了。

```js
// 指定编译模板
new HtmlWebpackPlugin({
    template: './template.html'
})
```

html-webpack-plugin 还支持更多的个性化配置，详情参阅官方文档 https://github.com/jantimon/html-webpack-plugin 。

#### 使 chunk id 更稳定

理想状态下，对于缓存的应用是尽量让用户在启动时只更新代码变化的部分，而对没有变化的部分使用缓存。

之前用 CommonsChunkPlugin 和 SplitChunksPlugin 来划分代码。通过它们来尽可能地将一些不常变动的代码单独提取出来，与经常迭代的业务代码区别开，这些资源就可以在客户端一直使用缓存。

### bundle 体积监控和分析

webpack-bundle-analyzer 可以帮助我们分析一个 bundle 的构成。只需将其添加进 plugins 配置即可。

```js
const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    // ...
    plugins: [
        new Analyzer()
    ]
}
```

它可以帮我们生成一张 bundle 的模块组成的结构图，每个模块所占的体积一目了然。

最后还需要自动化地对资源体积进行监控，bundlesize 这个工具包可以帮助做到这一点。安装之后只需要在 package.json 进行一下配置即可。

```json
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "bundlesize": [
      "path": "./bundle.js",
      "maxSize": "50 kB"
  ],
  "scripts": {
    "test:size": "bundlesize",
    "dev": "webpack serve",
    "build": "webpack"
  },
}
```

通过 npm 脚本可以执行 bundlesize 命令，它会根据我们配置的资源路径和最大体积验证最终的 bundle 是否超限。我们也可以将其作为自动化测试的一部分，来保证输出的资源如果超限了不会在不知情的情况下就被发布出去。

### 小结

开发环境关注的是打包速度，而在生产环境中我们关注的则是输出的资源体积以及如何优化客户端缓存来缩短页面渲染时间。可通过设置 生产环境变量、压缩代码、监控资源体积等方法。缓存的控制主要依赖于从 chunk 内容生成 hash 作为版本号，并添加到资源文件中，使资源更新后可以立即被客户端获取到。

source map 对于追溯线上问题十分重要，但也存在安全隐患。通过一些特殊的 source map 配置以及第三方服务，我们可以兼顾两者。

Webpack 4 提供了 " mode: 'production' " 配置项，通过它可以节省很多生产环境下的特定代码，让配置文件更加简洁。

## 打包优化

软件工程领域的经验——不要过早优化，在项目的初期不要看到任何优化点就拿来加到项目中，这样不但增加了复杂度，优化的效果也不会太理想。一般是当项目发展到一定规模后，性能问题随之而来，这时再去分析然后对症下药，才有可能达到理想的优化效果。

### HappyPack

HappyPack 是一个通过多线程来提升 Webpack 打包速度的工具。对于很多大中型工程而言，HappyPack 确实可以显著地缩短打包时间。

#### 工作原理

在打包过程中有一项非常耗时的工作，就是使用 loader 将各种资源进行转译处理。最常见的包括使用 bebel-loader 转译 ES6+ 语法和 ts-loader 转译 TypeScript。我们可以简单地将代码转译的工作流程概括如下：

​	1.）从配置中获取打包入口

​	2.）匹配 loader 规则，并对入口模块进行转译

​	3.）对转译后的模块进行依赖查找（如 a.js 中加载了 b.js 和 c.js）

​	4.）对新找到的模块重复进行步骤 2 和 步骤 3 ，直到没有新的依赖模块

不难看出从步骤 2 到步骤 4 是一个递归地过程，Webpack 需要一步步地获取更深层级的资源，然后逐个进行转译。这里的问题在于 Webpack 是单线程的，假设一个模块依赖于几个其他模块，Webpack 必须对这些模块逐个进行转译。虽然这些转译任务彼此之间没有任何依赖关系，却必须串行地执行。HappyPack 恰恰以此为切入点。它的核心特性是可以开启多个线程，并行地对不同模块进行转译，这样就可以充分的利用本地的计算资源来提升打包速度。

HappyPack 适用于那些转译任务比较重的工程，当我们把类似 babel-loader 和 ts-loader 迁移到 HappyPack 之上后，一般都可以收到不错的效果，而对于其他如 sass-loader、less-loader 本身消耗时间并不太多的工程则效果一般。

#### 单个 loader 的优化

在实际使用时，要用 HappyPack 提供的 loader 来替换原有的 loader，并将原有的那个通过 HappyPack 插件传进去。例子：

```js
// 初始 webpack 配置 (使用 HappyPack 前)
module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['react']
                }
            }
        ]
    }
}
```

```js
// 使用 HappyPack 的配置
const HappyPack = require('happypack')
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'happypack/loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            loaders: [
                {
                    loader: 'bebel-loader',
                    options: {
                        presets: ['react']
                    }
                }
            ]
        })
    ]
}
```

在 module.rules 中，我们使用 happypack/loader 替换了原有的 babel-loader，并在 plugins 中添加了 HappyPack 的插件，将原有的 babel-loader 连同它的配置插入进去即可。

#### 多个 loader 的优化

在使用 HappyPack 优化多个 loader 时，需要为每一个 loader 配置一个 id，否则 HappyPack 无法知道 rules 与 plugins 如何一一对应。下面的例子中，同时对 babel-loader 和 ts-loader 进行了 HappyPack  的替换。

```js
const HappyPack = require('happypack')
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'happypack/loader?id=js'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'happypack/loader?id=ts'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {} // babel options
                }
            ]
        }),
        new HappyPack({
            id: 'ts',
            loaders: [
                {
                    loader: 'ts-loader',
                    options: {} // ts options
                }
            ]
        })
    ]
}
```

在使用多个 HappyPack loader 的同时也就意味着要插入多个 HappyPack 的插件，每个插件加上 id 来作为标识。同时我们也可以为每个插件设置具体不同的配置项，如使用的线程数、是否开启 debug 模式等。

### 缩小打包作用域

从宏观角度看，提升性能的方法无非两种：增加资源或者缩小范围。增加资源就是指使用更多 CPU 和内存，用更多的计算能力来缩短执行任务的时间；缩小范围则是针对任务本身，比如去掉冗余的流程，尽量不做重复性的工作等。前面的 HappyPack 属于增加资源，接下来谈谈如何缩小范围。

#### exclude 和 include

对于 JS 来说，一般要把 node_modules 目录排除掉，另外当 exclude 和 include 规则有重叠的部分时，exclude 的优先级更高。下面的例子使用 include 使 babel-loader 只生效于源码目录。

```js
module: {
	rules: [
        {
            test: /\.js$/,
            include: /src\/scripts/,
            loader: 'babel-loader'
        }
    ]
}
```

#### noParse

有些库我们是希望 Webpack 完全不要去进行解析的，即不希望应用任何 loader 规则，库的内部也不会有对其他模块的依赖，那么这时可以使用 noParse 对其进行忽略。如：

```js
module.exports = {
    // ...
    module: {
        noParse: /lodash/
    }
}
```

上面的配置将会忽略所有文件名中包含 lodash 的模块，这些模块仍然会被打包进资源文件，只不过 Webpack 不会对其进行任何解析。

在 Webpack3 及之后的版本还支持完整的路径匹配。如：

```js
module.exports = {
    // ...
    module: {
        noParse: function(fullPath) {
            // fullPath 是绝对路径 如: /Users/me/app/webpack-no-parse/lib/lodash.js
            return /lib/.test(fullPath)
        }
    }
}
```

上面的配置将会忽略所有 lib 目录下的资源解析。

#### IgnorePlugin

exclude 和 include 是确定 loader 的规则范围，noParse 是不去解析但仍会打包到 bundle 中。最后让我们再看一个插件 IgnorePlugin，它可以完全排除一些模块，被排除的模块即便被引用了也不会被打包进资源文件中。

这对于排除一些库相关文件非常有用。一些由库产生的额外资源我们用不到但又无法去掉，因为引用的语句处于库文件的内部。比如，Moment.js 是一个日期时间处理相关的库，为了做本地化它会加载很多语言包，对于我们来说一般用不到其他地区的语言包，但它们会占很多体积，这时就可以用 IgnorePlugin 来去掉。

```js
plugins: [
    new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/, // 匹配资源文件
        contextRegExp: /moment$/, // 匹配检索目录
    })
]
```

#### Cache

有些 loader 会有一个 cache 配置项，用来在编译代码后同时保存一份缓存，在执行下一次编译前会先检查源码文件是否有变化，如果没有就直接采用缓存，也就是上次编译的结果。这样相当于实际编译的只有变化了的文件，整体速度上会有一定提升。

在 Webpack 5 中添加了一个新的配置项 "cache: { type: "filesystem"}" ，它会在全局启用一个文件缓存。要注意的是，该特性目前仅仅是实验阶段，并且无法自动检测到缓存已经过期。比如我们更新了 babel-loader 及一些相关配置，但是由于 JS 源码没有发生变化，重新打包后还会是上一次的结果。

目前的解决办法就是，当我们更新了任何 node_modules 中的模块或者 Webpack 的配置后，手动修改 cache.version 来让缓存过期。同时官方也给出了声明说，未来会优化这一块，尽量可以自动检测缓存是否过期。

### 动态链接库与 DLLPlugin

动态链接库是早期 Windows 系统由于受限于当时计算机内存空间较小的问题而出现的一种内存优化方法。当一段相同的子程序被多个程序调用时，为了减少内存消耗，可以将这段子程序存储为一个可执行文件，当被多个程序调用时只在内存中生成和使用同一个实例。

DLLPlugin 借鉴了动态链接库的这种思路，对于第三方模块或者一些不常变化的模块，可以将它们预先编译和打包，然后在项目实际构建过程中直接取用即可。当然，通过 DllPlugin 实际生成的还是 JS 文件而不是动态链接库，取这个名字只是由于方法类似罢了。在打包 vendor 的时候还会附加生成一份 vendor 的模块清单，这份清单将会在工程业务模块打包时起到链接和索引的作用。

DllPlugin 和 Code Splitting 有点类似，都可以用来提取公共模块，但本质上有一些区别。Code Splitting 的思路是设置一些特定的规则并在打包的过程中根据这些规则提取模块；DllPlugin 则是将 vendor 完全拆出来，有自己的一整套 Webpack 配置并独立打包，在实际工程构建时就不用再对它进行任何处理，直接取用即可。因此，理论上来说，DllPlugin 会比  Code Splitting 在打包速度上更胜一筹，但也相应地增加了配置，以及资源管理的复杂度。下面一步步进行 DllPlugin 的配置。

#### vendor 配置

首先需要为动态链接库单独创建一个 Webpack 配置文件，比如命名为 webpack.vendor.config.js，用来区别工程本身的配置文件 webpack.config1.js。

```js
const path = require('path')
const webpack = require('webpack')
const dllAssetPath = path.join(__dirname, 'dll')
const dllLibraryName = 'dllExample'
module.exports = {
  entry: ['react'],
  output: {
    path: dllAssetPath,
    filename: "vendor.js",
    library: dllLibraryName
  },
  plugins: [
    new webpack.DllPlugin({
      name: dllLibraryName,
      path: path.join(dllAssetPath, 'manifest.json')
    })
  ]
}
```

配置中的 entry 指定了把哪些模块打包为 vendor。plugins 的部分我们引入了 DllPlugin，并添加了以下配置项：

- name：导出 dll library 的名字，它需要与 output.library 的值对应
- path：资源清单的绝对路径，业务代码打包时将会使用这个清单进行模块索引

#### vendor 打包

接下来我们就要打包 vendor 并生成资源清单了。为了后续运行方便，可以在 package.json 中配置一条 npm script，如下：

```js
// package.json
{
    ...
    "scripts": {
    	"dll": "webpack --config webpack.vendor.config.js"
  },
}
```

运行 npm run dll 后会生成一个 dll 目录，里面有两个文件 vendor.js 和 manifest.json，前者包含了库的代码，后者则是资源清单。

可以预览一下生成的 vendor.js，它以一个立即执行函数表达式的声明开始。

```js
var dllExample = (function (params) {
    // ...
})(params)
```

上面的 dllExample 正是我们在 webpack.vendor.config.js 中指定的 dllLibraryName 。

接着打开 manifest.json ，其大体内容如下：

```js
{
  "name": "dllExample",
  "content": {
    "./src/a.js": {
      "id": 85,
      "buildMeta": {}
    }
  }
}
```

manifest.json 中有一个 name 字段，这是我们通过 DllPlugin 中的 name 配置项指定的。

#### 链接到业务代码

将 vendor 链接到项目中很简单，这里我们将使用与 DllPlugin 配套的插件 DllReferencePlugin，它起到一个索引和链接的作用。在工程的 webpack 配置文件(webpack.config1.js) 中，通过 DllReferencePlugin 来获取刚刚打包好的资源清单，然后在页面中添加 vendor.js 的引用就可以了。例如：

```js
// webpack.config.js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  // ...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.join(__dirname, 'dll/manifest.json'))
    })
  ]
}
```

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

<script src="dll/vendor.js"></script>
<script src="dist/app.js"></script>
</body>
</html>
```

当页面执行到 vendor.js 时，会声明 dllExample 全局变量。而 manifest 相当于我们注入 app.js 的资源地图，app.js 会先通过 name 字段找到名为 dllExample 的 library，再进一步获取其内部模块。这就是我们在 webpack.vendor.config.js 中给 DllPlugin 的 name 和 output.library 赋相同值的原因。如果页面报 "变量 dllExample 不存在" 的错误，那么有可能就是没有指定正确的 output.library，或者忘记了在业务代码前加载 vendor.js。

#### 潜在问题

目前我们的配置还存在一个潜在的问题。当打开 manifest.json 后，可以发现每个模块都有一个 id，其值是按照数字顺序递增的。业务代码在引用 vendor 中模块的时候也是引用的这个数字 id。当我们更改 vendor 时这个数字 id 也会随之发生变化。

假设我们的工程中目前有以下资源文件，并为每个资源都加上了 chunk hash。

- vendor@[hash].js （通过 DllPlugin 构建）
- page1@[hash].js
- page2@[hash].js
- util@[hash].js

现在 vendor 中有一些模块，不妨假定其中包含了 react，其 id 是 5 。当尝试添加更多的模块到 vendor中（比如 util.js 使用了 moment.js ，我们希望 moment.js 也通过 DllPlugin 打包）时，那么重新进行 Dll 构建时 moment.js 有可能会出现在 react 之前，此时 react 的 id 就变为了 6 。 page1.js 和 page2.js 是通过 id 进行引用的，因此它们的文件内容也相应发生了改变。此时我们可能会面临以下两种情况：

- page1.js 和 page2.js 的 chunk hash 均发生了改变。这是我们不希望看到的，因为它们内容本身并没有改变，而现在 vendor 的变化却使得用户必须重新下载所有资源。
- page1.js 和 page2.js 的 chunk hash 没有改变。这种情况大多发生在较老版本的 Webpack 中，并且比第 1 种情况更为糟糕。因为 vendor 中的模块 id 改变了,而用户却由于没有更新缓存而继续使用过去版本的 page1.js 和 page2.js ，也就引用不到新的 vendor 模块而导致页面错误。对于开发者来说，这个问题很难排查，因为在开发环境下一切都是正常的，只有在生产环境会看到页面崩溃。

这个问题的根源在于，当我们对 vendor 进行操作时，本来 vendor 中不应该受到影响的模块却改变了它们的 id。解决这个问题的方法很简单，在打包 vendor 时添加上 HashedModuleIdsPlugin。如：

```js
const path = require('path')
const webpack = require('webpack')
const dllAssetPath = path.join(__dirname, 'dll')
const dllLibraryName = 'dllExample'
module.exports = {
  mode: "production",
  entry: ['./src/a.js'],
  output: {
    path: dllAssetPath,
    filename: "vendor.js",
    library: dllLibraryName
  },
  plugins: [
    new webpack.DllPlugin({
      name: dllLibraryName,
      path: path.join(dllAssetPath, 'manifest.json')
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
}
```

这个插件是在 Webpack3 中被引入进来的，主要就是为了解决数字 id 的问题。从 Webpack3 开始，模块 id 不仅可以是数字，也可以是字符串。HashedModuleIdsPlugin 可以把 id 的生成算法改为根据模块的引用路径生成一个字符串 hash。比如一个模块的 id 时 2NuI （hash值），因为它的引用路径不会因为操作 vendor 中的其他模块而改变，id 将会是统一的，这样就解决了我们前面提到的问题。

### tree shaking

ES6 Module 依赖关系的构建是在代码编译时而非运行时。基于这项特性 Webpack 提供了 tree shaking 功能，它可以在打包过程中帮助我们检测工程中没有被引用过的模块，这部分代码将永远无法被执行到，因此也被称为 "死代码"。Webpack 会对这部分代码进行标记，并在资源压缩时将它们从最终的 bundle 中去掉。下面展示了 tree shaking 是如何工作的。

```js
// index.js
import {foo} from './util'
foo()
```

```js
// util.js
export function foo() {
    console.log('foo')
}
export function bar() { // 没有被任何其他模块引用，属于 ”死代码“
    console.log('bar')
}
```

在 Webpack 打包时会对 bar() 添加一个标记，在正常开发模式下它仍然存在，只是在生产环境的压缩那一步会被移除掉。

tree shaking 有时可以使 bundle 体积显著减小，而实现 tree shaking 则需要一些前提条件。

#### ES6 Module

tree shaking 只能对 ES6 Module 生效。有时我们会发现虽然只引用了某个库中的一个接口，却把整个库加载进来了，而 bundle 的体积并没有因为 tree shaking 而减小。这可能是由于该库是使用 CommonJS 的形式导出的，为了获得更好的兼容性，目前大部分的 npm 包还在使用 CommonJS 的形式。也有一些 npm 包同时提供了 ES6 Module 和 CommonJS 两种形式导出，我们应该尽可能使用 ES6 Module 形式的模块，这样 tree shaking 的效率更高。

#### 使用 Webpack 进行依赖关系构建

如果我们在工程中使用了 babel-loader，那么一定要通过配置来禁用它的模块依赖解析。因为如果由 babel-loader 来做依赖解析，Webpack 接收到的就都是转化过的 CommonJS 形式的模块，无法进行 tree-shaking。禁用 babel-loader 模块依赖解析的配置如下：

```js
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                // 这里要加上 modules:false
                                @babel/preset-env,
                                {
                                    modules: false
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
```

#### 使用压缩工具去除死代码

tree shaking 本身只是为死代码添加上标记，真正去除死代码是通过压缩工具来进行的。使用 terser-webpack-plugin 即可。在 Webpack 4 之后的版本中，将 mode 设置为 production 也可以达到相同的效果。

## 开发环境调优

### Webpack 开发效率插件

#### webpack-dashboard

Webpack 每一次构建结束后都会在控制台输出一些打包相关信息，但这些信息是以列表形式展示的，有时会显得不够直观。webpack-dashboard 就是用来更好地展示这些信息的。

`yarn add webpack-dashboard -D`

我们需要把 webpack-dashboard 作为插件添加到 webpack 配置中，如：

```js
const DashBoardPlugin = require('webpack-dashboard/plugin')
module.exports = {
  mode: "development",
  entry: {
    app: './src/a.js',
  },
  output: {
    filename: "[name].js"
  },
  plugins: [
    new DashBoardPlugin(),
    }),
  ]
}
```

为了使 webpack-dashboard 生效还要更改下 webpack 的启动方式，就是用 webpack-dashboard 模块命令代替原本的 webpack 或者 webpack-dev-server 的命令，并将原有的启动命令作为参数传给它。如：

```json
// package.json
{
    ...
    "scripts": {
        "dev": "webpack-dev-server"
    }
}
```

加上 webpack-dashboard 后变为： 

```json
// package.json
{
    ...
    "scripts": {
        "dev": "webpack-dashboard -- webpack-dev-server"
    }
}
```

webpack-dashboard 的控制台分为几个面板来展示不同方便的信息。比如左上角的 Log 面板就是 Webpack 本身的日志；下面的 Modules 面板是此次参与打包的模块，从中可以看出哪些模块资源占用比较多；从右下角的 Problems 面板中可以看到构建过程中的警告和错误等。

#### webpack-merge

对于需要配置多种打包环境的项目来说，webpack-merge 是一个非常实用的工具。假设项目有 3 种不同的配置，分别对应本地环境、测试环境和生产环境。每一个环境对应的配置都不同，但也有一些公共的部分，那么就可以将这些公共的部分提取出来。假设创建一个 webpack.common.js 来存放所有这些配置，如：

```js
// webpack.common.js
module.exports = {
    entry: './app.js',
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/,
                use: 'css-loader'
            }
        ]
    }
}
```

使用 webpack-merge

`yarn add webpack-merge -D`

```js
// webpack.prod.js
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge.smart(commonConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    }
})
```

webpack-merge 在合并 module.rules 的过程中会以 test 属性作为标识符，当发现有相同项出现的时候会以后面的规则覆盖前面的规则。

#### speed-measure-webpack-plugin

SMP 可以分析出 webpack 整个打包过程在各个 loader 和 plugin 上耗费的时间，这有助于找出构建过程中的性能瓶颈。

`yarn add speed-measure-webpack-plugin -D `

speed-measure-webpack-plugin 的使用方法非常简单，只要用它的 wrap 方法包裹在 Webpack 的配置对象外面即可。

```js
// webpack.config.js
const SMP = require('speed-measure-webpack-plugin')
const smp = new SMP()
module.exports = smp.wrap({
    entry: './app.js'
})
```

从分析结果可以找出哪些构建步骤耗时较长，以便于优化和反复测试。

#### size-plugin

size-plugin 可以帮助我们监控资源体积的变化，尽早发现问题。

`yarn add size-plugin -D`

配置

```js
const path = require('path')
const SP = require('size-plugin0)
module.exports = smp.wrap({
    entry: './app.js',
    plugins: [ new SP()]
})             
```

在每次执行打包命令后，size-plugin 都会输出本次构建的资源体积(gzip)后，以及与上次构建相比体积变化了多少。

###  热模块替换

热模块替换功能（Hot Module Replacement， HMR）对于大型应用尤其适用。试想一个复杂的系统每改动一个地方都要经历资源重构建、网络请求、浏览器渲染等过程，怎么也要几秒甚至几十秒的时间才能完成；况且调试的页面可能位于很深的层级，每次还要通过一些人为操作才能验证结果，其效率是十分低下的。而 HMR 则可以在保留页面当前状态的前提下呈现出最新的改动，可节省大量的时间成本。

#### 开启 HMR

HMR 是需要手动开启的，并且有一些必要条件。

首先要确保项目是基于 webpack-dev-server 或者 webpack-dev-middle 进行开发的，Webpack 本身的命令行并不支持 HMR。下面是一个使用 webpack-dev-server 开启 HMR 的例子。

```js
const webpack = require('webpack')
module.exports = {
    // ...
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true
    }
}
```

上面配置产生的结果是 Webpack 会为每个模块绑定一个 module.hot 对象，这个对象包含了 HMR 的 API。借助这些 API 不仅可以实现对特定模块开启或关闭 HMR，也可以添加热替换之外的逻辑。比如，当得知应用中某个模块更新了，为了保证更新后的代码能够正常工作，还要添加一些额外的处理。

调用 HMR API 有两种方式，一种是手动添加这部分代码；另一种是借助现成的工具，比如 react-hot-loader、vue-loader 等。

如果应用的逻辑比较简单，可以直接手动添加代码来开启 HMR。比如：

```js
// index.js
import { add } from 'util.js'
add(2, 3)
if(module.hot) {
    module.hot.accept()
}
```

假设 index.js 是应用的入口，那么就可以把调用 HMR API 的代码放在该入口中，这样 HMR 对于 index.js 和其依赖的所有模块都会生效。当发现有模块发生变动时，HMR 会使应用在当前浏览器环境下重新执行一遍 index.js（包括其依赖）的内容，但是页面本身不会刷新。

大多数时候，还是建议使用第三方模块提供的 HMR 解决方案，因为 HMR 触发过程中可能会有很多预想不到的问题，导致模块更新后应用的表现和正常加载的表现不一致。

#### HMR 原理

在开启 HMR 的状态下进行开发，你会发现资源的体积会比原来的大很多，这是因为 Webpack 为了实现 HMR 而注入了很多相关的代码。

在本地开发环境下，浏览器是客户端，webpack-dev-server 相当于是我们的服务端。HMR 的核心就是客户端从服务端拉取更新后的资源（准确说是 HMR 拉取的不是整个资源文件，而是 chunk diff，即 chunk 需要更新的部分）。

第一步就是浏览器什么时候去拉区这些更新。这需要 WDS 对本地源文件进行监听。实际上 WDS 与浏览器之间维护了一个 websocket，当本地资源发生变化时 WDS 会向浏览器推送更新事件，并带上这次构建的 hash，让客户端与上一次资源进行比对。通过 hash 的比对可以防止冗余更新的出现。因为很多时候源文件的更改并不一定代表构建结果的更改（如添加了一个文件末尾空行等）。

这解释了为什么当我们开启多个本地页面时，代码一改所有页面都会更新。当然 websocket 并不是只有开启了 HMR 才会有，live reload 其实也是依赖这个而实现的。

有了恰当的拉取资源的时机，下一步就是要知道拉取什么。这部分信息并没有包含在刚刚的 websocket 中，因为刚刚只想知道这次构建的结果是不是和上一次一样。现在客户端已经知道新的构建结果和当前的有了差别，就会向 WDS 发起一个请求来获取更改文件的列表，即哪些模块有了改动。通常这个请求的名字为 [hash].hot-update.json 。

如返回结果告诉客户端，需要更新 chunk 为 main， 版本为 （构建 hash）。。。。。这样客户端就可以再借助这些信息继续向 WDS 获取该 chunk 的增量更新。

#### HMR API 示例

```js
// index.js
import { logToScreen } from './util.js'
let counter = 0
console.log('setInterval starts')
setInterval(() => {
    counter += 1
    logToScreen(counter)
}, 1000)
```

```js
// util.js
export function logToScreen(content) {
    document.body.innerHTML = `content: ${content}`
}
```

这个例子实现的是在屏幕上输出一个整数并每秒加一。现在要对它添加 HMR。

```js
if (module.hot) {
	module.hot.accept()
}
```

这段代码的意思是让 index.js 及其依赖只要发生更改就在当前环境下全部重新执行一遍。但是它会带来一个新的问题：在当前的运行时我们已经有了一个 setInterval，而每次 HMR 后又会添加新的 setInterval，并没有对之前的进行清除，所以最后会看到屏幕上有不同的数字闪来闪去。

为了避免这个问题，可以让 HRM 不对 index.js 生效。也就是说，当 index.js 发生改变时，就直接让整个页面刷新，以防止逻辑出现问题，但对于其他模块来说我们还想让 HMR 继续生效，那么就可以用如下配置：

```js
if (module.hot) {
    module.hot.decline()
    module.hot.accept(['./util.js'])
}
```

 module.hot.decline() 是将当前 index.js 的 HMR 关掉，当 index.js 自身发生改变时禁止使用 HMR 进行更新，只能刷新整个页面。而后面一句  module.hot.accept(['./util.js']) 的意思是当 util.js 发生改变时依然可以启用 HMR 更新。

## 更多 JavaScript 打包工具

### Rollup

Webpack 与 Rollup 相比，Webpack的优势在于它更全面，基于 ”一切皆模块“的思想衍生出丰富的 loader 和 plugin 可以满足各种使用场景；而 Rollup 更像一把手术刀，它更专注于 JavaScript 的打包。然后 Rollup 也支持许多其他类型的模块，但是总体而言在通用性上不如 Webpack。如果当前的项目需求仅仅是打包 JavaScript，比如一个 JavaScript 库，那么 Rollup 很多时候会是第一选择。

#### 配置

创建 Rollup 的配置文件 rolllup.config.js 及打包的项目文件 app.js 

```js
// rollup.config.js
module.exports = {
    input: "src/app.js",
    output: {
        file: "dist/bandle.js",
        format: 'cjs'
    }
}
```

```js
// src/app.js
console.log('Rollup 打包')
```

与 Webpack 一般装在项目内不同，Rollup 直接全局安装即可。

`yarn global add rollup`

然后使用 rollup 的命令行指令进行打包。

`rollup -c rollup.config.js`

-c 参数是告诉 rollup 使用该配置文件。打包结果：

```js
'use strict'
console.log('Rollup 打包')
```

可以看到，打包出来的东西很干净，Rollup 并没有添加什么额外代码。而 Webpack 会将自身代码注入进去。显然 Rollup 更符合预期，资源体积更小。

#### tree shaking

Rollup 的 tree shaking 也是基于对 ES6 Module 的静态分析，找出没有被引用过的模块，将其从最后生成的 bundle 中排除。

#### 可选的输出格式

Rollup 可以选择输出资源的模块形式。Rollup 支持 amd、esm、iife、umd 及 system。这项特性对于打包 JavaScript 库特别有用，因为往往一个库需要支持多种不同的模块形式，而通过 Rollup 几个命令就可以把一份代码打包为多份。

```js
'use strict'
export function add(a, b) {
    return a + b
}
export function sub(a, b) {
    return a - b
}
```

当 output.format 是 cjs 时，输出如下：

```js
Object.defineProperty(exports, '__esModule', {value: true})
function add(a, b) {
    return a + b
}
function sub)a, b {
    return a - b
}
exports.add = add
exports.sub = sub
```

当 output.format 是 esm 时，输出如下：

```js
function add(a, b) {
    return a + b
}
function sub)a, b {
    return a - b
}
export { add, sub }
```

#### 使用 Rollup 构建 JavaScript 库

- 最低限度的附加代码
- 对 ES6 Module 的良好支持
- 通过 tree shaking 去除开发环境代码
- 通过自定义插件来实现一些特殊的打包逻辑

### Parcel

Parcel 在 JavaSCript 打包工具中属于后来者。在有缓存的情况下其打包速度要比 Webpack 快将近 8 倍，且宣称自己是零配置的。

#### 打包速度

- 利用 worker 来并行执行任务
- 文件系统缓存
- 资源编译处理流程优化

Webpack 在资源压缩时可以利用多核同时压缩多个资源；本地缓存则更多的是在 loader 层面，像 babel-loader 会把编译结果缓存在项目中的一个隐藏目录下，并通过本地文件的修改时间和状态来判断是否使用上次编译的缓存。

Webpack 本身只认识 JavaScript 模块，它主要是靠 loader 来处理各种不同类型的资源。loader 本质上就是一个函数，一般情况下它的输入和输出都是字符串。比如，对于 babel-loader 来说，它的输入是 ES6+ 的内容，babel-loader 会进行语法转换，最后输出为 ES5 的形式。

babel-loader 的工作流程大致可以分为以下几步：

- 将 ES6 形式的字符串内容解析为 AST （抽象语法树）
- 对 AST 进行语法转换
- 生成 ES5 代码，并作为字符串返回

这是一个正常的资源处理过程。但假如是多个 loader 依次对资源进行处理呢，比如在 bebel-loader 的后面又添加了两个 loader 来处理另外一些特殊的语法。就会涉及到大量的 string 和 AST 之间的转换，主要是因为 loader 在设计之初就只能接受和返回字符串，不同的 loader 之间并不需要知道彼此的存在，只要完成好各自的工作就可以了。虽然会产生一些冗余的步骤，但这有助于保持 loader 的独立性和可维护性。

Parcel 并没有明确地暴露出一个 loader 的概念，其资源处理流程不像 Webpack 一样可以对 loader 随意组合，但也正因为这样它不需要那么多 String 与 AST 的转换操作。parcel 的资源处理流程可以理解为资源的处理步骤变少了，这主要得益于它在不同的编译处理流程之间可以用 AST 作为输入输出。对于单个的每一步来说，如果前面已经解析过 AST，那么直接使用上一步解析和转换好的 AST 就可以了，只在最后一步输出的时候再将 AST 转回 String 即可。

#### 零配置

执行 Parcel 打包(全局安装)

`parcel index.html`

这样就启动了 Parcel 的开发模式，使用浏览器打开 localhost:1234 就可观察到效果。

如果要打包为文件，执行以下命令：

`parcel build index.html`

Parcel 会创建一个 dist 目录，并在其中生成打包压缩后的资源。

Parcel 是可以用 html 文件作为项目入口的，从 HTML 开始在进一步寻找其依赖的资源；并且可以发现对于最后产出的资源，Parcel 已经自动为其生成了 hash 版本号和 source map，并且资源是经过压缩的。

在一个 Parcel 工程中要使用 Vue 只需要安装 Vue 本身及 parcel-bundle 即可，并不需要更多的配置。Parcel 已经帮我们处理好后面的工作。

假如需要在很短时间内搭建一个原型，或者不需要进行深度定制的工程，那么使用 Parcel 进行前期开发速度会很快。

### WebAssembly 相关

