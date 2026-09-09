/** Anti-throttle timer: evita que el navegador limite setTimeout en pestañas en segundo plano.
 *  Crea un Web Worker inline que dispara mensajes en el interval solicitado,
 *  sin sufrir el throttling de Chrome/Firefox (mín. 1s o más en background).
 *
 *  API pública:
 *    var id = noThrottleTimeout(fn, delayMs)  → como setTimeout pero sin throttling
 *    noThrottleClear(id)                       → como clearTimeout
 */
var noThrottleTimeout = (function () {
	var _worker = null;
	var _pending = {}; // id → {fn, fired}
	var _nextId = 1;

	function _getWorker() {
		if (_worker) return _worker;
		try {
			var blob = new Blob([
				'var timers={};',
				'self.onmessage=function(e){',
				' var d=e.data;',
				' if(d.cmd==="set"){',
				'  var id=d.id,ms=d.ms;',
				'  timers[id]=setTimeout(function(){self.postMessage({id:id});delete timers[id];},ms);',
				' } else if(d.cmd==="clear"){',
				'  clearTimeout(timers[d.id]);delete timers[d.id];',
				' }',
				'}'
			], { type: 'application/javascript' });
			_worker = new Worker(URL.createObjectURL(blob));
			_worker.onmessage = function (e) {
				var id = e.data.id;
				var entry = _pending[id];
				if (entry) {
					delete _pending[id];
					try { entry.fn(); } catch (ex) { logerr(ex); }
				}
			};
		} catch (ex) {
			// Si el Worker falla (p.ej. CSP restrictivo), caemos a setTimeout normal
			_worker = null;
		}
		return _worker;
	}

	function noThrottleTimeout(fn, ms) {
		var id = _nextId++;
		var w = _getWorker();
		if (!w) {
			// fallback a setTimeout estándar
			_pending[id] = { fn: fn };
			var nativeId = setTimeout(function () {
				var entry = _pending[id];
				if (entry) { delete _pending[id]; try { entry.fn(); } catch (ex) { logerr(ex); } }
			}, ms);
			_pending[id].nativeId = nativeId;
			return id;
		}
		_pending[id] = { fn: fn };
		w.postMessage({ cmd: 'set', id: id, ms: ms });
		return id;
	}

	function noThrottleClear(id) {
		if (!id) return;
		var entry = _pending[id];
		delete _pending[id];
		var w = _getWorker();
		if (w) {
			w.postMessage({ cmd: 'clear', id: id });
		} else if (entry && entry.nativeId) {
			clearTimeout(entry.nativeId);
		}
	}

	noThrottleTimeout.clear = noThrottleClear;
	return noThrottleTimeout;
})();

function noThrottleClear(id) { noThrottleTimeout.clear(id); }
