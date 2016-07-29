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
			self._setupFilterClick();
		},
		
		_setupFilterClick : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .filter', function ( e ) {
				e.preventDefault();
				
				var $this = $( this ),
					type = $this.data('type'),
					label = $this.data('label');
				
				
				panel.$element.find('.filter').removeClass('selected');
				$this.addClass( 'selected' );
				
				panel.$element.find('.presets .selection').hide();
				$.each( type, function () {
					panel.$element.find('.presets .selection[data-type="' + this + '"]').show();
				} );
				
				panel.$element.find( '.presets .title > *' ).text( label );
			} );
		},

		_setupBackgroundClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .selection', function () {
				var $this = $( this ),
					$target = BG.Menu.getTarget( self ),
					imageSrc = $this.css('background-image');
				
				panel.$element.find( '.presets .selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
				panel.$element.find( '.current-selection' )
					.css( 'background-image', imageSrc )
					.attr( 'data-type', $this.data('type') );
				
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

			panel.$element.find( '.filter[data-default="1"]' ).click();
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );