/*
 * @Author: tankunpeng
 * @Date: 2022-06-11 21:49:33
 * @LastEditTime: 2022-06-12 01:34:26
 * @LastEditors: tankunpeng
 * @Description: 关闭端口号
 * Come on, worker!
 */
const { kill, killer } = require('cross-port-killer');
const { chalk, error, done, info } = require('./utils/logger');

module.exports = function (options) {
  const { port, pids } = options;
  if (!port && !pids) {
    error(`Neither ${chalk.red('prot')} nor ${chalk.red('pids')} were found`);
    process.exit(1);
  }
  if (port) {
    kill(port).then((processIds) => {
      if (!processIds || !processIds.length) {
        info(`The port ${chalk.red(port)} number is not occupied`);
        process.exit(0);
      }
      done(`The port ${chalk.red(port)} has been killed. The process using the port number contains ${chalk.red(processIds.join(' '))}`);
      process.exit(0);
    }).catch((err) => {
      error(err);
      process.exit(1);
    });
    return;
  }
  if (pids) {
    const pidArr = pids.split(',');
    killer.killByPids(pidArr).then(() => {
      done(`The pids ${chalk.red(pids)} has been killed.`);
      process.exit(0);
    }).catch((err) => {
      error(err);
      process.exit(1);
    });
  }
};
