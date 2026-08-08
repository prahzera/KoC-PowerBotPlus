function makeReportLink(rptid, side, tiletype, tilelv, defid, defnm, defgen, atknm, atkgen, marchtype, xcoord, ycoord, timestamp, unread, atkxcoord, atkycoord, side0AllianceName, side1AllianceName, link) {
	uW.Chat.sendChat("/a Report No: " + enFilter(rptid));
};

function makeReportPopup(rptid, side, tiletype, tilelv, defid, defnm, defgen, atknm, atkgen, marchtype, xcoord, ycoord, timestamp, unread, atkxcoord, atkycoord, side0AllianceName, side1AllianceName, link) {
	Rpt.FindReport(rptid, 0);
};
