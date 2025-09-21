const Configs =  require('#configs/openai');
const OpenAI = require('openai');

// Init client.
const openai = new OpenAI({
	apiKey: Configs.api.key
});


module.exports = {
	createResponseStream: _createResponseStream,
}

async function _createResponseStream(params) {
	const {
		model,
		messages,
		temperature,
	} = params;

	const responseStream = await openai.chat.completions.create({
		model: model ?? 'gpt-4o-mini',
		temperature: temperature ?? 1.1,
		messages: messages,
		stream: true,
		// Enables the usage field in the last chunk.
		stream_options: {
			include_usage: true
		}
	});

	return responseStream;
}
