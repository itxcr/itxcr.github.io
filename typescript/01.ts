// class Email {
//   private readonly email: string
//
//   constructor(email: string) {
//     if (this.validateEmail(email)) {
//       this.email = email
//     } else {
//       throw new Error('Invalid email')
//     }
//   }
//
//   private validateEmail(email: string) {
//     let re = /\S+@\S+\.\S+/
//     return re.test(email)
//   }
//
//   get():string {
//     return this.email
//   }
// }
// class Person {
//   public name: string
//   public surname: string
//   public email: Email
//   constructor(name: string, surname: string, email: Email) {
//     this.name = name
//     this.surname = surname
//     this.email = email
//   }
//   greet() {
//     console.log('Hello')
//   }
// }
//
// class Teacher extends Person {
//   public subjects: string[]
//   constructor(name: string, surname: string, email: Email, subjects: string[]) {
//     super(name, surname, email);
//     this.subjects = subjects
//   }
//
//   greet() {
//     super.greet()
//     console.log('开示教书' + this.subjects)
//   }
//   teach() {
//     console.log('教书')
//   }
// }
//
// class SchoolPrincipal extends Teacher {
//   manageTeachers() {
//     console.log('我们需要帮助学生变得更好')
//   }
// }
//
// let principal = new SchoolPrincipal('testP', 'P', new Email('p@p.com'), ['数学', '物理'])
// principal.greet()
// principal.teach()
// principal.manageTeachers()

class Animal {
  eat() {
    console.log('eat')
  }
}

class Mammal  {
  breathe() {
    console.log('breathe')
  }
}

class WingedAnimal {
  fly() {
    console.log('fly')
  }
}

class Bat implements Mammal, WingedAnimal  {
  breathe: () => string
  fly: () => string
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'constructor') {
        derivedCtor.prototype[name] = baseCtor.prototype[name]
      }
    })
  })
}

applyMixins(Bat, [Mammal, WingedAnimal])


let a = new Bat()
a.fly()
a.breathe()
