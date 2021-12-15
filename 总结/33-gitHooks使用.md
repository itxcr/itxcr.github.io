```bash
# 项目初始化
yarn init -y
# 初始化git
git init
# 安装 eslint
yarn add eslint husky -D
```

```js
// .eslintrc
{
  "rules": {
    // 要求使用分号
    "semi": ["error", "always"],
    // 强制使用一致的反勾号、双引号或单引号
    "quotes": ["error", "double"]
  }
}

```

## Husky

### 使用

编辑`package.json`在`script`里添加`prepare`的值为`husky install`

```json
"scripts": {
  "prepare": "husky install",
  "lint": "eslint src"
},
```

然后执行`yarn prepare`，它做了什么事呢

执行 husky install 实际上就是创建 `.husky` 目录，复制`../husky.sh`文件到该目录下，配置了一个`.gitignore`,设置了`core.hooksPath`（设置 .husky 目录为 git hooks 目录）

### 添加一个 hook

在`.husky`目录下创建`pre-commit`

```sh
#!/bin/sh

echo '正在检查代码，请稍等...'
# git diff 获取更改的内容 可以通过参数--diff-filter 配置条件
yarn lint $(git diff --cached --name-only --diff-filter=ACM -- '*.js')
# 变量$?--->上一个命令的执行状态结果
if [ $? != '0' ];then
  echo "检查到错误，请修正代码"
  exit 1
else
  echo "检查通过"
fi
```

> 遗留问题就是 git hooks 不会编写怎么办，下面 lint-staged 出来了

## lint-staged

配置例子作用：对 Git 暂存区代码文件进行 bash 命令操作等等

```bash
yarn add lint-staged -D
```

根目录下新建`.lintstagedrc`文件

```
{
 "src/**/*.js": ["eslint --fix", "git add"]
}
```

把`husky`目录下的`pre-commit`修改如下

```sh
#!/bin/sh

. "$(dirname "$0")/_/husky.sh"
yarn lint
```

```json
"scripts": {
    "lint": "lint-staged"
 },
```

执行`git add .`，`git commit -m 'test'`，可以发现调用了 eslint 去检查代码，检查不通过就退出`commit`

代码检测规范有了，现在也需要规范一下提交规范

## commitlint

github

**校验 commit 提交的信息**

```bash
yarn add @commitlint/config-conventional @commitlint/cli -D
```

使用新建`commitlint.config.js`

```js
module.exports = {
 extends: ['@commitlint/config-conventional'],
 rules: {
  'type-enum': [2, 'always', ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test', 'revert', 'chore']],
  'type-case': [0],
  'type-empty': [0],
  'scope-empty': [0],
  'scope-case': [0],
  'subject-full-stop': [0, 'never'],
  'subject-case': [0, 'never'],
  'header-max-length': [0, 'always', 72]
 }
}
```

配置`git hooks`，执行下面命令

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

commit message 一般分为三个部分 Header，Body 和 Footer

```
header
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
其中，Header 是必需的，Body 和 Footer 可以省略
```

接下来提交的 commit 必须符合下面的格式

> 注意冒号后面有空格

```bash
git commit -m <type>[optional scope]: <description>
```

常用的 type 类别

- build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交
- docs：文档更新
- feat：新增功能
- fix：bug 修复
- perf：性能优化
- refactor：重构代码(既没有新增功能，也没有修复 bug)
- style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
- test：新增测试用例或是更新现有测试
- revert：回滚某个更早之前的提交
- chore：不属于以上类型的其他类型(日常事务)

optional scope：一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。

description：一句话描述此次提交的主要内容，做到言简意赅。

这时候，执行一次测试一下

```bash
git add .
git commit -m 'test'
```

## commitizen

cz-commitlint

**生成符合规范的 commit message**

本地安装并没有全局安装，当然可以全局安装具体查看官方文档，全局安装可以使用`git cz`，`cz-commitlint`打通 `commitizen` 和`commitlint`配置

```bash
yarn add @commitlint/cz-commitlint commitizen -D
```

然后

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

```json
{
 "scripts": {
  "commit": "git-cz"
 },
 "config": {
  "commitizen": {
   "path": "@commitlint/cz-commitlint"
  }
 }
}
```

新建`commitlint.config.js`

```js
module.exports = {
 extends: ['@commitlint/config-conventional']
}
```

然后执行

```bash
git add .
```

```bash
npm run commit
```

再次修改`commitlint.config.js`

```js
module.exports = {
 extends: ['@commitlint/config-conventional'],
 prompt: {
  questions: {
   type: {
    description: '选择你要提交的类型:',
    enum: {
     feat: {
      description: '新功能',
      title: 'Features',
      emoji: '✨'
     },
     fix: {
      description: '修复相关bug',
      title: 'Bug Fixes',
      emoji: '🐛'
     },
     docs: {
      description: '文档更改',
      title: 'Documentation',
      emoji: '📚'
     }
    }
   }
  }
 }
}
```

然后执行

```bash
git add .
```

```bash
npm run commit
```

接下来提交信息 执行`npm run commit`，就可以按照规范提交了；如果没有使用`commitlint`，在 `commitizen`中使用 `cz-customizable`也可以自定义很多配置的

|   **Git Hook**   |   **调用时机**    |            **调用时机**            |
| :--------------: | :---------------: | :--------------------------------: |
|    pre-commit    | git commit 执行前 | 可以用 git commit --no-verify 绕过 |
|    commit-msg    | git commit 执行前 | 可以用 git commit --no-verify 绕过 |
| pre-merge-commit | git merge 执行前  | 可以用 git merge --no-verify 绕过  |
|     pre-push     |  git push 执行前  |                                    |

## 总结

`yarn add @commitlint/cli @commitlint/config-conventional @commitlint/cz-commitlint commitizen cz-conventional-changelog eslint husky lint-staged -D`

```json
"scripts": {
    "commit": "git-cz",
    "lint": "lint-staged"
},
```

### 1. 创建项目文件夹husky

### 2. 初始化git仓库

`git init`

### 3. 初始化项目

`yarn init -y`

### 4. 配置 husky

1. `yarn add husky -D`

2. 为了保证其他人下载项目代码以后，自动启用`hook`,要在`package.json` 的`scripts`中设置脚本

   ```json
   "scripts": {
       "prepare": "husky install"
     }
   ```

3. 执行 `yarn prepare`，执行完命令后，根目录会出现一个`.husky`的目录

### 5. 配置 `commitlint`

1. 安装

   ```bash
   yarn add @commitlint/cli @commitlint/config-conventional -D
   ```

2. 创建配置文件

   ```bash
   echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
   ```

3. 增加`commit-msg`钩子

   `yarn husky add .husky/commit-msg 'yarn commitlint --edit "$1"'`

   执行完上述命令以后，`.husky`下面会有`commit-msg`的文件

**注意**：所有`*.sh`文件的第一行必须是`#!/bin/sh`,否则会出现报错：`error: cannot spawn git: No such file or directory`

### 6. 配置`lint-staged`

1. 安装

   `yarn add lint-staged -D`

2. 根目录创建 `.lintstagedrc` 配置文件

   ```json
   {
     "./src/**/*.{js,jsx,ts,tsx,vue,less,sass,scss,css.json}": ["prettier --write"],
   }
   ```

### 7.  配置`prettier`

1. 安装

   ```bash
   yarn add prettier -D
   ```

2. 根目录创建`.prettierrc.js`文件

   ```js
   // 详见https://prettier.io/docs/en/options.html
   module.exports = {
     printWidth: 80, // 每行的长度
     tabWidth: 2, // 缩进的空格数
     useTabs: false, // 用tabs而不是空格缩进
     semi: true, // 每个语句末尾是否加分号，false只有在编译报错时才加
     singleQuote: false, // 使用单引号代替双引号，jsx引号规则将会忽略此配置。
     quoteProps: "as-needed", //
     jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
     trailingComma: "es5", // 是否有末尾的逗号，例如数组或对象的最后一项。/es5/none/all
     bracketSpacing: false, // 在对象字面量{}的语法中打印空格
     jsxBracketSameLine: false, // 开始标签的>是否和之前内容在同一行
     arrowParens: "always", // 箭头函数的参数是否加括号 /always/avoid
     rangeStart: 0, // 需要格式化的开始位置
     rangeEnd: Infinity, // 需要格式化的结束位置
   };
   ```

### 8. 配置`precommit`钩子

1. 执行下面命令，会在`.husky`目录下面有个文件`pre-commit`

   ```bash
   yarn husky add .husky/pre-commit 'yarn lint-staged --allow-empty "$1" && yarn lint'
   ```

   项目如果使用`vue-cli`创建的，`package.json`的`scripts`中会有`lint: vue-cli-service lint`。如果想执行其他lint插件，可以将上面的`yarn lint`修改。

### 9. 额外补充

1. 如果不想加入 配置`husky` 中的第3步，可以删除`.husky`下的`.gitignore`文件。

2. 如果不想安装`lint-staged`，可以将文件`pre-commit`里的命令改为:

   ```bash
   yran prettier "./src/**/*.{js,jsx,ts,tsx,vue,less,sass,scss,css.json}" --write && yarn lint
   ```









### 1. Husky

自动规范化项目，最核心的一个工具便是husky，简单来说，husky提供了几个钩子，可以拦截到git的比如commit、push等等操作，然后在操作前，执行某些脚本，预处理被操作的对象。

1. 安装

   ```
     npm install husky --save-dev
   ```

2. 配置

   在最新版中，hasky的配置不需要写在npm script中了，直接在package.json中添加一下字段即可。

   ```json
         {
         "husky": {
             "hooks": {
             "pre-commit": "npm run test",
             "pre-push": "npm run test",
             "...": "..."
             }
         }
         }
   ```

### ESlint

```
yarn add eslint -D
```

### Lint-staged

Lint-staged是自动规范化项目第二重要的工具，主要功能为依次运行传入的命令数组，但是，约束命令的作用范围只会影响到git staged范围内的文件，即用git add 添加到待commit队列的文件，从而避免影响到其他文件，同时也能加快预处理脚本的速度。

1. 安装

   ```
    npm install --save-dev lint-staged
   ```

2. 配置

   直接在package.json文件中直接添加lint-staged的命令列表

   ```
         "lint-staged": {
         "*.js": ["eslint --fix", "git add"]
         }
   ```

   然后，将lint-staged与husky整合:

   ```
         "husky": {
         "hooks": {  
             "pre-commit": "lint-staged"
         }
         }
   ```

   这样，便做到了每次commit的时候自动eslint将要上传的文件，然后才commit，其他没有被add的文件不会被eslint处理

### Prettier

有了以上条件后，我们便可以来添加我们的第一个预处理脚本Prettier。prettier是最出名的代码格式化工具之一。由于我们每个人的编程习惯不一样，有的人喜欢分号，有些人不喜欢分号，有些人四个空格缩进，有些人八个空格缩进。如果强制每个人编码习惯一样，总是让人比较难受，所以这里可以约定一个统一个代码风格配置文件，在提交的时候自动处理代码，将它们格式化为统一的风格，这样每个人写代码的时候可以按着自己的习惯写，最后提交的代码又是风格一致的，两全其美。

1. 安装

   ```
    yarn add prettier -D
   ```

2. [配置](https://prettier.io/docs/en/configuration.html)

3. 整合到lint-staged

   ```
     "*.js": [
         "prettier --config ./.prettierrc --write",
         "git add"
       ]
   ```

### Commit-message 规范

要从commit message中提取到有用的数据用来生成CHANGELOG，那么commit message就必须有一个相对固定的格式，同时这个格式能够基本覆盖到所有的comm操作类型。

目前比较流行的格式为[Angular Git Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

大致的格式如下:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- `<type>`:本次commit的类型，比如新特性feat，bug修复fix等等
- `<scope>:`本次操作波及的范围，可自定义
- `<BLANK LINE>`:空行
- `<body>`:可选，描述本次commit的动机等等，如需换行，在行尾添加"|"
- `<footer>`:可选，描述如解决了某个issue，或者这次为breaking change，对应的upgrade的方法等等

### Commitizen

由上可见，一个规范的commit message其实十分的麻烦，对于一个连注释都不写的公司来说，要求同事都这样规范的写commit message显然是不可能的。所以，我们需要工具，能够自动生成这样格式的commit message，所以有了工具commitizen。

1. 安装

   ```
    yarn global add commitizen -D
   ```

   安装完成后，系统便会多出git cz命令，git cz能够完全的代替git commit命令，拥有其所有的参数，使用方法完全一样，同时也可以被husky所拦截到

   commitizen采用了询问的方式来获取对应的commit信息

### cz-conventional-changelog

有了格式化的commit message后，我们便可以用来自动生成changelog了，好在Commitizen有着配套的工具。

```bash
commitizen init cz-conventional-changelog --save-dev --save-exact
```

使用commitizen初始化cz-conventional-changelog，他会作为一个adapter来解析对应的内容。由于commit message的规范其实有很多种，angular的规范只是很常用的规范之一，所以对于不同的规范需要不同的adapter才能解析出对应的数据，不过因为和commitizen整合，所以不需要考虑格式和adapter不匹配的问题，毕竟格式是有commitizen自动生成的。

### Commitlint

虽然有了自动生成工具，但是肯定还是有偷懒的小伙伴懒得去写，直接随便写个message就上传，这样的话就会破坏掉原有的格式（强迫症也会表示很难受啊喂），所以我们需要一个lint工具来替我们检测对应的commit message是不是一个合法的commit message。当然，这个工具也应该自动调用，在上传的时候自动检测。

1. 安装

   ```
   npm install --save-dev @commitlint/config-conventional @commitlint/cli
   ```

   安装conventional格式的lint以及对应的cli（commitlint也有其他格式的adapter，若使用的是其他规范，请参考[官网](https://github.com/marionebl/commitlint)）

2. 配置

   ```
    echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
   ```

3. 与husky整合

   ```
     {
       "husky": {
         "hooks": {
           "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
         }  
       }
     }
   ```

   这样便可以做到在commit的时候自动检测commit message是否合法了

### standard-version

有了对应的adapter，就可以提取commit-message的信息，从而生成changelog。我们可以使用Conventional Changelog来生成changelog，不过Conventional Changelog是生成changelog的基本库，它们更推荐使用基于它们来实现的库standard-version来进行CHANGELOG的生成：

1. 安装

   ```
     npm i --save-dev standard-version
   ```

2. 在package中使用npm script整合standard-version

   ```
     {
       "scripts": {
         "release": "standard-version"
       }
     }
   ```

   这样，我们每次到了需要发布一个新版本的时候，使用npm run release就可以生成上一个版本到现在的CHANGELOG，同时standard-version本身也可以用作项目的版本管理工具。

### JSDOC







### 安装`eslint`和`prettier`及相关工具：

```
npm install --save-dev eslint prettier
npm install --save-dev eslint-plugin-prettier eslint-config-prettier
npm install --save-dev @typescript-eslint/parser  @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-import
npm install --save-dev eslint-import-resolver-typescript
```

其中除了`eslint`和`prettier`外的其他几个工具作用分别是：

- `eslint-plugin-prettier`：将 prettier 的能力集成到 eslint 中, 按照 prettier 的规则检查代码规范性，并进行修复
- `eslint-config-prettier`：让所有可能会与 prettier 规则存在冲突的 eslint rule 失效，并使用 prettier 的规则进行代码检查
- `@typescript-eslint/parser`： 解析器，使 eslint 可以解析 ts 语法
- `@typescript-eslint/eslint-plugin`：指定了 ts 代码规范的 plugin
- `eslint-plugin-import`：对 ES6+ 的导入/导出语法进行 lint, 并防止文件路径和导入名称拼写错误的问题
- `eslint-import-resolver-typescript`：这个插件为`eslint-plugin-import`添加了 ts 支持，详见[此处](https://www.npmjs.com/package/eslint-import-resolver-typescript)

### 配置

-  `.eslintrc.js`（或者`.eslingtrc`，`.eslintrc.json`）：

  ```js
  module.exports = {
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    parser: '@typescript-eslint/parser', // 解析器
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'], // 使用 eslint 和 typescript-eslint 建议的规则
    plugins: ['@typescript-eslint', 'prettier', 'import'], // 代码规范插件
    rules: {
      'prettier/prettier': 'error', // 不符合 prettier 规则的代码，要进行错误提示
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },
  };
  ```

- 配置`.prettierrc.js`（或者`.prettierrc`，`.prettierrc.json`），常用规则如下：

  ```js
  module.exports = {
    trailingComma: 'es5',
    singleQuote: true,
    semi: true,
    tabWidth: 2,
    printWidth: 80,
  };
  ```

  如果需要还可以加上相应的`.eslintignore`和`.prettierignore`来忽略想要的目录/文件

- 向`package.json`的`scripts`中添加命令：

  ```json
  {
    "scripts": {
      "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
      "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx ./ --fix"
    }
  }
  ```

  

### 安装 husky

1. `yarn add husky -D`

2. 在`packgae.json`中添加prepare脚本

   ```json
   {
     "scripts": {
       "prepare": "husky install"
     }
   }
   ```

   prepare脚本会在`npm install`（不带参数）之后自动执行。也就是说当我们执行`npm install`安装完项目依赖后会执行 `husky install`命令，该命令会创建`.husky/`目录并指定该目录为`git hooks`所在的目录

3. 添加`git hooks`，运行以下命令创建`git hooks`

   `yarn husky add .husky/pre-commit "npm run lint"`

   运行完该命令后我们会看到`.husky/`目录下新增了一个名为`pre-commit`的`shell`脚本。也就是说在执行`git commit`命令或者通过`git-cz`工具提交时，会先执行`pre-commit`这个脚本。`pre-commit`脚本内容如下：

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   npm run lint
   ```

   可以看到该脚本的功能就是执行`npm run lint`这个命令

4. 注意

   在项目中我们会使用`commit-msg`这个`git hook`来校验我们`commit`时添加的备注信息是否符合规范。在以前的我们通常是这样配置：

   ```json
   {
     "husky": {
       "hooks": {
         "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS" // 校验commit时添加的备注信息是否符合我们要求的规范
       }
     }
   }
   ```

   在新版husky中`$HUSKY_GIT_PARAMS`这个变量不再使用了，取而代之的是`$1`。在新版`husky中`我们的`commit-msg`脚本内容如下：

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   #--no-install 参数表示强制npx使用项目中node_modules目录中的commitlint包
   npx --no-install commitlint --edit $1
   ```

   - 添加`git hooks`

     `yarn husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"' `

### 安装 `lint-staged`

1. `npm install --save-dev lint-staged`

2.  在`package.json`中配置`lint-staged`：

   在`package.json`中添加如下配置，配置表明在运行`lint-staged`的时候将只匹配`src`和`test`目录下的`ts`和`tsx`文件，我们可以根据自己项目的需要修改配置：

   ```json
   {
     "lint-staged": {
       "src/**/*.{ts,tsx}": [
         "eslint"
       ],
       "test/**/*.{ts,tsx}": [
         "eslint"
       ]
     }
   }
   ```

   向`package.json`的`scripts`中添加命令：

   ```json
   {
     "scripts": {
       "lint-staged": "lint-staged"
     }
   }
   ```

3. 修改`.husky/pre-commit`脚本的内容：

   将`.husky/pre-commit`脚本的内容改为`npm run lint-staged`

   ```shell
   #!/bin/sh
   . "$(dirname "$0")/_/husky.sh"
   
   npm run lint-staged
   ```

   通过上面的步骤，就完成了`lint-staged`的配置，这个时候再进行 git 提交时，将只检查暂存区（`staged`）的文件，不会检查项目所有文件，加快了每次提交 lint 检查的速度，同时也不会被历史遗留问题影响。如下图：

   ![lint-staged](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112151658457.png)

### commitizen

在 Angular 提交信息规范中，一个好的提交信息的结构应该如下所示：

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

整个提交说明包括三部分：`header`页眉、`body`正文、`footer`页脚，在每个部分之间有一个空白行分隔，其中`header`部分是每次提交中必须包含的内容。

- `header`
  - `type`[类型](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)
  - `scope`本次提交的[影响范围](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#scope)
  - `subject`[主题](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#subject)，即对提交的一个简短描述
- `body`
  - 本地提交的详细描述，说明代码提交的详细说明
- `footer`
  - 主要包括本次提交的 BREAKING CHANGE（不兼容变更）和要关闭的 issue
- 更加详细的内容请参考[Angular提交信息规范](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)。

`commitzen`就是这样一个工具，它可以提供可以选择的提交信息类别，快速生成符合规范的提交说明

1. 先安装`commitizen`和`cz-conventional-changelog`：

   `npm install --save-dev commitizen cz-conventional-changelog`

   如果需要在项目中使用`commitizen`生成符合某个规范的提交说明，则需要使用对应的适配器，而`cz-conventional-changelog`就是符合AngularJS规范提交说明的`commitzen`适配器

2. 在`package.json`中配置

   在`package.json`中添加如下配置，配置指明了`cz`工具`commitizen`的适配器路径：

   ```json
   {
     "config": {
       "commitizen": {
         "path": "node_modules/cz-conventional-changelog"
       }
     }
   }
   ```

   向`package.json`的`scripts`中添加命令：

   ```json
   {
     "scripts": {
       "commit": "git-cz"
     }
   }
   ```

   这时我们就可以使用`npm run commit`来代替`git commit`进行提交了：

   ![commitizen](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112151708118.png)

3. 配置自定义提交信息规范

   如果想定制项目的提交信息规范，可以使用`cz-customizable`适配器：`npm install --save-dev cz-customizable`

   然后把`package.json`中配置的适配器路径修改为`cz-customizable`的路径：

   ```json
   {
     "config": {
       "commitizen": {
         "path": "node_modules/cz-customizable"
       }
     }
   }
   ```

   之后在根目录下新建一个`.cz-config.js`来配置自定义的规范，这里提供一个官方的示例[cz-config-EXAMPLE.js](https://github.com/leoforfree/cz-customizable/blob/master/cz-config-EXAMPLE.js)，修改里面字段、内容为自己想要的规范即可
