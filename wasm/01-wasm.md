### Wasm 

从高级语言编译器的角度来看，Wasm是目标代码。但从浏览器角度来看，Wasm更像IR，最终会被 AOT/JIT 编译器编译成平台相关的机器码。Wasm 最终采用了虚拟机 / 字节码 技术，并且定义了紧凑的二进制格式。

#### 规范

《核心规范》描述了 Wasm 模块的结构和语义，这些是平台无关的，任何 Wasm 实现都必须满足这些语义。

#### 模块

模块是 Wasm 程序编译、传输和加载的单位。Wasm规范定义了两种模块格式：二进制格式和文本格式。和传统汇编语言做类比，Wasm模块的二进制格式相当于目标文件或可执行文件格式，文本格式则相当于汇编语言。使用汇编器可以把文本格式编译为二进制格式，使用反汇编器可以把二进制格式反编译成文本格式。

##### 二进制格式

二进制格式是 Wasm 模块的主要编码格式，存储为文件时一般以.wasm为后缀。和 Java类文件一样，Wasm二进制格式设计的非常紧凑。

##### 文本格式

文本格式主要为了方便开发者理解Wasm模块，或者编写一些小型的测试代码。Wasm文本格式可以简写为 WAT，存储为文件时一般以.wat为后缀。

#### 指令集

和Java虚拟机一样，Wasm也使用了栈式虚拟机和字节码。

#### 验证

Wasm模块必须是安全可靠的，绝不允许有任何恶意行为。为了保证这一点，Wasm包含了大量类型信息，这样绝大多数问题就可以通过静态分析在代码执行前被发现，只有少数问题需要推迟到运行时进行检查。

#### 介绍

二进制格式主要是由高级语言编译器生成，但也可以通过文本格式编译。文本格式可以由开发者直接编写，也可以由二进制格式反编译生成。除了这两种格式，Wasm模块还有第三种格式：内存格式。Wasm实现通常会把二进制模块解码为内部形式(即内存格式，比如C/C++/Go结构体)，然后再进行后续处理。

从语义上讲，一个Wasm模块从二进制格式到最终被执行可分为3个阶段：解码、验证、执行。解码阶段将二进制模块解码为内存格式；验证阶段对模块进行静态分析，确保模块的结构满足规范要求，且函数的字节码没有不良行为(比如调用不存在的函数等)；执行阶段可以进一步分为实例化和函数调用两个阶段。

### 准备工作

- 安装go环境
  - 去官网下载最新版本安装，添加到环境变量
- 安装 Rust
  - 通过`https://www.rust-lang.org/zh-CN/tools/install`下载安装，运行根据指示
    - 安装 wasm32
    - ` rustup target add wasm32-unknown-unknown`
    - `cargo build --target wasm32-unknown-unknown --release`
- 安装 WABT
  - `https://github.com/WebAssembly/wabt/releases`下载最新的release版本即可
  - `wat2wasm .\ch05_cz.wat` 编译成 wasm
  - `wasm-objdump.exe -h .\ch05_cz.wasm` 打印头信息
  - `wasm-objdump.exe -x .\ch05_cz.wasm` 打印详细信息
  - `wasm-objdump.exe -d .\ch05_cz.wasm` 反编译字节码

### 你好 Wasm

```rust
#![no_std]
#![no_main]

#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}

extern "C" {
    fn print_char(c: u8);
}

#[no_mangle]
pub extern "C" fn main() {
    unsafe {
        let s = "Hello, World!\n";
        for c in s.as_bytes() {
            print_char(*c);
        }
    }
}

```

