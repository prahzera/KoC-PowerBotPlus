// ==UserScript==
// @name			KoC Power Bot Plus
// @namespace		PBP
// @description		All-in-One Script for Kingdoms of Camelot
// @icon			https://koc-cdn.popreach.com/fb/e2/src/img/items/70/363.jpg
// @include			*.rycamelot.com/*main_src.php*
// @include			*.beta.rycamelot.com/*main_src.php*
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @include			*.playgardencitygames.com/kingdomsofcamelot*
// @match			https://*.playgardencitygames.com/kingdomsofcamelot*
// @match			https://*.playgardencitygames.com/*
// @include			*.rockyou.com/rya/*
// @include			*facebook.com/*dialog/feed*
// @include			*rycamelot.com/*acceptToken_src.php*
// @include			*rycamelot.com/*helpFriend_src.php*
// @include			*rycamelot.com/*claimVictoryToken_src.php*
// @include			*rycamelot.com/*merlinShare_src.php*
// @exclude 	    *sharethis*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require			https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
// @resource        sound_files         https://koc-cdn.popreach.com/fb/e2/src/pb/resource/sound_files.js
// @resource		image_files			https://koc-cdn.popreach.com/fb/e2/src/pb/resource/image_files.js
// @resource		champion_uniques	https://koc-cdn.popreach.com/fb/e2/src/pb/resource/champion_uniques.js
// @resource		emoticons			https://koc-cdn.popreach.com/fb/e2/src/pb/resource/emoticons.js
// @connect			*
// @connect	greasyfork.org
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_deleteValue
// @grant	GM_listValues
// @grant	GM_addStyle
// @grant	GM_log
// @grant	GM_getResourceText
// @grant	GM_registerMenuCommand
// @grant	GM_xmlhttpRequest
// @grant	unsafeWindow
// @run-at	document-end
// @author      Prahzera
// @license     CC-BY-4.0
// @original-script             https://sourceforge.net/p/koc-battle-console/code/HEAD/tree/trunk/KoCPowerBotPlus.user.js
// @original-license            http://creativecommons.org/licenses/by/4.0/
// @original-changes            Updated to include latest items from KoC
// @original-author             barbarossa69
// @version			3.79
// @releasenotes	        Add Full Map and Full Province search modes
// @downloadURL https://github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.user.js
// @updateURL https://github.com/prahzera/KoC-PowerBotPlus/releases/latest/download/script.meta.js
// ==/UserScript==
