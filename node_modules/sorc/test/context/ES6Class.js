'use strict'

require('../..').defineStatic(class ES6Class
{
	constructor(a, b, c)
	{
		this.abc = [a, b, c];
	}
	
	getABC()
	{
		return this.abc;
	}
});
