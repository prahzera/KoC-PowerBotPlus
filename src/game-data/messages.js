function DeleteLastMessage() {
	var params = uW.Object.clone(uW.g_ajaxparams);
	params.requestType = 'GET_MESSAGE_HEADERS_FOR_USER_INBOX';
	params.boxType = 'outbox';
	params.pageNo = 1;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				if (rslt.mostRecentMessageId) {
					var params2 = uW.Object.clone(uW.g_ajaxparams);
					params2.requestType = 'ACTION_ON_MESSAGES';
					params2.boxType = 'outbox';
					params2.selectedAction = 'delete';
					params2.selectedMessageIds = rslt.mostRecentMessageId;
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/getEmail.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params2,
						onSuccess: function (rslt2) { },
					}, true);
				}
			}
		},
	}, true);
};
