module.exports = {
	template: require('./app.html'),
	controller: function($q, ParseService, StorageService, Cursor)
	{
		var $ctrl = this;
		
		$ctrl.cursor = Cursor;
		
		$ctrl.setData = function(data, oneTime)
		{
			data = data || $ctrl.data;
			
			if(!oneTime)
			{
				StorageService.set('data', data);
			}
			
			$ctrl.data = data;
			$ctrl.input = data.input;
			$ctrl.program = formatAST(data.program);
			$ctrl.traces = data.traces;
		}
		
		// Load input/AST/trace data
		$ctrl.setData(StorageService.get('data', true) || {
			input: null,
			program: null,
			traces: null,
		});
		
		$ctrl.updateInput = function()
		{
			try
			{
				var program = ParseService.parse($ctrl.input);
			}
			catch(e)
			{
				program = ['Error', e.toString()];
			}
			
			$ctrl.setData({
				input: $ctrl.input,
				program,
				traces: [],
			});
		}
		
		$ctrl.loadFile = function(file)
		{
			$q((resolve, reject) =>
			{
				var reader = new FileReader();
				reader.onload = function(event)
				{
					resolve(event.target.result);
				}
				reader.readAsDataURL(file);
			})
			.then(data => window.atob(data.substring(data.lastIndexOf(',') + 1)))
			.then(data => $ctrl.setData({
				input: data,
				program: ParseService.parse(data),
				traces: [],
			}))
			.catch(console.error);
		}
		
		function formatAST(node)
		{
			if(!node)
			{
				return node;
			}
			if(node[0] === 'TypeInfo')
			{
				var sub = formatAST(node[1].node);
				sub._type = node[1];
				return sub;
			}
			else if(Array.isArray(node))
			{
				return node.map(formatAST);
			}
			return node;
		}
		
		console.log($ctrl.data);
		
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