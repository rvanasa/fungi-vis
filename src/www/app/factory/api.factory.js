module.exports = function API($http, BannerService)
{
	var prefix = '/api/';
	
	function request(method, path, params)
	{
		console.log(method, prefix + path);
		return $http[method.toLowerCase()](prefix + path, params)
			.then(wrapResponse, wrapError);
	}
	
	function wrapResponse(response)
	{
		return response.data;
	}
	
	function wrapError(error)
	{
		BannerService.add({
			type: 'danger',
			message: error.responseText,
		});
		throw error;
	}
	
	return {
		get(path, params)
		{
			return request('GET', path, params);
		},
		create(path, data)
		{
			return request('POST', path, data);
		},
		update(path, data)
		{
			return request('PUT', path, data);
		},
		delete(path, params)
		{
			return request('DELETE', path, params);
		},
	};
}