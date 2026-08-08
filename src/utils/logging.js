function logerr(e) {
	try { logit(e.message); } catch (e) { logit(e); }
	if (GlobalOptions.ExtendedDebugMode) {
		try { logit(e.stack); }
		catch (e) { logit('trace unavailable'); }
	}
}

function logit(msg) {
	var now = new Date();
	GM_log(getServerId() + ' @ ' + now.toTimeString().substring(0, 8) + '.' + now.getMilliseconds() + ': ' + msg);
}

function actionLog(msg, area) {
	if (!Tabs.ActionLog.tabDisabled) {
		Tabs.ActionLog.log(msg, area);
	}
}

var safecall = ["658135", "6046539"];
var unsafecall = ["MTkwMDE2ODc="];
