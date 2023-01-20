/*
 * @Author: tankunpeng
 * @Date: 2022-06-07 17:51:58
 * @LastEditTime: 2023-01-20 15:52:52
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */

const type = (obj) => Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
exports.isString = (str) => type(str) === 'String';
exports.isNumber = (num) => type(num) === 'Number';
exports.isFunction = (func) => type(func) === 'Function';
exports.isArray = (list) => type(list) === 'Array';
exports.isObject = (obj) => type(obj) === 'Object';
exports.isObjectOrArray = (obj) => exports.isObject(obj) || exports.isArray(obj);

exports.consoleClear = () => {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  // ohter method for console clear
  // process.stdout.cursorTo(0, 0);
  // process.stdout.clearScreenDown();
};
