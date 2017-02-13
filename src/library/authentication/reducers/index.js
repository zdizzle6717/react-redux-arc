'use strict';

import UserConstants from '../constants/UserConstants';
import AuthenticationConstants from '../constants/AuthenticationConstants';
import RedirectConstants from '../constants/RedirectConstants';
import roleConfig from '../../../../roleConfig';

const user = (state = {}, action) => {
	switch (action.type) {
		case UserConstants.GET_USER:
			return Object.assign({}, state, action.data);
		case UserConstants.CREATE_USER:
			return Object.assign({}, state, action.data);
		case UserConstants.UPDATE_USER:
			return Object.assign({}, state, action.data);
		case UserConstants.REMOVE_USER:
			return {};
		case UserConstants.AUTHENTICATE_USER:
			return Object.assign({}, state, action.data);
		case UserConstants.LOGOUT_USER:
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
}

const users = (state = [], action) => {
	switch (action.type) {
		case UserConstants.GET_USERS:
			return [...action.data];
		default:
			return state;
	}
}

const isAuthenticated = (state = false, action) => {
	switch (action.type) {
		case AuthenticationConstants.SET_AUTHENTICATION:
			return action.data
		default:
			return state;
	}
};

const redirectRoute = (state = false, action) => {
	switch (action.type) {
		case RedirectConstants.SET_REDIRECT:
			return action.data
		default:
			return state;
	}
}

export {
	user,
	users,
	isAuthenticated,
	redirectRoute
};
