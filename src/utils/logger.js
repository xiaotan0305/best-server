/*
 * @Author: tankunpeng
 * @Date: 2022-06-07 21:29:31
 * @LastEditTime: 2022-06-10 19:13:38
 * @LastEditors: tankunpeng
 * @Description: logger
 * Come on, worker!
 */
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const debug = require('debug');

exports.stripAnsi = stripAnsi;
exports.debug = debug;
exports.chalk = chalk;

const format = (label, msg) =>
  msg
    .split('\n')
    .map((line, i) => (i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length)))
    .join('\n');

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

exports.log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
};

exports.info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
};

exports.warn = (msg, tag = null) => {
  console.log(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
};

exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
  if (msg instanceof Error) {
    console.error(msg.stack);
  }
};

const debugConfig = {
  enabled: false,
  color: 2
};
exports.debugConfig = debugConfig;
const dcjsDebug = debug('debug:ws');
const debugLog = (...args) => {
  if (!debugConfig.enabled) return;
  return dcjsDebug(...args);
};
dcjsDebug.color = debugConfig.color;

exports.updateDebugMode = () => {
  dcjsDebug.enabled = !!debugConfig.enabled;
};
exports.debugLog = debugLog;
