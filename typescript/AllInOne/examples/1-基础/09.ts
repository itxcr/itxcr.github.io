function info(name: string, age: number):number {
    console.log(name, age)
    return 3
}
info('xcr', 18)

function info1(name: string, age: number) {
    console.log(name, age)
    return 3
}
info1('xcr', 18)

let info2 = function (name: string, age: number) {
    console.log(name, age)
    return 3
}
info2('xcr', 18)

let info3: (name: string, age: number) => number = function (name, age) {
    console.log(name, age)
    return 3
}
info3('xcr', 18)


type TypeInfoFunc = (name: string, age: number) => number
let info4:TypeInfoFunc = function (name, age) {
    console.log(name, age)
    return 3
}
info4('xcr', 18)

function info5(name: string, age: number, ...rest:any) {
    console.log(name, age, rest)
    return rest
}
info5('xcr', 18, [1, 2], 'aas', 24)

export{}
