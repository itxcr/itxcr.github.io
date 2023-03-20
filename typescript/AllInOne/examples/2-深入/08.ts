class People {
    name: string
    age: number
    address?: string
    phone!:string
    static count: number = 0
    constructor(_name: string, _age: number, _address: string) {
        this.name = _name
        this.age = _age
        this.address = _address
        People.count++
    }
    doEat(){}
    doStep(){}
}

let p1 = new People('xcr', 18, 'xxx')
let p2 = new People('xcr', 18, 'xxx')
let p3 = new People('xcr', 18, 'xxx')
// 静态成员（静态属性 静态方法）
console.log(People.count)
export {}
