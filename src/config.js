/*
 * @Author: tankunpeng
 * @Date: 2021-03-15 22:50:10
 * @LastEditTime: 2023-01-20 14:54:13
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const config = {
  debug: false,
  host: 'localhost',
  port: 3000,
  index: 'index.html',
  timeout: 5000,
  open: false,
  base: process.cwd(),
  proxy: {},
  mock: {},
  watch: [],
  watchExtnames: []
};

module.exports = config;
