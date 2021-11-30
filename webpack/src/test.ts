interface Test {
    name: string,
    age: number
}


function A():Test {
    return {
        name: '123',
        age: 2
    }
}

console.log(A())