function searchDOM(node, condition, maxLevel, doMult) {
	var found = [];
	eval('var compFunc = function (node) { return (' + condition + ') }');
	doOne(node, 1);
	if (!doMult) {
		if (found.length == 0)
			return null;
		return found[0];
	}
	return found;

	function doOne(node, curLevel) {
		try {
			if (compFunc(node))
				found.push(node);
		} catch (e) { }
		if (!doMult && found.length > 0)
			return;
		if (++curLevel < maxLevel && node.childNodes != undefined)
			for (var c = 0; c < node.childNodes.length; c++)
				doOne(node.childNodes[c], curLevel);
	}
}

function getClientCoords(e) {
	if (e == null)
		return { x: null, y: null, width: null, height: null };
	var x = 0, y = 0;
	ret = { x: 0, y: 0, width: e.clientWidth, height: e.clientHeight };
	while (e.offsetParent != null) {
		ret.x += e.offsetLeft;
		ret.y += e.offsetTop;
		e = e.offsetParent;
	}
	return ret;
}
