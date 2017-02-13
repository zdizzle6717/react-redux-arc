'use strict';

import ContactConstants from '../constants/ContactConstants';
import ContactService from '../services/ContactService';
import ProviderConstants from '../constants/ProviderConstants';
import ProviderService from '../services/ProviderService';
import SharedConstants from '../constants/SharedConstants';

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
	getProvidersAndContacts: () => {
		return (dispatch) => {
			dispatch(_initiateRequest(SharedConstants.INITIATE_REQUEST));
			return ProviderService.getAll().then((providers) => {
				dispatch(_returnResponse(ProviderConstants.GET_PROVIDERS, providers));
				return ContactService.getAll().then((contacts) => {
					dispatch(_returnResponse(ContactConstants.GET_CONTACTS, contacts));
				});
			});
		};
	}
}
