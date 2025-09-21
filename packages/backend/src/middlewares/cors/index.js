/*
 * A barebones CORS setter.
 * Please edit, if you need a more sofisticated CORS control.
 * 
 */
module.exports = function corsMiddlewareInit({ origin, methods, contentType }) {
	return function corsMiddleware(req, res, next) {
		const headers = [];

		if (!origin || origin === '*') {
			// allow any origin:
			headers.push({
				key: 'Access-Control-Allow-Origin',
				value: '*'
			});
		}

		if (!methods || methods === 'all') {
			// allow all methods:
			headers.push({
				key: 'Access-Control-Allow-Methods',
				value: 'GET, POST, PUT, DELETE, OPTIONS'
			});
		}

		if (contentType) {
			headers.push({
				key: 'Access-Control-Request-Headers',
				value: 'content-type'
			})
		}

		_applyHeaders(res, headers);
		next();
	}
}

function _applyHeaders(res, headers) {
	for (let i = 0; i < headers.length; i++) {
		const header = headers[i];

		console.log({ header });

		if (!header) {
			continue;
		}

		if (Array.isArray(header)) {
			_applyHeaders(header, res);
		} else if (header.value) {
			res.setHeader(header.key, header.value);
		}
	}
}
