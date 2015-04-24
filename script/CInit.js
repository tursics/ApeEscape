//--------------------------------
//---         CInit.js         ---
//--------------------------------

CInit = new function()
{
	//------------------------
	this.eventReady = function()
	{
		try {
//			CHue.init( "ApeEscapeGame", "BerlinGameApe", function() {
//				alert( "Please connect with Philips Hug bridge.");
//			}, function() {
//			});
//
//			CHue.discoverBridges();

			MyMap.eventReady();
			MyPlayer.eventReady();

//			alert( "I'm ready.");
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			MyMap.eventResize();
			MyPlayer.eventResize();
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
};

//----------------------------

function wpGotoPage( pageName)
{
	$.mobile.changePage( "#" + pageName);
}

//----------------------------
// eof
