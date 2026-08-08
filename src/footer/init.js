/** END OF TABS **/

if (document.URL.search(/main_src.php/i) != -1) {
	if (window.self.location != window.parent.location) { // Fix weird bug with koc game?
		PowerBotStartup();
	}
}