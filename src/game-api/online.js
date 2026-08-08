function getOnline(uidArray, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.checkArr = uidArray.join(',');
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getOnline.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
	});
}

function fetchPlayerList(name, notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.searchName = name;
	params.subType = "ALLIANCE_INVITE";
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/searchPlayers.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) { notify(rslt); },
		onFailure: function () { notify({ msg: tx('AJAX error') }); },
	}, true);
}
