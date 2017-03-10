'use strict';

import models from '../../models';
import fse from 'fs-extra';
import env from '../../../envVariables.js';
import Boom from 'boom';

// File Upload Route Configs
let files = {
  'create': (request, reply) => {
    let data = request.payload;
		if (!data.path || !data.fileSize) {
			reply(Boom.badRequest(`A 'path' and 'fileSize' attribute must be appended to the FormData object`));
		} else if (data.file) {
      let fileName = Date.now() + '-' + data.file.hapi.filename;
			let location = __dirname + '/../../..' + env.uploadPath + data.path;
			let path = location + fileName;
			fse.ensureFile(path, (err) => {
				if (err) {
					reply(Boom.notAcceptable('ensureFile: ' + err));
					return;
				}

				let file = fse.createWriteStream(path);
				file.on('error', (err) => {
					reply(Boom.notAcceptable(err));
				});

				data.file.pipe(file);

				data.file.on('end', (err) => {
					if (err) {
						reply(Boom.notAcceptable('error on file end: ' + err));
						return;
					}

					let response = {
						'file': {
							'name': fileName,
							'size': data.fileSize,
							'type': data.file.hapi.headers['content-type']
						},
						'headers': data.file.hapi.headers,
						'status': 200,
						'statusText': 'File uploaded successfully!'
					};
					fse.chown(location, env.serverUID, env.serverGID, (err) => {
						if (err) {
							reply(Boom.notAcceptable('chown: ' + err));
							return;
						}
						fse.chmod(location, '0775', (err) => {
							if (err) {
								reply(Boom.notAcceptable('chown: ' + err));
								return;
							}
							reply(JSON.stringify(response));
						});
					});
				});
			});
    } else {
      let response = {
        'filename': data.file.hapi.filename,
        'headers': data.file.hapi.headers,
        'status': 400,
        'statusText': 'There was an error uploading your file. Max sure the dimensions are 800px by 530px.'
      };
      reply(JSON.stringify(response));
    }
  }
};

module.exports = files;
