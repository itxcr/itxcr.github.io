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

let user = { name: '测试', address: { city: '北京' } }
observer(user)
user.address = { city: '天津' }
user.address.city = '上海'
user.address.city = '上海1'
