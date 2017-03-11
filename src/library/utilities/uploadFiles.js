'use strict'

import axios from 'axios';

export default function(files, apiRoute = '/files', path = '', moreInfo) {
	let promises = [];
	files.forEach((file) => {
		let data = new FormData();
		let config = {
				'onUploadProgress': function(progressEvent) {
					let percentCompleted = progressEvent.loaded / progressEvent.total;
				}
			};
		data.append('file', file);
		data.set('path', path);
		data.set('fileSize', file.size);
		if (moreInfo) {
			for (let prop in moreInfo) {
				data.set(prop, moreInfo[prop]);
			}
		}
		promises.push(axios.post(apiRoute, data, config));
	});

	return axios.all(promises);
}
