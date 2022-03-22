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
  - 这个程序在 ps 命令退出后就结束了。这意味着容器内长期运行的进程其实只有 /bin/bash。



