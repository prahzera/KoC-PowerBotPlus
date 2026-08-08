/** Crafting Tab **/

Tabs.Craft = {
	tabLabel: 'Craft',
	tabOrder: 2020,
	tabColor: 'brown',
	myDiv: null,
	timer: null,
	LoopCounter: 0,
	citydelay: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
	intervalSecs: 5,
	autodelay: 0,
	loopaction: false,
	craftinfo: {},
	spires: [],
	InstantCrafts: {},
	craftingspeed: 0,
	totaether: 0,
	Squire: 0,
	Knight: 0,
	Guinevere: 0,
	Morgana: 0,
	Arthur: 0,
	ItemList: [1, 2, 3, 4, 5],
	ItemTrans: ["SH", "KH", "GH", "MH", "AH"],
	tableau: [],
	EliteRecipes: ['154', '156', '158', '160', '162', '164', '166', '168', '170', '172', '174'],
	TrainingRecipes: ['153', '155', '157', '159', '161', '163', '165', '167', '169', '171', '173'],
	Categories: [1, 3, 8, 9, 10],
	CategoryNames: { 1: "General", 3: "Combat", 8: "Alliance", 9: "Items", 10: "Boxes" },
	Options: {
		Running: false,
		ThroneCheck: false,
		BasicCheck: false,
		CraftingSpeed: 0,
		MinAether: 5000,
		Enabled: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true },
		Preferred: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
		RecipeNumbers: {},
		RecipeFixed: {},
		RecipeStats: {},
		UseAH: false,
		UseMH: false,
		UseGH: false,
		UseKH: false,
		UseSH: false,
		UseOverride: false,
		OverrideItem: 0,
		OverrideHours: 0,
		OverrideMinutes: 1,
		Toggle: false,
	},

	init: function (div) {
		var t = Tabs.Craft;
		t.myDiv = div;

		if (!Options.CraftOptions) {
			Options.CraftOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.CraftOptions.hasOwnProperty(y)) {
					Options.CraftOptions[y] = t.Options[y];
				}
			}
		}

		uWExportFunction('speedupCraft', Tabs.Craft.speedupCraft);

		if (Options.CraftOptions.Toggle) AddSubTabLink('AutoCraft', t.toggleAutoCraftState, 'CraftToggleTab');
		SetToggleButtonState('Craft', Options.CraftOptions.Running, 'Craft');

		for (var i = t.Categories.length - 1; i >= 0; i--) {
			if (!uW.recipelist[t.Categories[i]]) t.Categories.splice(i, 1);
		}
		for (var j in uW.recipelist) {
			for (var i = 0; i < uW.recipelist[j].length; i++) {
				if (parseIntNan(uW.recipelist[j][i].craftable) == 1) {
					var h = parseInt(uW.recipelist[j][i].recipe_id);
					t.craftinfo[h] = {};
					t.craftinfo[h].recipe_id = uW.recipelist[j][i].recipe_id;
					t.craftinfo[h].name = uW.recipelist[j][i].name;
					t.craftinfo[h].category = uW.recipelist[j][i].category;
					t.craftinfo[h].input = uW.recipelist[j][i].input;
					t.craftinfo[h].requirements = uW.recipelist[j][i].requirements;
					t.craftinfo[h].inputItems = uW.recipelist[j][i].input.items;
					t.craftinfo[h].resources = uW.recipelist[j][i].input.resources;
					t.craftinfo[h].odds = uW.recipelist[j][i].failure_chance;
					t.craftinfo[h].dailylimit = uW.recipelist[j][i].daily_limit;
					t.craftinfo[h].lifetimelimit = uW.recipelist[j][i].life_time_limit;
					t.craftinfo[h].output_item_id = uW.recipelist[j][i].output_item_id;
				};
			}
		}

		for (var h in t.craftinfo) { // fix resources array for pre-HQ (remove this later)
			if (t.craftinfo[h].resources[5] == null) {
				t.craftinfo[h].resources[5] = t.craftinfo[h].resources[1];
				t.craftinfo[h].resources[1] = 0;
				t.craftinfo[h].resources[2] = 0;
				t.craftinfo[h].resources[3] = 0;
				t.craftinfo[h].resources[4] = 0;
				t.craftinfo[h].resources[6] = 0;
			}
		}

		for (var h in Options.CraftOptions.RecipeNumbers) {
			if (t.craftinfo[h] == null) {
				delete Options.CraftOptions.RecipeNumbers[h];
				delete Options.CraftOptions.RecipeFixed[h];
				delete Options.CraftOptions.RecipeStats[h];
			}
		}

		for (i = 0; i < Cities.numCities; i++) {
			t.spires.push(getUniqueCityBuilding(Cities.cities[i].id, 20));
		}

		var m = '<DIV class=divHeader align=center>' + tx('CRAFTING ADMINISTRATION') + '</div>';
		m += '<div align="center">';

		m += '<table width=100% class=xtab><tr><td width=30%><INPUT id=btCraftToggle type=checkbox />&nbsp;' + tx("Add toggle button to main screen header") + '</td><td colspan=2 align=center><INPUT id=btAutoCraftState type=submit value="' + tx("AutoCraft") + ' = ' + (Options.CraftOptions.Running ? 'ON' : 'OFF') + '"></td><td width=30% align=right>' + tx('Current Crafting Speed') + ':&nbsp;<span id=btCraftCurrTR></span>&nbsp;&nbsp;</td></tr></table>';
		m += '<table width=100% class=xtab><tr><td colspan=2 align=left><INPUT id=btCraftTR type=checkbox /> ' + tx('Only craft when crafting speed is at least') + ' <INPUT id=btCraftTRSpeed type=text size=3 maxlength=4 >&nbsp;%</td>';
		m += '<td colspan=2 align=right>' + tx('Minimum Aetherstone') + ':&nbsp;<input type=text size=5 maxlength=7 id=btCraftMinAether>&nbsp;&nbsp;</td></tr>';
		m += '<tr><td colspan=2 align=left><INPUT id=btCraftBasic type=checkbox /> ' + tx('Ignore above setting for basic crafts (e.g. bloodstones)') + '</td></tr></table>';

		m += '<br><DIV id=btCraftOverviewDiv style="width:' + GlobalOptions.btWinSize.x + 'px;overflow-x:auto;">';

		m += '<TABLE width=98% class=xtab cellpadding=1 cellspacing=0 align=center style="font-size:' + Options.OverviewOptions.OverviewFontSize + 'px;"><TR valign=bottom><td width=20>&nbsp;</td><td width=100>&nbsp;</td>';

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD style="font-size:11px;" align=center width=100><span id="btCraftCity_' + i + '"><B>' + Cities.cities[i - 1].name.substring(0, 12) + '</b></span></td>';
		}
		m += "<td>&nbsp;</td>"; // spacer
		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right><b>' + tx('Active') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div class=xtabBorder align=center><INPUT class=' + i + ' id="btCraftAutoCity_' + i + '" type=checkbox ' + (Options.CraftOptions.Enabled[i] ? 'CHECKED' : '') + '></div></td>';
		}
		m += '</tr><TR align=right class="evenRow"><TD colspan=2 align=right><b>' + tx('Preferred Recipe') + '&nbsp;</b></td>';

		var recipes = { 0: '-- ' + tx('Random') + ' --' };
		for (var h in t.craftinfo) {
			var o = t.craftinfo[h].output_item_id;
			recipes[h] = uW.itemlist["i" + o].name;
			if (h == 179) recipes[h] = recipes[h] + ' (' + tx('Lower') + ')';
			if (h == 180) recipes[h] = recipes[h] + ' (' + tx('Higher') + ')';
			if (o == 30800) recipes[h] = recipes[h] + ' (' + t.craftinfo[h].name + ')';
			if (t.EliteRecipes.indexOf(h) != -1) recipes[h] = recipes[h] + ' (' + tx('Elite') + ')';
			if (t.TrainingRecipes.indexOf(h) != -1) recipes[h] = recipes[h] + ' (' + tx('Train') + ')';
		}

		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<td align=center>' + htmlSelector(recipes, Options.CraftOptions.Preferred[i], 'class=' + i + ' id=btCraftPrefCity_' + i + ' style="width:100px;font-size:9px;"') + '</td>';
		}

		m += '</tr><TR align=right class="oddRow"><TD colspan=2 align=right style="padding-top:2px;vertical-align:top;padding-left:0px;"><b>' + tx('Activity') + '&nbsp;</b></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder style="height:60px;"><span id="btCraftSpireCity_' + i + '">&nbsp;</span></div></td>';
		}

		m += '</tr><TR align=right class="evenRow"><TD style="padding-left: 0px;"><img height=18 src="' + AetherImage + '" title="' + uW.g_js_strings.commonstr.aetherstone + '"></td><td><div id=btTotAether class="totalCell xtabBorder">&nbsp;</div></td>';
		for (var i = 1; i <= Cities.numCities; i++) {
			m += '<TD><div align=center class=xtabBorder><span id="btCraftAetherCity_' + i + '">&nbsp;</span></div></td>';
		}

		m += '</tr></table></div></div>';

		m += '<div class="divHeader" align="center">' + tx('USE AUTO-SPEEDUPS') + '</div>';

		m += '<table width=100% class=xtab><tr><td><div align=center>';

		var Boosts = '<table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td width=30 rowspan=2><img height=28 src="' + IMGURL + 'items/70/' + t.ItemList[i] + '.jpg" title="' + itemTitle(t.ItemList[i], true) + '\n' + tx(HourGlassHint[t.ItemList[i] - 1]) + '" /></td><td>(<span id=pbcraftUse' + t.ItemTrans[i] + 'Label>' + parseIntNan(uW.ksoItems[t.ItemList[i]].count) + '</span>)</td>';
		}
		Boosts += '<td width=70 rowspan=2 align=right><INPUT id=pbCraftHelp type=submit value="' + tx('HELP') + '!"></td>';
		Boosts += '</tr><tr style="vertical-align:top;">';
		for (var i = 0; i < t.ItemList.length; i++) {
			Boosts += '<td><input type=checkbox id="pbcraft' + t.ItemTrans[i] + '" ' + (Options.CraftOptions["Use" + t.ItemTrans[i]] ? "CHECKED" : "") + '></td>';
		}
		Boosts += '</tr></table></td></tr>';
		Boosts += '<tr><td><div align=center><table width=95% class=xtab align=center cellpadding=0 cellspacing=0><tr><td><input type=checkbox id=pbcraftOV >' + tx('Override above by always using') + ' ' + htmlSelector(HourGlassName, Options.CraftOptions.OverrideItem, 'id=pbcraftOVItem') + ' ' + tx('when more than') + ' ';
		Boosts += '<INPUT style="width: 30px;text-align:right;" id="pbcraftOVHours" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timehr + '&nbsp;<INPUT style="width: 30px;text-align:right;" id="pbcraftOVMinutes" type=text maxlength=4 >&nbsp;' + uW.g_js_strings.timestr.timemin + ' ' + tx('remaining') + '.</td></tr></table></div></td></tr>';

		m += Boosts + '</table></div><br>';

		m += '<div class="divHeader" align="center">' + tx('RECIPE LIST') + '</div>';

		m += '<div id=btRecipeList style="width:' + GlobalOptions.btWinSize.x + 'px;"><ul>';

		for (var i = 0; i < t.Categories.length; i++) {
			var CAT = t.Categories[i];
			m += '<li><a href="#btCraftCategory_' + CAT + '" style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + tx(t.CategoryNames[CAT]) + '</a></li>';
		}
		m += '</ul>';

		for (var i = 0; i < t.Categories.length; i++) {
			var CAT = t.Categories[i];
			m += '<div id="btCraftCategory_' + CAT + '" style="width:' + (parseInt(GlobalOptions.btWinSize.x) - 26) + 'px;background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';"><DIV style="max-height:700px;overflow-y:auto;width:100%;overflow-x:auto;">';

			m += '<TABLE cellpadding=1 cellspacing=0 width=98% class=xtab align=center><TR>';
			m += '<th class=xtabHD>&nbsp;</th><th class=xtabHD>' + uW.g_js_strings.commonstr.item + '</th><th class=xtabHD>' + uW.g_js_strings.commonstr.inventory + '</th><th class=xtabHD>' + uW.g_js_strings.commonstr.amount + '</th><th class=xtabHD>' + tx('Lock') + '</th><th class=xtabHD>' + tx('Success') + '</th>';
			m += '<th class=xtabHD>&nbsp;</th><th class=xtabHD>' + uW.g_js_strings.commonstr.item + '</th><th class=xtabHD>' + uW.g_js_strings.commonstr.inventory + '</th><th class=xtabHD>' + uW.g_js_strings.commonstr.amount + '</th><th class=xtabHD>' + tx('Lock') + '</th><th class=xtabHD>' + tx('Success') + '</th>';
			m += '</tr><tr class=oddRow>';

			var r = 0;
			var count = 0;
			for (var h in t.craftinfo) {
				if (t.craftinfo[h].category == CAT) {
					var o = t.craftinfo[h].output_item_id;
					var itemname = uW.itemlist['i' + o].name;
					if (h == 179) itemname = itemname + ' (' + tx('Lower') + ')';
					if (h == 180) itemname = itemname + ' (' + tx('Higher') + ')';
					if (o == 30800) itemname = itemname + ' (' + t.craftinfo[h].name + ')';
					if (t.EliteRecipes.indexOf(h) != -1) itemname = itemname + ' (' + tx('Elite') + ')';
					if (t.TrainingRecipes.indexOf(h) != -1) itemname = itemname + ' (' + tx('Train') + ')';
					m += '<td align=center><img src="' + getItemImageURL(o) + '" width=25></td><td align=center class=tooldesc id=btCraftDesc_' + h + ' >' + itemname + '</td><td align=center><span id=btCraftInv_' + h + ' >&nbsp;</span></td>';
					m += '<td><input type=text class=' + h + ' size=4 id=btCraftNum_' + h + ' value="' + (Options.CraftOptions.RecipeNumbers[h] ? Options.CraftOptions.RecipeNumbers[h] : '') + '"></td><td><INPUT id=btCraftFixed_' + h + ' class=' + h + ' type=checkbox ' + (Options.CraftOptions.RecipeFixed[h] ? 'CHECKED' : '') + '></td><td id=btCraftStats_' + h + '>&nbsp;</td>';
					if ((count + 1) % 2 == 0) {
						if (++r % 2) { rowClass = 'evenRow'; }
						else { rowClass = 'oddRow'; }
						m += '</tr><tr class="' + rowClass + '">';
					}
					count++;
				}
			}
			m += '</TR></TABLE></div></div>';
		}

		m += '</div><br>'
		div.innerHTML = m;

		jQuery("#btRecipeList").tabs({ activate: function (event, ui) { ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x); } });

		for (var i = 1; i <= Cities.numCities; i++) {
			ById('btCraftAutoCity_' + i).addEventListener('click', function (e) {
				var citynum = e.target['className'];
				Options.CraftOptions.Enabled[citynum] = e.target.checked;
				if (Options.CraftOptions.Enabled[citynum]) {
					t.citydelay[i] = 0;
					t.timer = setTimeout(function () { t.doAutoLoop(Number(citynum)); }, 0);
				}
				saveOptions();
			}, false);
			ById('btCraftPrefCity_' + i).addEventListener('change', function (e) {
				Options.CraftOptions.Preferred[e.target['className']] = e.target.value;
				saveOptions();
			}, false);
		}

		ToggleOption('CraftOptions', 'btCraftToggle', 'Toggle');

		ToggleOption('CraftOptions', 'pbcraftSH', 'UseSH');
		ToggleOption('CraftOptions', 'pbcraftKH', 'UseKH');
		ToggleOption('CraftOptions', 'pbcraftGH', 'UseGH');
		ToggleOption('CraftOptions', 'pbcraftMH', 'UseMH');
		ToggleOption('CraftOptions', 'pbcraftAH', 'UseAH');

		ToggleOption('CraftOptions', 'pbcraftOV', 'UseOverride');
		ChangeIntegerOption('CraftOptions', 'pbcraftOVItem', 'OverrideItem');
		ChangeIntegerOption('CraftOptions', 'pbcraftOVHours', 'OverrideHours');
		ChangeIntegerOption('CraftOptions', 'pbcraftOVMinutes', 'OverrideMinutes');

		ById('pbCraftHelp').addEventListener('click', t.helpPop, false);

		ById('btAutoCraftState').addEventListener('click', function () {
			t.toggleAutoCraftState(this);
		}, false);

		ToggleOption('CraftOptions', 'btCraftTR', 'ThroneCheck');
		ToggleOption('CraftOptions', 'btCraftBasic', 'BasicCheck');
		ChangeIntegerOption('CraftOptions', 'btCraftTRSpeed', 'CraftingSpeed');
		ChangeIntegerOption('CraftOptions', 'btCraftMinAether', 'MinAether');

		for (var h in t.craftinfo) {
			ById('btCraftNum_' + h).addEventListener('change', function (e) {
				var craftnum = e.target['className'];
				if (isNaN(e.target.value)) e.target.value = '';
				Options.CraftOptions.RecipeNumbers[craftnum] = e.target.value;
				saveOptions();
			}, false);
			ById('btCraftFixed_' + h).addEventListener('change', function (e) {
				var craftnum = e.target['className'];
				Options.CraftOptions.RecipeFixed[craftnum] = e.target.checked;
				saveOptions();
			}, false);
		}

		// start autocraft loop timer to start in 20 seconds...

		if (Options.CraftOptions.Running) {
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (20 * 1000));
		}
	},

	toggleAutoCraftState: function (obj) {
		var t = Tabs.Craft;
		obj = ById('btAutoCraftState');
		if (Options.CraftOptions.Running == true) {
			Options.CraftOptions.Running = false;
			obj.value = tx("AutoCraft = OFF");
		}
		else {
			Options.CraftOptions.Running = true;
			obj.value = tx("AutoCraft = ON");
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, 0);
		}
		saveOptions();
		SetToggleButtonState('Craft', Options.CraftOptions.Running, 'Craft');
		t.citydelay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
		t.PaintOverview();
	},

	show: function (init) {
		var t = Tabs.Craft;

		t.PaintOverview();
		t.PaintRecipeList();
	},

	createToolTip: function (elem) {
		var t = Tabs.Craft;
		var h = elem.id.substring(12);
		var recipeId = t.craftinfo[h].recipe_id;
		var name = t.craftinfo[h].name;
		var category = t.craftinfo[h].category;
		var input = t.craftinfo[h].input;
		var requirements = t.craftinfo[h].requirements.building;
		var inputitems = t.craftinfo[h].inputItems;
		var astone = t.craftinfo[h].resources[5];
		var food = t.craftinfo[h].resources[1];
		var wood = t.craftinfo[h].resources[2];
		var stone = t.craftinfo[h].resources[3];
		var ore = t.craftinfo[h].resources[4];
		var gold = t.craftinfo[h].resources[6];
		var odds = t.craftinfo[h].odds;

		var ingredients = '';
		for (var i in inputitems) {
			if (i > 0) {
				span = '<span>';
				if (parseIntNan(Seed.items['i' + i]) < inputitems[i]) span = '<span style="color:#f00">';
				ingredients += span + uW.itemlist['i' + i].name + ' : ' + inputitems[i] + '</span><br>';
			}
		}
		if (food != 0) { ingredients += '<span>' + uW.g_js_strings.commonstr.food + ' : ' + addCommas(food) + '</span><br>'; }
		if (wood != 0) { ingredients += '<span>' + uW.g_js_strings.commonstr.wood + ' : ' + addCommas(wood) + '</span><br>'; }
		if (stone != 0) { ingredients += '<span>' + uW.g_js_strings.commonstr.stone + ' : ' + addCommas(stone) + '</span><br>'; }
		if (ore != 0) { ingredients += '<span>' + uW.g_js_strings.commonstr.ore + ' : ' + addCommas(ore) + '</span><br>'; }
		if (gold != 0) { ingredients += '<span>' + uW.g_js_strings.commonstr.gold + ' : ' + addCommas(gold) + '</span><br>'; }

		if (ingredients != '') ingredients = '<b>' + tx('Ingredients') + '</b><br>' + ingredients;
		var limits = '';
		if (parseIntNan(t.craftinfo[h].dailylimit) != 0) {
			span = '<span>';
			if (uW.recipeUsageList[category] && uW.recipeUsageList[category][recipeId]) {
				if (parseIntNan(uW.recipeUsageList[category][recipeId].dailyUsage) >= parseIntNan(t.craftinfo[h].dailylimit)) span = '<span style="color:#f00">';
			}
			limits += span + '<b>' + tx('Daily Limit') + ' : ' + parseIntNan(t.craftinfo[h].dailylimit) + '</b></span><br>';
		}
		if (parseIntNan(t.craftinfo[h].lifetimelimit) != 0) {
			span = '<span>';
			if (uW.recipeUsageList[category] && uW.recipeUsageList[category][recipeId]) {
				if (parseIntNan(uW.recipeUsageList[category][recipeId].lifeTimeUsage) >= parseIntNan(t.craftinfo[h].lifetimelimit)) span = '<span style="color:#f00">';
			}
			limits += span + '<b>' + tx('Lifetime Limit') + ' : ' + parseIntNan(t.craftinfo[h].lifetimelimit) + '</b></span><br>';
		}

		jQuery('#' + elem.id).children("span").remove();
		jQuery('#' + elem.id).append('<span class="tooltip"><b>' + tx('Recipe Name') + '</b><br>' + name + ' (' + odds + ')<br><b>' + uW.g_js_strings.commonstr.requirements + '</b><br>Spire Lv.' + requirements + '<br>' + uW.g_js_strings.commonstr.aetherstone + ' : ' + addCommas(astone) + '<br>' + ingredients + '<br>' + limits + '</span>');
	},

	helpPop: function () {
		var t = Tabs.Craft;
		var helpText = '<br>' + tx("Using Speedups for Crafting");
		helpText += '<p>' + tx('Speedups will be used in the following order if they are selected, and the required criteria is met') + ' :-</p>';
		helpText += '<TABLE class=xtab><TR><TD><b>' + uW.g_js_strings.commonstr.item + '</b></td><TD><b>' + uW.g_js_strings.commonstr.time + '</b></td><TD><b>' + tx('Criteria') + '</b></td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i5.name + '</td><TD>8 hrs</td><TD>' + tx('More than 7 hours 30 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i4.name + '</td><TD>2.5 hrs</td><TD>' + tx('More than 2 hours remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i3.name + '</td><TD>1 hr</td><TD>' + tx('More than 45 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i2.name + '</td><TD>15 mins</td><TD>' + tx('More than 5 minutes remaining') + '</td></tr>';
		helpText += '<TR><TD>' + uW.itemlist.i1.name + '</td><TD>1 min</td><TD>' + tx('More than 30 seconds remaining') + '</td></tr>';
		helpText += '</table>';
		helpText += '<p>' + tx('If the override box is ticked, then the override rule specified will take priority') + '.</p><br>';

		var pop = new CPopup('BotHelp', 0, 0, 460, 280, true);
		pop.centerMe(mainPop.getMainDiv());
		pop.getMainDiv().innerHTML = helpText;
		pop.getTopDiv().innerHTML = '<CENTER><B>' + tx("PowerBot+ Help") + ': ' + tx("Speedups") + '</b></center>';
		pop.show(true);
	},

	EverySecond: function () {
		var t = Tabs.Craft;

		t.LoopCounter = t.LoopCounter + 1;

		if (t.LoopCounter % 2 == 0) { // refresh crafting speed and overview display every 2 seconds
			t.craftingspeed = Math.floor(equippedthronestats(81) + equippedthronestats(165));
			if (tabManager.currentTab.name == 'Craft' && Options.btWinIsOpen) { t.PaintOverview(); }
		}

		if (t.LoopCounter >= 5) { // refresh recipe and spires display every 5 seconds
			t.LoopCounter = 0;
			for (i = 0; i < Cities.numCities; i++) { t.spires[i] = getUniqueCityBuilding(Cities.cities[i].id, 20); }	// always check spires for auto loop
			if (tabManager.currentTab.name == 'Craft' && Options.btWinIsOpen) { t.PaintRecipeList(); }

			for (var k in t.InstantCrafts) {
				if (t.InstantCrafts[k][0] != uW.ksoItems[k].count) {
					delete t.InstantCrafts[k];
				}
			}
		}
	},

	PaintOverview: function () {
		var t = Tabs.Craft;

		t.Squire = parseIntNan(Seed.items.i1);
		t.Knight = parseIntNan(Seed.items.i2);
		t.Guinevere = parseIntNan(Seed.items.i3);
		t.Morgana = parseIntNan(Seed.items.i4);
		t.Arthur = parseIntNan(Seed.items.i5);

		ById('pbcraftUseSHLabel').innerHTML = t.Squire;
		ById('pbcraftUseKHLabel').innerHTML = t.Knight;
		ById('pbcraftUseGHLabel').innerHTML = t.Guinevere;
		ById('pbcraftUseMHLabel').innerHTML = t.Morgana;
		ById('pbcraftUseAHLabel').innerHTML = t.Arthur;

		t.totaether = 0;
		var now = unixTime();
		var q;

		for (var i = 0; i < Cities.numCities; i++) {
			citynum = i + 1;
			cityId = Cities.cities[i].id;
			var cityaether = parseIntNan(Seed.resources["city" + cityId]['rec5'][0]);
			t.totaether = t.totaether + cityaether;
			var span = '<span>';
			if (cityaether < Options.CraftOptions.MinAether) { span = '<span class=boldRed>'; }
			ById("btCraftAetherCity_" + citynum).innerHTML = span + addCommas(cityaether) + '</span>';

			var str = '';
			var SpireLevel = t.spires[i].maxLevel;
			if (SpireLevel > 0) {
				str = '<span>' + uW.g_js_strings.prestige.spire + ' (' + uW.g_js_strings.commonstr.level + ' ' + SpireLevel + ')</span><BR>';
				var totTime = 0;
				// the last item in the queue should be the item in progress
				var len = Seed.queue_craft["city" + Cities.cities[i].id].length;
				if (len > 0) {
					q = Seed.queue_craft["city" + Cities.cities[i].id][len - 1];
					totTime = q.craftingEtaUnixTime - now;
					if (totTime < 0) totTime = 0;
				}
				if (totTime > 0) {
					var Speedups = '';
					Speedups += t.dspHG(Cities.cities[i].id, q.craftingId, 1, t.Squire);
					Speedups += t.dspHG(Cities.cities[i].id, q.craftingId, 2, t.Knight);
					Speedups += t.dspHG(Cities.cities[i].id, q.craftingId, 3, t.Guinevere);
					Speedups += t.dspHG(Cities.cities[i].id, q.craftingId, 4, t.Morgana);
					Speedups += t.dspHG(Cities.cities[i].id, q.craftingId, 5, t.Arthur);
					if (Speedups != "") Speedups = "<table align=center cellspacing=0 cellpadding=0><tr>" + Speedups + "</tr></table>";

					str += '<span>' + t.getRecipeName(q.recipeId) + '</span><BR><span>' + timestr(totTime) + '</span>' + Speedups;
				}
				else {
					if (t.citydelay[citynum] > 0) { str += '<span>&nbsp;</span><BR><SPAN class=boldRed><B>' + tx('Busy') + '!</b></span>'; }
					else {
						if (Options.BuildOptions && Options.BuildOptions.AscensionReady[citynum]) { str += '<span>&nbsp;</span><BR><SPAN>' + tx('Ascension') + '!</span>'; }
						else { str += '<span>&nbsp;</span><BR><SPAN class=boldRed><B>' + tx('Idle') + '</b></span>'; }
					}
				}
			}
			else {
				str = '<SPAN class=boldRed><B>' + tx('No Spire') + '</b></span><br>';
			}
			ById("btCraftSpireCity_" + citynum).innerHTML = str;
		}
		ById('btTotAether').innerHTML = addCommas(t.totaether);

		if (Options.CraftOptions.ThroneCheck && (t.craftingspeed < Number(Options.CraftOptions.CraftingSpeed))) {
			ts = '<span class=boldRed><b>' + t.craftingspeed + '%</b></span>';
		}
		else { ts = t.craftingspeed + '%'; }
		ById("btCraftCurrTR").innerHTML = ts;
	},

	dspHG: function (cityId, qitem, item, count) {
		var t = Tabs.Craft;
		var n = '';
		if (count > 0) {
			n += '<td class=xtab style="padding-right:2px"><a onClick="speedupCraft(' + cityId + ', ' + item + ', ' + qitem + ')"><img height=18 class="btTop btFaint" src="' + IMGURL + 'items/70/' + item + '.jpg" title="' + itemTitle(item) + '"></a></td>';
		}
		return n;
	},

	PaintRecipeList: function () {
		var t = Tabs.Craft;
		for (var h in t.craftinfo) {
			var o = t.craftinfo[h].output_item_id;
			var craftingstr = "";
			var crafting = t.checkCraftQueues(h);
			if (crafting != 0) craftingstr = " (" + crafting + ")";
			ById('btCraftStats_' + h).innerHTML = t.getCraftPercent(Options.CraftOptions.RecipeStats[h]);
			var invamount = parseIntNan(Seed.items["i" + o]);
			var span = '<span>'
			if (Options.CraftOptions.RecipeFixed[h] && parseIntNan(Options.CraftOptions.RecipeNumbers[h]) > 0 && parseIntNan(Options.CraftOptions.RecipeNumbers[h]) <= invamount + crafting) {
				span = '<span class=boldGreen>';
			}
			ById('btCraftInv_' + h).innerHTML = span + invamount + craftingstr + '</span>';
		}

		var cItems = ById('btRecipeList').getElementsByClassName('tooldesc');
		for (var i = 0; i < cItems.length; i++) { t.createToolTip(cItems[i]); }
	},

	getCraftPercent: function (item) {
		var t = Tabs.Craft;
		if (item) {
			var succ = item[0];
			var tot = item[1];
			if (parseIntNan(tot) != 0) {
				return parseInt((parseIntNan(succ) / parseIntNan(tot)) * 10000) / 100 + '%';
			}
			else { return "&nbsp;"; }
		}
		else { return "&nbsp;"; }
	},

	checkCraftQueues: function (h, expired) {
		var t = Tabs.Craft;
		var result = 0;

		var now = unixTime();
		for (var i = 0; i < Seed.cities.length; i++) {
			var len = Seed.queue_craft["city" + Seed.cities[i][0]].length;
			if (len > 0 && ((Seed.queue_craft["city" + Seed.cities[i][0]][len - 1].craftingEtaUnixTime - now) > 0)) { // don't display completed crafts here!
				var q = Seed.queue_craft["city" + Seed.cities[i][0]][len - 1];
				if (parseInt(q.recipeId) == parseInt(t.craftinfo[h].recipe_id)) { result++; }
			}
		}
		return result;
	},

	checkCraftQueuesByItem: function (o) {
		var t = Tabs.Craft;
		var result = 0;
		for (var i = 0; i < Seed.cities.length; i++) {
			var len = Seed.queue_craft["city" + Seed.cities[i][0]].length;
			if (len > 0) {
				var q = Seed.queue_craft["city" + Seed.cities[i][0]][len - 1];
				if (t.craftinfo[q.recipeId] && parseInt(t.craftinfo[q.recipeId].output_item_id) == parseInt(o)) { result++; }
			}
		}
		if (t.InstantCrafts[o]) { result += t.InstantCrafts[o][1]; } // completed instant crafts
		return result;
	},

	getRecipeName: function (recipeId) {
		var t = Tabs.Craft;
		var name = "";
		for (var h in t.craftinfo) {
			if (parseInt(t.craftinfo[h].recipe_id) == parseInt(recipeId)) {
				name = t.craftinfo[h].name;
				break;
			}
		}
		if (name.length > 16) { return name.substring(0, 16) + '...'; }
		else { return name; }

	},

	doAutoLoop: function (idx) {
		var t = Tabs.Craft;
		clearTimeout(t.timer);
		if (!Options.CraftOptions.Running) return;

		var cityId = Cities.cities[idx - 1].id;
		if (idx == 1) { t.loopaction = false; } // reset loop action indicator for first city
		t.autodelay = 0; // no delay if no action taken!

		// first check if city is idle (or busy)

		var now = unixTime();
		var len = Seed.queue_craft["city" + cityId].length;
		if ((len == 0 || (Seed.queue_craft["city" + cityId][len - 1].craftingEtaUnixTime - now) < 0)) {
			if (!Options.CraftOptions.ThroneCheck || Options.CraftOptions.BasicCheck || (t.craftingspeed >= Options.CraftOptions.CraftingSpeed)) { // if no craft speed restriction or enough crafting speed or ignore speed for basic crafts
				var ascensionok = (!Options.BuildOptions || !Options.BuildOptions.AscensionReady[idx]);
				if (Options.CraftOptions.Enabled[idx] && ascensionok) {
					if (t.citydelay[idx] > 0) { t.citydelay[idx]--; } // city being delayed due to error, reduce delay number and skip city
					else {
						var SpireLevel = t.spires[idx - 1].maxLevel;
						if (SpireLevel > 0) {
							if (parseIntNan(Seed.resources["city" + cityId]['rec5'][0]) >= Options.CraftOptions.MinAether) {
								t.eventSelectRecipe(cityId, idx);
							}
						}
					}
				}
			}
		}
		else {
			if (len != 0) {
				t.autoSpeedup(cityId, Seed.queue_craft["city" + cityId][len - 1]);
			}
		}

		if (idx == Cities.numCities) {
			if (!t.loopaction) { t.autodelay = t.intervalSecs; } // if no action this loop, apply delay anyway...
			t.timer = setTimeout(function () { t.doAutoLoop(1); }, (t.autodelay * 1000));
		}
		else {
			t.timer = setTimeout(function () { t.doAutoLoop(idx + 1); }, (t.autodelay * 1000));
		}
	},

	eventSelectRecipe: function (cityId, idx) {
		var t = Tabs.Craft;

		t.tableau = [];
		if (Options.CraftOptions.Preferred[idx] != 0) { // attempt to craft preferred recipe
			t.checkRequirements(Options.CraftOptions.Preferred[idx], cityId, idx);
		}

		if (t.tableau.length == 0) { // preferred not available
			for (var d in Options.CraftOptions.RecipeNumbers) {
				t.checkRequirements(d, cityId, idx);
			}
		}
		if (t.tableau.length == 0) return; // nothing to craft

		// do craft!

		var h = t.tableau[Math.floor(Math.random() * t.tableau.length)];
		var itemId = t.craftinfo[h].output_item_id;
		var recipeId = t.craftinfo[h].recipe_id;
		var category = t.craftinfo[h].category;

		t.autodelay = t.intervalSecs;
		t.loopaction = true;
		t.Craft(idx, cityId, itemId, recipeId, category, h);
	},

	checkRequirements: function (d, cityId, idx) {
		var t = Tabs.Craft;
		if (t.craftinfo[d]) { // recipe may have been taken away!
			// first check daily/lifetime limits
			var recipeId = t.craftinfo[d].recipe_id;
			var category = t.craftinfo[d].category;
			var o = t.craftinfo[d].output_item_id;
			if (uW.recipeUsageList[category] && uW.recipeUsageList[category][recipeId]) {
				if (parseIntNan(t.craftinfo[d].dailylimit) != 0 && parseIntNan(uW.recipeUsageList[category][recipeId].dailyUsage) >= parseIntNan(t.craftinfo[d].dailylimit)) { return; }
				if (parseIntNan(t.craftinfo[d].lifetimelimit) != 0 && parseIntNan(uW.recipeUsageList[category][recipeId].lifeTimeUsage) >= parseIntNan(t.craftinfo[d].lifetimelimit)) { return; }
			}

			if ((!Options.CraftOptions.RecipeFixed[d] && (parseIntNan(Options.CraftOptions.RecipeNumbers[d]) > 0)) || (Options.CraftOptions.RecipeFixed[d] && (parseIntNan(Options.CraftOptions.RecipeNumbers[d]) > parseIntNan(Seed.items["i" + o]) + t.checkCraftQueuesByItem(o)))) {
				var ResourceOK = true;
				if (parseIntNan(t.craftinfo[d].resources[1]) > parseIntNan(Seed.resources["city" + cityId]['rec1'][0])) ResourceOK = false;
				if (parseIntNan(t.craftinfo[d].resources[2]) > parseIntNan(Seed.resources["city" + cityId]['rec2'][0])) ResourceOK = false;
				if (parseIntNan(t.craftinfo[d].resources[3]) > parseIntNan(Seed.resources["city" + cityId]['rec3'][0])) ResourceOK = false;
				if (parseIntNan(t.craftinfo[d].resources[4]) > parseIntNan(Seed.resources["city" + cityId]['rec4'][0])) ResourceOK = false;
				if (parseIntNan(t.craftinfo[d].resources[6]) > parseIntNan(Seed.citystats["city" + cityId]['gold'][0])) ResourceOK = false;
				if (ResourceOK && parseIntNan(Seed.resources["city" + cityId]['rec5'][0]) >= parseIntNan(t.craftinfo[d].resources[5])) {
					if (parseInt(t.craftinfo[d].requirements.building) <= parseInt(t.spires[idx - 1].maxLevel)) {
						if (t.craftinfo[d].inputItems == "") { // "base items"
							t.tableau.push(d);
						}
						else {
							if (!Options.CraftOptions.ThroneCheck || (t.craftingspeed >= Options.CraftOptions.CraftingSpeed)) { // if no craft speed restriction or enough crafting speed
								for (var i in t.craftinfo[d].inputItems) {
									if (parseIntNan(Seed.items["i" + i]) < parseInt(t.craftinfo[d].inputItems[i])) { break; }
								}
								if (parseIntNan(Seed.items["i" + i]) >= parseInt(t.craftinfo[d].inputItems[i])) { t.tableau.push(d); }
							}
						}
					}
				}
			}
		}
	},

	autoSpeedup: function (cityId, q) {
		var t = Tabs.Craft;
		var now = unixTime();
		var item = 0;
		totTime = q.craftingEtaUnixTime - now;

		if (totTime > 0) {
			if (Options.CraftOptions.UseOverride && Options.CraftOptions.OverrideItem != 0) {
				var THRESHOLD_SECONDS = (parseIntNan(Options.CraftOptions.OverrideMinutes) * 60) + (parseIntNan(Options.CraftOptions.OverrideHours) * 60 * 60);
				if (totTime >= THRESHOLD_SECONDS && uW.ksoItems[Options.CraftOptions.OverrideItem].count > 0) { item = Options.CraftOptions.OverrideItem; }
			}
			if (item == 0 && totTime >= HGLimit[4] && Options.CraftOptions.UseAH && uW.ksoItems[5].count > 0) { item = 5; }
			if (item == 0 && totTime >= HGLimit[3] && Options.CraftOptions.UseMH && uW.ksoItems[4].count > 0) { item = 4; }
			if (item == 0 && totTime >= HGLimit[2] && Options.CraftOptions.UseGH && uW.ksoItems[3].count > 0) { item = 3; }
			if (item == 0 && totTime >= HGLimit[1] && Options.CraftOptions.UseKH && uW.ksoItems[2].count > 0) { item = 2; }
			if (item == 0 && totTime >= HGLimit[0] && Options.CraftOptions.UseSH && uW.ksoItems[1].count > 0) { item = 1; }
		}

		if (item != 0) {
			t.autodelay = t.intervalSecs;
			t.speedupCraft(cityId, item, q.craftingId);
		}
	},

	Craft: function (citynum, cityId, itemId, recipeId, category, h) {
		var t = Tabs.Craft;
		jQuery('#btCraftCity_' + citynum).css('color', 'green');

		// set up success stats if first time crafted this item..
		if (!Options.CraftOptions.RecipeStats[h]) {
			Options.CraftOptions.RecipeStats[h] = [0, 0];
			saveOptions();
		}

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.action = "craft";
		params.ctrl = "Crafting";
		params.cityId = cityId;
		params.insurance = false;
		params.itemId = itemId;
		params.recipeId = recipeId;
		params.categoryId = category;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.ok === true) {
					if (rslt.status == "error") { // crafting error
						actionLog(Cities.byID[cityId].name + ': Error (' + rslt.errorCode + ') when attempting to craft ' + uW.itemlist["i" + itemId].name, 'CRAFTING');
						if (rslt.errorCode == 2) { // server busy? delay 2 loops
							t.citydelay[citynum] = 2;
						}
						if (rslt.errorCode == 6) { // city already crafting? delay 10 loops
							t.citydelay[citynum] = 10;
						}
					}
					else {
						if (rslt.status == "hitlimit") { //hit daily/lifetime limit
							actionLog(Cities.byID[cityId].name + ': Crafting Limit reached for ' + uW.itemlist["i" + itemId].name, 'CRAFTING');
							uW.recipeUsageList[category][recipeId].dailyUsage = parseIntNan(t.craftinfo[h].dailylimit); // fix!
						}
						else {
							Seed.resources['city' + cityId].rec1[0] = parseInt(Seed.resources['city' + cityId].rec1[0] - parseIntNan(t.craftinfo[h].resources[1]));
							Seed.resources['city' + cityId].rec2[0] = parseInt(Seed.resources['city' + cityId].rec2[0] - parseIntNan(t.craftinfo[h].resources[2]));
							Seed.resources['city' + cityId].rec3[0] = parseInt(Seed.resources['city' + cityId].rec3[0] - parseIntNan(t.craftinfo[h].resources[3]));
							Seed.resources['city' + cityId].rec4[0] = parseInt(Seed.resources['city' + cityId].rec4[0] - parseIntNan(t.craftinfo[h].resources[4]));
							Seed.resources['city' + cityId].rec5[0] = parseInt(Seed.resources['city' + cityId].rec5[0] - parseIntNan(t.craftinfo[h].resources[5]));
							Seed.citystats['city' + cityId]['gold'][0] = parseInt(Seed.citystats['city' + cityId]['gold'][0] - parseIntNan(t.craftinfo[h].resources[6]));
							if (rslt.status == "failure") { //craft failed
								actionLog(Cities.byID[cityId].name + ': Failed to craft ' + uW.itemlist["i" + itemId].name, 'CRAFTING');
								// increment total craft attempts
								Options.CraftOptions.RecipeStats[h][1] = Options.CraftOptions.RecipeStats[h][1] + 1;
								saveOptions();
								for (var k in t.craftinfo[h].inputItems) {
									if (t.craftinfo[h].inputItems[k] > 0) {
										if (k == t.craftinfo[h].consolation) { CM.InventoryView.removeItemFromInventory(k, (t.craftinfo[h].inputItems[k] - 1).toFixed(0)); }
										else { CM.InventoryView.removeItemFromInventory(k, parseInt(t.craftinfo[h].inputItems[k])); }
									}
								}
							}
							else {
								if (rslt.status == "success") { // craft successful
									actionLog(Cities.byID[cityId].name + ': Successfully crafting ' + uW.itemlist["i" + itemId].name, 'CRAFTING');
									// increment total craft attempts and successful craft attempts
									Options.CraftOptions.RecipeStats[h][1] = Options.CraftOptions.RecipeStats[h][1] + 1;
									Options.CraftOptions.RecipeStats[h][0] = Options.CraftOptions.RecipeStats[h][0] + 1;
									if (!Options.CraftOptions.RecipeFixed[h] && Options.CraftOptions.RecipeNumbers[h] > 0) {
										Options.CraftOptions.RecipeNumbers[h] = Options.CraftOptions.RecipeNumbers[h] - 1;
										saveOptions();
										if (ById('btCraftNum_' + h)) { ById('btCraftNum_' + h).value = Options.CraftOptions.RecipeNumbers[h]; }
									}
									Seed.queue_craft["city" + cityId] = uWCloneInto([]); // Always reset the crafting queue for the city!!
									if (rslt.time.duration == 0) {
										// add to instant craft array, not to craft queue!
										if (t.InstantCrafts[params.itemId]) {
											++t.InstantCrafts[params.itemId][1];
										}
										else {
											t.InstantCrafts[params.itemId] = [];
											t.InstantCrafts[params.itemId].push(parseIntNan(Seed.items["i" + params.itemId]));
											t.InstantCrafts[params.itemId].push(1);
										}
									}
									else {
										var n = {};
										n.recipeId = recipeId;
										n.craftingUnixTime = rslt.time.startTime;
										n.craftingEtaUnixTime = rslt.time.endTime;
										n.craftingId = rslt.craftingId;
										n.categoryId = null;
										n.recipeIndex = null;
										uW.seed.queue_craft["city" + cityId].push(uWCloneInto(n));
									}

									for (var k in t.craftinfo[h].inputItems) {
										if (t.craftinfo[h].inputItems[k] > 0) {
											CM.InventoryView.removeItemFromInventory(k, parseInt(t.craftinfo[h].inputItems[k]));
										}
									}
									if (typeof uW.recipeUsageList[category] !== "undefined" && typeof uW.recipeUsageList[category][recipeId] !== "undefined") {
										uW.recipeUsageList[category][recipeId].dailyUsage += 1;
										uW.recipeUsageList[category][recipeId].lifeTimeUsage += 1;
									}
									if (uW.currentcityid == cityId) {
										if (jQuery("#queue_head_building").hasClass("sel")) {
											uW.queue_changetab_building();
										}
										uW.update_queue();
									}
								}
							}
						}
					}
				}
				t.PaintOverview();
				jQuery('#btCraftCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
				return;
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Crafting Failed (AJAX Error)', 'CRAFTING');
				jQuery('#btCraftCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			}
		}, true);
	},

	speedupCraft: function (cityId, item, cid) {
		var t = Tabs.Craft;

		var citynum = Cities.byID[cityId].idx + 1;
		jQuery('#btCraftCity_' + citynum).css('color', 'magenta');
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ctrl = 'Crafting';
		params.action = 'speedup';
		params.cityId = cityId;
		params.itemId = item;
		params.craftingId = cid;

		new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.error_code || rslt.error_code == 0) { // no OK status on this call, but if there's an error_code assume speedup failed...
					actionLog(Cities.byID[cityId].name + ': Crafting Speedup Failed (' + rslt.error_code + ')', 'CRAFTING');
				}
				else {
					Seed.items["i" + item] = Number(parseInt(Seed.items["i" + item]) - 1);
					uW.ksoItems[item].subtract();
					var qloc = Seed.queue_craft["city" + cityId].length - 1; // last queued item is the one in progress...
					var timered = 0;
					var utstart = parseInt(Seed.queue_craft["city" + cityId][qloc].craftingUnixTime);
					var uteta = parseInt(Seed.queue_craft["city" + cityId][qloc].craftingEtaUnixTime);
					timered = SpeedupArray[parseInt(item) - 1];
					Seed.queue_craft["city" + cityId][qloc].craftingUnixTime = utstart - timered;
					Seed.queue_craft["city" + cityId][qloc].craftingEtaUnixTime = uteta - timered;
					if (cityId == uW.currentcityid) uW.update_queue();
				}
				jQuery('#btCraftCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			},
			onFailure: function () {
				actionLog(Cities.byID[cityId].name + ': Crafting Speedup Failed (AJAX Error)', 'CRAFTING');
				jQuery('#btCraftCity_' + citynum).css('color', 'rgb(' + HEXtoRGB(Options.Colors.PanelText).r + ',' + HEXtoRGB(Options.Colors.PanelText).g + ',' + HEXtoRGB(Options.Colors.PanelText).b + ')');
			}
		}, true);
	},
}
