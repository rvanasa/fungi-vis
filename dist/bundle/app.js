/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ce390b4c5f68bdff7be9"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function(type)
{
	return {
		template: `
			<p-handle type="${type}"
				ng-class="{selected:$ctrl.cursor.type==$ctrl.node._type, error:$ctrl.node._type.vis[1].local_err}"
				ng-mouseover="$ctrl.focus(); $event.stopPropagation()"
				ng-mouseout="$ctrl.unfocus(); $event.stopPropagation()"
				ng-mousedown="$ctrl.select() && $event.stopPropagation()"
			/>`,
		bindings: {
			node: '<',
			context: '<',
		},
		controller: function(Cursor)
		{
			var $ctrl = this;
			
			$ctrl.isNode = function(item)
			{
				return Array.isArray(item);
			}
			
			$ctrl.toJSON = JSON.stringify;
			
			$ctrl.cursor = Cursor;
			
			$ctrl.focus = function()
			{
				if(!Cursor.path)
				{
					var path = [];
					var node = $ctrl.node;
					while(node)
					{
						path.unshift(node);
						node = node._parent;
					}
					
					if(path.length > 6)
					{
						path = path.slice(-6);
						path.unshift(['...']);
					}
					Cursor.path = path;
				}
				
				// if($ctrl.node._type)
				// {
				// 	Cursor.type = $ctrl.node._type;
				// 	return true;
				// }
			}
			
			$ctrl.unfocus = function()
			{
				if(Cursor.path && Cursor.path[Cursor.path.length - 1] === $ctrl.node)
				{
					Cursor.path = null;
				}
				// if(Cursor.type === $ctrl.node._type)
				// {
				// 	Cursor.type = null;
				// }
			}
			
			$ctrl.select = function()
			{
				if($ctrl.node._type)
				{
					Cursor.type = $ctrl.node._type;
					return true;
				}
			}
		}
	};
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);

var camelize = __webpack_require__(4);

var angular = window.angular;

var app = angular.module('app');

register('component', __webpack_require__(5));
register('directive', __webpack_require__(49));
register('provider', __webpack_require__(179));
register('constant', __webpack_require__(180));
register('value', __webpack_require__(181));
register('service', __webpack_require__(182));
register('factory', __webpack_require__(189));
register('filter', __webpack_require__(192));

registerSpecial('run', __webpack_require__(193));
registerSpecial('config', __webpack_require__(196));

angular.element(() => angular.bootstrap(document, ['app']));

function requireAll(context)
{
	return context.keys().map(path =>
	{
		var index = path.lastIndexOf('/') + 1;
		return {
			name: camelize(path.substring(index, path.indexOf('.', index))),
			exports: context(path),
		};
	});
}

function register(type, context)
{
	for(let file of requireAll(context))
	{
		app[type](file.exports.name || file.name, file.exports);
	}
}

function registerSpecial(type, context)
{
	for(let file of requireAll(context))
	{
		app[type](file.exports);
	}
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(obj) {
    if (typeof obj === 'string') return camelCase(obj);
    return walk(obj);
};

function walk (obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (isDate(obj) || isRegex(obj)) return obj;
    if (isArray(obj)) return map(obj, walk);
    return reduce(objectKeys(obj), function (acc, key) {
        var camel = camelCase(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}

function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase();
    });
}

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}

function reduce (xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc);
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./component/ast-trace/ast-trace.component.js": 6,
	"./component/ast/ast.component.js": 8,
	"./component/hfi-app/hfi-app.component.js": 10,
	"./component/hfi-pretty-page/hfi-pretty-page.component.js": 12,
	"./component/hfi-trace-page/hfi-trace-page.component.js": 14,
	"./component/landing-app/landing-app.component.js": 16,
	"./component/pretty/enclose/enclose-block.component.js": 18,
	"./component/pretty/enclose/enclose-paren.component.js": 19,
	"./component/pretty/enclose/enclose-square.component.js": 20,
	"./component/pretty/indent/indent.component.js": 21,
	"./component/pretty/node/p-ceffect.component.js": 22,
	"./component/pretty/node/p-context.component.js": 23,
	"./component/pretty/node/p-ctype.component.js": 24,
	"./component/pretty/node/p-effect-error.component.js": 25,
	"./component/pretty/node/p-effect.component.js": 26,
	"./component/pretty/node/p-error.component.js": 27,
	"./component/pretty/node/p-exp.component.js": 28,
	"./component/pretty/node/p-index.component.js": 29,
	"./component/pretty/node/p-kind.component.js": 30,
	"./component/pretty/node/p-name.component.js": 31,
	"./component/pretty/node/p-nametm.component.js": 32,
	"./component/pretty/node/p-primapp.component.js": 33,
	"./component/pretty/node/p-prop.component.js": 34,
	"./component/pretty/node/p-sort.component.js": 35,
	"./component/pretty/node/p-tcons.component.js": 36,
	"./component/pretty/node/p-td.component.js": 37,
	"./component/pretty/node/p-term.component.js": 38,
	"./component/pretty/node/p-type.component.js": 39,
	"./component/pretty/node/p-val.component.js": 40,
	"./component/pretty/term/id-name.component.js": 41,
	"./component/pretty/term/id-type.component.js": 42,
	"./component/pretty/term/id-var.component.js": 43,
	"./component/pretty/term/keyword.component.js": 44,
	"./component/pretty/term/literal.component.js": 45,
	"./component/pretty/term/operator.component.js": 46,
	"./component/trace/trace.component.js": 47
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 5;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(7),
	bindings: {
		node: '<',
		depth: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.isNode = function(item)
		{
			return Array.isArray(item);
		}
		
		$ctrl.toJSON = JSON.stringify;
	}
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<span class=\"ast-trace d-inline-block clickable\">\r\n\t<code ng-if=\"!$ctrl.isNode($ctrl.node[0])\" ng-bind=\"$ctrl.node[0]\"></code>\r\n\t<span class=\"d-inline-block pl-2\" ng-repeat=\"item in $ctrl.node\" ng-if=\"$ctrl.isNode($ctrl.node[0]) || $index\">\r\n\t\t<literal ng-if=\"!$ctrl.isNode(item)\"><span ng-bind=\"$ctrl.toJSON(item)\"></span></literal>\r\n\t\t<ast-trace ng-if=\"$ctrl.isNode(item)\" node=\"item\"></ast-trace>\r\n\t</span>\r\n</span>\r\n";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(9),
	bindings: {
		node: '<',
		depth: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.depth = $ctrl.depth || 0;
		
		$ctrl.isNode = function(item)
		{
			return Array.isArray(item);
		}
		
		$ctrl.toJSON = JSON.stringify;
	}
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<code ng-bind=\"$ctrl.node[0]\"></code>\r\n<enclose-paren ng-if=\"$ctrl.depth >= 1\">..</enclose-paren>\r\n<enclose-paren ng-if=\"$ctrl.node.length > 1 && $ctrl.depth < 1\">\r\n\t<span ng-repeat=\"item in $ctrl.node\" ng-if=\"$index\">\r\n\t\t<literal ng-if=\"!$ctrl.isNode(item)\"><span ng-bind=\"$ctrl.toJSON(item)\"></span></literal>\r\n\t\t<ast ng-if=\"$ctrl.isNode(item)\" node=\"item\" depth=\"$ctrl.depth + 1\"></ast>\r\n\t</span>\r\n</enclose-paren>";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(11),
	controller: function($q, $timeout, $location, StorageService, ExampleService, ParseService)
	{
		var $ctrl = this;
		
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
			.then(data => (console.time('Parse input'), data))
			.then(ParseService.parse)
			.then(data => (console.timeEnd('Parse input'), data))
			.then(node => $ctrl.setData({
				input: node[1].input/*.replace(/\\n/g, '\n')*/,
				program: node[1].program,
				traces: node[1].traces,
			}))
			.catch(console.error)
			.finally(() => $ctrl.loading = false);
		}
		
		$ctrl.showingTraces = false;
		
		$ctrl.toggleTraces = function()
		{
			$ctrl.showingTraces = !$ctrl.showingTraces;
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
			
			for(var i = 0; i < node.length; i++)
			{
				let s = formatAST(node[i]);
				if(Array.isArray(s))
				{
					s._parent = node;
				}
				node[i] = s;
			}
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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<div class=\"bg-light text-muted p-2\">\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-sm-3 text-left pl-4\">\r\n\t\t\t<a href=\"/\" title=\"Fungi Homepage\">\r\n\t\t\t\t<img src=\"/assets/img/fungi-logo-small.png\" class=\"logo\" style=\"height:32px\">\r\n\t\t\t</a>\r\n\t\t</div>\r\n\t\t<div class=\"col-sm-6 text-center noselect\">\r\n\t\t\t<h1 class=\"page-title mb-0 mt-1\">Human-Fungi Interface</h1>\r\n\t\t</div>\r\n\t\t<div class=\"col-sm-3 text-right pr-4\">\r\n\t\t\t<div class=\"btn-group btn-group-sm\">\r\n\t\t\t\t<span class=\"btn m-0\" ng-class=\"'btn-outline-'+($ctrl.showingTraces ? 'info' : 'success')\" ng-click=\"$ctrl.toggleTraces()\">\r\n\t\t\t\t\t<i class=\"fa fa-fw no-transition\" ng-class=\"'fa-'+($ctrl.showingTraces ? 'stop' : 'play')\"></i>\r\n\t\t\t\t</span>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<div ng-if=\"!$ctrl.loading\">\r\n\t<hfi-pretty-page ng-if=\"!$ctrl.showingTraces\" input=\"$ctrl.input\" program=\"$ctrl.program\"></hfi-pretty-page>\r\n\t<hfi-trace-page ng-if=\"$ctrl.showingTraces\" program=\"$ctrl.program\" traces=\"ctrl.traces\"></hfi-trace-page>\r\n</div>\r\n<div class=\"text-center py-2 pt-3 m-0 bg-dark o-8\" style=\"position:fixed; top:30vh; left:0; right:0\" ng-if=\"$ctrl.loading\">\r\n\t<h3 class=\"text-muted\">Loading...</h3>\r\n</div>\r\n";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(13),
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

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<div\r\n\tondragover=\"event.stopPropagation(); event.preventDefault(); $(this).addClass('dragdrop'); event.dataTransfer.dropEffect = 'link'\"\r\n\tondragleave=\"event.stopPropagation(); event.preventDefault(); $(this).removeClass('dragdrop')\"\r\n\tondrop=\"event.stopPropagation(); event.preventDefault(); $(this).removeClass('dragdrop'); $(this).scope().$ctrl.loadFile(event.dataTransfer.files[0])\">\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-6 bg-darker p-0\">\r\n\t\t\t<div ng-show=\"!$ctrl.cursor.type\" class=\"w-100 full-height no-transition\" ace-editor ng-model=\"$ctrl.input\" ng-change=\"$ctrl.updateInput()\"></div>\r\n\t\t\t<div ng-show=\"$ctrl.cursor.type\" class=\"w-100 full-height\">\r\n\t\t\t\t<div class=\"pl-3 o-80\" ng-if=\"$ctrl.cursor.type\">\r\n\t\t\t\t\t<refresh target=\"$ctrl.cursor.type\">\r\n\t\t\t\t\t\t<div class=\"full-height v-scroll\">\r\n\t\t\t\t\t\t\t<div class=\"container mt-3\">\r\n\t\t\t\t\t\t\t\t<div ng-repeat=\"node in ::$ctrl.flattenFirst($ctrl.cursor.type.ctx)\">\r\n\t\t\t\t\t\t\t\t\t<p-context node=\"node\"></p-context>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div class=\"container mt-3\">\r\n\t\t\t\t\t\t\t\t<hr class=\"mt-0\">\r\n\t\t\t\t\t\t\t\t<b class=\"text-warning\">&#8870;</b>\r\n\t\t\t\t\t\t\t\t<span class=\"text-muted\"><span ng-bind=\"$ctrl.cursor.type.vis[1].tmfam\"></span>::</span><span ng-bind=\"$ctrl.cursor.type.rule[0]\"></span>\r\n\t\t\t\t\t\t\t\t<ng-switch on=\"$ctrl.cursor.type.dir[0]\" class=\"text-warning\">\r\n\t\t\t\t\t\t\t\t\t<b ng-switch-when=\"Synth\">&rArr;</b>\r\n\t\t\t\t\t\t\t\t\t<b ng-switch-when=\"Check\">&lArr;</b>\r\n\t\t\t\t\t\t\t\t</ng-switch>\r\n\t\t\t\t\t\t\t\t<indent>\r\n\t\t\t\t\t\t\t\t\t<div ng-if=\"$ctrl.cursor.type.dir[1] || $ctrl.cursor.type.clas[0] == 'Ok'\">\r\n\t\t\t\t\t\t\t\t\t\t<p-td node=\"$ctrl.cursor.type.dir[1] || $ctrl.cursor.type.clas[1]\"></p-td>\r\n\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t</indent>\r\n\t\t\t\t\t\t\t\t<div ng-if=\"$ctrl.cursor.type.clas[0] == 'Err'\" class=\"mt-2\">\r\n\t\t\t\t\t\t\t\t\t<keyword type=\"error\"><span ng-bind=\"$ctrl.cursor.type.clas[1][0]\"></span></keyword>\r\n\t\t\t\t\t\t\t\t\t<operator ng-if=\"$ctrl.cursor.type.clas[1].length > 1\">:</operator>\r\n\t\t\t\t\t\t\t\t\t<indent>\r\n\t\t\t\t\t\t\t\t\t\t<p-error node=\"$ctrl.cursor.type.clas[1]\"></p-error>\r\n\t\t\t\t\t\t\t\t\t</indent>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</refresh>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"col-md-6 p-0\">\r\n\t\t\t<div class=\"pretty-panel container v-scroll full-height\"><!--ng-mousedown=\"$ctrl.cursor.type = null\"-->\r\n\t\t\t\t<refresh target=\"$ctrl.program\" ng-if=\"$ctrl.program\">\r\n\t\t\t\t\t<p-exp node=\"::$ctrl.program\"></p-exp>\r\n\t\t\t\t</refresh>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div style=\"position:absolute; bottom:1em; right:1em; opacity:.95\">\r\n\t\t\t<refresh target=\"$ctrl.cursor.path\">\r\n\t\t\t\t<span class=\"text-muted bg-dark\" ng-repeat=\"node in $ctrl.cursor.path\">\r\n\t\t\t\t\t<span ng-if=\"$index==$ctrl.cursor.path.length-1\"><span ng-bind=\"node._type.vis[1].tmfam\"></span>::</span><span ng-bind=\"node[0]\"></span>\r\n\t\t\t\t</span>\r\n\t\t\t</refresh>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(15),
	bindings: {
		program: '<',
		traces: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		
	}
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n\t<div class=\"col-md-6\">\r\n\t\t<div class=\"full-height v-scroll noselect\">\r\n\t\t\t<ast-trace node=\"$ctrl.program\"></ast-trace>\r\n\t\t</div>\r\n\t</div>\r\n\t<div class=\"col-md-6\">\r\n\t\t<div class=\"full-height\">\r\n\t\t\t\r\n\t\t</div>\r\n\t</div>\r\n</div>";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(17),
	controller: function(ExampleService)
	{
		var $ctrl = this;
		
		ExampleService.getIDs()
			.then(ids => $ctrl.examples = ids);
		
		$ctrl.viewExample = function(example)
		{
			window.location.href = '/hfi?x=' + encodeURIComponent(example.id);
		}
	}
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<div class=\"py-5 bg-darkest\">\r\n\t<div class=\"container text-center\">\r\n\t\t<div class=\"row\">\r\n\t\t\t<div class=\"col-md-4\">\r\n\t\t\t\t<a class=\"float-left mt-4\" href=\"https://docs.rs/fungi-lang/\" title=\"Fungi Documentation\" target=\"_blank\">\r\n\t\t\t\t\t<img src=\"/assets/img/fungi-logo-small.png\" class=\"logo\" style=\"height:48px\">\r\n\t\t\t\t</a>\r\n\t\t\t\t<h1 class=\"display-4 font-code mt-2 pt-1\">Fungi</h1>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"col-md-8 text-md-left\">\r\n\t\t\t\t<!-- <h2><small class=\"text-muted text-thin\">An incremental computing language with precisely named cache locations.</small></h2> -->\r\n\t\t\t\t<h2><small class=\"text-muted text-thin\"> A typed functional language for programs that name their own cached dependency graphs.</small></h2>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<div class=\"bg-white text-center pt-1 glow-theme\">\r\n\t<!--<ul class=\"list-inline\">-->\r\n\t<!--\t<li class=\"list-inline-item\">-->\r\n\t<!--\t\t<a href=\"#\">Examples</a>-->\r\n\t<!--\t</li>-->\r\n\t<!--\t<li class=\"list-inline-item\">-->\r\n\t<!--\t\t<a href=\"#\">Quickstart</a>-->\r\n\t<!--\t</li>-->\r\n\t<!--\t<li class=\"list-inline-item\">-->\r\n\t<!--\t\t<a href=\"#\">Documentation</a>-->\r\n\t<!--\t</li>-->\r\n\t<!--</ul>-->\r\n</div>\r\n<div class=\"container text-center pt-5\">\r\n\t<div class=\"row\">\r\n\t\t<div class=\"col-md-6 text-md-left mb-5\">\r\n\t\t\t<h3 class=\"text-spread mx-4\">Features</h3>\r\n\t\t\t<hr>\r\n\t\t\t<ul class=\"list-group list-group-dark\">\r\n\t\t\t\t<li class=\"list-group-item\">\r\n\t\t\t\t\t<h5 class=\"text-thin\">Dynamic <bold>names</bold> for data and computation</h5>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"list-group-item\">\r\n\t\t\t\t\t<h5 class=\"text-thin\">Static type and effects system enforces precise names</h5>\r\n\t\t\t\t</li>\r\n\t\t\t\t<li class=\"list-group-item\">\r\n\t\t\t\t\t<h5 class=\"text-thin\">Implemented with <a href=\"https://rust-lang.org\" target=\"_blank\">Rust</a> and <a href=\"http://adapton-lang.org\" target=\"_blank\">Adapton</a></h5>\r\n\t\t\t\t</li>\r\n\t\t\t</ul>\r\n\t\t\t<hr>\r\n\t\t\t<h4 class=\"mx-4\"><a href=\"https://docs.rs/fungi-lang/\">Language Documentation</a></h4>\r\n\t\t</div>\r\n\t\t<div class=\"col-md-6 text-md-right mb-5\">\r\n\t\t\t<h3 class=\"text-spread mx-4\">Examples</h3>\r\n\t\t\t<hr>\r\n\t\t\t<div style=\"max-height:40vh; overflow-y:scroll\">\r\n\t\t\t\t<ul class=\"list-group list-group-dark\">\r\n\t\t\t\t\t<li class=\"list-group-item clickable py-0\" ng-repeat=\"example in $ctrl.examples\">\r\n\t\t\t\t\t\t<div class=\"row\" ng-click=\"$ctrl.viewExample(example, $event)\">\r\n\t\t\t\t\t\t\t<div class=\"col-8 text-left\">\r\n\t\t\t\t\t\t\t\t<p class=\"font-code mb-0\" ng-bind=\"example.name\"></p>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t<div class=\"col-4 text-center\">\r\n\t\t\t\t\t\t\t\t<i class=\"fa fa-arrow-circle-right text-muted\"></i>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</li>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n<!--<a href=\"https://docs.rs/fungi-lang/\" title=\"Fungi Documentation\" target=\"_blank\">-->\r\n<!--\t<img src=\"/assets/fungi-logo.png\" class=\"logo\" style=\"height:32px\">-->\r\n<!--</a>-->\r\n";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1)('{', '}');

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1)('(', ')');

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = module.exports = __webpack_require__(1)('[', ']');

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	template: `
		<span class="d-inline-block indent" ng-class="{'pl-3': !$ctrl.collapsed}"
			ng-click="$ctrl.collapsed = false; $event.stopPropagation()"
			ng-dblclick="$ctrl.collapsed = true; $event.stopPropagation()">
			<span class="text-warning indent-collapse clickable" ng-if="$ctrl.collapsed">(..)</span>
			<ng-transclude ng-if="!$ctrl.collapsed" />
		</span>`,
	transclude: true,
	bindings: {
		collapsed: '<',
	},
	controller: function(Cursor)
	{
		var $ctrl = this;
		
		$ctrl.cursor = Cursor;
	}
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('ceffect');

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('context');

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('ctype');

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('effect-error');

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('effect');

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('error');

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('exp');

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('index');

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('kind');

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('name');

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('nametm');

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('primapp');

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('prop');

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('sort');

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('tcons');

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('{{$ctrl.cursor.type.category}}');

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('term');

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('type');
// module.exports = {
// 	template: `<span class="text-muted clickable">(..)</span>`,
// }

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0)('val');

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = {
	template: `<span class="id-type clickable" ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
	}
};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {
	template: `<span class="id-type clickable" ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
	}
};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = {
	template: `
		<span class="id-var clickable"
			ng-class="{highlighted:$ctrl.highlighted}"
			ng-mouseover="$ctrl.hover()"
			ng-mouseout="$ctrl.unhover()"
			ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
		type: '@',
	},
	controller: function($scope)
	{
		var $ctrl = this;
		
		var defContext;
		searchDef($scope);
		function searchDef(scope)
		{
			if(scope.$parent && scope.$parent.$ctrl)
			{
				var context = scope.$parent;
				if(scope.$ctrl && scope.$ctrl.context)
				{
					context = scope.$ctrl.context;
				}
				
				var node = context.$ctrl.node;
				var flag;
				if(node)
				{
					if(node[0] === 'Let')
					{
						flag = checkDef(node[1]);
					}
					else if(node[0] === 'Split')
					{
						flag = checkDef(node[2]) || checkDef(node[3]);
					}
					else if(node[0] === 'Lam')
					{
						flag = checkDef(node[1]);
					}
					else if(node[0] === 'Case')
					{
						flag = checkDef(node[2]) || checkDef(node[4]);
					}
					else if(node[0] === 'Unroll')
					{
						flag = checkDef(node[2]);
					}
				}
				return flag ? context.$ctrl : searchDef(context);
			}
			function checkDef(name)
			{
				if($ctrl.name === name)
				{
					defContext = context;
					return true;
				}
			}
		}
		
		if(defContext)
		{
			var key = 'refs:' + $ctrl.name;
			var refs = defContext.$ctrl[key] || (defContext.$ctrl[key] = []);
			refs.push(this);
			
			$ctrl.highlighted = false;
			
			$ctrl.hover = function()
			{
				for(var ref of refs)
				{
					ref.highlighted = ref.name == $ctrl.name;
				}
			}
			
			$ctrl.unhover = function()
			{
				for(var ref of refs)
				{
					ref.highlighted = false;
				}
			}
		}
	}
};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="keyword" ng-class="'keyword-' + $ctrl.type" />`,
	transclude: true,
	bindings: {
		type: '@',
	},
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="literal" />`,
	transclude: true,
};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="operator" />`,
	transclude: true,
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(48),
	bindings: {
		node: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		
	}
};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "";

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./directive/ace-editor.directive.js": 50,
	"./directive/p-handle/p-handle.directive.js": 51,
	"./directive/refresh.directive.js": 178
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 49;

/***/ }),
/* 50 */
/***/ (function(module, exports) {

var angular = window.angular;

module.exports = function($window, $timeout)
{
	function resizeEditor(editor, elem)
	{
		var lineHeight = editor.renderer.lineHeight;
		var rows = editor.getSession().getLength();
		
		angular.element(elem).height(rows * lineHeight);
		editor.resize();
	}
	
	return {
		restrict: 'A',
		require: '?ngModel',
		scope: true,
		link(scope, elem, attrs, ngModel)
		{
			var editor = $window.ace.edit(elem[0]);
			editor.$blockScrolling = Infinity;
			
			editor.setShowPrintMargin(false);
			editor.setTheme('ace/theme/tomorrow_night_bright');
			editor.setOptions({
				fontSize: 14,
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: false,
			});
			
			editor.getSession().setMode('ace/mode/javascript');
			editor.getSession().setUseWorker(false);
			
			ngModel.$render = () =>
			{
				var shouldDeselect = editor.getValue() == '';
				
				editor.setValue(ngModel.$viewValue || '');
				resizeEditor(editor, elem);
				
				if(shouldDeselect)
				{
					editor.selection.clearSelection();
				}
			};
			
			editor.on('change', () =>
			{
				$timeout(() =>
				{
					scope.$apply(() =>
					{
						var value = editor.getValue();
						ngModel.$setViewValue(value);
					});
				});
				resizeEditor(editor, elem);
			});
		}
	};
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var angular = window.angular;

var templateContext = __webpack_require__(52);
var fallbackTemplate = __webpack_require__(177);

var templates = {};

templateContext.keys()
	.forEach(path => templates[path] = templateContext(path));

module.exports = function($parse, $compile)
{
	return {
		restrict: 'E',
		link(scope, elem, attrs)
		{
			var $ctrl = scope.$ctrl;
			
			var type = attrs['type'] || 'exp';
			
			if($ctrl.isNode($ctrl.node))
			{
				var id = `./${type}/${$ctrl.node[0]}.html`;
				
				// TODO find a proper home for this mapping
				if($ctrl.node._type)
				{
					var family = $ctrl.node._type && $ctrl.node._type.vis[1].tmfam;
					$ctrl.node._type.category = {
						'nametm': 'sort',
						'index': 'sort',
						'val': 'type',
						'exp': 'ceffect',
					}[type];
				}
			}
			
			var template = templates[id];
			if(!template)
			{
				console.warn(`Template not found for`, '(' + type + ')', family + '::' + $ctrl.node[0], $ctrl.node);
				template = fallbackTemplate;
			}
			var elems = $compile(template)(scope);
			angular.element(elem).append(elems).html();
		}
	};
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ceffect/Cons.html": 53,
	"./ceffect/ForallIdx.html": 54,
	"./ceffect/ForallType.html": 55,
	"./context/Def.html": 56,
	"./context/Empty.html": 57,
	"./context/IVar.html": 58,
	"./context/PropTrue.html": 59,
	"./context/TCons.html": 60,
	"./context/TVar.html": 61,
	"./context/Var.html": 62,
	"./ctype/Arrow.html": 63,
	"./ctype/Lift.html": 64,
	"./effect-error/CannotSubtractNmSetTmFromNmSet.html": 65,
	"./effect/WR.html": 66,
	"./error/CheckFailCEffect.html": 67,
	"./error/CheckFailType.html": 68,
	"./error/EffectError.html": 69,
	"./error/Inside.html": 70,
	"./error/Later.html": 71,
	"./error/MismatchSort.html": 72,
	"./error/ParamMism.html": 73,
	"./error/ParamNoCheck.html": 74,
	"./error/ParamNoSynth.html": 75,
	"./error/SubsumptionFailure.html": 76,
	"./error/SynthFailVal.html": 77,
	"./error/UnexpectedCEffect.html": 78,
	"./error/UnexpectedType.html": 79,
	"./error/VarNotInScope.html": 80,
	"./exp/AnnoC.html": 81,
	"./exp/AnnoE.html": 82,
	"./exp/App.html": 83,
	"./exp/Case.html": 84,
	"./exp/Decls.html": 85,
	"./exp/DefType.html": 86,
	"./exp/Fix.html": 87,
	"./exp/Force.html": 88,
	"./exp/Get.html": 89,
	"./exp/IdxApp.html": 90,
	"./exp/IfThenElse.html": 91,
	"./exp/Lam.html": 92,
	"./exp/Let.html": 93,
	"./exp/NameFnApp.html": 94,
	"./exp/PrimApp.html": 95,
	"./exp/Ref.html": 96,
	"./exp/Ret.html": 97,
	"./exp/Split.html": 98,
	"./exp/Thunk.html": 99,
	"./exp/Unimp.html": 100,
	"./exp/Unpack.html": 101,
	"./exp/Unroll.html": 102,
	"./exp/UseAll.html": 103,
	"./exp/WriteScope.html": 104,
	"./index/Apart.html": 105,
	"./index/App.html": 106,
	"./index/Bin.html": 107,
	"./index/Empty.html": 108,
	"./index/FlatMap.html": 109,
	"./index/FlatMapStar.html": 110,
	"./index/Ident.html": 111,
	"./index/Lam.html": 112,
	"./index/Map.html": 113,
	"./index/MapStar.html": 114,
	"./index/NmSet.html": 115,
	"./index/Sing.html": 116,
	"./index/Union.html": 117,
	"./index/Var.html": 118,
	"./index/WriteScope.html": 119,
	"./kind/Type.html": 120,
	"./name/Bin.html": 121,
	"./name/Num.html": 122,
	"./nametm/App.html": 123,
	"./nametm/Bin.html": 124,
	"./nametm/Ident.html": 125,
	"./nametm/Lam.html": 126,
	"./nametm/Name.html": 127,
	"./nametm/ValVar.html": 128,
	"./nametm/Var.html": 129,
	"./nametm/WriteScope.html": 130,
	"./primapp/NameBin.html": 131,
	"./primapp/NatLt.html": 132,
	"./primapp/RefThunk.html": 133,
	"./prop/Equiv.html": 134,
	"./prop/Tt.html": 135,
	"./sort/IdxArrow.html": 136,
	"./sort/Nm.html": 137,
	"./sort/NmArrow.html": 138,
	"./sort/NmSet.html": 139,
	"./tcons/Bool.html": 140,
	"./tcons/D.html": 141,
	"./tcons/Nat.html": 142,
	"./tcons/Seq.html": 143,
	"./tcons/String.html": 144,
	"./tcons/User.html": 145,
	"./term/IdxTm.html": 146,
	"./term/NameTm.html": 147,
	"./term/Type.html": 148,
	"./type/Cons.html": 149,
	"./type/Exists.html": 150,
	"./type/Ident.html": 151,
	"./type/IdxApp.html": 152,
	"./type/IdxFn.html": 153,
	"./type/Nm.html": 154,
	"./type/NmFn.html": 155,
	"./type/Prod.html": 156,
	"./type/Rec.html": 157,
	"./type/Ref.html": 158,
	"./type/Sum.html": 159,
	"./type/Thk.html": 160,
	"./type/TypeApp.html": 161,
	"./type/TypeFn.html": 162,
	"./type/Unit.html": 163,
	"./type/Var.html": 164,
	"./val/Bool.html": 165,
	"./val/Inj1.html": 166,
	"./val/Inj2.html": 167,
	"./val/Name.html": 168,
	"./val/NameFn.html": 169,
	"./val/Nat.html": 170,
	"./val/Pack.html": 171,
	"./val/Pair.html": 172,
	"./val/Roll.html": 173,
	"./val/ThunkAnon.html": 174,
	"./val/Unit.html": 175,
	"./val/Var.html": 176
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 52;

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<p-effect node=\"$ctrl.node[2]\"></p-effect>\r\n<p-ctype node=\"$ctrl.node[1]\"></p-ctype>";

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ceffect\">foralli</keyword>\r\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort><span ng-if=\"$ctrl.node[3][0]!='Tt'\"> <operator>|</operator><p-prop node=\"$ctrl.node[3]\"></p-prop></span><operator>.</operator>\r\n<indent>\r\n\t<p-ceffect node=\"$ctrl.node[4]\"></p-ceffect>\r\n</indent>";

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ceffect\">forallt</keyword>\r\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\r\n<operator>:</operator>\r\n<p-kind node=\"$ctrl.node[2]\"></p-kind><operator>.</operator>\r\n<indent>\r\n\t<p-ceffect node=\"$ctrl.node[3]\"></p-ceffect>\r\n</indent>";

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"module\">def</keyword>\r\n<id-name name=\"$ctrl.node[2]\"></id-name>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-term node=\"$ctrl.node[3]\"></p-term>\r\n</indent>";

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "<span class=\"text-muted\">&Gamma;</span>";

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"index\">ivar</keyword>\r\n<id-name name=\"$ctrl.node[2]\"></id-name>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-sort node=\"$ctrl.node[3]\"></p-sort>\r\n</indent";

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"prop\">prop</keyword>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-prop node=\"$ctrl.node[2]\"></p-prop>\r\n</indent";

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"tcons\">tcons</keyword>\r\n<p-tcons node=\"$ctrl.node[2]\"></p-tcons>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-kind node=\"$ctrl.node[3]\"></p-kind>\r\n</indent";

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"type\">tvar</keyword>\r\n<id-type name=\"$ctrl.node[2]\"></id-type>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-kind node=\"$ctrl.node[3]\"></p-kind>\r\n</indent";

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\r\n<!--<br>-->\r\n<keyword type=\"exp\">var</keyword>\r\n<id-var name=\"$ctrl.node[2]\"></id-var>\r\n<operator>:</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\r\n</indent";

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\r\n<operator>&rarr;</operator>\r\n<br>\r\n<indent>\r\n\t<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>\r\n</indent>";

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ctype\">&fnof;</keyword>\r\n<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"::['NmSet', $ctrl.node[1]]\"></p-index>\r\n<br>\r\n<br>\r\n<ng-switch on=\"$ctrl.node[2][0]\">\r\n\t<p-nametm ng-switch-when=\"Single\" node=\"$ctrl.node[2][1]\"></p-nametm>\r\n\t<p-index ng-switch-when=\"Subset\" node=\"$ctrl.node[2][1]\"></p-index>\r\n</ng-switch>";

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\r\n\t<operator>;</operator>\r\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-block>";

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>";

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\r\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\r\n<indent>\r\n\t<p-effect-error node=\"$ctrl.node[1]\"></p-effect-error>\r\n</indent>\r\n";

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\r\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\r\n<indent>\r\n\t<p-error node=\"$ctrl.node[1]\"></p-error>\r\n</indent>";

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\r\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\r\n<indent>\r\n\t<p-error node=\"$ctrl.node[1]\"></p-error>\r\n</indent>";

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "<br>\r\n<p-sort node=\"$ctrl.node[1]\"></p-sort>\r\n<br>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort>";

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<br>\r\n<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>\r\n<br>\r\n<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>";

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>";

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<id-var name=\"$ctrl.node[1]\"></id-var>";

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\r\n<operator>:</operator>\r\n<p-ctype node=\"$ctrl.node[2]\"></p-ctype>";

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\r\n<operator>:</operator>\r\n<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>";

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<p-exp node=\"$ctrl.node[1]\"></p-exp>\r\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\r\n</enclose-block>";

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">match</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>\r\n<enclose-block>\r\n\t<br>\r\n\t<indent>\r\n\t\t<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var>\r\n\t\t<operator>&rArr;</operator>\r\n\t\t<indent>\r\n\t\t\t<p-exp node=\"$ctrl.node[3]\"></p-exp>\r\n\t\t</indent>\r\n\t</indent>\r\n\t<br>\r\n\t<indent>\r\n\t\t<id-var name=\"$ctrl.node[4]\" type=\"decl\"></id-var>\r\n\t\t<operator>&rArr;</operator>\r\n\t\t<indent>\r\n\t\t\t<p-exp node=\"$ctrl.node[5]\"></p-exp>\r\n\t\t</indent>\r\n\t</indent>\r\n</enclose-block>";

/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[2]\"></p-exp>";

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">type</keyword>\r\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\r\n<operator>=</operator>\r\n<indent collapsed=\"true\">\r\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\r\n</indent>\r\n<br>\r\n<p-exp node=\"$ctrl.node[3]\"></p-exp>";

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">fix</keyword>\r\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var><operator>.</operator>\r\n<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n";

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<keyword type=\"exp\">force</keyword>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-block>";

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<operator>!</operator>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-block>";

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\r\n<enclose-square>\r\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-square>";

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">if</keyword>\r\n<enclose-paren>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-paren>\r\n<enclose-block>\r\n\t<indent>\r\n\t\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n\t</indent>\r\n</enclose-block>\r\n<keyword type=\"exp\">else</keyword>\r\n<enclose-block>\r\n\t<indent>\r\n\t\t<p-exp node=\"$ctrl.node[3]\"></p-exp>\r\n\t</indent>\r\n</enclose-block>";

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">&lambda;</keyword>\r\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var><operator>.</operator>\r\n<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n";

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">let</keyword>\r\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var>\r\n<span ng-if=\"!$ctrl.node[2][0].startsWith('Anno')\">\r\n\t<operator>=</operator>\r\n\t<indent>\r\n\t\t<p-exp node=\"$ctrl.node[2]\" context=\"$parent\"></p-exp>\r\n\t</indent>\r\n</span>\r\n<span ng-if=\"$ctrl.node[2][0] == 'AnnoC'\">\r\n\t<operator>:</operator>\r\n\t<indent collapsed=\"true\">\r\n\t\t<p-ctype node=\"$ctrl.node[2][2]\"></p-ctype>\r\n\t</indent>\r\n\t<operator>=</operator>\r\n\t<indent>\r\n\t\t<p-exp node=\"$ctrl.node[2][1]\" context=\"$parent\"></p-exp>\r\n\t</indent>\r\n</span>\r\n<span ng-if=\"$ctrl.node[2][0] == 'AnnoE'\">\r\n\t<operator>:</operator>\r\n\t<indent collapsed=\"true\">\r\n\t\t<p-ceffect node=\"$ctrl.node[2][2]\"></p-ceffect>\r\n\t</indent>\r\n\t<operator>=</operator>\r\n\t<indent>\r\n\t\t<p-exp node=\"$ctrl.node[2][1]\" context=\"$parent\"></p-exp>\r\n\t</indent>\r\n</span>\r\n<br>\r\n<p-exp node=\"$ctrl.node[3]\"></p-exp>";

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "<enclose-square>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-square>\r\n<p-val node=\"$ctrl.node[2]\"></p-val>";

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = "<p-primapp node=\"$ctrl.node[1]\"></p-primapp>";

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ref</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>\r\n<p-val node=\"$ctrl.node[2]\"></p-val>";

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ret</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">let</keyword>\r\n<enclose-paren>\r\n\t<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var>\r\n\t<operator>,</operator>\r\n\t<id-var name=\"$ctrl.node[3]\" type=\"decl\"></id-var>\r\n</enclose-paren>\r\n<operator>=</operator>\r\n<p-val node=\"$ctrl.node[1]\" context=\"$parent\"></p-val>\r\n<br>\r\n<p-exp node=\"$ctrl.node[4]\"></p-exp>";

/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">Thunk</keyword>\r\n<enclose-square>\r\n    <p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-square>\r\n<br>\r\n<indent>\r\n\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n</indent>";

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = "<span class=\"text-muted\">???</span>";

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">unpack</keyword>\r\n<enclose-paren>\r\n\t<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\r\n</enclose-paren>\r\n<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var><operator>.</operator>\r\n<enclose-paren>\r\n\t<p-val node=\"$ctrl.node[3]\"></p-val>\r\n</enclose-paren>\r\n<br>\r\n<!--<indent>-->\r\n\t<p-exp node=\"$ctrl.node[4]\"></p-exp> \r\n<!--</indent>-->";

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">unroll</keyword>\r\n<p-val node=\"$ctrl.node[1]\" context=\"$parent\"></p-val>\r\n<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var><operator>.</operator>\r\n<p-exp node=\"$ctrl.node[3]\"></p-exp>\r\n";

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n";

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ws</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>\r\n<indent>\r\n\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n</indent>";

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\r\n<operator>%</operator>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>";

/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n   <p-index node=\"$ctrl.node[1]\"></p-index>\r\n</enclose-block>\r\n<enclose-paren>\r\n   <p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n<p-index node=\"$ctrl.node[1]\"></p-index>\r\n<operator>&#10026;</operator>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">&empty;</keyword>";

/***/ }),
/* 109 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n  <enclose-paren>\r\n    <p-index node=\"$ctrl.node[1]\"></p-index>\r\n  </enclose-paren>\r\n  <p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 110 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n<enclose-paren><p-index node=\"$ctrl.node[1]\"></p-index></enclose-paren><sup><operator><b>*</b></operator></sup>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 111 */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">&lambda;</keyword>\r\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort>\r\n<operator>.</operator>\r\n<indent>\r\n\t<p-index node=\"$ctrl.node[3]\"></p-index>\r\n</indent>";

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n  <enclose-bracket>\r\n    <p-nametm node=\"$ctrl.node[1]\"></p-nametm>\r\n  </enclose-bracket>\r\n  <p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n<enclose-square><p-nametm node=\"$ctrl.node[1]\"></p-nametm></enclose-square><sup><operator><b>*</b></operator></sup>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-paren>\r\n";

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n\t<keyword type=\"index\" ng-if=\"!$ctrl.node[1][1].terms.length\">&empty;</keyword>\r\n\t<span ng-repeat=\"term in $ctrl.node[1][1].terms\">\r\n\t\t<br ng-if=\"$ctrl.node[1][1].terms.length > 2\">\r\n\t\t<ng-switch on=\"$ctrl.node[1][1].cons[1][0]\" ng-if=\"$index || $ctrl.node[1][1].terms.length > 2\">\r\n\t\t\t<operator>\r\n\t\t\t\t<span ng-switch-when=\"Apart\">%</span>\r\n\t\t\t\t<span ng-switch-when=\"Union\">U</span>\r\n\t\t\t</operator>\r\n\t\t</ng-switch>\r\n\t\t<ng-switch on=\"term[0]\">\r\n\t\t\t<p-nametm ng-switch-when=\"Single\" node=\"term[1]\"></p-nametm>\r\n\t\t\t<p-index ng-switch-when=\"Subset\" node=\"term[1]\"></p-index>\r\n\t\t</ng-switch>\r\n\t</span>\r\n\t<br ng-if=\"$ctrl.node[1][1].terms.length > 2\">\r\n</enclose-paren>";

/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\r\n</enclose-block>";

/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\r\n<operator>U</operator>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>";

/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">@!</keyword>";

/***/ }),
/* 120 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"kind\">Type</keyword>";

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = "<p-name node=\"$ctrl.node[1]\"></p-name>\r\n<keyword>*</keyword>\r\n<p-name node=\"$ctrl.node[2]\"></p-name>";

/***/ }),
/* 122 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.toJSON($ctrl.node[1])\"></span></literal>";

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = "<enclose-square>\r\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\r\n\t<p-nametm node=\"$ctrl.node[2]\"></p-nametm>\r\n</enclose-square>";

/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = "<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\r\n<operator>,</operator>\r\n<p-nametm node=\"$ctrl.node[2]\"></p-nametm>";

/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = "<id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">&lambda;</keyword>\r\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort>\r\n<operator>.</operator>\r\n<p-nametm node=\"$ctrl.node[3]\"></p-nametm>";

/***/ }),
/* 127 */
/***/ (function(module, exports) {

module.exports = "<operator>@</operator><p-name node=\"$ctrl.node[1]\"></p-name>";

/***/ }),
/* 128 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">~</keyword><id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),
/* 129 */
/***/ (function(module, exports) {

module.exports = "<id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),
/* 130 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">@@</keyword>";

/***/ }),
/* 131 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n\t<operator>@</operator>\r\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\r\n</enclose-block>";

/***/ }),
/* 132 */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n\t<operator>&lt;</operator>\r\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\r\n</enclose-block>";

/***/ }),
/* 133 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"primapp\">RefThunk</keyword>\r\n<enclose-square>\r\n    <p-val node=\"$ctrl.node[1]\"></p-val>\r\n</enclose-squre>";

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\r\n<operator>=</operator>\r\n<p-index node=\"$ctrl.node[2]\"></p-index>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[3]\"></p-sort>";

/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"prop\">Tt</keyword>";

/***/ }),
/* 136 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n\t<p-sort node=\"$ctrl.node[1]\"></p-sort>\r\n\t<operator>&rArr;</operator>\r\n\t<p-sort node=\"$ctrl.node[2]\"></p-sort>\r\n</enclose-paren>";

/***/ }),
/* 137 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"sort\">Nm</keyword>";

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n\t<p-sort node=\"$ctrl.node[1]\"></p-sort>\r\n\t<operator>&rarr;</operator>\r\n\t<p-sort node=\"$ctrl.node[2]\"></p-sort>\r\n</enclose-paren>";

/***/ }),
/* 139 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"sort\">NmSet</keyword>";

/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Bool</keyword>";

/***/ }),
/* 141 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">D</keyword>";

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Nat</keyword>";

/***/ }),
/* 143 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Seq</keyword>";

/***/ }),
/* 144 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">String</keyword>";

/***/ }),
/* 145 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">user</keyword>\r\n<enclose-paren>\r\n\t<id-type name=\"$ctrl.node[1]\"></id-type>\r\n</enclose-paren>";

/***/ }),
/* 146 */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>";

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = "<p-nametm node=\"$ctrl.node[1]\"></p-nametm>";

/***/ }),
/* 148 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),
/* 149 */
/***/ (function(module, exports) {

module.exports = "<p-tcons node=\"$ctrl.node[1]\"></p-tcons>";

/***/ }),
/* 150 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">exists</keyword>\r\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort><span ng-if=\"$ctrl.node[3][0]!='Tt'\"> <operator>|</operator> <p-prop node=\"$ctrl.node[3]\"></p-prop></span><operator>.</operator>\r\n<indent>\r\n\t<p-type node=\"$ctrl.node[4]\"></p-type>\r\n</indent>\r\n";

/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),
/* 152 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\r\n<enclose-square>\r\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\r\n</enclose-square>";

/***/ }),
/* 153 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">foralli</keyword>\r\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\r\n<operator>:</operator>\r\n<p-sort node=\"$ctrl.node[2]\"></p-sort><operator>.</operator>\r\n<indent>\r\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\r\n</indent>";

/***/ }),
/* 154 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Nm</keyword>\r\n<enclose-square>\r\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\r\n</enclose-square>";

/***/ }),
/* 155 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n\t<keyword type=\"type\">Nm</keyword>\r\n\t<operator>&rarr;</operator>\r\n\t<keyword type=\"type\">Nm</keyword>\r\n</enclose-paren>\r\n<enclose-square>\r\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\r\n</enclose-square>";

/***/ }),
/* 156 */
/***/ (function(module, exports) {

module.exports = "<indent>\r\n\t<operator>x</operator>\r\n\t<p-type node=\"$ctrl.node[1]\"></p-type>\r\n\t<br>\r\n\t<operator ng-if=\"$ctrl.node[2][0] != $ctrl.node[0]\">x</operator>\r\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\r\n</indent>";

/***/ }),
/* 157 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">rec</keyword>\r\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type><operator>.</operator>\r\n<p-type node=\"$ctrl.node[2]\"></p-type>\r\n";

/***/ }),
/* 158 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Ref</keyword>\r\n<enclose-square><p-index node=\"$ctrl.node[1]\"></p-index></enclose-square>\r\n<p-type node=\"$ctrl.node[2]\"></p-type>\r\n";

/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = "<indent>\r\n\t<operator>+</operator>\r\n\t<p-type node=\"$ctrl.node[1]\"></p-type>\r\n\t<br>\r\n\t<operator ng-if=\"$ctrl.node[2][0] != $ctrl.node[0]\">+</operator>\r\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\r\n</indent>";

/***/ }),
/* 160 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Thk</keyword>\r\n<enclose-square>\r\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\r\n</enclose-square>\r\n<indent>\r\n    <p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>\r\n</indent>";

/***/ }),
/* 161 */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\r\n&nbsp;\r\n<p-type node=\"$ctrl.node[2]\"></p-type>";

/***/ }),
/* 162 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">forallt</keyword>\r\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\r\n<operator>:</operator>\r\n<p-kind node=\"$ctrl.node[2]\"></p-kind><operator>.</operator>\r\n<indent>\r\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\r\n</indent>";

/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Unit</keyword>";

/***/ }),
/* 164 */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),
/* 165 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),
/* 166 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">inj1</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">inj2</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),
/* 168 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\r\n\t<p-name node=\"$ctrl.node[1]\"></p-name>\r\n</enclose-paren>";

/***/ }),
/* 169 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">namefn</keyword>\r\n<p-nametm node=\"$ctrl.node[1]\"></p-nametm>";

/***/ }),
/* 170 */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),
/* 171 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">pack</keyword>\r\n<p-index node=\"$ctrl.node[1]\"></p-index>\r\n<p-val node=\"$ctrl.node[2]\"></p-val>\r\n";

/***/ }),
/* 172 */
/***/ (function(module, exports) {

module.exports = "<enclose-paren implied=\"$parent.$ctrl.node[0] == 'Pair'\">\r\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\r\n\t<operator>,</operator>\r\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\r\n</enclose-paren>";

/***/ }),
/* 173 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">roll</keyword>\r\n<p-val node=\"$ctrl.node[1]\"></p-val>\r\n";

/***/ }),
/* 174 */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">thunk</keyword>\r\n<p-exp node=\"$ctrl.node[1]\"></p-exp>\r\n";

/***/ }),
/* 175 */
/***/ (function(module, exports) {

module.exports = "<literal>()</literal>";

/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports = "<id-var name=\"$ctrl.node[1]\"></id-var>";

/***/ }),
/* 177 */
/***/ (function(module, exports) {

module.exports = "<ast ng-if=\"$ctrl.isNode($ctrl.node)\" node=\"$ctrl.node\"></ast>\r\n<literal ng-if=\"!$ctrl.isNode($ctrl.node)\"><span ng-bind=\"$ctrl.node\"></span></literal>";

/***/ }),
/* 178 */
/***/ (function(module, exports) {

module.exports = function() {
	return {
		transclude: true,
		controller: function($scope, $transclude, $attrs, $element)
		{
			var childScope;
			$scope.$watch($attrs.target, value =>
			{
				$element.empty();
				if(childScope)
				{
					childScope.$destroy();
					childScope = null;
				}
				
				$transclude((clone, newScope) =>
				{
					childScope = newScope;
					$element.append(clone);
				});
			});
		}
	};
}

/***/ }),
/* 179 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 179;

/***/ }),
/* 180 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 180;

/***/ }),
/* 181 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 181;

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./service/example.service.js": 183,
	"./service/parse.service.js": 184,
	"./service/rust.service.js": 187,
	"./service/storage.service.js": 188
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 182;

/***/ }),
/* 183 */
/***/ (function(module, exports) {

module.exports = function ExampleService($http, ParseService)
{
	// this.examples = context.keys().map(id =>
	// {
	// 	id = id.replace(/^\.\//, '').replace(/.fgb$/, '');
		
	// 	return {
	// 		id,
	// 		name: id.replace(/^fungi_lang::examples::/, ''),
	// 		// bundle: ParseService.parse(context(id)),
	// 		// bundle: context(id),
	// 	};
	// });
	
	this.getIDs = function()
	{
		return $http.get(`/examples`)
			.then(response => response.data.map(id =>
			{
				id = id.replace(/\.fgb$/, '');
				return {
					id: id,
					name: id.replace(/^fungi_lang\.examples\./, ''),
				};
			}));
	}
	
	this.find = function(id)
	{
		return $http.get(`/examples/${id}.fgb`)
			.then(response => response.data)
			.then(ParseService.parse);///////
	}
}

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var parser = __webpack_require__(185);

module.exports = function ParseService()
{
	this.parse = function(input)
	{
		// return JSON.parse(input);
		return parser(input);
	}
}

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var p = __webpack_require__(186);

function lexeme(token)
{
	return ignore.then(token);
}

function keyword(id)
{
	return lexeme(p.string(id));
}

var seq = p.seqMap;

function opt(parser, def)
{
	return parser.or(p.succeed(def));
}

function surround(left, parser, right)
{
	return left.then(parser).skip(right);
}

function toObject(pairs)
{
	var obj = {};
	for(var [key, value] of pairs)
	{
		obj[key] = value;
	}
	return obj;
}

var ignore = opt(p.string(' '));

var IDENT = lexeme(p.regex(/[_A-Za-z$][_A-Za-z$0-9]*/));
var STR = lexeme(p.regex(/"([^"\\]*(\\.[^"\\]*)*)"/)).map(s => s.substring(1, s.length - 1));
var NUM = lexeme(p.regex(/-?([0-9]+|[0-9]*\.[0-9]+)/)).map(Number);
var TRUE = keyword('true').result(true);
var FALSE = keyword('false').result(false);

var L_PAREN = keyword('(');
var R_PAREN = keyword(')');
var L_BRACKET = keyword('[');
var R_BRACKET = keyword(']');
var L_BRACE = keyword('{');
var R_BRACE = keyword('}');
var COMMA = keyword(',');
var COLON = keyword(':');

var Exp = p.lazy('Expression', () => p.alt(
	TRUE,
	FALSE,
	Sequence,
	Composite,
	STR,
	NUM,
	L_PAREN.then(R_PAREN).result(null)
));

var KVPair = p.seq(IDENT.skip(COLON), Exp);

var Sequence = surround(L_BRACKET, Exp.skip(opt(COMMA)).many(), R_BRACKET);

var Composite = seq(IDENT, opt(p.alt(
	surround(L_PAREN, Exp.skip(opt(COMMA)).many(), R_PAREN),
	surround(L_BRACE, KVPair.skip(opt(COMMA)).many().map(toObject), R_BRACE)
), []), (id, values) => [id].concat(values));

var EntryPoint = Exp.skip(ignore);

module.exports = function(input)
{
	var result = EntryPoint.parse(input);
	if(!result.status)
	{
		var nearby = input.substr(result.index.offset, 1);
		throw new Error(`Unexpected ${nearby.length ? 'symbol ' + nearby : 'end of script'} (line ${result.index.line}, col ${result.index.column})`);
	}
	return result.value;
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

!function(n,t){ true?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Parsimmon=t():n.Parsimmon=t()}(this,function(){return function(n){function t(e){if(r[e])return r[e].exports;var u=r[e]={i:e,l:!1,exports:{}};return n[e].call(u.exports,u,u.exports,t),u.l=!0,u.exports}var r={};return t.m=n,t.c=r,t.i=function(n){return n},t.d=function(n,r,e){t.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:e})},t.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(r,"a",r),r},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(n,t,r){"use strict";function e(n){if(!(this instanceof e))return new e(n);this._=n}function u(n){return n instanceof e}function i(n){return"[object Array]"==={}.toString.call(n)}function o(n,t){return{status:!0,index:n,value:t,furthest:-1,expected:[]}}function a(n,t){return{status:!1,index:-1,value:null,furthest:n,expected:[t]}}function f(n,t){if(!t)return n;if(n.furthest>t.furthest)return n;var r=n.furthest===t.furthest?s(n.expected,t.expected):t.expected;return{status:n.status,index:n.index,value:n.value,furthest:t.furthest,expected:r}}function c(n,t){var r=n.slice(0,t).split("\n");return{offset:t,line:r.length,column:r[r.length-1].length+1}}function s(n,t){var r=n.length,e=t.length;if(0===r)return t;if(0===e)return n;for(var u={},i=0;i<r;i++)u[n[i]]=!0;for(var o=0;o<e;o++)u[t[o]]=!0;var a=[];for(var f in u)u.hasOwnProperty(f)&&a.push(f);return a.sort(),a}function l(n){if(!u(n))throw new Error("not a parser: "+n)}function h(n){if(!i(n))throw new Error("not an array: "+n)}function p(n){if("number"!=typeof n)throw new Error("not a number: "+n)}function d(n){if(!(n instanceof RegExp))throw new Error("not a regexp: "+n);for(var t=w(n),r=0;r<t.length;r++){var e=t.charAt(r);if("i"!==e&&"m"!==e&&"u"!==e)throw new Error('unsupported regexp flag "'+e+'": '+n)}}function v(n){if("function"!=typeof n)throw new Error("not a function: "+n)}function g(n){if("string"!=typeof n)throw new Error("not a string: "+n)}function y(n){return 1===n.length?n[0]:"one of "+n.join(", ")}function m(n,t){var r=t.index,e=r.offset;if(e===n.length)return", got the end of the input";var u=e>0?"'...":"'",i=n.length-e>12?"...'":"'";return" at line "+r.line+" column "+r.column+", got "+u+n.slice(e,e+12)+i}function x(n,t){return"expected "+y(t.expected)+m(n,t)}function w(n){var t=""+n;return t.slice(t.lastIndexOf("/")+1)}function E(n){return RegExp("^(?:"+n.source+")",w(n))}function _(){for(var n=[].slice.call(arguments),t=n.length,r=0;r<t;r+=1)l(n[r]);return e(function(r,e){for(var u,i=new Array(t),a=0;a<t;a+=1){if(u=f(n[a]._(r,e),u),!u.status)return u;i[a]=u.value,e=u.index}return f(o(e,i),u)})}function b(){for(var n={},t=0,r=[].slice.call(arguments),a=r.length,c=0;c<a;c+=1){var s=r[c];if(!u(s)){if(i(s)){if(2===s.length&&"string"==typeof s[0]&&u(s[1])){var l=s[0];if(n[l])throw new Error("seqObj: duplicate key "+l);n[l]=!0,t++;continue}}throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.")}}if(0===t)throw new Error("seqObj expects at least one named parser, found zero");return e(function(n,t){for(var e,u={},c=0;c<a;c+=1){var s,l;if(i(r[c])?(s=r[c][0],l=r[c][1]):(s=null,l=r[c]),e=f(l._(n,t),e),!e.status)return e;s&&(u[s]=e.value),t=e.index}return f(o(t,u),e)})}function O(){var n=[].slice.call(arguments);if(0===n.length)throw new Error("seqMap needs at least one argument");var t=n.pop();return v(t),_.apply(null,n).map(function(n){return t.apply(null,n)})}function k(n){var t={};for(var r in n)({}).hasOwnProperty.call(n,r)&&function(r){var e=function(){return n[r](t)};t[r]=G(e)}(r);return t}function j(){var n=[].slice.call(arguments),t=n.length;if(0===t)return F("zero alternates");for(var r=0;r<t;r+=1)l(n[r]);return e(function(t,r){for(var e,u=0;u<n.length;u+=1)if(e=f(n[u]._(t,r),e),e.status)return e;return e})}function P(n,t){return q(n,t).or(B([]))}function q(n,t){return l(n),l(t),O(n,t.then(n).many(),function(n,t){return[n].concat(t)})}function z(n){g(n);var t="'"+n+"'";return e(function(r,e){var u=e+n.length,i=r.slice(e,u);return i===n?o(u,i):a(e,t)})}function A(n,t){d(n),arguments.length>=2?p(t):t=0;var r=E(n),u=""+n;return e(function(n,e){var i=r.exec(n.slice(e));if(i){if(0<=t&&t<=i.length){var f=i[0],c=i[t];return o(e+f.length,c)}return a(e,"valid match group (0 to "+i.length+") in "+u)}return a(e,u)})}function B(n){return e(function(t,r){return o(r,n)})}function F(n){return e(function(t,r){return a(r,n)})}function M(n){if(u(n))return e(function(t,r){var e=n._(t,r);return e.index=r,e.value="",e});if("string"==typeof n)return M(z(n));if(n instanceof RegExp)return M(A(n));throw new Error("not a string, regexp, or parser: "+n)}function R(n){return l(n),e(function(t,r){var e=n._(t,r),u=t.slice(r,e.index);return e.status?a(r,'not "'+u+'"'):o(r,null)})}function L(n){return v(n),e(function(t,r){var e=t.charAt(r);return r<t.length&&n(e)?o(r+1,e):a(r,"a character matching "+n)})}function S(n){return L(function(t){return n.indexOf(t)>=0})}function W(n){return L(function(t){return n.indexOf(t)<0})}function I(n){return e(n(o,a))}function C(n,t){return L(function(r){return n<=r&&r<=t}).desc(n+"-"+t)}function D(n){return v(n),e(function(t,r){for(var e=r;e<t.length&&n(t.charAt(e));)e++;return o(e,t.slice(r,e))})}function G(n,t){arguments.length<2&&(t=n,n=void 0);var r=e(function(n,e){return r._=t()._,r._(n,e)});return n?r.desc(n):r}function H(){return F("fantasy-land/empty")}var J=e.prototype;J.parse=function(n){if("string"!=typeof n)throw new Error(".parse must be called with a string as its argument");var t=this.skip(T)._(n,0);return t.status?{status:!0,value:t.value}:{status:!1,index:c(n,t.furthest),expected:t.expected}},J.tryParse=function(n){var t=this.parse(n);if(t.status)return t.value;var r=x(n,t),e=new Error(r);throw e.type="ParsimmonError",e.result=t,e},J.or=function(n){return j(this,n)},J.trim=function(n){return this.wrap(n,n)},J.wrap=function(n,t){return O(n,this,t,function(n,t){return t})},J.thru=function(n){return n(this)},J.then=function(n){return l(n),_(this,n).map(function(n){return n[1]})},J.many=function(){var n=this;return e(function(t,r){for(var e=[],u=void 0;;){if(u=f(n._(t,r),u),!u.status)return f(o(r,e),u);if(r===u.index)throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");r=u.index,e.push(u.value)}})},J.tie=function(){return this.map(function(n){h(n);for(var t="",r=0;r<n.length;r++)g(n[r]),t+=n[r];return t})},J.times=function(n,t){var r=this;return arguments.length<2&&(t=n),p(n),p(t),e(function(e,u){for(var i=[],a=void 0,c=void 0,s=0;s<n;s+=1){if(a=r._(e,u),c=f(a,c),!a.status)return c;u=a.index,i.push(a.value)}for(;s<t&&(a=r._(e,u),c=f(a,c),a.status);s+=1)u=a.index,i.push(a.value);return f(o(u,i),c)})},J.result=function(n){return this.map(function(){return n})},J.atMost=function(n){return this.times(0,n)},J.atLeast=function(n){return O(this.times(n),this.many(),function(n,t){return n.concat(t)})},J.map=function(n){v(n);var t=this;return e(function(r,e){var u=t._(r,e);return u.status?f(o(u.index,n(u.value)),u):u})},J.skip=function(n){return _(this,n).map(function(n){return n[0]})},J.mark=function(){return O(K,this,K,function(n,t,r){return{start:n,value:t,end:r}})},J.node=function(n){return O(K,this,K,function(t,r,e){return{name:n,value:r,start:t,end:e}})},J.sepBy=function(n){return P(this,n)},J.sepBy1=function(n){return q(this,n)},J.lookahead=function(n){return this.skip(M(n))},J.notFollowedBy=function(n){return this.skip(R(n))},J.desc=function(n){var t=this;return e(function(r,e){var u=t._(r,e);return u.status||(u.expected=[n]),u})},J.fallback=function(n){return this.or(B(n))},J.ap=function(n){return O(n,this,function(n,t){return n(t)})},J.chain=function(n){var t=this;return e(function(r,e){var u=t._(r,e);return u.status?f(n(u.value)._(r,u.index),u):u})},J.concat=J.or,J.empty=H,J.of=B,J["fantasy-land/ap"]=J.ap,J["fantasy-land/chain"]=J.chain,J["fantasy-land/concat"]=J.concat,J["fantasy-land/empty"]=J.empty,J["fantasy-land/of"]=J.of,J["fantasy-land/map"]=J.map;var K=e(function(n,t){return o(t,c(n,t))}),N=e(function(n,t){return t>=n.length?a(t,"any character"):o(t+1,n.charAt(t))}),Q=e(function(n,t){return o(n.length,n.slice(t))}),T=e(function(n,t){return t<n.length?a(t,"EOF"):o(t,null)}),U=A(/[0-9]/).desc("a digit"),V=A(/[0-9]*/).desc("optional digits"),X=A(/[a-z]/i).desc("a letter"),Y=A(/[a-z]*/i).desc("optional letters"),Z=A(/\s*/).desc("optional whitespace"),$=A(/\s+/).desc("whitespace");e.all=Q,e.alt=j,e.any=N,e.createLanguage=k,e.custom=I,e.digit=U,e.digits=V,e.empty=H,e.eof=T,e.fail=F,e.formatError=x,e.index=K,e.isParser=u,e.lazy=G,e.letter=X,e.letters=Y,e.lookahead=M,e.makeFailure=a,e.makeSuccess=o,e.noneOf=W,e.notFollowedBy=R,e.of=B,e.oneOf=S,e.optWhitespace=Z,e.Parser=e,e.range=C,e.regex=A,e.regexp=A,e.sepBy=P,e.sepBy1=q,e.seq=_,e.seqMap=O,e.seqObj=b,e.string=z,e.succeed=B,e.takeWhile=D,e.test=L,e.whitespace=$,e["fantasy-land/empty"]=H,e["fantasy-land/of"]=B,n.exports=e}])});

/***/ }),
/* 187 */
/***/ (function(module, exports) {

module.exports = function RustService()
{
    var RustPromise = window.RustPromise;
    
    RustPromise.then(result =>
		{
        // console.log(module)///
        
        console.log(result)///
        
        console.log(result.instance.exports.test(123));
		});
}


/***/ }),
/* 188 */
/***/ (function(module, exports) {

module.exports = function StorageService()
{
	var localStorage = window.localStorage;
	
	this.get = function(key)
	{
		var item = localStorage.getItem(key);
		return item !== 'undefined' ? JSON.parse(item) : undefined;
	}
	
	this.set = function(key, value)
	{
		try
		{
			localStorage.setItem(key, JSON.stringify(value));
		}
		catch(e)
		{
			console.error(e.stack);
			localStorage.setItem(key, undefined);
		}
	}
}

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./factory/api.factory.js": 190,
	"./factory/cursor.factory.js": 191
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 189;

/***/ }),
/* 190 */
/***/ (function(module, exports) {

module.exports = function API($http, BannerService)
{
	var prefix = '/api/';
	
	function request(method, path, params)
	{
		console.log(method, prefix + path);
		return $http[method.toLowerCase()](prefix + path, params)
			.then(wrapResponse, wrapError);
	}
	
	function wrapResponse(response)
	{
		return response.data;
	}
	
	function wrapError(error)
	{
		BannerService.add({
			type: 'danger',
			message: error.responseText,
		});
		throw error;
	}
	
	return {
		get(path, params)
		{
			return request('GET', path, params);
		},
		create(path, data)
		{
			return request('POST', path, data);
		},
		update(path, data)
		{
			return request('PUT', path, data);
		},
		delete(path, params)
		{
			return request('DELETE', path, params);
		},
	};
}

/***/ }),
/* 191 */
/***/ (function(module, exports) {

module.exports = function Cursor()
{
	return {
		type: null,
	};
}

/***/ }),
/* 192 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 192;

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./config/console.run.js": 194,
	"./config/promise.run.js": 195
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 193;

/***/ }),
/* 194 */
/***/ (function(module, exports) {

var angular = window.angular;

module.exports = function()
{
	window.$node = function(elem)
	{
		var scope = angular.element(elem).scope();
		while(scope)
		{
			if(scope.$ctrl && scope.$ctrl.node)
			{
				return scope.$ctrl.node;
			}
			scope = scope.$parent;
		}
	}
}

/***/ }),
/* 195 */
/***/ (function(module, exports) {

module.exports = function($q)
{
	// help Angular automatically update UI after promise resolution in dependencies
	window.Promise = $q;
}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./config/animation.config.js": 197,
	"./config/app.config.js": 198
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 196;

/***/ }),
/* 197 */
/***/ (function(module, exports) {

module.exports = function($animateProvider)
{
	// only `.allow-anim` elements will be animated by Angular
	$animateProvider.classNameFilter(/allow-anim/);
}

/***/ }),
/* 198 */
/***/ (function(module, exports) {

module.exports = function($locationProvider, $compileProvider)
{
	$locationProvider.html5Mode({
		enabled: true,
		rewriteLinks: false,
	});
	
	$compileProvider.preAssignBindingsEnabled(true);
}

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map