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
	var speed = GlobalOptions.btAnimSpeed || 'normal';
	document.body.setAttribute('data-bt-anim', speed);
	document.body.setAttribute('data-bt-reduce', GlobalOptions.btReduceMotion ? '1' : '0');
	if (Options.Theme == 'Dark') { document.body.classList.add('btDarkTheme'); }
	else { document.body.classList.remove('btDarkTheme'); }
}

function SetAnimSpeed(speed) {
	document.body.setAttribute('data-bt-anim', speed || 'normal');
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