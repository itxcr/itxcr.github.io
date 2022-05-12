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

```js
function* infiniteList() {
    let i = 0;
    while (i < 3) {
        yield i++;
    }
}
const gen = infiniteList();
console.log(gen.next()); // {value: xxx, done: false
```

generator 函数用于创建懒迭代器，它在实质上允许一个函数可以暂停执行，比如执行了 gen.next() 后，可以先去做别的事情，再回来继续执行 gen.next()，这样剩余函数的控制权就交给了调用者。

当直接调用 generator 函数时，它并不会执行，只会创建一个 generator 对象。

```js
function* generator() {
    console.log('开始');
    yield 0;
    console.log('恢复');
    yield 1;
    console.log('结束');
}
const iterator = generator();
console.log(iterator.next());
// 开始
// { value: 0, done: false }
console.log(iterator.next());
// 恢复
// { value: 1, done: false }
console.log(iterator.next());
// 结束
// { value: undefined, done: true }
```

- generator 对象只会在调用 next 后才会开始执行
- 函数在执行到 yield 语句时会暂停并返回 yield 的值
- 函数在 next 被调用时继续恢复执行

实质上 generator 函数的执行与外部的 generator 对象有关。

除了 yield 传值到外部，也可以通过 next 传值到内部进行调用。

```js
function *generator() {
    const who = yield
    console.log(`hello ${who}`)
}

const iterator = generator()
console.log(iterator.next())
// { value: undefined, done: false }
console.log(iterator.next('XCR'))
// hello XCR
// { value: undefined, done: true }
```

- 传值前要调用一次 next

以上便是 next 和 return 函数的内容，下面看一下 throw 函数如何处理迭代器内部报错。

下面是 iterator.throw 的例子：

```js
function *generator() {
    try {
        yield 1
    }catch (error) {
        console.log(error.message)
    }
}

const iterator = generator()
console.log(iterator.next())
// { value: 1, done: false }
console.log(iterator.throw(new Error('发生错误')))
// 发生错误
// { value: undefined, done: true }
```

从上可知，外部是可以对 generator 内部进行干涉的：

- 外部系统可以传值到 generator 函数体中
- 外部系统可以抛入一个异常到 generator 函数体中

- 传值前要调用一次 next

### 高级类型

#### interface

一个很常用的场景，比如函数传参，除了基本类型和数组外，还常用 字典作为参数，那么应该如何对字典进行类型约束呢，TS 引入了 interface 关键字，为我们提供了表达字典的能力，如下：

```ts
interface A {
    a: number,
    b: string,
    c: number[]
}

let a: A
a.a = 1
a.b = 'xcr'
a.c = [1, 2, 3]
a.d // Property 'd' does not exist on type 'A'.
```

#### 交叉类型与联合类型

通常意义上交叉类型是指将多个字典类型合并为一个新的字典类型。

基本类型是不会存在交叉的。比如 number 和 string 是不可能有交叉点的，一个类型不可能既是字符串又是数字。所以使用交叉类型时通常是下面这样：

```ts
type newType = number & string
let a: newType
interface A {
    d: number,
    z: string
}

interface B {
    f: string,
    g: string
}

type C = A & B
let c: C
```

这里的 type 关键字是用来声明类型变量的。在运行时，与类型相关的代码都会被移除掉，并不会影响到 JS 的执行。

但如果交叉类型中有属性冲突时，如下：

```ts
type newType = number & string
let a: newType
interface A {
    d: number,
    z: string
}

interface B {
    d: string,
    g: string
}
type C = A & B
let c: C
c.d = 1 // Type 'number' is not assignable to type 'never'.
c.d = '123' // Type 'string' is not assignable to type 'never'.
```

上面可以看到，d 无论如何赋值都不可能通过类型检查。

但正确使用交叉类型时，它可以合理地将两个不同类型叠加为新的类型，并包含所需要的类型。

如果需要一个变量可能是 number，有可能是 string，要如何做呢？

这个场景也很常见，联合类型便是用于解决这样的问题。

```js
function padLeft(value, padding) {
    if (typeof padding === 'number') {
        return Array(padding + 1).join('') + value;
    }
    if (typeof padding === 'string') {
        return padding + value;
    }
    throw new Error('希望获取到 string 或 number' + '获取到的是' + padding);
}
console.log(padLeft('Hello World', 4)); // Hello World
```

padLeft 存在一个问题，padding 参数的类型被指定为 any。也就是说，可以传入一个既不是 number 也不是 string 类型的参数，但是 TS 不报错：

```ts
console.log(padLeft('Hello world', true))
// 编译通过，运行时报错
```

在传统编程语言中可以使用重载解决这样的问题 。

但在 JS 不存在重载，手动判断类型操作很常见。这在一定程度上避免了过度设计。

如果希望更准确地描述 padding 类型，就只能让 padding 既可以是 number 又可以是 string ，所以联合类型就非常必要了。

替代掉 any，可以使用联合类型作为 padding 的参数，如下所示：

```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === 'number') {
        return Array(padding+1).join(' ')+value
    }
    if (typeof padding === 'string') {
        return padding + value
    }
    throw new Error('希望获取到 string 或 number' + '获取到的是' + padding)
}

console.log(padLeft('Hello world', true)) 
// Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```

联合类型表示一个变量可以是几种类型之一。用竖线 `|` 分隔每个类型，所以 `number | string | boolean` 表示一个值可以是 number、string 或 boolean。

如果一个值是联合类型，只能访问它们共有的属性。来看一个例子：

```ts
interface A {
    a: number,
    b: string
}

interface B {
    b: string,
    c: number
}

interface C {
    b: string,
    f: number
}

let test: A | B | C
test.a = 1 // Property 'a' does not exist on type 'A | B | C'. Property 'a' does not exist on type 'B'.
test.b = ''
```

在 interface 中，联合类型取得是交集，交叉类型是并集。这名上去跟名字有冲突，然而它们在基本类型又不是这样表现的。

- TS 只会帮助在编译时做类型检查，并不确保代码在运行时中的安全

#### 类型保护与区分类型

联合类型可用于把值区分为不同的类型。想确切了解某个值的类型要怎么办，首先想到类型断言，先看一个例子：

```ts
interface Teacher {
    teach():void
}

interface Student {
    learn(): void
}

function getPerson() : Teacher | Student {
    return {} as Teacher // 假设构造了一个 teacher 或 student
}

const person = getPerson() // person: Teacher | Student
person.learn(); // Property 'learn' does not exist on type 'Teacher | Student'. Property 'learn' does not exist on type 'Teacher'

person.teach(); // Property 'teach' does not exist on type 'Teacher | Student'. Property 'teach' does not exist on type 'Student'.
```

由于函数的返回值类型已经预设为 Teacher | Student，所以后续 person 的类型也推导为 Teacher | Student。这导致并不能只调用交集中的函数，所以只能使用类型断言来强制类型推测，如下所示：

```ts
interface Teacher {
    teach():void
}

interface Student {
    learn(): void
}

function getPerson() : Teacher | Student {
    return {} as Teacher // 假设构造了一个 teacher 或 student
}

const person = getPerson();
(<Student>person).learn(); 
(<Teacher>person).teach(); 
```

虽然可以顺利使用在 Student 和 Teacher 中的函数了，但每次都必须写上类型断言是一件非常麻烦的事。

所以在 TS 中有一种类型保护机制，可以让代码可读性得到提升，同时还能减少使用繁琐的类型断言。

要实现类型保护，只需要简单的定义一个函数就可以，但返回值必须是一个主谓宾语句，如下：

```ts
function isTeacher(person: Teacher | Student):person is Teacher {
    return (<Teacher>person).teach !== undefined
}
```

person is Teacher 就是类型保护语句，说明参数必须来自于当前函数签名里的一个参数名。

每当使用一些变量调用 isTeacher 时，TS 就会将变量指定为类型保护中的类型。但这个类型与变量的原始类型是兼容的。

```ts
interface Teacher {
    teach(): void
}

interface Student {
    learn(): void
}

function getPerson(): Teacher | Student {
    return {} as Teacher // 假设构造了一个 teacher 或 student
}

const person = getPerson();

function isTeacher(person: Teacher | Student): person is Teacher {
    return (<Teacher>person).teach !== undefined
}

if (isTeacher(person)) {
    person.teach()
} else {
    person.learn()
}
```

TS 很聪明，它不仅能知道在 if 分支中的 Teacher 类型，还能推测出 else 分支中的必然是 Person 类型，这都得益于类型保护的实现。

#### typeof 与 instanceof

现在可以使用类型保护来重构一开始的 padLeft 代码了。可以考虑用联合类型书写 padLeft 代码，像下面这样：

```ts
function isNumber(padding: number | string): padding is number {
    return typeof padding === 'number'
}

function isString(padding: number | string): padding is string {
    return typeof padding === "string"
}

function padLeft(value: string, padding: number | string) {
    if (isNumber(padding)) {
        return Array(padding + 1).join('') + value
    }
    if (isString(padding)) {
        return padding + value
    }
    throw new Error('希望获取到 string 或 number' + '获取到的是' + padding)
}

console.log(padLeft('XCR', '123')) //123XCR
console.log(padLeft('XCR', 123)) // XCR
```

但每次 typeof 进行类型判断都必须定义一个函数怒，又显得繁琐了。幸运的是 TS 会将 `typeof padding === 'number'` 视为一种类型保护，可以继续保持之前的代码结构。

typeof 在 TS 中使用时，只有匹配到基本类型时，才会启用类型保护。如果使用 `typeof padding === 'xcr'` ，它不会将这识别为一个有效类型，也不会启用有效的类型保护。
