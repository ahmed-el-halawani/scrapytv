"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = _interopRequireDefault(require("http"));

var _debug = _interopRequireDefault(require("debug"));

var _constants = require("../utils/constants");

var _logger = require("../utils/logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debuger = (0, _debug.default)('app:Server'); // this allows me to have more controll on Starting  the server
// in case if there is any errors...

let httpServer;

function initServer(app) {
  return new Promise((resolve, reject) => {
    httpServer = _http.default.createServer(app);
    httpServer.listen(_constants.PORT).on('listening', () => {
      resolve();
    }).on('error', err => {
      reject(err);
    });
  });
} // The close function returns a promise that is resolved when the web server is successfully closed
// The httpServer.close method stops new connections from being established,
// but it will not force already opened connections closed


function close() {
  return new Promise((resolve, reject) => {
    httpServer.close(err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

const Startup = async app => {
  try {
    // awaiting the Promise to Resolve Or reject...
    await initServer(app);
    debuger(`Server is Live on http://localhost:${_constants.PORT} 🚀`);
  } catch (err) {
    debuger('Server is not running...⚠⚠', err); // log err to file Later with Morgan or Winston
  }
};

const Shutdown = async Uncaughtex => {
  let err = Uncaughtex;

  try {
    debuger('Shutting down Server...');
    await close();
  } catch (ex) {
    err = err || ex; // log with winston Later..:);

    (0, _logger.prettyConsole)(ex);
  }

  if (err) {
    process.exit(1); // non-Zero Exit Means Failaiur

    return;
  }

  process.exit(0);
};

var _default = Startup; // SIGINT and SIGTERM events are related to signals that can be sent to the process to shut it down
// like ctrl+C...

exports.default = _default;
process.on('SIGINT', () => {
  debuger('Received SIGINT');
  Shutdown();
});
process.on('SIGTERM', () => {
  debuger('Received SIGTERM');
  Shutdown();
}); // The uncaughtException event will occur when a JavaScript error is thrown
// but not caught and handled with a try-catch statement.

process.on('uncaughtException', error => {
  debuger('uncaughtException');
  (0, _logger.prettyConsole)(error); // logger.info('uncaughtException :: ', err)
  // Winston.error('uncaughtException :: ', err);
  // this exception will be logged in shutdown Function

  Shutdown(error);
}); // exports.Startup = Startup;
// exports.Shutdown = Shutdown;