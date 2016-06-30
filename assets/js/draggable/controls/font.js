var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Font = {

		name : 'font',

		priority : 10,

		iconClasses : 'fa fa-text-width',

		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		onMenuClick : function ( e ) {

		}

	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;

} )( jQuery );