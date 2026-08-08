/** Afk detector **/

var afkdetector = {
	target: 120, // default check every 2 mins
	counter: 1,
	isAFK: true, // always begin in AFK mode! This will allow tower to revert following autoport

	init: function () {
		var t = afkdetector;
		if (parseIntNan(Options.AFKTimeout) < 1) Options.AFKTimeout = 1;
		t.target = Options.AFKTimeout * 60;
		document.body.onmousemove = t.clear;
		document.body.onkeypress = t.clear;
	},

	check: function () {
		var t = afkdetector;
		if (!t.isAFK) {
			t.counter++;
			if (t.counter >= t.target) {
				if (GlobalOptions.ExtendedDebugMode) actionLog('afk detected');
				t.isAFK = true;
			}
		}
	},
	clear: function () {
		var t = afkdetector;
		t.counter = 1;
		if (t.isAFK) {
			if (GlobalOptions.ExtendedDebugMode) actionLog('afk cleared');
			t.isAFK = false;
		}
	},
	reset: function () {
		var t = afkdetector;
		if (parseIntNan(Options.AFKTimeout) < 1) Options.AFKTimeout = 1;
		t.target = Options.AFKTimeout * 60;
		t.counter = 1;
		t.isAFK = false;
	},
}
