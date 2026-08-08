function CheckTokenCollection() {
	LoadChecker(false);
	var user_id = uW.user_id;
	if (user_id) {
		readUserOptions(user_id);
	}
	var UserDomain = getTokenServerId();

	if (GlobalOptions.TokenEnabled && !giftAccepted) {
		var CheckTokenFunc = function (e) {
			if (giftAccepted) { return; }
			// Find the gift claiming container div
			var claim_gift = ById('claimgift');
			if (!claim_gift) { claim_gift = ById('claimhelp'); }
			if (!claim_gift) { setTimeout(CheckTokenFunc, 1000); return; }

			// Look for the select drop-down
			var domain_selector = ById('serverid');
			// Look for the next button
			var next_button1 = nHtml.FindByXPath(claim_gift, ".//a[contains(@onclick,'checkServer')]");
			var next_button2 = nHtml.FindByXPath(claim_gift, ".//a[@class='nextbtn']");
			var next_button3 = nHtml.FindByXPath(claim_gift, ".//a[contains(@onclick,'claimhelpform')]");
			var back_button = nHtml.FindByXPath(claim_gift, ".//a");
			if (domain_selector && (next_button1 || next_button2)) {
				for (var i = 0; i < domain_selector.options.length; i++) {
					if (domain_selector.options[i].value == UserDomain) {
						domain_selector.selectedIndex = i;
						logit("Merlins Token collected :)");
						giftAccepted = true;
						CheckTokenDay(user_id);
						if (document.URL.search(/merlinShare_src.php/i) != -1) { UserOptions.TokenCollected = true; UserOptions.TokenRequest = 'TOKEN'; }
						if (document.URL.search(/accepttoken_src.php/i) != -1) { UserOptions.BuildCollected = true; UserOptions.TokenRequest = 'BUILD'; }
						if (document.URL.search(/claimVictoryToken_src.php/i) != -1) {
							if (parseIntNan(getFeedServerId()) == parseIntNan(UserDomain)) { UserOptions.BonusCollected = true; }
							else { UserOptions.ChestCollected[getFeedServerId()] = true; }
							UserOptions.TokenRequest = 'CHEST';
						}
						UserOptions.TokenCount = UserOptions.TokenCount + 1;
						UserOptions.TokenResponse = 'OK';
						UserOptions.TokenSuccessLink = GlobalOptions.LastTopURL;
						saveUserOptions(user_id);

						if (next_button1) { nHtml.Click(next_button1); }
						else { nHtml.Click(next_button2); }
						return;
					}
				}
			}
			else {
				if (next_button3) { nHtml.Click(next_button3); }
				else {
					if (next_button2 || back_button) {
						logit("Merlins Token could not be collected :(");

						UserOptions.TokenResponse = 'FAILED';
						saveUserOptions(user_id);

						var a = document.createElement('div');
						a.innerHTML = '<div align=center><br><i>' + tx('Merlins Token could not be collected') + '.<br>(' + tx('KofC will automatically reload in 10 seconds') + ')</i></div>';
						var claim_help_bdy = nHtml.FindByXPath(claim_gift, ".//div[contains(@class,'helpbodycontent')]");
						if (!claim_help_bdy)
							claim_help_bdy = nHtml.FindByXPath(claim_gift, ".//div[@class='claimhelpbdy']");

						if (claim_help_bdy) { claim_help_bdy.appendChild(a); }
						else { claim_gift.appendChild(a); }

						var goto1 = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + UserDomain;
						if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto1 = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + UserDomain; }

						if (document.URL.search(/page=friendFeed/i) > 0) {
							if (claim_gift.textContent.indexOf("Someone else has claimed this bonus.") > -1 ||
								claim_gift.textContent.indexOf("You have already claimed this") > -1 ||
								claim_gift.textContent.indexOf("You have followed an invalid feed link") > -1) {
								UserOptions.TokenResponse = 'USED';
							}
							else {
								UserOptions.TokenResponse = 'BAD (' + getFeedServerId() + ')';
								UserOptions.BadChestDomains[getFeedServerId()] = true;
							}
							saveUserOptions(user_id);
						}
						if (document.URL.search(/accepttoken_src.php/i) > 0) {
							if (claim_gift.textContent.indexOf("You are not eligible") > -1) {
								UserOptions.TokenResponse = 'EXPIRED';
								saveUserOptions(user_id);
							}
						}
						setTimeout(function () { window.top.location = goto1; }, 10000);
					}
					else {
						if (domain_selector == null && (typeof unsafeWindow.checkServer == 'function')) {
							logit("Suspected Blank Decree page...");
							var FeedID = getFeedId();
							var goto_null = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + UserDomain;
							if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto_null = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?s=' + UserDomain; }
							if (FeedID != 'n/a') {
								goto_null = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?f=' + FeedID + '&t=118&lang=en&f=' + FeedID + '&t=118&in=' + getFeedUserId() + '&si=118&s=' + UserDomain;
								if (CheckStandAlone(GlobalOptions.LastTopURL)) { goto_null = window.location.protocol + '//apps.facebook.com/kingdomsofcamelot/?f=' + FeedID + '&t=118&lang=en&f=' + FeedID + '&t=118&in=' + getFeedUserId() + '&si=118&s=' + UserDomain; }
								logit("Merlins Token collected :)");
								giftAccepted = true;
								CheckTokenDay(user_id);
								if (document.URL.search(/merlinShare_src.php/i) != -1) { UserOptions.TokenCollected = true; UserOptions.TokenRequest = 'TOKEN'; }
								if (document.URL.search(/accepttoken_src.php/i) != -1) { UserOptions.BuildCollected = true; UserOptions.TokenRequest = 'BUILD'; }
								if (document.URL.search(/claimVictoryToken_src.php/i) != -1) { UserOptions.ChestCollected[getFeedServerId()] = true; UserOptions.TokenRequest = 'CHEST'; }
								UserOptions.TokenCount = UserOptions.TokenCount + 1;
								UserOptions.TokenResponse = 'OK';
								UserOptions.TokenSuccessLink = GlobalOptions.LastTopURL;
								saveUserOptions(user_id);
								window.top.location = goto_null;
							} else {
								var a = document.createElement('div');
								a.innerHTML = '<div align=center><br><b>' + tx('Token Id not found') + '.</b><br><br><i>' + tx('Merlins Token could not be collected') + '.<br>(' + tx('KofC will automatically reload in 10 seconds') + ')</i></div>';
								claim_gift.appendChild(a);
								if (UserOptions.TokenResponse == "") {
									UserOptions.TokenResponse = 'USED'; // assume used token..
									saveUserOptions(user_id);
								}
								setTimeout(function () { window.top.location = goto_null; }, 10000);
							}
						}
					}
				}
			}
		}
		CheckTokenFunc();
	}
}

function CheckTokenDay(user_id) {
	var date = new Date();
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	var offset = -8 + (getDST(date) / 3600);
	var today = new Date(utc + (3600000 * offset));
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10) { dd = '0' + dd }
	if (mm < 10) { mm = '0' + mm }
	today = dd + '/' + mm + '/' + yyyy;
	if (today != UserOptions.TokenDate) {
		UserOptions.TokenDate = today;
		UserOptions.TokenCount = 0;
		UserOptions.TokenCollected = false;
		UserOptions.BuildCollected = false;
		UserOptions.BonusCollected = false;
		UserOptions.ChestCollected = {};
		UserOptions.LastTokenStatus = '';
		UserOptions.LastBuildStatus = '';
		UserOptions.LastChestStatus = '';
		UserOptions.BadChestDomains = {};
		saveUserOptions(user_id);
	}
}
