'use strict';

import ProviderConstants from '../constants/ProviderConstants';
import ProviderService from '../services/ProviderService';

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
			dispatch(_initiateRequest(ProviderConstants.INITIATE_PROVIDER_REQUEST, id));
			return ProviderService.get(id).then((provider) => {
				dispatch(_returnResponse(ProviderConstants.GET_PROVIDER, provider));
				return provider;
			});
		}
	},
	getAll: () => {
		return (dispatch, getState) => {
			dispatch(_initiateRequest(ProviderConstants.INITIATE_PROVIDER_REQUEST));
			return ProviderService.getAll().then((providers) => {
				dispatch(_returnResponse(ProviderConstants.GET_PROVIDERS, providers));
			});
		};
	},
	create: (data) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ProviderConstants.INITIATE_PROVIDER_REQUEST));
			return ProviderService.create(data).then((provider) => {
				dispatch(_returnResponse(ProviderConstants.CREATE_PROVIDER, provider));
			});
		};
	},
	update: (id, data) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ProviderConstants.INITIATE_PROVIDER_REQUEST));
			return ProviderService.update(id, data).then((provider) => {
				dispatch(_returnResponse(ProviderConstants.UPDATE_PROVIDER, provider));
			});
		};
	},
	remove: (id) => {
		return (dispatch) => {
			dispatch(_initiateRequest(ProviderConstants.INITIATE_PROVIDER_REQUEST, id));
			return ProviderService.remove(id).then((response) => {
				dispatch(_returnResponse(ProviderConstants.REMOVE_PROVIDER, id));
			});
		};
	},
	filter: (data) => {
		return (dispatch) => {
			dispatch({
				'type': ProviderConstants.FILTER_PROVIDERS,
				'data': data
			})
		}
	}
};
