var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Email = /** @class */ (function () {
    function Email(email) {
        if (this.validateEmail(email)) {
            this.email = email;
        }
        else {
            throw new Error('Invalid email');
        }
    }
    Email.prototype.validateEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    };
    Email.prototype.get = function () {
        return this.email;
    };
    return Email;
}());
var Person = /** @class */ (function () {
    function Person(name, surname, email) {
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
    Person.prototype.greet = function () {
        console.log('Hello');
    };
    return Person;
}());
var Teacher = /** @class */ (function (_super) {
    __extends(Teacher, _super);
    function Teacher(name, surname, email, subjects) {
        var _this = _super.call(this, name, surname, email) || this;
        _this.subjects = subjects;
        return _this;
    }
    Teacher.prototype.greet = function () {
        _super.prototype.greet.call(this);
        console.log('开示教书' + this.subjects);
    };
    Teacher.prototype.teach = function () {
        console.log('教书');
    };
    return Teacher;
}(Person));
var SchoolPrincipal = /** @class */ (function (_super) {
    __extends(SchoolPrincipal, _super);
    function SchoolPrincipal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchoolPrincipal.prototype.manageTeachers = function () {
        console.log('我们需要帮助学生变得更好');
    };
    return SchoolPrincipal;
}(Teacher));
var principal = new SchoolPrincipal('testP', 'P', new Email('p@p.com'), ['数学', '物理']);
principal.greet();
principal.teach();
principal.manageTeachers();
