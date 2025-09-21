// Middlewares:
const bodyParser = require('#middlewares/bodyParser');
const notFound = require('#middlewares/404');

// Controllers:
const ChatController = require('#controllers/chat');


module.exports = async function (req, res) {
	const router = new Router();
	router.before(bodyParser());
	router.on('GET /api', (req, res) => res.json(200, 'Hello world!'));
	router.on('POST /api/chat', ChatController.handleChatRequest);
	await router.handle(req, res);
}

function Router() {
	this.middlewares = [];

	const _before = (middleware) => {
		this.middlewares.push(middleware);
	}

	const _on = (methodAndPath, handler) => {
		const [method, path] = methodAndPath.split(' ');

		this.middlewares.push({
			type: 'route',
			rule: async (req, res, next) => {
				let routeMatched = false;

				if (req.method === method && (req.url === path || path === '*')) {
					routeMatched = true;
					await handler(req, res);
				} else {
					await next();
				}

				return Promise.resolve(routeMatched);
			}
		});
	}

	const _handle = async (req, res) => {
		let routeMatched = false;
		let middlewareIndex = 0;
		
		const next = async () => {
			try {
				const middleware = this.middlewares[middlewareIndex++];

				if (middleware?.type === 'route' && !routeMatched) {
					const routeHandler = middleware.rule;
					routeMatched = await routeHandler.call(this, req, res, next);
				}
				else if (typeof middleware === 'function') {
					await middleware(req, res, next);
				}
				// If all middlewares fired:
				else if (middlewareIndex === this.middlewares.length) {
					if (!routeMatched) {
						await notFound(req, res);
					}
				}

				return Promise.resolve();
			} catch (error) {
				return Promise.reject(error);
			}
		}

		try {
			await next();
		}
		catch(error) {
			console.error('[Router]', error);
			const output = { error: { message: error.message } };
			res.json(500, output);
			return Promise.resolve();
		}
	}

	return {
		before: _before,
		on: _on,
		handle: _handle,
	}
}
