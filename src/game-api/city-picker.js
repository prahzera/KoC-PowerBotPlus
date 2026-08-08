function CdispCityPicker(id, span, dispName, notify, selbut, disable_list, bgclass) {
	function CcityButHandler(t) {
		var that = t;
		this.clickedCityBut = clickedCityBut;

		function clickedCityBut(e) {
			if (that.selected != null)
				that.selected.className = "castleBut castleButNon";
			that.city = Cities.cities[e.target.id.substr(that.prefixLen)];
			if (that.dispName)
				ById(that.id + 'cname').innerHTML = that.city.name;
			e.target.className = "castleBut castleButSel";
			that.selected = e.target;
			if (that.coordBoxX) {
				that.coordBoxX.value = that.city.x;
				that.coordBoxY.value = that.city.y;
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent('change', true, true); // event type,bubbling,cancelable
				that.coordBoxX.dispatchEvent(evt);
				that.coordBoxY.dispatchEvent(evt);
				that.coordBoxX.style.backgroundColor = null;
				that.coordBoxY.style.backgroundColor = null;
			}
			if (that.notify != null)
				that.notify(that.city, that.city.x, that.city.y);
		}
	}

	function selectBut(idx) {
		if (ById(this.id + '_' + idx)) {
			ById(this.id + '_' + idx).click();
		}
	}

	function bindToXYboxes(eX, eY) {

		function CboxHandler(t) {
			var that = t;
			this.eventChange = eventChange;
			if (that.city) {
				eX.value = that.city.x;
				eY.value = that.city.y;
			}

			function eventChange() {
				var xValue = that.coordBoxX.value.trim();
				var xI = /^\s*([0-9]+)[\s|,|-|.]+([0-9]+)/.exec(xValue);
				if (xI) {
					that.coordBoxX.value = xI[1]
					that.coordBoxY.value = xI[2]
				}
				var x = parseInt(that.coordBoxX.value, 10);
				var y = parseInt(that.coordBoxY.value, 10);
				if (isNaN(x) || x < 0 || x >= 750) {
					that.coordBoxX.style.backgroundColor = '#ff8888';
					return;
				}
				if (isNaN(y) || y < 0 || y >= 750) {
					that.coordBoxY.style.backgroundColor = '#ff8888';
					return;
				}
				that.coordBoxX.style.backgroundColor = null;
				that.coordBoxY.style.backgroundColor = null;
				if (that.notify != null)
					that.notify(null, x, y);
			}

			return false;
		}

		this.coordBoxX = eX;
		this.coordBoxY = eY;
		var bh = new CboxHandler(this);
		eX.maxLength = 10; // allow for paste coords!
		eY.maxLength = 3;
		eX.style.width = '2em';
		eY.style.width = '2em';
		eX.addEventListener('change', bh.eventChange, false);
		eY.addEventListener('change', bh.eventChange, false);
	}

	this.selectBut = selectBut;
	this.bindToXYboxes = bindToXYboxes;
	this.coordBoxX = null;
	this.coordBoxY = null;
	this.id = id;
	this.dispName = dispName;
	this.prefixLen = id.length + 1;
	this.notify = notify;
	this.selected = null;
	this.city = null;
	var m = '';
	for (var i = 0; i < Cities.cities.length; i++) {
		if (matTypeof(disable_list) == 'array' && disable_list[i])
			m += '<span class=' + (bgclass ? bgclass : "") + '><INPUT class="castleBut castleButNon" id="' + id + '_' + i + '" value="' + (i + 1) + '" type=submit DISABLED \></span>';
		else
			m += '<span class=' + (bgclass ? bgclass : "") + '><INPUT class="castleBut castleButNon" id="' + id + '_' + i + '" value="' + (i + 1) + '" type=submit \></span>';
	}

	if (dispName)
		m += ' &nbsp; <SPAN style="display:inline-block; width:85px; font-weight:bold;" id=' + id + 'cname' + '></span>';
	span.innerHTML = m;
	var handler = new CcityButHandler(this);
	for (var i = 0; i < Cities.cities.length; i++)
		ById(id + '_' + i).addEventListener('click', handler.clickedCityBut, false);
	if (selbut != null)
		this.selectBut(selbut);
}
