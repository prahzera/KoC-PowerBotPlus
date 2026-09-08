function CPopup(prefix, x, y, width, height, enableDrag, onClose) {
	var pop = WinManager.get(prefix);
	if (pop) {
		pop.show(false, true);
		return pop;
	}
	this.BASE_ZINDEX = 111111;

	// protos ...
	this.show = show;
	this.toggleHide = toggleHide;
	this.getTopDiv = getTopDiv;
	this.getMainDiv = getMainDiv;
	this.getLayer = getLayer;
	this.setLayer = setLayer;
	this.setEnableDrag = setEnableDrag;
	this.getLocation = getLocation;
	this.setLocation = setLocation;
	this.getDimensions = getDimensions;
	this.setDimensions = setDimensions;
	this.focusMe = focusMe;
	this.unfocusMe = unfocusMe;
	this.centerMe = centerMe;
	this.destroy = destroy;

	// object vars ...
	this.div = document.createElement('div');
	this.prefix = prefix;
	this.onClose = onClose;

	var t = this;
	this.div.className = 'btPopup ' + prefix + '_btPopup';
	this.div.id = prefix + '_outer';
	this.div.style.background = "#fff";
	this.div.style.zIndex = this.BASE_ZINDEX;
	this.div.style.display = 'none';
	this.div.style.width = width + 'px';
	this.div.style.height = height + 'px';
	this.div.style.position = "absolute";
	this.div.style.top = y + 'px';
	this.div.style.left = x + 'px';

	var m = '<TABLE cellspacing=0 width=100% height=100%><TR id="' + prefix + '_bar" class="btPopupTop ' + prefix + '_btPopupTop"><TD style="-moz-border-radius-topleft: 20px; border-top-left-radius: 20px;"><SPAN id="' + prefix + '_top"></span></td>\
			<TD id='+ prefix + '_X align=right valign=middle onmouseover="this.style.cursor=\'pointer\'" style="width:10px;color:#fff; background:#400; border:1px solid #000000; font-weight:bold; font-size:14px; padding:0px 5px; -moz-border-radius-topright: 20px; border-top-right-radius: 20px;">X</td></tr>\
			<TR><TD height=100% valign=top class="btPopMain '+ prefix + '_btPopMain" colspan=2 id="' + prefix + '_main"><div id="' + prefix + '_content"></div></td></tr></table>';
	document.body.appendChild(this.div);
	this.div.innerHTML = m;
	ById(prefix + '_X').addEventListener('click', e_XClose, false);
	this.dragger = new CWinDrag(ById(prefix + '_bar'), this.div, enableDrag);

	this.div.addEventListener('mousedown', e_divClicked, false);
	WinManager.add(prefix, this);

	function e_divClicked() {
		t.focusMe();
	}
	function e_XClose() {
		t.show(false);
		if (t.onClose != null)
			t.onClose();
	}

	function focusMe() {
		t.setLayer(5);
		for (var k in uW.cpopupWins) {
			if (k != t.prefix)
				uW.cpopupWins[k].unfocusMe();
		}
	}

	function unfocusMe() {
		t.setLayer(-5);
	}

	function getLocation() {
		return { x: parseInt(this.div.style.left), y: parseInt(this.div.style.top) };
	}

	function getDimensions() {
		return { x: parseInt(this.div.style.width), y: parseInt(this.div.style.height) };
	}

	function setLocation(loc) {
		t.div.style.left = loc.x + 'px';
		t.div.style.top = loc.y + 'px';
	}

	function setDimensions(loc) {
		t.div.style.width = loc.x + 'px';
		t.div.style.height = loc.y + 'px';
	}

	function destroy() {
		document.body.removeChild(t.div);
		WinManager.delete(t.prefix);
	}

	function centerMe(parent) {
		if (parent == null) {
			var coords = getClientCoords(document.body);
		} else
			var coords = getClientCoords(parent);
		var x = ((coords.width - parseInt(t.div.style.width)) / 2) + coords.x;
		var y = ((coords.height - parseInt(t.div.style.height)) / 2) + coords.y;
		if (x < 0)
			x = 0;
		if (y < 0)
			y = 0;
		t.div.style.left = x + 'px';
		t.div.style.top = y + 'px';
	}

	function setEnableDrag(tf) {
		t.dragger.setEnable(tf);
	}

	function setLayer(zi) {
		t.div.style.zIndex = '' + (this.BASE_ZINDEX + zi);
	}

	function getLayer() {
		return parseInt(t.div.style.zIndex) - this.BASE_ZINDEX;
	}

	function getTopDiv() {
		return ById(this.prefix + '_top');
	}

	function getMainDiv() {
		return ById(this.prefix + '_content');
	}

	function show(tf, instant) {
		var dur = btAnimMs();
		var reduced = btReducedMotion();
		if (t._hideTimer) { clearTimeout(t._hideTimer); t._hideTimer = null; }
		if (tf) {
			t.div.style.transition = '';
			t.div.style.opacity = '';
			t.div.style.display = 'block';
			t.focusMe();
			if (!instant && dur > 0 && !reduced) {
				try {
					var target = GlobalOptions.btTransparent ? 0.9 : 1;
					t.div.style.opacity = '0';
					t.div.style.transition = 'opacity ' + (dur / 1000) + 's ease';
					btRaf(function () { t.div.style.opacity = '' + target; });
					setTimeout(function () { t.div.style.transition = ''; }, dur + 100);
				} catch (e) { t.div.style.opacity = ''; t.div.style.transition = ''; }
			}
		} else {
			if (instant || dur <= 0 || reduced) {
				t.div.style.display = 'none';
				t.div.style.opacity = '';
				t.div.style.transition = '';
			} else {
				try {
					t.div.style.transition = 'opacity ' + (dur / 1000) + 's ease';
					t.div.style.opacity = '0';
					var d = t.div;
					t._hideTimer = setTimeout(function () {
						t._hideTimer = null;
						d.style.display = 'none';
						d.style.opacity = '';
						d.style.transition = '';
					}, dur + 60);
				} catch (e) { t.div.style.display = 'none'; t.div.style.opacity = ''; t.div.style.transition = ''; }
			}
		}
		return tf;
	}

	function toggleHide(t) {
		if (t.div.style.display == 'block') {
			return t.show(false);
		} else {
			return t.show(true);
		}
	}
}

function CWinDrag(clickableElement, movingDiv, enabled) {
	var t = this;
	this.setEnable = setEnable;
	this.setBoundRect = setBoundRect;
	this.lastX = null;
	this.lastY = null;
	this.enabled = true;
	this.moving = false;
	this.theDiv = movingDiv;
	this.body = document.body;
	this.ce = clickableElement;
	this.moveHandler = new CeventMove(this).handler;
	this.outHandler = new CeventOut(this).handler;
	this.upHandler = new CeventUp(this).handler;
	this.downHandler = new CeventDown(this).handler;
	this.clickableRect = null;
	this.boundRect = null;
	this.bounds = null;
	this.enabled = false;
	if (enabled == null)
		enabled = true;
	this.setEnable(enabled);

	function setBoundRect(b) {	// this rect (client coords) will not go outside of current body
		this.boundRect = boundRect;
		this.bounds = null;
	}

	function setEnable(enable) {
		if (enable == t.enabled)
			return;
		if (enable) {
			clickableElement.addEventListener('mousedown', t.downHandler, false);
			t.body.addEventListener('mouseup', t.upHandler, false);
		} else {
			clickableElement.removeEventListener('mousedown', t.downHandler, false);
			t.body.removeEventListener('mouseup', t.upHandler, false);
		}
		t.enabled = enable;
	}

	function CeventDown(that) {
		this.handler = handler;
		var t = that;

		function handler(me) {
			if (t.bounds == null) {
				t.clickableRect = getClientCoords(clickableElement);
				t.bodyRect = getClientCoords(document.body);
				if (t.boundRect == null)
					t.boundRect = t.clickableRect;
				t.bounds = { top: 10 - t.clickableRect.height, bot: t.bodyRect.height - 25, left: 40 - t.clickableRect.width, right: t.bodyRect.width - 25 };
			}
			if (me.button == 0 && t.enabled) {
				t.body.addEventListener('mousemove', t.moveHandler, true);
				t.body.addEventListener('mouseout', t.outHandler, true);
				t.lastX = me.clientX;
				t.lastY = me.clientY;
				t.moving = true;
			}
		}
	}

	function CeventUp(that) {
		this.handler = handler;
		var t = that;

		function handler(me) {
			if (me.button == 0 && t.moving)
				_doneMoving(t);
		}
	}

	function _doneMoving(t) {
		t.body.removeEventListener('mousemove', t.moveHandler, true);
		t.body.removeEventListener('mouseout', t.outHandler, true);
		t.moving = false;
	}

	function CeventOut(that) {
		this.handler = handler;
		var t = that;

		function handler(me) {
			if (me.button == 0) {
				t.moveHandler(me);
			}
		}
	}

	function CeventMove(that) {
		this.handler = handler;
		var t = that;

		function handler(me) {
			if (t.enabled && !t.wentOut) {
				var newTop = parseInt(t.theDiv.style.top) + me.clientY - t.lastY;
				var newLeft = parseInt(t.theDiv.style.left) + me.clientX - t.lastX;
				if (newTop < t.bounds.top) { // if out-of-bounds...
					newTop = t.bounds.top;
					_doneMoving(t);
				} else if (newLeft < t.bounds.left) {
					newLeft = t.bounds.left;
					_doneMoving(t);
				} else if (newLeft > t.bounds.right) {
					newLeft = t.bounds.right;
					_doneMoving(t);
				} else if (newTop > t.bounds.bot) {
					newTop = t.bounds.bot;
					_doneMoving(t);
				}
				t.theDiv.style.top = newTop + 'px';
				t.theDiv.style.left = newLeft + 'px';
				t.lastX = me.clientX;
				t.lastY = me.clientY;
			}
		}
	}
}

function ResetWindowPos(me, el, pop) {
	if (me.button == 2) {
		var c = getClientCoords(ById(el));
		if (pop) { pop.setLocation({ x: c.x + 4, y: c.y + c.height }); mainPop.unfocusMe(); pop.focusMe(); }
		saveOptions();
	}
}

var TabIcons = {
	Attack: '<path d="M7 3 L17 21 M17 3 L7 21"/><path d="M4 6 L9 10 M20 18 L15 14"/>',
	Build: '<path d="M4 6 H14 V9 H4 Z"/><path d="M9 9 V17"/>',
	Transport: '<path d="M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z"/><path d="M4 7 L12 11 L20 7"/><path d="M12 11 V21"/>',
	Nomad: '<path d="M12 4 L21 19 H3 Z"/><path d="M12 10 L9.5 14.5"/>',
	Gift: '<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M12 10 V20 M4 14 H20"/><rect x="10.5" y="8" width="3" height="3"/>',
	Fort: '<path d="M12 3 L19 6 V12 C19 17 16 20 12 22 C8 20 5 17 5 12 V6 Z"/>',
	Train: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
	Spells: '<path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z"/>',
	Craft: '<path d="M9 3 H15 M10 3 V8 L5 17 A2 2 0 0 0 7 20 H17 A2 2 0 0 0 19 17 L14 8 V3"/><path d="M8 14 H16"/>',
	Reassign: '<path d="M4 7 H18 M18 7 L15 4 M18 7 L15 10"/><path d="M20 17 H6 M6 17 L9 14 M6 17 L9 20"/>',
	BulkScout: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 L21 21"/>',
	ScoutReports: '<path d="M6 3 H15 L19 7 V21 H6 Z"/><path d="M15 3 V7 H19"/><path d="M9 12 H15 M9 16 H15"/>',
	Revive: '<path d="M20.8 4.6 A5.5 5.5 0 0 0 12 5.7 L12 5.7 A5.5 5.5 0 0 0 3.2 4.6 A5.5 5.5 0 0 0 3.2 12.4 L12 21 L20.8 12.4 A5.5 5.5 0 0 0 20.8 4.6 Z"/>',
	Options: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
	ActionLog: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><path d="M3 6 H3.01 M3 12 H3.01 M3 18 H3.01"/>',
	Alliance: '<path d="M4 22 V3 M4 3 H18 L15 7 L18 11 H4"/>',
	Inventory: '<path d="M6 6 H18 A2 2 0 0 1 20 8 V19 A2 2 0 0 1 18 21 H6 A2 2 0 0 1 4 19 V8 A2 2 0 0 1 6 6 Z"/><path d="M12 6 V4 A2 2 0 0 1 16 4"/><path d="M6 14 H18"/>',
	Messages: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7 L12 13 L21 7"/>',
	GloryFarm: '<path d="M12 2 L14.5 8.5 L21 9 L16 13.5 L17.5 20 L12 16.5 L6.5 20 L8 13.5 L3 9 L9.5 8.5 Z"/>',
	Knights: '<path d="M12 2 V19"/><path d="M8 5 H16"/><path d="M9 19 H15"/>',
	Notes: '<path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z"/><path d="M14 6 L18 10"/>',
	Monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21 H16 M12 17 V21"/>',
	Wilds: '<path d="M17 8 C17 4 13 2 12 2 C11 2 7 4 7 8 C7 8 3 10 3 14 C3 17 6 19 8 19 H16 C18 19 21 17 21 14 C21 10 17 8 17 8 Z"/><path d="M12 19 V22"/>',
	Search: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 L13.5 13.5 L8.5 15.5 L10.5 10.5 Z"/>',
	OverView: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9 H21 M9 3 V21"/>',
	Whisper: '<path d="M21 11.5 A8.5 8.5 0 0 1 5.5 16.8 L3 21 L6.3 18.9 A8.5 8.5 0 1 1 21 11.5 Z"/>',
	Player: '<path d="M20 21 V19 A4 4 0 0 0 16 15 H8 A4 4 0 0 0 4 19 V21"/><circle cx="12" cy="7" r="4"/>',
	Reference: '<path d="M4 19.5 A2.5 2.5 0 0 1 6.5 17 H20"/><path d="M6.5 2 H20 V22 H6.5 A2.5 2.5 0 0 1 4 19.5 V4.5 A2.5 2.5 0 0 1 6.5 2 Z"/>'
};

function tabLabelWithIcon(name, label) {
	var icon = TabIcons[name] || '';
	return (icon ? '<span class=btTabIcon><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg></span>' : '') + '<span class=btTabText>' + label + '</span>';
}

var tabManager = {
	tabList: {}, // {name, obj, div}
	currentTab: null,

	init: function (mainDiv) {
		var t = tabManager;
		var sorter = [];
		var LineBreak = 10;
		if (GlobalOptions.btWinSize.x == 750) { LineBreak = 8; }
		if (GlobalOptions.btWinSize.x == 1250) { LineBreak = 12; }

		for (var k in Tabs) {
			if (!Tabs[k].tabDisabled) {
				t.tabList[k] = {};
				t.tabList[k].name = k;
				t.tabList[k].tabColor = Tabs[k].tabColor ? Tabs[k].tabColor : 'blue';
				t.tabList[k].obj = Tabs[k];
				if (Tabs[k].tabLabel != null) {
					t.tabList[k].label = tx(Tabs[k].tabLabel);
				}
				else {
					t.tabList[k].label = k;
				}
				if (Tabs[k].tabOrder != null)
					sorter.push([Tabs[k].tabOrder, t.tabList[k]]);
				else
					sorter.push([1000, t.tabList[k]]);
				t.tabList[k].div = document.createElement('div');
			}
		}

		sorter.sort(function (a, b) { return a[0] - b[0] });
		var m = '<div align="center"><b>PowerBot+ (Version ' + Version + ')</b></div>';

		if (!GlobalOptions.btPowerBar) {
			m += '<TABLE align=center><TR>';
			for (var i = 0; i < sorter.length; i++) {
				var color = sorter[i][1].tabColor;
				m += '<TD align=center ><div><A id=bttc' + sorter[i][1].name + ' class="buttonv2 std ' + color + '">' + tabLabelWithIcon(sorter[i][1].name, sorter[i][1].label) + '</a></div></td>';
				if ((i + 1) % LineBreak == 0) m += '</tr><TR>';
			}
			m += '</tr></table>';
		}
		else {
			var n = '';
			if (GlobalOptions.btPowerBarPopups) { n = '<div id=btPowerBarExtra style="padding-bottom:5px;"></div>'; }
			for (var i = 0; i < sorter.length; i++) {
				var color = sorter[i][1].tabColor;
				n += '<a class=TextLink><div id=bttc' + sorter[i][1].name + ' class="buttonv2 std ' + color + '">' + tabLabelWithIcon(sorter[i][1].name, sorter[i][1].label) + '</div></a>';
			}
			ById('btPowerBarButtons').innerHTML = n;
		}

		mainPop.getTopDiv().innerHTML = m;

		for (var k in t.tabList) {
			if (t.tabList[k].name == Options.currentTab)
				t.currentTab = t.tabList[k];
			ById('bttc' + k).addEventListener('click', this.e_clickedTab, false);
			var div = t.tabList[k].div;
			div.style.display = 'none';
			div.style.height = '100%';
			mainDiv.appendChild(div);
			try {
				t.tabList[k].obj.init(div);
			} catch (e) {
				logerr(e);
				div.innerHTML = "<br><b>" + tx("INIT ERROR") + ":</b> " + e.message;
				try { div.innerHTML += '<br><br><b>Debug Info</b><br>' + e.stack + '<br>'; }
				catch (e) { }
			}
		}

		if (t.currentTab == null)
			t.currentTab = sorter[0][1];
		if (!GlobalOptions.btPowerBar) {
			t.setTabStyle(t.currentTab, true);
		}
		t.currentTab.div.style.display = 'block';
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	hideTab: function () {
		var t = tabManager;
		if (matTypeof(t.currentTab.obj.hide) == "function") t.currentTab.obj.hide();
		if (GlobalOptions.btPowerBar) {
			Options.btWinIsOpen = false;
			Options.currentTab = null;
			saveOptions();
			t.setTabStyle(t.currentTab, false);
		}
	},

	showTab: function (init) {
		var t = tabManager;
		if (matTypeof(t.currentTab.obj.show) == "function") t.currentTab.obj.show(init);
		if (GlobalOptions.btPowerBar) {
			t.setTabStyle(t.currentTab, true);
			Options.btWinIsOpen = true;
			Options.currentTab = t.currentTab.name;
			saveOptions();
		}
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	setTabStyle: function (Tab, selected) {
		var e = ById('bttc' + Tab.name)
		var c = Tab.tabColor ? Tab.tabColor : "blue";
		if (selected) {
			e.className = 'buttonv2 std green';
		} else {
			e.className = 'buttonv2 std ' + c;
		}
	},

	e_clickedTab: function (e) {
		var t = tabManager;
		if (!Options.btWinIsOpen) {
			mainPop.show(true);
		}
		if (!GlobalOptions.btPowerBar) {
			if (e.target.id)
				var newTab = t.tabList[e.target.id.substring(4)];
			else
				var newTab = t.tabList[e.target.parentNode.id.substring(4)];
		}
		else {
			var newTab = t.tabList[e.target.id.substring(4)];
			t.setTabStyle(newTab, true);
			Options.currentTab = newTab.name;
			Options.btWinIsOpen = true;
			saveOptions();
		}
		if (t.currentTab.name != newTab.name) {
			t.setTabStyle(t.currentTab, false);
			t.setTabStyle(newTab, true);
			if (matTypeof(t.currentTab.obj.hide) == "function") t.currentTab.obj.hide();
			t.currentTab.div.style.display = 'none';
			t.currentTab = newTab;
			newTab.div.style.display = 'block';
			if (btAnimMs() > 0 && !btReducedMotion()) {
				var td = newTab.div;
				td.classList.add('botTabEnter');
				setTimeout(function () { td.classList.remove('botTabEnter'); }, 250);
			}
			Options.currentTab = newTab.name;
			saveOptions();
		}
		if (matTypeof(newTab.obj.show) == "function") newTab.obj.show();
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);
	},

	EverySecond: function () {
		var t = tabManager;
		for (var k in t.tabList) {
			if (!t.tabList[k].tabDisabled && matTypeof(t.tabList[k].obj.EverySecond) == "function") {
				try {
					t.tabList[k].obj.EverySecond();
				} catch (e) { logerr(e); }
			}
		}
	},
}

//This is a new implementation of the CalterUwFunc class to modify a function of the 'uW' object.
