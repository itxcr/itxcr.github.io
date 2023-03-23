"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 可变元组标签
// 元组标签名字可以与解构变量名相同也可以不同
var _a = ['xcr', 18, '5000', 5000, 5000, 'test'], name = _a[0], age = _a[1], desc = _a[2], rest = _a.slice(3);
console.log(rest); // [ 5000, 5000 ]
