var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name : 'background',

		priority : 10,

		iconClasses : 'genericon genericon-gallery',

		selectors : [ '.boldgrid-section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		onMenuClick : function ( e ) {

		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );