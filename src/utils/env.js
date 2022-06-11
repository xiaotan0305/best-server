/*
 * @Author: tankunpeng
 * @Date: 2022-06-07 14:55:01
 * @LastEditTime: 2022-06-08 11:07:27
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const semver = require('semver');

/**
 * node版本对比
 * @param {*} required 版本范围限制
 */
function checkNodeVersion(required) {
  if (!semver.satisfies(process.version, required, { includePrerelease: true })) {
    return false;
  }
  return true;
}

module.exports = {
  checkNodeVersion
};
