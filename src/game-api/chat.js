function sendChat(cText) {
	ById("mod_comm_input").value = cText;
	uW.Chat.sendChat();
}

BotChat = { // works well, but message is not echoed back to local client
	params: null,
	sendWhisper: function (msg, who, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 3;
		this.params.name = who;
		this._sendit(msg, notify);
	},
	sendGlobal: function (msg, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 1;
		this._sendit(msg, notify);
	},
	sendAlliance: function (msg, notify) {
		this.params = uW.Object.clone(uW.g_ajaxparams);
		this.params.ctype = 2;
		this._sendit(msg, notify);
	},
	_sendit: function (msg, notify) {
		function strip(s) {
			return s.replace(/^\s+/, '').replace(/\s+$/, '');
		}
		this.params.comment = strip(msg);
		new MyAjaxRequest(uW.g_ajaxpath + "ajax/sendChat.php" + uW.g_ajaxsuffix, {
			method: "post",
			parameters: this.params,
			onSuccess: function (rslt) {
				if (notify) notify();
			},
			onFailure: function () {
				if (notify) notify();
			}
		});
	},
}
