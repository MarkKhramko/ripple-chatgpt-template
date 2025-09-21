import EventEmitter from '#events/emitter.ts';

export type Message = {
	role: 'user' | 'assistant' | 'system';
	content: string;
};

export type SendMessageParams = {
	messages: Message[];
};

export function sendMessages({ messages }: SendMessageParams): EventEmitter {
	const streamEventsEmitter = new EventEmitter();

	// Send messages array to the server
	fetch('/api/chat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ messages }),
	}).then(async (response) => {
		if (!response.ok) {
			const err = new Error('Failed to send messages');
			streamEventsEmitter.emit('error', err);
			return;
		}
		streamEventsEmitter.emit('start_data_stream');

		try {
			const reader = response.body.getReader();
			const decoder = new TextDecoder('utf-8');

			// Collector string for the streamed response
			let fullResponseMessage = '';

			// Each chunk may contain one or more delta events (or none in some cases).
			// The stream does not guarantee that each chunk corresponds exactly to a single event.
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				buffer += chunk;

				// Each SSE is terminated by a double newline.
				let lines = buffer.split('\n');

				// Clean buffer for the next chunk.
				buffer = '';

				let eventName: string;

				for (let line of lines) {
					if (line.startsWith('event:')) {
						// If it's the last line, then the chunk is incomplete,
						// save buffer for the next chunk:
						if (lines[lines.length - 1] === line) {
							buffer += line;
							continue;
						}

						eventName = line.slice(6).trim();
						continue;
					}

					let parseError = null;

					if (line.startsWith('data:')) {
						const raw = line.slice(5).trim();
						if (raw === '[DONE]') {
							// Stream finished:
							const eventData = {
								full_message: fullResponseMessage,
							};
							streamEventsEmitter.emit('done', eventData);
							break;
						}

						let json;
						try {
							json = JSON.parse(raw);
						} catch (jsonParseError) {
							parseError = jsonParseError;
						}

						if (parseError === null) {
							// console.log('> parsed:', json);

							switch (eventName) {
								case 'conversation_info':
									const conversationId = json.id;
									streamEventsEmitter.emit('conversation_id', conversationId);
									continue;

								case 'delta':
									const text = json.v;
									fullResponseMessage += text;

									streamEventsEmitter.emit('message_delta', text);
									continue;

								case 'response_info':
									console.warn('[Chat]', eventName, json);
									continue;

								case 'error':
									const error = new Error(json.message);
									error.name = json.name;
									error.details = json.details;
									throw error;

								default:
									console.warn('[Chat]', 'SSE: uknown event', eventName, json);
									continue;
							}
						}
					}

					// Stream returned uncompleted line.
					// Save uncompleted info for the next chunk:
					if (eventName) {
						buffer += `event: ${eventName}\n`;
					}
					buffer += line;
				}
			}
		} catch (error) {
			streamEventsEmitter.emit('error', error);
			return;
		}
	});

	return streamEventsEmitter;
}
