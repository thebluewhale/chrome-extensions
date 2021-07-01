/*
   protect Your Eyes

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

   To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/
*/


// variables

var protectorMinOpacity;
var protectorMaxOpacity;
var protectorDefaultMin = 0.05;
var protectorDefaultMax = 0.3;


// functions

function getSetting () {
	chrome.storage.sync.get(["protectorMinOpacity", "protectorMaxOpacity"], function (items) {
		protectorMinOpacity = items["protectorMinOpacity"];
		protectorMaxOpacity = items["protectorMaxOpacity"];

		if(protectorMinOpacity == undefined) {
			protectorMinOpacity = 0.05;
		}
		if(protectorMaxOpacity == undefined) {
			protectorMaxOpacity = 0.3;
		}

		$("#minSettingText").text("MIN = " + protectorMinOpacity);
		$("#maxSettingText").text("MAX = " + protectorMaxOpacity);
	});
}

function saveSetting () {
	chrome.storage.sync.set({
		"protectorMinOpacity": protectorMinOpacity, 
		"protectorMaxOpacity": protectorMaxOpacity},
		null);
	window.close();
}

function setDefault () {
	chrome.storage.sync.set({
		"protectorMinOpacity": protectorDefaultMin,
		"protectorMaxOpacity": protectorDefaultMax},
		null);

	$("#minSettingText").text("MIN = " + protectorDefaultMin);
	$("#maxSettingText").text("MAX = " + protectorDefaultMax);
}

function addListener () {
	$("#minMinusBtn").click(function () {
		if(protectorMinOpacity < 0.05) {
			protectorMinOpacity = 0;
		} else {
			protectorMinOpacity -= 0.05;
		}
		var protectorMinOpacityText = protectorMinOpacity.toFixed(2);

		$("#minSettingText").text("MIN = " + protectorMinOpacityText);
	});
	
	$("#minPlusBtn").click(function () {
		if(protectorMinOpacity < protectorMaxOpacity) {
			if(protectorMinOpacity < 0.95) {
				protectorMinOpacity += 0.05;
			} else {
				protectorMinOpacity = 1.0;
			}
			var protectorMinOpacityText = protectorMinOpacity.toFixed(2);

			$("#minSettingText").text("MIN = " + protectorMinOpacityText);
		}
	});

	$("#maxMinusBtn").click(function () {
		if(protectorMaxOpacity > protectorMinOpacity) {
			if(protectorMaxOpacity < 0.05) {
				protectorMaxOpacity = 0;
			} else {
				protectorMaxOpacity -= 0.05;
			}
			var protectorMaxOpacityText = protectorMaxOpacity.toFixed(2);

			$("#maxSettingText").text("MAX = " + protectorMaxOpacityText);
		}
	});

	$("#maxPlusBtn").click(function () {
		if(protectorMaxOpacity < 0.95) {
			protectorMaxOpacity += 0.05;
		} else {
			protectorMaxOpacity = 1.0;
		}
		var protectorMaxOpacityText = protectorMaxOpacity.toFixed(2);

		$("#maxSettingText").text("MAX = " + protectorMaxOpacityText);
	});

	$("#defaultBtn").click(function () {
		setDefault();
	});

	$("#saveBtn").click(function () {
		saveSetting();
	});
}


$(document).ready(function () {
	getSetting();
	addListener();
});

