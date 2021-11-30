function myNew(fn, ...args) {
    const obj = {}
    obj.__proto__ = fn.prototype
    fn.apply(obj, args)
    return obj
}

const a = myNew()