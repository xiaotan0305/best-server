# web-server

A simple server for developing static pages. You can enable proxy requests or customize the route to return data

> Core functions
1. Visual static server
2. Request proxy forwarding
3. Request mock
4. Modify code browser hot update
5. Kill the process that occupies port number

> Other highlights small features
1. If the port number is occupied, services are automatically started
2. Modify the configuration file to restart the service automatically
3. Automatically open the browser after starting the service
4. Launched services support both local and LAN access

## The installation

Support global installation and project installation

### Use this package globally
```bash
npm i web-server -g
# or
yarn add web-server -g

# Enter a static directory
cd ./static/path
# Start static services
ws
# So easy
```

### 项目内使用

```bash
# Entry into the project
cd ./project/path
# Install dependencies
npm i web-server -D
# or
yarn add web-server -D

# Add run commands to scripts of package.json
"scripts": {
  "serve": "ws",
}

# Add configuration files to the project root directory (optional),The file name: ws.config.js

```

## usage

