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


chrome.browserAction.onClicked.addListener(function(tabs) {
	chrome.storage.sync.set({"caller":"switch"}, function () {
		chrome.tabs.executeScript(tabs.id, {file: "/js/setEyeProtector.js"}, null);
	});

});

chrome.tabs.onUpdated.addListener(function (tabs) {
	chrome.storage.sync.set({"caller":"updated"}, function () {
		chrome.tabs.executeScript(tabs.id, {file: "/js/setEyeProtector.js"}, null);
	});
});

chrome.tabs.onCreated.addListener(function (tabs) {
	chrome.storage.sync.set({"caller":"created"}, function () {
		chrome.tabs.executeScript(tabs.id, {file: "/js/setEyeProtector.js"}, null);
	});
});

chrome.tabs.onActivated.addListener(function (tabs) {
	chrome.storage.sync.set({"caller":"activated"}, function () {
		chrome.tabs.executeScript(tabs.id, {file: "/js/setEyeProtector.js"}, null);
	});
});

