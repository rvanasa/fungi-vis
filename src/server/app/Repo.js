var exec = Promise.promisify(require('child_process').exec);
var path = require('path');

module.exports = function(log)
{
	var prefix = `cd ${path.resolve('repo', 'fungi-lang.rust')}`;
	
	return exec(`${prefix} && git pull`)
		.then(result =>
		{
			if(result.trim() !== 'Already up-to-date.')
			{
				log('Updating examples...');
				return exec(`${prefix} && cargo test`);
			}
			log('Skipped: updating examples');
		})
		.catch(err => console.error('Failed to update examples:', err));
}