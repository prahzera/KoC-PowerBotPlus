function getItemImageURL(id) {
	var s = "";
	if (id == 999) {
		s = IMGURL + "dailyRewards/question_mark.jpg"
	} else {
		if (CM.MASTERS_TOKEN_LEVELS[id]) {
			if (CM.MASTERS_TOKEN_LEVELS[id] >= 50) { s = IMGURL + "items/70/masters_token_bg_new.png"; }
			else { s = IMGURL + "items/70/masters_token_bg.png"; }
		} else {
			if (CM.ItemController.isJewelId(id)) {
				var jewel = CM.ItemController.isJewelId(id);
				s = CM.ThronePanelView.getJewelIcon(jewel.quality, CM.ThroneController.jewelType(jewel));
			} else {
				if (CM.ItemController.isMysteryId(id)) {
					s = IMGURL + "items/70/30303.jpg"
				} else {
					if ((id >= 11001) && (id <= 11010)) {
						s = IMGURL + "items/70/bossBattleChest_victor.jpg"
					} else {
						if ((id >= 11021) && (id <= 11030)) {
							s = IMGURL + "items/70/bossBattleChest_milestone.jpg"
						} else {
							s = IMGURL + "items/70/" + id + ".jpg"
						}
					}
				}
			}
		}
	}
	return s
}

function itemTitle(id, nocount) {
	var s = "";
	var count = 0;
	if (uW.itemlist["i" + id]) {
		s += uW.itemlist["i" + id].name;
		if (!nocount) {
			if (uW.ksoItems[id]) { count = uW.ksoItems[id].count; }
			s += ' (' + count + ') ';
		}
		s += '\n' + uW.itemlist["i" + id].description;
	}
	return s;
}
