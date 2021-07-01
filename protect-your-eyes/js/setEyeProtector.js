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

var protectorColor = "rgb(0,0,0)";
var protectorOpacity = 0.2;
var protectorMaxOpacity;
var protectorMinOpacity;
var protectorTimer;
var timerRenewInterval = 600000;
var protectorStatus;
var caller;

//functions

function init () {
	chrome.storage.sync.get(["caller", "protectorStatus"], function (items) {
		caller = items["caller"];

		if(caller == "switch") {
			if(items["protectorStatus"] == true) {
				// turn off
				protectorStatus = false;
				chrome.storage.sync.set({"protectorStatus":false}, eyeProtectorOnOff());
			} else {
				// turn on
				protectorStatus = true;
				chrome.storage.sync.set({"protectorStatus":true}, eyeProtectorOnOff());
			}
		} else {
			if(items["protectorStatus"] == true) {
				// stay turn on 
				protectorStatus = true;
				eyeProtectorOnOff();
			} else {
				// turn on
				protectorStatus = false;
				eyeProtectorOnOff();
			}
		}
	});
}

function setEyeProtector () {

	var eyeProtector = document.createElement("div"); 
	eyeProtector.setAttribute("id","eyeProtectorId");
	eyeProtector.style.width = "100%"; 
	eyeProtector.style.height = "100%"; 
	eyeProtector.style.left = 0; 
	eyeProtector.style.top = 0;
	eyeProtector.style.position = "fixed";
	eyeProtector.style.background = protectorColor;
	eyeProtector.style.opacity = protectorOpacity;
	eyeProtector.style.zIndex = 10001;
	eyeProtector.style.pointerEvents = "none";

	document.body.appendChild(eyeProtector);
}

function clearEyeProtector () {
	var eyeProtector = document.getElementById("eyeProtectorId");
	if(eyeProtector) 
		document.body.removeChild(eyeProtector);
}

function getSetting () {
	chrome.storage.sync.get(["protectorMinOpacity", "protectorMaxOpacity"], function (items) {
		protectorMinOpacity = items["protectorMinOpacity"];
		protectorMaxOpacity = items["protectorMaxOpacity"];

		if(!protectorMinOpacity) 
			protectorMinOpacity = 0.05;
		if(!protectorMaxOpacity)
			protectorMaxOpacity = 0.3;

		setOpacity();
		clearEyeProtector();
		setEyeProtector();
	});
}

function setOpacity () {
	var time = new Date();
	var prettyHour = time.getHours();
	var prettyMin = time.getMinutes();
	
	//set opacity following pretty time
	if((prettyHour>=7) && (prettyHour<12)) {
		protectorOpacity = protectorMaxOpacity - (((protectorMaxOpacity-protectorMinOpacity)/5)*(prettyHour-7));
		protectorOpacity -= ((protectorMinOpacity/6)*(prettyMin/10));
	} else if((prettyHour>=12) && (prettyHour<20)) {
		protectorOpacity = protectorMinOpacity + (((protectorMaxOpacity-protectorMinOpacity)/8)*(prettyHour-12));
		protectorOpacity += (((protectorMaxOpacity-protectorMinOpacity)/8/6)*(prettyMin/10));
	} else {
		protectorOpacity = protectorMaxOpacity;
	}
}

function changeOpacity () {
	getSetting();
	protectorTimer = setTimeout(changeOpacity, timerRenewInterval);
}

function makeTimer () {
	protectorTimer = setTimeout(changeOpacity, timerRenewInterval);
}

function clearTimer () {
	clearTimeout(protectorTimer);
}

function eyeProtectorOnOff () {
	var eyeProtector = document.getElementById("eyeProtectorId");
	if(protectorStatus == true) {
		// turn on protectorColor
		if(eyeProtector) {
			// already protected
		} else {
			//turn on
			getSetting();
			makeTimer();
		}
	} else {
		// turn off
		if(eyeProtector) {
			// turn off
			clearTimer();
			clearEyeProtector();
		} else {
			// already not protected
		}
	}
}

//main function starts here
init();
