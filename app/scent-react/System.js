import React, { PropTypes } from 'react';
import Scent from 'scent';

export default class System extends React.Component {
	static contextTypes = {
		engine: PropTypes.instanceOf(Scent.Engine)
	};

	static propTypes = {
		static: PropTypes.bool,
		children: PropTypes.node
	};

	constructor(props, context) {
		super(props, context);

		var engine = context.engine;

		if (!props.static) {
			var self = this;
			engine.onUpdate(function() {
				if (self.shouldSystemUpdate()) {
					self.update.apply(self, arguments);
				}
			});
		}
	}

	get engine() {
		return this.context.engine;
	}

	/**
	 * First time setup before first update is run.
	 */
	systemWillStart() {

	}

	/**
	 * First time setup after first update has run.
	 */
	systemDidStart() {

	}

	/**
	 * Enable/disable system completely based on some state.
	 */
	shouldSystemUpdate() {
		return true;
	}

	/**
	 * Code before actual update.
	 */
	systemWillUpdate() {

	}

	/**
	 * Essentially just engine.onUpdate
	 *
	 * @param {number} timestamp
	 */
	update(timestamp) {

	}

	/**
	 * Code after the update.
	 */
	systemDidUpdate() {

	}

	/**
	 * cleanup before system is going to be removed
	 */
	systemWillEnd() {

	}

	/**
	 * Cleanup after the system has been removed
	 */
	systemDidEnd() {

	}

	/**
	 * React render placeholder
	 */
	render() {
		return false;
	}
}
