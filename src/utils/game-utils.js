/** Standard Game Functions **/

function getThroneEffectName(id, tier) {
	var RetVal = uW.g_js_strings.throneRoom["effectName_" + id];
	if (CM.THRONE_ROOM_TYPE_DEBUFF_EFFECTS.indexOf(parseInt(id)) != -1 && tier) {
		RetVal = RetVal.replace("%1$s", CM.THRONE_ROOM_TYPE_DEBUFF_EFFECTS_TIER_PERCENTAGE[tier - 1] + "% ");
	}
	return RetVal;
}

function SelectText(elem) {
	var range, selection;
	if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(elem);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(elem);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

function StartKeyTimer(elem, notify, entry) {
	if (KeyTimer) { clearTimeout(KeyTimer); }
	KeyTimer = setTimeout(function () { notify(elem, entry); }, 1000);
}

function htmlTitleLine(msg) {
	return '<TABLE class=xtab width=100% cellspacing=0><TR><TD style="padding:0px" width=50%><HR></td><TD style="padding:0px">[ ' + msg + ' ]</td><TD style="padding:0px" width=50%><HR></td></tr></table>';
}

function strButton20(label, tags) {
	if (tags == null) tags = '';
	return ('<A class="inlineButton btButton blue20" ' + tags + '><SPAN>' + label + '</span></a>');
}

function strButton14(label, tags, colourclass) {
	if (tags == null) tags = '';
	if (colourclass == null) colourclass = 'blue14';
	return ('<A class="inlineButton btButton ' + colourclass + '" ' + tags + '><SPAN>' + label + '</span></a>');
}

function strButton8(label, tags) {
	if (tags == null) tags = '';
	return ('<A class="inlineButton btButton brown8" ' + tags + '><SPAN>' + label + '</span></a>');
}

function makeButtonv2(color, tags, label) {
	return '<a ' + tags + ' class="buttonv2 std ' + color + '"><SPAN>' + label + '</span></a>';
}

function getServerId() {
	var m = /^[a-zA-Z]+([0-9]+)\./.exec(document.location.hostname);
	if (m)
		return m[1];
	// Fallback: extract server ID from URL query param (?s=XXX) for playgardencitygames.com and similar
	var q = /[\?\&]s=(\d+)/i.exec(document.location.search);
	if (q)
		return q[1];
	return '??';
}

function getTokenServerId() { // domain for tokens may be passed in URL as &token_s parameter...
	var myServerId = UserOptions.TokenDomain;
	var squery = /[\?,\&]token_s=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myServerId = Sresult;
	return myServerId;
}

function getFeedServerId() {
	var myServerId = UserOptions.TokenDomain;
	var squery = /[\?,\&]s=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myServerId = Sresult;
	return myServerId;
}

function getFeedId() {
	var myFeedId = 'n/a';
	var squery = /[\?,\&]f=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myFeedId = Sresult;
	return myFeedId;
}

function getFeedUserId() {
	var myFeedUserId = 'n/a';
	var squery = /[\?,\&]in=\d+/;
	var dquery = /\d+/;
	var Sresult = dquery.exec(squery.exec(document.location.search));
	if (Sresult)
		myFeedUserId = Sresult;
	return myFeedUserId;
}
