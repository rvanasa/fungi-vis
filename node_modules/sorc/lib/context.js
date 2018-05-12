'use strict'

var async = require('async');
var colors = require('colors');
var getParamNames = require('get-parameter-names');

var Resource = require('./resource');

module.exports = class Context
{
	constructor(config, env)
	{
		this.config = config;
		this.env = env;
		
		this.resources = {};
		this.listeners = {};
		
		if(typeof config.verbose === 'string')
		{
			this.verbose = config.verbose === env;
		}
		else if(Array.isArray(config.verbose))
		{
			this.verbose = ~config.verbose.indexOf(env);
		}
		else
		{
			this.verbose = !!config.verbose;
		}
	}
	
	listen(id, resource)
	{
		var array = this.listeners[id] || (this.listeners[id] = []);
		array.push(resource);
	}
	
	notify(id, done)
	{
		var resource = this.resources[id];
		if(!resource)
		{
			var err = new Error('Resource not found: `' + id + '`');
			if(done) return done(err);
			else throw err;
		}
		
		this.log('=> ' + resource.getName());
		
		var resources = this.listeners[id];
		if(resources)
		{
			async.map(resources, (resource, cb) => resource.request(this, cb), done);
		}
		else if(done)
		{
			done(null);
		}
	}
	
	find(id, done)
	{
		if(!this.resources[id])
		{
			return done(new Error('Resource not found: `' + id + '`'));
		}
		return this.resources[id].request(this, done);
	}
	
	invoke(fn, params, done)
	{
		params = params || getParamNames(fn);
		async.map(params, (param, cb) => this.find(param, cb), (err, values) =>
		{
			if(err)
			{
				if(!done) throw err;
				return done(err);
			}
			
			var result = fn.apply(this, values);
			if(done)
			{
				done(err, result);
			}
		});
	}
	
	register(id, path, value, isDecorator)
	{
		var resource = new Resource(id, path, this.createHandle(value));
		this.addResource(resource, isDecorator);
	}
	
	createHandle(value)
	{
		return typeof value === 'function' ? value : () => value;
	}
	
	addResource(resource, isDecorator)
	{
		var prev = this.resources[resource.id];
		if(prev)
		{
			this.log(prev.getName() + ' >> ' + resource.getName());
		}
		
		this.resources[resource.id] = resource;
		if(isDecorator)
		{
			for(var i = 0; i < resource.params.length; i++)
			{
				this.listen(resource.params[i], resource);
			}
		}
		// this.log((isDecorator ? '*' : '+') + ' `' + resource.id + '`');
		return resource;
	}
	
	log(message)
	{
		if(this.verbose)
		{
			console.log(colors.cyan(message));
		}
	}
}