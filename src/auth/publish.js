function HandlePublishPopup() {
	var myregexp = /USER_ID\"\:\"([0-9]+)"/;
	var match = myregexp.exec(document.documentElement.outerHTML)[1];
	if (!match) {
		myregexp = /ACCOUNT_ID\"\:\"([0-9]+)"/;
		match = myregexp.exec(document.documentElement.outerHTML)[1];
	}
	if (!match) { return; }
	readUserOptions(match);

	if (UserOptions.autoPublishGamePopups || UserOptions.autoCancelGamePopups) {
		var FBInputForm = ById('uiserver_form');
		if (!FBInputForm) FBInputForm = ById('platformDialogForm');
		if (FBInputForm) {
			CheckPublish(FBInputForm);
		}
	}
	setTimeout(HandlePublishPopup, 1000);
}

function HandleInlinePublishPopup() {
	var FBInputForm = ById('platformDialogForm');
	if (FBInputForm) {
		var myregexp = /&amp;to=([0-9]+)&/;
		var match = myregexp.exec(document.documentElement.outerHTML)[1];
		if (match) {
			readUserOptions(match);
			if (UserOptions.autoPublishGamePopups || UserOptions.autoCancelGamePopups) {
				CheckPublish(FBInputForm);
			}
		}
	}
	setTimeout(HandleInlinePublishPopup, 1000);
}

function CheckPublish(FBInputForm) {
	var channel_input = nHtml.FindByXPath(FBInputForm, ".//input[contains(@name,'app_id')]");
	if (channel_input) {
		var current_app_id = channel_input.value;
		if (current_app_id == "130402594779") { // koc
			var publish_button = nHtml.FindByXPath(FBInputForm, ".//input[@type='submit' and contains(@name,'publish')]");
			if (!publish_button) publish_button = nHtml.FindByXPath(FBInputForm, ".//button[@type='submit' and contains(@name,'__CONFIRM__')]");
			var cancel_publish_button = nHtml.FindByXPath(FBInputForm, ".//input[@type='submit' and contains(@name,'cancel')]");
			if (!cancel_publish_button) cancel_publish_button = nHtml.FindByXPath(FBInputForm, ".//button[@type='submit' and contains(@name,'__CANCEL__')]");
			var privacy_setting = nHtml.FindByXPath(FBInputForm, ".//select[@name='audience[0][value]']");
			var privacy_input = nHtml.FindByXPath(FBInputForm, ".//input[@name='privacyx']");
			if (UserOptions.autoPublishGamePopups) {
				if (publish_button) {
					if (privacy_setting) {
						// 80: Everyone
						// 50: Friends of Friends
						// 40: Friends Only
						// 10: Only Me
						// 99: Custom List
						var PublishList = UserOptions.autoPublishPrivacySetting;
						if (PublishList == 99) {
							if (UserOptions.CustomListId != 0) { PublishList = UserOptions.CustomListId; }
							else { PublishList = 10; } // default to only me if no list
						}
						privacy_setting.innerHTML = '<option value="' + PublishList + '"></option>';
						privacy_setting.selectedIndex = 0;
					}
					else {
						if (privacy_input) {
							// new facebook audience crap - translate option to new value
							var PublishList = UserOptions.autoPublishPrivacySetting;
							if (PublishList == 99) {
								if (UserOptions.CustomListId != 0) { PublishList = UserOptions.CustomListId; }
								else { PublishList = TranslatePublish[10]; } // default to only me if no list
							}
							else {
								PublishList = TranslatePublish[PublishList] || TranslatePublish[10];
							}
							privacy_input.value = PublishList;
						}
					}
					publish_button.click();
					setTimeout(CheckHideFBDialogs, 1500);
					return;
				}
			} else if (UserOptions.autoCancelGamePopups) {
				if (cancel_publish_button) {
					cancel_publish_button.click();
					setTimeout(CheckHideFBDialogs, 1500);
					return;
				}
			}
		}
	}
};
