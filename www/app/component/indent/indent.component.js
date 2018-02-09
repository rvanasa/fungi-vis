module.exports = {
	template: `
		<span class="d-inline-block pl-3 indent" ng-click="$ctrl.toggle(); $event.stopPropagation()">
			<b class="indent-collapse text-info clickable" ng-show="$ctrl.collapsed">(..)</b>
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