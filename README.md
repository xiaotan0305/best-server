# web-server
[README](README_en.md) | [中文文档](README.md)

用于开发静态页面的简单服务器。您可以启用代理请求，也可以自定义路由返回数据

> 核心功能
1. 可视化静态服务器
2. 请求代理转发
3. 请求mock
4. 修改代码浏览器热更新
5. 关闭端口号占用进程

> 其他亮点小功能
1. 端口号占用自动顺延启动服务
2. 配置文件修改自动重启服务
3. 启动服务后自动打开浏览器
4. 启动的服务同时支持本地和局域网访问

## 安装

支持全局安装和项目内安装

### 全局使用
```bash
npm i web-server -g
# or
yarn add web-server -g

# 进入静态目录
cd ./static/path
# 启动静态服务
ws
# 就是这么简单!
```

### 项目内使用

```bash
# 进入项目内
cd ./project/path
# 安装依赖
npm i web-server -D
# or
yarn add web-server -D

# 在package.json的scripts中增加运行命令
"scripts": {
  "serve": "ws",
}

# 项目根目录增加配置文件(可选)文件名为: ws.config.js

```

## 使用

