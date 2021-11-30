- 在需要用到的位置创建文件夹

  - `mkdir webpack-test`

- 进入文件夹
  - `cd webpack-test`
  
- 初始化项目
  - `yarn init -y`
  
- 安装webpack相关的包
  - `yarn add webpack webpack-cli -D`
  
- 书写相关的webpack配置项就可以使用了
  - 非全局环境调用webpack需要
    - `npx webpack `
    -  `yarn webpack`
    -  想用哪个用哪个
    - 需要其他参数自行添加使用
  
- 创建项目根目录

  - `mkdir src`

- 编写webpack配置文件

  - `mkdir webpack.config.js`

  - ```js
    const path = require('path')
    
    function resolve(dir) {
        return path.join(__dirname, dir)
    }
    
    module.exports = {
        entry: resolve('src/main.js'),
        output: {
            path: resolve('./dist'),
            filename: "bundle.js"
        }
    }
    ```

    - 进入 `src` 创建文件 `main.js` 

      ```
      console.log('webpack 运行')
      ```

- 运行webpack

  - `yarn webpack` 或

  - `npx webpack`

