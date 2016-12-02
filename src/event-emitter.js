'use strict';

class EventEmitter {

	constructor() {

		this._queue = [];

	}

	dispatch() {

		for(var i = 0; i != this._queue.length; i++)
			this._queue[i].apply(this, arguments);

	}

	push(handler) {

		this._queue.push(handler);
		return this;

	}

	clear() {

		this._queue = [];

	}

}
