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

## The installation

Support global installation and project installation

### Global installation
```bash
npm i best-server -g
# or
yarn add best-server -g
```

### In-project installation

```bash
# Entry into the project
cd ./project/path
# Install dependencies
npm i best-server -D
# or
yarn add best-server -D

```

## usage

### The global

```
cd ./target/path
bs
# It's that simple!
```

### In-project use

```bash
cd ./project

# Add run commands to scripts of package.json
"scripts": {
  "serve": "bs"
}

npm run serve
# or
yarn serve
# It's that simple!
```

## The command line

```bash
# use bs -h to view
bs -h

Usage: bs [options]

Options:
  -v --version               output the version number
  -d, --debug                Enabling the Debug mode
  -c, --config <configName>  Specify the configuration file,eg:./bs.config.js
  -p, --port <port>          Specify the service port number,eg:3000
  -t, --timeout <timeout>    Specifies the request timeout period in milliseconds,eg:3000
  -b, --base <base>          Specify static directory root paths separated by commas (,) if multiple paths are used,eg:./
  -o, --open                 Specifies whether to start the browser after starting the service
  -i, --index <index>        Specified entry file,eg:index.html
  -w, --watch <watch file>   Specifies the folder or file to listen on. Subfolders are not supported. Use commas to separate multiple folders,eg:dist,./index.html
  -h, --help                 display help for command

Commands:
  kill [options] [port]      Kills the specified occupied port or ID of the process.
  config <init> [directory]  Initializes the configuration file to the specified directory, which is the current directory by default
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

```bash
# Initialize the configuration file in the current directory
bs config init
# Initializes the configuration file in the specified directory
bs config init ../
```

## use the configuration file

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