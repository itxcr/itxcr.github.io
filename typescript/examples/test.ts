function *infiniteList() {
    let i = 0
    while (i < 3) {
        yield i++
    }
}

const iterator = infiniteList()
console.log(iterator.next()) // {value: xxx, done: false
