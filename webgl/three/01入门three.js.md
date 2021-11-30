### 基础

Three.js 用于渲染一个 3D 场景，里面会有很多物体，如立方体、圆柱、圆环、圆锥等各种几何体，比如点线面等基础物体。

用一个场景 Scene 来承载，所有的物体都会被添加到 Scene 里：

```js
const scene = new THREE.Scene()
scene.add(xxx)
scene.add(yyy)
```

物体之间可以做分组 Group，组内的物体可以统一管理，之后再添加到 Scene 里。

```js
const scene = new THREE.Scene()
const group = new THREE.Group()

group.add(xxx)
group.add(yyy)

scene.add(group)
```

这种场景、物体、分组的概念，在很多游戏引擎中也有类似的 api，大家都是这么管理的。

可以添加到 Scene 中的物体，除了几何体、点线面等，还有辅助工具，比如坐标系工具。其实这些工具也是用集合体、点线面封装出来的，只不过是作为工具来临时添加到 Scene 中。

```js
const axisHelper = new THREE.AxisHelper(max)
scene.add(axisHelper)
```

有了场景和场景中的各种物体，怎么渲染出来呢？

调用 Renderer，这个类是专门负责渲染 Scene 中各种物体的。

但是还有个问题，三维的世界怎么渲染到二维的屏幕呢？

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111221952549.webp)![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111221952881.webp)

如图，从一个点找个角度来看三维世界，或者从一个平面来平行的看三维世界，看到的就是二维的。

这两种方式，第一种叫做透视、第二种叫做正交。

生成二维图像，就像照相机的功能一样，所以这种概念叫做 Camera。

在 `Three.js` 里面有 `PerspectiveCamera（透视相机）` 和 `OrthographicCamera（正交相机）` ，分别对应上面两种三维转二维的方式。

这两个 Camera 的参数还是挺多的，但是理解了也很简单。

```js
new Three.PerspectiveCamera( fov, aspect, near, far )
```

```js
new Three.OrthographicCamera( left, right, top, bottom, near, far )
```

先看透视相机的，它要看三维世界，那就要有一个最近和最远两个位置，然后从一个点看过去会有一个视野的角度，看到的画面还有个宽高比。

这就是为什么 `PerspectCamera ` 有 ` near`、`far`、`fov`、`aspect` 这四个参数。![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111222000055.webp)

正交相机的参数也是差不多的意思，不过因为不是从一个点看的，而是从一个面做的投影，那么就没有角度的参数，而是有上下左右的四个面位置的参数。

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111222002345.webp)

正交相机的上下左右位置也不是随便的，比例要和画面的宽高比一样，所以一般都是这么算：

```js
const width = window.innerWidth;
const height = window.innerHeight;
//窗口宽高比
const k = width / height;
//三维场景的显示的上下范围
const s = 200;

// 上下范围 s 再乘以宽高比 k 就是左右的范围，而远近随便设置一个数就行
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
```

上面的正交相机的参数里面，远近可以设置为 1 和 1000，上下设置为 200，左右就可以根据宽高比算出来。这就是相机所看到的二维画面的范围。

有了场景 Scene 中的各种物体，有了照相机 Camera，就可以用渲染器 Renderer 渲染出画面来了。

```js
const renderer = new THREE.WebGLRenderer();
//设置渲染区域尺寸
renderer.setSize(width, height)

renderer.render(scene, camera)
```

不过，一般不会只渲染一帧，有动画效果的话，会使用 `requestAnimationFrame` 的` api` 一帧帧的不停渲染。

```js
function render() {
    renderer.render(scene, camera)

    requestAnimationFrame(render)
}
render();
```

这就是 **Three.js 的大概流程：Scene 中有几何体Geometry、点线面、辅助工具等各种物体，物体还可以做分组，然后通过正交或者透视相机来设置看到的二维画面，之后用 Renderer 渲染出来。有动画效果的话，要用 requestAnimationFrame 来一帧帧的渲染。**

### 花瓣雨

首先要创建场景 Scene 中的物体，也就是各种花瓣，这个需要显示的是一个平面，可以用 Sprite。

Sprite 是精灵的意思，在 Three.js 中，它就是一个永远面向相机的二维平面。

给 Sprite 贴上花瓣的纹理就可以了。

准备花瓣的贴图：

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111231621706.webp)![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111231621425.webp)



花瓣的数量有很多，生成 400 个，加到花瓣分组里，然后添加到场景中：

```js
const scene = new THREE.Scene();
/**
 * 花瓣分组
 */
const petal = new THREE.Group();

function create() {
    var texture1 = new THREE.TextureLoader().load("img/h1.png");
    var texture2 = new THREE.TextureLoader().load("img/h2.png");
    var texture3 = new THREE.TextureLoader().load("img/h3.png");
    var texture4 = new THREE.TextureLoader().load("img/h4.png");
    var texture5 = new THREE.TextureLoader().load("img/h5.png");
    var imageList = [texture1, texture2, texture3, texture4, texture5];

    for (let i = 0; i < 400; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: imageList[Math.floor(Math.random() * imageList.length)],//设置精灵纹理贴图
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        petal.add(sprite);

        sprite.scale.set(40, 50, 1); 
        sprite.position.set(2000 * (Math.random() - 0.5), 2000 * Math.random(), 0)
    }
    scene.add(petal)
}

create();
```

400 个 Sprite 随机贴上了不同的花瓣的纹理贴图，然后设置了下放缩，之后随机设置了一个在场景中的位置。

我们在 Scene 中加入坐标系辅助工具来看下坐标：

```js
const axisHelper = new THREE.AxisHelper(1000);
scene.add(axisHelper)
```

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111231624801.webp)

红色是 x 轴，向右是递增的，绿色是 y 轴，向上是递增的。z 轴我们暂时用不到。

所以，根据代码，花瓣的 x 的范围就是随机的 -1000 到 1000，y 的范围就是 0 到 2000。

然后，我们创建正交相机：

```js
const width = window.innerWidth;
const height = window.innerHeight;
//窗口宽高比
const k = width / height;
//三维场景的显示的上下范围
const s = 200;
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
```

设置下相机的位置和方向：

```js
camera.position.set(0, 200, 500)
camera.lookAt(scene.position)
```

我们创建相机的时候指定了二维能显示的范围，相机在这个范围内的哪个位置都行。

然后创建渲染器，设置下大小和背景颜色，把渲染到的 canvas 元素插入到 dom 中。

```js
const renderer = new THREE.WebGLRenderer();
//设置渲染区域尺寸
renderer.setSize(width, height)
//设置背景颜色
renderer.setClearColor(0xFFFFFF, 1)
//body元素中插入canvas对象
document.body.appendChild(renderer.domElement)
```

之后就用 requestAnimation 不断地一帧帧渲染就行了。

```js
function render() {
    petal.children.forEach(sprite => {
        sprite.position.y -= 1;
        sprite.position.x += 0.5;
        if (sprite.position.y < -400) {
            sprite.position.y = 800;
        }
        if (sprite.position.x > 1000) {
            sprite.position.x = -1000
        }
    });

    renderer.render(scene, camera)

    requestAnimationFrame(render)
}
```

每次重新渲染之前，我们修改下花瓣的位置，产生下落效果，如果超出了范围，就移到上面去重新开始落![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111231625109.webp)，这样就是不间断的花瓣雨效果。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>花瓣雨</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
<script>

  const scene = new THREE.Scene();
  /**
   * 花瓣分组
   */
  const petal = new THREE.Group();

  const width = window.innerWidth;
  const height = window.innerHeight;
  //窗口宽高比
  const k = width / height;
  //三维场景的显示的上下范围
  const s = 200;
  const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

  const renderer = new THREE.WebGLRenderer();

  function create() {
    //设置相机位置
    camera.position.set(0, 200, 500)
    camera.lookAt(scene.position)

    //设置渲染区域尺寸
    renderer.setSize(width, height)
    //设置背景颜色
    renderer.setClearColor(0xFFFFFF, 1)
    //body元素中插入canvas对象
    document.body.appendChild(renderer.domElement)

    // const axisHelper = new THREE.AxisHelper(1000);
    // scene.add(axisHelper)

    var textureTree1 = new THREE.TextureLoader().load("img/h1.png");
    var textureTree2 = new THREE.TextureLoader().load("img/h2.png");
    var textureTree3 = new THREE.TextureLoader().load("img/h3.png");
    var textureTree4 = new THREE.TextureLoader().load("img/h4.png");
    var textureTree5 = new THREE.TextureLoader().load("img/h5.png");
    var imageList = [textureTree1, textureTree2, textureTree3, textureTree4, textureTree5];

    for (let i = 0; i < 100; i++) {
      var spriteMaterial = new THREE.SpriteMaterial({
        map: imageList[Math.floor(Math.random() * imageList.length)],//设置精灵纹理贴图
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      petal.add(sprite);

      sprite.scale.set(40, 50, 1);
      sprite.position.set(2000 * (Math.random() - 0.5), 2000 * Math.random(), 0)
    }
    scene.add(petal)
  }


  function render() {
    petal.children.forEach(sprite => {
      sprite.position.y -= 1;
      sprite.position.x += 0.5;
      if (sprite.position.y < -400) {
        sprite.position.y = 800;
      }
      if (sprite.position.x > 1000) {
        sprite.position.x = -1000
      }
    });

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  create()
  render()
</script>
</body>
</html>
```

### 总结

Three.js 是为了简化 3D 渲染的框架，它提供了场景 Scene 的 api，里面可以包含各种可渲染的物体：立方体、圆锥等各种几何体 Geometry、点线面、坐标系等辅助工具。这些物体还可以通过 Group 分组来统一管理。

Sence 要渲染出来需要指定一个相机，分为从点去看的透视相机 PerspectiveCamera，从平面去投影的正交相机 OrthographicCamera。理解了它们的原理才能理解 Camera 的参数。

之后通过 Renderer 渲染出来，如果有动画需要用 requestAnimationFrame 来一帧帧的渲染。

这是 Three.js 的大概渲染流程。
