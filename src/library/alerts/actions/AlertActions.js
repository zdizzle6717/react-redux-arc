'use strict';

import AlertConstants from '../constants/AlertConstants';

let _alertTimeout = 5000;

const _addAlert = (alert) => {
	return {
		'type': AlertConstants.ADD_ALERT,
		'data': alert
	};
};

const _closeAlert = (alert) => {
	return {
		'type': AlertConstants.CLOSE_ALERT,
		'data': alert
	};
};

export default {
	addAlert: (alert) => {
		return (dispatch) => {
			dispatch(_addAlert(alert));
			if (alert.delay !== -1) {
				let delay = alert.delay ? alert.delay : _alertTimeout;
				setTimeout(() => {
					dispatch(_closeAlert(alert));
				}, delay);
			}
		};
	},
	closeAlert: (alert) => {
		return (dispatch) => {
			dispatch(_closeAlert(alert));
		};
	}
};
