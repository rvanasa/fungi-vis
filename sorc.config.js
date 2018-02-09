module.exports = {
    basePath: __dirname,
    verbose: 'dev',
    packages: [{
        path: '/src/app',
        env: ['dev', 'prod'],
    	eager: true,
    }, {
        path: '/src/lib',
    }, {
        env: 'dev',
        path: '/src/dev',
        eager: true,
    }],
};