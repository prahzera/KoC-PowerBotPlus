function addScript(scriptText) {
	var scr = document.createElement('script');
	scr.innerHTML = scriptText;
	document.body.appendChild(scr);
}

addScript('uWFunc = function (text){ eval (text); }');

var CalterUwFunc = function (funcName, findReplace) {
	this.isAvailable = isAvailable;
	this.setEnable = setEnable;

	this.funcName = funcName;
	this.funcModifier = null;
	this.modIndex = 0;
	this.numberMods = 0;

	// find an existing CalterUwFunc if it already exists
	if (!uW.calterRegistry) uWCreateObjectIn('calterRegistry', {});
	var calterF = null;

	if (uW.calterRegistry[funcName]) {
		// use the existing function modifier
		calterF = uW.calterRegistry[funcName];
		for (var i = 0; i < findReplace.length; i++) {
			uW.calterRegistry[funcName].addModifier(findReplace[i]);
		}
	} else {
		// create and register the new calter
		calterF = new CalterFuncModifier(funcName, findReplace);
		if (typeof createObjectIn == 'function') {
			var newfunc = createObjectIn(uW.calterRegistry, { defineAs: funcName });
			exportFunction(calterF.applyModifiers, newfunc, { defineAs: 'applyModifiers' });
			exportFunction(calterF.addModifier, newfunc, { defineAs: 'addModifier' });
			exportFunction(calterF.enableModifier, newfunc, { defineAs: 'enableModifier' });
			exportFunction(calterF.testModifier, newfunc, { defineAs: 'testModifier' });
			exportFunction(calterF.modEnabled, newfunc, { defineAs: 'modEnabled' });
			exportFunction(calterF.numModifiers, newfunc, { defineAs: 'numModifiers' });

			exportFunction(calterF.funcOld, newfunc, { defineAs: 'funcOld' });
			newfunc.funcName = cloneInto(calterF.funcName, newfunc);
			newfunc.funcOldString = cloneInto(calterF.funcOldString, newfunc);
			newfunc.modifiers = cloneInto(calterF.modifiers, newfunc);
			newfunc.modsActive = cloneInto(calterF.modsActive, newfunc);
		}
		else {
			uW.calterRegistry[funcName] = uWCloneInto(calterF);
		}
	}
	if (typeof Object.assign == 'function') {
		this.funcModifier = Object.assign({}, uW.calterRegistry[funcName]);
	}
	else {
		this.funcModifier = calterF;
	}

	if (findReplace != null) {
		this.numberMods = findReplace.length;
		this.modIndex = this.funcModifier.numModifiers() - this.numberMods;
	}

	function isAvailable() {
		// check if any of the replace strings matched the original function
		var avail = false;
		for (var i = this.modIndex; i < this.modIndex + this.numberMods; i++) {
			if (this.funcModifier.testModifier(i)) avail = true;
		}
		return avail;
	}

	function setEnable(tf) {
		this.funcModifier.enableModifier(this.modIndex, tf, this.numberMods);
	}
}

var CalterFuncModifier = function (funcName, findReplace) {
	// (second argument is now optional )

	this.applyModifiers = applyModifiers;
	this.addModifier = addModifier;
	this.enableModifier = enableModifier;
	this.testModifier = testModifier;
	this.modEnabled = modEnabled;
	this.numModifiers = numModifiers;

	this.funcName = funcName;
	this.funcOld = null;
	this.funcOldString = null;
	this.funcNew = null;
	this.modifiers = [];
	this.modsActive = [];

	try {
		var x = this.funcName.split('.');
		var f = uW;
		for (var i = 0; i < x.length; i++)
			f = f[x[i]];
		ft = f.toString();
		this.funcOld = f;
		this.funcOldString = ft.replace('function ' + this.funcName, 'function');

		if (findReplace) {
			this.modifiers = findReplace;
			this.modsActive = new Array(findReplace.length);
			for (var i = 0; i < findReplace.length; i++) {
				this.modsActive[i] = false;
			}
		}
	} catch (err) {
		logit("CalterFuncModifier " + this.funcName);
		logerr(err);
	}

	// test if this modifier works on the original function.
	//	true = match found / replace possible
	//	false = does not match
	function testModifier(modNumber) {
		x = this.funcOldString.replace(this.modifiers[modNumber][0], this.modifiers[modNumber][1]);
		if (x != this.funcOldString) {
			return true;
		}
		return false;
	}

	// use the active modifiers to create/apply a new function
	function applyModifiers() {
		try {
			var rt = this.funcOldString;
			var active = false;

			for (var i = 0; i < this.modifiers.length; i++) {
				if (!this.modsActive[i]) continue;

				x = rt.replace(this.modifiers[i][0], this.modifiers[i][1]);
				if (x == rt) { // if not found
					// print out an error message when the match fails.
					// These messages get lost on a refresh, so wait a few seconds to put it in the error log.
					function CalterError(fname, repStr, ftstr) {
						logit("Unable to replace string in function " + fname);
						logit("Replacement string:" + repStr);
						logit("Function listing: " + ftstr);
					}
					setTimeout(CalterError, 5000, this.funcName, this.modifiers[i][0], ft);
				}
				else {
					rt = x;
					active = true;
				}
			}

			this.funcNew = rt;

			if (active) {
				// apply the new function
				uW.uWFunc(this.funcName + ' = ' + this.funcNew);
			} else {
				// set to the original function
				var x1 = this.funcName.split('.');
				var f1 = uW;
				for (var i = 0; i < x1.length - 1; i++)
					f1 = f1[x1[i]];
				f1[x1[x1.length - 1]] = this.funcOld;
			}
		} catch (err) {
			logit("CalterFuncModifier " + this.funcName);
			logerr(err);
		}
	}

	// add additional modifiers. The index of the modifier is returned so the caller can enable/disable it specificially
	function addModifier(fr) {
		fr = uWCloneInto(fr);
		this.modifiers.push(fr);
		this.modsActive.push(false);
		// return the index of the newly added modifier
		return this.modifiers.length - 1;
	}

	// turn on/off some of the modifiers.
	// 'len' allows setting consectutive modifiers to the same value.
	// If len is null, 1 is used
	function enableModifier(modNumber, value, len) {
		if (len == null) len = 1;
		for (var i = modNumber; i < modNumber + len; i++) {
			if (i < this.modsActive.length) {
				this.modsActive[i] = value;
			}
		}
		this.applyModifiers();
	}

	function modEnabled(modNumber) {
		if (modNumber < this.modsActive.length)
			return this.modsActive[modNumber];
	}

	function numModifiers() {
		return this.modifiers.length;
	}
}
