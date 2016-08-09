var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Add = {

		name : 'add',
		
		tooltip : 'Add Element',

		priority : 1,

		iconClasses : 'genericon genericon-plus',

		selectors : [ '*' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},


	};

	BOLDGRID.EDITOR.CONTROLS.Add.init();
	self = BOLDGRID.EDITOR.CONTROLS.Add;

} )( jQuery );