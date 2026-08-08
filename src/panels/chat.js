function ChatComOverlay() {
	if (!ByCl('postaction')[0].getElementsByClassName('button20')[0]) return;//safety
	thebutton = ByCl('postaction')[0].getElementsByClassName('button20')[0];
	thebutton.onclick = function () { OSendChat() };
	var overlay = document.createElement("div");
	var mod_comm_input = ById('mod_comm_input');
	var mod_comm_forum = ByCl('mod_comm_forum')[0];
	var mod_comm_list1 = ById('mod_comm_list1');
	var mod_comm_list2 = ById('mod_comm_list2');
	mod_comm_forum.style.position = 'absolute';
	mod_comm_forum.style.height = '30px';
	mod_comm_forum.style.top = '30px';
	mod_comm_list1.style.top = '20px';
	mod_comm_list2.style.top = '20px';
	overlay.setAttribute("id", "overlay");
	overlay.setAttribute("class", "overlay");
	mod_comm_input.hidden = true;
	mod_comm_input.parentNode.appendChild(overlay);
	overlay.innerHTML = '<input id="bot_comm_input" type="text" autocorrect="on" autocomplete="off"></input>';
	var bot_comm_input = ById('bot_comm_input');
	bot_comm_input.style.width = "75%";
	bot_comm_input.style.float = "left";
	bot_comm_input.addEventListener('keypress', function (e) { if (e.which == 13) OSendChat(); }, false);
	var x = new CalterUwFunc("Chat.whisper", [[/mod.comm.input/ig, 'bot_comm_input']]);
	x.setEnable(true);

	if (Options.ChatOptions.Emoticons) {
		var ab = document.createElement('a');
		ab.className = "mod_comm_set";
		ab.innerHTML = tx("Emoticons");
		ab.id = "btEmoticonLink";
		ab.style.paddingLeft = '0px';
		mod_comm_forum.insertBefore(ab, mod_comm_forum.firstChild);
		ab.addEventListener('click', ChatStuff.SmileyHelp, false);
	}
};

function OSendChat() {
	if (Options.ChatOptions.filter)
		ById('mod_comm_input').value = BtFilter(ById('bot_comm_input'));
	else
		ById('mod_comm_input').value = ById('bot_comm_input').value;
	ById('bot_comm_input').value = "";
	uW.Chat.sendChat();
};

function BtFilter(e) {
	var whisper = "";
	var firstindex = 0;
	var enctype = 0;

	if (e.value.charAt(0) == "\\") {
		e.value = String(e.value).slice(1);
		enctype = 1;
	};

	if (e.value.charAt(0) == "/" || e.value.charAt(0) == "@") {
		firstindex = e.value.indexOf(" ");
		whisper = e.value.slice(0, firstindex) + ' ';
	};

	var m = e.value.substr(firstindex, e.value.length);

	if (enctype == 1) {
		var unicodeString = '';
		for (var i = 0; i < m.length; i++) {
			var theUnicode = m.charCodeAt(i);;;
			theUnicode = '&#' + theUnicode + ';';
			unicodeString += theUnicode;
		}
		m = unicodeString;
	};

	if (enctype == 0) {
		var m = e.value.substr(firstindex, e.value.length);
		var x = Filter[Options.ChatOptions.fchar];
		m = m.replace(/Fa/g, 'F' + x + 'a').replace(/fA/g, 'f' + x + 'A').replace(/FA/g, 'F' + x + 'A').replace(/fa/g, 'f' + x + 'a');
		m = m.replace(/Gr/g, 'G' + x + 'r').replace(/gR/g, 'g' + x + 'R').replace(/GR/g, 'G' + x + 'R').replace(/gr/g, 'g' + x + 'r');
		m = m.replace(/Ri/g, 'R' + x + 'i').replace(/rI/g, 'r' + x + 'I').replace(/RI/g, 'R' + x + 'I').replace(/ri/g, 'r' + x + 'i');
		m = m.replace(/Na/g, 'N' + x + 'a').replace(/nA/g, 'n' + x + 'A').replace(/NA/g, 'N' + x + 'A').replace(/na/g, 'n' + x + 'a');
		m = m.replace(/885/g, '8' + x + '8' + x + '5').replace(/80085/g, '8' + x + '0' + x + '0' + x + '8' + x + '5');
	};
	// strip http:// and https://

	m = m.replace('https://', '');
	m = m.replace('http://', '');

	return (whisper + m);
};

function enFilter(e) {
	var x = Filter["Null"];
	var m = String(e);
	m = m.replace(/885/g, '8' + x + '8' + x + '5').replace(/80085/g, '8' + x + '0' + x + '0' + x + '8' + x + '5');
	return m;
}

function deFilter(e) {
	var x = Filter["Null"];
	var m = String(e);
	m = m.replace(new RegExp(x, 'g'), '');
	return m;
}

var ChatPane = {
	init: function () {
		var t = ChatPane;

		t.myregexp1 = new RegExp(tx("You are # [0-9]+ of [0-9]+ to help"), "i");
		t.myregexp2 = new RegExp(tx("\'s Kingdom does not need help\."), "i");
		t.myregexp3 = new RegExp(tx("\'s project has already been completed\."), "i");
		t.myregexp4 = new RegExp(tx("\'s project has received the maximum amount of help\."), "i");
		t.myregexp5 = new RegExp(tx("You already helped with (.*?)\'s project\."), "i");
		t.myregexp6 = new RegExp(tx("is low on food. Remaining:"), "i");
		t.myregexp7 = new RegExp(tx("\> " + uW.g_js_strings.getChat.saystoalliance + "\:\<\/b\>"), "i");
		t.myregexp8 = new RegExp(tx("\> " + uW.g_js_strings.sendChat.saystoalliance + "\:\<\/b\>"), "i");
		t.myregexp9 = new RegExp("[(]spam[)]", "i");
		t.myregexp10 = new RegExp("[{]spam[}]", "i");
		t.myregexp11 = new RegExp("[-]spam[-]", "i");
		t.myregexp12 = new RegExp("ptChatAttack", "i");
		t.myregexp13 = new RegExp("ptChatScout", "i");
		t.myregexp14 = new RegExp(tx("has been") + " " + tx("attacked") + " " + tx("by"), "i");
		t.myregexp15 = new RegExp(tx("has been") + " " + tx("scouted") + " " + tx("by"), "i");

		setInterval(t.HandleChatPane, 2500);
	},

	HandleChatPane: function () {
		var t = ChatPane;

		var DisplayName = GetDisplayName();
		var AllianceChatBox = ById('mod_comm_list2');
		var GlobalChatBox = ById('mod_comm_list1');

		if (AllianceChatBox) {
			var chatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", AllianceChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (chatPosts) {
				for (var i = 0; i < chatPosts.snapshotLength; i++) {
					thisPost = chatPosts.snapshotItem(i);

					if (Options.ChatOptions.HelpRequest) {
						var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
						if (postAuthor.snapshotItem(0)) {
							var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
							if (postAuthorName != DisplayName) {
								var helpAllianceLinks = document.evaluate(".//a[contains(@onclick,'claimAllianceChatHelp')]", thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
								if (helpAllianceLinks) {
									for (var j = 0; j < helpAllianceLinks.snapshotLength; j++) {
										thisLink = helpAllianceLinks.snapshotItem(j);
										var alreadyClicked = thisLink.getAttribute("clicked");
										if (!alreadyClicked) {
											thisLink.setAttribute('clicked', 'true');
											var myregexp = /(claimAllianceChatHelp\(.*\);)/;
											var match = myregexp.exec(thisLink.getAttribute("onclick"));

											if (match != null) {
												onclickCode = match[0];
												DouW(onclickCode);
											}
										}
									}
								}
							}
						}
					}

					t.HidePostOptions(thisPost, DisplayName);

					if (Options.ChatOptions.DeleteAllianceSpam) { // hide alli spam in alli chat
						if (thisPost.innerHTML.match(t.myregexp9) || thisPost.innerHTML.match(t.myregexp10) || thisPost.innerHTML.match(t.myregexp11)) {
							thisPost.parentNode.removeChild(thisPost);
						}
					}
				}
			}

			// delete alliance chats from global chat if required

			if (Options.ChatOptions.DeleteRequest || Options.ChatOptions.DeleteFood || Options.ChatOptions.DeleteAlert || Options.ChatOptions.DeleteReport || Options.ChatOptions.DeletegAl) {
				var gchatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", GlobalChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				if (gchatPosts) {
					for (var i = 0; i < gchatPosts.snapshotLength; i++) {
						var gthisPost = gchatPosts.snapshotItem(i);

						if (Options.ChatOptions.DeleteRequest) { // Hide alliance request reports in chat - note they don't say "says to the alliance" :/
							if (gthisPost.innerHTML.match(t.myregexp1) || gthisPost.innerHTML.match(t.myregexp2) || gthisPost.innerHTML.match(t.myregexp3) || gthisPost.innerHTML.match(t.myregexp4) || gthisPost.innerHTML.match(t.myregexp5)) {
								gthisPost.parentNode.removeChild(gthisPost);
							}
						}

						if (Options.ChatOptions.DeletegAl) { // hide alliance chat from global chat
							if (gthisPost.innerHTML.match(t.myregexp7) || gthisPost.innerHTML.match(t.myregexp8))
								gthisPost.parentNode.removeChild(gthisPost);
						}
						else {
							t.HidePostOptions(gthisPost, DisplayName);
						}
					}
				}
			}
		}

		// check for global spam

		if (Options.ChatOptions.DeleteGlobalSpam) {
			var gchatPosts = document.evaluate(".//div[contains(@class,'chatwrap')]", GlobalChatBox, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (gchatPosts) {
				for (var i = 0; i < gchatPosts.snapshotLength; i++) {
					var gthisPost = gchatPosts.snapshotItem(i);
					if (!gthisPost.innerHTML.match(t.myregexp7) && !gthisPost.innerHTML.match(t.myregexp8) && (gthisPost.innerHTML.match(t.myregexp9) || gthisPost.innerHTML.match(t.myregexp10) || gthisPost.innerHTML.match(t.myregexp11))) { // hide spam from global
						gthisPost.parentNode.removeChild(gthisPost);
					}
				}
			}
		}
	},

	HidePostOptions: function (thisPost, DisplayName) {
		var t = ChatPane;

		if (Options.ChatOptions.DeleteRequest) { // Hide alliance requests in alli chat
			var helpAllianceLinks = document.evaluate(".//a[contains(@onclick,'claimAllianceChatHelp')]", thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (helpAllianceLinks) {
				for (var j = 0; j < helpAllianceLinks.snapshotLength; j++) {
					thisLink = helpAllianceLinks.snapshotItem(j);
					thisLink.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(thisLink.parentNode.parentNode.parentNode.parentNode);
				}
			}
			// Hide alliance request reports in alli chat
			if (thisPost.innerHTML.match(t.myregexp1) || thisPost.innerHTML.match(t.myregexp2) || thisPost.innerHTML.match(t.myregexp3) || thisPost.innerHTML.match(t.myregexp4) || thisPost.innerHTML.match(t.myregexp5)) {
				thisPost.parentNode.removeChild(thisPost);
			}
		}

		if (Options.ChatOptions.DeleteFood) { // hide food alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteFoodUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteFoodUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (postAuthor.snapshotItem(0)) {
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if (postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length == 0)) {
					if (thisPost.innerHTML.match(t.myregexp6)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if (Options.ChatOptions.DeleteAlert) { // hide tower attack alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteAlertUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteAlertUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (postAuthor.snapshotItem(0)) {
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if (postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length == 0)) {
					if (thisPost.outerHTML.match(t.myregexp12)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if (Options.ChatOptions.DeleteReport) { // hide reports in alli chat
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (postAuthor.snapshotItem(0)) {
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if (postAuthorName != DisplayName) {
					if (thisPost.innerHTML.match(t.myregexp14) || thisPost.innerHTML.match(t.myregexp15)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}

		if (Options.ChatOptions.DeleteScout) { // hide tower scout alerts in alli chat
			var NameArray = [];
			if (Options.ChatOptions.DeleteScoutUsers.trim() != "")
				NameArray = Options.ChatOptions.DeleteScoutUsers.trim().toUpperCase().split(",");
			var postAuthor = document.evaluate('.//*[@class="nm"]', thisPost, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (postAuthor.snapshotItem(0)) {
				var postAuthorName = postAuthor.snapshotItem(0).innerHTML;
				if (postAuthorName != DisplayName && ((NameArray.indexOf(postAuthorName.split(" ")[1].toUpperCase()) != -1) || NameArray.length == 0)) {
					if (thisPost.outerHTML.match(t.myregexp13)) {
						thisPost.parentNode.removeChild(thisPost);
					}
				}
			}
		}
	}
}


var ChatStuff = {
	chatDivContentFunc: null,
	getChatFunc: null,
	leaders: {},
	ChatIcons: {},
	Colors: {
		ChatLeaders: '#B8B8B8',
		ChatGlobal: '#CCCCFF',
		ChatAll: '#99CCFF',
		ChatAtt: '#FF4D4D',
		ChatScout: '#FF8800',
		ChatRecall: '#6B8E23',
		ChatWhisper: '#FF4D4D',
		ChatVC: '#00FF00',
		ChatChancy: '#F8E151',
	},
	marchtimer: null,
	marchETA: null,
	marchDIR: '',
	BAOAttack: ['Type : ATTAQUE', 'Type: ATTACK', 'Tipo: ATTACCO', 'TYP: ANGRIFF', 'Tipo : ATACAR'],
	BAOScout: ['Type : ECLAIREUR', 'Type: SCOUT', 'Tipo: ESPLORAZIONE', 'TYP: Anerkennung', 'Tipo : EXPLORACION'],

	init: function () {
		var t = ChatStuff;

		try {
			if (getMyAlliance()[0] > 0) {
				t.getAllianceLeaders();
			}
			t.readChatIcons();
			t.chatDivContentFunc = new CalterUwFunc('Chat.chatDivContent', [['return f.join("")', 'var msg = f.join("");\n msg=chatDivContent_hook(msg,d);\n return msg;']]);
			uWExportFunction('chatDivContent_hook', t.chatDivContentHook);
			uWExportFunction('chatDivContent_hook2', t.chatDivContentHook2);
			uWExportFunction('ptChatIconClicked', t.e_iconClicked);
			uWExportFunction('ptChatReportClicked', Rpt.FindReport);
			uWExportFunction('ptfetchmarch', t.fetchmarchcaller);
			uWExportFunction('btSelectSmiley', ChatStuff.SelectSmiley);
			uWExportFunction('btSelectText', SelectText);

			t.setEnable(Options.ChatOptions.chatEnhance);
			if (Options.ChatOptions.chatGlobal) {
				ById('mod_comm_list1').className += ' ptChatGlobal ';
			}
			if (Options.ChatOptions.chatAlliance) {
				ById('mod_comm_list2').className += ' ptChatAlliance ';
			}

			ChatComOverlay(); // enable chat filter buster!
			ChatPane.init(); // initialise chat hide functions
		}
		catch (err) {
			logerr(err); // write to log
		}
	},

	isAvailable: function () {
		var t = ChatStuff;
		t.chatDivContentFunc.isAvailable();
	},
	setEnable: function (tf) {
		var t = ChatStuff;
		t.chatDivContentFunc.setEnable(tf);
	},

	e_iconClicked: function (name) {
		if (ById('bot_comm_input'))
			var e = ById('bot_comm_input');
		else
			var e = ById('mod_comm_input');
		name = name.replace(/Ã‚Â°Ã‚Â°/g, "'");
		e.value = '@' + name + ' ';
	},

	chatDivContentHook2: function (msg) {
		var div = document.createElement('div');
		div.innerHTML = msg;
		div.innerText = div.innerHTML;
		msg = div.innerHTML.toString();
		return msg.htmlSpecialCharsDecode();
	},

	chatDivContentHook: function (msg, type) {

		function FormatChatTable(msg) {
			var f = msg.indexOf('<div class=\'tx\'>');
			if (f >= 0) {
				msg = msg.replace(/<div class=\'tx\'>/, '</td></tr><div class=\'tx\'><center><table border="1" cellpadding="0"><tr><td>')
				msg = msg.replace(/\|\|/g, '</td></tr><tr><td>');
				var a = msg.indexOf('</div>', f);
				msg = msg.slice(0, a) + '</td></tr></table><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">' + tx('hide') + '</span></a></center>' + msg.slice(a);
			}
			return msg;
		}

		var t = ChatStuff;
		var element_class = '';
		var alliance = false;
		var whisper = false;
		var whisper2 = false;
		var m = /div class=\'info\'>.*<\/div>/im.exec(msg);
		if (m == null) return msg;
		if (type != null) {
			if (type.indexOf(uW.g_js_strings.getChat.saystoalliance) > 0) {
				alliance = true;
			}
			if (type.indexOf(uW.g_js_strings.getChat.whisperstoyou) > 0) {
				whisper = true;
			}
			if (type.indexOf(uW.g_js_strings.sendChat.whispersto) > 0) { // when local whisper it says your name! need this for tower alert whisper
				whisper2 = true;
			}
		}
		var whisp = m[0];
		if (whisper) {
			if (Options.ChatOptions.chatWhisper) {
				element_class += ' ptChatWhisper ';
			}
		} else { //Global & Alliance
			if (Options.ChatOptions.chatBold)
				element_class += ' ptChatBold ';
		}
		var suid = /viewProfile\(this,([0-9]+),/i.exec(m[0]);
		if (!suid) { suid = uW.tvuid; }
		else { suid = suid[1]; }


		if (Options.ChatOptions.chatLeaders) {
			if (t.leaders[suid]) element_class += ' ptChat' + t.leaders[suid];
		}

		var glorytitle = '';
		var aid = getMyAlliance()[0];
		if (Options.ChatOptions.GloryLeader && Options.ChatOptions.GloryLeaderAID == aid && Options.ChatOptions.GloryLeaderUID == suid) {
			element_class += ' ptChatGLORY';
			glorytitle = "title='Glory: " + addCommas(Options.ChatOptions.GloryLeaderGlory) + "'";
		}
		if (Options.ChatOptions.Rainbow && suid == uW.tvuid) {
			element_class += ' ptChatRAINBOW';
		}

		if (Options.ChatOptions.chatIcons) {
			if (t.ChatIcons[suid]) { msg = msg.replace(/\bhttps\:\/\/[-a-z].*\'\/\>/i, "https://graph.facebook.com/" + t.ChatIcons[suid] + "/picture\'\/\>"); }
			else { t.getfbid(suid); }
		}
		msg = msg.replace("class='chatIcon'", " class='chatIcon' title='" + tx('Click to send a message') + "' onclick='getMessageWindow(" + suid + ",\"UID:" + suid + "\");return false;' ");
		var fchar = new RegExp(atob('rQ=='), "g");
		msg = msg.replace(fchar, "").replace(/\&\#8232\;/g, "");
		if ((alliance || whisper2) && Options.ChatOptions.chatAttack) {
			//barcode style catch
			if (m[0].indexOf('.::.') >= 0) {
				element_class = ' ptChatRecall';
				msg = FormatChatTable(msg);
				msg = msg.replace('.::.', '');
			}
			if (m[0].indexOf('.:..') >= 0) {
				element_class = ' ptChatScout';
				msg = FormatChatTable(msg);
				msg = msg.replace('.:..', '');
			}
			if (m[0].indexOf('..:.') >= 0) {
				element_class = ' ptChatAttack';
				msg = FormatChatTable(msg);
				msg = msg.replace('..:.', '');
			}
			// legacy
			if (m[0].indexOf(uW.g_js_strings.modal_messages_viewreports_view.scoutingat) >= 0)
				element_class = ' ptChatScout';
			// detect BAO alerts
			for (var a = 0; a < t.BAOAttack.length; a++) {
				if (m[0].indexOf(t.BAOAttack[a]) >= 0) {
					element_class = ' ptChatAttack';
					break;
				}
			}
			for (var a = 0; a < t.BAOScout.length; a++) {
				if (m[0].indexOf(t.BAOScout[a]) >= 0) {
					element_class = ' ptChatScout';
					break;
				}
			}
		}
		//general use tables
		if (m[0].indexOf(':::.') >= 0) {
			msg = FormatChatTable(msg);
			msg = msg.replace(':::.', '');
		}
		msg = msg.replace(/\|/g, '<br>');
		msg = msg.replace("class=\'content\'", "class='content " + element_class + "' " + glorytitle);
		msg = msg.replace(/<div class=\'tx\'>/, '<div ondblclick="btSelectText(this);" class=\'tx\'>')

		if (m[0].indexOf('Report No:') && Options.ReportOptions.NoDuplicateReports) {
			var rid = /(\bReport\sNo:\s([0-9]+))/g.exec(msg);
			if (rid) { AllianceReportsCheck.addAllianceReport({ reportId: rid[2], reportUnixTime: unixTime() }); }
		}

		msg = msg.replace(/(\bReport\sNo\:\s([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		msg = msg.replace(/(\bRpt\:([0-9]+))/g, '<a onclick=\'ptChatReportClicked($2,0)\'>$1</a>');
		msg = msg.replace(/#([0-9]+)#/g, '<a onclick=\'ptChatReportClicked($1,0)\'>$1</a>');

		if (m[0].indexOf('UID:')) { msg = msg.replace(/(\bUID:\s([0-9]+))/g, 'UID: $2 <a onclick=\'btMonitorExternalCallUID($2)\'>(Monitor)</a>'); }
		if (m[0].indexOf('TRC:')) { msg = msg.replace(/(\bTRC:\s([0-9]+))/g, 'UID: $2 <a onclick=\'btMonitorExternalCallUID($2)\'>(Monitor)</a>'); }
		if (m[0].indexOf('March id:') && Options.FetchMarchInfo) {
			var mid = /(\bMarch\sid:\s([0-9]+))/g.exec(msg);
			if (mid && Tabs.MarchCrawl && Tabs.MarchCrawl.CrawlResult) { t.fetchmarch(mid[2], Tabs.MarchCrawl.CrawlResult); }
			msg = msg.replace(/(\bMarch\sid:\s([0-9]+))/g, '<a onclick=\'ptfetchmarch($2)\'>' + tx('Additional March details') + ' ---></a>');
		}

		msg = msg.replace(/(\byoutube([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\byoutu\.be([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\btinyurl([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/www\.$1\',\'_blank\'\)\">$1</a>');
		msg = msg.replace(/(\W)(bot)(\W)/gi, '$1<a onclick=window.open("https://greasyfork.org/en/scripts/399012-koc-power-bot-plus")>$2</a>$3');
		msg = msg.replace(/(\W)(PB+)(\W)/gi, '$1<a onclick=window.open("http:///www.facebook.com/PowerBotPlus/")>$2</a>$3');
		if (KOCMON_ON) {
			msg = msg.replace(/(\W)(kocmon)(\W)/gi, '$1<a onclick=window.open("http://www.rycamelot.com/")>$2</a>$3');
		}
		msg = msg.replace(/(\W)(kocinfo)(\W)/gi, '$1<a onclick=window.open("http://www.facebook.com/groups/SolarsKOCinfoPage/")>$2</a>$3');
		var m = /(Lord|Lady) (.*?)</im.exec(msg);
		if (m != null)
			m[2] = m[2].replace(/\'/g, "\\\'");
		msg = msg.replace(/<img (.*?>)/img, '<A onclick=\"ptChatIconClicked(\'' + m[2] + '\')\"><img class=\"ptChatIcon\" $1</a>');
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi.imgur([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">' + tx('hide') + '</span></a></center>'); }
		else { msg = msg.replace(/(\bi.imgur([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi.giphy([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">' + tx('hide') + '</span></a></center>'); }
		else { msg = msg.replace(/(\bi.giphy([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bi[0-9]+.tinypic([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">' + tx('hide') + '</span></a></center>'); }
		else { msg = msg.replace(/(\bi[0-9]+.tinypic([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.ImagePreviews) { msg = msg.replace(/(\bs[0-9]+.postimg([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\"><img style="width:initial;height:initial;max-width:100%;float:none" src="http\:\/\/$1"></a><center><a onclick="this.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = \'none\';"><span style="font-size:10px;font-weight:normal;">' + tx('hide') + '</span></a></center>'); }
		else { msg = msg.replace(/(\bs[0-9]+.postimg([0-9a-z\.\?\/\=\-\_]+))/gi, '<a onclick=\"window.open\(\'http\:\/\/$1\',\'_blank\'\)\">$1</a>'); }
		if (Options.ChatOptions.Emoticons) {
			for (k in Smileys) {
				msg = replaceAll(msg, k, '<img class=smileyimage src=\"' + Smileys[k] + '\">', false); // no ignore case!
			}
		}
		for (k in ChatStyles) {
			if (Options.ChatOptions.Styles) { msg = replaceAll(msg, k, '<span style="' + ChatStyles[k] + '">', true); }
			else { msg = replaceAll(msg, k, '', true); }
		}
		if (Options.ChatOptions.Styles) { msg = replaceAll(msg, '[#]', '</span>', true); }
		else { msg = replaceAll(msg, '[#]', '', true); }

		if (whisper && Options.ChatOptions.enableWhisperAlert) {
			AudioManager.setVolume(Options.ChatOptions.Volume);
			AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.WhisperPlay));
			AudioManager.play();
			AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 2500);
		}
		if ((element_class == ' ptChatAttack') && Options.ChatOptions.enableTowerAlert) {
			var SoundAlert = true;
			if (Options.ChatOptions.DeleteAlert) {
				var NameArray = [];
				if (Options.ChatOptions.DeleteAlertUsers.trim() != "")
					NameArray = Options.ChatOptions.DeleteAlertUsers.trim().toUpperCase().split(",");
				if ((NameArray.indexOf(m[2].toUpperCase()) != -1) || NameArray.length == 0) {
					SoundAlert = false;
				}
			}
			if (SoundAlert) {
				AudioManager.setVolume(Options.ChatOptions.Volume);
				AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.TowerPlay));
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 5000);
			}
		}
		if ((element_class == ' ptChatScout') && Options.ChatOptions.enableScoutAlert) {
			var SoundAlert = true;
			if (Options.ChatOptions.DeleteScout) {
				var NameArray = [];
				if (Options.ChatOptions.DeleteScoutUsers.trim() != "")
					NameArray = Options.ChatOptions.DeleteScoutUsers.trim().toUpperCase().split(",");
				if ((NameArray.indexOf(m[2].toUpperCase()) != -1) || NameArray.length == 0) {
					SoundAlert = false;
				}
			}
			if (SoundAlert) {
				AudioManager.setVolume(Options.ChatOptions.Volume);
				AudioManager.setSource(eval('SOUND_FILES.' + Options.ChatOptions.ScoutPlay));
				AudioManager.play();
				AudioManager.stoptimer = setTimeout(function () { AudioManager.stop(); }, 5000);
			}
		}

		return msg;
	},

	getAllianceLeaders: function () {
		var t = ChatStuff;
		var params = uW.Object.clone(uW.g_ajaxparams);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/allianceGetLeaders.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			loading: true,
			onSuccess: function (rslt) {
				if (rslt.officers) {
					for (var uid in rslt.officers) {
						var user = rslt.officers[uid];
						t.leaders[user.userId] = user.type.substr(0, 4);
					}
				}
			},
		});
	},

	getfbid: function (uid) {
		fetchPlayerCourt(uid, ChatStuff.addfbuid);
	},

	addfbuid: function (rslt) {
		var t = ChatStuff;
		if (rslt.ok) {
			var uid = parseInt(rslt.playerInfo.userId);
			var fbid = parseInt(rslt.playerInfo.fbuid);
			t.ChatIcons[uid] = fbid;
			t.saveChatIcons();
		}
	},

	readChatIcons: function () {
		var t = ChatStuff;
		s = GM_getValue('ChatIcons');
		if (s != null) {
			opts = JSON2.parse(s);
			for (var k in opts) {
				t.ChatIcons[k] = opts[k];
			}
		}
	},

	saveChatIcons: function () {
		var t = ChatStuff;
		GM_setValue('ChatIcons', JSON2.stringify(t.ChatIcons));
	},

	fetchmarchcaller: function (mid) {
		var t = ChatStuff;
		t.fetchmarch(mid, ChatStuff.MarchPopup);
	},

	fetchmarch: function (mid, notify, qc) {
		var t = ChatStuff;
		if (!mid) { notify({}); return; }
		if (ById('ptfetchmarch')) ById('ptfetchmarch').innerHTML = tx("Fetching March") + "...";

		var params = uW.Object.clone(uW.g_ajaxparams);
		params.rid = mid;
		var atimer = setTimeout(function () { notify({ errorMsg: 'Fetch march timed out (March ID ' + mid + ')' }); }, 6000);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/fetchMarch.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				clearTimeout(atimer);
				if (rslt.ok) {
					if (qc) {
						var ui = [];
						var n = { name: '???' }
						ui.push(n);
						notify({ userInfo: ui }, { userInfo: ui }, rslt.march);
					}
					else {
						t.fetchmarchPlayerInfo(rslt.march.fromPlayerId, rslt.march.toPlayerId, notify, rslt.march);
					}
				}
				else {
					notify({ errorMsg: 'Fetch march error (March ID ' + mid + ')' });
				}
			},
			onFailure: function () {
				clearTimeout(atimer);
				notify({ errorMsg: tx('AJAX error') });
			},
		}, true);
	},

	fetchmarchPlayerInfo: function (uid, uid2, notify, march, uidrslt) {
		var t = ChatStuff;
		var params = uW.Object.clone(uW.g_ajaxparams);
		params.uid = uid;
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/getUserGeneralInfo.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: params,
			onSuccess: function (rslt) {
				if (uid2 && uid2 != 0) {
					t.fetchmarchPlayerInfo(uid2, 0, notify, march, rslt);
				}
				else {
					if (!uidrslt) {
						notify(rslt, uidrslt, march);
					}
					else {
						notify(uidrslt, rslt, march);
					}
				}
			},
			onFailure: function () { notify({ errorMsg: tx('AJAX error') }); },
		}, true);
	},

	UpdateMarchTime: function () {
		var t = ChatStuff;
		clearTimeout(t.marchtimer);
		var now = unixTime();
		var arrivalTime = t.marchETA - now;
		if (arrivalTime >= 0) {
			marchtime = uW.timestr(arrivalTime);
			t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
		}
		else {
			if (t.marchDIR == "") {
				marchtime = tx('Landed! (Please Refresh)');
			}
			else {
				marchtime = tx("Completed.");
			}
		}
		if (ById('ptmarchtime')) {
			ById('ptmarchtime').innerHTML = marchtime + t.marchDIR;
		}
	},

	MarchPopup: function (rslt, rslt2, march) {
		var t = ChatStuff;
		clearTimeout(t.marchtimer);

		var n = '<table align=center width=95% cellspacing=0 cellpadding=0>';
		n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

		if (rslt.userInfo) {
			if (Tabs.MarchCrawl && Tabs.MarchCrawl.catalogMarch) setTimeout(function () { Tabs.MarchCrawl.catalogMarch(rslt, rslt2, march); }, 0);

			var u = rslt.userInfo[0];
			var alli = 'None';
			if (u.allianceName)
				alli = u.allianceName + FormatDiplomacy(u.allianceId);

			var u2;
			if (rslt2 && rslt2.userInfo) {
				u2 = rslt2.userInfo[0];
				var alli2 = 'None';
				if (u2.allianceName)
					alli2 = u2.allianceName + FormatDiplomacy(u2.allianceId);
			}

			var a = march;
			n += '<tr><td class=xtabBR width=150>' + tx('March ID') + '</td><td class=xtab><b><input type=text id=ptmid value="' + a.marchId + '" ' + (trusted ? "" : "disabled") + '>&nbsp;&nbsp;<a id=ptfetchmarch>' + tx('Refresh') + '</a></b></td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var marchStatus = parseInt(a.marchStatus);
			var now = unixTime();
			var destinationUnixTime = convertTime(new Date(a["destinationEta"].replace(" ", "T") + "Z")) - now;
			var returnUnixTime = convertTime(new Date(a["returnEta"].replace(" ", "T") + "Z")) - now;

			if ((destinationUnixTime < 0) || (marchStatus == 8) || (marchStatus == 2))
				marchdir = "Return";
			else
				marchdir = "Count";

			if (destinationUnixTime >= 0) {
				marchtime = uW.timestr(destinationUnixTime);
				t.marchETA = convertTime(new Date(a["destinationEta"].replace(" ", "T") + "Z"));
				t.marchDIR = '';
				t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
			}
			else {
				if (marchStatus == 2) {
					marchtime = uW.g_js_strings.commonstr.encamped;
				}
				else {
					if (returnUnixTime < 0) {
						marchtime = tx("Completed") + " (" + uW.timestr(returnUnixTime * (-1)) + " " + tx('ago') + ")";
					}
					else {
						if (marchStatus == 8) {
							marchtime = uW.timestr(returnUnixTime) + ' (' + uW.g_js_strings.commonstr.returning + ')';
							t.marchETA = convertTime(new Date(a["returnEta"].replace(" ", "T") + "Z"));
							t.marchDIR = ' (' + uW.g_js_strings.commonstr.returning + ')';
							t.marchtimer = setTimeout(t.UpdateMarchTime, 1000);
						}
						else {
							marchtime = tx("Waiting");
						}
					}
				}
			}
			n += '<tr><td class=xtab>' + tx('Time/Status') + '</td><td class=xtabBR id=ptmarchtime><b>' + marchtime + '</b></td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.nametx + '</td><td class=xtabBR><b>' + u.genderAndName + '</b><td></tr>';
			n += '<tr><td class=xtab>UID</td><td class=xtabBR><b>' + MonitorLinkUID(a.fromPlayerId) + '</b></td></tr>';
			n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.might + '</td><td class=xtabBR>' + addCommas(parseInt(u.might)) + '</td></tr>';
			n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.alliance + '</td><td class=xtabBR>' + alli + '</td></tr>';

			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var marchType = parseInt(a.marchType);
			if (marchType == 10) marchType = 4; // Change Dark Forest type to Attack!
			var hint = "";
			switch (marchType) {
				case 1: hint = uW.g_js_strings.commonstr.transport; break;
				case 2: hint = uW.g_js_strings.commonstr.reinforce; break;
				case 3: hint = uW.g_js_strings.commonstr.scout; break;
				case 4: hint = uW.g_js_strings.commonstr.attack; break;
				case 5: hint = uW.g_js_strings.commonstr.reassign; break;
			}
			n += '<tr><td class=xtab>' + tx('March Type') + '</td><td class=xtabBR><b>' + hint + '</b></td></tr>';
			n += '<tr><td class=xtab>' + tx('From') + '</td><td class=xtabBR><b>' + coordLink(a.fromXCoord, a.fromYCoord) + '</b></td></tr>';
			n += '<tr><td class=xtab>' + tx('CityID') + '</td><td class=xtabBR>' + a.fromCityId + '</td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			var totile = tileTypes[parseInt(a["toTileType"])];
			if (a["toTileType"] == 51) {
				if (!a["toPlayerId"]) { totile = "???"; }
				else { if (a["toPlayerId"] == 0) totile = 'Barb Camp'; }
			}
			totile = 'Lvl ' + a["toTileLevel"] + ' ' + totile;
			n += '<tr><td class=xtab>To</td><td class=xtabBR><b>' + coordLink(a.toXCoord, a.toYCoord) + '&nbsp;' + totile + '</b></td></tr>';
			if (a["toCityId"] != 0) n += '<tr><td class=xtab>' + tx('CityID') + '</td><td class=xtabBR>' + a.toCityId + '</td></tr>';

			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.nametx + '</td><td class=xtabBR><b>' + u2.genderAndName + '</b></td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>UID</td><td class=xtabBR><b>' + MonitorLinkUID(a.toPlayerId) + '</b></td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.might + '</td><td class=xtabBR>' + addCommas(parseInt(u2.might)) + '</td></tr>';
			if (a["toPlayerId"] != 0 && a["toPlayerId"] != a["fromPlayerId"]) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.alliance + '</td><td class=xtabBR>' + alli2 + '</td></tr>';
			n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';

			if (a["championId"] && a["championId"] != 0) {
				n += '<tr><td class=xtab>' + tx('Champion') + '</td><td class=xtabBR>' + tx('Champion ID') + ':' + a["championId"] + '</td></tr>'; // this is all we can get from march :/
			}

			if (a["knightId"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.knight + '</td><td class=xtabBR>' + a.knightName + ' (Atk:' + a["knightCombat"] + ')</td></tr>';

			n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.troops + '</td><td class=xtabBR>';
			for (var ui in CM.UNIT_TYPES) {
				i = CM.UNIT_TYPES[ui];
				if ((a["unit" + i + "Count"] > 0) || (a["unit" + i + "Return"] > 0)) {
					trpcol = Options.Colors.PanelText;
					original = '';
					if ((marchdir == "Return") && (a["unit" + i + "Return"] < a["unit" + i + "Count"])) { trpcol = '#f00'; original = '&nbsp;</span><span>(' + addCommas(a["unit" + i + "Count"]) + ')' }
					n += '<span class=xtab>' + uW.unitcost['unt' + i][0] + ': <span class=xtab style="color:' + trpcol + '">' + addCommas(a["unit" + i + marchdir]) + original + '</span></span> ';
				}
			}
			n += '</td></tr>';

			if (a["fromSpellType"]) {
				var spell = uW.g_js_strings.spells['name_' + a["fromSpellType"]];
				if (spell) {
					n += '<tr><td class=xtab>' + tx('Battle Spell') + '</td><td class=xtab><b>' + spell + '</b></td></tr>';
				}
			}

			if (a["gold"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.gold + '</td><td class=xtabBR>' + addCommas(a["gold"]) + '</td></tr>';
			if (a["resource1"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.food + '</td><td class=xtabBR>' + addCommas(a["resource1"]) + '</td></tr>';
			if (a["resource2"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.wood + '</td><td class=xtabBR>' + addCommas(a["resource2"]) + '</td></tr>';
			if (a["resource3"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.stone + '</td><td class=xtabBR>' + addCommas(a["resource3"]) + '</td></tr>';
			if (a["resource4"] > 0) n += '<tr><td class=xtab>' + uW.g_js_strings.commonstr.ore + '</td><td class=xtabBR>' + addCommas(a["resource4"]) + '</td></tr>';
			if (a["resource5"] > 0) n += '<tr><td class=xtab>' + tx('Aether') + '</td><td class=xtabBR>' + addCommas(a["resource5"]) + '</td></tr>';
		}
		else {
			n += '<tr><td class=xtab width=150>' + tx('March ID') + '</td><td class=xtabBR><b><input type=text id=ptmid value="" ' + (trusted ? "" : "disabled") + '>&nbsp;&nbsp;<a id=ptfetchmarch>' + tx('Fetch') + '</a></b></td></tr>';
			if (rslt.errorMsg) {
				n += '<tr><td class=xtabBR colspan=2>&nbsp;</td></tr>';
				n += '<tr><td class=xtabBR colspan=2>' + rslt.errorMsg + '</td></tr>';
			}
		}
		n += '</table>';

		var MarchPop = null;

		var off = getAbsoluteOffsets(ById('mod_comm_list2'));
		if (off.top <= 0) { off.top = 0; }
		MarchPop = new CPopup('ptShowMarch', off.left, off.top, 500, 500, true, function () {
			clearTimeout(t.marchtimer);
		});
		MarchPop.getTopDiv().innerHTML = '<DIV align=center><B>' + tx('MARCH DETAILS') + '</B></DIV>';
		MarchPop.getMainDiv().innerHTML = n;
		ById('ptfetchmarch').addEventListener('click', function () { uW.ptfetchmarch(ById('ptmid').value) }, false);

		MarchPop.show(true);
	},

	SelectSmiley: function (what) {

		function insertAtCaret(areaId, text) {
			var txtarea = ById(areaId);
			var scrollPos = txtarea.scrollTop;
			var caretPos = txtarea.selectionStart;

			var front = (txtarea.value).substring(0, caretPos);
			var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
			txtarea.value = front + text + back;
			caretPos = caretPos + text.length;
			txtarea.selectionStart = caretPos;
			txtarea.selectionEnd = caretPos;
			txtarea.focus();
			txtarea.scrollTop = scrollPos;
		};
		insertAtCaret("bot_comm_input", " " + what + " "); return;
	},

	SmileyHelp: function () {
		var t = ChatStuff;
		if (t.smileypop) {
			t.smileypop.show(false);
			if (t.smileypop.onClose) t.smileypop.onClose();
			t.smileypop.destroy();
			t.smileypop = null;
			return;
		}

		var helpText = '<DIV style="max-height:400px; height:400px; overflow-y:auto">';
		helpText += '<TABLE width=100% cellspacing=0 cellpadding=2 border=0 class=xtab><tr>';
		var row = 0;
		for (k in Smileys) {
			helpText += '<TR><TD align=right><a><img title="' + tx("click to insert to chat") + '" class=smileyimage src=\"' + Smileys[k] + '\" onclick="btSelectSmiley(\'' + k + '\')"></a></td><TD align=right><font size=1>' + k + '</td></tr>';
		}
		helpText += '<TR><TD align=right><b>' + tx('Text Styles') + '</b></td><TD align=right>&nbsp;</td></tr>';
		for (k in ChatStyles) {
			helpText += '<TR><TD align=right><a onclick="btSelectSmiley(\'' + k + '\');">' + ChatStyles[k] + '</a></td><TD align=right><font size=1>' + k + '</td></tr>';
		}
		helpText += '<TR><TD align=right><a onclick="btSelectSmiley(\'[#]\');">' + tx('end style') + '</a></td><TD align=right><font size=1>[#]</td></tr>';
		helpText += '</table></div><br>';

		var off = getOffset(ById('btEmoticonLink'));
		t.smileypop = new CPopup('BotHelp', off.left, off.top + 20, 200, 400, true);
		t.smileypop.getMainDiv().innerHTML = helpText;
		t.smileypop.getTopDiv().innerHTML = '<CENTER><B>' + tx("Emoticons") + '</b></center>';
		t.smileypop.show(true);
		ResetFrameSize('BotHelp', 400, 200);
	},
}
