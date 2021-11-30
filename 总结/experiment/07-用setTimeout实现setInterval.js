// setinterval 用来实现循环定时调用 可能会存在一定的问题 能用 settimeout 解决吗
function mySetTimeout(fn, delay) {
    let timer = null
    const interval = () => {
        fn()
        timer = setTimeout(interval, delay)
    }
    setTimeout(interval, delay)
    return {
        cancel: () => { clearTimeout(timer) }
    }
}

// 测试
const { cancel } = mySetTimeout(() => console.log(888), 1000)
setTimeout(() => {
    cancel()
}, 6000)