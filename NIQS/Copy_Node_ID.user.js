// ==UserScript==
// @name         NIQS: Copy Node ID
// @version      2.1
// @minGMVer     1.14
// @minFFVer     26
// @namespace    NIQS_Copy_Node_ID
// @description  Adds a few Copy buttons to Node ID fields.
// @author       Nicholas Grippo
// @license      MIT
// @include      https://iqstudio.nuance-va.com/*
// @include      https://iqstudio.nina-nuance.com/*
// @include      https://niw-niqs.nuance.mobi/*
// @connect      iqstudio.nuance-va.com
// @connect      iqstudio.nina-nuance.com
// @connect      niw-niqs.nuance.mobi
// @resource     customCSS https://raw.githubusercontent.com/iamceege/tooltipster/master/dist/css/tooltipster.bundle.min.css
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// @require      https://raw.githubusercontent.com/iamceege/tooltipster/master/dist/js/tooltipster.bundle.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/Grippn/NIQS-UserScript/master/NIQS/Copy_Node_ID.user.js
// ==/UserScript==

const newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);

const copyIcon = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="511.627px" height="511.627px" viewBox="0 0 511.627 511.627" style="enable-background:new 0 0 511.627 511.627;"	 xml:space="preserve"><g>	<path d="M503.633,117.628c-5.332-5.327-11.8-7.993-19.41-7.993H365.446c-11.417,0-23.603,3.806-36.542,11.42V27.412		c0-7.616-2.662-14.092-7.994-19.417C315.578,2.666,309.11,0,301.492,0H182.725c-7.614,0-15.99,1.903-25.125,5.708		c-9.136,3.806-16.368,8.376-21.7,13.706L19.414,135.901c-5.33,5.329-9.9,12.563-13.706,21.698C1.903,166.738,0,175.108,0,182.725		v191.858c0,7.618,2.663,14.093,7.992,19.417c5.33,5.332,11.803,7.994,19.414,7.994h155.318v82.229c0,7.61,2.662,14.085,7.992,19.41		c5.327,5.332,11.8,7.994,19.414,7.994h274.091c7.61,0,14.085-2.662,19.41-7.994c5.332-5.325,7.994-11.8,7.994-19.41V137.046		C511.627,129.432,508.965,122.958,503.633,117.628z M328.904,170.449v85.364h-85.366L328.904,170.449z M146.178,60.813v85.364		H60.814L146.178,60.813z M202.139,245.535c-5.33,5.33-9.9,12.564-13.706,21.701c-3.805,9.141-5.708,17.508-5.708,25.126v73.083		H36.547V182.725h118.766c7.616,0,14.087-2.664,19.417-7.994c5.327-5.33,7.994-11.801,7.994-19.412V36.547h109.637v118.771		L202.139,245.535z M475.078,475.085H219.263V292.355h118.775c7.614,0,14.082-2.662,19.41-7.994		c5.328-5.325,7.994-11.797,7.994-19.41V146.178h109.629v328.907H475.078z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
const copyEIcon = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="447.674px" height="447.674px" viewBox="0 0 447.674 447.674" style="enable-background:new 0 0 447.674 447.674;"	 xml:space="preserve"><g>	<g>		<path d="M182.725,379.151c-0.572-1.522-0.769-2.816-0.575-3.863c0.193-1.04-0.472-1.902-1.997-2.566			c-1.525-0.664-2.286-1.191-2.286-1.567c0-0.38-1.093-0.667-3.284-0.855c-2.19-0.191-3.283-0.288-3.283-0.288h-3.71h-3.14H82.224			c-12.562,0-23.317-4.469-32.264-13.421c-8.945-8.946-13.417-19.698-13.417-32.258V123.335c0-12.562,4.471-23.313,13.417-32.259			c8.947-8.947,19.702-13.422,32.264-13.422h91.361c2.475,0,4.421-0.614,5.852-1.854c1.425-1.237,2.375-3.094,2.853-5.568			c0.476-2.474,0.763-4.708,0.859-6.707c0.094-1.997,0.048-4.521-0.144-7.566c-0.189-3.044-0.284-4.947-0.284-5.712			c0-2.474-0.905-4.611-2.712-6.423c-1.809-1.804-3.949-2.709-6.423-2.709H82.224c-22.648,0-42.016,8.042-58.101,24.125			C8.042,81.323,0,100.688,0,123.338v200.994c0,22.648,8.042,42.018,24.123,58.095c16.085,16.091,35.453,24.133,58.101,24.133			h91.365c2.475,0,4.422-0.622,5.852-1.854c1.425-1.239,2.375-3.094,2.853-5.571c0.476-2.471,0.763-4.716,0.859-6.707			c0.094-1.999,0.048-4.518-0.144-7.563C182.818,381.817,182.725,379.915,182.725,379.151z"/>		<path d="M442.249,210.989L286.935,55.67c-3.614-3.612-7.898-5.424-12.847-5.424c-4.949,0-9.233,1.812-12.851,5.424			c-3.617,3.617-5.424,7.904-5.424,12.85v82.226H127.907c-4.952,0-9.233,1.812-12.85,5.424c-3.617,3.617-5.424,7.901-5.424,12.85			v109.636c0,4.948,1.807,9.232,5.424,12.847c3.621,3.61,7.901,5.427,12.85,5.427h127.907v82.225c0,4.945,1.807,9.233,5.424,12.847			c3.617,3.617,7.901,5.428,12.851,5.428c4.948,0,9.232-1.811,12.847-5.428L442.249,236.69c3.617-3.62,5.425-7.898,5.425-12.848			C447.674,218.894,445.866,214.606,442.249,210.989z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
const carrot = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1498751358770" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2557" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M21.490332 682.20038c0-15.021112 5.711312-30.036084 17.169752-41.500183l430.195516-430.17746c22.882087-22.915919 60.038871-22.915919 82.956775 0l430.238496 430.17746c22.916881 22.922059 22.916881 60.036351 0 82.95841-22.882087 22.915919-60.038871 22.915919-82.955752 0L510.351385 334.975191 121.65677 723.659631c-22.923021 22.915919-60.038871 22.915919-82.961892 0C27.20062 712.236464 21.490332 697.215352 21.490332 682.20038L21.490332 682.20038zM21.490332 682.20038" p-id="2558"></path></svg>';
const linkIcon = '<?xml version="1.0" ?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg height="80px" id="Capa_1" style="enable-background:new 0 0 80 80;" version="1.1" viewBox="0 0 80 80" width="80px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M29.298,63.471l-4.048,4.02c-3.509,3.478-9.216,3.481-12.723,0c-1.686-1.673-2.612-3.895-2.612-6.257   s0.927-4.585,2.611-6.258l14.9-14.783c3.088-3.062,8.897-7.571,13.131-3.372c1.943,1.93,5.081,1.917,7.01-0.025   c1.93-1.942,1.918-5.081-0.025-7.009c-7.197-7.142-17.834-5.822-27.098,3.37L5.543,47.941C1.968,51.49,0,56.21,0,61.234   s1.968,9.743,5.544,13.292C9.223,78.176,14.054,80,18.887,80c4.834,0,9.667-1.824,13.348-5.476l4.051-4.021   c1.942-1.928,1.953-5.066,0.023-7.009C34.382,61.553,31.241,61.542,29.298,63.471z M74.454,6.044   c-7.73-7.67-18.538-8.086-25.694-0.986l-5.046,5.009c-1.943,1.929-1.955,5.066-0.025,7.009c1.93,1.943,5.068,1.954,7.011,0.025   l5.044-5.006c3.707-3.681,8.561-2.155,11.727,0.986c1.688,1.673,2.615,3.896,2.615,6.258c0,2.363-0.928,4.586-2.613,6.259   l-15.897,15.77c-7.269,7.212-10.679,3.827-12.134,2.383c-1.943-1.929-5.08-1.917-7.01,0.025c-1.93,1.942-1.918,5.081,0.025,7.009   c3.337,3.312,7.146,4.954,11.139,4.954c4.889,0,10.053-2.462,14.963-7.337l15.897-15.77C78.03,29.083,80,24.362,80,19.338   C80,14.316,78.03,9.595,74.454,6.044z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>';

jQuery.fn.exists = function () {
	return this.length > 0;
};

function logTime(labelText) {
	const options = {hour: "2-digit", minute: "2-digit", second: "2-digit"};
	const tNow = new Date();
	//console.log (tNow.toLocaleTimeString("en-us", options), " <== " + labelText);
}


GM_addStyle(".CopyBtn{position: relative; margin-left: 10px; background-color: rgb(221, 221, 221);    border-radius: 15px;    cursor: pointer;    display: inline-flex;}" +
	".CopyBtn:hover { background-color: yellow;}");


function createBtn(type) {
	const CopyBtn = document.createElement("div");
	if (type === "Enter") {
		CopyBtn.innerHTML = copyEIcon;
		// CopyBtn.style = 'transform: scaleX(-1);';
		CopyBtn.style.transform = 'scaleX(-1);';
		CopyBtn.firstElementChild.style = 'width: 34px; height:15px;';
		CopyBtn.id = 'enterNode';
		CopyBtn.title = 'Copied onEnter';
	}
	else if (type === "Exit") {
		CopyBtn.innerHTML = copyEIcon;
		CopyBtn.firstElementChild.style = 'width: 34px; height:15px;';
		CopyBtn.id = 'exitNode';
		CopyBtn.title = 'Copied onExit';
	}
	else if (type === "Link") {
		CopyBtn.innerHTML = linkIcon;
		CopyBtn.firstElementChild.style = 'width: 34px; height:15px;';
		CopyBtn.id = 'linkNode';
		CopyBtn.title = 'Link Node';
	}
	else {
		CopyBtn.innerHTML = copyIcon;
		CopyBtn.firstElementChild.style = 'width: 34px; height:15px;';
		CopyBtn.id = 'copyNode';
		CopyBtn.title = 'Copied Node ID';
	}
	CopyBtn.className = "CopyBtn";
	return CopyBtn;
}

function addCopyBtn(jNode) {
	const copyArray = document.createElement("div");

	copyArray.appendChild(createBtn("Node"));
	copyArray.appendChild(createBtn("Enter"));
	copyArray.appendChild(createBtn("Exit"));
	copyArray.appendChild(createBtn("Link"));
	copyArray.style = 'display: inline-flex;';
	copyArray.id = 'copyArray';


	try {
		let _copyArray = $("#copyArray");
		if (_copyArray.exists()) {
			document.getElementsByClassName('nodeID')[0].replaceChild(copyArray,_copyArray);
		}
		else {
			logTime("Added Copy Btn");
			document.getElementsByClassName('nodeID')[0].appendChild(copyArray);
			$('.CopyBtn').tooltipster({
				animation: 'fade',
				delay: 200,
				arrow: false,
				theme: 'tooltipster-punk',
				timer: 800,
				trigger: 'custom',
				triggerOpen: {
					click: true
				},
				triggerClose: {
					mouseleave: true
				}
			});
		}
	}
	catch (e) {
		logTime("ERROR: addCopyBtn");
	}

}


$(document).on({
	"click": function () {
		//$('#copyNode').tooltip({ items: '#copyNode', content: "Copied!"});
		//$('#copyNode').tooltip("open");
		const nodeId = $(".nodeID").text().substring(4).replace(/^\s+|\s+$/g, "");
		console.log(nodeId);
		GM_setClipboard(nodeId);
	}
}, '#copyNode');

$(document).on({
	"click": function () {
		const nodeId = $(".nodeID").text().substring(4).replace(/^\s+|\s+$/g, "");

		const template = "$('%NODE_ID').onExit(function(state) {\r\n\t" +
			"state.fulfill();\r\n" +
			"});";

		const copyString = template.replace("%NODE_ID", nodeId);
		console.log(copyString);
		GM_setClipboard(copyString);
	}
}, '#exitNode');

$(document).on({
	"click": function () {
		const nodeId = $(".nodeID").text().substring(4).replace(/^\s+|\s+$/g, "");

		const template = "$('%NODE_ID').onEnter(function(state) {\r\n\t" +
			"state.fulfill();\r\n" +
			"});";

		const copyString = template.replace("%NODE_ID", nodeId);
		console.log(copyString);
		GM_setClipboard(copyString);
	}
}, '#enterNode');


$(document).on({
	"click": function () {
		const nodeId = $(".nodeID").text().substring(4).replace(/^\s+|\s+$/g, "");

		const template = window.location.href + ";selectedNodeId=%NODE_ID";

		const copyString = template.replace("%NODE_ID", nodeId);
		console.log(copyString);
		GM_setClipboard(copyString);
	}
}, '#linkNode');


$(document).ready(function () {
	$('.CopyBtn').tooltipster();
});


const muteObserver = new MutationSummary({
	callback: handleDiscographyChanges,
	rootNode: $(".splitViewTopicRightPane")[0],
	queries: [{all: ".nodeID"}]
});

function handleDiscographyChanges(muteSummaries) {
	const mSummary = muteSummaries[0];
	if (mSummary.added.length) {
		addCopyBtn($(mSummary.added[0]));
	}
}