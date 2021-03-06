//--------------------------------
//---         MyMap.js         ---
//--------------------------------

MyMap = new function()
{
	//------------------------
	this.eventReady = function()
	{
		$( '#msgButton1').bind( 'vmouseup', function( event, ui) { MyMap.dialogFunc1(); });
		$( '#msgButton2').bind( 'vmouseup', function( event, ui) { MyMap.dialogFunc2(); });

		MyPlayer.startNewGame();
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			this.windowWidth_ = $( window).width();
			this.windowHeight_ = $( window).height();
			this.artY_ = $( '#bar').outerHeight();

			var offset = MyMap.getPixelOffset();
			var size = MyMap.mapToPixel( this.artWidth_, this.artHeight_);

			$( '#map').css({
				top: parseInt( offset.y),
				left: parseInt( offset.x),
				width: parseInt( size.x),
				height: parseInt( size.y)
			});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
//	this.eventClick = function( event)
//	{
//		try {
//			// event.pageX, event.pageY, event.clientX, event.clientY
//			MyPlayer.moveTo( event.pageX, event.pageY);
//		} catch( e) { if( CConfig.debug) { alert( e); } }
//	};

	//------------------------
	this.mapToPixel = function( sourceX, sourceY)
	{
		var destX = this.windowWidth_;
		var destY = this.windowHeight_;
		var width = this.artWidth_ + this.artX_;
		var height = this.artHeight_ + this.artY_;

		if((destX * height) > (destY * width)) {
			destX = width * destY / height;
		} else {
			destY = height * destX / width;
		}

		return {
			x: destX * sourceX / width,
			y: destY * sourceY / height
		};
	}

	//------------------------
	this.getPixelOffset = function()
	{
		var size = this.mapToPixel( this.artX_, 0);
		size.y = this.artY_;
		return size;
	}
	//------------------------
	this.pointToMap = function( point)
	{
		return {
			x: this.mapPoints_[ point].x,
			y: this.mapPoints_[ point].y
		};
	}

	//------------------------
	this.getPossibleMoves = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].moves;
	}

	//------------------------
	this.getPossibleCrumbs = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].crumb;
	}

	//------------------------
	this.getStationName = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].name;
	}

	//------------------------
	this.isElevatorFine = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		if( this.mapPoints_[ point].elevator != undefined) {
			if( CElevator.data_[ this.mapPoints_[ point].elevator] != undefined) {
				return CElevator.data_[this.mapPoints_[ point].elevator].active;
			}
		}

		return true;
	}

	//------------------------
	this.isParkingFine = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		if( this.mapPoints_[ point].parking != undefined) {
			for( var i = 0; i < this.mapPoints_[ point].parking.length; ++i) {
				if( CParking.data_[ this.mapPoints_[ point].parking[i]] != undefined) {
					if( !CParking.data_[this.mapPoints_[ point].parking[i]].active) {
						return false;
					}
				}
			}
		}

		return true;
	}

	//------------------------
	this.messageDialog = function( $image, $text, $button1, $button2, $func1, $func2)
	{
		try {
			this.messageDialogUpdate( $image, $text, $button1, $button2, $func1, $func2);

			$( '#dialog').transition({
				top: parseInt( -MyMap.windowHeight_),
			}, 10, function() {
				$( this).css({
					display: 'block'
				});
				$( this).transition({
					top: parseInt( 0)
				}, 500, 'out', function() {
				});
			});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.messageDialogUpdate = function( $image, $text, $button1, $button2, $func1, $func2)
	{
		try {
			this.dialogFunc1 = $func1;
			this.dialogFunc2 = $func2;

			$( '#msgIcon').attr( 'src', 'art/' + $image);
			$( '#msgText').html( $text);
			$( '#msgButton1').html( $button1);
			$( '#msgButton2').html( $button2).css({
				display: $button2 != '' ? 'inline' : 'none'
			});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.messageDialogHide = function( func)
	{
		try {
			$( '#dialog').transition({
				top: parseInt( -MyMap.windowHeight_)
			}, 500, 'in', function() {
				$( this).css({
					display: 'none'
				});
				func();
			});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.windowWidth_ = 1;
	this.windowHeight_ = 1;
	this.artX_ = 60;
	this.artY_ = 60;
	this.artWidth_ = 1000;
	this.artHeight_ = 600;
	this.dialogFunc1 = function() {};
	this.dialogFunc2 = function() {};
	this.mapPoints_ = [
		{x:350,y: 50,moves:[ 1, 3, 9],            crumb:'ssu',    name:'Westhafen'                    },
		{x:450,y: 50,moves:[ 0, 2, 8],            crumb:'ssu',    name:'Wedding',                     elevator:7756},
		{x:650,y: 50,moves:[ 1, 4, 8,11],         crumb:'sssu',   name:'Gesundbrunnen'                },
		{x:100,y:100,moves:[ 0, 5, 6],            crumb:'ssu',    name:'Jungfernheide'                },
		{x:900,y:100,moves:[ 2,11,12],            crumb:'sus',    name:'Schönhauser Allee'            },
		{x: 50,y:200,moves:[ 3, 6,13],            crumb:'sus',    name:'Kaiserdamm + Messe Nord / ICC'},
		{x:150,y:200,moves:[ 3, 5, 9,14],         crumb:'uuuu',   name:'Bismarckstraße'               },
		{x:450,y:200,moves:[ 8, 9,10],            crumb:'ssu',    name:'Hauptbahnhof'                 },
		{x:600,y:200,moves:[ 1, 2, 7,10,11,16],   crumb:'ussssu', name:'Friedrichstraße'              },
		{x:250,y:250,moves:[ 0, 6, 7,14,17,18],   crumb:'uussuu', name:'Zoologischer Garten',         elevator:533},
		{x:550,y:250,moves:[ 7, 8,15],            crumb:'uss',    name:'Brandenburger Tor'            },
		{x:750,y:250,moves:[ 2, 4, 8,12,16,21,22],crumb:'uusuuus',name:'Alexanderplatz',              elevator:3032/*Jannowitzbrücke*/},
		{x:950,y:250,moves:[ 4,11,23],            crumb:'sus',    name:'Frankfurter Allee'            },
		{x: 50,y:300,moves:[ 5,14,31],            crumb:'sss',    name:'Westkreuz'                    },
		{x:150,y:300,moves:[ 6, 9,13,25],         crumb:'ussu',   name:'Wilmersdorfer Straße'         },
		{x:550,y:300,moves:[10,16,19,28],         crumb:'suus',   name:'Potsdamer Platz',             elevator:525/*Anhalter Bahnhof*/},
		{x:650,y:300,moves:[ 8,11,15,20],         crumb:'uuuu',   name:'Stadtmitte'                   },
		{x:250,y:350,moves:[ 9,18,25,26],         crumb:'uuuu',   name:'Spichernstraße'               },
		{x:350,y:350,moves:[ 9,17,19,27],         crumb:'uuuu',   name:'Nollendorfplatz'              },
		{x:450,y:350,moves:[15,18,24],            crumb:'uuu',    name:'Gleisdreieck'                 },
		{x:650,y:350,moves:[16,21,24,29],         crumb:'uuuu',   name:'Hallesches Tor'               },
		{x:750,y:350,moves:[11,20,22,30],         crumb:'uuuu',   name:'Kottbusser Tor'               },
		{x:850,y:350,moves:[11,21,23],            crumb:'sus',    name:'Warschauer Straße',           parking:[6233,6235]/*Ostbahnhof*/},
		{x:950,y:350,moves:[12,22,32],            crumb:'sss',    name:'Ostkreuz'                     },
		{x:600,y:400,moves:[19,20,28,29],         crumb:'uuuu',   name:'Möckernbrücke'                },
		{x:150,y:450,moves:[14,17,26,31],         crumb:'uuuu',   name:'Fehrbelliner Platz'           },
		{x:250,y:450,moves:[17,25,27,33],         crumb:'uuuu',   name:'Berliner Straße'              },
		{x:350,y:450,moves:[18,26,28,34],         crumb:'uuuu',   name:'Bayerischer Platz'            },
		{x:550,y:450,moves:[15,24,27,35,36],      crumb:'suuss',  name:'Yorckstraße',                 elevator:7759/*Julius-Leber-Brücke*/},
		{x:650,y:450,moves:[20,24,30,37],         crumb:'uuuu',   name:'Mehringdamm'                  },
		{x:750,y:450,moves:[21,29,32,38],         crumb:'uuuu',   name:'Hermannplatz'                 },
		{x:100,y:500,moves:[13,25,33],            crumb:'sus',    name:'Heidelberger Platz'           },
		{x:900,y:500,moves:[23,30,38],            crumb:'sus',    name:'Neukölln'                     },
		{x:250,y:550,moves:[26,31,34],            crumb:'uss',    name:'Bundesplatz'                  },
		{x:350,y:550,moves:[27,33,35],            crumb:'uss',    name:'Innsbrucker Platz'            },
		{x:450,y:550,moves:[28,34,36],            crumb:'sss',    name:'Schöneberg',                  elevator:558},
		{x:550,y:550,moves:[28,35,37],            crumb:'sss',    name:'Südkreuz',                    parking:[2565]},
		{x:650,y:550,moves:[29,36,38],            crumb:'uss',    name:'Tempelhof'                    },
		{x:750,y:550,moves:[30,32,37],            crumb:'uss',    name:'Hermannstraße'                }
	];

	// Westhafen
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/441
	//        http://jannisr.de/berlin-subway-guide/#s-u-westhafen-berlin-u9
	// Wedding
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/304
	//        http://jannisr.de/berlin-subway-guide/#s-u-wedding-berlin-u6
	// Gesundbrunnen
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/305
	//        http://jannisr.de/berlin-subway-guide/#s-u-gesundbrunnen-bhf-berlin-u8
	// Jungfernheide
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=3067
	//        http://jannisr.de/berlin-subway-guide/#s-u-jungfernheide-bhf-berlin-u7
	// Schönhauser Allee
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/213
	//        http://jannisr.de/berlin-subway-guide/#s-u-schonhauser-allee-berlin-u2
	// Kaiserdamm + Messe Nord / ICC
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=6840
	//   nein U2
	// Bismarckstraße
	//        http://jannisr.de/berlin-subway-guide/#u-bismarckstr-berlin-u2
	//        http://jannisr.de/berlin-subway-guide/#u-bismarckstr-berlin-u7
	// Hauptbahnhof
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/61
	//        http://jannisr.de/berlin-subway-guide/#s-u-berlin-hauptbahnhof-u55
	// Friedrichstraße
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/164
	//        http://jannisr.de/berlin-subway-guide/#s-u-friedrichstr-bhf-berlin-u6
	// Zoologischer Garten
	//   BYSA http://www.deutschlands-bahnhoefe.org/node/9
	//        http://jannisr.de/berlin-subway-guide/#s-u-zoologischer-garten-bhf-berlin-u2
	//   nein U9
	// Brandenburger Tor
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=6340
	//        http://jannisr.de/berlin-subway-guide/#s-u-brandenburger-tor-berlin-u55
	// Alexanderplatz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/132
	//        http://jannisr.de/berlin-subway-guide/#s-u-alexanderplatz-bhf-berlin-u2
	//        http://jannisr.de/berlin-subway-guide/#s-u-alexanderplatz-bhf-berlin-u5
	//   nein U8
	// Frankfurter Allee
	//   kommt noch
	//        http://jannisr.de/berlin-subway-guide/#s-u-frankfurter-allee-berlin-u5
	// Westkreuz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/38
	// Wilmersdorfer Straße
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/442
	//   nein U7
	// Potsdamer Platz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/86
	//        http://jannisr.de/berlin-subway-guide/#s-u-potsdamer-platz-bhf-berlin-u2
	// Stadtmitte
	//        http://jannisr.de/berlin-subway-guide/#u-stadtmitte-berlin-u2
	//        http://jannisr.de/berlin-subway-guide/#u-stadtmitte-berlin-u6
	// Spichernstraße
	//        http://jannisr.de/berlin-subway-guide/#u-spichernstr-berlin-u3
	//        http://jannisr.de/berlin-subway-guide/#u-spichernstr-berlin-u9
	// Nollendorfplatz
	//        http://jannisr.de/berlin-subway-guide/#u-nollendorfplatz-berlin-u1
	//   nein U2
	//        http://jannisr.de/berlin-subway-guide/#u-nollendorfplatz-berlin-u3
	//        http://jannisr.de/berlin-subway-guide/#u-nollendorfplatz-berlin-u4
	// Gleisdreieck
	//        http://jannisr.de/berlin-subway-guide/#u-gleisdreieck-berlin-u1
	//        http://jannisr.de/berlin-subway-guide/#u-gleisdreieck-berlin-u2
	// Hallesches Tor
	//        http://jannisr.de/berlin-subway-guide/#u-hallesches-tor-berlin-u1
	//        http://jannisr.de/berlin-subway-guide/#u-hallesches-tor-berlin-u6
	// Kottbusser Tor
	//        http://jannisr.de/berlin-subway-guide/#u-kottbusser-tor-berlin-u1
	//        http://jannisr.de/berlin-subway-guide/#u-kottbusser-tor-berlin-u8
	// Warschauer Straße
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=6550
	//        http://jannisr.de/berlin-subway-guide/#s-u-warschauer-str-berlin-u1
	// Ostkreuz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/486
	// Möckernbrücke
	//        http://jannisr.de/berlin-subway-guide/#u-mockernbrucke-berlin-u1
	//        http://jannisr.de/berlin-subway-guide/#u-mockernbrucke-berlin-u7
	// Fehrbelliner Platz
	//        http://jannisr.de/berlin-subway-guide/#u-fehrbelliner-platz-berlin-u3
	//        http://jannisr.de/berlin-subway-guide/#u-fehrbelliner-platz-berlin-u7
	// Berliner Straße
	//        http://jannisr.de/berlin-subway-guide/#u-berliner-str-berlin-u7
	//        http://jannisr.de/berlin-subway-guide/#u-berliner-str-berlin-u9
	// Bayerischer Platz
	//        http://jannisr.de/berlin-subway-guide/#u-bayerischer-platz-berlin-u4
	//        http://jannisr.de/berlin-subway-guide/#u-bayerischer-platz-berlin-u7
	// Yorckstraße
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=6967
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=7755
	//        http://jannisr.de/berlin-subway-guide/#s-u-yorckstr-berlin-u7
	// Mehringdamm
	//        http://jannisr.de/berlin-subway-guide/#u-mehringdamm-berlin-u6
	//        http://jannisr.de/berlin-subway-guide/#u-mehringdamm-berlin-u7
	// Hermannplatz
	//        http://jannisr.de/berlin-subway-guide/#u-hermannplatz-berlin-u7
	//        http://jannisr.de/berlin-subway-guide/#u-hermannplatz-berlin-u8
	// Heidelberger Platz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/796
	//        http://jannisr.de/berlin-subway-guide/#s-u-heidelberger-platz-berlin-u3
	// Neukölln
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=554
	//        http://jannisr.de/berlin-subway-guide/#s-u-neukolln-berlin-u7
	// Bundesplatz
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=970
	//        http://jannisr.de/berlin-subway-guide/#s-u-bundesplatz-berlin-u9
	// Innsbrucker Platz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/326
	//   nein U4
	// Schöneberg
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/121
	// Südkreuz
	//   CC0  http://www.deutschlands-bahnhoefe.org/node/476
	// Tempelhof
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=565
	//        http://jannisr.de/berlin-subway-guide/#s-u-tempelhof-berlin-u6
	// Hermannstraße
	//   nein http://www.deutschlands-bahnhoefe.de/detail.php?bahnhofNr=2716
	//        http://jannisr.de/berlin-subway-guide/#s-u-hermannstr-berlin-u8

	//------------------------
};

//----------------------------
// eof
