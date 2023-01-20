/*
 * @Author: tankunpeng
 * @Date: 2023-01-15 20:29:59
 * @LastEditTime: 2023-01-20 15:53:19
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
  if (/^(init|update)$/.test(method)) {
    const cwd = process.cwd();
    const targetPath = dir ? path.resolve(cwd, dir) : path.resolve(cwd);
    const targetFile = path.resolve(targetPath, './bs.config.js');
    if (fs.existsSync(targetPath)) {
      const copyFile = () => {
        fs.copyFileSync(sourceFile, targetFile);
        done('The default configuration file is initialized');
      };
      if (method === 'init') {
        copyFile();
      } else if (method === 'update') {
        if (fs.existsSync(targetFile)) {
          const sourceConfig = require(sourceFile);
          const curConfig = require(targetFile);
          const mergeConfig = Object.assign(sourceConfig, curConfig);
          const preString = 'module.exports = ';
          const jsonString = preString + JSON.stringify(mergeConfig, null, 2);
          fs.writeFileSync(targetFile, jsonString);
        } else {
          copyFile();
        }
      }
      process.exit(0);
    } else {
      error(`Directory: ${chalk.cyan(targetPath)} not found.`);
      process.exit(1);
    }
  }
  error(`This method: ${chalk.cyan(method)} is not implemented yet.`);
  process.exit(1);
};
