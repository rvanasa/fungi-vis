var fs = require('fs');
var exec = Promise.promisify(require('child_process').exec);
var path = require('path');

var express = require('express');

module.exports = function(App, log)
{
	var repoPath = path.resolve('repo', 'fungi-lang.rust');
	var examplePath = path.join(repoPath, 'target');
	
	var prefix = `cd ${repoPath}`;
	
	return exec(`${prefix} && git pull`)
		.then(result =>
		{
			if(result.trim() !== 'Already up-to-date.')
			{
				log('Updating examples...');
				return exec(`${prefix} && cargo test`);
			}
			log('Skipped updating examples');
		})
		.then(() =>
		{
			App.get('/examples', (req, res) => res.json(fs.readdirSync(examplePath).filter(f => f.endsWith('fgb'))))
			App.use('/examples', express.static(examplePath));
		})
		.catch(err => console.error('Failed to update examples:', err.stack || err));
}