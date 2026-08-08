function unixTime() {
	return parseInt(new Date().getTime() / 1000) + uW.g_timeoff;
}

function formatDateTime(a) {
	return uW.formatDate(uWCloneInto(new Date(a * 1000)), "NNN dd, HH:mm")
}

function formatDate(a) {
	return uW.formatDate(uWCloneInto(new Date(a * 1000)), "dd NNN yyyy")
}

function formatUnixTime(unixTimeString, format) {
	if (format == '24hour') { return formatDateTime(unixTimeString); }
	else { return uW.formatDateByUnixTime(unixTimeString); }
}

function convertTime(datestr) {
	if (!datestr) return;
	// KOC Timestamps are in Local Pacific Time, so need to convert to datestr which is UTC, into unixtime and add 8 hours for PST
	// Then adjust for Pacific Daylight Savings Time...
	return parseInt(datestr.getTime() / 1000) + (480 * 60) - getDST(datestr);
}

function formatGMTClock(date) {
	var min = parseInt(date.getMinutes()) < 10 ? "0" + date.getMinutes() : date.getMinutes();
	return date.getHours() + ":" + min;
}

function getDST(today) {
	var yr = today.getFullYear();
	var dst_start = new Date(yr + "-03-14T02:00:00"); // 2nd Sunday in March can't occur after the 14th
	var dst_end = new Date(yr + "-11-07T02:00:00"); // 1st Sunday in November can't occur after the 7th
	var day = dst_start.getDay(); // day of week of 14th
	dst_start.setDate(14 - day); // Calculate 2nd Sunday in March of this year
	day = dst_end.getDay(); // day of the week of 7th
	dst_end.setDate(7 - day); // Calculate first Sunday in November of this year
	var dstadj = 0;
	if (today >= dst_start && today < dst_end) { //does today fall inside of DST period?
		dstadj = (3600); // 60 mins!
	}
	return dstadj;
}

function FullDateTime(str) {
	var time = new Date(str * 1000);
	D = addZero(time.getDate());
	M = addZero(time.getMonth() + 1);
	Y = addZero(time.getFullYear());
	h = addZero(time.getHours());
	m = addZero(time.getMinutes());
	s = addZero(time.getUTCSeconds());
	var fullDate = D + "/" + M + "/" + Y + "  " + h + ":" + m + ":" + s;
	return fullDate;
}

function yyyymmdd(dateIn) {
	var yyyy = dateIn.getFullYear();
	var mm = dateIn.getMonth() + 1; // getMonth() is zero-based
	var dd = dateIn.getDate();
	return String(10000 * yyyy + 100 * mm + dd); // Leading zeros for mm and dd
}

function replaceAll(str, find, replace, ignoreCase) {
	var _token;
	var token = find;
	var newToken = replace;
	var i = -1;
	if (typeof token === "string") {
		if (ignoreCase) {
			_token = token.toLowerCase();
			while ((i = str.toLowerCase().indexOf(token, i >= 0 ? i + newToken.length : 0)) !== -1) {
				str = str.substring(0, i) + newToken + str.substring(i + token.length);
			}
		}
		else { str = str.split(token).join(newToken); }
	}
	return str;
}

function addZero(i) {
	if (i < 10) i = "0" + i;
	return i;
}
