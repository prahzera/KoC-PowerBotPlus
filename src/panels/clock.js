var GMTclock = {
	span: null,
	timer: null,
	init: function () {
		this.span = document.createElement('span');
		this.span.style.fontWeight = 'bold';
		ById('kochead_time').parentNode.appendChild(this.span);
		this.setEnable(Options.gmtClock);
	},
	setEnable: function (tf) {
		var t = GMTclock;
		if (tf) {
			setTimeout(function () {
				t.EverySecond();
			}, 1000);
		} else {
			t.span.innerHTML = '';
		}
	},
	EverySecond: function () {
		var t = GMTclock;
		var now = new Date();
		if (Options.gmtClockType == 1) {
			now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000) - (480 * 60000) + parseInt(getDST(now) * 1000) + (uW.g_timeoff * 1000));
		}
		else {
			now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000));
		}
		GMTclock.span.innerHTML = ' &nbsp; (' + formatGMTClock(now) + ')';
		if (Options.gmtClock) {
			setTimeout(function () {
				t.EverySecond();
			}, 1000);
		} else {
			GMTclock.span.innerHTML = '';
		}
	},
};
