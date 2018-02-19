module.exports = {
	template: `<ng-transclude class="keyword" ng-class="'keyword-' + $ctrl.type" />`,
	transclude: true,
	bindings: {
		type: '@',
	},
};