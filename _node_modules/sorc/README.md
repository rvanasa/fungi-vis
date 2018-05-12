## A super straightforward Inversion of Control (IoC) framework.
#### Similar to the Java Spring Framework, but conducive to the NodeJS ecosystem.

#### Example Project Layout
```
- src
  - App.js
  - Config.js
  - util
    - Decorator.js
- index.js
- sorcerer.config.js
```

#### /src/App.js
```js
// all files in the provided directory use this general format
module.exports = function(Config)
{
	var app = {};
	console.log('Initialize some sort of app here');
	return app;
}
```

#### /src/Config.js
```js
module.exports = {
	whateverYouWantHere: 'yeah'
}
```

#### /src/util/Decorator.js
```js
module.exports = function(App)
{
	// this will evaluate since it is referencing an active resource
	App.name = 'Decorated App';
}
```

#### /sorcerer.config.js
```js
module.exports = {
	basePath: __dirname, // default: execution directory
	verbose: true, // default: false (you can use strings/arrays to allow verbosity in specific environments)
	packages: [{
		env: 'production', // use specified env (process.env.NODE_ENV by default)
		path: '/src', // you can also just pass the path string instead of a config object
	}, {
		name: 'globals', // optional
		include: { // note that you can use both `path` and `include` in the same package
			Config: () => 'Some example resource',
		},
	}],
};
```

#### /index.js
```js

// simple example (no config object)
require('sorc')(__dirname + '/src', 'App');


// using externalized config
var config = require('./sorcerer.config');

// configure a directory
require('sorc')(config, (App) =>
{
	// You can use any file as an entry point
	console.log(App);
});

// or, configure a directory with a specified environment
require('sorc')(config, 'test', (App, Config) =>
{
	console.log(App, Config);
});

// or, configure a directory with error handling
require('sorc')(config, (err, App) =>
{
	if(err) return console.error(err);
	
	console.log(App);
});
```