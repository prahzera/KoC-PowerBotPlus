/** Visual polish & animations **/

function BotVisualCSS() {
	return '\
		/* === PowerBot+ UI polish / animations === */\
		.tab, a.buttonv2.std, a.inlineButton.btButton, a.xlink, .TextLink, .divLink, .btExpander, .btBackExpander, #btEmoticonLink {\
			transition: filter .12s ease, transform .08s ease, opacity .12s ease, color .12s ease;\
		}\
		.tab:hover, a.buttonv2.std:hover, a.inlineButton.btButton:hover, a.xlink:hover, .TextLink:hover { filter: brightness(1.07); }\
		.tab:active, a.buttonv2.std:active, a.inlineButton.btButton:active, #btEmoticonLink:active {\
			transform: translateY(1px);\
			filter: brightness(.92);\
		}\
		.btExpander, .btBackExpander, .divHeader { cursor: pointer; }\
		.btExpander:hover, .btBackExpander:hover { filter: brightness(1.1); }\
		a:focus-visible { outline: 2px solid #88ccff; outline-offset: 2px; }\
		.btInput:focus { outline: 2px solid rgba(136,204,255,.6); }\
		.btPopupTop, tr[id$="_bar"] { cursor: move; transition: filter .15s ease, background-color .15s ease; }\
		.btPopupTop:hover, tr[id$="_bar"]:hover { filter: brightness(1.1); }\
		td[id$="_X"] { cursor: pointer !important; transition: filter .1s ease; }\
		td[id$="_X"]:hover { filter: brightness(1.8); }\
		table.xtab tr:hover td, table.xtabBR tr:hover td { background-color: rgba(0,0,0,0.09); }\
		a[id^="clickBat"], a[id^="SearchCol"], a[id^="btMSort"] { cursor: pointer; }\
		a[id^="clickBat"].buttonv2.green { box-shadow: inset 0 0 0 2px #2f7d2f; }\
		body.pb-search-running #pbStatStatus, body.pb-search-running #pbStatSearched { animation: btPulse 1.4s ease-in-out infinite; }\
		body.pb-search-running #pbSearchSubmit { background: #c0392b; color: #fff; }\
		@keyframes btPulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }\
		.pb-loading { display: inline-block; }\
		.pb-loading::after { content: ""; display: inline-block; width: 12px; height: 12px; margin-left: 8px; vertical-align: middle; border: 2px solid #888; border-top-color: #222; border-radius: 50%; animation: btSpin .7s linear infinite; }\
		@keyframes btSpin { to { transform: rotate(360deg); } }\
		.botTabEnter { animation: btTabIn .15s ease; }\
		@keyframes btTabIn { from { opacity: .3; transform: translateY(-3px); } to { opacity: 1; transform: none; } }\
		#btToastWrap {\
			position: fixed;\
			top: 8px;\
			right: 8px;\
			z-index: 2147483647;\
			display: flex;\
			flex-direction: column;\
			align-items: flex-end;\
			gap: 6px;\
			max-width: 360px;\
		}\
		.btToast {\
			display: flex;\
			align-items: flex-start;\
			gap: 8px;\
			padding: 9px 12px;\
			border-radius: 8px;\
			font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;\
			font-size: 12px;\
			font-weight: 600;\
			line-height: 1.35;\
			color: #fff;\
			background: #4a4e5a;\
			border: 1px solid rgba(0,0,0,0.25);\
			box-shadow: 0 4px 14px rgba(0,0,0,0.35);\
			animation: btToastIn .18s ease;\
			cursor: pointer;\
		}\
		.btToast.ok { background: linear-gradient(180deg, #2e8540, #236b32); }\
		.btToast.err { background: linear-gradient(180deg, #c0392b, #a83227); }\
		.btToastIcon svg { display: block; }\
		.btToastOut { animation: btToastOut .22s ease forwards; }\
		@keyframes btToastIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }\
		@keyframes btToastOut { to { opacity: 0; transform: translateY(-6px); } }\
		table.btZebra tbody tr:nth-child(even) td { background: rgba(0,0,0,0.04); }\
		body.btDarkTheme table.btZebra tbody tr:nth-child(even) td { background: rgba(255,255,255,0.035); }\
		body.btDarkTheme .oddRow { background: rgba(255,255,255,0.045) !important; }\
		body.btDarkTheme .evenRow { background: rgba(255,255,255,0) !important; }\
		.btEmpty { padding: 18px 10px; text-align: center; color: #8a8a8a; font-size: 12px; font-weight: 600; }\
		.btEmptyIcon { display: inline-block; vertical-align: -3px; margin-right: 7px; }\
		.btEmptyIcon svg { display: block; }\
		body.btDarkTheme .btEmpty { color: #a9a69a; }\
		.btPopup { border-width: 4px; box-shadow: 1px 3px 12px rgba(0,0,0,.35); }\
		.btPopup * { scrollbar-width: thin; }\n\
		.btPopup *::-webkit-scrollbar { width: 10px; height: 10px; }\n\
		.btPopup *::-webkit-scrollbar-thumb { background: rgba(0,0,0,.25); border-radius: 5px; }\n\
		.btPopup *::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.4); }\n\
		.btPopup *::-webkit-scrollbar-track { background: rgba(0,0,0,.05); }\n\
		body.btDarkTheme .btPopup { background: ' + (Options.Colors.Panel || '#fff') + ' !important; }\
		body[data-bt-reduce="1"] *, body[data-bt-anim="off"] * { animation: none !important; transition: none !important; }\
		body[data-bt-anim="smooth"] .tab, body[data-bt-anim="smooth"] a.buttonv2.std, body[data-bt-anim="smooth"] a.inlineButton.btButton, body[data-bt-anim="smooth"] .btPopupTop, body[data-bt-anim="smooth"] tr[id$="_bar"] {\
			transition-duration: .25s;\
		}\
		@media (prefers-reduced-motion: reduce) {\
			* { animation: none !important; transition: none !important; }\
		}';
}

function ApplyBotVisuals() {
	GM_addStyle(BotVisualCSS());
	GM_addStyle(BotModernCSS());
	var speed = GlobalOptions.btAnimSpeed || 'normal';
	document.body.setAttribute('data-bt-anim', speed);
	document.body.setAttribute('data-bt-reduce', GlobalOptions.btReduceMotion ? '1' : '0');
	if (GlobalOptions.btWindowStyle == 'classic') { document.body.classList.remove('btModern'); }
	else { document.body.classList.add('btModern'); }
	if (Options.Theme == 'Dark') { document.body.classList.add('btDarkTheme'); }
	else { document.body.classList.remove('btDarkTheme'); }
}

function SetAnimSpeed(speed) {
	document.body.setAttribute('data-bt-anim', speed || 'normal');
}

function SetWindowStyle(style) {
	if (style == 'classic') { document.body.classList.remove('btModern'); }
	else { document.body.classList.add('btModern'); }
}

function btAnimMs() {
	var s = GlobalOptions.btAnimSpeed || 'normal';
	if (s == 'off') return 0;
	if (s == 'smooth') return 280;
	return 150;
}

function btReducedMotion() {
	if (GlobalOptions.btReduceMotion) return true;
	if (document.body && document.body.getAttribute('data-bt-anim') == 'off') return true;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
	return false;
}

function btRaf(cb) {
	var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || function (f) { return setTimeout(f, 16); };
	return raf.call(window, cb);
}

function normalizeHex(h) {
	if (!h) { return ''; }
	h = String(h).trim();
	if (h.charAt(0) == '#') { h = h.substr(1); }
	if (/^[0-9a-fA-F]{3}$/.test(h)) { h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); }
	if (!/^[0-9a-fA-F]{6}$/.test(h)) { return ''; }
	return '#' + h.toLowerCase();
}

function btAccentHex() {
	if (!GlobalOptions.btAccent) return '#2f63b8';
	if (GlobalOptions.btAccent == 'theme') return (Options.Colors.Title || '#342819');
	if (GlobalOptions.btAccent.charAt(0) === '#') return GlobalOptions.btAccent;
	switch (GlobalOptions.btAccent) {
		case 'green': return '#2e8540';
		case 'purple': return '#6f42c1';
		case 'orange': return '#c2550a';
		case 'red': return '#c0392b';
		case 'blue':
		default: return '#2f63b8';
	}
}

function SetAccent() {
	// Re-inyecta los estilos modernos para aplicar el nuevo acento en vivo
	GM_addStyle(BotModernCSS());
}

function btShade(hex, amt) { // amt -1..1: negativo = más oscuro, positivo = más claro
	if (!hex) { return hex; }
	var c = HEXtoRGB(hex);
	if (!c) { return hex; }
	function to(x) {
		x = Math.round(x);
		if (x < 0) x = 0;
		if (x > 255) x = 255;
		var s = x.toString(16);
		return s.length == 1 ? '0' + s : s;
	}
	return '#' + to(c.r + (255 - c.r) * Math.max(amt, 0) + c.r * Math.min(amt, 0)) + to(c.g + (255 - c.g) * Math.max(amt, 0) + c.g * Math.min(amt, 0)) + to(c.b + (255 - c.b) * Math.max(amt, 0) + c.b * Math.min(amt, 0));
}

function BotModernCSS() {
	var Panel = Options.Colors.Panel || '#F7F3E6';
	var Title = Options.Colors.Title || '#342819';
	var TitleDark = btShade(Title, -0.12);
	var Accent = btAccentHex();
	var AccentDark = btShade(Accent, -0.12);
	return '\
		/* === PowerBot+ modern window design === */\
		body.btModern .btPopup {\
			background: ' + Panel + ';\
			border: 1px solid rgba(0,0,0,0.18);\
			border-radius: 12px;\
			box-shadow: 0 10px 30px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.12);\
			font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;\
		}\
		body.btModern .btPopMain { border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }\
		body.btModern tr.btPopupTop td {\
			background: linear-gradient(180deg, ' + Title + ', ' + TitleDark + ') !important;\
			border: none !important;\
			border-bottom: 1px solid rgba(0,0,0,0.25) !important;\
			height: 26px !important;\
			font-weight: 600 !important;\
			font-size: 12px !important;\
			letter-spacing: 0.3px;\
		}\
		body.btModern tr.btPopupTop td:first-child { border-top-left-radius: 12px !important; }\
		body.btModern tr.btPopupTop td:last-child { border-top-right-radius: 12px !important; }\
		body.btModern td[id$="_X"] {\
			background: transparent !important;\
			border: none !important;\
			border-radius: 0 !important;\
			box-shadow: none !important;\
			width: 14px !important;\
			height: 14px !important;\
			margin: 0 4px !important;\
			color: rgba(255,255,255,0.85) !important;\
			font-size: 15px !important;\
			font-weight: 400 !important;\
			line-height: 14px !important;\
			text-shadow: none !important;\
			transition: color .12s ease, transform .08s ease !important;\
		}\
		body.btModern td[id$="_X"]:hover { color: #ff6b6b !important; transform: scale(1.3); background: transparent !important; }\
		body.btModern a.inlineButton.btButton {\
			background-image: none !important;\
			background-color: ' + Accent + ' !important;\
			border-radius: 5px;\
			box-shadow: 0 1px 2px rgba(0,0,0,0.28);\
			padding: 2px 9px;\
			font-weight: 600;\
			text-shadow: none;\
			color: #fff;\
		}\
		body.btModern a.inlineButton.btButton > span { background: none !important; color: inherit !important; text-shadow: none !important; }\
		body.btModern a.inlineButton.btButton:hover { background-color: ' + AccentDark + ' !important; filter: brightness(1.05); }\
		body.btModern a.inlineButton.btButton.brown8, body.btModern a.inlineButton.btButton.brown11 { background-color: #8a5a2b !important; }\
		body.btModern a.inlineButton.btButton.brown8:hover, body.btModern a.inlineButton.btButton.brown11:hover { background-color: #a06a35 !important; filter: brightness(1.05); }\
		body.btModern a.inlineButton.btButton.red14, body.btModern a.inlineButton.btButton.red20 { background-color: #c0392b !important; }\
		body.btModern a.inlineButton.btButton.red14:hover, body.btModern a.inlineButton.btButton.red20:hover { background-color: #a83227 !important; filter: brightness(1.05); }\
		body.btModern a.inlineButton.btButton.green20 { background-color: #2e8540 !important; }\
		body.btModern a.inlineButton.btButton.green20:hover { background-color: #236b32 !important; filter: brightness(1.05); }\
		body.btModern a.inlineButton.btButton.disabled { opacity: 0.55 !important; cursor: default !important; pointer-events: none !important; }\
		body.btModern a.buttonv2.red14, body.btModern a.buttonv2.red20 { background-color: #c0392b !important; border-color: #c0392b !important; color: #fff !important; }\
		body.btModern a.buttonv2.green20 { background-color: #2e8540 !important; border-color: #2e8540 !important; color: #fff !important; }\
		.btToast.info { background: linear-gradient(180deg, ' + Accent + ', ' + AccentDark + '); }\
		#btBusyOverlay {\
			position: fixed;\
			inset: 0;\
			z-index: 2147483646;\
			background: rgba(0,0,0,0.0);\
			display: none;\
			align-items: flex-start;\
			justify-content: center;\
			pointer-events: none;\
			padding-top: 8px;\
		}\
		#btBusyOverlay.btBusyShow { display: flex; }\
		.btBusyBox {\
			display: flex;\
			align-items: center;\
			gap: 10px;\
			padding: 12px 18px;\
			border-radius: 10px;\
			background: ' + Panel + ';\
			color: ' + (Options.Colors.PanelText || '#222') + ';\
			border: 1px solid rgba(0,0,0,0.18);\
			box-shadow: 0 6px 22px rgba(0,0,0,0.3);\
			font-family: \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;\
			font-size: 13px;\
			font-weight: 600;\
		}\
		.btBusySpin {\
			width: 16px;\
			height: 16px;\
			border: 2px solid #999;\
			border-top-color: ' + Accent + ';\
			border-radius: 50%;\
			animation: btSpin .7s linear infinite;\
		}\
		body.btDarkTheme .btBusyBox { background: #3a3d47; color: #E3E1D6; }\
		body.btModern a[id^="bttc"], body.btModern div[id^="bttc"] {\
			background-image: none !important;\
			border: 1px solid rgba(0,0,0,0.12) !important;\
			border-radius: 999px !important;\
			box-shadow: none !important;\
			height: 20px !important;\
			padding: 0 10px !important;\
			display: inline-flex;\
			align-items: center;\
			justify-content: center;\
			gap: 5px;\
			box-sizing: border-box !important;\
			text-align: center;\
			color: #3a3a3a !important;\
			font-size: 11px;\
			font-weight: 600;\
			line-height: 1;\
			text-shadow: none !important;\
			transition: background-color .12s ease, color .12s ease, transform .08s ease;\
		}\
		body.btModern a[id^="bttc"] span, body.btModern div[id^="bttc"] span { width: auto !important; height: auto !important; white-space: nowrap !important; }\
		body.btModern span.btTabIcon { flex: 0 0 auto; line-height: 0; }\
		body.btModern span.btTabIcon svg { width: 12px; height: 12px; display: block; }\
		body.btModern span.btTabText { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; line-height: normal; }\
		body.btModern a[id^="bttc"].brown, body.btModern div[id^="bttc"].brown { background-color: rgba(154,96,40,0.12) !important; border-color: rgba(154,96,40,0.30) !important; color: #7d4d1f !important; }\
		body.btModern a[id^="bttc"].brown:hover, body.btModern div[id^="bttc"].brown:hover { background-color: rgba(154,96,40,0.20) !important; filter: none; }\
		body.btModern a[id^="bttc"].red, body.btModern div[id^="bttc"].red { background-color: rgba(192,57,43,0.10) !important; border-color: rgba(192,57,43,0.30) !important; color: #a83227 !important; }\
		body.btModern a[id^="bttc"].red:hover, body.btModern div[id^="bttc"].red:hover { background-color: rgba(192,57,43,0.18) !important; filter: none; }\
		body.btModern a[id^="bttc"].blue, body.btModern div[id^="bttc"].blue { background-color: rgba(47,99,184,0.10) !important; border-color: rgba(47,99,184,0.30) !important; color: #2b5aa8 !important; }\
		body.btModern a[id^="bttc"].blue:hover, body.btModern div[id^="bttc"].blue:hover { background-color: rgba(47,99,184,0.18) !important; filter: none; }\
		body.btModern a[id^="bttc"]:hover, body.btModern div[id^="bttc"]:hover { filter: none; }\
		body.btModern.btDarkTheme a[id^="bttc"], body.btModern.btDarkTheme div[id^="bttc"] { background-color: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.14) !important; color: #E3E1D6 !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].brown, body.btModern.btDarkTheme div[id^="bttc"].brown { background-color: rgba(214,154,94,0.14) !important; border-color: rgba(214,154,94,0.32) !important; color: #e0bd94 !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].brown:hover, body.btModern.btDarkTheme div[id^="bttc"].brown:hover { background-color: rgba(214,154,94,0.22) !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].red, body.btModern.btDarkTheme div[id^="bttc"].red { background-color: rgba(240,120,104,0.14) !important; border-color: rgba(240,120,104,0.32) !important; color: #efb0a8 !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].red:hover, body.btModern.btDarkTheme div[id^="bttc"].red:hover { background-color: rgba(240,120,104,0.22) !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].blue, body.btModern.btDarkTheme div[id^="bttc"].blue { background-color: rgba(120,164,230,0.14) !important; border-color: rgba(120,164,230,0.32) !important; color: #b7cdf0 !important; }\
		body.btModern.btDarkTheme a[id^="bttc"].blue:hover, body.btModern.btDarkTheme div[id^="bttc"].blue:hover { background-color: rgba(120,164,230,0.22) !important; }\
		body.btModern a[id^="bttc"].buttonv2.green, body.btModern div[id^="bttc"].buttonv2.green {\
			background-image: none !important;\
			background-color: ' + Accent + ' !important;\
			border-color: ' + Accent + ' !important;\
			color: #fff !important;\
			box-shadow: none !important;\
			text-shadow: none !important;\
		}\
		body.btModern a[id^="bttc"].buttonv2.green:hover, body.btModern div[id^="bttc"].buttonv2.green:hover { background-color: ' + AccentDark + ' !important; filter: none; }\
		body.btModern a.buttonv2.std { border-radius: 6px; text-shadow: 0 1px 1px rgba(0,0,0,0.25); }\
		body.btModern .divHeader { border-radius: 8px; letter-spacing: 0.3px; font-weight: 700; padding-left: 8px; }\
		body.btModern table.xtab td.xtabHD, body.btModern table.xtab td.xtabHDDef { background: rgba(0,0,0,0.045); border-radius: 4px; }\
		body.btModern select, body.btModern input.btInput, body.btModern input[type=text], body.btModern input[type=number] {\
			border: 1px solid rgba(0,0,0,0.22);\
			border-radius: 4px;\
			padding: 1px 3px;\
			background: #fff;\
			color: #222;\
		}\
		body.btModern select:focus, body.btModern input:focus { outline: 2px solid ' + btShade(Accent, 0.4) + '; border-color: ' + Accent + '; }\
		body.btModern input[type=checkbox] { accent-color: ' + Accent + '; }\
		body.btModern #bot_comm_input { border-radius: 6px; padding: 2px 6px; }\
		body.btModern .ui-tabs .ui-tabs-panel { font-family: inherit; }\
		body.btModern.btDarkTheme select, body.btModern.btDarkTheme input.btInput, body.btModern.btDarkTheme input[type=text], body.btModern.btDarkTheme input[type=number] {\
			background: #2b2d35;\
			color: #E3E1D6;\
			border-color: rgba(255,255,255,0.18);\
		}';
}