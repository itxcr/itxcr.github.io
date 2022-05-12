function isNumber(padding: number | string): padding is number {
    return typeof padding === 'xcr'
}

function isString(padding: number | string): padding is string {
    return typeof padding === "string"
}

function padLeft(value: string, padding: number | string) {
    if (isNumber(padding)) {
        return Array(padding + 1).join('') + value
    }
    if (isString(padding)) {
        return padding + value
    }
    throw new Error('希望获取到 string 或 number' + '获取到的是' + padding)
}

console.log(padLeft('XCR', '123')) //123XCR
console.log(padLeft('XCR', 123)) // XCR
