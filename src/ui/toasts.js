/** Toast notifications **/

var btToastIcons = {
	ok: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="6 12 10 16 18 8"></polyline></svg>',
	err: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
	info: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

function btLogoIcon() {
	return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M3 17l18 0"></path><path d="M5 17l2-10 5 6 5-6 2 10"></path></svg>';
}

function btToast(msg, kind) {
	if (!msg) { return; }
	var wrap = ById('btToastWrap');
	if (!wrap) {
		wrap = document.createElement('div');
		wrap.id = 'btToastWrap';
		document.body.appendChild(wrap);
	}
	kind = kind || 'ok';
	var toast = document.createElement('div');
	toast.className = 'btToast ' + kind;
	if (kind == 'err') { toast.setAttribute('role', 'alert'); }
	else { toast.setAttribute('role', 'status'); }
	toast.innerHTML = '<span class="btToastIcon">' + (btToastIcons[kind] || btToastIcons.info) + '</span><span class="btToastMsg"></span>';
	toast.lastChild.textContent = msg;
	toast.addEventListener('click', function () { btToastClose(toast); }, false);
	wrap.appendChild(toast);
	while (wrap.childNodes.length > 4) { wrap.removeChild(wrap.firstChild); }
	setTimeout(function () { toast.classList.add('btToastOut'); }, 3200);
	setTimeout(function () { btToastClose(toast); }, 3550);
}

function btToastClose(toast) {
	if (toast && toast.parentNode) { toast.parentNode.removeChild(toast); }
}

function btBusy(on, msg) {
	var ov = ById('btBusyOverlay');
	if (on) {
		if (!ov) {
			ov = document.createElement('div');
			ov.id = 'btBusyOverlay';
			document.body.appendChild(ov);
		}
		ov.innerHTML = '<div class="btBusyBox"><span class="btBusySpin"></span><span class="btBusyMsg"></span></div>';
		var mm = ov.querySelector('.btBusyMsg');
		if (mm && msg) { mm.textContent = msg; }
		ov.classList.add('btBusyShow');
	}
	else {
		if (ov) { ov.classList.remove('btBusyShow'); }
	}
}

function btEmptyState(label, kind) {
	var icon = btToastIcons[kind] || btToastIcons.info;
	var safe = String(label == null ? '' : label).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return '<div class="btEmpty"><span class="btEmptyIcon">' + icon + '</span><span class="btEmptyLabel">' + safe + '</span></div>';
}