/** Might Breakdown Popup **/

function ShowMightBreakdown() {

	function PlayerCourtCallBack(rslt) {

		var MightPop = null;
		var m = '<table class=xtab align=center>';

		if (rslt.playerInfo) {
			m += '<tr><TD>' + uW.g_js_strings.commonstr.might + ':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.might)) + '</b></td></tr>';
			m += '<tr><TD>' + tx('Classic Might') + ':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.mightClassic)) + '</b></td></tr>';
			if (Options.ShowGloryMight) {
				m += '<tr><TD>' + tx('Glory Might') + ':&nbsp;</td><TD><b>' + addCommas(Math.round(rslt.playerInfo.mightGlory)) + '</b></td></tr>';
			}
		}
		else {
			m += '<tr><td>' + (rslt.errorMsg || tx('No Data')) + '</td></tr>';
		}
		m += '</table>'

		// cities

		var rownum = 1;

		m += '<div class="divHeader" align="center">' + tx('CITIES') + '</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0>\
			<TR align=center><TD class=xtab><B></B></td><TD class=xtabHL colspan=4><B>'+ tx('BUILDINGS') + '</b></td><TD class=xtabHL colspan=3><B>' + tx('TROOPS') + '</b></td><TD class=xtabHL><B>' + tx('TOTAL') + '</b></td></tr>\
			<TR valign=bottom align=right><TD class=xtab></td><TD class=xtabHL>'+ uW.g_js_strings.commonstr.buildings + '</td><TD class=xtabH>' + tx('Fortifications') + '</td><TD class=xtabH>' + tx('Def. Tower') + '</td><TD class=xtabH>' + tx('Redoubt Tower') + '</td>\
			<TD class=xtabHL>'+ tx('Sanctuary') + '</td><TD class=xtabH>' + tx('Defending') + '</td><TD class=xtabH>' + tx('Marching') + '</td><TD class=xtabHL>&nbsp;</td></tr>\
			<TR style="height:1px;"><TD style="padding:0px; spacing:0px; height:1px; border-color:black; border-width: 1px; border-style: none none solid none" colspan=9></td></tr>';

		var mightarray = [0, 0, 0, 0, 0, 0, 0, 0];
		var totalarray = [0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 1; i <= Cities.numCities; i++) {
			var cityId = Cities.cities[i - 1].id;
			var afactor = 1;
			if (Seed.cityData.city[cityId].isPrestigeCity) {
				var l = Seed.cityData.city[cityId].prestigeInfo.prestigeLevel;
				if (l > 0) { afactor = Math.pow(CM.PrestigeModel.buildingBoost, l); }
			}
			if (++rownum % 2) { rsty = 'evenRow'; }
			else { rsty = 'oddRow'; }

			mightarray = [0, 0, 0, 0, 0, 0, 0, 0];

			for (var y in Seed.buildings['city' + cityId]) {
				var b = Seed.buildings['city' + cityId][y];
				var btype = parseInt(b[0]);
				var blvl = parseInt(b[1]);
				var bpos = parseInt(b[2]);
				var might = 0;
				if (uW.buildingmight[btype]) {
					for (var l in uW.buildingmight[btype]) {
						if (l < blvl) {
							might += Math.ceil(uW.buildingmight[btype][l] * afactor);
						}
					}
				}

				if (bpos == 99) {
					mightarray[2] += might;
				}
				else {
					if (bpos == 98) {
						mightarray[3] += might;
					}
					else {
						mightarray[0] += might;
					}
				}
				mightarray[7] += might;
			}

			for (var tt in Seed.fortifications['city' + cityId]) {
				var might = parseIntNan(Seed.fortifications['city' + cityId][tt]) * parseInt(fortmight["f" + tt.split("fort")[1]]);
				mightarray[1] += might;
				mightarray[7] += might;
			}
			for (var tt in Seed.units['city' + cityId]) {
				var might = parseIntNan(Seed.units['city' + cityId][tt]) * parseInt(uW.unitmight[tt]);
				mightarray[4] += might;
				mightarray[7] += might;
			}
			if (SelectiveDefending) {
				for (var tt in Seed.defunits['city' + cityId]) {
					var might = parseIntNan(Seed.defunits['city' + cityId][tt]) * parseInt(uW.unitmight[tt]);
					mightarray[5] += might;
					mightarray[7] += might;
				}
			}
			for (var k in Seed.queue_atkp['city' + cityId]) { // each march from city
				var march = local_atkp[k];
				if (typeof (march) == 'object') {
					for (var ui in CM.UNIT_TYPES) {
						ii = CM.UNIT_TYPES[ui];
						var might = parseIntNan(march['unit' + ii + 'Count']) * parseInt(uW.unitmight['unt' + ii]);
						mightarray[6] += might;
						mightarray[7] += might;
					}
				}
			}

			u += '<TR class="' + rsty + '" align=right><TD class=xtab align=left><B>' + Cities.cities[i - 1].name.substring(0, 12) + '</b></td><TD class=xtabL>' + addCommas(mightarray[0]) + '</td><TD class=xtab>' + addCommas(mightarray[1]) + '</td>\
				<TD class=xtab>' + addCommas(mightarray[2]) + '</td><TD class=xtab>' + addCommas(mightarray[3]) + '</td><TD class=xtabL>' + addCommas(mightarray[4]) + '</td><TD class=xtab>' + addCommas(mightarray[5]) + '</td><TD class=xtab>' + addCommas(mightarray[6]) + '</td><TD class=xtabL>' + addCommas(mightarray[7]) + '</td></tr>';
			for (var t in totalarray) {
				totalarray[t] += mightarray[t];
			}
		}
		u += '<TR class=xtabLine><TD colspan=9 class=xtabLine></td></tr>';
		if (++rownum % 2) { rsty = 'evenRow'; }
		else { rsty = 'oddRow'; }
		u += '<TR class="' + rsty + '" align=right><TD class=xtab align=left><B>' + tx('TOTAL') + '</b></td><TD class=xtabL>' + addCommas(totalarray[0]) + '</td><TD class=xtab>' + addCommas(totalarray[1]) + '</td>\
			<TD class=xtab>' + addCommas(totalarray[2]) + '</td><TD class=xtab>' + addCommas(totalarray[3]) + '</td><TD class=xtabL>' + addCommas(totalarray[4]) + '</td><TD class=xtab>' + addCommas(totalarray[5]) + '</td><TD class=xtab>' + addCommas(totalarray[6]) + '</td><TD class=xtabL>' + addCommas(totalarray[7]) + '</td></tr>';
		u += '<TR class=xtabLine><TD colspan=9 class=xtabLine></td></tr>';

		m += u + '</table></div><br>';

		//champs

		var rownum = 1;
		var champs = {};
		mightarray = [];
		var totalmight = 0;
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				champs[Seed.champion.champions[y].championId] = y;
				mightarray.push(0);
			}
		}
		mightarray.push(0); // unassigned
		mightarray.push(0); // broken
		for (var z in uW.kocChampionItems) {
			var item = uW.kocChampionItems[z];
			if (!item.quality) item.quality = parseIntNan(item.rarity);
			item.level = parseIntNan(item.level);
			var might = CardMight(item, true);
			if (item.status == 1) {
				if (item.equippedTo && champs[item.equippedTo]) {
					mightarray[champs[item.equippedTo]] += might;
				}
				else {
					mightarray[mightarray.length - 2] += might; // unassigned
				}
			}
			else {
				mightarray[mightarray.length - 1] += might; // broken
			}
			totalmight += might;
		}

		m += '<div class="divHeader" align="center">' + tx('CHAMPION HALL') + '</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				var champcity = '<i>Unassigned</i>';
				if (Seed.champion.champions[y].assignedCity && Cities.byID[Seed.champion.champions[y].assignedCity]) {
					champcity = Cities.byID[Seed.champion.champions[y].assignedCity].name;
				}
				u += '<td class=xtabBorder nowrap><b>' + Seed.champion.champions[y].name + '</b><br>' + champcity + '</td>';
			}
		}
		u += '<td class=xtabBorder><b>' + tx('Unassigned') + '</b></td><td class=xtabBorder><b>' + tx('Broken') + '</b></td><td class=xtabBorder><b>' + tx('Total') + '</b></td></tr><tr align=center>';
		for (var y in Seed.champion.champions) {
			if (Seed.champion.champions[y].championId) {
				u += '<td class=xtabBorder>' + addCommas(mightarray[y]) + '</td>';
			}
		}
		u += '<td class=xtabBorder>' + addCommas(mightarray[mightarray.length - 2]) + '</td><td class=xtabBorder><span class=boldRed>' + addCommas(mightarray[mightarray.length - 1]) + '</span></td><td class=xtabBorder>' + addCommas(totalmight) + '</td></tr>';

		m += u + '</table></div><br>';

		//throne

		var rownum = 1;
		var throne = {};
		mightarray = [];
		var totalmight = 0;
		var numslots = Seed.throne.slotNum;
		for (var y = 1; y <= numslots; y++) {
			mightarray.push(0);
		}
		mightarray.push(0); // unassigned
		mightarray.push(0); // broken

		if (matTypeof(Seed.throne.inventory) == 'object') {
			for (var z in Seed.throne.inventory) {
				var item = Seed.throne.inventory[z];
				var might = CardMight(item);
				if (item.status == 1) {
					var InPreset = false;
					for (var y in Seed.throne.slotEquip) {
						if (Seed.throne.slotEquip[y].indexOf(item.id) != -1) {
							InPreset = true;
							mightarray[y - 1] += might;
						}
					}
					if (!InPreset) {
						mightarray[mightarray.length - 2] += might; // unassigned
					}
				}
				else {
					mightarray[mightarray.length - 1] += might; // broken
				}
				totalmight += might;
			}
		}

		m += '<div class="divHeader" align="center">' + tx('THRONE ROOM') + '</div>';
		m += '<div><br>';

		var u = '<TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';
		u += '<td class=xtabBorder><b>' + tx('Unassigned') + '</b></td><td class=xtabBorder><b>' + tx('Broken') + '</b></td><td class=xtabBorder><b>' + tx('Total') + '</b></td></tr><tr align=center valign=top>';
		u += '<td class=xtabBorder>' + addCommas(mightarray[mightarray.length - 2]) + '</td><td class=xtabBorder><span class=boldRed>' + addCommas(mightarray[mightarray.length - 1]) + '</span></td><td class=xtabBorder>' + addCommas(totalmight) + '</td></tr>';
		u += '</table><br><TABLE align=center cellpadding=1 cellspacing=0 style="border-collapse:collapse;"><tr align=center valign=top>';

		var startslot = 1;
		var numrow = 6;
		while (startslot < numslots) {
			for (var y = startslot; y <= numslots; y++) {
				if (y > startslot + numrow) { break; }
				var presetname = (Options.DashboardOptions.TRPresets[y] ? Options.DashboardOptions.TRPresets[y].name : 'Preset ' + y);
				var active = '';
				if (y == Seed.throne.activeSlot) active = '<span class=boldGreen>(' + tx('Active') + ')</span>';
				u += '<td class=xtabBorder nowrap><b>' + presetname + '</b><br>' + active + '</td>';
			}
			u += '</tr><tr align=center valign=top>';
			for (var y = startslot; y <= numslots; y++) {
				if (y > startslot + numrow) {
					startslot = y;
					break;
				}
				u += '<td class=xtabBorder>' + addCommas(mightarray[y - 1]) + '</td>';
			}
			u += '</tr><tr align=center valign=top><td class=xtab colspan=' + numrow + ' style="border:none;">&nbsp;</td></tr>';
			if (y >= numslots) { startslot = numslots; } else { u += '<tr align=center valign=top>'; }
		}

		m += u + '</table></div>';

		m += '<div class="divHeader" align="center">' + tx('OTHER MIGHT') + '</div>';
		m += '<div><br>';

		var QM = 0;
		for (var q in Seed.quests) {
			if (Seed.quests[q] == 1) {
				var R = uW.questlist[q].reward;
				if (parseInt(R[3][1]) != 0) {
					QM += parseInt(R[3][1]);
				}
			}
		}
		var u = '<TABLE align=center cellpadding=0 cellspacing=0><tr align=center valign=top>';
		u += '<td class=xtab align=right><b>' + tx('Quest Rewards') + ':&nbsp;</b></td><td class=xtab align=left>' + addCommas(QM) + '</td></tr></table>';

		m += u + '</div>';

		m += '<div align=center><br>' + strButton20(tx('Refresh'), 'id=ptmightrefresh') + '<br></div>';

		var off = getAbsoluteOffsets(ById('btMightPop'));
		MightPop = new CPopup('btShowMight', off.left, off.top, 600, 500, true);
		MightPop.getTopDiv().innerHTML = '<DIV align=center><B>' + tx('Might Breakdown') + '</B></DIV>';
		MightPop.getMainDiv().innerHTML = m;
		ById('ptmightrefresh').addEventListener('click', ShowMightBreakdown, false);
		MightPop.show(true);
		ResetFrameSize('btShowMight', 500, 600);
	}

	// get court might values from server

	fetchPlayerCourt(uW.tvuid, PlayerCourtCallBack);
}
