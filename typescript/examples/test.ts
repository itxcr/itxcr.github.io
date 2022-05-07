@logClass("option")
// @ts-ignore
class Person {
    public name: string
    public surname: string
    constructor(name: string, surname: string) {
        this.name = name
        this.surname = surname
    }
    public saySomething(something: string): string {
        return this.name + '' + this.surname + 'says:' + something
    }
}


function logClass(option: string) {
    return function (target: any) {
        const original = target
        // 用来生成类的实例的工具方法
        function construct(constructor, args) {
            const c: any = function () {
                return constructor.apply(this, args)
            }
            c.prototype = constructor.prototype
            return new c()
        }

        // 新的构造函数行为
        const f: any = function (...args) {
            console.log("New:" + original.name)
            args.push('1231312')
            return construct(original, args)
        }
        // 复制原型,保证 instanceof 操作能正常使用
        f.prototype = original.prototype
        // 返回新的构造函数(会覆盖原构造函数)
        console.log(option, target)
        return f
    }
}


function logMethod(target: any, key: string, descriptor: any) {
    // 保存原方法的引用
    console.log(descriptor)
    const originMethod = descriptor.value
    // 编辑 descriptor 参数的 value 属性
    descriptor.value = function (...args: any[]) {
        // 将方法参数转换成字符串
        const a = args.map(a => JSON.stringify(a)).join()
        // 执行方法 得道其返回值
        const result = originMethod.apply(this, args)
        // 将返回值转化为字符串
        const r = JSON.stringify(result)
        // 将函数调用细节打印到控制台
        console.log(`Call: ${key}(${a}) => ${r}`)
        return result
    }
    // 返回编辑后的属性描述对象
    return descriptor
}

function logProperty(target: any, key: string) {
    // 属性值
    let _val = this[key]
    // 属性的 getter
    const getter = function () {
        console.log(`Get:${key}=>${_val}`)
        return _val
    }
    // 属性的 setter
    const setter = function (newVal) {
        console.log(`Set:${key}=>${newVal}`)
        _val = newVal
    }
    // 删除属性，在严格模式下，如果对象是不可配置的，删除操作符将会抛出一个错误
    // 在非严格模式下，则会返回 false
    if (delete this[key]) {
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        })
    }
}

function addMetadata(target: any, key: string, index: number) {
    const metadataKey = `_log_${key}_parameters`
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index)
    } else {
        target[metadataKey] = [index]
    }
    console.log(target)
}

function logParameter(target: any, key: string, index: number) {
    const metadataKey = `_log_${key}_parameters`
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index)
    } else {
        target[metadataKey] = [index]
    }
    console.log(target)
}

function readMetadata(target: any, key: string, descriptor: any) {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: any[]) {
        const metadataKey = `_log_${key}_parameters`
        const includes = target[metadataKey]
        if (Array.isArray(includes)) {
            for (let i = 0; i < args.length; i++) {
                if (includes.indexOf(i) !== -1) {
                    const arg = args[i]
                    const argStr = JSON.stringify(arg) || arg.toString()
                    console.log(`${key} arg[${i}]:${argStr}`)
                }
            }
            const result = originalMethod.apply(this, args)
            return result
        }
    }
    return descriptor
}

function log(...args: any[]) {
    switch (args.length) {
        case 1:
            return logClass.apply(this, args)
        case 2:
            // 由于属性装饰器没有返回值
            // 使用 break 取代return
            logProperty.apply(this, args)
            break
        case 3:
            if (typeof args[2] === 'number') {
                logParameter.apply(this, args)
            }
            return logMethod.apply(this, args)
        default:
            throw new Error("装饰器不符合规范")
    }
}


const me = new Person('xcr', '666')
console.log(Person.prototype)

me.saySomething('hello')