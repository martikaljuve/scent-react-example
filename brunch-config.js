module.exports = {
	files: {
		javascripts: {
			joinTo: {
				'vendor.js': /^(?!app)/,
				'app.js': /^app/
			}
		},
		stylesheets: { joinTo: 'app.css' }
	},

	plugins: {
		babel: {
			presets: ['latest', 'react'],
			plugins: [
				'transform-class-properties',
				'transform-object-rest-spread',
			]
		}
	},

	npm: {
		aliases: {
			"scent-react": __dirname + "/app/scent-react"
		}
	}
};
