function FetchReport(rpId, notify) {
	// store fetched reports in a cache so we don't keep bothering the server...
	rpId = deFilter(rpId);

	if (ReportCache.hasOwnProperty(rpId)) {
		var rslt = JSON2.parse(JSON2.stringify(ReportCache[rpId]))
		if (notify) notify(rslt);
	}
	else {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = rpId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchReport.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt) { ReportCache[rpId] = JSON2.parse(JSON2.stringify(rslt)); }
				if (notify) notify(rslt);
			},
		}, false);
	}
};

function deleteCheckedReport(rpt) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.s0rids = '';
	params.s1rids = rpt;
	params.cityrids = '';
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/deleteCheckedReports.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				delete ReportCache[rpt];
				delete ReportDetailCache[rpt];
				if (GlobalOptions.ExtendedDebugMode) actionLog('Deleted: Checked report id: ' + rpt, 'GENERAL');
			}
		},
	});
};

function FetchReportDetail(rpId, side, notify) {
	// store fetched report details in a cache so we don't keep bothering the server...
	rpId = deFilter(rpId);

	if (ReportDetailCache.hasOwnProperty(rpId)) {
		var rslt = JSON2.parse(JSON2.stringify(ReportDetailCache[rpId]))
		if (notify) notify(rslt);
	}
	else {
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = rpId;
		params.side = side;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchReport.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt) { ReportDetailCache[rpId] = JSON2.parse(JSON2.stringify(rslt)); }
				if (notify) notify(rslt);
			},
		}, false);
	}
};
