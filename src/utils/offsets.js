function getAbsoluteOffsets(e) {
	ret = { left: 0, top: 0 };
	while (e.offsetParent) {
		if (e.style.position == 'absolute') break;
		ret.left += e.offsetLeft - e.scrollLeft;
		ret.top += e.offsetTop - e.scrollTop;
		e = e.offsetParent;
	}
	return ret;
}

function getOffset(el) {
	ret = { left: 0, top: 0 };
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		ret.left += el.offsetLeft - el.scrollLeft;
		ret.top += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return ret;
}

function getStyle(x, styleProp) {
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
	return y;
}
