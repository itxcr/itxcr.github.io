### 项目格式配置

#### Eslint

- 说明

  只有开发阶段需要，因此添加到开发阶段的依赖中

  ```shell
  yarn add eslint eslint-plugin-vue -D
  ```

- 配置

  - 创建 .eslintrc.js 文件

  - 添加基础配置

    ```js
    module.exports = {
      root: true,
      env: {
        browser: true, // browser global variables
        es2021: true, // adds all ECMAScript 2021 globals and automatically sets the ecmaVersion parser option to 12.
      },
      parserOptions: {
        ecmaVersion: 12,
      },
    }
    ```

- 引入规则

  -  为了规范团队成员代码格式，以及保持统一的代码风格，项目采用当前业界最火的 [Airbnb规范](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fairbnb%2Fjavascript) ，并引入代码风格管理工具 [Prettier](https://link.juejin.cn/?target=https%3A%2F%2Fprettier.io%2F) 

- eslint-plugin-vue

  - ESLint官方提供的Vue插件，可以检查 .vue文件中的语法错误

    ```shell
    yarn add eslint-plugin-vue -D
    ```

    ```js
    // .eslintrc.js
    ...
    extends: [
        'plugin:vue/vue3-recommended' // ++
    ]
    ...
    ```

- eslint-config-airbnb-base

  - Airbnb基础规则的eslint插件

    ```
    yarn add eslint-config-airbnb-base -D
    ```

    ```js
    // .eslintrc.js
    ...
    extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base', // ++
    ],
    ...
    ```

    这个时候就应该可以看到一些项目原有代码的eslint报错信息了，如果没有的话，可以尝试重启编辑器的eslint服务

- eslint-plugin-prettier

  - 本次项目不单独引入prettier，而是使用eslint插件将prettier作为eslint规则执行

  - 安装

    ```shell
    yarn add eslint-plugin-prettier prettier -D
    ```

    ```js
    // .eslintrc.js
    ...
    plugins: ['prettier'], // ++
    rules: {
        'prettier/prettier': 'error', // ++
    },
    ...
    ```

  - 配置到此时，大概率会遇到 eslint 规则和 prettier 规则冲突的情况，这时候就需要另一个eslint的插件 eslint-config-prettier，这个插件的作用是禁用所有与格式相关的eslint规则，也就是说把所有格式相关的校验都交给 prettier 处理

- eslint-plugin-import

  - 安装

    ```shell
    yarn add eslint-plugin-import -D
    ```

  - 该插件想要支持对ES2015+ (ES6+) import/export语法的校验, 并防止一些文件路径拼错或者是导入名称错误的情况

    ```json
    rules: {
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "import/no-absolute-path": "off",
      "import/no-extraneous-dependencies": "off"
    }
    ```

- eslint-config-prettier

  - 将会禁用掉所有那些非必须或者和[prettier](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fprettier%2Fprettier)冲突的规则。这让您可以使用您最喜欢的shareable配置，而不让它的风格选择在使用Prettier时碍事。请注意该配置**只是**将规则**off**掉,所以它只有在和别的配置一起使用的时候才有意义。

  - 安装

    ```shell
    yarn add eslint-config-prettier -D
    ```

    ```js
    // .eslintrc.js
    ...
    plugins: ['prettier'],
    extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
        'plugin:prettier/recommended', // ++
    ],
    rules: {
        'prettier/prettier': 'error',
    },
    ...
    ```

  - 注意

    plugin:prettier/recommended 的配置需要注意的是，一定要放在最后。因为extends中后引入的规则会覆盖前面的规则。

- 创建  .prettierrc.js 文件自定义 prettier 规则，保存规则后，重启编辑器的eslint服务以更新编辑器读取的配置文件

  ```json
  // .prettierrc.json
  {
    "semi": false,
    "eslintIntegration": true,
    "singleQuote": false,
    "endOfLine": "lf",
    "tabWidth": 2,
    "trailingComma": "none",
    "bracketSpacing": true,
    "arrowParens": "avoid"
  }
  ```

#### 



### 项目安装 vuex4 + vue-router4

- 安装

  ```shell
  yarn add vuex@next vue-router@next -S
  ```

- 配置

  ```
  
  ```

  
