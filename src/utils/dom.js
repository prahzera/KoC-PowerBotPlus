function ById(id) { return document.getElementById(id); }
function ByCl(cn) { return document.getElementsByClassName(cn); }

function CheckForHTMLChange(panel, div, newHTML, wait) {
	var oldHTML = HTMLRegister[panel][div];
	if (!wait && (oldHTML != newHTML)) {
		ById(div).innerHTML = newHTML;
		HTMLRegister[panel][div] = newHTML;
		return true;
	}
	return false;
};

function ResetHTMLRegister(panel, div) {
	HTMLRegister[panel][div] = '';
};

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
