function SwitchThroneRoom(preset, dash) {
	var NewPreset = preset;
	if (NewPreset == Seed.throne.activeSlot) { return; }

	clearTimeout(presetTimer);

	var params = uW.Object.clone(uW.g_ajaxparams);
	params.ctrl = 'throneRoom\\ThroneRoomServiceAjax';
	params.action = 'setPreset';
	params.presetId = NewPreset;
	new MyAjaxRequest(uW.g_ajaxpath + "ajax/_dispatch53.php" + uW.g_ajaxsuffix, {
		method: "post",
		parameters: params,
		loading: true,
		onSuccess: function (rslt) {
			if (rslt.ok) {
				// changed the way this works because lots of people having trouble...

				if (ById('throneStatList')) {
					button = '#throneInventoryPreset' + NewPreset;
					CM.ThroneView.clickActivePreset(button);
					if (Tabs.Throne) { Tabs.Throne.paintTags(); Tabs.Throne.ModifyEvents(); }
				}
				else {
					Seed.throne.activeSlot = NewPreset;
					var L = Seed.throne.slotEquip[NewPreset];
					jQuery.each(uW.kocThroneItems, function (M, N) {
						G = jQuery.inArray(N.id, L) > -1;
						if (G) { N.isEquipped = true; }
						else { N.isEquipped = false; }
					});
					CM.ThroneView.renderThrone();
					CM.ThroneView.renderStats();
					CM.ThroneView.renderInventory(uW.kocThroneItems);
				}
				presetFailures = 0;
				if (dash) {
					// need to delay 5 seconds before allowing again
					Dashboard.ThroneDelay = 5;
					Dashboard.PaintTRPresets();
				}
			}
			else { // retry?
				presetFailures++;
				actionLog("Preset change failed. Error code: " + rslt.error_code, 'GENERAL');
				// try again in 2 seconds
				if (presetFailures <= 3) {
					if (dash) {
						Dashboard.ThroneDelay = 0;
						Dashboard.PaintTRPresets();
						Dashboard.setThroneMessage('<span style="color:#f80">' + tx('Failed to change Throne Room - Retrying') + ' (' + presetFailures + ') ...</span>');
					}
					presetTimer = setTimeout(function () { SwitchThroneRoom(preset, dash) }, 2000);
				}
				else {
					presetFailures = 0;
					if (dash) {
						Dashboard.setThroneMessage('<span style="color:#f00">' + tx('Could not change Throne Room') + '.</span>');
					}
				}
			}
		},
		onFailure: function () {
			actionLog("Preset change server error", 'GENERAL');
			presetFailures = 0;
			if (dash) {
				Dashboard.ThroneDelay = 0;
				Dashboard.PaintTRPresets();
				Dashboard.setThroneMessage('<span style="color:#f00">' + tx('Server connection failed') + '.</span>');
			}
		},
	}, true); // noretry
};

function ArcanaEnabled() {
	return (Seed.allianceHQ && Seed.allianceHQ.arcana && Seed.allianceHQ.buildings[3] && Seed.allianceHQ.buildings[3].buildingLevel && Seed.allianceHQ.buildings[3].buildingLevel != 0);
}
