"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var People = /** @class */ (function () {
    function People(name, addr) {
        this._name = name;
        this._addr = addr;
    }
    Object.defineProperty(People.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (val) {
            if (val > 10 && val < 18) {
                this._age = val;
                return;
            }
            throw new Error('不在请求范围');
        },
        enumerable: false,
        configurable: true
    });
    return People;
}());
var s = new People('xcr', 'xxxxxxx');
s.age = 11;
s.age = 11;
s.age = 16;
console.log(s.age);
