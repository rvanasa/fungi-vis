module.exports = {
    basePath: __dirname + '/src',
    verbose: 'dev',
    packages: [{
        path: '/server/app',
        env: ['dev', 'prod'],
    	eager: true,
    }, {
        path: '/server/lib',
    }, {
        env: 'dev',
        path: '/server/dev',
        eager: true,
    }],
};