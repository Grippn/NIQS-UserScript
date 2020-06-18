// ==UserScript==
// @name         NIQS: Freeze Tool
// @version      3.0
// @minGMVer     1.14
// @minFFVer     26
// @namespace    NIQS_Freeze_Tool
// @description  The Freeze tool allows you to select rows on the freeze page by supplying a list of UQs
// @author       Nicholas Grippo
// @license      MIT
// @include      https://iqstudio.nuance-va.com/*
// @include      https://iqstudio.nina-nuance.com/*
// @include      https://niw-niqs.nuance.mobi/*
// @connect      iqstudio.nuance-va.com
// @connect      iqstudio.nina-nuance.com
// @connect      niw-niqs.nuance.mobi
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/Grippn/NIQS-UserScript/master/NIQS/Freeze_Tool.user.js
// ==/UserScript==

//////////////// GUI Logic ////////////////

function createBtn() {
	const li = document.createElement("li");
	const button = document.createElement("button");
	button.id = 'selector1';
	button.type = "button";
	button.classList.add("outline");
	button.innerText = "Selector Script";
	li.appendChild(button);

	button.addEventListener("click", function () {
		insertDom(createPopup());
	});

	return li;
}

function addCopyBtn() {
	let CopyArray = createBtn();

	try {
		let controls = document.getElementsByClassName('controls1')[0];
		let controlsRight = controls.getElementsByClassName('controlsRight')[0];
		let controlsRightUL = controlsRight.getElementsByClassName('buttonSet right VersionAlignSearchBar')[0];

		if (!document.getElementById("selector1")) {
			controlsRightUL.insertBefore(CopyArray, controlsRightUL.firstElementChild);
			console.log("Added selector Btn");
		}
		else {
			console.log("Already Exists");
		}
	}
	catch (e) {
		console.log("ERROR: addCopyBtn");
	}

}

function myFunc() {
	if (document.getElementsByClassName('buttonSet right VersionAlignSearchBar')[0]) {
		addCopyBtn();
	}
	else {
		setTimeout(myFunc, 15);
	}
}

window.onhashchange = function () {
	console.log(location.hash);
	if (/#!version;/.test(location.hash)) {
		myFunc();
	}
};

if (/#!version;/.test(location.hash)) {
	myFunc();
}

//////////////// Selection Logic ////////////////

function createButton(_class, text, fun) {
	let btn = document.createElement("button");
	_class.forEach((Class) => {
		btn.classList.add(Class);
	});
	btn.type = "button";
	btn.innerText = text;

	if (fun) {
		btn.addEventListener("click", fun);
	}


	return btn;
}

function createDiv(_class, text) {
	let btn = document.createElement("div");
	_class.forEach((Class) => {
		btn.classList.add(Class);
	});
	if (text) {
		btn.innerText = text;
	}
	return btn;
}

function createTextArea() {
	let btn = document.createElement("textarea");
	// btn.style = "border: solid 1px orange; resize: vertical;";
	btn.style["border"] = "solid 1px orange";
	btn.style["resize"] = "vertical";
	btn.rows = 25;
	btn.cols = 50;

	return btn;
}

// noinspection DuplicatedCode
function createPopup() {

	let CancelBtn = createButton(["secondary"], "Cancel", function () {
		let popup = document.getElementById("selector2");
		popup.parentNode.removeChild(popup);
	});

	let RunBtn = createButton(["primary"], "Run", function () {
		start(document.getElementById("uqs").value, document.getElementById("kbs").value);
	});

	let li1 = document.createElement("li");
	li1.appendChild(CancelBtn);

	let li2 = document.createElement("li");
	li2.appendChild(RunBtn);

	let ul = document.createElement("ul");
	ul.classList.add("buttonSet");
	ul.classList.add("right");

	ul.appendChild(li1);
	ul.appendChild(li2);

	let buttonSetPaneWithLine = createDiv(["buttonSetPaneWithLine"]);
	buttonSetPaneWithLine.appendChild(ul);

	let SelectMessage = createDiv(["popupMessage", "popupMessageAdditionalProps"], "Please enter your list of User Questions");
	let tx1 = createTextArea();
	tx1.id = "uqs";


	let ExcludeMessage = createDiv(["popupMessage", "popupMessageAdditionalProps"], "Please enter your list of KBs to Exclude");
	let tx2 = createTextArea();
	tx2.id = "kbs";

	let popupTitle = createDiv(["popupTitle"], "Selector Script");

	let Contain = createDiv([]);


	Contain.appendChild(popupTitle);
	Contain.appendChild(SelectMessage);
	Contain.appendChild(tx1);
	Contain.appendChild(ExcludeMessage);
	Contain.appendChild(tx2);
	Contain.appendChild(buttonSetPaneWithLine);

	let popupContent = createDiv(["popupContent"]);

	popupContent.appendChild(Contain);

	let PopupPanel = document.createElement("div");
	PopupPanel.classList.add("gwt-PopupPanel");
	// PopupPanel.style = "margin: 0px auto;/* top: 0px; */width: fit-content;height: auto;position: absolute;z-index: 10000;/* resize: both; */left: 40%;overflow: auto;/* -webkit-user-drag: element; */";
	PopupPanel.style["margin"] = "0px auto";
	PopupPanel.style["width"] = "fit-content";
	PopupPanel.style["height"] = "auto";
	PopupPanel.style["position"] = "absolute";
	PopupPanel.style["z-index"] = "10000";
	PopupPanel.style["left"] = "40%";
	PopupPanel.style["overflow"] = "auto";
	PopupPanel.id = "selector2";

	PopupPanel.appendChild(popupContent);

	return PopupPanel;

}

function createPopup2(Leftovers, LeftoversKB) {
	// noinspection DuplicatedCode
	if ((Leftovers && Leftovers.length >= 1) || (LeftoversKB && LeftoversKB.length >= 1)) {
		let CancelBtn = createButton(["primary"], "Done", function () {
			let popup = document.getElementById("selector3");
			popup.parentNode.removeChild(popup);
		});

		let li1 = document.createElement("li");
		li1.appendChild(CancelBtn);

		let ul = document.createElement("ul");
		ul.classList.add("buttonSet");
		ul.classList.add("right");
		ul.appendChild(li1);
		let buttonSetPaneWithLine = createDiv(["buttonSetPaneWithLine"]);
		buttonSetPaneWithLine.appendChild(ul);


		let popupTitle = createDiv(["popupTitle"], "Selection Results");

		let Contain = createDiv([]);


		Contain.appendChild(popupTitle);

		if (Leftovers && Leftovers.length >= 1) {
			let _Leftovers = Leftovers.join("\n");

			let SelectMessage = createDiv(["popupMessage", "popupMessageAdditionalProps"], "Did not find the following UQs");
			let tx1 = createTextArea();
			tx1.id = "uqs1";
			tx1.value = _Leftovers;

			Contain.appendChild(SelectMessage);
			Contain.appendChild(tx1);
		}

		if (LeftoversKB && LeftoversKB.length >= 1) {
			let _LeftoversKB = LeftoversKB.join("\n");
			let ExcludeMessage = createDiv(["popupMessage", "popupMessageAdditionalProps"], "Did not find the following KBs");
			let tx2 = createTextArea();
			tx2.id = "kbs1";
			tx2.value = _LeftoversKB;
			Contain.appendChild(ExcludeMessage);
			Contain.appendChild(tx2);
		}


		Contain.appendChild(buttonSetPaneWithLine);

		let popupContent = createDiv(["popupContent"]);

		popupContent.appendChild(Contain);

		let PopupPanel = document.createElement("div");
		PopupPanel.classList.add("gwt-PopupPanel");
		// PopupPanel.style = "margin: 0px auto;/* top: 0px; */width: fit-content;height: auto;position: absolute;z-index: 10000;/* resize: both; */left: 40%;overflow: auto;/* -webkit-user-drag: element; */";
		PopupPanel.style["margin"] = "0px auto";
		PopupPanel.style["width"] = "fit-content";
		PopupPanel.style["height"] = "auto";
		PopupPanel.style["position"] = "absolute";
		PopupPanel.style["z-index"] = "10000";
		PopupPanel.style["left"] = "40%";
		PopupPanel.style["overflow"] = "auto";
		// PopupPanel.style["top"] = "0px";
		// PopupPanel.style["resize"] = "both";
		// PopupPanel.style["-webkit-user-drag"] = "element";


		PopupPanel.id = "selector3";

		PopupPanel.appendChild(popupContent);

		return PopupPanel;

	}
}

function insertDom(newNode) {

	let referenceNode = document.getElementsByClassName("searchConfigMenu")[0];

	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

}

function start(uqs, kbs) {

	let _uqs = uqs.split("\n");
	let _kbs = kbs.split("\n");

	let trimmed_uqs = _uqs.map(str => str.trim());
	let trimmed_kbs = _kbs.map(str => str.trim());

	clickAutoKB();

	deselectAll();

	let plzSelect = trimmed_uqs;
	let plzSelectKB = trimmed_kbs;

	let plzSelectCopy = [...plzSelect];
	let plzSelectKBCopy = [...plzSelectKB];

	let data = getRows();

	[...document.querySelectorAll(".expandOpen")].forEach((e) => {
		e.click();
	});

	for (let key in data) {
		// console.log(`${key} --> ${data[key]}`);
		if (key !== "CA" && key !== "OT" && key !== "KB") {
			if (data[key]) {
				console.log("Using this Key: " + key);

				data[key].forEach((node) => {
					let UQ_Name = getName(node);
					if (UQ_Name) {
						if (plzSelect.includes(UQ_Name)) {
							clickNode(node);
							plzSelectCopy = removeElement(plzSelectCopy, UQ_Name);

							let catNode = data["CA"][key];
							if (catNode) {
								let arrow = catNode.querySelectorAll(".expandClosed")[0];
								if (arrow) {
									arrow.click();
								}
								else {
									console.log("Something went wrong more");
								}
							}
							else {
								console.log("Something went wrong");
							}
						}
						else {
							console.log("Node not in Freeze List");
						}
					}
					else {
						console.log("Couldn't Find Node Name");
					}
				});
			}
			else {
				console.log("Didn't find anything for that key " + key);
			}
		}
	}


	data["KB"].forEach((node) => {
		let UQ_Name = getName(node);
		if (UQ_Name) {
			if (plzSelectKB.includes(UQ_Name)) {
				uncheckNode(node);
				plzSelectKBCopy = removeElement(plzSelectKBCopy, UQ_Name);
				let catNode = data["CA"]["KB"];
				if (catNode) {
					let arrow = catNode.querySelectorAll(".expandClosed")[0];
					if (arrow) {
						arrow.click();
					}
					else {
						console.log("Something went wrong more");
					}
				}
				else {
					console.log("Something went wrong");
				}
			}
			else {
				console.log("Node not in Freeze List");
			}
		}
		else {
			console.log("Couldn't Find Node Name");
		}
	});


	let popup = document.getElementById("selector2");
	popup.parentNode.removeChild(popup);

	plzSelectCopy = plzSelectCopy.filter(e => String(e).trim());


	plzSelectKBCopy = plzSelectKBCopy.filter(e => String(e).trim());


	let pop2 = createPopup2(plzSelectCopy, plzSelectKBCopy);
	if (pop2) {
		insertDom(pop2);
	}

}

function getRows() {
	let KB = [];
	let UQ = [];
	let SO = [];
	let GR = [];
	let NE = [];
	let PA = [];
	let MU = [];
	let IN = [];
	let OT = [];
	let CA = {};
	let currentBox = "OT";

	[...document.querySelectorAll(".tableData > tbody > tr")].map((tr) => {
		let cat = false;
		if (tr.getElementsByClassName("category")[0]) {
			if (tr.getElementsByClassName("category")[0].innerHTML === "KB articles") {
				currentBox = "KB";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Business") {
				currentBox = "UQ";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Social") {
				currentBox = "SO";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Greeting") {
				currentBox = "GR";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Negative") {
				currentBox = "NE";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Post answer") {
				currentBox = "PA";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Manage URLs") {
				currentBox = "MU";
				cat = true;
			}
			else if (tr.getElementsByClassName("category")[0].innerHTML === "Incomprehension") {
				currentBox = "IN";
				cat = true;
			}
			else {
				currentBox = "OT";
				cat = true;
			}
		}

		if (!cat) {
			switch (currentBox) {
				case "KB":
					if (!tr.classList.contains("tableExpandedRow")) {
						KB.push(tr);
					}
					break;
				case "UQ":
					if (!tr.classList.contains("tableExpandedRow")) {
						UQ.push(tr);
					}
					break;
				case "SO":
					if (!tr.classList.contains("tableExpandedRow")) {
						SO.push(tr);
					}
					break;
				case "GR":
					if (!tr.classList.contains("tableExpandedRow")) {
						GR.push(tr);
					}
					break;
				case "NE":
					if (!tr.classList.contains("tableExpandedRow")) {
						NE.push(tr);
					}
					break;
				case "PA":
					if (!tr.classList.contains("tableExpandedRow")) {
						PA.push(tr);
					}
					break;
				case "MU":
					if (!tr.classList.contains("tableExpandedRow")) {
						MU.push(tr);
					}
					break;
				case "IN":
					if (!tr.classList.contains("tableExpandedRow")) {
						IN.push(tr);
					}
					break;
				case "OT":
					if (!tr.classList.contains("tableExpandedRow")) {
						OT.push(tr);
					}
					break;
				default:
					if (!tr.classList.contains("tableExpandedRow")) {
						OT.push(tr);
					}
					break;
			}
		}
		else {
			if (currentBox !== "OT") {
				CA[currentBox] = tr;
			}


		}
	});

	return {
		"KB": KB,
		"UQ": UQ,
		"SO": SO,
		"GR": GR,
		"NE": NE,
		"PA": PA,
		"MU": MU,
		"IN": IN,
		"OT": OT,
		"CA": CA
	};

}

function getName(node) {
	let lastNode = node.lastElementChild;
	if (lastNode.getElementsByTagName("A")[0]) {
		return lastNode.getElementsByTagName("A")[0].innerText.trim();
	}
	else {
		lastNode.textContent.trim();
	}

}

function removeElement(arr) {
	let what;
	const a = arguments;
	let L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

function clickNode(node) {

	let checkBox = node.querySelector('input[value][type="checkbox"]');

	if (checkBox.checked !== true) {
		checkBox.click();
	}

}

function uncheckNode(node) {

	let checkBox = node.querySelector('input[value][type="checkbox"]');

	if (checkBox.checked === true) {
		checkBox.click();
	}

}

function deselectAll() {
	let Auto_KB_check_box = document.getElementsByClassName("tableHead versionTableHead")[0].getElementsByClassName("gwt-CheckBox")[0].querySelector('input[value][type="checkbox"]');
	if (Auto_KB_check_box.checked === false) {
		Auto_KB_check_box.click();
		Auto_KB_check_box.click();
	}
	else {
		Auto_KB_check_box.click();
		Auto_KB_check_box.click();
		Auto_KB_check_box.click();
	}
}

function clickAutoKB() {
	let freezeControls = document.getElementsByClassName("freeze")[0];
	let AKB_Box = freezeControls.getElementsByClassName("gwt-CheckBox")[0];
	let Auto_KB_check_box = AKB_Box.querySelector('input[value][type="checkbox"]');
	if (Auto_KB_check_box.checked === false) {
		Auto_KB_check_box.click();
	}
}
