Node.js 的项目的开发流程是这样的：

- npm init 初始化项目
- npm search 搜索依赖
- npm install 安装依赖
- npm update 升级依赖
- npm run build 执行构建
- npm run test 执行测试
- npm publish 发布到中央仓库

Rust 项目的开发流程也类似：

- cargo init 初始化项目 （或者 cargo new，这个相当于 mkdir + cargo init）
- cargo search 搜索依赖
- cargo install 安装依赖
- cargo update 升级依赖
- 手动把依赖填到 Cargo.toml 中
- cargo build 编译构建代码
- cargo run 运行代码
- cargo test 跑单元测试
- cargo publish 发布到中央仓库