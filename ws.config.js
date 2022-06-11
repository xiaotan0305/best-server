/*
 * @Author: tankunpeng
 * @Date: 2022-06-08 11:29:56
 * @LastEditTime: 2022-06-10 19:15:40
 * @LastEditors: tankunpeng
 * @Description:
 * Come on, worker!
 */
module.exports = {
  port: 3000, // 本地服务器启动端口
  index: 'index.html',
  open: false,
  base: ['./'], // 静态资源目录
  proxy: {
    // 字符串简写写法
    '/foo': 'http://localhost:4000',
    // 选项写法
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    },
    // 正则表达式写法
    '^/fallback/.*': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/fallback/, '/foo2')
    },
    // Proxying websockets or socket.io
    '/socket.io': {
      target: 'ws://localhost:4000',
      ws: true
    }
  },
  mock: {
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },
  watch: ['./index.html']
};
