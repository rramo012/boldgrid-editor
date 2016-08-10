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

		menuDropDown : [
			{
				'name' : 'Add Button',
				'class' : 'font-awesome add-button'
			},
			{
				'name' : 'Add Icon',
				'class' : 'font-awesome add-icon'
			},
			{
				'name' : 'Add GridBlock',
				'class' : 'add-gridblock'
			},
			{
				'name' : 'Add Empty Row',
				'class' : 'add-row'
			}
		],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		onMenuClick : function ( e ) {
			$(this).toggleClass('active');
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Add.init();
	self = BOLDGRID.EDITOR.CONTROLS.Add;

} )( jQuery );