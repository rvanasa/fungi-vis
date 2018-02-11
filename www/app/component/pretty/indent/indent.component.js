module.exports = {
	template: `
		<span class="d-inline-block indent" ng-class="{'pl-3': !$ctrl.collapsed}"
			ng-click="$ctrl.collapsed = false; $event.stopPropagation()"
			ng-dblclick="$ctrl.collapsed = true; $event.stopPropagation()">
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
	}
}