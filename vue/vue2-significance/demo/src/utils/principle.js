// function defineProperty (obj, key, value) {
//   observer(value)
//   Object.defineProperty(obj, key, {
//     get () {
//       return value
//     },
//     set (newValue) {
//       if (newValue !== value) {
//         updateView() // 更新视图
//         value = newValue
//       }
//     }
//   })
// }
//
// function observer (target) {
//   if (typeof target !== 'object') {
//     return target
//   }
//   for (const key in target) {
//     defineProperty(target, key, target[key])
//   }
// }
//
// function updateView () {
//   console.log('更新视图')
// }
//
// const user = { name: 'xcr' }
// observer(user)
// console.log(user)
// console.log(user.name)
// console.log(user.name = '123')

// const arrayPrototype = Array.prototype
// const proto = Object.create(arrayPrototype);
//
// ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
//   Object.defineProperty(proto, method, {
//     get () {
//       // 更新视图
//       console.log('更新视图')
//       return arrayPrototype[method]
//     }
//   })
// })
// function observer (target) {
//   if (typeof target !== 'object') {
//     return target
//   }
//
//   if (Array.isArray(target)) {
//     Object.setPrototypeOf(target, proto)
//   }
// }
// const a = [1, 2]
// observer(a)
// a.length = 0
// console.log(a)

// const baseHandler = {
//   get (target, property) {
//     console.log('获取属性')
//     return target[property]
//   },
//   set (target, property, value) {
//     target[property] = value
//     console.log('设置属性')
//   },
//   deleteProperty (target, p) {
//     delete target[p]
//     console.log('删除属性')
//   }
// }
// const target = {}
// const test = new Proxy(target, baseHandler)
// test.a
// console.log(test)
// test.a = 1
// console.log(test)
// delete test.a
// console.log(test)

const deduplication = (arr) => [...new Set(arr)]
console.log(deduplication([1, 1, 1, 22, 4, 5, 6, 78]))
