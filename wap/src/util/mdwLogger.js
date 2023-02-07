import {
	EventEmitter
} from 'events';

let instance = null;

class MdwLogger {
	constructor() {
		if (!instance) {
			instance = this;
			instance.event = new EventEmitter();
			instance.event.on('middleware', ({
				req,
				name
			}) => {
				console.timeEnd(`${req.method} ${req.url} :  ${name}`);
			});
		}
		return instance;
	}

	wrap(fn, name) {
		const that = this;
		return function (req, res, next) {
			const fnName = fn.name || name;
			console.time(`${req.method} ${req.url} :  ${fnName}`);

			fn(req, res, function () {
				that.event.emit('middleware', {
					req,
					name: fn.name || name
				});
				next.apply(this, arguments);
			});
		};
	}
}

export default MdwLogger;