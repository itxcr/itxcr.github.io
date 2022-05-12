function isNumber(padding) {
    return typeof padding === 'number';
}
function isString(padding) {
    return typeof padding === "string";
}
function padLeft(value, padding) {
    if (isNumber(padding)) {
        return Array(padding + 1).join('') + value;
    }
    if (isString(padding)) {
        return padding + value;
    }
    throw new Error('希望获取到 string 或 number' + '获取到的是' + padding);
}
console.log(padLeft('XCR', '123')); //123XCR
console.log(padLeft('XCR', 123)); // XCR

