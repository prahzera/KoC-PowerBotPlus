var GlobalOptions = {
	btWatchdog: true,
	btNoMoreRy: false,
	btWideScreenStyle: 'normal',
	btPowerBar: false,
	btFloatingPowerBar: true,
	btPowerBarPopups: true,
	btPowerBarOpen: false,
	DashboardToggle: true,
	btOverviewDashboardBtn: true,
	btChatOnRight: false,
	btChatBeforeDash: true,
	btWideMap: true,
	btWinSize: { x: 1000, y: 100 },
	btTrackOpen: true,
	btTransparent: false,
	btKocBgColor: '#ffffff', // Color de fondo del contenedor del juego (#kocContainer)
	btAnimSpeed: 'normal', // Velocidad de animación UI: 'normal' | 'smooth' | 'off'
	btAnimatePopups: true, // Animar apertura/cierre de ventanas emergentes
	btReduceMotion: false, // Forzar reducción de movimiento (independiente del SO)
	btWindowStyle: 'modern', // Estilo de ventanas: 'modern' | 'classic'
	btAccent: 'blue', // Color de acento UI: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'theme' | <hex>
	btTabColors: { blue: '#2b5aa8', brown: '#7d4d1f', red: '#a83227' }, // Colores base de los grupos de pestañas (tools / automations / key)
	AutoUpdates: true,
	UpdateLocation: 2, // 2 - GitHub (único origen publicado: releases del fork prahzera/KoC-PowerBotPlus)
	ExtendedDebugMode: false,
	InOutToggle: true,
	MarchPlusToggle: true,
	BattleToggle: true,
	TokenEnabled: true,
	LastTopURL: '',
	GlobalOptionsVersion: '0',
	ExtraTabsVersion: '0',
	TabAutoCheck: true,
	ExtraTabs: [
		{ "source": EXTERNAL_RESOURCE + "tabs/BulkAttack.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Defend.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Raid.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/GuardWidget.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Debug.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Tournament.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Megalith.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Champ.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Boss.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Resources.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/MAR.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
		{ "source": EXTERNAL_RESOURCE + "tabs/Joust.js", "data": null, "enabled": false, "lastchecked": 0, "version": "" },
	],
};

// ExtraTabs externos que ya se compilan dentro del script base. Si el tab nativo
// esta disponible, el externo no se evalua: si no, aparecerian dos tabs del
// mismo modulo (el externo define Tabs.PortalTime, Champ, Boss...) y el externo
// podria pisar la version nativa.
var NATIVE_TAB_REPLACEMENTS = {
	'tabs/Aport.js': 'Aport',
	'tabs/Champ.js': 'Champ',
	'tabs/Boss.js': 'Boss',
};

function isSupersededExtraTab(src) {
	if (matTypeof(src) != 'string') { return false; }
	for (var suffix in NATIVE_TAB_REPLACEMENTS) {
		if (src.indexOf(suffix) > -1) { return matTypeof(Tabs[NATIVE_TAB_REPLACEMENTS[suffix]]) == 'object'; }
	}
	return false;
}
