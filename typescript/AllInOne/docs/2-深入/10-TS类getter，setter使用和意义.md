```ts
class People {
    _name: string
    _addr: string

    _age!: number
    constructor(name: string, addr: string) {
        this._name = name
        this._addr = addr
    }

    set age(val: number) {
        if (val > 10 && val < 18) {
            this._age = val
            return
        }
        throw new Error('不在请求范围')
    }
    get age() {
        return this._age
    }

}

const s = new People('xcr', 'xxxxxxx')
s.age = 11
s.age = 11
s.age = 16
console.log(s)
export {}
```