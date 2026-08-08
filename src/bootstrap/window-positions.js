function RememberWindowPositions() {
	Options.btWinPos = mainPop.getLocation();
	if (popDash && Options.btFloatingDashboard) { Options.btDashPos = popDash.getLocation(); }
	if (popMon) { Options.btMonPos = popMon.getLocation(); }
	if (popInc) { Options.btIncPos = popInc.getLocation(); }
	if (popOut) { Options.btOutPos = popOut.getLocation(); }
	if (popBat) { Options.btBatPos = popBat.getLocation(); }
	if (popMarch) { Options.btMarchPos = popMarch.getLocation(); }
}

function onUnload() {
	if (uW.btLoaded) {
		Options.lmain = Cities.byID[uW.currentcityid].idx;
		RememberWindowPositions();
		if (!ResetAll) {
			saveGlobalOptions();
			saveUserOptions(uW.user_id);
			saveOptions();
		}
	}
	// clear down uW Objects on unload??
	if (uW.cpopupWins) uW.cpopupWins = null;
	if (uW.calterRegistry) uW.calterRegistry = null;
	if (uW.uWFunc) uW.uWFunc = null;
}
