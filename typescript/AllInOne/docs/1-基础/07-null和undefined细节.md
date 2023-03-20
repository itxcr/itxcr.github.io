### null 和 undefined 细节

#### JS

```js
"use strict";
// JavaScript 中 null 表示什么都没有，表示一个空对象引用
let obj = null;
console.log(typeof null); // object
// 声明一个变量,但没有赋值,该变量的值为 undefined
let x;
console.log(x); //undefined
console.log(typeof x); //undefined
```

#### TS

```ts
const str:string | undefined=undefined
console.log(str)

function fn(data?: string) {
    if (data) data.toString()
    // ！ 忽略 undefined
    data!.toString()
}
fn()
// 哪些数据类型可以接收 undefined
// undefined any unknown 可以接收 undefined
let data:undefined = undefined
let data1:any = undefined
let data2:unknown = undefined
// 哪些数据类型可以接收 null
// any unknown  null 可以接收 null
let data3: any = null
let data4: unknown = null
let data5: null = null

export {}
```