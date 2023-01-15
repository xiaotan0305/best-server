#!/usr/bin/env node

const program = require('commander');
const pkg = require('./package.json');
const { checkNodeVersion, updateCheck } = require('./src/utils/env');
const { chalk, error, debugConfig, updateDebugMode } = require('./src/utils/logger');
const createServer = require('./src/createServer');
const kill = require('./src/killport');
const initConfig = require('./src/initConfig');

const enginesNodeVersion = pkg.engines.node;

const checkPass = checkNodeVersion(enginesNodeVersion);
if (!checkPass) {
  error(`You are using Node ${chalk.cyan(process.version)}, but this version of ${chalk.cyan(pkg.name)} requires Node ${chalk.cyan(enginesNodeVersion)}.\r\nPlease upgrade your Node version`);
  process.exit(1);
}

updateCheck();

program
  .version(`best-server ${chalk.cyan(pkg.version)}`, '-v --version')
  .usage('[options]');

program
  .option('-d, --debug', 'Enabling the Debug mode')
  .option('-c, --config <configName>', 'Specify the configuration file,eg:./bs.config.js')
  .option('-p, --port <port>', 'Specify the service port number,eg:3000')
  .option('-t, --timeout <timeout>', 'Specifies the request timeout period in milliseconds,eg:3000')
  .option('-b, --base <base>', 'Specify static directory root paths separated by commas (,) if multiple paths are used,eg:./')
  .option('-o, --open', 'Specifies whether to start the browser after starting the service')
  .option('-i, --index <index>', 'Specified entry file,eg:index.html')
  .option('-w, --watch <watch file>', 'Specifies the folder or file to listen on. Subfolders are not supported. Use commas to separate multiple folders,eg:dist,./index.html')
  .action((options) => {
    if (options.debug) {
      debugConfig.enabled = true;
      updateDebugMode();
    }
    createServer(options);
  });

program.command('kill')
  .description('Kills the specified occupied port or ID of the process.')
  .argument('[port]', 'Port number to kill')
  .option('-P, --pids <pids>', 'Specifies the ID of the process to kill, separated by commas,eg: 2344,5566')
  .action((port, options) => {
    kill({ port, ...options });
  });

program.command('config <init>')
  .description('Initializes the configuration file to the specified directory, which is the current directory by default')
  .argument('[directory]', 'Configuration file initialization directory address')
  .action((method, dir, options) => {
    initConfig({ method, dir, ...options });
  });

program.parse();

