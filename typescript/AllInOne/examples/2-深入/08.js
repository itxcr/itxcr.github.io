"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var People = /** @class */ (function () {
    function People(_name, _age, _address) {
        this.name = _name;
        this.age = _age;
        this.address = _address;
        People.count++;
    }
    People.prototype.doEat = function () { };
    People.prototype.doStep = function () { };
    People.count = 0;
    return People;
}());
var p1 = new People('xcr', 18, 'xxx');
var p2 = new People('xcr', 18, 'xxx');
var p3 = new People('xcr', 18, 'xxx');
// 静态成员（静态属性 静态方法）
console.log(People.count);
