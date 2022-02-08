// 只是简单侦测了一个对象的属性变化，没有考虑对象嵌套问题
function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        updateView()
        value = newValue
      }
    },
  })
}

// 对一个对象中所有属性的变化进行侦测
function observer(target) {
  if (typeof target !== 'object') return target
  // 循环遍历对象的所有属性，并将它们转换为 getter 和 setter 形式
  for (let key in target) {
    defineReactive(target, key, target[key])
  }
}

// 模拟更新视图的方法
function updateView() {
  console.log('更新视图')
}

let user = { name: '测试' }
// 对 user 对象的所有属性变化进行侦测
observer(user)
user.name = 123
