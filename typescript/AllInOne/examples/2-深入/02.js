"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = /** @class */ (function () {
    // promiseParams 是函数类型为 `(resolve: TypeResolve, reject: TypeReject) => any` 的参数
    function Promise(promiseParams) {
        this.resolveFunc = function (resolve_success) {
            console.log(resolve_success);
        };
        this.rejectFunc = function (reject_fail) {
            console.log(reject_fail);
        };
        // 执行 promiseParams 等于执行 new Promise 的参数，即(resolve: TypeResolve, reject: TypeReject): any => {resolve(123) reject('fail')}
        promiseParams(this.resolveFunc, this.rejectFunc);
    }
    return Promise;
}());
new Promise(function (resolve, reject) {
    resolve(123); // 执行 this.resolveFunc
    reject('fail'); // 执行 this.rejectFunc
});
