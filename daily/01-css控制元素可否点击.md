- 去掉上层元素的点击

  `pointer-events: none;`

- 给需要点击事件的元素添加可点击

  `pointer-events: auto;`

- 判断移动端设备

  ```js
  export const isMobile = () => {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  }
  
  ```

