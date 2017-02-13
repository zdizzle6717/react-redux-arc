'use strict';

import FormConstants from '../constants/FormConstants';

export default {
	addInput: (input) => {
		return (dispatch) => {
			dispatch({
				'type': FormConstants.ADD_INPUT,
				'data': input
			});
		};
	},
	removeInput: (input) => {
		return (dispatch) => {
			dispatch({
				'type': FormConstants.REMOVE_INPUT,
				'data': input
			});
		};
	},
	resetForm: (formName) => {
		return (dispatch) => {
			dispatch({
				'type': FormConstants.RESET_FORM,
				'data': formName
			})
		}
	},
	resetAllForms: () => {
		return (dispatch) => {
			dispatch({
				'type': FormConstants.RESET_ALL_FORMS
			});
		}
	}
};
