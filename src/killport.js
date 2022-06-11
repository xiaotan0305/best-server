/*
 * @Author: tankunpeng
 * @Date: 2022-06-11 21:49:33
 * @LastEditTime: 2022-06-11 22:22:26
 * @LastEditors: tankunpeng
 * @Description: 关闭端口号
 * Come on, worker!
 */
const { kill } = require('cross-port-killer');
const { chalk, warn, error, done, info } = require('./utils/logger');

module.exports = function (port) {
  if (!port) {
    warn(`port ${chalk.red('prot')} not found.`);
    process.exit(1);
  }
  kill(port).then((pids) => {
    if (!pids || !pids.length) {
      info(`The port ${chalk.red(port)} number is not occupied`);
      process.exit(0);
    }
    done(`The port ${chalk.red(port)} has been killed. The process using the port number contains ${chalk.red(pids.join(' '))}`);
    process.exit(0);
  }).catch((err) => {
    error(err);
    process.exit(1);
  });
};
