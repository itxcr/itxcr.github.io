// 初步了解 Promise 底层源码的代码片段
type TypeResolve = (resolve_success: any) => any
type TypeReject = (reject_fail: any) => any

class Promise {
    public resolveFunc!: TypeResolve
    public rejectFunc!: TypeReject
    // promiseParams 是函数类型为 `(resolve: TypeResolve, reject: TypeReject) => any` 的参数
    constructor(promiseParams: (resolve: TypeResolve, reject: TypeReject) => any) {
        this.resolveFunc = (resolve_success: any): any => {
            console.log(resolve_success)
        }
        this.rejectFunc = (reject_fail: any): any => {
            console.log(reject_fail)
        }
        // 执行 promiseParams 等于执行 new Promise 的参数，即(resolve: TypeResolve, reject: TypeReject): any => {resolve(123) reject('fail')}
        promiseParams(this.resolveFunc, this.rejectFunc)
    }
}

new Promise((resolve: TypeResolve, reject: TypeReject): any => {
    resolve(123) // 执行 this.resolveFunc
    reject('fail') // 执行 this.rejectFunc
})

export {}
