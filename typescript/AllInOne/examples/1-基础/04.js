"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 根类型可赋值 null 和 undefined 除外的任意数值
var data = new Set([['a', 1], 2, 3, 4, 5]);
// {} 为 Object 类型的简写
var data2 = new Set([['a', 1], 2, 3, 4, 5]);
var data3 = { name: 'xcr' };
// 联合类型
var str = '123';
str = { name: 'xcr' };
var obj1 = { name: 'xcr' };
var obj2 = { age: 23 };
var obj3 = { name: 'test', age: 18 };
var a = '123';
var b = 123;
var c = 2;
function isTrue(type) {
    if (type) {
        console.log('yes');
    }
    else {
        console.log('close');
    }
}
