var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function() {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Help = {

		name: 'help',

		tooltip: 'BoldGrid Editor Guide',

		priority: 99,

		iconClasses: 'fa fa-question',

		selectors: [ 'html' ],

		init: function() {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		onMenuClick: function() {
			window.open('https://www.boldgrid.com/support/editing-your-pages/wordpress-page-post-editor/?source=boldgrid-editor_drop-tab', '_blank');
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Help.init();
	self = BOLDGRID.EDITOR.CONTROLS.Help;

} )();
