### 使用 docker 安装 jenkins

- 创建一个 docker-compose.yml 文件，放到 /www/docker/jenkins 

  ```yml
  version: '1.0'
  services:
    jenkins:
      container_name: 'jenkins'
      image: jenkins/jenkins:lts
      restart: always
      user: jenkins:992
      ports:
        - "10050:8080"
        - "50001:50000"
        - "10051:10051"
      volumes:
        - /www/docker/jenkins/data:/var/jenkins_home
        - /usr/bin/docker:/usr/bin/docker
        - /var/run/docker.sock:/var/run/docker.sock
  ```

  - 备注1:使用cat /etc/group | grep docker,我得到的 docker:x:992:

  - 给 /www/docker/jenkins/data 777 权限

  - -bash: docker-compose:: 未找到命令

    ```bash
    cd /usr/local/bin
    wget https://github.com/docker/compose/releases/download/v2.4.1/docker-compose-linux-x86_64
    rename docker-compose-linux-x86_64 docker-compose docker-compose-linux-x86_64
    chmod +x /usr/local/bin/docker-compose
    docker-compose version
    ```

- docker-compose up -d 来加载docker-compose.yml 

- docker logs jenkins 查看jenkins容器的日志 

  - 查看 jenkins  密钥

### gitlab 设置 ssh

