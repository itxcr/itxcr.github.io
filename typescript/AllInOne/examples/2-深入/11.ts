class StringUtil {
    static trimSpace(str: string) {
        return str.replace(/\s+/g, "");
    }
}

class People {

    _name: string
    _where: string

    constructor(name: string, where: string) {
        this._name = name
        this._where = where
    }

    doEat(name: string, where: string) {
        console.log(`who: ${name}  where:${where}`)
    }
}

// 每次调用 Object.getOwnPropertyDescriptor 都会开辟新的内存空间
const getProp = Object.getOwnPropertyDescriptor(People.prototype, 'doEat')
console.log(getProp, 'getProp')
const targetMethod = getProp!.value
getProp!.value = function (...args: any[]) {
    args = args.map(v => {
        if (typeof v === 'string') return StringUtil.trimSpace(v)
        return v
    })
    console.log('前置')
    console.log(this)
    targetMethod.apply(this, args)
    console.log('后置')
}

// getProp!.value('xcr', 'test')
Object.defineProperty(People.prototype, 'doEat', getProp!)
const p = new People('xcr', 'test')
p.doEat('x  x  x', 'p  p  p')

export {}