module.exports = {
	template: require('./hfi-pretty-page.html'),
	bindings: {
		input: '<',
		program: '<',
	},
	controller: function(Cursor)
	{
		var $ctrl = this;
		
		$ctrl.cursor = Cursor;
	}
};