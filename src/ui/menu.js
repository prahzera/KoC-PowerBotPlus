/** Reusable dropdown menu (btMenu) **/

var btMenuCur = null;

function btMenuClose() {
	var m = btMenuCur;
	if (!m) { return; }
	btMenuCur = null;
	if (m.docDown) { document.removeEventListener('mousedown', m.docDown, true); }
	if (m.docKey) { document.removeEventListener('keydown', m.docKey, true); }
	if (m.winResize) { window.removeEventListener('resize', m.winResize, true); }
	if (m.el && m.el.parentNode) { m.el.parentNode.removeChild(m.el); }
	if (m.opts && typeof m.opts.onClose == 'function') { try { m.opts.onClose(); } catch (e) { logerr(e); } }
}

function btMenuItems(el, items) {
	for (var i = 0; i < items.length; i++) {
		var it = items[i];
		if (!it) { continue; }
		if (it.sep) {
			if (el.childNodes.length) {
				var sp = document.createElement('div');
				sp.className = 'btMenuSep';
				el.appendChild(sp);
			}
			continue;
		}
		var d = document.createElement('div');
		d.className = 'btMenuItem';
		if (it.disabled) { d.className += ' disabled'; }
		if (it.danger) { d.className += ' danger'; }
		d.setAttribute('role', 'menuitem');
		if (it.id) { d.id = it.id; }
		if (it.disabled) { d.setAttribute('aria-disabled', 'true'); }
		var lab = document.createElement('span');
		lab.className = 'btMenuItemLabel';
		lab.innerHTML = (it.label == null) ? '' : it.label;
		d.appendChild(lab);
		if (it.hint) {
			var hin = document.createElement('span');
			hin.className = 'btMenuItemHint';
			hin.textContent = it.hint;
			d.appendChild(hin);
		}
		if (!it.disabled && typeof it.onclick == 'function') {
			(function (item) {
				d.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					if (!item.keepOpen) { btMenuClose(); }
					try { item.onclick(item); }
					catch (err) { logerr(err); }
				}, false);
			})(it);
		}
		el.appendChild(d);
	}
	return el.childNodes.length;
}

function btMenuPlace(el, anchor, opts) {
	var r = anchor.getBoundingClientRect();
	var vw = window.innerWidth || document.documentElement.clientWidth;
	var vh = window.innerHeight || document.documentElement.clientHeight;
	var left = r.left;
	var top = r.bottom + 4;
	if (opts.point) { left = opts.point.x; top = opts.point.y; }
	if (opts.align == 'right') { left = r.right - el.offsetWidth; }
	if (left + el.offsetWidth > vw - 6) { left = vw - el.offsetWidth - 6; }
	if (left < 6) { left = 6; }
	if (top + el.offsetHeight > vh - 6) {
		var above = (opts.point ? (opts.point.y - el.offsetHeight - 6) : (r.top - el.offsetHeight - 4));
		top = (above > 6) ? above : (vh - el.offsetHeight - 6);
	}
	if (top < 6) { top = 6; }
	if (opts.minWidth) {
		var w = (opts.point ? 0 : r.width);
		if (w > el.offsetWidth) { el.style.minWidth = w + 'px'; }
	}
	el.style.left = Math.round(left) + 'px';
	el.style.top = Math.round(top) + 'px';
}

function btMenu(anchor, items, opts) {
	btMenuClose();
	opts = opts || {};
	if (!items || !items.length) { return null; }

	var el = document.createElement('div');
	el.className = 'btMenu';
	el.setAttribute('role', 'menu');
	el.tabIndex = -1;
	if (!btMenuItems(el, items)) { return null; }

	el.style.position = 'fixed';
	el.style.left = '0px';
	el.style.top = '0px';
	el.style.visibility = 'hidden';
	document.body.appendChild(el);
	btMenuPlace(el, anchor, opts);
	el.style.visibility = '';

	var m = { el: el, anchor: anchor, opts: opts };

	m.docDown = function (e) {
		var tg = e.target;
		if (tg === el || (el.contains && el.contains(tg))) { return; }
		if (tg === anchor || (anchor && anchor.contains && anchor.contains(tg))) { return; }
		btMenuClose();
	};
	m.docKey = function (e) {
		if (e.key == 'Escape' || e.key == 'Esc') {
			e.preventDefault();
			btMenuClose();
			return;
		}
		if (e.target !== el && !(el.contains && el.contains(e.target))) { return; }
		var items2 = el.querySelectorAll('.btMenuItem:not(.disabled)');
		if (!items2.length) { return; }
		var cur = -1;
		for (var i = 0; i < items2.length; i++) { if (items2[i] === e.target) { cur = i; } }
		if (e.key == 'ArrowDown') {
			e.preventDefault();
			items2[(cur + 1) % items2.length].focus();
		}
		else if (e.key == 'ArrowUp') {
			e.preventDefault();
			items2[(cur <= 0 ? items2.length : cur) - 1].focus();
		}
		else if (e.key == 'Enter' || e.key == ' ') {
			if (cur >= 0) { e.preventDefault(); items2[cur].click(); }
		}
	};
	m.winResize = function () { btMenuClose(); };

	document.addEventListener('mousedown', m.docDown, true);
	document.addEventListener('keydown', m.docKey, true);
	window.addEventListener('resize', m.winResize, true);
	btMenuCur = m;

	if (!opts.noFocus) { el.focus(); }
	return m;
}

function btMenuToggle(anchor, items, opts) {
	if (btMenuCur && btMenuCur.anchor === anchor) { btMenuClose(); return null; }
	return btMenu(anchor, items, opts);
}

function btMenuIsOpen(anchor) {
	return (btMenuCur && btMenuCur.anchor === anchor) ? true : false;
}
