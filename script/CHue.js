//--------------------------------
//---          CHue.js         ---
//--------------------------------

CHue = new function()
{
	//------------------------
	this.init = function( device, user, pressButtonCallback, connectedCallback)
	{
		this.setup_.username = user;
		this.setup_.devicetype = device;
		this.pressButtonFunc_ = pressButtonCallback;
		this.connectedFunc_ = connectedCallback;
	};

	//------------------------
	this.discoverBridges = function()
	{
		this.bridgeFound_ = false;

		$.ajax( 'http://www.meethue.com/api/nupnp', {
			type:'GET',
			timeout:500,
			success:function(data) {
				for( var i = 0; i < data.length; ++i) {
					if( data[i].internalipaddress != undefined) {
						CHue.loginBridge( data[i].internalipaddress);
					}
				}
			},  
			error: function(data){  
			},
			statusCode: {
				404: function() {
				}
			}
		});
	};

	//------------------------
	this.loginBridge = function( ip)
	{
		$.ajax( 'http://' + ip + '/api/' + this.setup_.username, {
			type:'GET',
			timeout:500,
			success:function(data) {
				if( !CHue.bridgeFound_) {
					CHue.bridgeFound_ = true;
					CHue.foundBridge( ip, data);
				}
			},
			error: function(data){
			},
			statusCode: {
				404: function() {
				}
			}
		});
	};

	//------------------------
	this.foundBridge = function( ip, data)
	{
		this.bridgeIP_ = ip;
		window.clearInterval( this.bridgeTimer_);

		if( data[0] != undefined){
			if( data[0].hasOwnProperty( "error")){
				this.pressButtonFunc_();
				this.bridgeTimerCount_ = 30;
				this.pressBridgeButton();
			}
		}
		if( "lights" in data == true){
			this.initLights();
		}
	};

	//------------------------
	this.pressBridgeButton = function()
	{
		$.ajax( 'http://' + CHue.bridgeIP_ + '/api/', {
			data:JSON.stringify( CHue.setup_),
			contentType:'application/json',
			type:'POST',
			timeout:500,
			cache:false,
			success:function(data) {   
				if( typeof data.error != undefined){
					--CHue.bridgeTimerCount_;
					if( CHue.bridgeTimerCount_ > 0) {
						CHue.bridgeTimer_ = window.setTimeout( CHue.pressBridgeButton, 1000);
					}
				} else {
					CHue.initLights();
				}
			},
			error: function(data){  
			},
			statusCode: {
				404: function() {
				}
			}
		});
	};

	//------------------------
	this.initLights = function()
	{
		this.lights_ = new Array();

		$.ajax({
			url:'http://' + this.bridgeIP_ + '/api/' + this.setup_.username,
			type: 'GET',
			success: function(result) {
				if( typeof(result[0]) != null && !result.lights){
					// nothing
				} else {
					var lights = result.lights;
					var id = 0;

					$.each(lights, function(key, light) {
						CHue.lights_.push( key);
					});
				}

				CHue.connectedFunc_();
			}
		});
	};

	//------------------------
	this.setLight = function( lightNumber, state, successFunc)
	{
		if( this.bridgeFound_) {
			$.ajax({
				url:'http://' + this.bridgeIP_ + '/api/' + this.setup_.username + '/lights/' + this.lights_[lightNumber] + '/state',
				data : JSON.stringify( state),
				contentType : 'application/json',
				type: 'PUT',
				timeout:500,
				success: function(result) {
					successFunc( lightNumber);
				}
			});
		}
	};

	//------------------------
	this.bridgeFound_ = false;
	this.bridgeIP_ = 0;
	this.bridgeTimer_;
	this.bridgeTimerCount_ = 0;
	this.lights_ = new Array();
	this.setup_ = new Object();
	this.pressButtonFunc_ = function() {};
	this.connectedFunc_ = function() {};

	//------------------------
};

//----------------------------
// eof
