'use strict';

const getInput = (forms, formName, inputName) => {
	if (forms[formName]) {
		let index = forms[formName].inputs.findIndex((_input) => _input.name === inputName);
		if (index !== -1) {
			return forms[formName].inputs[index];
		}
	}
	return false;
}

export default getInput;
