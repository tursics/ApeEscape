//--------------------------------
//---       CElevator.js       ---
//--------------------------------

// data used from data portal data.deutschebahn.com
// license name: CC-BY 4.0
// license url: https://creativecommons.org/licenses/by/4.0/
// license attribution: DB Station&Service AG

// description: Access to the facilities known to the system
// url: http://adam.noncd.db.de/api/v1.0/facilities
// description: Returns the facility identify by equipmentnumber
// url: http://adam.noncd.db.de/api/v1.0/facilities/10438602
// description: Returns the railway station identified by stationnumber
// url: http://adam.noncd.db.de/api/v1.0/stations/1741

CElevator = new function()
{
	//------------------------
	this.init = function()
	{
		this.setup_.dataurl = 'http://adam.noncd.db.de/api/v1.0/facilities';
	};

	//------------------------
	this.getData = function( readyCB, errorCB )
	{
		this.loaded_ = false;
		this.data_ = new Array();

		$.ajax( this.setup_.dataurl, {
			type:'GET',
			timeout:500,
			success:function(data) {
				for( var i = 0; i < data.length; ++i) {
					var item = data[i];
					if( CElevator.data_[item.stationnumber] != undefined) {
						if( CElevator.data_[item.stationnumber].active) {
							CElevator.data_[item.stationnumber].active = ('ACTIVE'==item.state);
						}
					} else {
						CElevator.data_[item.stationnumber] = {
							active: ('ACTIVE'==item.state),
							type: 'elevator',
							id: item.stationnumber,
							lat: item.geocoordX,
							lng: item.geocoordY
						};
					}
				}
				readyCB(CElevator.data_);
			},
			error: function(data){  
				errorCB();
			},
			statusCode: {
				404: function() {
					errorCB();
				}
			}
		});
	};

	//------------------------
	this.loaded_ = false;
	this.data_ = new Array();
	this.setup_ = new Object();

	//------------------------
};

//----------------------------
// eof
