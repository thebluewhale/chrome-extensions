
/*
make Youtube Cinematic

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


var shadowOpacity;
var autorun;

function getSettings () {
	chrome.storage.sync.get(["shadowOpacity", "autorun"], function (items) {
		shadowOpacity = items["shadowOpacity"];
		autorun = items["autorun"];

		if(shadowOpacity == undefined) {
			shadowOpacity = 0.80;
		}

		var shadowOpacityText = shadowOpacity.toFixed(2);
		$("#opacityText").text(shadowOpacityText);

		if(autorun == undefined) {
			autorun = false;
		}

		if(autorun) {
			$("#autorunCheckbox").prop("checked", true);
			$("#autorunText").text("The shadow will appear/disappear automatically");
		} else {
			$("#autorunCheckbox").prop("checked", false);
			$("#autorunText").text("The shadow will appear/disappear when you click the button");

		}
	});
}

function saveOpacitySetting () {
	chrome.storage.sync.set({"shadowOpacity": shadowOpacity}, null);
}

function saveAutorunSetting() {
	if($("#autorunCheckbox").prop("checked")) {
		autorun = true;
		$("#autorunText").text("The shadow will appear/disappear automatically");
	} else {
		autorun = false;
		$("#autorunText").text("The shadow will appear/disappear when you click the button");
	}
	
	chrome.storage.sync.set({"autorun":autorun}, null);
}

function addCallbacks () {
	$("#opacityDownButton").click(function () {
		if(shadowOpacity <= 0.05) {
			shadowOpacity = 0;
		} else {
			shadowOpacity -= 0.05;
		}
		var shadowOpacityText = shadowOpacity.toFixed(2);

		$("#opacityText").text(shadowOpacityText);

		saveOpacitySetting();
	});
	
	$("#opacityUpButton").click(function () {
		if(shadowOpacity >= 0.95) {
			shadowOpacity = 1.0;
		} else {
			shadowOpacity += 0.05;
		}
		
		var shadowOpacityText = shadowOpacity.toFixed(2);
		$("#opacityText").text(shadowOpacityText);

		saveOpacitySetting();
	});

	$("#opacityTabDiv").click(function () {
		openTab("#opacity");
	});

	$("#autorunTabDiv").click(function () {
		openTab("#autorun");
	});

	$("#autorunCheckbox").click(function () {
		saveAutorunSetting();
	});
}

function openTab(item) {
	$("#SettingBodyDiv").hide();
	$("#opacityBodyDiv, #autorunBodyDiv").hide();
	$(item+"BodyDiv").show();
}


$(document).ready(function () {
	$("#SettingBodyDiv").show();
	addCallbacks();
	getSettings();
});
