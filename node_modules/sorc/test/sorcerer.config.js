module.exports = {
	basePath: __dirname,
	verbose: ['production'],
	packages: ['/lib', {
		env: 'production',
		path: '/context',
	}, {
		env: 'development',
		path: '/dev',
	}, {
		path: '/patch',
		decorate: true,
	}, {
		name: 'globals',
		include: {
			Provided: () => 'PROVIDED',
		},
	}],
};