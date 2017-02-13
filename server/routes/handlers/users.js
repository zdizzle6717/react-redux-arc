'use strict';

import models from '../../models';
import fs from 'fs-extra';
import env from '../../../envVariables.js';
import Boom from 'boom';
import createToken from '../../utils/createToken';
import userFunctions from '../../utils/userFunctions';

// App users
let users = {
  'create': (request, reply) => {
    userFunctions.hashPassword(request.payload.password, (err, hash) => {
      let siteAdmin = request.payload.role === 'siteAdmin' ? true : false;
      let providerAdmin = request.payload.role === 'providerAdmin' ? true : false;
      let contactAdmin = request.payload.role === 'contactAdmin' ? true : false;
      models.User.create({
          email: request.payload.email,
          username: request.payload.username,
          password: hash,
          siteAdmin: siteAdmin,
          providerAdmin: providerAdmin,
          contactAdmin: contactAdmin
        })
        .then((user) => {
          reply({
            id: user.id,
            email: user.email,
            username: user.username,
            roleFlags: userFunctions.getUserRoleFlags(user),
            id_token: createToken(user)
          }).code(201);
        })
        .catch((response) => {
          throw Boom.badRequest(response);
        });
    });
  },
  'authenticate': (request, reply) => {
    reply({
      id: request.pre.user.id,
      email: request.pre.user.email,
      username: request.pre.user.username,
      roleFlags: userFunctions.getUserRoleFlags(request.pre.user),
      id_token: createToken(request.pre.user)
    }).code(201);
  },
  'getAll': (request, reply) => {
    models.User.findAll({
        attributes: ['username', 'email', 'createdAt'],
        limit: 50,
        order: '"updatedAt" DESC'
      })
      .then((users) => {
        reply(users).code(200);
      });
  }
}

module.exports = users;
