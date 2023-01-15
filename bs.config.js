/*
 * @Author: tankunpeng
 * @Date: 2022-06-08 11:29:56
 * @LastEditTime: 2023-01-15 20:49:33
 * @LastEditors: tankunpeng
 * @Description: 配置文件默认配置文件，可以在此基础上修改
 * Come on, worker!
 */
module.exports = {
  port: 3000, // 本地服务器启动端口
  index: 'index.html', // 指定入口文件html,默认index.html
  open: false, // 自动打开浏览器
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
  mock: { // mock接口
    '/hello': {
      target(req, res) {
        // res.send({ text: 'hello world!' });
        res.json({ text: 'hello world!' });
      }
    }
  },
  watch: ['./index.html'] // 需要监听的文件或文件夹,变化时自动刷新浏览器
};
