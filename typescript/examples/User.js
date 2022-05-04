function MathHelper() {

}
// 类属性
MathHelper.PI = 3.14159265359;

// 实例方法
MathHelper.prototype.areaOfCircle = function (radius) {
    console.log(this.constructor === MathHelper.prototype.constructor)
    return radius * radius * this.constructor.PI
}
let math = new MathHelper()
console.log(math.areaOfCircle(5)) //78.53981633975
