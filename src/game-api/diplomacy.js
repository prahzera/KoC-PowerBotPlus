function FormatDiplomacy(aid) {
	if (Seed.allianceDiplomacies == null)
		return ' (' + uW.g_js_strings.commonstr.neutral + ')';
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a' + aid] != null)
		return ' <span style="color:#080;">(' + uW.g_js_strings.commonstr.friendly + ')</span>';
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a' + aid] != null)
		return ' <span style="color:#800;">(' + uW.g_js_strings.commonstr.hostile + ')</span>'
	if (aid == Seed.allianceDiplomacies.allianceId)
		return ' <span style="color:#088;">(' + uW.g_js_strings.commonstr.yours + ')</span>';
	return ' (' + uW.g_js_strings.commonstr.neutral + ')';
};

function getDiplomacy(aid) {
	if (Seed.allianceDiplomacies == null)
		return uW.g_js_strings.commonstr.neutral;
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a' + aid] != null)
		return uW.g_js_strings.commonstr.friendly;
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a' + aid] != null)
		return uW.g_js_strings.commonstr.hostile;
	if (aid == Seed.allianceDiplomacies.allianceId)
		return uW.g_js_strings.commonstr.yours;
	return uW.g_js_strings.commonstr.neutral;
};

function DiplomacyColours(aid) {
	if (Seed.allianceDiplomacies == null)
		return "";
	if (Seed.allianceDiplomacies.friendly && Seed.allianceDiplomacies.friendly['a' + aid] != null)
		return "color:#080;";
	if (Seed.allianceDiplomacies.hostile && Seed.allianceDiplomacies.hostile['a' + aid] != null)
		return "color:#800;font-weight:bold;";
	if (aid == Seed.allianceDiplomacies.allianceId)
		return "color:#088;";
	return "";
};

function fetchPlayerCourt(uid, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.pid = uid;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/viewCourt.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
	});
}
