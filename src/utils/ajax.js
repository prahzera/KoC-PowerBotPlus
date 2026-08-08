function matTypeof(v) {
	if (v == undefined)
		return 'undefined';
	if (typeof (v) == 'object') {
		if (!v)
			return 'null';
		else if (v.constructor.toString().indexOf("Array") >= 0 && typeof (v.splice) == 'function')
			return 'array';
		else return 'object';
	}
	return typeof (v);
}

function implodeUrlArgs(obj) {
	var a = [];
	for (var k in obj)
		a.push(k + '=' + encodeURI(obj[k]));
	return a.join('&');
}

// NOTE: args can be either a string which will be appended as is to url or an object of name->values
function addUrlArgs(url, args) {
	if (!args)
		return url;
	if (url.indexOf('?') < 0)
		url += '?';
	else if (url.substr(url.length - 1) != '&')
		url += '&';
	if (matTypeof(args == 'object'))
		return url + implodeUrlArgs(args);
	return url + args;
}

function myClone(source) {
	var dest = {};
	for (var property in source)
		dest[property] = source[property];
	return dest;
}

function MyAjaxRequest(url, o, noRetry) {
	var opts = myClone(o);
	var wasSuccess = o.onSuccess;
	var wasFailure = o.onFailure;
	// if failure, retry 3 times every 2 secs?
	var retry = 3;
	var delay = 2;
	var noRetry = noRetry === true ? true : false;
	opts.onSuccess = mySuccess;
	opts.onFailure = myFailure;
	var obj = {};
	obj.timestamp = unixTime();
	obj.url = url;
	AJAX_LOG.push(obj);

	new AjaxRequest(url, opts);
	return;

	function myRetry(rslt) {
		--retry;
		if (retry > 0)
			new AjaxRequest(url, opts);
		else
			wasSuccess(rslt); // let the calling function handle it
	}

	function myFailure() {
		var o = {};
		o.ok = false;
		o.errorMsg = "AJAX Communication Failure";
		wasFailure(o);
	}

	function mySuccess(msg) {
		var rslt;
		if (typeof msg.responseText === 'string') {
			var hasCode = (msg.responseText.indexOf("function() {") != -1);
			if (!hasCode) {
				var rslt = eval("(" + msg.responseText + ")");
			}
		}

		if (!rslt) {
			rslt = {};
			rslt.errorMsg = "Unexpected Response from Server";
			rslt.BotCode = 999; // alert!!!
			rslt.responseText = msg.responseText; // for logging! Usually map captcha type delay function
			wasSuccess(rslt);
			return;
		}

		if (rslt.ok) {
			rslt.errorMsg = null; ///// !!!!!!!!!!!!! ************
			if (rslt.updateSeed)
				uW.update_seed(uWCloneInto(rslt.updateSeed));
			wasSuccess(rslt);
			return;
		}

		rslt.errorMsg = uW.printLocalError((rslt.error_code || null), (rslt.msg || null), (rslt.feedback || "999")); // null causes error sometimes
		if (!noRetry && (rslt.error_code == 0 || rslt.error_code == 8 || rslt.error_code == 1 || rslt.error_code == 3)) {
			setTimeout(function () { myRetry(rslt) }, delay * 1000);
		} else {
			wasSuccess(rslt);
		}
	}
}

function AjaxRequest(url, opts) {
	var headers = {
		'X-Requested-With': 'XMLHttpRequest',
		'X-Prototype-Version': '1.7.1',
		'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
	};
	var ajax = null;

	if (window.XMLHttpRequest)
		ajax = new XMLHttpRequest();
	else
		ajax = new ActiveXObject("Microsoft.XMLHTTP");

	if (opts.method == null || opts.method == '')
		method = 'GET';
	else
		method = opts.method.toUpperCase();

	if (method == 'POST') {
		headers['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	} else if (method == 'GET') {
		addUrlArgs(url, opts.parameters);
	}

	ajax.onreadystatechange = function () {
		// ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete']; states 0-4
		if (ajax.readyState == 4) {
			if (ajax.status >= 200 && ajax.status < 305)
				if (opts.onSuccess) opts.onSuccess(ajax);
				else
					if (opts.onFailure) opts.onFailure(ajax);
		} else {
			if (opts.onChange) opts.onChange(ajax);
		}
	}

	ajax.open(method, url, true); // always async!

	for (var k in headers)
		ajax.setRequestHeader(k, headers[k]);
	if (matTypeof(opts.requestHeaders) == 'object')
		for (var k in opts.requestHeaders)
			ajax.setRequestHeader(k, opts.requestHeaders[k]);

	if (method == 'POST') {
		var a = [];
		for (var k in opts.parameters) {
			if (matTypeof(opts.parameters[k]) == 'object') {
				for (var h in opts.parameters[k]) {
					if (matTypeof(opts.parameters[k][h]) == 'object') {
						for (var i in opts.parameters[k][h]) {
							if (matTypeof(opts.parameters[k][h][i]) == 'object') {
								for (var j in opts.parameters[k][h][i]) {
									a.push(k + '[' + h + '][' + i + '][' + j + '] =' + opts.parameters[k][h][i][j]);
								}
							}
							else {
								a.push(k + '[' + h + '][' + i + ']' + ' =' + opts.parameters[k][h][i]);
							}
						}
					}
					else {
						a.push(k + '[' + h + '] =' + opts.parameters[k][h]);
					}
				}
			}
			else {
				a.push(k + '=' + opts.parameters[k]);
			}
		}
		ajax.send(a.join('&'));
	} else {
		ajax.send();
	}
};

function DouW(func, execute_by_embed) {
	if (this.isChrome || execute_by_embed) {
		var scr = document.createElement('script');
		scr.innerHTML = func;
		document.body.appendChild(scr);
	} else {
		try {
			eval("uW." + func);
		} catch (error) {
			logit("A javascript error has occurred when executing a function via DouW. Error description: " + error.description);
		}
	}
}
