(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Engine = require('scent-react/Engine');

var _Engine2 = _interopRequireDefault(_Engine);

var _InputSystem = require('./systems/InputSystem');

var _InputSystem2 = _interopRequireDefault(_InputSystem);

var _PhysicsSystem = require('./systems/PhysicsSystem');

var _PhysicsSystem2 = _interopRequireDefault(_PhysicsSystem);

var _RenderSystem = require('./systems/RenderSystem');

var _RenderSystem2 = _interopRequireDefault(_RenderSystem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
	var canvas = document.getElementById('canvas');

	var engine = _reactDom2.default.render(_react2.default.createElement(
		_Engine2.default,
		{ canvas: canvas },
		_react2.default.createElement(_InputSystem2.default, { 'static': true }),
		_react2.default.createElement(_PhysicsSystem2.default, null),
		_react2.default.createElement(_RenderSystem2.default, { width: 300, height: 300 })
	), document.getElementById('app'));

	engine.start();

	function render(timestamp) {
		requestAnimationFrame(render);
		engine.update(timestamp);
	}

	requestAnimationFrame(render);
});

});

require.register("scent-react/Engine.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _scent = require('scent');

var _scent2 = _interopRequireDefault(_scent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Engine = function (_React$Component) {
	_inherits(Engine, _React$Component);

	function Engine(props) {
		_classCallCheck(this, Engine);

		var _this = _possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this, props));

		var childTypes = _lodash2.default.omit(props, ['children']);
		childTypes.engine = _react.PropTypes.any;
		Engine.childContextTypes = _lodash2.default.mapValues(childTypes, function () {
			return _react.PropTypes.any;
		});

		_this.engine = new _scent2.default.Engine();
		return _this;
	}

	_createClass(Engine, [{
		key: 'getChildContext',
		value: function getChildContext() {
			var props = _lodash2.default.omit(this.props, ['children']);

			return _extends({
				engine: this.engine
			}, props);
		}
	}, {
		key: 'start',
		value: function start() {
			this.engine.start();
		}
	}, {
		key: 'update',
		value: function update() {
			this.engine.update.apply(this.engine, arguments);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				null,
				this.props.children
			);
		}
	}]);

	return Engine;
}(_react2.default.Component);

Engine.propTypes = {
	children: _react.PropTypes.node
};
Engine.childContextTypes = {
	engine: _react.PropTypes.instanceOf(_scent2.default.Engine)
};
exports.default = Engine;

});

require.register("scent-react/System.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _scent = require('scent');

var _scent2 = _interopRequireDefault(_scent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var System = function (_React$Component) {
	_inherits(System, _React$Component);

	function System(props, context) {
		_classCallCheck(this, System);

		var _this = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this, props, context));

		var engine = context.engine;

		if (!props.static) {
			var self = _this;
			engine.onUpdate(function () {
				if (self.shouldSystemUpdate()) {
					self.update.apply(self, arguments);
				}
			});
		}
		return _this;
	}

	_createClass(System, [{
		key: 'systemWillStart',


		/**
   * First time setup before first update is run.
   */
		value: function systemWillStart() {}

		/**
   * First time setup after first update has run.
   */

	}, {
		key: 'systemDidStart',
		value: function systemDidStart() {}

		/**
   * Enable/disable system completely based on some state.
   */

	}, {
		key: 'shouldSystemUpdate',
		value: function shouldSystemUpdate() {
			return true;
		}

		/**
   * Code before actual update.
   */

	}, {
		key: 'systemWillUpdate',
		value: function systemWillUpdate() {}

		/**
   * Essentially just engine.onUpdate
   *
   * @param {number} timestamp
   */

	}, {
		key: 'update',
		value: function update(timestamp) {}

		/**
   * Code after the update.
   */

	}, {
		key: 'systemDidUpdate',
		value: function systemDidUpdate() {}

		/**
   * cleanup before system is going to be removed
   */

	}, {
		key: 'systemWillEnd',
		value: function systemWillEnd() {}

		/**
   * Cleanup after the system has been removed
   */

	}, {
		key: 'systemDidEnd',
		value: function systemDidEnd() {}

		/**
   * React render placeholder
   */

	}, {
		key: 'render',
		value: function render() {
			return false;
		}
	}, {
		key: 'engine',
		get: function get() {
			return this.context.engine;
		}
	}]);

	return System;
}(_react2.default.Component);

System.contextTypes = {
	engine: _react.PropTypes.instanceOf(_scent2.default.Engine)
};
System.propTypes = {
	static: _react.PropTypes.bool,
	children: _react.PropTypes.node
};
exports.default = System;

});

require.register("systems/InputSystem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _System2 = require('scent-react/System');

var _System3 = _interopRequireDefault(_System2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputSystem = function (_System) {
	_inherits(InputSystem, _System);

	function InputSystem() {
		_classCallCheck(this, InputSystem);

		return _possibleConstructorReturn(this, (InputSystem.__proto__ || Object.getPrototypeOf(InputSystem)).apply(this, arguments));
	}

	_createClass(InputSystem, [{
		key: 'update',
		value: function update(timestamp) {
			console.log('input!');
		}
	}]);

	return InputSystem;
}(_System3.default);

exports.default = InputSystem;

});

require.register("systems/PhysicsSystem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _System2 = require('scent-react/System');

var _System3 = _interopRequireDefault(_System2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhysicsSystem = function (_System) {
	_inherits(PhysicsSystem, _System);

	function PhysicsSystem() {
		_classCallCheck(this, PhysicsSystem);

		return _possibleConstructorReturn(this, (PhysicsSystem.__proto__ || Object.getPrototypeOf(PhysicsSystem)).apply(this, arguments));
	}

	_createClass(PhysicsSystem, [{
		key: 'shouldSystemUpdate',
		value: function shouldSystemUpdate() {
			return false;
		}
	}, {
		key: 'update',
		value: function update(timestamp) {
			console.log('physics!');
		}
	}]);

	return PhysicsSystem;
}(_System3.default);

exports.default = PhysicsSystem;

});

require.register("systems/RenderSystem.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _System2 = require('scent-react/System');

var _System3 = _interopRequireDefault(_System2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenderSystem = function (_System) {
	_inherits(RenderSystem, _System);

	function RenderSystem(props, context) {
		_classCallCheck(this, RenderSystem);

		var _this = _possibleConstructorReturn(this, (RenderSystem.__proto__ || Object.getPrototypeOf(RenderSystem)).call(this, props, context));

		_this.canvas = context.canvas;

		/** @type {CanvasRenderingContext2D} */
		_this.ctx = context.canvas.getContext('2d');
		return _this;
	}

	_createClass(RenderSystem, [{
		key: 'update',
		value: function update(timestamp) {
			this.ctx.clearRect(0, 0, this.props.width, this.props.height);
			this.ctx.fillText(timestamp, 10, 10);
		}
	}]);

	return RenderSystem;
}(_System3.default);

RenderSystem.contextTypes = _extends({}, _System3.default.contextTypes, {
	canvas: _react.PropTypes.instanceOf(HTMLCanvasElement)
});
exports.default = RenderSystem;

});

require.alias("C:\Projects\github\scent\scent-react-brunch/app/scent-react", "scent-react");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map