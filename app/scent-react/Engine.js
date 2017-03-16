import React, { PropTypes } from 'react';
import _ from 'lodash';
import Scent from 'scent';

export default class Engine extends React.Component {
	static propTypes = {
		children: PropTypes.node
	};

	static childContextTypes = {
		engine: PropTypes.instanceOf(Scent.Engine)
	};

	constructor(props) {
		super(props);

		var childTypes = _.omit(props, ['children']);
		childTypes.engine = PropTypes.any;
		Engine.childContextTypes = _.mapValues(childTypes, () => PropTypes.any);

		this.engine = new Scent.Engine();
	}

	getChildContext() {
		var props = _.omit(this.props, ['children']);

		return {
			engine: this.engine,
			...props
		};
	}

	start() {
		this.engine.start();
	}

	update() {
		this.engine.update.apply(this.engine, arguments);
	}

	render() {
		return <div>{this.props.children}</div>;
	}
}
