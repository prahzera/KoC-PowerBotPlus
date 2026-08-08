function DefaultWindowPos(OptPos, elem, force) {
	if (force || (Options[OptPos] == null) || (Options[OptPos].x == null) || (Options[OptPos].x == '') || (isNaN(Options[OptPos].x))) {
		var c = getClientCoords(ById(elem));
		Options[OptPos].x = c.x + 4;
		Options[OptPos].y = c.y + c.height;
		saveOptions();
	}
}

function ToggleDivDisplay(form, h, w, div, autoclose) {
	var dc = jQuery('#' + div).attr('class');
	if (dc) {
		if (dc.indexOf('divHide') >= 0) {
			jQuery('#' + div).attr('class', '');
			jQuery('#' + div + 'Arrow').attr('src', DownArrow);
			if (autoclose) {
				lastdiv = "";
				if (OpenDiv[form]) {
					lastdiv = OpenDiv[form];
				}
				if (lastdiv != "") {
					ToggleDivDisplay(form, h, w, lastdiv);
				}
				OpenDiv[form] = div;
			}
		}
		else {
			jQuery('#' + div).attr('class', 'divHide');
			jQuery('#' + div + 'Arrow').attr('src', RightArrow);
			if (autoclose) { OpenDiv[form] = ''; }
		}
	}
	else {
		jQuery('#' + div).attr('class', 'divHide');
		jQuery('#' + div + 'Arrow').attr('src', RightArrow);
		if (autoclose) { OpenDiv[form] = ''; }
	}
	if (form) ResetFrameSize(form, h, w);
}

function ToggleMainDivDisplay(form, h, w, div, autoclose, opt) {
	var dc = jQuery('#' + div).attr('class');
	if (dc) {
		if (dc.indexOf('divHide') >= 0) {
			jQuery('#' + div).attr('class', '');
			jQuery('#' + div + 'Arrow').attr('src', DownArrow);
			if (autoclose) {
				lastdiv = "";
				if (OpenDiv[form]) {
					lastdiv = OpenDiv[form];
				}
				if (lastdiv != "") {
					ToggleDivDisplay(form, h, w, lastdiv);
				}
				OpenDiv[form] = div;
				if (opt) { Options[opt] = div; }
			}
		}
		else {
			jQuery('#' + div).attr('class', 'divHide');
			jQuery('#' + div + 'Arrow').attr('src', RightArrow);
			if (autoclose) {
				OpenDiv[form] = '';
				if (opt) { Options[opt] = ''; }
			}
		}
	}
	else {
		jQuery('#' + div).attr('class', 'divHide');
		jQuery('#' + div + 'Arrow').attr('src', RightArrow);
		if (autoclose) { OpenDiv[form] = ''; }
	}
	ResetFrameSize('btMain', h, w);
}

function ResetFrameSize(prefix, minheight, minwidth) {
	var h1 = ById(prefix + '_bar');
	var h2 = ById(prefix + '_content');
	if (!h1 || !h2) return;
	var h = h1.clientHeight + h2.clientHeight;
	if (h < minheight) h = minheight;
	jQuery('#' + prefix + '_outer').css('height', h + 10);

	w = ById(prefix + '_content').clientWidth;
	w2 = ById(prefix + '_outer').clientWidth;
	if (w < minwidth) w = minwidth;
	if (w2 < w) // I don't know why I need this.. must look at this later to try and get it to shrink again
		jQuery('#' + prefix + '_outer').css('width', w + 10);
}
