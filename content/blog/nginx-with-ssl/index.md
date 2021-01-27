---
title: 5 分钟内让你的 nginx 网站支持 HTTPS
author: shinya
date: 2021-01-08
tags: ["服务器"]
---

**先说一下本站就是根据这个博客来加上 HTTPS 支持的。**

> 在 docker-compose 环境下，只需要 5 分钟就可以让你的 Nginx 与 Let's Encrypt 一起运行。

原文链接： <https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71>

从前有一天，我打算**快速**的启动一个 nginx 服务，并且为它加上 Let's Encrypt 证书。本来以为这事儿会很简单的，结果却被生活教育了：我花了超多时间和精力，因为中间过程非常复杂。

当然从程序员的直觉来讲，这应当是一个很简单的事情，但是有一些细节需要强调一下。这篇文章的根本目的就是为了帮助你启动一个包含有两个 container 的 docker-compose 环境，这两个 container 一个跑 nginx 服务，另一个包含有抓取 HTTPS 证书和自动续约证书的服务。**不管你是用 nginx 来做代理还是单纯的做一个静态文件服务器，这篇文章应该都对你有用。**

> 太长不读版： 直接看[源代码](https://github.com/wmnnd/nginx-certbot)

## 先说一下：什么是 docker-compose

docker-compose 是一个定义容器和运行容器的工具。当你有多个独立的容器的时候，你又不需要完全定义一个容器集群（像 k8s 那样），那么 docker-compose 就是不二之选。

官方文档是这么说的：

> 在 docker-compose 中只需要用一个 YAML 文件来配置你的应用服务，然后只需要一个命令就可以创建和启动配置文件中定义的所有服务。

这篇文章需要用到 docker-compose 环境，如果你还没有安装的话请参考[这个官方链接](https://docs.docker.com/compose/install/#install-compose)

## 安装

Nginx 和 EFF（电子前哨基金会）提供的获取 Let's Encrypt 证书的工具镜像 certbot 都有 Docker library 官方镜像。

所以我们就用一个基本的 `docker-compose.yml` 配置就可以启动这两个容器了：

```yml
version: "3"
services:
  nginx:
    image: nginx:1.15-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./data/nginx:/etc/nginx/conf.d
  certbot:
    image: certbot/certbot
```

然后这里有一个 nginx 的示例配置，它会把所有的请求都转发到 HTTPS 去。这里第二个 `server` 指令定义了一个代理把所有的 `example.org` 代理到 80 端口。你应该吧这里的配置改成你自己的配置。

把这个配置文件存为 `data/nginx/app.conf` 放在 `docker-compose.yml` 同一目录下。**把所有的 `example.org` 换成你自己的域名**

```config
server {
    listen 80;
    server_name example.org;
    location / {
        return 301 https://$host$request_uri;
    }
}
server {
    listen 443 ssl;
    server_name example.org;

    location / {
        proxy_pass http://example.org; #for demo purposes
    }
}
```

如果你现在运行 `docker-compose up`，那么 nginx 将会无法启动，因为目录中不存在证书文件。我们需要进行下一步工作。

## 链接 nginx 和 cerbot

Let's Encrypt 通过访问一个很通用的站点 URL 来验证域名的合法性。如果它收到一个 challenge 回复，那么站点将会被认为是合法的。这跟 Google Search Console 声明网站的所有权是比较类似的。这个返回值是由 certbot 提供的，所以我们需要用 nginx 容器来为 certbot 提供提供文件服务。

首先我们需要两个共享的 docker volume， 一个用来验证 chanllenge， 一个用来放真正的证书文件。

把下面这两行加到你的 `docker-compose.yml` 的 nginx 部分的 volume 下面：

```yml
- ./data/certbot/conf:/etc/letsencrypt
- ./data/certbot/www:/var/www/certbot
```

这两行加到 certbot 部分：

```yml
volumes:
  - ./data/certbot/conf:/etc/letsencrypt
  - ./data/certbot/www:/var/www/certbot
```

这样一来我们就可以用 nginx 来为 certbot 的 challenge 文件提供静态文件服务了，把下面的配置加入 `data/nginx/app.con` 的 80 端口区域：

```config
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

然后，我们需要在 nginx 配置的 server 指令中引用证书文件**再次强调，一定要把 example.org 换成你自己的域名**：

```config
ssl_certificate /etc/letsencrypt/live/example.org/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.org/privkey.pem;
```

Let's Encrypt 的小伙子们我们提供了一个 nginx 的 HTTPS 配置最佳实践，把下面这两行加入配置文件将会使你在 SSL Labs test 中获得一个 A 的评分：

```config
include /etc/letsencrypt/options-ssl-nginx.conf;
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
```

## 先有鸡还是先有蛋？

现在到了一个尴尬的地方，我们的 nginx 需要执行 Let's Encrypt 验证，但是没有证书又没办法启动 ngixn。

所以咋整？创建一个假的证书，启动 nginx，删除假证书，请求真正的证书。你运气好，不用一步一步来，我写了一个脚本来做这个事儿：

```bash
curl -L https://raw.githubusercontent.com/wmnnd/nginx-certbot/master/init-letsencrypt.sh > init-letsencrypt.sh
```

（如果你不能访问，那么手动复制[这个网站](https://blog.weshinekx.cn/nginx-with-ssl/)的所有内容，手动创建一个 `init-letsencrypt.sh` 脚本把上面的内容粘贴进去）

**手动编辑这个脚本，把你的域名加到 domain 里面，邮箱填写好你自己的邮箱。**如果你修改过 docker volume 的路径的话，确保 `data_path` 是对的。

`chmod +x init-letsencrypt.sh`, 然后再 `./init-letsencrypt.sh` 执行脚本。

## 自动续证书的有效时间

最后一件事，但是不是必要的。我们需要在证书快要过期的时候让证书自动续时间，certbot 不会自动续时间，所以我们要修改一些地方。

把下面这段代码加到 `docker-compose.yml` 的 `certbot` 区域：

```yml
entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

按照 Let's Encrypt 的建议，这会每经过 12 个小时检查你的证书过期时间。

在 `nginx` 区域你也需要每过一段时间来重新加载证书，保证用的是最新的证书。

```yml
command: '/bin/sh -c ''while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g "daemon off;"'''
```

这会使得 nginx 每 6 个小时就重新加载配置。

## 启动！

万事俱备，只差临门一脚。初始证书已经被下载，所有的容器都准备好可以启动了。只需要执行 `docker-compose up` 就可以访问你的 HTTPS 加密好的网站了！
