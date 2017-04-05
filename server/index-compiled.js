'use strict';

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _hapiSwagger = require('hapi-swagger');

var _hapiSwagger2 = _interopRequireDefault(_hapiSwagger);

var _hapiAuthJwt = require('hapi-auth-jwt2');

var _hapiAuthJwt2 = _interopRequireDefault(_hapiAuthJwt);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _envVariables = require('../envVariables');

var _envVariables2 = _interopRequireDefault(_envVariables);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-core/register');

// Create Server
var server = new _hapi2.default.Server();
server.connection({
  port: _envVariables2.default.port
});

var options = {
  info: {
    'title': 'UI Sandbox 2 API Documentation',
    'version': '0.0.1'
  },
  basePath: '/api/',
  pathPrefixSize: 2,
  tags: [{
    'name': 'movies'
  }, {
    'name': 'directors'
  }]
};

var validateUser = function validateUser(decodedToken, request, callback) {
  // Investigate ways to improve validation and allow access based on specific request and related user details
  var error = void 0;
  var credentials = {
    'id': decodedToken.id,
    'username': decodedToken.username,
    'scope': decodedToken.scope
  };

  return callback(error, true, credentials);
};

// Register Swagger Plugin ( Use for documentation and testing purpose )
server.register([_inert2.default, _vision2.default, {
  register: _hapiSwagger2.default,
  options: options
}], {
  routes: {
    prefix: '/api'
  }
}, function (err) {
  if (err) {
    server.log(['error'], 'hapi-swagger load error: ' + err);
  } else {
    server.log(['start'], 'hapi-swagger interface loaded');
  }
});

// Register hapi-auth-jwt Plugin
server.register(_hapiAuthJwt2.default, function (err) {
  server.auth.strategy('jsonWebToken', 'jwt', {
    key: _envVariables2.default.secret,
    verifyOptions: {
      algorithms: ['HS256']
    },
    validateFunc: validateUser
  });
});

// Routes
server.route(require('./routes'));

// Cluster config and server start
// if (cluster.isMaster) {
if (false) {
  var numWorkers = _os2.default.cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (var i = 0; i < numWorkers; i++) {
    _cluster2.default.fork();
  }

  _cluster2.default.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  _cluster2.default.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    _cluster2.default.fork();
  });
} else {
  _models2.default.sequelize.sync().then(function () {
    server.start(function (err) {
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri, 'with process id', process.pid);
    });
  });
}
