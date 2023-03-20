// 可变元组标签
// 元组标签名字可以与解构变量名相同也可以不同
let [name, age, desc, ...rest]:[name_: string, age_: number, desc_: string,  ...rest_: any[]] = ['xcr', 18, '5000', 5000, 5000, 'test']
console.log(rest) // [ 5000, 5000 ]
export {}
