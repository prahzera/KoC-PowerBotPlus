var TroopImagePrefix = IMGURL + "units/unit_";
var TroopImageSuffix = "_30.jpg";
var ChampImagePrefix = IMGURL + "champion_hall/championPort_0";
var ChampImageSuffix = "_50x50.jpg";
var ShieldImage = IMGURL + "items/70/362.jpg";
var BrokenIcon = IMGURL + "throne/modal/sm_fail_overlay.png";
var EquippedIcon = IMGURL + "throne/modal/equip.png";
var EquippedOtherIcon = IMGURL + "champion_hall/equippedOther.png";

var LONG_BROWN_BTN = IMGURL + "button11_brown.png";
var GLORY_BACKGROUND = "";
var RAINBOW_BACKGROUND = "";
var URL_CASTLE_BUT_HOVER = "";
var THEMES;
var UniqueJewels = {};
var boxmightarray = {};
var AlertSounds = { allianceattack: 'Submarine', alert: 'Honk Honk Honk', airraid: 'Air Raid Siren' };
var WhisperSounds = { timeout: 'Arrow', monitor: 'Doorbell' };

var Smileys = {};
var ChatStyles = { '[#0]': 'color:black', '[#1]': 'color:red', '[#2]': 'color:green', '[#3]': 'color:blue', '[#4]': 'color:magenta', '[#5]': 'color:cyan', '[#6]': 'color:yellow', '[#7]': 'color:white', '[#8]': 'font-weight:bold', '[#9]': 'font-style:italic' };
var SpeedColour = '#000';
var LinkColour = '#114684';

eval(GM_getResourceText("emoticons"));
eval(GM_getResourceText("image_files"));
eval(GM_getResourceText("sound_files"));

if (URL_CASTLE_BUT_HOVER == "") URL_CASTLE_BUT_HOVER = URL_CASTLE_BUT_SEL;
