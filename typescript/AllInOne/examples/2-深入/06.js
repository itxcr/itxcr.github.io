"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 可变元组
var customers = ['xcr', 5000, '5000', 5000, 5000];
// 可变元组解构
var _a = ['xcr', 18, '5000', 5000, 5000, 'test'], name = _a[0], age = _a[1], desc = _a[2], rest = _a.slice(3);
console.log(rest); // [ 5000, 5000 ]
