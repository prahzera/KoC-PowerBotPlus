function CheckHideFBDialogs() {
	var FBClasses = ByCl('_10 uiLayer _4-hy _3qw');
	var i = FBClasses.length;
	while (i--) { FBClasses[i].parentNode.removeChild(FBClasses[i]); }
};

(function () {
	var _massSalvageObserver = new MutationObserver(function (mutations) {
		for (var m = 0; m < mutations.length; m++) {
			var nodes = mutations[m].addedNodes;
			for (var n = 0; n < nodes.length; n++) {
				var node = nodes[n];
				if (node.nodeType !== 1) continue;
				var titleBars = node.querySelectorAll ? node.querySelectorAll('.primarytitlebar') : [];
				if (node.classList && node.classList.contains('primarytitlebar')) titleBars = [node];
				for (var t = 0; t < titleBars.length; t++) {
					var spans = titleBars[t].getElementsByTagName('span');
					var found = false;
					for (var s = 0; s < spans.length; s++) {
						if (spans[s].textContent.trim() === 'Deshacer en masa') { found = true; break; }
					}
					if (!found) continue;
					var container = titleBars[t].closest ? titleBars[t].closest('#massSalvageQualityList') : null;
					var list = ById('massSalvageQualityList');
					if (!list) {
						var root = titleBars[t].parentNode;
						while (root && root !== document.body) {
							list = root.querySelector ? root.querySelector('#massSalvageQualityList') : null;
							if (list) break;
							root = root.parentNode;
						}
					}
					if (!list) list = document.querySelector('#massSalvageQualityList');
					if (!list) continue;
					for (var idx = 0; idx <= 5; idx++) {
						var cb = list.querySelector('#massSalvageQualityItem' + idx + ' input[type="checkbox"]');
						if (cb && !cb.checked) {
							cb.checked = true;
							cb.dispatchEvent(new Event('change', { bubbles: true }));
						}
					}
				}
			}
		}
	});
	_massSalvageObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
