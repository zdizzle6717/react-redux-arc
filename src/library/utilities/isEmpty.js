'use strict';

const isEmpty = (objOrArray) => {
	if (Array.isArray(objOrArray)) {
		if (objOrArray.length === 0) {
			return true;
		} else {
			return false;
		}
	}
	if (Object.keys(objOrArray).length === 0 && objOrArray.constructor === Object) {
		return true;
	}

	return false;
}

export default isEmpty;
