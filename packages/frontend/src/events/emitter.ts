export default class EventEmitter {
	callbacks: {};

	constructor() {
		this.callbacks = {};
	}

	on(event: string, cb: (data?: any) => void) {
		if (!this.callbacks[event]) {
			this.callbacks[event] = [];
		}

		this.callbacks[event].push(cb);
	}

	emit(event: string, data?: any) {
		const callbacks = this.callbacks[event];
		if (callbacks) {
			callbacks.forEach((cb) => cb(data));
		}
	}
}
