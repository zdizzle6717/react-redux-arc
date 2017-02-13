'use strict';

const getFormErrorCount = (forms, formName) => {
		let count = 0;
		if (!forms[formName]) {
				return 0;
		}
		forms[formName].inputs.forEach((input) => {
				if (input.valid === false) {
						count++;
				}
		});
		return count;
}

export default getFormErrorCount;
