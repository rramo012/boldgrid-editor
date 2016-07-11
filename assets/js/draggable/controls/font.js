var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Font = {

		name : 'font',

		priority : 10,

		iconClasses : 'fa fa-text-width',

		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Text Setting',
			height : '450px',
			width : '268px',
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		initSlider : function ( $container ) {
			$container.find( '.slider' ).slider( {
				min : 8,
				max : 44,
				value : 8,
				range : 'max',
				slide : function( event, ui ) {
					$container.find( '.section.size .value' ).html( ui.value );
				}
			} );
		},
		
		openPanel : function () {
			var panel = BG.Panel,
				colorControls = BG.CONTROLS.Color.create(),
				template = wp.template( 'boldgrid-editor-font' );

			// Remove all content from the panel.
			panel.clear();
			
			panel.$element.find('.panel-body').html( template() );

			self.initSlider( panel.$element );
			
			// Open Panel.
			panel.open( self );
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;

} )( jQuery );