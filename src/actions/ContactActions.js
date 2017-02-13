'use strict';

import ContactConstants from '../constants/ContactConstants';
import ContactService from '../services/ContactService';

const _initiateRequest = (type, data) => {
	return {
		'type': type,
		'data': data
	};
};
const _returnResponse = (type, data) => {
	return {
		'type': type,
		'data': data,
		'receivedAt': Date.now()
	};
};

export default {
	get: (id) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST, id));
			return ContactService.get(id).then((contact) => {
				dispatch(_returnResponse(ContactConstants.GET_CONTACT, contact));
				return contact;
			});
		}
	},
	getAll: () => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST));
			return ContactService.getAll().then((contacts) => {
				dispatch(_returnResponse(ContactConstants.GET_CONTACTS, contacts));
			});
		};
	},
	search: (criteria) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST));
			return ContactService.search(criteria).then((response) => {
				dispatch(_returnResponse(ContactConstants.GET_CONTACTS, response.results));
				return response.pagination;
			});
		}
	},
	create: (data) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST));
			return ContactService.create(data).then((contact) => {
				dispatch(_returnResponse(ContactConstants.CREATE_CONTACT, contact));
			});
		};
	},
	update: (id, data) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST));
			return ContactService.update(id, data).then((contact) => {
				dispatch(_returnResponse(ContactConstants.UPDATE_CONTACT, contact));
			});
		};
	},
	remove: (id) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ContactConstants.INITIATE_CONTACT_REQUEST, id));
			return ContactService.remove(id).then((response) => {
				dispatch(_returnResponse(ContactConstants.REMOVE_CONTACT, id));
			});
		};
	},
	filter: (contacts) => {
		return (dispatch) => {
			dispatch({
				'type': ContactConstants.FILTER_CONTACTS,
				'data': contacts
			})
		}
	}
};
