BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function() {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Global = {

		$element: null,

		name: 'global-options',

		tooltip: 'Global Options',

		priority: 95,

		iconClasses: 'fa fa-globe',

		selectors: [ 'html' ],

		menuDropDown: {
			title: 'Global Options',
			options: [
				{
					'name': 'Color Palette',
					'class': 'action open-color-palette font-awesome fa-paint-brush'
				},
				{
					'name': 'Delete All Content',
					'class': 'action delete-all-content font-awesome fa-trash'
				}
			]
		},

		init: function() {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		/**
		 * Setup.
		 *
		 * @since 1.2.7
		 */
		setup: function() {

			/*	BG.Menu.$element.find( '.bg-editor-menu-dropdown' )
					.on( 'click', '.action.add-gridblock', self.addGridblock )
					.on( 'click', '.action.add-row', self.addSection );*/
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Global.init();
	self = BOLDGRID.EDITOR.CONTROLS.Global;

} )( jQuery );
