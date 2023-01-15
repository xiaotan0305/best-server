# best-server
[中文文档](./README.md) | [English document](./README_en.md)

用于开发静态页面的简单服务器。您可以启用代理请求，也可以自定义路由返回数据

> 核心功能
1. 可视化静态服务器
2. 请求代理转发
3. 请求mock
4. 修改代码浏览器热更新
5. 关闭端口占用或直接杀死进程

> 其他亮点小功能
1. 端口号占用自动顺延启动服务
2. 配置文件修改自动重启服务
3. 启动服务后自动打开浏览器
4. 启动的服务同时支持本地和局域网访问

## 安装

支持全局安装和项目内安装

### 全局安装
```bash
npm i best-server -g
# or
yarn add best-server -g
```

### 项目内安装

```bash
# 进入项目内
cd ./project/path
# 安装依赖
npm i best-server -D
# or
yarn add best-server -D

```

## 使用

### 全局使用

```
cd ./target/path
bs
# 就是这么简单!
```

### 项目内使用

```bash
cd ./project

# 在package.json的scripts中增加运行命令
"scripts": {
  "serve": "bs"
}

npm run serve
# or
yarn serve
# 就是这么简单!
```

## 命令行

```bash
# 使用 bs -h 查看
bs -h

Usage: bs [options]

Options:
  -v --version               输出当前版本号
  -d, --debug                开启debug模式
  -c, --config <configName>  指定配置文件,例:./bs.config.js
  -p, --port <port>          指定服务启动端口号,例:3000
  -t, --timeout <timeout>    网络请求代理超时时间,单位毫秒,例:3000
  -b, --base <base>          指定静态资源文件夹,可以添加多个,使用英文逗号隔开,默认当前根目录,例:./
  -o, --open                 服务启动时是否自动打开浏览器
  -i, --index <index>        指定入口文件,指定后打开路径自动查找入口文件,例:index.html
  -w, --watch <watch file>   指定需要监听的文件或文件夹,文件变化时自动刷新浏览器,文件夹内文件监听不支持递归文件,例:dist,./index.html
  -h, --help                 查看帮助

Commands:
  kill [options] [port]      杀死端口占用或直接杀死进程.
  config <init> [directory]  初始化配置文件到指定目录，默认为当前目录
```

```bash
# 查看版本号
bs -v
# output best-server 0.0.1
```

```bash
# 杀死3000端口占用
bs kill 3000
# 杀死进程ID 74738
bs kill --pids 74738
# 杀死多个进程ID
bs kill --pids 74738,65425
```

```bash
# 在当前目录初始化配置文件
bs config init
# 在指定目录初始化配置文件
bs config init ../
```

## 配置文件

```js
// 在项目根目录增加配置文件 bs.config.js
module.exports = {
  port: 3000, // 本地服务器启动端口
  index: 'index.html', // 指定入口文件html,默认index.html
  open: false, // 自动打开浏览器
  base: ['./'], // 静态资源目录
  proxy: {
    // 字符串简写写法
    '/foo': 'http://localhost:4000',
    // 选项写法
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    },
    // 正则表达式写法
    '^/fallback/.*': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/fallback/, '/foo2')
    },
    // Proxying websockets or socket.io
    '/socket.io': {
      target: 'ws://localhost:4000',
      ws: true
    }
  },
  mock: { // mock接口
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },
  watch: ['./index.html'] // 需要监听的文件或文件夹,变化时自动刷新浏览器
};

```

### config.host

配置启动host,默认值`localhost`

### config.port

配置启动端口,默认值`3000`

### config.index

配置入口文件,默认值`index.html`

配置index,打开目录后自动打开对应目录的`index.html`

### config.timeout

配置请求的超时时间,单位为毫秒,默认值`5000`

### config.open

配置是否打开浏览器,单位为布尔值,默认值`true`

### config.base

配置静态目录,配置的目录在浏览器可在根路径下访问,支持`string`和`string[]`默认: `process.cwd()`

```js
// src目录结构
demo.js abc.png

// 配置
{
  base: './src'
}

// 浏览器访问demo.js示例
// 未配置base时
http://localhost:3000/src/demo.js
// 配置base时
http://localhost:3000/demo.js

```
### config.proxy

配置请求代理, 默认值`{}`

支持路径和正则表达式,具体配置可参考[http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware#options)

```js
 proxy: {
    // 字符串简写写法
    '/foo': 'http://localhost:4000',
    // 选项写法
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    },
    // 正则表达式写法
    '^/fallback/.*': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/fallback/, '/foo2')
    },
    // Proxying websockets or socket.io
    '/socket.io': {
      target: 'ws://localhost:4000',
      ws: true
    }
  },

```
### config.mock

配置mock,支持自定义响应函数,默认值`{}`

支持路径和正则表达式,自定义函数请参考[expressjs](https://expressjs.com/zh-cn/4x/api.html#res)

```js
mock: { // mock接口
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },

```

### config.watch

配置要监听的文件或文件夹,配置后文件变动后会自动刷新浏览器,默认值`[]`

```js
watch: ['./index.html','dist']
```