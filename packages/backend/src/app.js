// Env:
require('../configs/alias');
require('#configs/env');

// Configs & constants:
const ServerConfigs = require('#configs/server');

// Mixins for easier response handling:
const withResponseMixins = require('#mixins/response');

const http = require('http');
const Router = require('./router');


const server = http.createServer(async (req, res) => {
	withResponseMixins(res);
	await Router(req, res);
});


server.listen(ServerConfigs.port, () => {
	console.log(`Server running at http://localhost:${ServerConfigs.port}/`);
});
