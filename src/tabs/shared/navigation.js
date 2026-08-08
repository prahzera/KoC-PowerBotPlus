var towho = {
	mmFunc: null,
	init: function () {
		t = towho;

		try {
			t.mmFunc = new CalterUwFunc('cm.messageController.messageWide', [
				[/params\.subject\s*=\s*..".modal_msg_write_subj".\.val.../im, 'params.subject = cm.messageController.escape\(allianceall?"{"+g_js_strings.commonstr.alliance+"} "+document.getElementById(\'modal_msg_write_subj\').value:"{"+g_js_strings.commonstr.officers+"} "+document.getElementById(\'modal_msg_write_subj\').value\);'],
				[/\$\("#modal_msg_write_to/im, 'jQuery("#modal_msg_write_to']
			]);
			t.mmFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	}
}

var PageNavigator = {
	modalMessagesFunc: null,
	ctrlPaginationOld: null,
	loadPage_paginationOld: null,
	cpPager: null,
	init: function () {
		var t = PageNavigator;

		try {
			t.modalMessagesFunc = new CalterUwFunc('modal_messages', [
				[/pageNavigatorModel\s*=.*?;/i, 'var pager=ptPagerHook(0,5);pageNavigatorModel=pager;'],
				[/pageNavigatorView\s*=.*?;/i, 'pageNavigatorView=pager;'],
				[/pageNavigatorController\s*=.*?;/i, 'pageNavigatorController=pager;']
			]);

			uWExportFunction('ptPagerHook', PageNavigator.ConstructCPager);

			t.ctrlPaginationOld = uW.ctrlPagination;
			t.loadPage_paginationOld = uW.loadPage_pagination;
			t.cpPager = new t.Cpager(0, 0);
			t.cpPager.oldStyle = true;

			uWExportFunction("oldctrlPagination", PageNavigator.ctrlPaginationOld);
			uWExportFunction("newctrlPagination", PageNavigator.ctrlPagination);
			uWExportFunction("oldloadPage_pagination", PageNavigator.loadPage_paginationOld);
			uWExportFunction("newloadPage_pagination", PageNavigator.loadPage_pagination);

			t.enable(Options.fixPageNav);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	// called on 'back' ...
	loadPage_pagination: function (divId, currentPage, callbackFunction, totalPages) {
		var t = PageNavigator;
		var curPage = parseInt(currentPage);
		if (divId == t.cpPager.divId) // if 'old' style ...
			uW[callbackFunction](t.cpPager.getCurrentPage());
		else
			uW[callbackFunction](currentPage);
	},
	ctrlPagination: function (navDivId, numPages, notify, curPage) {
		var t = PageNavigator;
		if (ById(navDivId).firstChild == null)
			ById(navDivId).appendChild(t.cpPager.getHtmlElement());
		t.cpPager.setPageCount(numPages);
		t.cpPager.divId = navDivId;
		if (!curPage)
			curPage = 1;
		t.cpPager.gotoPage(curPage);
		t.cpPager.onClick = uW[notify];
		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW, { defineAs: 'cpPager' });
			exportFunction(t.cpPager.getHtmlElement, newobj, { defineAs: 'getHtmlElement' });
			exportFunction(t.cpPager.setPageCount, newobj, { defineAs: 'setPageCount' });
			exportFunction(t.cpPager.getPageCount, newobj, { defineAs: 'getPageCount' });
			exportFunction(t.cpPager.getCurrentPage, newobj, { defineAs: 'getCurrentPage' });
			exportFunction(t.cpPager.gotoPage, newobj, { defineAs: 'gotoPage' });
			exportFunction(t.cpPager.e_but, newobj, { defineAs: 'e_but' });
			exportFunction(t.cpPager.e_inp, newobj, { defineAs: 'e_inp' });
			exportFunction(t.cpPager.onClick, newobj, { defineAs: 'onClick' });

			newobj.numPages = t.cpPager.numPages;
			newobj.curPage = t.cpPager.curPage;
			newobj.oldStyle = t.cpPager.oldStyle;
			newobj.divId = t.cpPager.divId;

			uW.pageNavigatorView = newobj;
		}
		else {
			uW.pageNavigatorView = t.cpPager;
		}
	},
	enable: function (tf) {
		var t = PageNavigator;
		t.modalMessagesFunc.setEnable(tf);
		if (tf) {
			uW.ctrlPagination = uW.newctrlPagination;
			uW.loadPage_pagination = uW.newloadPage_pagination;
		} else {
			uW.ctrlPagination = uW.oldctrlPagination;
			uW.loadPage_pagination = uW.oldloadPage_pagination;
		}
	},
	isAvailable: function () {
		var t = PageNavigator;
		return t.modalMessagesFunc.isAvailable();
	},
	ConstructCPager: function (a, b) {
		var t = PageNavigator;
		var localobj = new t.Cpager(a, b);
		localobj.onClick = function (a) { uW.pageNavigatorController.onClick(a); }

		if (typeof createObjectIn == 'function') {
			var newobj = createObjectIn(uW, { defineAs: 'ptPagerObj' });
			exportFunction(localobj.getHtmlElement, newobj, { defineAs: 'getHtmlElement' });
			exportFunction(localobj.setPageCount, newobj, { defineAs: 'setPageCount' });
			exportFunction(localobj.getPageCount, newobj, { defineAs: 'getPageCount' });
			exportFunction(localobj.getCurrentPage, newobj, { defineAs: 'getCurrentPage' });
			exportFunction(localobj.gotoPage, newobj, { defineAs: 'gotoPage' });
			exportFunction(localobj.e_but, newobj, { defineAs: 'e_but' });
			exportFunction(localobj.e_inp, newobj, { defineAs: 'e_inp' });
			exportFunction(localobj.onClick, newobj, { defineAs: 'onClick' });

			newobj.numPages = t.cpPager.numPages;
			newobj.curPage = t.cpPager.curPage;
			newobj.oldStyle = t.cpPager.oldStyle;

			return newobj;
		}
		else {
			return localobj;
		}
	},
	Cpager: function (a, b) {
		// public function protos ...
		this.getHtmlElement = getHtmlElement;
		this.setPageCount = setPageCount;
		this.getPageCount = getPageCount;
		this.getCurrentPage = getCurrentPage;
		this.gotoPage = gotoPage;
		this.e_but = e_but;
		this.e_inp = e_inp;
		//
		var t = this;
		this.onClick = null;
		this.numPages = b;
		this.curPage = a;
		this.oldStyle = false;

		function getHtmlElement() {
			function aButton(msg, evtPage) {
				return '<A class=ptPageNav onclick="pageNavigatorView.e_but(\'' + evtPage + '\')"><SPAN class=ptPageNav>' + msg + '</span></a>';
			}
			var div = document.createElement('div');
			div.id = 'ptPageNavBar';
			div.innerHTML = '<STYLE>table.ptPageNav tr td {background:inherit; border:none; text-align:center; padding:0px 1px;}\
		span.ptPageNav {font-size:12px; background:inherit; line-height:135%}\
		A.ptPageNav {background-color:#44e; color:#ff4; display:block; border:1px solid #666666; height:18px; width:18px;}\
		A.ptPageNav:hover {background-color:#66f;}\
		A.ptPageNav:active {background-color:#186}\
		</style>\
		<TABLE class=ptPageNav><TR valign=middle>\
		<TD style="margin-right:15px">' + aButton('<SPAN style="padding-left:0.2em;letter-spacing:-0.99em;vertical-align:middle;">&#x258f;&#x258f;</span><span>&#x25c4;</span>', 'F') + '</td>\
		<TD>' + aButton('&#x25c4', '-') + '</td>\
		<TD>' + aButton('&#x25ba', '+') + '</td>\
		<TD style="margin-right:15px">' + aButton('<SPAN style="margin-left:-0.3em;margin-right:-0.2em;">&#x25ba;</SPAN><SPAN style="letter-spacing:-0.99em;vertical-align:middle;">&#x258f;&#x258f;</span>', 'L') + '</td>\
		<TD width=10>&nbsp;</td><TD>'+ tx('Page') + '&nbsp;<INPUT id=ptPagerPageNum onChange="pageNavigatorView.e_inp()" type=text size=1>&nbsp;' + tx('of') + '&nbsp;<span id=ptPagerNumPages>?</span></td>\
		</tr></table>';
			var mml = ById('modal_msg_list');
			if (mml != null)
				mml.style.minHeight = '400px';
			return div;
		}

		function getPageCount() { // koc needs for 'back'
			return t.numPages;
		}

		function getCurrentPage() { // koc needs for 'back'
			return t.curPage;
		}

		function setPageCount(c) {
			t.numPages = c;
			ById('ptPagerNumPages').innerHTML = c;
			var mml = ById('modal_msg_list');
			if (mml != null) {
				if (ById('modal_msg_tabs_report').className.indexOf('selected') >= 0)
					mml.style.minHeight = '460px';
				else
					mml.style.minHeight = '400px';
			}
		}

		function gotoPage(p) {
			t.curPage = parseIntZero(p);
			ById('ptPagerPageNum').value = t.curPage;
		}

		function e_but(p) {
			if (p == 'F' && t.curPage != 1)
				loadPage(1);
			else if (p == '-' && t.curPage > 1)
				loadPage(t.curPage - 1);
			else if (p == '+' && t.curPage < t.numPages)
				loadPage(t.curPage + 1);
			else if (p == 'L' && t.curPage != t.numPages)
				loadPage(t.numPages);

			function loadPage(p) {
				if (t.oldStyle)
					t.gotoPage(p);
				t.onClick(p);
			}
		}

		function e_inp(p) {
			var pageNum = parseIntZero(ById('ptPagerPageNum').value);
			t.onClick(pageNum);
		}
	},
};

var TowerAlerts = {
	viewImpendingFunc: null,
	fixTargetEnabled: false,
	init: function () {
		var t = TowerAlerts;

		try {
			t.viewImpendingFunc = new CalterUwFunc('attack_viewimpending_view', [
				[/Modal.showModal\((.*)\)/im, 'Modal.showModal\($1\); ptViewImpending_hook(a);']
			]);
			uWExportFunction('ptViewImpending_hook', t.viewImpending_hook);
			t.viewImpendingFunc.setEnable(true);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	// fix 'target'
	viewImpending_hook: function (atkinc) {
		var t = TowerAlerts;
		var div = ById('modal_attackimpending_view');
		var isFalse = false;
		if (t.fixTargetEnabled) {
			var city = Cities.byID[atkinc.toCityId];
			var target = '';
			if (!city || (atkinc.marchType != 3 && atkinc.marchType != 4)) {
				target = '<B>' + tx('FALSE REPORT') + '!</b>';
				isFalse = true;
			} else if (city.tileId == atkinc.toTileId) {
				target = city.name + ' (' + city.x + ',' + city.y + ')';
			} else {
				wilds = Seed.wilderness['city' + atkinc.toCityId];
				m = '';
				for (var k in wilds) {
					if (wilds[k].tileId == atkinc.toTileId) {
						m = 'at ' + wilds[k].xCoord + ',' + wilds[k].yCoord;
						break;
					}
				}
				target = city.name + ', <B>' + tx('WILD') + ' ' + m + '</b>';
			}
			div.childNodes[0].innerHTML = '<B>' + tx('Target') + ': </b>' + target;
		}
	},
	enableFixTarget: function (tf) {
		var t = TowerAlerts;
		t.fixTargetEnabled = tf;
	},
	isFixTargetAvailable: function () {
		var t = TowerAlerts;
		return t.viewImpendingFunc.isAvailable();
	},
}

var CoordBox = {
	MapZoom: Boolean,
	init: function () {
		var t = CoordBox;
		uWExportFunction('btToggleMapZoom', CoordBox.ToggleMapZoom);
		t.MapZoom = false;
		t.boxDiv = searchDOM(ById('maparea_map'), 'node.className=="mod_coord"', 3, false);
		t.boxDiv.id = 'btCoordsBox';
		t.setEnable(Options.mapCoordsTop);

		var newdiv = document.createElement('div');
		newdiv.id = 'btZoom';
		newdiv.innerHTML = '<div style="text-align:center;font-size:11px"><a id=btZoomLink onclick="btToggleMapZoom();">' + tx('Zoom Out') + '</a></div>';
		jQuery("#btCoordsBox > div:first").after(newdiv);
	},
	setEnable: function (tf) {
		var t = CoordBox;
		if (t.boxDiv == null)
			return;
		if (tf)
			t.boxDiv.style.zIndex = '100000';
		else
			t.boxDiv.style.zIndex = '10011';
	},
	isAvailable: function () {
		var t = CoordBox;
		return !(t.boxDiv == null);
	},

	ToggleMapZoom: function () {
		var t = CoordBox;
		t.MapZoom = !t.MapZoom;
		uW.g_mapObject.setCenterSlot();
		if (t.MapZoom) {
			uW.g_mapObject.vpxmultiplier = 30;
			uW.g_mapObject.hpxmultiplier = 50;
			var style = document.createElement('style');
			style.id = 'btMapZoomStyle';
			style.innerHTML = '\
				.map1 .slot {width:50px !important;height:30px !important; background-size:cover !important;}\
				.map1 .slot.PrestigeCity_4, .map1 .slot.PrestigeCity_5, .map1 .slot.PrestigeCity_6 {background-position: -50px 0px !important;}\
				.map1 .slot.PrestigeCity_7, .map1 .slot.PrestigeCity_8, .map1 .slot.PrestigeCity_9, .map1 .slot.PrestigeCity_10, \
				.map1 .slot.PrestigeCity_11, .map1 .slot.PrestigeCity_12, .map1 .slot.PrestigeCity_13, .map1 .slot.PrestigeCity_14, .map1 .slot.PrestigeCity_15 {background-position: -100px 0px !important;}\
				.map1 .slot.shield span {left:-18px !important; top:-6px !important; background-size:15% !important;}\
				.map1 .slot.sword span {left:-18px !important; top:-6px !important; background-size:15% !important;}\
				.map1 .slot.mapcastle span {width:16px !important; height:16px !important; left:20px !important; padding-top:5px !important; font-size:7px !important; background-size:16px !important;}';

			ById('btZoom').appendChild(style);
			ById('btZoomLink').innerHTML = tx('Zoom In');
		}
		else {
			uW.g_mapObject.vpxmultiplier = 58;
			uW.g_mapObject.hpxmultiplier = 96;
			jQuery('#btMapZoomStyle').remove();
			ById('btZoomLink').innerHTML = tx('Zoom Out');
		}
		uW.g_mapObject.setPosition();
		uW.g_mapObject.getMoreSlots();
	},
};

var cdtd = {
	views: null,
	oldupdate_citylist: null,
	newupdate_citylist: null,
	init: function () {
		var t = cdtd;

		try {
			if (typeof uW.watch == 'function') {
				uW.watch("update_citylist", function (c, a, b) { return b; }); // palemoon 'unwatch' doesn't work
			}
			if (typeof uW.unwatch == 'function') {
				uW.unwatch("update_citylist"); // naughty RockYou!
			}

			uWExportFunction('ptcheckascension', cdtd.checkascension);
			uWExportFunction('ptgetchampstatus', cdtd.getchampstatus);
			uWExportFunction('cdtdhook', cdtd.citychange);

			var z = new CalterUwFunc("showCityTooltip", [
				[/showTooltip/, 'a += "<div>"+g_js_strings.guardian[seed.guardian[j].type+"_fullName"]+"</div><div>" + ptgetchampstatus(seed.cities[j][0])+"</div>";showTooltip'],
				['g_js_strings.showPopTooltip.currpop', 'provincenames[\'p\'+seed.cities[j][4]] + "</div><div>" + ptcheckascension(seed.cities[j][0]) + g_js_strings.showPopTooltip.currpop']
			]);
			z.setEnable(true);

			t.views = new CalterUwFunc("citysel_click", [
				[/cm\.PrestigeCityView\.render\(\)/im, 'cm.PrestigeCityView.render();cdtdhook();']
			]);

			if (Options.EnhCBtns) {
				t.views.setEnable(true);
				t.oldupdate_citylist = uW.update_citylist;
				t.newupdate_citylist = function () {
					cdtd.oldupdate_citylist();
					cdtd.drawdefendstatus();
					if (Options.ColrCityBtns) cdtd.drawfactioncolors();
				};
				uWExportFunction('newupdate_citylist', cdtd.newupdate_citylist);
				uW.update_citylist = uW.newupdate_citylist;
				t.drawdefendstatus();
			};
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	citychange: function () {
		cdtd.drawdefendstatus();
		Tabs.Options.checkAscension(); // ascension expiry tied into enhanced city buttons
	},
	drawdefendstatus: function () {
		var t = cdtd;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			var cityidx = i + 1;
			var city = ById('citysel_' + cityidx);
			if (!city) {
				setTimeout(t.drawdefendstatus, 100);
				return;
			}
			var cityId = uW.seed.cities[i][0];
			var color = 'blue';
			if (uW.seed.citystats['city' + cityId].gate != 0) { color = 'red'; }
			if (Tabs.PortalTime && ((Options.PortOptions.PortCities && Options.PortOptions.PortCities[Cities.byID[cityId].idx + 1] == true) || (Options.PortOptions.PortCity && cityId == Options.PortOptions.PortCity)) && Options.PortOptions.Running) { color = 'cyan'; }
			city.style.color = color;
			city.style.border = '2px inset ' + color;
			city.style.display = 'inline';
			city.style.width = 10 + '%';
			if (Options.DbClkDefBtns && SelectiveDefending) {
				city.ondblclick = function () {
					t.setdefendstatus(this.name);
				};
			}
		}
	},
	setdefendstatus: function (city) {
		var t = cdtd;
		var state = 1;
		if (uW.seed.citystats["city" + city].gate != 0)
			state = 0;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.cid = city;
		params.state = state;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/gate.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					uW.seed.citystats["city" + city].gate = state;
					t.drawdefendstatus();
				}
			},
			onFailure: function () {
				t.drawdefendstatus();
			},
		}, true);
	},

	drawfactioncolors: function () {
		var t = cdtd;
		for (var i = 0; i < uW.seed.cities.length; i++) {
			color = "black";
			var ascended = getAscensionValues(uW.seed.cities[i][0]);
			if (ascended.isPrestigeCity) {
				switch (parseIntNan(ascended.prestigeType)) {
					case 1: color = "#228b22"; break;
					case 2: color = "#A944DB"; break;
					case 3: color = "#E36600"; break;
				}
			}
			ById('mod_citylist').children[i].innerHTML = "<SPAN><FONT fontFamily='georgia,?arial,?sans-serif' font-weight=700 font-size=10px color=" + color + ">" + uW.roman[i] + "</font></span>";
		}
	},
	checkascension: function (id) {
		var str = ""
		var protection = CM.PrestigeCityPlayerProtectionController.isActive(id);
		if (protection) {
			str += "<b>" + tx('Ascension Protection') + ": " + uW.timestr(CM.PrestigeCityPlayerProtectionController.getTimeLeft(id), false) + "</b></div><div>";
		}
		var ascended = getAscensionValues(id);
		var canAscend = true;
		if (ascended.isPrestigeCity) {
			var MaxLevel = CM.PrestigeModel.getLevelCapSoft(ascended.prestigeType);
			canAscend = (MaxLevel > parseIntNan(ascended.prestigeLevel));
		}
		if (Options.BuildOptions && Options.BuildOptions.AscendRunning) {
			if (protection && !canAscend) { str += '<span class=boldRed>' + tx("Maximum Ascension Level") + "!</span></div><div>"; }
			else if (Options.BuildOptions.AscendEnabled[Cities.byID[id].idx + 1]) { str += '<span class=boldMagenta>' + tx("Auto-Ascend Enabled") + "!</span></div><div>"; }
		}
		return str;
	},
	getchampstatus: function (id) {
		var citychamp;
		var ChampText = uW.g_js_strings.champ.no_champ + "!";
		var gotchamp = false;
		citychamp = getCityChampion(id);
		if (citychamp.championId) {
			gotchamp = true;
			var champname = citychamp.name;
			var champstatus = citychamp.status;
			if (champstatus != "10") {
				ChampText = champname + ' (' + tx('Defending') + ')';
			}
			else {
				ChampText = champname + ' (' + tx('Marching') + ')';
			}
		}
		if (gotchamp) {
			return '<table cellspacing=0><tr><td class="xtab"><img height=14 src="' + ChampImagePrefix + citychamp.avatarId + ChampImageSuffix + '"></td><td class=xtab>' + ChampText + '</td></tr></table>';
		}
		else {
			return '<table cellspacing=0><tr><td class="xtab">' + ChampText + '</td></tr></table>';
		}
	},
}
