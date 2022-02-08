// 判断某个值是否是对象的辅助方法
function isObject(val) {
  return val !== null && typeof val === 'object'
}
// 创建响应式对象
function createReactiveObject(target) {
  // 如果 target 不是对象直接返回
  if (!isObject(target)) return target
  const baseHandler = {
    get() {},
    set() {},
    deleteProperty(target, property) {},
  }
  const observed = new Proxy(target, baseHandler)
  return observed
}

// 响应式核心方法
function reactive(target) {
  return createReactiveObject(target)
}
