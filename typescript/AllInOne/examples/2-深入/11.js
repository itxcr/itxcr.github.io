"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtil = /** @class */ (function () {
    function StringUtil() {
    }
    StringUtil.trimSpace = function (str) {
        return str.replace(/\s+/g, "");
    };
    return StringUtil;
}());
var People = /** @class */ (function () {
    function People(name, where) {
        this._name = name;
        this._where = where;
    }
    People.prototype.doEat = function (name, where) {
        console.log("who: ".concat(name, "  where:").concat(where));
    };
    return People;
}());
function intercept(targetClass) {
    var getProp = Object.getOwnPropertyDescriptor(targetClass.prototype, 'doEat');
    console.log(getProp, 'getProp');
    var targetMethod = getProp.value;
    getProp.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args = args.map(function (v) {
            if (typeof v === 'string')
                return StringUtil.trimSpace(v);
            return v;
        });
        console.log('前置');
        console.log(this);
        targetMethod.apply(this, args);
        console.log('后置');
    };
    // getProp!.value('xcr', 'test')
    Object.defineProperty(targetClass.prototype, 'doEat', getProp);
}
// 每次调用 Object.getOwnPropertyDescriptor 都会开辟新的内存空间
// const getProp = Object.getOwnPropertyDescriptor(People.prototype, 'doEat')
// console.log(getProp, 'getProp')
// const targetMethod = getProp!.value
// getProp!.value = function (...args: any[]) {
//     args = args.map(v => {
//         if (typeof v === 'string') return StringUtil.trimSpace(v)
//         return v
//     })
//     console.log('前置')
//     console.log(this)
//     targetMethod.apply(this, args)
//     console.log('后置')
// }
// getProp!.value('xcr', 'test')
// Object.defineProperty(People.prototype, 'doEat', getProp!)
// 拦截器封装
intercept(People);
var p = new People('xcr', 'test');
p.doEat('x  x  x', 'p  p  p');
