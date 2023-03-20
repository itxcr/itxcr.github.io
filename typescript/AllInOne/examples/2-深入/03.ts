// type 定义基础类型
type num = number

// type 定义联合类型
type baseType = string | number | symbol
// type 定义联合类型2
interface Car { brand: string}
interface Plane { brand: string, no: string }
type TypeEngine = Car | Plane

// 元组
interface Car { brand: string}
interface Plane { brand: string, no: string }
type TypeEngine1 = [Car, Plane]

type Group = {groupName: string, memberNum: number}
type GroupInfoLog = {info: string, happen: string}
type GroupMember = Group & GroupInfoLog // type 交叉类型合并
let data:GroupMember = {
    groupName: 'xcr', memberNum: 12,
    info: 'test', happen: 'warn'
}

interface Error {
    name: string
}

interface Error {
    message: string,
    stack?: string
}
let error: Error = {
    name: 'NullPointException',
    message: '空指针'
}

export {}
