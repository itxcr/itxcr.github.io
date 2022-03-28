// import $ from 'jQuery'
//
// class User {
//   name: string;
//   age: number;
// }
//
// console.log($.ajax)
//
// function getUsers(cb: (users: User[]) => void): void {
//   $.ajax({
//     url: 'api/users',
//     method: 'GET',
//     success: function (data) {
//       cb(data.items)
//     },
//     error: function (error) {
//       cb(null)
//     }
//   })
// }
//
// interface LoggerInterface {
//   log(arg: any): void
// }
//
// class Logger implements LoggerInterface {
//   log(arg) {
//     if (typeof console.log === 'function') {
//       console.log(arg)
//     } else {
//       alert(arg)
//     }
//   }
// }
//
// interface UserInterface {
//   name: string,
//   password: string
// }
//
// let user: UserInterface = {
//   name: '',
//   password: '' // '{ name: string; pasword: string; }' is not assignable to type 'UserInterface'
// }

// namespace Geometry {
//   interface VectorInterface {
//   }
//
//   export interface Vector2dInterface {
//   }
//
//   export interface Vector3dInterface {
//   }
//
//   export class Vector2d implements VectorInterface, Vector2dInterface {
//   }
//
//   export class Vector3d implements VectorInterface, Vector3dInterface {
//   }
// }
// const vector2dInstance: Geometry.Vector2dInterface = new Geometry.Vector2d()
// const vector3dInstance: Geometry.Vector3dInterface = new Geometry.Vector3d()

// module Geometry {
//   export interface Vector2dInterface {
//     toArray(callback: (x: number[]) => void): void
//
//     length(): number
//
//     normalize()
//   }
//
//   export class Vector2d implements Vector2dInterface {
//     private _x: number
//     private _y: number
//
//     constructor(x: number, y: number) {
//       this._x = x
//       this._y = y
//     }
//
//     toArray(callback: (x: number[]) => void): void {
//       callback([this._x, this._y])
//     }
//
//     length(): number {
//       return Math.sqrt(this._x * this._x + this._y * this._y)
//     }
//
//     normalize() {
//       let len = 1 / this.length()
//       this._x *= len
//       this._y *= len
//       return {a: this._x, b: this._y}
//     }
//   }
// }
//
// const vector: Geometry.Vector2dInterface = new Geometry.Vector2d(2, 3)
// vector.normalize()
// vector.toArray((vectorAsArray: number[]) => {
//   console.log(vectorAsArray)
// })

// function greetNamed(name: string):string {
//   if (name) {
//     return `Hi! ${name}`
//   }
// }


// let greetUnnamed:(name: string) => string
// greetUnnamed = function (name: string): string {
//   if (name) {
//     return `Hi! ${name}`
//   }
// }

// let greedUnnamed:(name: string) => string = function (name: string):string {
//   if (name) {
//     return `Hi! ${name}`
//   }
// }

// function add(foo: number, bar: number, foobar: number = 0): number {
//   return foo + bar + foobar
// }

// function add(foo, bar, foobar) {
//   if (foobar === void 0) {
//     foobar = 0
//   }
//   return foo + bar + foobar
// }

// function add(...foo:number[]):number {
//   let result = 0
//   for (let i = 0, j = foo.length; i < j; i++) {
//     result += foo[i]
//   }
//   return result
// }
//
// console.log(add())

// add(2, 3)

// function add() {
//   let foo = []
//   for (let i = 0, j = arguments.length; i < j; i++) {
//     foo[i - 0] = arguments[i]
//   }
//   let result = 0
//   for (let i = 0, j = foo.length; i < j; i++) {
//     result += foo[i]
//   }
//   return result
// }
//
// // @ts-ignore
// console.log(add(1, 2, 3))

// function add(foo: number[]):number {
//   let result = 0
//   for (let i =0, j = foo.length; i < j; i++) {
//     result += foo[i]
//   }
//   return result
// }
//
// console.log(add([]))
// console.log(add(2))
// console.log(add(2, 2))
// console.log(add(2, 2, 2))

// function test(name: string):string    // 重载签名
// function test(age: number): string    // 重载签名
// function test(single: boolean):string // 重载签名
// function test(value: string | number | boolean): string { // 实现签名
//   switch (typeof value) {
//     case 'string':
//       return `My name is ${value}`
//     case 'number':
//       return `Im ${value} years old`
//     case 'boolean':
//       return value ? `I'm single` : `I'm not single`
//     default:
//       console.log('Invalid Operation!')
//   }
// }

// interface Document {
//   createElement(tagName: 'div'):HTMLDivElement
//   createElement(tagName: 'span'):HTMLSpanElement
//   createElement(tagName: 'canvas'):HTMLCanvasElement
//   createElement(tagName: string): HTMLElement
// }

// function foo2():void {
//   bar = 0
//   var bar: number
//   alert(bar)
// }
// foo2()

// var bar = 0; // 全局的
// (function (global) {
//     var foo: number = 0 // 在函数作用域中
//     bar = 1  // 在全局作用域中
//     console.log(global.bar) // 1
//     console.log(foo) // 0
//   })(this)
//
// console.log(bar) // 1
// console.log(foo) // 错误

// class Counter {
//   private _i:number
//   constructor() {
//     this._i = 0
//   }
//   get():number {
//     return this._i
//   }
//   set(val: number): void {
//     this._i = val
//   }
//   increment(): void {
//     this._i ++
//   }
// }
//
// var counter = new Counter()
// console.log(counter.get()) // 0
// counter.set(2)
// console.log(counter.get()) // 2
// counter.increment()
// console.log(counter.get()) // 3
// console.log(counter._i) // 错误 _i 为私有属性


// var Counter = (function () {
//   var _i:number = 0
//   function Counter() {
//
//   }
//   Counter.prototype.get = function (){
//     return _i
//   }
//   Counter.prototype.set = function (val: number){
//     _i = val
//   }
//   Counter.prototype.increment = function () {
//     _i++
//   }
//   return Counter
// })()
//
// var a = new Counter()
// console.log(a.get())
// a.set(2)
// console.log(a.get())
// a.increment()
// console.log(a.get())
// console.log(a._i)
class User {
  name: string
  age: number
}

function getEntities<T>(url: string, cb: (list : T[]) => void):void {

}

getEntities()<User>
