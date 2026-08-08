var ChatTimeFix = {
	ChatTime: null,
	init: function () {
		t = ChatTimeFix;

		try {
			uWExportFunction('ptConvertTime', t.TimeFix);
			t.ChatTime = new CalterUwFunc("Chat.getChat", [
				['rslt.data.newChats[i][j][1],', 'ptConvertTime(rslt.data.newChats[i][j][1]),'],
				['rslt.data.newChats[i][j][1],', 'ptConvertTime(rslt.data.newChats[i][j][1]),']
			]);
			t.ChatTime.setEnable(Options.fixChatTime);
		}
		catch (err) {
			logerr(err); // write to log
		}
	},
	TimeFix: function (timestr) {
		time = timestr.split(/:/);
		var AddMins = 480 - parseInt(getDST(new Date()) / 60) - (new Date().getTimezoneOffset()); // convert from local pacific time
		var min = (parseInt(time[0]) * 60) + parseInt(time[1]) + AddMins;
		if (min >= 1440) {
			min = min - 1440;
		}
		return parseInt(min / 60) + ':' + ('00' + parseInt(min % 60).toString()).slice(-2);
	},
	setEnable: function (tf) {
		var t = ChatTimeFix;
		t.ChatTime.setEnable(tf);
	},
	isAvailable: function () {
		var t = ChatTimeFix;
		return t.ChatTime.isAvailable();
	},
};
