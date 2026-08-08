var WideScreen = {
	chatIsRight: false,
	WideMap: false,
	PowerBar: false,
	PowerBarOpen: false,
	Dashboard: false,
	MapExpanded: false,
	PowerBarWidth: 0,
	OffsetTop: 0,
	rail: null,

	init: function () {
		var t = WideScreen;
		t.rail = searchDOM(ById('mod_maparea'), 'node.className=="maparea_rrail"', 10);

		uWExportFunction('btGetOffset', WideScreen.getOffset);

		var ttmod = new CalterUwFunc("showTooltip", [['t.cumulativeOffset()[0]', 't.cumulativeOffset()[0]-n.cumulativeOffset()[0]']]);
		ttmod.setEnable(ttmod.isAvailable());

		var modalmod = new CalterUwFunc("Modal.showModal", [[/cm.ModalManager.addLevel/ig, 'm=btGetOffset(m,true);i=btGetOffset(i,false);cm.ModalManager.addLevel'], [/\s*p\s*[+]\s*["]px/, ' p + "px !important'], ['break;', 'd+="left:"+m+"px !important";break;']]);
		modalmod.setEnable(modalmod.isAvailable());
	},

	getOffset: function (c, Horizon) {
		var t = WideScreen;
		if (Horizon) { return parseIntNan(c + t.PowerBarWidth); }
		else { return parseIntNan(c + t.OffsetTop); }
	},

	chgChatBeforeDash: function (tf) {
		var t = WideScreen;
		t.CheckDashPosition();
		t.CheckChatPosition();
	},

	RestartDashboard: function (tf) {
		var t = WideScreen;
		if (popDash) { document.body.appendChild(popDash.div); popDash.show(false); popDash.destroy(); popDash = null; }
		t.CheckDashPosition();
		t.CheckChatPosition();
		if (Options.btDashboard) { Dashboard.Curr = Cities.byID[uW.currentcityid].idx; Dashboard.init(); }
	},

	setChatOnRight: function (tf) {
		var t = WideScreen;
		if (tf == t.chatIsRight) return;
		var chat = ById('kocmain_bottom').childNodes[1];
		if (!chat || chat.className != 'mod_comm') { setTimeout(function () { t.setChatOnRight(tf) }, 1000); return; }

		if (tf) {
			chat.style.top = '-570px';
			chat.style.height = '1167px';
			chat.style.background = 'url("' + CHAT_BG_IMAGE + '")';
			ById('mod_comm_list1').style.height = '1013px';
			ById('mod_comm_list2').style.height = '1013px';
			t.CheckDashPosition();
			t.CheckChatPosition();
		} else {
			chat.style.top = '0px';
			chat.style.left = '0px';
			chat.style.height = '';
			chat.style.background = '';
			ById('mod_comm_list1').style.height = '287px';
			ById('mod_comm_list2').style.height = '287px';
			t.CheckDashPosition();
			t.CheckChatPosition();
		}
		var divheight = chat.offsetHeight;

		t.chatIsRight = tf;
	},

	CheckChatPosition: function () {
		var t = WideScreen;
		var chat = ById('kocmain_bottom').childNodes[1];
		if (chat && chat.className == 'mod_comm') {
			if (parseIntNan(getStyle(chat, 'top')) < 0) {
				var left = 760;
				if (Options.btDashboard && !GlobalOptions.btChatBeforeDash && !Options.btFloatingDashboard) {
					left += Dashboard.DashWidth + 20;
				}
				chat.style.left = left + 'px';
			}
			else {
				var widget1 = ById('tr_presetBox'); // ne0's widget
				var widget2 = ById('btTRWidget'); // my widget
				if (widget1 || widget2) {
					if (widget2) var hh = widget2.offsetHeight - 6;
					if (widget1) hh = widget1.offsetHeight - 6;
					if (!widget1 && Options.ThroneHUD) hh = 0;
					if (hh < 0) hh = 0;
					chat.style.top = hh + 'px';
					chat.style.background = 'url("' + CHAT_BG_IMAGE + '")';
					ById('mod_comm_list1').style.height = (287 - hh) + 'px';
					ById('mod_comm_list2').style.height = (287 - hh) + 'px';
				}
			}
		}
	},

	useWideMap: function (tf) {
		var t = WideScreen;
		if (tf == t.WideMap) return;
		if (tf) {
			t.rail.style.display = 'none';
			ById('mapwindow').style.height = "436px";
			ById('mapwindow').style.zIndex = "50";
		} else {
			t.rail.style.display = 'block';
			ById('mapwindow').style.height = "439px";
			ById('mapwindow').style.zIndex = "";
		}
		t.WideMap = tf;
		t.MapExpanded = true;
		t.ExpandWideMap();
	},

	ExpandWideMap: function () {
		var t = WideScreen;
		if (!t.WideMap) {
			var MapToggle = ById('btMapToggle');
			if (MapToggle) {
				MapToggle.style.display = 'none';
			}
			return;
		}
		t.MapExpanded = !t.MapExpanded;
		var MapWindow = ById('mapwindow');
		if (!MapWindow) return;
		if (t.MapExpanded) {
			MapWindow.style.width = "1220px";
			var buttontext = '<span style="display:inline-block;height:100%;vertical-align:middle;"></span><img style="margin-left:-4px;vertical-align:middle;" height="10" src="' + WhiteLeftArrow + '">';
		} else {
			MapWindow.style.width = "760px";
			var buttontext = '<span style="display:inline-block;height:100%;vertical-align:middle;"></span><img style="margin-left:-4px;vertical-align:middle;" height="10" src="' + WhiteRightArrow + '">';
		}
		var MapToggle = ById('btMapToggle');
		var MapWidth = parseIntNan(getStyle(MapWindow, 'width'));
		var MapHeight = parseIntNan(getStyle(MapWindow, 'height'));

		if (MapToggle) {
			MapToggle.style.left = MapWidth - 20 + 'px';
			MapToggle.style.display = 'block';
			ById('btMapToggleLabel').innerHTML = buttontext;
		}
		else {
			var MapToggle = document.createElement('div');
			MapToggle.id = 'btMapToggle';
			MapToggle.style.position = 'absolute';
			MapToggle.style.width = '20px';
			MapToggle.style.left = MapWidth - 20 + 'px';
			MapToggle.style.top = t.getTop(MapWindow) + parseInt(MapHeight / 2) - 30 + 'px';
			MapToggle.style.height = '60px';
			MapToggle.style.zIndex = '50'; // keep above dashboard
			MapToggle.style.display = 'block';
			ById('mapwindow').appendChild(MapToggle);

			var m = '<table><tr><td id=btMapToggleOpener valign=middle style="background:none;border:none;"><a><div id=btMapToggleLabel class="btBackExpander buttonv2 blue" style="width:20px;height:50px;">&nbsp;</div></a></td></tr></table>';
			MapToggle.innerHTML = m;
			ById('btMapToggleLabel').innerHTML = buttontext;
			ById('btMapToggleOpener').addEventListener('click', t.ExpandWideMap, false);
		}
	},

	setDashboard: function (tf) {
		var t = WideScreen;
		if (tf == t.Dashboard) return;

		if (popDash) {
			if (Options.btFloatingDashboard) {
				Options.btDashPos = popDash.getLocation();
			}
			else {
				document.body.appendChild(popDash.div);
			}

			popDash.show(false);
			popDash.destroy();
			popDash = null;
		}

		if (tf) {
			// append dashboard div to koc container
			var Dash = document.createElement('div');
			Dash.id = 'btDashboard';
			Dash.style.position = 'absolute';
			Dash.style.width = (Options.DashboardOptions.DashWidth + 20) + 'px';
			Dash.style.top = "0px";
			Dash.style.height = "5000px";
			ById('kocContainer').appendChild(Dash);
			t.CheckDashPosition();
			t.CheckChatPosition();
			Dashboard.init();
		}
		else {
			// remove dashboard div from koc container if it exists
			var elem = ById('btDashboard');
			if (elem) {
				if (popDash) { document.body.appendChild(popDash.div); popDash.show(false); popDash.destroy(); popDash = null; }
				elem.parentNode.removeChild(elem);
			}
			t.CheckChatPosition();
		}
		t.Dashboard = tf;
	},

	CheckDashPosition: function () {
		var t = WideScreen;
		var kochead = ById('kochead');
		t.OffsetTop = t.getTop(kochead);
		// adjust left setting for chat
		var Chat = ById('kocmain_bottom').childNodes[1];
		var ChatWidth = 0;
		if (Chat && (Chat.className == 'mod_comm') && (parseIntNan(getStyle(Chat, 'top')) < 0) && GlobalOptions.btChatBeforeDash) {
			ChatWidth = parseIntNan(getStyle(Chat, 'width'));
		}
		// adjust left setting for powerbar
		t.PowerBarWidth = 0;
		var PowerBar = ById('btPowerBar');
		if (PowerBar) {
			t.PowerBarWidth = parseIntNan(getStyle(PowerBar, 'width'));
			PowerBar.style.top = t.OffsetTop + 'px';
		}

		var Dash = ById('btDashboard');
		if (Dash) {
			Dash.style.left = 760 + ChatWidth + t.PowerBarWidth + "px";
			Dash.style.top = t.OffsetTop + 'px';
			if (Options.btFloatingDashboard) {
				Dash.style.display = 'none';
			}
			else {
				Dash.style.display = 'block';
			}
		}

		t.setDialogContainerStyles();
	},

	setPowerBar: function (tf, open) {
		var t = WideScreen;
		if (tf == t.PowerBar && open == t.PowerBarOpen) return;
		var offset = 24;
		var PowerBarLabel = '<br><br><img src="' + WhiteRightArrow + '"><br><br><img src="' + PowerBarText + '"><br><br><img src="' + WhiteRightArrow + '">';
		if (open) {
			if (!GlobalOptions.btFloatingPowerBar) {
				offset = 164;
			}
			PowerBarLabel = '<br><br><img src="' + WhiteLeftArrow + '"><br><br><img src="' + PowerBarText + '"><br><br><img src="' + WhiteLeftArrow + '">';
		}
		if (tf) {
			if (ById("main_engagement_tabs")) ById("main_engagement_tabs").style.left = offset + 'px';

			var kochead = ById('kochead');
			if (!kochead) { setTimeout(function () { t.setPowerBar(tf, open) }, 1000); return; }
			kochead.style.position = 'relative';
			kochead.style.left = offset + 'px';
			t.OffsetTop = t.getTop(kochead);

			var kocmain = ById('kocmain');
			if (!kocmain) { setTimeout(function () { t.setPowerBar(tf, open) }, 1000); return; }

			var oldkm = getAbsoluteOffsets(kocmain);
			kocmain.style.left = offset + 'px';
			var newkm = getAbsoluteOffsets(kocmain);
			var widgetshift = newkm.left - oldkm.left;

			t.setDialogContainerStyles();

			// keep ne0's widgets in line with kocmain movement

			if (ById("tr_guardBox")) {
				var newgpos = ById("tr_guardBox").offsetLeft + widgetshift;
				ById("tr_guardBox").style.left = newgpos + 'px';
			}
			if (ById("tr_presetBox")) {
				var newtpos = ById("tr_presetBox").offsetLeft + widgetshift;
				ById("tr_presetBox").style.left = newtpos + 'px';
			}

			var GameHeight = parseInt(kochead.offsetHeight) + parseInt(kocmain.offsetHeight);

			var PowerBar = ById('btPowerBar');
			if (PowerBar) {
				PowerBar.style.width = offset + 'px';
				ById('btPowerBarLabel').innerHTML = PowerBarLabel;
			}
			else {
				var PowerBar = document.createElement('div');
				PowerBar.id = 'btPowerBar';
				PowerBar.style.position = 'absolute';
				PowerBar.style.width = offset + 'px';
				PowerBar.style.top = t.OffsetTop + 'px';
				PowerBar.style.height = GameHeight + 'px';
				PowerBar.style.zIndex = '100411';
				ById('kocContainer').appendChild(PowerBar);

				var m = '<table cellspacing=0 cellpadding=0><tr><td id=btPowerBarButtons class="divHide" style="background-color:#000;" valign=top>&nbsp;</td><td id=btPowerBarOpener valign=middle style="background:none;border:none;vertical-align:top;"><a><div id=btPowerBarLabel class="btExpander buttonv2 blue" style="width:20px;height:' + GameHeight + 'px;">&nbsp;</div></a></td></tr></table>';
				PowerBar.innerHTML = m;
				ById('btPowerBarLabel').innerHTML = PowerBarLabel;
				ById('btPowerBarOpener').addEventListener('click', t.e_TogglePowerBar, false);
				ById('btPowerBarOpener').addEventListener('mousedown', mouseMainTab, false);
			}
			if (open) jQuery('#btPowerBarButtons').removeClass("divHide");
			else jQuery('#btPowerBarButtons').addClass("divHide");
		}
		t.CheckDashPosition();
		t.CheckChatPosition();
		t.PowerBar = tf;
		t.PowerBarOpen = open;
	},

	e_TogglePowerBar: function () {
		var t = WideScreen;
		GlobalOptions.btPowerBarOpen = !GlobalOptions.btPowerBarOpen;
		saveGlobalOptions();
		t.setPowerBar(true, GlobalOptions.btPowerBarOpen);
	},

	getTop: function (elm) {
		var y = 0;
		y = elm.offsetTop;
		elm = elm.offsetParent;
		while (elm != null) {
			y = parseInt(y) + parseInt(elm.offsetTop);
			elm = elm.offsetParent;
		}
		return y;
	},

	ShowDashboard: function (tf) {
		Options.btDashboard = tf;
		saveOptions();
		WideScreen.setDashboard(tf);
	},

	setDialogContainerStyles: function () {
		var t = WideScreen;
		GM_addStyle('.modalCurtain {left:' + t.PowerBarWidth + 'px !important;top:' + t.OffsetTop + 'px !important;width:768px !important}');
		GM_addStyle('.curtainMM{left:' + t.PowerBarWidth + 'px !important;top:' + t.OffsetTop + 'px !important;width:768px !important}');
		GM_addStyle('.dialogContainer {left:' + t.PowerBarWidth + 'px !important;top:' + t.OffsetTop + 'px !important;width:768px !important}');
		GM_addStyle('.notificationMessageDialog {margin-top:60px !important}');
		GM_addStyle('div.largeModal {left:' + (27 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('div.xLargeModal {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (60 + t.OffsetTop) + 'px !important}');
		GM_addStyle('div.mediumModal {left:' + (120 + t.PowerBarWidth) + 'px !important;top:' + (60 + t.OffsetTop) + 'px !important}');
		GM_addStyle('div.smallModal {left:' + (200 + t.PowerBarWidth) + 'px !important;top:' + (190 + t.OffsetTop) + 'px !important}');
		GM_addStyle('div.newGame {left:' + (7 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.animatedChestModal {left:' + (85 + t.PowerBarWidth) + 'px !important;top:' + (100 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.guardianModal {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (200 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.choose_modal {left:' + (55 + t.PowerBarWidth) + 'px !important;top:' + (110 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.guardian_item {left:' + (225 + t.PowerBarWidth) + 'px !important;top:' + (155 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.nomadModal {left:' + (40 + t.PowerBarWidth) + 'px !important;top:' + (40 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.alliance_patch {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (t.OffsetTop) + 'px !important;}');
		GM_addStyle('.alliance_layover {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (127 + t.OffsetTop) + 'px !important;}');
		GM_addStyle('.alliance_layover_stats {left:' + (187 + t.PowerBarWidth) + 'px !important;top:' + (102 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.chancellorModal {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.mine_view {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.vaultModal {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('div.templeModal.cmModal1 {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.claimgiftWhFb {left:' + (5 + t.PowerBarWidth) + 'px !important;top:' + (5 + t.OffsetTop) + 'px !important}');
		GM_addStyle('.Champion .champItemHover {margin-top:-' + (4 + t.OffsetTop) + 'px !important}');
	},
}
