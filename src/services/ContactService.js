'use strict';

import axios from 'axios';

function cleanData(data) {
	delete data.id;
	delete data.ContactId;
	delete data.createdAt;
	delete data.updatedAt;
	return data;
}

export default {
	get: (id) => {
		return axios.get('/contacts/' + id)
			.then(function(response) {
				return response.data;
			});
	},
	getAll: () => {
		return axios.get('/contacts')
			.then(function(response) {
				return response.data;
			});
	},
	search: (criteria) => {
		return axios.post('/contacts/search', criteria)
			.then(function(response) {
				return response.data;
			});
	},
	searchSuggestions: (criteria) => {
		return axios.post('/contacts/search/suggestions', criteria)
			.then(function(response) {
				return response.data;
			});
	},
	create: (data) => {
		return axios.post('/contacts', data)
			.then(function(response) {
				return response.data;
			});
	},
	update: (id, data) => {
		data = cleanData(data);
		data.Files[0] = cleanData(data.Files[0]);
		delete data.Provider;
		delete data.ProviderId;
		return axios.put('/contacts/' + id, data)
			.then(function(response) {
				return response.data;
			});
	},
	remove: (id) => {
		return axios.delete('/contacts/' + id)
			.then(function(response) {
				return response.data;
			});
	}
};
