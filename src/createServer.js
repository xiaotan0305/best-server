/*
 * @Author: tankunpeng
 * @Date: 2021-03-15 22:50:10
 * @LastEditTime: 2022-06-10 19:21:00
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const merge = require('deepmerge');
const WebServer = require('./server');
const defaultConfig = require('./config');
const path = require('path');
const fs = require('fs');
const { debugLog, error, warn, chalk } = require('./utils/logger');
const cluster = require('cluster');
const chokidar = require('chokidar');
const { consoleClear } = require('./utils');


const context = process.cwd();
let configFile = path.resolve(context, 'bs.config.js');

const getConfig = (opts) => {
  const { config } = opts;
  let serverConfig = merge({}, defaultConfig);
  if (config) {
    configFile = path.resolve(context, config);
  }
  if (fs.existsSync(configFile)) {
    try {
      const userConfig = require(configFile);
      serverConfig = merge(defaultConfig, userConfig);
    } catch (e) {
      error(e);
      process.exit(1);
    }
    debugLog('config file path:', configFile);
  }
  serverConfig = merge(serverConfig, opts);
  debugLog('config:', serverConfig);
  return serverConfig;
};

const addProcess = () => {
  for (const worker of Object.values(cluster.workers)) {
    if (worker) worker.process.kill();
  }
  const worker = cluster.fork();
  debugLog('cluster worker start', `pid:${worker.process.pid}`);
};

let lock = false;
const watchConfig = () => {
  if (fs.existsSync(configFile)) {
    chokidar.watch(configFile).on('change', () => {
      if (lock) return;
      lock = true;
      consoleClear();
      debugLog('config change bs.config.js');
      warn(`the configuration file(${chalk.green('bs.config.js')}) changes, the service restarts automatically..`);
      addProcess();
      setTimeout(() => {
        lock = false;
      }, 500);
    });
  }
};

module.exports = (opts) => {
  const serverConfig = getConfig(opts);
  if (cluster.isMaster) {
    debugLog('cluster master start');
    addProcess();
    watchConfig();
    return;
  }
  return new WebServer(serverConfig);
};
