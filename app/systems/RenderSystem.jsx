import { PropTypes } from 'react';
import System from 'scent-react/System';

export default class RenderSystem extends System {
	static contextTypes = {
		...System.contextTypes,
		canvas: PropTypes.instanceOf(HTMLCanvasElement)
	}

	constructor(props, context) {
		super(props, context);

		this.canvas = context.canvas;

		/** @type {CanvasRenderingContext2D} */
		this.ctx = context.canvas.getContext('2d');
	}

	update(timestamp) {
		this.ctx.clearRect(0, 0, this.props.width, this.props.height);
		this.ctx.fillText(timestamp, 10, 10);
	}
}
