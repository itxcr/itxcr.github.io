### 文本不定行数截断

#### 标题超出省略

超出2行省略，直接用**-webkit-line-clamp **实现

```css
.title{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
```

#### 内容自适应行数

```css
.section{
    display: flex;
    overflow: hidden;
    height: 72px;/*定一个高度*/
    flex-direction: column;
}
.excerpt{
   flex: 1; /*自适应剩余空间*/
   overflow: hidden;
}
```

这样借助`flex: 1;overflow: hidden;`就几乎实现了想要的效果，如下

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111111141391.gif)

1. 右下角环绕效果

   ```css
   .excerpt::before{
       content: '...';
       float: right;
   }
   ```

   首先，将省略号高度撑满，并居下对齐，可以用 **flex** 实现

   ```css
   .excerpt::before{
       content: '...';
       float: right;
      height: 100%;
       display: flex;
       align-items: flex-end;
   }
   ```

   shape-outside:inset() 表示以自身为边界，然后上、右、下、左四个方向分别向内缩进的距离。比如这里需要缩进到靠近省略号位置，所以

   ```css
   .excerpt::before{
       /*其他样式**/
      shape-outside: inset(calc(100% - 1.5em) 0 0);
   }
   ```

2. 自动隐藏省略号

   用一个足够大的色块盖住省略号，设置绝对定位后，色块是跟随内容文本的，所以在文字较多时，色块也跟随文本挤下去了，实现如下

   ```css
   .excerpt::after{
       content: '';
       position: absolute;
       width: 999vh;
       height: 999vh;
       background: #fff;
   } 
   ```

   个别极端情况可能会遮挡不住，比如

   ![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111111145240.webp)

   可以随便找个东西补上，比如 `box-shadow`，往左下角偏移一点就可以了

   ```css
   .excerpt::after{
       content: '';
       position: absolute;
       width: 999vh;
       height: 999vh;
       background: #fff;
      box-shadow: -2em 2em #fff; /*左下的阴影*/
   } 
   ```

   ![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111111145306.webp)

   设置和底色相同的颜色后，最终的效果如下![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111111146462.gif)

