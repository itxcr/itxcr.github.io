"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function info(stuObj) {
    console.log(stuObj.username, stuObj.age);
    return 3;
}
var stuObj = {
    username: 'xcr', age: 23, phone: '123'
};
info(stuObj);
// 函数解构
function subInfo(_a) {
    var username = _a.username, age = _a.age;
    console.log(username, age);
    return 3;
}
subInfo(stuObj);
