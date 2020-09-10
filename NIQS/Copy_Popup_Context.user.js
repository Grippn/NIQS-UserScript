// ==UserScript==
// @name         NIQS: Copy Popup Context
// @version      1.0
// @minGMVer     1.14
// @minFFVer     26
// @namespace    NIQS_Copy_Popup_Context
// @description  Adds a Copy buttons to popups to copy the context to clipboard.
// @author       Nicholas Grippo
// @license      MIT
// @include      https://iqstudio.nuance-va.com/*
// @include      https://iqstudio.nina-nuance.com/*
// @include      https://niw-niqs.nuance.mobi/*
// @connect      iqstudio.nuance-va.com
// @connect      iqstudio.nina-nuance.com
// @connect      niw-niqs.nuance.mobi
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://raw.githubusercontent.com/rafaelw/mutation-summary/master/src/mutation-summary.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/Grippn/NIQS-UserScript/master/NIQS/Copy_Popup_Context.user.js
// ==/UserScript==

// noinspection SpellCheckingInspection
const copyIcon = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="511.627px" height="511.627px" viewBox="0 0 511.627 511.627" style="enable-background:new 0 0 511.627 511.627;"	 xml:space="preserve"><g>	<path d="M503.633,117.628c-5.332-5.327-11.8-7.993-19.41-7.993H365.446c-11.417,0-23.603,3.806-36.542,11.42V27.412		c0-7.616-2.662-14.092-7.994-19.417C315.578,2.666,309.11,0,301.492,0H182.725c-7.614,0-15.99,1.903-25.125,5.708		c-9.136,3.806-16.368,8.376-21.7,13.706L19.414,135.901c-5.33,5.329-9.9,12.563-13.706,21.698C1.903,166.738,0,175.108,0,182.725		v191.858c0,7.618,2.663,14.093,7.992,19.417c5.33,5.332,11.803,7.994,19.414,7.994h155.318v82.229c0,7.61,2.662,14.085,7.992,19.41		c5.327,5.332,11.8,7.994,19.414,7.994h274.091c7.61,0,14.085-2.662,19.41-7.994c5.332-5.325,7.994-11.8,7.994-19.41V137.046		C511.627,129.432,508.965,122.958,503.633,117.628z M328.904,170.449v85.364h-85.366L328.904,170.449z M146.178,60.813v85.364		H60.814L146.178,60.813z M202.139,245.535c-5.33,5.33-9.9,12.564-13.706,21.701c-3.805,9.141-5.708,17.508-5.708,25.126v73.083		H36.547V182.725h118.766c7.616,0,14.087-2.664,19.417-7.994c5.327-5.33,7.994-11.801,7.994-19.412V36.547h109.637v118.771		L202.139,245.535z M475.078,475.085H219.263V292.355h118.775c7.614,0,14.082-2.662,19.41-7.994		c5.328-5.325,7.994-11.797,7.994-19.41V146.178h109.629v328.907H475.078z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';

function createBtn(type) {
	const CopyBtn = document.createElement("div");
	CopyBtn.innerHTML = copyIcon;
	CopyBtn.firstElementChild.style = 'width: 34px; height:15px;';
	CopyBtn.id = 'copyNode';
	CopyBtn.title = 'Copied Node ID';
	CopyBtn.className = "CopyBtn";
	return CopyBtn;
}

function logTime(labelTxt) {
	const options = {hour: "2-digit", minute: "2-digit", second: "2-digit"};
	const tNow = new Date();
	//console.log (tNow.toLocaleTimeString("en-us", options), " <== " + labelTxt);
}

$(document).on({
	"click": function () {
		//$('#copyNode').tooltip({ items: '#copyNode', content: "Copied!"});
		//$('#copyNode').tooltip("open");
		let data = document.querySelector(".popupMessage.popupMessageAdditionalProps").textContent;
		console.log(data);
		try{
			data = JSON.parse(data);
			data = JSON.stringify(data, null, '\t');
		}
		catch (error){
			console.log(data);
		}

		GM_setClipboard(data);
	}
}, '#copyNode');

function addCopyBtn(jNode) {
	const CopyArray = document.createElement("div");
	CopyArray.appendChild(createBtn("Node"));
	CopyArray.style.display = 'inline-flex';
	CopyArray.id = 'copyArray2';

	try {
		if ($('#copyArray2').length) {
			logTime("Already have one");
		}
		else {
			document.getElementsByClassName('popupTitle')[0].appendChild(CopyArray);
		}
	}
	catch (e) {
		logTime("ERROR: addCopyBtn");
	}

}

if (/#!chat;/.test(location.hash)) {
	$(document).ready(function () {
		const muteObserver = new MutationSummary({
			callback: handleDiscographyChanges,
			rootNode: $("body")[0],
			queries: [{all: ".gwt-PopupPanel"}]
		});
	});


	function handleDiscographyChanges(muteSummaries) {
		const mSummary = muteSummaries[0];
		if (mSummary["added"].length) {
			addCopyBtn($(mSummary["added"][0]));
		}
	}
}


