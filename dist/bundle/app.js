/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "bc60255e5bb267bd5f82"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
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
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
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
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
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
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
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
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
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
/******/ 			var chunkId = "app";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
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
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
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
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
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
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
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
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
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
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
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
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/www/app/main.js")(__webpack_require__.s = "./src/www/app/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/camelize/index.js":
/*!****************************************!*\
  !*** ./node_modules/camelize/index.js ***!
  \****************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./node_modules/parsimmon/build/parsimmon.umd.min.js":
/*!***********************************************************!*\
  !*** ./node_modules/parsimmon/build/parsimmon.umd.min.js ***!
  \***********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

!function(n,t){ true?module.exports=t():undefined}(this,function(){return function(n){function t(e){if(r[e])return r[e].exports;var u=r[e]={i:e,l:!1,exports:{}};return n[e].call(u.exports,u,u.exports,t),u.l=!0,u.exports}var r={};return t.m=n,t.c=r,t.i=function(n){return n},t.d=function(n,r,e){t.o(n,r)||Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:e})},t.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(r,"a",r),r},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(n,t,r){"use strict";function e(n){if(!(this instanceof e))return new e(n);this._=n}function u(n){return n instanceof e}function i(n){return"[object Array]"==={}.toString.call(n)}function o(n,t){return{status:!0,index:n,value:t,furthest:-1,expected:[]}}function a(n,t){return{status:!1,index:-1,value:null,furthest:n,expected:[t]}}function f(n,t){if(!t)return n;if(n.furthest>t.furthest)return n;var r=n.furthest===t.furthest?s(n.expected,t.expected):t.expected;return{status:n.status,index:n.index,value:n.value,furthest:t.furthest,expected:r}}function c(n,t){var r=n.slice(0,t).split("\n");return{offset:t,line:r.length,column:r[r.length-1].length+1}}function s(n,t){var r=n.length,e=t.length;if(0===r)return t;if(0===e)return n;for(var u={},i=0;i<r;i++)u[n[i]]=!0;for(var o=0;o<e;o++)u[t[o]]=!0;var a=[];for(var f in u)u.hasOwnProperty(f)&&a.push(f);return a.sort(),a}function l(n){if(!u(n))throw new Error("not a parser: "+n)}function h(n){if(!i(n))throw new Error("not an array: "+n)}function p(n){if("number"!=typeof n)throw new Error("not a number: "+n)}function d(n){if(!(n instanceof RegExp))throw new Error("not a regexp: "+n);for(var t=w(n),r=0;r<t.length;r++){var e=t.charAt(r);if("i"!==e&&"m"!==e&&"u"!==e)throw new Error('unsupported regexp flag "'+e+'": '+n)}}function v(n){if("function"!=typeof n)throw new Error("not a function: "+n)}function g(n){if("string"!=typeof n)throw new Error("not a string: "+n)}function y(n){return 1===n.length?n[0]:"one of "+n.join(", ")}function m(n,t){var r=t.index,e=r.offset;if(e===n.length)return", got the end of the input";var u=e>0?"'...":"'",i=n.length-e>12?"...'":"'";return" at line "+r.line+" column "+r.column+", got "+u+n.slice(e,e+12)+i}function x(n,t){return"expected "+y(t.expected)+m(n,t)}function w(n){var t=""+n;return t.slice(t.lastIndexOf("/")+1)}function E(n){return RegExp("^(?:"+n.source+")",w(n))}function _(){for(var n=[].slice.call(arguments),t=n.length,r=0;r<t;r+=1)l(n[r]);return e(function(r,e){for(var u,i=new Array(t),a=0;a<t;a+=1){if(u=f(n[a]._(r,e),u),!u.status)return u;i[a]=u.value,e=u.index}return f(o(e,i),u)})}function b(){for(var n={},t=0,r=[].slice.call(arguments),a=r.length,c=0;c<a;c+=1){var s=r[c];if(!u(s)){if(i(s)){if(2===s.length&&"string"==typeof s[0]&&u(s[1])){var l=s[0];if(n[l])throw new Error("seqObj: duplicate key "+l);n[l]=!0,t++;continue}}throw new Error("seqObj arguments must be parsers or [string, parser] array pairs.")}}if(0===t)throw new Error("seqObj expects at least one named parser, found zero");return e(function(n,t){for(var e,u={},c=0;c<a;c+=1){var s,l;if(i(r[c])?(s=r[c][0],l=r[c][1]):(s=null,l=r[c]),e=f(l._(n,t),e),!e.status)return e;s&&(u[s]=e.value),t=e.index}return f(o(t,u),e)})}function O(){var n=[].slice.call(arguments);if(0===n.length)throw new Error("seqMap needs at least one argument");var t=n.pop();return v(t),_.apply(null,n).map(function(n){return t.apply(null,n)})}function k(n){var t={};for(var r in n)({}).hasOwnProperty.call(n,r)&&function(r){var e=function(){return n[r](t)};t[r]=G(e)}(r);return t}function j(){var n=[].slice.call(arguments),t=n.length;if(0===t)return F("zero alternates");for(var r=0;r<t;r+=1)l(n[r]);return e(function(t,r){for(var e,u=0;u<n.length;u+=1)if(e=f(n[u]._(t,r),e),e.status)return e;return e})}function P(n,t){return q(n,t).or(B([]))}function q(n,t){return l(n),l(t),O(n,t.then(n).many(),function(n,t){return[n].concat(t)})}function z(n){g(n);var t="'"+n+"'";return e(function(r,e){var u=e+n.length,i=r.slice(e,u);return i===n?o(u,i):a(e,t)})}function A(n,t){d(n),arguments.length>=2?p(t):t=0;var r=E(n),u=""+n;return e(function(n,e){var i=r.exec(n.slice(e));if(i){if(0<=t&&t<=i.length){var f=i[0],c=i[t];return o(e+f.length,c)}return a(e,"valid match group (0 to "+i.length+") in "+u)}return a(e,u)})}function B(n){return e(function(t,r){return o(r,n)})}function F(n){return e(function(t,r){return a(r,n)})}function M(n){if(u(n))return e(function(t,r){var e=n._(t,r);return e.index=r,e.value="",e});if("string"==typeof n)return M(z(n));if(n instanceof RegExp)return M(A(n));throw new Error("not a string, regexp, or parser: "+n)}function R(n){return l(n),e(function(t,r){var e=n._(t,r),u=t.slice(r,e.index);return e.status?a(r,'not "'+u+'"'):o(r,null)})}function L(n){return v(n),e(function(t,r){var e=t.charAt(r);return r<t.length&&n(e)?o(r+1,e):a(r,"a character matching "+n)})}function S(n){return L(function(t){return n.indexOf(t)>=0})}function W(n){return L(function(t){return n.indexOf(t)<0})}function I(n){return e(n(o,a))}function C(n,t){return L(function(r){return n<=r&&r<=t}).desc(n+"-"+t)}function D(n){return v(n),e(function(t,r){for(var e=r;e<t.length&&n(t.charAt(e));)e++;return o(e,t.slice(r,e))})}function G(n,t){arguments.length<2&&(t=n,n=void 0);var r=e(function(n,e){return r._=t()._,r._(n,e)});return n?r.desc(n):r}function H(){return F("fantasy-land/empty")}var J=e.prototype;J.parse=function(n){if("string"!=typeof n)throw new Error(".parse must be called with a string as its argument");var t=this.skip(T)._(n,0);return t.status?{status:!0,value:t.value}:{status:!1,index:c(n,t.furthest),expected:t.expected}},J.tryParse=function(n){var t=this.parse(n);if(t.status)return t.value;var r=x(n,t),e=new Error(r);throw e.type="ParsimmonError",e.result=t,e},J.or=function(n){return j(this,n)},J.trim=function(n){return this.wrap(n,n)},J.wrap=function(n,t){return O(n,this,t,function(n,t){return t})},J.thru=function(n){return n(this)},J.then=function(n){return l(n),_(this,n).map(function(n){return n[1]})},J.many=function(){var n=this;return e(function(t,r){for(var e=[],u=void 0;;){if(u=f(n._(t,r),u),!u.status)return f(o(r,e),u);if(r===u.index)throw new Error("infinite loop detected in .many() parser --- calling .many() on a parser which can accept zero characters is usually the cause");r=u.index,e.push(u.value)}})},J.tie=function(){return this.map(function(n){h(n);for(var t="",r=0;r<n.length;r++)g(n[r]),t+=n[r];return t})},J.times=function(n,t){var r=this;return arguments.length<2&&(t=n),p(n),p(t),e(function(e,u){for(var i=[],a=void 0,c=void 0,s=0;s<n;s+=1){if(a=r._(e,u),c=f(a,c),!a.status)return c;u=a.index,i.push(a.value)}for(;s<t&&(a=r._(e,u),c=f(a,c),a.status);s+=1)u=a.index,i.push(a.value);return f(o(u,i),c)})},J.result=function(n){return this.map(function(){return n})},J.atMost=function(n){return this.times(0,n)},J.atLeast=function(n){return O(this.times(n),this.many(),function(n,t){return n.concat(t)})},J.map=function(n){v(n);var t=this;return e(function(r,e){var u=t._(r,e);return u.status?f(o(u.index,n(u.value)),u):u})},J.skip=function(n){return _(this,n).map(function(n){return n[0]})},J.mark=function(){return O(K,this,K,function(n,t,r){return{start:n,value:t,end:r}})},J.node=function(n){return O(K,this,K,function(t,r,e){return{name:n,value:r,start:t,end:e}})},J.sepBy=function(n){return P(this,n)},J.sepBy1=function(n){return q(this,n)},J.lookahead=function(n){return this.skip(M(n))},J.notFollowedBy=function(n){return this.skip(R(n))},J.desc=function(n){var t=this;return e(function(r,e){var u=t._(r,e);return u.status||(u.expected=[n]),u})},J.fallback=function(n){return this.or(B(n))},J.ap=function(n){return O(n,this,function(n,t){return n(t)})},J.chain=function(n){var t=this;return e(function(r,e){var u=t._(r,e);return u.status?f(n(u.value)._(r,u.index),u):u})},J.concat=J.or,J.empty=H,J.of=B,J["fantasy-land/ap"]=J.ap,J["fantasy-land/chain"]=J.chain,J["fantasy-land/concat"]=J.concat,J["fantasy-land/empty"]=J.empty,J["fantasy-land/of"]=J.of,J["fantasy-land/map"]=J.map;var K=e(function(n,t){return o(t,c(n,t))}),N=e(function(n,t){return t>=n.length?a(t,"any character"):o(t+1,n.charAt(t))}),Q=e(function(n,t){return o(n.length,n.slice(t))}),T=e(function(n,t){return t<n.length?a(t,"EOF"):o(t,null)}),U=A(/[0-9]/).desc("a digit"),V=A(/[0-9]*/).desc("optional digits"),X=A(/[a-z]/i).desc("a letter"),Y=A(/[a-z]*/i).desc("optional letters"),Z=A(/\s*/).desc("optional whitespace"),$=A(/\s+/).desc("whitespace");e.all=Q,e.alt=j,e.any=N,e.createLanguage=k,e.custom=I,e.digit=U,e.digits=V,e.empty=H,e.eof=T,e.fail=F,e.formatError=x,e.index=K,e.isParser=u,e.lazy=G,e.letter=X,e.letters=Y,e.lookahead=M,e.makeFailure=a,e.makeSuccess=o,e.noneOf=W,e.notFollowedBy=R,e.of=B,e.oneOf=S,e.optWhitespace=Z,e.Parser=e,e.range=C,e.regex=A,e.regexp=A,e.sepBy=P,e.sepBy1=q,e.seq=_,e.seqMap=O,e.seqObj=b,e.string=z,e.succeed=B,e.takeWhile=D,e.test=L,e.whitespace=$,e["fantasy-land/empty"]=H,e["fantasy-land/of"]=B,n.exports=e}])});

/***/ }),

/***/ "./src/www/app sync recursive \\.component\\.js$/":
/*!********************************************!*\
  !*** ./src/www/app sync \.component\.js$/ ***!
  \********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./component/ast/ast.component.js": "./src/www/app/component/ast/ast.component.js",
	"./component/hfi-app/hfi-app.component.js": "./src/www/app/component/hfi-app/hfi-app.component.js",
	"./component/landing-app/landing-app.component.js": "./src/www/app/component/landing-app/landing-app.component.js",
	"./component/pretty/enclose/enclose-block.component.js": "./src/www/app/component/pretty/enclose/enclose-block.component.js",
	"./component/pretty/enclose/enclose-paren.component.js": "./src/www/app/component/pretty/enclose/enclose-paren.component.js",
	"./component/pretty/enclose/enclose-square.component.js": "./src/www/app/component/pretty/enclose/enclose-square.component.js",
	"./component/pretty/indent/indent.component.js": "./src/www/app/component/pretty/indent/indent.component.js",
	"./component/pretty/node/p-ceffect.component.js": "./src/www/app/component/pretty/node/p-ceffect.component.js",
	"./component/pretty/node/p-context.component.js": "./src/www/app/component/pretty/node/p-context.component.js",
	"./component/pretty/node/p-ctype.component.js": "./src/www/app/component/pretty/node/p-ctype.component.js",
	"./component/pretty/node/p-effect-error.component.js": "./src/www/app/component/pretty/node/p-effect-error.component.js",
	"./component/pretty/node/p-effect.component.js": "./src/www/app/component/pretty/node/p-effect.component.js",
	"./component/pretty/node/p-error.component.js": "./src/www/app/component/pretty/node/p-error.component.js",
	"./component/pretty/node/p-exp.component.js": "./src/www/app/component/pretty/node/p-exp.component.js",
	"./component/pretty/node/p-index.component.js": "./src/www/app/component/pretty/node/p-index.component.js",
	"./component/pretty/node/p-kind.component.js": "./src/www/app/component/pretty/node/p-kind.component.js",
	"./component/pretty/node/p-name.component.js": "./src/www/app/component/pretty/node/p-name.component.js",
	"./component/pretty/node/p-nametm.component.js": "./src/www/app/component/pretty/node/p-nametm.component.js",
	"./component/pretty/node/p-primapp.component.js": "./src/www/app/component/pretty/node/p-primapp.component.js",
	"./component/pretty/node/p-prop.component.js": "./src/www/app/component/pretty/node/p-prop.component.js",
	"./component/pretty/node/p-sort.component.js": "./src/www/app/component/pretty/node/p-sort.component.js",
	"./component/pretty/node/p-tcons.component.js": "./src/www/app/component/pretty/node/p-tcons.component.js",
	"./component/pretty/node/p-td.component.js": "./src/www/app/component/pretty/node/p-td.component.js",
	"./component/pretty/node/p-term.component.js": "./src/www/app/component/pretty/node/p-term.component.js",
	"./component/pretty/node/p-type.component.js": "./src/www/app/component/pretty/node/p-type.component.js",
	"./component/pretty/node/p-val.component.js": "./src/www/app/component/pretty/node/p-val.component.js",
	"./component/pretty/term/id-name.component.js": "./src/www/app/component/pretty/term/id-name.component.js",
	"./component/pretty/term/id-type.component.js": "./src/www/app/component/pretty/term/id-type.component.js",
	"./component/pretty/term/id-var.component.js": "./src/www/app/component/pretty/term/id-var.component.js",
	"./component/pretty/term/keyword.component.js": "./src/www/app/component/pretty/term/keyword.component.js",
	"./component/pretty/term/literal.component.js": "./src/www/app/component/pretty/term/literal.component.js",
	"./component/pretty/term/operator.component.js": "./src/www/app/component/pretty/term/operator.component.js",
	"./component/trace/trace.component.js": "./src/www/app/component/trace/trace.component.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.component\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.config\\.js$/":
/*!*****************************************!*\
  !*** ./src/www/app sync \.config\.js$/ ***!
  \*****************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./config/animation.config.js": "./src/www/app/config/animation.config.js",
	"./config/app.config.js": "./src/www/app/config/app.config.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.config\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.constant\\.js$/":
/*!*******************************************!*\
  !*** ./src/www/app sync \.constant\.js$/ ***!
  \*******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/www/app sync recursive \\.constant\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.directive\\.js$/":
/*!********************************************!*\
  !*** ./src/www/app sync \.directive\.js$/ ***!
  \********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./directive/ace-editor.directive.js": "./src/www/app/directive/ace-editor.directive.js",
	"./directive/p-handle/p-handle.directive.js": "./src/www/app/directive/p-handle/p-handle.directive.js",
	"./directive/refresh.directive.js": "./src/www/app/directive/refresh.directive.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.directive\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.factory\\.js$/":
/*!******************************************!*\
  !*** ./src/www/app sync \.factory\.js$/ ***!
  \******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./factory/api.factory.js": "./src/www/app/factory/api.factory.js",
	"./factory/cursor.factory.js": "./src/www/app/factory/cursor.factory.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.factory\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.filter\\.js$/":
/*!*****************************************!*\
  !*** ./src/www/app sync \.filter\.js$/ ***!
  \*****************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/www/app sync recursive \\.filter\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.provider\\.js$/":
/*!*******************************************!*\
  !*** ./src/www/app sync \.provider\.js$/ ***!
  \*******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/www/app sync recursive \\.provider\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.run\\.js$/":
/*!**************************************!*\
  !*** ./src/www/app sync \.run\.js$/ ***!
  \**************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./config/console.run.js": "./src/www/app/config/console.run.js",
	"./config/promise.run.js": "./src/www/app/config/promise.run.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.run\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.service\\.js$/":
/*!******************************************!*\
  !*** ./src/www/app sync \.service\.js$/ ***!
  \******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./service/example.service.js": "./src/www/app/service/example.service.js",
	"./service/parse.service.js": "./src/www/app/service/parse.service.js",
	"./service/rust.service.js": "./src/www/app/service/rust.service.js",
	"./service/storage.service.js": "./src/www/app/service/storage.service.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app sync recursive \\.service\\.js$/";

/***/ }),

/***/ "./src/www/app sync recursive \\.value\\.js$/":
/*!****************************************!*\
  !*** ./src/www/app sync \.value\.js$/ ***!
  \****************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error('Cannot find module "' + req + '".');
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/www/app sync recursive \\.value\\.js$/";

/***/ }),

/***/ "./src/www/app/component/ast/ast.component.js":
/*!****************************************************!*\
  !*** ./src/www/app/component/ast/ast.component.js ***!
  \****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(/*! ./ast.html */ "./src/www/app/component/ast/ast.html"),
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

/***/ "./src/www/app/component/ast/ast.html":
/*!********************************************!*\
  !*** ./src/www/app/component/ast/ast.html ***!
  \********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<code ng-bind=\"$ctrl.node[0]\"></code>\n<enclose-paren ng-if=\"$ctrl.depth >= 1\">..</enclose-paren>\n<enclose-paren ng-if=\"$ctrl.node.length > 1 && $ctrl.depth < 1\">\n\t<span ng-repeat=\"item in $ctrl.node\" ng-if=\"$index\">\n\t\t<!--<indent>-->\n\t\t\t<literal ng-if=\"!$ctrl.isNode(item)\"><span ng-bind=\"$ctrl.toJSON(item)\"></span></literal>\n\t\t\t<ast ng-if=\"$ctrl.isNode(item)\" node=\"item\" depth=\"$ctrl.depth + 1\"></ast>\n\t\t<!--</indent>-->\n\t</span>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/component/hfi-app/hfi-app.component.js":
/*!************************************************************!*\
  !*** ./src/www/app/component/hfi-app/hfi-app.component.js ***!
  \************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(/*! ./hfi-app.html */ "./src/www/app/component/hfi-app/hfi-app.html"),
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

/***/ }),

/***/ "./src/www/app/component/hfi-app/hfi-app.html":
/*!****************************************************!*\
  !*** ./src/www/app/component/hfi-app/hfi-app.html ***!
  \****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<div class=\"bg-light text-muted p-2\">\n\t<div class=\"row\">\n\t\t<div class=\"col-sm-3 text-left\">\n\t\t\t<div class=\"btn-group btn-group-sm\">\n\t\t\t\t<span class=\"btn btn-light text-muted m-0\" ng-click=\"$ctrl.toggleInputPanel()\"><i class=\"fa fa-text-height\"></i></span>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-sm-6 text-center noselect\">\n\t\t\t<h1 class=\"page-title mb-0 mt-1\">Human-Fungi Interface</h1>\n\t\t</div>\n\t\t<div class=\"col-sm-3 text-right\">\n\t\t\t<a href=\"https://docs.rs/fungi-lang/\" title=\"Fungi Documentation\" target=\"_blank\">\n\t\t\t\t<img src=\"/assets/img/fungi-logo-small.png\" class=\"logo\" style=\"height:32px\">\n\t\t\t</a>\n\t\t</div>\n\t</div>\n</div>\n<div\n\tondragover=\"event.stopPropagation(); event.preventDefault(); $(this).addClass('dragdrop'); event.dataTransfer.dropEffect = 'link'\"\n\tondragleave=\"event.stopPropagation(); event.preventDefault(); $(this).removeClass('dragdrop')\"\n\tondrop=\"event.stopPropagation(); event.preventDefault(); $(this).removeClass('dragdrop'); $(this).scope().$ctrl.loadFile(event.dataTransfer.files[0])\">\n\t<div class=\"row\">\n\t\t<div class=\"col-md-6 bg-darker p-0\">\n\t\t\t<div ng-show=\"!$ctrl.showContext\" class=\"w-100 full-height\" ace-editor ng-model=\"$ctrl.input\" ng-change=\"$ctrl.updateInput()\"></div>\n\t\t\t<div ng-show=\"$ctrl.showContext\" class=\"w-100 full-height\">\n\t\t\t\t<div class=\"pl-3 o-80\" ng-if=\"$ctrl.cursor.type\">\n\t\t\t\t\t<refresh target=\"$ctrl.cursor.type\">\n\t\t\t\t\t\t<div class=\"full-height v-scroll\">\n\t\t\t\t\t\t\t<div class=\"container mt-3\">\n\t\t\t\t\t\t\t\t<div ng-repeat=\"node in ::$ctrl.flattenFirst($ctrl.cursor.type.ctx)\">\n\t\t\t\t\t\t\t\t\t<p-context node=\"node\"></p-context>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"container mt-3\">\n\t\t\t\t\t\t\t\t<hr class=\"mt-0\">\n\t\t\t\t\t\t\t\t<b class=\"text-warning\">&#8870;</b>\n\t\t\t\t\t\t\t\t<span class=\"text-muted\"><span ng-bind=\"$ctrl.cursor.type.vis[1].tmfam\"></span>::</span><span ng-bind=\"$ctrl.cursor.type.rule[0]\"></span>\n\t\t\t\t\t\t\t\t<ng-switch on=\"$ctrl.cursor.type.dir[0]\" class=\"text-warning\">\n\t\t\t\t\t\t\t\t\t<b ng-switch-when=\"Synth\">&rArr;</b>\n\t\t\t\t\t\t\t\t\t<b ng-switch-when=\"Check\">&lArr;</b>\n\t\t\t\t\t\t\t\t</ng-switch>\n\t\t\t\t\t\t\t\t<indent>\n\t\t\t\t\t\t\t\t\t<div ng-if=\"$ctrl.cursor.type.dir[1] || $ctrl.cursor.type.clas[0] == 'Ok'\">\n\t\t\t\t\t\t\t\t\t\t<p-td node=\"$ctrl.cursor.type.dir[1] || $ctrl.cursor.type.clas[1]\"></p-td>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</indent>\n\t\t\t\t\t\t\t\t<div ng-if=\"$ctrl.cursor.type.clas[0] == 'Err'\" class=\"mt-2\">\n\t\t\t\t\t\t\t\t\t<keyword type=\"error\"><span ng-bind=\"$ctrl.cursor.type.clas[1][0]\"></span></keyword>\n\t\t\t\t\t\t\t\t\t<operator ng-if=\"$ctrl.cursor.type.clas[1].length > 1\">:</operator>\n\t\t\t\t\t\t\t\t\t<indent>\n\t\t\t\t\t\t\t\t\t\t<p-error node=\"$ctrl.cursor.type.clas[1]\"></p-error>\n\t\t\t\t\t\t\t\t\t</indent>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</refresh>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-md-6 p-0\">\n\t\t\t<div class=\"pretty-panel container v-scroll full-height\">\n\t\t\t\t<refresh target=\"$ctrl.program\" ng-if=\"$ctrl.program\">\n\t\t\t\t\t<p-exp node=\"::$ctrl.program\"></p-exp>\n\t\t\t\t</refresh>\n\t\t\t</div>\n\t\t</div>\n\t\t<div style=\"position:absolute; bottom:1em; right:1em; opacity:.95\">\n\t\t\t<refresh target=\"$ctrl.cursor.path\">\n\t\t\t\t<span class=\"text-muted bg-dark\" ng-repeat=\"node in $ctrl.cursor.path\">\n\t\t\t\t\t<span ng-if=\"$index==$ctrl.cursor.path.length-1\"><span ng-bind=\"node._type.vis[1].tmfam\"></span>::</span><span ng-bind=\"node[0]\"></span>\n\t\t\t\t</span>\n\t\t\t</refresh>\n\t\t</div>\n\t</div>\n</div>\n<!--<div id=\"ast-tree\"></div>-->\n<div class=\"text-center py-2 pt-3 m-0 bg-dark o-8\" style=\"position:fixed; top:30vh; left:0; right:0\" ng-if=\"$ctrl.loading\">\n\t<h3 class=\"text-muted\">Loading...</h3>\n</div>\n";

/***/ }),

/***/ "./src/www/app/component/landing-app/landing-app.component.js":
/*!********************************************************************!*\
  !*** ./src/www/app/component/landing-app/landing-app.component.js ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(/*! ./landing-app.html */ "./src/www/app/component/landing-app/landing-app.html"),
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

/***/ "./src/www/app/component/landing-app/landing-app.html":
/*!************************************************************!*\
  !*** ./src/www/app/component/landing-app/landing-app.html ***!
  \************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<div class=\"py-5 bg-darkest\">\n\t<div class=\"container text-center\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-md-4\">\n\t\t\t\t<a class=\"float-left mt-4\" href=\"https://docs.rs/fungi-lang/\" title=\"Fungi Documentation\" target=\"_blank\">\n\t\t\t\t\t<img src=\"/assets/img/fungi-logo-small.png\" class=\"logo\" style=\"height:48px\">\n\t\t\t\t</a>\n\t\t\t\t<h1 class=\"display-4 font-code mt-2 pt-1\">Fungi</h1>\n\t\t\t</div>\n\t\t\t<div class=\"col-md-8 text-md-left\">\n\t\t\t\t<h2><small class=\"text-muted text-thin\">An incremental computing language with precisely named cache locations.</small></h2>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div class=\"bg-white text-center pt-1 glow-theme\">\n\t<!--<ul class=\"list-inline\">-->\n\t<!--\t<li class=\"list-inline-item\">-->\n\t<!--\t\t<a href=\"#\">Examples</a>-->\n\t<!--\t</li>-->\n\t<!--\t<li class=\"list-inline-item\">-->\n\t<!--\t\t<a href=\"#\">Quickstart</a>-->\n\t<!--\t</li>-->\n\t<!--\t<li class=\"list-inline-item\">-->\n\t<!--\t\t<a href=\"#\">Documentation</a>-->\n\t<!--\t</li>-->\n\t<!--</ul>-->\n</div>\n<div class=\"container text-center pt-5\">\n\t<div class=\"row\">\n\t\t<div class=\"col-md-6 text-md-left mb-5\">\n\t\t\t<h3 class=\"text-spread mx-4\">Features</h3>\n\t\t\t<hr>\n\t\t\t<ul class=\"list-group list-group-dark\">\n\t\t\t\t<li class=\"list-group-item\">\n\t\t\t\t\t<h5 class=\"text-thin\">Comprehensive type system</h5>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"list-group-item\">\n\t\t\t\t\t<h5 class=\"text-thin\">Purely functional effect representation</h5>\n\t\t\t\t</li>\n\t\t\t\t<li class=\"list-group-item\">\n\t\t\t\t\t<h5 class=\"text-thin\">Implemented with <a href=\"https://rust-lang.org\" target=\"_blank\">Rust</a> and <a href=\"http://adapton-lang.org\" target=\"_blank\">Adapton</a></h5>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<hr>\n\t\t\t<h4 class=\"mx-4\"><a href=\"https://docs.rs/fungi-lang/\">Language Documentation</a></h4>\n\t\t</div>\n\t\t<div class=\"col-md-6 text-md-right mb-5\">\n\t\t\t<h3 class=\"text-spread mx-4\">Examples</h3>\n\t\t\t<hr>\n\t\t\t<div style=\"max-height:40vh; overflow-y:scroll\">\n\t\t\t\t<ul class=\"list-group list-group-dark\">\n\t\t\t\t\t<li class=\"list-group-item clickable py-0\" ng-repeat=\"example in $ctrl.examples\">\n\t\t\t\t\t\t<div class=\"row\" ng-click=\"$ctrl.viewExample(example, $event)\">\n\t\t\t\t\t\t\t<div class=\"col-8 text-left\">\n\t\t\t\t\t\t\t\t<p class=\"font-code mb-0\" ng-bind=\"example.name\"></p>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"col-4 text-center\">\n\t\t\t\t\t\t\t\t<i class=\"fa fa-arrow-circle-right text-muted\"></i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<!--<a href=\"https://docs.rs/fungi-lang/\" title=\"Fungi Documentation\" target=\"_blank\">-->\n<!--\t<img src=\"/assets/fungi-logo.png\" class=\"logo\" style=\"height:32px\">-->\n<!--</a>-->";

/***/ }),

/***/ "./src/www/app/component/pretty/enclose/enclose-block.component.js":
/*!*************************************************************************!*\
  !*** ./src/www/app/component/pretty/enclose/enclose-block.component.js ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/enclose/schema.js")('{', '}');

/***/ }),

/***/ "./src/www/app/component/pretty/enclose/enclose-paren.component.js":
/*!*************************************************************************!*\
  !*** ./src/www/app/component/pretty/enclose/enclose-paren.component.js ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/enclose/schema.js")('(', ')');

/***/ }),

/***/ "./src/www/app/component/pretty/enclose/enclose-square.component.js":
/*!**************************************************************************!*\
  !*** ./src/www/app/component/pretty/enclose/enclose-square.component.js ***!
  \**************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/enclose/schema.js")('[', ']');

/***/ }),

/***/ "./src/www/app/component/pretty/enclose/schema.js":
/*!********************************************************!*\
  !*** ./src/www/app/component/pretty/enclose/schema.js ***!
  \********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/component/pretty/indent/indent.component.js":
/*!*****************************************************************!*\
  !*** ./src/www/app/component/pretty/indent/indent.component.js ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `
		<span class="d-inline-block indent" ng-class="{'pl-3': !$ctrl.collapsed}"
			ng-click="$ctrl.collapsed = false; $event.stopPropagation()"
			ng-dblclick="$ctrl.collapsed = true; $event.stopPropagation()">
			<span class="text-warning indent-collapse clickable" ng-if="$ctrl.collapsed">(..)</span>
			<ng-transclude ng-if="!$ctrl.collapsed">
		</span>`,
	transclude: true,
	bindings: {
		collapsed: '<',
	}
}

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-ceffect.component.js":
/*!******************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-ceffect.component.js ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('ceffect');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-context.component.js":
/*!******************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-context.component.js ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('context');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-ctype.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-ctype.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('ctype');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-effect-error.component.js":
/*!***********************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-effect-error.component.js ***!
  \***********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('effect-error');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-effect.component.js":
/*!*****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-effect.component.js ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('effect');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-error.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-error.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('error');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-exp.component.js":
/*!**************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-exp.component.js ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('exp');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-index.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-index.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('index');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-kind.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-kind.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('kind');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-name.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-name.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('name');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-nametm.component.js":
/*!*****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-nametm.component.js ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('nametm');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-primapp.component.js":
/*!******************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-primapp.component.js ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('primapp');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-prop.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-prop.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('prop');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-sort.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-sort.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('sort');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-tcons.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-tcons.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('tcons');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-td.component.js":
/*!*************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-td.component.js ***!
  \*************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('{{$ctrl.cursor.type.category}}');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-term.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-term.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('term');

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-type.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-type.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('type');
// module.exports = {
// 	template: `<span class="text-muted clickable">(..)</span>`,
// }

/***/ }),

/***/ "./src/www/app/component/pretty/node/p-val.component.js":
/*!**************************************************************!*\
  !*** ./src/www/app/component/pretty/node/p-val.component.js ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./schema */ "./src/www/app/component/pretty/node/schema.js")('val');

/***/ }),

/***/ "./src/www/app/component/pretty/node/schema.js":
/*!*****************************************************!*\
  !*** ./src/www/app/component/pretty/node/schema.js ***!
  \*****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/component/pretty/term/id-name.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/term/id-name.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `<span class="id-type clickable" ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
	}
};

/***/ }),

/***/ "./src/www/app/component/pretty/term/id-type.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/term/id-type.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `<span class="id-type clickable" ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
	}
};

/***/ }),

/***/ "./src/www/app/component/pretty/term/id-var.component.js":
/*!***************************************************************!*\
  !*** ./src/www/app/component/pretty/term/id-var.component.js ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/component/pretty/term/keyword.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/term/keyword.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="keyword" ng-class="'keyword-' + $ctrl.type" />`,
	transclude: true,
	bindings: {
		type: '@',
	},
};

/***/ }),

/***/ "./src/www/app/component/pretty/term/literal.component.js":
/*!****************************************************************!*\
  !*** ./src/www/app/component/pretty/term/literal.component.js ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="literal" />`,
	transclude: true,
};

/***/ }),

/***/ "./src/www/app/component/pretty/term/operator.component.js":
/*!*****************************************************************!*\
  !*** ./src/www/app/component/pretty/term/operator.component.js ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = {
	template: `<ng-transclude class="operator" />`,
	transclude: true,
};

/***/ }),

/***/ "./src/www/app/component/trace/trace.component.js":
/*!********************************************************!*\
  !*** ./src/www/app/component/trace/trace.component.js ***!
  \********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	template: __webpack_require__(/*! ./trace.html */ "./src/www/app/component/trace/trace.html"),
	bindings: {
		node: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		
	}
};

/***/ }),

/***/ "./src/www/app/component/trace/trace.html":
/*!************************************************!*\
  !*** ./src/www/app/component/trace/trace.html ***!
  \************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "";

/***/ }),

/***/ "./src/www/app/config/animation.config.js":
/*!************************************************!*\
  !*** ./src/www/app/config/animation.config.js ***!
  \************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = function($animateProvider)
{
	// only `.allow-anim` elements will be animated by Angular
	$animateProvider.classNameFilter(/allow-anim/);
}

/***/ }),

/***/ "./src/www/app/config/app.config.js":
/*!******************************************!*\
  !*** ./src/www/app/config/app.config.js ***!
  \******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = function($locationProvider, $compileProvider)
{
	$locationProvider.html5Mode(true);
	
	$compileProvider.preAssignBindingsEnabled(true);
}

/***/ }),

/***/ "./src/www/app/config/console.run.js":
/*!*******************************************!*\
  !*** ./src/www/app/config/console.run.js ***!
  \*******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/config/promise.run.js":
/*!*******************************************!*\
  !*** ./src/www/app/config/promise.run.js ***!
  \*******************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = function($q)
{
	// help Angular automatically update UI after promise resolution in dependencies
	window.Promise = $q;
}

/***/ }),

/***/ "./src/www/app/directive/ace-editor.directive.js":
/*!*******************************************************!*\
  !*** ./src/www/app/directive/ace-editor.directive.js ***!
  \*******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/directive/p-handle/fallback.html":
/*!******************************************************!*\
  !*** ./src/www/app/directive/p-handle/fallback.html ***!
  \******************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<ast ng-if=\"$ctrl.isNode($ctrl.node)\" node=\"$ctrl.node\"></ast>\n<literal ng-if=\"!$ctrl.isNode($ctrl.node)\"><span ng-bind=\"$ctrl.node\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/p-handle.directive.js":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/p-handle.directive.js ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var angular = window.angular;

var templateContext = __webpack_require__("./src/www/app/directive/p-handle/template sync recursive \\.html$/");
var fallbackTemplate = __webpack_require__(/*! ./fallback.html */ "./src/www/app/directive/p-handle/fallback.html");

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

/***/ "./src/www/app/directive/p-handle/template sync recursive \\.html$/":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template sync \.html$/ ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ceffect/Cons.html": "./src/www/app/directive/p-handle/template/ceffect/Cons.html",
	"./ceffect/ForallIdx.html": "./src/www/app/directive/p-handle/template/ceffect/ForallIdx.html",
	"./ceffect/ForallType.html": "./src/www/app/directive/p-handle/template/ceffect/ForallType.html",
	"./context/Def.html": "./src/www/app/directive/p-handle/template/context/Def.html",
	"./context/Empty.html": "./src/www/app/directive/p-handle/template/context/Empty.html",
	"./context/IVar.html": "./src/www/app/directive/p-handle/template/context/IVar.html",
	"./context/PropTrue.html": "./src/www/app/directive/p-handle/template/context/PropTrue.html",
	"./context/TCons.html": "./src/www/app/directive/p-handle/template/context/TCons.html",
	"./context/TVar.html": "./src/www/app/directive/p-handle/template/context/TVar.html",
	"./context/Var.html": "./src/www/app/directive/p-handle/template/context/Var.html",
	"./ctype/Arrow.html": "./src/www/app/directive/p-handle/template/ctype/Arrow.html",
	"./ctype/Lift.html": "./src/www/app/directive/p-handle/template/ctype/Lift.html",
	"./effect-error/CannotSubtractNmSetTmFromNmSet.html": "./src/www/app/directive/p-handle/template/effect-error/CannotSubtractNmSetTmFromNmSet.html",
	"./effect/WR.html": "./src/www/app/directive/p-handle/template/effect/WR.html",
	"./error/CheckFailCEffect.html": "./src/www/app/directive/p-handle/template/error/CheckFailCEffect.html",
	"./error/CheckFailType.html": "./src/www/app/directive/p-handle/template/error/CheckFailType.html",
	"./error/EffectError.html": "./src/www/app/directive/p-handle/template/error/EffectError.html",
	"./error/Inside.html": "./src/www/app/directive/p-handle/template/error/Inside.html",
	"./error/Later.html": "./src/www/app/directive/p-handle/template/error/Later.html",
	"./error/MismatchSort.html": "./src/www/app/directive/p-handle/template/error/MismatchSort.html",
	"./error/ParamMism.html": "./src/www/app/directive/p-handle/template/error/ParamMism.html",
	"./error/ParamNoCheck.html": "./src/www/app/directive/p-handle/template/error/ParamNoCheck.html",
	"./error/ParamNoSynth.html": "./src/www/app/directive/p-handle/template/error/ParamNoSynth.html",
	"./error/SubsumptionFailure.html": "./src/www/app/directive/p-handle/template/error/SubsumptionFailure.html",
	"./error/SynthFailVal.html": "./src/www/app/directive/p-handle/template/error/SynthFailVal.html",
	"./error/UnexpectedCEffect.html": "./src/www/app/directive/p-handle/template/error/UnexpectedCEffect.html",
	"./error/UnexpectedType.html": "./src/www/app/directive/p-handle/template/error/UnexpectedType.html",
	"./error/VarNotInScope.html": "./src/www/app/directive/p-handle/template/error/VarNotInScope.html",
	"./exp/AnnoC.html": "./src/www/app/directive/p-handle/template/exp/AnnoC.html",
	"./exp/AnnoE.html": "./src/www/app/directive/p-handle/template/exp/AnnoE.html",
	"./exp/App.html": "./src/www/app/directive/p-handle/template/exp/App.html",
	"./exp/Case.html": "./src/www/app/directive/p-handle/template/exp/Case.html",
	"./exp/Decls.html": "./src/www/app/directive/p-handle/template/exp/Decls.html",
	"./exp/DefType.html": "./src/www/app/directive/p-handle/template/exp/DefType.html",
	"./exp/Fix.html": "./src/www/app/directive/p-handle/template/exp/Fix.html",
	"./exp/Force.html": "./src/www/app/directive/p-handle/template/exp/Force.html",
	"./exp/Get.html": "./src/www/app/directive/p-handle/template/exp/Get.html",
	"./exp/IdxApp.html": "./src/www/app/directive/p-handle/template/exp/IdxApp.html",
	"./exp/IfThenElse.html": "./src/www/app/directive/p-handle/template/exp/IfThenElse.html",
	"./exp/Lam.html": "./src/www/app/directive/p-handle/template/exp/Lam.html",
	"./exp/Let.html": "./src/www/app/directive/p-handle/template/exp/Let.html",
	"./exp/NameFnApp.html": "./src/www/app/directive/p-handle/template/exp/NameFnApp.html",
	"./exp/PrimApp.html": "./src/www/app/directive/p-handle/template/exp/PrimApp.html",
	"./exp/Ref.html": "./src/www/app/directive/p-handle/template/exp/Ref.html",
	"./exp/Ret.html": "./src/www/app/directive/p-handle/template/exp/Ret.html",
	"./exp/Split.html": "./src/www/app/directive/p-handle/template/exp/Split.html",
	"./exp/Thunk.html": "./src/www/app/directive/p-handle/template/exp/Thunk.html",
	"./exp/Unimp.html": "./src/www/app/directive/p-handle/template/exp/Unimp.html",
	"./exp/Unpack.html": "./src/www/app/directive/p-handle/template/exp/Unpack.html",
	"./exp/Unroll.html": "./src/www/app/directive/p-handle/template/exp/Unroll.html",
	"./exp/UseAll.html": "./src/www/app/directive/p-handle/template/exp/UseAll.html",
	"./exp/WriteScope.html": "./src/www/app/directive/p-handle/template/exp/WriteScope.html",
	"./index/Apart.html": "./src/www/app/directive/p-handle/template/index/Apart.html",
	"./index/App.html": "./src/www/app/directive/p-handle/template/index/App.html",
	"./index/Bin.html": "./src/www/app/directive/p-handle/template/index/Bin.html",
	"./index/Empty.html": "./src/www/app/directive/p-handle/template/index/Empty.html",
	"./index/FlatMap.html": "./src/www/app/directive/p-handle/template/index/FlatMap.html",
	"./index/FlatMapStar.html": "./src/www/app/directive/p-handle/template/index/FlatMapStar.html",
	"./index/Ident.html": "./src/www/app/directive/p-handle/template/index/Ident.html",
	"./index/Lam.html": "./src/www/app/directive/p-handle/template/index/Lam.html",
	"./index/Map.html": "./src/www/app/directive/p-handle/template/index/Map.html",
	"./index/MapStar.html": "./src/www/app/directive/p-handle/template/index/MapStar.html",
	"./index/NmSet.html": "./src/www/app/directive/p-handle/template/index/NmSet.html",
	"./index/Sing.html": "./src/www/app/directive/p-handle/template/index/Sing.html",
	"./index/Union.html": "./src/www/app/directive/p-handle/template/index/Union.html",
	"./index/Var.html": "./src/www/app/directive/p-handle/template/index/Var.html",
	"./index/WriteScope.html": "./src/www/app/directive/p-handle/template/index/WriteScope.html",
	"./kind/Type.html": "./src/www/app/directive/p-handle/template/kind/Type.html",
	"./name/Bin.html": "./src/www/app/directive/p-handle/template/name/Bin.html",
	"./name/Num.html": "./src/www/app/directive/p-handle/template/name/Num.html",
	"./nametm/App.html": "./src/www/app/directive/p-handle/template/nametm/App.html",
	"./nametm/Bin.html": "./src/www/app/directive/p-handle/template/nametm/Bin.html",
	"./nametm/Ident.html": "./src/www/app/directive/p-handle/template/nametm/Ident.html",
	"./nametm/Lam.html": "./src/www/app/directive/p-handle/template/nametm/Lam.html",
	"./nametm/Name.html": "./src/www/app/directive/p-handle/template/nametm/Name.html",
	"./nametm/ValVar.html": "./src/www/app/directive/p-handle/template/nametm/ValVar.html",
	"./nametm/Var.html": "./src/www/app/directive/p-handle/template/nametm/Var.html",
	"./nametm/WriteScope.html": "./src/www/app/directive/p-handle/template/nametm/WriteScope.html",
	"./primapp/NameBin.html": "./src/www/app/directive/p-handle/template/primapp/NameBin.html",
	"./primapp/NatLt.html": "./src/www/app/directive/p-handle/template/primapp/NatLt.html",
	"./primapp/RefThunk.html": "./src/www/app/directive/p-handle/template/primapp/RefThunk.html",
	"./prop/Equiv.html": "./src/www/app/directive/p-handle/template/prop/Equiv.html",
	"./prop/Tt.html": "./src/www/app/directive/p-handle/template/prop/Tt.html",
	"./sort/IdxArrow.html": "./src/www/app/directive/p-handle/template/sort/IdxArrow.html",
	"./sort/Nm.html": "./src/www/app/directive/p-handle/template/sort/Nm.html",
	"./sort/NmArrow.html": "./src/www/app/directive/p-handle/template/sort/NmArrow.html",
	"./sort/NmSet.html": "./src/www/app/directive/p-handle/template/sort/NmSet.html",
	"./tcons/Bool.html": "./src/www/app/directive/p-handle/template/tcons/Bool.html",
	"./tcons/D.html": "./src/www/app/directive/p-handle/template/tcons/D.html",
	"./tcons/Nat.html": "./src/www/app/directive/p-handle/template/tcons/Nat.html",
	"./tcons/Seq.html": "./src/www/app/directive/p-handle/template/tcons/Seq.html",
	"./tcons/String.html": "./src/www/app/directive/p-handle/template/tcons/String.html",
	"./tcons/User.html": "./src/www/app/directive/p-handle/template/tcons/User.html",
	"./term/IdxTm.html": "./src/www/app/directive/p-handle/template/term/IdxTm.html",
	"./term/NameTm.html": "./src/www/app/directive/p-handle/template/term/NameTm.html",
	"./term/Type.html": "./src/www/app/directive/p-handle/template/term/Type.html",
	"./type/Cons.html": "./src/www/app/directive/p-handle/template/type/Cons.html",
	"./type/Exists.html": "./src/www/app/directive/p-handle/template/type/Exists.html",
	"./type/Ident.html": "./src/www/app/directive/p-handle/template/type/Ident.html",
	"./type/IdxApp.html": "./src/www/app/directive/p-handle/template/type/IdxApp.html",
	"./type/IdxFn.html": "./src/www/app/directive/p-handle/template/type/IdxFn.html",
	"./type/Nm.html": "./src/www/app/directive/p-handle/template/type/Nm.html",
	"./type/NmFn.html": "./src/www/app/directive/p-handle/template/type/NmFn.html",
	"./type/Prod.html": "./src/www/app/directive/p-handle/template/type/Prod.html",
	"./type/Rec.html": "./src/www/app/directive/p-handle/template/type/Rec.html",
	"./type/Ref.html": "./src/www/app/directive/p-handle/template/type/Ref.html",
	"./type/Sum.html": "./src/www/app/directive/p-handle/template/type/Sum.html",
	"./type/Thk.html": "./src/www/app/directive/p-handle/template/type/Thk.html",
	"./type/TypeApp.html": "./src/www/app/directive/p-handle/template/type/TypeApp.html",
	"./type/TypeFn.html": "./src/www/app/directive/p-handle/template/type/TypeFn.html",
	"./type/Unit.html": "./src/www/app/directive/p-handle/template/type/Unit.html",
	"./type/Var.html": "./src/www/app/directive/p-handle/template/type/Var.html",
	"./val/Bool.html": "./src/www/app/directive/p-handle/template/val/Bool.html",
	"./val/Inj1.html": "./src/www/app/directive/p-handle/template/val/Inj1.html",
	"./val/Inj2.html": "./src/www/app/directive/p-handle/template/val/Inj2.html",
	"./val/Name.html": "./src/www/app/directive/p-handle/template/val/Name.html",
	"./val/NameFn.html": "./src/www/app/directive/p-handle/template/val/NameFn.html",
	"./val/Nat.html": "./src/www/app/directive/p-handle/template/val/Nat.html",
	"./val/Pack.html": "./src/www/app/directive/p-handle/template/val/Pack.html",
	"./val/Pair.html": "./src/www/app/directive/p-handle/template/val/Pair.html",
	"./val/Roll.html": "./src/www/app/directive/p-handle/template/val/Roll.html",
	"./val/ThunkAnon.html": "./src/www/app/directive/p-handle/template/val/ThunkAnon.html",
	"./val/Unit.html": "./src/www/app/directive/p-handle/template/val/Unit.html",
	"./val/Var.html": "./src/www/app/directive/p-handle/template/val/Var.html"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	var module = __webpack_require__(id);
	return module;
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/www/app/directive/p-handle/template sync recursive \\.html$/";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/ceffect/Cons.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/ceffect/Cons.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-effect node=\"$ctrl.node[2]\"></p-effect>\n<p-ctype node=\"$ctrl.node[1]\"></p-ctype>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/ceffect/ForallIdx.html":
/*!************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/ceffect/ForallIdx.html ***!
  \************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ceffect\">foralli</keyword>\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[2]\"></p-sort><span ng-if=\"$ctrl.node[3][0]!='Tt'\"> <operator>|</operator><p-prop node=\"$ctrl.node[3]\"></p-prop></span><operator>.</operator>\n<indent>\n\t<p-ceffect node=\"$ctrl.node[4]\"></p-ceffect>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/ceffect/ForallType.html":
/*!*************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/ceffect/ForallType.html ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ceffect\">forallt</keyword>\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\n<operator>:</operator>\n<p-kind node=\"$ctrl.node[2]\"></p-kind><operator>.</operator>\n<indent>\n\t<p-ceffect node=\"$ctrl.node[3]\"></p-ceffect>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/Def.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/Def.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"module\">def</keyword>\n<id-name name=\"$ctrl.node[2]\"></id-name>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-term node=\"$ctrl.node[3]\"></p-term>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/Empty.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/Empty.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<span class=\"text-muted\">&Gamma;</span>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/IVar.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/IVar.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"index\">ivar</keyword>\n<id-name name=\"$ctrl.node[2]\"></id-name>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-sort node=\"$ctrl.node[3]\"></p-sort>\n</indent";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/PropTrue.html":
/*!***********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/PropTrue.html ***!
  \***********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"prop\">prop</keyword>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-prop node=\"$ctrl.node[2]\"></p-prop>\n</indent";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/TCons.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/TCons.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"tcons\">tcons</keyword>\n<p-tcons node=\"$ctrl.node[2]\"></p-tcons>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-kind node=\"$ctrl.node[3]\"></p-kind>\n</indent";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/TVar.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/TVar.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"type\">tvar</keyword>\n<id-type name=\"$ctrl.node[2]\"></id-type>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-kind node=\"$ctrl.node[3]\"></p-kind>\n</indent";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/context/Var.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/context/Var.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<!--<p-context node=\"$ctrl.node[1]\"></p-context>-->\n<!--<br>-->\n<keyword type=\"exp\">var</keyword>\n<id-var name=\"$ctrl.node[2]\"></id-var>\n<operator>:</operator>\n<indent collapsed=\"true\">\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\n</indent";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/ctype/Arrow.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/ctype/Arrow.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\n<operator>&rarr;</operator>\n<br>\n<indent>\n\t<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/ctype/Lift.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/ctype/Lift.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"ctype\">&fnof;</keyword>\n<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/effect-error/CannotSubtractNmSetTmFromNmSet.html":
/*!**************************************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/effect-error/CannotSubtractNmSetTmFromNmSet.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"::['NmSet', $ctrl.node[1]]\"></p-index>\n<br>\n<br>\n<ng-switch on=\"$ctrl.node[2][0]\">\n\t<p-nametm ng-switch-when=\"Single\" node=\"$ctrl.node[2][1]\"></p-nametm>\n\t<p-index ng-switch-when=\"Subset\" node=\"$ctrl.node[2][1]\"></p-index>\n</ng-switch>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/effect/WR.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/effect/WR.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\n\t<operator>;</operator>\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/CheckFailCEffect.html":
/*!*****************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/CheckFailCEffect.html ***!
  \*****************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/CheckFailType.html":
/*!**************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/CheckFailType.html ***!
  \**************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/EffectError.html":
/*!************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/EffectError.html ***!
  \************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\n<indent>\n\t<p-effect-error node=\"$ctrl.node[1]\"></p-effect-error>\n</indent>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/Inside.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/Inside.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\n<indent>\n\t<p-error node=\"$ctrl.node[1]\"></p-error>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/Later.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/Later.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"error\"><span ng-bind=\"$ctrl.node[1][0]\"></span></keyword>\n<operator ng-if=\"$ctrl.node[1].length > 1\">:</operator>\n<indent>\n\t<p-error node=\"$ctrl.node[1]\"></p-error>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/MismatchSort.html":
/*!*************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/MismatchSort.html ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<br>\n<p-sort node=\"$ctrl.node[1]\"></p-sort>\n<br>\n<p-sort node=\"$ctrl.node[2]\"></p-sort>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/ParamMism.html":
/*!**********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/ParamMism.html ***!
  \**********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/ParamNoCheck.html":
/*!*************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/ParamNoCheck.html ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/ParamNoSynth.html":
/*!*************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/ParamNoSynth.html ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/SubsumptionFailure.html":
/*!*******************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/SubsumptionFailure.html ***!
  \*******************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<br>\n<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>\n<br>\n<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/SynthFailVal.html":
/*!*************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/SynthFailVal.html ***!
  \*************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/UnexpectedCEffect.html":
/*!******************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/UnexpectedCEffect.html ***!
  \******************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-ceffect node=\"$ctrl.node[1]\"></p-ceffect>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/UnexpectedType.html":
/*!***************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/UnexpectedType.html ***!
  \***************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/error/VarNotInScope.html":
/*!**************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/error/VarNotInScope.html ***!
  \**************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-var name=\"$ctrl.node[1]\"></id-var>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/AnnoC.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/AnnoC.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\n<operator>:</operator>\n<p-ctype node=\"$ctrl.node[2]\"></p-ctype>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/AnnoE.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/AnnoE.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\n<operator>:</operator>\n<p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/App.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/App.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<p-exp node=\"$ctrl.node[1]\"></p-exp>\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Case.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Case.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">match</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>\n<enclose-block>\n\t<br>\n\t<indent>\n\t\t<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var>\n\t\t<operator>&rArr;</operator>\n\t\t<indent>\n\t\t\t<p-exp node=\"$ctrl.node[3]\"></p-exp>\n\t\t</indent>\n\t</indent>\n\t<br>\n\t<indent>\n\t\t<id-var name=\"$ctrl.node[4]\" type=\"decl\"></id-var>\n\t\t<operator>&rArr;</operator>\n\t\t<indent>\n\t\t\t<p-exp node=\"$ctrl.node[5]\"></p-exp>\n\t\t</indent>\n\t</indent>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Decls.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Decls.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[2]\"></p-exp>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/DefType.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/DefType.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">type</keyword>\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\n<operator>=</operator>\n<indent collapsed=\"true\">\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\n</indent>\n<br>\n<p-exp node=\"$ctrl.node[3]\"></p-exp>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Fix.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Fix.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">fix</keyword>\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var><operator>.</operator>\n<p-exp node=\"$ctrl.node[2]\"></p-exp>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Force.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Force.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<keyword type=\"exp\">force</keyword>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Get.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Get.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<operator>!</operator>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/IdxApp.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/IdxApp.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[1]\"></p-exp>\n<enclose-square>\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-square>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/IfThenElse.html":
/*!*********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/IfThenElse.html ***!
  \*********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">if</keyword>\n<enclose-paren>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-paren>\n<enclose-block>\n\t<indent>\n\t\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\n\t</indent>\n</enclose-block>\n<keyword type=\"exp\">else</keyword>\n<enclose-block>\n\t<indent>\n\t\t<p-exp node=\"$ctrl.node[3]\"></p-exp>\n\t</indent>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Lam.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Lam.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">&lambda;</keyword>\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var><operator>.</operator>\n<p-exp node=\"$ctrl.node[2]\"></p-exp>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Let.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Let.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">let</keyword>\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var>\n<span ng-if=\"!$ctrl.node[2][0].startsWith('Anno')\">\n\t<operator>=</operator>\n\t<indent>\n\t\t<p-exp node=\"$ctrl.node[2]\" context=\"$parent\"></p-exp>\n\t</indent>\n</span>\n<span ng-if=\"$ctrl.node[2][0] == 'AnnoC'\">\n\t<operator>:</operator>\n\t<indent collapsed=\"true\">\n\t\t<p-ctype node=\"$ctrl.node[2][2]\"></p-ctype>\n\t</indent>\n\t<operator>=</operator>\n\t<indent>\n\t\t<p-exp node=\"$ctrl.node[2][1]\" context=\"$parent\"></p-exp>\n\t</indent>\n</span>\n<span ng-if=\"$ctrl.node[2][0] == 'AnnoE'\">\n\t<operator>:</operator>\n\t<indent collapsed=\"true\">\n\t\t<p-ceffect node=\"$ctrl.node[2][2]\"></p-ceffect>\n\t</indent>\n\t<operator>=</operator>\n\t<indent>\n\t\t<p-exp node=\"$ctrl.node[2][1]\" context=\"$parent\"></p-exp>\n\t</indent>\n</span>\n<br>\n<p-exp node=\"$ctrl.node[3]\"></p-exp>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/NameFnApp.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/NameFnApp.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-square>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-square>\n<p-val node=\"$ctrl.node[2]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/PrimApp.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/PrimApp.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-primapp node=\"$ctrl.node[1]\"></p-primapp>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Ref.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Ref.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ref</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>\n<p-val node=\"$ctrl.node[2]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Ret.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Ret.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ret</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Split.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Split.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">let</keyword>\n<enclose-paren>\n\t<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var>\n\t<operator>,</operator>\n\t<id-var name=\"$ctrl.node[3]\" type=\"decl\"></id-var>\n</enclose-paren>\n<operator>=</operator>\n<p-val node=\"$ctrl.node[1]\" context=\"$parent\"></p-val>\n<br>\n<p-exp node=\"$ctrl.node[4]\"></p-exp>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Thunk.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Thunk.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">Thunk</keyword>\n<enclose-square>\n    <p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-square>\n<br>\n<indent>\n\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Unimp.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Unimp.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<span class=\"text-muted\">???</span>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Unpack.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Unpack.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">unpack</keyword>\n<enclose-paren>\n\t<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\n</enclose-paren>\n<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var><operator>.</operator>\n<enclose-paren>\n\t<p-val node=\"$ctrl.node[3]\"></p-val>\n</enclose-paren>\n<br>\n<!--<indent>-->\n\t<p-exp node=\"$ctrl.node[4]\"></p-exp> \n<!--</indent>-->";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/Unroll.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/Unroll.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">unroll</keyword>\n<p-val node=\"$ctrl.node[1]\" context=\"$parent\"></p-val>\n<id-var name=\"$ctrl.node[2]\" type=\"decl\"></id-var><operator>.</operator>\n<p-exp node=\"$ctrl.node[3]\"></p-exp>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/UseAll.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/UseAll.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-exp node=\"$ctrl.node[2]\"></p-exp>\r\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/exp/WriteScope.html":
/*!*********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/exp/WriteScope.html ***!
  \*********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"exp\">ws</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>\n<indent>\n\t<p-exp node=\"$ctrl.node[2]\"></p-exp>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Apart.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Apart.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\n<operator>%</operator>\n<p-index node=\"$ctrl.node[2]\"></p-index>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/App.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/App.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n   <p-index node=\"$ctrl.node[1]\"></p-index>\n</enclose-block>\n<enclose-paren>\n   <p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Bin.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Bin.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n<p-index node=\"$ctrl.node[1]\"></p-index>\n<operator>&#10026;</operator>\n<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Empty.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Empty.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">&empty;</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/FlatMap.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/FlatMap.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n  <enclose-paren>\n    <p-index node=\"$ctrl.node[1]\"></p-index>\n  </enclose-paren>\n  <p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/FlatMapStar.html":
/*!************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/FlatMapStar.html ***!
  \************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n<enclose-paren><p-index node=\"$ctrl.node[1]\"></p-index></enclose-paren><sup><operator><b>*</b></operator></sup>\n<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Ident.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Ident.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Lam.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Lam.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">&lambda;</keyword>\n<id-var name=\"$ctrl.node[1]\" type=\"decl\"></id-var>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[2]\"></p-sort>\n<operator>.</operator>\n<indent>\n\t<p-index node=\"$ctrl.node[3]\"></p-index>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Map.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Map.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n  <enclose-bracket>\n    <p-nametm node=\"$ctrl.node[1]\"></p-nametm>\n  </enclose-bracket>\n  <p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/MapStar.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/MapStar.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n<enclose-square><p-nametm node=\"$ctrl.node[1]\"></p-nametm></enclose-square><sup><operator><b>*</b></operator></sup>\n<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-paren>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/NmSet.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/NmSet.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n\t<keyword type=\"index\" ng-if=\"!$ctrl.node[1][1].terms.length\">&empty;</keyword>\n\t<span ng-repeat=\"term in $ctrl.node[1][1].terms\">\n\t\t<br ng-if=\"$ctrl.node[1][1].terms.length > 2\">\n\t\t<ng-switch on=\"$ctrl.node[1][1].cons[1][0]\" ng-if=\"$index || $ctrl.node[1][1].terms.length > 2\">\n\t\t\t<operator>\n\t\t\t\t<span ng-switch-when=\"Apart\">%</span>\n\t\t\t\t<span ng-switch-when=\"Union\">U</span>\n\t\t\t</operator>\n\t\t</ng-switch>\n\t\t<ng-switch on=\"term[0]\">\n\t\t\t<p-nametm ng-switch-when=\"Single\" node=\"term[1]\"></p-nametm>\n\t\t\t<p-index ng-switch-when=\"Subset\" node=\"term[1]\"></p-index>\n\t\t</ng-switch>\n\t</span>\n\t<br ng-if=\"$ctrl.node[1][1].terms.length > 2\">\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Sing.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Sing.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Union.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Union.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\n<operator>U</operator>\n<p-index node=\"$ctrl.node[2]\"></p-index>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/Var.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/Var.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/index/WriteScope.html":
/*!***********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/index/WriteScope.html ***!
  \***********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"index\">@!</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/kind/Type.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/kind/Type.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"kind\">Type</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/name/Bin.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/name/Bin.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-name node=\"$ctrl.node[1]\"></p-name>\n<keyword>*</keyword>\n<p-name node=\"$ctrl.node[2]\"></p-name>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/name/Num.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/name/Num.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.toJSON($ctrl.node[1])\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/App.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/App.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-square>\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\n\t<p-nametm node=\"$ctrl.node[2]\"></p-nametm>\n</enclose-square>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/Bin.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/Bin.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\n<operator>,</operator>\n<p-nametm node=\"$ctrl.node[2]\"></p-nametm>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/Ident.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/Ident.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/Lam.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/Lam.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">&lambda;</keyword>\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[2]\"></p-sort>\n<operator>.</operator>\n<p-nametm node=\"$ctrl.node[3]\"></p-nametm>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/Name.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/Name.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<operator>@</operator><p-name node=\"$ctrl.node[1]\"></p-name>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/ValVar.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/ValVar.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">~</keyword><id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/Var.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/Var.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-name name=\"$ctrl.node[1]\"></id-name>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/nametm/WriteScope.html":
/*!************************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/nametm/WriteScope.html ***!
  \************************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"nametm\">@@</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/primapp/NameBin.html":
/*!**********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/primapp/NameBin.html ***!
  \**********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n\t<operator>@</operator>\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/primapp/NatLt.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/primapp/NatLt.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-block>\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n\t<operator>&lt;</operator>\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\n</enclose-block>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/primapp/RefThunk.html":
/*!***********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/primapp/RefThunk.html ***!
  \***********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"primapp\">RefThunk</keyword>\n<enclose-square>\n    <p-val node=\"$ctrl.node[1]\"></p-val>\n</enclose-squre>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/prop/Equiv.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/prop/Equiv.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>\n<operator>=</operator>\n<p-index node=\"$ctrl.node[2]\"></p-index>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[3]\"></p-sort>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/prop/Tt.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/prop/Tt.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"prop\">Tt</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/sort/IdxArrow.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/sort/IdxArrow.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n\t<p-sort node=\"$ctrl.node[1]\"></p-sort>\n\t<operator>&rArr;</operator>\n\t<p-sort node=\"$ctrl.node[2]\"></p-sort>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/sort/Nm.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/sort/Nm.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"sort\">Nm</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/sort/NmArrow.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/sort/NmArrow.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n\t<p-sort node=\"$ctrl.node[1]\"></p-sort>\n\t<operator>&rarr;</operator>\n\t<p-sort node=\"$ctrl.node[2]\"></p-sort>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/sort/NmSet.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/sort/NmSet.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"sort\">NmSet</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/Bool.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/Bool.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Bool</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/D.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/D.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">D</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/Nat.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/Nat.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Nat</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/Seq.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/Seq.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">Seq</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/String.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/String.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">String</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/tcons/User.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/tcons/User.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"tcons\">user</keyword>\n<enclose-paren>\n\t<id-type name=\"$ctrl.node[1]\"></id-type>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/term/IdxTm.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/term/IdxTm.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-index node=\"$ctrl.node[1]\"></p-index>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/term/NameTm.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/term/NameTm.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-nametm node=\"$ctrl.node[1]\"></p-nametm>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/term/Type.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/term/Type.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Cons.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Cons.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-tcons node=\"$ctrl.node[1]\"></p-tcons>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Exists.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Exists.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">exists</keyword>\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[2]\"></p-sort><span ng-if=\"$ctrl.node[3][0]!='Tt'\"> <operator>|</operator> <p-prop node=\"$ctrl.node[3]\"></p-prop></span><operator>.</operator>\n<indent>\n\t<p-type node=\"$ctrl.node[4]\"></p-type>\n</indent>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Ident.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Ident.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/IdxApp.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/IdxApp.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\n<enclose-square>\n\t<p-index node=\"$ctrl.node[2]\"></p-index>\n</enclose-square>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/IdxFn.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/IdxFn.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">foralli</keyword>\n<id-name name=\"$ctrl.node[1]\" type=\"decl\"></id-name>\n<operator>:</operator>\n<p-sort node=\"$ctrl.node[2]\"></p-sort><operator>.</operator>\n<indent>\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Nm.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Nm.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Nm</keyword>\n<enclose-square>\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\n</enclose-square>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/NmFn.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/NmFn.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n\t<keyword type=\"type\">Nm</keyword>\n\t<operator>&rarr;</operator>\n\t<keyword type=\"type\">Nm</keyword>\n</enclose-paren>\n<enclose-square>\n\t<p-nametm node=\"$ctrl.node[1]\"></p-nametm>\n</enclose-square>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Prod.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Prod.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<indent>\n\t<operator>x</operator>\n\t<p-type node=\"$ctrl.node[1]\"></p-type>\n\t<br>\n\t<operator ng-if=\"$ctrl.node[2][0] != $ctrl.node[0]\">x</operator>\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Rec.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Rec.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">rec</keyword>\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type><operator>.</operator>\n<p-type node=\"$ctrl.node[2]\"></p-type>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Ref.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Ref.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Ref</keyword>\n<enclose-square><p-index node=\"$ctrl.node[1]\"></p-index></enclose-square>\n<p-type node=\"$ctrl.node[2]\"></p-type>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Sum.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Sum.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<indent>\n\t<operator>+</operator>\n\t<p-type node=\"$ctrl.node[1]\"></p-type>\n\t<br>\n\t<operator ng-if=\"$ctrl.node[2][0] != $ctrl.node[0]\">+</operator>\n\t<p-type node=\"$ctrl.node[2]\"></p-type>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Thk.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Thk.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Thk</keyword>\n<enclose-square>\n\t<p-index node=\"$ctrl.node[1]\"></p-index>\n</enclose-square>\n<indent>\n    <p-ceffect node=\"$ctrl.node[2]\"></p-ceffect>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/TypeApp.html":
/*!*******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/TypeApp.html ***!
  \*******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<p-type node=\"$ctrl.node[1]\"></p-type>\n&nbsp;\n<p-type node=\"$ctrl.node[2]\"></p-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/TypeFn.html":
/*!******************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/TypeFn.html ***!
  \******************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">forallt</keyword>\n<id-type name=\"$ctrl.node[1]\" type=\"decl\"></id-type>\n<operator>:</operator>\n<p-kind node=\"$ctrl.node[2]\"></p-kind><operator>.</operator>\n<indent>\n\t<p-type node=\"$ctrl.node[3]\"></p-type>\n</indent>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Unit.html":
/*!****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Unit.html ***!
  \****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"type\">Unit</keyword>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/type/Var.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/type/Var.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-type name=\"$ctrl.node[1]\"></id-type>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Bool.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Bool.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Inj1.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Inj1.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">inj1</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Inj2.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Inj2.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">inj2</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Name.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Name.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren>\n\t<p-name node=\"$ctrl.node[1]\"></p-name>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/NameFn.html":
/*!*****************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/NameFn.html ***!
  \*****************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">namefn</keyword>\n<p-nametm node=\"$ctrl.node[1]\"></p-nametm>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Nat.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Nat.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal><span ng-bind=\"$ctrl.node[1]\"></span></literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Pack.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Pack.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">pack</keyword>\n<p-index node=\"$ctrl.node[1]\"></p-index>\n<p-val node=\"$ctrl.node[2]\"></p-val>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Pair.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Pair.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<enclose-paren implied=\"$parent.$ctrl.node[0] == 'Pair'\">\n\t<p-val node=\"$ctrl.node[1]\"></p-val>\n\t<operator>,</operator>\n\t<p-val node=\"$ctrl.node[2]\"></p-val>\n</enclose-paren>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Roll.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Roll.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">roll</keyword>\n<p-val node=\"$ctrl.node[1]\"></p-val>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/ThunkAnon.html":
/*!********************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/ThunkAnon.html ***!
  \********************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<keyword type=\"val\">thunk</keyword>\n<p-exp node=\"$ctrl.node[1]\"></p-exp>\n";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Unit.html":
/*!***************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Unit.html ***!
  \***************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<literal>()</literal>";

/***/ }),

/***/ "./src/www/app/directive/p-handle/template/val/Var.html":
/*!**************************************************************!*\
  !*** ./src/www/app/directive/p-handle/template/val/Var.html ***!
  \**************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = "<id-var name=\"$ctrl.node[1]\"></id-var>";

/***/ }),

/***/ "./src/www/app/directive/refresh.directive.js":
/*!****************************************************!*\
  !*** ./src/www/app/directive/refresh.directive.js ***!
  \****************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/factory/api.factory.js":
/*!********************************************!*\
  !*** ./src/www/app/factory/api.factory.js ***!
  \********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/factory/cursor.factory.js":
/*!***********************************************!*\
  !*** ./src/www/app/factory/cursor.factory.js ***!
  \***********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

module.exports = function Cursor()
{
	return {
		type: null,
	};
}

/***/ }),

/***/ "./src/www/app/main.js":
/*!*****************************!*\
  !*** ./src/www/app/main.js ***!
  \*****************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../style/main.css */ "./src/www/style/main.css");

var camelize = __webpack_require__(/*! camelize */ "./node_modules/camelize/index.js");

var angular = window.angular;

var app = angular.module('app');

register('component', __webpack_require__("./src/www/app sync recursive \\.component\\.js$/"));
register('directive', __webpack_require__("./src/www/app sync recursive \\.directive\\.js$/"));
register('provider', __webpack_require__("./src/www/app sync recursive \\.provider\\.js$/"));
register('constant', __webpack_require__("./src/www/app sync recursive \\.constant\\.js$/"));
register('value', __webpack_require__("./src/www/app sync recursive \\.value\\.js$/"));
register('service', __webpack_require__("./src/www/app sync recursive \\.service\\.js$/"));
register('factory', __webpack_require__("./src/www/app sync recursive \\.factory\\.js$/"));
register('filter', __webpack_require__("./src/www/app sync recursive \\.filter\\.js$/"));

registerSpecial('run', __webpack_require__("./src/www/app sync recursive \\.run\\.js$/"));
registerSpecial('config', __webpack_require__("./src/www/app sync recursive \\.config\\.js$/"));

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

/***/ "./src/www/app/service/example.service.js":
/*!************************************************!*\
  !*** ./src/www/app/service/example.service.js ***!
  \************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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
					name: id.replace(/^fungi_lang::examples::/, ''),
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

/***/ "./src/www/app/service/parse.service.js":
/*!**********************************************!*\
  !*** ./src/www/app/service/parse.service.js ***!
  \**********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var parser = __webpack_require__(/*! ./parser */ "./src/www/app/service/parser.js");

module.exports = function ParseService()
{
	this.parse = function(input)
	{
		// return JSON.parse(input);
		return parser(input);
	}
}

/***/ }),

/***/ "./src/www/app/service/parser.js":
/*!***************************************!*\
  !*** ./src/www/app/service/parser.js ***!
  \***************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var p = __webpack_require__(/*! parsimmon */ "./node_modules/parsimmon/build/parsimmon.umd.min.js");

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

/***/ "./src/www/app/service/rust.service.js":
/*!*********************************************!*\
  !*** ./src/www/app/service/rust.service.js ***!
  \*********************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/app/service/storage.service.js":
/*!************************************************!*\
  !*** ./src/www/app/service/storage.service.js ***!
  \************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
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

/***/ "./src/www/style/main.css":
/*!********************************!*\
  !*** ./src/www/style/main.css ***!
  \********************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });
//# sourceMappingURL=app.js.map