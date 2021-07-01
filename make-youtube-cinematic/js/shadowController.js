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


// variables

var shadowElement = null;
var shadowColor_r = 0;
var shadowColor_g = 0;
var shadowColor_b = 0;
var shadowColor = "rgb(" + shadowColor_r + "," + shadowColor_g + "," + shadowColor_b + ")";
var settedOpacity = 0.8;
var prettyOpacity;


//functions

function pageInit() {

	//video element style set
	var video = document.getElementsByTagName("video");
	//actually, there is only one video tag in normal video page
	//so this for loop is run only one time.
	for(var i = 0; i < video.length; i++) {
		var path = [];
		var videoElement = video[i];

		for(;videoElement.nodeName.toLowerCase() != "html";) {
			var addedElement = path.unshift(videoElement.nodeName);
			if (videoElement.currentStyle) { 
				var elementStyle = addedElement.currentStyle["z-Index"]; 
			} else {
				var elementStyle = document.defaultView.getComputedStyle(videoElement,null).getPropertyValue("z-Index");
			}
			if (elementStyle != "auto") {
				videoElement.style.zIndex = "auto";
			}
			videoElement = videoElement.parentNode;
		}

		if (video[i].currentSrc.lastIndexOf(".mp3") == -1) {
			video[i].style.cssText += "visibility:visible !important; position:relative !important; z-index:10000 !important;";
		}
	}

	//video controller and buttons style set
	if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)) {
		var divElements = document.querySelectorAll("div");
		for(var i = 0; i < divElements.length; i++) {
			var attr = divElements[i].className;
			if (attr == "ytp-upnext ytp-endscreen-upnext-autoplay-paused ytp-suggestion-set" ||
					attr == "ytp-remote" || attr == "ytp-thumbnail-overlay ytp-cued-thumbnail-overlay" ||
					attr == "ytp-spinner" || attr == "ytp-bezel" || attr == "ytp-gradient-top" || attr == "ytp-chrome-top" ||
					attr == "ytp-gradient-bottom" || attr == "ytp-chrome-bottom" || attr == "ytp-panelpopup ytp-settings-menu" ||
					attr == "ytp-share-panel" || attr == "ytp-playlist-menu" || attr == "ytp-related-menu" ||
					attr == "ytp-webgl-spherical-control" || attr == "ytp-storyboard enabled" || attr == "ytp-storyboard-framepreview" ||
					attr == "ytp-ad-progress-bar-container" || attr == "ytp-popup ytp-settings-menu" ||
					attr == "ytp-panelpopup ytp-contextmenu" || attr == "ytp-multicam-menu" ||
					attr == "ytp-title ytp-title-extra-info" || attr == "ytp-title-text" || attr == "ytp-title-channel-name"||
					attr == "ytp-chrome-top-buttons" || attr == "videoAdUiBottomBar" || attr == "videoAdUiBottomBarText" ||
					attr == "videoAdUiAttributionContainer" || attr == "videoAdUiAttributionBadge yt-badge yt-badge-ad" ||
					attr == "videoAdUiAttribution" || attr == "videoAdUiAttributionIconContainer" ||
					attr == "videoAdUiAttributionIcon" || attr == "videoAdUiAdInfoPopup" || attr == "videoAdUiAdInfoPopupCallout" ||
					attr == "videoAdUiAdInfoPopupText" || attr == "videoAdUiVisitAdvertiserLink" || 
					attr == "videoAdUiVisitAdvertiserLinkText" || attr == "videoAdUiVisitAdvertiserIcon" ||
					attr == "videoAdUiPreSkipContainer" || attr == "videoAdUiPreSkipButton" || attr == "videoAdUiPreSkipText" ||
					attr == "videoAdUiPreSkipThumbnail" || attr == "videoAdUiSkipContainer html5-stop-propagation") {
				divElements[i].style.zIndex = 10001;
			}
		}
	}

	var playerapi = document.getElementById("player-api");
	if(playerapi) {
		playerapi.style.zIndex = 10001;
	}
}

function deleteShadow () {
	shadowElement = document.getElementById("myShadowId");
	var animatorId = setInterval(animatorFunc, 30);
	prettyOpacity = settedOpacity;

	function animatorFunc () {
		if(prettyOpacity <= 0) {
			clearInterval(animatorId);
			document.body.removeChild(shadowElement);
		} else {
			prettyOpacity = prettyOpacity - 0.1;
			shadowElement.style.opacity = prettyOpacity;
		}
	}
}

function createShadow () {
	shadowElement = document.getElementById("myShadowId");
	var animatorId = setInterval(animatorFunc, 30);
	prettyOpacity = 0;

	function animatorFunc () {
		if(prettyOpacity >= settedOpacity) {
			shadowElement.style.opacity = settedOpacity;
			clearInterval(animatorId);
		} else {
			prettyOpacity = prettyOpacity + 0.1;
			shadowElement.style.opacity = prettyOpacity;
		}
	}
}

function lightOnOff() {
	var isLightOff = document.getElementById("myShadowId");
	
	if(isLightOff) {
		deleteShadow();
	} else {
		pageInit();

		var newdiv = document.createElement("div"); 
		newdiv.setAttribute("id","myShadowId");
		newdiv.style.width = "100%"; 
		newdiv.style.height = "100%"; 
		newdiv.style.left = 0; 
		newdiv.style.top = 0;
		newdiv.style.position = "fixed";
		newdiv.style.background = shadowColor;
		newdiv.style.opacity = 0;
		newdiv.style.zIndex = 9999;

		document.body.appendChild(newdiv);
		createShadow();	

		newdiv.addEventListener("click", function() {
			deleteShadow();
		});
	}
}

function main() {
	chrome.storage.sync.get(["shadowOpacity"], function (items) {
		settedOpacity = items["shadowOpacity"];

		if(!settedOpacity)
			settedOpacity = 0.8;

		lightOnOff();
	});
}

function addCallbacks() {
	chrome.storage.onChanged.addListener(function () {
		chrome.storage.sync.get(["shadowOpacity"], function (items) {
			if(items["shadowOpacity"] != settedOpacity) {
				//opacity setting changed during shadow is already show
				settedOpacity = items["shadowOpacity"];
				shadowElement = document.getElementById("myShadowId");
				shadowElement.style.opacity = settedOpacity;

				shadowElement.removeEventListener("click", null);
				shadowElement.addEventListener("click", function() {
					deleteShadow();
				});
			}
		});
	});
}

//main function started from here
main();
addCallbacks();
