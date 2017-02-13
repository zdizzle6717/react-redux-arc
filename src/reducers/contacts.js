'use strict';

import ContactConstants from '../constants/ContactConstants';

const contact = (state = {}, action) => {
	switch (action.type) {
		case ContactConstants.GET_CONTACT:
			return Object.assign({}, state, action.data);
		case ContactConstants.CREATE_CONTACT:
			return Object.assign({}, state, action.data);
		case ContactConstants.UPDATE_CONTACT:
			return Object.assign({}, state, action.data);
		default:
			return state;
	}
};

const contacts = (state = [], action) => {
	switch (action.type) {
		case ContactConstants.GET_CONTACTS:
			return [...action.data];
		case ContactConstants.CREATE_CONTACT:
			return [
				...state,
				contact(undefined, action)
			];
		case ContactConstants.REMOVE_CONTACT:
			let contactArray = [...state];
			let index = state.findIndex((contact) => contact.id === action.data);
			if (index !== -1) {
				contactArray.splice(index, 1);
			}
			return contactArray;
		case ContactConstants.FILTER_CONTACTS:
			return [...action.data];
		default:
			return state;
	}
}

export {
	contact,
	contacts
};
