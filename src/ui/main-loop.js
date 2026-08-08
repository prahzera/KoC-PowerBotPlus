/** main loop **/

function EverySecond() {
	try {

		SecondLooper = SecondLooper + 1;

		inc = [];
		incCity = [];

		/* check local marches still exist */

		for (var n in local_atkinc) {
			if (!Seed.queue_atkinc[n]) { delete local_atkinc[n]; }
		}

		for (var n in Seed.queue_atkinc) {
			if (Seed.queue_atkinc[n].marchType) {
				inc.push(Seed.queue_atkinc[n]);
				/* check and copy to local */
				Copy_Local_ATKINC(n);
			}
		}
		inc.sort(function (a, b) { if (!a.arrivalTime) a.arrivalTime = -1; if (!b.arrivalTime) b.arrivalTime = -1; return a.arrivalTime - b.arrivalTime });

		try {
			CheckForIncoming();
		}
		catch (err) {
			logerr(err); // write to log
		}

		out = [];
		outCity = [];

		for (var n in Seed.queue_atkp) {
			for (var m in Seed.queue_atkp[n]) {
				if (Seed.queue_atkp[n][m].marchType && (parseInt(Seed.queue_atkp[n][m].marchType) != 9)) { // no raids!
					Copy_Local_ATKP(n, m);
					var marchobj = local_atkp[m];
					out.push(marchobj);
					if (marchobj.marchCityId == Dashboard.CurrentCityId) {
						outCity.push(marchobj);
					}
				}
			}

		}
		out.sort(function (a, b) { return /*a.destinationUnixTime-b.destinationUnixTime*/ });
		outCity.sort(function (a, b) { return a.destinationUnixTime - b.destinationUnixTime });

		/* Periodically remember window positions in Chrome because onbeforeunload doesn't work */

		if (FFVersion.Browser == "Chrome" && (SecondLooper % MinuteInterval) == 1) {
			RememberWindowPositions();
			saveOptions();
		}

		/* Check Throne Preset hasn't changed */

		if (CurrPreset != Seed.throne.activeSlot) { Dashboard.PaintTRPresets(); }

		/* Update Dashboard */

		if (popDash && Dashboard.Loaded) { Dashboard.EverySecond(); };

		/* Update Incoming and Outgoing and March popups */

		if (popInc) { Incoming.EverySecond(); };
		if (popOut) { Outgoing.EverySecond(); };
		if (popMarch) { QuickMarch.EverySecond(); };

		/* loop through tabs */

		tabManager.EverySecond();

		/* check for afk */

		afkdetector.check();

		/* display/clean up ajax log */

		var activity = 0;
		var now = unixTime();
		for (var aj = AJAX_LOG.length - 1; aj >= 0; aj--) {
			if (AJAX_LOG[aj].timestamp < (now - 60)) {
				AJAX_LOG.splice(aj, 1);
			}
			else {
				if (AJAX_LOG[aj].timestamp > (now - 20)) {
					activity++;
				}
			}
		}
		if (Options.ShowServerTraffic) {
			activity = activity * 3;
			var trafficcolor = '#0F0';
			if (activity > 75) { trafficcolor = '#FF0'; }
			if (activity > 150) { trafficcolor = '#FA0'; }
			if (ById('btTraffic')) {
				ById('btTraffic').innerHTML = activity + tx('/min');
				ById('btTraffic').style.color = trafficcolor;
			}
		}

		/* restart loop */

		SecondTimer = setTimeout(EverySecond, 1000);
	}
	catch (err) {
		logerr(err); // write to log
		SecondTimer = setTimeout(EverySecond, 1000);
	}
}
