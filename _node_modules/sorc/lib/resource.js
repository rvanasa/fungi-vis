'use strict'

var path = require('path');

var getParamNames = require('get-parameter-names');

module.exports = class Resource
{
	constructor(id, pkg, handle)
	{
		this.id = id;
		this.pkg = pkg;
		this.handle = handle;
		this.params = getParamNames(handle);
		
		this.callbacks = [];
		this.loading = false;
		this.loaded = false;
		this.value = undefined;
	}
	
	request(context, done)
	{
		if(!this.loaded) 
		{
			if(done)
			{
				this.callbacks.push(done);
			}
			
			if(!this.loading)
			{
				this.loading = true;
				context.invoke(this.handle, this.params, (err, value) =>
				{
					this.loading = false;
					if(err)
					{
						for(var i = 0; i < this.callbacks.length; i++)
						{
							this.callbacks[i](err);
						}
					}
					else
					{
						this.loaded = true;
						this.value = value;
						for(i = 0; i < this.callbacks.length; i++)
						{
							this.callbacks[i](null, value);
						}
					}
					this.callbacks.length = 0;
					if(!err)
					{
						context.notify(this.id);
					}
				});
			}
		}
		else
		{
			return done ? done(null, this.value) : this.value;
		}
	}
	
	getName()
	{
		return (this.pkg.name ? '/' + path.normalize(this.pkg.name).replace(/^\//, '') : '') + '::' + this.id;
	}
}