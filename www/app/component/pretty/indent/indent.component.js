module.exports = {
	template: `
		<span class="d-inline-block indent" ng-class="{'pl2': !$ctrl.collapsed}" ng-click="$ctrl.toggle(); $event.stopPropagation()">
			<span class="indent-collapse clickable" ng-show="$ctrl.collapsed">(..)</span>
			<ng-transclude ng-show="!$ctrl.collapsed">
		</span>`,
	transclude: true,
	bindings: {
		collapsed: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.toggle = function()
		{
			$ctrl.collapsed = !$ctrl.collapsed;
		}
	}
}