/** Search Tab **/

Tabs.Search = {
	tabOrder: 1020,
	tabLabel: 'Search',
	myDiv: null,
	MapAjax: new CMapAjax(),
	MAX_SHOW_WHILE_RUNNING: 500,
	PANEL_HEIGHT: 500,
	FilterShow: true,
	BlockList: [],
	Blocks: [],
	SearchList: [],
	Rankings: [],
	mapDat: [],
	dat: [],
	KMData: [],
	OldMists: [],
	opt: {},
	ModelCity: null,
	ModelCityId: 0,
	searchRunning: false,
	blocksTotal: 0,
	blocksSearched: 0,
	tilesFound: 0,
	firstX: 0,
	firstY: 0,
	lastX: 0,
	lastY: 0,
	LastSearch: {},
	QSMarching: {},
	QAMarching: {},
	ReqSent: {},
	mists: 0,
	scouted: 0,
	SearchTimer: null,
	LoopCounter: 1,

	Options: {
		SearchType: 0, // 0 - city, 1 - barb camp, 2 - wild, 3 - dark forest, 4 - merc camp, 5 - nomad camp, 6 - alliance HQ - anything greater than 1, treat like wild!
		SearchShape: 0, // 0 - square, 1 - circle
		MinLevel: 1,
		MaxLevel: 10,
		WildType: 1, // 0 - bog, 1 - grassland/lake, 2 - forest, 3 - hill, 4 - mountain, 5 - plain, 99 - all
		Unowned: true,
		Misted: true,
		OldMists: true,
		NewMists: true,
		Hostile: true,
		Friendly: true, // and own alliance
		Neutral: true,
		Unallied: true,
		MinMight: '',
		MaxMight: '',
		Rank: '',
		RankType: '',
		AllianceName: '',
		PlayerName: '',
		sortColNum: 2,
		sortDir: 1,
	},

	// t.mapDat
	// 0 - map[k].xCoord
	// 1 - map[k].yCoord
	// 2 - distance
	// 3 - map[k].tileType
	// 4 - map[k].tileLevel
	// 5 - map[k].tileCityId
	// 6 - uid
	// 7 - map[k].cityName
	// 8 - name
	// 9 - might
	// 10 - alliance
	// 11 - aid
	// 12 - Online
	// 13 - misted
	// 14 - map[k].isPrestige
	// 15 - map[k].prestigeLevel
	// 16 - map[k].prestigeType
	// 17 - map[k].tileId
	// 18 - map[k].tileProvinceId
	// 19 - Defending
	// 20 - map[k].premiumTile
	// 21 - map[k].allianceHq.hqId
	//
	// t.dat = filtered subset of above

	init: function (div) {
		var t = Tabs.Search;
		t.myDiv = div;

		if (!Options.SearchOptions) {
			Options.SearchOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.SearchOptions.hasOwnProperty(y)) {
					Options.SearchOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('ptsearchClickSort', Tabs.Search.searchClickSort);
		uWExportFunction('searchquickmarch', Tabs.Search.searchquickmarch);
		uWExportFunction('btShowHQMembers', Tabs.Search.ShowHQMembers);

		var m = '<DIV class=divHeader align="center">' + tx('MAP SEARCH') + '</div>';
		m += '<TABLE width=100% class=xtab><TR style="height:25px;"><td colspan=2>';
		if (ArcanaEnabled()) {
			m += '<a class=xlink id=pbSearchAura>&nbsp;' + tx('Search HQ Arcane Aura') + '</a>';
		}
		m += '</td><td colspan=2 align=right id=pbsavedsearch>&nbsp;</td></tr><tr><TD align=right width=20%>' + tx('Search Coords') + ':&nbsp;</td><TD colspan=3>X:&nbsp;<INPUT id=pbSearchX type=text\> &nbsp;Y:&nbsp;<INPUT id=pbSearchY type=text\>';
		m += '&nbsp;&nbsp;' + tx("Radius") + ':&nbsp;<INPUT id=pbSearchDist size=3 value=10 />';
		m += '&nbsp;&nbsp;<SPAN id=pbSearchCitySpan></span></td></tr>';
		m += '<TR><TD align=right>' + tx('Or Search') + ':&nbsp;</td><TD colspan=2><select id="pbSearchProvince"><option value=0>-- ' + uW.g_js_strings.commonstr.province + ' --</option>';
		for (var i in Provinces) {
			m += '<option value="' + i + '">' + uW.provincenames[i] + '</option>';
		}
		m += '</select>&nbsp;' + tx('Divide into') + ':&nbsp;' + htmlSelector({ 1: '1', 4: '4', 9: '9', 16: '16', 25: '25', 36: '36', 49: '49', 64: '64' }, 1, 'id=pbProvinceSlices') + '&nbsp;' + tx('squares') + '.&nbsp;&nbsp;&nbsp;' + tx('Your Square') + ':&nbsp;<select id="pbProvinceSlice"><option value=1 selected>1</option></select>&nbsp;' + tx('Detect new mists') + '<INPUT id=pbautoKM type=checkbox />';
		m += '&nbsp;<input style="display:none;" type=button class=btInput id=pbClearMistData value="' + tx('Reset saved mists') + '">';
		m += '</td>';
		m += '<td align=left width=30%><a id=pbSearchSubmit class="inlineButton btButton blue20"><span>' + tx('Start Search') + '</span></a></td></tr>';
		m += '</table>';

		m += '<hr><div id=pbSearchResults style="height:' + t.PANEL_HEIGHT + 'px;">&nbsp;</div><div style="min-height:30px;" align=center id=pbSearchBottom>&nbsp;</div>';

		div.innerHTML = m;
		ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x);

		t.ModelCity = new CdispCityPicker('pbSearchCity', ById('pbSearchCitySpan'), true, t.citySelNotify, null);
		t.ModelCity.bindToXYboxes(ById('pbSearchX'), ById('pbSearchY'));

		ById('pbSearchProvince').addEventListener('click', function () {
			if (this.value != 0) {
				ById('pbSearchX').value = Provinces[this.value].x + 75;
				ById('pbSearchY').value = Provinces[this.value].y + 75;
				ById('pbSearchDist').value = '75';
				t.setSlice();
				Options.SearchOptions.SearchShape = 0; // square
				saveOptions();
			}
		}, false);

		ById('pbProvinceSlice').addEventListener('change', function () {
			t.setSlice();
		}, false);

		ById('pbautoKM').addEventListener('change', function () {
			if (t.mapDat.length != 0) {
				t.setupFilterDisplay();
				if (t.opt.province != 0 && ById('pbautoKM').checked) {
					t.LookupMists(t.opt.province, t.dispMapTable);
				}
				else {
					t.KMData = [];
					t.dispMapTable();
				}
			}
		}, false);


		ById('pbClearMistData').addEventListener('click', function () {
			t.clearoldmists();
		}, false);

		jQuery("#pbProvinceSlices").change(function () {
			var numslices = ById('pbProvinceSlices').value;
			var yourslice = ById('pbProvinceSlice');
			jQuery("#pbProvinceSlice").empty();
			for (var i = 1; i <= numslices; i++) {
				var slOption = document.createElement('option');
				slOption.text = i;
				slOption.value = i;
				yourslice.add(slOption);
			}
			jQuery("#pbProvinceSlice").val(1);
			t.setSlice();
		});

		ById('pbSearchDist').addEventListener('keydown', t.e_coordChange, false);
		ById('pbSearchX').addEventListener('keydown', t.e_coordChange, false);
		ById('pbSearchY').addEventListener('keydown', t.e_coordChange, false);
		ById('pbSearchY').addEventListener('change', t.e_coordChange, false);
		ById('pbSearchY').addEventListener('change', t.e_coordChange, false);
		ById('pbSearchSubmit').addEventListener('click', t.clickedSearch, false);

		if (ById('pbSearchAura')) {
			ById('pbSearchAura').addEventListener('click', t.clickedSearchAura, false);
		}

		setTimeout(function () {
			t.readlastsearch(function () {
				if (t.LastSearch.mapDat && t.LastSearch.mapDat != []) {
					t.displaylastsearch();
				}
			});
		}, 0);

		//		window.addEventListener('unload', t.onUnload, false);
		//		setTimeout (t.readoldmists, 0);
	},

	onUnload: function () {
		var t = Tabs.Search;
		var numRows = t.mapDat.length;
		if (numRows > 0) {
			for (var i = 0; i < numRows; i++) {
				if (t.mapDat[i][13]) {
					if (t.OldMists.indexOf(t.mapDat[i][0] + '_' + t.mapDat[i][1]) == -1) {
						t.OldMists.push(t.mapDat[i][0] + '_' + t.mapDat[i][1]);
					}
				}
			}
		}
		t.saveoldmists();
	},

	EverySecond: function () {
		var t = Tabs.Search;
		t.LoopCounter = t.LoopCounter + 1;
		if (FFVersion.Browser == "Chrome" && (t.LoopCounter % 15 == 0)) {
			t.onUnload();
		}
	},

	searchClickSort: function (e) {
		var t = Tabs.Search;
		var newColNum = e.id.substr(9);
		ById('SearchCol' + Options.SearchOptions.sortColNum).className = 'buttonv2 std blue';
		e.className = 'buttonv2 std green';
		if (newColNum == Options.SearchOptions.sortColNum) { Options.SearchOptions.sortDir *= -1; }
		else { Options.SearchOptions.sortColNum = newColNum; }
		saveOptions();
		t.dispMapTable();
	},

	searchquickmarch: function (x, y) {
		QuickMarch.MapClick(x, y, Cities.byID[Tabs.Search.ModelCityId].idx);
	},

	e_coordChange: function () {
		ById('pbSearchProvince').selectedIndex = 0;
	},

	setSlice: function () {
		var t = Tabs.Search;
		var prov = ById('pbSearchProvince');
		if (prov.value != 0) {
			var numslices = ById('pbProvinceSlices').value;
			if (numslices == 1) {
				ById('pbSearchX').value = Provinces[prov.value].x + 75;
				ById('pbSearchY').value = Provinces[prov.value].y + 75;
				ById('pbSearchDist').value = '75';
				return;
			}
			var yourslice = ById('pbProvinceSlice').value;
			var distance = Math.ceil(75 / Math.sqrt(numslices));
			var originx = Provinces[prov.value].x;
			var originy = Provinces[prov.value].y;
			var limitx = Provinces[prov.value].x + 150;
			var limity = Provinces[prov.value].y + 150;
			var nextx = originx + distance;
			var nexty = originy + distance;
			for (var i = 1; i <= numslices; i++) {
				if (i == yourslice) {
					ById('pbSearchX').value = nextx;
					ById('pbSearchY').value = nexty;
					ById('pbSearchDist').value = distance;
					return;
				}
				nextx = nextx + (distance * 2);
				if (nextx > limitx) {
					nextx = originx + distance;
					nexty = nexty + (distance * 2);
					if (nexty > limity) return; // ffs I dunno
				}
			}
		}
	},

	citySelNotify: function (city, x, y) {
		var t = Tabs.Search;
		if (city) {
			t.ModelCityId = city.id;
		}
	},

	saveoldmists: function () {
		var t = Tabs.Search;
		var serverID = getServerId();
		setTimeout(function () { GM_setValue('OldMists_' + serverID + '_' + uW.tvuid, JSON2.stringify(t.OldMists)); }, 0); // get around GM_SetValue uW error
	},

	readoldmists: function (notify) {
		var t = Tabs.Search;
		var serverID = getServerId();
		var l = JSON2.parse(GM_getValue('OldMists_' + getServerId() + '_' + uW.tvuid, '[]'));
		if (matTypeof(l) == 'array') { t.OldMists = l; }
		if (notify) { notify(); }
	},

	clearoldmists: function () {
		var t = Tabs.Search;
		t.OldMists = [];
		t.saveoldmists();
	},

	savelastsearch: function () {
		var t = Tabs.Search;
		var serverID = getServerId();
		setTimeout(function () { GM_setValue('LastSearch_' + serverID + '_' + uW.tvuid, JSON2.stringify(t.LastSearch)); }, 0); // get around GM_SetValue uW error
	},

	readlastsearch: function (notify) {
		var t = Tabs.Search;
		var serverID = getServerId();
		s = GM_getValue('LastSearch_' + serverID + '_' + uW.tvuid);
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts)
				t.LastSearch[k] = opts[k];
		}
		if (notify) { notify(); }
	},

	clearlastsearch: function () {
		var t = Tabs.Search;
		ById('pbsavedsearch').innerHTML = "&nbsp;";
		t.LastSearch = {};
		t.savelastsearch();
	},

	showlastsearch: function () {
		var t = Tabs.Search;
		if (t.searchRunning) {
			t.stopSearch(tx('Search Cancelled!'));
		}

		ById('pbSearchX').value = t.LastSearch.opt.startX;
		ById('pbSearchY').value = t.LastSearch.opt.startY;
		ById('pbSearchDist').value = t.LastSearch.opt.maxDistance;
		ById('pbSearchProvince').value = t.LastSearch.opt.province;
		ById('pbProvinceSlice').value = t.LastSearch.opt.provinceSlice;
		ById('pbProvinceSlices').value = t.LastSearch.opt.provinceSlices;

		t.mapDat = t.LastSearch.mapDat.slice();
		t.opt.startX = parseInt(t.LastSearch.opt.startX);
		t.opt.startY = parseInt(t.LastSearch.opt.startY);
		t.opt.maxDistance = parseInt(t.LastSearch.opt.maxDistance);
		t.opt.province = ById('pbSearchProvince').value;
		t.opt.provinceSlice = ById('pbProvinceSlice').value;
		t.opt.provinceSlices = ById('pbProvinceSlices').value;
		t.setupResultsPanel(true);
		t.stopSearch('Previous Search');
	},

	displaylastsearch: function () {
		var t = Tabs.Search;
		n = tx("Previous Search") + ' (' + uW.formatDate(uWCloneInto(new Date(t.LastSearch.time * 1000)), "NNN dd, HH:mm") + ')&nbsp;<INPUT id=pbshowlastsearch class=btInput type=submit value="' + tx('Show') + '"/>&nbsp;<INPUT id=pbclearlastsearch class=btInput type=submit value="' + tx("Clear") + '"/>';
		ById('pbsavedsearch').innerHTML = n;
		ById('pbclearlastsearch').addEventListener('click', t.clearlastsearch, false);
		ById('pbshowlastsearch').addEventListener('click', t.showlastsearch, false);
	},

	clickedSearchAura: function () {
		var t = Tabs.Search;
		if (t.searchRunning) { t.stopSearch(''); }
		ById('pbSearchX').value = Seed.allianceHQ.hq_xcoord;
		ById('pbSearchY').value = Seed.allianceHQ.hq_ycoord;
		ById('pbSearchDist').value = Math.min(parseIntNan(Seed.allianceHQ.arcana[Seed.allianceHQ.buildings[3].buildingLevel].distance), 75);
		saveOptions();
		t.clickedSearch();
	},

	clickedSearch: function () {
		var t = Tabs.Search;

		if (t.searchRunning) {
			t.stopSearch(tx('Search Cancelled!'), true);
			return;
		}


		t.opt.startX = parseInt(ById('pbSearchX').value);
		t.opt.startY = parseInt(ById('pbSearchY').value);
		t.opt.maxDistance = parseInt(ById('pbSearchDist').value);
		t.opt.province = ById('pbSearchProvince').value;
		t.opt.provinceSlice = ById('pbProvinceSlice').value;
		t.opt.provinceSlices = ById('pbProvinceSlices').value;

		errMsg = '';

		if (isNaN(t.opt.startX) || t.opt.startX < 0 || t.opt.startX > 749)
			errMsg = "X " + tx("co-ordinate must be between 0 and 749") + "<BR>";
		if (isNaN(t.opt.startY) || t.opt.startY < 0 || t.opt.startY > 749)
			errMsg += "Y " + tx("co-ordinate must be between 0 and 749") + "<BR>";
		if (isNaN(t.opt.maxDistance) || t.opt.maxDistance < 1 || t.opt.maxDistance > 75)
			errMsg += tx("Radius (distance) must be between") + " 1 " + tx("and") + " 75<BR>";
		if (errMsg != '') {
			ById('pbSearchResults').innerHTML = '<center><FONT COLOR=#800>' + tx("ERROR") + ':</font><BR><BR>' + errMsg + '</center>';
			return;
		}

		t.searchRunning = true;
		ById('pbSearchSubmit').innerHTML = '<span>' + tx('Stop Search') + '</span>';

		t.setupResultsPanel(false);

		if (t.opt.province != 0 && ById('pbautoKM').checked) {
			t.LookupMists(t.opt.province);
		}

		// save any mists in current map array to old mists array, before clearing...

		var numRows = t.mapDat.length;
		if (numRows > 0) {
			for (var i = 0; i < numRows; i++) {
				if (t.mapDat[i][13]) {
					if (t.OldMists.indexOf(t.mapDat[i][0] + '_' + t.mapDat[i][1]) == -1) {
						t.OldMists.push(t.mapDat[i][0] + '_' + t.mapDat[i][1]);
					}
				}
			}
		}
		t.saveoldmists();

		t.mapDat = [];
		t.firstX = t.opt.startX - t.opt.maxDistance;
		t.firstY = t.opt.startY - t.opt.maxDistance;
		if (t.firstX < 0) { t.firstX += 750; }
		if (t.firstY < 0) { t.firstY += 750; }

		t.lastX = t.opt.startX + t.opt.maxDistance;
		t.lastY = t.opt.startY + t.opt.maxDistance;
		if (t.lastX >= 750) { t.lastX -= 750; }
		if (t.lastY >= 750) { t.lastY -= 750; }

		t.BlockList = t.MapAjax.generateBlockList(t.firstX, t.firstY, t.opt.maxDistance);

		t.blocksTotal = t.BlockList.length;
		t.blocksSearched = 0;
		t.tilesFound = 0;

		var counter = t.BlockList.length;
		if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

		var curX = t.firstX;
		var curY = t.firstY;
		ById('pbStatStatus').innerHTML = tx('Searching at ') + curX + ',' + curY;

		t.Blocks = [];
		for (var i = 1; i <= counter; i++) {
			t.Blocks.push(t.BlockList.shift());
			t.blocksSearched++;
		}
		var blockString = t.Blocks.join("%2C");

		t.MapAjax.LookupMap(blockString, function (rslt) { t.eventGetPlayerOnline(blockString, rslt); });
	},

	setupResultsPanel: function (Previous) {
		var t = Tabs.Search;
		if (t.FilterShow) {
			var FilterDisp = '';
			var ResultWidth = GlobalOptions.btWinSize.x - 155;
			var FilterArrow = WhiteLeftArrow;
		}
		else {
			var ResultWidth = GlobalOptions.btWinSize.x - 25;
			var FilterDisp = 'none';
			var FilterArrow = WhiteRightArrow;
		}
		var HEIGHT1 = t.PANEL_HEIGHT - 35;
		var HEIGHT2 = t.PANEL_HEIGHT - 25;
		var HEIGHT3 = t.PANEL_HEIGHT - 20;
		m = '<DIV class=divHeader><TABLE width=100% cellspacing=0><TR><TD class=xtab width=125><DIV id=pbStatSearched></div></td>';
		m += '<TD class=xtab align=center><SPAN style="white-space:normal" id=pbStatStatus></span></td>';
		m += '<TD class=xtab align=right width=125><DIV id=pbStatFound></div></td></tr></table></div>';
		m += '<TABLE class=xtab style="width:100%" cellpadding=0 cellspacing=0 align=left><TR valign=top>';
		m += '<TD id=pbSearchFilterContainer style="padding-right:5px;width:130px;height:' + HEIGHT1 + 'px;padding:5px;border:1px solid;display:' + FilterDisp + '"><DIV id=pbSearchFilters></div></td>';
		m += '<td id=pbSearchOpener valign=middle style="padding-right:5px;width:20px;background:none;border:none;height:' + HEIGHT2 + 'px;"><a><div class="btExpander buttonv2 blue" style="width:20px;height:' + HEIGHT2 + 'px;"><span style="display:inline-block;height:100%;vertical-align:middle;"></span><img id=pbSearchOpenerImage style="margin-left:-4px;vertical-align:middle;" height="10" src="' + FilterArrow + '"></div></a></td>';
		m += '<TD class=xtab style="padding-right:0px;"><DIV id=pbResultsPanel style="max-width:' + ResultWidth + 'px;overflow-x:auto;height:' + HEIGHT3 + 'px; max-height:' + HEIGHT3 + 'px; overflow-y:scroll;">&nbsp;</div></td>';
		m += '</tr></table>';

		ById('pbSearchResults').innerHTML = m;
		ById('pbSearchOpener').addEventListener('click', t.ToggleSearchFilters, false);

		/* paint filter panel */

		m = '<table cellpadding=0 cellspacing=0 class=xtab style="padding-right:0px;" width=100%><tr><td colspan=2 style="padding-right:0px;" align=center><div class=divHeader>' + tx('Filters') + '</div>';
		m += '</td></tr>';
		m += '<tr><td colspan=2 align=center style="padding-top:5px;">' + tx('Search Type') + ':</td></tr>';
		m += '<tr><td colspan=2 align=center>' + htmlSelector({ 0: tx("Cities"), 1: tx("Barb Camps"), 2: tx("Wilds"), 3: tx("Dark Forests"), 6: tx("Alliance HQ"), 4: tx("Mercenary Camps"), 5: tx("Nomad Camps"), 7: tx("Runic Megaliths") }, Options.SearchOptions.SearchType, 'id=pbSearchType class=btInput') + '</td></tr>';
		m += '<tr id=pbswild1><td colspan=2 align=center style="padding-top:5px;">' + tx('Wild Type') + ':</td></tr>';
		m += '<tr id=pbswild2><td colspan=2 align=center>' + htmlSelector({ 0: tx("Bogs"), 1: tx("Grassland/Lakes"), 2: tx("Woods"), 3: tx("Hills"), 4: tx("Mountains"), 5: tx("Plains"), 99: tx("ALL") }, Options.SearchOptions.WildType, 'id=pbSearchWildType class=btInput') + '</td></tr>';
		m += '<tr id=pbslevel1><td colspan=2 align=center style="padding-top:5px;">' + tx('Tile Levels') + ':</td></tr>';
		m += '<tr id=pbslevel2><td colspan=2 align=center><INPUT id=pbSearchMinLevel class=btInput size=2 value=' + Options.SearchOptions.MinLevel + '>&nbsp;-&nbsp;<INPUT id=pbSearchMaxLevel class=btInput size=2 value=' + Options.SearchOptions.MaxLevel + '></td></tr>';
		m += '<tr id=pbsplayerchecks><td colspan=2><table class=xtab align=center>';
		m += '<tr id=pbsunowned><td><INPUT id=pbSearchUnowned type=checkbox ' + (Options.SearchOptions.Unowned ? 'CHECKED' : '') + '/>' + tx('Unowned') + '</td></tr>';
		m += '<tr id=pbsmisted><td><INPUT id=pbSearchMisted type=checkbox ' + (Options.SearchOptions.Misted ? 'CHECKED' : '') + '/>' + tx('Misted') + '</td></tr>';
		m += '<tr id=pbsmisted1><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=pbSearchOldMists type=checkbox ' + (Options.SearchOptions.OldMists ? 'CHECKED' : '') + '/>' + tx('Old') + '</td></tr>';
		m += '<tr id=pbsmisted2><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<INPUT id=pbSearchNewMists type=checkbox ' + (Options.SearchOptions.NewMists ? 'CHECKED' : '') + '/>' + tx('New') + '</td></tr>';
		m += '<tr id=pbsfriendly><td><INPUT id=pbSearchFriendly type=checkbox ' + (Options.SearchOptions.Friendly ? 'CHECKED' : '') + '/>' + tx('Friendly') + '</td></tr>';
		m += '<tr id=pbshostile><td><INPUT id=pbSearchHostile type=checkbox ' + (Options.SearchOptions.Hostile ? 'CHECKED' : '') + '/>' + tx('Hostile') + '</td></tr>';
		m += '<tr id=pbsneutral><td><INPUT id=pbSearchNeutral type=checkbox ' + (Options.SearchOptions.Neutral ? 'CHECKED' : '') + '/>' + tx('Neutral') + '</td></tr>';
		m += '<tr id=pbsunallied><td><INPUT id=pbSearchUnallied type=checkbox ' + (Options.SearchOptions.Unallied ? 'CHECKED' : '') + '/>' + tx('Unallied') + '</td></tr>';
		m += '</table></td></tr>';
		m += '<tr id=pbsmight1><td colspan=2 align=center style="padding-top:5px;">' + tx('Might (Billion)') + ':</td></tr>';
		m += '<tr id=pbsmight2><td colspan=2 align=center><INPUT id=pbSearchMinMight class=btInput size=3 value=' + Options.SearchOptions.MinMight + '>&nbsp;-&nbsp;<INPUT id=pbSearchMaxMight class=btInput size=3 value=' + Options.SearchOptions.MaxMight + '></td></tr>';
		m += '<tr id=pbsrank1><td colspan=2 align=center style="padding-top:5px;">' + tx('Alliance Rank') + ':</td></tr>';
		m += '<tr id=pbsrank2><td colspan=2 align=center><INPUT id=pbSearchRank class=btInput size=3 value=' + Options.SearchOptions.Rank + '>&nbsp;' + htmlSelector({ 0: tx("and Above"), 1: tx("and Below") }, Options.SearchOptions.RankType, 'id=pbSearchRankType class=btInput') + '</td></tr>';
		m += '<tr id=pbsaname1><td colspan=2 align=center style="padding-top:5px;">' + tx('Alliance Name') + ':</td></tr>';
		m += '<tr id=pbsaname2><td colspan=2 align=center><INPUT id=pbSearchAllName class=btInput size=8 value=' + Options.SearchOptions.AllianceName + '></td></tr>';
		m += '<tr id=pbspname1><td colspan=2 align=center style="padding-top:5px;">' + tx('Player Name') + ':</td></tr>';
		m += '<tr id=pbspname2><td colspan=2 align=center><INPUT id=pbSearchPlayerName class=btInput size=8 value=' + Options.SearchOptions.PlayerName + '></td></tr>';
		m += '<tr><td colspan=2 align=center style="padding-top:5px;">' + tx('Search Shape') + ':</td></tr>';
		m += '<tr><td colspan=2 align=center>' + htmlSelector({ 0: tx("Square"), 1: tx("Circle") }, Options.SearchOptions.SearchShape, 'id=pbSearchShape class=btInput') + '</td></tr>';
		m += '</table>';
		ById('pbSearchFilters').innerHTML = m;

		m = '<TABLE class=xtab style="width:100%" cellpadding=0 cellspacing=0 align=left><TR valign=top><td style="padding-left:5px;padding-top:5px;padding-right:5px;width:155px;" align=left><div id=pbautoqsdiv>' + tx("Auto-QuickScout Mists") + '<INPUT type=checkbox id=pbAutoQS></div></td><td align=left id=pbSearchMessages>&nbsp;</td></tr></table>';
		ById('pbSearchBottom').innerHTML = m;
		ById('pbAutoQS').addEventListener('change', function () { t.dispMapTable(); }, false); // triggers autoQS

		t.setupFilterDisplay();

		ById('pbSearchType').addEventListener('change', function (e) {
			Options.SearchOptions.SearchType = e.target.value;
			saveOptions();
			t.setupFilterDisplay();
			t.dispMapTable();
		}, false);

		ChangeOption('SearchOptions', 'pbSearchWildType', 'WildType', t.dispMapTable);
		ChangeOption('SearchOptions', 'pbSearchShape', 'SearchShape', t.dispMapTable);

		ById('pbSearchMinLevel').addEventListener('change', t.MinLevelChange, false);
		ById('pbSearchMinLevel').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.MinLevelChange); }, false);

		ById('pbSearchMaxLevel').addEventListener('change', t.MaxLevelChange, false);
		ById('pbSearchMaxLevel').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.MaxLevelChange); }, false);

		ById('pbSearchMinMight').addEventListener('change', t.MinMightChange, false);
		ById('pbSearchMinMight').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.MinMightChange); }, false);

		ById('pbSearchMaxMight').addEventListener('change', t.MaxMightChange, false);
		ById('pbSearchMaxMight').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.MaxMightChange); }, false);

		ById('pbSearchRank').addEventListener('change', t.SearchRankChange, false);
		ById('pbSearchRank').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.SearchRankChange); }, false);

		ById('pbSearchRankType').addEventListener('change', function (e) {
			Options.SearchOptions.RankType = e.target.value;
			saveOptions();
			t.AllianceRankings(Options.SearchOptions.Rank, Options.SearchOptions.RankType, function (e) {
				t.Rankings = e;
				t.dispMapTable();
			});
		}, false);

		ById('pbSearchAllName').addEventListener('change', t.SearchAllNameChange, false);
		ById('pbSearchAllName').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.SearchAllNameChange); }, false);

		ById('pbSearchPlayerName').addEventListener('change', t.SearchPlayerNameChange, false);
		ById('pbSearchPlayerName').addEventListener('keyup', function (e) { StartKeyTimer(e.target, t.SearchPlayerNameChange); }, false);

		ToggleOption('SearchOptions', 'pbSearchUnowned', 'Unowned', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchMisted', 'Misted', function () { t.setupFilterDisplay(); t.dispMapTable(); });
		ToggleOption('SearchOptions', 'pbSearchOldMists', 'OldMists', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchNewMists', 'NewMists', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchFriendly', 'Friendly', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchHostile', 'Hostile', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchNeutral', 'Neutral', t.dispMapTable);
		ToggleOption('SearchOptions', 'pbSearchUnallied', 'Unallied', t.dispMapTable);

		if (parseIntNan(Options.SearchOptions.Rank) != 0) {
			t.AllianceRankings(Options.SearchOptions.Rank, Options.SearchOptions.RankType, function (e) {
				t.Rankings = e;
				if (!t.searchRunning) { t.dispMapTable(); }
			});
		}
	},

	MinLevelChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchMinLevel');
		if (isNaN(e.value)) { e.value = ''; }
		Options.SearchOptions.MinLevel = e.value;
		saveOptions();
		t.dispMapTable();
	},

	MaxLevelChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchMaxLevel');
		if (isNaN(e.value)) { e.value = ''; }
		Options.SearchOptions.MaxLevel = e.value;
		saveOptions();
		t.dispMapTable();
	},

	MinMightChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchMinMight');
		if (isNaN(e.value)) { e.value = ''; }
		Options.SearchOptions.MinMight = e.value;
		saveOptions();
		t.dispMapTable();
	},

	MaxMightChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchMaxMight');
		if (isNaN(e.value)) { e.value = ''; }
		Options.SearchOptions.MaxMight = e.value;
		saveOptions();
		t.dispMapTable();
	},

	SearchRankChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchRank');
		if (isNaN(e.value)) { e.value = ''; }
		if (e.value > 50) { e.value = 50; }
		Options.SearchOptions.Rank = e.value;
		saveOptions();
		t.AllianceRankings(Options.SearchOptions.Rank, Options.SearchOptions.RankType, function (e) {
			t.Rankings = e;
			t.dispMapTable();
		});
	},

	SearchAllNameChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchAllName');
		Options.SearchOptions.AllianceName = e.value;
		saveOptions();
		t.dispMapTable();
	},

	SearchPlayerNameChange: function () {
		var t = Tabs.Search;
		if (KeyTimer) { clearTimeout(KeyTimer); }
		var e = ById('pbSearchPlayerName');
		Options.SearchOptions.PlayerName = e.value;
		saveOptions();
		t.dispMapTable();
	},

	setupFilterDisplay: function () {
		var t = Tabs.Search;

		var stype = Options.SearchOptions.SearchType;

		if (stype == 2) {
			jQuery('#pbswild1').removeClass('divHide');
			jQuery('#pbswild2').removeClass('divHide');
			jQuery('#pbsunowned').removeClass('divHide');
		}
		else {
			jQuery('#pbswild1').addClass('divHide');
			jQuery('#pbswild2').addClass('divHide');
			jQuery('#pbsunowned').addClass('divHide');
		}

		if (stype != 0 && stype != 6) {
			jQuery('#pbslevel1').removeClass('divHide');
			jQuery('#pbslevel2').removeClass('divHide');
		}
		else {
			jQuery('#pbslevel1').addClass('divHide');
			jQuery('#pbslevel2').addClass('divHide');
		}

		if (stype != 0) {
			if (ById('pbHighDefenders')) ById('pbHighDefenders').style.display = 'none';
		}
		else {
			if (ById('pbHighDefenders')) ById('pbHighDefenders').style.display = '';
		}

		if (stype == 0 || stype == 2 || stype == 6) {
			jQuery('#pbsplayerchecks').removeClass('divHide');
			jQuery('#pbsrank1').removeClass('divHide');
			jQuery('#pbsrank2').removeClass('divHide');
			jQuery('#pbsaname1').removeClass('divHide');
			jQuery('#pbsaname2').removeClass('divHide');
			if (stype == 6) {
				jQuery('#pbsmight1').addClass('divHide');
				jQuery('#pbsmight2').addClass('divHide');
				jQuery('#pbspname1').addClass('divHide');
				jQuery('#pbspname2').addClass('divHide');
				jQuery('#pbautoqsdiv').addClass('divHide');
			} else {
				jQuery('#pbspname1').removeClass('divHide');
				jQuery('#pbspname2').removeClass('divHide');
				jQuery('#pbsmight1').removeClass('divHide');
				jQuery('#pbsmight2').removeClass('divHide');
				jQuery('#pbautoqsdiv').removeClass('divHide');
			}
		}
		else {
			jQuery('#pbsplayerchecks').addClass('divHide');
			jQuery('#pbsrank1').addClass('divHide');
			jQuery('#pbsrank2').addClass('divHide');
			jQuery('#pbsaname1').addClass('divHide');
			jQuery('#pbsaname2').addClass('divHide');
			jQuery('#pbsmight1').addClass('divHide');
			jQuery('#pbsmight2').addClass('divHide');
			jQuery('#pbspname1').addClass('divHide');
			jQuery('#pbspname2').addClass('divHide');
			jQuery('#pbautoqsdiv').addClass('divHide');
		}

		if ((stype == 0) && Options.SearchOptions.Misted && ById('pbautoKM').checked) {
			jQuery('#pbsmisted1').removeClass('divHide');
			jQuery('#pbsmisted2').removeClass('divHide');
		}
		else {
			jQuery('#pbsmisted1').addClass('divHide');
			jQuery('#pbsmisted2').addClass('divHide');
		}

		if (stype == 6) {
			jQuery('#pbsmisted').addClass('divHide');
			jQuery('#pbsunallied').addClass('divHide');
		}
		else {
			jQuery('#pbsmisted').removeClass('divHide');
			jQuery('#pbsunallied').removeClass('divHide');
		}

	},

	ToggleSearchFilters: function () {
		var t = Tabs.Search;
		t.FilterShow = !t.FilterShow;
		var div = ById('pbSearchFilterContainer');
		if (div.style.display == 'none') {
			div.style.display = '';
			var ResultWidth = GlobalOptions.btWinSize.x - 155;
			ById('pbSearchOpenerImage').src = WhiteLeftArrow;
		} else {
			div.style.display = 'none';
			var ResultWidth = GlobalOptions.btWinSize.x - 25;
			ById('pbSearchOpenerImage').src = WhiteRightArrow;
		}
		ById('pbResultsPanel').style.maxWidth = ResultWidth + 'px';
	},

	AllianceRankings: function (rank, type, callback, page, prop) {
		var t = Tabs.Search;
		if (parseIntNan(rank) == 0) return;
		var limit = rank - 1;
		if (type == 0) { // above, so include passed rank
			limit = rank;
		}
		if (matTypeof(page) == 'undefined') page = 1;
		if (matTypeof(prop) == 'undefined') prop = [];
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.pageNo = page;
		params.cityId = uW.currentcityid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetOtherInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				var oa = rslt.otherAlliances;
				for (var i = 0; i < oa.length; i++) {
					if (oa[i].ranking <= limit)
						prop.push(oa[i].allianceId)
				}
				if (oa[Number(i - 1)].ranking < limit) {
					page++;
					t.AllianceRankings(rank, type, callback, page, prop);
				} else callback(prop);
			},
		});
	},

	eventGetPlayerOnline: function (blockString, rslt) {
		var t = Tabs.Search;
		if (!t.searchRunning) { return; }
		if (!rslt.ok) {
			if (rslt.BotCode && rslt.BotCode == 999) { // map captcha
				t.stopSearch('<span class=boldRed>' + tx('Server returning "green map". You should stop searching for about 20 minutes - Aborting search :(') + '</span>', true);
				return;
			}
			if (rslt.msg && rslt.msg == "invalid parameters") {
				t.stopSearch('<span class=boldRed>' + tx('Invalid Parameters - Aborting search :(') + '</span>', true);
				return;
			}
			t.SearchTimer = setTimeout(function () { t.MapAjax.LookupMap(blockString, function (rslt) { t.eventGetPlayerOnline(blockString, rslt); }) }, MAP_DELAY); //we need to retry if bad ajax request.
			return;
		}

		var map = rslt.data;
		t.SearchList = rslt;
		var uList = [];
		for (k in map) {
			if (map[k].tileUserId != null) {
				uList.push(map[k].tileUserId);
			}
		}
		getOnline(uList, function (r) { t.mapCallback(r) });
	},

	mapCallback: function (uList) {
		var t = Tabs.Search;

		var rslt = t.SearchList;
		var map = rslt.data;
		var userInfo = rslt.userInfo;
		var alliance = rslt.allianceNames;

		for (var k in map) {
			var xOK = false;
			var yOK = false;
			if (t.firstX < t.lastX) { xOK = (map[k].xCoord >= t.firstX && map[k].xCoord <= t.lastX); }
			else { xOK = (map[k].xCoord >= t.firstX || map[k].xCoord <= t.lastX); } // search over x boundary
			if (t.firstY < t.lastY) { yOK = (map[k].yCoord >= t.firstY && map[k].yCoord <= t.lastY); }
			else { yOK = (map[k].yCoord >= t.firstY || map[k].yCoord <= t.lastY); } // search over y boundary
			var pOK = true;
			if (t.opt.province != 0) {
				pOK = (map[k].tileProvinceId == t.opt.province.split("p")[1]);
			}

			if (xOK && yOK && pOK) {
				var name = '';
				var might = 0;
				var city = ''
				var alli = '';
				var aID = 0;
				var dist = distance(t.opt.startX, t.opt.startY, map[k].xCoord, map[k].yCoord);

				var u = map[k].tileUserId || 0;
				if (u != 0) {
					if (userInfo['u' + u]) {
						name = userInfo['u' + u].n;
						might = parseIntNan(userInfo['u' + u].m);
						city = map[k].cityName || '';
						if (alliance['a' + userInfo['u' + u].a]) {
							alli = alliance['a' + userInfo['u' + u].a];
							aID = userInfo['u' + u].a
						} else {
							alli = '---';
							aID = 0;
						}
					}
					else {
						u = 0;
						if (map[k].tileType == 51) { map[k].tileType = 53; } // assume misted city or plain!
						else { map[k].misted = true; }
					}
				}
				var misted = map[k].misted;
				if (map[k].tileType == 53) { // misted city (or plain)
					misted = true;
				}
				if (map[k].tileType != 51) {
					if (map[k].tileType != 50 || map[k].premiumTile != 1) {
						city = tileTypes[map[k].tileType];
					}
				}
				else {
					if (u == 0 && !misted) {
						city = tx('Barb Camp');
					}
				}

				var hqId = 0;
				if (map[k].allianceHq) {
					if (misted) { // fill in alliance info from HQ fields
						alli = map[k].allianceHq.allianceName;
						aID = map[k].allianceHq.allianceId;
					}
					city = map[k].allianceHq.hqName;
					hqId = map[k].allianceHq.hqId;
				}


				t.mapDat.push([map[k].xCoord, map[k].yCoord, dist, map[k].tileType, parseIntNan(map[k].tileLevel), map[k].tileCityId, u, city, name, might, alli, aID, uList.data[u] ? 1 : 0, misted, map[k].isPrestige, map[k].prestigeLevel, map[k].prestigeType, map[k].tileId, map[k].tileProvinceId, false, map[k].premiumTile, hqId]);
				++t.tilesFound;
			}
		}


		ById('pbStatSearched').innerHTML = tx('Searched: ') + Math.round((t.blocksSearched / t.blocksTotal) * 100) + '%';
		t.dispMapTable();

		var counter = t.BlockList.length;
		if (counter == 0) {
			t.stopSearch(tx('Completed!'), true);
			return;

		}
		if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

		var nextblock = t.BlockList[0];
		var curX = nextblock.split("_")[1];
		var curY = nextblock.split("_")[3];
		ById('pbStatStatus').innerHTML = tx('Searching at ') + curX + ',' + curY;

		t.Blocks = [];
		for (var i = 1; i <= counter; i++) {
			t.Blocks.push(t.BlockList.shift());
			t.blocksSearched++;
		}
		var blockString = t.Blocks.join("%2C");
		t.SearchTimer = setTimeout(function () { t.MapAjax.LookupMap(blockString, function (rslt) { t.eventGetPlayerOnline(blockString, rslt); }) }, MAP_DELAY);
	},

	LookupMists: function (prov, notify) {
		var t = Tabs.Search;
		t.KMData = [];

		if (!KOCMON_ON) return;

		// look up kocmon mists page for province, and build array

		var URL = 'http://www.rycamelot.com/misted/' + getServerId() + '/' + t.opt.province.split("p")[1];
		try {
			GM_xmlhttpRequest({
				method: 'GET',
				url: URL,
				onload: function (xpr) {
					var rslt = null;
					try {
						rslt = xpr.responseText;
					} catch (e) {
						logerr(e);
						if (notify) { notify(); }
						return;
					}

					RegExp.prototype.execAll = function (string) {
						var match = null;
						var matches = new Array();
						while (match = this.exec(string)) {
							var matchArray = [];
							for (var i in match) {
								if (parseInt(i) == i) {
									matchArray.push(match[i]);
								}
							}
							matches.push(matchArray);
						}
						return matches;
					}
					var myregexp = /([1-9]*\,[1-9]*)/g;
					var match = myregexp.execAll(rslt);
					for (var m in match) {
						t.KMData.push(match[m][1].split(",")[0] + '_' + match[m][1].split(",")[1]);
					}
					if (notify) { notify(); }
				},
				onerror: function () {
					if (notify) { notify(); }
				}
			});
		} catch (e) { logerr(e); }
	},

	dispMapTable: function () {
		var t = Tabs.Search;

		function sortFunc(a, b) {
			var t = Tabs.Search;
			if (typeof (a[Options.SearchOptions.sortColNum]) == 'number') {
				if (Options.SearchOptions.sortDir > 0)
					return a[Options.SearchOptions.sortColNum] - b[Options.SearchOptions.sortColNum];
				else
					return b[Options.SearchOptions.sortColNum] - a[Options.SearchOptions.sortColNum];
			} else if (typeof (a[Options.SearchOptions.sortColNum]) == 'boolean') {
				return 0;
			} else {
				if (Options.SearchOptions.sortDir > 0)
					return a[Options.SearchOptions.sortColNum].localeCompare(b[Options.SearchOptions.sortColNum]);
				else
					return b[Options.SearchOptions.sortColNum].localeCompare(a[Options.SearchOptions.sortColNum]);
			}
		}

		t.dat = [];

		for (var i = 0; i < t.mapDat.length; i++) {
			var TileOK = (Options.SearchOptions.SearchShape == 0 || t.mapDat[i][2] <= t.opt.maxDistance); // check distance on circle search

			if (TileOK) { // check type
				if (Options.SearchOptions.SearchType == 0) { // city
					TileOK = ((t.mapDat[i][3] == 51 && t.mapDat[i][5] && t.mapDat[i][5] != 0) || (t.mapDat[i][3] == 53));
				}
				if (Options.SearchOptions.SearchType == 1) { // barb camp
					TileOK = (t.mapDat[i][3] == 51 && (!t.mapDat[i][5] || t.mapDat[i][5] == 0));
				}
				if (Options.SearchOptions.SearchType == 2) { // wilderness
					TileOK = (t.mapDat[i][3] < 50 || (t.mapDat[i][3] == 50 && t.mapDat[i][20] == 0));
				}
				if (Options.SearchOptions.SearchType == 3) { // dark forest
					TileOK = (t.mapDat[i][3] == 54);
				}
				if (Options.SearchOptions.SearchType == 4) { // mercenary camp
					TileOK = (t.mapDat[i][3] == 55);
				}
				if (Options.SearchOptions.SearchType == 5) { // nomad camp
					TileOK = (t.mapDat[i][3] == 56);
				}
				if (Options.SearchOptions.SearchType == 6) { // alliance HQ
					TileOK = (t.mapDat[i][3] == 50 && t.mapDat[i][20] == 1);
				}
				if (Options.SearchOptions.SearchType == 7) { // runic megalith
					TileOK = (t.mapDat[i][3] == 57);
				}
			}


			if (TileOK && Options.SearchOptions.SearchType != 0 && Options.SearchOptions.SearchType != 6) { // check level (not cities or HQ)
				var Level = parseIntNan(t.mapDat[i][4]);
				TileOK = ((Level == 0) || Level >= parseIntNan(Options.SearchOptions.MinLevel) && (Level <= parseIntNan(Options.SearchOptions.MaxLevel) || parseIntNan(Options.SearchOptions.MaxLevel) == 0));
			}


			if (TileOK && Options.SearchOptions.SearchType == 2) {
				var WType = Math.floor(t.mapDat[i][3] / 10);
				TileOK = (WType == Options.SearchOptions.WildType || Options.SearchOptions.WildType == 99); // wild type

				if (TileOK) {
					if (parseIntNan(t.mapDat[i][5]) == 0 && !t.mapDat[i][13]) { // unowned wilds
						TileOK = (Options.SearchOptions.Unowned);
					}
				}
			}


			if (TileOK && (Options.SearchOptions.SearchType == 2 || Options.SearchOptions.SearchType == 0 || Options.SearchOptions.SearchType == 6)) {
				if (t.mapDat[i][13] && Options.SearchOptions.SearchType != 6) {
					TileOK = (Options.SearchOptions.Misted); // misted

					if (TileOK && Options.SearchOptions.SearchType == 0 && ById('pbautoKM').checked) {
						var newmist = true;
						if (newmist && t.KMData.length != 0) {
							newmist = (t.KMData.indexOf(t.mapDat[i][0] + '_' + t.mapDat[i][1]) == -1);
						}
						if (newmist) {
							newmist = (t.OldMists.indexOf(t.mapDat[i][0] + '_' + t.mapDat[i][1]) == -1);
						}
						if (newmist) { TileOK = (Options.SearchOptions.NewMists); }
						else { TileOK = (Options.SearchOptions.OldMists); }
					}
				}
				else {
					if ((parseIntNan(t.mapDat[i][5]) != 0)) { // owned filters
						if (parseIntNan(t.mapDat[i][11]) == 0 && Options.SearchOptions.SearchType != 6) { // unallied
							TileOK = (Options.SearchOptions.Unallied);
						}
						else {
							var dip = getDiplomacy(parseIntNan(t.mapDat[i][11]));
							if (dip == uW.g_js_strings.commonstr.friendly || dip == uW.g_js_strings.commonstr.yours) { // friendly and yours
								TileOK = (Options.SearchOptions.Friendly);
							}
							else {
								if (dip == uW.g_js_strings.commonstr.hostile) { // hostile
									TileOK = (Options.SearchOptions.Hostile);
								}
								else {
									TileOK = (Options.SearchOptions.Neutral); // neutral
								}
							}

							if (TileOK) { // min or max alliance rank
								if (parseIntNan(Options.SearchOptions.Rank) != 0) {
									if (Options.SearchOptions.RankType == 0) {
										TileOK = (t.Rankings.indexOf(parseIntNan(t.mapDat[i][11])) != -1);
									}
									else {
										TileOK = (t.Rankings.indexOf(parseIntNan(t.mapDat[i][11])) == -1);
									}
								}
							}

							if (TileOK) { // include alliance name
								if (Options.SearchOptions.AllianceName && Options.SearchOptions.AllianceName.trim() != '') {
									TileOK = (t.mapDat[i][10].toUpperCase().search(Options.SearchOptions.AllianceName.trim().toUpperCase()) >= 0);
								}
							}
						}

						if (TileOK && Options.SearchOptions.SearchType != 6) { // min/max player might
							var Might = parseIntNan(t.mapDat[i][9]);
							var MinMight = parseIntNan(Options.SearchOptions.MinMight) * 1000000000;
							var MaxMight = parseIntNan(Options.SearchOptions.MaxMight) * 1000000000;
							TileOK = (Might >= MinMight && (Might <= MaxMight || MaxMight == 0));
						}

						if (TileOK && Options.SearchOptions.SearchType != 6) { // include player name
							if (Options.SearchOptions.PlayerName && Options.SearchOptions.PlayerName.trim() != '') {
								TileOK = (t.mapDat[i][8].toUpperCase().search(Options.SearchOptions.PlayerName.trim().toUpperCase()) >= 0);
							}
						}
					}
				}
			}

			if (TileOK) {
				t.dat.push(t.mapDat[i]);
			}
		}

		t.mists = 0;
		t.scouted = 0;

		ById('pbStatFound').innerHTML = tx('Found') + ': ' + t.dat.length;
		var m = '<center><br><br>' + tx('No tiles found matching search criteria') + '</center>';
		if (t.dat.length != 0) {
			t.dat.sort(sortFunc);

			var dis = '';
			if (t.searchRunning) { dis = 'disabled'; }

			var m = '<table align=center width=99% cellspacing=0 cellpadding=0>';
			m += '<TR><td width=30>&nbsp;</td><TD nowrap><A id=SearchCol4 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;' + tx('Lvl') + '&nbsp;</span></a></td>\
				<TD nowrap><a class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="padding-right:10px;vertical-align:middle;display:inline-block;width:100%;"><INPUT id=ToggleSearchScoutCheckbox type=checkbox '+ dis + '></span></a></td>\
				<TD nowrap><A id=SearchCol0 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Co-ords') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=SearchCol2 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Distance') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=SearchCol8 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Player') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=SearchCol7 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('City') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=SearchCol9 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ tx('Might') + '&nbsp;</span></a></td>\
				<TD nowrap><A id=SearchCol10 onclick="ptsearchClickSort(this)" class="buttonv2 std blue" style="padding-left:0px;padding-right:0px;"><span style="display:inline-block;width:100%;">&nbsp;'+ uW.g_js_strings.commonstr.alliance + '&nbsp;</span></a></td>\
				</tr>';

			var numRows = t.dat.length;
			if (numRows > t.MAX_SHOW_WHILE_RUNNING && t.searchRunning) {
				numRows = t.MAX_SHOW_WHILE_RUNNING;
				ById('pbSearchMessages').innerHTML = '<FONT COLOR=#800>' + tx('NOTE: Table only shows ') + t.MAX_SHOW_WHILE_RUNNING + ' of ' + t.dat.length + tx(' results until search is completed') + '.</font>';
			}

			var qsdelay = 0;
			var r = 0;
			var RowId = "";

			for (var i = 0; i < numRows; i++) {
				RowId = 'search_' + t.dat[i][0].toString() + '_' + t.dat[i][1].toString();
				var status = '<img title="Offline" style="vertical-align:bottom" src="' + OFFLINE + '"/>';
				if (t.dat[i][12] == 1) { status = '<img title="Online" style="vertical-align:bottom" src="' + ONLINE + '"/>'; }

				var rowStyle = '';
				var cityname = '';
				var playername = '';
				var might = '';

				var HQ = (t.dat[i][3] == 50 && t.dat[i][20] == 1);

				if (t.dat[i][7]) { cityname = t.dat[i][7]; }
				if (t.dat[i][8]) { playername = t.dat[i][8]; }
				if (cityname == "" && HQ) {
					cityname = tx("Alliance HQ");
					if (trusted) cityname += ' ' + strButton8(uW.g_js_strings.commonstr.members, 'onclick="btShowHQMembers(this,' + t.dat[i][21] + ')"');
				}
				if (playername == "" && HQ) playername = "???";
				if (parseIntNan(t.dat[i][9]) != 0) { might = addCommas(t.dat[i][9]); }

				if (t.dat[i][13] && !HQ) {
					t.mists++;
					if (parseIntNan(t.dat[i][6]) != 0 || playername != '') t.scouted++;
					var newmist = (Options.SearchOptions.SearchType == 0); // cities only!
					if (newmist && t.KMData.length != 0) {
						newmist = (t.KMData.indexOf(t.dat[i][0] + '_' + t.dat[i][1]) == -1);
					}
					if (newmist) {
						newmist = (t.OldMists.indexOf(t.dat[i][0] + '_' + t.dat[i][1]) == -1);
					}
					if (newmist && ById('pbautoKM').checked) {
						rowStyle = 'style="color:#f00;"'; // highlighted
						mistedtext = tx("NEW MIST");
					}
					else {
						rowStyle = 'style="opacity:0.5;"'; // misted
						mistedtext = tx("MISTED");
					}
				}

				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }
				if (t.dat[i][19]) rowClass += ' highRow';

				m += '<TR id="' + RowId + '" class="' + rowClass + '" style="max-height:30px"><TD class=xtab><a id=l_' + t.dat[i][0] + '_t_' + t.dat[i][1] + ' class=divLink onclick="';
				m += 'searchquickmarch(' + t.dat[i][0] + ', ' + t.dat[i][1] + ')';
				m += '">' + TileImage(t.dat[i][3], t.dat[i][4], t.dat[i][5], t.dat[i][16], t.dat[i][15], t.dat[i][20]) + '</a></td>';
				m += '<td class=xtab align=center>' + ((t.dat[i][4] != 0) ? t.dat[i][4] : '??') + '</td>';
				m += '<TD class=xtab align=center style="padding-left:4px;padding-right:0px;"><INPUT id=pbSearchScout_' + t.dat[i][0] + '_' + t.dat[i][1] + ' type=checkbox ' + dis + '></td>';
				m += '<td class=xtab align=center><DIV onclick="btGotoMap(' + t.dat[i][0] + ',' + t.dat[i][1] + ')"><A class=xlink>' + t.dat[i][0] + ',' + t.dat[i][1] + '</a></div></td>';
				m += '<td class=xtab align=right>' + t.dat[i][2] + '</td>';

				if (t.dat[i][13] && !HQ && parseIntNan(t.dat[i][6]) == 0) { // still misted
					if (playername == '') {
						m += '<TD ' + rowStyle + ' class=xtab nowrap colspan=4 id=pbsrch_' + t.dat[i][0] + '_' + t.dat[i][1] + '><center>*** ' + mistedtext + ' ***&nbsp;&nbsp;<SPAN onclick="quickscoutsearch(' + t.dat[i][0] + ',' + t.dat[i][1] + ',' + t.ModelCityId + ');return false;"><A class=xlink>' + tx("QuickScout") + '</a></span></center></td>';
						if (ById('pbAutoQS')) {
							if (ById('pbAutoQS').checked) {
								if (!Tabs.Search.QSMarching[t.dat[i][0] + '_' + t.dat[i][1]] || Tabs.Search.QSMarching[t.dat[i][0] + '_' + t.dat[i][1]] == 0) {
									Tabs.Search.QSMarching[t.dat[i][0] + '_' + t.dat[i][1]] = 1;
									setTimeout(uW.quickscoutsearch, (5000 * qsdelay), t.dat[i][0], t.dat[i][1], t.ModelCityId, true);
									qsdelay = qsdelay + 1;
								}
							}
						}
					}
					else {
						m += '<TD ' + rowStyle + ' class=xtab nowrap colspan=4 id=pbsrch_' + t.dat[i][0] + '_' + t.dat[i][1] + '>' + playername + '</td>'; // messages from quickscout stored in playername
					}
				}
				else {
					m += '<TD ' + rowStyle + ' class=xtab nowrap>' + ((parseIntNan(t.dat[i][6]) != 0) ? status + PlayerLink(t.dat[i][6], playername) : playername) + '</td>';
					m += '<td ' + rowStyle + ' class=xtab>' + cityname + '</td>';
					m += '<td ' + rowStyle + ' class=xtab align=right>' + might + '</td>';
					m += '<td ' + rowStyle + ' class=xtab><span style=' + DiplomacyColours(t.dat[i][11]) + '>' + t.dat[i][10] + '</span></td>';
				}

				m += '</tr>';
			}
			m += '</table>';
		}

		ById('pbResultsPanel').innerHTML = m;
		if (t.dat.length != 0) {
			ById('SearchCol' + Options.SearchOptions.sortColNum).className = 'buttonv2 std green';
			ById('ToggleSearchScoutCheckbox').addEventListener('change', t.doSelectall, false);
		}
		t.updateMistProgress();
	},

	ShowHQMembers: function (elem, hqId) {
		var t = Tabs.Search;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.hqId = hqId;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceHqMineOpen.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var helpText = '<DIV style="max-height:400px; height:400px; overflow-y:auto">';
					helpText += '<br>';
					for (var mem in rslt.collect_status) {
						helpText += MonitorLink(rslt.collect_status[mem].userId, rslt.collect_status[mem].displayName) + '<br>';
					}
					helpText += '</div><br>';

					var off = getOffset(elem);
					var pop = new CPopup('BotHelp', off.left, off.top + 20, 150, 400, true);
					pop.getMainDiv().innerHTML = helpText;
					pop.getTopDiv().innerHTML = '<CENTER><B>' + uW.g_js_strings.commonstr.members + '</b></center>';
					pop.show(true);
					ResetFrameSize('BotHelp', 400, 150);
				}
			},
		}, false);
	},

	updateMistProgress: function () {
		var t = Tabs.Search;
		if (!t.searchRunning) {
			if (t.mists != 0) {
				ById('pbStatSearched').innerHTML = tx('Mists Scouted: ') + t.scouted + '/' + t.mists;
			}
			else {
				ById('pbStatSearched').innerHTML = "";
			}
		}
	},

	doSelectall: function () {
		var t = Tabs.Search;
		var coords = "";
		for (var k = 0; k < t.dat.length; k++) {
			coords = t.dat[k][0] + '_' + t.dat[k][1];
			if (ById('ToggleSearchScoutCheckbox').checked) ById('pbSearchScout_' + coords).checked = true;
			else ById('pbSearchScout_' + coords).checked = false;
		}
	},

	stopSearch: function (msg, savelast) {
		var t = Tabs.Search;

		MAP_DELAY_WATCH = 0;
		clearTimeout(t.SearchTimer);
		t.searchRunning = false;
		ById('pbStatStatus').innerHTML = msg;
		ById('pbSearchSubmit').innerHTML = '<span>' + tx('Start Search') + '</span>';

		if (savelast) {
			t.clearlastsearch();
			t.LastSearch.opt = t.opt;
			t.LastSearch.time = unixTime();
			t.LastSearch.mapDat = t.mapDat.slice();
			t.savelastsearch();
			t.displaylastsearch();
		}

		var m = '<DIV align=right style="max-width:' + Number(GlobalOptions.btWinSize.x - 170) + 'px;overflow-x:auto;">';
		m += strButton20(tx('Highlight Defenders'), 'id=pbHighDefenders') + '&nbsp;';
		m += strButton20(tx('Copy Co-ordinates'), 'id=pbCoordCopy') + '&nbsp;';
		if (Tabs.BulkScout) m += strButton20(tx('Add to Scout List'), 'id=pbScoutExport') + '&nbsp;';
		if (Tabs.BulkAttack) m += strButton20(tx('Add to Attack List'), 'id=pbBulkAttackExport') + '&nbsp;';
		if (Tabs.Attack) m += strButton20(tx('Add to Auto-Attack'), 'id=pbAttackExport') + '&nbsp;';
		if (Options.OneClickAttackPreset != 0) m += strButton20(tx('QuickAttack Selected'), 'id=pbQuickAttackExport') + '&nbsp;';
		m += '&nbsp;</div>&nbsp;';

		ById('pbSearchMessages').innerHTML = m;
		if (ById('pbScoutExport')) ById('pbScoutExport').addEventListener('click', t.ExportScoutList, false);
		if (ById('pbBulkAttackExport')) ById('pbBulkAttackExport').addEventListener('click', t.ExportAttackList, false);
		if (ById('pbAttackExport')) ById('pbAttackExport').addEventListener('click', t.ExportAttack, false);
		if (ById('pbQuickAttackExport')) ById('pbQuickAttackExport').addEventListener('click', t.QuickAttackSelected, false);
		ById('pbCoordCopy').addEventListener('click', t.CopyCoords, false);
		if (ById('pbHighDefenders')) ById('pbHighDefenders').addEventListener('click', t.HighlightDefenders, false);

		if (Options.SearchOptions.SearchType != 0) {
			if (ById('pbHighDefenders')) ById('pbHighDefenders').style.display = 'none';
		}

		t.dispMapTable();
	},

	ExportScoutList: function () {
		var t = Tabs.Search;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkScout.ImportCoords(coordlist.split(" "));
		}
	},

	ExportAttackList: function () {
		var t = Tabs.Search;
		var coordlist = t.getSelected();
		if (coordlist != "") {
			Tabs.BulkAttack.ImportCoords(coordlist.split(" "));
		}
	},

	getSelected: function () {
		var t = Tabs.Search;
		var coordlist = "";
		var coords = "";
		for (var k = 0; k < t.dat.length; k++) {
			coords = t.dat[k][0] + '_' + t.dat[k][1];
			if (ById('pbSearchScout_' + coords).checked) {
				coordlist += t.dat[k][0].toString() + ',' + t.dat[k][1].toString() + ' ';
				ById('pbSearchScout_' + coords).checked = false;
			}
		}
		return coordlist;
	},

	ExportAttack: function () {
		var t = Tabs.Search;

		var sel = false;
		for (var k = 0; k < t.dat.length; k++) {
			coords = t.dat[k][0] + '_' + t.dat[k][1];
			if (ById('pbSearchScout_' + coords).checked) {
				sel = true;
				break;
			}
		}

		if (sel) {
			Tabs.Attack.NewRoute();
			ById('bttcAttack').click();
		}
	},

	QuickAttackSelected: function () {
		var t = Tabs.Search;
		var qadelay = 0;
		var count = 0;
		for (var k = 0; k < t.dat.length; k++) {
			var coords = t.dat[k][0].toString() + '_' + t.dat[k][1].toString();
			var cb = ById('pbSearchScout_' + coords);
			if (cb && cb.checked) {
				if (!t.QAMarching[coords] || t.QAMarching[coords] == 0) {
					t.QAMarching[coords] = 1;
					setTimeout(uW.quickattacksearch, (5000 * qadelay), t.dat[k][0], t.dat[k][1], t.ModelCityId, true);
					qadelay = qadelay + 1;
					count++;
				}
			}
		}
		if (count > 0) {
			ById('pbStatStatus').innerHTML = tx('QuickAttacking') + ': ' + count + ' ' + tx('tiles');
		}
	},

	CopyCoords: function () {
		var t = Tabs.Search;
		var CoordList = [];
		var coords = "";
		for (var k = 0; k < t.dat.length; k++) {
			coords = t.dat[k][0] + '_' + t.dat[k][1];
			if (ById('pbSearchScout_' + coords).checked) {
				CoordList.push('(' + t.dat[k][0].toString() + ',' + t.dat[k][1].toString() + ')');
			}
		}
		if (CoordList.length > 0) {
			window.prompt(tx('Copy to clipboard: Ctrl+C'), CoordList.join(" "));
		}
	},

	HighlightDefenders: function () {
		var t = Tabs.Search;

		var delayer = 0;
		ById('pbHighDefenders').outerHTML = '<span id=pbHighDefendersProg>&nbsp;</span>';

		for (var k = 0; k < t.dat.length; k++) {
			if ((t.dat[k][3] == 51 && t.dat[k][5] && t.dat[k][5] != 0) || (t.dat[k][3] == 53)) {
				if (!t.ReqSent[t.dat[k][0] + '_' + t.dat[k][1]] || t.ReqSent[t.dat[k][0] + '_' + t.dat[k][1]] == 0) {
					t.ReqSent[t.dat[k][0] + '_' + t.dat[k][1]] = 1;
					setTimeout(getDefendStatus, (250 * delayer), t.dat[k][0], t.dat[k][1], false, false, t.UpdateDefendStatus, k, t.dat.length, 'pbHighDefendersProg');
					delayer = delayer + 1;
				}
			}
		}

		function ClearAtEnd() {
			if (ById('pbHighDefendersProg')) {
				ById('pbHighDefendersProg').outerHTML = strButton20(tx('Highlight Defenders'), 'id=pbHighDefenders');
				ById('pbHighDefenders').addEventListener('click', t.HighlightDefenders, false);
			}
		};

		setTimeout(ClearAtEnd, (250 * delayer));
	},

	UpdateDefendStatus: function (rslt, x, y, k) {
		var t = Tabs.Search;
		t.ReqSent[x + '_' + y] = 0;
		var div = ById('search_' + x + '_' + y);
		var coords = t.dat[k][0] + '_' + t.dat[k][1];
		if (rslt.ok && rslt.ok == "true") {
			t.dat[k][19] = true;
			if (div) jQuery(div).addClass("highRow");
			if (ById('pbSearchScout_' + coords)) ById('pbSearchScout_' + coords).checked = true;
		}
		else {
			t.dat[k][19] = false;
			if (div) jQuery(div).removeClass("highRow");
			if (ById('pbSearchScout_' + coords)) ById('pbSearchScout_' + coords).checked = false;
		}
		var numRows = t.mapDat.length;
		for (var i = 0; i < numRows; i++) {
			if (t.mapDat[i][0] == x && t.mapDat[i][1] == y) {
				t.mapDat[i][19] = t.dat[k][19];
			}
		}
	},

	show: function (init) {
		var t = Tabs.Search;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId != DispCityId) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
		}
	},
};
