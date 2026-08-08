function InitialiseAudioManager() {
	var div = document.getElementsByTagName('div');
	for (var i = 0; i < div.length - 1; i++)
		if (div[i].className == 'mod_comm_forum')
			e = div[i];

	if (!e) {
		setTimeout(InitialiseAudioManager, 2000);
		return;
	}

	AudioManager = new AudioMan(); // put basic SWF container in DOM above the chat
	AudioManager.init(e);
}

function AudioMan() {
	var t = this;
	this.player = null;
	this.volume = 100;
	this.type = 'html5';
	this.defaulttype = 'html5';
	this.source = null;
	this.canPlayMP3 = false;
	this.hasFlash = false;
	this.alertdiv = null;
	this.stoptimer = null;

	this.init = init;
	this.setVolume = setVolume;
	this.play = play;
	this.stop = stop;
	this.pause = pause;
	this.setSource = setSource;
	this.toggleMute = toggleMute;
	this.initSWF = initSWF;

	function init(myDiv) {
		if (!!document.createElement("audio").canPlayType) {
			t.player = new Audio();
			t.canPlayMP3 = (t.player.canPlayType("audio/mpeg") !== "");
			t.defaulttype = 'html5';
			t.player.addEventListener("ended", function () {
				t.player.currentTime = 0
			}, false);
			t.setVolume(t.volume);
		} else {
			t.defaulttype = 'swf';
		}
		t.initSWF(myDiv)
	};

	function setVolume(vol) {
		t.volume = vol;
		if (t.player) t.player.volume = t.volume * 0.01;
	};

	function pause() {
		if (t.player) t.player.pause();
	};

	function toggleMute() {
		if (t.player) t.player.muted = !t.player.muted;
	};

	function play() {
		clearTimeout(t.stoptimer);
		if (t.type == 'html5') {
			if (!t.player.paused) {
				t.stop();
			}
			t.player.play();
		} else {
			if (t.alertdiv) {
				if (!t.hasFlash) {
					logit(tx('SWF Disabled or not Installed'));
					t.alertdiv.innerHTML = '<b style=\'color:#800; font-size: 9px;\'>' + tx('SWF Disabled or not Installed') + '</b>';
				}
				else {
					t.alertdiv.innerHTML = t.source;
				}
			}
			else { logit('sound probs on play'); }
		}
	};

	function stop() {
		clearTimeout(t.stoptimer);
		if (t.type == 'html5') {
			t.player.pause();
			if (t.player.readyState === 4) {
				t.player.currentTime = 0
			}
		} else {
			if (t.alertdiv) {
				if (t.hasFlash) {
					t.alertdiv.innerHTML = '<b style=\'color: rgb(165, 102, 49); font-size: 9px;\'>' + tx('SWF Audio Played') + '</b>';
				}
			}
			else { logit('sound probs on stop'); }
		}
	};

	function setSource(src) {
		if (matTypeof(src) == 'object') {
			if (t.defaulttype == 'html5') {
				t.player.src = src.OGG;
				t.type = 'html5';
			}
			else {
				logit('Browser has no native Audio support');
				t.source = SWF_PREFIX + src.URL + '&amp;volume=' + t.volume + SWF_SUFFIX;
				t.type = 'swf';
			}
		}
		else {
			if ((src.split('.').pop().toUpperCase() == 'MP3') && !t.canPlayMP3) {
				logit('Browser has no native MP3 support');
				t.source = SWF_PREFIX + src + '&amp;volume=' + t.volume + SWF_SUFFIX;
				t.type = 'swf';
			}
			else {
				if (t.defaulttype == 'html5') {
					t.player.src = src;
					t.type = 'html5';
				}
				else {
					logit('Browser has no native Audio support');
					// probably can't play the sound, send it to SWF anyway..
					t.source = SWF_PREFIX + src + '&amp;volume=' + t.volume + SWF_SUFFIX;
					t.type = 'swf';
				}
			}
		}
		// if source changed need to load.. ( not SWF)
		if (t.type == 'html5') {
			if (t.source != t.player.src) {
				t.player.load();
				t.source = t.player.src;
			}
		}
	};

	function initSWF(e) {
		t.alertdiv = document.createElement("span");
		t.alertdiv.style.verticalAlign = 'top';
		t.alertdiv.style.paddingLeft = '20px';
		e.appendChild(t.alertdiv);
		e.style.height = '20px';

		try {
			var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if (fo) { t.hasFlash = true; }
		} catch (e) {
			if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] != undefined && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
				t.hasFlash = true;
			}
		}
	};
}
