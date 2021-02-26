// ==UserScript==
// @name         My Test Script
// @version      1.2
// @minGMVer     1.14
// @minFFVer     26
// @description  Collapse Table Logs allows you to collapse the log lines in the debug log of NIQS preview
// @author       Nicholas Grippo
// @license      MIT
// @include      https://iqstudio.nuance-va.com/*
// @include      https://iqstudio.nina-nuance.com/*
// @include      https://niw-niqs.nuance.mobi/*
// @connect      iqstudio.nuance-va.com
// @connect      iqstudio.nina-nuance.com
// @connect      niw-niqs.nuance.mobi
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// @require      http://127.0.0.1:8080/jsoneditor/dist/jsoneditor.js
// @require      http://127.0.0.1:8080/he.js
// @resource     IMPORTED_CSS http://127.0.0.1:8080/jsoneditor/dist/jsoneditor.css
// @resource     JSONEDITOR http://127.0.0.1:8080/jsoneditor/dist/jsoneditor.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @inject-into  page
// ==/UserScript==


function start() {
	function rafAsync() {
		return new Promise(resolve => {
			requestAnimationFrame(resolve); //faster than set time out
		});
	}

	async function checkElement(selector) {
		const querySelector = document.querySelector(selector);
		while (document.querySelector(selector) === null) {
			await rafAsync();
		}
		return document.querySelector(selector);
	}

	let editor;
	let moduleName;
	let callingType;
	let callingNode;
	let jsonData;
	let jsonType;
	let NewWindow;

	function openNewEditor(myJson, name, _moduleName, _callingType, _callingNode) {

		if(!NewWindow){
			NewWindow = window.open("", "_blank", "width=600,height=700");
			NewWindow.onunload = function () {
				editor = undefined;
				NewWindow = undefined;
			};
			let head = NewWindow.document.head || NewWindow.document.getElementsByTagName("head")[0];

			let JSONEDITOR = GM_getResourceText("JSONEDITOR");
			let jsonEditorCode = NewWindow.document.createElement("script");
			jsonEditorCode.innerHTML = JSONEDITOR;
			head.appendChild(jsonEditorCode);

			let IMPORTED_CSS = GM_getResourceText("IMPORTED_CSS");
			let jsonEditorStyles = NewWindow.document.createElement("style");
			jsonEditorStyles.innerHTML = IMPORTED_CSS;
			head.appendChild(jsonEditorStyles);

			// let css = GM_getResourceText("IMPORTED_CSS");
			// let head = NewWindow.document.head || NewWindow.document.getElementsByTagName("head")[0];
			// let style = document.createElement("style");
			// style.appendChild(document.createTextNode(css));
			// head.appendChild(style);

			function injectThis() {
				const colorPickerStyles = JSONEditor.VanillaPicker.StyleElement.cloneNode(true);
				this.document.head.append(colorPickerStyles);

				const container = this.document.createElement("div");
				this.document.body.append(container);

				// create the editor
				const options = {
					// Show sort and transform modals in the NewWindow window, not the parent.
					modalAnchor: this.document.body,
					modes: ["text", "code", "tree", "form", "view"],
					mode: "code"
				};
				editor = new JSONEditor(container, options);
				this.jsonEditor = editor;
			}

			let theScript = NewWindow.document.createElement("script");
			theScript.innerHTML = "(" + injectThis.toString() + "());";
			head.appendChild(theScript);

		}


		let head = NewWindow.document.head || NewWindow.document.getElementsByTagName("head")[0];
		NewWindow.document.title = ` ${name} | ${_callingNode} | ${_callingType}`;
		NewWindow.myCoolJSON = myJson;

		function updateJSON() {
			this.jsonEditor.set(this.myCoolJSON);
		}

		let updateScript = NewWindow.document.createElement("script");
		updateScript.innerHTML = "(" + updateJSON.toString() + "());";
		head.appendChild(updateScript);

	}

	const removeNewlineAndNBSP = (str) => {
		let reNBSP = new RegExp(String.fromCharCode(160), "g");
		let reNewLine = new RegExp(String.fromCharCode(13), "g");
		return str.replace(reNBSP, " ").replace(reNewLine, " ");
	};

	const getJsonFromRequest = (string) => {
		const htmlDecode = input => {
			let doc = new DOMParser().parseFromString(input, "text/html");
			return doc.documentElement.textContent;
		}; //he.decode(data) // I could replace my function with the he lib

		const getJsonFromString = str => {
			let temp1 = removeNewlineAndNBSP(str);
			let temp2 = temp1.split(/\s{4}/);
			let temp3 = temp2[0].replace(/\s+/g, " ");
			let temp4 = temp3.split("-d '");
			let temp5 = temp4[1].split("' http://localhost:3000/");
			return temp5[0];
		};

		return htmlDecode(getJsonFromString(string));
	};

	function handleDiscographyChanges(muteSummaries) {
		const myArray = muteSummaries[0]["added"];

		if (myArray[0] !== undefined && myArray[0] !== [] && myArray.length !== 0) {
			try {
				let popupData = myArray[0].querySelector(".popupMessage.popupMessageAdditionalProps");
				let popupName = myArray[0].querySelector(".popupTitle");
				if (popupData && popupName) {
					popupData = myArray[0].querySelector(".popupMessage.popupMessageAdditionalProps").textContent;
					popupName = myArray[0].querySelector(".popupTitle").textContent;
					if (popupData) {
						if (popupName === "Metadata" || popupName === "Context" || popupName === "Request helper") {
							try {
								if (popupName === "Request helper") {
									popupData = getJsonFromRequest(popupData);
								}
								else if (popupName === "Metadata" || popupName === "Context") {
									popupData = removeNewlineAndNBSP(popupData);
								}
								let button = myArray[0].querySelector(".primary");
								if (button) {
									button.click();
								}
								try {
									jsonData = JSON.parse(popupData);
									jsonType = popupName;
								} catch (e) {
									console.error(e);
								}
							} catch (e) {
								console.error(e);
							}
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	}


	// checkElement(".popupMessage").then((popupMessage) => {
	// 	let data = popupMessage.textContent;
	// 	let parsedJa = JSON.parse(data.replace(/("[^"]*")|\s/g, "$1"));
	// 	console.log(parsedJa);
	//
	//
	// 	openNewEditor(parsedJa);
	//
	//
	//
	//
	// 	// function fireNewTab () {
	// 	// 	var newTab = window.open("", "_blank", "width=400,height=400");
	// 	// 	newTab.document.title = 'JSONEditor | New window'
	// 	// 	newTab.addEventListener (
	// 	// 		"load",
	// 	// 		function () {
	// 	// 			//--- Now process the popup/tab, as desired.
	// 	// 			var destDoc = newTab.document;
	// 	// 			destDoc.open ();
	// 	// 			destDoc.write ('<html><head></head><body><ul><li>a</li><li>b</li><li>c</li></ul></body></html>');
	// 	// 			destDoc.close ();
	// 	// 		},
	// 	// 		false
	// 	// 	);
	// 	// }
	// 	//
	// 	// addJS_Node ("ssdfsfsf", null, fireNewTab);
	// 	//
	// 	// function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
	// 	// 	var D                                   = document;
	// 	// 	var scriptNode                          = D.createElement ('script');
	// 	// 	if (runOnLoad) {
	// 	// 		scriptNode.addEventListener ("load", runOnLoad, false);
	// 	// 	}
	// 	// 	scriptNode.type                         = "text/javascript";
	// 	// 	if (text)       scriptNode.textContent  = text;
	// 	// 	if (s_URL)      scriptNode.src          = s_URL;
	// 	// 	if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';
	// 	//
	// 	// 	var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
	// 	// 	targ.appendChild (scriptNode);
	// 	// }
	//
	//
	//
	// 	// $(popupMessage).replaceWith(`<div id="jsoneditor" style="width: 400px; height: 400px;"></div>`);
	//
	//
	// 	// openNewEditor();
	// 	// var container = document.getElementById("jsoneditor");
	// 	// var options = {
	// 	// 	modes: ['text', 'code', 'tree', 'form', 'view'],
	// 	// 	mode: 'code'
	// 	// };
	// 	// var editor = new JSONEditor(container, options);
	// 	//
	// 	// var json = {
	// 	// 	"Array": [1, 2, 3],
	// 	// 	"Boolean": true,
	// 	// 	"Null": null,
	// 	// 	"Number": 123,
	// 	// 	"Object": {"a": "b", "c": "d"},
	// 	// 	"String": "Hello World"
	// 	// };
	// 	// editor.set(json);
	// });


	checkElement(".available").then((available) => {
		if (document.getElementById("yolo")) {
			console.log("Already Loaded");
		}
		else {
			checkElement(".tableHead tbody")
				.then((tableHead) => {
					checkElement(".splitViewChatRightPaneData")
						.then((splitViewChatRightPaneData) => {
							checkElement(".tableData")
								.then((tableData) => {
									checkElement(".gwt-PopupPanel").then((PopupPanel) => {

										//listening for all click events on the document
										tableData.addEventListener("click", function (event) {

											//filtering for only events that happen on elements that contain the class
											//view_btn.

											let id_of_clicked_element = event.target.getAttribute("id"); //
											console.log(event.target);
											console.log("button clicked has is of " + id_of_clicked_element);


											try {
												function getNodeParent(node, search) {
													let parentNode = undefined;
													// console.log(`nodeName: ${node.nodeName.toUpperCase()}`);
													if (node.nodeName.toUpperCase() !== search.toUpperCase() || node.nodeName.toUpperCase() === "BODY") {
														parentNode = getNodeParent(node.parentNode, search);
														return parentNode;
													}
													else {
														return node;
													}
												}

												function getModuleName(node) {
													if (node && node.childNodes && node.childNodes[0]) {
														let eventName = node.childNodes[0].textContent;
														console.log(`ModuleName: ${eventName}`);
														return eventName;
													}
													else {
														return undefined;
													}
												}

												function getCallingNode(node) {
													if (node && node.childNodes && node.childNodes[2]) {
														let logs = node.childNodes[2].querySelectorAll(".kquery-log-event-container");
														if (logs && logs.length > 0) {
															const regex = /(?<=\$\(')(.*?)(?='\)\.on)/gm;
															let node = logs[0].title.match(regex);
															console.log(`CallingNode: ${node}`);
															return node;
														}
													}
													else {
														return undefined;
													}
												}

												function getCallingType(node) {
													if (node && node.childNodes && node.childNodes[2]) {
														let label = node.childNodes[2].querySelector(".gwt-Label");
														if (label) {
															console.log(`CallingType: ${label.textContent}`);
															return label.textContent;
														}
													}
													else {
														return undefined;
													}
												}


												if (event.target && event.target.parentNode) {
													let rootNode = getNodeParent(event.target, "TR");
													moduleName = getModuleName(rootNode);
													callingType = getCallingType(rootNode);
													callingNode = getCallingNode(rootNode);

													openNewEditor(jsonData, jsonType, moduleName, callingType, callingNode);


													// if (rootNode && rootNode.childNodes && rootNode.childNodes[0]) {
													// 	let eventName = parentNode.childNodes[0].textContent;
													// 	console.log(`eventName: ${eventName}`);
													//
													//
													// }
													//
													// let label = event.target.parentNode.querySelector(".gwt-Label");
													// if (label) {
													// 	let event = label.textContent;
													// 	console.log(`Event: ${event}`);
													// }
													// else {
													// 	let parentNode = getNodeParent(event.target, "TR");
													// 	if (parentNode && parentNode.childNodes && parentNode.childNodes[0]) {
													// 		let eventName = parentNode.childNodes[0].textContent;
													// 		console.log(`eventName: ${eventName}`);
													//
													//
													// 	}
													// }


												}
											} catch (e) {
												console.error(e);
											}


										});

										let muteObserver = new MutationSummary({
											callback: handleDiscographyChanges,
											rootNode: document.body,
											queries: [{
												element: "div.gwt-PopupPanel"
											}]
										});


									});
								});
						});
				});
		}
	});


}

(function () {
	"use strict";

	const my_css = GM_getResourceText("IMPORTED_CSS");
	GM_addStyle(my_css);
	GM_addStyle(`    #jsoneditor {
      width: 500px;
      height: 500px;
    }`);


	window.onhashchange = function () {
		console.log(location.hash);
		if (/#!chat;/.test(location.hash)) {
			start();
		}
	};

	if (/#!chat;/.test(location.hash)) {
		start();
	}

})();