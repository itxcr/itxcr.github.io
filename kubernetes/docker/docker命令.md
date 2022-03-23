### Docker 引擎

- 组成

  - Docker客户端 （Docker Client）

  - Docker 守护进程 （Docker daemon）

  - containerd
    - 小写 c


  - runc
    - 小写 r

  - 它们共同负责容器的创建和运行


![image-20220322110047951](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202203221100008.png)

- 详解

  - Docker 引擎由两个核心组件构成

    - LXC

      - 命名空间（Namespace）
      - 控制组（CGroup）
      - 它们是基于 Linux 内核的容器虚拟化技术

    - Docker daemon

      - 单一的二进制文件
        - Docker 客户端
        - Docker API
        - 容器运行时
        - 镜像构建

    - 先前 Docker 架构

      ![image-20220322175408950](https://cdn.jsdelivr.net/gh/itxcr/oss/picture_bed/202203221756801.png)

  - 摆脱 LXC

  - 摒弃大而全的 Docker daemon

    - 随着时间推移，Docker daemon 整体性带来了越来越多的问题
      - 难于变更
      - 运行越来越慢
      - 并非生态所期望的
    - 小而专的工具可以组装为大型工具

  - Docker 引擎架构

    ![image-20220322180147769](https://cdn.jsdelivr.net/gh/itxcr/oss/picture_bed/202203221801813.png)

  - 开放容器计划的影响

  - runc

    - 创建容器
    - 独立容器运行时工具

  - containerd

    - 容器的生命周期管理
      - start | stop | pause | rm

  - 启动方法

    - `docker container run --name ctr1 -it alpine:latest sh`

      - 使用 Docker 命令行工具执行上述命令时，Docker 客户端会将其转换为合适的 API 格式，并发送到正确的 API 端点。
      - API 是在 daemon 中实现的。一旦 daemon 接收到创建新容器的命令，它就会向 containerd 发出调用。daemon 已经不再包含任何创建容器的代码了
      - daemon 使用一种 CRUD 风格的 API，通过gRPC 与 containerd 进行通信。
      - 它并不负责创建容器，而是指挥 runc 去做。containerd 将 Docker 镜像转换为 OCI bundle，并让 runc 基于此创建一个新的容器。
      - 然后，runc 与操作系统内核接口进行通信，基于所有必要的工具来创建容器。容器进程作为 runc 的子进程启动，启动完毕后，runc 将会退出。

      ![image-20220322201530299](https://cdn.jsdelivr.net/gh/itxcr/oss/picture_bed/202203222015351.png)

    - 优势

      - 将所有的用于启动、管理容器的逻辑和代码从 daemon 中移除，意味着容器运行时与 Docker daemon 是解耦的（无守护进程的容器），如此，对 Docker daemon 的维护和升级工作不会影响到运行中的容器

    - shim

      - shim 是实现无 daemon 的容器不可或缺的工具
      - containerd 指挥 runc 来创建新容器。事实上，每次创建容器时它都会 fork 一个新的 runc 实例。不过，一旦容器创建完毕，对应的 runc 进程就会退出。因此，即使运行上百个容器，也无需保持上百个运行中的 runc 实例。一旦容器的父进程 runc 退出，相关联的 containerd-shim 进程就会成为容器的父进程。作为容器的父进程，shim 的部分职责如下：
        - 保持所有 STDIN 和 STDOUT 流是开启状态，从而当 daemon 重启的时候，容器不会因为管道的关闭而终止
        - 将容器的退出状态反馈给 daemon

- 在 Linux 中实现

  - dockerd (Docker daemon)
    - 镜像管理、镜像构建、REST API、身份验证、安全、核心网络以及编排
  - docker-containerd (containerd)
  - docker-containerd-shim (shim)
  - docker-runc (runc)
  
- 小结

  - Docker 引擎目前采用模块化设计
    - Docker daemon 实现了 Docker API，该 API 是一套功能丰富、基于版本的 HTTP API，并且随着其他 Docker 项目的开发而演化。
    - 对容器的操作由 containerd 完成。它可以被看作是负责容器生命周期相关操作的容器管理器。它小巧而轻量，可被其他项目或第三方工具使用。
    - containerd 需要指挥与 OCI 兼容的容器运行时来创建容器。默认情况下，Docker 使用 runc 作为其默认的容器运行时。


### 命令

- `docker image ls`
- 列出镜像
- `docker container run -it 镜像名字 /bin/bash`

  - 启动容器
  - -it 会将 Shell 切换到容器终端
- 容器内部运行 ps 命令查看当前正在运行的全部进程

  - `ps -elf`
- `docker container exec -it 容器名称 bash`
- `docker image build -t test:latest`
  - 根据 Dockerfile 中的指令来创建新的镜像
  - 要在包含应用代码和 Dockerfile 的目录下执行命令
  - 启动测试镜像
    - docker container run -d --name web1 --publish 8080:80 test:latest
  

### 容器

Linux  容器仅包含两个进程

- PID 1：代表 /bin/bash 进程，该进程是通过 docker container run 命令来通知容器运行的
- PID 9：代表 ps -elf 进程，查看当前运行中进程所使用的命令程序
  - 这个程序在 ps 命令退出后就结束了。这意味着容器内长期运行的进程其实只有 /bin/bash



