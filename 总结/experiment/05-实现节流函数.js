function throttle(fn, delay = 200) {
    let flag = true
    return function() {
        if(!flag) return
        flag = false
        const args = arguments
        setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay)
    }
}