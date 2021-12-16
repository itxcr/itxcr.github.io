1. 初始化

   ```shell
   # 下载，安装为开发时依赖
   
   npm install eslint --save-dev
   
   # 初始化
   
   npx eslint --init
   ```

   init 完毕之后，在项目的根目录会生成一个 eslint 的配置文件`.eslintrc.{js,yml,json}` 

   有一个叫 [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard)的插件，它是标准的`ESlint`规则， 我们在项目中继承这个标准就可以了

   ```shell
   npm install eslint-config-standard --save-dev
   npm install --save-dev eslint-config-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node
   ```

   ```json
   // .eslintrc.json
   {
     "extends": "standard"
   }
   ```

2. 配置

   ```json
   {
     "env": {
       "browser": true,
       "es2021": true
     },
     "parserOptions": {
       "ecmaVersion": 12,
       "sourceType": "module",
       "ecmaFeatures": {
         "jsx": true
       }
     },
     /* 引入插件，作用类似 require，这里简写了，实际引入的是 @typescript-eslint/eslint-plugin */
   
     "plugins": [
       "@typescript-eslint"
     ],
     "extends": [
       /*使用eslint推荐的规则作为基础配置，可以在rules中覆盖*/
   
       "eslint:recommended"
     ],
     "rules": {
       "quotes": [
         "error",
         "double"
       ],
       "prefer-const": "error",
       /* 使用@typescript-eslint/eslint-plugin插件中的规则 */
   
       "@typescript-eslint/consistent-type-definitions": [
         "error",
         "interface"
       ]
     },
     "globals": {
       "$": "readonly"
     }
   }
   ```

   1.  **环境和全局变量**

      当访问当前源文件内未定义的变量时，**[no-undef](https://cn.eslint.org/docs/rules/no-undef)** 规则将发出警告，可以通过定义全局变量来解决。`env`提供了多个环境选择字段，一个环境定义了一组预定义的全局变量。`globals`可以自定义单个的全局变量。

   2. 规则

      `rules`字段定义需要符合的规则，官网提供了一系列的规则供选择 **[List of available rules](https://eslint.org/docs/rules/)**。上面所示的`quotes`和`prefer-const`都是官网提供的规则选项。

      规则的value设定可以通过string，直接设置错误等级，等级分为三类：`"off"` 、`"warn"`、`"error"`；也可以通过数组的方式设置，在数组方式的设置中，第一项是错误等级，剩余项为可选参数，官网提供的每条rule都有详细的说明文档 ，向我们展示了该条 rule 的使用方式，包括 `.eslintrc.{js,yml,json}` 中的配置和内联配置方式，还有使用建议。

   3. **解析器**

      `parserOptions`ESLint 允许指定想要支持的 JavaScript 语言选项，默认支持 ECMAScript 5 语法。可以覆盖该设置，以启用对 ECMAScript 其它版本和 JSX 的支持。值得注意的是，支持JSX的解析并不代表支持React的解析，React中特定的JSX语法是无法被ESLint解析的，需要额外使用第三方插件 `eslint-plugin-react` 来处理，插件使用在后面讨论。

      `parser` 字段指定一个不同的解析器，解析器的作用是将JS代码解析成 AST ，ESLint 将通过遍历该AST 来触发各个检查规则。由于 ESLint 默认的解析器**[ESPree](https://link.juejin.cn/?target=https://github.com/eslint/espree)**只支持已经形成标准的语法特性，对于处于实验阶段以及非标准的语法，如 TypeScript ，是无法正确解析的，这时就需要使用其他的解析器，生成和 ESTree 结构相兼容的 AST 。对于 TypeScript 就需要使用`"parser": "@typescript-eslint/parser`"。

      官方提供了与ESLint兼容的解析器参考官网**[Specifying Parser](https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser)**。

   4. 插件

      官方提供的规则毕竟有限，当我们想自定义规则的时候，就需要**自定义**一个 `ESLint` 的插件，然后将规则写到自定义的 `ESLint` 插件中，在配置文件中通过`plugins`字段引入 。

      还是以处理TS为例，光指定解析器 `@typescript-eslint/parser` 只是能把 ESLint 不能识别的语法特性转化为 ESLint 能识别的，但它本身不包括规则，还需要设置 `"plugins": ["@typescript-eslint/eslint-plugin"],` 插件，这个声明只是完成了插件的加载，还需要在`rules`中使用需要的规则，才能执行对应的代码检测规则。当然，`plugin`不仅限于引入新的规则，其他的配置也是一样可以通过plugin引入的。

      ```json
      {
        // ...
      
        "plugins": [
          "jquery",
          // eslint-plugin-jquery
      
          "@foo/foo",
          // @foo/eslint-plugin-foo
      
          "@bar"
          // @bar/eslint-plugin
        ],
        "rules": {
          "jquery/a-rule": "error",
          "@foo/foo/some-rule": "error",
          "@bar/another-rule": "error"
        },
        "env": {
          "jquery/jquery": true,
          "@foo/foo/env-foo": true,
          "@bar/env-bar": true
        }
      
        // ...
      }
      ```

      更多引入和使用方式参考官网 **[configuring-plugins](https://eslint.org/docs/user-guide/configuring/plugins#configuring-plugins)**。

      ESLint官方为了方便开发者开发插件，提供了使用Yeoman模板`generator-eslint`（Yeoman是一个脚手架工具，用于生成包含指定框架结构的工程化目录结构），生成的项目默认采用 Mocha 作为测试框架。

   5. 扩展

      手动配置的工作量很大，所以一般会使用`extends`扩展包来预设配置，`extends`可以去集成各样流行的最佳实践，成本低到令人感动。

      配置文件一旦被扩展，将继承另一份配置文件的所有属性，包括规则、插件、语言解析选项**[Extending Configuration Files](https://eslint.org/docs/user-guide/configuring/configuration-files#extending-configuration-files)**。

3. 原理

   1. 关于AST

      Lint 是基于静态代码进行的分析，对于 ESLint 来说，我们的输入的核心就是 rules 及其配置以及需要进行 Lint 分析的源码。需要进行 Lint 的源码则各不相同，如果说能抽象出 JS 源码的共性，再对源码进行分析就会容易很多，这个被抽象出来的代码结构就是 AST（Abstract Syntax Tree，抽象语法树）。

      AST 本身并不是一个新鲜的话题，它是Babel，Webpack 等前端工具实现的基石，可能在任何涉及到编译原理的地方都会用到它。关于AST的详细内容可以参看之前曹诚的文章**[前端也要懂编译:AST 从入门到上手指南](https://juejin.cn/post/6953963506693570573)** 。

      ESLint 默认使用 **[espree](https://github.com/eslint/espree)** 来解析我们的 JS 语句，来生成AST，可以通过**[AST explorer](https://astexplorer.net/)** 来查看一段代码被解析成AST之后的结构。

4. Prettier

   1. 在使用 ESLint 的时候，我们往往会配合 Prettier 使用。Prettier 是一个‘有态度’的代码格式化工具，专注于代码格式自动调整，ESLint 本身就可以解决代码格式方面的问题，为什么要两者配合使用？

      - ESLint 推出 --fix 参数前，ESLint 并没有**自动**格式化代码的功能，而 Prettier 可以自动格式化代码。
      - 虽然 ESLint 也可以校验代码格式，但 Prettier 更擅长。

   2. 二者搭配使用，ESLint 关注代码质量，Prettier 关注代码格式。但是二者在格式化上面的功能有所交叉，所以Prettier 和 ESLint 一起使用的时候会有冲突，这需要我们进行一些配置：

      1. 用 eslint-config-prettier 来关掉 (disable) 所有和 Prettier 冲突的 ESLint 的配置，方法就是在 .eslintrc 里面将 prettier 设为最后一个 extends，需要安装 `eslint-config-prettier`

         ```json
         // .eslintrc    
         {
           "extends": [
             "prettier"
           ]
           // prettier 一定要是最后一个，才能确保覆盖    
         }
         ```

      2. （可选）然后再安装 `eslint-plugin-prettier` 和 `prettier`，将 prettier 的 rules 以插件的形式加入到 ESLint 里面。

   3. 当我们使用 Prettier + ESLint 的时候，其实格式问题两个都有参与，disable ESLint 之后，其实格式的问题已经全部由 prettier 接手了。那我们为什么还要这个 plugin？其实是因为我们期望报错的来源依旧是 ESLint ，使用这个，相当于**把 Prettier 推荐的格式问题的配置以 ESLint rules 的方式写入**，这样相当于可以统一代码问题的来源。

      ```json
      // .eslintrc    
      {
        "plugins": [
          "prettier"
        ],
        "rules": {
          "prettier/prettier": "error"
        }
      }
      ```

      将上面两个步骤合在一起就是下面的配置，也是**[官方的推荐配置](https://github.com/prettier/eslint-plugin-prettier)**

      ```shell
      npm install --save-dev eslint-plugin-prettier
      npm install --save-dev prettier
      npm install --save-dev eslint-config-prettier
      ```

      ```json
      // .eslintrc
      {
        "extends": ["plugin:prettier/recommended"]
      }
      ```

5. husky

   现在我们已经能做到了在开发时检测出来错误并且方便及时修复问题，但这依赖于开发同学自觉，不通过eslint代码检测的代码依然能被提交到仓库中去。此时我们需要借助**[husky]( https://github.com/typicode/husky#readme)**来拦截 git 操作，在 git 操作之前再进行一次代码检测。

   ```shell
   npm install -D husky
   
   # husky 初始化，创建.husky/目录并指定该目录为git hooks所在的目录
   
   husky install 
   
   # .husky/目录下会新增pre-commit的shell脚本
   
   # 在进行 git commit 之前运行 npx eslint src/** 检查
   
   npx husky add .husky/pre-commit "npx eslint src/**"
   ```

   关于`husky install`官网推荐的是在packgae.json中添加prepare脚本，prepare脚本会在`npm install`（不带参数）之后自动执行。

   ```json
   {
     "scripts": {
       "prepare": "husky install"
     }
   }
   ```

   生成的 .husky/pre-commit 文件如下

   ```shell
   #!/bin/sh
   
   . "$(dirname "$0")/_/husky.sh"
   
   npx eslint src/** --fix
   ```

6. lint-staged

   对于单次提交而言，如果每次都检查 src 下的所有文件，可能不是必要的，特别是对于有历史包袱的老项目而言，可能无法一次性修复不符合规则的写法。所以我们需要使用**[lint-staged](https://github.com/okonet/lint-staged)**工具只针对当前修改的部分进行检测。

   ```json
   // package.json
   
   {
     "lint-staged": {
       "*.{js,ts,vue}": [
         "npx eslint --fix"
       ]
     }
   }
   ```

   🌰中配置表示的是，对当前改动的 .js 和 .ts文件在提交时进行检测和自动修复，自动修复完成后 lint-staged默认会把改动的文件再次 add 到暂存区，如果有无法修复的错误会报错提示。

   同时还需要改动一下之前的 husky 配置，修改 .husky/pre-commit，在 commit 之前运行`npx lint-staged`来校验提交到暂存区中的文件：

   ```shell
   #!/bin/sh
   
   . "$(dirname "$0")/_/husky.sh"
   
   npx lint-staged
   ```

   