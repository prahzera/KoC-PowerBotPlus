function DrawLevelIcons() {
	var mapwindow = ById('mapwindow');
	if (!mapwindow) return;
	var mapinfo = ById('mapinfodone');
	if (mapinfo) { return; };

	var ss = document.evaluate(".//a[contains(@class,'slot')]", mapwindow, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var mapinfodone = false;
	for (var s = 0; s < ss.snapshotLength; s++) {
		var a = ss.snapshotItem(s);
		var onclick = a.getAttribute('id');
		var owner = '';
		if (onclick) {
			var tileinfo = uW.g_mapObject.model.getTileActions(onclick)["tileClick"];
			if (tileinfo) {
				if (!TileOriginChecked) {
					var TileOffset = tileinfo.tileid - CalculateTileId(tileinfo.xcoord, tileinfo.ycoord);
					if (TileOffset != 0) {
						TileOrigin = TileOrigin + TileOffset;
					}
					TileOriginChecked = true;
				}

				var might = parseInt(tileinfo.might);
				var alliance = parseIntNan(tileinfo.allianceId);
				var dip = getDiplomacy(alliance);
				owner = tileinfo.username;
			}
		}
		var sp = a.getElementsByTagName('span');
		if (sp.length == 0) continue;

		if (!mapinfodone) { sp[0].id = 'mapinfodone'; mapinfodone = true; }
		spancol = '#cc0';

		if (alliance == 'null' && tileinfo.type == "city") spancol = '#33CCFF';
		if (dip == 'hostile' && tileinfo.type == "city") spancol = '#FF0000';
		if (tileinfo.type != "city" && tileinfo.tileuserid != "null") spancol = '#FF9900';
		if (tileinfo.type != "city" && tileinfo.tileuserid == "null") spancol = '#CC0033';

		if (Options.MapShowExtra && !CoordBox.MapZoom) {
			if (tileinfo.username != "null")
				sp[0].outerHTML = sp[0].outerHTML + '<div style="color:' + spancol + ';font-size:11px;text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;' + owner + '</div><div style="color:' + spancol + ';font-size:10px;text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;Might:' + addCommas(might) + '</div>';
		}
		if (Options.MapShowLevel && (parseIntNan(tileinfo.level) != 0)) {
			sp[0].outerHTML = sp[0].outerHTML + '<div style="color:' + spancol + ';text-shadow: 2px 2px 2px #000;" align="left">&nbsp;&nbsp;' + tileinfo.level + '&nbsp;&nbsp;</div>';
		}
	}
}
