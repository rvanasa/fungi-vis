module.exports = function StorageService()
{
	var localStorage = window.localStorage;
	
	this.get = function(key)
	{
		var item = localStorage.getItem(key);
		return item !== 'undefined' ? JSON.parse(item) : undefined;
	}
	
	this.set = function(key, value)
	{
		try
		{
			localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e)
		{
			console.error(e.stack);
			localStorage.setItem(key, undefined);
		}
	}
}