//--------------------------------
//---       MyPlayer.js        ---
//--------------------------------

// test for 'Makey Makey' implementation
/*document.onkeydown = function(event)
{
	if( event.keyCode == 38) {
		// up
		MyPlayer.eventOrbitClick( 0);
	} else if( event.keyCode == 39) {
		// right
		MyPlayer.eventOrbitClick( 1);
	} else if( event.keyCode == 40) {
		// down
		MyPlayer.eventOrbitClick( 2);
	} else if( event.keyCode == 37) {
		// links
		MyPlayer.eventOrbitClick( 3);
	} else if( event.keyCode == 32) {
		// space
		MyPlayer.eventOrbitClick( 4);
	}
}*/

MyPlayer = new function()
{
	//------------------------
	this.eventReady = function()
	{
		// pointer-events:none prevent call this function. But it does not work on windows phone
//		$( '#player0').bind( 'click', function( event, ui) { MyPlayer.eventPlayerClick( event, 0); });
		$( '#player0').bind( 'vmouseup', function( event, ui) { MyPlayer.eventPlayerClick( event, 0); });
		$( '#player1').bind( 'vmouseup', function( event, ui) { MyPlayer.eventPlayerClick( event, 1); });
		$( '#player2').bind( 'vmouseup', function( event, ui) { MyPlayer.eventPlayerClick( event, 2); });
		$( '#player3').bind( 'vmouseup', function( event, ui) { MyPlayer.eventPlayerClick( event, 3); });

		$( '#orbit0').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 0); });
		$( '#orbit1').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 1); });
		$( '#orbit2').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 2); });
		$( '#orbit3').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 3); });
		$( '#orbit4').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 4); });
		$( '#orbit5').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 5); });
		$( '#orbit6').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 6); });
		$( '#orbit7').bind( 'vmouseup', function( event, ui) { MyPlayer.eventOrbitClick( 7); });

		$( '#stepAbort').html( _( 'barStepAbort'));
		$( '#stepAbort').bind( 'vmouseup', function( event, ui) {
			MyMap.messageDialog( 'meepleRed.png', _( 'msgAbort'), _( 'msgAbortButtonYes'), _( 'msgAbortButtonNo'), function() {
				MyMap.messageDialogHide( function() {
					MyPlayer.finishGame( function() {
						MyPlayer.startNewGame();
					});
				});
			}, function() {
				MyMap.messageDialogHide( function() {});
			});
		});

//		hueVoid();

		// will be done in this.startNewGame()
//		$( '#stepCount').html( _( 'appName'));
//		$( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleTransparent.png');
//		$( '#stepStation').html( '');
//
//		MyPlayer.currentCrumb_ = 0;
//		MyPlayer.showBreadcrumb();
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			var offset = MyMap.getPixelOffset();
			var mSize = MyMap.mapToPixel( this.mapWidth_, this.mapHeight_);
			var oSize = MyMap.mapToPixel( this.orbitWidth_, this.orbitHeight_);
			var cSize = MyMap.mapToPixel( this.crumbWidth_, this.crumbHeight_);

			for( var number = 0; number < this.player_.length; ++number) {
				if( !this.player_[ number].visible) {
					continue;
				}

				var pos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);

				$( '#player' + number).css({
					top: parseInt( offset.y + pos.y - mSize.y / 2),
					left: parseInt( offset.x + pos.x - mSize.x / 2),
					width: parseInt( mSize.x),
					height: parseInt( mSize.y),
					"z-index": parseInt( pos.y + number)
				});
			}

			for( var idx = 0; idx < this.orbit_.length; ++idx) {
				if( !this.orbit_[ idx].visible) {
					continue;
				}

				var pos = MyMap.mapToPixel( this.orbit_[ idx].x, this.orbit_[ idx].y);

				$( '#orbit' + idx).css({
					top: parseInt( offset.y + pos.y - oSize.y / 2),
					left: parseInt( offset.x + pos.x - oSize.x / 2),
					width: parseInt( oSize.x),
					height: parseInt( oSize.y)
				});
			}

			for( var idx = 0; idx < this.maxCrumb_; ++idx) {
				var pos = MyMap.mapToPixel( 0, (this.maxCrumb_ - idx - 1) * this.crumbHeight_);

				$( '#crumb' + idx).css({
					top: parseInt( offset.y + pos.y),
					left: parseInt( pos.x),
					width: parseInt( cSize.x),
					height: parseInt( cSize.y)
				});
			}
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
	this.eventPlayerClick = function( event, player)
	{
		// pointer-events:none prevent call this function. But it does not work on windows phone
		try {
			$( '#player' + player).hide( 0);
			var clickObj = document.elementFromPoint( event.clientX, event.clientY);
			$( '#player' + player).show( 0);
			if( clickObj.id.substring( 0, 5) == 'orbit') {
				this.eventOrbitClick( parseInt( clickObj.id.substring( 5, 6)));
			}
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
	this.eventOrbitClick = function( orbit)
	{
		try {
			if( this.enableOrbit_) {
				MyPlayer.hideOrbit( function() {
					MyPlayer.moveTo( MyPlayer.orbit_[ orbit].point, MyPlayer.orbit_[ orbit].crumb, function() {
						MyPlayer.nextStepGame();
					});
				});
			}
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
	this.startNewGame = function()
	{
		$( '#stepCount').html( _( 'appName'));
		$( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleTransparent.png');
		$( '#stepStation').html( '');

		MyPlayer.currentCrumb_ = 0;
		MyPlayer.showBreadcrumb();

		while( MyPlayer.player_.length > 0) {
			MyPlayer.die();
		}

		MyMap.messageDialog( 'meepleApe.png', _( 'msgStart'), _( 'msgStartButtonGo'), _( 'msgStartButtonHelp'), function() {
			MyMap.messageDialogHide( function() {
				MyPlayer.startNewGameGo();
			});
		}, function() {
			MyPlayer.startHelp();
		});
	}

	//------------------------
	this.startNewGameGo = function()
	{
		try {
			for( var num = 0; num < this.maxPlayer_; ) {
				var point = parseInt( Math.random() * MyMap.mapPoints_.length);
				var full = false;
				for( var idx = 0; idx < num; ++idx) {
					if( point == this.player_[ idx].point) {
						full = true;
					}
				}
				if( full) {
					continue;
				}

				++num;
				var visible = (num < 5);
				if( num < this.maxPlayer_) {
					this.born( point, visible, function() {});
				} else {
					this.born( point, visible, function() {
						MyPlayer.currentPlayer_ = -1;
						MyPlayer.currentStep_ = 0;
//						MyPlayer.currentCrumb_ = 2;
						MyPlayer.currentCrumb_ = 1;
						MyPlayer.enableApe_ = false;

						$( '#stepCount').html( _( 'barStepCount').replace(/%count%/g, MyPlayer.currentStep_));
						$( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleTransparent.png');
						$( '#stepStation').html( '');

						MyPlayer.showBreadcrumb();
						MyPlayer.nextStepGame();
					});
				}
			}
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.startHelp = function()
	{
		try {
			MyMap.messageDialogUpdate( 'meepleRed.png', _( 'helpIntro'), _( 'helpButtonNext'), '', function() {
				MyMap.messageDialogUpdate( 'meepleRed.png', _( 'helpDriveLines'), _( 'helpButtonNext'), '', function() {
					MyMap.messageDialogUpdate( 'meepleRed.png', _( 'helpDriveStation'), _( 'helpButtonNext'), '', function() {
						MyMap.messageDialogUpdate( 'meepleYellow.png', _( 'help2ndPlayer'), _( 'helpButtonNext'), '', function() {
							MyMap.messageDialogUpdate( 'meeplePurple.png', _( 'help3rdPlayer'), _( 'helpButtonNext'), '', function() {
								MyMap.messageDialogUpdate( 'meepleApe.png', _( 'helpShowApe'), _( 'helpButtonNext'), '', function() {
									MyMap.messageDialogUpdate( 'meepleTransparent.png', _( 'helpHideApe'), _( 'helpButtonNext'), '', function() {
										MyMap.messageDialogUpdate( 'meepleTransparent.png', _( 'helpBreadcrumb'), _( 'helpButtonNext'), '', function() {
											MyMap.messageDialogUpdate( 'meepleTransparent.png', _( 'helpGetStarted'), _( 'helpButtonNext'), '', function() {
												MyMap.messageDialogHide( function() {
													MyPlayer.startNewGame();
												});
											}, function() {});
										}, function() {});
									}, function() {});
								}, function() {});
							}, function() {});
						}, function() {});
					}, function() {});
				}, function() {});
			}, function() {});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.nextStepGame = function()
	{
		try {
			if( this.caught()) {
				this.finishGame( function() {
					MyPlayer.showApe( function() {
						MyMap.messageDialog( 'meepleApe.png', _( 'msgWin').replace(/%count%/g, MyPlayer.currentStep_), _( 'msgWinButtonGo'), '', function() {
							MyMap.messageDialogHide( function() {
								MyPlayer.startNewGame();
							});
						}, function() {
						});
					});
				});
				return;
			}

			do {
				++this.currentPlayer_;
				if( this.currentPlayer_ >= this.player_.length) {
					this.currentPlayer_ = 0;
				}
				if( this.currentPlayer_ == 0) {
					break;
				}
				if( this.player_[ this.currentPlayer_].visible) {
					break;
				}
			} while( true);

			switch( this.currentPlayer_) {
			case 0: $( '#stepPlayer').attr( 'src',  0 == this.currentCrumb_ ? (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleApe.png' : (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleTransparent.png'); break;
			case 1: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleRed.png'); break;
			case 2: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleYellow.png'); break;
			case 3: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meeplePurple.png'); break;
			case 4: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleBlue.png'); break;
			case 5: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleBlack.png'); break;
			case 6: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleGreen.png'); break;
			case 7: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleOrange.png'); break;
			case 8: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meeplePink.png'); break;
			case 9: $( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleCyan.png'); break;
			case 10:$( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleWhite.png'); break;
			}
			if(( 0 == this.currentPlayer_) && (0 < this.currentCrumb_)) {
				$( '#stepStation').html( '');
			} else {
				$( '#stepStation').html( MyMap.getStationName( this.player_[ this.currentPlayer_].point));
			}

			if( 0 < this.currentPlayer_) {
				this.showOrbit();
				return;
			}

			++this.currentStep_;
			$( '#stepCount').html( _( 'barStepCount').replace(/%count%/g, MyPlayer.currentStep_));

			if( 0 == this.currentCrumb_) {
				this.showApe( function() {
					MyPlayer.hideApe( function() {
						MyPlayer.rotateApe( function() {
							MyPlayer.nextStepGame_AIStep();
						});
					});
				});
			} else if( !this.isApeVisible()) {
				MyPlayer.nextStepGame_AIStep();
			} else {
				this.rotateApe( function() {
					MyPlayer.nextStepGame_AIStep();
				});
			}
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.nextStepGame_AIStep = function()
	{
		try {
			if( 0 == this.currentCrumb_) {
				if( this.currentStep_ < 10) {
					this.currentCrumb_ = 5;
				} else if( this.currentStep_ < 20) {
					this.currentCrumb_ = 4;
				} else if( this.currentStep_ < 30) {
					this.currentCrumb_ = 3;
				} else if( this.currentStep_ < 40) {
					this.currentCrumb_ = 2;
				} else {
					this.currentCrumb_ = 1;
				}
				this.showBreadcrumb();
			}
			this.startAI();
			--this.currentCrumb_;

			MyPlayer.nextStepGame();
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.finishGame = function( func)
	{
		try {
			this.hideOrbit( function() {
				MyPlayer.hideBreadcrumb();

				$( '#stepPlayer').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleApe.png');
				$( '#stepStation').html( MyMap.getStationName( MyPlayer.player_[ 0].point));

				while( MyPlayer.player_.length > 1) {
					MyPlayer.die();
				}

				func();

//				if( CConfig.platform = CConfig.os.windowsPhone) {
//					window.external.notify( "applicationBarClear");
//					window.external.notify( "applicationBarAddButton:"+ _( 'homeSearchShort') +":art/win-search.png:wpGotoPage:pageSearch");
//					window.external.notify( "applicationBarAddMenu:"+ _( 'homeImprint') +":wpGotoPage:pageImprint");
//				}
			});
		} catch( e) { if( CConfig.debug) { alert( e); } }
	}

	//------------------------
	this.born = function( point, visible, func)
	{
		var mapPos = MyMap.pointToMap( point);

		if(( this.player_.length > 0) && !visible) {
			point = MyMap.mapPoints_.length;
		}

		this.player_.push({
			visible: this.player_.length > 0 ? visible : false,
			x: mapPos.x,
			y: mapPos.y,
			point: point,
			suspend: 0
		});

		var number = this.player_.length - 1;
		var offset = MyMap.getPixelOffset();
		var pos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
		var mSize = MyMap.mapToPixel( this.mapWidth_, this.mapHeight_);
		var aSize = MyMap.mapToPixel( MyMap.artWidth_, MyMap.artHeight_);

		$( '#player' + number).transition({
			top: parseInt( offset.y + pos.y - mSize.y / 2 - aSize.y),
			left: parseInt( offset.x + pos.x - mSize.x / 2),
			width: parseInt( mSize.x),
			height: parseInt( mSize.y),
			"z-index": parseInt( pos.y + number)
		}, 10, function() {
			var currentId = parseInt( $( this).attr( 'id').substr( 6));
			var pos = MyMap.mapToPixel( MyPlayer.player_[ currentId].x, MyPlayer.player_[ currentId].y);

			$( this).css({
				display: (MyPlayer.player_[ currentId].visible ? 'block' : 'none'),
			}).transition({
				top: parseInt( offset.y + pos.y - mSize.y / 2),
			}, 500, 'out', function() {
				func();
			});
		});
	}

	//------------------------
	this.die = function()
	{
		var number = this.player_.length - 1;

		$( '#player' + number).css({
			display: 'none'
		});

		this.player_.pop();
	}

	//------------------------
	this.moveTo = function( point, crumb, func)
	{
		var mapPos = MyMap.pointToMap( point);
		var number = this.currentPlayer_;

		this.player_[ number].x = mapPos.x;
		this.player_[ number].y = mapPos.y;
		this.player_[ number].point = point;

		var offset = MyMap.getPixelOffset();
		var pos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
		var mSize = MyMap.mapToPixel( this.mapWidth_, this.mapHeight_);

		if( 0 == number) {
			$( '#crumb' + this.currentCrumb_).attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'crumb' + crumb.toUpperCase() + 'Bahn.png');
//			if( crumb.toUpperCase() == 'S') {
//				hueS();
//			} else {
//				hueU();
//			}
		}

		if( this.enableApe_ || (number > 0)) {
			$( '#player' + number).css({
				"z-index": parseInt( pos.y + number)
			}).transition({
				top: parseInt( offset.y + pos.y - mSize.y / 2),
				left: parseInt( offset.x + pos.x - mSize.x / 2)
			}, 500, 'in-out', function() {
				func();
			});
		} else {
			func();
		}
	}

	//------------------------
	this.showBreadcrumb = function()
	{
		var offset = MyMap.getPixelOffset();
		var cSize = MyMap.mapToPixel( this.crumbWidth_, this.crumbHeight_);

		for( var idx = this.currentCrumb_ + 1; idx < this.maxCrumb_; ++idx) {
			$( '#crumb' + idx).css({
				display: 'none'
			});
		}

		this.maxCrumb_ = this.currentCrumb_ + 1;

		for( var idx = 0; idx < this.maxCrumb_; ++idx) {
			var pos = MyMap.mapToPixel( 0, (this.maxCrumb_ - idx - 1) * this.crumbHeight_);

			$( '#crumb' + idx).attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'crumbVoid.png');
			$( '#crumb' + idx).css({
				display: 'block',
				top: parseInt( offset.y + pos.y),
				left: parseInt( pos.x),
				width: parseInt( cSize.x),
				height: parseInt( cSize.y)
			});
		}
		$( '#crumb0').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'crumbShow.png');
	}

	//------------------------
	this.hideBreadcrumb = function()
	{
		MyPlayer.currentCrumb_ = 0;
		MyPlayer.showBreadcrumb();
//		hueVoid();
	}

	//------------------------
	this.showOrbit = function()
	{
		var number = this.currentPlayer_;
		var offset = MyMap.getPixelOffset();
		var moves = MyMap.getPossibleMoves( this.player_[ number].point);
		var crumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
		var oSize = MyMap.mapToPixel( this.orbitWidth_, this.orbitHeight_);
		var playerPos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
		var elevator = MyMap.isElevatorFine( this.player_[ number].point);
		var parking = MyMap.isParkingFine( this.player_[ number].point);

		if( this.player_[ number].suspend > 0) {
			--this.player_[ number].suspend;
			elevator = true;
			parking = true;

			if( this.player_[ number].suspend > 0) {
				return;
			}
		}

		if( !elevator) {
			this.player_[ number].suspend = 1;

			var meeple = $( '#stepPlayer').attr( 'src');
			meeple = meeple.split('/')[1];
			MyMap.messageDialog( meeple, _( 'msgElevator'), _( 'msgElevatorButton'), '', function() {
				MyMap.messageDialogHide( function() {
					MyPlayer.nextStepGame();
				});
			});

			return;
		}
		if( !parking) {
			this.player_[ number].suspend = 1;

			var meeple = $( '#stepPlayer').attr( 'src');
			meeple = meeple.split('/')[1];
			MyMap.messageDialog( meeple, _( 'msgParking'), _( 'msgParkingButton'), '', function() {
				MyMap.messageDialogHide( function() {
					MyPlayer.nextStepGame();
				});
			});

			return;
		}

		while( this.orbit_.length < 8) {
			this.orbit_.push({
				visible: false,
				x: 0,
				y: 0,
				point: 0,
				crumb: 0
			});
		}

		var orbitCount = 0;
		for( var idx = 0; idx < this.orbit_.length; ++idx) {
			var full = false;
			for( var i = 1; i < this.player_.length; ++i) {
				if( moves[ idx] == this.player_[ i].point) {
					full = true;
					break;
				}
			}
			if( !full && (idx < moves.length)) {
				++orbitCount;
				var mapPos = MyMap.pointToMap( moves[ idx]);

				this.orbit_[ idx].visible = true;
				this.orbit_[ idx].x = mapPos.x;
				this.orbit_[ idx].y = mapPos.y;
				this.orbit_[ idx].point = moves[ idx];
				this.orbit_[ idx].crumb = crumbs[ idx];

				$( '#orbit' + idx).transition({
					top: parseInt( offset.y + playerPos.y - oSize.y / 2),
					left: parseInt( offset.x + playerPos.x - oSize.x / 2),
					width: parseInt( oSize.x),
					height: parseInt( oSize.y)
				}, 10, function() {
					var currentId = parseInt( $( this).attr( 'id').substr( 5));
					var pos = MyMap.mapToPixel( MyPlayer.orbit_[ currentId].x, MyPlayer.orbit_[ currentId].y);

					$( this).css({
						display: 'block',
					}).transition({
						top: parseInt( offset.y + pos.y - oSize.y / 2),
						left: parseInt( offset.x + pos.x - oSize.x / 2)
					}, 500, 'out');
				});
			}
		}

		if( 0 == orbitCount) {
			MyMap.messageDialog( meeple, _( 'msgNarrowly'), _( 'msgNarrowlyButton'), '', function() {
				MyMap.messageDialogHide( function() {
					MyPlayer.nextStepGame();
				});
			});

			return;
		}

		this.enableOrbit_ = true;
	}

	//------------------------
	this.hideOrbit = function( func)
	{
		this.enableOrbit_ = false;

		var number = this.currentPlayer_;
		var offset = MyMap.getPixelOffset();
		var oSize = MyMap.mapToPixel( this.orbitWidth_, this.orbitHeight_);
		var playerPos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
		var funcIdx = -1;

		for( var idx = 0; idx < this.orbit_.length; ++idx) {
			if( this.orbit_[ idx].visible) {
				funcIdx = idx;
			}
		}

		for( var idx = 0; idx < this.orbit_.length; ++idx) {
			if( this.orbit_[ idx].visible) {
				this.orbit_[ idx].visible = false;

				$( '#orbit' + idx).transition({
					top: parseInt( offset.y + playerPos.y - oSize.y / 2),
					left: parseInt( offset.x + playerPos.x - oSize.x / 2)
				}, 200, 'in', function() {
					$( this).css({
						display: 'none'
					});
					var currentId = parseInt( $( this).attr( 'id').substr( 5));
					if( funcIdx == currentId) {
						func();
					}
				});
			}
		}

		if( -1 == funcIdx) {
			func();
		}
	}

	//------------------------
	this.isApeVisible = function( func)
	{
		return this.player_[ 0].visible;
	}

	//------------------------
	this.showApe = function( func)
	{
		this.enableApe_ = true;
		$( '#player0').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleApe.png');

//		if( !this.isApeVisible()) {
			var number = 0;
			var offset = MyMap.getPixelOffset();
			var pos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
			var mSize = MyMap.mapToPixel( this.mapWidth_, this.mapHeight_);

			this.player_[ number].visible = true;
			$( '#player0').css({
				display: 'block',
				top: parseInt( offset.y + pos.y - mSize.y / 2),
				left: parseInt( offset.x + pos.x - mSize.x / 2),
				width: parseInt( mSize.x),
				height: parseInt( mSize.y),
				"z-index": parseInt( pos.y + number)
			});
//		}

		this.bounceApe( function() {
			func();
		});
	}

	//------------------------
	this.hideApe = function( func)
	{
//		this.bounceApe( function() {
			MyPlayer.enableApe_ = false;
			$( '#player0').attr( 'src', (CConfig.os.firefox == CConfig.platform ? 'artFxOS/' : 'art/') + 'meepleTransparent.png');

			func();
//		});
	}

	//------------------------
	this.bounceApe = function( func)
	{
		var number = 0;
		var offset = MyMap.getPixelOffset();
		var pos = MyMap.mapToPixel( this.player_[ number].x, this.player_[ number].y);
		var mSize = MyMap.mapToPixel( this.mapWidth_, this.mapHeight_);

		$( '#player0').transition({
			top: parseInt( offset.y + pos.y - mSize.y),
		}, 250, 'out', function() {
			$( '#player0').transition({
				top: parseInt( offset.y + pos.y - mSize.y / 2),
			}, 250, 'in', function() {
				$( '#player0').transition({
					top: parseInt( offset.y + pos.y - mSize.y),
				}, 250, 'out', function() {
					$( '#player0').transition({
						top: parseInt( offset.y + pos.y - mSize.y / 2),
					}, 250, 'in', function() {
						$( '#player0').transition({
							top: parseInt( offset.y + pos.y - mSize.y),
						}, 250, 'out', function() {
							$( '#player0').transition({
								top: parseInt( offset.y + pos.y - mSize.y / 2),
							}, 250, 'in', function() {
								func();
							});
						});
					});
				});
			});
		});
	}

	//------------------------
	this.rotateApe = function( func)
	{
		$( '#player0').transition({
			rotate: '720deg'
		}, 1000, 'in-out', function() {
			$( '#player0').css({
				rotate: '0deg'
			});

			func();
		});
	}

	//------------------------
	this.caught = function()
	{
		for( var number = 1; number < this.player_.length; ++number) {
			if( this.player_[ 0].point == this.player_[ number].point) {
				return true;
			}
		}

		return false;
	}

	//------------------------
	this.startAI = function()
	{
		if( this.isSurrounded()) {
			var number = this.currentPlayer_;
			var moves = MyMap.getPossibleMoves( this.player_[ number].point);
			var crumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
			this.moveTo( moves[ 0], crumbs[ 0], function() {});
		} else {
//			this.levelOneAI();
//			this.levelTwoAI();
			this.levelThreeAI();
		}
	}

	//------------------------
	this.isSurrounded = function()
	{
		var number = this.currentPlayer_;
		var moves = MyMap.getPossibleMoves( this.player_[ number].point);
		var count = 0;

		for( var idx = 0; idx < moves.length; ++idx) {
			for( number = 0; number < this.player_.length; ++number) {
				if( moves[ idx] == this.player_[ number].point) {
					++count;
				}
			}
		}

		return count == moves.length;
	}

	//------------------------
	this.levelOneAI = function()
	{
		// randomized next step
		var number = this.currentPlayer_;
		var moves = MyMap.getPossibleMoves( this.player_[ number].point);
		var crumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
		var pos = parseInt( Math.random() * moves.length);
		this.moveTo( moves[ pos], crumbs[ pos], function() {});
	}

	//------------------------
	this.levelTwoAI = function()
	{
		// do not move to the opponent (and loose)
		var number = this.currentPlayer_;
		var moves = MyMap.getPossibleMoves( this.player_[ number].point);
		var crumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
		var full;
		var pos;

		do {
			full = false;
			pos = parseInt( Math.random() * moves.length);

			for( var idx = 0; idx < this.player_.length; ++idx) {
				if( moves[ pos] == this.player_[ idx].point) {
					full = true;
				}
			}
		} while( full);

		this.moveTo( moves[ pos], crumbs[ pos], function() {});
	}

	//------------------------
	this.levelThreeAI = function()
	{
		// do not move next to the opponent (find an escape)
		var number = this.currentPlayer_;
		var moves = MyMap.getPossibleMoves( this.player_[ number].point);
		var crumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
		var me = number;
		var blocked = [];
		var bi;

		for( number = 0; number < this.player_.length; ++number) {
			if( me == number) {
				continue;
			}
			if( !this.player_[ number].visible) {
				continue;
			}
			for( bi = 0; bi < blocked.length; ++bi) {
				if( blocked[ bi] == this.player_[ number].point) {
					break;
				}
			}
			if( bi == blocked.length) {
				blocked.push( this.player_[ number].point);
			}

			var oppMoves = MyMap.getPossibleMoves( this.player_[ number].point);
			var oppCrumbs = MyMap.getPossibleCrumbs( this.player_[ number].point);
			for( var j = 0; j < oppMoves.length; ++j) {
				for( bi = 0; bi < blocked.length; ++bi) {
					if( blocked[ bi] == oppMoves[ j]) {
						break;
					}
				}
				if( bi == blocked.length) {
					blocked.push( oppMoves[ j]);
				}
			}
		}

		var count = 0;
		for( var idx = 0; idx < moves.length; ++idx) {
			for( var j = 0; j < blocked.length; ++j) {
				if( blocked[ j] == moves[ idx]) {
					++count;
				}
			}
		}

		if( count == moves.length) {
			this.levelTwoAI();
		} else {
			var full;
			var pos;

			do {
				full = false;
				pos = parseInt( Math.random() * moves.length);

				for( var idx = 0; idx < blocked.length; ++idx) {
					if( moves[ pos] == blocked[ idx]) {
						full = true;
					}
				}
			} while( full);

			this.moveTo( moves[ pos], crumbs[ pos], function() {});
		}
	}

	//------------------------
	this.orbitWidth_ = 50;
	this.orbitHeight_ = 50;
	this.crumbWidth_ = 60;
	this.crumbHeight_ = 60;
	this.mapWidth_ = 100;
	this.mapHeight_ = 100;
	this.maxPlayer_ = 11;
	this.maxCrumb_ = 0;
	this.enableOrbit_ = false;
	this.enableApe_ = false;
	this.currentPlayer_ = 0;
	this.currentStep_ = 0;
	this.currentCrumb_ = 0;
	this.player_ = [];
	this.orbit_ = [];

	//------------------------
};

//function hueVoid()
//{
//	var state = {
//		on: true,
//		bri: 255,
//		hue: 32768,
//		sat: 255,
//		transitiontime: 15
//	};
//	CHue.setLight( 0, state, function() {
//		CHue.setLight( 1, state, function() {
//			CHue.setLight( 2, state, function() {
//			});
//		});
//	});
//}
//
//function hueS()
//{
//	var state = {
//		on: true,
//		bri: parseInt( 255 * 0.25),
//		hue: parseInt( 65535 * 145/360),
//		sat: parseInt( 255 * 1),
//		transitiontime: 15
//	};
//	CHue.setLight( 0, state, function() {
//		CHue.setLight( 1, state, function() {
//			CHue.setLight( 2, state, function() {
//			});
//		});
//	});
//}
//
//function hueU()
//{
//	var state = {
//		on: true,
//		bri: parseInt( 255 * 0.30),
//		hue: parseInt( 65535 * 250/360),
//		sat: parseInt( 255 * 1),
//		transitiontime: 15
//	};
//	CHue.setLight( 0, state, function() {
//		CHue.setLight( 1, state, function() {
//			CHue.setLight( 2, state, function() {
//			});
//		});
//	});
//}

//----------------------------
// eof
