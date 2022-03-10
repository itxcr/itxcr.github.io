### 安装 docker

```shell
# 更新
sudo dnf update
sudo dnf install epel-release
sudo dnf remove podman buildah
# 镜像
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
# 安装
sudo dnf install docker-ce docker-ce-cli containerd.io

# 启动
sudo systemctl start docker.service
sudo systemctl enable docker.service

# 查看
sudo docker version

# 配置 daemon
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
  	"max-size": "100m"
  }
}
EOF

mkdir -p /etc/systemd/system/docker.service.d

# 重启docker
systemctl daemon-reload && systemctl restart docker && systemctl enable docker
```

![image-20220310203335833](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202203102033907.png)

### 安装依赖包

```shell
yum install conntrack ipvsadm ipset jq iptables curl sysstat libseccomp wget vim net-tools git
```

### 设置防火墙为 iptables 并设置空规则

```shell
systemctl stop firewalld && systemctl disable firewalld 

yum install iptables-services && systemctl start iptables && systemctl enable iptables && iptables -F && service iptables save
```

### 禁用 SELinux

```shell
swapoff -a && sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
				
setenforce 0 && sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
```

### 调整内核参数

```bash
# 生成参数
cat > kubernetes.conf <<EOF
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
net.ipv4.ip_forward=1
net.ipv4.tcp_tw_recycle=0
vm.swappiness=0 #禁止使用swap空间，只有当系统OOM时才允许使用它
vm.overcommit_memory=1 # 不检查物理内存是否够用
vm.panic_on_oom=0 #开启OOM
fs.inotify.max_user_instances=8192
fs.inotify.max_user_watches=1048576
fs.file-max=52706963
fs.nr_open=52706963
net.ipv6.conf.all.disable_ipv6=1
net.netfilter.nf_conntrack_max=2310720
EOF
# 拷贝到指定位置
cp kubernetes.conf /etc/sysctl.d/kubernetes.conf
# 让其生效
sysctl -p /etc/sysctl.d/kubernetes.conf
```

### 调整系统时区

```bash
#设置系统时区为中国上海
timedatectl set-timezone Asia/Shanghai
#将当前的UTC时间写入硬件时钟
timedatectl set-local-rtc 0
#重启依赖于系统时间的服务
systemctl restart crond
```

### 设置 rsyslogd 和 systemd journald

```bash
 # 持久化保存日志的目录
mkdir /var/log/journal

mkdir /etc/systemd/journald.conf.d

cat > /etc/systemd/journald.conf.d/99-prophet.conf <<EOF
[Journal]
#持久化保存到磁盘
Storage=persistent
#压缩历史日志
Compress=yes
SyncIntervalSec=5m
RateLimitInterval=30s
RateLimitBurst=1000
#最大占用空间
SystemMaxUse=10G
#单日志文件最大 200M
SystemMaxFileSize=200M
#日志保存时间 2周
MaxRetentionSec=2week
#不将日志转发到syslog
ForwardToSyslog=no
EOF

systemctl restart systemd-journald
```

### kube-proxy 开启 ipvs 的前置条件

```bash
modprobe br_netfilter

cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack
EOF

chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack
```

