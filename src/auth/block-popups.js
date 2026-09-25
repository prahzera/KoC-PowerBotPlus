/** Block Facebook share popups and windows (any facebook host) **/

var FBHosts = ['facebook.com', 'fb.com', 'fb.me', 'fb.gg', 'messenger.com'];

function FBIsFacebookUrl(url) {
	if (!url) { return false; }
	var s = String(url);
	try { s = decodeURIComponent(s); } catch (e) { }
	s = s.replace(/&amp;/gi, '&');
	if (!s) { return false; }
	var host = '';
	var m = s.match(/^(?:[a-z][a-z0-9+.\-]*:)?\/\/([^/?#]*)/i);
	if (m) { host = m[1]; }
	else {
		// any other scheme (data:, blob:, mailto:, javascript:) is never facebook
		if (/^[a-z][a-z0-9+.\-]*:/i.test(s)) { return false; }
		// relative url => same host as this page, so never facebook
		return false;
	}
	if (host.indexOf('@') > -1) { host = host.split('@').pop(); }
	host = host.toLowerCase().split(':')[0];
	if (!host) { return false; }
	for (var i = 0; i < FBHosts.length; i++) {
		if (host == FBHosts[i] || host.slice(-(FBHosts[i].length + 1)) == '.' + FBHosts[i]) { return true; }
	}
	return false;
}

function FBBlocked(kind, url) {
	var msg = tx('Blocked Facebook window') + ' (' + kind + ') ' + String(url).substring(0, 150);
	logit(msg);
	try { actionLog(msg); } catch (e) { }
	try { uW.PBBlockedFBPopups = (uW.PBBlockedFBPopups || 0) + 1; } catch (e) { }
}

var FBBridgeOpen = null;

function FBInstallOpenGuard() {
	try {
		var w = uW;
		if (!w) { return; }
		if (FBBridgeOpen && w.open === FBBridgeOpen) { return; } // guard healthy

		var orig = w.open;
		if (typeof orig != 'function') { return; }

		var guard = function () {
			var url = arguments.length ? arguments[0] : '';
			if (FBIsFacebookUrl(url)) {
				FBBlocked('pop-up', url);
				return null;
			}
			return orig.apply(w, arguments);
		};
		FBBridgeOpen = guard;

		try {
			// self healing: if the page replaces window.open we keep guarding and
			// forward everything that is not facebook to the new function
			Object.defineProperty(w, 'open', {
				configurable: true,
				enumerable: true,
				get: function () { return guard; },
				set: function (v) { if (typeof v == 'function') { orig = v; } }
			});
		}
		catch (e) {
			w.open = guard; // defineProperty not available on this window
		}
	}
	catch (err) { logerr(err); }
}

function FBInstallLinkGuard() {
	try {
		if (!document.body || document.PBFBLinkGuard) { return; }
		document.addEventListener('click', function (ev) {
			var node = ev.target;
			var link = null;
			while (node && node.nodeType === 1) {
				if (String(node.tagName).toUpperCase() == 'A' && node.href) { link = node; break; }
				node = node.parentNode;
			}
			if (!link || !FBIsFacebookUrl(link.href)) { return; }
			FBBlocked('link', link.href);
			ev.preventDefault();
			ev.stopImmediatePropagation();
		}, true);
		document.PBFBLinkGuard = true;
	}
	catch (err) { logerr(err); }
}

function FBRemoveFrames(root) {
	if (!root || root.nodeType !== 1) { return; }
	var frames = [];
	if (String(root.tagName).toUpperCase() == 'IFRAME') { frames.push(root); }
	if (root.querySelectorAll) {
		var found = root.querySelectorAll('iframe[src]');
		for (var i = 0; i < found.length; i++) { frames.push(found[i]); }
	}
	for (var f = 0; f < frames.length; f++) {
		var src = frames[f].getAttribute('src') || '';
		if (!FBIsFacebookUrl(src)) { continue; }
		FBBlocked('frame', src);
		try { frames[f].parentNode.removeChild(frames[f]); }
		catch (e) { try { frames[f].style.display = 'none'; } catch (e2) { } }
	}
}

function FBInstallFrameGuard() {
	try {
		if (document.PBFBFrameGuard) { return; }
		var observer = new MutationObserver(function (mutations) {
			for (var m = 0; m < mutations.length; m++) {
				if (mutations[m].addedNodes) {
					for (var n = 0; n < mutations[m].addedNodes.length; n++) { FBRemoveFrames(mutations[m].addedNodes[n]); }
				}
				if (mutations[m].type == 'attributes') { FBRemoveFrames(mutations[m].target); }
			}
		});
		observer.observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
		document.PBFBFrameGuard = observer;
		FBRemoveFrames(document.body);
	}
	catch (err) { logerr(err); }
}

function BlockFacebookPopups() {
	FBInstallOpenGuard();
	FBInstallLinkGuard();
	FBInstallFrameGuard();
}

BlockFacebookPopups();
