var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name : 'background',


		priority : 80,

		iconClasses : 'genericon genericon-gallery',

		selectors : [ '.boldgrid-section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Background',
			height : '500px',
			width : '300px',
			scrollTarget : '.presets',
			sizeOffset : -170,
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},


		setup : function () {
			self._setupBackgroundClick();
		},

		_setupBackgroundClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.selection', function () {
				var $this = $( this ),
					$target = BG.Menu.getTarget( self ),
					imageSrc = $this.css('background-image');
				
				panel.clearSelected();
				$this.addClass( 'selected' );
				panel.$element.find( '.current-selection' ).css( 'background-image', imageSrc );
				
				if ( 'image' == $this.data('type') ) {
					$target.css( {
						'background' : imageSrc,
						'background-size' : 'cover',
					} );
				} else {
					$target.css( {
						'background' : imageSrc,
					} );
				}
			} );
		},

		openPanel : function () {
			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-background' );

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template( {
				images : BoldgridEditor.sample_backgrounds
			} ) );

			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );