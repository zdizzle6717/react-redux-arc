# react-redux-arch
This is a universal javascript (server-side rendering) app architecture built with react/redux

sudo npm install

install mysql, create a database and add username, password, database, host to /server/config/config.json

create an envVariables.js file in the root directory (example below)

<pre>
'use strict';

module.exports = {
	'clientPort': 3000,
	'port': 3030,
	'uploadPath': '/var/www/html/react/dist/uploads/',
	'secret': 'SECRETS_SECRETS_ARE_NO_FUN'
}

module.exports = envVariables;
</pre>

sudo npm install forever -g

sudo npm run build-prod

sudo npm run start-server

sudo npm run start-client

navigate to localhost:3000
