// class Email {
//   private readonly email: string
//
//   constructor(email: string) {
//     if (this.validateEmail(email)) {
//       this.email = email
//     } else {
//       throw new Error('Invalid email')
//     }
//   }
//
//   private validateEmail(email: string) {
//     let re = /\S+@\S+\.\S+/
//     return re.test(email)
//   }
//
//   get():string {
//     return this.email
//   }
// }
// class Person {
//   public name: string
//   public surname: string
//   public email: Email
//   constructor(name: string, surname: string, email: Email) {
//     this.name = name
//     this.surname = surname
//     this.email = email
//   }
//   greet() {
//     console.log('Hello')
//   }
// }
//
// class Teacher extends Person {
//   public subjects: string[]
//   constructor(name: string, surname: string, email: Email, subjects: string[]) {
//     super(name, surname, email);
//     this.subjects = subjects
//   }
//
//   greet() {
//     super.greet()
//     console.log('开示教书' + this.subjects)
//   }
//   teach() {
//     console.log('教书')
//   }
// }
//
// class SchoolPrincipal extends Teacher {
//   manageTeachers() {
//     console.log('我们需要帮助学生变得更好')
//   }
// }
//
// let principal = new SchoolPrincipal('testP', 'P', new Email('p@p.com'), ['数学', '物理'])
// principal.greet()
// principal.teach()
// principal.manageTeachers()
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal() {
    }
    Animal.prototype.eat = function () {
        console.log('eat');
        return '';
    };
    return Animal;
}());
var Mammal = /** @class */ (function (_super) {
    __extends(Mammal, _super);
    function Mammal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mammal.prototype.breathe = function () {
        console.log('breathe');
        return '';
    };
    Mammal.prototype.move = function () {
        console.log('move1');
        return '';
    };
    return Mammal;
}(Animal));
var WingedAnimal = /** @class */ (function (_super) {
    __extends(WingedAnimal, _super);
    function WingedAnimal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WingedAnimal.prototype.fly = function () {
        console.log('fly');
        return '';
    };
    WingedAnimal.prototype.move = function () {
        console.log('move2');
        return '';
    };
    return WingedAnimal;
}(Animal));
var Bat1 = /** @class */ (function () {
    function Bat1() {
    }
    return Bat1;
}());
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
applyMixins(Bat1, [WingedAnimal, Mammal]);
var a = new Bat1();
a.breathe();
a.fly();
a.move();
a.eat();
