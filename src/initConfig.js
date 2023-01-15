/*
 * @Author: tankunpeng
 * @Date: 2023-01-15 20:29:59
 * @LastEditTime: 2023-01-15 21:11:19
 * @LastEditors: tankunpeng
 * @Description: 初始化config示例文件
 * Come on, worker!
 */

const path = require('path');
const fs = require('fs');
const { chalk, error, done } = require('./utils/logger');

const sourceFile = path.resolve(__dirname, '../bs.config.js');

module.exports = function (options) {
  const { method, dir } = options;
  if (method === 'init') {
    const cwd = process.cwd();
    const targetPath = dir ? path.resolve(cwd, dir) : path.resolve(cwd);
    if (fs.existsSync(targetPath)) {
      fs.copyFileSync(sourceFile, `${targetPath}/bs.config.js`);
      done('The default configuration file is initialized');
      process.exit(0);
    } else {
      error(`Directory: ${chalk.cyan(targetPath)} not found.`);
      process.exit(1);
    }
  }
  error(`This method: ${chalk.cyan(method)} is not implemented yet.`);
  process.exit(1);
};
