var LoadCapFix = {
	init: function () {
		var t = LoadCapFix;
		try {
			if (!NoRegEx) {
				t.capLoadEffect = new CalterUwFunc('cm.MarchModal.updateTroopResource', [
					[/\$\("#modal/ig, 'jQuery("#modal'],
					[/if\(jQuery/i, 'loadBoost = Math.min(loadBoost,(cm.thronestats.boosts.Load.Max/100)+techLoadBoost); for(var sacIndex = 0; sacIndex < seed.queue_sacr["city" + currentcityid].length; sacIndex ++ ) if(seed.queue_sacr["city" + currentcityid][sacIndex]["unitType"] == untid) unit_number *= seed.queue_sacr["city" + currentcityid][sacIndex]["multiplier"][0]; if(jQuery'],
					[/var\s*resources/i, 'load=load-1;var resources']
				]);
			}
			else {
				t.capLoadEffect = new CalterUwFunc('cm.MarchModal.updateTroopResource', [
					[/\$\("#modal/ig, 'jQuery("#modal'],
					['if (jQuery', 'loadBoost = Math.min(loadBoost,(cm.thronestats.boosts.Load.Max/100)+techLoadBoost); for(var sacIndex = 0; sacIndex < seed.queue_sacr["city" + currentcityid].length; sacIndex ++ ) if(seed.queue_sacr["city" + currentcityid][sacIndex]["unitType"] == untid) unit_number *= seed.queue_sacr["city" + currentcityid][sacIndex]["multiplier"][0]; if(jQuery'],
					['var resources', 'load=load-1;var resources']
				]);
			}
			t.capLoadEffect.setEnable(Options.fixLoadCap);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = LoadCapFix;
		t.capLoadEffect.setEnable(tf);
	},
	isAvailable: function () {
		var t = LoadCapFix;
		return t.capLoadEffect.isAvailable();
	},
}

var TRAetherCostFix = {
	aethercostFix: null,
	init: function () {
		t = TRAetherCostFix;

		try {
			t.aethercostFix = new CalterUwFunc('cm.ThronePanelController.calcCost', [
				[/if\(k\(/im, 'if(cm.ThronePanelController.isLastLevel('],
				[/E\.stones\.use\s*=\s*E\.stones\.total/im, 'E.stones.use = B'],
				[/if\(E\.stones\.use\s*==/im, 'if(E.stones.use >='],
				[/E\.gems\.use\s*=\s*b\(E\.stones\.total\s*-\s*B\)/im, 'var xx = + (cm.WorldSettings.getSetting("TR_AETHERSTONE_CONVERSION_COST")), y; E.gems.use = Math.ceil((E.stones.total - B)/xx)'],
				[/E\.gems\.use\s*=\s*b\(z\[D]\.Stones\)/im, 'var xx = + (cm.WorldSettings.getSetting("TR_AETHERSTONE_CONVERSION_COST")), y; E.gems.use = Math.ceil((z[D].Stones)/xx)'],
			]);
			t.aethercostFix.setEnable(Options.fixTRAetherCost);
			if (NoRegEx) {
				t.aethercostFixCB = new CalterUwFunc('cm.ThronePanelController.calcCost', [
					[/if\s*\(k\(/im, 'if(cm.ThronePanelController.isLastLevel('], //fix for cometbird
					[/if\s*\(E\.stones\.use\s*==/im, 'if(E.stones.use >=']
				]); //fix for cometbird
				t.aethercostFixCB.setEnable(Options.fixTRAetherCost);
			}
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = TRAetherCostFix;
		t.aethercostFix.setEnable(tf);
		if (NoRegEx) {
			t.aethercostFixCB.setEnable(tf);
		}
	},
	isAvailable: function () {
		var t = TRAetherCostFix;
		if (!NoRegEx) {
			return t.aethercostFix.isAvailable();
		}
		else {
			return (t.aethercostFix.isAvailable() && t.aethercostFixCB.isAvailable());
		}
	},
}
var mmbImageFix = {
	imageFix: null,
	init: function () {
		t = mmbImageFix;

		try {
			t.imageFix = new CalterUwFunc('cm.mww.mmb_share', [
				[/img\/items\/130/im, 'img/items/70/'],
				[/common_postToProfile\(\"85\"/im, 'template_data_85.img1=template_data_85.media[0].src; common_postToProfile(\"85\"']
			]);
			t.imageFix.setEnable(Options.fixMMBImage);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	setEnable: function (tf) {
		var t = mmbImageFix;
		t.imageFix.setEnable(tf);
	},
	isAvailable: function () {
		var t = mmbImageFix;
		return t.imageFix.isAvailable();
	},
}
