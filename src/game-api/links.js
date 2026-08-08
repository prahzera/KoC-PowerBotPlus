function coordLink(x, y, noclass) {
	var cl = 'class=xlink';
	if (noclass) { cl = ''; }
	var m = [];
	m.push('(<a ' + cl + ' onclick="btGotoMapHide (');
	m.push(x);
	m.push(',');
	m.push(y);
	m.push('); return false">');
	m.push(x);
	m.push(',');
	m.push(y);
	m.push('</a>)');
	return m.join('');
}

function MonitorLink(id, n, cl) {
	if (uW.isNewServer()) { return n; }
	var m = [];
	if (!cl) { cl = 'xlink'; }
	m.push('<a class=' + cl + ' onclick="btMonitorExternalCallUID (\'');
	m.push(id);
	m.push('\'); return false">');
	m.push(n);
	m.push('</a>');
	return m.join('');
}

function MonitorLinkUID(n) {
	if (uW.isNewServer()) { return n; }
	var m = [];
	m.push(n);
	m.push('&nbsp;<a class=xlink onclick="btMonitorExternalCallUID (\'');
	m.push(n);
	m.push('\'); return false">');
	m.push('(' + tx('Monitor') + ')');
	m.push('</a>');
	return m.join('');
}

function PlayerLink(id, n) {
	var m = [];
	m.push('<a class=xlink onclick="ptPlayerDetails (\'');
	m.push(id);
	m.push('\'); return false">');
	m.push(n);
	m.push('</a>');
	return m.join('');
}

function CityLink(c) {
	var m = [];
	m.push('<a class=xlink onclick="btShowCity (\'');
	m.push(c.idx + 1);
	m.push('\'); return false">');
	m.push(c.name);
	m.push('</a>');
	return m.join('');
}

function officerId2String(oid) {
	if (oid == null) return '';
	var ret = uW.allianceOfficerTypeMapping[oid];
	if (ret) return ret;
	return '';
}
