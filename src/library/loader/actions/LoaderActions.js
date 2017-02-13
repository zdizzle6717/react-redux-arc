'use strict';

import LoaderConstants from '../constants/LoaderConstants';

export default {
	showLoader: () => {
		return (dispatch) => {
			dispatch({
				'type': LoaderConstants.SHOW_LOADER
			})
		}
	},
	hideLoader: () => {
		return (dispatch) => {
			dispatch({
				'type': LoaderConstants.HIDE_LOADER
			})
		}
	}
};
