'use strict';

import {browserHistory} from 'react-router';
import axios from 'axios';
import {AlertActions} from './library/alerts';
import {LoaderActions} from './library/loader';
import {UserActions} from './library/authentication';
import store from './store';

let timer;
let numLoadings = 0;
let _timeout = 350;

const initInterceptors = (baseUrl = 'http://localhost:8000/api/', timeout = _timeout) => {

	// Global axios config
	axios.defaults.baseURL = baseUrl;

	// Global axios interceptor
	axios.interceptors.request.use((config) => {

		let token = store.getState().user.id_token;

		if (token) {
		    config.headers.authorization = 'Bearer ' + token;
		}

		numLoadings++;

		if (numLoadings < 2) {
			timer = setTimeout(() => {
				store.dispatch(LoaderActions.showLoader());
			}, timeout);
		}

	    return config;
	});
	axios.interceptors.response.use((response) => {
		if (numLoadings === 0) { return response; }

		if (numLoadings < 2) {
			clearTimeout(timer);
			store.dispatch(LoaderActions.hideLoader());
		}
		numLoadings--;

	  return response;
	}, (error) => {
		if (error.response) {
			if (error.response.status == 401 || error.response.data.statusCode == 401) {
				store.dispatch(UserActions.logout());
				AlertActions.addAlert({
					title: 'Not Authorized',
					message: 'Redirected: You do not have authorization to view this content or your session has expired. Please login to continue.',
					type: 'error',
					delay: 3000
				});
				browserHistory.push('/login');
			}
		}

		if (numLoadings === 0) {
			return Promise.reject(error.response.data);
		}

		if (numLoadings < 2) {
			clearTimeout(timer);
			store.dispatch(LoaderActions.hideLoader());
		}
		numLoadings--;

		return Promise.reject(error.response.data);
	});
};

export default initInterceptors;
