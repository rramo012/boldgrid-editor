var BGEditorBundle =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateBGEditorBundle"];
/******/ 	this["webpackHotUpdateBGEditorBundle"] = 
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
/******/ 	var hotCurrentHash = "57101c788fc964f4c09a"; // eslint-disable-line no-unused-vars
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
/******/ 								orginalError: err
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
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/builder recursive \\.js$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./controls.js": "./assets/js/builder/controls.js",
	"./controls/add.js": "./assets/js/builder/controls/add.js",
	"./controls/background.js": "./assets/js/builder/controls/background.js",
	"./controls/box.js": "./assets/js/builder/controls/box.js",
	"./controls/button.js": "./assets/js/builder/controls/button.js",
	"./controls/color.js": "./assets/js/builder/controls/color.js",
	"./controls/container.js": "./assets/js/builder/controls/container.js",
	"./controls/font.js": "./assets/js/builder/controls/font.js",
	"./controls/generic.js": "./assets/js/builder/controls/generic.js",
	"./controls/generic/block-alignment.js": "./assets/js/builder/controls/generic/block-alignment.js",
	"./controls/generic/custom-classes.js": "./assets/js/builder/controls/generic/custom-classes.js",
	"./controls/generic/font-color.js": "./assets/js/builder/controls/generic/font-color.js",
	"./controls/generic/font-size.js": "./assets/js/builder/controls/generic/font-size.js",
	"./controls/generic/link.js": "./assets/js/builder/controls/generic/link.js",
	"./controls/generic/margin.js": "./assets/js/builder/controls/generic/margin.js",
	"./controls/generic/rotate.js": "./assets/js/builder/controls/generic/rotate.js",
	"./controls/generic/width.js": "./assets/js/builder/controls/generic/width.js",
	"./controls/global.js": "./assets/js/builder/controls/global.js",
	"./controls/help.js": "./assets/js/builder/controls/help.js",
	"./controls/hr.js": "./assets/js/builder/controls/hr.js",
	"./controls/icon.js": "./assets/js/builder/controls/icon.js",
	"./controls/image/change.js": "./assets/js/builder/controls/image/change.js",
	"./controls/image/design.js": "./assets/js/builder/controls/image/design.js",
	"./controls/image/filter.js": "./assets/js/builder/controls/image/filter.js",
	"./controls/information.js": "./assets/js/builder/controls/information.js",
	"./controls/media/edit.js": "./assets/js/builder/controls/media/edit.js",
	"./controls/media/map.js": "./assets/js/builder/controls/media/map.js",
	"./controls/section.js": "./assets/js/builder/controls/section.js",
	"./drag.js": "./assets/js/builder/drag.js",
	"./drag/row.js": "./assets/js/builder/drag/row.js",
	"./drag/section.js": "./assets/js/builder/drag/section.js",
	"./feedback.js": "./assets/js/builder/feedback.js",
	"./gridblock/add.js": "./assets/js/builder/gridblock/add.js",
	"./gridblock/category.js": "./assets/js/builder/gridblock/category.js",
	"./gridblock/create.js": "./assets/js/builder/gridblock/create.js",
	"./gridblock/delete.js": "./assets/js/builder/gridblock/delete.js",
	"./gridblock/drag.js": "./assets/js/builder/gridblock/drag.js",
	"./gridblock/filter.js": "./assets/js/builder/gridblock/filter.js",
	"./gridblock/generate.js": "./assets/js/builder/gridblock/generate.js",
	"./gridblock/image.js": "./assets/js/builder/gridblock/image.js",
	"./gridblock/loader.js": "./assets/js/builder/gridblock/loader.js",
	"./gridblock/view.js": "./assets/js/builder/gridblock/view.js",
	"./menu.js": "./assets/js/builder/menu.js",
	"./notice/update.js": "./assets/js/builder/notice/update.js",
	"./panel.js": "./assets/js/builder/panel.js",
	"./render-fonts.js": "./assets/js/builder/render-fonts.js",
	"./resize/row.js": "./assets/js/builder/resize/row.js",
	"./style/remote.js": "./assets/js/builder/style/remote.js",
	"./tooltips.js": "./assets/js/builder/tooltips.js",
	"./util.js": "./assets/js/builder/util.js",
	"./validation/section.js": "./assets/js/builder/validation/section.js"
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
webpackContext.id = "./assets/js/builder recursive \\.js$";

/***/ }),

/***/ "./assets/js/builder/controls.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Controls = {

		/**
   * @var jQuery $panel Panel DOM Element.
   *
   * @since 1.2.7
   */
		$panel: null,

		/**
   * @var jQuery $menu Menu DOM Element.
   *
   * @since 1.2.7
   */
		$menu: null,

		/**
   * @var jQuery $colorControl Color Panel Element.
   *
   * @since 1.2.7
   */
		$colorControl: null,

		/**
   * @var array controls All registered controls.
   *
   * @since 1.2.7
   */
		controls: [],

		/**
   * @var jQuery $container tinymce iFrame Element.
   *
   * @since 1.2.7
   */
		$container: null,

		/**
   * Initialize all controls for the builder.
   * This is the primary file and function for the builder directory.
   *
   * @since 1.2.7
   */
		init: function ($container) {
			this.$container = $container;

			this.$container.find('body').css('marginTop', '50px');

			// Init Menu.
			this.$menu = BOLDGRID.EDITOR.Menu.init();

			// Init Panel.
			this.$panel = BOLDGRID.EDITOR.Panel.init();

			// Init Color Control.
			this.colorControl = BOLDGRID.EDITOR.CONTROLS.Color.init();

			this.onEditibleClick();

			this.setupSliders();

			//Create all controls.
			this.setupControls();

			BG.CONTROLS.Generic.setupInputCustomization();
			BG.CONTROLS.Generic.setupInputInitialization();
			BG.NOTICE.Update.init();

			this.browser = BG.Util.checkBrowser();
		},

		/**
   * Check if the theme has the passed feature.
   *
   * @since 1.2.7
   * @param string feature.
   * @return bool.
   */
		hasThemeFeature: function (feature) {
			return -1 !== BoldgridEditor.builder_config.theme_features.indexOf(feature);
		},

		/**
   * Add inline style to a element in the tinymce DOM. Needs to wrap dom.Style to work in tinymce.
   *
   * @since 1.2.7
   *
   * @param jQuery element.
   * @param string property.
   * @param string value.
   */
		addStyle: function (element, property, value) {
			element.css(property, value);
			tinymce.activeEditor.dom.setStyle(element, property, value);
		},

		/**
   * Setup general slide behavior within the panel. Update the displayed value when sliding.
   *
   * @since 1.2.7
   *
   * @param event.
   * @param ui.
   */
		setupSliders: function () {
			this.$panel.on('slide', '.section .slider', function (event, ui) {
				var $this = $(this);
				$this.siblings('.value').html(ui.value);
			});
		},

		/**
   * Add a control to the list of controls to be created.
   *
   * @since 1.2.7
   */
		registerControl: function (control) {
			this.controls.push(control);
		},

		/**
   * Get the tinymce editor instance.
   *
   * @since 1.2.7
   * @return IMHWPB.WP_MCE_Draggable.
   */
		editorMceInstance: function () {
			var instance = false;

			if (IMHWPB.WP_MCE_Draggable && IMHWPB.WP_MCE_Draggable.instance) {
				instance = IMHWPB.WP_MCE_Draggable.instance;
			}

			return instance;
		},

		/**
   * Clear menu items storage array.
   *
   * @since 1.2.7
   */
		clearMenuItems: function () {
			this.$menu.items = [];
		},

		/**
   * Bind event for updating Drop Tab.
   *
   * @since 1.2.7
   */
		_setupUpdateMenu: function () {
			var self = this;

			this.$container.on('click', function (e) {
				self.$menu.find('li[data-action]').hide();

				if (!self.$menu.items.length) {
					self.$menu.hide();
					BOLDGRID.EDITOR.Panel.closePanel();
				} else {
					self.$menu.show();
				}

				$.each(self.$menu.items, function () {
					self.$menu.find('[data-action="menu-' + this + '"]').show();

					//If a panel is open.
					BOLDGRID.EDITOR.Menu.reactivateMenu();
				});

				self._closeOpenControl();

				if (!e.boldgridRefreshPanel) {
					BOLDGRID.EDITOR.CONTROLS.Color.closePicker();
				}

				self.clearMenuItems();
			});
		},

		/**
   * Bind event for clicking on the iFrame body.
   *
   * @since 1.2.7
   */
		onEditibleClick: function () {
			this._setupUpdateMenu();
		},

		/**
   * If a control is open and the corresponding menu item is not present.
   *
   * @since 1.2.7
   */
		_closeOpenControl: function () {
			if (BG.Panel.currentControl && -1 === this.$menu.items.indexOf(BG.Panel.currentControl.name)) {
				BG.Panel.closePanel();
			}
		},

		/**
   * Setup Controls.
   *
   * @since 1.2.7
   */
		setupControls: function () {
			var self = this;

			// Sort Controls by priority.
			var compare = function (a, b) {

				if (a.priority < b.priority) {
					return -1;
				}

				if (a.priority > b.priority) {
					return 1;
				}

				return 0;
			};

			this.controls.sort(compare);

			// Bind each menu control.
			$.each(this.controls, function () {
				self.setupControl(this);
			});

			BOLDGRID.EDITOR.CONTROLS.Section.init(self.$container);
		},

		/**
   * Setup a single control.
   *
   * @since 1.2.7
   */
		setupControl: function (control) {
			this.bindControlHandler(control);
			BOLDGRID.EDITOR.Menu.createListItem(control);

			if (control.setup) {
				control.setup();
			}

			BG.Panel.setupPanelClick(control);
		},

		/**
   * Bind Event: Clicking on an elements selectors.
   *
   * @since 1.2.7
   */
		bindControlHandler: function (control) {

			if (control.selectors) {
				this.setupElementClick(control);
			}

			// When the user clicks on a menu item, perform the corresponding action.
			if (control.onMenuClick) {
				this.$menu.on('click', '[data-action="menu-' + control.name + '"]', control.onMenuClick);
			}
		},

		setupElementClick: function (control) {
			var self = this;

			// When the user clicks on an element that has an associated control.
			// Add that control to the list of controls to be made visible.
			this.$container.on('click', control.selectors.join(), function (e) {
				var $this = $(this);

				//@TODO: Move this.
				if ('box' === control.name) {
					var isEditingNested, isNestedColumn;

					if (e.boxFound) {
						return;
					}

					isEditingNested = $this.closest('.editing-as-row').length;
					isNestedColumn = $this.is('.row .row [class*="col-md"]');

					if (isEditingNested && false === isNestedColumn) {
						return;
					}

					if (isEditingNested) {
						e.boxFound = true;
					}

					if (!e.boxFound && $this.parent().closest('[class*="col-md"]').length) {
						var $module = BOLDGRID.EDITOR.CONTROLS.Box.findModule($this),
						    backgroundColor = $module.css('background-color');

						if (!BOLDGRID.EDITOR.CONTROLS.Color.isColorTransparent(backgroundColor)) {
							e.boxFound = true;
						} else {
							return;
						}
					}
				}

				if ($this.closest('.wpview').length && control.name !== 'edit-media') {
					return;
				}

				// If the user clicks one of the controls exceptions, skip.
				if (control.exceptionSelector && e.target && $(e.target).is(control.exceptionSelector)) {
					return;
				}

				self.$menu.targetData = self.$menu.targetData || {};
				self.$menu.targetData[control.name] = $this;

				if (control.elementClick) {
					control.elementClick(e);
				}

				self.$menu.items.push(control.name);
			});
		}
	};
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/add.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Add = {

		$element: null,

		name: 'add',

		tooltip: 'Add New Item',

		priority: 1,

		iconClasses: 'genericon genericon-plus add-element-trigger',

		selectors: ['html'],

		menuDropDown: {
			title: 'Add New',
			options: [{
				'name': 'Media',
				'class': 'action add-media dashicons dashicons-admin-media'
			}, {
				'name': 'Button',
				'class': 'action font-awesome add-button'
			}, {
				'name': 'Icon',
				'class': 'action font-awesome add-icon'
			}, {
				'name': 'GridBlock',
				'class': 'action add-gridblock'
			}, {
				'name': 'Section',
				'class': 'action add-row'
			}]
		},

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Setup.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupMenuClick();
		},

		/**
   * Bind all events.
   *
   * @since 1.2.7
   */
		_setupMenuClick: function () {
			BG.Menu.$element.find('.bg-editor-menu-dropdown').on('click', '.action.add-gridblock', self.addGridblock).on('click', '.action.add-row', self.addSection).on('click', '.action.add-button', BG.CONTROLS.Button.insertNew).on('click', '.action.add-media', self.openAddMedia).on('click', '.action.add-icon', BG.CONTROLS.Icon.insertNew);
		},

		/**
   * Open Add Media.
   *
   * @since 1.2.7
   */
		openAddMedia: function () {
			wp.media.editor.open();
			wp.media.frame.setState('insert');
		},

		/**
   * Scroll to an element on the iFrame.
   *
   * @since 1.2.7
   */
		scrollToElement: function ($newSection, duration) {

			$('html, body').animate({
				scrollTop: $newSection.offset().top
			}, duration);
		},

		/**
   * Add a new Section.
   *
   * @since 1.2.7
   */
		addSection: function () {
			var $container = BOLDGRID.EDITOR.Controls.$container,
			    $newSection = $(wp.template('boldgrid-editor-empty-section')());
			$container.$body.prepend($newSection);

			self.scrollToElement($newSection, 200);
			BG.CONTROLS.Section.transistionSection($newSection);
		},

		/**
   * Add a new Gridblock.
   *
   * @since 1.2.7
   */
		addGridblock: function () {
			var mce = BOLDGRID.EDITOR.Controls.editorMceInstance();
			if (mce) {
				mce.insert_layout_action();
			}
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Add.init();
	self = BOLDGRID.EDITOR.CONTROLS.Add;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/background.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name: 'background',

		tooltip: 'Section Background',

		uploadFrame: null,

		priority: 10,

		iconClasses: 'genericon genericon-picture',

		selectors: ['.boldgrid-section'],

		availableEffects: ['background-parallax', 'background-fixed'],

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		panel: {
			title: 'Section Background',
			height: '600px',
			width: '300px',
			scrollTarget: '.presets',
			customizeSupport: ['customClasses'],
			sizeOffset: -230
		},

		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * When the user clicks Add Image open the media library.
   *
   * @since 1.2.7
   */
		_setupAddImage: function () {

			BG.Panel.$element.on('click', '.background-design .add-image-controls', function () {

				// If the media frame already exists, reopen it.
				if (self.uploadFrame) {
					self.uploadFrame.open();
					return;
				}

				// Create a new media frame.
				self.uploadFrame = wp.media({
					title: 'Select Background Image',
					library: { type: 'image' },
					button: {
						text: 'Use this media'
					},

					// Set to true to allow multiple files to be selected.
					multiple: false
				});

				// When an image is selected in the media frame.
				self.uploadFrame.on('select', function () {

					// Get media attachment details from the frame state.
					var attachment = self.uploadFrame.state().get('selection').first().toJSON();

					// Set As current selection and apply to background.
					self.setImageBackground(attachment.url);
					self.setImageSelection('image');
				});

				// Finally, open the modal on click.
				self.uploadFrame.open();
			});
		},

		/**
   * When the user clicks on an image, if the panel is open, set panel content.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();
			}
		},

		/**
   * Setup Init.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupBackgroundClick();
			self._setupFilterClick();
			self._setupCustomizeLeave();
			self._setupBackgroundSize();
			self._setupBackgroundColor();
			self._setupGradientColor();
			self._setupOverlayColor();
			self._setupOverlayReset();
			self._setupScrollEffects();
			self._setupGradientDirection();
			self._setupCustomization();
			self._setupAddImage();
		},

		/**
   * Bind Event: Change background section color.
   *
   * @since 1.2.7
   */
		_setupBackgroundColor: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design [name="section-background-color"]', function () {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name],
				    value = $this.val(),
				    type = $this.attr('data-type'),
				    $currentSelection = BG.Panel.$element.find('.current-selection'),
				    selectionType = $currentSelection.attr('data-type');

				$target.removeClass(BG.CONTROLS.Color.backgroundColorClasses.join(' '));
				$target.removeClass(BG.CONTROLS.Color.textContrastClasses.join(' '));
				BG.Controls.addStyle($target, 'background-color', '');

				// If currently selected is a gradient.
				if ('pattern' !== selectionType) {
					BG.Controls.addStyle($target, 'background-image', '');
					$target.removeAttr('data-bg-color-1');
					$target.removeAttr('data-bg-color-2');
					$target.removeAttr('data-bg-direction');
				}
				if ('pattern' !== selectionType) {
					BG.Panel.$element.find('.presets .selected').removeClass('selected');
				}

				if ('class' === type) {
					$target.addClass(BG.CONTROLS.Color.getColorClass('background-color', value));
					$target.addClass(BG.CONTROLS.Color.getColorClass('text-contrast', value));
				} else {
					BG.Controls.addStyle($target, 'background-color', value);
				}

				self.setImageSelection(selectionType, $target.css('background'));
			});
		},

		/**
   * Bind Event: Set the default color for overlay.
   *
   * @since 1.2.7
   */
		_setupOverlayReset: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.background-design .overlay-color .default-color', function (e) {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name];

				e.preventDefault();

				$this.closest('.color-controls').find('label').css('background-color', 'rgba(255,255,255,.5)');

				$target.removeAttr('data-bg-overlaycolor');
				self.updateBackgroundImage();
			});
		},

		/**
   * Bind Event: Change overlay color.
   *
   * @since 1.2.7
   */
		_setupOverlayColor: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design [name="overlay-color"]', function () {
				var $this = $(this),
				    type = $this.attr('data-type'),
				    value = $this.val(),
				    $target = BG.Menu.$element.targetData[self.name];

				if ('class' === type) {
					value = BoldgridEditor.colors.defaults[value - 1];
				}

				$target.attr('data-bg-overlaycolor', value);

				self.updateBackgroundImage();
			});
		},

		/**
   * Update background image on page.
   *
   * @since 1.2.7
   */
		updateBackgroundImage: function () {
			var $target = BG.Menu.$element.targetData[self.name],
			    overlay = $target.attr('data-bg-overlaycolor'),
			    image = $target.attr('data-image-url');

			if (overlay && image) {
				BG.Controls.addStyle($target, 'background-image', self.getOverlayImage(overlay) + ', url("' + image + '")');
			} else if (image) {
				BG.Controls.addStyle($target, 'background-image', 'url("' + image + '")');
			}
		},

		/**
   * Create gradient overlay string.
   *
   * @since 1.2.7
   * @param string color.
   * @return string color.
   */
		getOverlayImage: function (color) {
			return 'linear-gradient(to left, ' + color + ', ' + color + ')';
		},

		/**
   * Bind Event: Changing Gradient Color.
   *
   * @since 1.2.7
   */
		_setupGradientColor: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design [name^="gradient-color"]', function () {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name],
				    value = $this.val(),
				    name = $this.attr('name'),
				    type = $this.attr('data-type');

				if ('class' === type) {
					value = BoldgridEditor.colors.defaults[value - 1];
				}

				if ('gradient-color-1' === name) {
					$target.attr('data-bg-color-1', value);
				} else {
					$target.attr('data-bg-color-2', value);
				}

				BG.Controls.addStyle($target, 'background-image', self.createGradientCss($target));
			});
		},

		/**
   * Bind Event: Clicking Settings.
   *
   * @since 1.2.7
   */
		_setupCustomization: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.current-selection .settings .panel-button', function (e) {
				e.preventDefault();
				self.openCustomization();
			});
		},

		/**
   * Bind Event: Input scroll effect changing.
   *
   * @since 1.2.7
   */
		_setupScrollEffects: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design input[name="scroll-effects"]', function () {
				var $this = $(this),
				    $target = BG.Menu.getTarget(self);

				if ('none' === $this.val()) {
					$target.removeClass(self.availableEffects.join(' '));
				} else {
					$target.removeClass(self.availableEffects.join(' '));
					$target.addClass($this.val());
				}
			});
		},

		/**
   * Bind Event: Input gradient direction changing.
   *
   * @since 1.2.7
   */
		_setupGradientDirection: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design input[name="bg-direction"]', function () {
				var $this = $(this),
				    $target = BG.Menu.getTarget(self);

				$target.attr('data-bg-direction', $this.val());
				BG.Controls.addStyle($target, 'background-image', self.createGradientCss($target));
			});
		},

		/**
   * Create the css needed for a linear gradient.
   *
   * @since 1.2.7
   * @param jQuery $element.
   */
		createGradientCss: function ($element) {
			return 'linear-gradient(' + $element.attr('data-bg-direction') + ',' + $element.attr('data-bg-color-1') + ',' + $element.attr('data-bg-color-2') + ')';
		},

		/**
   * Setup background size control.
   *
   * @since 1.2.7
   */
		_setupBackgroundSize: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.background-design input[name="background-size"]', function () {
				var $this = $(this),
				    $target = BG.Menu.getTarget(self);

				if ('tiled' === $this.val()) {
					BG.Controls.addStyle($target, 'background-size', 'auto auto');
					BG.Controls.addStyle($target, 'background-repeat', 'repeat');
				} else if ('cover' === $this.val()) {
					BG.Controls.addStyle($target, 'background-size', 'cover');
					BG.Controls.addStyle($target, 'background-repeat', '');
				}
			});
		},

		/**
   * Bind Event: When the user leaves customization.
   *
   * @since 1.2.7
   */
		_setupCustomizeLeave: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.background-design .back .panel-button', function (e) {
				e.preventDefault();

				panel.$element.find('.preset-wrapper').show();
				panel.$element.find('.background-design .customize').hide();
				panel.initScroll();
				self.preselectBackground();
				panel.scrollToSelected();
			});
		},

		/**
   * Bind Event: When the user clicks on a filter.
   *
   * @since 1.2.7
   */
		_setupFilterClick: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.background-design .filter', function (e) {
				e.preventDefault();

				var $this = $(this),
				    type = $this.data('type'),
				    label = $this.data('label'),
				    $currentSelection = panel.$element.find('.current-selection'),
				    $presetsBackgroundColor = panel.$element.find('.presets .background-color.section');

				panel.$element.find('.filter').removeClass('selected');
				$this.addClass('selected');

				panel.$element.find('.presets .selection').hide();
				$.each(type, function () {
					panel.$element.find('.presets .selection[data-type="' + this + '"]').show();
				});

				panel.$element.find('.presets .title > *').text(label);
				panel.$element.find('.presets').attr('data-filter', type);
				$currentSelection.attr('data-filter', type);

				if (type.length && -1 !== type.indexOf('image')) {
					$presetsBackgroundColor.hide();
				} else {
					$presetsBackgroundColor.show();
				}

				panel.scrollToSelected();
			});
		},

		/**
   * Remove all color classes.
   *
   * @since 1.2.7
   * @param jQuery $target.
   */
		removeColorClasses: function ($target) {
			$target.removeClass(BG.CONTROLS.Color.backgroundColorClasses.join(' '));
			$target.removeClass(BG.CONTROLS.Color.textContrastClasses.join(' '));
		},

		/**
   * Bind Event: When the user clicks on a design.
   *
   * @since 1.2.7
   */
		_setupBackgroundClick: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.background-design .selection', function () {
				var $this = $(this),
				    $target = BG.Menu.getTarget(self),
				    imageUrl = $this.attr('data-image-url'),
				    imageSrc = $this.css('background-image'),
				    background = $this.css('background');

				if ($this.hasClass('selected')) {
					self.removeColorClasses($target);
					BG.Controls.addStyle($target, 'background', '');
					$target.removeAttr('data-image-url');
					$this.removeClass('selected');
					self.preselectBackground(true);

					return;
				}

				panel.$element.find('.presets .selected').removeClass('selected');
				$this.addClass('selected');

				// Reset Gradient attributes.
				$target.removeAttr('data-bg-color-1').removeAttr('data-image-url').removeAttr('data-bg-color-2').removeAttr('data-bg-direction');

				if ('pattern' !== $this.data('type')) {
					self.removeColorClasses($target);
				}

				if ('image' === $this.data('type')) {
					self.setImageBackground(imageUrl);
				} else if ('color' === $this.data('type')) {
					$target.addClass($this.data('class'));
					$target.addClass(BG.CONTROLS.Color.getColorClass('text-contrast', $this.data('class').replace(/\D/g, '')));
					BG.Controls.addStyle($target, 'background-image', '');
					self.setDefaultBackgroundColors();
				} else if ('pattern' === $this.data('type')) {
					BG.Controls.addStyle($target, 'background-size', 'auto auto');
					BG.Controls.addStyle($target, 'background-repeat', 'repeat');
					BG.Controls.addStyle($target, 'background-image', imageSrc);
				} else if ('gradients' === $this.data('type')) {
					BG.Controls.addStyle($target, 'background-image', imageSrc);
					$target.attr('data-bg-color-1', $this.data('color1')).attr('data-bg-color-2', $this.data('color2')).attr('data-bg-direction', $this.data('direction'));
				} else {
					BG.Controls.addStyle($target, 'background-image', imageSrc);
				}

				self.setImageSelection($this.data('type'), background);
			});
		},

		/**
   * Activate a filter.
   *
   * @since 1.2.7
   * @param string type.
   */
		activateFilter: function (type) {
			var backgroundImageProp,
			    filterFound = false,
			    $target = BG.Menu.getTarget(self);

			BG.Panel.$element.find('.current-selection .filter').each(function () {
				var $this = $(this),
				    filterTypes = $this.data('type');

				if (type && -1 !== filterTypes.indexOf(type)) {
					$this.click();
					filterFound = true;
					return false;
				}
			});

			if (!filterFound && !type) {
				backgroundImageProp = $target.css('background-image');
				if (backgroundImageProp && 'none' !== backgroundImageProp) {

					// Image filter selection hack, trouble selecting array data type.
					BG.Panel.$element.find('.filter[data-type]:first-of-type').click();
					filterFound = true;
				}
			}

			if (false === filterFound) {
				BG.Panel.$element.find('.filter[data-default="1"]').click();
			}
		},

		/**
   * Set Image selection.
   *
   * @since 1.2.7
   * @param string type.
   * @param string prop.
   */
		setImageSelection: function (type, prop) {
			var $currentSelection = BG.Panel.$element.find('.current-selection'),
			    $target = BG.Menu.getTarget(self);

			$currentSelection.css('background', '');

			if ('color' === type) {
				$currentSelection.css('background-color', prop);
			} else {
				$currentSelection.css('background-color', $target.css('background-color'));

				// $target[0].style['background-image'] used instead of jQuery.css because of comaptbility issue with FF.
				$currentSelection.css('background-image', $target[0].style['background-image']);
			}

			$currentSelection.attr('data-type', type);
		},

		/**
   * Set Image background.
   *
   * @since 1.2.7
   * @param string url.
   */
		setImageBackground: function (url) {
			var $target = BG.Menu.getTarget(self);

			$target.attr('data-image-url', url);

			BG.Controls.addStyle($target, 'background', '');
			self.updateBackgroundImage();
			BG.Controls.addStyle($target, 'background-size', 'cover');
			BG.Controls.addStyle($target, 'background-position', '50% 50%');
		},

		/**
   * Init all sliders.
   *
   * @since 1.2.7
   */
		_initSliders: function () {
			self._initVerticleSlider();
		},

		/**
   * Init Vertical position slider.
   *
   * @since 1.2.7
   */
		_initVerticleSlider: function () {
			var $target = BG.Menu.getTarget(self),
			    defaultPosY = $target.css('background-position-y'),
			    defaultPosX = $target.css('background-position-x');

			defaultPosY = defaultPosY ? parseInt(defaultPosY) : 50;
			defaultPosX = defaultPosX ? parseInt(defaultPosX) : 50;

			BG.Panel.$element.find('.background-design .vertical-position .slider').slider({
				min: 0,
				max: 100,
				value: defaultPosY,
				range: 'max',
				slide: function (event, ui) {
					if ($target.css('background-image')) {
						BG.Controls.addStyle($target, 'background-position', defaultPosX + '%' + ' ' + ui.value + '%');
					}
				}
			}).siblings('.value').html(defaultPosY);
		},

		/**
   * Open the customization view.
   *
   * @since 1.2.7
   */
		openCustomization: function () {
			BG.Panel.$element.find('.preset-wrapper').hide();
			BG.Panel.$element.find('.background-design .customize').show();
			BG.Panel.$element.find('.preset-wrapper').attr('data-type', BG.Panel.$element.find('.current-selection').attr('data-type'));
			self._initSliders();
			self.selectDefaults();
			BG.Panel.$element.trigger('bg-open-customization');

			BG.Panel.createScrollbar('.customize', {
				'height': self.panel.height
			});
		},

		/**
   * Set all defaults.
   *
   * @since 1.2.7
   */
		selectDefaults: function () {
			self.setScrollEffect();
			self.setSize();
			self.setDefaultDirection();
			self.setDefaultBackgroundColors();
			self.setDefaultOverlayColor();
		},

		/**
   * Set default overlay color.
   *
   * @since 1.2.7
   */
		setDefaultOverlayColor: function () {
			var $target = BG.Menu.getTarget(self),
			    $overlayColorSection = BG.Panel.$element.find('.overlay-color'),
			    overlayColor = $target.attr('data-bg-overlaycolor');

			if (overlayColor) {
				$overlayColorSection.find('input').attr('value', overlayColor);
			}
		},

		/**
   * Set default background size.
   *
   * @since 1.2.7
   */
		setSize: function () {
			var $input = BG.Panel.$element.find('input[name="background-size"]'),
			    $target = BG.Menu.getTarget(self);

			if (-1 === $target.css('background-size').indexOf('cover')) {
				$input.filter('[value="tiled"]').prop('checked', true);
			}
		},

		/**
   * Set default scroll direction.
   *
   * @since 1.2.7
   */
		setScrollEffect: function () {
			var $target = BG.Menu.getTarget(self);

			$.each(self.availableEffects, function () {
				if ($target.hasClass(this)) {
					BG.Panel.$element.find('input[name="scroll-effects"][value="' + this + '"]').prop('checked', true);
					return false;
				}
			});
		},

		/**
   * Set graadient direction.
   *
   * @since 1.2.7
   */
		setDefaultDirection: function () {
			var $target = BG.Menu.getTarget(self),
			    direction = $target.attr('data-bg-direction');

			if (self.backgroundIsGradient($target.css('background-image')) && direction) {
				BG.Panel.$element.find('input[name="bg-direction"][value="' + direction + '"]').prop('checked', true);
			}
		},

		/**
   * Set default background colors.
   *
   * @since 1.2.7
   */
		setDefaultBackgroundColors: function () {
			var bgColor,
			    $bgControlColor,
			    $target = BG.Menu.getTarget(self);

			if (self.backgroundIsGradient($target.css('background-image'))) {
				BG.Panel.$element.find('input[name="gradient-color-1"]').attr('value', $target.attr('data-bg-color-1'));
				BG.Panel.$element.find('input[name="gradient-color-2"]').attr('value', $target.attr('data-bg-color-2'));
			} else {
				bgColor = BG.CONTROLS.Color.findAncestorColor($target, 'background-color');
				$bgControlColor = BG.Panel.$element.find('input[name="section-background-color"]');
				$bgControlColor.prev('label').css('background-color', bgColor);
				$bgControlColor.attr('value', bgColor);
			}
		},

		/**
   * Get a random gradient direction.
   *
   * @since 1.2.7
   * @return string.
   */
		randomGradientDirection: function () {
			var directions = ['to left', 'to bottom'];

			return directions[Math.floor(Math.random() * directions.length)];
		},

		/**
   * Create JSON of gradients. Not used at runtime.
   *
   * @since 1.2.7
   */
		_createGradients: function () {
			var gradientData = [];

			$.each(BoldgridEditor.sample_backgrounds.default_gradients, function () {
				var color1 = this.colors[0],
				    color2 = this.colors[1],
				    direction = self.randomGradientDirection();

				gradientData.push({
					color1: color1,
					color2: color2,
					direction: direction,
					css: 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')'
				});
			});

			console.log(JSON.stringify(gradientData));
		},

		/**
   * Create gradients based on the users palettes.
   *
   * @since 1.2.7
   */
		setPaletteGradients: function () {
			var combos = [];
			if (BoldgridEditor.colors.defaults && BoldgridEditor.colors.defaults.length) {
				$.each([0, 1], function () {
					var color1, color2, direction;
					color1 = BoldgridEditor.colors.defaults[Math.floor(Math.random() * BoldgridEditor.colors.defaults.length)];
					color2 = BoldgridEditor.colors.defaults[Math.floor(Math.random() * BoldgridEditor.colors.defaults.length)];
					if (color1 !== color2) {
						direction = self.randomGradientDirection();
						combos.push({
							color1: color1,
							color2: color2,
							direction: direction,
							css: 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')'
						});
					}
				});
			}

			$.each(combos, function () {
				BoldgridEditor.sample_backgrounds.gradients.unshift(this);
			});
		},

		/**
   * Is the given url a gradient.
   *
   * @since 1.2.7
   * @param string backgroundUrl.
   * @return boolean.
   */
		backgroundIsGradient: function (backgroundUrl) {
			return backgroundUrl.indexOf('linear-gradient') !== -1 && -1 === backgroundUrl.indexOf('url');
		},

		/**
   * Preselect the background being used when opening the panel.
   *
   * @since 1.2.7
   */
		preselectBackground: function (keepFilter) {
			var type = 'color',
			    $target = BG.Menu.getTarget(self),
			    backgroundColor = $target.css('background-color'),
			    backgroundUrl = $target.css('background-image'),
			    $currentSelection = BG.Panel.$element.find('.current-selection'),
			    hasGradient = self.backgroundIsGradient(backgroundUrl),
			    matchFound = false;

			//@TODO: update the preview screen when pressing back from the customize section.

			// Set the background color, and background image of the current section to the preview.
			self.setImageSelection('image');
			$currentSelection.css('background-color', backgroundColor);

			BG.Panel.$element.find('.selection').each(function () {
				var $this = $(this),
				    selectionType = $this.data('type'),
				    dataClass = $this.data('class');

				switch (selectionType) {
					case 'color':
						if (dataClass && $target.hasClass(dataClass) && 'none' === $target.css('background-image')) {
							$this.addClass('selected');
							type = selectionType;
							matchFound = true;
							self.activateFilter(type);
							return false;
						}
						break;
					case 'image':
						if ($this.attr('data-image-url') === $target.attr('data-image-url')) {

							//Found a match.
							$this.addClass('selected');
							type = selectionType;
							matchFound = true;
							self.activateFilter(type);
							return false;
						}
						break;
					case 'gradients':
					case 'pattern':
						if ($this.css('background-image') === backgroundUrl) {

							//Found a match.
							$this.addClass('selected');
							type = selectionType;
							matchFound = true;
							self.activateFilter(type);
							return false;
						}
						break;
				}
			});

			if (!matchFound) {
				if (hasGradient) {
					type = 'gradients';
				} else if ('none' !== backgroundUrl) {
					type = 'image';
				}

				if (!keepFilter) {
					self.activateFilter(type);
				}
			}

			$currentSelection.attr('data-type', type);
		},

		/**
   * Open Panel.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var panel = BG.Panel,
			    template = wp.template('boldgrid-editor-background');

			BoldgridEditor.sample_backgrounds.color = BG.CONTROLS.Color.getPaletteBackgroundColors();

			// Remove all content from the panel.
			panel.clear();

			self.setPaletteGradients();
			panel.$element.find('.panel-body').html(template({
				images: BoldgridEditor.sample_backgrounds,
				imageData: BoldgridEditor.builder_config.background_images
			}));

			self.preselectBackground();
			self.setDefaultBackgroundColors();

			// Open Panel.
			panel.open(self);
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/box.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {

		uiBoxDimensions: {
			'bg-box bg-box-rounded': 'box-wide',
			'bg-box bg-box-rounded-bottom-left bg-box-rounded-bottom-right': 'box-long',
			'bg-box bg-box-rounded-bottom-right bg-box-rounded-top-right': 'box-wide',
			'bg-box bg-box-edged bg-box-shadow-bottom-right': 'box-wide',
			'bg-box bg-box-square bg-box-border-thin': 'box-long',
			'bg-box bg-box-square bg-box-border-thick': 'box-wide',
			'bg-box bg-box-square bg-box-border-dashed': 'box-wide',
			'bg-box bg-box-rounded bg-box-border-dashed': 'box-long',
			'bg-box bg-box-square bg-box-border-dashed-thick': 'box-long',
			'bg-box bg-box-square bg-box-border-double-thick': 'box-wide'
		},

		namespace: 'bg-box',

		name: 'box',

		priority: 20,

		iconClasses: 'genericon genericon-gallery',

		tooltip: 'Column Background',

		selectors: ['.row [class*="col-md"]'],

		panel: {
			title: 'Column Background',
			height: '530px',
			width: '290px',
			customizeSupport: ['margin', 'customClasses'],
			includeFooter: true,
			customizeCallback: function () {
				self.openCustomizer();
			}
		},

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		colorControls: null,

		targetClasses: null,

		targetColor: null,

		$presets: null,

		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * Setup listeners and Init.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupPresetClick();
			self._setupPresetHover();
			self._setupPanelLeave();
			self._setupBackgroundColor();
			self._setupBorderColor();
			self._setupCustomizeLeave();
			self._setupSliderChange();

			var presets = self.getBoxMarkup();
			self.$presets = self.applyUiStyles(presets);
		},

		/**
   * After slider changes, save state of modified element.
   *
   * @since 1.2.7
   */
		_setupSliderChange: function () {
			BG.Panel.$element.on('slidechange', '.box-design .slider', function () {
				self._saveModuleClasses();
			});
		},

		/**
   * Bind Event: Leaving the customization view of a panel.
   *
   * @since 1.2.7
   */
		_setupCustomizeLeave: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.box-design .back .panel-button', function (e) {
				e.preventDefault();

				panel.$element.find('.presets').show();
				panel.$element.find('.box-design > .title').show();
				panel.$element.find('.box-design .customize').hide();
				panel.scrollToSelected();
				BG.Panel.showFooter();
			});
		},

		/**
   * Bind Event: Mouse leave on the box panel.
   *
   * @since 1.2.7
   */
		_setupPanelLeave: function () {
			var panel = BG.Panel;

			panel.$element.on('mouseleave', '.box-design', function (e) {
				e.preventDefault();
				var $module,
				    $target = BG.Menu.getTarget(self);

				$module = self.findModule($target);
				self.removeModuleClasses($module);

				// On mouse leave apply styles.
				$module.addClass(self.targetClasses);

				if (!self.targetClasses || -1 === self.targetClasses.indexOf('-background-color')) {
					BG.Controls.addStyle($module, 'background-color', self.targetColor);
				}

				self._applyCloneStyles($module);
			});
		},

		/**
   * Apply clones from a cloned element.
   *
   * @since 1.2.7
   * @param jQuery $module.
   */
		_applyCloneStyles: function ($module) {
			if (self.$targetModuleClone) {
				$module.attr('style', self.$targetModuleClone.attr('style') || '');
				$module.attr('data-mce-style', self.$targetModuleClone.attr('style') || '');
			}
		},

		/**
   * Bind Event: Hovering over a selection.
   *
   * @since 1.2.7
   */
		_setupPresetHover: function () {
			var panel = BG.Panel;

			panel.$element.hoverIntent({
				out: function () {},
				over: function (e) {
					var $this = $(this);

					e.preventDefault();

					self.addBox($this);
				},
				selector: '.box-design .presets .' + self.namespace
			});
		},

		/**
   * Bind Event: When clicking preset add classes.
   *
   * @since 1.2.7
   * @param jQuery $module.
   */
		_setupPresetClick: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.box-design .presets .' + self.namespace, function (e) {
				var $module,
				    $this = $(this);

				e.preventDefault();

				if ($this.hasClass('selected')) {
					$module = self.findModule(BG.Menu.getTarget(self));
					self.selfResetBorderClasses($module);
					panel.clearSelected();
					self.removeModuleClasses($module);
					self._clearModuleClasses();
					self._clearInlineStyles($module);
				} else {

					self.addBox($this);
					panel.clearSelected();

					// Save Classes so that when the user mouse leaves we know that these classes are permanent.
					self._saveModuleClasses();
					$this.addClass('selected');
				}
			});
		},

		/**
   * Remove Inline styles from $module.
   *
   * @since 1.2.7
   * @param jQuery $module.
   */
		_clearInlineStyles: function ($module) {
			$module.css('padding', '');
			$module.css('margin', '');
			$module.css('background-color', '');
			$module.css('border-color', '');
		},

		/**
   * Clear stored module classes.
   *
   * @since 1.2.7
   */
		_clearModuleClasses: function () {
			self.targetClasses = '';
			self.targetColor = '';
			self.$targetModuleClone = false;
		},

		/**
   * Store selected module classes.
   *
   * @since 1.2.7
   */
		_saveModuleClasses: function () {
			var $module = self.findModule(BG.Menu.getTarget(self));
			self.targetClasses = $module.attr('class');
			self.targetColor = $module[0].style['background-color'];
			self.$targetModuleClone = $module.clone();
		},

		/**
   * On customization open.
   *
   * @since 1.2.7
   */
		openCustomizer: function () {
			var panel = BG.Panel;
			self._initSliders();
			panel.$element.find('.customize').show();
			panel.$element.find('.presets').hide();
			panel.$element.find('.box-design > .title').hide();
			panel.$element.find('.box-design [name="box-bg-color"]').val(self.getTarget().css('background-color'));
			self.setupBorderColor();
			BG.Panel.$element.trigger('bg-open-customization');
			panel.scrollTo(0);
			BG.Panel.hideFooter();
		},

		/**
   * Hide/Show border control if available on module.
   *
   * @since 1.2.7
   */
		setupBorderColor: function () {
			var $target = BG.Menu.getTarget(self),
			    $control = BG.Panel.$element.find('.border-color-controls'),
			    $module = self.findModule($target);

			if ($module.is('[class*="border"]')) {
				$control.find('[name="box-border-color"]').val($module.css('border-color'));
				$control.show();
			} else {
				$control.hide();
			}
		},

		/**
   * Find the module on the column.
   *
   * @since 1.2.7
   * @param jQuery $target.
   * @return jQuery $module.
   */
		findModule: function ($target) {
			var $module,
			    $childDiv = $target.find('> div'),
			    $immediateChildren = $target.find('> *'),
			    childIsModule = $childDiv.length === 1 && $childDiv.not('.row').length && $childDiv.not('[class*="col-md"]').length && $immediateChildren.length === 1;

			if (childIsModule) {
				$module = $childDiv;
			}

			if (!$module) {
				// Create Module.
				$module = $('<div></div>');
				$module.html($immediateChildren);
				$target.html($module);
			}

			return $module;
		},

		/**
   * Add box to a column.
   *
   * @since 1.2.7
   * @param jQuery $this
   */
		addBox: function ($this) {
			var style,
			    $target = BG.Menu.getTarget(self),
			    value = $this.data('value'),
			    backgroundColor = $this.css('background-color'),
			    $module = self.findModule($target);

			self._clearInlineStyles($module);
			self.selfResetBorderClasses($module);
			self.removeModuleClasses($module);

			if ($this.parent('.my-designs').length) {
				style = BoldgridEditor.builder_config.components_used.box[$this.data('id')].style;
				$module.attr('style', style);
			}

			$module.addClass(value);
			if ($module.attr('class') && -1 === $module.attr('class').indexOf('-background-color')) {
				BG.Controls.addStyle($module, 'background-color', backgroundColor);
			}
		},

		/**
   * Remove all module classes.
   *
   * @since 1.2.7
   */
		removeModuleClasses: function ($module) {
			$module.removeClass(function (index, css) {
				return (css.match(/(^|\s)bg-box?\S+/g) || []).join(' ');
			});

			$module.removeClass('bg-background-color');
			$module.removeClass(BG.CONTROLS.Color.backgroundColorClasses.join(' '));
			$module.removeClass(BG.CONTROLS.Color.textContrastClasses.join(' '));
			BG.Controls.addStyle($module, 'background-color', '');
		},

		/**
   * Initialize Sliders.
   *
   * @since 1.2.7
   */
		_initSliders: function () {
			self._initPaddingSlider();
		},

		/**
   * Init Background color control.
   *
   * @since 1.2.7
   */
		_setupBackgroundColor: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.box-design [name="box-bg-color"]', function () {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name],
				    $module = self.findModule($target),
				    value = $this.val(),
				    type = $this.attr('data-type');

				$module.removeClass(BG.CONTROLS.Color.textContrastClasses.join(' '));
				$module.removeClass(BG.CONTROLS.Color.backgroundColorClasses.join(' '));
				BG.Controls.addStyle($module, 'background-color', '');

				if ('class' === type) {
					$module.addClass(BG.CONTROLS.Color.getColorClass('text-contrast', value));
					$module.addClass(BG.CONTROLS.Color.getColorClass('background-color', value));
				} else {
					BG.Controls.addStyle($module, 'background-color', value);
				}

				self._saveModuleClasses();
			});
		},

		/**
   * Remove border styles.
   *
   * @since 1.2.7
   */
		selfResetBorderClasses: function ($module) {
			$module.removeClass(BG.CONTROLS.Color.borderColorClasses.join(' '));
			BG.Controls.addStyle($module, 'border-color', '');
		},

		/**
   * Init borderr color control.
   *
   * @since 1.2.7
   */
		_setupBorderColor: function () {
			var panel = BG.Panel;

			panel.$element.on('change', '.box-design [name="box-border-color"]', function () {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name],
				    $module = self.findModule($target),
				    value = $this.val(),
				    type = $this.attr('data-type');

				self.selfResetBorderClasses($module);

				if ('class' === type && BG.Controls.hasThemeFeature('border-color-classes')) {
					$module.addClass(BG.CONTROLS.Color.getColorClass('border-color', value));
				} else {
					// Using backgrond color for themes without background colors.

					if ('' !== value) {
						value = $this.prev('label').css('background-color');
					}

					BG.Controls.addStyle($module, 'border-color', value);
				}

				self._saveModuleClasses();
			});
		},

		/**
   * Init padding slider.
   *
   * @since 1.2.7
   */
		_initPaddingSlider: function () {
			var horPaddingEm,
			    vertPaddingEm,
			    $target = BG.Menu.getTarget(self),
			    $module = self.findModule($target),
			    fontSize = $module.css('font-size'),
			    defaultPaddingVert = $module.css('padding-top'),
			    defaultPaddingHor = $module.css('padding-left');

			defaultPaddingVert = defaultPaddingVert ? parseInt(defaultPaddingVert) : 0;
			defaultPaddingHor = defaultPaddingHor ? parseInt(defaultPaddingHor) : 0;

			horPaddingEm = BG.Util.convertPxToEm(defaultPaddingHor, fontSize);
			vertPaddingEm = BG.Util.convertPxToEm(defaultPaddingVert, fontSize);

			BG.Panel.$element.find('.box-design .padding .slider').slider({
				min: 0,
				max: 7,
				value: horPaddingEm,
				step: 0.1,
				range: 'max',
				slide: function (event, ui) {
					$target = BG.Menu.getTarget(self);
					$module = self.findModule($target);

					BG.Controls.addStyle($module, 'padding-left', ui.value + 'em');
					BG.Controls.addStyle($module, 'padding-right', ui.value + 'em');
				}
			}).siblings('.value').html(horPaddingEm);

			BG.Panel.$element.find('.box-design .padding-top .slider').slider({
				min: 0,
				max: 7,
				value: vertPaddingEm,
				step: 0.1,
				range: 'max',
				slide: function (event, ui) {
					$target = BG.Menu.getTarget(self);
					$module = self.findModule($target);

					BG.Controls.addStyle($module, 'padding-top', ui.value + 'em');
					BG.Controls.addStyle($module, 'padding-bottom', ui.value + 'em');
				}
			}).siblings('.value').html(vertPaddingEm);
		},

		/**
   * Get the current target. An override method.
   *
   * @since 1.2.7
   */
		getTarget: function () {
			var $target = BG.Menu.getTarget(self);
			return self.findModule($target);
		},

		/**
   * When the user clicks on an element if the panel is already open, refresh it.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();
			}
		},

		/**
   * Add colors to boxes.
   *
   * @since 1.2.7
   * @return array presets.
   */
		applyUiStyles: function (presets) {
			var $newElement,
			    presetsHtml = '',
			    colorCount = 0,
			    backgrounds = [],
			    backgroundColors = BG.CONTROLS.Color.getBackgroundForegroundColors(),
			    nonBgThemeColors = ['#2980b9', '#bdc3c7', '#e74c3c', 'rgb(224, 224, 224)', '#f39c12', '#ffffff'],
			    colors = ['#fff', '#000', 'rgb(236, 236, 236)'];

			if (!BoldgridEditor.is_boldgrid_theme) {
				colors = nonBgThemeColors;
			} else {
				$.each(backgroundColors, function () {
					backgrounds.push({
						'color': this.color,
						'colorClass': this.background + ' ' + this.text
					});
				});
			}

			$.each(colors, function () {
				backgrounds.push({
					'color': this
				});
			});

			$.each(presets, function (index) {
				$newElement = $(this);

				if (backgrounds[colorCount].colorClass) {
					$newElement.attr('data-value', $newElement.data('value') + ' ' + backgrounds[colorCount].colorClass);
					$newElement.css('background-color', backgrounds[colorCount].color);
				} else {
					$newElement.css('background-color', backgrounds[colorCount].color);
				}

				$newElement.attr('data-id', index);

				if (index % 4 === 0 && index !== 0) {
					colorCount++;
				}

				if (!backgrounds[colorCount]) {
					colorCount = 0;
				}

				presetsHtml += $newElement[0].outerHTML;
			});

			return presetsHtml;
		},

		/**
   * Get the markup for all boxes to be rendered.
   *
   * @since 1.2.7
   * @return array presets.
   */
		getBoxMarkup: function () {
			var boxDimensionsClass,
			    config = BoldgridEditor.builder_config.boxes,
			    presets = [];

			$.each(config, function () {
				boxDimensionsClass = self.uiBoxDimensions[this] || '';
				boxDimensionsClass += ' ';
				presets.push('<div data-value=\'' + this + '\' class=\'' + boxDimensionsClass + this + '\'></div>');
			});

			return presets;
		},

		/**
   * Preselect current module.
   *
   * @since 1.2.7
   */
		preselectBox: function () {
			var $target = BG.Menu.getTarget(self),
			    $module = self.findModule($target),
			    moduleClasses = $module.attr('class'),
			    moduleBoxClasses = [];

			moduleClasses = moduleClasses ? moduleClasses.split(' ') : [];

			$.each(moduleClasses, function () {
				if (0 === this.indexOf('bg-box')) {
					moduleBoxClasses.push(this);
				}
			});

			moduleBoxClasses = moduleBoxClasses.length ? '.' + moduleBoxClasses.join('.') : false;

			/**
    * Grab all classes that start with bg-box from the target
    * Foreach preset
    * 	   if all the module bg-box styles exist on the the preset, then this preset is selected.
    */
			BG.Panel.$element.find('.presets > div').each(function () {
				var $this = $(this);

				if (moduleBoxClasses && $this.filter(moduleBoxClasses).length) {
					if ($this.css('background-color') === $module.css('background-color')) {
						$this.addClass('selected');
						return false;
					}
				}
			});
		},

		/**
   * Add styles to my designs.
   *
   * @since 1.2.7
   */
		styleMyDesigns: function () {
			var $body = BG.Controls.$container.$body;

			BG.Panel.$element.find('.my-designs > *').each(function () {
				var $this = $(this),
				    id = $this.data('id'),
				    $testElement = $this.clone();

				$testElement.css('display', 'none');
				$testElement.attr('style', BoldgridEditor.builder_config.components_used.box[id].style);
				$body.append($testElement);
				$this.css('background-color', $testElement.css('background-color'));
				$this.css('border-color', $testElement.css('border-color'));
				$testElement.remove();
			});
		},

		/**
   * Hide duplicates in my designs.
   *
   * @since 1.2.7
   */
		removeInvalid: function () {
			var classes = [];
			BG.Panel.$element.find('.my-designs > *').each(function () {
				var $this = $(this),
				    backgroundColor = $this.css('background-color'),
				    uniqueValue = $this.attr('data-value') + backgroundColor;

				if (-1 === classes.indexOf(uniqueValue) && !BG.CONTROLS.Color.isColorTransparent(backgroundColor)) {
					classes.push(uniqueValue);
				} else {
					$this.hide();
				}
			});
		},

		/**
   * Add all designs from the page into the my designs array.
   *
   * @since 1.2.7
   */
		_updateMyDesigns: function () {

			BG.Controls.$container.$body.find('.bg-box').each(function () {
				var styles,
				    found,
				    $this = $(this);

				styles = {
					classes: $this.attr('class'),
					style: $this.attr('style')
				};

				found = false;
				$.each(BoldgridEditor.builder_config.components_used.box, function () {
					if (this.style === styles.style && this.classes === styles.classes) {
						found = true;
						return false;
					}
				});

				if (!found) {
					BoldgridEditor.builder_config.components_used.box.push(styles);
				}
			});
		},

		/**
   * Open Panel.
   *
   * @since 1.2.7
   * @param Event e.
   */
		openPanel: function () {

			var panel = BG.Panel,
			    template = wp.template('boldgrid-editor-box');

			self._saveModuleClasses();
			self._updateMyDesigns();

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html(template({
				'presets': self.$presets,
				'myPresets': BoldgridEditor.builder_config.components_used.box,
				'colorControls': self.colorControls
			}));

			self.styleMyDesigns();
			self.removeInvalid();

			BOLDGRID.EDITOR.Panel.open(self);

			self.preselectBox();
			panel.$element.find('.grid').masonry({
				itemSelector: '.' + self.namespace
			});

			panel.initScroll(self);
			panel.scrollToSelected();
			BG.Panel.showFooter();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/button.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Button = {

		name: 'button',

		priority: 80,

		tooltip: 'Button Design',

		iconClasses: 'fa fa-cog',

		selectors: ['.btn', 'a.button', 'a.button-secondary', 'a.button-primary'],

		defaultColorClasses: [{
			color: '#eee',
			number: 0
		}, {
			color: '#229ffd',
			number: 1
		}, {
			color: '#ff414f',
			number: 2
		}, {
			color: '#a5de37',
			number: 3
		}, {
			color: '#feae1b',
			number: 4
		}, {
			color: '#7b72e9',
			number: 5
		}],

		classes: [{ name: 'btn btn-3d btn-rounded' }, { name: 'btn btn-3d btn-pill' }, { name: 'btn btn-3d' }, { name: 'btn btn-raised btn-rounded' }, { name: 'btn btn-raised btn-pill' }, { name: 'btn btn-raised btn-small-caps' }, { name: 'btn btn-rounded btn-small-caps' }, { name: 'btn btn-pill' }, { name: 'btn' }, { name: 'btn btn-longshadow btn-rounded' }, { name: 'btn btn-longshadow btn-small-caps btn-pill' }, { name: 'btn btn-longshadow btn-uppercase' }, { name: 'btn btn-glow btn-rounded' }, { name: 'btn btn-glow btn-pill btn-uppercase' }, { name: 'btn btn-glow' }, { name: 'btn btn-block btn-rounded' }, { name: 'btn btn-block btn-pill' }, { name: 'btn btn-block btn-small-caps' }],

		sizeClasses: ['btn-tiny', 'btn-small',
		// Normal.
		'', 'btn-large', 'btn-jumbo', 'btn-giant'],

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Panel Settings.
   *
   * @since 1.2.7
   */
		panel: {
			title: 'Button Design',
			height: '500px',
			width: '315px',
			includeFooter: true,
			customizeLeaveCallback: true,
			customizeCallback: true,
			customizeSupport: ['margin', 'customClasses'],
			customizeSupportOptions: {
				margin: {
					horMin: -30
				}
			}
		},

		/**
   * Setup Init.
   *
   * @since 1.2.7
   */
		setup: function () {
			self.applyColors();
			self._setupPresetClick();
			self._setupColorClick();
			self._setupCustomizeOpen();
			self.removeSizeClasses();
		},

		/**
   * Remove large size classes from the used components.
   *
   * @since 1.5
   */
		removeSizeClasses: function () {
			var usedComponents = BoldgridEditor.builder_config.components_used.button;

			_.each(usedComponents, function (value, index) {
				value.classes = value.classes.replace(/btn-(giant|jumbo)/g, '');
				usedComponents[index] = value;
			});

			// Eliminate duplicates
			usedComponents = _.uniq(usedComponents, false, function (comp) {
				return comp.classes;
			});

			// Only allow 20 button designs.
			BoldgridEditor.builder_config.components_used.button = usedComponents.slice(0, 20);
		},

		/**
   * Bind Event: When customization opens.
   *
   * @since 1.2.7
   */
		_setupCustomizeOpen: function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('bg-customize-open', function () {
				if (panel.currentControl === self) {
					self.sizeSlider.init();
					BG.Menu.getTarget(self).removeClass('bg-control-element');
				}
			});
			panel.$element.on('bg-customize-exit', function () {
				if (panel.currentControl === self) {
					self.preselect();
					BG.Panel.scrollToSelected();
					self.toggleFooter();
				}
			});
		},

		/**
   * Remove all color classes from a button.
   *
   * @since 1.2.7
   */
		removeColorClasses: function () {
			var $el = BG.Menu.getTarget(self);

			$el.removeClass('btn-neutral-color');

			// Remove all classes that begin with btn-color.
			$el.removeClass(function (index, css) {
				return (css.match(/(^|\s)btn-color\S+/g) || []).join(' ');
			});
		},

		/**
   * Bind Event: When a user clicks on button color.
   *
   * @since 1.2.7
   */
		_setupColorClick: function () {
			BG.Panel.$element.on('click', '.customize .button-color-controls .panel-selection', function () {
				var $this = $(this),
				    $target = BG.Menu.getTarget(self);

				self.removeColorClasses();
				$this.siblings().removeClass('selected');
				$this.addClass('selected');
				$target.addClass('btn-color-' + $this.attr('data-preset'));
			});
		},

		/**
   * Bind Event: When a user clicks on a preset panel selection.
   *
   * @since 1.2.7
   */
		_setupPresetClick: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.button-design .presets .panel-selection', function () {
				var $this = $(this),
				    preset = $this.data('preset'),
				    $target = BG.Menu.getTarget(self);

				panel.clearSelected();
				$this.addClass('selected');

				// Apply changes to editor.
				$target.attr('class', '');
				$target.addClass(preset);
				self.toggleFooter();
			});
		},

		/**
   * Insert a new button.
   *
   * @since 1.2.7
   */
		insertNew: function () {
			var $insertedButton;

			send_to_editor('<a class="button-primary bg-inserted-button" href="#">Button</a>');
			$insertedButton = BG.Controls.$container.find('.bg-inserted-button').last();
			BG.Controls.$container.find('.bg-inserted-button').removeClass('bg-inserted-button');
			BG.Controls.$menu.targetData[self.name] = $insertedButton;
			$insertedButton.click();
			self.openPanel();
		},

		/**
   * When the user clicks on menu, open panel.
   *
   * @since 1.2.7
   */
		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * When the user clicks on an image, if the panel is open, set panel content.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();
			}
		},

		/**
   * Apply coilor to the buttons.
   *
   * @since 1.2.7
   */
		applyColors: function () {
			var currentIndex,
			    maxIndex = 5,
			    minIndex = 0;

			// BG Themes.
			if (BoldgridEditor.colors.defaults.length) {
				maxIndex = BoldgridEditor.colors.defaults.length;
				minIndex = 1;
			}

			currentIndex = minIndex;

			$.each(self.classes, function (count) {
				if (maxIndex < currentIndex) {
					currentIndex = minIndex;
				}

				// Adds Default color, which has no class.
				if (0 !== currentIndex) {
					this.name += ' btn-color-' + currentIndex;
				}

				if ((count + 1) % 4 === 0) {
					currentIndex++;
				}
			});
		},

		/**
   * Init size slider.
   *
   * @since 1.2.7
   */
		sizeSlider: {
			getDefault: function () {
				var defaultIndex = 2,
				    $el = BG.Menu.getCurrentTarget();

				$.each(self.sizeClasses, function (index) {
					if ($el.hasClass(this)) {
						defaultIndex = index;
						return false;
					}
				});

				return defaultIndex;
			},
			init: function () {
				var defaultSize = this.getDefault() + 1,
				    $el = BG.Menu.getCurrentTarget();

				BG.Panel.$element.find('.section.button-size-control .value').html(defaultSize);
				BG.Panel.$element.find('.section.button-size-control .slider').slider({
					min: 1,
					max: 6,
					value: defaultSize,
					range: 'max',
					slide: function (event, ui) {
						//Remove Classes
						$el.removeClass(self.sizeClasses.join(' '));
						if (ui.value) {
							$el.addClass(self.sizeClasses[ui.value - 1]);
						}
					}
				});
			}
		},

		/**
   * Get colors for buttons.
   *
   * @since 1.2.7
   */
		getColorsMarkup: function () {
			var colors = self.defaultColorClasses;

			if (BoldgridEditor.is_boldgrid_theme && BG.Controls.hasThemeFeature('button-lib')) {
				colors = BG.CONTROLS.Color.getColorsFormatted();
			}

			return BG.CONTROLS.Color.colorTemplate({
				'colors': colors,
				'customColors': []
			});
		},

		/**
   * Select the currently focused button.
   * Must match all class names.
   *
   * @since 1.2.7
   */
		preselect: function () {
			var $target = BG.Menu.getTarget(self),
			    classes = BG.Util.getClassesLike($target, 'btn');

			// Exclude Size Classes.
			classes = $('<div>').addClass(classes.join(' ')).removeClass('bg-control-element ' + self.sizeClasses.join(' ')).attr('class');

			if ($target.hasClass('button-primary')) {
				classes = 'button-primary';
			} else if ($target.hasClass('button-secondary')) {
				classes = 'button-secondary';
			}

			BG.Panel.clearSelected();
			BG.Panel.$element.find('[data-preset="' + classes + '"]:first').addClass('selected');
		},

		/**
   * Control the display of the customize option in the panel footer.
   *
   * @since 1.2.7
   */
		toggleFooter: function () {
			var $target = BG.Menu.getTarget(self);

			if ($target.hasClass('btn')) {
				BG.Panel.showFooter();
			} else {
				BG.Panel.hideFooter();
			}
		},

		/**
   * Add buttons that exist on the page to list of used components. This will populate "My Designs".
   *
   * @since 1.2.7
   */
		_updateMyDesigns: function () {

			self.usedComponents = BoldgridEditor.builder_config.components_used.button.slice(0);

			BG.Controls.$container.$body.find('.btn').each(function () {
				var $this = $(this),
				    $clone = $this.clone().removeClass('bg-control-element ' + self.sizeClasses.join(' ')),
				    classes = $clone.attr('class'),
				    savedComponents = self.usedComponents,
				    savedIndex = _.findIndex(savedComponents, function (item) {
					return item.classes === classes;
				});

				if (-1 === savedIndex) {
					savedComponents.push({
						style: $clone.attr('style'),
						classes: classes
					});
				}
			});
		},

		/**
   * Open the panel for this control.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var panel = BG.Panel,
			    template = wp.template('boldgrid-editor-button');

			self._updateMyDesigns();

			// Remove all content from the panel.
			panel.clear();

			// Set markup for panel.
			panel.$element.find('.panel-body').html(template({
				text: 'Button',
				presets: self.classes,
				myPresets: self.usedComponents,
				colors: self.getColorsMarkup()
			}));

			self.preselect();

			// Open Panel.
			panel.open(self);

			self.toggleFooter();

			panel.$element.removeClass('ui-widget-content');
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Button.init();
	self = BOLDGRID.EDITOR.CONTROLS.Button;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/color.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Color = {

		$currentInput: null,

		$colorPanel: null,

		$colorPicker: null,

		colorTemplate: wp.template('boldgrid-editor-color'),

		transparentColors: ['rgba(0, 0, 0, 0)', 'transparent'],

		colorClasses: ['color1-color', 'color2-color', 'color3-color', 'color4-color', 'color5-color'],

		textContrastClasses: ['color-neutral-text-default', 'color1-text-default', 'color2-text-default', 'color3-text-default', 'color4-text-default', 'color5-text-default', 'color-neutral-text-contrast', 'color-1-text-contrast', 'color-2-text-contrast', 'color-3-text-contrast', 'color-4-text-contrast', 'color-5-text-contrast'],

		backgroundColorClasses: ['color-neutral-background-color', 'color1-background-color', 'color2-background-color', 'color3-background-color', 'color4-background-color', 'color5-background-color'],

		borderColorClasses: ['color1-border-color', 'color2-border-color', 'color3-border-color', 'color4-border-color', 'color5-border-color'],

		customColors: BoldgridEditor.saved_colors,

		/**
   * Init the color panel.
   *
   * @since 1.2.7
   */
		init: function () {
			self._create();
			self._setupClosePicker();
			self._renderColorOptions();
			self._setupPanelDrag();
			self._setupAddNew();
			self._setupColorPicker();
			self._setupCallback();
			self._setupColorPreview();
			self._setupRemove();
			self._setupAutoHide();
			self._setupResetDefault();
			self._addPanelClasses();

			self._setupOpenCustomization();

			return self;
		},

		/**
   * Add any extra classes to the panel on load.
   *
   * @since 1.2.7
   */
		_addPanelClasses: function () {
			if (!BoldgridEditor.is_boldgrid_theme) {
				self.$colorPanel.addClass('non-bg-theme');
			}
		},

		/**
   * Bind Event: When the user clicks reset to default.
   *
   * @since 1.2.7
   */
		_setupResetDefault: function () {
			self.$colorPanel.find('.wp-picker-default').on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				self.$currentInput.attr('data-type', 'color');
				self.$currentInput.val('').change();
				self.$colorPanel.find('.selected').removeClass('selected');
				self.$currentInput.parent().find('label').css('background-color', '#333');
			});
		},

		/**
   * Bind Event: When the user opens customization, reset the color controls.
   *
   * @since 1.2.7
   */
		_setupOpenCustomization: function () {
			BG.Panel.$element.on('bg-open-customization', function () {
				self.initColorControls();
			});
		},

		/**
   * When loosing focus of the color picker, close the panel.
   *
   * @since 1.2.7
   */
		_setupAutoHide: function () {
			$('body').on('click', function () {
				self.closePicker();
			});

			self.$colorPanel.on('click', function (e) {
				e.stopPropagation();
			});
		},

		/**
   * Get the class for a color index.
   *
   * @since 1.2.7
   * @param string type property
   * @param string index color num
   */
		getColorClass: function (type, index) {
			var seperator = 'text-contrast' === type ? '-' : '';
			return 'color' + seperator + index + '-' + type;
		},

		/**
   * Close color panel.
   *
   * @since 1.2.7
   */
		openPicker: function ($input) {
			self.$colorPanel.show();
			self.$currentInput = $input;
			tinymce.activeEditor.undoManager.add();
		},

		/**
   * Close color panel.
   *
   * @since 1.2.7
   */
		closePicker: function () {
			if (self.$colorPanel.is(':visible')) {
				tinymce.activeEditor.undoManager.add();
				self.$colorPanel.hide();
				self.$currentInput = null;
				self.saveCustomColors();
			}
		},

		/**
   * Store saved colors in an input on the post page.
   *
   * @since 1.2.7
   */
		saveCustomColors: function () {
			$('#post input[name="boldgrid-custom-colors"]').val(JSON.stringify(self.customColors));
		},

		/**
   * Bind Event: User clicks label showing color.
   *
   * @since 1.2.7
   */
		_setupColorPreview: function () {
			BG.Panel.$element.on('click', '.color-preview', function (e) {
				e.stopPropagation();

				var $currentSelection,
				    $preview = $(this),
				    $input = BG.Panel.$element.find('input[name="' + $preview.attr('for') + '"]');

				if ('color' === $input.attr('data-type') || !$input.attr('data-type')) {
					// Select Color From My Colors.
					self.$colorPanel.find('[data-type="custom"].panel-selection').each(function () {
						var $this = $(this);
						if ($preview.css('background-color') === $this.css('background-color')) {
							$currentSelection = $this;
							return false;
						}
					});
				} else if ('class' === $input.attr('data-type')) {
					$currentSelection = self.$colorPanel.find('.panel-selection[data-preset="' + $input.val() + '"]');
				}

				self.$colorPanel.find('.panel-selection.selected').removeClass('selected');
				self.updatePicker($preview.css('background-color'));
				self.openPicker($input);

				if ($currentSelection && $currentSelection.length) {
					self.selectColor($currentSelection);
				}
			});
			BG.Panel.$element.on('change', 'input.color-control', function () {
				var $this = $(this),
				    $preview = BG.Panel.$element.find('.color-preview[for="' + $this.attr('name') + '"]');

				$preview.css('background-color', self.$colorPicker.iris('color'));
			});
		},

		/**
   * Bind Event: user clicks close on color picker.
   *
   * @since 1.2.7
   */
		_setupClosePicker: function () {
			self.$colorPanel.find('.panel-title .close-icon').on('click', function () {
				self.closePicker();
			});
		},

		/**
   * Setup ability to drag panel.
   *
   * @since 1.2.7
   */
		_setupPanelDrag: function () {
			this.$colorPanel.draggable({
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll: false
			});
		},

		/**
   * Find the appearence color of an element. Sometimes an element Bg color will be transparent.
   * traverse the dom up until we get a color.
   *
   * @since 1.2.7
   * @param jQuery $element.
   * @param string property. e.g. background-color.
   * @return string color.
   */
		findAncestorColor: function ($element, property) {
			var color,
			    elements = [];

			elements.push($element);

			$element.parents().each(function () {
				elements.push(this);
			});

			$.each(elements, function () {
				var $this = $(this),
				    thisColor = $this.css(property);

				if (false === self.isColorTransparent(thisColor)) {
					color = thisColor;
					return false;
				}
			});

			return color;
		},

		/**
   * Get all theme palette background colors.
   *
   * @since 1.2.7
   * @return array backgroundColors.
   */
		getPaletteBackgroundColors: function () {
			var backgroundColors = {};

			$.each(BoldgridEditor.colors.defaults, function (index) {
				backgroundColors['color' + (index + 1) + '-' + 'background-color'] = this;
			});

			return backgroundColors;
		},

		/**
   * Get Background Color with Forground color.
   *
   * @since 1.3
   * @return array backgroundColors.
   */
		getBackgroundForegroundColors: function () {
			var colorNum,
			    backgroundColors = [];

			$.each(BoldgridEditor.colors.defaults, function (index) {
				colorNum = index + 1;

				backgroundColors.push({
					'color': this,
					'colorNum': colorNum,
					'text': BG.CONTROLS.Color.getColorClass('text-default', colorNum),
					'background': BG.CONTROLS.Color.getColorClass('background-color', colorNum)
				});
			});

			return backgroundColors;
		},

		/**
   * Check if a color is transparent.
   *
   * @since 1.2.7
   * @param bool.
   */
		isColorTransparent: function (color) {
			return BG.CONTROLS.Color.transparentColors.indexOf(color) !== -1 || !color;
		},

		/**
   * For each color control found in the panel.
   *
   * @since 1.2.7
   */
		initColorControls: function () {

			//Var $target = BG.Menu.getTarget( BOLDGRID.EDITOR.Panel.currentControl );

			BG.Panel.$element.find('input.color-control').each(function () {
				var $this = $(this),
				    type = 'color',
				    inputValue = $this.val(),
				    $label = $this.prev('label');

				// If input is not transparent, set the color.
				if (false === self.isColorTransparent(inputValue)) {
					$label.css('background-color', inputValue);
				}
				/*
    If ( $target.is( self.colorClasses.join(',') + ',' + self.backgroundColorClasses.join(',') ) ) {
    	 * @TODO This has been commented out because we can not set the type to class.
    	 * In order for this to work correctly. The control would have to set the value
    	 * of the input to an interger value. The implecation of this "bug" is that
    	 * color classes do not preselect when reentering the control.
    	//type = 'class';
    }
     */

				$this.attr('data-type', type);
			});
		},

		/**
   * Initialize the color picker and bind the color change event.
   *
   * @since 1.2.7
   */
		_setupColorPicker: function () {
			var type = 'color',
			    defaultPickerColor = '#e3e',
			    $selected = self.$colorPanel.find('.panel-selection.selected[data-preset]');

			if ($selected.length) {
				defaultPickerColor = $selected.css('background-color');
			}

			self.$colorPicker = self.$colorPanel.find('.boldgrid-color-picker');
			self.$colorPicker.val(defaultPickerColor);
			self.$colorPicker.wpColorPicker({
				mode: 'hsl',
				defaultColor: defaultPickerColor,
				change: function (event, ui) {
					var $this = $(this),
					    cssColor = ui.color.toCSS(),
					    $selection = $this.closest('.color-control').find('.colors .panel-selection.selected[data-preset]');

					if ($selection.length && $selection.is('[data-type="default"]')) {
						self._copyColor();
						return;
					}

					$selection = self.$colorPanel.find('.colors .panel-selection.selected[data-preset]');
					if ($selection.length) {
						$selection.css('background-color', cssColor);
						$selection.attr('data-preset', cssColor);
						self.customColors[$selection.attr('data-index')] = cssColor;
					}

					if (self.$currentInput) {
						self.$currentInput.attr('data-type', type);
						self.$currentInput.attr('value', cssColor);
						self.$currentInput.change();
					}
				},
				hide: false,
				palettes: true
			});
		},

		/**
   * Copy an existing color.
   *
   * @since 1.2.7
   * @param defaultPickerColor.
   */
		_copyColor: function () {
			var $controls, selectedBackground;

			selectedBackground = self.$colorPanel.find('.colors .panel-selection.selected').css('background-color');

			if (!selectedBackground) {
				selectedBackground = self.$colorPicker.iris('color');
			}

			self.customColors.push(selectedBackground);
			self._renderColorOptions();

			$controls = self.$colorPanel.find('.color-control');
			$controls.find('ul.colors').removeClass('selected');
			self.updatePicker(selectedBackground);
			self.selectColor($controls.find('.my-colors li:last-of-type'));
		},

		/**
   * Update color picker color.
   *
   * @since 1.5
   * @param  {string} color Color requested.
   */
		updatePicker: function (color) {
			var alpha;

			self.$colorPicker.iris('color', color);

			// Update alpha slider.
			alpha = parseInt(Color(color)._alpha * 100);
			self.$colorPanel.find('.iris-slider-offset-alpha').slider('value', alpha);
		},

		/**
   * Bind Event: A user clicks on new color.
   *
   * @since 1.2.7
   */
		_setupAddNew: function () {
			self.$colorPanel.on('click', '.colors .panel-selection.custom-color', function () {
				self._copyColor();
			});
		},

		/**
   * Render all colors that a user can choose from.
   *
   * @since 1.2.7
   */
		_renderColorOptions: function () {
			self.$colorPanel.find('.colors-wrap').html(self.colorTemplate({
				'colors': self.getColorsFormatted(),
				'customColors': self.customColors
			}));

			BOLDGRID.EDITOR.Tooltip.renderTooltips();
		},

		/**
   * Format the theme colors and return them.
   *
   * @since 1.2.7
   * @return array colors.
   */
		getColorsFormatted: function () {
			var colors = [];
			$.each(BoldgridEditor.colors.defaults, function (key) {

				var colorNum = key + 1;
				colors.push({
					'color': this,
					'paletteNum': colorNum
				});
			});

			return colors;
		},

		getGridblockColors: function () {
			var colors = self.getColorsFormatted();

			if (BoldgridEditor.colors.neutral) {
				colors.push({
					'paletteNum': 'neutral',
					'color': BoldgridEditor.colors.neutral
				});
			}

			return colors;
		},

		/**
   * Render the color picker panel.
   *
   * @since 1.2.7
   */
		_create: function () {
			var template = wp.template('boldgrid-editor-color-panel');

			self.$colorPanel = $(template());
			$('body').append(self.$colorPanel);
		},

		/**
   * Bind Event: A user clicks on the remove link.
   *
   * @since 1.2.7
   */
		_setupRemove: function () {
			self.$colorPanel.on('click', '.color-picker-wrap .cancel', function (e) {
				var $selection,
				    $control,
				    $newSelection,
				    $this = $(this);

				e.preventDefault();

				$control = $this.closest('.color-control');
				$control.find('.custom-color').removeClass('selected');

				$selection = $control.find('.colors .selected[data-type="custom"]');
				if ($selection.length) {
					self.customColors.splice($selection.attr('data-index'), 1);
					$selection.remove();
					$newSelection = self.$colorPanel.find('.panel-selection').first();
					self.$colorPicker.iris('color', $newSelection.css('background-color'));
					self.selectColor($newSelection);
				}
			});
		},

		/**
   * Select a color.
   *
   * @param jQuery $element.
   */
		selectColor: function ($element) {
			self.$colorPanel.find('.selected').removeClass('selected');
			$element.addClass('selected');
			if ($element.is('[data-type="custom"]')) {
				self.$colorPanel.attr('current-selection', 'custom');
			} else {
				self.$colorPanel.attr('current-selection', 'default');
			}
		},

		/**
   * Bind Event: Click on a panel selection.
   *
   * @since 1.2.7
   */
		_setupCallback: function () {
			self.$colorPanel.on('click', '.colors .panel-selection', function () {
				var type,
				    $this = $(this);

				// Clicks on add a new color.
				if ($this.hasClass('custom-color')) {
					return;
				}

				type = 'default' === $this.data('type') ? 'class' : 'color';

				self.$colorPanel.find('ul.colors .panel-selection').removeClass('selected');
				self.updatePicker($this.css('background-color'));
				self.selectColor($this);

				self.$currentInput.val($this.attr('data-preset'));
				self.$currentInput.attr('data-type', type);
				self.$currentInput.change();
			});
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/container.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Container = {

		name: 'container',

		tooltip: 'Section Width',

		priority: 15,

		iconClasses: 'fa fa-arrows-h',

		selectors: ['.boldgrid-section .container', '.boldgrid-section .container-fluid'],

		init: function () {},

		onMenuClick: function () {
			self.toggleSectionWidth();
		},

		/**
   * Add a transition to the container changing size.
   *
   * @since 1.2.8
   */
		transitionSize: function ($container) {
			BG.Controls.$container.find('html').addClass('bg-disabled-handles');
			$container.css('transition', 'width .5s');
			setTimeout(function () {
				$container.css('transition', '');
				$(window).trigger('resize');
				BOLDGRID.EDITOR.CONTROLS.Section.positionHandles();
				BOLDGRID.EDITOR.RESIZE.Row.positionHandles();
				BG.Controls.$container.find('html').removeClass('bg-disabled-handles');
			}, 600);
		},

		/**
   * Switch between a container and a container fluid.
   */
		toggleSectionWidth: function ($container) {

			if (!$container) {
				$container = BG.Controls.$menu.targetData[self.name].closest('.container, .container-fluid');
			}

			if ($container.hasClass('container')) {
				self.transitionSize($container);
				$container.addClass('container-fluid');
				$container.removeClass('container');
			} else {
				self.transitionSize($container);
				$container.addClass('container');
				$container.removeClass('container-fluid');
			}
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Container.init();
	self = BOLDGRID.EDITOR.CONTROLS.Container;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/font.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Font = {

		name: 'font',

		tooltip: 'Font',

		priority: 30,

		iconClasses: 'fa fa-text-width',

		selectors: ['p, h1, h2, h3, h4, h5, h6, table, section, ul, ol, dl'],

		// Ignore images clicked in paragraphs.
		exceptionSelector: 'img, .draggable-tools-imhwpb *',

		templateMarkup: null,

		fontClasses: ['bg-font-family-alt', 'bg-font-family-body', 'bg-font-family-heading', 'bg-font-family-menu'],

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		panel: {
			title: 'Text Setting',
			height: '450px',
			width: '268px'
		},

		/**
   * Constructor.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupEffectClick();
			BG.CONTROLS.GENERIC.Fontcolor.bind();

			self.templateMarkup = wp.template('boldgrid-editor-font')({
				'textEffectClasses': BoldgridEditor.builder_config.textEffectClasses,
				'fonts': BoldgridEditor.builder_config.fonts,
				'themeFonts': self.getThemeFonts(),
				'myFonts': BoldgridEditor.builder_config.components_used.font
			});

			self.bindFontCollpase();

			BG.FontRender.updateFontLink(BG.Controls.$container);
		},

		/**
   * When scrolling on window with font family open, collapse font family.
   *
   * @since 1.3
   */
		bindFontCollpase: function () {
			var hideFamilySelect = _.debounce(function () {
				var $fontFamily = $('.font-family-dropdown');
				if ($fontFamily.hasClass('ui-selectmenu-open')) {
					$fontFamily.removeClass('ui-selectmenu-open');
				}
			}, 50);

			$(window).on('scroll', hideFamilySelect);
		},

		/**
   * Get the fonts used by the theme.
   *
   * @since 1.2.7
   */
		getThemeFonts: function () {
			var themeFonts = [];

			if (-1 !== BoldgridEditor.builder_config.theme_features.indexOf('theme-fonts-classes')) {
				themeFonts = BoldgridEditor.builder_config.theme_fonts;
			}

			return themeFonts;
		},

		/**
   * Add font effect when clicking on a panel selection.
   *
   * @since 1.2.7
   */
		_setupEffectClick: function () {
			var panel = BG.Panel;

			panel.$element.on('click', '.section.effects .panel-selection', function () {
				var $this = $(this),
				    $target = BG.Menu.$element.targetData[self.name];

				$.each(BoldgridEditor.builder_config.textEffectClasses, function () {
					$target.removeClass(this.name);
				});

				$target.addClass($this.data('preset'));
				$this.siblings().removeClass('selected');
				$this.addClass('selected');
			});
		},

		/**
   * Open panel when clicking on menu item.
   *
   * @since 1.2.7
   */
		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * Setup Character spacing slider.
   *
   * @since 1.2.7
   * @param jQuery $el
   */
		charSpacingSlider: function ($el) {

			var elementSize = $el.css('letter-spacing'),
			    defaultSize = elementSize ? parseInt(elementSize) : 0;

			BG.Panel.$element.find('.section.spacing .character .value').html(defaultSize);
			BG.Panel.$element.find('.section.spacing .character .slider').slider({
				step: 0.1,
				min: -0.3,
				max: 5,
				value: defaultSize,
				range: 'max',
				slide: function (event, ui) {
					BG.Controls.addStyle($el, 'letter-spacing', ui.value);
				}
			});
		},

		/**
   * Setup line spacing slider.
   *
   * @since 1.2.7
   * @param jQuery $el
   */
		lineSpacingSlider: function ($el) {

			var elementSize = $el.css('line-height'),
			    defaultSize = BG.Util.convertPxToEm(elementSize, $el.css('line-height'));

			BG.Panel.$element.find('.section.spacing .line .value').html(defaultSize);
			BG.Panel.$element.find('.section.spacing .line .slider').slider({
				step: 0.1,
				min: 0.5,
				max: 3,
				value: defaultSize,
				range: 'max',
				slide: function (event, ui) {
					BG.Controls.addStyle($el, 'line-height', ui.value + 'em');
				}
			});
		},

		/**
   * When the user clicks on an image, if the panel is open, set panel content.
   *
   * @since 1.2.7
   */
		elementClick: function (e) {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();

				if (BG.Panel.$element.find('label[for="font-color"]').is(':visible')) {
					e.boldgridRefreshPanel = true;
					BG.CONTROLS.Color.$currentInput = BG.Panel.$element.find('input[name="font-color"]');
				}
			}
		},

		/**
   * Set the value of the current font color.
   *
   * @since 1.2.7
   * @param jQuery $target
   */
		_initTextColor: function () {
			var textColor = '#333';
			BG.Panel.$element.find('[name="font-color"]').data('type', 'color').val(textColor);

			// Don't display font color for buttons.
			self._hideButtonColor();
		},

		/**
   * If the user is controlling the font of a button, don't display color.
   *
   * @since 1.2.8
   */
		_hideButtonColor: function () {
			var $clone,
			    buttonQuery = '> .btn, > .button-primary, > .button-secondary, > a',
			    $colorPreview = BG.Panel.$element.find('.color-preview'),
			    $target = BG.Menu.getTarget(self);

			$clone = $target.clone();
			$clone.find(buttonQuery).remove();

			// If removing all buttons, results in an empty string or white space.
			if (!$clone.text().replace(/ /g, '').length && $target.find(buttonQuery).length) {

				// Hide color control.
				$colorPreview.hide();
			}
		},

		/**
   * Set font family dropdown.
   *
   * @since 1.2.7
   * @param jQuery $target
   */
		_initFamilyDropdown: function () {
			var panel = BG.Panel,
			    $select;

			$.widget('custom.fontfamilyselect', $.ui.selectmenu, {
				_renderItem: function (ul, item) {
					return $('<li>').data('ui-autocomplete-item', item).attr('data-value', item.label).attr('data-type', item.element.data('type')).attr('data-index', item.element.data('index')).append(item.label).appendTo(ul);
				},
				_renderMenu: function (ul, items) {
					var self = this;
					$.each(items, function (index, item) {
						self._renderItemData(ul, item);
					});
					ul.parent().addClass('font-family-dropdown');
					ul.addClass('selectize-dropdown-content');
					ul.find('[data-type="theme"]:first').before('<h3 class="seperator">Theme Fonts</h3>');
					ul.find('[data-type="custom"]:first').before('<h3 class="seperator">My Fonts</h3>');
					ul.find('[data-type="all"]:first').before('<h3 class="seperator">All Fonts</h3>');

					setTimeout(function () {
						ul.find('.seperator').removeClass('ui-menu-item');
					});
				}
			});

			panel.$element.find('.selectize-dropdown-content select').fontfamilyselect({
				select: function (event, data) {
					var $target = BG.Menu.getTarget(self);

					$select.attr('data-value', data.item.label);

					// Reset.
					$target.removeAttr('data-font-family').removeAttr('data-font-class');

					$target.removeClass(self.fontClasses.join(' '));

					if ('Default' === data.item.label) {
						BG.Controls.addStyle($target, 'font-family', '');
						return;
					}

					if ('theme' === data.item.element.data('type')) {
						$target.addClass(data.item.element.data('index'));
						$target.attr('data-font-class', data.item.element.data('index'));
						BG.Controls.addStyle($target, 'font-family', '');
					} else {
						$target.attr('data-font-family', data.item.label);
						BG.Controls.addStyle($target, 'font-family', data.item.label);
					}

					BG.FontRender.updateFontLink(BG.Controls.$container);
				}
			});

			$select = self.getFamilySelection();

			self.preselectFamily();
		},

		/**
   * Get the current font family selection.
   *
   * @since 1.2.7
   */
		getFamilySelection: function () {
			return BG.Panel.$element.find('.section.family .ui-selectmenu-button');
		},

		/**
   * Preselect the font family.
   *
   * @since 1.2.7
   */
		preselectFamily: function () {
			var fontClass,
			    defaultFamily = 'Default',
			    $select = self.getFamilySelection(),
			    $target = BG.Menu.getTarget(self);

			if ($target.is('.' + self.fontClasses.join(',.'))) {
				fontClass = $target.attr('data-font-class');
				defaultFamily = BG.Panel.$element.find('.section.family [data-index="' + fontClass + '"]').data('value');
			} else if ($target.attr('data-font-family')) {
				defaultFamily = $target.attr('data-font-family');
			}

			$select.attr('data-value', defaultFamily);
		},

		/**
   * Preset the text color input.
   *
   * @since 1.2.7
   */
		setTextColorInput: function () {
			var color,
			    $target = BG.Menu.getTarget(self);

			color = BG.CONTROLS.Color.findAncestorColor($target, 'color');

			BG.Panel.$element.find('input[name="font-color"]').attr('value', color);
		},

		/**
   * Preset the text effect control.
   *
   * @since 1.2.7
   */
		setTextEffect: function () {
			var $target = BG.Menu.getTarget(self),
			    $section = BG.Panel.$element.find('.panel-body .section.effects'),
			    classes = BG.Util.getClassesLike($target, 'bg-text-fx');

			$section.find('.panel-selection.selected').removeClass('selected');

			if (classes.length) {
				$section.find('.panel-selection').find('.' + classes.join('.')).closest('.panel-selection').addClass('selected');
			} else {
				$section.find('.none-selected').addClass('selected');
			}
		},

		/**
   * Preset controls.
   *
   * @since 1.2.7
   */
		selectPresets: function () {
			self.setTextColorInput();
			self.setTextEffect();
		},

		/**
   * Open all panels.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var panel = BG.Panel,
			    $target = BG.Menu.getTarget(self);

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html(self.templateMarkup);

			self.charSpacingSlider($target);
			self.lineSpacingSlider($target);
			self._initTextColor($target);
			self._initFamilyDropdown();
			self.selectPresets();

			// Open Panel.
			panel.open(self);
			panel.scrollTo(0);

			BG.CONTROLS.GENERIC.Fontsize.bind();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Generic = {

		defaultCustomize: wp.template('boldgrid-editor-default-customize'),

		createCustomizeSection: function () {
			BG.Panel.$element.find('.choices').append(self.defaultCustomize());
		},

		/**
   * Init Controls.
   *
   * @since 1.2.7
   */
		initControls: function () {
			var customizeOptions = BG.Panel.currentControl.panel.customizeSupport || [],
			    customizeSupportOptions = BG.Panel.currentControl.panel.customizeSupportOptions || false;

			// Add customize section if it does not exist.
			if (customizeOptions.length && !BG.Panel.$element.find('.panel-body .customize').length) {
				self.createCustomizeSection();
			}

			$.each(customizeOptions, function () {
				var customizationOption = this,
				    addOptions = {};

				if (customizeSupportOptions && customizeSupportOptions[this]) {
					addOptions = customizeSupportOptions[this];
				}

				customizationOption = customizationOption.replace('-', '');
				customizationOption = customizationOption.toLowerCase();
				customizationOption = customizationOption.charAt(0).toUpperCase() + customizationOption.slice(1);

				BG.CONTROLS.GENERIC[customizationOption].render(addOptions);
				BG.Tooltip.renderTooltips();
				BG.CONTROLS.GENERIC[customizationOption].bind(addOptions);
			});
		},

		/**
   * Setup Customization.
   *
   * @since 1.2.7
   */
		setupInputCustomization: function () {
			BG.Panel.$element.on('change', '.class-control input', function () {
				var $this = $(this),
				    name = $this.attr('name'),
				    $el = BG.Menu.getCurrentTarget(),
				    controlClassnames = [],
				    $siblingInputs = $this.closest('.class-control').find('input[name="' + name + '"]');

				// Find other values.
				$siblingInputs.each(function () {
					controlClassnames.push($(this).attr('value'));
				});

				$el.removeClass(controlClassnames.join(' '));
				$el.addClass($this.val());
			});
		},

		/**
   * Setup Init.
   *
   * @since 1.2.7
   */
		setupInputInitialization: function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('bg-customize-open', function () {
				var $el = BG.Menu.getCurrentTarget();

				panel.$element.find('.class-control input[default]').prop('checked', true);

				panel.$element.find('.class-control input').each(function () {
					var $this = $(this);
					if ($el.hasClass($this.attr('value'))) {
						$this.prop('checked', true);
					}
				});
			});
		}

	};

	self = BOLDGRID.EDITOR.CONTROLS.Generic;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/block-alignment.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Blockalignment = {
		template: wp.template('boldgrid-editor-horizontal-block-alignment'),

		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.horizontal-block-alignment').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},

		bind: function () {
			var currentAlignment = 'center',
			    $el = BG.Menu.getCurrentTarget(),
			    $inputs = BG.Panel.$element.find('.section.horizontal-block-alignment input'),
			    marginLeft = parseInt($el.css('margin-left')),
			    marginRight = parseInt($el.css('margin-right'));

			if (0 === marginLeft && 0 === marginRight) {
				currentAlignment = 'center';
			} else if (0 === marginLeft) {
				currentAlignment = 'left';
			} else if (0 === marginRight) {
				currentAlignment = 'right';
			}

			$inputs.filter('[value="' + currentAlignment + '"]').prop('checked', true);

			BG.Panel.$element.on('change', '.section [name="horizontal-block-alignment"]', function () {
				var $this = $(this),
				    value = $this.attr('value');

				self._applyMargin($el, value);
			});
		},

		_applyMargin: function ($el, value) {
			$el.removeAttr('align');

			if ('center' === value) {
				$el.css('margin-left', 'auto');
				$el.css('margin-right', 'auto');
			} else if ('left' === value) {
				$el.css('margin-right', '');
				$el.css('margin-left', '0');
			} else {
				$el.css('margin-right', '0');
				$el.css('margin-left', '');
			}
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Blockalignment;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/custom-classes.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Customclasses = {

		template: wp.template('boldgrid-editor-custom-classes'),

		/**
   * Render the control.
   *
   * @since 1.5.1
   */
		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.custom-classes').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},

		/**
   * Bind the input event to newly created cnotrol.
   *
   * @since 1.5.1
   */
		bind: function () {
			var panel = BG.Panel,
			    $target = BG.Menu.getCurrentTarget(),
			    currentClasses = $target.attr('custom-classes');

			panel.$element.find('[name="custom-classes"]').on('input', function () {
				var $this = $(this),
				    customClasses = $target.attr('custom-classes'),
				    value = $this.attr('value');

				value = value.replace(',', ' ');

				$target.removeClass(customClasses);
				$target.attr('custom-classes', value);
				$target.addClass(value);
			}).val(currentClasses);

			panel.$element.find('.custom-classes').show();
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Classes;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/font-color.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Fontcolor = {

		bound: false,

		template: wp.template('boldgrid-editor-font-color'),

		render: function () {
			var $target = BG.Menu.getTarget(BG.Panel.currentControl);

			BG.Panel.$element.find('.panel-body .customize').find('.section.font-color').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());

			BG.Panel.$element.on('bg-customize-open', function () {
				BG.Panel.$element.find('.panel-body .customize').find('.section.font-color label').css('background-color', $target.css('color'));
			});
		},

		bind: function () {
			var panel = BG.Panel;

			if (this.bound) {
				return false;
			}

			panel.$element.on('change', '.section [name="font-color"]', function () {
				var $this = $(this),
				    $target = BG.Menu.getCurrentTarget(),
				    value = $this.attr('value'),
				    type = $this.attr('data-type');

				$target.removeClass(BG.CONTROLS.Color.colorClasses.join(' '));
				BG.Controls.addStyle($target, 'color', '');

				if ('class' === type) {
					$target.addClass(BG.CONTROLS.Color.getColorClass('color', value));
				} else {
					BG.Controls.addStyle($target, 'color', value);
				}
			});

			this.bound = true;
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Fontcolor;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/font-size.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Fontsize = {
		template: wp.template('boldgrid-editor-font-size'),
		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.size').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},
		bind: function () {
			var $el = BG.Menu.getTarget(BG.Panel.currentControl),
			    elementSize = $el.css('font-size'),
			    defaultSize = elementSize ? parseInt(elementSize) : 14;

			defaultSize = defaultSize >= 5 ? defaultSize : 14;

			BG.Panel.$element.find('.section.size .value').html(defaultSize);
			BG.Panel.$element.find('.section.size .slider').slider({
				min: 5,
				max: 115,
				value: defaultSize,
				range: 'max',
				slide: function (event, ui) {
					BG.Panel.$element.find('.section.size .value').html(ui.value);
					BG.Controls.addStyle($el, 'font-size', ui.value);
				}
			});
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Fontsize;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/link.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Link = {
		template: wp.template('boldgrid-editor-insert-link'),
		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.insert-link').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},
		bind: function () {

			BG.Panel.$element.find('.section.insert-link').on('click', function () {
				var $el = BG.Menu.getTarget(BG.Panel.currentControl);

				tinymce.activeEditor.selection.select($el[0]);
				tinymce.activeEditor.execCommand('WP_Link');
			});
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Link;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/margin.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Margin = {
		template: wp.template('boldgrid-editor-margin'),

		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.margin-control').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},

		bind: function (options) {
			if (!options) {
				options = {};
			}

			var minVert = options.vertMin || 0,
			    minHor = options.horMin || -15,
			    $target = BG.Menu.getCurrentTarget(),
			    defaultMarginVert = $target.css('margin-top'),
			    defaultMarginHor = $target.css('margin-left');

			if (options.horizontal === false) {
				BG.Panel.$element.find('.margin-horizontal').hide();
			}

			if (options.vertical === false) {
				BG.Panel.$element.find('.margin-top').hide();
			}

			defaultMarginVert = defaultMarginVert ? parseInt(defaultMarginVert) : 0;
			defaultMarginHor = defaultMarginHor ? parseInt(defaultMarginHor) : 0;

			BG.Panel.$element.find('.panel-body .customize .margin-horizontal .slider').slider({
				min: minHor,
				max: 50,
				value: defaultMarginHor,
				range: 'max',
				slide: function (event, ui) {
					$target = BG.Menu.getCurrentTarget();

					BG.Controls.addStyle($target, 'margin-left', ui.value);
					BG.Controls.addStyle($target, 'margin-right', ui.value);
				}
			}).siblings('.value').html(defaultMarginHor);

			BG.Panel.$element.find('.panel-body .customize .margin-top .slider').slider({
				min: minVert,
				max: 200,
				value: defaultMarginVert,
				range: 'max',
				slide: function (event, ui) {
					$target = BG.Menu.getCurrentTarget();

					BG.Controls.addStyle($target, 'margin-top', ui.value);
					BG.Controls.addStyle($target, 'margin-bottom', ui.value);
				}
			}).siblings('.value').html(defaultMarginVert);
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Margin;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/rotate.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Rotate = {
		classes: ['fa-rotate-90', 'fa-rotate-180', 'fa-rotate-270'],
		getDefault: function () {
			var $el = BG.Menu.getCurrentTarget(),
			    value = 0;

			if ($el.hasClass('fa-rotate-90')) {
				value = 90;
			} else if ($el.hasClass('fa-rotate-180')) {
				value = 180;
			} else if ($el.hasClass('fa-rotate-270')) {
				value = 270;
			}

			return value;
		},
		template: wp.template('boldgrid-editor-rotate'),
		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.rotate-control').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},
		bind: function () {
			var defaultSize = this.getDefault(),
			    $el = BG.Menu.getCurrentTarget();

			BG.Panel.$element.find('.section.rotate-control .value').html(defaultSize);
			BG.Panel.$element.find('.section.rotate-control .slider').slider({
				min: 0,
				step: 90,
				max: 270,
				value: defaultSize,
				range: 'max',
				slide: function (event, ui) {
					//Remove Classes
					$el.removeClass(self.rotate.classes.join(' '));
					if (ui.value) {
						$el.addClass('fa-rotate-' + ui.value);
					}
				}
			});
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Rotate;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/generic/width.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Width = {

		template: wp.template('boldgrid-editor-generic-width'),

		render: function () {
			BG.Panel.$element.find('.panel-body .customize').find('.section.width-control').remove();
			BG.Panel.$element.find('.panel-body .customize').append(this.template());
		},

		bind: function () {

			var maxVal = 100,
			    $target = BG.Menu.getCurrentTarget(),
			    width = $target[0].style.width || $target.attr('width');

			width = width ? parseInt(width) : maxVal;
			width = Math.min(width, maxVal);
			width = Math.max(width, 0);

			BG.Panel.$element.find('.panel-body .customize .width .slider').slider({
				min: 1,
				max: 100,
				value: width,
				range: 'max',
				slide: function (event, ui) {
					BG.Controls.addStyle($target, 'width', ui.value + '%');
				}
			}).siblings('.value').html(width);
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Width;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/global.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Global = {

		$element: null,

		name: 'global-options',

		tooltip: 'Global Options',

		priority: 95,

		iconClasses: 'fa fa-globe',

		selectors: ['html'],

		menuDropDown: {
			title: 'Global Options',
			options: [{
				'name': 'Color Palette',
				'class': 'action open-color-palette font-awesome fa-paint-brush'
			}, {
				'name': 'Delete All Content',
				'class': 'action delete-all-content font-awesome fa-trash'
			}]
		},

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Setup.
   *
   * @since 1.2.7
   */
		setup: function () {
			/*	BG.Menu.$element.find( '.bg-editor-menu-dropdown' )
   		.on( 'click', '.action.add-gridblock', self.addGridblock )
   		.on( 'click', '.action.add-row', self.addSection );*/
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Global.init();
	self = BOLDGRID.EDITOR.CONTROLS.Global;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/help.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Help = {

		name: 'help',

		tooltip: 'Help',

		priority: 99,

		iconClasses: 'fa fa-question',

		selectors: ['html'],

		menuDropDown: {
			title: 'Help',
			options: [{
				'name': 'Editing Guide',
				'class': 'action font-awesome fa-question support-center'
			}, {
				'name': 'Information',
				'class': 'action font-awesome fa-info bg-editor-information'
			}]
		},

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Bind all events.
   *
   * @since 1.6
   */
		setup: function () {
			BG.Menu.$element.find('.bg-editor-menu-dropdown').on('click', '.action.support-center', self.openSupportCenter).on('click', '.action.bg-editor-information', self.iconHelp);
		},

		/**
   * Go to the support center.
   *
   * @since 1.5
   */
		openSupportCenter: function () {
			window.open('https://www.boldgrid.com/support/editing-your-pages/wordpress-page-post-editor/?source=boldgrid-editor_drop-tab', '_blank');
		},

		/**
   * Open Icon control.
   *
   * @since 1.6
   */
		iconHelp: function () {
			BG.CONTROLS.Information.activate();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Help.init();
	self = BOLDGRID.EDITOR.CONTROLS.Help;
})();

/***/ }),

/***/ "./assets/js/builder/controls/hr.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Hr = {

		name: 'hr',

		tooltip: 'Horizontal Line',

		priority: 80,

		iconClasses: 'genericon genericon-minus',

		selectors: ['.bg-editor-hr-wrap'],

		componentPrefix: 'bg-hr',

		panel: {
			title: 'Horizontal Line',
			height: '550px',
			width: '275px',
			includeFooter: true,
			customizeLeaveCallback: true,
			customizeSupport: ['fontColor', 'width', 'margin', 'blockAlignment', 'customClasses'],
			customizeSupportOptions: {
				margin: {
					horizontal: false
				}
			},
			customizeCallback: true,
			preselectCallback: true,
			styleCallback: true
		},

		maxMyDesigns: 10,

		init: function () {
			BG.Controls.registerControl(this);

			self.myDesigns = [];
			self.userDesigns._format();
			self.template = wp.template('boldgrid-editor-hr');
		},

		/**
   * Override the get target method to return the hr inside the target instead of the target.
   *
   * @since 1.6
   *
   * @return {$} Hr element.
   */
		getTarget: function () {
			return self.$currentTarget;
		},

		/**
   * When the user clicks on the menu item, open panel.
   *
   * @since 1.6
   */
		onMenuClick: function () {
			var panel = BG.Panel;

			// Remove all content from the panel.
			self.$currentTarget = BOLDGRID.EDITOR.Menu.getTarget(self).find('hr:first');
			self.userDesigns._update();
			panel.clear();

			// Set markup for panel.
			panel.$element.find('.panel-body').html(self.template({
				text: 'Horizontal Rule',
				presets: BoldgridEditor.builder_config.component_library.hr.styles,
				myPresets: self.myDesigns
			}));

			panel.showFooter();

			// Open Panel.
			panel.open(self);
		},

		userDesigns: {

			/**
    * Append a sting of CSS classes to my designs.
    *
    * @since 1.6
    *
    * @param  {string} classes  Classes to be added to my designs.
    */
			append: function (classes) {
				var componentClasses = BG.Util.getComponentClasses(classes, self.componentPrefix).join(' ');

				// @TODO Check if these classes exist in any order.
				// @TODO Make sure that if the design is removed from use, it's not added to my designs.
				if (componentClasses && -1 === self.myDesigns.indexOf(componentClasses)) {
					self.myDesigns.push(componentClasses);
				}
			},

			/**
    * Format the user components data into a format the template needs.
    *
    * @since 1.6
    */
			_format: function () {
				var builderConfig = BoldgridEditor.builder_config;

				_.each(builderConfig.components_used.hr.slice(0, self.maxMyDesigns), function (design) {
					self.userDesigns.append(design.classes);
				});
			},

			/**
    * Update My Designs with any designs added by the user.
    *
    * @since 1.6
    */
			_update: function () {
				if (self.myDesigns.length >= self.maxMyDesigns) {
					return;
				}

				BG.Controls.$container.$body.find('hr').each(function () {
					self.userDesigns.append($(this).attr('class'));
				});
			}
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Hr;
	BOLDGRID.EDITOR.CONTROLS.Hr.init();
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/icon.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Icon = {

		name: 'icon',

		priority: 80,

		tooltip: 'Icon Design',

		iconClasses: 'fa fa-cog',

		selectors: ['.fa'],

		/**
   * Panel Settings.
   *
   * @since 1.2.7
   */
		panel: {
			title: 'Change Icon',
			height: '500px',
			width: '335px',
			includeFooter: true,
			customizeLeaveCallback: true,
			customizeCallback: function () {
				self.openCustomizer();
			},
			customizeSupport: ['fontColor', 'fontSize', 'margin', 'rotate', 'customClasses'],
			customizeSupportOptions: {
				margin: {
					horMin: -30
				}
			}
		},

		template: wp.template('boldgrid-editor-icon'),

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Load the control. This is only run once.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupClosePanel();
			self._setupCustomizeLeave();
		},

		/**
   * When the user clicks on an icon automatically open the panel.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			self.openPanel();
		},

		/**
   * When a user leaves the customize section highlight the element.
   *
   * @since 1.2.7
   */
		_setupCustomizeLeave: function () {
			BG.Panel.$element.on('bg-customize-exit', function () {
				if (self.name === BG.Panel.currentControl.name) {
					self.highlightElement();
				}
			});
		},

		/**
   * When the user closes the Panel, unselect the current icon.
   *
   * @since 1.2.7
   */
		_setupClosePanel: function () {
			BG.Panel.$element.on('bg-panel-close', function () {
				if (BG.Panel.currentControl && self.name === BG.Panel.currentControl.name) {
					self.collapseSelection();
				}
			});
		},

		/**
   * Unselect current mce selection.
   *
   * @since 1.2.7
   */
		collapseSelection: function () {
			tinymce.activeEditor.execCommand('wp_link_cancel');
		},

		/**
   * Open customization mode.
   *
   * @since 1.2.7
   */
		openCustomizer: function () {
			var panel = BG.Panel;
			self.collapseSelection();
			panel.$element.find('.panel-body .customize').show();
			panel.$element.find('.presets').hide();
			panel.$element.trigger('bg-open-customization');
			panel.scrollTo(0);
			panel.hideFooter();
		},

		/**
   * Insert a new icon.
   *
   * @since 1.2.7
   */
		insertNew: function () {
			var $insertedIcon;

			send_to_editor('<i class="fa fa-cog bg-inserted-icon" aria-hidden="true"><span style="display:none;">&nbsp;</span></i>');
			$insertedIcon = BG.Controls.$container.find('.bg-inserted-icon').last();
			BG.Controls.$container.find('.bg-inserted-icon').removeClass('bg-inserted-icon');
			BG.Controls.$menu.targetData[self.name] = $insertedIcon;
			$insertedIcon.click();
		},

		/**
   * Setup clicking on a panel.
   *
   * @since 1.2.7
   */
		setupPanelClick: function () {
			var controls = BOLDGRID.EDITOR.Controls,
			    panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('click', '.icon-controls .panel-selection', function () {
				var $menu = controls.$menu,
				    $target = $menu.targetData[self.name],
				    $this = $(this);

				$target.removeClass(function (index, css) {
					return (css.match(/(^|\s)fa-\S+/g) || []).join(' ');
				});

				$target.addClass($this.find('i').attr('class'));
				panel.$element.find('.selected').removeClass('selected');
				$this.addClass('selected');
			});
		},

		/**
   * Highlight the icon and set the WordPress link option to popup.
   *
   * @since 1.2.7
   */
		highlightElement: function () {
			var $el = BG.Menu.getTarget(self);
			tinymce.activeEditor.selection.select($el[0]);
		},

		/**
   * When the user clicks on the menu item open the panel.
   *
   * @since 1.2.7
   */
		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * Open the panel, setting the content.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var $panel = BG.Panel.$element,
			    $menu = BG.Controls.$menu,
			    $target = $menu.targetData[self.name],
			    $selected;

			self.highlightElement();

			// Bind Panel Click.
			self.setupPanelClick();

			// Create Markup.
			$panel.find('.panel-body').html(self.template({
				presets: BoldgridEditor.icons
			}));

			// Remove Selections.
			$panel.find('.selected').removeClass('selected');

			// Add Selections.
			$selected = $panel.find('i[class="' + $target.attr('class') + '"]').closest('.panel-selection').addClass('selected');

			BOLDGRID.EDITOR.Panel.open(self);
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Icon.init();
	self = BOLDGRID.EDITOR.CONTROLS.Icon;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/image/change.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.IMAGE = BOLDGRID.EDITOR.CONTROLS.IMAGE || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Change = {

		name: 'image-change',

		tooltip: 'Change Image',

		priority: 85,

		iconClasses: 'genericon genericon-image',

		selectors: ['img'],

		init: function () {
			BG.Controls.registerControl(this);
		},

		/**
   * Open the media modal for replace image.
   *
   * @since 1.2.8
   */
		openModal: function () {
			var node = tinymce.activeEditor.selection.getNode();

			/*
    * Ensure the selected element is an image.
    * @todo: This is a temporary fix.
    */
			if (node && 'IMG' !== node.nodeName && 1 === node.childElementCount && 'IMG' === node.firstChild.nodeName) {
				tinymce.activeEditor.selection.select(node.firstChild);
			}

			// Mimic the click of the "Edit" button.
			tinymce.activeEditor.buttons.wp_img_edit.onclick();

			// Change the media modal to "Replace Image".
			wp.media.frame.setState('replace-image');

			// When the image is replaced, run crop.onReplace().
			wp.media.frame.state('replace-image').on('replace', function (imageData) {
				BG.CropInstance.onReplace(imageData);
			});
		},

		onMenuClick: function () {
			self.openModal();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Change.init();
	self = BOLDGRID.EDITOR.CONTROLS.IMAGE.Change;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/image/design.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.IMAGE = BOLDGRID.EDITOR.CONTROLS.IMAGE || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Design = {

		classes: BoldgridEditor.builder_config.image,

		name: 'image',

		tooltip: 'Image Design',

		priority: 80,

		iconClasses: 'fa fa-cog',

		selectors: ['img'],

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		panel: {
			title: 'Image Design',
			height: '500px',
			width: '280px',
			includeFooter: true,
			customizeCallback: true,
			customizeLeaveCallback: true,
			customizeSupport: ['margin', 'customClasses']
		},

		/**
   * When the user clicks on the menu item, open panel.
   *
   * @since 1.2.7
   */
		onMenuClick: function () {
			self.openPanel();
		},

		/**
   * When the user clicks on an image, if the panel is open, set panel content.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();
			}
		},

		/**
   * Bind Handlers.
   *
   * @since 1.2.7
   */
		setup: function () {
			self.validateComponentsUsed();
			self._setupPanelClick();
			self._setupCustomizeHandlers();
		},

		/**
   * Bind Event: When customization exits.
   *
   * @since 1.2.8
   */
		_setupCustomizeHandlers: function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('bg-customize-exit', function () {
				if (panel.currentControl === self) {
					BG.Panel.showFooter();
				}
			});
		},

		/**
   * Remove duplicates from the list of image components used.
   *
   * @since 1.2.7
   */
		validateComponentsUsed: function () {
			var config = BoldgridEditor.builder_config.components_used;

			$.each(config.image, function () {
				var $temp = $('<div>').attr('class', this.classes);
				self.removeImageClass($temp);
				this.classes = $temp.attr('class');
			});

			config.image = _.uniq(config.image, function (item) {
				return item.a;
			});
		},

		/**
   * Remove the wp-image class added to the image by WordPress.
   *
   * This is only done to temporary objects.
   *
   * @since 1.2.8
   * @param jQuery $el Element to manipulate.
   * @retrurn jQuery $el.
   */
		removeImageClass: function ($el) {
			$el.removeClass(function (index, css) {
				return (css.match(/(^|\s)wp-image-\S+/g) || []).join(' ');
			});

			return $el;
		},

		/**
   * Bind event: When a user clicks on selections in the panel.
   *
   * @since 1.2.7
   */
		_setupPanelClick: function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('click', '.image-design .panel-selection', function () {
				var $this = $(this),
				    preset = $this.data('preset'),
				    $target = BOLDGRID.EDITOR.Menu.getTarget(self);

				// Remove Classes.
				$target.removeClass(function (index, css) {
					return (css.match(/(^|\s)bg-img-\S+/g) || []).join(' ');
				});

				self.removeModClasses($target);
				$target.removeClass(function (index, css) {
					return (css.match(/(^|\s)img-\S+/g) || []).join(' ');
				});

				tinyMCE.activeEditor.selection.collapse(false);

				if ($this.hasClass('selected')) {
					panel.clearSelected();
				} else {
					panel.clearSelected();
					$target.addClass(preset);
					$this.addClass('selected');
				}
			});
		},

		/**
   * Remove image classes.
   *
   * @since 1.2.7
   * @param jQuery $target.
   */
		removeModClasses: function ($target) {
			$target.parent('[class^="mod-img"]').removeClass(function (index, css) {
				return (css.match(/(^|\s)mod-img-\S+/g) || []).join(' ');
			});
		},

		/**
   * Preselect image style that is currently being used.
   *
   * @since 1.2.7
   */
		preselectImage: function () {
			var $target = BG.Menu.getTarget(self),
			    imageClasses = $target.attr('class'),
			    bgImageClasses = [];

			imageClasses = imageClasses ? imageClasses.split(' ') : [];

			$.each(imageClasses, function () {
				if (this.indexOf('bg-img') === 0) {
					bgImageClasses.push(this);
				}
			});

			bgImageClasses = bgImageClasses.join(' ');

			if (bgImageClasses) {
				BG.Panel.$element.find('[data-preset="' + bgImageClasses + '"]:first').addClass('selected');
				return false;
			}
		},

		/**
   * Add images that exist on the page to list of used components. This will populate "My Designs".
   *
   * @since 1.2.7
   */
		_updateMyDesigns: function () {

			self.usedComponents = BoldgridEditor.builder_config.components_used.image.slice(0);

			BG.Controls.$container.$body.find('.bg-img').each(function () {
				var classes,
				    savedComponents,
				    savedIndex,
				    findIndex,
				    $this = $(this),
				    $clone = $this.clone().removeClass('bg-control-element');

				$clone = self.removeImageClass($clone);

				classes = $clone.attr('class');
				savedComponents = self.usedComponents;

				findIndex = function (item) {
					return item.classes === classes;
				};

				savedIndex = _.findIndex(savedComponents, findIndex);

				if (-1 === savedIndex) {
					savedComponents.push({
						style: $clone.attr('style'),
						classes: classes
					});
				}
			});
		},

		/**
   * Open the panel for this control.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var panel = BOLDGRID.EDITOR.Panel,
			    $target = BOLDGRID.EDITOR.Menu.getTarget(self),
			    template = wp.template('boldgrid-editor-image');

			self._updateMyDesigns();

			// Remove all content from the panel.
			panel.clear();

			// Set markup for panel.
			panel.$element.find('.panel-body').html(template({
				'src': $target.attr('src'),
				'presets': self.classes,
				'myPresets': self.usedComponents
			}));

			self.preselectImage();

			// Open Panel.
			panel.open(self);
		}

	};

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Design.init();
	self = BOLDGRID.EDITOR.CONTROLS.IMAGE.Design;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/image/filter.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.IMAGE = BOLDGRID.EDITOR.CONTROLS.IMAGE || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Filter = {

		name: 'image-filter',

		priority: 90,

		iconClasses: 'fa fa-magic',

		tooltip: 'Image Filter',

		/**
   * List of all Caman values.
   *
   * @since 1.2.7
   */
		sliderHistory: {},

		/**
   * Caman object use for previews.
   *
   * @since 1.2.7
   */
		preview: null,

		presetIntensity: '50%',

		/**
   * Properties for a panel.
   *
   * @since 1.2.7
   */
		panel: {
			title: 'Image Filters',
			height: '536px',
			width: '800px',
			scrollTarget: '.presets ul',
			sizeOffset: -130
		},

		/**
   * Selectors that are eligble for image filters.
   *
   * @since 1.2.7
   */
		selectors: ['img'],

		/**
   * List of Presets.
   *
   * @since 1.2.7
   */
		presets: [{ name: 'none', title: 'None' }, { name: 'vintage', title: 'Vintage' }, { name: 'lomo', title: 'Lomo' }, { name: 'clarity', title: 'Clarity' }, { name: 'sinCity', title: 'Sin City' }, { name: 'sunrise', title: 'Sunrise' }, { name: 'crossProcess', title: 'Cross Process' }, { name: 'orangePeel', title: 'Orange Peel' }, { name: 'love', title: 'Love' }, { name: 'grungy', title: 'Grungy' }, { name: 'jarques', title: 'Jarques' }, { name: 'pinhole', title: 'Pinhole' }, { name: 'oldBoot', title: 'Old Boot' }, { name: 'glowingSun', title: 'Glowing Sun' }, { name: 'hazyDays', title: 'Hazy Days' }, { name: 'herMajesty', title: 'Her Majesty' }, { name: 'nostalgia', title: 'Nostalgia' }, { name: 'hemingway', title: 'Hemingway' }, { name: 'concentrate', title: 'Concentrate' }],

		/**
   * List of custom controls and their ranges.
   *
   * @since 1.2.7
   */
		customizeSettings: {
			'brightness': { title: 'Brightness', range: { min: -50, max: 50 } },
			'vibrance': { title: 'Vibrance', range: { min: -50, max: 50 } },
			'contrast': { title: 'Contrast', range: { min: -10, max: 10 } },
			'saturation': { title: 'Saturation', range: { min: -50, max: 50 } },
			'exposure': { title: 'Exposure', range: { min: -50, max: 50 } },
			'hue': { title: 'Hue', range: { min: 0, max: 100 } },
			'gamma': { title: 'Gamma', range: { min: 1, max: 4, val: 1 } },
			'clip': { title: 'Clip', range: { min: 0, max: 50 } },
			'stackBlur': { title: 'Blur', range: { min: 0, max: 30 } },
			'sepia': { title: 'Sepia', range: { min: 0, max: 100 } },
			'noise': { title: 'Noise', range: { min: 0, max: 50 } },
			'sharpen': { title: 'Sharpen', range: { min: 0, max: 50 } }
		},

		/**
   * Register this class as a control.
   *
   * @since 1.2.7
   */
		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Bind Handlers.
   *
   * @since 1.2.7
   */
		setup: function () {
			self._setupInsertClick();
			self._setupToggleCustomize();
			self._setupPanelClick();
		},

		/**
   * When the user toggles between the presets and custom options.
   *
   * @since 1.2.7
   */
		_setupToggleCustomize: function () {
			var preset,
			    panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('click', '.presets .activate-customize', function () {
				panel.$element.find('.choices').addClass('customizing');
				self.preview.revert();
				self.applySliderSettings();
			});

			panel.$element.on('click', '.customize .activate-presets', function () {
				panel.$element.find('.choices').removeClass('customizing');
				self.preview.revert();

				preset = panel.$element.find('.selected').data('preset');
				if (!preset || 'none' === preset) {
					panel.clearSelected();
					panel.$element.find('[data-preset="none"]').addClass('selected');
				} else {
					self.renderPreset(preset);
				}
			});
		},

		/**
   * Apply a preset to the current caman object.
   *
   * @since 1.2.7
   */
		renderPreset: function (preset) {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.addClass('rendering');
			self.preview.revert(false);
			self.preview[preset](self.presetIntensity).render(function () {
				panel.$element.removeClass('rendering');
			});
		},

		/**
   * When the user clicks on a selection within the panel. Select the element.
   *
   * @since 1.2.7
   */
		_setupPanelClick: function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on('click', '.image-filter .panel-selection', function () {
				var $this = $(this),
				    preset = $this.data('preset');

				if (panel.$element.hasClass('rendering')) {
					return false;
				}

				panel.clearSelected();
				$this.addClass('selected');

				if ('none' !== preset) {
					self.renderPreset(preset);
				} else {
					self.preview.revert();
				}
			});
		},

		/**
   * When the user clicks on the insert button, run insert image.
   *
   * @since 1.2.7
   */
		_setupInsertClick: function () {
			BOLDGRID.EDITOR.Panel.$element.on('click', '.preview .insert-image', function () {
				self.insertImage();
			});
		},

		/**
   * Create jQuery UI Sliders.
   *
   * @since 1.2.7
   */
		_setupSliders: function () {
			self.sliderHistory = {};

			BOLDGRID.EDITOR.Panel.$element.find('.slider').each(function () {
				var $this = $(this),
				    control = $this.data('control'),
				    range = self.customizeSettings[control].range;

				$this.slider({
					'min': range.min,
					'max': range.max,
					'value': range.val || 0,
					'change': function (e, ui) {
						self.sliderHistory[control] = ui.value;
						self.applySliderSettings();
					}
				});
			});
		},

		/**
   * Add slider settings.
   *
   * @since 1.2.7
   */
		applySliderSettings: function () {
			self.preview.revert(false);
			$.each(self.sliderHistory, function (control) {
				self.preview[control](this);
			});
			self.preview.render();
		},

		/**
   * Insert the image into the post.
   *
   * @since 1.2.7
   */
		insertImage: function () {
			var panel = BOLDGRID.EDITOR.Panel,
			    $target = BOLDGRID.EDITOR.Menu.getTarget(self);

			panel.$element.addClass('rendering');

			$.ajax({
				type: 'post',
				url: ajaxurl,
				dataType: 'json',
				data: {
					action: 'boldgrid_canvas_image',
					boldgrid_gridblock_image_ajax_nonce: BoldgridEditor.grid_block_nonce,
					attachement_id: $target.attachment_id,
					image_data: self.preview.canvas.toDataURL()
				},
				success: function (response) {
					if (response && response.success) {
						response = response.data;

						// Update image in editor.
						$target.removeClass('wp-image-' + $target.attachment_id);
						$target.addClass('wp-image-' + response.attachment_id);
						$target.attachment_id = response.attachment_id;
						$target.attr('src', response.url);
						$target.attr('data-mce-src', response.url);

						// Update list of images that exists on the page.
						BoldgridEditor.images = response.images;
					}
				}
			}).always(function () {
				panel.$element.removeClass('rendering');
			});
		},

		/**
   * When the user clicks on an image, if the panel is open, set panel content.
   *
   * @since 1.2.7
   */
		elementClick: function () {
			if (BOLDGRID.EDITOR.Panel.isOpenControl(this)) {
				self.openPanel();
			}
		},

		/**
   * Process all thumbnails on the panel.
   *
   * @since 1.2.7
   */
		_renderPanelThumbnails: function () {
			var process,
			    count = 1;

			process = function () {
				var selectionString = '[data-preset="' + self.presets[count].name + '"] img';
				if (!BG.Panel.$element.find(selectionString).length) {
					return;
				}

				Caman(selectionString, function () {
					this[self.presets[count].name]('50%').render(function () {
						count++;
						if (self.presets[count]) {
							process();
						}
					});
				});
			};

			process();
		},

		/**
   * Get the image src for the given target. Finding the thumbnail if available.
   *
   * @since 1.2.7
   */
		get_image_src: function () {
			var src,
			    $target = BOLDGRID.EDITOR.Menu.getTarget(self),
			    fullSrc = $target.attr('src');

			$.each(BoldgridEditor.images, function () {
				if ($target.hasClass('wp-image-' + this.attachment_id)) {
					$target.attachment_id = this.attachment_id;
					src = this.thumbnail;
					return false;
				}
			});

			if (!src) {
				src = fullSrc;
			}

			return {
				src: src,
				fullSrc: fullSrc
			};
		},

		/**
   * Open the panel for the given target.
   *
   * @since 1.2.7
   */
		openPanel: function () {
			var srcSet,
			    panel = BOLDGRID.EDITOR.Panel,
			    template = wp.template('boldgrid-editor-image-filter');

			// Remove all content from the panel.
			panel.clear();

			srcSet = this.get_image_src();

			// Set markup for panel.
			panel.$element.removeClass('rendering');
			panel.$element.find('.panel-body').html(template({
				'fullSrc': srcSet.fullSrc,
				'src': srcSet.src,
				'presets': self.presets,
				'customizeSettings': self.customizeSettings
			}));

			// If this is a remote URL, Fail.
			if (!srcSet.fullSrc || Caman.IO.isURLRemote(srcSet.fullSrc)) {
				BG.Panel.$element.find('.panel-body .remote-image-error').addClass('error-active');
			} else {
				// Intialize Sliders.
				self._setupSliders();
				self._renderPanelThumbnails();

				// Initialize Preview Image.
				panel.$element.find('[data-preset="none"]').addClass('selected');
				self.preview = Caman(panel.$element.find('.preview img')[0]);
			}

			tinyMCE.activeEditor.selection.collapse(false);

			// Open Panel.
			panel.open(self);
			panel.centerPanel();
		},

		/**
   * When the user clicks on the menu.
   *
   * @since 1.2.7
   */
		onMenuClick: function () {
			self.openPanel();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.IMAGE.Filter.init();
	self = BOLDGRID.EDITOR.CONTROLS.IMAGE.Filter;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/information.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Information = {

		name: 'information',

		panel: {
			title: 'DropTab Information',
			height: '575px',
			width: '750px'
		},

		init: function () {
			BG.Controls.registerControl(this);
		},

		/**
   * Alias for Menu click.
   *
   * @since 1.6
   */
		activate: function () {
			self.onMenuClick();
		},

		setup: function () {
			self.templateHTML = wp.template('boldgrid-editor-information')();
		},

		/**
   * When the user clicks on the menu item, open panel.
   *
   * @since 1.6
   */
		onMenuClick: function () {
			var panel = BG.Panel;

			// Remove all content from the panel.
			panel.clear();

			// Set markup for panel.
			panel.$element.find('.panel-body').html(self.templateHTML);

			// Open Panel.
			panel.open(self);
			panel.centerPanel();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Information.init();
	self = BOLDGRID.EDITOR.CONTROLS.Information;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/media/edit.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.MEDIA = BOLDGRID.EDITOR.CONTROLS.MEDIA || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit = {

		name: 'edit-media',

		tooltip: 'Edit',

		priority: 85,

		iconClasses: 'dashicons dashicons-edit',

		selectors: ['[data-wpview-type="gallery"]', '[data-wpview-type="ninja_forms"]'],

		init: function () {
			BG.Controls.registerControl(this);
		},

		/**
   * Open the media modal for edit gallery & form.
   *
   * @since 1.2.9
   */
		openModal: function () {
			var target = BG.Menu.getTarget(self).get(0);

			if (target) {
				wp.mce.views.edit(tinymce.activeEditor, target);
			}
		},

		onMenuClick: function () {
			self.openModal();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit.init();
	self = BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/media/map.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.MEDIA = BOLDGRID.EDITOR.CONTROLS.MEDIA || {};

(function () {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Map = {

		name: 'edit-maps',

		tooltip: 'Edit Map',

		priority: 85,

		iconClasses: 'dashicons dashicons-edit',

		selectors: ['.boldgrid-google-maps'],

		init: function () {
			BOLDGRID.EDITOR.Controls.registerControl(this);
		},

		/**
   * Open the media modal for maps.
   *
   * @since 1.3
   */
		openModal: function () {
			wp.media.editor.open();
			wp.media.frame.setState('iframe:google_map');
			self.setContent();
		},

		/**
   * Set the tinymce content variable to make sure, when replacing the map works.
   *
   * @since 1.4.0.1
   */
		setContent: function () {
			var $target = BG.Menu.getTarget(this);

			if (BG.Controls.$container.find($target).length) {
				tinymce.activeEditor.selection.select($target[0]);
			}
		},

		onMenuClick: function () {
			self.openModal();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Map.init();
	self = BOLDGRID.EDITOR.CONTROLS.MEDIA.Map;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/controls/section.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Section = {

		$container: null,

		$popover: null,

		$currentSection: [],

		zoomSliderSettings: {
			min: 1,
			max: 6,
			defaultVal: 3
		},

		/**
   * Init section controls.
   *
   * @since 1.2.7.
   */
		init: function ($container) {
			self.renderZoomTools();
			self.$container = $container;
			self.createHandles();
			self.bindHandlers();
		},

		/**
   * Hide the section handles.
   *
   * @since 1.2.7
   * @param Event e.
   */
		hideHandles: function (e) {

			if (e && e.relatedTarget && $(e.relatedTarget).closest('.section-popover-imhwpb').length) {
				return;
			}

			self.removeBorder();

			self.$popover.find('.popover-menu-imhwpb').addClass('hidden');
			self.$popover.hide();
		},

		/**
   * Remove section poppover target border.
   *
   * @since 1.2.8
   */
		removeBorder: function () {
			if (self.$currentSection && self.$currentSection.length) {
				self.$currentSection.removeClass('boldgrid-section-hover');
			}
		},

		/**
   * Render handles and attach them to the dom.
   *
   * @since 1.2.7
   */
		createHandles: function () {

			self.$popover = $(wp.template('boldgrid-editor-drag-handle')());

			self.$popover.css({
				'position': 'fixed'
			});

			self.$container.find('body').after(self.$popover);

			self.hideHandles();
		},

		/**
   * When the section menu is too close to the top, point it down.
   *
   * @since 1.2.8
   * @param Event e.
   */
		menuDirection: function (e) {
			var pos = e.screenY - window.screenY,
			    menuHeight = 340,
			    staticMenuPos = BG.Menu.$mceContainer[0].getBoundingClientRect();

			if (pos - staticMenuPos.bottom < menuHeight) {
				self.$popover.find('.popover-menu-imhwpb').addClass('menu-down');
			} else {
				self.$popover.find('.popover-menu-imhwpb').removeClass('menu-down');
			}
		},

		/**
   * Bind all events.
   *
   * @since 1.2.7
   */
		bindHandlers: function () {

			var $zoomControls = $('.bg-zoom-controls'),
			    $zoomIn = $zoomControls.find('.zoom-in'),
			    $zoomOut = $zoomControls.find('.zoom-out'),
			    stopPropagation = function (e) {
				e.stopPropagation();
			};

			self.$container.on('mouseenter', 'html:not(.dragging-section) body > .boldgrid-section', self.positionHandles);
			self.$container.on('mouseleave', 'html:not(.dragging-section) body > .boldgrid-section', self.hideHandles);
			self.$popover.on('click', '[data-action]', self.hideHandles);
			self.$popover.on('click', '[data-action="delete"]', self.deleteSection);
			self.$popover.on('click', '[data-action="duplicate"]', self.clone);
			self.$popover.on('click', '[data-action="section-width"]', self.sectionWidth);
			self.$popover.on('click', '[data-action="move-up"]', self.moveUp);
			self.$popover.on('click', '[data-action="move-down"]', self.moveDown);
			self.$popover.on('click', '[data-action="background"]', self.background);
			self.$popover.on('click', '[data-action="add-new"]', self.addNewSection);
			self.$popover.on('click', '[data-action]', stopPropagation);
			self.$popover.on('click', '.move-sections', self.enableSectionDrag);
			self.$popover.on('click', '.context-menu-imhwpb', self.menuDirection);
			self.$container.on('boldgrid_modify_content', self.positionHandles);
			self.$container.on('mouseleave', self.hideHandles);
			self.$container.on('end_typing_boldgrid.draggable', self.positionHandles);
			$('.exit-row-dragging, .bg-close-zoom-view').on('click', self.exitSectionDrag);
			$zoomIn.on('click', self.zoom.zoomIn);
			$zoomOut.on('click', self.zoom.zoomOut);
			$(window).on('resize', self.updateHtmlSize);
		},

		/**
   * Match the height of the HTML area and the body area.
   *
   * @since 1.2.7
   */
		updateHtmlSize: function () {
			var rect, bodyHeight;

			if (!$('body').hasClass('boldgrid-zoomout')) {
				return;
			}

			if ('Firefox' === BG.Controls.browser) {
				if (self.$container.$body.find('.wpview').length) {
					return;
				}
			}

			rect = self.$container.$body[0].getBoundingClientRect(), bodyHeight = rect.bottom - rect.top + 50;

			self.$container.find('html').css('max-height', bodyHeight);
			$('#content_ifr').css('max-height', bodyHeight);
		},

		zoom: {
			change: function (change) {
				var val = parseInt(self.$slider.slider('value'));
				self.$slider.slider('value', change(val)).trigger('change');
			},
			zoomIn: function () {
				self.zoom.change(function (val) {
					return val + 1;
				});
			},
			zoomOut: function () {
				self.zoom.change(function (val) {
					return val - 1;
				});
			}
		},

		/**
   * Render the controls for the zoomed view.
   *
   * @since 1.2.7
   */
		renderZoomTools: function () {
			var template = wp.template('boldgrid-editor-zoom-tools');
			$('#wp-content-editor-tools').append(template());
		},

		/**
   * Exit section dragging mode.
   *
   * @since 1.2.7
   */
		exitSectionDrag: function (e) {
			var $body = $('body'),
			    $window = $(window),
			    $frameHtml = self.$container.find('html');

			e.preventDefault();
			self.$container.validate_markup();
			self.$container.$body.find('.loading-gridblock').remove();
			self.sectionDragEnabled = false;
			$body.removeClass('focus-on boldgrid-zoomout');
			$window.trigger('resize');
			$frameHtml.removeClass('zoomout dragging-section');
			self.$container.$body.attr('contenteditable', 'true');
			BG.Controls.$menu.hide();
			self.$container.$body.css('transform', '');
			$frameHtml.css('max-height', '');
			$('#content_ifr').css('max-height', '');

			$('html, body').animate({
				scrollTop: $('#postdivrich').offset().top
			}, 0);
		},

		/**
   * Check if the user can use zoomout view..
   *
   * @since 1.4
   */
		zoomDisabled: function () {
			if (IMHWPB.WP_MCE_Draggable.instance && IMHWPB.WP_MCE_Draggable.instance.draggable_inactive) {
				alert('Add GridBlock requires that BoldGrid Editing be enabled on this page. You can enable it by clicking the move icon ☩ on your editor toolbar.');
				return true;
			}
		},

		/**
   * Enable section dragging mode.
   *
   * @since 1.2.7
   */
		enableSectionDrag: function () {
			var updateZoom;

			if (self.zoomDisabled()) {
				return;
			}

			$.fourpan.dismiss();
			self.sectionDragEnabled = true;
			self.$container.find('html').addClass('zoomout dragging-section');
			self.$container.$body.removeAttr('contenteditable');
			self.$slider = $('.bg-zoom-controls .slider');
			BG.Controls.$menu.addClass('section-dragging');

			$('body').addClass('focus-on boldgrid-zoomout').find('#wpadminbar').addClass('focus-off');

			$(window).trigger('resize').scrollTop(0);
			self.updateHtmlSize();
			BOLDGRID.EDITOR.GRIDBLOCK.Loader.firstOpen();
			BG.GRIDBLOCK.View.$gridblockSection.trigger('scroll');

			updateZoom = function (val) {
				self.removeZoomClasses();
				self.$container.$body.addClass('zoom-scale-' + val);
				self.updateHtmlSize();
			};

			self.$slider.slider({
				min: self.zoomSliderSettings.min,
				max: self.zoomSliderSettings.max,
				value: self.zoomSliderSettings.defaultVal,
				orientation: 'vertical',
				range: 'max',
				change: function (event, ui) {
					updateZoom(ui.value);
				},
				slide: function (event, ui) {
					updateZoom(ui.value);
				}
			});
		},

		/**
   * Remove zoom classes from the body.
   *
   * @since 1.2.7
   */
		removeZoomClasses: function () {
			self.$container.$body.removeClass(function (index, css) {
				return (css.match(/(^|\s)zoom-scale-\S+/g) || []).join(' ');
			});
		},

		/**
   * Position the section popovers.
   *
   * @since 1.2.7
   */
		positionHandles: function () {
			var pos, $this;

			if (this.getBoundingClientRect) {
				$this = $(this);
			} else {
				$this = self.$currentSection;
			}

			if (!$this || !$this.length || false === $this.is(':visible')) {
				self.$popover.hide();
				return;
			}

			self.removeBorder();

			pos = $this[0].getBoundingClientRect();

			if (self.currentlyDragging) {
				return false;
			}

			self.$popover.find('.popover-menu-imhwpb').addClass('hidden');

			// Save the current row.
			self.$currentSection = $this;

			self.$popover.css({
				'top': pos.bottom + 35,
				'left': 'calc(50% - 38px)',
				'transform': 'translateX(-50%)'
			});

			self.$currentSection.addClass('boldgrid-section-hover');

			if (this.getBoundingClientRect) {
				self.$popover.show();
			}
		},

		/**
   * Add New section under current section.
   *
   * @since 1.2.7
   */
		addNewSection: function () {
			var $newSection = $(wp.template('boldgrid-editor-empty-section')());
			self.$currentSection.after($newSection);
			self.transistionSection($newSection);
		},

		/**
   * Fade the color of a section from grey to transparent.
   *
   * @since 1.2.7
   * @param jQuery $newSection.
   */
		transistionSection: function ($newSection) {
			IMHWPB.tinymce_undo_disabled = true;
			$newSection.animate({
				'background-color': 'transparent'
			}, 1500, 'swing', function () {
				BG.Controls.addStyle($newSection, 'background-color', '');
				IMHWPB.tinymce_undo_disabled = false;
				tinymce.activeEditor.undoManager.add();
			});
		},

		/**
   * Delete a section.
   *
   * @since 1.2.7
   */
		deleteSection: function () {
			self.$currentSection.remove();
			self.$container.trigger(self.$container.delete_event);
		},

		/**
   * Clone a section.
   *
   * @since 1.2.7
   */
		clone: function () {
			self.$currentSection.after(self.$currentSection.clone());
			self.$container.trigger(self.$container.delete_event);
		},

		/**
   * Move the section up one in the DOM.
   *
   * @since 1.2.7
   */
		moveUp: function () {
			var $prev = self.$currentSection.prev();

			if ($prev.length) {
				$prev.before(self.$currentSection);
			}
			self.$container.trigger(self.$container.delete_event);
		},

		/**
   * Move the section down one in the DOM.
   *
   * @since 1.2.7
   */
		moveDown: function () {
			var $next = self.$currentSection.next();

			if ($next.length) {
				$next.after(self.$currentSection);
			}

			self.$container.trigger(self.$container.delete_event);
		},

		background: function () {
			self.$currentSection.click();
			BOLDGRID.EDITOR.CONTROLS.Background.openPanel();
		},

		/**
   * Control whether a container is fluid or not.
   *
   * @since 1.2.7
   */
		sectionWidth: function () {
			BG.CONTROLS.Container.toggleSectionWidth(self.$currentSection.find('.container, .container-fluid'));
			self.$container.trigger(self.$container.delete_event);
		}

	};

	self = BOLDGRID.EDITOR.CONTROLS.Section;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/drag.js":
/***/ (function(module, exports) {

jQuery.fn.IMHWPB_Draggable = function (settings, $) {
	var self = this,
	    BG = BOLDGRID.EDITOR,
	    most_recent_enter = [];

	self.ie_version = null;
	self.isSafari = null;

	/**
  * The jQuery object that the user indicated was draggable.
  */
	self.$master_container = this;

	// Some Jquery Selectors to be reused.
	self.$window = $(window);
	self.$body = self.$master_container.find('body');
	self.$html = self.$master_container.find('html');
	self.$validatedInput = $('input[name="boldgrid-in-page-containers"]');
	self.resizeOverlay = wp.template('boldgrid-editor-mce-tools')();
	self.$master_container.find('html').append(self.resizeOverlay);
	self.original_selector_strings = {};

	self.scrollInterval = false;

	// Tinymce element used for auto scrolling.
	self.$mce_32 = $('#' + tinymce.activeEditor.theme.panel._items[0]._id);

	self.$post_status_info = $('#post-status-info');

	/** Popover Menu Items to be added. **/
	var additional_menu_items = settings.menu_items || [];

	/** Testing and debug flag that prevents popovers from being removed. Useful for testing placements. **/
	this.popover_placement_testing = settings.popover_placement_testing || false;

	/** How long should we wait before removing or displaying a new popover. **/
	this.hover_timout = settings.hover_timout || 175;

	/** Should popovers be removed while the user is typing. **/
	this.type_popover_removal = settings.type_popover_removal || true;

	/**
  * The interaction container refers to the wrapper that holds all the draggable items.
  */
	this.$interaction_container = null;

	// BoldGrid menu item clicked.
	this.$boldgrid_menu_action_clicked = null;

	// Last occurrence of an auto scroll.
	this.last_auto_scroll_event = null;

	// Is the user editing anested row.
	this.editting_as_row = false;

	// These Setting is used to manage the states of the visible popovers.
	this.hover_elements = {
		'content': {
			add_element: null
		},
		'column': {
			add_element: null
		},
		'row': {
			add_element: null
		}
	};

	/**
  * These color alias' help to make sure that the text and background color have enough contrast.
  */
	this.color_alias = {
		'white': ['rgb(255, 255, 255)', 'white'],
		'transparent': ['rgba(0, 0, 0, 0)', 'transparent']
	};

	// This.master_container_id = '#' + .uniqueId().attr('id');
	this.master_container_id = ''; // Temp because document cant have ID.

	/**
  * Event that indicates that dragging has finished and started.
  */
	this.resize_finish_event = $.Event('resize_done_dwpb');
	this.resize_start_event = $.Event('resize_start_dwpb');
	this.boldgrid_modify_event = $.Event('boldgrid_modify_content');

	/** Event fire once row has been added. **/
	this.add_row_event = $.Event('add_row_event_dwpb');

	/** Triggered once an element is deleted. **/
	this.delete_event = $.Event('delete_dwpb');

	/** Triggered once an elements contents are cleared. **/
	this.clear_event = $.Event('clear_dwpb');

	/**
  * An event that indicates that a column has been added.
  */
	this.add_column_event = $.Event('add_column_dwpb');

	/**
  * An event that indicates the dragging has started.
  */
	this.drag_start_event = $.Event('drag_start_dwpb');

	/**
  * An event that indicates the dragging has started.
  */
	this.boldgrid_edit_row = $.Event('boldgrid_edit_row');

	/**
  * A Boolean indicating whether or not we have disbabled popovers.
  */
	this.popovers_disabled = false;

	/**
  * How many pixels of the right side border before we cause the row to stack.
  */
	this.right_resize_buffer = 10;

	/**
  * A boolean indication to ensure that every dragstart has a drag finish and
  * or drag drop A big that frequently occurs in internet explorer.
  */
	this.drag_end_event = $.Event('drag_end_dwpb');

	/**
  * Has the user recently clicked on nesting a row.
  */
	this.nest_row = false;

	/**
  * A booleaan that helps us force drag drop event on safarii and ie.
  */
	this.drag_drop_triggered = false;

	/**
  * A boolean flag passed in to allow console.log's.
  */
	this.debug = settings.debug;

	/**
  * A string that represents all draggable selectors.
  */
	this.draggable_selectors_string = null;

	/**
  * A string that represents all row selectors.
  */
	this.row_selectors_string = null;

	/**
  * A string of the formated content selectors.
  */
	this.content_selectors_string = null;

	/**
  * The selectors that represent draggable columns Essentially all columns
  * that are not within a nested row.
  */
	this.column_selectors_string = null;

	/**
  * The class name used for dragging selectors.
  */
	this.dragging_selector_class_name = 'dragging-imhwpb';

	/**
  * The dragging class as a $ selector.
  */
	this.dragging_selector = '.' + this.dragging_selector_class_name;

	/**
  * The currently dragged object is stored here. When starts dragging this
  * element is hidden. When the user finishes the drag, this element is
  * removed().
  */
	this.$current_drag = null;

	/**
  * Boolean Whether or not the user is currently in the resizing process.
  */
	this.resize = false;

	/**
  * Boolean Has the user clicked on an item that is draggable.
  */
	this.valid_drag = null;

	/**
  * The buffer in pixels of how close the user needs to be to a border in
  * order to activate the drag handle.
  */
	this.border_hover_buffer = 15;

	/**
  * How far the user can be from the resize position before it automatically
  * snaps to that location.
  */
	this.resize_buffer = 0.0213;

	/**
  * The maximum number of columns that can be in a row.
  */
	this.max_row_size = 12;

	/**
  * The most recently added added element to a row.
  */
	this.$most_recent_row_enter_add = null;

	/**
  * Current Window Width.
  */
	this.window_width = null;

	/**
  * Current window height.
  */
	this.window_height = null;

	/**
  * The current column class being used by bootstrap in relation to the
  * current size of the screen.
  */
	this.active_resize_class = null;

	/**
  * Temporarily transformed row that must be changed back.
  */
	this.restore_row = null;

	/**
  * When an element is dragged it creates a new object, hides the old object
  * and saves the new object to this variable. That object is deleted
  * whenever the user drags onwards.
  */
	this.$temp_insertion = null;

	/**
  * This element is created for the drag image and then deleted when dragging is complete.
  */
	this.$cloned_drag_image = null;

	/**
  * Default selectors for rows.
  */
	this.row_selector = settings.row_selector || ['.row:not(' + self.master_container_id + ' .row .row)'];

	/**
  * Add media event handler.
  */
	this.add_media_event_handler = settings.add_media_event_handler || function () {};

	/**
  * Insert layout.
  */
	this.insert_layout_event_handler = settings.insert_layout_event_handler || function () {};

	/**
  * An array of the column selectors.
  */
	this.general_column_selectors = settings.general_column_selectors || ['[class*="col-xs"]', '[class*="col-sm"]', '[class*="col-md"]', '[class*="col-lg"]'];
	/**
  * Nested row selector.
  */
	this.nested_row_selector_string = '.row .row:not(.row .row .row)';

	/**
  * Nested row selector.
  */
	this.sectionSelectorString = '.boldgrid-section';

	/**
  * These are the selectors that are defined as content elements.
  * @todo Use this array to create content_selectors & nested_mode_content_selectors.
  */
	this.general_content_selectors = [
	// General Content Selectors.
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'a:not(p a)', 'img:not(p img):not(a img)', 'p', 'button:not(p button):not(a button)', 'ul', 'ol', 'dl', 'form', 'table', '.row .row', '[data-imhwpb-draggable="true"]', '.wpview-wrap', '.wpview', 'blockquote', 'code', 'abbr'];

	/**
  * A string containing the eligible content selectors A "content element" is
  * an element that can.. - be placed into a column - be placed outside of a
  * row - be sorted in a container Initialized at page load.
  */
	this.content_selectors = settings.content_selectors || [

	// Headings.
	'h1:not(' + self.master_container_id + ' .row .row h1)', 'h2:not(' + self.master_container_id + ' .row .row h2)', 'h3:not(' + self.master_container_id + ' .row .row h3)', 'h4:not(' + self.master_container_id + ' .row .row h4)', 'h5:not(' + self.master_container_id + ' .row .row h5)', 'h6:not(' + self.master_container_id + ' .row .row h6)', 'h7:not(' + self.master_container_id + ' .row .row h7)', 'a:not(' + self.master_container_id + '.row .row a):not(p a)',

	// Common Drag Content.
	/*******************************************************************
  * Specifying that nested content is not draggable, is not
  * necessary, but improves performance I've defined common cases so
  * that the selector is not made any larger than it already is
  ******************************************************************/
	'img:not(' + self.master_container_id + ' .row .row img):not(p img):not(a img)', 'p:not(' + self.master_container_id + ' .row .row p)', 'button:not(' + self.master_container_id + ' .row .row button):not(p button):not(a button)',

	// Lists.
	'ul:not(' + self.master_container_id + ' .row .row ul):not(.draggable-tools-imhwpb ul)', 'ol:not(' + self.master_container_id + ' .row .row ol)', 'dl:not(' + self.master_container_id + ' .row .row dl)',

	// Additional Content.
	'form:not(' + self.master_container_id + ' .row .row form)', 'table:not(' + self.master_container_id + ' .row .row table)',

	// Nested Rows - Not rows nested out of master container.
	'.row .row:not(:not(' + self.master_container_id + ' .row .row))',

	// Custom definitions.
	'[data-imhwpb-draggable="true"]:not(' + self.master_container_id + ' .row .row [data-imhwpb-draggable="true"])',

	// WP specific wrapper.
	'.wpview-wrap:not(' + self.master_container_id + ' .row .row .wpview-wrap)', '.wpview:not(' + self.master_container_id + ' .row .row .wpview)', 'blockquote:not(.row .row blockquote)', 'code:not(.row .row code)', 'abbr:not(.row .row abbr)'];

	/**
  * A string containing the eligible content selectors A "content element" is
  * an element that can.. - be placed into a column - be placed outside of a
  * row - be sorted in a container Initialized at page load.
  */
	var nested_mode_content_selectors = [

	// Headings.
	'.row .row h1', '.row .row h2', '.row .row h3', '.row .row h4', '.row .row h5', '.row .row h6', '.row .row h7', '.row .row a',

	// Common Drag Content.
	'.row .row img:not(p img):not(a img)', '.row .row p', '.row .row button:not(p button):not(a button)',

	// Lists.
	'.row .row ul', '.row .row ol', '.row .row dl',

	// Additional Content.
	'.row .row form', '.row .row table',

	// Nested Rows - Not rows nested out of master container.
	'.row .row .row',

	// Custom definitions.
	'.row .row [data-imhwpb-draggable="true"]',

	// WP specific wrapper.
	'.row .row .wpview-wrap', '.row .row .wpview', '.row .row code', '.row .row blockquote', '.row .row abbr'];

	/**
  * These are the selectors that will interact with a row when dragging it.
  */
	var immediate_row_siblings = ['> h1', '> h2', '> h3', '> h4', '> h5', '> h6', '> h7', '> a', '> img', '> p', '> button', '> ul', '> ol', '> dl', '> form', '> table', '> .row', '> dl', '> form', '> table', '.row:not(.row .row)', '> [data-imhwpb-draggable="true"]', '> .wpview-wrap', '> .wpview', '> code', '> blockquote', '> abbr'];

	/**
  * An outline of the sizes (Percentage) that corresponds to a column class.
  *
  * For example a col-2 should be .167% of the row size.
  */
	this.column_sizes = {
		'0': 0,
		'1': 0.083,
		'2': 0.167,
		'3': 0.25,
		'4': 0.333,
		'5': 0.416,
		'6': 0.5,
		'7': 0.583,
		'8': 0.667,
		'9': 0.75,
		'10': 0.833,
		'11': 0.917,
		'12': 1,
		'13': 1.083
	};

	/**
  * When dragging content, should we use the browsers image or actually move
  * the element Actually moving the element is more resource intensive but is
  * more aesthetically pleasing Available Options - browserImage - actual.
  */
	this.dragImageSetting = settings.dragImage || 'browserImage';

	/**
  * The drag type determines chooses between two drag methods Default -
  * dragEnter. Drag enter will append/insert before when you drag into an
  * element. Option 1 - proximity. Calculations are done every time the user
  * moves their mouse (while dragging). The benefit if this that their mouse
  * does not need to be in the drag destination to be placed their -
  * dragEnter - proximity.
  */
	this.dragTypeSetting = settings.dragType || 'dragEnter';

	/**
  * Scenarios that outline how a specific layout should transform into another.
  */
	this.layout_translation = {
		'[12]': {
			'12': '6', // All 12's should become this size.
			'new': '6' // The new column should become this size.
		},
		'[6,6]': {
			'6': '4',
			'new': '4'
		},
		'[4,4,4]': {
			'4': '3',
			'new': '3'
		},
		// These transforms depend on a current column being passed in.
		// It's used in cases of duplication only.
		'[3,3,3,3]': {
			'current': '3', // If the column that is being duplicated is a 3.
			'current_transform': '2', // Change the duplicated column to a 2.
			'new': '2', // Add a new column that is also a 2.

			// This array indicates how many additional items need to be transformed.
			// And what their previous values should be and what their new values should be.
			'additional_transform': [
			// In this example, change 1, col-3 to a col-2.
			{
				'count': '1',
				'from': '3',
				'to': '2'
			}]
		},
		'[6,3,3]': {
			'current': '3',
			'current_transform': '2',
			'new': '2',
			'additional_transform': [{
				'count': '1',
				'from': '3',
				'to': '2'
			}]
		}
	};

	/**
  * A list of the menu items that are added by default.
  */
	var native_menu_options = ['duplicate', 'add-row', 'add-column', 'nest-row', 'clear', 'delete', 'clone-as-row', 'align-top', 'align-bottom', 'align-default', 'align-center'];

	/**
  * The options needed for the popover drop downs The key is the value is the
  * display name.
  */
	var menu_options = {
		'column': {
			'': 'Edit Column',
			'duplicate': 'Clone',
			'delete': 'Delete',
			'clear': 'Clear Contents',
			'add-media': 'Insert Media',
			'vertical-alignment': {
				'title': 'Vertical Alignment',
				'options': {
					'align-default': 'Default',
					'align-top': 'Top',
					'align-center': 'Center',
					'align-bottom': 'Bottom'
				}
			},
			'Box': 'Background'
		},
		'row': {
			'': 'Edit Row',
			'duplicate': 'Clone',
			'delete': 'Delete',
			'clear': 'Clear Contents',
			'insert-layout': 'Insert GridBlock',
			'add-column': 'Add Column',
			'add-row': 'Add Empty Row',
			'nest-row': ''
		},
		'content': {
			'': 'Edit Content',
			'duplicate': 'Clone',
			'delete': 'Delete',
			'Font': 'Font'
		},
		'nested-row': {
			'': 'Edit Content',
			'duplicate': 'Clone',
			'delete': 'Delete',
			'clone-as-row': 'Clone as Row'
		}
	};

	/**
  * The classes that are added to a popover depending on the type of the element.
  */
	this.type_popover_classes = {
		'content': 'content-popover-imhwpb left-popover-imhwpb',
		'nested-row': 'content-popover-imhwpb nested-row-popover-imhwpb left-popover-imhwpb',
		'row': 'row-popover-imhwpb right-popover-imhwpb',
		'column': 'top-popover-imhwpb column-popover-imhwpb'
	};

	this.capitalizeFirstLetter = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	/**
  * Markup needed to display a popover.
  */
	this.toolkit_markup = function (type) {
		var tooltipTitle = self.capitalizeFirstLetter(type);

		var popover = '<div spellcheck="false" data-mce-bogus="all" contenteditable="false"' + 'unselectable="on" class="draggable-tools-imhwpb">' + '<span class="popover-imhwpb ' + self.type_popover_classes[type] + '">' + '<div title="Drag ' + tooltipTitle + '" contenteditable="false" draggable="true" class="no-select-imhwpb drag-handle-imhwpb draggable-button"> ' + '<span  class="genericon genericon-move" aria-hidden="true"> </span>' + '</div>';

		popover += '<div class=\'popover-menu-imhwpb hidden\'><ul>';
		$.each(menu_options[type], function (key, value) {
			var draggable = '';
			if (key == 'nest-row') {
				draggable = 'draggable="true"';
			}
			if (typeof value === 'object') {
				popover += '<li class=\'no-select-imhwpb action-list side-menu-parent\' data-action=\'' + key + '\'>' + value.title + '</li>';
				popover += '<div class=\'side-menu\'>';
				popover += '<ul>';
				$.each(value.options, function (key, value) {
					popover += '<li class=\'no-select-imhwpb action-list\' data-action=\'' + key + '\'>' + value + '</li>';
				});
				popover += '</ul>';
				popover += '</div>';
			} else {
				popover += '<li class=\'no-select-imhwpb action-list\' ' + draggable + ' data-action=\'' + key + '\'>' + value + '</li>';
			}
		});

		popover += '</ul></div>';

		popover += '<div title="Edit ' + tooltipTitle + '" class="context-menu-imhwpb draggable-button"> ' + '<span  class="genericon genericon-menu" aria-hidden="true"></span>' + '</div>';

		if ('nested-row' === type) {
			popover += '<div title="Edit As Row" class="edit-as-row draggable-button">' + '<span class="genericon genericon-expand"  aria-hidden="true"></span></div>';
		}

		return popover + '</span></div>';
	};

	/**
  * Initialization Process.
  */
	this.init = function () {
		self.$interaction_container = self.determine_interaction_container();

		// Init fourpan.
		self.$master_container.fourpan({
			element_padding: 0,
			transition_speed: 0,
			activate: activate_edit_as_row,
			deactivate: disable_edit_as_row
		});

		self.ie_version = self.get_ie_version();
		self.isSafari = self.checkIsSafari();
		self.create_selector_strings();
		save_original_selector_strings();
		self.bind_events();
		self.setup_additional_plugins();
		self.validate_markup();
		self.track_window_size();
		self.merge_additional_menu_options();
		addContainerData();

		BG.RESIZE.Row.init(self.$master_container);
		BG.Controls.init(self.$master_container);
		BG.DRAG.Section.init(self.$master_container);

		return self;
	};

	addContainerData = function () {
		if (!BoldgridEditor.is_boldgrid_theme) {
			self.$master_container.find('html').addClass('non-bg-theme');
		}
	};

	/**
  * Store the original of the selector strings.
  *
  * If they get modified during the process of the editor processing,
  * These should be used for validation.
  */
	var save_original_selector_strings = function () {
		self.original_selector_strings = {
			general_content_selector_string: self.general_content_selector_string,
			unformatted_content_selectors_string: self.unformatted_content_selectors_string,
			content_selectors_string: self.content_selectors_string,
			immediate_row_siblings_string: self.immediate_row_siblings_string,
			row_selectors_string: self.row_selectors_string,
			column_selectors_string: self.column_selectors_string,
			unformatted_column_selectors_string: self.unformatted_column_selectors_string,
			general_column_selectors_string: self.general_column_selectors_string,
			immediate_column_selectors_string: self.immediate_column_selectors_string,
			draggable_selectors_string: self.draggable_selectors_string
		};
	};

	/**
  * Create all selector strings from configuration arrays.
  */
	this.create_selector_strings = function () {
		// An unformatted string simply specifies that the elements to not have the :visible qualifier.
		/**
   * Content Selectors.
   */
		self.general_content_selector_string = self.general_content_selectors.join();
		self.unformatted_content_selectors_string = self.content_selectors.join();
		self.content_selectors_string = self.format_selectors(self.content_selectors).join();
		self.immediate_row_siblings_string = immediate_row_siblings.join();

		/**
   * Row Selectors.
   */
		self.row_selectors_string = self.row_selector.join();

		/**
   * Column Selectors.
   */
		// This should be the column selector string without the visible keyword but may not be working as intended.
		self.column_selectors_string = self.format_column_selectors(self.general_column_selectors, true).join();
		self.unformatted_column_selectors_string = self.column_selectors_string.replace(/:visible/, '');

		self.general_column_selectors_string = self.general_column_selectors.join();
		self.immediate_column_selectors_string = self.format_immediate_column_selectors(self.general_column_selectors).join();

		/**
   * Combination of all selectors.
   */
		self.draggable_selectors_string = self.format_draggable_selectors_string();
	};

	/**
  * Initialize the background colors of the window to facilitate editing.
  *
  * If being used within WP_TINYMCE this should really be done from the theme.
  */
	this.set_background_colors = function () {
		// On init set the background colors.
		var background_color = self.$body.css('background-color');

		// If the background color is transparent set the background color to white.
		if (self.color_is(background_color, 'transparent') || self.color_is(background_color, 'white')) {
			self.$body.css('background-color', 'white');

			// If the background color is white and the color of the text is white,
			// set the text to black.
			if (self.color_is(self.$body.css('color'), 'white')) {
				self.$body.css('color', 'black');
			}
		}
	};

	/**
  * Clean Up the markup and add any needed classes/wrappers.
  */
	this.validate_markup = function () {
		// If the theme is a BG theme w/ variable containers feature, or the theme is not BG theme.
		if (!BoldgridEditor.is_boldgrid_theme || BG.Controls.hasThemeFeature('variable-containers')) {
			BG.VALIDATION.Section.updateContent(self.$body);
			self.$validatedInput.attr('value', 1);
		}

		self.wrap_hr_tags();
		self.wrap_content_elements();
		self.add_redundant_classes();
		self.removeClasses(self.$master_container);
	};

	this.removeClasses = function ($container) {
		$container.find('.bg-control-element').removeClass('bg-control-element');
	};

	/**
  * Remove Classes that were added during drag.
  *
  * @since 1.1.1.3
  */
	this.failSafeCleanup = function () {
		self.$master_container.find('body .dragging-started-imhwpb').remove();
		self.$master_container.find('.cloned-div-imhwpb').removeClass('cloned-div-imhwpb');
	};

	/**
  * Wrap images and anchors in paragraph.
  *
  * This is done because tinyMCE frequently does this which causes irregularities
  * also by doing this, we make it easier to drag items.
  */
	this.wrap_content_elements = function () {
		// This needs to occur everytime something is added to page.
		self.$master_container.find('img, a').each(function () {
			// Find out its already draggable.
			var $this = $(this);

			if (!$this.parent().closest_context(self.original_selector_strings.content_selectors_string, self.$master_container).length) {
				// This HR is not already draggable.
				$this.wrap('<p class=\'mod-reset\'></p>');
			}
		});
	};

	/**
  * Wrap all hr tags in a draggable div This should be called everytime dom
  * content is inserted.
  */
	this.wrap_hr_tags = function () {
		// This needs to occur everytime something is added to page.
		self.$master_container.find('hr').each(function () {
			// Find out its already draggable.
			var $this = $(this);

			if (!$this.closest_context(self.original_selector_strings.content_selectors_string, self.$master_container).length) {
				var $closest_receptor = $this.closest_context(self.original_selector_strings.row_selectors_string + ', ' + self.original_selector_strings.general_column_selectors_string, self.$master_container);
				if ($closest_receptor.is(self.original_selector_strings.row_selectors_string)) {
					$this.wrap('<div class=\'col-md-12\'><div class=\'row bg-editor-hr-wrap\'><div class=\'col-md-12\'></div></div></div>');
				} else {
					// This HR is not already draggable.
					$this.wrap('<div class=\'row bg-editor-hr-wrap\'><div class=\'col-md-12\'></div></div>');
				}
			} else {
				$this.closest('.row').addClass('bg-editor-hr-wrap');
			}
		});
	};

	/**
  * Merge the menu items that have been added through configurations into the default settings.
  */
	this.merge_additional_menu_options = function () {
		$.each(additional_menu_items, function (key, menu_item) {
			var current_element_selection = menu_options[menu_item.element_type];
			var addition_item = {};
			addition_item[menu_item.title] = menu_item.title;
			$.extend(current_element_selection, addition_item);
		});
	};

	/**
  * Find the interaction conatiner.
  *
  * See the interaction conatiner definition above for an explination.
  */
	this.determine_interaction_container = function () {
		var $interaction_container = null;
		var $body = self.$master_container.find('body');
		if ($body.length) {
			$interaction_container = self.$master_container;
		} else {
			$interaction_container = self.$master_container.closest('html');
		}

		return $interaction_container;
	};

	/**
  * Bind all events.
  */
	this.bind_events = function () {
		// Bind Event Handlers to container.
		self.bind_drag_listeners();
		self.bind_container_events();
		self.bind_menu_items();
		self.bind_additional_menu_items();
		self.bind_edit_row();

		// This event should be bound to another mce event.
		setTimeout(function () {
			self.set_background_colors();
		}, 1000);
	};

	var disable_edit_as_row = function () {
		if (self.editting_as_row) {
			// Restore Content Selectors.
			self.content_selectors = self.original_selectors.content;
			self.row_selector = self.original_selectors.row;

			self.create_selector_strings();

			self.$master_container.off('.draggable');
			self.$body.off('.draggable');
			self.bind_events();

			$.fourpan.$recent_highlight.removeClass('current-edit-as-row');
			self.editting_as_row = false;

			self.$html.removeClass('editing-as-row');
			self.window_mouse_leave();
			self.$master_container.trigger('edit-as-row-leave');
		}
	};

	var activate_edit_as_row = function () {
		// Save Content Selectors.
		self.original_selectors = {};
		self.original_selectors.content = self.content_selectors;
		self.original_selectors.row = self.row_selector;

		self.content_selectors = nested_mode_content_selectors;
		self.row_selector = [self.nested_row_selector_string];

		self.create_selector_strings();

		self.$master_container.off('.draggable');
		self.$body.off('.draggable');
		self.bind_events();

		self.$master_container.find('.current-edit-as-row').removeClass('current-edit-as-row');
		$.fourpan.$recent_highlight.addClass('current-edit-as-row');

		self.editting_as_row = $.fourpan.$recent_highlight;
		self.$html.addClass('editing-as-row');
		self.$master_container.trigger('edit-as-row-enter');
		self.window_mouse_leave();
	};

	/**
  * When the user clicks edit as row.
  */
	this.bind_edit_row = function () {
		self.$master_container.on('click.draggable', '.edit-as-row', function () {
			var $this = $(this);
			var $element = $this.closest('.draggable-tools-imhwpb').next();
			self.$master_container.trigger(self.boldgrid_edit_row, $element);

			if (self.editting_as_row) {
				$.fourpan.dismiss();
			} else {
				$.fourpan.highlight($element);
			}
		});
	};

	/**
  * Unbinds the event namespace ".draggable". This is used when the user
  * disables our plugin.
  */
	this.unbind_all_events = function () {
		self.$master_container.off('.draggable');
		self.$body.off('.draggable');
		self.$master_container.off('.draggable_mce');
		self.$body.attr('style', '');
	};

	/**
  * Hide all popover menus.
  */
	this.hide_menus = function (e) {
		var $this,
		    menu_clicked = false;

		if (e && e.target) {
			$this = $(e.target);
			if ($this.closest('.popover-menu-imhwpb').length) {
				menu_clicked = true;
			} else if ($this.closest('.context-menu-imhwpb').siblings('.popover-menu-imhwpb:visible').length) {
				menu_clicked = true;
			}
		}

		if (!menu_clicked) {
			var $popovers = self.$master_container.find('.popover-menu-imhwpb');

			if ($this) {
				$popovers.not($this.closest('.popover-menu-imhwpb')).addClass('hidden');
			}
		}
	};

	/**
  * Setup the Is Typing Plugin.
  */
	this.setup_additional_plugins = function () {
		if ($.fn.is_typing_boldgrid) {
			self.$master_container.is_typing_boldgrid();
		}
	};

	/**
  * Bind all general events to the container.
  */
	this.bind_container_events = function () {
		self.$master_container.on('click.draggable', '.drag-handle-imhwpb, .draggable-tools-imhwpb', self.prevent_default_draghandle).on('mousedown.draggable', '.drag-handle-imhwpb', self.drag_handle_mousedown).on('mouseup.draggable', '.drag-handle-imhwpb', self.drag_handle_mouseup).on('click.draggable', self.hide_menus).on('click.draggable', self.failSafeCleanup).on('click.draggable', '.context-menu-imhwpb', self.setup_context_menu).on('boldgrid_modify_content.draggable', self.refresh_fourpan);

		if (self.type_popover_removal) {
			self.$master_container.on('start_typing_boldgrid.draggable', self.typing_events.start).on('end_typing_boldgrid.draggable', self.typing_events.end);
		}

		//Manage drag handles show/hide
		self.$body.on('mouseenter.draggable', self.draggable_selectors_string + ', .draggable-tools-imhwpb', self.insert_drag_handles).on('mouseleave.draggable', self.draggable_selectors_string + ', .draggable-tools-imhwpb', self.remove_drag_handles);

		self.$interaction_container.on('mouseleave.draggable', self.window_mouse_leave).on('mouseup.draggable', self.master_container_mouse_up).on('mousemove.draggable', self.mousemove_container);

		if (self.ie_version > 11 || !self.ie_version) {
			self.$interaction_container.on(self.resize_event_map, self.column_selectors_string);
		}
	};

	/**
  * Initializes event binds for drop down menu clicks.
  */
	this.bind_menu_items = function () {

		self.$body.on('click.draggable', 'li[data-action="delete"]', self.menu_actions.delete_element).on('click.draggable', 'li[data-action="add-column"]', self.menu_actions.add_column).on('click.draggable', 'li[data-action="duplicate"]', self.menu_actions.duplicate).on('click.draggable', 'li[data-action="clear"]', self.menu_actions.clear).on('click.draggable', 'li[data-action="insert-layout"]', self.menu_actions.insert_layout).on('click.draggable', 'li[data-action="nest-row"]', self.menu_actions.nest_row).on('click.draggable', 'li[data-action="add-row"]', self.menu_actions.add_row).on('click.draggable', 'li[data-action="clone-as-row"]', self.menu_actions.unnest_row).on('click.draggable', 'li[data-action]', self.menu_actions.trigger_action_click).on('click.draggable', 'li[data-action="add-media"]', self.menu_actions.add_media).on('click.draggable', 'li[data-action="align-top"]', self.menu_actions.alignTop).on('click.draggable', 'li[data-action="Box"]', self.menu_actions.generalMacro).on('click.draggable', 'li[data-action="Font"]', self.menu_actions.generalMacro).on('click.draggable', 'li[data-action="align-default"]', self.menu_actions.alignDefault).on('click.draggable', 'li[data-action="align-bottom"]', self.menu_actions.alignBottom).on('click.draggable', 'li[data-action="align-center"]', self.menu_actions.alignCenter);
	};

	/**
  * Initializes event binds for drop down menu clicks: for menu items passed
  * in at initialization.
  */
	this.bind_additional_menu_items = function () {
		$.each(additional_menu_items, function (key, menu_item) {
			self.$master_container.on('click.draggable', 'li[data-action="' + menu_item.title + '"]', menu_item.callback);
		});
	};

	/**
  * Sets up dragging for all elements defined.
  */
	this.bind_drag_listeners = function () {

		self.$window.on('dragover.draggable', self.drag_handlers.over);

		self.$interaction_container.on('dragstart.draggable', '.drag-handle-imhwpb, [data-action="nest-row"]', self.drag_handlers.start).on('dragstart.draggable', 'img, a', self.drag_handlers.hide_tooltips).on('drop.draggable', self.drag_handlers.drop).on('dragend.draggable', self.drag_handlers.end).on('dragleave.draggable', self.drag_handlers.leave_dragging).on('dragenter.draggable', self.drag_handlers.record_drag_enter);
	};

	this.refresh_fourpan = function () {
		// If editing as row update the overlay.
		if (self.editting_as_row) {
			$.fourpan.refresh();
		}
	};

	/** * Start jQuery Helpers** */
	/**
  * Reverses a collection.
  */
	$.fn.reverse = [].reverse;

	/**
  * Removes a popover.
  */
	$.fn.remove_popover_imhwpb = function () {
		$(this).remove();
	};

	/**
  * Checks if the passed element comes after the current element.
  */
	$.fn.is_after = function (sel) {
		return this.prevAll().filter(sel).length !== 0;
	};

	/**
  * Checks if the passed element comes before the current element.
  */
	$.fn.is_before = function (sel) {
		return this.nextAll().filter(sel).length !== 0;
	};

	/**
  * Closest Context.
  */
	$.fn.closest_context = function (sel, context) {
		var $closest;
		if (this.is(sel)) {
			$closest = this;
		} else {
			$closest = this.parentsUntil(context).filter(sel).eq(0);
		}

		return $closest;
	};

	/** * End jQuery Helpers** */

	/**
  * Finds all column selectors and add additional column classes.
  */
	this.add_redundant_classes = function () {
		self.$master_container.find(self.original_selector_strings.general_column_selectors_string).each(function () {
			$current_element = $(this);
			$current_element.addClass(self.find_column_sizes($current_element));
		});
	};

	/**
  * Each time the window changes sizes record the class that the user should
  * be modifying.
  */
	this.track_window_size = function () {
		self.active_resize_class = self.determine_class_sizes();
		self.$window.on('load resize', function () {
			setTimeout(function () {
				self.active_resize_class = self.determine_class_sizes();
			}, 300);
		});
	};

	/**
  * Prevent default if exists.
  */
	this.prevent_default = function (event) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	};

	/**
  * Create a string that holds a list of comma separated draggable selectors.
  */
	this.format_draggable_selectors_string = function () {
		var selectors = [];

		selectors.push(self.content_selectors_string);
		selectors.push(self.column_selectors_string);
		selectors.push(self.row_selectors_string);

		return selectors.join();
	};

	/**
  * Create a string of the column selectors.
  */
	this.format_immediate_column_selectors = function (selectors) {
		var column_selectors = self.format_selectors(selectors).slice();
		$.each(column_selectors, function (key, value) {
			value = '> ' + value;
			column_selectors[key] = value;
		});
		return column_selectors;
	};

	/**
  * Finds all of the redundant classes for an element. Example: If a class
  * currently has col-md-3 then it should have the classes col-sm-12 and
  * col-xs-12 added to it.
  */
	this.find_column_sizes = function ($column) {
		var classes = $column.attr('class');
		var added_classes = [];

		// Find the sizes for each type.
		var xs_size = classes.match(/col-xs-([\d]+)/i);
		var sm_size = classes.match(/col-sm-([\d]+)/i);
		var md_size = classes.match(/col-md-([\d]+)/i);

		// If an element does not have the class then add it.
		var design_size = 12;
		if (!xs_size) {
			added_classes.push('col-xs-' + design_size);
		} else {
			design_size = xs_size[1];
		}

		if (!sm_size) {
			added_classes.push('col-sm-' + design_size);
		} else {
			design_size = sm_size[1];
		}

		if (!md_size) {
			added_classes.push('col-md-' + design_size);
		}

		return added_classes.join(' ');
	};

	/**
  * Create a string of the column selectors.
  */
	this.format_column_selectors = function (selectors, format_visibility) {
		var column_selectors = selectors;
		if (format_visibility) {
			column_selectors = self.format_selectors(selectors).slice();
		}

		$.each(column_selectors, function (key, value) {
			value = self.row_selectors_string + ' > ' + value;
			column_selectors[key] = value;
		});

		return column_selectors;
	};

	/**
  * Appends :not(:hidden) to each element.
  */
	this.format_selectors = function (selectors) {
		var array_copy = selectors.slice();
		$.each(array_copy, function (key, value) {
			value += ':visible';
			array_copy[key] = value;
		});

		return array_copy;
	};

	/**
  * Determines if a dragged element should be placed before or after the
  * passed element. If we are placing an element within another element,
  * before and after results in append or prepend.
  */
	this.before_or_after_drop = function ($element, pos_obj) {
		var drop_point,
		    bounding_rect = $element.get(0).getBoundingClientRect(),
		    slope = -(bounding_rect.height / bounding_rect.width),
		    y_intercept = Math.floor(bounding_rect.bottom) - slope * bounding_rect.left,
		    position_y_on_slope = slope * pos_obj.x + y_intercept;

		if (position_y_on_slope <= pos_obj.y) {
			drop_point = 'after';
		} else {
			drop_point = 'before';
		}

		return drop_point;
	};

	/**
  * Remove the class .receptor-containers-imhwpb.
  */
	this.remove_receptor_containers = function () {
		self.$master_container.find('.receptor-containers-imhwpb').removeClass('receptor-containers-imhwpb');
	};

	/**
  * Once we finish dragging an element, we need to remove the hidden element.
  */
	this.finish_dragging = function () {

		if (self.$cloned_drag_image && self.$cloned_drag_image.remove) {
			self.$cloned_drag_image.remove();
		}
		if (self.$temp_insertion) {
			self.$temp_insertion.removeClass('cloned-div-imhwpb');
		}

		// Fail safe to remove all activated classes.
		self.$master_container.find(self.dragging_selector).removeClass(self.dragging_selector_class_name);

		self.valid_drag = false;
		self.remove_receptor_containers();

		// We have just modified the DOM.
		self.$master_container.trigger(self.boldgrid_modify_event);
	};

	/**
  * Check if 2 arrays are equal.
  */
	this.array_equal = function (a, b) {
		if (a === b) {
			return true;
		}

		if (a == null || b == null) {
			return false;
		}

		if (a.length != b.length) {
			return false;
		}

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) {
				return false;
			}
		}

		return true;
	};

	/**
  * Drags the an absolutely position element over another then deletes it.
  */
	this.slide_in_place = function ($draged_element, $new_element) {
		var newOffset = $new_element.offset();
		var dragOffset = $draged_element.offset();
		self.drag_cleanup();
	};

	/**
  * Reset the drag operation, deleting any temp data.
  */
	this.drag_cleanup = function () {

		// This is just a failsafe, but performing this on IE causes resource spike.
		if (!self.ie_version) {
			// Make sure that the transformed layout has the correct elements wrapped.
			self.validate_markup();
		}

		self.$current_drag.remove();
		self.finish_dragging();
		self.$master_container.trigger(self.drag_end_event, self.$temp_insertion);
		self.$current_drag = null;
		self.$master_container.removeClass('drag-progress');
		clearInterval(self.scrollInterval);
	};

	/**
  * Remove all popovers and then re-add them used for positioning.
  */
	this.refresh_handle_location = function () {
		// Remove popovers so that they don't reappear in the old location.
		self.remove_all_popovers();
		// Refresh the location of handlers.
		self.update_handles(self.last_hover);
	};

	/**
  * This function defines the restrictions of the dragged item.
  */
	this.determine_current_drag_properties = function () {
		var sibling = '';
		var parent = '';

		// Rows.
		if (self.$current_drag.IMHWPB.is_row) {
			sibling = self.row_selectors_string;

			// Columns can only be dragged into current row.
		} else if (self.$current_drag.IMHWPB.is_column) {

			parent = self.row_selectors_string;
			sibling = self.general_column_selectors_string;

			// Paragraphs, Images, Headings see (self.content_selectors_string).
		} else if (self.$current_drag.IMHWPB.is_content) {
			parent = self.column_selectors_string;
			sibling = self.content_selectors_string;
		}

		self.$current_drag.properties = {
			'sibling': sibling, // The element can be be placed next to siblings.
			'parent': parent
			// The element can be placed within a parent.
		};
	};

	/**
  * Check if a value is between another 2 values.
  */
	this.between = function (x, min, max) {
		return x >= min && x <= max;
	};

	/**
  * Remove all the popovers that have been added to the screen.
  */
	this.remove_all_popovers = function () {
		self.last_hover = null;
		self.hover_elements.type = {
			'content': null,
			'column': null,
			'row': null
		};

		self.delete_popovers();
	};

	/**
  * Delete popovers.
  */
	this.delete_popovers = function () {
		self.$master_container.find('body .draggable-tools-imhwpb').each(function () {
			var $element = $(this);
			var $element_next = $element.next();
			if ($element_next.length) {
				$element_next[0].popover = null;
			}
			// Wait for keypress events before removing element.
			setTimeout(function () {
				$element.remove();
			});
		});
	};

	/**
  * The context menu action.
  */
	this.setup_context_menu = function (event) {
		var $currentPopover;

		event.preventDefault();
		event.stopPropagation();
		self.hide_menus(event);

		$currentPopover = $(this).closest('.draggable-tools-imhwpb, .bg-drag-popover');
		$currentPopover.find('.popover-menu-imhwpb').toggleClass('hidden');
		self.setMenuPosition($currentPopover);
		self.setMenuState($currentPopover);
	};

	/**
  * Set a class defining if the popover menu is opened.
  *
  * @since 1.2.10
  * @param jQuery $currentPopover.
  */
	this.setMenuState = function ($currentPopover) {
		$currentPopover.removeClass('menu-open');
		if (false === $currentPopover.find('.popover-menu-imhwpb').hasClass('hidden')) {
			$currentPopover.addClass('menu-open');
		}
	};

	/**
  * Set classes to help position the menu depeneding on parent proximity to edge of screen.
  *
  * @since 1.2.10
  * @param jQuery $currentPopover.
  */
	this.setMenuPosition = function ($currentPopover) {
		var popoverWidth,
		    totalWidth,
		    boundingClientRect = $currentPopover[0].getBoundingClientRect(),
		    $sideMenu = $currentPopover.find('.side-menu'),
		    htmlWidth = self.$html.width(),
		    buffer = 100;

		if ($sideMenu.length) {
			$currentPopover.removeClass('side-menu-left menu-align-left');

			// If side menu cant fit, point to left.
			popoverWidth = $currentPopover.find('.popover-menu-imhwpb ul').width();
			totalWidth = boundingClientRect.right + $sideMenu.width();
			totalWidth = totalWidth + buffer;
			if (totalWidth > self.$html.width()) {
				$currentPopover.addClass('side-menu-left');
			}

			// Context Menu cant fit align left.
			if (popoverWidth + boundingClientRect.right > htmlWidth) {
				$currentPopover.addClass('menu-align-left');
			}
		}
	};

	/**
  * Returns the type of the given element.
  *
  * @todo elimnate the use of this function when possible, consumes alot of resources on edge.
  */
	this.get_element_type = function ($element) {
		var type = '';

		if ($element.is(self.content_selectors_string)) {
			type = 'content';
		} else if ($element.is(self.row_selectors_string)) {
			type = 'row';
		} else if ($element.is(self.column_selectors_string)) {
			type = 'column';
		}

		return type;
	};

	/**
  * Event that handles remove popovers Triggered when your mouse enters
  * another target within the the $master_container.
  */
	this.remove_drag_handles = function (event) {

		var $current_element = $(this); // Element you've left.
		var type;
		var $draggable;
		var $tools;
		if (!event.relatedTarget) {
			return;
		}
		self.remove_receptor_containers();

		// Related Target is the target you entered.
		var $related_target = $(event.relatedTarget || event.toElement); // Element you've entered

		if (false == $related_target.length) {
			return;
		}

		var $closest_draggable_tools = $related_target.closest('.draggable-tools-imhwpb');
		if ($current_element.hasClass('draggable-tools-imhwpb')) {

			// If you've entered into your child dont remove.
			if ($current_element.next().find($related_target).length || $current_element.next()[0] == $related_target[0]) {
				return false;
			}

			$tools = $current_element;
			$draggable = $current_element.next();

			// If you did not enter your own popover.
		} else if ($closest_draggable_tools[0] != this.popover || false == $closest_draggable_tools.length) {

			// If you've entered into your parent, and your parent needs a popover
			// Only applies to content.
			type = self.get_element_type($current_element);
			var nested_content = $current_element.parent().closest_context(self.content_selectors_string, self.$master_container).length;

			if (type == 'content' && nested_content) {
				return false;
			}

			if ($current_element.find($related_target).length) {
				return false;
			}

			$tools = $current_element.prev('.draggable-tools-imhwpb');
			$draggable = $current_element;
		} //Endif

		if ($draggable && $draggable.length) {
			type = self.get_element_type($draggable);
			// Prevent a pending addition from occurring.
			if (type && self.hover_elements[type] && typeof self.hover_elements[type].add_element != 'undefined' && self.hover_elements[type].add_element != null) {

				// In the case that the lowest child event leave does not trigger,
				// Remove invalid elements.
				self.hover_elements[type].add_element = null;
				if (type == 'row') {
					self.hover_elements.column = { 'add_element': null };
					self.hover_elements.content = { 'add_element': null };
				} else if (type == 'column') {
					self.hover_elements.content = { 'add_element': null };
				}
			}
		}

		if ($draggable && $draggable.length && $tools && $tools.length) {
			self.last_hover = new Date().getTime();
			self.hover_elements[type] = {
				'remove_element': {
					'element': $draggable,
					'tools': $tools
				}
			};
			setTimeout(self.update_handles, self.hover_timout, self.last_hover);
		}
	};

	/**
  * Delete a popover.
  */
	this.remove_drag_handle = function ($draggable, $tools) {
		if ($tools) {
			$tools.remove_popover_imhwpb();
		}
		if ($draggable && $draggable.length) {
			$draggable[0].popover = null;
			if (false == self.$current_drag) {
				$draggable.removeClass(self.dragging_selector_class_name);
			}
		}
	};

	/**
  * Return Row, Column, Content or nested-row.
  */
	this.get_tooltip_type = function ($current) {
		// Even though HR's are nested they should not appear as nested.
		if ($current.is(self.nested_row_selector_string) && $current.find('> .col-md-12 > hr:only-child').length == 0 && !self.editting_as_row) {
			var type = 'nested-row';
		} else {
			var type = self.get_element_type($current);
		}

		return type;
	};

	/**
  * Adds a popover before a row, content or column element.
  */
	this.insert_popover = function ($current) {
		if (!self.$master_container.find($current).length) {
			return;
		}

		var type = self.get_tooltip_type($current);
		if (!type) {
			return;
		}

		// Insert A tooltip before the current element.
		$current.before(self.toolkit_markup(type));
		var $added_tooltip = $current.prev('.draggable-tools-imhwpb');
		var $offset = $current.offset();
		var $parent_offset = $current.offsetParent().offset();

		// Attach a popover object to the element so that it can be removed more easily.
		$current[0].popover = $added_tooltip[0];

		// Rewrite the position of the tooltip based on type.
		if (type == 'content' || type == 'nested-row') {
			if (self.$content_tooltip) {
				self.$content_tooltip.remove();
			}
			self.$content_tooltip = $added_tooltip;

			// Min Left of 25.
			var current_bounding_rect = $current[0].getBoundingClientRect();
			var left = current_bounding_rect.left - 17;
			if (left < 25) {
				left = 25;
			}

			if ($current.is('img, .row .row, .wpview-wrap, .wpview')) {
				$added_tooltip.find('[data-action="Font"]').hide();
			}

			$added_tooltip.css({
				'top': current_bounding_rect.top - 25,
				'left': left
			});
		} else if (type == 'column') {
			if (self.$column_tooltip) {
				self.$column_tooltip.remove();
			}
			self.$column_tooltip = $added_tooltip;

			var current_bounding_rect = $current[0].getBoundingClientRect();

			$added_tooltip.css({
				'top': current_bounding_rect.top,
				'left': current_bounding_rect.left
			});
		} else if (type == 'row') {
			if (self.$row_tooltip) {
				self.$row_tooltip.remove();
			}
			self.$row_tooltip = $added_tooltip;

			$added_tooltip.css({
				'position': 'relative'
			});
		}
	};

	/**
  * Shortcut to get all elements that are direct decendents of the body.
  */
	this.get_top_level_elements = function () {
		return self.$body.find('> *').not('.draggable-tools-imhwpb');
	};

	/**
  * Adds the event that creates the popovers.
  */
	this.insert_drag_handles = function (event) {
		var $current = $(this);

		if (!self.resize && !self.popovers_disabled) {

			// If the user only has a paragraph on the page, don't show a popover.
			var $top_level_elements = self.get_top_level_elements();
			if ($top_level_elements.length === 1 && $top_level_elements[0].tagName == 'P') {
				return;
			}

			// If you have entered a popover rewrite to the popovers element.
			var $closest_draggable = $current.closest('.draggable-tools-imhwpb');

			if ($closest_draggable.length) {
				$current = $closest_draggable.next();
			}

			// If this is nested content, rewrite handle to highest parent.
			var type = self.get_element_type($current);
			if (type == 'content' && true == $current.parent().closest_context(self.content_selectors_string, self.$master_container).length) {
				$current = $current.parents(self.content_selectors_string).last();
			}

			self.last_hover = new Date().getTime();
			self.hover_elements[type] = {
				'add_element': $current
			};
			setTimeout(self.update_handles, self.hover_timout, self.last_hover);
		}
	};

	/**
  * Set the location of the popovers based on the maintained self.hover_elements object.
  */
	this.update_handles = function (last_hover) {
		// If the last time we hovered over an element, was this event.
		if (last_hover == self.last_hover) {

			// Do not show popovers while the user is typing.
			if (self.is_typing && self.is_typing == true) {
				return false;
			}

			// Apply hover_elements.
			$.each(self.hover_elements, function (type, properties) {
				if (this.add_element && false == this.add_element.prev().hasClass('draggable-tools-imhwpb')) {
					self.insert_popover(this.add_element);
				} else if (this.remove_element) {
					self.remove_drag_handle(this.remove_element.element, this.remove_element.tools);
				}

				// Failsafe due to poor design.
				// @todo Remove failsafe.
				if (!this.add_element) {
					var $extra_popovers = self.$master_container.find("." + type + '-popover-imhwpb').closest('.draggable-tools-imhwpb');

					$extra_popovers.each(function () {
						var $this = $(this);
						self.remove_drag_handle($this.next(), $this);
					});
				}
			});
		}
	};

	/**
  * Formats a row into an array of stacks See this.find_column_stack for an
  * explanation as to what a stack is.
  */
	this.find_row_layout = function ($row) {
		var layout = [];
		var stack = [];
		var stack_size = 0;
		$row.find(self.immediate_column_selectors_string).each(function () {
			var column = {};
			var $column = $(this);
			var column_size = self.find_column_size($column);
			if (column_size + stack_size <= 12) {
				column.size = column_size;
				column.object = $column[0];
				stack.push(column);
				stack_size += column_size;
			} else {
				layout.push(stack);
				stack = [];
				column.size = stack_size = column_size;
				column.object = $column[0];
				stack.push(column);
			}
		});

		if (stack.length) {
			layout.push(stack);
		}

		return layout;
	};

	/**
  * Finds a layout stack A layout stack is a section of 12 columns, in a row.
  * Example: If a row has 3 columns of widths: 12, 8 and 4. This row has 2 stacks.
  * The first stack has 1 column and a width of 12. The second stack has 2
  * columns a width of 8 and a width of 4.
  */
	this.find_column_stack = function ($row, column) {
		var stack = [];
		var index = null;
		var layout = self.find_row_layout($row);
		$.each(layout, function (key, current_stack) {
			$.each(current_stack, function (column_key, current_column) {
				if (column == current_column.object) {
					stack = current_stack;
					index = key;
					return false;
				}
			});
			if (stack.length) {
				return false;
			}
		});

		return {
			'stack': stack,
			'stack_index': index
		};
	};

	/**
  * Checks to see if the column passed in is an adjacent column.
  *
  * @return boolean
  */
	this.check_adjacent_column = function (stack, sibling_column) {
		var sibling_in_stack = false;

		if (sibling_column && sibling_column.length) {
			$.each(stack, function (key, current_column) {
				if (sibling_column[0] == current_column.object) {
					sibling_in_stack = true;
					return false;
				}
			});
		}

		return sibling_in_stack;
	};

	this.elementIsEmpty = function ($element) {
		var isEmpty = $element.is(':empty'),
		    minContentLength = 4;

		/*
   * If not Empty
   * 		and no images, icons, hr, or anchors found
   * 		and content length less than limit,
   * 		THIS IS EMPTYISH
   */
		if (!isEmpty && !$element.find('img, i, hr, a').length && $element.text().length < minContentLength) {
			isEmpty = true;
		}

		return isEmpty;
	};

	this.getNewColumnString = function () {
		var string = 'col-md-1 col-sm-12 col-xs-12';
		switch (self.active_resize_class) {
			case 'col-sm':
				string = 'col-md-12 col-sm-1 col-xs-12';
				break;
			case 'col-xs':
				string = 'col-md-12 col-sm-12 col-xs-1';
				break;
		}

		return string;
	};

	/**
  * Event that occurs when the user moves their mouse.
  */
	this.mousemove_container = function (event) {
		// Log All Mouse Movement.
		self.pageX = event.originalEvent.clientX;
		self.pageY = event.originalEvent.clientY;

		// If we are currently resizing run this process.
		if (self.resize) {

			if (!self.resize.triggered) {
				self.$master_container.trigger(self.resize_start_event);
				self.resize.triggered = true;
			}

			var smaller_position, larger_position, smaller_override, larger_override;

			var $row = self.resize.element.closest_context(self.row_selectors_string, self.$master_container);
			var row_width = $row[0].getBoundingClientRect().width;
			var column_size = self.find_column_size(self.resize.element);
			var siblingColumnSize = self.find_column_size(self.resize.sibling);
			var offset = self.resize.element[0].getBoundingClientRect();
			var row_size = self.find_row_size($row);

			// Determine how much drag until next location.
			var current_column_size = self.column_sizes[column_size] * row_width;
			var offset_added = self.column_sizes[column_size + 1] * row_width;
			var offset_removed = self.column_sizes[column_size - 1] * row_width;

			// Figure out the position of the next smallest column size.
			if (self.resize.left) {
				smaller_position = offset_added - current_column_size + offset.left;
				larger_position = offset_removed - current_column_size + offset.left;
				smaller_override = self.pageX > smaller_position;
				larger_override = self.pageX < larger_position;
			} else {
				smaller_position = offset_removed - current_column_size + offset.right;
				larger_position = offset_added - current_column_size + offset.right;
				smaller_override = self.pageX < smaller_position;
				// If the users cursor is anywhere outside of the row + 10, make larger.
				larger_override = self.pageX > larger_position || $row[0].getBoundingClientRect().right + self.right_resize_buffer < self.pageX;
			}

			var resize_buffer = row_width * self.resize_buffer;

			// Has the dragging made the current element smaller?
			var made_smaller = smaller_override || self.between(smaller_position, self.pageX - resize_buffer, self.pageX + resize_buffer);

			// Has the dragging made the current element larger?
			var made_larger = larger_override || self.between(larger_position, self.pageX - resize_buffer, self.pageX + resize_buffer);

			var valid_smaller = made_smaller && column_size > 1,
			    valid_larger = made_larger && column_size < self.max_row_size;

			// If Im Resizing from the left
			// and im making the item larger
			// and the row size is more than the max row size.
			// and this is the first element in the stack.
			// exit.
			if (self.resize.left && valid_larger) {
				var column_stack = self.find_column_stack($row, self.resize.element[0]);
				if (self.resize.element[0] == column_stack.stack[0].object) {
					return false;
				}
			}

			/*
    * If my column size is 1.
    * - and your making me smaller.
    * - delete me, switch to resize my sibling
    */
			if (column_size === 1 && made_smaller) {
				if (self.elementIsEmpty(self.resize.element)) {
					var $newSibiling,
					    resizeElement = self.resize.element;

					self.resize.element.remove();
					self.change_column_size(self.resize.sibling);

					self.resize.element = self.resize.sibling;

					if (self.resize.right) {
						self.resize.left = self.resize.right;
						self.resize.element.addClass('resize-border-left-imhwpb');
						self.resize.right = null;
						$newSibiling = self.resize.sibling.prev();
					} else {
						self.resize.right = self.resize.left;
						self.resize.element.addClass('resize-border-right-imhwpb');
						self.resize.left = null;
						$newSibiling = self.resize.sibling.next();
					}

					self.resize.sibling = $newSibiling;
				}

				return false;
			}

			if (valid_smaller || valid_larger) {

				var column_stack = self.find_column_stack($row, self.resize.element[0]);

				// If your resizing from the left and this is the first item in the stack.
				if (self.resize.left && self.resize.element[0] == column_stack.stack[0].object && made_smaller) {

					if (row_size <= 12) {
						self.change_column_size(self.resize.element, false);
						self.resize.sibling = $('<div>').addClass(self.getNewColumnString());
						self.resize.element.before(self.resize.sibling);
						return false;
					} else {
						return false;
					}
				}
				/*
     * If my column size is 1.
     * - and your making me smaller.
     * - delete me.
     */
				if (made_larger && siblingColumnSize == 1) {
					if (self.elementIsEmpty(self.resize.sibling)) {

						var method = 'next';
						if (self.resize.left) {
							method = 'prev';
						}

						var $next = self.resize.sibling[method]();
						self.resize.sibling.remove();
						self.resize.sibling = $next;
						self.change_column_size(self.resize.element);
					}

					return false;
				}

				// If your resizing from the right
				//	and the row has 12
				//  and your making it larger
				//  and this is a descktop view.
				// And this is the last column in the row.
				var last_col_in_row = column_stack.stack[column_stack.stack.length - 1].object == self.resize.element[0];
				if (self.resize.right && row_size == 12 && valid_larger && self.active_resize_class == 'col-md' && last_col_in_row) {
					return false;
				}

				// If my resizing from the right
				// And im making myself smaller.
				// And Im the last item in the stack.
				// Add a column.
				if (row_size <= 12 && self.resize.right && last_col_in_row && made_smaller) {
					self.change_column_size(self.resize.element, false);
					self.resize.sibling = $('<div>').addClass(self.getNewColumnString());
					$row.append(self.resize.sibling);
					return false;
				}

				var sibling_in_stack = self.check_adjacent_column(column_stack.stack, self.resize.sibling);
			}

			if (valid_smaller) {

				self.change_column_size(self.resize.element, false);

				if (self.resize.sibling && self.resize.sibling.length) {
					if (siblingColumnSize < self.max_row_size && sibling_in_stack) {
						self.change_column_size(self.resize.sibling);
					}
				}

				var new_column_stack = self.find_column_stack($row, self.resize.element[0]);

				if (column_stack.stack_index != new_column_stack.stack_index) {
					self.end_resize();
				}
			} else if (valid_larger) {
				if (!self.resize.sibling || self.resize.sibling.length && siblingColumnSize == 1) {
					return;
				}

				self.change_column_size(self.resize.element);
				if (sibling_in_stack) {
					self.change_column_size(self.resize.sibling, false);
				}

				var new_column_stack = self.find_column_stack($row, self.resize.element[0]);

				if (column_stack.stack_index != new_column_stack.stack_index) {
					self.end_resize();
				}
			}
		}
	};

	/**
  * Prevent default behavior when the user clicks on the drag handle.
  */
	this.prevent_default_draghandle = function (event) {
		event.preventDefault();
	};

	/**
  * Remove any classes that were added by the the draggable class.
  */
	this.frame_cleanup = function (markup) {
		var $markup = $('<div>' + markup + '</div>');
		self.remove_resizing_classes($markup);
		self.remove_border_classes($markup);
		self.removeClasses($markup);
		$markup.find('.draggable-tools-imhwpb').remove();
		return $markup.html();
	};

	/**
  * Remove resizing class.
  */
	this.remove_resizing_classes = function ($container) {
		$container.find('.resizing-imhwpb').removeClass('resizing-imhwpb');
	};

	/**
  * Remove border classes.
  */
	this.remove_border_classes = function ($container) {
		// Remove Border Classes.
		$container.find('.resize-border-left-imhwpb, .resizing-imhwpb, .resize-border-right-imhwpb, .content-border-imhwpb').removeClass('resize-border-right-imhwpb resizing-imhwpb resize-border-left-imhwpb content-border-imhwpb');
	};

	/**
  * Method to be called when the resize process has completed.
  */
	this.end_resize = function () {
		self.resize = false;
		self.remove_border_classes(self.$master_container);

		self.$html.removeClass('no-select-imhwpb');
		self.remove_resizing_classes(self.$master_container);
		self.$master_container.removeClass('resizing-imhwpb cursor-not-allowed-imhwpb');

		self.$master_container.trigger(self.resize_finish_event);
	};

	/**
  * Events to trigger when the users mouse leaves the window.
  */
	this.window_mouse_leave = function () {
		if (self.resize) {
			self.end_resize();
		}

		self.remove_resizing_classes(self.$master_container);
		self.remove_all_popovers();

		self.hover_elements = {
			'content': null,
			'column': null,
			'row': null
		};
	};

	/**
  * When the user presses down on the drag handle Add borders to the
  * locations that the user can drop the items.
  */
	this.drag_handle_mousedown = function (event) {
		self.valid_drag = true;
		self.$current_clicked_element = $(this).closest('.draggable-tools-imhwpb').next();

		if (self.$current_clicked_element.is('a') && self.$current_clicked_element.find('img, button').length) {
			self.$current_clicked_element.find('img, button').first().addClass('dragging-imhwpb');
		} else {
			self.$current_clicked_element.addClass('dragging-imhwpb');
		}

		// Add borders for the possible target selections of the current element.
		if (self.$current_clicked_element.is(self.content_selectors_string)) {
			self.$master_container.find(self.column_selectors_string).addClass('receptor-containers-imhwpb');
		} else if (self.$current_clicked_element.is(self.row_selectors_string)) {
			self.$master_container.find(self.row_selectors_string).addClass('receptor-containers-imhwpb');
		} else if (self.$current_clicked_element.is(self.column_selectors_string)) {
			self.$master_container.find(self.column_selectors_string).addClass('receptor-containers-imhwpb');

			self.$master_container.find(self.row_selectors_string).addClass('receptor-containers-imhwpb');
		}
	};

	/**
  * Handles the event of a mouse up on the drag handle.
  */
	this.drag_handle_mouseup = function () {
		self.remove_receptor_containers();
		self.valid_drag = false;
	};

	/**
  * Handles the mouse up on the main container.
  */
	this.master_container_mouse_up = function (event, element) {
		if (self.resize) {
			self.end_resize();
		}

		if (self.$current_clicked_element) {
			self.$current_clicked_element.removeClass('dragging-imhwpb');
		}

		if (typeof element == 'undefined') {
			var $target = $(event.target);
		} else {
			var $target = $(element);
		}

		if (false == $target.closest('.draggable-tools-imhwpb').length) {
			$target.trigger('mouseenter');
		}
	};

	/**
  * Decrease row size by 1.
  */
	this.decrease_row_size = function ($row) {
		var row_decreased = false;
		$row.find(self.immediate_column_selectors_string).reverse().each(function () {
			var $current_element = $(this);
			if (self.find_column_size($current_element) >= 2) {
				self.change_column_size($current_element, false);
				row_decreased = true;
				return false;
			}
		});

		return row_decreased;
	};

	/**
  * Find the location of the border on an column.
  */
	this.get_border_mouse_location = function ($element, x_position) {
		var right_of_column,
		    left_of_column,
		    bounding_rectangle = $element[0].getBoundingClientRect(),
		    left_position = Math.floor(bounding_rectangle.left),
		    right_position = Math.floor(bounding_rectangle.right);

		right_of_column = self.between(x_position, right_position - self.border_hover_buffer, right_position);
		left_of_column = self.between(x_position, left_position, left_position + self.border_hover_buffer);

		return {
			'left': left_of_column,
			'right': right_of_column
		};
	};

	/**
  * Given a set of key value pairs, and a row. Change the sizes in the row to
  * the sizes in the transform.
  */
	this.transform_layout = function ($row, layout_transform) {
		$.each(layout_transform, function (current_value, transform_value) {
			$row.find(self.immediate_column_selectors_string).each(function () {
				var $column = $(this);
				if (current_value == self.find_column_size($column)) {
					self.change_column_size($column, null, transform_value);
				}
			});
		});
	};

	/**
  * Given an array of sizes, returns the an object with the previous rows
  * values and the size it translates to.
  */
	this.find_layout_transform = function (layout_format, current_column_size) {
		var translation_key = JSON.stringify(layout_format);
		var transform = self.layout_translation[translation_key];

		// If this override is requires a current column to be passed and it
		// does not match
		// Unset the transform
		if (typeof current_column_size != 'undefined' && typeof transform != 'undefined' && typeof transform.current != 'undefined' && transform.current != current_column_size) {
			transform = null;
		} else if (typeof current_column_size == 'undefined' && typeof transform != 'undefined' && transform.current) {
			transform = null;
		}

		return transform;
	};

	/**
  * Given a row, return an array of its sizes.
  */
	this.get_layout_format = function ($row) {
		var layout_format = [];
		$row.find(self.immediate_column_selectors_string).each(function () {
			layout_format.push(self.find_column_size($(this)));
		});

		return layout_format;
	};

	/**
  * Change the size of a column to the passed in value or increments/decrements.
  */
	this.change_column_size = function ($column_element, increment, value_override) {
		if (!$column_element.length) {
			return;
		}

		var regex = new RegExp(self.active_resize_class + "-[\\d]+", 'i');
		$.each($column_element.attr('class').split(' '), function (key, class_name) {

			if (class_name.match(regex)) {
				var column_size = parseInt(class_name.replace(/\D/g, ''));

				if (value_override) {
					column_size = value_override;
				} else if (increment === false) {
					column_size--;
				} else {
					column_size++;
				}

				var new_class_name = class_name.replace(/\d+/g, column_size);
				var new_class_string = $column_element.attr('class').replace(class_name, new_class_name);

				$column_element.attr('class', new_class_string);

				return false;
			}
		});

		// We have just modified the DOM.
		self.$master_container.trigger(self.boldgrid_modify_event);
	};

	/**
  * Return the column size of a column.
  */
	this.find_column_size = function ($column_element) {
		var regex,
		    matches,
		    column_size = 0;

		if (!$column_element || !$column_element.length) {
			return column_size;
		}

		regex = new RegExp(self.active_resize_class + "-([\\d]+)", 'i');
		matches = $column_element.attr('class').match(regex);

		if (matches) {
			column_size = matches[1];
		}

		return parseInt(column_size);
	};

	/**
  * Sums all column sizes in a row.
  */
	this.find_row_size = function ($row) {
		var total_size = 0;

		$row.find(self.immediate_column_selectors_string).not('.dragging-imhwpb').each(function () {
			total_size += self.find_column_size($(this));
		});

		return total_size;
	};

	/**
  * Based on the window size, return the column type that is being used.
  */
	this.determine_class_sizes = function () {
		var column_type;
		var width = self.$master_container.width();

		if (width > 1061) {
			column_type = 'col-md';
		} else if (width > 837) {
			column_type = 'col-sm';
		} else {
			column_type = 'col-xs';
		}

		return column_type;
	};

	/**
  * Check if a color word is the same a some of the common definitions for these color.
  * Definitions are defined in self.color_alias.
  */
	this.color_is = function (color_returned, color) {
		return self.color_alias[color].indexOf(color_returned) !== -1;
	};

	/**
  * Logic used for adding a maximum height.
  * If the height of the element if >= 200,
  * 		then max_height * 1.25,
  * Else
  * 		max_height = 250.
  */
	var add_max_height_styles = function ($element, cur_height) {
		if (cur_height >= 200) {
			var max_height = cur_height * 1.25;
		} else {
			var max_height = 250;
		}
		$element.css({
			'max-height': max_height + 'px',
			'overflow': 'hidden'
		});
	};

	/**
  * Add Max heights to rows if dragging a column.
  * Add Max Heights to content if dragging content.
  */
	this.add_max_heights = function () {
		if (self.$current_drag.IMHWPB.type == 'column') {
			self.$master_container.find(self.row_selectors_string).each(function () {
				var $this = $(this);
				var row_size = self.find_row_size($this);
				if (row_size <= 12) {
					var outer_height = $this.outerHeight();
					add_max_height_styles($this, outer_height);
				}
			});
		} else if (self.$current_drag.IMHWPB.type == 'content') {
			add_max_height_styles(self.$temp_insertion, self.$current_drag.IMHWPB.height);
		}
	};

	/**
  * Remove the list of styles that we add for max heights.
  */
	var remove_max_height_styles = function ($element) {
		$element.css({
			'max-height': '',
			'overflow': ''
		});
	};

	/**
  * We've added max heights to rows and content elements while dragging.
  * Remove them so that the editor is WYSIWYG after drag is finished.
  */
	this.remove_max_heights = function () {
		if (self.$current_drag.IMHWPB.type == "column") {
			remove_max_height_styles(self.$master_container.find(self.row_selectors_string));
		} else if (self.$current_drag.IMHWPB.type == 'content') {
			remove_max_height_styles(self.$temp_insertion);
		}
	};

	this.get_other_top_level_elements = function () {
		return self.$body.find(self.immediate_row_siblings_string).not(self.$current_drag);
	};

	/**
  * Find max and min y cord used for dragging rows.
  */
	this.find_page_min_max = function () {
		var min_max = {};
		if (self.$current_drag.IMHWPB.is_row) {

			var $other_top_level_elements = self.get_other_top_level_elements();

			var $first = $other_top_level_elements.eq(0);
			var $last = $other_top_level_elements.last();

			min_max = {
				'offset_top': $first[0].getBoundingClientRect().top,
				'offset_bottom': $last[0].getBoundingClientRect().top + $last.outerHeight(true)
			};
		}

		return min_max;
	};

	/**
  * Find boundries of a column when dragging within a row in the locked setting.
  */
	this.find_row_min_max = function () {
		var min_max = {};
		if (self.$current_drag.IMHWPB.is_column) {
			var $row = self.$current_drag.closest('.row');
			var row = $row.get(0);

			var client_rect = row.getBoundingClientRect();
			min_max = {
				'offset_left': client_rect.left,
				'offset_right': client_rect.left + $row.outerWidth(true),
				'offset_top': Math.max(0, client_rect.top - 150),
				'offset_bottom': client_rect.top + $row.outerHeight(true)
			};
		}

		return min_max;
	};

	/**
  * Find the the points of each top level element at which a dragged element
  * should be placed before or after.
  *
  * This is used everytime the location of an element changes during dragging a row as well
  * as the start of a row drag.
  *
  * Instead of doing the math everytime the over event triggers, do this only when needed
  * This allows us to use a simple comparison operator later.
  */
	this.find_top_level_positions = function () {

		var positions = [];
		if (self.$current_drag.IMHWPB.is_row) {
			var $other_top_level_elements = self.get_other_top_level_elements();

			$other_top_level_elements.each(function () {
				var $this = $(this);
				var height = $this.outerHeight(true);

				positions.push({
					'max': this.getBoundingClientRect().top + height,
					'element': $this
				});
			});
		}

		return positions;
	};

	/**
  * When dragging columns, use this to find the right x point of each element.
  */
	this.find_column_sibling_positions = function () {
		var positions = [];
		if (self.$current_drag.IMHWPB.is_column) {
			self.$current_drag.siblings(self.general_column_selectors_string).each(function () {
				var $this = $(this);
				var width = $this.outerWidth(true);
				var bounding_rect = this.getBoundingClientRect();

				positions.push({
					'max': bounding_rect.left + width,
					'element': $this
				});
			});
		}
		return positions;
	};

	/**
  * Set the current drag properties for a column. These are needed for drag over DnD.
  */
	this.recalc_col_pos = function () {
		// Recalc pos of all top level elements.
		self.$current_drag.IMHWPB.col_pos = self.find_column_sibling_positions();
		self.$current_drag.IMHWPB.row_min_max = self.find_row_min_max();
	};

	/**
  * Set the current drag properties for a column. These are needed for drag over DnD.
  */
	this.recalc_row_pos = function () {
		// Recalc pos of all top level elements.
		self.$current_drag.IMHWPB.row_pos = self.find_top_level_positions();
		self.$current_drag.IMHWPB.row_min_max = self.find_page_min_max();
	};

	/**
  * This function is used to drag colummns.
  */
	this.reposition_column = function (page_x, page_y) {

		if (self.$current_drag.IMHWPB.is_column && self.$current_drag.IMHWPB.unlock_column == false) {

			if (self.$current_drag.IMHWPB.row_min_max.offset_top > page_y || self.$current_drag.IMHWPB.row_min_max.offset_bottom < page_y) {

				self.$current_drag.IMHWPB.unlock_column = true;
				var $row = self.entered_target.closest(self.row_selectors_string);
				if ($row.length) {
					self.move_column_to(self.entered_target); // Dom mod event triggered in here.
				}

				return;
			}

			// If the element is outside of the row to the left and the temp insertion is not the first column,
			// insert this column as the first column.
			if (page_x < self.$current_drag.IMHWPB.row_min_max.offset_left) {
				var $first_elem = self.$current_drag.closest(self.row_selectors_string).find(self.immediate_column_selectors_string).not(self.$current_drag).eq(0);

				if ($first_elem.get(0) != self.$temp_insertion[0]) {
					$first_elem.before(self.$temp_insertion);
					self.recalc_col_pos();

					// We have just modified the DOM.
					self.$master_container.trigger(self.boldgrid_modify_event);
				}
				return;

				// If the element is outside of the row to the right and the temp insertion is not the last column,
				// insert this column as the last column.
			} else if (page_x > self.$current_drag.IMHWPB.row_min_max.offset_right) {
				var $last_elem = self.$current_drag.closest(self.row_selectors_string).find(self.immediate_column_selectors_string).not(self.$current_drag).last();

				if ($last_elem.get(0) != self.$temp_insertion[0]) {
					$last_elem.after(self.$temp_insertion);
					self.recalc_col_pos();

					// We have just modified the DOM.
					self.$master_container.trigger(self.boldgrid_modify_event);
				}

				return;
			}

			// Check each column end point position.
			$.each(self.$current_drag.IMHWPB.col_pos, function () {
				if (page_x < this.max) {

					if (most_recent_enter[0] == this.element[0]) {
						return false;
					}
					most_recent_enter = this.element;

					// Insert Before if not already there.
					if (this.element.nextAll().not(self.$current_drag).filter(self.$temp_insertion).length) {
						this.element.before(self.$temp_insertion);

						// If the element is before me but not immediatly before me, insert immediatly before me.
					} else if (this.element.prevAll(self.general_column_selectors_string).not(self.$current_drag).get(0) != self.$temp_insertion[0]) {
						this.element.before(self.$temp_insertion);
					} else {
						this.element.after(self.$temp_insertion);
					}

					// We have just modified the DOM.
					self.$master_container.trigger(self.boldgrid_modify_event);

					self.recalc_col_pos();

					return false;
				}
			});
		}
	};

	this.fill_row = function (row_size, $row) {
		var $new_column;

		if (row_size < self.max_row_size) {
			$new_column = $('<div class="col-md-' + (self.max_row_size - row_size) + ' col-sm-12 col-xs-12"></div>');
			$row.append($new_column);
		}

		return $new_column;
	};

	this.setInheritedBg = function ($element, timeout) {
		// Set the background color to its parents bg color.
		if (self.color_is($element.css('background-color'), 'transparent')) {
			$element.parents().each(function () {
				var $this = $(this),
				    bgColor = $this.css('background-color');

				if (!self.color_is(bgColor, 'transparent')) {
					$element.css('background-color', bgColor);
					return false;
				}
			});
		}
		setTimeout(function () {
			//If the background is still transparent, set to white
			if (self.color_is($element.css('background-color'), 'transparent')) {
				$element.css({
					'background-color': 'white',
					'color': '#333'
				});
			}
		}, timeout || 100);
	};

	/**
  * This object contains all the event handlers used for DND (Drag and Drop).
  */
	this.drag_handlers = {

		/**
   * Hide all tooltips while dragging.
   */
		hide_tooltips: function () {
			if (!self.$current_drag) {
				setTimeout(function () {
					self.$master_container.find('.draggable-tools-imhwpb').addClass("hidden");
				}, 100);
			}
		},

		/**
   * Handle the drop event of a draggable.
   */
		drop: function (event) {
			if (self.$current_drag) {

				self.prevent_default(event);
				/**
     * IE Fix Dragend does not fire occasionally, but drag drop does
     * make sure that the drag end function is always called.
     */
				self.drag_handlers.end(event);
				self.drag_drop_triggered = true;
			}
		},

		/**
   * This event is triggered at each drag conclusion. We remove the dragged
   * image and remove classes as needed Standard cleanup procedures must
   * ensue.
   */
		end: function (event) {
			if (self.drag_drop_triggered) {
				return;
			}

			if (!self.$current_drag) {
				return;
			}

			self.restore_row = null;
			self.$most_recent_row_enter_add = null;
			self.remove_max_heights();

			if (self.dragImageSetting == 'actual') {
				self.slide_in_place(self.$current_drag, self.$temp_insertion);
			} else {
				self.drag_cleanup();
			}

			return true;
		},

		/**
   * When the Dragging begins We we set a drag image, hide the current
   * drag image, and set some initial drag properties.
   */
		start: function (event) {

			var $new_column, $row, row_size;

			self.valid_drag = true;
			self.drag_drop_triggered = false;
			var $this = $(this);
			var $tooltip = $this.closest('.draggable-tools-imhwpb');

			self.$current_drag = $tooltip.next().addClass('dragging-imhwpb');
			self.$master_container.addClass('drag-progress');

			if (self.$current_drag.parent('a').length) {
				self.original_html = self.$current_drag.parent('a')[0].outerHTML;
			} else {
				self.original_html = self.$current_drag[0].outerHTML;
			}
			// These settings help reduce cpu resource usage, storing some properties of the
			// drag start so that they wont be retrieved again.
			var $popover_items = $tooltip.find('.popover-imhwpb');
			self.$current_drag.IMHWPB = {
				'right_popover': $popover_items.hasClass('right-popover-imhwpb'),
				'column_popover': $popover_items.hasClass('column-popover-imhwpb'),
				'is_column': self.$current_drag.is(self.column_selectors_string),
				'is_row': self.$current_drag.is(self.row_selectors_string),
				'is_content': self.$current_drag.is(self.content_selectors.join()),
				'height': self.$current_drag.outerHeight(),
				'width': self.$current_drag.outerWidth(),
				'dragStarted': true
			};

			// Save the column size at drag start so that it wont be recalculated
			if (self.$current_drag.IMHWPB.is_row && $this.hasClass('action-list')) {
				self.$current_drag.IMHWPB.is_row = false;
				self.$current_drag.IMHWPB.is_content = true;
			}

			if (self.$current_drag.IMHWPB.is_column) {
				self.$current_drag.IMHWPB.column_size = self.find_column_size(self.$current_drag);

				var $current_row = self.$current_drag.closest_context(self.row_selectors_string, self.$master_container);
				if ($current_row.length) {
					self.$current_drag.IMHWPB.original_row = $current_row[0];
				}
			}

			self.determine_current_drag_properties();

			// Set the dragging content.
			// For IE this must be set to "text" all lower case.
			event.originalEvent.dataTransfer.setData('text', ' ');
			event.originalEvent.dataTransfer.dropEffect = 'copy';

			self.$temp_insertion = $(self.original_html);
			self.$temp_insertion.removeClass('dragging-imhwpb');
			self.$temp_insertion.addClass('cloned-div-imhwpb');

			// Set Dragging Image.
			if (self.dragImageSetting == 'actual') {

				// Add the inline-style so that its not modified by content changed.
				self.$current_drag.css({
					'height': self.$current_drag.IMHWPB.height,
					'width': self.$current_drag.IMHWPB.width
				}).addClass('hidden dragging-started-imhwpb');

				self.$current_drag.attr('data-mce-bogus', "all");

				self.setInheritedBg(self.$current_drag);

				// Setting Drag Image is not allowed in IE, and fails on safari.
				if (typeof event.originalEvent.dataTransfer.setDragImage != "undefined" && !self.isSafari) {

					// Turn off Drag Image.
					var img = document.createElement("img");
					img.src = "";
					event.originalEvent.dataTransfer.setDragImage(img, 0, 0);
				}
			} else if (self.dragImageSetting == 'browserImage') {
				self.$cloned_drag_image = $(self.original_html);
				self.$cloned_drag_image.addClass('temporary-image-div');
				document.body.appendChild(self.$cloned_drag_image[0]);

				// Set the dragging content
				event.originalEvent.dataTransfer.setDragImage(self.$cloned_drag_image[0], 0, 0);

				// Hide the image that we are currently dragging. It will be
				// removed once the drag completes
				// It will be replaced by the dragging content set above.
				self.$current_drag.addClass('hidden');
			}

			// Since we arent creating on proximity we will need to create this right away.
			self.$current_drag.before(self.$temp_insertion);

			// Set an additional value of type for quick index lookups
			if (self.$current_drag.IMHWPB.is_column) {
				self.$current_drag.IMHWPB.type = 'column';
				self.recalc_col_pos();

				$row = self.$current_drag.closest('.row');
				row_size = self.find_row_size($row);

				if (row_size < self.max_row_size) {
					self.fill_row(row_size, $row);
				}

				// If the row has not stacked with columns, allow the rail dragging && desktop view.
				if (row_size <= 12 && self.active_resize_class == 'col-md' && self.$current_drag.siblings(self.unformatted_column_selectors_string).not(self.$temp_insertion).length
				//	&& !self.editting_as_row
				) {
						self.$current_drag.IMHWPB.unlock_column = false;
					} else {
					self.$current_drag.IMHWPB.unlock_column = true;
				}
			} else if (self.$current_drag.IMHWPB.is_row) {
				self.$current_drag.IMHWPB.type = 'row';
				self.recalc_row_pos();
			} else {
				self.$current_drag.IMHWPB.type = 'content';
			}

			// Set max height to rows and content.
			self.add_max_heights();

			// This timeout is needed so that there isnt a flsh on the screen in chrome/ie.
			// You cannot modify the drag object in this event.
			var timeout_length = 100;
			if (self.ie_version) {
				timeout_length = 150;
			}

			setTimeout(function () {
				self.$current_drag.removeClass('hidden');
				self.$master_container.trigger(self.drag_start_event);
				self.$master_container.find('.resizing-imhwpb').removeClass('resizing-imhwpb');
			}, timeout_length);

			self.drag_handlers.initSmoothScroll();
		},

		over: function (event) {
			if (!self.$current_drag || !self.valid_drag) {
				return;
			}

			// Prevent Default is required for IE compatibility.
			// Otherwise you'll exp a intermitent drag end.
			event.preventDefault();

			// Handles Auto Scrolling
			// Only trigger every 10 microseconds
			if (!self.last_auto_scroll_event || self.last_auto_scroll_event + 10 <= new Date().getTime()) {

				self.last_auto_scroll_event = new Date().getTime();

				/**
     * HANDLE ROW DRAGGING.
     * This is important.
     * This was moved to "over" on 10/14/15.
     */
				if (self.$current_drag.IMHWPB.dragStarted) {
					if (BG.Controls.$container.$current_drag.IMHWPB.is_row) {
						BG.DRAG.Row.dragCursorPosition(event.originalEvent.pageY);
					}
					self.reposition_column(event.originalEvent.pageX, event.originalEvent.pageY);
				}

				// Don't auto scroll when modifying a nested row.
				if (self.$html.hasClass('editing-as-row')) {
					return;
				}

				self.drag_handlers.autoScroll(event);
			}
		},

		initSmoothScroll: function () {
			// Delay in milliseconds.
			var y = 1;

			// Init Y-axis pixel displacement.
			self.autoScrollSpeed = false;

			self.scrollInterval = setInterval(function () {
				if (!self.autoScrollSpeed) {
					return;
				}

				window.scrollBy(0, self.autoScrollSpeed);
			}, y);
		},

		/**
   * Automatically Scroll Down the screen as the user drags.
   *
   * @since 1.3
   */
		autoScroll: function (event) {
			var isFixedTop = self.$mce_32.css('position') === 'fixed',
			    topOffset = self.$mce_32[0].getBoundingClientRect(),
			    positionY = event.originalEvent.screenY;

			/*
    * On dual monitor setups where the height of the window is much larger than the
    * main window, skip auto scroll. Unable to get consistent results. -100 window height is
    * used to identify this scenario.
    */
			if (window.screenY < -100) {
				return;
			}

			// 150: Is the range within the mce bar you must reach before scrolling up starts.
			if (positionY < topOffset.bottom + 150 && isFixedTop) {
				self.autoScrollSpeed = -1;
				// 100: Is the range within the bottom bar you must get to before scrolling down starts.
			} else if (positionY > window.innerHeight - 100) {
				self.autoScrollSpeed = 1;
			} else {
				self.autoScrollSpeed = false;
			}
		},

		/**
   * This function is responsible for all of the animation that the user
   * sees as their cursor moves across the screen. It needs some cleanup
   * to remove some duplicate code Its currently separated into three
   * different types of dragging elements for ease of development. Theres
   * a section for content, column, and row.
   */
		leave_dragging: function (event) {
			if (!self.$current_drag) {
				return;
			}

			// Prevent Default here causes an issue on IE.
			if (!self.ie_version) {
				event.preventDefault();
			}

			var $left = $(event.target),
			    $entered = self.entered_target;

			// Prevent Multiple Events from being triggered at an X and Y location.
			if (self.prevent_duplicate_location_events(event) || !self.$current_drag) {
				return false;
			}

			// Skip if dragging over same element.
			if (self.$temp_insertion[0] == $entered[0]) {
				self.$most_recent_row_enter_add = null;
				return true;
			}

			// If you are dragging outside of the master container, skip this event.
			// This check is done later for content.
			if (false == self.$master_container.has($entered).length && false == self.$current_drag.IMHWPB.is_content) {
				return true;
			}

			// @todo Content dragging has some major inefficiencies.
			if (self.$current_drag.IMHWPB.is_row) {
				BG.DRAG.Row.dragEnter($entered);
			} else if (self.$current_drag.IMHWPB.is_content) {
				/**
     * Most of Content Dragging is handled when a user enters a container
     * This section allows for content to leave a row.
     */
				var $left_row = $left.closest_context(self.row_selectors_string, self.$master_container);

				// This content left the row and entered the rows parent.
				var content_left_container = !!$left_row.parent().closest($entered).length;
				if (content_left_container) {
					$left = $left.closest_context(self.row_selectors_string, self.$master_container);
					var drop_point = self.before_or_after_drop($left, {
						x: event.originalEvent.clientX,
						y: event.originalEvent.clientY
					});

					if (drop_point == 'before') {
						$left.before(self.$temp_insertion);
					} else {
						// drop_point == 'after'
						$left.after(self.$temp_insertion);
					}
				} else {
					if (false == self.$master_container.has($entered).length) {
						return true;
					}

					// Rewrite to highest.
					var $parent_content = $entered.parents(self.content_selectors_string).last();
					if (true == $parent_content.length) {
						$entered = $parent_content;
					}

					// If entered content.
					if ($entered.is(self.unformatted_content_selectors_string)) {

						// If entered a column that is not my own.
						if ($entered[0] != self.$current_drag[0]) {

							// I've left from a child of this column or the column itself.
							if ($entered.find($left).length || $entered[0] == $left[0]) {
								return true;
							}
						}
					}

					// If you enter the child of a parent
					// And the parent does not have any of your siblings,
					// Remap to the parent.
					var $parent = $entered.closest_context(self.$current_drag.properties.parent, self.$master_container);
					var entered_child_of_parent = $parent.length;
					var parent_has_content = false;
					var $content_elements = [];
					if (entered_child_of_parent) {

						if (self.editting_as_row == false) {
							// If in the standard view, just check for content inside the parent,
							// using the content selector, to find out if it has children.
							var $content_elements = $parent.find(self.content_selectors_string + ', .row:not(.row .row .row)').not('.dragging-imhwpb');

							parent_has_content = $content_elements.length > 0;
						} else {
							var $content_elements = $parent
							// In the edit nested row view we can no longer use the conte selector
							// string because the string defines context which is invalid here in this find.
							.find(self.general_content_selector_string).not('.dragging-imhwpb');

							// @todo This block allows nested rows content to drag back into its column.
							// For some reason the popover menu is inside that column.
							parent_has_content = $content_elements.length > 0;
							if ($content_elements.length == 1 && $content_elements.find('[data-action]')) {
								parent_has_content = false;
							}
						}

						if (parent_has_content == false) {
							$entered = $parent;
						}
					}

					// Entered Column.
					var current_drag_is_parent = $entered.is(self.unformatted_column_selectors_string);

					/*
     * If entering a column,
     * and column is not empty,
     * and you've entered this column from anything outside this column,
     * then Remap to the last element in this column.
     */
					if (current_drag_is_parent && $content_elements.length) {
						if ($entered.find($left).length == false) {
							$entered = $content_elements.last();
							parent_has_content = false;
						}
					}

					var current_drag_is_sibling = $entered.is(self.unformatted_content_selectors_string + ',hr:not(' + self.master_container_id + '.row .row hr)');

					// If you began dragging over the column, and the column has
					// "siblings", ignore the drag over.
					// Any of these cases should be rewritten to handle the
					// appropriate sibling in the container.
					// This event should be handled by dragging over the
					// "siblings".
					if (!current_drag_is_sibling && true == parent_has_content) {
						return true;
					}

					var $current_placement = $entered.closest('.cloned-div-imhwpb');
					var entered_current_drag = $current_placement.length && $current_placement[0] == self.$temp_insertion[0];
					if (entered_current_drag) {
						self.$most_recent_row_enter_add = null;
						return true;
					}

					// If the drag enter element is a sibling, we will insert before or after
					// This handles cases where you are dragging onto a sibling
					// Some work above has been done to rewrite the target under
					// certain circumstances.
					if (current_drag_is_sibling) {

						// Content Siblings
						if ($entered.is_before(self.$temp_insertion)) {
							$entered.before(self.$temp_insertion);
						} else if ($entered.is_after(self.$temp_insertion)) {
							$entered.after(self.$temp_insertion);
						} else {
							$entered.before(self.$temp_insertion);
						}

						// We have just modified the DOM.
						self.$master_container.trigger(self.boldgrid_modify_event);
					}
					// If the drag enter element is a parent, we will append or prepend.
					// This handles cases where you are dragging into a container.
					else if (current_drag_is_parent) {
							var $first_child;

							// Since we are in this block, we know that we have entered a column.
							// First child is the first child of the column.
							$first_child = $entered.find('>:first-child');
							$direct_descendents = $entered.find('> div');

							// If the first child of the column is a div prepend it.
							if ($first_child.length && $direct_descendents.length === 1 && false == $first_child.is(self.column_selectors_string + ", .draggable-tools-imhwpb") && $first_child.is('div')) {

								/**
         * If you are dragging a content element  
         * 		And you are entering a column from outside of the column
         *  	And the column you are entering has a Column > DIV
         *		And this column > div has no current content elements
         * Then that drag enter is remapped to the enter the Column > DIV instead 
         * Element will prepend the other element of the column regardless of entry point.
         */
								$first_child.prepend(self.$temp_insertion);
							} else {
								var drop_point = self.before_or_after_drop($entered, {
									x: event.originalEvent.clientX,
									y: event.originalEvent.clientY
								});
								if (drop_point == 'before') {
									$entered.prepend(self.$temp_insertion);
								} else {
									// drop_point == 'after'
									$entered.append(self.$temp_insertion);
								}
							}

							// We have just modified the DOM.
							self.$master_container.trigger(self.boldgrid_modify_event);
						}
				}
			} else if (self.$current_drag.IMHWPB.is_column && self.$current_drag.IMHWPB.unlock_column) {
				if (self.recent_event && self.recent_event.entered == $entered[0] && self.recent_event.left == $left[0]) {
					return true;
				}

				self.recent_event = {
					'entered': $entered[0],
					'left': $left[0]
				};

				// @todo Figure out of this is good?
				if (self.insertion_time + 20 > new Date().getTime()) {
					return true;
				}

				// OVERWRITE(Column): When you trigger an event into child, rewrite to parent.
				if ($entered.is(self.unformatted_column_selectors_string) == false) {
					if ($entered.is(self.row_selectors_string) == false) {
						var $closest_column = $entered.closest_context(self.column_selectors_string, self.$master_container);
						if ($closest_column.length) {
							$entered = $closest_column;
						}
					}
				}

				// If you are dragging outside of the master container, skip this event.
				if (false == self.$master_container.has($entered).length) {
					return true;
				}

				if ($entered[0] == self.$temp_insertion[0]) {
					return;
				}

				// If you drag entered a child of a column, from the same
				// column,
				// or child of the column, ignore the drag. This happens if the
				// current drag width is small and after your most recent drop your cursor was
				// still inside of a foreign column.

				//If this is happening in the same row.
				if ($entered.siblings().filter(self.$temp_insertion).length) {

					// If entering a column from a column.
					if ($entered.is(self.unformatted_column_selectors_string)) {

						// If entered a column that is not my own.
						if ($entered[0] != self.$current_drag[0]) {

							var $original_drag_leave = $(event.target);

							// I've left from a child of this column or the column itself.
							if ($entered.find($original_drag_leave).length || $entered[0] == $original_drag_leave[0]) {

								return true;
							}
						}
					}
				}

				// Moves element.
				self.move_column_to($entered);
			}
		},

		/**
   * When the user drag enters into any element, store the element that
   * was entered. This is needed because on chrome and safari, there is a
   * bug that causes the relatedTarget that should be attached to the
   * event object in the drag entered to be missing. To circumvent this
   * issue all events where bound to the drag leave and I've recorded the
   * drag enter with this function. This way we have the record of both
   * the drag leave and the drag enter.
   */
		record_drag_enter: function (event) {
			if (!self.$current_drag) {
				return;
			}

			// Prevent Default here causes an issue on IE.
			if (!self.ie_version) {
				event.preventDefault();
			}

			self.entered_target = $(event.target);
		}
	};

	/**
  * Get IE Version.
  *
  * Thanks To: http://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery.
  */
	this.get_ie_version = function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number.
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number.
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number.
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return;
	};

	/**
  * Determine if current browser is safari.
  *
  * Thanks To: http://stackoverflow.com/questions/7944460/detect-safari-browser.
  *
  * @since 1.1.1.3
  *
  * @return boolean.
  */
	this.checkIsSafari = function () {
		return (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
		);
	};

	/**
  * Move the column the passed element.
  */
	this.move_column_to = function ($entered) {
		var current_drag_is_sibling = $entered.is(self.unformatted_column_selectors_string);
		var current_drag_is_parent = $entered.is(self.$current_drag.properties.parent);

		// Calculate Row Size.
		var $new_row = $entered.closest_context(self.row_selectors_string, self.$master_container);
		var $current_row = self.$temp_insertion.closest_context(self.row_selectors_string, self.$master_container);

		var row_size = self.find_row_size($new_row);
		if ($new_row.length && $current_row[0] != $new_row[0]) {
			if (current_drag_is_parent && row_size >= self.max_row_size) {
				return false;
			}

			// If your dragging into a row that is not the original row,
			// Restore the state of the previous row, and store the
			// state of the new row.
			/** An IE FIX * */
			/**
    * Temp insertion is deleted when row is replaced on IE
    * only*
    */
			var temp_insertion = self.$temp_insertion[0].innerHTML;
			if (self.restore_row) {
				// Restore.
				$current_row.html(self.restore_row);
				self.$temp_insertion.html(temp_insertion);
			}

			var dragging_out_of_original = self.$current_drag.IMHWPB['original_row'] != $new_row[0];
			// Store current row only if its not the original row. That row will not be restored.
			if (dragging_out_of_original) {
				self.restore_row = $new_row.html();
			} else {
				self.restore_row = null;
			}

			// IF the row has enough room for your current drag item,
			// just place the item.
			var row_has_room = row_size + self.$current_drag.IMHWPB['column_size'] <= self.max_row_size;
			if (false == row_has_room && dragging_out_of_original) {

				// Use the rest of the space if row is partially empty.
				var remaining_row_space = self.max_row_size - row_size;
				var column_size = null;
				var max_capacity = 9;
				if (remaining_row_space > 0) {
					// Row already has enough room for column, do not transform.
					column_size = remaining_row_space;
				} else if ($new_row.find(self.immediate_column_selectors_string).length <= max_capacity) {
					// The new column will be a one, make room
					// Transform the row to allow for the size of the
					// row. (Reduce row by 3).
					column_size = 3;

					if (self.$current_drag.IMHWPB['column_size'] < column_size) {
						column_size = self.$current_drag.IMHWPB['column_size'];
					}

					for (var i = 0; i < column_size; i++) {
						self.decrease_row_size($new_row);
					}
				}

				if (column_size) {
					// Set the column Size.
					self.change_column_size(self.$temp_insertion, null, column_size);
				} else {
					// The row does not have room for the column.
					self.restore_row = null;
					return true;
				}
			} else {
				// Set the column Size.
				self.change_column_size(self.$temp_insertion, null, self.$current_drag.IMHWPB['column_size']);
			}

			if (current_drag_is_sibling) {
				$entered.before(self.$temp_insertion);
			} else {
				$new_row.append(self.$temp_insertion);
			}
			self.record_recent_column_insertion();
		} else if (current_drag_is_sibling) {

			// If dragging into new row.
			if ($entered.is_before(self.$temp_insertion)) {
				$entered.before(self.$temp_insertion);
			} else {
				$entered.after(self.$temp_insertion);
			}
			self.record_recent_column_insertion();
		}
	};

	/**
  * Set the time at which a column was inserted Record the columns insertion.
  */
	this.record_recent_column_insertion = function () {
		self.recent_event = {};
		self.insertion_time = new Date().getTime();
		self.$master_container.trigger(self.boldgrid_modify_event);
	};

	/**
  * Check to see if a recent drag event was triggered at the location
  * Prevents an event from occuring at teh same location as an event that
  * just occured.
  */
	this.prevent_duplicate_location_events = function (event) {
		var current_drag_loc = [event.originalEvent.pageX, event.originalEvent.pageY];

		var prevent;
		// Filter Duplicate Events.
		if (self.array_equal(self.current_drag_enter_event_loc, current_drag_loc)) {
			prevent = true;
		} else {
			self.current_drag_enter_event_loc = current_drag_loc;
			prevent = false;
		}
		return prevent;
	};

	this.createEmptyRow = function () {
		return $('<div class="row"><div class="col-md-12"></div></div>');
	};

	this.postAddRow = function ($empty_row) {
		// The following line was leaving garbage in undo history.
		//$empty_row.addClass( 'added-element' );
		setTimeout(function () {
			self.$master_container.find('.added-element').removeClass('added-element');
		}, 1000);

		self.$master_container.trigger(self.add_row_event, $empty_row.find('.col-md-12'));
	};

	this.insertEmptyRow = function ($currentNode, $empty_row) {
		var $insertBefore, curNode, $parentRow;

		// If clicked on add row.
		if ($currentNode && $currentNode.closest('.draggable-tools-imhwpb').length) {
			$insertBefore = $currentNode.closest('.draggable-tools-imhwpb');
		}

		// If current cursor inside of a row.
		if (!$insertBefore || !$insertBefore.length && tinymce && tinymce.activeEditor) {
			curNode = tinymce.activeEditor.selection.getNode();
			if (curNode) {
				curNode = $(curNode);
				$parentRow = curNode.parents('.row').last();

				if ($parentRow.length) {
					$insertBefore = $parentRow;
				}
			}
		}

		// Otherwise put at top of page.
		if (!$insertBefore || !$insertBefore.length) {
			self.$body.prepend($empty_row);
		} else {
			$insertBefore.before($empty_row);
		}
	};

	var alignColumn = function ($popover, alignment) {
		var $column = $popover.closest('.draggable-tools-imhwpb').next();

		$column.removeClass('align-column-top align-column-bottom align-column-center');

		if (alignment) {
			$column.addClass('align-column-' + alignment);
		}

		$popover.closest('.popover-menu-imhwpb').addClass('hidden');
	};

	/**
  * An object with the actions that occur when a user clicks on the options
  * in the popover menu.
  */
	this.menu_actions = {

		generalMacro: function (e) {
			e.stopPropagation();

			var $this = $(this),
			    controlName = $this.data('action'),
			    $element = $this.closest('.draggable-tools-imhwpb').next();

			$element.click();
			BG.CONTROLS[controlName].openPanel();
		},

		alignTop: function () {
			alignColumn($(this), 'top');
		},

		alignBottom: function () {
			alignColumn($(this), 'bottom');
		},

		alignCenter: function () {
			alignColumn($(this), 'center');
		},

		alignDefault: function () {
			alignColumn($(this));
		},

		/**
   * The delete event for all element types.
   */
		delete_element: function (event) {
			event.preventDefault();
			var $tools = $(this).closest('.draggable-tools-imhwpb');
			$tools.next().remove();
			$tools.remove();
			self.$master_container.trigger(self.delete_event);
		},
		unnest_row: function (event) {
			var $element = $(this).closest('.draggable-tools-imhwpb').next();
			if (!$element.length) {
				return;
			}
			$($element[0].outerHTML).insertBefore($element.parent().closest('.row'));
			self.wp_media_modal_action(event, $element);
		},
		nest_row: function (event) {
			return;
		},
		nest_row_old: function (event) {
			var $element = $(this).closest('.draggable-tools-imhwpb').next();
			if (!$element.length) {
				return;
			}

			// Look Before.
			var $row_to_nest_in = $element.prevAll('.row').eq(0);
			if (!$row_to_nest_in.length) {
				//Look After
				$row_to_nest_in = $element.nextAll('.row').eq(0);
			}

			// Not Found?
			if (!$row_to_nest_in.length) {
				//Create row and nest it
				$row_to_nest_in = $('<div class="row"><div class="col-md-8"></div></div>');
				self.$body.prepend($row_to_nest_in);
			}

			// Find Column.
			var $column_to_nest_in = $row_to_nest_in.find(self.general_column_selectors_string).eq(0);
			if (!$column_to_nest_in.length) {
				$column_to_nest_in = $("<div class='col-md-8'></div>");
				$row_to_nest_in.prepend($column_to_nest_in);
			}

			$column_to_nest_in.prepend($element[0].outerHTML);
			// Focus element scroll.
			// Need to trigger event.
		},

		add_row: function (e) {
			var $empty_row, $target;

			if (e) {
				$target = $(this);
			}

			$empty_row = self.createEmptyRow();
			self.insertEmptyRow($target, $empty_row);
			self.postAddRow($empty_row);
		},

		/**
   * Adding a column to a row. Available from the row popovers.
   */
		add_column: function (event) {
			event.preventDefault();

			var min_row_size = 0,
			    $current_click = $(this),
			    $row = $current_click.closest('.draggable-tools-imhwpb').next(),
			    row_size = self.find_row_size($row),
			    $new_column;

			//If this row is empty( only has a br tag ) make sure its blank before adding a column
			var $children = $row.find('> *');
			if ($children.length === 1 && $children[0].tagName == 'BR') {
				$row.empty();
			}

			if (row_size < self.max_row_size && row_size >= min_row_size) {
				$new_column = self.fill_row(row_size, $row);
			} else if (row_size >= self.max_row_size) {

				var layout_format = self.get_layout_format($row);
				var layout_transform = self.find_layout_transform(layout_format);
				if (layout_transform && !layout_transform['current']) {
					self.transform_layout($row, layout_transform);
					$new_column = $('<div class="col-md-' + layout_transform['new'] + ' col-sm-12 col-xs-12"></div>');
					$row.append($new_column);
				} else {
					self.decrease_row_size($row);
					$new_column = $('<div class="col-md-1 col-sm-12 col-xs-12"></div>');
					$row.append($new_column);
				}
			}
			$new_column.html('<p><br> </p>');
			$new_column.addClass('added-element');
			setTimeout(function () {
				$new_column.removeClass('added-element');
			}, 1000);

			self.$master_container.trigger(self.add_column_event, $new_column);
			$current_click.closest('.popover-menu-imhwpb').addClass('hidden');
		},

		/**
   * Duplicating an element, available from all element types.
   */
		duplicate: function (event) {
			event.preventDefault();
			var $current_click = $(this);
			var $element = $current_click.closest('.draggable-tools-imhwpb').next();
			var element_type = self.get_element_type($element);
			if (element_type == 'row' || element_type == 'content') {
				var $cloned_element = $element.clone();
				$cloned_element[0].popover = null;
				$element.after($cloned_element);
			} else if (element_type == 'column') {

				var $row = $element.closest_context(self.row_selectors_string, self.$master_container);

				var column_size = self.find_column_size($element);
				var layout_format = self.get_layout_format($row);
				var layout_transform = self.find_layout_transform(layout_format, column_size);
				var new_column_size = 1;

				if (self.find_row_size($row) + column_size <= self.max_row_size) {
					var $new_element = $element.before($element[0].outerHTML);
					$new_element[0].popover = null;
				} else if (layout_transform) {
					if (!layout_transform.current) {
						self.transform_layout($row, layout_transform);
						new_column_size = layout_transform['new'];
						var $new_element = $element.before($element[0].outerHTML);
						$new_element[0].popover = null;
						self.change_column_size($new_element, null, new_column_size);
					} else {

						// Transform current
						self.change_column_size($element, null, layout_transform['current_transform']);

						// Transform New
						new_column_size = layout_transform['new'];
						var $new_element = $element.before($element[0].outerHTML);
						$new_element[0].popover = null;
						self.change_column_size($new_element, null, new_column_size);

						// Transform Additional
						$.each(layout_transform['additional_transform'], function (key, transform) {
							var num_transformed = 0;
							$row.find(self.immediate_column_selectors_string).reverse().each(function () {
								if (num_transformed < transform['count']) {
									var $column = $(this);
									if (self.find_column_size($column) == transform['from']) {
										self.change_column_size($column, null, transform['to']);
										num_transformed++;
									}
								} else {
									return false;
								}
							});
						});
					}
				} else if (column_size % 2 == 0 && column_size) {
					self.change_column_size($element, null, parseInt(column_size / 2));
					var $new_element = $element.before($element[0].outerHTML);
					$new_element[0].popover = null;
					self.change_column_size($new_element, null, parseInt(column_size / 2));
				} else if (self.decrease_row_size($row)) {
					var $new_element = $element.before($element[0].outerHTML);
					$new_element[0].popover = null;
					self.change_column_size($new_element, null, new_column_size);
				}
			}

			self.$master_container.trigger(self.add_column_event);
			$current_click.closest('.popover-menu-imhwpb').addClass('hidden');

			if (self.ie_version) {
				self.refresh_handle_location();
			}
		},

		/**
   * Remove the contents elements of an element.
   */
		clear: function (event) {
			event.preventDefault();
			var $current_click = $(this);
			var $element = $current_click.closest('.draggable-tools-imhwpb').next();
			var type = self.get_element_type($element);

			if (type == 'column') {
				$element.html('<p><br> </p>');
				alignColumn($current_click);
			} else {
				$element.find(':not(' + self.column_selectors_string + '):not( ' + self.row_selectors_string + ')').remove();
			}

			self.refresh_handle_location();
			$current_click.closest('.popover-menu-imhwpb').addClass('hidden');
			self.$master_container.trigger(self.clear_event, $element);
		},

		/**
   * Activate the add media modal
   */
		add_media: function (event) {
			var $clicked_element = $(this);
			self.add_media_event_handler($clicked_element.closest('.draggable-tools-imhwpb').next()[0]);
			return;
		},
		/**
   * Activate the add media modal.
   */
		insert_layout: function (event) {
			var $clicked_element = $(this);
			self.insert_layout_event_handler($clicked_element.closest('.draggable-tools-imhwpb').next()[0]);
			return;
		},
		trigger_action_click: function (event) {
			var $clicked_element = $(this);

			// Native Function do not need to run wp_media_modal_action,
			// However, currently nest-row is the only action that requires that
			// it isn't run.
			if (native_menu_options.indexOf($clicked_element.data('action')) === -1) {
				self.$boldgrid_menu_action_clicked = $clicked_element.closest('.draggable-tools-imhwpb').next()[0];

				self.wp_media_modal_action(event, $clicked_element);
			}

			self.$master_container.trigger(self.boldgrid_modify_event);
		}
	};

	/**
  * Every time that we open the media modal this action should occur.
  */
	this.wp_media_modal_action = function (event, $clicked_element) {
		event.preventDefault();
		$clicked_element.closest('.popover-menu-imhwpb').addClass('hidden');
		self.window_mouse_leave();
	};

	/**
  * Handle the user typing.
  */
	this.typing_events = {
		'start': function () {
			//Remove Popovers
			self.$master_container.find('.draggable-tools-imhwpb').attr('contenteditable', true);
			self.delete_popovers();
			self.$master_container.find('html').addClass('boldgrid-is-typing');
		},
		'end': function () {
			//Add Popovers
			self.validate_markup();
			self.$master_container.find('html').removeClass('boldgrid-is-typing');
			self.update_handles(self.last_hover);
		}
	};

	/**
  * Event that resize the width of a column.
  */
	this.resize_event_map = {

		/**
   * This event is active while the user is moving their mouse with 'mouseup'.
   */
		'mousemove.draggable': function (event, $element) {
			if (!self.resize) {
				var position_x = self.pageX,
				    border_hover = false;
				if (typeof event != 'undefined' && event != null) {
					position_x = event.originalEvent.clientX;
					$element = $(this);
					border_hover = self.get_border_mouse_location($element, position_x);
				}
				if (border_hover && (border_hover.left || border_hover.right)) {
					$element.addClass('resizing-imhwpb');

					if (self.ie_version && tinymce) {
						tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
						tinymce.activeEditor.boldgridResize = true;
					}
				} else {
					$element.removeClass('resizing-imhwpb');

					if (self.ie_version && tinymce) {
						tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
						tinymce.activeEditor.boldgridResize = false;
					}
				}
			}

			// If for some reason drag is still active, remove it.
			if (self.$current_drag) {
				// This was causing issues on firefox drag elements.
				//	self.drag_handlers.end( event );
			}
		},
		/**
   * The event is activates the resize process.
   */
		'mousedown.draggable': function (event) {

			// If they user clicked on drag handle, return
			$target = $(event.target);
			if ($target.closest('.draggable-tools-imhwpb').length) {
				return;
			}

			var $element = $(this);
			var border_hover = self.get_border_mouse_location($element, event.originalEvent.clientX);
			var $sibling = null;

			if (border_hover.left) {
				$sibling = $element.prevAll(self.column_selectors_string).first();
				// Add borders before and after
				$element.addClass('resize-border-left-imhwpb');
			} else if (border_hover.right) {
				$sibling = $element.nextAll(self.column_selectors_string).first();
				// Add borders before and after
				$element.addClass('resize-border-right-imhwpb');
			}

			if (border_hover.left || border_hover.right) {
				if ($sibling.length) {
					$sibling.addClass("content-border-imhwpb");
				}

				self.$master_container.addClass('resizing-imhwpb');
				self.$master_container.find('.resizing-imhwpb').removeClass('resizing-imhwpb');
				self.remove_all_popovers();

				self.$html.addClass('no-select-imhwpb');

				self.resize = {
					'element': $element,
					'sibling': $sibling,
					'left': border_hover.left,
					'right': border_hover.right
				};
			}
		}
	};

	return this;
};

/***/ }),

/***/ "./assets/js/builder/drag/row.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.DRAG.Row = {

		$recentRowElement: [],

		/**
   * The process used when the user drag enters an empty section.
   *
   * @param jQuery $dragEntered.
   * @since 1.3
   */
		dragEnter: function ($dragEntered) {
			$dragEntered = self.remapDragEnter($dragEntered);

			if (self.validateDragEnter($dragEntered)) {
				self.moveIntoSection($dragEntered);
				self.postRowInsert();
			}
		},

		/**
   * The process used when the user mouse position eclipses the edge of another row.
   *
   * @param Coordinate pageY
   * @since 1.3
   */
		dragCursorPosition: function (pageY) {

			var $container = BG.Controls.$container,
			    $current = $container.$current_drag;

			if (self.insertTopBottom(pageY)) {
				return;
			}

			// Check each row end point position.
			$.each($current.IMHWPB.row_pos, function () {
				if (pageY < this.max) {
					if (self.$recentRowElement[0] === this.element[0]) {
						return false;
					}

					self.$recentRowElement = this.element;

					self._reorderRows(this.element);
					self.postRowInsert();
					return false;
				}
			});
		},

		/**
   * After a row is inserted, recalc row positions and save history.
   *
   * @since 1.3
   */
		postRowInsert: function () {
			BG.Controls.$container.recalc_row_pos();
			BG.Controls.$container.trigger(BG.Controls.$container.boldgrid_modify_event);
		},

		/**
   * If drag enter event is a child of a section, set variable to parent section.
   *
   * @since 1.3
   * @param jQuery $dragEntered.
   * @return jQuery $dragEntered.
   */
		remapDragEnter: function ($dragEntered) {
			var $parentSection = $dragEntered.closest('.boldgrid-section');

			if ($parentSection.length) {
				$dragEntered = $parentSection;
			}

			return $dragEntered;
		},

		/**
   * Return a is_valid boolean if this section should perform drag enter event.
   *
   * If Drag Entered is a section.
   *    And Drag Enetered doesnt have any rows in it.
   *    And Section has container.
   *
   * @since 1.3
   * @param jQuery $dragEntered.
   * @return jQuery $dragEntered.
   */
		validateDragEnter: function ($dragEntered) {
			var validDrag;

			validDrag = $dragEntered.hasClass('boldgrid-section') && 0 === $dragEntered.find('.row:not(.dragging-imhwpb,.row .row)').not(BG.Controls.$container.$current_drag).length && 0 !== $dragEntered.find('.container-fluid, .container').length;

			return validDrag;
		},

		/**
   * Move a row into a section without rows.
   *
   * @since 1.3
   * @param jQuery $dragEntered.
   */
		moveIntoSection: function ($dragEntered) {

			// Prepend Row into sections container.
			$dragEntered.find('.container-fluid, .container').first().prepend(BG.Controls.$container.$temp_insertion);
		},

		/**
   * Insert a row before or after another row.
   *
   * @since 1.3
   * @param jQuery $current.
   * @param string type before | after.
   */
		_insertRow: function ($current, type) {
			var $dragElement = BG.Controls.$container.$temp_insertion;

			if ($current.get(0) !== $dragElement[0]) {
				$current[type]($dragElement);
				self.postRowInsert();
			}
		},

		/**
   * If given position is before or after the first and last rows of the page, insert at end or beginning.
   *
   * @since 1.3
   * @param Coordinate pageY.
   * @return boolean rowRepositioned Whether or not we moved an element.
   */
		insertTopBottom: function (pageY) {

			var $container = BG.Controls.$container,
			    rowMinMax = $container.$current_drag.IMHWPB.row_min_max,
			    isTop = pageY < rowMinMax.offset_top,
			    isBottom = pageY > rowMinMax.offset_bottom,
			    placeType = isTop ? 'before' : 'after',
			    queryVal = isTop ? 'first' : 'last',
			    rowRepositioned = false;

			// If cursor is at the top or bottom, place before or after.
			if (isTop || isBottom) {
				self._insertRow($container.get_other_top_level_elements()[queryVal](), placeType);
				rowRepositioned = true;
			}

			return rowRepositioned;
		},

		/**
   * After a reposition event is triggered by the users cursor position on dragover,
   * determine if we will put the current drag before or after the interaction element.
   *
   * @since 1.3
   * @param jQuery $triggerRow.
   */
		_reorderRows: function ($triggerRow) {
			var currentBeforeDrag,
			    currentFarAfter,
			    changingSection,
			    currentAfterDrag,
			    currentFarBefore,
			    $container = BG.Controls.$container,
			    $dragElement = $container.$temp_insertion,
			    $rows = $container.get_other_top_level_elements(),
			    currentIndex = $rows.index($triggerRow),
			    dragIndex = $rows.index($dragElement),
			    position = 'after';

			changingSection = $dragElement.closest('.boldgrid-section')[0] !== $triggerRow.closest('.boldgrid-section')[0];

			// Entered element is before or after drag.
			currentBeforeDrag = currentIndex < dragIndex;
			currentAfterDrag = currentIndex > dragIndex;

			// Entered element is not immediately after or before drag element.
			currentFarAfter = currentAfterDrag && currentIndex - 1 !== dragIndex;
			currentFarBefore = currentBeforeDrag && currentIndex + 1 !== dragIndex;

			if ((currentBeforeDrag || currentFarAfter) && !currentFarBefore) {
				position = 'before';
			}

			/*
    * If drag is on top
    * and drag is changing sections
    * place before.
    */
			if (currentAfterDrag && changingSection) {
				position = 'before';
			}

			/*
    * If drag is on bottom
    * and drag is changing sections
    * place after.
    */
			if (currentBeforeDrag && changingSection) {
				position = 'after';
			}

			$triggerRow[position]($dragElement);
		}

	};

	self = BOLDGRID.EDITOR.DRAG.Row;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/drag/section.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	self = BG.DRAG.Section = {

		/**
   * @var Object currentDrag Elements and data about the current drag.
   * @since 1.2.7
   */
		currentDrag: false,

		/**
   * @var jQuery $container iFrame.
   * @since 1.2.7
   */
		$container: null,

		/**
   * @var jQuery $dragHelper cursor indicator.
   * @since 1.2.7
   */
		$dragHelper: null,

		/**
   * @var array sectionLocations. Y locations.
   * @since 1.2.7
   */
		sectionLocations: [],

		/**
   * Section dragging.
   *
   * @since 1.2.7
   * @param jQuery $container iFrame.
   */
		init: function ($container) {
			self.$container = $container;
			self.$dragHelper = self.renderHelpers();
			self.bind();
		},

		/**
   * Attach the mark-up to the DOM.
   *
   * @since 1.2.7
   * @return jQuery $dragHelper.
   */
		renderHelpers: function () {
			var $dragHelper = $('<div id="boldgrid-drag-pointer"></div>');
			self.$container.find('html').append($dragHelper);
			return $dragHelper;
		},

		/**
   * Check if the user is currenlty dragging.
   *
   * @since 1.4
   */
		isDragging: function () {
			return !!BG.DRAG.Section.currentDrag;
		},

		/**
   * Bind all events used for dragging.
   *
   * @since 1.2.7
   */
		bind: function () {
			var exit = function () {
				return false;
			};

			self.$container.on('dragstart', '.dragging-section', exit).on('mousedown', '.dragging-section .boldgrid-section', self.start).on('mousemove', '.dragging-section', self.over).on('mouseup dragend', '.dragging-section', self.end).on('mousemove', '.dragging-section', self.overHelper);
		},

		/**
   * Position the cursor helper on mouse move.
   *
   * @since 1.2.7
   * @param Event e.
   */
		overHelper: function (e) {
			if (self.currentDrag || self.showDragHelper) {

				// 25 is polling delay.
				if (!self.lastPosEvent || self.lastPosEvent + 25 <= e.timeStamp) {
					self.lastPosEvent = e.timeStamp;
					self.positionHelper(e.originalEvent, self.$dragHelper);
				}
			}
		},

		/**
   * End the drag progress.
   *
   * @since 1.2.7
   * @param Event e.
   */
		end: function () {
			if (self.currentDrag) {
				self.currentDrag.$element.removeClass('section-drag-element');
				self.currentDrag = false;
				self.$container.$html.removeClass('no-select-imhwpb section-dragging-active');
				tinymce.activeEditor.undoManager.add();
				BG.CONTROLS.Section.updateHtmlSize();
			}
		},

		/**
   * Drag motion. The process of sections interacting with other sections.
   *
   * @since 1.2.7
   * @param Event e.
   */
		drag: function (e) {
			var mousePosition = e.originalEvent.pageY,
			    insertAfter = null;

			if (!self.sectionLocations.length) {
				return;
			}

			$.each(self.sectionLocations, function () {
				if (this.midPoint < mousePosition) {
					insertAfter = this;
				}
			});

			if (!insertAfter && mousePosition > self.sectionLocations[self.sectionLocations.length - 1].midPoint) {
				insertAfter = self.sectionLocations[self.sectionLocations.length - 1];
			}

			if (!insertAfter && mousePosition < self.sectionLocations[0].midPoint) {
				self.sectionLocations[0].$section.before(self.currentDrag.$element);
				self.calcSectionLocs();
			}

			if (insertAfter) {
				insertAfter.$section.after(self.currentDrag.$element);
				self.calcSectionLocs();
			}
		},

		/**
   * While the user is moving the mouse and drag has been initiated.
   *
   * @since 1.2.7
   * @param Event e.
   */
		over: function (e) {
			if (self.currentDrag) {
				if (!self.lastDragEvent || self.lastDragEvent + 100 <= e.timeStamp) {
					self.lastDragEvent = e.timeStamp;
					self.drag(e);
				}
				/*
    If ( ! self.lastScrollEvent || self.lastScrollEvent + 20 <= e.timeStamp ) {
    	self.lastScrollEvent = e.timeStamp;
    		// If within 50 px from the bottom scroll down.
    	if ( $( window ).height() - e.pageY < 50 ) {
    		window.scrollBy( 0, 10 );
    		// If within 20% from the top scroll up.
    	} else if ( ( e.pageY / $( window ).height() ) < 0.2 ) {
    		window.scrollBy( 0, -10 );
    	}
    }*/
			}
		},

		/**
   * Place the helper at the cursor location.
   *
   * @since 1.2.7
   * @param Event e.
   */
		positionHelper: function (e, $dragHelper) {

			// 15 is the offset from the cursor.
			$dragHelper.css({
				'top': e.pageY - 15,
				'left': e.pageX - 15
			});
		},

		/**
   * Calculate all section locations. Main calcs used for dragging.
   *
   * @since 1.2.7
   */
		calcSectionLocs: function () {
			var locs = [];

			self.$container.$body.find('> .boldgrid-section').each(function () {
				var pos = this.getBoundingClientRect(),
				    midPoint = (pos.bottom - pos.top) / 2 + pos.top;

				locs.push({
					$section: $(this),
					midPoint: midPoint
				});
			});

			self.sectionLocations = locs;
		},

		/**
   * Drag Start. On Click.
   *
   * @since 1.2.7
   */
		start: function (e) {
			self.positionHelper(e.originalEvent, self.$dragHelper);
			self.startDrag($(this));
		},

		/**
   * Start the dragging process.
   *
   * @since 1.4
   *
   * @param {jQuery} $dragElement Element to be dragged.
   */
		startDrag: function ($dragElement) {
			var $this = $dragElement;

			self.currentDrag = { $element: $this };

			self.currentDrag.$element.addClass('section-drag-element');
			self.$container.find('html').addClass('section-dragging-active');
			self.$container.$html.addClass('no-select-imhwpb');
			self.$container.$body.removeAttr('contenteditable');
			self.$dragHelper.css('display', '');
			self.calcSectionLocs();
			BG.CONTROLS.Section.updateHtmlSize();
		}
	};
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/feedback.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.Feedback = {

		init: function () {
			self.$input = $('[name="boldgrid-record-feedback"]');
			self.bindEvents();
		},

		bindEvents: function () {
			$(window).on('boldgrid_added_gridblock', self.addGridblock);
		},

		/**
   * Add an action to feedback.
   *
   * @since 1.5
   *
   * @param {object} options Object to store.
   */
		add: function (options) {
			var val = self.$input.val() || '[]';
			val = JSON.parse(val);
			val.push(options);
			self.$input.attr('value', JSON.stringify(val));
		},

		/**
   * Record feedback when gridblock added.
   *
   * @since 1.5
   *
   * @param {Event} event
   * @param {Object} data
   */
		addGridblock: function (event, data) {
			if (data && data.template) {
				self.add({
					'action': 'installed_gridblock',
					'data': {
						'template': data.template
					}
				});
			}
		}
	};

	self = BOLDGRID.EDITOR.Feedback;
	BOLDGRID.EDITOR.Feedback.init();
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/add.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles adding gridblocks.
 */
(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		$window: $(window),

		init: function () {
			self.setupInsertClick();
		},

		/**
   * Bind listener for the gridblock button add.
   *
   * @since 1.4
   */
		setupInsertClick: function () {
			$('.boldgrid-zoomout-section').on('click', '.add-gridblock', self.onGridblockClick);
		},

		/**
   * Upon clicking the griblock add button, insert placeholder and replace the placeholder with a gridblock.
   *
   * @since 1.4
   */
		onGridblockClick: function () {
			var $placeHolder,
			    $this = $(this),
			    gridblockId = $this.closest('.gridblock').attr('data-id');

			$placeHolder = self.insertPlaceHolder(gridblockId);
			self.replaceGridblock($placeHolder, gridblockId);
		},

		/**
   * Replace a placeholder gridblock with a gridblock from config.
   *
   * @since 1.4
   *
   * @param  {jQuery} $placeHolder Element created to show loading graphic.
   * @param  {integer} gridblockId  Index from gridblocks config.
   */
		replaceGridblock: function ($placeHolder, gridblockId) {
			var selectedHtml = BG.GRIDBLOCK.Create.getHtml(gridblockId);
			IMHWPB.tinymce_undo_disabled = true;
			self.$window.trigger('resize');

			// Insert into page aciton.
			if ('string' !== typeof selectedHtml) {
				selectedHtml.always(function (html) {

					//Ignore history until always returns.
					self.sendGridblock(html, $placeHolder, gridblockId);
				});
			} else {
				self.sendGridblock(selectedHtml, $placeHolder, gridblockId);
			}
		},

		/**
   * Add a placeholder to the top of the page.
   *
   * @since 1.4
   *
   * @param  {integer} gridblockId Index from gridblocks config.
   * @return {jQuery}              Element created to show loading graphic.
   */
		insertPlaceHolder: function (gridblockId) {
			var $placeHolder = BG.GRIDBLOCK.configs.gridblocks[gridblockId].getPreviewPlaceHolder();
			IMHWPB.WP_MCE_Draggable.draggable_instance.$body.prepend($placeHolder);
			return $placeHolder;
		},

		/**
   * Send Gridblock to the view
   *
   * @since 1.4
   *
   * @param  {string} html         Html to insert.
   * @param  {jQuery} $placeHolder Element created to show loading graphic.
   */
		sendGridblock: function (html, $placeHolder, gridblockId) {
			var $inserting = $(html),
			    draggable = IMHWPB.WP_MCE_Draggable.draggable_instance;

			if (!$inserting || !draggable) {
				send_to_editor($inserting[0].outerHTML);
			}

			$placeHolder.replaceWith($inserting);
			draggable.validate_markup();

			tinymce.activeEditor.fire('setContent');
			tinymce.activeEditor.focus();

			setTimeout(function () {
				BG.CONTROLS.Add.scrollToElement($inserting, 0);
			});

			self.$window.trigger('resize');

			IMHWPB.tinymce_undo_disabled = false;
			tinymce.activeEditor.undoManager.add();

			self.$window.trigger('boldgrid_added_gridblock', BG.GRIDBLOCK.configs.gridblocks[gridblockId]);
		}

	};

	BG.GRIDBLOCK.Add = self;
	$(BG.GRIDBLOCK.Add.init);
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/category.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function () {
	'use strict';

	var BGGB = BOLDGRID.EDITOR.GRIDBLOCK,
	    self = {
		currentCategory: null,

		init: function () {
			self.onSelectChange();
		},

		/**
   * Setup the action of changing the category filter.
   *
   * @since 1.5
   */
		onSelectChange: function () {
			var $select = BGGB.View.$gridblockNav.find('.boldgrid-gridblock-categories select');

			self.currentCategory = $select.val();
			$select.on('change', function () {
				self.currentCategory = $select.val();
				self.showByCategory();
			});
		},

		/**
   * Check if we can display the grid block configuration.
   *
   * @since 1.5
   *
   * @param  {Object} gridblockConfig Configruation for a Gridblock.
   * @return {boolean}                Whether or not the gridblock configuration can be displayed.
   */
		canDisplayGridblock: function (gridblockConfig) {
			var category = BGGB.Category.currentCategory || 'all';
			return gridblockConfig.type === category || 'all' === category && 'saved' !== gridblockConfig.type;
		},

		/**
   * Show the Gridblocks for the selected category.
   *
   * @since 1.5
   */
		showByCategory: function () {
			var visibleGridblocks,
			    $gridblocks = BGGB.View.$gridblockSection.find('.gridblock'),
			    $wrapper = BGGB.View.$gridblockSection.find('.gridblocks');

			$wrapper.attr('filter', self.currentCategory);

			if ('all' === self.currentCategory) {
				$gridblocks.filter(':not(.gridblock-loading)').filter(':not([data-type="saved"])').show();

				BGGB.View.$gridblockSection.scrollTop(0);
			} else {
				visibleGridblocks = $gridblocks.hide().filter('[data-type="' + self.currentCategory + '"]:not(.gridblock-loading)').show().length;

				BGGB.View.$gridblockSection.scrollTop(0);

				// If less than 4 gridblocks are showing, render more gridblocks.
				if (visibleGridblocks < 4) {
					BGGB.View.updateDisplay();
				}
			}
		},

		/**
   * Return the selected category.
   *
   * @since 1.5
   *
   * @return {string} Requested category.
   */
		getSearchType: function () {
			return 'all' !== self.currentCategory ? self.currentCategory : null;
		}

	};

	BGGB.Category = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/create.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles adding gridblocks.
 */
(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		$window: $(window),

		/**
   * Grab the markup for the selected Gridblock
   *
   * @since 1.4
   *
   * @param  {number} gridblockId Unique id for a gridblock.
   * @return {string}             Html requested.
   */
		getHtml: function (gridblockId) {
			var html = '',
			    gridblockData = {};

			if (BG.GRIDBLOCK.configs.gridblocks[gridblockId]) {
				gridblockData = BG.GRIDBLOCK.configs.gridblocks[gridblockId];
			}

			if (self.getDynamicElements(gridblockData).length) {
				html = self.installImages(gridblockData);
			} else {
				html = self.getStaticHtml(gridblockData);
			}

			return html;
		},

		/**
   * If the gridblock doesn't have any images to replace, just return the html.
   *
   * @since 1.4
   *
   * @param  {object} gridblockData Get the static html.
   * @return {string}               Html of gridblock.
   */
		getStaticHtml: function (gridblockData) {
			var html = gridblockData.html;

			if (gridblockData.$html) {
				html = gridblockData.$html[0].outerHTML;
			}

			return html;
		},

		/**
   * Get all elements that need images replaced.
   *
   * @since 1.5
   *
   * @param  {Object} gridblockData Single gridblock info.
   * @return {jquery}               Collection of elements that need to have images replaced.
   */
		getDynamicElements: function (gridblockData) {
			var $dynamicElements = gridblockData.$html.find('[dynamicImage]');
			if (gridblockData.$html[0].hasAttribute('dynamicImage')) {
				$dynamicElements.push(gridblockData.$html);
			}

			return $dynamicElements;
		},

		/**
   * Get the markup for pages that need images replaced.
   *
   * @since 1.5
   *
   * @param  {object} gridblockData Gridblock info.
   * @return {$.Deffered}           Deferred Object.
   */
		installImages: function (gridblockData) {
			var $deferred = $.Deferred(),
			    completed = 0,
			    $imageReplacements = self.getDynamicElements(gridblockData);

			$imageReplacements.each(function () {
				var $element = $(this);

				$.ajax({
					type: 'post',
					url: ajaxurl,
					dataType: 'json',
					timeout: 10000,
					data: {
						action: 'boldgrid_canvas_image',
						boldgrid_gridblock_image_ajax_nonce: BoldgridEditor.grid_block_nonce,
						image_data: BG.GRIDBLOCK.Image.getEncodedSrc($element)
					}
				}).done(function (response) {
					$element.removeAttr('dynamicimage');

					if (response && response.success) {
						BG.GRIDBLOCK.Image.addImageUrl($element, response.data);
					}

					completed++;
					if (completed === $imageReplacements.length) {
						$deferred.resolve(gridblockData.getHtml());
					}
				}).fail(function () {
					completed++;
					if (completed === $imageReplacements.length) {
						$deferred.resolve(gridblockData.getHtml());
					}
				});
			});

			return $deferred;
		}
	};

	BG.GRIDBLOCK.Create = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/delete.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		$mceContainer: null,
		$deleteIcon: null,

		/**
   * Initialize the drag.
   *
   * @since 1.5
   */
		init: function () {
			self.$mceContainer = BG.Controls.$container;
			self.$deleteIcon = self.$mceContainer.find('.delete-icon-wrap');
			self.bindEvents();
		},

		/**
   * Bind all events.
   *
   * @since 1.5
   */
		bindEvents: function () {
			self.$mceContainer.on('mouseenter', '.dragging-section .boldgrid-section', self.section.mouseEnter).on('mouseleave', '.dragging-section .boldgrid-section', self.section.mouseLeave).on('click', '.delete-icon-wrap', self.icon.click).on('mouseenter', '.delete-icon-wrap', self.icon.mouseEnter).on('mouseleave', '.delete-icon-wrap', self.icon.mouseLeave);
		},

		section: {
			/**
    * When the users mouse enters the section.
    */
			mouseEnter: function () {
				var $this = $(this),
				    rect = this.getBoundingClientRect();

				self.$deleteIcon.css({
					'left': rect.right,
					'display': 'block',
					'top': rect.top + rect.height / 2
				});

				self.$deleteIcon.$section = $this;
			},
			/**
    * When the users mouse leaves the section.
    * @param  {event} e Event
    */
			mouseLeave: function (e) {
				var $relatedTarget = $(e.relatedTarget || e.toElement);
				if (false === $relatedTarget.hasClass('delete-icon')) {
					$(this).removeClass('delete-overlay');
					self.$deleteIcon.hide();
				}
			}
		},

		icon: {
			/**
    * When the users mouse enters the icon.
    */
			mouseEnter: function () {
				self.$deleteIcon.$section.addClass('delete-overlay');
			},

			/**
    * When the users mouse leaves the icon.
    */
			mouseLeave: function () {
				self.$deleteIcon.$section.removeClass('delete-overlay');
				self.$deleteIcon.hide();
			},

			/**
    * When the user clicks on the delete icon.
    */
			click: function () {
				self.$deleteIcon.$section.removeClass('delete-overlay');
				self.$deleteIcon.hide();
				self.$deleteIcon.$section.remove();
				tinymce.activeEditor.undoManager.add();
				BG.GRIDBLOCK.Add.$window.trigger('resize');
			}
		}

	};

	BG.GRIDBLOCK.Delete = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/drag.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles adding gridblocks.
 */
(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		$body: $('body'),
		$window: $(window),
		$dragHelper: null,
		currentDrag: null,
		$mceContainer: null,

		/**
   * Initialize the drag.
   *
   * @since 1.4
   */
		init: function () {
			self.$mceContainer = BG.Controls.$container;
			self.$dragHelper = self.createDragHelper();
			self.bindEvents();
		},

		/**
   * Create drag helper.
   *
   * @since 1.4
   */
		createDragHelper: function () {
			var $dragHelper = $('<div id="boldgrid-drag-pointer"></div>').hide();
			self.$body.append($dragHelper);
			return $dragHelper;
		},

		/**
   * Bind all events.
   *
   * @since 1.4
   */
		bindEvents: function () {
			var exit = function () {
				return false;
			};

			// Bind mouse event to the parent.
			$('html').on('dragstart', '.gridblock', exit).on('mousemove', '.section-dragging-active', self.mouseMove).on('mouseup', '.section-dragging-active', self.endDrag).on('mouseleave', '.section-dragging-active', self.endDrag).on('mousedown', 'body.boldgrid-zoomout .gridblock', self.startDrag);

			// Bind event to the iframe.
			self.$mceContainer.on('mouseup', '.dragging-section.dragging-gridblock-iframe', self.endDrag).on('mousemove', '.dragging-section.dragging-gridblock-iframe', self.overIframe).on('mouseenter', '.dragging-section.dragging-gridblock-iframe > body', self.enterIframeBody).on('mouseleave', '.dragging-section.dragging-gridblock-iframe', self.leaveIframeBody);
		},

		/**
  * Start iFrame dragging.
  *
  * @since 1.4
  */
		enterIframeBody: function () {
			if (!BG.DRAG.Section.isDragging()) {
				self.$mceContainer.find('body').append(self.currentDrag.$element);
				BG.DRAG.Section.startDrag(self.currentDrag.$element);
			}
		},

		/**
   * When you leave mce html end mce drag and remove html.
   *
   * @since 1.4
   */
		leaveIframeBody: function () {
			if (BG.DRAG.Section.isDragging()) {
				BG.DRAG.Section.end();
				self.currentDrag.$element.detach();
			}
		},

		/**
   * While mousing over iframe while this.drag initiated, the the parent drag helper.
   *
   * @since 1.4
   */
		overIframe: function () {
			if (self.currentDrag) {
				self.$dragHelper.hide();
				BG.DRAG.Section.showDragHelper = true;
				BG.DRAG.Section.$dragHelper.show();
			}
		},

		/**
   * End the dragging process on the parent. (Also ends child).
   *
   * @since 1.4
   */
		endDrag: function () {
			if (self.currentDrag) {
				IMHWPB.tinymce_undo_disabled = false;
				BG.DRAG.Section.$dragHelper.hide();
				BG.DRAG.Section.showDragHelper = false;
				BG.DRAG.Section.end();
				self.$dragHelper.hide();
				self.installGridblock();
				self.$body.removeClass('section-dragging-active');
				self.currentDrag.$gridblockUi.removeClass('dragging-gridblock');
				self.$mceContainer.$html.removeClass('dragging-gridblock-iframe');
				self.currentDrag = false;
			}
		},

		/**
   * Swap the preview html with loading html.
   *
   * @since 1.4
   */
		installGridblock: function () {
			if (self.$mceContainer.$body.find(self.currentDrag.$element).length) {
				BG.GRIDBLOCK.Add.replaceGridblock(self.currentDrag.$element, self.currentDrag.gridblockId);
				self.currentDrag.$element.removeClass('dragging-gridblock-placeholder');
			}
		},

		/**
   * Start the drag process.
   *
   * @since 1.4
   *
   * @param  {DOMEvent} e [description]
   */
		startDrag: function (e) {
			var config,
			    $this = $(this),
			    gridblockId = $this.attr('data-id');

			if (false === isTargetValid(e)) {
				return;
			}

			IMHWPB.tinymce_undo_disabled = true;
			config = BG.GRIDBLOCK.configs.gridblocks[gridblockId];
			self.currentDrag = {
				$gridblockUi: $this,
				gridblockId: gridblockId,
				gridblock: config,
				$element: config.getPreviewPlaceHolder()
			};

			// Add enable classes.
			self.currentDrag.$gridblockUi.addClass('dragging-gridblock');
			self.$mceContainer.$html.addClass('dragging-gridblock-iframe');
			self.currentDrag.$element.addClass('dragging-gridblock-placeholder');
			self.$body.addClass('section-dragging-active');

			// Init the helper for the process.
			BG.DRAG.Section.positionHelper(e, self.$dragHelper);
			self.$dragHelper.show();
		},

		/**
   * When you mouse move within the parent.
   *
   * @since 1.4
   *
   * @param {DOMEvent} e
   */
		mouseMove: function (e) {
			self.$dragHelper.show();
			BG.DRAG.Section.$dragHelper.hide();
			BG.DRAG.Section.positionHelper(e, self.$dragHelper);
		}
	};

	/**
  * Check if a drag start target is valid.
  *
  * @return {Boolean} Is Valid?
  */
	function isTargetValid(e) {
		var valid = true,
		    $target = $(e.target || e.srcElement);

		if ($target && $target.hasClass('add-gridblock')) {
			valid = false;
		}

		return valid;
	}

	BG.GRIDBLOCK.Drag = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/filter.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		configs: BoldgridEditor.gridblocks,

		removedGridlocks: {},

		/**
   * Setup the GridBlock configuration.
   *
   * @since 1.4
   */
		setupConfigs: function () {
			BG.GRIDBLOCK.configs = {};
			BG.GRIDBLOCK.configs.gridblocks = {};

			$.each(self.configs, function (gridblockId) {
				this.html = self.unsetImageUrls(this.html);
				this.$html = $(this.html);

				self.removeInvalidGridblocks(this, gridblockId);
			});

			self.setConfig();
		},

		/**
   * Removing image src urls.
   *
   * @since 1.5
   *
   * @param  {string} html HTML to update.
   * @return {string}      Return html string.
   */
		unsetImageUrls: function (html) {
			var matches = html.match(/<img.*?>/g);
			matches = matches || [];

			_.each(matches, function (match) {
				html = html.replace(match, match.replace(/\ssrc=/, ' data-src='));
			});

			return html;
		},

		/**
   * Schedule any invalid gridblocks for removal.
   *
   * @since 1.4
   *
   * @param  {Object} gridblock   Config for Gridblock.
   * @param  {integer} gridblockId Index of Gridblock
   */
		removeInvalidGridblocks: function (gridblock, gridblockId) {
			var isSimpleGridblock = self.isSimpleGridblock(gridblock.$html);

			if (isSimpleGridblock) {
				self.removeGridblock(gridblockId);
			}
		},

		/**
   * Config Methods.
   *
   * These are merged into the config object.
   *
   * @type {Object}
   */
		configMethods: {

			/**
    * Get the jQuery HTML Object.
    * @return {jQuery} HTML to be added to the page.
    */
			getHtml: function () {
				return this.$html[0].outerHTML;
			},

			/**
    * Create a placeholder based on the preview object.
    * @return {jQuery} Element to preview with loading element nested.
    */
			getPreviewPlaceHolder: function () {
				var $clone = this.$html.clone();
				$clone.prepend(wp.template('boldgrid-editor-gridblock-loading')());

				return $clone;
			}
		},

		/**
   * Store the configuration into a new object.
   *
   * @since 1.4
   */
		setConfig: function () {
			$.each(self.configs, function (gridblockId) {
				if (!self.removedGridlocks[gridblockId]) {
					delete this.html;
					delete this['preview-html'];
					this.gridblockId = gridblockId;
					this.uniqueMarkup = self.createUniqueMarkup(this.$html);
					_.extend(this, self.configMethods);
					BG.GRIDBLOCK.configs.gridblocks[gridblockId] = this;
				}
			});
		},

		/**
   * Add a single Gridblock Object to the config.
   *
   * @since 1.4
   *
   * @param {Object} gridblockData Gridblock Info.
   * @param {number} index         Index of gridblock in api return.
   */
		addGridblockConfig: function (gridblockData, index) {
			var gridblockId = 'remote-' + index;

			gridblockData.dynamicImages = true;
			gridblockData.gridblockId = gridblockId;
			gridblockData.$html = gridblockData['html-jquery'];

			delete gridblockData.html;
			delete gridblockData['preview-html'];
			delete gridblockData['html-jquery'];
			delete gridblockData['preview-html-jquery'];

			_.extend(gridblockData, self.configMethods);
			BG.GRIDBLOCK.configs.gridblocks[gridblockId] = gridblockData;
		},

		/**
   * Remove gridblock from config.
   *
   * @since 1.4
   *
   * @param  {number} gridblockId Index of gridblock.
   */
		removeGridblock: function (gridblockId) {
			self.removedGridlocks[gridblockId] = self.configs[gridblockId];
		},

		/**
   * Create a string that will be used to check if 2 griblocks are the sameish.
   *
   * @since 1.4
   *
   * @param  {jQuery} $element Element to create string for.
   * @return {string}          String with whitespace rmeoved.
   */
		createUniqueMarkup: function ($element) {
			$element = $element.clone();
			$element.find('img').removeAttr('src').removeAttr('data-src').removeAttr('class');
			return $element[0].outerHTML.replace(/\s/g, '');
		},

		/**
   * Swap image with a placeholder from placehold.it
   *
   * @since 1.0
   */
		setPlaceholderSrc: function ($this) {

			// Default to 300.
			var width = $this.attr('data-width') ? $this.attr('data-width') : '300',
			    height = $this.attr('data-height') ? $this.attr('data-height') : '300';

			$this.attr('src', 'https://placehold.it/' + width + 'x' + height + '/cccccc/');
		},

		removeAttributionAttributes: function ($image) {
			$image.removeAttr('data-boldgrid-asset-id').removeAttr('data-pending-boldgrid-attribution');
		},

		/**
   * Remove Gridblocks that should not be aviailable to users.
   *
   * @since 1.4
   *
   * @param  {number} gridblockId Index of gridblock.
   */
		isSimpleGridblock: function ($html) {
			var valid_num_of_descendents = 3,
			    isSimpleGridblock = false,
			    $testDiv = $('<div>').html($html.clone());

			// Remove spaces from the test div. Causes areas with only spacers to fail tests.
			$testDiv.find('.mod-space').remove();

			$testDiv.find('.row:not(.row .row)').each(function () {
				var $descendents,
				    $this = $(this);

				if (!$this.siblings().length) {
					$descendents = $this.find('*');
					if ($descendents.length <= valid_num_of_descendents) {
						isSimpleGridblock = true;
						return false;
					}
				}
			});

			$testDiv.find('.row:not(.row .row) > [class^="col-"] > .row').each(function () {
				var $hr,
				    $this = $(this);

				if (!$this.siblings().length) {
					$hr = $this.find('hr');
					if (!$hr.siblings().length) {
						isSimpleGridblock = true;
						return false;
					}
				}
			});

			// Hide empty rows.
			$testDiv.find('.row:not(.row .row):only-of-type > [class^="col-"]:empty:only-of-type').each(function () {
				isSimpleGridblock = true;
				return false;
			});

			return isSimpleGridblock;
		}
	};

	BG.GRIDBLOCK.Filter = self;
	BG.GRIDBLOCK.Filter.setupConfigs();
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/generate.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {
		/**
   * Number of Gridblocks created.
   *
   * @since 1.5
   *
   * @type {Number}
   */
		gridblockCount: 0,

		failure: false,

		/**
   * Get a set of GridBlocks.
   *
   * @since 1.5
   *
   * @return {$.deferred} Ajax response.
   */
		fetch: function () {
			if (self.fetching || self.failure) {
				return false;
			}

			self.fetching = true;
			self.gridblockLoadingUI.start();

			return self.requestGridblocks().done(function (gridblocks) {
				self.addToConfig(gridblocks);
				BG.GRIDBLOCK.View.createGridblocks();
			}).always(function () {
				self.fetching = false;
				self.gridblockLoadingUI.finish();
			}).fail(function () {
				self.failure = true;
				BG.GRIDBLOCK.View.$gridblockSection.append(wp.template('boldgrid-editor-gridblock-error')());
			});
		},

		requestGridblocks: function (options) {
			var type = BG.GRIDBLOCK.Category.getSearchType();
			options = options || {};

			return $.ajax({
				url: BoldgridEditor.plugin_configs.asset_server + BoldgridEditor.plugin_configs.ajax_calls.gridblock_generate,
				dataType: 'json',
				timeout: 10000,
				data: _.defaults(options, {

					// If filtered to a type, load 30 otherwise 50.
					'quantity': type ? 30 : 50,
					'color_palettes': BoldgridEditor.is_boldgrid_theme,
					'include_temporary_resources': 1,
					'transparent_backgrounds': 'post' === BoldgridEditor.post_type ? 1 : 0,
					'type': type,
					'color': JSON.stringify({ 'colors': BG.CONTROLS.Color.getGridblockColors() }),
					'category': self.getCategory()
				})
			});
		},

		/**
   * Handle showing the loading graphic.
   *
   * @since 1.5
   *
   * @type {Object}
   */
		gridblockLoadingUI: {
			start: function () {
				$('body').addClass('loading-remote-body');
			},
			finish: function () {
				$('body').removeClass('loading-remote-body');
			}
		},

		/**
   * Get the users installed category.
   *
   * @since 1.5
   *
   * @return {string} inspiration catgegory.
   */
		getCategory: function () {
			var category;
			if (BoldgridEditor && BoldgridEditor.inspiration && BoldgridEditor.inspiration.subcategory_key) {
				category = BoldgridEditor.inspiration.subcategory_key;
			}

			return category;
		},

		/**
   * Add a set of Gridblocks to the configuration.
   *
   * @since 1.5
   *
   * @param {array} gridblocks Collection of GridBlock configs.
   */
		addToConfig: function (gridblocks) {
			_.each(gridblocks, function (gridblockData, index) {
				gridblocks[index] = self.addRequiredProperties(gridblockData);
				BG.GRIDBLOCK.Filter.addGridblockConfig(gridblocks[index], 'generated-' + self.gridblockCount);

				self.gridblockCount++;
			});
		},

		/**
   * Set the background image for any remote gridblocks..
   *
   * @since 1.5
   *
   * @param  {jQuery} $html Gridblock jqury object.
   */
		updateBackgroundImages: function ($html) {
			var backgroundImageOverride = $html.attr('gb-background-image');

			if (backgroundImageOverride) {
				$html.removeAttr('gb-background-image').css('background-image', backgroundImageOverride);
			}
		},

		/**
   * Set properties of gridblock configurations.
   *
   * @since 1.5
   *
   * @param {object} gridblockData A Gridblock config.
   */
		addRequiredProperties: function (gridblockData) {
			var $html = $(gridblockData.html);

			self.updateBackgroundImages($html);
			gridblockData['html-jquery'] = $html;

			return gridblockData;
		}

	};

	BG.GRIDBLOCK.Generate = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/image.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		/**
   * Translate all images to encoded versions.
   *
   * @since 1.5
   *
   * @param  {Object} gridblockData Current Gridblock.
   */
		translateImages: function (gridblockData) {
			if (gridblockData.dynamicImages) {
				self.replaceImages(gridblockData);
				self.replaceBackgrounds(gridblockData);
			} else {
				self.transferSrcAttr(gridblockData);
			}
		},

		/**
   * Transfer src attributes to elements.
   *
   * Gridblocks that halve already been installed have temporary src attributes that are
   * only applied when previewed.
   *
   * @since 1.5
   *
   * @param  {object} gridblockData Current Gridblock.
   */
		transferSrcAttr: function (gridblockData) {
			gridblockData.$html.find('img[data-src]').each(function () {
				var $this = $(this),
				    src = $this.attr('data-src');

				$this.removeAttr('data-src').attr('src', src);
			});
		},

		/**
   * Scan each image, replace image src with encoded version.
   *
   * @since 1.5
   *
   * @param  {jQuery} $gridblock Gridblock Object.
   */
		replaceImages: function (gridblockData) {
			gridblockData.$html.find('img').each(function () {
				var $this = $(this),
				    src = $this.attr('data-src');

				$this.removeAttr('data-src');
				$this.attr('dynamicImage', '');

				if (!self.isRandomUnsplash(src)) {
					$this.attr('src', src);
					return;
				}

				// Get image data.
				self.getDataURL(src).done(function (result) {
					$this.attr('src', result);
				}).fail(function () {

					// Get the image via server.
					self.getRedirectURL(src).done(function (result) {
						$this.attr('src', result);
					}).fail(function () {
						BG.GRIDBLOCK.Filter.setPlaceholderSrc($this);
					});
				});
			});
		},

		/**
   * Replace the background url with a new url.
   *
   * @since 1.5
   *
   * @param  {string} css CSS rule for background image.
   * @param  {string} url URL to swap.
   * @return {string}     New CSS rule with the url requested.
   */
		replaceBackgroundUrl: function (css, url) {
			return css.replace(/url\(.+?\)/, 'url(' + url + ')');
		},

		/**
   * Get the url used in a background.
   *
   * @since 1.5
   *
   * @param  {jQuery} $element Element with background.
   * @return {string}          URL.
   */
		getBackgroundUrl: function ($element) {
			var backgroundImage = $element.css('background-image') || '';
			return backgroundImage.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
		},

		/**
   * Replace background images with encoded image. Only section for now.
   *
   * @since 1.5
   *
   * @param  {jQuery} $gridblock gridblock previewed.
   */
		replaceBackgrounds: function (gridblockData) {
			var setBackground,
			    $gridblock = gridblockData.$html,
			    backgroundImage = $gridblock.css('background-image') || '',
			    hasImage = backgroundImage.match(/url\(?.+?\)/),
			    imageUrl = self.getBackgroundUrl($gridblock);

			setBackground = function (result) {
				backgroundImage = self.replaceBackgroundUrl(backgroundImage, result);
				$gridblock.css('background-image', backgroundImage);
			};

			if (hasImage) {
				$gridblock.attr('dynamicImage', '');

				if (!self.isRandomUnsplash(imageUrl)) {
					return;
				}

				$gridblock.css('background-image', '');

				self.getDataURL(imageUrl).done(function (result) {
					setBackground(result);
				}).fail(function () {

					// Get the image via server.
					self.getRedirectURL(imageUrl).done(function (result) {
						setBackground(result);
					});
				});
			}
		},

		isRandomUnsplash: function (imageUrl) {
			return -1 !== imageUrl.indexOf('source.unsplash');
		},

		/**
   * Get the url for the image based on element type.
   *
   * @since 1.5
   *
   * @param  {jQuery} $element Element to check.
   * @return {string}          URL.
   */
		getEncodedSrc: function ($element) {
			var src = '';

			if (self.isBackgroundImage($element)) {
				src = self.getBackgroundUrl($element);
			} else {
				src = $element.attr('src');
			}

			return src;
		},

		/**
   * Check if we are applying a background image.
   *
   * @since 1.5
   *
   * @param  {jQuery} $element Element to check.
   * @return {boolean}         Is the element image a background.
   */
		isBackgroundImage: function ($element) {
			return 'IMG' !== $element[0].nodeName;
		},

		/**
   * Add wp-image class to gridblock and apply url.
   *
   * @since 1.4
   *
   * @param {jQuery} $image Image to have attributes replaced.
   * @param {Object} data   Image return data.
   */
		addImageUrl: function ($image, data) {
			var backgroundImageCss;

			if (self.isBackgroundImage($image)) {
				backgroundImageCss = $image.css('background-image') || '';
				backgroundImageCss = self.replaceBackgroundUrl(backgroundImageCss, data.url);

				$image.attr('data-image-url', data.url).css('background-image', backgroundImageCss);
			} else {
				$image.attr('src', data.url);

				// If an attachment_id is set, use it to add the wp-image-## class.
				// This class is required if WordPress is to later add the srcset attribute.
				if ('undefined' !== typeof data.attachment_id && data.attachment_id) {
					$image.addClass('wp-image-' + data.attachment_id);
				}
			}
		},

		/**
   * Get the base64 of an image.
   *
   * @since 1.5
   *
   * @param  {string} src Remote image path.
   * @return {$.deferred} Deferred for callbacks.
   */
		getDataURL: function (src) {
			var $deferred = $.Deferred(),
			    xhr = new XMLHttpRequest();

			xhr.open('get', src);
			xhr.responseType = 'blob';
			xhr.onload = function () {

				var contentType,
				    fr = new FileReader();

				fr.onload = function () {
					contentType = xhr.getResponseHeader('content-type') || '';

					if (200 === xhr.status && -1 !== contentType.indexOf('image')) {
						$deferred.resolve(this.result);
					} else {
						$deferred.reject();
					}
				};

				fr.readAsDataURL(xhr.response);
			};

			xhr.onerror = function () {
				$deferred.reject();
			};

			xhr.send();

			return $deferred;
		},

		/**
   * Get the redirect image for an unsplash image.
   *
   * @since 1.5
   *
   * @param  {string} src Remote image path.
   * @return {$.deferred} Deferred for callbacks.
   */
		getRedirectURL: function (src) {
			var $deferred = $.Deferred();

			$.ajax({
				type: 'post',
				url: ajaxurl,
				dataType: 'json',
				timeout: 8000,
				data: {
					action: 'boldgrid_redirect_url',
					boldgrid_gridblock_image_ajax_nonce: BoldgridEditor.grid_block_nonce,
					urls: [src]
				}
			}).done(function (response) {
				var image = response.data[src] || false;

				if (image) {
					$deferred.resolve(image);
				} else {
					$deferred.reject();
				}
			}).fail(function () {
				$deferred.reject();
			});

			return $deferred;
		}

	};

	BG.GRIDBLOCK.Image = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/loader.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function ($) {
	'use strict';

	var BGGB = BOLDGRID.EDITOR.GRIDBLOCK,
	    self = {

		$window: $(window),

		openInit: false,

		placeholderHtml: {},

		countGidblocksLoaded: 0,

		loadingGridblocks: false,

		creatingIframe: false,

		$iframeTemp: false,

		/**
   * Run this function the first time the view is open.
   *
   * @since 1.4
   */
		firstOpen: function () {
			if (false === self.openInit) {
				self.openInit = true;
				self.placeholderHtml.before = wp.template('gridblock-redacted-before')();
				self.placeholderHtml.after = wp.template('gridblock-redacted-after')();

				BGGB.View.init();
				BGGB.Delete.init();
				BGGB.Drag.init();
				BGGB.Generate.fetch();
			}
		},

		/**
   * Get a list of gridblocks that need to be rendered.
   *
   * @since 1.4
   *
   * @return {Array} List of gridblock keys to be rendered.
   */
		getPendingGridblockIds: function () {
			var gridblockIds = [],
			    currentCount = 0,
			    maxPerLoad = 4;

			$.each(BGGB.configs.gridblocks, function (index) {
				if (!this.renderScheduled && currentCount < maxPerLoad) {
					if (BGGB.Category.canDisplayGridblock(this)) {
						currentCount++;
						this.renderScheduled = true;
						gridblockIds.push(index);
					}
				}
			});

			return gridblockIds;
		},

		/**
   * Render any gridblock iframes that have yet to be loaded.
   *
   * @since 1.4
   */
		loadGridblocks: function () {
			var interval,
			    load,
			    blocks,
			    iteration = 0;

			if (true === self.loadingGridblocks) {
				return;
			}

			blocks = self.getPendingGridblockIds();
			if (0 === blocks.length) {
				return;
			}

			self.loadingGridblocks = true;
			load = function () {
				var gridblockId = blocks[iteration],
				    gridblock = gridblockId ? BGGB.configs.gridblocks[gridblockId] : false;

				if (true === self.creatingIframe) {
					return;
				}

				if (!gridblock) {
					clearInterval(interval);
					self.loadingGridblocks = false;
					BGGB.View.$gridblockSection.trigger('scroll');
					return;
				}

				if ('iframeCreated' !== gridblock.state) {
					self.createIframe(gridblock);
				}

				iteration++;
			};

			interval = window.setInterval(load, 100);
		},

		/**
   * Given a Gridblock config, Render the coresponding iframe.
   *
   * @since 1.4
   */
		createIframe: function (gridblock) {
			var load,
			    postCssLoad,
			    $contents,
			    $gridblock = BGGB.View.$gridblockSection.find('[data-id="' + gridblock.gridblockId + '"]'),
			    $iframe = self.$iframeTemp ? self.$iframeTemp : $('<iframe></iframe>');

			self.creatingIframe = true;
			BGGB.View.$gridblockSection.find('.gridblocks').append($gridblock);
			$gridblock.prepend($iframe);

			load = function () {
				$contents = $iframe.contents();
				BGGB.Image.translateImages(gridblock);
				$contents.find('body').html($('<div>').html(gridblock.$html).prepend(self.placeholderHtml.before).append(self.placeholderHtml.after));

				BGGB.View.addStyles($contents);
				BGGB.View.addBodyClasses($contents);
				self.$iframeTemp = $iframe.clone();

				if (BGGB.Category.canDisplayGridblock(gridblock)) {
					$gridblock.css('display', '');
				}

				gridblock.state = 'iframeCreated';

				setTimeout(function () {
					$gridblock.removeClass('gridblock-loading');
					self.creatingIframe = false;
				}, 200);
			};

			postCssLoad = function () {
				if (false === BGGB.View.headMarkup) {
					self.$window.on('boldgrid_head_styles', load);
				} else {
					load();
				}
			};

			if ('Firefox' === BOLDGRID.EDITOR.Controls.browser) {
				$iframe.on('load', postCssLoad);
			} else {
				postCssLoad();
			}
		}
	};

	BGGB.Loader = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/gridblock/view.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles setting up the Gridblocks view.
 */
(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {
		$tinymceBody: null,
		$gridblockSection: null,
		$gridblockNav: null,
		headMarkup: false,
		siteMarkup: '',

		init: function () {
			self.findElements();
			self.setGridblockCount();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.createGridblocks();
			BG.GRIDBLOCK.Loader.loadGridblocks();
			BG.GRIDBLOCK.Category.init();
			self.endlessScroll();
			self.templateClass = self.getTemplateClass();
		},

		/**
   * Set Gridblock count.
   *
   * @since 1.5
   */
		setGridblockCount: function () {
			self.$gridblockSection.find('.gridblocks').attr('my-gridblocks-count', BoldgridEditor.gridblocks.length.toString());
		},

		/**
   * Process when page loads.
   *
   * @since 1.5
   */
		onLoad: function () {
			self.setupAddGridblock();
			BG.STYLE.Remote.getStyles(BoldgridEditor.site_url);
		},

		/**
   * Check if we have enough grodblocks to display.
   *
   * @since 1.5
   *
   * @return {boolean} Whether or nor we should request more gridblocks.
   */
		hasGridblocks: function () {
			var pending = 0;
			_.each(BG.GRIDBLOCK.configs.gridblocks, function (gridblock) {
				if ('ready' === gridblock.state && BG.GRIDBLOCK.Category.canDisplayGridblock(gridblock)) {
					pending++;
				}
			});

			// 5 is the threshold for requesting more gridblocks.
			return pending >= 5;
		},

		/**
   * Setup infinite scroll of gridblocks.
   *
   * @since 1.4
   */
		endlessScroll: function () {
			var throttled,
			    loadDistance = 1500,
			    $gridblocks = self.$gridblockSection.find('.gridblocks');

			throttled = _.throttle(function () {
				var scrollTop = self.$gridblockSection.scrollTop(),
				    height = $gridblocks.height(),
				    diff = height - scrollTop;

				if (diff < loadDistance && true === BG.CONTROLS.Section.sectionDragEnabled) {
					self.updateDisplay();
				}
			}, 300);

			self.$gridblockSection.on('scroll', throttled);
		},

		/**
   * Update the display of Gridblocks.
   *
   * @since 1.5
   */
		updateDisplay: function () {
			BG.GRIDBLOCK.Loader.loadGridblocks();

			if ('saved' !== BG.GRIDBLOCK.Category.currentCategory && !self.hasGridblocks()) {
				BG.GRIDBLOCK.Generate.fetch();
			}
		},

		/**
   * When clicking on the add gridblock button. Switch to visual tab before opening.
   *
   * @since 1.4
   */
		setupAddGridblock: function () {
			$('#insert-gridblocks-button').on('click', function () {
				$('.wp-switch-editor.switch-tmce').click();
				if (!BG.CONTROLS.Section.$container) {
					setTimeout(BG.CONTROLS.Section.enableSectionDrag, 300);
				} else {
					BG.CONTROLS.Section.enableSectionDrag();
				}
			});
		},

		/**
   * Bind the click event of the undo and redo buttons.
   *
   * @since 1.4
   */
		setupUndoRedo: function () {
			var $historyControls = $('.history-controls');

			$historyControls.find('.redo-link').on('click', function () {
				tinymce.activeEditor.undoManager.redo();
				$(window).trigger('resize');
				self.updateHistoryStates();
			});
			$historyControls.find('.undo-link').on('click', function () {
				tinymce.activeEditor.undoManager.undo();
				$(window).trigger('resize');
				self.updateHistoryStates();
			});
		},

		/**
   * Update the undo/redo disabled states.
   *
   * @since 1.4
   */
		updateHistoryStates: function () {
			var $historyControls = $('.history-controls');
			$historyControls.find('.redo-link').attr('disabled', !tinymce.activeEditor.undoManager.hasRedo());
			$historyControls.find('.undo-link').attr('disabled', !tinymce.activeEditor.undoManager.hasUndo());
		},

		/**
   * Assign all closure propeties.
   *
   * @since 1.4
   */
		findElements: function () {
			self.$gridblockSection = $('.boldgrid-zoomout-section');
			self.$gridblockNav = $('.zoom-navbar');
			self.$pageTemplate = $('#page_template');
		},

		/**
   * Get the class associated to templates.
   *
   * @since 1.5
   *
   * @return {string} class name.
   */
		getTemplateClass: function () {
			var val = self.$pageTemplate.val() || 'default';
			val = val.split('.');
			return 'page-template-' + val[0];
		},

		/**
   * Add body classes to iframe..
   *
   * @since 1.4
   *
   * @param {jQuery} $iframe iFrame
   */
		addBodyClasses: function ($iframe) {
			$iframe.find('body').addClass(BoldgridEditor.body_class).addClass('mce-content-body entry-content centered-section').addClass(self.templateClass).css('overflow', 'hidden');
		},

		/**
   * Add styles to iframe.
   *
   * @since 1.4
   *
   * @param {jQuery} $iframe iFrame
   */
		addStyles: function ($iframe) {
			$iframe.find('head').html(self.headMarkup);
		},

		/**
   * Move the Gridblock section under the wp-content div.
   *
   * @since 1.4
   */
		positionGridblockContainer: function () {
			$('#wpcontent').after(self.$gridblockSection);
		},

		/**
   * Create a list of GridBlocks.
   *
   * @since 1.4
   */
		createGridblocks: function () {
			var markup = self.generateInitialMarkup(),
			    $gridblockContainer = self.$gridblockSection.find('.gridblocks');

			$gridblockContainer.append(markup);
			self.$gridblockSection.trigger('scroll');
		},

		/**
   * Create the markup for each GridBlock that we already have in our system.
   *
   * @since 1.4
   *
   * @return string markup All the HTML needed for the initial load of the gridblocks view.
   */
		generateInitialMarkup: function () {
			var markup = '';
			$.each(BG.GRIDBLOCK.configs.gridblocks, function () {
				if (!this.state) {
					this.state = 'ready';
					markup += self.getGridblockHtml(this);
				}
			});

			return markup;
		},

		/**
   * Get the html for a GridBlock.
   *
   * @since 1.4
   *
   * @param  {Object} gridblockData Gridblock Info
   * @return {string}               Markup to add in gridblock iframe.
   */
		getGridblockHtml: function (gridblockData) {
			return wp.template('boldgrid-editor-gridblock')({
				'id': gridblockData.gridblockId,
				'type': gridblockData.type,
				'category': gridblockData.category,
				'template': gridblockData.template
			});
		}
	};

	BG.GRIDBLOCK.View = self;
	$(BG.GRIDBLOCK.View.onLoad);
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/menu.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Menu = {

		$element: null,

		$activeElement: null,

		$mceContainer: null,

		/**
   * Initialize the menu control.
   *
   * @since 1.2.7
   * @return jQuery $element.
   */
		init: function () {

			this.create();
			this.setupMenuDrag();
			this.setupDimiss();
			this.setupDropmenuOpen();

			return this.$element;
		},

		/**
   * Get the target clicked on that corresponds to the menu item highlighted.
   *
   * @since 1.2.7
   * @param BG.Control control.
   * @return jQuery
   */
		getTarget: function (control) {
			return this.$element.targetData[control.name];
		},

		/**
   * Get the current element being modified.
   *
   * @since 1.2.7
   * @return jQuery Element being modified.
   */
		getCurrentTarget: function () {

			var $target;

			if (BG.Panel.currentControl) {
				if (BG.Panel.currentControl.getTarget) {

					// Allow control to override the way a target is aquired.
					$target = BG.Panel.currentControl.getTarget();
				} else {
					$target = self.getTarget(BG.Panel.currentControl);
				}
			}

			return $target;
		},

		/**
   * Create the menu element.
   *
   * @since 1.2.7
   */
		create: function () {

			this.$mceContainer = $('#' + tinymce.activeEditor.theme.panel._items[0]._id);
			this.$element = $(wp.template('boldgrid-editor-control-menu')());
			this.$mceContainer.append(this.$element);
			this.$element.items = [];
		},

		/**
   * Setup the ability to drag the menu.
   *
   * @since 1.2.7
   */
		setupMenuDrag: function () {
			this.$element.find('ul').draggable({
				containment: '#wp-content-editor-container',
				scroll: false,
				axis: 'x',
				cancel: 'li'
			});
		},

		/**
   * Create the list item for the registered control.
   *
   * @since 1.2.7
   * @param BG.Control control.
   */
		createListItem: function (control) {

			var $dropdownUl,
			    $li = $('<li></li>').attr('data-action', 'menu-' + control.name),
			    $icon = $('<span></span>').addClass(control.iconClasses);

			$li.append($icon);

			if (control.menuDropDown) {
				$dropdownUl = $('<ul class="bg-editor-menu-dropdown"></ul>');
				$li.addClass('menu-dropdown-parent');
				$icon.addClass('menu-dropdown-icon');
				$dropdownUl.html('<li class="title">' + control.menuDropDown.title + '</li>');
				$.each(control.menuDropDown.options, function () {
					$dropdownUl.append('<li class="' + this['class'] + '">' + this.name + '</li>');
				});
				$li.append($dropdownUl);
			}

			if (control.tooltip) {
				$li.append(wp.template('boldgrid-editor-tooltip')({
					'message': control.tooltip
				}));
			}

			this.$element.find('> ul').append($li);
		},

		/**
   * Bind Event: On click of document, collapse menu.
   *
   * @since 1.2.7
   */
		setupDimiss: function () {
			$(document).on('click', function (e) {
				if (false === $(e.target).hasClass('menu-dropdown-icon')) {
					self.$element.removeClass('active');
				}
			});

			BG.Controls.$container.on('click', function () {
				self.$element.find('.menu-dropdown-parent').removeClass('active');
			});
		},

		setupDropmenuOpen: function () {
			this.$element.on('click', '.menu-dropdown-parent', function () {
				$(this).toggleClass('active').siblings().removeClass('active');
			});
		},

		/**
   * Activate the passed control.
   *
   * @since 1.2.7
   * @param BG.Control control.
   */
		activateControl: function (control) {
			self.deactivateControl();
			this.$activeElement = BOLDGRID.EDITOR.Menu.$element.find('[data-action="menu-' + control.name + '"]').addClass('active');
		},

		/**
   * Deactivate the active element.
   *
   * @since 1.2.7
   */
		deactivateControl: function () {
			if (this.$activeElement) {
				this.$activeElement.removeClass('active');
				this.$activeElement = null;
			}
		},

		/**
   * Reactivate Menu.
   *
   * @since 1.2.7
   */
		reactivateMenu: function () {
			var $panel = BOLDGRID.EDITOR.Panel.$element;
			if (this.$activeElement && $panel.is(':visible')) {
				this.$element.find('[data-action="menu-' + $panel.attr('data-type') + '"]').addClass('active');
			}
		}

	};

	self = BOLDGRID.EDITOR.Menu;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/notice/update.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.NOTICE = BOLDGRID.EDITOR.NOTICE || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.NOTICE.Update = {

		title: 'New Release: BoldGrid Editor',

		template: wp.template('boldgrid-upgrade-notice'),

		init: function () {
			if (BoldgridEditor.display_update_notice) {
				self.displayPanel();

				// Delay event, make sure user sees modal.
				setTimeout(function () {
					self.bindEvents();
				}, 1000);
			}
		},

		/**
   * Bind all events.
   *
   * @since 1.3
   */
		bindEvents: function () {
			var stopProp = function (e) {
				e.stopPropagation();
			};

			self.bindDismissButton();
			self.panelClick();
			BG.Panel.$element.on('click', stopProp);
		},

		/**
   * Bind the click outside of the pnael to the okay button.
   *
   * @since 1.3
   */
		panelClick: function () {
			$('body').one('click', function () {
				self.dismissPanel();
			});
		},

		/**
   * Bind the event of dismiss to the OKay button.
   *
   * @since 1.3
   */
		bindDismissButton: function () {
			BG.Panel.$element.find('.bg-upgrade-notice .dismiss').one('click', function () {
				self.dismissPanel();
			});
		},

		/**
   * Hide the panel.
   *
   * @since 1.3
   */
		dismissPanel: function () {
			var $body = $('body');

			$body.addClass('fadeout-background');
			BG.Panel.$element.addClass('bounceOutDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				self.removeEffects();
			});

			setTimeout(function () {
				self.removeEffects();
			}, 1000);
		},

		/**
   * Remove the effects added to the notification.
   *
   * @since 1.3
   */
		removeEffects: function () {
			$('body').removeClass('bg-editor-intro-1-3 fadeout-background');
			BG.Panel.resetPosition();
			BG.Panel.$element.hide();
			BG.Panel.$element.removeClass('animated bounceOutDown bounceInDown');
		},

		/**
   * Display update notification panel.
   *
   * @since 1.3
   */
		displayPanel: function () {
			$('body').addClass('bg-editor-intro-1-3');
			self.initPanel();
			self.renderPanel();
		},

		/**
   * Animate the panel when it appears.
   *
   * @since 1.3
   */
		animatePanel: function () {
			BG.Panel.$element.addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$('.bg-editor-loading').hide();
			});
		},

		/**
   * Positon the panel on the screen and display.
   *
   * @since 1.3
   */
		renderPanel: function () {
			BG.Panel.$element.show();
			self.animatePanel();
		},

		/**
   * Setup the parameters needed for the panel to be created.
   *
   * @since 1.3
   */
		initPanel: function () {
			BG.Panel.setDimensions(800, 400);
			BG.Panel.setTitle(self.title);
			BG.Panel.setContent(self.template());
		}

	};

	self = BG.NOTICE.Update;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/panel.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Panel = {

		$element: null,

		currentControl: null,

		/**
   * Initialize the panel.
   *
   * @since 1.3
   *
   * @return jQuery $this.$element Panel Element
   */
		init: function () {

			this.create();
			this._setupPanelClose();
			this._setupDrag();

			//This._setupPanelResize();
			this._setupCustomizeLeave();
			this._setupCustomizeDefault();
			this._lockPanelScroll();

			return this.$element;
		},

		/**
   * Create Panel HTML.
   *
   * @since 1.3
   */
		create: function () {
			this.$element = $(wp.template('BOLDGRID-editor-panel')());
			$('body').append(this.$element);
		},

		/**
   * Set the html for the panel body of the panel.
   *
   * @since 1.3
   */
		setContent: function (content) {
			this.$element.find('.panel-body').html(content);
		},

		/**
   * Set title of the panel.
   *
   * @since 1.3
   */
		setTitle: function (title) {
			this.$element.find('.panel-title .name').html(title);
		},

		/**
   * Reset Panel Position
   *
   * @since 1.3
   */
		resetPosition: function () {
			this.$element.css({
				'top': '',
				'left': ''
			});
		},

		/**
   * Set the dimensions of the panel.
   *
   * @since 1.3
   */
		setDimensions: function (width, height) {
			this.$element.width(width);
			this.$element.height(height);
		},

		/**
   * Center the panel.
   *
   * @since 1.2.7
   */
		centerPanel: function () {
			var $window = $(window),
			    width = parseInt(this.$element.css('width')),
			    height = parseInt(this.$element.css('height')),
			    windowWidth = $window.width(),
			    windowHeight = $window.height(),
			    centerWidth = windowWidth / 2 - width / 2,
			    centerHeight = windowHeight / 2 - height / 2;

			this.$element.css({
				'top': centerHeight,
				'left': centerWidth
			});
		},

		/**
   * Setup Scrolling within the panel.
   *
   * @param control BG.Control.
   * @since 1.3
   */
		initScroll: function () {
			self.createScrollbar(self.getScrollTarget(), this.currentControl.panel || {});
		},

		/**
   * Remove any existing scroll bar and add another to specified panel config.
   *
   * @since 1.5.1
   *
   * @param  {string} selector
   * @param  {object} config   Configuration.
   */
		createScrollbar: function (selector, config) {

			// Default height of scroll is the height of body minus this number.
			var sizeOffset = -66,
			    $target = this.$element.find(selector);

			if (config && config.sizeOffset) {
				sizeOffset = config.sizeOffset;
			}

			// Remove existing scroll.
			self.$element.find('.slimScrollDiv >:first-child').slimScroll({ destroy: true }).attr('style', '');

			$target.slimScroll({
				color: '#32373c',
				size: '8px',
				height: parseInt(config.height) + sizeOffset,
				alwaysVisible: true,
				disableFadeOut: true,
				wheelStep: 5
			});
		},

		/**
   * Check if a control is currently open.
   *
   * @since 1.3
   * @param control BG.Control.
   * @return bool isOpenControl.
   */
		isOpenControl: function (control) {
			var isOpenControl = false;

			if (this.$element.is(':visible') && this.$element.attr('data-type') === control.name) {
				isOpenControl = true;
			}

			return isOpenControl;
		},

		/**
   * Initialize dragging of the panel.
   *
   * @since 1.3
   */
		_setupDrag: function () {
			this.$element.draggable({
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll: false
			});
		},

		/**
   * Remove all selected options.
   *
   * @since 1.3
   */
		clearSelected: function () {
			this.$element.find('.selected').removeClass('selected');
		},

		/**
   * Setup resizing of the panel.
   *
   * @since 1.3
   */
		_setupPanelResize: function () {
			this.$element.resizable();
		},

		/**
   * Setup resizing of the panel.
   *
   * @since 1.3
   */
		_setupPanelClose: function () {
			this.$element.on('click', '.close-icon', function () {
				self.closePanel();
			});
		},

		/**
   * Strip temp classes.
   *
   * @since 1.3
   */
		removeClasses: function () {
			BG.Controls.$container.find('.bg-control-element').removeClass('bg-control-element');
		},

		/**
   * Close panel.
   *
   * @since 1.3
   */
		closePanel: function () {
			self.$element.hide();
			BOLDGRID.EDITOR.Menu.deactivateControl();
			self.removeClasses();

			if (self.$element.hasClass('customize-open')) {
				this.$element.trigger('bg-customize-exit');
				self.$element.removeClass('customize-open');
			}

			this.$element.find('.panel-body').empty();

			this.$element.trigger('bg-panel-close');
			tinymce.activeEditor.undoManager.add();
		},

		/**
   * Scroll to the element that has the selected class.
   *
   * @since 1.3
   */
		scrollToSelected: function () {
			var scrollPos,
			    scrollOffset,
			    $selected = self.$element.find('.selected:not(.filters .selected):visible');

			self.scrollTo(0);

			if (!$selected.length) {
				return;
			}

			scrollOffset = 0;
			if (self.currentControl.panel.scrollOffset) {
				scrollOffset = self.currentControl.panel.scrollOffset;
			}

			scrollPos = $selected.position().top + scrollOffset;
			self.scrollTo(scrollPos + 'px');
		},

		/**
   * Get the controls scrollable target.
   *
   * @since 1.3
   * @return string target.
   */
		getScrollTarget: function () {
			var target = '.panel-body';
			if (self.currentControl && self.currentControl.panel.scrollTarget) {
				target = self.currentControl.panel.scrollTarget;
			}

			return target;
		},

		/**
   * Scroll to a pixel position.
   *
   * @since 1.3
   * @param integer to Position to scroll to.
   * @return string target.
   */
		scrollTo: function (to) {
			this.$element.find(self.getScrollTarget()).slimScroll({
				scrollTo: to,
				alwaysVisible: true,
				disableFadeOut: true
			});
		},

		/**
   * Delete all content from a panel.
   *
   * @since 1.3
   */
		clear: function () {
			this.$element.find('.panel-title .name').empty();
			this.$element.find('.panel-body').empty();
		},

		/**
   * Show the footer of a panel if the control configures it.
   *
   * @since 1.3
   */
		_enableFooter: function (config) {
			if (config && config.includeFooter) {
				self.showFooter();
			} else {
				self.hideFooter();
			}
		},

		/**
   * Hide footer.
   *
   * @since 1.3
   */
		hideFooter: function () {
			this.$element.find('.panel-footer').hide();
		},

		/**
   * Show footer.
   *
   * @since 1.3
   */
		showFooter: function () {
			this.$element.find('.panel-footer').show();
		},

		/**
   * Setup handlers for the user clicking on the customize button.
   *
   * @since 1.3
   */
		_setupCustomize: function (control) {

			if (!control.panel.customizeCallback) {
				return;
			}

			self.$element.find('.panel-footer .customize .panel-button').on('click', function (e) {
				e.preventDefault();
				self.$element.trigger('bg-customize-open');
				self.$element.addClass('customize-open');
				if (self.$element.attr('data-type') === control.name && true !== self.currentControl.panel.customizeCallback) {
					control.panel.customizeCallback();
				}
			});
		},

		/**
   * Bind the default behavior that occurs when the user clicks the customize button.
   *
   * @since 1.3
   */
		_setupCustomizeDefault: function () {
			self.$element.find('.panel-footer .customize .panel-button').on('click', function (e) {
				e.preventDefault();

				if (self.currentControl && self.currentControl.panel && true === self.currentControl.panel.customizeCallback) {
					self.$element.find('.panel-body .customize').show();
					self.$element.find('.presets').hide();
					self.$element.find('.title').hide();
					self.scrollTo(0);
					self.hideFooter();
				}
			});
		},

		/**
   * Hide a panels customization area upon clicking the back button.
   *
   * @since 1.3
   */
		_setupCustomizeLeave: function () {
			self.$element.on('click', '.back .panel-button', function (e) {
				e.preventDefault();
				self.$element.removeClass('customize-open');

				if (self.currentControl && self.currentControl.panel && true === self.currentControl.panel.customizeLeaveCallback) {
					self.$element.find('.presets').show();
					self.$element.find('.title').show();
					self.$element.find('.panel-body .customize').hide();
					self.toggleFooter();
					self.scrollToSelected();
					self.$element.trigger('bg-customize-exit');
				}
			});
		},

		/**
   * Generic control for applying classes to an component.
   *
   * @since 1.6
   *
   * @param  {object} control Control Class.
   */
		setupPanelClick: function (control) {
			var panel = BOLDGRID.EDITOR.Panel;

			if (!control.panel || !control.panel.styleCallback) {
				return;
			}

			panel.$element.on('click', '[data-control-name="' + control.name + '"] .panel-selection', function () {
				var $target = BG.Menu.getCurrentTarget(),
				    $this = $(this);

				BG.Util.removeComponentClasses($target, control.componentPrefix);

				$target.addClass($this.attr('data-preset'));
				panel.$element.find('.selected').removeClass('selected');
				$this.addClass('selected');
			});
		},

		/**
   * Show the panel footer if something is selected.
   *
   * @since 1.3
   */
		toggleFooter: function () {
			if (self.$element.find('.panel-body .selected').length) {
				self.showFooter();
			} else {
				self.hideFooter();
			}
		},

		/**
   * Unselect the current area.
   *
   * @since 1.3
   */
		collapseSelection: function () {
			if ('icon' !== self.currentControl.name) {
				tinyMCE.activeEditor.selection.collapse(false);
				tinyMCE.activeEditor.nodeChanged();
			}
		},

		/**
   * Setup scroll locking.
   *
   * @since 1.3
   */
		_lockPanelScroll: function () {
			if (window.addEventListener) {
				this.$element[0].addEventListener('DOMMouseScroll', self._onWheel, false);
				this.$element[0].addEventListener('mousewheel', self._onWheel, false);
			}
		},

		/**
   * Lock The scroll.
   *
   * @since 1.3
   */
		_onWheel: function (e) {
			e = e || window.event;

			if (e.preventDefault) {
				e.preventDefault();
			}

			e.returnValue = false;
		},

		preselect: function () {
			var $target, classes;

			if (!this.currentControl.panel.preselectCallback) {
				return;
			}

			$target = BG.Menu.getCurrentTarget();
			classes = BG.Util.getClassesLike($target, this.currentControl.componentPrefix);

			classes = classes.join(' ');
			this.clearSelected();
			this.$element.find('[data-preset="' + classes + '"]:first').addClass('selected');
		},

		/**
   * Open the panel for a control.
   *
   * @since 1.3
   */
		open: function (control) {
			var $target;

			tinymce.activeEditor.undoManager.add();

			BOLDGRID.EDITOR.Menu.activateControl(control);

			this.currentControl = control;
			this.$element.addClass('ui-widget-content');
			this.setDimensions(control.panel.width, control.panel.height);
			this.setTitle(control.panel.title);
			this.$element.attr('data-type', control.name);
			this.$element.find('.panel-body').attr('data-control-name', control.name);
			this._enableFooter(control.panel);
			this._setupCustomize(control);
			BG.Tooltip.renderTooltips();
			this.$element.show();
			this.initScroll(control);
			this.preselect();
			this.scrollToSelected();
			this.collapseSelection();

			BOLDGRID.EDITOR.CONTROLS.Generic.initControls();

			self.removeClasses();
			$target = BG.Menu.$element.targetData[control.name] || $();
			$target.addClass('bg-control-element');

			BG.CONTROLS.Color.initColorControls();
		}

	};

	self = BOLDGRID.EDITOR.Panel;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/render-fonts.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self;

	self = BOLDGRID.EDITOR.FontRender = {

		/**
   * Get array of font families.
   *
   * @since 1.2.7
   * @return array Families that need to be reuqested.
   */
		createLinkList: function ($scope) {
			var families = {};

			$scope.find('[data-font-family]').each(function () {
				var $this = $(this),
				    family = $this.attr('data-font-family');

				if (family) {
					families[family] = families[family] || {};
					// Add more props like sans serif and weight.
				}
			});

			return families;
		},

		/**
   * Update font link that has been added to the head.
   *
   * @since 1.2.7
   * @return array Families that need to be reuqested.
   */
		updateFontLink: function ($scope) {
			var families,
			    familyParam,
			    params,
			    baseUrl = 'https://fonts.googleapis.com/css?',
			    $head = $scope.find('head'),
			    $link = $head.find('#boldgrid-google-fonts');

			if (!$link.length) {
				$link = $('<link id="boldgrid-google-fonts" rel="stylesheet">');
				$head.append($link);
			}

			families = self.createLinkList($scope);

			// Create url encoded array.
			familyParam = [];
			$.each(families, function (familyName) {
				familyParam.push(familyName);
			});

			familyParam = familyParam.join('|');

			// Create params string.
			if (familyParam) {
				params = jQuery.param({ family: familyParam });
				$link.attr('href', baseUrl + params);
			}
		}
	};
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/resize/row.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.RESIZE = BOLDGRID.EDITOR.RESIZE || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.RESIZE.Row = {

		$body: null,

		handleSize: 20,

		$container: null,

		$topHandle: null,

		$bottomHandle: null,

		handleOffset: null,

		currentlyDragging: false,

		$currentRow: null,

		/**
   * Initialize Row Resizing.
   * This control adds padding top and bottom to containers.
   *
   * @since 1.2.7
   */
		init: function ($container) {
			self.$container = $container;
			self.handleOffset = self.handleSize;
			self.createHandles();
			self.bindHandlers();
			self.initDraggable();
		},

		/**
   * Bind all events.
   *
   * @since 1.2.7
   */
		bindHandlers: function () {
			self.$container.on('mouseenter', '.row:not(.row .row):not(.editing-as-row .row)', self.positionHandles).on('mouseleave', '.row:not(.row .row):not(.editing-as-row .row)', self.hideHandles).on('mouseenter', '.editing-as-row .row .row:not(.row .row .row)', self.positionHandles).on('mouseleave', '.editing-as-row .row .row:not(.row .row .row)', self.hideHandles).on('edit-as-row-enter', self.hideHandles).on('edit-as-row-leave', self.hideHandles).on('boldgrid_modify_content', self.positionHandles).on('mouseleave', self.hideHandles).on('end_typing_boldgrid.draggable', self.positionHandles);
		},

		/**
   * Attach drag handle controls to the DOM.
   *
   * @since 1.2.7
   */
		createHandles: function () {

			self.$topHandle = $('<span class="draghandle top" title="Drag Resize Row" data-setting="padding-top"></span>');
			self.$bottomHandle = $('<span class="draghandle bottom" title="Drag Resize Row" data-setting="padding-bottom"></span>');

			$.each([self.$topHandle, self.$bottomHandle], function () {
				this.css({
					'position': 'fixed',
					'height': self.handleSize,
					'width': self.handleSize
				});
			});

			self.$container.find('body').after(self.$topHandle).after(self.$bottomHandle);

			self.hideHandles();
		},

		/**
   * Handle the drag events.
   *
   * @since 1.2.7
   */
		initDraggable: function () {
			var startPadding, setting;

			self.$container.find('.draghandle').draggable({
				scroll: false,
				axis: 'y',
				start: function () {
					self.currentlyDragging = true;
					setting = $(this).data('setting');
					startPadding = parseInt(self.$currentRow.css(setting));
					self.$currentRow.addClass('changing-padding');
					self.$container.$html.addClass('no-select-imhwpb');
					self.$container.$html.addClass('changing-' + setting);
				},
				stop: function () {
					self.currentlyDragging = false;
					self.$currentRow.removeClass('changing-padding');
					self.$container.$html.removeClass('no-select-imhwpb');
					self.$container.$html.removeClass('changing-' + setting);
				},
				drag: function (e, ui) {
					var padding,
					    rowPos,
					    relativePos,
					    diff = ui.position.top - ui.originalPosition.top;

					if ('padding-top' === setting) {
						padding = parseInt(self.$currentRow.css(setting)) - diff;
						relativePos = 'top';
						if (padding > 0 && diff) {
							window.scrollBy(0, -diff);
						}
					} else {
						padding = startPadding + diff;
						relativePos = 'bottom';
					}

					// If padding is less than 0, prevent movement of handle.
					if (padding < 0) {
						rowPos = self.$currentRow[0].getBoundingClientRect();
						ui.position.top = rowPos[relativePos] - (ui.helper.hasClass('top') ? 0 : self.handleOffset);
						padding = 0;
					}

					BG.Controls.addStyle(self.$currentRow, setting, padding);

					if (self.$container.$html.hasClass('editing-as-row') && $.fourpan) {
						$.fourpan.refresh();
					}
				}
			});
		},

		/**
   * Reposition the handles.
   *
   * @since 1.2.7
   */
		positionHandles: function () {
			var pos, $this, rightOffset;

			if (this.getBoundingClientRect) {
				$this = $(this);
			} else {
				$this = self.$currentRow;
			}

			if (!$this || !$this.length || false === $this.is(':visible')) {
				self.$topHandle.hide();
				self.$bottomHandle.hide();
				return;
			}

			pos = $this[0].getBoundingClientRect();
			rightOffset = pos.right - 100;

			if (self.currentlyDragging) {
				return false;
			}

			// Save the current row.
			self.$currentRow = $this;

			self.$topHandle.css({
				'top': pos.top - 1,
				'left': rightOffset
			});

			self.$bottomHandle.css({
				'top': pos.bottom - self.handleOffset + 1,
				'left': rightOffset
			});

			if (this.getBoundingClientRect) {
				self.$topHandle.show();
				self.$bottomHandle.show();
			}
		},

		/**
   * Hide the drag handles.
   *
   * @since 1.2.7
   */
		hideHandles: function (e) {
			if (e && e.relatedTarget && $(e.relatedTarget).hasClass('draghandle')) {
				return;
			}

			if (self.currentlyDragging) {
				return false;
			}

			self.$topHandle.hide();
			self.$bottomHandle.hide();
		}

	};

	self = BOLDGRID.EDITOR.RESIZE.Row;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/style/remote.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.STYLE = BOLDGRID.EDITOR.STYLE || {};

/**
 * Handles setting up the Gridblocks view.
 */
(function ($) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
	    self = {

		/**
   * Fetch the from front end and apply them.
   *
   * @since 1.4
   */
		getStyles: function (url) {
			$.get(url, function (siteMarkup) {
				var $window = $(window);
				self.siteMarkup = siteMarkup;
				self.fetchStyles(siteMarkup).done(function (markup) {
					BG.GRIDBLOCK.View.headMarkup = markup;
					$window.trigger('boldgrid_page_html', self.siteMarkup);
					$window.trigger('boldgrid_head_styles', self.headMarkup);
				});
			});
		},

		/**
   * Depending on the browser. Use a different method for loading the styles.
   *
   * @return {$.Deferred} Deferred jquery element to be resolved when styles are retreived.
   */
		fetchStyles: function (siteMarkup) {
			var $deferred;

			// Disabled, fonts font work ( relative paths in styles )
			//IIf ( 'Firefox' !== BOLDGRID.EDITOR.Controls.browser ) {
			//	$deferred = self.getHeadDownloaded( siteMarkup );
			//} else {
			$deferred = self.getHeadElements(siteMarkup);
			//}

			return $deferred;
		},

		/**
   * Given markup for a site, get all of the stylesheets.
   *
   * @since 1.4
   *
   * @param string siteMarkup Markup for an Entire site.
   * @return string Head markup that represents the styles.
   */
		getHeadElements: function (siteMarkup) {
			var $html, headMarkup;

			siteMarkup = siteMarkup.replace(/<body\b[^<]*(?:(?!<\/body>)<[^<]*)*<\/body>/, '');
			$html = $('<div>').html(siteMarkup);
			headMarkup = '';

			$html.find('link, style').each(function () {
				var $this = $(this),
				    markup = this.outerHTML,
				    tagName = $this.prop('tagName');

				if ('LINK' === tagName && 'stylesheet' !== $this.attr('rel')) {
					markup = '';
				}

				headMarkup += markup;
			});

			headMarkup += wp.template('gridblock-iframe-styles')();

			return $.Deferred().resolve(headMarkup);
		},

		/**
   * Given markup for a site, get all of the stylesheets markup.
   *
   * @since 1.4
   *
   * @param string siteMarkup Markup for an Entire site.
   * @return string Head markup that represents the styles.
   */
		getHeadDownloaded: function (siteMarkup) {
			var $html = $('<div>').html(siteMarkup),
			    $deffered = $.Deferred(),
			    styles = [],
			    pending = [];

			var markAsResolved = function (styleIndex) {
				var index = pending.indexOf(styleIndex);
				if (index > -1) {
					pending.splice(index, 1);
				}
			};

			var getMarkup = function () {
				var markup = '';

				$.each(styles, function () {
					if (!this.html) {
						return;
					}

					if ('LINK' === this.tagName) {
						markup += $('<style type="text/css">').html(this.html)[0].outerHTML;
					} else {
						markup += this.html;
					}
				});

				return markup;
			};

			var isFinished = function () {
				if (!pending.length) {
					$deffered.resolve(getMarkup());
				}
			};

			$html.find('link, style').each(function (index) {
				var $this = $(this),
				    markup = this.outerHTML,
				    tagName = $this.prop('tagName');

				if ('LINK' === tagName && 'stylesheet' !== $this.attr('rel')) {
					markup = '';
				} else if ('LINK' === tagName) {
					markup = '';
					pending.push(index);
					$.get($this.attr('href'), function (resp) {
						styles[index].html = resp;
						markAsResolved(index);
						isFinished();
					});
				}

				styles.push({
					'tagName': tagName,
					'href': $this.attr('href'),
					'html': markup
				});
			});

			styles.push({
				'tagName': 'STYLE',
				'href': '',
				'html': wp.template('gridblock-iframe-styles')()
			});

			return $deffered;
		}
	};

	BG.STYLE.Remote = self;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/tooltips.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Tooltip = {

		/**
   * @var template.
   * @since 1.2.7
   */
		template: wp.template('boldgrid-editor-tooltip'),

		/**
   * Render help tooltips.
   *
   * @since 1.2.7
   */
		renderTooltips: function () {
			$.each(BoldgridEditor.builder_config.helpTooltip, function (selector, message) {
				BG.Panel.$element.add(BOLDGRID.EDITOR.CONTROLS.Color.$colorPanel).find(selector).each(function () {
					var $this = $(this);

					if (false === $this.children().first().hasClass('boldgrid-tooltip-wrap')) {
						$this.prepend(self.template({ 'message': message }));
					}
				});
			});
		}
	};

	self = BOLDGRID.EDITOR.Tooltip;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/util.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

(function ($) {
	'use strict';

	var self,
	    BG = BOLDGRID.EDITOR;

	BG.Util = {

		/**
   * Convert Pixels to Ems.
   *
   * @since 1.2.7
   * @return string ems;
   */
		convertPxToEm: function (px, fontSize) {
			var ems = 0;

			fontSize = fontSize ? parseInt(fontSize) : 0;
			px = px ? parseInt(px) : 0;

			if (fontSize && px) {
				ems = (px / fontSize).toFixed(1);
			}

			return ems;
		},

		/**
   * Get classes from an element %like% keyword.
   *
   * @since 1.2.7
   * @return string classes;
   */
		getClassesLike: function ($element, namespace) {
			var classString = $element.attr('class'),
			    allClasses = [],
			    classes = [];

			allClasses = classString ? classString.split(' ') : [];

			$.each(allClasses, function () {
				if (0 === this.indexOf(namespace)) {
					classes.push(this);
				}
			});

			return classes;
		},

		/**
   * Get all component classes.
   *
   * @since 1.5
   *
   * @param  {string} classes         Class string to test.
   * @param  {string} componentPrefix Component class name.
   * @return {array}                  Name of classes.
   */
		getComponentClasses: function (classes, prefix) {
			var $temp = $('<div>').attr('class', classes),
			    componentClasses = self.getClassesLike($temp, prefix);

			$temp.remove();

			return componentClasses;
		},

		/**
   * Remove All component classes from an element.
   *
   * @since 1.5
   *
   * @param  {jQuery} $el    Element to modify.
   * @param  {string} prefix Compnent class name.
   */
		removeComponentClasses: function ($el, prefix) {
			var pattern = '(^|\\s)' + prefix + '\\S+',
			    rgxp = new RegExp(pattern, 'g');

			$el.removeClass(function (index, css) {
				return (css.match(rgxp) || []).join(' ');
			});
		},

		/**
   * Check the users browser.
   *
   * @since 1.4
   *
   * @return {string} User browser.
   */
		checkBrowser: function () {
			var browser,
			    chrome = navigator.userAgent.search('Chrome'),
			    firefox = navigator.userAgent.search('Firefox'),
			    ie8 = navigator.userAgent.search('MSIE 8.0'),
			    ie9 = navigator.userAgent.search('MSIE 9.0');

			if (chrome > -1) {
				browser = 'Chrome';
			} else if (firefox > -1) {
				browser = 'Firefox';
			} else if (ie9 > -1) {
				browser = 'MSIE 9.0';
			} else if (ie8 > -1) {
				browser = 'MSIE 8.0';
			}
			return browser;
		}
	};

	self = BOLDGRID.EDITOR.Util;
})(jQuery);

/***/ }),

/***/ "./assets/js/builder/validation/section.js":
/***/ (function(module, exports) {

BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.VALIDATION = BOLDGRID.EDITOR.VALIDATION || {};

(function ($) {
	'use strict';

	BOLDGRID.EDITOR.VALIDATION.Section = {};
	var self = BOLDGRID.EDITOR.VALIDATION.Section;

	/**
  * Get the closest element within context.
  *
  * @since 1.2.7
  */
	$.fn.closestContext = function (sel, context) {
		var $closest;
		if (this.is(sel)) {
			$closest = this;
		} else {
			$closest = this.parentsUntil(context).filter(sel).eq(0);
		}

		return $closest;
	};

	var defaultContainerClass = 'container',
	    sectionClass = 'boldgrid-section',
	    section = '<div class="' + sectionClass + '"></div>',
	    container = '<div class="' + defaultContainerClass + '"></div>';

	/**
  * Find all top level content elements that are siblings and not in rows and wrap them.
  *
  * @since 1.2.7
  */
	var wrapElementGroup = function () {

		var wrap,
		    group = [],
		    contentSelector = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'a', 'img', 'p', 'button', 'ul', 'ol', 'dl', 'form', 'table', '[data-imhwpb-draggable="true"]', '.wpview-wrap', '.wpview', 'blockquote', 'code', 'abbr'].join(',');

		wrap = function () {
			$(group).wrapAll('<div class="' + defaultContainerClass + '"><div class="row"><div class="col-md-12">');
			group = [];
		};

		self.$context.find('> *').each(function () {
			var $this = $(this);

			if ($this.is(contentSelector)) {
				group.push(this);
			} else {
				wrap();
			}
		});

		wrap();
	};

	/**
  * Update content within context.
  *
  * @since 1.2.7
  * @param $context.
  */
	self.updateContent = function ($context) {

		defaultContainerClass = BoldgridEditor.default_container || 'container-fluid';
		container = '<div class="' + defaultContainerClass + '"></div>';

		self.$context = $context;

		// Wrap sibling content elements not in rows, into rows.
		wrapElementGroup();

		// Add Class boldgrid-section to all parent of containers.
		addSectionClass();

		// Wrap all containers in sections.
		wrapContainers();

		// If row has a parent add the section to the parent.
		addContainers();
		copyClasses();
	};

	/**
  * Copy classes from container-fluid onto section.
  *
  * @since 1.2.7
  */
	var copyClasses = function () {
		self.$context.find('.boldgrid-section > .container-fluid').each(function () {
			var $this = $(this),
			    classToAdd = $this.attr('class').replace('container-fluid', '');

			$this.attr('class', 'container-fluid');
			$this.parent().addClass(classToAdd);
		});
	};

	/**
  * Add section class to container parents.
  *
  * @since 1.2.7
  */
	var addSectionClass = function () {
		self.$context.find('.container').each(function () {
			var $this = $(this),
			    $parent = $this.parent();

			if ($parent.length && $parent[0] !== self.$context[0] && false === $parent.hasClass(sectionClass)) {
				$parent.addClass(sectionClass);
			}
		});
	};

	/**
  * Wrap top level rows in containers.
  *
  * @since 1.2.7
  */
	var addContainers = function () {
		self.$context.find('.row:not(.row .row)').each(function () {
			var $this = $(this),
			    $parent = $this.parent();

			if (!$this.closestContext('.container, .container-fluid', self.$context).length) {
				$this.wrap(container);
			}

			if (!$this.closestContext('.boldgrid-section', self.$context).length) {
				if ($parent.length && $parent[0] !== self.$context[0]) {
					$parent.addClass(sectionClass);
				} else {
					$this.parent().wrap(section);
				}
			}
		});
	};

	/**
  * Wrap containers in sections.
  *
  * @since 1.2.7
  */
	var wrapContainers = function () {
		self.$context.find('.container, .container-fluid').each(function () {
			var $this = $(this);

			if (!$this.parent('.boldgrid-section').length && false === $this.hasClass(sectionClass)) {
				$this.wrap(section);
			}
		});
	};
})(jQuery);

/***/ }),

/***/ "./assets/js/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
window.BOLDGRID = window.BOLDGRID || {};

function requireAll(r) {
	r.keys().forEach(r);
}
requireAll(__webpack_require__("./assets/js/builder recursive \\.js$"));

jQuery(function () {
	console.log(BOLDGRID);
});

/* harmony default export */ __webpack_exports__["default"] = ({
	'hdhdh': 'ddd'
});

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./assets/js/index.js");


/***/ })

/******/ });