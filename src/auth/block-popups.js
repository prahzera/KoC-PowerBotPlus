/** Block Facebook publish popups (feed dialog / sharer / apps.facebook.com) **/

function BlockPublishPopups() {
	try {
		var _origOpen = uW.open;
		var _fbPublishRe = /facebook\.com\/(dialog\/feed|sharer\/|sharer\.php)|apps\.facebook\.com/i;
		uW.open = function () {
			var url = arguments.length ? arguments[0] : '';
			if (typeof url == 'string' && _fbPublishRe.test(url)) {
				logit('Blocked Facebook publish popup: ' + url);
				return null;
			}
			return _origOpen.apply(uW, arguments);
		};
	}
	catch (err) {
		logerr(err);
	}
}

BlockPublishPopups();