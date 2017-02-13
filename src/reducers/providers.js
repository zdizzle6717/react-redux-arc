'use strict';

import ProviderConstants from '../constants/ProviderConstants';

const provider = (state = {}, action) => {
	switch (action.type) {
		case ProviderConstants.GET_PROVIDER:
			return Object.assign({}, state, action.data);
		case ProviderConstants.CREATE_PROVIDER:
			return Object.assign({}, state, action.data);
		case ProviderConstants.UPDATE_PROVIDER:
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
};

const providers = (state = [], action) => {
	switch (action.type) {
		case ProviderConstants.GET_PROVIDERS:
			return [...action.data];
		case ProviderConstants.CREATE_PROVIDER:
			return [
				...state,
				provider(undefined, action)
			];
		case ProviderConstants.REMOVE_PROVIDER:
			let providerArray = [...state];
			let index = state.findIndex((provider) => provider.id === action.data);
			if (index !== -1) {
				providerArray.splice(index, 1);
			}
			return providerArray;
		case ProviderConstants.FILTER_PROVIDERS:
			return [...action.data];
		default:
			return state;
	}
};

export {
	provider,
	providers
};
