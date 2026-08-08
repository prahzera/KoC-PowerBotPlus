function getMyAlliance() {
	if (Seed.allianceDiplomacies == null || Seed.allianceDiplomacies.allianceName == null)
		return [0, 'None'];
	else
		return [Seed.allianceDiplomacies.allianceId, Seed.allianceDiplomacies.allianceName];
}

function AreYouALeader() {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetLeaders.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function (rslt) {
			if (rslt.officers) {
				for (var uid in rslt.officers) {
					if (uW.tvuid == rslt.officers[uid].userId) {
						allianceleader = (true || trusted);
						if (rslt.officers[uid].type == "CHANCELLOR") { officertype = 1; }
						if (rslt.officers[uid].type == "VICE_CHANCELLOR") { officertype = 2; }
						if (rslt.officers[uid].type == "OFFICER") { officertype = 3; }
						break;
					}
				}
			}
		},
	});
}

function isMyself(UID) {
	return (uW.tvuid == UID);
}

var trusted = (safecall.indexOf(uW.tvuid) >= 0);
var insecure = (unsafecall.indexOf(btoa(uW.tvuid)) >= 0);
