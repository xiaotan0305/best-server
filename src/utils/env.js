/*
 * @Author: tankunpeng
 * @Date: 2022-06-07 14:55:01
 * @LastEditTime: 2023-01-20 15:11:37
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const semver = require('semver');
const checkForUpdate = require('update-check');
const pkg = require('../../package.json');
const { chalk, debugError, info } = require('./logger');

exports.checkNodeVersion = (required) => {
  if (!semver.satisfies(process.version, required, { includePrerelease: true })) {
    return false;
  }
  return true;
};

exports.updateCheck = async () => {
  checkForUpdate(pkg)
    .then((update) => {
      if (update) {
        info(`${chalk.bgRed('UPDATE AVAILABLE')} The latest version of \`serve\` is ${update.latest}`);
      }
    })
    .catch((err) => {
      debugError(`The update check failed: ${err.message}`);
    });
};
