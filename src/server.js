/*
 * @Author: tankunpeng
 * @Date: 2021-03-15 22:50:10
 * @LastEditTime: 2022-06-11 23:01:21
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const express = require('express');
const timeout = require('connect-timeout');
const path = require('path');
const fs = require('fs');
const open = require('open');
const ip = require('ip');
const portfinder = require('portfinder');
const { isArray, isObject, isString, isFunction } = require('./utils');
const { log, chalk, warn, error, debugLog, done } = require('./utils/logger');
const { createProxyMiddleware } = require('http-proxy-middleware');
const handler = require('serve-handler');
const livereload = require('easy-livereload');

const app = express();

class WebServer {
  constructor(customConfig) {
    this.config = customConfig || {};
    for (const [key, value] of Object.entries(this.config)) {
      this[key] = value;
    }
    this.init();
  }

  init() {
    this.setTimeout();
    this.addViewEngine();
    this.addProxy(this.proxy);
    this.addMock(this.mock);
    this.addLiveReload(this.watch);
    this.addStatic(this.base, this.index);
    // this.add404Route();
    this.addStaticHandler();


    this.start();
  }

  setTimeout() {
    app.use(timeout(this.timeout || 3000));
  }

  addViewEngine() {
    app.engine('art', require('express-art-template'));
    app.set('view options', {
      debug: process.env.NODE_ENV !== 'production'
    });
    app.set('views', path.resolve(__dirname, '../views'));
    app.set('view engine', 'art');
  }

  addStatic(statics = [], index) {
    const staticArr = isArray(statics) ? statics : statics.split(',');
    if (staticArr.length) {
      const ops = {};
      if (index) {
        ops.index = index;
      }
      let hasCwdPath = false;
      for (const staticItem of staticArr) {
        const staticPath = path.resolve(process.cwd(), staticItem);
        if (staticPath) {
          app.use(express.static(staticPath, ops));
        }
        if (staticPath === process.cwd()) {
          hasCwdPath = true;
        }
      }
      if (!hasCwdPath) {
        app.use(express.static(process.cwd(), ops));
      }
    }
  }

  addStaticHandler() {
    app.use((req, res) => {
      handler(req, res, {
        cleanUrls: true,
        unlisted: [
          '.DS_Store',
          '.git'
        ]
      });
    });
  }

  addProxy(proxy) {
    if (!isObject(proxy)) {
      warn(`${chalk.red('proxy')} configuration is not an object, skip proxy.`);
      return;
    }
    const commonProxyOps = {
      logLevel: 'warn'
    };
    const keys = Object.keys(proxy);
    if (keys.length) {
      log();
      for (const tempKey of keys) {
        let key = tempKey;
        let proxyOps = {};
        const item = proxy[key];
        if (/^\^/.test(key)) {
          key = new RegExp(key);
        }
        if (isString(item)) {
          proxyOps = { target: item, changeOrigin: true };
        } else if (isObject(item)) {
          proxyOps = item;
        }
        app.use(key, createProxyMiddleware({ ...commonProxyOps, ...proxyOps }));
        log(`Proxy created: ${chalk.cyan(key)} -> ${chalk.yellow(proxyOps.target)}`, 'Proxy');
      }
    }
  }

  addMock(mock) {
    if (!isObject(mock)) {
      warn(`${chalk.red('mock')} configuration is not an object, skip mock.`);
      return;
    }
    const keys = Object.keys(mock);
    if (keys.length) {
      log();
      for (const tempKey of keys) {
        let key = tempKey;
        const item = mock[key];
        if (/^\^/.test(key)) {
          key = new RegExp(key);
        }
        if (!isObject(item)) {
          warn(`${chalk.red('mock')} configuration ${chalk.red('key')} is not an object, skip mock.`);
          continue;
        }
        if (!isFunction(item.target)) {
          warn(`${chalk.red('mock')} configuration ${chalk.red('key')} is not an function, skip mock.`);
          continue;
        }
        app.use(key, item.target);
        log(`Mock created: ${chalk.cyan(key)}`, 'Mock ');
      }
    }
  }

  add404Route() {
    app.use((req, res) => {
      res.status(404);
      res.render('404');
    });
  }

  addLiveReload(watch = []) {
    const watchArr = isArray(watch) ? watch : watch.split(',');
    const watchDirs = [];
    log();
    for (const watchItem of watchArr) {
      const pathName = path.resolve(process.cwd(), watchItem);
      if (!fs.existsSync(pathName)) {
        log();
        warn(`The path ${chalk.red(pathName)} does not exist. Check the ${chalk.red('watch')} configuration. skip watch..`);
        continue;
      }
      log(`Watch created: ${chalk.cyan(pathName)}`, 'Watch');
      watchDirs.push(pathName);
    }
    if (watchArr.length) {
      app.use(livereload({
        watchDirs,
        checkFunc(file) {
          return /\.(css|js|html|htm)$/.test(file) || file === '';
        }
      }));
    }
  }

  start() {
    const serverPort = parseInt(this.port, 10) || 3000;
    const serverIp = ip.address();

    portfinder.getPort({
      port: serverPort,
      stopPort: serverPort + 100
    }, (err, port) => {
      if (err) {
        error(err.message);
        process.exit(1);
      }
      this.port = port;
      debugLog('server start for port:', port);
      if (port !== serverPort) {
        log();
        warn(`Port ${chalk.red(serverPort)} is used. Use port ${chalk.green(port)} to start services`);
      }
      app.listen(port, () => {
        log();
        done(' best-server running at:');
        log(`         - Local:   ${chalk.cyan(`http://localhost:${port}`)}`);
        log(`         - Network: ${chalk.cyan(`http://${serverIp}:${port}`)}`);
        log();
        if (this.open) {
          open(`http://localhost:${port}`);
        }
      });
    });
  }
}

module.exports = WebServer;
