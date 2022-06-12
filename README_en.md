# best-server

A simple server for developing static pages. You can enable proxy requests or customize the route to return data

> Core functions
1. Visual static server
2. Request proxy forwarding
3. Request mock
4. Modify code browser hot update
5. Disable the port occupation or kill the process

> Other highlights small features
1. If the port number is occupied, services are automatically started
2. Modify the configuration file to restart the service automatically
3. Automatically open the browser after starting the service
4. Launched services support both local and LAN access

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
```

```bash
# Viewing the Version Number
bs -v
# output best-server 0.0.1
```

```bash
# Kill 3000 occupied ports
bs kill 3000
# Killing the process ID 74738
bs kill --pids 74738
# Kill multiple process ids
bs kill --pids 74738,65425
```

## 配置文件

```js
// Add configuration files to the project root directory bs.config.js
module.exports = {
  port: 3000, // Local server startup port
  index: 'index.html', // Specify the entry file HTML,default index.html
  open: false, // Automatically open the browser
  base: ['./'], // Static Resource directory
  proxy: {
    // Short for string
    '/foo': 'http://localhost:4000',
    // Options for writing
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    },
    // Regular expression writing
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
  mock: { // The mock interface
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },
  watch: ['./index.html'] // Automatically refresh the browser when the file or folder you want to listen to changes
};

```

### config.host

Configure startup host, default`localhost`

### config.port

Configure the boot port, default`3000`

### config.index

Configuration entry file, default`index.html`

Configure index to automatically open the corresponding directory after opening the directory `index.html`

### config.timeout

Specifies the timeout period for a request, in milliseconds. The default value `5000`

### config.open

Configures whether to open the browser. Unit: Boolean. Default value`true`

### config.base

Configure static directories that can be accessed by the browser in the root path. Support `string` and `string[]` default: `process.cwd()`

```js
// src directory structure
demo.js abc.png

// configuration
{
  base: './src'
}

// The demo. Js example is accessed by the browser
// When Base is not configured
http://localhost:3000/src/demo.js
// When the configuration of the base
http://localhost:3000/demo.js

```
### config.proxy

Configure the request broker, default`{}`

Supports paths and regular expressions. For details, see[http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware#options)

```js
 proxy: {
    // Short for string
    '/foo': 'http://localhost:4000',
    // Options for writing
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    },
    // Regular expression writing
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

Configure mock to support custom response functions, default`{}`

Supports paths and regular expressions. For details about user-defined functions, see[expressjs](https://expressjs.com/zh-cn/4x/api.html#res)

```js
mock: { // The mock interface
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },

```

### config.watch

Configure the file or folder that you want to listen to. After the configuration, the browser will be refreshed automatically if the file changes. Default value`[]`

```js
watch: ['./index.html','dist']
```