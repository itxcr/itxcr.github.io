class Person {
    public name: string;
    public surname: string;
    public age: number = 0;

    constructor(name: string, surname: string) {
        this.name = name
        this.surname = surname
    }

    greet() {
        let msg = `My name is ${this.name} ${this.surname}`
        msg += `I'm ${this.age}`
        return msg
    }
}

// public greet(city: string, country: string) {
//     let msg = `My name is ${this.name} ${this.surname}`
//     msg += `I'm from ${city}(${country})`
//     console.log(msg)
// }


let person = new Person('test', 'xcr')
var valueOfThis = {
    name: 'test',
    surname: 'test1'
};
const greet = person.greet.bind(valueOfThis)
greet.call(valueOfThis, '1', '2')
greet.apply(valueOfThis, [3, 4])

type ReturnType <T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any
let fun1 = (a: number) => ({a, b: 'hello'})
type Fun1ReturnType = ReturnType<typeof fun1>