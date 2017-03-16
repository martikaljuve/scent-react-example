import System from 'scent-react/System';

export default class PhysicsSystem extends System {
	shouldSystemUpdate() {
		return false;
	}

	update(timestamp) {
		console.log('physics!');
	}
}
