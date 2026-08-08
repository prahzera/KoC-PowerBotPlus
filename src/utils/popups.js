function CPopup(prefix, x, y, width, height, enableDrag, onClose) {
	var pop = WinManager.get(prefix);
	if (pop) {
		pop.show(false);
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

	function show(tf) {
		if (tf) {
			t.div.style.display = 'block';
			t.focusMe();
		} else {
			t.div.style.display = 'none';
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
				m += '<TD align=center ><div><A id=bttc' + sorter[i][1].name + ' class="buttonv2 std ' + color + '"><span style="white-space:nowrap;display:inline-block;width:72px;">' + sorter[i][1].label + '</span></a></div></td>';
				if ((i + 1) % LineBreak == 0) m += '</tr><TR>';
			}
			m += '</tr></table>';
		}
		else {
			var n = '';
			if (GlobalOptions.btPowerBarPopups) { n = '<div id=btPowerBarExtra style="padding-bottom:5px;"></div>'; }
			for (var i = 0; i < sorter.length; i++) {
				var color = sorter[i][1].tabColor;
				n += '<a class=TextLink><div id=bttc' + sorter[i][1].name + ' class="buttonv2 std ' + color + '">' + sorter[i][1].label + '</div></a>';
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
