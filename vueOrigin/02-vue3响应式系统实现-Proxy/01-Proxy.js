/**
 * vue2 使用 Object.defineProperty() 方法侦测对象的属性变化，有一些缺陷
 *  1. 性能较差
 *  2. 在对象上新增属性是无法被侦测的
 *  3. 改变数组的 length 属性是无法被侦测的
 */

/**
 * vue3 使用 ES6 的 Proxy 取代 Object.defineProperty()方法，性能更优异
 * 数组和对象一样可以直接触发 get() 和 set() 方法
 * Proxy 被称为代理，是一种可以拦截并改变底层 JavaScript 引擎操作的包装器
 */

/**
 * 调用 new Proxy(target, handler) 可以为一个目标对象创建一个代理，
 * 代理可以拦截 Javascript 引擎内部目标的底层对象操作，这些底层操作被拦截后会触发响应特定操作的陷阱函数。
 * 在调用 Proxy 构造函数时，需要传入两个参数，target 为目标对象；handler 是一个包含陷阱函数的处理器对象。
 */

// 创建代理示例
const baseHandler = {
  // 陷阱函数，读取属性值时触发
  // target 是目标对象
  // property 是要获取的属性名
  // receiver 是 Proxy 对象或继承 Proxy 的对象
  get(target, property, receiver) {
    console.log('获取值')
  },
  //  陷阱函数，写入属性时触发
  //  value 是新的属性值
  set(target, property, value, receiver) {
    console.log('设置值')
  },
  // 陷阱函数，删除属性时触发
  deleteProperty(target, property) {
    console.log('删除属性')
  },
}
// 目标对象
const target = {
  name: '测试',
}
// 为目标对象创建代理对象
const proxy = new Proxy(target, baseHandler)
// 获取属性值
proxy.name
// 设置属性值
proxy.name = '测试1'
// 删除属性
delete proxy.name
