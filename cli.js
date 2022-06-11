#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');
const { checkNodeVersion, updateCheck } = require('./src/utils/env');
const { chalk, error, debugConfig, updateDebugMode } = require('./src/utils/logger');
const createServer = require('./src/createServer');
const kill = require('./src/killport');

const enginesNodeVersion = pkg.engines.node;

const checkPass = checkNodeVersion(enginesNodeVersion);
if (!checkPass) {
  error(`You are using Node ${process.version}, but this version of ${pkg.name} requires Node ${enginesNodeVersion}.\r\nPlease upgrade your Node version`);
  process.exit(1);
}

updateCheck();

program
  .version(`web-server ${chalk.cyan(pkg.version)}`, '-v --version')
  .usage('[options]');

program
  .option('-d, --debug', 'Enabling the Debug mode')
  .option('-c, --config <configName>', 'Specify the configuration file,eg:./ws.config.js')
  .option('-p, --port <port>', 'Specify the service port number,eg:3000')
  .option('-t, --timeout <timeout>', 'Specifies the request timeout period in milliseconds,eg:3000')
  .option('-b, --base <base>', 'Specify static directory root paths separated by commas (,) if multiple paths are used,eg:./')
  .option('-o, --open', 'Specifies whether to start the browser after starting the service')
  .option('-i, --index <index>', 'Specified entry file,eg:index.html')
  .option('-w, --watch <watch file>', 'Specifies the folder or file to listen on. Subfolders are not supported. Use commas to separate multiple folders,eg:dist,./index.html')
  .option('-k, --kill <kill>', 'Kills the specified occupied port.');

program.parse();

const opts = program.opts();

if (opts.debug) {
  debugConfig.enabled = true;
  updateDebugMode();
}

if (opts.kill) {
  kill(opts.kill);
}

const needCreateServer = !opts.kill;
if (needCreateServer) {
  createServer(opts);
}
