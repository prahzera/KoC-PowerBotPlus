function FetchHQInfo(notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqOpen.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				var params2 = uW.Object.clone(uW.g_ajaxparams);
				new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqVaultOpen.php" + uW.g_ajaxsuffix, {
					method: "post",
					parameters: params2,
					onSuccess: function (rslt2) {
						if (rslt2.ok) {
							var params3 = uW.Object.clone(uW.g_ajaxparams);
							params3.hqId = Seed.allianceHQ.hq_id;
							new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqMineOpen.php" + uW.g_ajaxsuffix, {
								method: "post",
								parameters: params3,
								onSuccess: function (rslt3) {
									if (notify) notify(rslt, rslt2, rslt3);
								},
								onFailure: function () { if (notify) { notify(rslt, rslt2, { msg: tx('AJAX error') }); } },
							});
							return;
						}
						if (notify) notify(rslt, rslt2);
					},
					onFailure: function () { if (notify) { notify(rslt, { msg: tx('AJAX error') }); } },
				});
				return;
			}
			if (notify) notify(rslt);
		},
		onFailure: function () { if (notify) { notify({ msg: tx('AJAX error') }); } },
	}, false);
};

function OpenTemple(notify) {
	var params = uW.Object.clone(uW.g_ajaxparams);
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqTempleOpen.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (notify) notify(rslt);
		},
		onFailure: function () { if (notify) { notify({ msg: tx('AJAX error') }); } },
	});
}
