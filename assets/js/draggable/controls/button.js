var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Button = {

		name : 'button',

		priority : 2,
		
		tooltip : 'Button Design',

		iconClasses : 'fa fa-cog',

		selectors : [ '.boldgrid-button', 'a.button', 'a.button-secondary', 'a.button-primary' ],
		
		classes : [
			{ name : 'boldgrid-button boldgrid-button-rounded boldgrid-button-flat' },
			{ name : 'boldgrid-button boldgrid-button-pill boldgrid-button-flat' },
			{ name : 'boldgrid-button boldgrid-button-flat' },
			{ name : 'boldgrid-button glow' },
			{ name : 'boldgrid-button boldgrid-button-rounded' },
			{ name : 'boldgrid-button boldgrid-button-3d' },
			{ name : 'boldgrid-button boldgrid-button-border' },
			{ name : 'boldgrid-button boldgrid-button-pill' },
			{ name : 'boldgrid-button boldgrid-button-circle' },
			{ name : 'boldgrid-button boldgrid-button-circle boldgrid-button-flat' },
		],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		panel : {
			title : 'Button Design',
			height : '400px',
			width : '350px',
		},
		
		setup : function () {
			self._setupPanelClick();
		},

		_setupPanelClick : function() {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'click', '.button-design .panel-selection', function () {
				var $this = $( this ),
					preset = $this.data( 'preset' ),
					$target = BOLDGRID.EDITOR.Menu.getTarget( self );
				
				panel.clearSelected();
				$this.addClass( 'selected' );
				
				// Aply changes to editor.
				$target.attr( 'class', '' );
				$target.addClass( preset );
			} );
		},
		
		
		onMenuClick : function ( e ) {
			self.openPanel();
		},
		openPanel : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				template = wp.template( 'boldgrid-editor-button' );
			
			// Remove all content from the panel.
			panel.clear();
			
			// Set markup for panel.
			panel.$element.find( '.panel-body' ).html( template( {
				'text' : 'for sale',
				'presets' : self.classes,
			} ) );
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Button.init();
	self = BOLDGRID.EDITOR.CONTROLS.Button;

} )( jQuery );