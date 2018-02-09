module.exports = function(left, right)
{
	return {
		template: `
			<span class="encloser" ng-if="!$ctrl.implied">${left}</span>
			<ng-transclude />
			<span class="encloser" ng-if="!$ctrl.implied">${right}</span>`,
		transclude: true,
		bindings: {
			implied: '<',
		},
		controller: function()
		{
			// TODO: highlight enclosing pair
		}
	};
}