function uWExportFunction(uwfunc, func) {
	try {
		if (typeof exportFunction == 'function') { exportFunction(func, uW, { defineAs: uwfunc }); }
		else { eval('uW.' + uwfunc + ' = ' + func); }
	} catch (e) { logerr(e); }
}

function uWCloneInto(obj) {
	try {
		if (typeof cloneInto == 'function') { return cloneInto(obj, uW); }
		else { return obj; }
	} catch (e) { logerr(e); }
}

function uWCreateObjectIn(objname, obj) {
	try {
		if (typeof createObjectIn == 'function') { return createObjectIn(uW, { defineAs: objname }); }
		else { uW[objname] = obj; return uW[objname]; }
	} catch (e) { logerr(e); }
}
