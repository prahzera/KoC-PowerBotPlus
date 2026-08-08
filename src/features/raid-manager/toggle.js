/** Raid Manager **/

function ToggleCityRaids(cityId, RaidAction, notify) {

	if (!RaidManager.CityHasRaids(cityId)) {
		if (notify) notify({ 'ok': true });
		return;
	}

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.pf = 0;
	params.ctrl = 'BotManager';
	params.action = RaidAction; // stopAll or resumeAll
	params.settings = { cityId: cityId };

	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				if (RaidAction != 'getMarches') {
					ToggleCityRaids(cityId, 'getMarches', notify); // retrieve new march statuses
					return;
				}
				else {
					setTimeout(uW.update_seed_ajax, 1000); // update_seed with the new march statuses (?)
				}
			}
			else {
				if (rslt.msg == "The system is busy, please try again later") {
					setTimeout(ToggleCityRaids, 2000, cityId, RaidAction, notify);
					return;
				}
				else {
					actionLog(Cities.byID[cityId].name + ": " + rslt.msg, 'RAIDS');
				}
			}
			if (notify) notify(rslt);
		},
		onFailure: function () {
			actionLog(Cities.byID[cityId].name + ": Raid toggle server error", 'RAIDS');
			if (notify) notify({ 'ok': false });
		},
	}, true);
};
