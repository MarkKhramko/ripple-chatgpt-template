module.exports = function withResponseMixins(res) {
	res.json = _json.bind(res);
	return res;
}

function _json (statusCode, data) {
	const json = JSON.stringify(data);
	// Get the data byte length in UTF-8.
	const length = Buffer.byteLength(json, 'utf8');
	this.writeHead(statusCode, {
		'Content-Type': 'application/json',
		'Content-Length': length
	});
	this.end(json);
};
