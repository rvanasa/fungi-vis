var fs = require('fs');
var childProcess = require('child_process');
var path = require('path');

var express = require('express');

function exec(command)
{
	return new Promise((resolve, reject) =>
	{
		var stream = childProcess.exec.call(this, command, (err, stdout) => err ? reject(err) : resolve(stdout));
		
		stream.stdout.on('data', data => process.stdout.write(data));
		stream.stderr.on('data', data => process.stderr.write(data));
	});
}

module.exports = function(Config, App, log)
{
	var repoPath = path.resolve('repo', 'fungi-lang.rust');
	var targetPath = path.join(repoPath, 'target');
	
	function loadExamples(force)
	{
		if(Config.examplePath)
		{
			var pathPromise = Promise.resolve(Config.examplePath);
		}
		else
		{
			pathPromise = exec(`git clone https://github.com/Adapton/fungi-lang.rust.git ${repoPath}`)
				.then(() => true)
				.catch(() => exec(`cd ${repoPath} && git pull`)
					.then(result => result.trim() !== 'Already up-to-date.'))
				.then(update =>
				{
					if(update || force)
					{
						log('Updating examples...');
						return exec(`cd ${repoPath} && cargo test`);
					}
					log('Skipped updating examples');
				})
				.catch(() => console.log('Failed to run all tests!'))
				.then(() => targetPath);
		}
		
		return pathPromise
			.then(path =>
			{
				App.get('/examples', (req, res) => res.json(fs.readdirSync(path).filter(f => f.endsWith('fgb'))))
				App.use('/examples', express.static(path));
			})
			.catch(err =>
			{
				console.error('Failed to update examples:');
				console.error(err.stack || err);
				// console.error('Retrying in 10 seconds...');
				// return Promise.delay(10 * 1000)
				// 	.then(() => loadExamples(true));
			});
	}
	
	return loadExamples(true);
}