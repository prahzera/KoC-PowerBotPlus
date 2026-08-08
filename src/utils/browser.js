function getFirefoxVersion() {
	var ver = '',
		i;
	var ua = navigator.userAgent;
	if (ua) {
		i = ua.indexOf('CometBird/');
		if (i >= 0) return { 'Browser': 'CometBird', 'Version': ua.substr(i + 10).split(' ')[0], 'Mozilla': true };
		i = ua.indexOf('OPR/');
		if (i >= 0) return { 'Browser': 'Opera', 'Version': ua.substr(i + 4).split(' ')[0], 'Mozilla': false };
		i = ua.indexOf('Vivaldi/');
		if (i >= 0) return { 'Browser': 'Vivaldi', 'Version': ua.substr(i + 8).split(' ')[0], 'Mozilla': false };
		i = ua.indexOf('Chrome/');
		if (i >= 0) return { 'Browser': 'Chrome', 'Version': ua.substr(i + 7).split(' ')[0], 'Mozilla': false };
		i = ua.indexOf('Safari/');
		if (i >= 0) return { 'Browser': 'Safari', 'Version': ua.substr(i + 7).split(' ')[0], 'Mozilla': false };
		i = ua.indexOf('PaleMoon/');
		if (i >= 0) return { 'Browser': 'Palemoon', 'Version': ua.substr(i + 9).split(' ')[0], 'Mozilla': true };
		i = ua.indexOf('IceDragon/');
		if (i >= 0) return { 'Browser': 'IceDragon', 'Version': ua.substr(i + 10).split(' ')[0], 'Mozilla': true };
		i = ua.indexOf('Firefox/');
		if (i >= 0) return { 'Browser': 'Firefox', 'Version': ua.substr(i + 8).split(' ')[0], 'Mozilla': true };
	}
	return { Browser: 'Firefox', Version: '0.00' };
}

function getGMVersion() {
	if (typeof (GM_info) != 'object') {
		return { 'Handler': 'Scriptish', 'Version': 'Unknown' };
	}
	var Vers = GM_info.version || 'Unknown';
	var Handler = GM_info.scriptHandler || 'Greasemonkey';
	return { 'Handler': Handler, 'Version': Vers };
}

function HEXtoRGB(hex) {
	if (hex.length == 7) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	}
	else {
		if (hex.length == 4) {
			var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
			result[1] = result[1] + '0';
			result[2] = result[2] + '0';
			result[3] = result[3] + '0';
		}
	}
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : { r: 0, g: 0, b: 0 };
}
