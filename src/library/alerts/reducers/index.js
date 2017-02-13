'use strict';

import AlertConstants from '../constants/AlertConstants';

const _removeAlert = (state, alert) => {
	let _alerts = [...state];
	let index = _alerts.findIndex((_alert) => _alert.id === alert.id);
	if (index !== -1) {
		_alerts.splice(index, 1);
	}
	return _alerts;
};

const alerts = (state = [], action) => {
	switch (action.type) {
		case AlertConstants.ADD_ALERT:
			action.data.id = Date.now();
			return [
				...state,
				action.data
			];
		case AlertConstants.CLOSE_ALERT:
			return _removeAlert(state, action.data);
		default:
			return state;
	}
};

export {
	alerts
};
