const symId = Symbol('proNo')
interface Product {
    [symId]: number
    name: string
    price: number
    account: number
    buy(): string
}

type A = Product['name']
type B = Product['name' | 'price' | 'buy']
type S = Product[typeof symId]
const a:S = 123

// 获取接口里所有的属性名组成的类型
type PKeys = keyof Product //"name" | "price" | "account" | "buy" | typeof symId
let pKeys:PKeys="account"
// let pKeys2: "name" | "price" | "account" | "buy" | typeof symId = ""

// 泛型
type AllKeys<T> = T extends any ? T : never
type PKeys2 = AllKeys<keyof Product>

export {}