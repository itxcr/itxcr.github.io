"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function info(name, age) {
    console.log(name, age);
    return 3;
}
info('xcr', 18);
function info1(name, age) {
    console.log(name, age);
    return 3;
}
info1('xcr', 18);
var info2 = function (name, age) {
    console.log(name, age);
    return 3;
};
info2('xcr', 18);
var info3 = function (name, age) {
    console.log(name, age);
    return 3;
};
info3('xcr', 18);
var info4 = function (name, age) {
    console.log(name, age);
    return 3;
};
info4('xcr', 18);
function info5(name, age) {
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    console.log(name, age, rest);
    return rest;
}
info5('xcr', 18, [1, 2], 'aas', 24);
