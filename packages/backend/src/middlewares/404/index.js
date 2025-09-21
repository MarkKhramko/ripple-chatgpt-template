module.exports = function notFoundMiddleware(req, res) {
	console.warn('🟠 404', req.url);

	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.end('Not found');
}