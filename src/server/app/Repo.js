var fs = require('fs');
var exec = Promise.promisify(require('child_process').exec);
var path = require('path');

var express = require('express');

module.exports = function(App, log)
{
	var repoPath = path.resolve('repo', 'fungi-lang.rust');
	var examplePath = path.join(repoPath, 'target');
	
	function loadExamples()
	{
		return exec(`git clone https://github.com/Adapton/fungi-lang.rust.git ${repoPath}`)
			.catch(() => exec(`cd ${repoPath} && git pull`))
			.then(result =>
			{
				if(result.trim() !== 'Already up-to-date.')
				{
					log('Updating examples...');
					return exec(`cd ${repoPath} && cargo test`);
				}
				log('Skipped updating examples');
			})
			.then(() =>
			{
				App.get('/examples', (req, res) => res.json(fs.readdirSync(examplePath).filter(f => f.endsWith('fgb'))))
				App.use('/examples', express.static(examplePath));
			})
			.catch(err =>
			{
				console.error('Failed to update examples:', err.stack || err);
				console.error('Retrying in 10 seconds...');
				return Promise.delay(10 * 1000)
					.then(loadExamples);
			})
	}
	
	return loadExamples();
}