'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import rootReducer from '../src/reducers';
import routes from '../src/routes';
import routeConfig from './routeConfig';
import envVariables from '../envVariables';
import NotFoundPage from '../src/components/pages/NotFoundPage';
const loggerMiddleware = createLogger();

// Initialize the server and configure support for handlebars templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname + '/../dist/')));

// Universal routing and rendering for SEO
for (let i in routeConfig) {
    let routePath = routeConfig[i].route;
    let routeView = routeConfig[i].view;

    app.get(routePath, (req, res) => {
        match({
            routes,
            location: req.url
        }, (err, redirectLocation, renderProps) => {
			if (err) {
				return res.status(500).send(err.message);
			}

			if (redirectLocation) {
				return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			}

			const components = renderProps.components;

			const Comp = components[components.length - 1].WrappedComponent
    		const fetchData = (Comp && Comp.fetchData) || (() => Promise.resolve());

			const initialState = {};
			const store = createStore(
				rootReducer,
				initialState,
				applyMiddleware(
					thunkMiddleware, // let's us dispatch functions
					loggerMiddleware // middleware that logs actions (development only)
				)
			);
			const { location, params, history } = renderProps;

			fetchData({ store, location, params, history }).then(() => {
				let markup;
	            if (renderProps) {
	                markup = renderToString(
						<Provider store={store}>
						  <RouterContext {...renderProps} />
						</Provider>
					);
	            } else {
	                markup = renderToString(
						<Provider store={store}>
							<NotFoundPage/>
						</Provider>
					);
	                res.status(404);
	            }

				const state = JSON.stringify(store.getState());

				return res.render(routeView, {markup, state});
			}).catch((err) => {
				console.warn(err);
				let markup = '';
				const state = JSON.stringify({});
				return res.render('notFound', {markup, state})
			});
        });
    });
}

// For any route not configured, render the 404 not found page and view
app.get('*', (req, res) => {
	match({
		routes,
		location: req.url
	}, (err, redirectLocation, renderProps) => {
		if (err) {
			return res.status(500).send(err.message);
		}

		if (redirectLocation) {
			return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
		}

		const components = renderProps.components;

		const Comp = components[components.length - 1].WrappedComponent
		const fetchData = (Comp && Comp.fetchData) || (() => Promise.resolve());

		const initialState = {};
		const store = createStore(
			rootReducer,
			initialState,
			applyMiddleware(
				thunkMiddleware, // let's us dispatch functions
				loggerMiddleware // middleware that logs actions (development only)
			)
		);
		const { location, params, history } = renderProps;

		fetchData({ store, location, params, history }).then(() => {
			let markup = renderToString(
				<Provider store={store}>
					<NotFoundPage/>
				</Provider>
			);
			res.status(404);

			const state = JSON.stringify(store.getState());

			return res.render('notFound', {markup, state});
		}).catch((err) => {
			console.warn(err);
			let markup = '';
			const state = JSON.stringify({});
			return res.render('notFound', {markup, state})
		});
	});
});

// Start the server
let port = envVariables.clientPort;
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port}`);
});
