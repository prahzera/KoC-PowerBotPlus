function hideMe() {
	if (!Options.btWinIsOpen)
		return;
	mainPop.show(false);
	Options.btWinIsOpen = false;
	saveOptions();
}

function showMe() {
	mainPop.show(true);
	Options.btWinIsOpen = true;
	saveOptions();
}

// A game modal that needs the user's attention (Appoint a Knight, Assign Role,
// ...) is stacked by the game's own ModalManager, far below the bot window's
// CPopup.BASE_ZINDEX of 111111. The old code worked around that by calling
// pthideMe(), which minimized the whole window, so every one of those clicks
// threw away the bot's window state.
//
// Instead the window stays exactly where it is and the game modal is lifted
// above it. If the modal cannot be found, fall back to the old hide so the
// modal is never left buried behind the bot.
var GameModalLift = {
	_timer: null,
	// Just above CPopup.BASE_ZINDEX. The bot window drifts to BASE+5 once
	// clicked, hence the +1000 margin.
	Z: 112111,
	BOXES: '.largeModal, .xLargeModal, .mediumModal, .smallModal, .choose_modal, ' +
		'.nomadModal, .chancellorModal, .vaultModal, .templeModal, .guardianModal, .animatedChestModal',

	// Tries for ~2s, which is plenty for the game to build the modal in its own
	// call stack. onFail runs only if it never showed up.
	arm: function (onFail) {
		var t = GameModalLift;
		if (t._timer) clearTimeout(t._timer);
		var tries = 0;
		var tick = function () {
			tries++;
			if (t.lift()) { t._timer = null; return; }
			if (tries < 20) t._timer = setTimeout(tick, 100);
			else { t._timer = null; if (onFail) { try { onFail(); } catch (e) { logerr(e); } } }
		};
		tick();
	},

	lift: function () {
		var t = GameModalLift;
		var els = [];
		try {
			// The curtain is the full-screen backdrop, the boxes are the actual
			// dialogs. The boxes go one step higher so the curtain can never
			// cover the dialog it is supposed to be behind.
			var curtains = document.querySelectorAll('.modalCurtain');
			for (var i = 0; i < curtains.length; i++) els.push([curtains[i], 0]);
			var boxes = document.querySelectorAll(t.BOXES);
			for (var b = 0; b < boxes.length; b++) els.push([boxes[b], 1]);
		} catch (e) { logerr(e); return false; }
		if (!els.length) return false;
		for (var j = 0; j < els.length; j++) {
			var el = els[j][0];
			var zi = t.Z + els[j][1];
			el.style.zIndex = '' + zi;
			// A z-index only counts inside its own stacking context, so if the
			// game nests the dialog in a positioned wrapper, raising the dialog
			// alone would not lift it past the bot window. Raise the ancestors up
			// to the body as well; nested equal values still paint inner-last.
			var up = el.parentNode;
			while (up && up !== document.body && up.nodeType === 1) {
				if (up.style) up.style.zIndex = '' + zi;
				up = up.parentNode;
			}
		}
		return true;
	}
};

var WinManager = {
	wins: {},	// prefix : CPopup obj

	get: function (prefix) {
		var t = WinManager;
		return t.wins[prefix];
	},

	add: function (prefix, pop) {
		var t = WinManager;
		t.wins[prefix] = pop;
		if (uW.cpopupWins == null) { uWCreateObjectIn('cpopupWins', {}); }
		uW.cpopupWins[prefix] = pop;
	},

	delete: function (prefix) {
		var t = WinManager;
		delete t.wins[prefix];
		delete uW.cpopupWins[prefix];
	}
}

// value is 0 to 1.0
function SliderBar(container, width, height, value, classPrefix, margin) {
	var self = this;
	this.listener = null;
	if (value == null)
		value = 0;
	if (!margin)
		margin = parseInt(width * 0.05);
	this.value = value;
	if (width < 20) width = 20;
	if (height < 5) height = 5;
	if (classPrefix == null) {
		classPrefix = 'slider';
		var noClass = true;
	}
	var sliderHeight = parseInt(height / 2);
	var sliderTop = parseInt(height / 4);
	this.sliderWidth = width - (margin * 2);

	this.div = document.createElement('div');
	this.div.style.height = height + 'px';
	this.div.style.width = width + 'px';
	this.div.className = classPrefix + 'Cont';

	this.slider = document.createElement('div');
	this.slider.setAttribute('style', 'position:relative;');
	this.slider.style.height = sliderHeight + 'px'
	this.slider.style.top = sliderTop + 'px';
	this.slider.style.width = this.sliderWidth + 'px';
	this.slider.style.left = margin + 'px'; /////
	this.slider.className = classPrefix + 'Bar';
	this.slider.draggable = true;
	if (noClass)
		this.slider.style.backgroundColor = '#fff';

	this.sliderL = document.createElement('div');
	this.sliderL.setAttribute('style', 'width:100px; height:100%; position:relative;');
	this.sliderL.className = classPrefix + 'Part';
	this.sliderL.draggable = true;
	if (noClass)
		this.sliderL.style.backgroundColor = '#0c0';

	this.knob = document.createElement('div');
	this.knob.setAttribute('style', 'width:3px; position:relative; left:0px; background-color:#222;');
	this.knob.style.height = height + 'px';
	this.knob.style.top = (0 - sliderTop) + 'px';
	this.knob.className = classPrefix + 'Knob';
	this.knob.draggable = true;
	this.slider.appendChild(this.sliderL);
	this.sliderL.appendChild(this.knob);
	this.div.appendChild(this.slider);
	container.appendChild(this.div);
	this.div.addEventListener('mousedown', mouseDown, false);

	this.getValue = function () {
		return self.value;
	}

	this.setValue = function (val) {
		var relX = (val * self.sliderWidth);
		self.sliderL.style.width = relX + 'px';
		self.knob.style.left = relX + 'px';
		self.value = val;
		if (self.listener)
			self.listener(self.value);
	}

	this.setChangeListener = function (listener) {
		self.listener = listener;
	}

	function moveKnob(me) {
		var relX = me.clientX - self.divLeft;
		if (relX < 0)
			relX = 0;
		if (relX > self.sliderWidth)
			relX = self.sliderWidth;
		self.knob.style.left = (relX - (self.knob.clientWidth / 2)) + 'px'; // - half knob width !?!?
		self.sliderL.style.width = relX + 'px';
		self.value = relX / self.sliderWidth;
		if (self.listener)
			self.listener(self.value);
	}

	function doneMoving() {
		self.div.removeEventListener('mousemove', mouseMove, true);
		document.removeEventListener('mouseup', mouseUp, true);
	}

	function mouseUp(me) {
		moveKnob(me);
		doneMoving();
	}

	function mouseDown(me) {
		var e = self.slider;
		self.divLeft = 0;
		while (e.offsetParent) { // determine actual clientX
			self.divLeft += e.offsetLeft;
			e = e.offsetParent;
		}
		moveKnob(me);
		document.addEventListener('mouseup', mouseUp, true);
		self.div.addEventListener('mousemove', mouseMove, true);
	}

	function mouseMove(me) {
		moveKnob(me);
	}
}

// creates a 'popup' div
// prefix must be a unique (short) name for the popup window