/*
 * Server-Sent Event factory
 */


module.exports = {
	createSSE: _createSSE
}

function _createSSE(res) {
	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache'

		// WARNING!
		// Never put keep-alive header!
		// HTTP/2 does not allow this header.
		// https://github.com/mdn/browser-compat-data/issues/6154
		// 'Connection': 'keep-alive',
	};
	res.writeHead(200, headers);

	return {
		/**
		 * Send data to the client.
		 * @param {Object|string} data - The data to send (JSON object or string).
		 */
		data(data) {
			if (typeof data === 'object') {
				data = JSON.stringify(data);
			}
			res.write(`data: ${data}\n\n`);
		},

		/**
		 * Send an event with a custom event name.
		 * @param {string} event - Event name.
		 * @param {Object|string} data - The data to send (JSON object or string).
		 */
		event(event, data) {
			if (typeof data === 'object') {
				data = JSON.stringify(data);
			}
			res.write(`event: ${event}\ndata: ${data}\n\n`);
		},

		/**
		 * Send a comment (non-parsed data) to keep the connection alive.
		 * @param {string} comment - The comment to send.
		 */
		comment(comment) {
			res.write(`: ${comment}\n\n`);
		},

		/**
		 * Close the SSE connection.
		 */
		done() {
			res.write('data: [DONE]\n\n');
			res.end();
		},
	};
}
