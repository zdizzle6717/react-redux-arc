'use strict'

import axios from 'axios';

export default function(files, apiRoute, path) {
	let promises = [];
	files.forEach((file) => {
		let data = new FormData();
		let config = {
				onUploadProgress: function(progressEvent) {
					let percentCompleted = progressEvent.loaded / progressEvent.total;
				}
			}
		data.append('file', file);
		data.set('path', path);
		data.set('fileSize', file.size);
		promises.push(axios.post(apiRoute, data, config));
	});

	return axios.all(promises);
}
