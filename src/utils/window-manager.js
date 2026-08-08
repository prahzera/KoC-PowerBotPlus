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