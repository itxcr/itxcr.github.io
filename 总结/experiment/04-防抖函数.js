function debounce(fn, delay = 500) {
    let timer
    return function() {
        if(timer) {
            clearTimeout(timer)
        }
        const args = arguments
        timer = setTimeout(() => {
            fn.apply(this, args) // 改变this指向为调用debounce所指的对象
        }, delay)
    }
}