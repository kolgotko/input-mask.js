'use strict';

class Corrector {

	constructor(input) {

		this._input = input;

		this._state = '';

		this._pattern = '';

		this._vars = {
			'X': '\\d',
		};

		this._events = {
			complete: new EventEmitter,
		};

		if (input.hasAttribute('data-pattern'))
			this._pattern = input.getAttribute('data-pattern');

		else if (input.hasAttribute('placeholder'))
			this._pattern = input.getAttribute('placeholder');

		if (input.hasAttribute('data-pattern-vars')) {

			let vars = input.getAttribute('data-pattern-vars');
			this._vars = this.strToVars(vars);

		}

		input.addEventListener('keydown', () => { this.keepState() } );
		input.addEventListener('input', () => {

			this.emulateInsert(this._input.value)

		});

		this.emulateInsert(this._input.value);

	}

	emulateInsert(value) {

		this._input.value = '';

		for (let i = 0; i != value.length; i++) {

			this.keepState();
			this._input.value += value[i];

			if (!this.correct()) return false;

		}
		if (this.isComplete()) this._events.complete.dispatch();

		this.keepState();
		return true;

	}

	strToVars(str) { return (new Function('return ' + str))(); }

	keepState() { this._state = this._input.value; }

	isOver() {

		let value = this._input.value;
		return this._pattern.length < value.length;

	}

	isComplete() {

		let value = this._input.value;
		return this._pattern.length == value.length;

	}

	correct() {

		let value = this._input.value;
		let symbol = value[value.length - 1];

		if (this.isOver()) {

			this._input.value = this._state;

			return false;

		}

		let pattern = this._pattern.slice(0, value.length);

		let exp = this.toRegExp(pattern);

		if (!value.match(exp)) {

			let item = this._pattern[value.length - 1];

			if (!(item in this._vars)) {

				let state = this._state.substr(0, value.length - 1);
				this._input.value = state + item;
				this.keepState();

				this._input.value += symbol;

				return this.correct();

			}
			else {

				this._input.value = this._state;

				return false;

			}

		}

		else return true;

	}

	toRegExp(pattern) {

		pattern = pattern.replace(/(\W)/g, '\\$1');

		for (let k in this._vars) {
			pattern = pattern.split(k).join(this._vars[k]);
		}

		return new RegExp(pattern);

	}

	setPattern(pattern) { this._pattern = pattern; }

	setVars(vars) { this._vars = vars; }

	on(name, handler) {
	
		if (!this._events[name])
		  this._events[name] = new this.EventEmitter;
	
		this._events[name].push(handler);
	
	}

}
