module.exports = {
	template: require('./app.html'),
	controller: function(ParseService)
	{
		var $ctrl = this;
		
		var rawData = require('raw-loader!./_temp_ast.txt');
		var inputData = ['run', ParseService.parse(rawData), ['traces']];
		
		$ctrl.input = require('raw-loader!./_temp_input.txt');
		
		$ctrl.program = formatAST(inputData[1]);
		$ctrl.traces = inputData[2].slice(1);
		
		function formatAST(node)
		{
			if(node[0] === 'TypeInfo')
			{
				node[1].node._type = node[1];
				return formatAST(node[1].node);
			}
			else if(Array.isArray(node))
			{
				return node.map(formatAST);
			}
			return node;
		}
		
		console.log(inputData);
		
		// function getTree(node)
		// {
		// 	if(!Array.isArray(node))
		// 	{
		// 		 return {
		// 		 	text: {name: JSON.stringify(node)},
		// 		 	HTMLclass: 'text-white bg-secondary rounded px-3 py-1 noselect',
		// 		 };
		// 	}
		// 	else if(node.length === 2)
		// 	{
		// 		return getTree(node[1]);
		// 	}
		// 	return {
		// 		text: {name: node[0]},
		// 		HTMLclass: 'text-white bg-success rounded px-3 py-2 clickable',
		// 		children: node.slice(1).map(getTree),
		// 	};
		// }
		
		// new window.Treant({
		// 	chart: {
		//         container: '#ast-tree',
		//         levelSeparation: 10,
		//         siblingSeparation: 10,
		//         subTeeSeparation: 40,
		//         // nodeAlign: 'BOTTOM',
		//         rootOrientation: 'WEST',
		//         scrollbar: 'fancy',
		//         padding: 35,
		//         // node: {HTMLclass: 'class'},
		//         connectors: {
		//             type: 'curve',
		//             style: {
		//                 'stroke-width': 2,
		//                 'stroke-linecap': 'round',
		//                 'stroke': '#CCC',
		//             }
		//         },
	 //   	},
	 //   	nodeStructure: getTree(inputData[1]),
		// });
		
		// var PP = require('prettier-printer');
		// $ctrl.pretty = PP.render(10, PP.group(rawData));
		
		// $ctrl.pretty = getPretty(100, $ctrl.program);
		
		// function render(node)
		// {
		// 	if(!Array.isArray(node))
		// 	{
		// 		return JSON.stringify(node);
		// 	}
		// 	return node[0] + (node.length > 1 ? '(' + node.slice(1).split(', ') + ')' : '');
		// }
		
		// function getPretty(width, node, indent = 0)
		// {
		// 	if(!Array.isArray(node))
		// 	{
		// 		return JSON.stringify(node);
		// 	}
		// 	var line = render(node);
		// 	if(line.length + indent > width)
		// 	{
				
		// 	}
		// }
	}
};