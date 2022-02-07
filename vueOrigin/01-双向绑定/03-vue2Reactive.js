// 侦测数组
const arrayPrototype = Array.prototype
// 使用数组的原型对象创建一个新对象
const proto = Object.create(arrayPrototype)
const arr = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

arr.forEach((method) => {
  Object.defineProperty(proto, method, {
    get() {
      updateView()
      // 返回数组原有的方法
      console.log(arrayPrototype[method])
      console.log(arrayPrototype)
      return arrayPrototype[method]
    },
  })
})

function defineReactive(obj, key, value) {
  // 通过递归调用解决多层对象嵌套的属性侦测问题
  observer(value)
  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        observer(newValue)
        updateView()
        value = newValue
      }
    },
  })
}

function observer(target) {
  if (typeof target !== 'object') return target
  // 如果 target 是数组，则将数组的原型对象设置为 proto
  if (Array.isArray(target)) {
    Object.setPrototypeOf(target, proto)
    // 对数组中元素进行侦测
    for (let i = 0; i < target.length; i++) {
      observer(target[i])
    }
    return
  }
  // 循环遍历对象的所有属性，并将它们转换为 getter 和 setter 形式
  for (let key in target) {
    defineReactive(target, key, target[key])
  }
}

function updateView() {
  console.log('更新视图')
}

let user = { name: '测试', address: { city: '北京' }, emails: ['123@123.com'] }
observer(user)
user.emails.pop()
console.log(user.emails)
