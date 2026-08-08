function CheckHideFBDialogs() {
	var FBClasses = ByCl('_10 uiLayer _4-hy _3qw');
	var i = FBClasses.length;
	while (i--) { FBClasses[i].parentNode.removeChild(FBClasses[i]); }
};
