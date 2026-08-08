function RefreshSeed() {
	RefreshingSeed = true;
	if (!Options.DashboardOptions.RefreshSeed) {
		jQuery('#btRefreshSeed').addClass("disabled");
		jQuery('#btRefreshSeedInc').addClass("disabled");
		jQuery('#btRefreshSeedOut').addClass("disabled");
	}

	// if update_seed_ajax is running, wait for it to finish before going any further..

	if (uW.g_update_seed_ajax_do) {
		setTimeout(RefreshSeed, 1000);
		return;
	}

	// stop update_seed_ajax from running again until we are done here..
	uW.g_update_seed_ajax_do = true;

	var params = uW.Object.clone(uW.g_ajaxparams);

	var ts = (new Date().getTime() / 1000) + uW.g_timeoff;
	var cts = parseInt((ts - 25.1) * 1000);
	var upd = window.self.location.href;
	upd = upd.replace(/ts=\d*\.\d+/, "ts=" + ts);
	upd = upd.replace(/cts=\d*/, "cts=" + cts);

	new AjaxRequest(upd, {
		method: "POST",
		parameters: params,
		onSuccess: function (rslt) {
			var mainSrcHTMLCode = rslt.responseText;
			var myregexp = /var\ seed=\{.*?\};/;
			var match = myregexp.exec(mainSrcHTMLCode);
			if (match != null) {
				result = match[0];
				result = result.substr(4);
				var seed = eval(result);
				// save values missing from initial load
				var activeBuffs = Seed.activeBuffs;
				var arcanaApothecaryBuffValue = Seed.arcanaApothecaryBuffValue;
				var arcanaAetherstoneCapBuffValue = Seed.arcanaAetherstoneCapBuffValue;
				var queue_champion = Seed.queue_champion;

				uW.seed = uWCloneInto(seed);
				Seed = uW.seed;

				// restore values missing from initial load
				Seed.player.g = Seed.players["u" + uW.tvuid].s;
				if (!Seed.activeBuffs) {
					Seed.activeBuffs = activeBuffs;
				}
				if (!Seed.queue_champion) {
					Seed.queue_champion = queue_champion;
				}
				Seed.arcanaApothecaryBuffValue = arcanaApothecaryBuffValue;
				Seed.arcanaAetherstoneCapBuffValue = arcanaAetherstoneCapBuffValue;

				Tabs.Options.DeletePointlessItems();
			}
			SecondLooper = 1;
			// let update_seed_ajax run again
			setTimeout(function () { uW.g_update_seed_ajax_do = false; }, 5000); // 5 second delay before we allow update_seed_ajax to run again :)
			RefreshingSeed = false;
			if (!Options.DashboardOptions.RefreshSeed) {
				jQuery('#btRefreshSeed').removeClass("disabled");
				jQuery('#btRefreshSeedInc').removeClass("disabled");
				jQuery('#btRefreshSeedOut').removeClass("disabled");
			}
		},
		onFailure: function () {
			if (notify != null)
				notify(rslt.errorMsg);
			SecondLooper = 1;
			// let update_seed_ajax run again
			setTimeout(function () { uW.g_update_seed_ajax_do = false; }, 5000); // 5 second delay before we allow update_seed_ajax to run again :)
			RefreshingSeed = false;
			if (!Options.DashboardOptions.RefreshSeed) {
				jQuery('#btRefreshSeed').removeClass("disabled");
				jQuery('#btRefreshSeedInc').removeClass("disabled");
				jQuery('#btRefreshSeedOut').removeClass("disabled");
			}
		},
	});
}
