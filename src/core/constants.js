var MAP_DELAY = 2000; // 2 second map delay
var MAX_BLOCKS = 20;
var MAP_DELAY_WATCH = 0;

var DEFAULT_ALERT_SOUND_URL = EXTERNAL_RESOURCE + 'Fire_alarm.ogg';
var DEFAULT_SCOUT_SOUND_URL = EXTERNAL_RESOURCE + 'Red-Alert.mp3';
var SWF_PLAYER_URL = EXTERNAL_RESOURCE + 'pdxminiplayer.swf';

var SWF_PREFIX = '<object type="application/x-shockwave-flash" data="' + SWF_PLAYER_URL + '" width="90" height="20"><param name="wmode" value="transparent" /><param name="movie" value="' + SWF_PLAYER_URL + '" /><param name="flashvars" value="mp3=';
var SWF_SUFFIX = '&amp;autostart=1&amp;showtime=1" /></object>';

var AudioManager;

var HourGlasses = [1, 2, 3, 4, 5, 6, 7, 8, 10];
var HourGlassName = {};
var SpeedupArray = [60, 900, 3600, 9000, 28800, 54000, 86400, 216000, 0, 345600];
var HGLimit = [30, 301, 2701, 7201, 26101, 50431, 82831, 172800, 302400];
var HourGlassThreshold = HGLimit; // remember tabs!

var HourGlassHint = [
	'Usage Condition: 30s+',
	'Usage Condition: 5m & 1s+',
	'Usage Condition: 45m & 1s+',
	'Usage Condition: 2h & 1s+',
	'Usage Condition: 7h & 30m & 1s+',
	'Usage Condition: 14h & 30m & 1s+',
	'Usage Condition: 23h & 30m & 1s+',
	'Usage Condition: 48h+',
	'Usage Condition: 3d & 12h+',
];

var StorehouseLevels = { 0: 0, 1: 100000, 2: 200000, 3: 300000, 4: 400000, 5: 500000, 6: 600000, 7: 700000, 8: 800000, 9: 900000, 10: 1000000, 11: 5000000, 12: 50000000 };
var ArcaneRequirements = {};
