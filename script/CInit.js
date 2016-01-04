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

			CElevator.init();
			CElevator.getData( function( data) {
				$.each( MyMap.mapPoints_, function(index, item) {
					if( item.elevator != undefined) {
						if( data[item.elevator] != undefined) {
console.log('Elevator '+item.name+': '+data[item.elevator].active);
						}
					}
				});
			}, function() {
				console.log('elevator error');
			});

			CParking.init();
			CParking.getData( function( data) {
				$.each( MyMap.mapPoints_, function(index, item) {
					if( item.parking != undefined) {
						for( var i = 0; i < item.parking.length; ++i) {
							if( data[item.parking[i]] != undefined) {
console.log('Parking '+item.name+': '+data[item.parking[i]].active);
							}
						}
					}
				});
			}, function() {
				console.log('parking error');
			});

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
