/*
 * @Author: tankunpeng
 * @Date: 2023-01-20 12:19:15
 * @LastEditTime: 2023-01-20 15:08:44
 * @LastEditors: tankunpeng
 * @Description: copy from https://github.com/dai-shi/easy-livereload.git
 * Come on, worker!
 */

// Instead, we should update dependent packages once they are ready.
process.EventEmitter = process.EventEmitter || require('events');

const fs = require('fs');
const path = require('path');
const LRWebSocketServer = require('livereload-server');
const watch = require('node-watch');
const bodyRewrite = require('connect-body-rewrite');
const { error } = require('./utils/logger');

let lrserver = null;

const orgCreateConnection = LRWebSocketServer.prototype._createConnection;
LRWebSocketServer.prototype._createConnection = function (socket) {
  orgCreateConnection.call(this, socket);
  socket.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
      // ignore ECONNRESET connection closed by client error
      return;
    }
    error(err);
  });
};

function startLRServer(options) {
  if (lrserver) return;
  const ops = options || {};
  ops.livereload = options.livereload || {};
  lrserver = new LRWebSocketServer({
    id: ops.livereload.id || 'default id',
    name: ops.livereload.name || 'default name',
    version: ops.livereload.version || '1.0',
    protocols: {
      monitoring: 7,
      saving: 1
    },
    port: ops.port
  });

  lrserver.on('livereload.js', (req, res) => {
    fs.readFile(path.join(require.resolve('livereload-js'), '../../', 'dist', 'livereload.js'), 'utf8', (err, data) => {
      if (err) throw err;
      res.writeHead(200, {
        'Content-Length': data.length,
        'Content-Type': 'text/javascript'
      });
      res.end(data);
    });
  });

  lrserver.on('httprequest', (url, req, res) => {
    res.writeHead(404);
    res.end();
  });

  lrserver.listen((err) => {
    if (err) throw err;
  });

  const sendAll = function (command) {
    Object.keys(lrserver.connections).forEach((id) => {
      try {
        lrserver.connections[id].send(command);
      } catch (e) {
        error(`Livereload send command failed: ${id}`);
      }
    });
  };

  options.watchDirs.forEach((dir) => {
    watch(dir, { recursive: true }, (event, file) => {
      const filePath = path.relative(dir, file);
      if (options.checkFunc(filePath)) {
        sendAll({
          command: 'reload',
          path: options.renameFunc(filePath),
          liveCSS: true
        });
      }
    });
  });
}

module.exports = function (options) {
  const ops = options || {};
  ops.host = options.host || 'localhost';
  ops.port = options.port || 35729;
  ops.restartTimeout = options.restartTimeout || 1000;
  ops.watchDirs = options.watchDirs || ['public'];
  ops.checkFunc =
    options.checkFunc ||
    function (x) {
      return /\.(css|js)$/.test(x);
    };
  ops.renameFunc =
    options.renameFunc ||
    function (x) {
      return x;
    };

  let code = `<script>document.write('<script src="//' + (location.host || '${ops.host}').split(':')[0] + ':${options.port}/livereload.js?snipver=1"></' + 'script>')</script>`;
  if (options.reloadTimeout > 0) {
    code += `<script>document.addEventListener('LiveReloadDisconnect', function() { setTimeout(function() { window.location.reload(); }, ${options.reloadTimeout}); })</script>`;
  }

  if (options.app) {
    ops.app.locals.LRScript = code;
  }

  if (options.restartTimeout > 0) {
    process.on('SIGTERM', () => {
      setTimeout(() => {
        process.exit(0);
      }, options.restartTimeout);
    });
  }

  startLRServer(options);

  return bodyRewrite({
    accept(res) {
      return /text\/html/.test(res.getHeader('content-type'));
    },
    rewrite(body) {
      return body.replace(/<\/body>/, `${code}</body>`);
    }
  });
};
