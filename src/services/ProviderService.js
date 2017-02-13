'use strict';

import axios from 'axios';

function cleanData(data) {
	delete data.ProviderId;
	delete data.id;
	delete data.createdAt;
	delete data.updatedAt;
	return data;
}

export default {
	get: (id) => {
		return axios.get('/providers/' + id)
			.then(function(response) {
				return response.data;
			});
	},
	getAll: () => {
		return axios.get('/providers')
			.then(function(response) {
				return response.data;
			});
	},
	create: (data) => {
		return axios.post('/providers', data)
			.then(function(response) {
				return response.data;
			});
	},
	update: (id, data) => {
		data = cleanData(data);
		delete data.Contacts;
		return axios.put('/providers/' + id, data)
			.then(function(response) {
				return response.data;
			});
	},
	remove: (id) => {
		return axios.delete('/providers/' + id)
			.then(function(response) {
				return response.data;
			});
	}
};
