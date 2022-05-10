### 类型断言

- 尖括号

  ```ts
  let oneString: any = 'this is a string'
  let stringLength: number = (<string>oneString).length
  ```

- 关键字 `as`

  ```ts
  let oneString: any = 'this is a string'
  let stringLength: number = (oneString as string).length
  ```

  - TS 的 JSX 中类型断言可以使用 as，但不允许使用尖括号方式

### 范型函数

TS 的范型语法非常主流，与 Java 等静态类型语言使用方式一样：

```ts
function hello<T>(arg: T): T {
    return arg
}
```

给 hello 函数添加范型变量 T，T 代表用户即将传入的类型。类型既可以是 number 也可以是 string，在最后，使用 T 作为返回值的类型。这就达到了返回值类型和参数类型相同的目的，保持了函数表达式的准确性。

有两种方式使用范型函数：

- 使用尖括号

  ```ts
  let output = hello<string>('hello')
  ```

  - 这里可以明确指定 T 为 string，也可以指定为 number

- 使用类型推断

  - TS 编译器会根据传入的参数类型自动确定 T 的类型

  ```ts
  let output = hello('hello')
  ```

  - 直接传入参数，这时候编译器会明确知道 T 的类型就是“hello”的类型 string，同样返回值类型是 T，也是 string 类型

类型推断帮助精简代码，也提高了可读性，让代码变得简洁。在某些特别复杂的情况下，类型推断是会失灵的，这时候就需要非常明确地写出 T 的类型。

### 范型变量

```ts
function hello<T>(arg: T): T {
    return arg
}
```

如果这时候需要时候参数 arg 的长度时，就会出现下面这样尴尬的情况：

```ts
function hello<T>(arg: T): T {
    console.log(arg.length) // length' does not exist on type 'T'.
    return arg
}
```

编译器会非常迅速地进行报错，这似乎有点不合情理，但编译器会选择最糟糕的情况进行处理，T 代表任意类型，就一定会有最糟糕的情况。

可以使用泛型数组来表达这样的情况。由于操作的是数组，所以 length 属性是一定存在的，那就可以像普通的数组一样操作它：

```ts
function hello<T>(arg: T[]): T[] {
    console.log(arg.length)
    return arg
}
```

这个时候，再使用 hello 函数时，就需要传入一个 T 的数组，也就是一个 string 变量的数组，或者 number 变量的数组，而不是一个单纯的变量。返回值也是同类型的数组。这可以将范型变量 T 作为数组的一部分属性，而不是作为整体类型，这增加了灵活性。

不只是是用中括号，还可以使用 Array 来表达数组，如下所示：

```ts
function hello<T>(arg: Array<T>): Array<T> {
    console.log(arg.length)
    return arg
}
```

TS 同时采用了这样一种在其他语言中非常常见的语法。

### 枚举

常常有这样的场景。比如订单的状态开始是0，未结账是1，运输中是2，运输完成是3，已收到货是4，这样的纯数字会使得代码缺乏可读性。枚举就用于这样的场景。枚举可以定义一些名字有意义的常量。使用枚举可以清晰表达我们的意图。TS 支持基于数字枚举和字符串的枚举

1. 数字枚举

   ```ts
   enum OrderStatus {
       Start = 1,
       Unpaid,
       Shipping,
       Shipped,
       Complete
   }
   ```

   向上面这样，通过数字来表达了订单状态。在实际的代码编写时，直接使用 OrderStatus.Start 来代表原本的数字 1，这就使得代码具备了相当的可读性，甚至可以免去冗余的注释。

   在上面的代码中还使用了一个小技巧，当只写 Start = 1 时，后面的枚举变量就是递增的。也可以明确写出各个枚举变量的数字，这取决于具体的业务场景。

   如果第一个枚举的变量值不写，会怎么样呢：

   ```ts
   enum OrderStatus {
       Start ,
       Unpaid,
       Shipping,
       Shipped,
       Complete
   }
   ```

   现在，Start 的值就是 0 了，后面的枚举类型再依次递增。

   通常情况下，在使用这样的写法时，其实并不在乎成员变量的具体值，只知道这些值是不同的。

   当然枚举类型中的值必须是确定的，下面这种写法是不允许的：

   ```ts
   enum Example {
       A = Hello(),
       B // num member must have initializer
   }
   ```

   类似这样没有给出确定值的写法，在 TS 中是不允许的。

2. 字符串枚举

   在一个字符串枚举中，所有成员必须都是字符串字面量，如下：

   ```ts
   enum OrderStatus {
       Start = 'Start',
       Unpaid = 'Unpaid',
       Shipping = 'Shipping',
       Shipped = 'Shipped',
       Complete = 'Complete'
   }
   ```

   由于字符串枚举没有递增的含义，字符串枚举成员都必须手动初始化。虽然显得繁琐，但相比在运行时环境下不能表达有用信息的数字枚举，字符串枚举能进一步提升可读性，且在运行时中提供具有刻度性质的值，这使得调试变得更容易。

3. 反向映射

   反向映射是数字枚举的一个技巧，得益于 TS 在实现数字枚举时的代码编译。

   比如定义一个如下枚举时：

   ```ts
   enum Enum {
       A
   }
   ```

   编译器编译后，得到如下代码：

   ```js
   var Enum;
   (function (Enum) {
       Enum[Enum["A"] = 0] = "A";
   })(Enum || (Enum = {}));
   ```

   所以我们既可以从属性名获取值，也可以从值获取属性名：

   ```ts
   const a = Enum.A
   console.log(a)          // 0
   const nameOfA = Enum[a]
   console.log(nameOfA)    // A
   ```

   当然，这个特性是因为编译成 JS 后是这样，所以在运行时包含了正向映射（key -> value）和反向映射（value -> key）。而字符串枚举编译后没有这样的特性。要特别注意，在字符串枚举中没有反向映射

### symbol

自 ES6 起，symbol 成为一种新的原生类型，就像基本类型 number 和 string 一样。

TS 中使用 symbol 类型如出一辙，也是通过 Symbol 构造函数创建的，如下：

```ts
const symbol1 = Symbol()
const symbol2 = Symbol('hello')
const symbol3 = Symbol('hello')
symbol2 === symbol3 // false
```

通过同样的方式生成两个 symbol 也是不同的，因为 symbol 是唯一的。所以 symbol2 和 symbol3 无论如何都不会相等。

像字符串一样，symbol 也可以用于对象属性的键：

```ts
const symbol = Symbol()
const obj = {
    symbol: 'value'
}
console.log(obj.symbol) // value
```

常量使用 symbol 值最大的好处就是，其他任何值都不可能有相同的值了，因此可以保证诸如特定字面量或者特定的 switch 语句值可以按设计的方式工作。

### iterator （迭代器）

当一个对象实现了 Symbol.iterator 时，我们认为它是可迭代的。如 array、map、set、string、int32Array、unit32Array 等一些内置的类型，目前都已经实现了各自的 Symbol.iterator。对象上的 Symbol.iterator 函数负责返回供迭代的值。

for...of 语句会遍历可迭代的对象，调用对象上的  Symbol.iterator 方法。

比如下面是在数组上使用 for...of 的例子：

```ts
const array = [2, 'xcr', true]
for (let value of array) {
    console.log(value) // 2, xcr, true
}
```

for...of 和 for...in 都可以迭代一个数组，但它们之间区别很大。最明显区别莫过于它们用于迭代器的返回值并不相同，for...in 迭代的是对象的键，而 for...of 迭代的是对象的值。

可以从下面例子中看出两者之间的区别：

```ts
const array = [3, 4, 5]

for (let i in array) {
    console.log(i) // 0, 1, 2
}

for (let i of array) {
    console.log(i) // 3, 4, 5
}
```

另一个区别在于，for...in 可以操作任何对象，提供了查看对象属性的一种方法。但是 for...of 关注迭代对象的值，内置对象 Map 和 Set 已经实现了 Symbol.iterator 方法，让我们可以访问它们的值：

```ts
const fruits = new Set(['apple', 'pear', 'mango'])
fruits['peach'] = 'Princess Peach'

for (let fruit in fruits) {
    console.log(fruit) // peach
}
for (let fruit of fruits) {
    console.log(fruit) // apple pear mango
}
```

这样的特性仅在 ES6 及以上才生效。

当TS代码生成目标设定为 ES5 或 ES3 ，迭代器就只允许在 array 类型上使用。在非数组值上使用 for...of 语句会得到一个错误。即便这些非数组值已经实现了 Symbol.iterator 属性，也是不可以的。

编译器会生成一个简单的 for 循环作为 for...of 循环，比如：

```ts
const numbers = [1, 2, 3]
for (let number of numbers) {
    console.log(number)
}
```

生成的代码为：

```js
var numbers = [1, 2, 3];
for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
    var number = numbers_1[_i];
    console.log(number);
}
```

### generator（生成器）

function * 是用来创建 generator 函数的语法。

调用 generator 函数时会返回一个 generator 对象。generator 对象遵循迭代器接口，即通常所见到的 next、return 和 throw 函数。

generator 函数用于创建懒迭代器，例如下面这个函数可以返回一个无限整数的列表：

