"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateUtil = /** @class */ (function () {
    function DateUtil() {
    }
    DateUtil.formDate = function () {
        console.log('格式化代码 DateUtil');
    };
    DateUtil.diffDateByDay = function () { };
    DateUtil.diffDateByHour = function () { };
    DateUtil.timeConversion = function (restTime) { };
    return DateUtil;
}());
// DateUtil.timeConversion(+new Date())
// 单例模式
// class DateUtil1 {
//     // 立即创建单例模式
//     static dateUtil = new DateUtil1()
//     private constructor() {
//         console.log('111111')
//     }
//     formDate() {
//         console.log('格式化日期')
//     }
//     diffDateByDay() {}
//     diffDateByHour() {}
//     timeConversion(restTime: number) {}
// }
// console.log('222222')
// const dateUtil1 = DateUtil1.dateUtil
// const dateUtil2 = DateUtil1.dateUtil
// const dateUtil3 = DateUtil1.dateUtil
// const dateUtil4 = DateUtil1.dateUtil
// const dateUtil5 = DateUtil1.dateUtil
// console.log(dateUtil1 === dateUtil2)
// dateUtil1.formDate()
var DateUtil2 = /** @class */ (function () {
    function DateUtil2() {
        console.log('111111');
    }
    DateUtil2.getInstance = function () {
        if (this.dateUtil === null) {
            this.dateUtil = new DateUtil2();
        }
        return this.dateUtil;
    };
    DateUtil2.prototype.formDate = function () {
        console.log('格式化日期');
    };
    DateUtil2.prototype.diffDateByDay = function () { };
    DateUtil2.prototype.diffDateByHour = function () { };
    DateUtil2.prototype.timeConversion = function (restTime) { };
    // 立即创建单例模式
    DateUtil2.dateUtil = null;
    return DateUtil2;
}());
console.log('22222222222');
var date1 = DateUtil2.getInstance();
date1.formDate();
