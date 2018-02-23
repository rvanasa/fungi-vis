var argv = require('yargs').argv;

global.Promise = require('bluebird').Promise;

var config = require('./sorc.config');
var env = argv._[0] || 'prod';

config.argv = argv;

require('sorc')(config, env, (log, Server) =>
{
	log(`Server started successfully [${env}]`);
});