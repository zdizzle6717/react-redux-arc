'use strict';

import LoaderConstants from '../constants/LoaderConstants';

const loader = (state = false, action) => {
	switch (action.type) {
		case LoaderConstants.SHOW_LOADER:
			return true;
		case LoaderConstants.HIDE_LOADER:
			return false;
		default:
			return state;
	}
};

export {
	loader
};
