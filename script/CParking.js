//--------------------------------
//---       CParking.js       ---
//--------------------------------

// data used from data portal http://data.deutschebahn.com/apis/parkplatz/
// license name: CC-BY 4.0
// license url: https://creativecommons.org/licenses/by/4.0/
// license attribution: DB BahnPark GmbH

// description: Access to the parking spaces known to the system
// url: http://opendata.dbbahnpark.info/api/beta/occupancy
// description: Returns the parking space identify by siteId
// url: http://opendata.dbbahnpark.info/api/beta/occupancy/25

CParking = new function()
{
	//------------------------
	this.init = function()
	{
		this.setup_.dataurl = 'http://opendata.dbbahnpark.info/api/beta/occupancy';
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
				for( var i = 0; i < data.allocations.length; ++i) {
					var item = data.allocations[i];
					CParking.data_[item.site.siteId] = {
						active: (4>parseInt(item.allocation.category)),
						type: 'parking',
						subtype: item.site.siteName,
						id: item.site.siteId,
						title: item.site.displayName
					};
				}
				readyCB(CParking.data_);
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
