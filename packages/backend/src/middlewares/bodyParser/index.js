
module.exports = function bodyParserMiddlewareInit() {
	return function bodyParserMiddleware(req, res, next) {
		return new Promise((resolve, reject) => {
			let body = '';
			req.on('data', chunk => {
				body += chunk;
			});

			req.on('end', () => {
				req.body = body ? JSON.parse(body) : {};
				next();
				return resolve();
			});

			req.on('error', (err) => {
				return reject(err);
			});
		});
	}
}
