/** Notes Tab **/

Tabs.Notes = {
	tabOrder: 1070,
	tabLabel: 'Notes',
	oldSMTT: null,
	newSMTT: null,
	myDiv: null,
	noteValues: {},
	ToolsOpen: false,
	LoopCounter: 1,

	init: function (div) {
		var t = Tabs.Notes;
		myDiv = div;
		uWExportFunction("removeNote", Tabs.Notes.removeNote);
		uWExportFunction("editNoteLink", Tabs.Notes.editNoteLink);
		uWExportFunction("edit_notes", Tabs.Notes.createPopup);

		// override the map tooltips
		if (typeof exportFunction == 'function') {
			uWExportFunction("oldSMTT", uW.showMapTileTooltip);
			uWExportFunction("newSMTT", function (j, h, n, f, l, k) {
				var j2 = Tabs.Notes.updateTooltip(unescape(j));
				if (j2) { j = escape(j2); }
				uW.oldSMTT(j, h, n, f, l, k);
			});

			uW.showMapTileTooltip = uW.newSMTT;
		}
		else {
			var oldSMTT = uW.showMapTileTooltip;
			var newSMTT = function (j, h, n, f, l, k) {
				var j2 = Tabs.Notes.updateTooltip(unescape(j));
				if (j2) { j = escape(j2); }
				oldSMTT(j, h, n, f, l, k);
			};
			uW.showMapTileTooltip = newSMTT;
		}

		// create a regular expression object to use
		t.re = new RegExp("class=divHide>(\\w*)");

		// add a new option to the context menus
		var cityType = CM.CITY_STATUS.ANOTHER_PLAYER_CITY_AND_NOT_IN_YOUR_ALLIANCE;
		CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("ttMod");
		cityType = CM.CITY_STATUS.ANOTHER_PLAYER_CITY_AND_IN_YOUR_ALLIANCE;
		CM.ContextMenuMapController.prototype.MapContextMenus.City[cityType].push("ttMod");
		var wildContext;
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.EnemyWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("ttMod");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.Wilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("ttMod");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.FriendlyWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("ttMod");
		}
		wildContext = CM.ContextMenuMapController.prototype.MapContextMenus.AllianceWilderness;
		for (var wild in wildContext) {
			wildContext[wild].push("ttMod");
		}
		// add actions to the menu item
		var mod = new CalterUwFunc('cm.ContextMenuMapController.prototype.calcButtonInfo', [
			['default:', 'case "ttMod":' +
				'b.text = "' + tx('Player Notes') + '"; b.color = "brown"; ' +
				'b.action = function () { ' +
				'edit_notes(e.user); ' +
				'}; ' +
				'if (e.user.id) d.push(b); break; ' +
				'default: '
			]
		]);
		mod.setEnable(true);

		// load saved values
		t.load();
		window.addEventListener('unload', t.onUnload, false);
	},

	onUnload: function () {
		var t = Tabs.Notes;
		if (uW.btLoaded) {
			if (!ResetAll) t.save();
		}
	},

	EverySecond: function () {
		var t = Tabs.Notes;
		t.LoopCounter = t.LoopCounter + 1;
		if (FFVersion.Browser == "Chrome" && (t.LoopCounter % 15 == 0)) {
			t.save();
		}
	},

	load: function () {
		var t = Tabs.Notes;
		var serverID = getServerId();
		try {
			var s = JSON2.parse(GM_getValue('PlayerNotes_' + serverID + '_' + uW.tvuid, '{}'));
			if (s) t.noteValues = s;
		} catch (e) {
			logerr(e);
		}
	},

	save: function () {
		var t = Tabs.Notes;
		var serverID = getServerId();
		var s = JSON2.stringify(t.noteValues);
		setTimeout(function () { GM_setValue('PlayerNotes_' + serverID + '_' + uW.tvuid, s); }, 0); // get around GM_SetValue uW error
	},

	editNoteLink: function (name, id) {
		uW.edit_notes({ id: id, username: name });
	},
	createPopup: function (user) {
		var t = Tabs.Notes;
		t.ToolsOpen = false;
		if (Options.btWinIsOpen == true) {
			t.ToolsOpen = true;
			eventHideShow();
		}
		// get the current note
		var notes = "";
		if (t.noteValues[user.id]) {
			notes = t.noteValues[user.id];
			notes = notes.text.replace(/<br\/>/g, "\n");
		}
		// popup
		ModalMultiButton({
			buttons: [{
				txt: uW.g_js_strings.commonstr.save,
				exe: function () {
					t.saveNote(user);
					uW.Modal.hideModal();
					if (t.ToolsOpen == true) {
						eventHideShow();
					}
				}
			}, {
				txt: uW.g_js_strings.commonstr.deletetx,
				exe: function () {
					t.removeNote(user.id);
					uW.Modal.hideModal()
					if (t.ToolsOpen == true) {
						eventHideShow();
					}
				}
			}, {
				txt: uW.g_js_strings.commonstr.cancel,
				exe: function () {
					uW.Modal.hideModal()
					if (t.ToolsOpen == true) {
						eventHideShow();
					}
				}
			}],
			body: '<strong> ' + tx('Enter notes for player') + ': </strong><span id="notes_player">' + user.username + '</span><br/><br/><textarea id="notes_text" rows="4" columns="50" style="width:300px;" >' + notes + '</textarea>',
			title: "Player Notes"
		});
	},
	// callback for the save button
	saveNote: function (user) {
		var t = Tabs.Notes;
		var player = user.id;
		if (player) {
			var noteData = {};
			var notes = ById('notes_text').value;
			noteData.text = notes.replace(/\n/g, "<br/>");
			noteData.id = user.id;
			noteData.name = user.username;
			t.noteValues[player] = noteData;
			t.save();
			t.show();

			var nl = ById('ptplayernotes');
			if (nl && Tabs.Player.userobj[user.id]) {
				nl.innerHTML = noteData.text;
			}
			var nl = ById('ptBatplayernotes');
			if (nl && Battle.userobj[user.id]) {
				nl.innerHTML = noteData.text;
				ResetFrameSize('btPlayerPop', 100, 400);
			}
		}
	},
	// callback for the delete button
	removeNote: function (player) {
		var t = Tabs.Notes;
		if (player && t.noteValues[player]) {
			delete t.noteValues[player];
			t.save();
			t.show();

			var nl = ById('ptplayernotes');
			if (nl && Tabs.Player.userobj[player]) {
				nl.innerHTML = "";
			}
			var nl = ById('ptBatplayernotes');
			if (nl && Battle.userobj[player]) {
				nl.innerHTML = "";
				ResetFrameSize('btPlayerPop', 100, 400);
			}
		}
	},
	// add the notes to the map tooltip
	updateTooltip: function (ttHtml) {
		var t = Tabs.Notes;
		var newTT = null;
		var result = t.re.exec(ttHtml);
		if (result && result[1]) {
			var note;
			if (note = t.noteValues[result[1]]) {
				newTT = ttHtml.replace("</div><div class='roicon'>", "<br><br><b>" + tx('Notes') + ":</b><div style=\"position: relative; left: 5%; width: 90%;\">" + note.text + "</div></div><div class='roicon'>");
			}
		}
		return newTT;
	},
	show: function () {
		var t = Tabs.Notes;
		var h = '<div class=divHeader align=center> <b>' + tx('PLAYER NOTES') + '</b></div>';
		h += '<div align=center style="height: 700px; overflow-y: scroll;width:' + GlobalOptions.btWinSize.x + 'px;"><br>';
		h += '<table width="98%" cellpadding=0 cellspacing=0><tr>';
		h += '<td class=xtabHD style="width:115px"><b>' + uW.g_js_strings.commonstr.player + '</b></td><td class=xtabHD><b>' + tx('Notes') + '</b></td><td class=xtabHD align=right style="width:115px"><b>' + tx('Action') + '</b></td></tr>';

		var r = 0;
		var logshow = false;

		for (var player in t.noteValues) {
			var note = t.noteValues[player];
			if (note && note.text) {
				logshow = true;
				if (++r % 2) { rowClass = 'evenRow'; }
				else { rowClass = 'oddRow'; }

				h += '<tr class="' + rowClass + '">';
				h += '<TD valign=top style="width:115px" class=xtab><a class=xlink onclick="ptPlayerDetails(' + note.id + ')">' + note.name + '</a></td>';
				h += '<td class=xtabBRTop><div class="wrap" style="width:' + (GlobalOptions.btWinSize.x - 300) + 'px;">' + note.text + '</div></td>';
				h += '<TD valign=top class=xtab align=right><a class="inlineButton btButton brown8" onclick=editNoteLink("' + note.name + '","' + note.id + '")><span>' + uW.g_js_strings.commonstr.edit + '</span></a>&nbsp;<a class="inlineButton btButton brown8" onclick="removeNote(\'' + note.id + '\')"><span>' + tx('Del') + '</span></a></td>';
				h += "</tr>";
			}
		}

		if (!logshow) {
			h += '<tr><td colspan=3 class=xtab><div align="center"><br><br>' + tx('No saved notes') + '</div></td></tr>';
		}

		h += "</table></div>";
		h += '<div align=center id=ptnotesMessages>&nbsp;</div>';
		h += '<div align=right><input class=btInput id=ptnotesSave type=button value="' + tx("Save Notes") + '">&nbsp;<input class=btInput id=ptnotesLoad type=button value="' + tx("Load Notes") + '">&nbsp;<input class=btInput id=ptnotesLoadFile type=file></div>';
		h += "<br>";

		myDiv.innerHTML = h;

		ById('ptnotesSave').addEventListener('click', function () {
			var Export = {};
			Export = t.noteValues;
			uriContent = 'data:application/octet-stream;content-disposition:attachment;filename=file.txt,' + encodeURIComponent(JSON2.stringify(Export));
			Tabs.Options.saveConfig(uriContent, 'PlayerNotes_' + getServerId() + '_' + uW.tvuid + '.txt');
		}, false);

		ById('ptnotesLoad').addEventListener('click', function () {
			ById('ptnotesMessages').innerHTML = '&nbsp;'
			var fileInput = ById("ptnotesLoadFile");
			var files = fileInput.files;
			if (files.length == 0) {
				ById('ptnotesMessages').innerHTML = '<span style="color:#800;">' + tx('Please select a saved notes file') + '</span>';
				return;
			}
			var file = files[0];

			var reader = new FileReader();

			reader.onload = function (e) {
				var Import = JSON2.parse(e.target.result);
				if (matTypeof(Import) == 'object') {
					for (var k in Import) {
						var newNote = {};
						newNote.text = Import[k].text || '';
						newNote.name = Import[k].name || '';
						newNote.id = Import[k].id || 0;
						if (newNote.id) {
							t.noteValues[k] = newNote;
						}
					}
					t.save();
					ById('ptnotesMessages').innerHTML = tx('New notes loaded');
					t.show();
				}
				else {
					ById('ptnotesMessages').innerHTML = tx('Invalid File') + '!';
				}
			};
			reader.readAsText(file);
		}, false);

	},
};
