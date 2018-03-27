module.exports = {
	template: require('./hfi-app.html'),
	controller: function($q, $timeout, $location, ParseService, StorageService, ExampleService, Cursor)
	{
		var $ctrl = this;
		
		$ctrl.cursor = Cursor;
		
		$ctrl.setData = function(data, oneTime)
		{
			data = data || $ctrl.data;
			
			if(!oneTime)
			{
				StorageService.set('bundle', data);
			}
			
			$ctrl.data = data;
			$ctrl.input = data.input;
			$ctrl.program = formatAST(data.program);
			$ctrl.traces = data.traces;
			
			console.log($ctrl.data);
			console.log($ctrl.program);
		}
		
		// Load initial bundle
		var exampleID = $location.search().x;
		var startPromise = exampleID ? ExampleService.find(exampleID) : Promise.resolve(StorageService.get('bundle') || {
			input: null,
			program: null,
			traces: null,
		});
		startPromise.then(bundle => $ctrl.setData(bundle[1]));
		
		// Refresh visualization
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
				program: program,
				traces: [],
			});
		}
		
		// Read contents of file
		$ctrl.loadFile = function(file)
		{
			$ctrl.loading = true;
			$q((resolve, reject) =>
			{
				$timeout(() =>
				{
					var reader = new FileReader();
					reader.onload = function(event)
					{
						resolve(event.target.result);
					}
					reader.readAsDataURL(file);
				});
			})
			.then(data => window.atob(data.substring(data.lastIndexOf(',') + 1)))
			.then(data => (console.time('Parse input'), data))///
			.then(ParseService.parse)
			.then(data => (console.timeEnd('Parse input'), data))///
			.then(node => $ctrl.setData({
				input: node[1].input.replace(/\\n/g, '\n'/*temp?*/),
				program: node[1].program,
				traces: node[1].traces,
			}))
			.catch(console.error)
			.finally(() => $ctrl.loading = false);
		}
		
		$ctrl.showContext = true;
		
		$ctrl.toggleInputPanel = function()
		{
			$ctrl.showContext = !$ctrl.showContext;
		}
		
		// Rewrite AST for pretty nodes
		function formatAST(node)
		{
			if(!Array.isArray(node))
			{
				// Flatten enum values (object singletons with capital first letter key)
				if(node && typeof node === 'object')
				{
					let keys = Object.keys(node);
					for(let key of keys)
					{
						node[key] = formatAST(node[key]);
					}
					
					// // TEMP : `Der` case
					// if(node.rule && node.ctx && node.dir && node.rule)
					// {
					// 	let sub = formatAST(node.rule);
					// 	node.rule = sub;
					// 	sub._type = node;
					// 	return sub;
					// }
					
					// let key = keys[0];
					// if(keys.length === 1 && key.charAt(0) !== key.charAt(0).toLowerCase())
					// {
					// 	return formatAST([key].concat(node[key]));
					// }
				}
				
				return node;
			}
			else if(node[0] === 'DebugLabel')
			{
				let sub = formatAST(node[3]);
				node[3] = sub;
				sub._debug = node;
				return sub;
			}
			else if(node[0] === 'Der')
			{
				let sub = formatAST(node[1].rule);
				node[1].rule = sub;
				sub._type = node[1];
				return sub;
			}
			
			// let sub = [];
			for(var i = 0; i < node.length; i++)
			{
				let s = formatAST(node[i]);
				if(Array.isArray(s))
				{
					// s._parent = sub;
					s._parent = node;
				}
				// sub[i] = s;
				node[i] = s;
			}
			// return sub;
			return node;
		}
		
		$ctrl.flattenFirst = function(node)
		{
			var nodes = [];
			while(Array.isArray(node) && node.length > 1)
			{
				nodes.unshift(node);
				node = node[1];
			}
			return nodes;
		}
		
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