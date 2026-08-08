function createButton(label, id) {
	var a = document.createElement('a');
	a.className = 'button20';
	a.id = id;
	a.innerHTML = '<span style="color: #ff6">' + label + '</span>';
	return a;
}

function AddMainTabLink(text, id, eventListener, mouseListener) {
	var a = createButton(text, id);
	a.className = 'tab';
	var tabs = ById('main_engagement_tabs');
	if (tabs) {
		gmTabs = SetupMainTab(tabs);
		if (gmTabs) {
			gmTabs.appendChild(a);
			a.addEventListener('click', eventListener, false);
			if (mouseListener != null) { a.addEventListener('mousedown', mouseListener, true); }
			if (id != null) { a.id = id; }
			return a;
		}
	}
	return null;
}

function AddSubTabLink(text, eventListener, id, colourclass) {
	var a = createButton(text, id);
	if (colourclass == null) colourclass = 'blue20';
	a.className = 'inlineButton btButton ' + colourclass;
	a.style.paddingLeft = '2px';
	var tabs = ById('main_engagement_tabs');
	if (tabs) {
		gmTabs = SetupSubTab(tabs);
		if (gmTabs) {
			gmTabs.appendChild(a);
			a.addEventListener('click', eventListener, false);
			if (id != null) { a.id = id; }
			return a;
		}
	}
	return null;
}

function SetToggleButtonState(entity, tf, text) {
	var btn = ById(entity + 'ToggleTab');
	if (btn) {
		if (tf) { btn.innerHTML = '<span style="color: #FFFF00">' + tx(text) + ': ' + tx('On') + '</span>'; }
		else { btn.innerHTML = '<span style="color: #CCC">' + tx(text) + ': ' + tx('Off') + '</span>'; }
	}
}
