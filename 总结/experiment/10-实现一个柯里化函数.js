/* 
柯里化是一种函数的转换，它是指将一个函数从可调用的 f(a, b, c) 转换为可调用的 f(a)(b)(c)。
柯里化不会调用函数。它只是对函数进行转换。
*/

function currying(fn, ...args1) {
    // 获取fn参数有几个
    const length = fn.length
    let allArgs = [...args1]
    const res = (...arg2) => {
      allArgs = [...allArgs, ...arg2]
      // 长度相等就返回执行结果
      if (allArgs.length === length) {
        return fn(...allArgs)
      } else {
        // 不相等继续返回函数
        return res
      }
    }
    return res
  }
  
  // 测试：
  const add = (a, b, c) => a + b + c;
  const a = currying(add, 1);
  console.log(a(2,3))