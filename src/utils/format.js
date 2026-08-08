function htmlSelector(valNameObj, curVal, tags, valTagsObj, sorted) {
	var SortedArray = [];
	for (var k in valNameObj) { SortedArray.push(k); }
	if (sorted) { SortedArray.sort(function (a, b) { if (valNameObj[a] < valNameObj[b]) return -1; if (valNameObj[a] > valNameObj[b]) return 1; return 0; }); }

	m = [];
	m.push('<SELECT');
	if (tags) {
		m.push(' ');
		m.push(tags);
	}
	for (var i = 0; i < SortedArray.length; i++) {
		var k = SortedArray[i];
		m.push('><OPTION');
		if (k == curVal)
			m.push(' SELECTED');
		if (valTagsObj && valTagsObj[k])
			m.push(' ' + valTagsObj[k]);
		m.push(' value="');
		m.push(k);
		m.push('">');
		m.push(valNameObj[k]);
		m.push('</option>');
	}
	m.push('</select>');
	return m.join('');
}
