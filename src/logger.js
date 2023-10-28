export class Logger {
	
	level = 1;
	logFunction = console.log || new function() {};
	className = null;

	constructor(className, level) {
		this.className = className;
		if (level !== undefined) {
			this.level = level;
		}
	}

	setLevel(level) {
		this.level = level;
	}

	debug() {
		if (this.level <= Logger.Levels.DEBUG) {
			[].unshift.apply(arguments,['[DEBUG]', Logger.getDate(), '-']);
			this.logFunction.apply(window.console, arguments);
		}
	}

	info() {
		if (this.level <= Logger.Levels.INFO) {
			[].unshift.apply(arguments,['[INFO ]', Logger.getDate(), '-']);
			this.logFunction.apply(window.console, arguments);
		}
	}

	warn() {
		if (this.level <= Logger.Levels.WARN) {
			[].unshift.apply(arguments,['[WARN ]', Logger.getDate(), '-']);
			this.logFunction.apply(window.console, arguments);
		}
	}

	error() {
		if (this.level <= Logger.Levels.ERROR) {
			[].unshift.apply(arguments,['[ERROR]', Logger.getDate(), '-']);
			this.logFunction.apply(window.console, arguments);
		}
	}

	fatal() {
		if (this.level <= Logger.Levels.FATAL) {
			[].unshift.apply(arguments,['[FATAL]', Logger.getDate(), '-']);
			this.logFunction.apply(window.console, arguments);
		}
	}

	static Levels = {
		NONE	: 0,
		DEBUG 	: 1,
		INFO 	: 2,
		WARN 	: 3,
		ERROR 	: 4,
		FATAL 	: 5
	};

	static loggers = { '_rootLogger' : new Logger(null, Logger.Levels.DEBUG) };

	static getLogger(className, level) {
		let logger = null;
		if (!className) {
			return Logger.loggers['_rootLogger'];
		}
		if(Logger.loggers[className]) {
			logger = Logger.loggers[className];
			if (level !== undefined) {
				logger.setLevel(level);
			}
		} else {
			logger = new Logger(className, level);
			Logger.loggers[className] = logger;
		}
		return logger;
	};

	static getDate = function() {
		const now = new Date();
		let h = now.getHours();
		if (h < 10) h = "0" + h;
		let m = now.getMinutes();
		if (m < 10) m = "0" + m;
		let s = now.getSeconds();
		if (s < 10) s = "0" + s;
		let t = now.getMilliseconds();
		t = (t < 10) ? "00" + t : (t < 100) ? "0" + t : t;
		return h + ':' + m + ':' + s + '.' + t;
	}
}