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
      let name = Date.now() + '-' + data.file.hapi.filename;
			let path = __dirname + '/../../..' + env.uploadPath + data.path + name;
			fse.ensureFile(path, (err) => {
				if (err) {
					console.log(err);
					reply().code(404);
				} else {
					let file = fse.createWriteStream(path);
					file.on('error', (err) => {
		        console.error(err);
		      });

					data.file.pipe(file);

		      data.file.on('end', (err) => {
		        let response = {
		          'file': {
		            'name': name,
		            'size': data.fileSize,
		            'type': data.file.hapi.headers['content-type']
		          },
		          'headers': data.file.hapi.headers,
		          'status': 200,
		          'statusText': 'File uploaded successfully!'
		        };
		        reply(JSON.stringify(response));
	      	});
				}
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
