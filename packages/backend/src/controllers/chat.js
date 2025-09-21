const ChatGPT = require('#services/chatGPT');

const { Readable } = require('stream');
const { createSSE } = require('#factories/sse');


module.exports = {
	handleChatRequest: _handleChatRequest
}

async function _handleChatRequest(req, res) {
	const output = {
		error: null,
		content: null
	}

	try {
		const {
			messages
		} = req.body;

		// console.log(messages);

		if (!Array.isArray(messages)) {
			output.error = {
				message: `argument 'messages' must be an array`
			}
			return res.json(406, output);
		}

		if (messages.length < 1) {
			output.error = {
				message: `argument 'messages' must have at least 1 message.`
			}
			return res.json(406, output);
		}

		// Server-Sent Event factory.
		const sse = createSSE(res);

		const params = {
			messages
		}
		const responseStream = await ChatGPT.createResponseStream(params);
		const readableStream = Readable.from(responseStream);
		
		let responseId;
		let fullResponseMessage = '';
		let usageInfo = {};

		readableStream.on('data', (chunk) => {
			const choice = chunk.choices[0];
			
			// Last chunk will have usage info,
			// keep it:
			if (chunk.usage) {
				responseId = chunk.id;
				usageInfo = { ...chunk.usage };
				return;
			}
			
			// Message finished.
			if (choice.finish_reason === 'stop') return;

			// No content container.
			if (!choice.delta) return;

			// Content might be undefined.
			const text = chunk.choices[0].delta.content ?? '';
			fullResponseMessage += text;

			// Send delta event to the client:
			if (text) {
				// v for value.
				sse.event('delta', { v: text });

				console.log(text);
			}
		});

		readableStream.on('end', () => {
			sse.event('response_info', { id: responseId, usage: usageInfo });
			sse.done();

			// console.log('\n\n', responseId);
			// console.log({ fullResponseMessage });
			// console.dir({ usageInfo });
		});

		readableStream.on('error', (error) => {
			console.error('[_handleChatRequest]', 'Streaming:', error);
			output.error = { message: error.message };
			res.json(500, output);
		});
	}
	catch(error) {
		console.error('[_handleChatRequest]', error);
		output.error = { message: error.message };
		res.json(500, output);
	}
}
