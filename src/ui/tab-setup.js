function SetupMainTab(tabs) {
	var e = tabs.parentNode;
	var gmTabs = null;
	for (var i = 0; i < e.childNodes.length; i++) {
		var ee = e.childNodes[i];
		if (ee.tagName && ee.tagName == 'DIV' && ee.className == 'tabs_engagement' && ee.id != 'main_engagement_tabs' && ee.id != 'pbp_subtab') {
			gmTabs = ee;
			break;
		}
	}
	if (gmTabs == null) {
		gmTabs = document.createElement('div');
		gmTabs.className = 'tabs_engagement';
		tabs.parentNode.insertBefore(gmTabs, tabs);
	}
	gmTabs.style.height = '0%';
	gmTabs.style.paddingLeft = '0px';
	gmTabs.style.width = '100%';
	gmTabs.style.whiteSpace = 'nowrap';
	gmTabs.style.overflow = 'auto';
	gmTabs.lang = 'en_PB';
	return gmTabs;
}

function SetupSubTab(tabs) {
	var e = tabs.parentNode;
	var gmTabs = null;
	for (var i = 0; i < e.childNodes.length; i++) {
		var ee = e.childNodes[i];
		if (ee.tagName && ee.tagName == 'DIV' && ee.className == 'tabs_engagement' && ee.id == 'pbp_subtab') {
			gmTabs = ee;
			break;
		}
	}
	if (gmTabs == null) {
		gmTabs = document.createElement('div');
		gmTabs.className = 'tabs_engagement';
		gmTabs.id = 'pbp_subtab';
		tabs.parentNode.insertBefore(gmTabs, tabs);
	}
	gmTabs.style.height = '0%';
	gmTabs.style.paddingLeft = '5px';
	gmTabs.style.width = '100%';
	gmTabs.style.whiteSpace = 'nowrap';
	gmTabs.style.overflow = 'auto';
	gmTabs.lang = 'en_PB';
	return gmTabs;
}

function AddPowerBarLink(text, id, eventListener, mouseListener) {
	var PBX = ById('btPowerBarExtra');
	if (!PBX || !GlobalOptions.btPowerBarPopups) {
		AddMainTabLink(text.toUpperCase(), id, eventListener, mouseListener);
		return;
	}

	var a = document.createElement('a');
	a.className = 'TextLink';
	a.innerHTML = '<div class="buttonv2 std blue">' + text + '</div>';

	PBX.appendChild(a);
	a.addEventListener('click', eventListener, false);
	if (mouseListener != null)
		a.addEventListener('mousedown', mouseListener, true);
	if (id != null)
		a.id = id;
	return a;
}

function mouseMainTab(me) { // right-click on main button resets window location
	if (me.button == 2) {
		var c = getClientCoords(ById('main_engagement_tabs'));
		mainPop.setLocation({ x: c.x + 4, y: c.y + c.height });
	}
}

function eventHideShow() {
	if (mainPop.toggleHide(mainPop)) {
		tabManager.showTab(false);
		Options.btWinIsOpen = true;
	} else {
		tabManager.hideTab();
		Options.btWinIsOpen = false;
	}
	saveOptions();
}
