import ReactDOM from 'react-dom';
import React from 'react';
import Engine from 'scent-react/Engine';

import InputSystem from './systems/InputSystem';
import PhysicsSystem from './systems/PhysicsSystem';
import RenderSystem from './systems/RenderSystem';

document.addEventListener('DOMContentLoaded', () => {
	var canvas = document.getElementById('canvas');

	var engine = ReactDOM.render(
		<Engine canvas={canvas}>
			<InputSystem static={true} />
			<PhysicsSystem />
			<RenderSystem width={300} height={300} />
		</Engine>,
		document.getElementById('app')
	);

	engine.start();

	function render(timestamp) {
		requestAnimationFrame(render);
		engine.update(timestamp);
	}

	requestAnimationFrame(render);
});
