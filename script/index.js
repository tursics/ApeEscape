//----------------------------
//---       index.js       ---
//----------------------------

// http://underscorejs.org/
// http://backbonejs.org/
// http://ricostacruz.com/jquery.transit/

// http://buildingfirefoxos.com/
// https://marketplace.firefox.com/developers/docs/manifests
// http://davidwalsh.name/install-firefoxos-app

CConfig = new function()
{
	//------------------------
	this.init = function()
	{
		if(( typeof device !== 'undefined') && (typeof device.platform !== 'undefined')) {
			if((device.platform == 'iPhone') || (device.platform == 'iPad') || (device.platform == 'iPod touch') || (device.platform == 'iOS')) {
				this.platform = this.os.ios;
			}
		}
		if((this.platform == this.os.others) && ('blackberry' in window)) {
			this.platform = this.os.blackberry;
		}
//		if( navigator.userAgent.match(/IEMobile\/10\.0/)) {

		if((this.platform == this.os.others) && (typeof window.external !== 'undefined') && (typeof window.external.notify !== 'undefined')) {
			this.platform = this.os.windowsPhone;
		}
		if((this.platform == this.os.others) && ('WinJS' in window)) {
			this.platform = this.os.windows;
		}
		if((this.platform == this.os.others) && (navigator.mozApps)) {
//			this.platform = this.os.firefox;
		}

//		this.platform = this.os.ios;
//		this.platform = this.os.windowsPhone;
//		this.platform = this.os.firefox;
//		this.royalty = this.license.lite;
		this.debug = true;
//		this.screenshot = true;
	}
	//------------------------
	this.os = {
		// desktop os: x
		// mobile os:  xx
		// branded os: xxx
		windows:      1,
		windowsPhone: 10,
//		mac:          2,
		ios:          20,
//		android:      30,
//		kindle:       301,
//		nook:         302, // no advertisements allowed!!!
		blackberry:   40,
		firefox:      50,
		others:       999
	};

	this.license = {
		lite:       0,
		full:       1
	};

	//------------------------
	this.platform = this.os.others;
	this.royalty = this.license.full;
	this.debug = false;
	this.screenshot = false;

	//------------------------
};

//----------------------------

$( document).ready( function()
{
	CConfig.init();

	try {
/*		if( CConfig.platform == CConfig.os.windowsPhone) {
			var msViewportStyle = document.createElement( "style");

			msViewportStyle.appendChild( document.createTextNode( "@-ms-viewport{width:auto!important}"));

			document.getElementsByTagName( "head")[0].appendChild( msViewportStyle);

		}*/

		CInternationalization.init();

		if( CConfig.screenshot) {
			$( 'body,html').css( 'overflow', 'hidden');
		}

		$( document).bind( "orientationchange", function( event, orientation) { eventResize(); });
		$( window).resize( eventResize);
		eventResize();

		CInit.eventReady();
	} catch( e) { if( CConfig.debug) { alert( e); } }
});

//----------------------------

$( document).bind( "mobileinit", function() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
//	$.mobile.listview.prototype.options.filterPlaceholder = _( 'searchPlaceholder');
});

//----------------------------

function eventResize()
{
	try {
		CInit.eventResize();
	} catch( e) { if( CConfig.debug) { alert( e); } }
}

//----------------------------
// eof
