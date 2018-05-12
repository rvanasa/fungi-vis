var sorcerer = require('..');

process.env.NODE_ENV = 'production';

console.log(':: Testing production:');
sorcerer(require('./sorcerer.config'), (err, Main) =>
{
	if(err) return console.error(err.stack || err);
	console.log(Main);
	
	console.log(':: Testing development:');
	sorcerer(require('./sorcerer.config'), 'development', 'Main');
});