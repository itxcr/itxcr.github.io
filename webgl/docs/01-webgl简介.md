## WebGL入门

- WebGL 如何获取`<canvas>`元素，如何在其上绘图
- HTML 文件如何引入 WebGL JavaScript 文件
- 简单的 WebGL 绘图函数
- WebGL 中的着色器程序

## Canvas 是什么

HTML5引入了 `canvas` 标签，允许 JavaScript 动态地绘制图形。`canvas` 提供了一些简单的绘图函数，用来绘制点、线、矩形、圆等等。

#### 使用 `canvas` 

1. 获取 `canvas` 元素
2. 向该元素请求二维图形的“绘图上下文
3. 在绘图上下文调用相应的绘图函数，以绘制二维图形

```js
function main() {
    // 获取canvas元素
    const canvas = document.getElementById('example')
    if (!canvas) return
    // 获取上下文
    const ctx = canvas.getContext('2d')
    // 设置填充色为蓝色
    ctx.fillStyle = `rgba(0, 0, 255, 1.0)`
    // 用这个颜色绘制矩形
    ctx.fillRect(120, 10, 150, 150)
}
```

##### 坐标系统

`canvas` 的坐标系统横轴为 x轴(正方向朝右)， 纵轴为 y轴(正方向朝下)。原点落在左上方，y轴正方向朝下。

使用 `ctx.fillRect()` 绘制矩形的时候，前两个参数指定了待绘制矩形的左上顶点在 `canvas` 中的坐标，后两参数指定了矩形的宽度和高度(以像素为单位)。

上面使用 `canvas` 绘制二维图形。
