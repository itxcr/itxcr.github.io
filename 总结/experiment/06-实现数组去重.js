function quchong(arr) {
    const newArr = []
    arr.reduce((pre, next) => {
        if(!pre[next]) {
            pre[next] = 1
            newArr.push(next)
        }
        return pre
    }, {})
    return newArr
}

function quchong2(arr) {
    return [...new Set(arr)]
}

console.log(quchong([1,1,1,2,3,4,5, 5, 5,6]));
console.log(quchong2([1,1,1,2,3,4,5,6, 6, 6]))