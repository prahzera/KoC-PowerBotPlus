#!/usr/bin/env node
/**
 * MANIFEST DEL PROYECTO — KoC Power Bot Plus
 *
 * Este archivo define el ORDEN de concatenación de src/ en la build.
 * src/ es la fuente de verdad: se edita ahí y `node build.js` regenera
 * script.js (artefacto compilado, que se commitea para que las URLs de
 * instalación y el auto-update de Tampermonkey sigan funcionando).
 *
 * Cada entrada es una ruta relativa dentro de src/. El orden de arriba a
 * abajo = orden de concatenación. footer/init.js SIEMPRE va último porque
 * contiene el bloque de arranque (PowerBotStartup).
 *
 * - Reordenar código = mover la entrada correspondiente.
 * - Archivos NUEVOS en src/ se registran solos al ejecutar `node build.js`
 *   (se insertan justo antes de footer/init.js).
 * - NO hay números de línea: ya no se extrae src/ desde script.js.
 */
'use strict';

/**
 * Rutas relativas dentro de src/, en orden de concatenación.
 */
const MANIFEST = [
  // ─────────────────────────── meta ───────────────────────────
  'meta/header.js', // banner // ==UserScript== (1-48) + línea en blanco

  // ─────────────────────────── core (globals) ───────────────────────────
  'core/version.js', // Version(50), SourceName(51), GlobalOptionsUpdate(52), OptionsUpdate(54)
  'core/runtime.js', // JSON2, uW, Seed, CM, FFVersion, GMVersion, NoRegEx, http, EXTERNAL_RESOURCE, KOCMON_LOGO, KOCMON_ON, GameURL
  'core/state.js', // Cities, Tabs, Buttons, Images, OpenDiv, local_atkp, local_atkinc, LanguageArray, NoTranslation, ReportCache, ReportDetailCache
  'core/march-state.js', // inc, incCity, out, outCity, mainPop..popMarch, SelectiveDefending, giftAccepted, Infantry..SpellCaster, TTSort
  'core/effects.js', // GlobalEffects..TowerEffects, DebuffEffects, AlternateSortOrder, CompositeEffects, EffectDebuffs, DebuffOnly, *Effects por tropa
  'core/card-maps.js', // cardQuality, champImageTypes, champUniqueImageTypes, chTypeStrings, chTypes, trTypes, cardFaction, jewelTypes, jewelQuality, guardTypes, tileTypes, wildImages, SpellBlessings, SpellTypes
  'core/champion-items.js', // BaseChamp, SteelHoofItems..DragonWarriorsItems, fortmight, ScoutTroops
  'core/publish.js', // TranslatePublish(160), CE_EFFECT_TIERS(162), CE_MIGHT_RARITY_MAP(163), CE_MIGHT_LEVEL_MAP(164), ChampionStatTiers(166)
  'core/world.js', // Provinces(168), provMapCoords(199, sin var), TileOrigin(208), TileOriginChecked(209)
  'core/images.js', // IMGURL(211), GiftText, HQText, HQText2, AlertBG..BuildImage, GameIcons(269), ArcaneResources(278), ArcaneResourceImages(279)
  'core/more-images.js', // TroopImagePrefix..ChampImageSuffix, ShieldImage, BrokenIcon, EquippedIcon, EquippedOtherIcon, LONG_BROWN_BTN, GLORY_BACKGROUND, RAINBOW_BACKGROUND, URL_CASTLE_BUT_HOVER, THEMES, UniqueJewels, boxmightarray, AlertSounds, WhisperSounds, Smileys, ChatStyles, SpeedColour, LinkColour
  'core/constants.js', // MAP_DELAY, MAX_BLOCKS, MAP_DELAY_WATCH, DEFAULT_ALERT_SOUND_URL, DEFAULT_SCOUT_SOUND_URL, SWF_PLAYER_URL, SWF_PREFIX, SWF_SUFFIX, AudioManager, HourGlasses, HourGlassName, SpeedupArray, HGLimit, HourGlassThreshold, HourGlassHint, StorehouseLevels, ArcaneRequirements
  'core/filter.js', // Filter
  'core/runtime-state.js', // InitialCityId..AJAX_LOG (estado en runtime: timers, contadores, flags)

  // ─────────────────────────── options ───────────────────────────
  'options/dom-helper.js', // function $(ID, root)
  'options/global-options.js', // GlobalOptions
  'options/user-options.js', // UserOptions
  'options/options.js', // Options (todas las opciones del bot)
  'options/auto-updater.js', // AutoUpdater
  'options/html.js', // nHtml (plantillas HTML)

  // ─────────────────────────── bootstrap ───────────────────────────
  'bootstrap/startup.js', // /** Initialise BOT **/ (777) + PowerBotStartup(779)
  'bootstrap/window-positions.js', // RememberWindowPositions(1133), onUnload(1143)
  'bootstrap/uw-modifiers.js', // /** uW Modifiers **/ (1159) + ModifyUWObjects(1161)
  'bootstrap/uw-exports.js', // uWExportFunction(1511), uWCloneInto(1518), uWCreateObjectIn(1525)
  'bootstrap/seed.js', // RefreshSeed(1532)
  'bootstrap/screens.js', // /** Widescreen/Environment Functions **/ (1617) + LoadChecker(1619), LoadCheckLoop(1647), SetGameScreen(1655)
  'bootstrap/instances.js', // FacebookInstance(1686)
  'bootstrap/standalone.js', // CheckStandAlone(1751), StandAloneInstance(1757)
  'bootstrap/watchdogs.js', // FacebookWatchdog(1805), KOCWatchdog(1819), PBPWatchdog(1833), KOCnotFound(1846), ReloadKOC(1879)
  'bootstrap/portal-layout.js', // InitPortalLayout — GCG portal: main 100%, footer oculto, header colapsable

  // ─────────────────────────── auth (popups FB / tokens) ───────────────────────────
  'auth/alerts.js', // CheckRemoveAlert(1936), CheckDisableAds(1946)
  'auth/publish.js', // HandlePublishPopup(1961), HandleInlinePublishPopup(1981), CheckPublish(1996)
  'auth/hide-fb-dialogs.js', // CheckHideFBDialogs(2052)
  'auth/tokens.js', // CheckTokenCollection(2058), CheckTokenDay(2186)
  'auth/widescreen.js', // WideScreen(2212)
  'auth/afk.js', // /** Afk detector **/ (2577) + afkdetector(2579)

  // ─────────────────────────── ui ───────────────────────────
  'ui/buttons.js', // createButton(2619), AddMainTabLink(2627), AddSubTabLink(2644), SetToggleButtonState(2662)
  'ui/tab-setup.js', // SetupMainTab(2670), SetupSubTab(2694), AddPowerBarLink(2719), mouseMainTab(2739), eventHideShow(2746)
  'ui/windows.js', // DefaultWindowPos(2757), ToggleDivDisplay(2766), ToggleMainDivDisplay(2797), ResetFrameSize(2832)
  'ui/march-display.js', // UpdateMarch(2847), UpdateIncomingMarch(2890), updatePlayers(2910)
  'ui/champion-display.js', // getChampionStatus(2928), getChampionCity(2940), getCityChampion(2952), SetChampionIcon(2966), BuildChampData(2996)
  'ui/main-loop.js', // /** main loop **/ (3115) + EverySecond(3117)
  'ui/incoming.js', // CheckForIncoming(3230), Copy_Local_ATKP(3424), Copy_Local_ATKINC(3459)

  // ─────────────────────────── utils ───────────────────────────
  'utils/i18n.js', // /** Standard Functions **/ (3492) + translate(3494), tx(3500)
  'utils/dom.js', // ById(3501), ByCl(3502), CheckForHTMLChange(3504), ResetHTMLRegister(3514), shuffle(3518)
  'utils/offsets.js', // getAbsoluteOffsets(3533), getOffset(3544), getStyle(3554)
  'utils/browser.js', // getFirefoxVersion(3562), getGMVersion(3587), HEXtoRGB(3596)
  'utils/dom-search.js', // searchDOM(3615), getClientCoords(3639)
  'utils/audio.js', // InitialiseAudioManager(3652), AudioMan(3667)
  'utils/window-manager.js', // hideMe(3812), showMe(3820), WinManager(3826), SliderBar(3849)
  'utils/popups.js', // CPopup(3961), CWinDrag(4112), ResetWindowPos(4232), tabManager(4240)
  'utils/scripting.js', // addScript(4401), CalterUwFunc(4409), CalterFuncModifier(4476)
  'utils/ajax.js', // matTypeof(4602), implodeUrlArgs(4615), addUrlArgs(4623), myClone(4635), MyAjaxRequest(4642), AjaxRequest(4710), DouW(4786)
  'utils/game-utils.js', // /** Standard Game Functions **/ (4800) + getThroneEffectName(4802), SelectText(4810), StartKeyTimer(4825), htmlTitleLine(4830), strButton20(4834), strButton14(4839), strButton8(4845), makeButtonv2(4850), getServerId(4854), getTokenServerId(4865), getFeedServerId(4875), getFeedId(4885), getFeedUserId(4895)
  'utils/options-io.js', // readGlobalOptions(4905), saveGlobalOptions(4929), readOptions(4933), saveOptions(4948), readUserOptions(4955), saveUserOptions(4965), readLanguage(4970), saveLanguage(4980), ToggleOption(4984), ChangeOption(5004), ChangeIntegerOption(5019)
  'utils/city.js', // GetDisplayName(5035), setCities(5042), SelectCity(5060), OpenBuilding(5066), showBlessings(5081), getAscensionValues(5094), getSpellData(5106), getFactionBonus(5120), getTREffectStyle(5130), setTroops(5159)
  'utils/map-math.js', // distance(5179), CalculateTileId(5191), getMaxWilds(5207)
  'utils/logging.js', // logerr(5217), logit(5225), actionLog(5230), safecall(5236), unsafecall(5237)
  'utils/time.js', // unixTime(5239), formatDateTime(5243), formatDate(5247), formatUnixTime(5251), convertTime(5256), formatGMTClock(5263), getDST(5268), FullDateTime(5283), yyyymmdd(5295), replaceAll(5302), addZero(5319)
  'utils/numbers.js', // parseIntNan(5324), parseIntCommas(5331), parseIntZero(5340), isNaNCommas(5346), timestr(5352), timestrShort(5378), addCommasInt(5392), addCommas(5401), addCommasWhole(5414)
  'utils/format.js', // htmlSelector(5416)

  // ─────────────────────────── game-api ───────────────────────────
  'game-api/chat.js', // sendChat(5444), BotChat(5449, sin var)
  'game-api/players.js', // getMyAlliance(5485), AreYouALeader(5492), isMyself(5514), trusted(5518), insecure(5519)
  'game-api/links.js', // coordLink(5521), MonitorLink(5537), MonitorLinkUID(5549), PlayerLink(5561), CityLink(5571), officerId2String(5581)
  'game-api/online.js', // getOnline(5588), fetchPlayerList(5599)
  'game-api/map.js', // GotoMapHide(5611), GotoMapRpt(5617), GotoMap(5622), CityResourceHint(5642), CityResourceHintOff(5669), FillBookmarkList(5673), PlotCityImage(5693), PlotAllianceHQ(5718)
  'game-api/wilds.js', // AbandonWild(5830)
  'game-api/reports.js', // FetchReport(5886), deleteCheckedReport(5908), FetchReportDetail(5926)
  'game-api/hq.js', // FetchHQInfo(5949), OpenTemple(5986)
  'game-api/city-picker.js', // CdispCityPicker(5998)
  'game-api/buildings.js', // getCityBuildings(6107), getCityBuilding(6127), getUniqueCityBuilding(6141)
  'game-api/items.js', // getItemImageURL(6145), itemTitle(6177)
  'game-api/defend.js', // getDefendStatus(6191), getAvailableKnights(6222), ClaimDailyReward(6245)
  'game-api/ui.js', // getFactionName(6270), ModalMultiButton(6282), /** KOC Map interface **/ (6301) + CMapAjax(6303), TileImage(6378), TroopImage(6486), TroopImageBig(6499), TroopImageBigHeader(6500), ResourceImage(6502), capitalize(6507), BlankifZero(6519), createToolTip(6523), UseDove(6544)
  'game-api/diplomacy.js', // FormatDiplomacy(6563), getDiplomacy(6575), DiplomacyColours(6587), fetchPlayerCourt(6599)

  // ─────────────────────────── game-data ───────────────────────────
  'game-data/wall.js', // getWallInfo(6610)
  'game-data/production.js', // getResourceProduction(6648)
  'game-data/throne.js', // equippedthronestats(6687), GenerateTRPresetStats(6706), GenerateTRPresetTiers(6734), getTRSlotStat(6752), getCHSlotStat(6769), getChampCappedValue(6793)
  'game-data/training.js', // getTrainTime(6803), getStoneTrainingSpeedBonus(6934)
  'game-data/troops.js', // getCityTroops(6965), getMarchInfo(6977)
  'game-data/messages.js', // DeleteLastMessage(7012)
  'game-data/levels.js', // DrawLevelIcons(7039)
  'game-data/champions.js', // CardMight(7089), CardQuality(7117), strQuality(7125), SwitchChampion(7140), SwitchGuardian(7180)
  'game-data/throne-room.js', // SwitchThroneRoom(7246), ArcanaEnabled(7320)

  // ─────────────────────────── features (features grandes, cada una con su carpeta) ───────────────────────────
  'features/raid-manager/toggle.js', // /** Raid Manager **/ (7324) + ToggleCityRaids(7326)
  'features/raid-manager/manager.js', // RaidManager(7371)
  'features/raid-manager/dashboard.js', // /** Dashboard Control **/ (7578) + Dashboard(7580)
  'features/might-popup/popup.js', // /** Might Breakdown Popup **/ (10547) + ShowMightBreakdown(10549)
  'features/battle-popup/popup.js', // /** Battle Popup **/ (10825) + Battle(10827)
  'features/incoming-popup/popup.js', // /** Incoming Marches Popup **/ (11417) + Incoming(11419)
  'features/outgoing-popup/popup.js', // /** Outgoing Marches Popup **/ (11731) + Outgoing(11733)
  'features/quick-scout/scout.js', // /** QUICK SCOUT **/ (12080) + QuickScout(12082, sin var)
  'features/quick-march/popup.js', // /** Quick March Popup **/ (12493) + QuickMarch(12495)
  'features/option-objects/objects.js', // /** OPTION OBJECTS **/ (14175) + anticd(14177), TreasureChestClick(14212), KillBox(14305), FairieKiller(14322)

  // ─────────────────────────── panels ───────────────────────────
  'panels/lag-fixes.js', // fixgamelag(14342), ChampLagFix(14378), CollectGold(14427), FoodAlerts(14478), RefreshEvery(14540)
  'panels/chat.js', // ChatComOverlay(14615), OSendChat(14652), BtFilter(14661), enFilter(14705), deFilter(14712), ChatPane(14719), ChatStuff(14909)
  'panels/reports.js', // Rpt(15537)
  'panels/chat-time-fix.js', // ChatTimeFix(16915)
  'panels/attack-dialog.js', // AttackDialog(16951), battleReports(17095)
  'panels/map-fixes.js', // MapDistanceFix(17172), mapinfoFix(17204)
  'panels/clock.js', // GMTclock(17447)
  'panels/delete-reports.js', // DeleteReports(17486), DispReport(17799)
  'panels/report-links.js', // makeReportLink(18004), makeReportPopup(18008)

  // ─────────────────────────── tabs (helpers compartidos + una carpeta por tab) ───────────────────────────
  'tabs/shared/alliance-reports.js', // AllianceReports(18012), AllianceReportsCheck(18194)
  'tabs/shared/navigation.js', // towho(18324), PageNavigator(18342), TowerAlerts(18547), CoordBox(18601), cdtd(18662)
  'tabs/shared/fixes.js', // LoadCapFix(18817), TRAetherCostFix(18851), mmbImageFix(18894)
  'tabs/shared/march.js', // /** Global march function **/ (18920) + March(18922), ItemMultiUseController(19371)
  'tabs/options/options.js', // /** TABS **/ (19400) + /** Options Tab **/ (19402) + Tabs.Options
  'tabs/log/action-log.js', // /** Log Tab **/ (22924) + Tabs.ActionLog
  'tabs/alliance/alliance.js', // /** Alliance Tab **/ (23051) + Tabs.Alliance
  'tabs/monitor/monitor.js', // /** Monitor Tab **/ (24375) + Tabs.Monitor
  'tabs/reference/reference.js', // /** Reference Tab **/ (25386) + Tabs.Reference
  'tabs/player/player.js', // /** Player Tab **/ (26794) + Tabs.Player
  'tabs/overview/overview.js', // /** Overview Tab **/ (28380) + Tabs.OverView
  'tabs/search/search.js', // /** Search Tab **/ (29188) + Tabs.Search
  'tabs/gloryfarm/gloryfarm.js', // /** GloryFarm Tab **/ (30634) + Tabs.GloryFarm
  'tabs/notes/notes.js', // /** Notes Tab **/ (30996) + Tabs.Notes
  'tabs/whisper/whisper.js', // /** Whisper Tab **/ (31299) + Tabs.Whisper
  'tabs/messages/messages.js', // /** Messages Tab **/ (31583) + Tabs.Messages
  'tabs/wilds/wilds.js', // /** Wilds Tab **/ (32980) + Tabs.Wilds
  'tabs/knights/knights.js', // /** Knights Tab **/ (33296) + Tabs.Knights
  'tabs/nomad/nomad.js', // /** Nomad Tab **/ (33671) + Tabs.Nomad
  'tabs/inventory/inventory.js', // /** Inventory Tab **/ (34103) + Tabs.Inventory
  'tabs/scout-reports/scout-reports.js', // /** Scout Reports Tab **/ (34990) + Tabs.ScoutReports
  'tabs/bulk-scout/bulk-scout.js', // /** Bulk Scout **/ (35300) + Tabs.BulkScout
  'tabs/gift/gift.js', // /** Gift Tab **/ (36019) + Tabs.Gift
  'tabs/fort/fort.js', // /** Defences Tab **/ (36558) + Tabs.Fort
  'tabs/training/training.js', // /** Training Tab **/ (37587) + Tabs.Train
  'tabs/crafting/crafting.js', // /** Crafting Tab **/ (39772) + Tabs.Craft
  'tabs/spells/spells.js', // /** Spells Tab **/ (40642) + Tabs.Spells
  'tabs/transport/transport.js', // /** Transport Tab **/ (41029) + Tabs.Transport
  'tabs/reassign/reassign.js', // /** Reassign Tab **/ (42442) + Tabs.Reassign
  'tabs/attack/attack.js', // /** Attack Tab **/ (43199) + Tabs.Attack
  'tabs/build/build.js', // /** Build Tab **/ (44360) + Tabs.Build
  'tabs/revive/revive.js', // /** Revive Tab **/ (47224) + Tabs.Revive

  // ─────────────────────────── footer ───────────────────────────
  'footer/init.js', // /** END OF TABS **/ (48345) + bloque inicial PowerBotStartup() (48347-48351)
];

module.exports = MANIFEST;
