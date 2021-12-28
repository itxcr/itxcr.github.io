### 项目创建

- `pnpm create vite`

  1. 创建项目名称
  2. 选择 `vue+ts`

- 进入项目文件夹

  - `pnpm i` 安装依赖

- 配置 `package.json`

  - 添加配置项

    ```json
      "type": "module",
    ```

### 依赖添加

- chalk

  - 修改控制台中字符串的样式

    - 字体样式(加粗、隐藏等)
    - 字体颜色
    - 背景颜色

  - 使用

    ```js
    const chalk = require('chalk');
    console.log(chalk.red.bold.bgWhite('Hello World'));
    ```

- eslint + prettier

  - js 检查工具和代码格式化工具
  
  ```shell
  pnpm add --save-dev --save-exact prettier
  ```
  
  ```shell
  pnpm install --save-dev eslint eslint-plugin-vue
  ```
  
  ```js
  // .eslintrc.js
  module.exports = {
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
    ],
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    }
  }
  ```
  
  ```shell
  pnpm install eslint-config-prettier --save-dev
  ```
  
  ```js
  //.eslintrc.js
  extends: [
    'eslint:recommended',
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  ```
  
  ```json
  "scripts":{
    //...
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore --fix src",
    "format": "prettier .  --write"
  }
  ```
  
  ```shell
  npm install vite-plugin-eslint --save-dev
  ```
  
  ```js
  // vite.config.ts
  import { defineConfig } from 'vite';
  import eslintPlugin from 'vite-plugin-eslint';
  
  export default defineConfig({
    plugins: [eslintPlugin()],
  });
  ```
  
- ts相关

  ```shell
  pnpm add @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
  ```

  - @typescript-eslint/parser: ESLint的核心代码
  - @typescript-eslint/eslint-plugin：这是一个ESLint插件，包含了各类定义好的检测Typescript代码的规范

- 创建 .editorconfig

  ```shell
  # EditorConfig is awesome: https://EditorConfig.org
  
  # top-most EditorConfig file
  root = true
  
  # Unix-style newlines with a newline ending every file
  [*]
  end_of_line = lf
  insert_final_newline = true
  charset = utf-8
  ```

- 创建 electron-builder.json

  ```json
  {
    "appId": "it_xcr@163.com",
    "asar": true,
    "directories": {
      "output": "release/${version}"
    },
    "files": [
      "!node_modules",
      "dist",
      "package.json"
    ],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": [
        "dmg"
      ]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    }
  }
  ```

  
