"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// JavaScript 中 null 表示什么都没有，表示一个空对象引用
var obj = null;
console.log(typeof null); // object
// 声明一个变量,但没有赋值,该变量的值为 undefined
var x;
console.log(x);
console.log(typeof x);
var str = undefined;
console.log(str);
function fn(data) {
    if (data)
        data.toString();
    // ! 忽略 undefined
    data.toString();
}
fn();
// 哪些数据类型可以接收 undefined
// undefined any unknown 可以接收 undefined
var data = undefined;
var data1 = undefined;
var data2 = undefined;
// 哪些数据类型可以接收 null
// any unknown  null 可以接收 null
var data3 = null;
var data4 = null;
var data5 = null;
