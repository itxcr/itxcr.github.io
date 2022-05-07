var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Person = /** @class */ (function () {
    function Person(name, surname) {
        this.name = name;
        this.surname = surname;
    }
    Person.prototype.saySomething = function (something) {
        return this.name + '' + this.surname + 'says:' + something;
    };
    Person = __decorate([
        logClass("option")
        // @ts-ignore
    ], Person);
    return Person;
}());
function logClass(option) {
    return function (target) {
        var original = target;
        // 用来生成类的实例的工具方法
        function construct(constructor, args) {
            var c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        // 新的构造函数行为
        var f = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("New:" + original.name);
            args.push('1231312');
            return construct(original, args);
        };
        // 复制原型,保证 instanceof 操作能正常使用
        f.prototype = original.prototype;
        // 返回新的构造函数(会覆盖原构造函数)
        console.log(option, target);
        return f;
    };
}
function logMethod(target, key, descriptor) {
    // 保存原方法的引用
    console.log(descriptor);
    var originMethod = descriptor.value;
    // 编辑 descriptor 参数的 value 属性
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 将方法参数转换成字符串
        var a = args.map(function (a) { return JSON.stringify(a); }).join();
        // 执行方法 得道其返回值
        var result = originMethod.apply(this, args);
        // 将返回值转化为字符串
        var r = JSON.stringify(result);
        // 将函数调用细节打印到控制台
        console.log("Call: ".concat(key, "(").concat(a, ") => ").concat(r));
        return result;
    };
    // 返回编辑后的属性描述对象
    return descriptor;
}
function logProperty(target, key) {
    // 属性值
    var _val = this[key];
    // 属性的 getter
    var getter = function () {
        console.log("Get:".concat(key, "=>").concat(_val));
        return _val;
    };
    // 属性的 setter
    var setter = function (newVal) {
        console.log("Set:".concat(key, "=>").concat(newVal));
        _val = newVal;
    };
    // 删除属性，在严格模式下，如果对象是不可配置的，删除操作符将会抛出一个错误
    // 在非严格模式下，则会返回 false
    if (delete this[key]) {
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
function addMetadata(target, key, index) {
    var metadataKey = "_log_".concat(key, "_parameters");
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
    console.log(target);
}
function logParameter(target, key, index) {
    var metadataKey = "_log_".concat(key, "_parameters");
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
    console.log(target);
}
function readMetadata(target, key, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var metadataKey = "_log_".concat(key, "_parameters");
        var includes = target[metadataKey];
        if (Array.isArray(includes)) {
            for (var i = 0; i < args.length; i++) {
                if (includes.indexOf(i) !== -1) {
                    var arg = args[i];
                    var argStr = JSON.stringify(arg) || arg.toString();
                    console.log("".concat(key, " arg[").concat(i, "]:").concat(argStr));
                }
            }
            var result = originalMethod.apply(this, args);
            return result;
        }
    };
    return descriptor;
}
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    switch (args.length) {
        case 1:
            return logClass.apply(this, args);
        case 2:
            // 由于属性装饰器没有返回值
            // 使用 break 取代return
            logProperty.apply(this, args);
            break;
        case 3:
            if (typeof args[2] === 'number') {
                logParameter.apply(this, args);
            }
            return logMethod.apply(this, args);
        default:
            throw new Error("装饰器不符合规范");
    }
}
var me = new Person('xcr', '666');
console.log(Person.prototype);
me.saySomething('hello');
