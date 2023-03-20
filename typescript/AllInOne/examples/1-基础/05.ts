// 可索引签名
interface Product {
    name: string,
    price: number,
    account: number
    // x 为固定写法 string number symbol
    // 类型要兼容上面已经声明的类型，默认用 any  如用其他如 number 需要兼容 string 等已经声明的
    [x:string]:any
}

let pro:Product = {
    name: 'phone',
    price: 12,
    account: 100,
    desc: '1',
    no: '011',
    [Symbol('no')]: 1000,
    1: 'ok',
    true: 'ok'
}

interface Phone extends Product {
    call() :void
}

const iPhone:Phone = {
    name: 'apple',
    price: 6666,
    account: 10000,
    call() {
        console.log('call')
    }
}

interface List {
    add():void
    remove():void
}

class ArrList implements List {
    add(): void {
    }

    remove(): void {
    }

}

class LindedList implements List {
    add(): void {
    }

    remove(): void {
    }

}
export {}