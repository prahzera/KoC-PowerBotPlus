function CheckRemoveAlert() {
	var x = ByCl('kofcalert');
	if (x.length > 0) for (var i = 0; i < x.length; i++) if (String(x[i].innerHTML).indexOf('atk march no row change') > -1) { uW.Modal.hideModal(true); actionLog('Removed "atk march no row change" dialog'); }
	var y = ById('fb_dialog_ipad_overlay');
	if (y) y.style.display = 'none';
	var z = ByCl('kofctrackeralert');
	if (z.length > 0) for (var i = 0; i < z.length; i++) { uW.Modal.hideModal(true); actionLog('Removed "something has gone wrong" dialog'); }
	setTimeout(CheckRemoveAlert, 2000);
}

function CheckDisableAds() {
	if (Seed.player.ryPlayer && Seed.player.ryPlayer.dau) {
		var RY1 = ById('ryAdCurtain');
		if (RY1) { RY1.style.width = '0px'; RY1.style.height = '0px'; RY1.style.zIndex = '-1'; }
		var RY2 = ById('ryAdContainerOuter');
		if (RY2) { RY2.style.width = '0px'; RY2.style.height = '0px'; RY2.style.zIndex = '-1'; }
		var RY3 = ById('ryAdContainer');
		if (RY3) {
			RY3.parentNode.removeChild(RY3);
			logit('Disabled RockYou popup ad controller');
		}
	}
	setTimeout(CheckDisableAds, 3000);
}
