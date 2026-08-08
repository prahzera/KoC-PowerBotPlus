/** Inventory Tab **/

Tabs.Inventory = {
	tabOrder: 1110,
	tabLabel: 'Inventory',
	myDiv: null,
	general: [],
	throne: [],
	champ: [],
	speedup: [],
	combat: [],
	resources: [],
	chest: [],
	court: [],
	jewels: [],
	alliance: [],
	type: null,
	queue: [],
	isBusy: false,
	counter: 0,
	max: 0,
	ModelCity: null,
	ModelCityId: 0,
	city_holder: 0,

	init: function (div) {
		var t = Tabs.Inventory;
		t.myDiv = div;

		var RJcallback = new CalterUwFunc("cm.ThroneController.useRandomJewel", [['ai,', 'function(rslt) {btShowRandomJewelPrize(rslt);ai(rslt);},'],
		['w(', 'cm.ThroneController.updateJewelCount('],
		['q(', 'cm.ThroneController.jewelName(']]);
		RJcallback.setEnable(true);
		uWExportFunction('btShowRandomJewelPrize', Tabs.Inventory.ShowRandomJewelPrize);

		var m = '<DIV class=divHeader align=center>' + tx('INVENTORY') + '</div>';

		m += '<TABLE align=center width=98% cellpadding=0 cellspacing=0 class=xtab>';
		m += '<tr><td>' + tx('Target City') + ':&nbsp;<span id=pbinventory_cityselect></span></td><TD><input type=checkbox id=pbinventory_useall />' + tx('Default to Use All items') + '<BR><input type=checkbox id=pbinventory_useable checked />' + tx('Show only items you can use directly') + '</td>';
		m += '<TD align=right>' + strButton20(tx('Use Selected Items'), 'id=pbinventory_start') + '</td></tr></table>';

		m += '<div id=btInventoryList style="width:' + GlobalOptions.btWinSize.x + 'px;"><ul>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_general style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.general + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_throne style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + tx('Throne') + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_champ style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + tx('Champ') + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_speedup style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.speedup + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_combat style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.combat + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_resources style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.resources + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_chest style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.chest + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_court style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.court + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_jewels style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.jewel.jewels + '</a></li>';
		m += '<li><a href="#pbinventory_container" id=pbinventory_alliance style="background-color:' + Options.Colors.Panel + ';color:' + Options.Colors.PanelText + ';">' + uW.g_js_strings.commonstr.alliance + '</a></li>';
		m += '</ul>';

		m += '<DIV id=pbinventory_container style="width:' + (parseInt(GlobalOptions.btWinSize.x) - 10) + 'px;"><DIV clas=xtab align=center id=pbinventory style="width:100%;overflow-x:auto;height:500px;overflow-y:auto;color:' + Options.Colors.PanelText + ';">&nbsp;</div><br>';
		m += '</DIV></DIV>';

		t.myDiv.innerHTML = m;
		jQuery("#btInventoryList").tabs({ activate: function (event, ui) { ResetFrameSize('btMain', 100, GlobalOptions.btWinSize.x); } });

		t.sort_Items();

		t.ModelCity = new CdispCityPicker('pbinventory_city', ById('pbinventory_cityselect'), true, null, null);

		$("pbinventory_general").addEventListener('click', t.display_general, false);
		$("pbinventory_throne").addEventListener('click', t.display_throne, false);
		$("pbinventory_champ").addEventListener('click', t.display_champ, false);
		$("pbinventory_speedup").addEventListener('click', t.display_speedup, false);
		$("pbinventory_combat").addEventListener('click', t.display_combat, false);
		$("pbinventory_resources").addEventListener('click', t.display_resources, false);
		$("pbinventory_chest").addEventListener('click', t.display_chest, false);
		$("pbinventory_court").addEventListener('click', t.display_court, false);
		$("pbinventory_jewels").addEventListener('click', t.display_jewels, false);
		$("pbinventory_alliance").addEventListener('click', t.display_alliance, false);
		$("pbinventory_start").addEventListener('click', t.start, false);
		$("pbinventory_useable").addEventListener('click', t.show, false);
		$("pbinventory_general").click();
	},

	sort_Items: function () {
		var t = Tabs.Inventory;

		t.general = [];
		t.throne = [];
		t.champ = [];
		t.speedup = [];
		t.combat = [];
		t.resources = [];
		t.chest = [];
		t.court = [];
		t.jewels = [];
		t.alliance = [];

		for (var k in uW.ksoItems) {
			var item = uW.ksoItems[k];
			if (item.count > 0) {
				if ((item.category == 0 || item.category == 1) && item.subCategory == 2) { t.throne.push(item); }
				if ((item.category == 0 || item.category == 1) && item.subCategory == 28) { t.champ.push(item); }
				if ((item.category == 1) && item.subCategory != 28 && item.subCategory != 2) { t.general.push(item); }
				if (item.category == 2) { t.speedup.push(item); }
				if (item.category == 3) { t.combat.push(item); }
				if (item.category == 4) { t.resources.push(item); }
				if (item.category == 5) { t.chest.push(item); }
				if (item.category == 6) { t.court.push(item); }
				if (item.category == 7) { t.jewels.push(item); }
				if (item.category == 8) { t.alliance.push(item); }
			}
		}
	},

	display_general: function () {
		var t = Tabs.Inventory;
		t.type = "general";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.general.length; k++) {
			var item = t.general[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_general' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_general_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	display_throne: function () {
		var t = Tabs.Inventory;
		t.type = "throne";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.throne.length; k++) {
			var item = t.throne[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			var spanclass = '';
			if (t.GetInventory(item.id) == 0) { spanclass = 'boldRed'; }
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc " + spanclass + "' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_throne' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_throne_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	display_champ: function () {
		var t = Tabs.Inventory;
		t.type = "champ";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		t.champ.sort(function (a, b) { return Tabs.Reference.UniqueCHItems[a.id].Set - Tabs.Reference.UniqueCHItems[b.id].Set });
		for (var k = 0; k < t.champ.length; k++) {
			var item = t.champ[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			var spanclass = '';
			if (t.GetCHInventory(item.id) == 0) { spanclass = 'boldRed'; }
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc " + spanclass + "' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_champ' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_champ_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	display_speedup: function () {
		var t = Tabs.Inventory;
		t.type = "speedup";
		var div = ById("pbinventory");
		var count = 0;
		var totaltime = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<tr><td align=center colspan=11><b>" + tx('Total Speedup Time') + ":&nbsp;<span id=pbinvspeedtime>&nbsp;</span></b></td></tr>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TH class=xtabHD align=right>" + uW.g_js_strings.commonstr.time + "</td><TD width='20px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TH class=xtabHD align=right>" + uW.g_js_strings.commonstr.time + "</th></tr><TR>";
		for (var k = 0; k < t.speedup.length; k++) {
			var item = t.speedup[k];
			//			if(!item.usable && ById('pbinventory_useable').checked) continue;
			var itemtime = 0;
			if (SpeedupArray[parseInt(item.id) - 1])
				itemtime = SpeedupArray[parseInt(item.id) - 1] * item.count;
			m += (count % 2 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_speedup' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_speedup_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += "<TD align=right>" + ((itemtime != 0) ? uW.timestr(itemtime) : '') + "</td>";
			m += (count % 2 == 1) ? "</tr>" : "";
			count++;
			totaltime = totaltime + itemtime;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		var tm = ById('pbinvspeedtime')
		if (tm) tm.innerHTML = uW.timestr(totaltime);

		t.setEventHandlers();
	},

	display_combat: function () {
		var t = Tabs.Inventory;
		t.type = "combat";
		var div = ById("pbinventory");
		var count = 0;
		var totalmight = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<tr><td align=center colspan=11><b>" + tx('Total Troop Might') + ":&nbsp;<span id=pbinvcombatmight>&nbsp;</span><span id=pbinvselmight>&nbsp;</span></b></td></tr>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TH class=xtabHD align=right>" + tx('Might') + "</td><TD width='20px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TH class=xtabHD align=right>" + tx('Might') + "</th></tr><TR>";
		for (var k = 0; k < t.combat.length; k++) {
			var item = t.combat[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			var might = 0;
			if (boxmightarray[item.id])
				might = boxmightarray[item.id] * item.count;
			m += (count % 2 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_combat' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 class='pb_inv_combat' name=" + item.id + " id='pb_inv_combat_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += "<TD align=right>" + ((might != 0) ? addCommas(might) : '') + "</td>";
			m += (count % 2 == 1) ? "</tr>" : "";
			count++;
			totalmight = totalmight + might;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		var tm = ById('pbinvcombatmight')
		if (tm) tm.innerHTML = addCommas(totalmight);

		t.setEventHandlers();
		t.setCombatEventHandlers();
	},

	display_resources: function () {
		var t = Tabs.Inventory;
		t.type = "resources";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.resources.length; k++) {
			var item = t.resources[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_resources' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_resources_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},
	display_chest: function () {
		var t = Tabs.Inventory;
		t.type = "chest";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.chest.length; k++) {
			var item = t.chest[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_chest' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_chest_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	display_court: function () {
		var t = Tabs.Inventory;
		t.type = "court";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.court.length; k++) {
			var item = t.court[k];
			//			if(!item.usable && ById('pbinventory_useable').checked) continue;
			var spanclass = '';
			if (item.equippable && item.isEquipped) { spanclass = 'boldGreen'; }
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc " + spanclass + "' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_court' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_court_" + item.id + "' disabled /></td>";
			}
			else {
				if (item.equippable) {
					m += "<TD colspan=2><input type=button class='btInput pbinv_equip' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' id='pb_inv_equip_" + item.id + "' value='" + (item.isEquipped ? uW.g_js_strings.commonstr.unequip : uW.g_js_strings.commonstr.equip) + "' /></td>";
				}
				else {
					m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
				}
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
		var nodes = ByCl("pbinv_equip");
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].addEventListener('click', function (e) {
					var item = JSON.parse(e.target.getAttribute("data-ft"));
					t.useCourtItem(item.id);
				}, false);
			}
		}

	},

	display_jewels: function () {
		var t = Tabs.Inventory;
		t.type = "jewel";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='20px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.jewels.length; k++) {
			var item = t.jewels[k];
			if (!item.usable && ById('pbinventory_useable').checked) continue;
			m += (count % 2 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 40) + "</span></td>";
			if (item.usable) {
				m += "<TD><input type=checkbox class='pbinv_jewel' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
				m += "<TD><input type=text size=2 id='pb_inv_jewel_" + item.id + "' disabled /></td>";
			}
			else {
				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 2 == 1) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	display_alliance: function () {
		var t = Tabs.Inventory;
		t.type = "alliance";
		var div = ById("pbinventory");
		var count = 0;
		var m = "<TABLE class=xtab cellspacing=0>";
		m += "<TR><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th><TD width='10px'>&nbsp;</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.nametx + "</th><TH colspan=2 align=left class=xtabHD>&nbsp;" + uW.g_js_strings.commonstr.use + "</th><TH class=xtabHD>" + uW.g_js_strings.commonstr.count + "</th></tr><TR>";
		for (var k = 0; k < t.alliance.length; k++) {
			var item = t.alliance[k];
			//			if(!item.usable && ById('pbinventory_useable').checked) continue; // assume ALL usable, they seem to have messed this up!
			m += (count % 3 == 0) ? "<TR>" : "<TD width='10px'>&nbsp;</td>";
			m += "<TD><img width='20px' height='20px' src='" + getItemImageURL(item.id) + "' /> <span class='tooldesc' id='pb_inv_desc" + item.id + "'>" + item.name.substr(0, 30) + "</span></td>";
			//			if (item.usable) {
			m += "<TD><input type=checkbox class='pbinv_alliance' data-ft='" + JSON.stringify(item).replace(/\'/g, "") + "' /></td>";
			m += "<TD><input type=text size=2 id='pb_inv_alliance_" + item.id + "' disabled /></td>";
			//			}
			//			else {
			//				m += "<TD>&nbsp;</td><TD>&nbsp;</td>";
			//			}
			m += "<TD>" + addCommas(item.count) + "</td>";
			m += (count % 3 == 2) ? "</tr>" : "";
			count++;
		}
		m += "</table>";
		div.innerHTML = (count != 0) ? m : '<br><CENTER>' + tx('No useable items in this category') + '</CENTER><br>';

		t.setEventHandlers();
	},

	setCombatEventHandlers: function () {
		var t = Tabs.Inventory;
		var nodes = ByCl("pb_inv_" + t.type);
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].addEventListener('change', function (e) {
					t.CalculateSelectedMight();
				}, false);
			}
		}
		var nodes = ByCl("pbinv_" + t.type);
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].addEventListener('change', function (e) {
					t.CalculateSelectedMight();
				}, false);
			}
		}
	},

	setEventHandlers: function () {
		var t = Tabs.Inventory;
		var nodes = ByCl("pbinv_" + t.type);
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].addEventListener('click', function (e) {
					var item = JSON.parse(e.target.getAttribute("data-ft"));
					if (e.target.checked) {
						$("pb_inv_" + t.type + "_" + item.id).disabled = false;
						$("pb_inv_" + t.type + "_" + item.id).value = $("pbinventory_useall").checked ? item.count : 1;
					}
					else {
						$("pb_inv_" + t.type + "_" + item.id).disabled = true;
						$("pb_inv_" + t.type + "_" + item.id).value = '';
					}
				}, false);
			}
		}

		// set up tooltips

		var cItems = ById('pbinventory').getElementsByClassName('tooldesc');
		for (var i = 0; i < cItems.length; i++) { t.createToolTip(cItems[i]); }
	},

	createToolTip: function (elem) {
		var t = Tabs.Inventory;
		var h = elem.id.substring(11);
		var TT = "";
		if (uW.ksoItems[h]) { TT = uW.ksoItems[h].description; }
		if (TT != "") {
			jQuery('#' + elem.id).children("span").remove();
			jQuery('#' + elem.id).append('<span class="tooltip" style="white-space: pre-line; word-wrap: break-word;">' + TT + '</span>');
		}
	},

	CalculateSelectedMight: function () {
		var t = Tabs.Inventory;
		var selectedmight = 0;
		var nodes = ByCl("pb_inv_" + t.type);
		if (nodes.length > 0) {
			for (var i = 0; i < nodes.length; i++) {
				var might = 0;
				var item_id = nodes[i].name;
				if (boxmightarray[item_id]) {
					might = boxmightarray[item_id] * parseIntNan(nodes[i].value);
				}
				selectedmight = selectedmight + might;
			}
		}
		var sm = ById('pbinvselmight')
		if (sm) {
			if (selectedmight != 0) { sm.innerHTML = ', ' + tx('Selected Might') + ': ' + addCommas(selectedmight); }
			else { sm.innerHTML = ""; };
		}
	},

	e_total: function () {
		var t = Tabs.Inventory;
		return t.max;
	},

	start: function () {
		var t = Tabs.Inventory;
		t.queue = [];
		var nodes = ByCl("pbinv_" + t.type);
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].checked) {
				try {
					t.queue.push(JSON.parse(nodes[i].getAttribute("data-ft")));
				} catch (e) {
					logerr(e);
				}
			}
		}

		if (t.queue.length > 0) {
			t.isBusy = true;
			t.setCurtain(true);
			var popDiv = t.setPopup(true);
			popDiv.innerHTML = '<TABLE class=xtab width=100% height=100%><TR><TD align=center>\
			<DIV class=divHeader>'+ tx('Using Selected Inventory Items') + '</div>\
			<DIV id=pbinventory_info style="padding:10px; height:225px; max-height:225px; overflow-y:auto"></div>\
			</td></tr><TR><TD align=center>' + strButton20(uW.g_js_strings.commonstr.cancel, 'id=pbInvCancel') + '</td></tr></table>';
			ById('pbInvCancel').addEventListener('click', t.e_Cancel, false);
			t.nextqueue();
		}
	},

	nextqueue: function () {
		var t = Tabs.Inventory;
		if (!t.isBusy)
			return;
		var div = $("pbinventory_info");
		if (t.queue.length > 0) {
			var item = t.queue[0];
			t.counter = 0;
			t.max = parseIntNan($("pb_inv_" + t.type + "_" + item.id).value);
			div.innerHTML = "<span id='pb_inv_info_" + item.id + "'>" + tx('Using item') + " " + item.name + " <span id='pb_inv_info_count_" + item.id + "'>1</span> " + uW.g_js_strings.commonstr.of + " <span id='pb_inv_info_max_" + item.id + "'>" + t.max + "</span>. <span id='pb_inv_info_extra_" + item.id + "'> </span></span><br>" + div.innerHTML;
		} else {
			div.innerHTML = "<span>" + uW.g_js_strings.commonstr.completedexc + "</span><br>" + div.innerHTML;
			ById('pbInvCancel').firstChild.innerHTML = uW.g_js_strings.commonstr.close;
			t.isBusy = false;
			return;
		}

		// special use items - e.g. Merlins Tokens...

		if (uW.itemlist["i" + item.id].subCategory == 100) {
			$("pb_inv_info_count_" + item.id).innerHTML = t.max;
			t.useMysteryChest(item.id, t.max);
		}
		else {
			if (item.id == 599) {
				t.useMerlin();
			}
			else {
				var MultiUse = CM.ItemIdentifier.canUseMultiple(uWCloneInto(item));
				if (item.category == 7) MultiUse = true; // jewels you can multi-use!

				if (item.id == 30130 || item.id == 30131 || item.id == 30132 || item.id == 30133 || item.id == 30134) { // random jewels don't multi-use - do it the old way...
					MultiUse = false;
				}
				if (ItemMultiUseController.ItemController.isAvailable && MultiUse) t.useitem_multi();
				else t.useitem();
			}
		}
	},

	useitem_multi: function () {
		var t = Tabs.Inventory;
		if (!t.isBusy) return;
		var item = t.queue[0];
		$("pb_inv_info_count_" + item.id).innerHTML = t.max;
		ItemMultiUseController.UseItems(item.id, t.max, t.ModelCity.city.id);
		setTimeout(t.wait_new, 250, 0);
	},

	wait_new: function () {
		var t = Tabs.Inventory;
		if (!t.isBusy)
			return;
		var item = t.queue[0];
		item = uW.ksoItems[item.id];
		t.queue[0] = item;
		$("pb_inv_info_extra_" + item.id).innerHTML = tx("Done") + ".";
		t.queue.shift();
		setTimeout(t.nextqueue, 500);
	},

	useitem: function () {
		var t = Tabs.Inventory;
		if (!t.isBusy) { return; }
		var item = t.queue[0];
		if (t.ModelCity.city.id) { //Set to use city specified
			t.city_holder = uW.currentcityid;
			uW.currentcityid = t.ModelCity.city.id;
		}
		CM.ItemController.use(item.id);
		if (t.ModelCity.city.id) { //Set currentcity to old value
			uW.currentcityid = t.city_holder;
		}
		setTimeout(t.wait, 500, 0);
	},

	wait: function (retries) {
		var t = Tabs.Inventory;
		if (!t.isBusy)
			return;
		var item = t.queue[0];
		item = uW.ksoItems[item.id];
		t.queue[0] = item;
		t.counter++;
		$("pb_inv_info_count_" + item.id).innerHTML = t.counter;
		$("pb_inv_info_extra_" + item.id).innerHTML = '(' + (t.max - t.counter) + ' Left)';
		if (t.counter >= t.max) {
			$("pb_inv_info_extra_" + item.id).innerHTML = tx("Done") + ".";
			t.queue.shift();
			setTimeout(t.nextqueue, 1000);
			return;
		}
		$("pb_inv_info_extra_" + item.id).innerHTML = tx("Done") + ". " + tx("Wait for 1 second") + "..";
		if (item.id == 599) {
			setTimeout(t.useMerlin, 500);
		}
		else {
			setTimeout(t.useitem, 500);
		}
	},

	show: function (init) {
		var t = Tabs.Inventory;
		var DispCityId = uW.currentcityid;
		if (init) { DispCityId = InitialCityId; }
		if (t.ModelCityId != DispCityId) {
			t.ModelCity.selectBut(Cities.byID[DispCityId].idx);
			t.ModelCityId = DispCityId;
		}

		t.sort_Items();
		if (t.type == 'general') { t.display_general(); }
		if (t.type == 'throne') { t.display_throne(); }
		if (t.type == 'champ') { t.display_champ(); }
		if (t.type == 'speedup') { t.display_speedup(); }
		if (t.type == 'combat') { t.display_combat(); }
		if (t.type == 'resources') { t.display_resources(); }
		if (t.type == 'chest') { t.display_chest(); }
		if (t.type == 'court') { t.display_court(); }
		if (t.type == 'jewel') { t.display_jewels(); }
		if (t.type == 'alliance') { t.display_alliance(); }
	},

	setPopup: function (onoff) {
		var t = Tabs.Inventory;
		if (onoff) {
			var div = document.createElement('div');
			div.id = 'ptInvPop';
			div.style.backgroundColor = Options.Colors.Panel;
			div.style.zindex = mainPop.div.zIndex + 2;
			div.style.opacity = '1';
			div.style.border = '3px outset black';
			div.style.width = (GlobalOptions.btWinSize.x - 200) + 'px';
			div.style.height = '300px';
			div.style.display = 'block';
			div.style.position = 'absolute';
			div.style.top = '100px';
			div.style.left = '100px';
			t.myDiv.appendChild(div);
			return div;
		} else {
			t.myDiv.removeChild(ById('ptInvPop'));
		}
	},

	setCurtain: function (onoff) {
		var t = Tabs.Inventory;
		if (onoff) {
			var off = getAbsoluteOffsets(t.myDiv);
			var curtain = document.createElement('div');
			curtain.id = 'ptInvCurtain';
			curtain.style.zindex = mainPop.div.zIndex + 1;
			curtain.style.backgroundColor = "#000000";
			curtain.style.opacity = '0.5';
			curtain.style.width = (t.myDiv.clientWidth + 4) + 'px';
			curtain.style.height = (t.myDiv.clientHeight + 4) + 'px';
			curtain.style.display = 'block';
			curtain.style.position = 'absolute';
			curtain.style.top = off.top + 'px';
			curtain.style.left = off.left + 'px';
			t.myDiv.appendChild(curtain);
		} else {
			t.myDiv.removeChild(ById('ptInvCurtain'));
		}
	},

	e_Cancel: function () {
		var t = Tabs.Inventory;
		t.isBusy = false;
		t.setCurtain(false);
		t.setPopup(false);
		t.show();
	},

	useMerlin: function () {
		var t = Tabs.Inventory;
		if (!t.isBusy) { return; }
		var div = $("pbinventory_info");

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.ftflag = 0;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/magicalboxPreview.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					var params = uW.Object.clone(uW.g_ajaxparams);
					new MyAjaxRequest(uW.g_ajaxpath + "ajax/magicalboxPick.php" + uW.g_ajaxsuffix, {
						method: "post",
						parameters: params,
						onSuccess: function (rslt) {
							if (rslt.ok) {
								var itemId = rslt.prize;
								if (Seed.items["i" + itemId]) {
									Seed.items["i" + itemId] = parseInt(Seed.items["i" + itemId]) + 1;
									uW.ksoItems[itemId].add();
								}
								else {
									Seed.items["i" + itemId] = 1;
									uW.ksoItems[itemId].add();
								}
								var NumTokens = parseInt(Seed.items.i599);
								if (NumTokens > 0) {
									NumTokens = NumTokens - 1;
									Seed.items.i599 = (NumTokens).toString();
									uW.ksoItems[599].subtract();
								}
								div.innerHTML = "<span>" + tx('You won') + " " + uW.itemlist["i" + rslt.prize].name + "!</span><br>" + div.innerHTML;
							}
							else {
								div.innerHTML = "<span>" + rslt.msg + "</span><br>" + div.innerHTML;
							}
						}
					}, true);
				}
				else {
					div.innerHTML = "<span>" + rslt.msg + "</span><br>" + div.innerHTML;
				}
			}
		}, true);
		setTimeout(t.wait, 500, 0);
	},

	useMysteryChest: function (itemId, quantity) {
		var t = Tabs.Inventory;
		if (!t.isBusy) { return; }
		var div = $("pbinventory_info");

		function addItemsToSeed(items) {
			jQuery.each(items, function (key, value) {
				if (Seed.items["i" + key]) {
					Seed.items["i" + key] = (parseInt(Seed.items["i" + key]) + parseInt(value)).toString();
					uW.ksoItems[key].add(Number(value))
				} else {
					Seed.items["i" + key] = value.toString();
					uW.ksoItems[key].add(Number(value))
				}
				div.innerHTML = "<span>" + tx('You won') + " " + value + " " + uW.itemlist["i" + key].name + "!</span><br>" + div.innerHTML;
			})
		}

		params = uW.Object.clone(uW.g_ajaxparams);
		params.chestId = itemId;
		params.cid = t.ModelCity.city.id;
		params.quantity = quantity;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/useMysteryChest.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.InventoryView.removeItemFromInventory(itemId, params.quantity);
					addItemsToSeed(uWCloneInto(rslt.items));
				}
				else {
					div.innerHTML = "<span>" + rslt.feedback + "</span><br>" + div.innerHTML;
				}
			},
		}, true);
		setTimeout(t.wait_new, 250, 0);
	},

	useCourtItem: function (itemId) {
		var t = Tabs.Inventory;
		var isEquippedFlag = (uW.ksoItems[itemId].isEquipped) ? 2 : 1;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.item = itemId;
		params.setflag = isEquippedFlag;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/courtSelectItem.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (rslt.ok) {
					CM.Court.unequipOtherCourtItems(itemId);
					if (uW.ksoItems[itemId].isEquipped) {
						uW.ksoItems[itemId].isEquipped = false;
						jQuery.each(Seed.courtItems, function (index, courtItem) {
							if (Number(courtItem) == itemId) {
								Seed.courtItems.splice(index, 1)
							}
						})
					} else {
						uW.ksoItems[itemId].isEquipped = true;
						Seed.courtItems.push(itemId.toString())
					}
					CM.InventoryView.toggleCourtItem(itemId);
					if (jQuery("#courtView")) { uW.changeview_court_content(); }
					uW.update_bdg();
					t.show();
				}
			},
		}, true);
	},

	ShowRandomJewelPrize: function (rslt) {
		var t = Tabs.Inventory;
		var div = $("pbinventory_info");
		if (!div) return;
		if (rslt.ok) {
			var prize = {
				quality: rslt.q,
				id: rslt.e,
				count: rslt.count
			};
			var JName = CM.ThroneController.jewelName(uWCloneInto(prize));
			if (prize.count > 1) JName = prize.count + ' ' + JName;
			div.innerHTML = "<span>" + tx('You won') + " " + JName + "!</span><br>" + div.innerHTML;
		}
		else {
			if (rslt.msg) {
				div.innerHTML = "<span>" + rslt.msg + "</span><br>" + div.innerHTML;
			}
		}
	},

	GetInventory: function (trID) {
		var t = Tabs.Inventory;
		var count = 0;
		for (var k in uW.kocThroneItems) {
			var throne_item = uW.kocThroneItems[k];
			if (throne_item.unique == trID) { count++; }
		}
		return count;
	},

	GetCHInventory: function (chID) {
		var t = Tabs.Inventory;
		var count = 0;
		for (var k in uW.kocChampionItems) {
			var champ_item = uW.kocChampionItems[k];
			if (champ_item.unique == chID) { count++; }
		}
		return count;
	},

}
