/*
 * @Author: tankunpeng
 * @Date: 2022-06-08 10:31:52
 * @LastEditTime: 2022-06-08 10:43:21
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const program = require('commander');
const leven = require('leven');
const { chalk, info } = require('./logger');

exports.suggestCommands = (unknowCommand) => {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach((cmd) => {
    const isBestMatch = leven(cmd, unknowCommand) < leven(suggestion || '', unknowCommand);
    if (leven(cmd, unknowCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    info(`  ${chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`)}`);
  }
};
