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
		$ctrl.setData(StorageService.get('data') || {
			input: null,
			program: null,
			traces: null,
		}, true);
		
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
			.then(ParseService.parse)
			.then(node => $ctrl.setData({
				input: node[1].input.replace(/\\n/g, '\n'/*temp?*/),
				program: node[1].program,
				traces: node[1].traces,
			}))
			.catch(console.error);
		}
		
		$ctrl.showContext = true;
		
		$ctrl.toggleInputPanel = function()
		{
			$ctrl.showContext = !$ctrl.showContext;
		}
		
		function formatAST(node)
		{
			if(!Array.isArray(node))
			{
				return node;
			}
			else if(node[0] === 'DebugLabel')
			{
				let sub = formatAST(node[3]);
				sub._parent = node;
				sub._label = node;
				return sub;
			}
			else if(node[0] === 'Der')
			{
				let sub = formatAST(node[1].rule);
				sub._parent = node;
				sub._type = node[1];
				return sub;
			}
			
			let sub = [];
			for(var i = 0; i < node.length; i++)
			{
				let s = node[i];
				if(Array.isArray(s))
				{
					s = formatAST(s);
					s._parent = sub;
				}
				sub[i] = s;
			}
			return sub;
		}
		
		console.log($ctrl.data);
		console.log($ctrl.program);
		
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