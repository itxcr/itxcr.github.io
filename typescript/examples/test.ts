interface Person {
    name: string
    age: number
}

type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}

type Partial<T> = {
    [P in keyof T]?: T[P]
}
type PersonPartial = Partial<Person>
type ReadonlyPerson = Readonly<Person>