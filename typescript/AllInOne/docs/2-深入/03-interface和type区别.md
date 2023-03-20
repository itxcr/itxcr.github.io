### interface 和 type 区别

type 和接口类似，都用来定义类型，但 type 和 interface 区别如下

#### 区别1： 定义类型范围不通

- interface 只能定义对象类型或接口当名字的函数类型
- type 可以定义任何类型，包括基础类型、联合类型、交叉类型、元组

```ts
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
```

#### 区别2：接口可以 extends 一个或多个接口 或 类实现一个或多个接口，也可以继承 type，但 type 没有继承功能，但一般接口继承 类 和 type 的应用场景很少见

#### 区别3：用 type 交叉类型 & 可以让类型中的成员合并成一个新的 type 类型，但接口不能交叉合并

```ts
type Group = {groupName: string, memberNum: number}
type GroupInfoLog = {info: string, happen: string}
type GroupMember = Group & GroupInfoLog // type 交叉类型合并
let data:GroupMember = {
    groupName: 'xcr', memberNum: 12,
    info: 'test', happen: 'warn'
}
```

#### 区别4： 接口可以合并声明

- 定义两个相同名称的接口会合并声明，定义两个同名的 type 会出现编译错误

```ts
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
```

