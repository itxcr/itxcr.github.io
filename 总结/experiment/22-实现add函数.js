function add(...args1) {
    let allArgs = [...args1]

    function fn(...args2) {
        if (!args2.length) return fn.toString()
        allArgs = [...allArgs, ...args2]
        return fn
    }

    fn.toString = function () {
        return allArgs.reduce((pre, next) => pre + next)
    }

    return fn
}

// 测试
console.log(add(1)(2)(3)())
console.log(add(1, 2)(3)())