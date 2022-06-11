/*
 * @Author: tankunpeng
 * @Date: 2021-03-15 22:50:10
 * @LastEditTime: 2022-06-10 19:13:55
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
const config = {
  host: 'localhost',
  port: 3000,
  index: 'index.html',
  timeout: 5000,
  open: false,
  base: process.cwd(),
  proxy: {},
  mock: {},
  watch: []
};

module.exports = config;
