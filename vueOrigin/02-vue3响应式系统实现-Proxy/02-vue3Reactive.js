/**
 * Reflect 是一个内置对象，提供了可拦截 Javascript 操作的方法。
 * 每个代理陷阱对应一个命名和参数都相同的 Reflect 方法
 */
// 判断某个值是否是对象的辅助方法
function isObject(val) {
  return val !== null && typeof val === 'object'
}
// 创建响应式对象
function createReactiveObject(target) {
  // 如果 target 不是对象,则直接返回
  if (!isObject(target)) return target
  const baseHandler = {
    /**
     * 为了解决多层对象侦测的问题，需要在 get 陷阱函数中对返回值做一个判断，如果返回值是一个对象，
     * 则为返回值也创建代理对象，这是一个递归调用
     */
    get(target, property, receiver) {
      console.log('获取值')
      const result = Reflect.get(target, property, receiver)
      return isObject(result) ? reactive(result) : result
    },
    set(target, property, value, receiver) {
      console.log('设置值')
      return Reflect.set(target, property, value, receiver)
    },
    deleteProperty(target, property) {
      console.log('删除属性')
      return Reflect.deleteProperty(target, property)
    },
  }
  return new Proxy(target, baseHandler)
}

// 响应式核心方法
function reactive(target) {
  return createReactiveObject(target)
}

const proxy = reactive({ name: '测试', address: { city: '北京' } })
proxy.address.city = '上海'

/**
 * 考虑下面两种情况
 * 第一种
 * const target = {name: '测试'}
 * const proxy1 = reactive(target)
 * const proxy2 = reactive(target)
 * 上面代码对同一个目标对象进行了多次代理，如果每次返回一个不同的代理对象，是没有意义的，
 * 要解决这个问题，可以在为目标对象初次创建代理后，以目标对象为 key，代理为 value，保存到一个 Map 中，
 * 然后在每次创建代理前，对目标对象进行判断，如果已经存在代理对象，则直接返回代理对象，不再创建新的代理对象
 */
let b = 1
const a = b++ / 3
console.log(a)
