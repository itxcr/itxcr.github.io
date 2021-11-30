// 实现一个发布订阅模式拥有on emit once off方法
class EventEmitter {
    constructor() {
        this.cache = {}
    }

    on(name, fn) {
        const tasks = this.cache[name]
        if (tasks) {
            this.cache[name].push(fn)
        } else {
            this.cache[name] = [fn]
        }
    }

    off(name, fn) {
        const tasks = this.cache[name]
        if (task) {
            const index = tasks.findIndex(item => item === fn)
            if (index >= 0) {
                this.cache[name].splice(index, 1)
            }
        }
    }

    emit(name, once = false, ...args) {
        // 复制一份。防止回调里继续on，导致死循环
        const tasks = this.cache[name].slice()
        if (tasks) {
            for (let fn of tasks) {
                fn(...args)
            }
        }
        if (once) {
            delete this.cache[name]
        }
    }

    once(name, ...args) {
        this.emit(name, true, ...args)
    }
}