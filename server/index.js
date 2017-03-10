'use strict';

require('babel-core/register');

import Hapi from 'hapi';
import cluster from 'cluster';
import os from 'os';
import Boom from 'boom';
import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthJwt from 'hapi-auth-jwt2';
import models from './models';
import env from '../envVariables';

// Create Server
const server = new Hapi.Server();
server.connection({
  port: env.port
});

const options = {
  info: {
    'title': 'UI Sandbox 2 API Documentation',
    'version': '0.0.1',
  },
  basePath: '/api/',
  pathPrefixSize: 2,
  tags: [{
    'name': 'movies'
  }, {
    'name': 'directors'
  }],
};

const validateUser = (decodedToken, request, callback) => {
	// Investigate ways to improve validation and allow access based on specific request and related user details
	let error;
	let credentials = {
		'id': decodedToken.id,
		'username': decodedToken.username,
		'scope': decodedToken.scope
	};

	return callback(error, true, credentials);
};

// Register Swagger Plugin ( Use for documentation and testing purpose )
server.register([
    Inert,
    Vision, {
      register: HapiSwagger,
      options: options
    }
  ], {
    routes: {
      prefix: '/api'
    }
  },
  function(err) {
    if (err) {
      server.log(['error'], 'hapi-swagger load error: ' + err);
    } else {
      server.log(['start'], 'hapi-swagger interface loaded');
    }
  }
);

// Register hapi-auth-jwt Plugin
server.register(HapiAuthJwt, (err) => {
  server.auth.strategy('jsonWebToken', 'jwt', {
    key: env.secret,
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
  let numWorkers = os.cpus().length;

  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  models.sequelize.sync().then(function() {
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri, 'with process id', process.pid);
    });
  });
}
