/*
 * @Author: tankunpeng
 * @Date: 2022-06-07 21:29:31
 * @LastEditTime: 2023-01-20 15:07:42
 * @LastEditors: tankunpeng
 * @Description: logger
 * Come on, worker!
 */
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

exports.stripAnsi = stripAnsi;
const debugConfig = {
  enabled: false
};
exports.debugConfig = debugConfig;
exports.chalk = chalk;

const format = (label, msg) =>
  msg
    .split('\n')
    .map((line, i) => (i === 0 ? `${label} ${line}` : line.padStart(stripAnsi(label).length)))
    .join('\n');

const chalkTag = (msg) => chalk.bgBlackBright.white.dim(` ${msg} `);

const log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
};
exports.log = log;

const info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
};
exports.info = info;

const done = (msg, tag = null) => {
  console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
};
exports.done = done;

const warn = (msg, tag = null) => {
  console.log(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)));
};
exports.warn = warn;

const error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)));
  if (msg instanceof Error) {
    console.error(msg.stack);
  }
};
exports.error = error;

exports.debugLog = (msg) => {
  if (!debugConfig.enabled) {
    return;
  }
  log(msg, 'DEBUG');
};
exports.debugError = (msg) => {
  if (!debugConfig.enabled) {
    return;
  }
  error(msg, 'DEBUG');
};
