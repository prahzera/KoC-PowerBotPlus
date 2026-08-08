function parseIntNan(n) {
	x = parseInt(n, 10);
	if (isNaN(x))
		return 0;
	return x;
}

function parseIntCommas(n) {
	n = n.split(',');
	n = n.join('');
	x = parseInt(n, 10);
	if (isNaN(x))
		return 0;
	return x;
}

function parseIntZero(n) {
	if (n == '')
		return 0;
	return parseInt(n, 10);
}

function isNaNCommas(n) {
	n = n.split(',');
	n = n.join('');
	return isNaN(n);
}

function timestr(time, full) {
	time = parseInt(time);
	var m = [];
	var t = time;
	if (t < 61)
		return t + 's';
	if (t > 86400) {
		m.push(parseInt(t / 86400));
		m.push('d ');
		t %= 86400;
	}
	if (t > 3600 || time > 3600) {
		m.push(parseInt(t / 3600));
		m.push('h ');
		t %= 3600;
	}
	m.push(parseInt(t / 60));
	m.push('m');
	if (full || time <= 3600) {
		m.push(' ');
		m.push(t % 60);
		m.push('s');
	}
	return m.join('');
}

function timestrShort(time) {
	time = parseInt(time);
	if (time > 86400) {
		var m = [];
		time /= 3600;
		m.push(parseInt(time / 24));
		m.push('d ');
		m.push(parseInt(time % 24));
		m.push('h ');
		return m.join('');
	} else
		return timestr(time);
}

function addCommasInt(n) {
	nStr = parseInt(n) + '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(nStr)) {
		nStr = nStr.replace(rgx, '$1' + ',' + '$2');
	}
	return nStr;
}

function addCommas(nStr, whole) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	if (whole) return x1
	else return x1 + x2;
}

function addCommasWhole(nStr) { return addCommas(nStr, true); }
