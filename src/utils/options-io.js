function readGlobalOptions() {
	s = GM_getValue('Options_??');
	if (s != null) {
		opts = JSON2.parse(s);
		for (var k in opts) {
			if (matTypeof(opts[k]) == 'object') {
				for (var kk in opts[k]) {
					if (GlobalOptions[k]) {
						GlobalOptions[k][kk] = opts[k][kk];
					}
				}
			}
			else {
				GlobalOptions[k] = opts[k];
			}
		}
	}
	if (GlobalOptions.GlobalOptionsVersion && GlobalOptions.GlobalOptionsVersion != "0" && AutoUpdater.compareVersion(Version, GlobalOptions.GlobalOptionsVersion)) {
		GlobalOptionsUpdate();
		GlobalOptions.GlobalOptionsVersion = Version;
		saveGlobalOptions();
	}
}

function saveGlobalOptions() {
	setTimeout(function () { GM_setValue('Options_??', JSON2.stringify(GlobalOptions)); }, 0); // get around GM_SetValue uW error
}

function readOptions() {
	var serverID = getServerId();
	s = GM_getValue('Options_' + serverID + '_' + uW.tvuid);
	if (s != null) {
		opts = JSON2.parse(s);
		for (var k in opts)
			Options[k] = opts[k];
	}
	if (Options.OptionsVersion && Options.OptionsVersion != "0" && AutoUpdater.compareVersion(Version, Options.OptionsVersion)) {
		OptionsUpdate();
		Options.OptionsVersion = Version;
		saveOptions();
	}
}

function saveOptions() {
	if (uW.btLoaded) {
		var serverID = getServerId();
		setTimeout(function () { GM_setValue('Options_' + serverID + '_' + uW.tvuid, JSON2.stringify(Options)); }, 0); // get around GM_SetValue uW error
	}
}

function readUserOptions(user_id) { // facebook user id
	if (!user_id || user_id == "") { return; }
	s = GM_getValue('UserOptions_' + user_id);
	if (s != null) {
		opts = JSON2.parse(s);
		for (var k in opts)
			UserOptions[k] = opts[k];
	}
}

function saveUserOptions(user_id) { // facebook user id
	if (!user_id || user_id == "") { return; }
	setTimeout(function () { GM_setValue('UserOptions_' + user_id, JSON2.stringify(UserOptions)); }, 0); // get around GM_SetValue uW error
}

function readLanguage(lang) {
	NoTranslation = {};
	LanguageArray = {};
	var s = GM_getValue("LanguageArray_" + lang);
	if (s != null) {
		var lang = JSON2.parse(s);
		for (var k in lang) { LanguageArray[k] = lang[k]; }
	}
}

function saveLanguage(lang) {
	setTimeout(function () { GM_setValue("LanguageArray_" + lang, JSON2.stringify(LanguageArray)); }, 0);
}

function ToggleOption(optionArea, checkboxId, optionName, callOnChange, callIsAvailable) {
	var checkbox = ById(checkboxId);
	if (callIsAvailable && callIsAvailable() == false) {
		checkbox.disabled = true;
		return;
	};
	if (optionArea == "") { var checkMe = Options[optionName] }
	else { var checkMe = Options[optionArea][optionName] }
	checkbox.checked = checkMe;

	checkbox.addEventListener('change', eventHandler, false);

	function eventHandler() {
		if (optionArea == "") { Options[optionName] = this.checked; }
		else { Options[optionArea][optionName] = this.checked; }
		saveOptions();
		if (callOnChange) callOnChange(this.checked);
	}
}

function ChangeOption(optionArea, valueId, optionName, callOnChange) {
	var e = ById(valueId);
	if (optionArea == "") { e.value = Options[optionName] }
	else { e.value = Options[optionArea][optionName] }

	e.addEventListener('change', eventHandler, false);

	function eventHandler() {
		if (optionArea == "") { Options[optionName] = this.value; }
		else { Options[optionArea][optionName] = this.value; }
		saveOptions();
		if (callOnChange) { callOnChange(this.value); }
	}
}

function ChangeIntegerOption(optionArea, valueId, optionName, defaultValue, callOnChange) {
	var e = ById(valueId);
	if (optionArea == "") { e.value = Options[optionName] }
	else { e.value = Options[optionArea][optionName] }

	e.addEventListener('change', eventHandler, false);

	function eventHandler() {
		if (isNaN(this.value)) { this.value = parseIntNan(defaultValue); }
		if (optionArea == "") { Options[optionName] = parseIntNan(this.value); this.value = Options[optionName]; }
		else { Options[optionArea][optionName] = parseIntNan(this.value); this.value = Options[optionArea][optionName]; }
		saveOptions();
		if (callOnChange) { callOnChange(this.value); }
	}
}
