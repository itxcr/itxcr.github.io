### 安装 docker

```shell
# 更新
sudo dnf update
sudo dnf install epel-release
sudo dnf remove podman buildah
# 镜像
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
# 安装
sudo dnf install -y docker-ce docker-ce-cli containerd.io

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

### 设置系统主机名以及 Host 文件

```bash
# 设置主机名
hostnamectl set-hostname master
hostnamectl set-hostname node1
hostnamectl set-hostname node2
# 设置hosts
10.10.10.160 master
10.10.10.161 node1
10.10.10.162 node2

# 拷贝 hosts 文件到其他主机
scp /etc/hosts root@node1:/etc/hosts
```

### 安装依赖包

```shell
yum install -y conntrack ipvsadm ipset jq iptables curl sysstat libseccomp wget vim net-tools git
```

### 设置防火墙为 iptables 并设置空规则

```shell
systemctl stop firewalld && systemctl disable firewalld 

yum install -y iptables-services && systemctl start iptables && systemctl enable iptables && iptables -F && service iptables save
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
scp /etc/sysctl.d/kubernetes.conf root@node1:/etc/sysctl.d/kubernetes.conf
# 让其生效
sysctl --system
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

### 安装 Kubeadm （主从配置）

创建文件 `kubernetes.repo` 

```bash
vim /etc/yum.repos.d/kubernetes.repo

# 添加如下
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg

# 安装
yum install -y kubelet kubeadm kubectl

# 开机启动 kubelet 服务
systemctl enable kubelet.service
```

### 初始化主节点（仅 master 执行）

```bash
 # 显示 kubeadm 默认的设置 打印到  kubeadm-config.yaml
kubeadm config print init-defaults > kubeadm-config.yaml

# 修改 kubeadm-config.yaml
localAPIEndpoint:
  advertiseAddress: 10.10.10.160
  bindPort: 6443
networking:
  dnsDomain: cluster.local
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/12
scheduler: {}
---
# 把默认的调度方式改为 ipvs 调度
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
featureGates:
  SupportIPVSProxyMode: true
mode: "ipvs"

kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log

# 创建目录
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 重新设置
kubeadm reset
```

### 加入主节点以及其余工作节点

```
执行安装日志中的加入命令即可

```

### 部署网络

```bash
kubectl apply -f https://docs.projectcalico.org/v3.22/manifests/calico.yaml
```

```text
208.67.222.222
208.67.220.220
```





## 另一个

```bash
# 设置主机名
hostnamectl set-hostname master
hostnamectl set-hostname node1
hostnamectl set-hostname node2
# 设置hosts
10.10.10.160 master
10.10.10.161 node1
10.10.10.162 node2

# 拷贝 hosts 文件到其他主机
scp /etc/hosts root@node1:/etc/hosts

yum install ipvsadm ipset sysstat conntrack libseccomp wget jq psmisc vim net-tools telnet yum-utils device-mapper-persistent-data lvm2 git -y

systemctl disable --now firewalld 
setenforce 0
sed -i 's#SELINUX=enforcing#SELINUX=disabled#g' /etc/sysconfig/selinux
sed -i 's#SELINUX=enforcing#SELINUX=disabled#g' /etc/selinux/config

swapoff -a && sysctl -w vm.swappiness=0
sed -ri '/^[^#]*swap/s@^@#@' /etc/fstab

modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack

vim /etc/modules-load.d/ipvs.conf 
    # 加入以下内容
ip_vs
ip_vs_lc
ip_vs_wlc
ip_vs_rr
ip_vs_wrr
ip_vs_lblc
ip_vs_lblcr
ip_vs_dh
ip_vs_sh
ip_vs_fo
ip_vs_nq
ip_vs_sed
ip_vs_ftp
ip_vs_sh
nf_conntrack
ip_tables
ip_set
xt_set
ipt_set
ipt_rpfilter
ipt_REJECT
ipip


systemctl enable --now systemd-modules-load.service

lsmod | grep -e ip_vs -e nf_conntrack

cat <<EOF > /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
fs.may_detach_mounts = 1
vm.overcommit_memory=1
vm.panic_on_oom=0
fs.inotify.max_user_watches=89100
fs.file-max=52706963
fs.nr_open=52706963
net.netfilter.nf_conntrack_max=2310720
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.tcp_keepalive_intvl =15
net.ipv4.tcp_max_tw_buckets = 36000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_max_orphans = 327680
net.ipv4.tcp_orphan_retries = 3
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.ip_conntrack_max = 65536
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_timestamps = 0
net.core.somaxconn = 16384
EOF

sysctl --system

sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo

sudo dnf install -y docker-ce docker-ce-cli containerd.io

mkdir /etc/docker

cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
  	"max-size": "100m"
  }
}
EOF

systemctl daemon-reload && systemctl enable --now docker

vim /etc/yum.repos.d/kubernetes.repo

# 添加如下
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg

# 安装
yum install -y kubelet kubeadm kubectl

systemctl enable docker && systemctl start docker
systemctl enable kubelet && systemctl start kubelet

kubeadm init --config=kubeadm-config.yaml --upload-certs | tee kubeadm-init.log

# 创建目录
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

cat <<EOF >> /root/.bashrc
export KUBECONFIG=/etc/kubernetes/admin.conf
EOF
source /root/.bashrc

kubectl get pods -n kube-system -o wide
```

