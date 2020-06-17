// ==UserScript==
// @name         NIQS: Collapse Table Logs
// @version      3.1.0
// @minGMVer     1.14
// @minFFVer     26
// @namespace    NIQS_Collapse_Table_Logs
// @description  Collapse Table Logs allows you to collapse the log lines in the debug log of NIQS preview
// @author       Nicholas Grippo
// @license      MIT
// @include      https://iqstudio.nuance-va.com/*
// @include      https://iqstudio.nina-nuance.com/*
// @include      https://niw-niqs.nuance.mobi/*
// @connect      iqstudio.nuance-va.com
// @connect      iqstudio.nina-nuance.com
// @connect      niw-niqs.nuance.mobi
// @resource     jqueryCSS https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @resource     myCSS https://gist.githubusercontent.com/Grippn/da5a9684a31e14f60f9464fbaedad5b8/raw/cecb8c62694a1f6163b69ffd8a55df25ea025158/mycss.css
// @resource     expand_all https://gist.githubusercontent.com/Grippn/1f5dcd691aa70dd5ab1d600481642555/raw/6b1ce24498390ef697133958502154f377bed3d6/expand_all.svg
// @resource     minimize_all https://gist.githubusercontent.com/Grippn/0f0caf1b78caffa222e883bf4ae20a3b/raw/d734f4392918f9a74b1f1bbb5f72d1a7182c8eb4/minimize_all.svg
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/Grippn/NIQS-UserScript/master/Collapse_Table_Logs.js
// @downloadURL  https://raw.githubusercontent.com/Grippn/NIQS-UserScript/master/Collapse_Table_Logs.js
// ==/UserScript==

//Global Vars
//////////////////
const $ = window.jQuery;
const jqueryCSS = GM_getResourceText("jqueryCSS");
const myCSS = GM_getResourceText("myCSS");
const minimize_all = GM_getResourceText("minimize_all");
const expand_all = GM_getResourceText("expand_all");

//Custom Classes
//////////////////
GM_addStyle(jqueryCSS);
GM_addStyle(myCSS);
GM_addStyle(".hideDiv{height: 23px !important; overflow: hidden;}");
GM_addStyle(".hideIcon{display: none;}");
GM_addStyle(".BtnIcon {     width: 30px;     padding-left: 10px;    height 21px; }  .BtnIcon > .expand {     display: none }  .BtnIcon > .min {   display: block }  .BtnIcon.collapsed > .expand {     display: block }  .BtnIcon.collapsed > .min {    display: none }  ");
GM_addStyle(".rotate{ height:10px; width:10px; transition: all .2s ease-in-out;}  .rotate.down{ transform:rotate(-90deg); transform-origin: 65% 65%;}  .actArrow:hover::before {  border-color: red; /* For the arrow (which is a border) */}  .actArrow::before {  position: relative;  content: '';  display: inline-block;  width: 0.8em;  height: 0.8em;  border-right: 0.2em solid black;  border-top: 0.2em solid black;  transform: rotate(135deg);  margin-right: 0.5em; }");


// Helper Functions
////////////////////////////
function createDiv(type, className, innerHTML) {
	let element = document.createElement(type);
	if (innerHTML) {
		element.innerHTML = expand_all;
	}
	if (className) {
		element.className = className;
	}
	return element;
}

function createIcon(type) {
	let IconBtn = document.createElement("div");

	switch (type) {
		case "row":
			IconBtn.className = "BtnIcon";
			IconBtn.appendChild(createDiv('div', 'expand', expand_all));
			IconBtn.appendChild(createDiv('div', 'min', minimize_all));
			break;
		case "interaction":
			IconBtn.className = "actArrow rotate";
			IconBtn.style['margin-left'] = "9px";
			IconBtn.style['padding-bottom'] = "10px";
			break;
	}

	return IconBtn;
}

function createBtn(type) {
	let CopyBtn;

	switch (type) {
		case "NewCollapseInteraction":
			CopyBtn = document.createElement("div");
			break;
		default:
			CopyBtn = document.createElement("button");
	}

	switch (type) {
		case "CollapseRows":
			CopyBtn.innerHTML = "Collapse Rows";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.id = 'CollapseRows';
			CopyBtn.title = 'Collapse Rows';
			break;
		case "CollapseInteractions":
			CopyBtn.innerHTML = "Collapse Interactions";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.id = 'CollapseInteractions';
			CopyBtn.title = 'Collapse Interactions';
			break;
		case "CollapseAll":
			CopyBtn.innerHTML = "Collapse All";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.id = 'collapseAll';
			CopyBtn.title = 'Collapse All';
			break;
		case "ViewContext":
			CopyBtn.innerHTML = "View Context";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.title = 'View Context';
			break;
		case "ViewMeta":
			CopyBtn.innerHTML = "View MetaData";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.title = 'View MetaData';
			break;
		case "collapseInteraction":
			CopyBtn.innerHTML = "Collapse Rows";
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			//CopyBtn.id = 'collapseAll';
			CopyBtn.title = 'Collapse Rows';
			break;
		case "NewCollapseInteraction":
			CopyBtn.innerHTML = minimize_all + expand_all;
			//CopyBtn.style = 'position: absolute; left: 400px; bottom: 10px';
			//CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			//CopyBtn.id = 'collapseAll';
			CopyBtn.title = 'Collapse Rows';
			break;
		default:
			CopyBtn.innerHTML = (type !== undefined ? type : "");
			CopyBtn.className = 'ui-button ui-widget ui-corner-all gwt-Button outline';
			CopyBtn.id = (type !== undefined ? type : "");
			CopyBtn.title = (type !== undefined ? type : "");
	}

	return CopyBtn;
}

function makeInteractionCollapseBtn(inter_index, allIDs) {
	const otherButton = document.createElement("th");

	otherButton.style['width'] = '40px';

	otherButton.style['padding-left'] = '8px';

	const interactionBtn = createIcon("interaction");

	otherButton.appendChild(interactionBtn);

	otherButton.id = "collapseInteraction_" + inter_index;

	$(otherButton).prependTo('#inter-' + inter_index);

	let collapseInteraction_index = $("#collapseInteraction_" + inter_index);

	collapseInteraction_index.bind("click", function () {
		const $this = $(this);
		$(interactionBtn).toggleClass("down");
		$(allIDs).toggle("fast");
	});

	collapseInteraction_index.bind("collapse_all", function () {
		if (!$(interactionBtn).hasClass("down")) {
			$(interactionBtn).toggleClass("down");
			$(allIDs).toggle("fast");
		}

	});
}

function makeRowsCollapseBtn(inter_index, allIDs) {
	const ControlContainer = document.createElement("th");
	ControlContainer.style['width'] = '40px';
	ControlContainer.style['padding-bottom'] = '5px';
	ControlContainer.style['padding-top'] = '10px';

	const btn = createIcon("row");

	btn.id = "collapseRows_" + inter_index;

	ControlContainer.appendChild(btn);

	$(ControlContainer).prependTo('#inter-' + inter_index);

	let collapseRows_index = $("#collapseRows_" + inter_index);

	collapseRows_index.bind("click", function () {
		if ($("#collapseRows_" + inter_index).hasClass("collapsed")) {
			$.each(allIDs.split(','), function (i, val) {
				if ($(val).attr('collapsed') === "true" || $(val).attr('collapsed') === true) {
					$(val + " > td:nth-child(2) > div").trigger("click");
				}
			});
		}
		else {
			$.each(allIDs.split(','), function (i, val) {
				if ($(val).attr('collapsed') === "false" || $(val).attr('collapsed') === false) {
					$(val + " > td:nth-child(2) > div").trigger("click");
				}
			});
		}

		$(this).toggleClass("collapsed");
		event.stopImmediatePropagation();
	});

	collapseRows_index.bind("collapse_all", function () {
		$.each(allIDs.split(','), function (i, val) {
			if ($(val).attr('collapsed') === "false" || $(val).attr('collapsed') === false) {
				$(val + " > td:nth-child(2) > div").trigger("click");
			}
		});
		if (!$("#collapseRows_" + inter_index).hasClass("collapsed")) {
			$(this).toggleClass("collapsed");
		}
		event.stopImmediatePropagation();
	});
}

function setContextAndMetaLinkIDs(lastRow, inter_index) {
	const data = $($(lastRow).find('td')[2]).find('div')[0];

	const triggers = $(data).find('.gwt-Anchor');

	$(triggers[0]).attr('id', "contextLink_" + inter_index);

	$(triggers[1]).attr('id', "metaLink_" + inter_index);

}

function makeMetaBtn(inter_index) {
	const cell = document.createElement("th");
	const metaBtn = createBtn("ViewMeta");

	$(metaBtn).bind("click", function () {
		const meta = document.querySelector('#metaLink_' + inter_index);
		meta.click();
	});
	cell.style['width'] = '133px';
	cell.style['min-width'] = '133px';
	cell.prepend(metaBtn);
	$(cell).prependTo('#inter-' + inter_index);
}

function makeContextBtn(inter_index) {
	const cell = document.createElement("th");
	const contextBtn = createBtn("ViewContext");

	$(contextBtn).bind("click", function () {
		const context = document.querySelector('#contextLink_' + inter_index);
		context.click();
	});
	cell.style['width'] = '133px';
	cell.style['min-width'] = '133px';
	cell.prepend(contextBtn);
	$(cell).prependTo('#inter-' + inter_index);
}

function makeContextAndMetaBtn(inter_index, lastRow) {

	setContextAndMetaLinkIDs(lastRow, inter_index);

	makeMetaBtn(inter_index);

	makeContextBtn(inter_index);
}


//EXE
////////////////////////////
function addInteractionRow(firstRow, lastRow, addLength) {
	//Adding a Interaction Row

	const interactionIndex = document.querySelectorAll("[id^='inter-']").length;

	const getIDs = () => {
		let sIndex = parseInt(firstRow.id.replace('WDBlog-', ''));
		let stringID = "";
		for (let index = 0; index < addLength; index++) {
			stringID += `#WDBlog-${sIndex}, `;
			sIndex += 1;
		}
		return stringID.slice(0, -2);
	};

	const createInteractionRow = () => {

		let agentResponses = document.querySelectorAll(".agent");

		let agentResponse = agentResponses[agentResponses.length - 1];

		let tr = createDiv('tr');
		tr.id = `inter-${interactionIndex}`;

		let th1 = createDiv('th');
		th1.colSpan = '1';
		th1.style['text-align'] = 'left';
		th1.innerHTML = `Interaction: ${interactionIndex} | ${agentResponse.innerText}`;

		let th2 = createDiv('th');
		th2.style['width'] = '100px';
		th2.style['min-width'] = '100px';

		let th3 = createDiv('th');


		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);

		return tr;
	};

	const allIDs = getIDs();

	const iRow = createInteractionRow(interactionIndex);

	firstRow.parentNode.insertBefore(iRow, firstRow);

	makeContextAndMetaBtn(interactionIndex, lastRow);

	makeRowsCollapseBtn(interactionIndex, allIDs);

	makeInteractionCollapseBtn(interactionIndex, allIDs);
}

function addCell(element) {
	const CopyBtn = document.createElement("td");
	const icon = document.createElement("div");
	icon.className = "plus-minus-toggle collapsed";
	CopyBtn.appendChild(icon);

	$(icon).on('click', function () {
		$(element).trigger("collapse");
		$(this).toggleClass('collapsed');
	});

	$(element).prepend(CopyBtn);
	$(element).prepend(document.createElement("td"));

}

function modAddedRows(myArray) {
	for (let index = 0; index < myArray.length; index++) {
		//console.log(myArray[index]);
		const element = $(myArray[index]);
		$($(element).find('div')[0]).css("width", "761px");
		$($(element).find('div')[0]).css("min-width", "761px");
		addCell(element);

		$(element).attr('collapsed', false);

		element.bind("collapse", function () {
			const $this = $(this);
			const td = $this.find('td')[4];
			let $div = $($(td).find('div')[0]);

			if ($div[0]) {
				if ($div.hasClass("hideDiv")) {
					$div.removeClass("hideDiv");
					$(this).attr('collapsed', false);
				}
				else {
					$div.addClass("hideDiv");
					$(this).attr('collapsed', true);
				}
			}
			else {
				$(td).wrapInner("<div class='hideDiv'></div>");
				$div = $($(td).find('div')[0]);
				$div.addClass("hideDiv");
				$(this).attr('collapsed', true);
			}

			//var td_icon = $this.find('td')[1];
			//var div_icon = $($(td_icon).find('div')[0]);
			//$(div_icon).toggleClass('collapsed');
		});
	}
}

function handleDiscographyChanges(muteSummaries) {
	const myArray = muteSummaries[0]['added'];

	if (myArray[0] !== undefined && myArray[0] !== [] && myArray.length !== 0) {

		//Adding a Interaction Row
		addInteractionRow(myArray[0], myArray[myArray.length - 1], myArray.length);

		//Modding the Log Rows
		modAddedRows(myArray);
	}
}

function fixTableHeader(tableHead) {
	const Rows = $(tableHead).find('td');

	const Module = Rows[0];
	const event = Rows[1];
	const kLog = Rows[2];
	const Type = Rows[3];
	const Tags = Rows[4];

	const cell = document.createElement("td");
	$(Module).before(cell);

	$(cell).css("width", "80px");
	$(Module).css("width", "133px");
	$(event).css("width", "133px");
	$(kLog).css("width", "777px");
}

function addControls() {
	const ControlContainer = document.createElement("div");

	ControlContainer.style['position'] = 'absolute';
	ControlContainer.style['left'] = '400px';
	ControlContainer.style['bottom'] = '10px';

	const collapseRowsBtn = createBtn("CollapseRows");
	$(collapseRowsBtn).bind("click", function () {
		$("[id^=collapseRows_]").trigger("collapse_all");
	});

	const collapseInterBtn = createBtn("CollapseInteractions");
	$(collapseInterBtn).bind("click", function () {
		$("[id^=collapseInteraction_]").trigger("collapse_all");
	});

	const collapseAllBtn = createBtn("CollapseAll");
	$(collapseAllBtn).bind("click", function () {
		$("[id^=collapseRows_]").trigger("collapse_all");
		$("[id^=collapseInteraction_]").trigger("collapse_all");
	});

	ControlContainer.appendChild(collapseInterBtn);
	ControlContainer.appendChild(collapseRowsBtn);
	ControlContainer.appendChild(collapseAllBtn);
	$(ControlContainer).appendTo('.controls');
}


// Main
////////////////////////////

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

	checkElement('.available').then((available) => {
		checkElement('.tableHead tbody').then((tableHead) => {
			fixTableHeader(tableHead);
			addControls();
			checkElement('.splitViewChatRightPaneData')
				.then((splitViewChatRightPaneData) => {
					checkElement('.tableData')
						.then((tableData) => {
							tableData.style["table-layout"] = "unset";
							let muteObserver = new MutationSummary({
								callback: handleDiscographyChanges,
								rootNode: splitViewChatRightPaneData.querySelector('tbody'),
								queries: [{
									element: "tr"
								}]
							});
						});
				});
		});
	});
}

(function () {
	'use strict';

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