import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import AppRoutes from './components/AppRoutes';
import store from './store';

window.onload = () => {
    render(
        <Provider store={store}>
			<AppRoutes />
		</Provider>,
		document.getElementById('main')
	);
};
