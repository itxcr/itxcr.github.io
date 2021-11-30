function mySetInterval(fn, delay) {
    const timer = setInterval(() => {
        fn()
        clearInterval(timer)
    }, delay)
}

// 测试
mySetInterval(() => {console.log(888)}, 8000)