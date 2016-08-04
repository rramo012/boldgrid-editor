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
			includeFooter : true,
			customizeCallback : function () {
				BG.Panel.$element.find('.preset-wrapper').hide();
				BG.Panel.$element.find('.background-design .customize').show();
				BG.Panel.hideFooter();
			},
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},

		setup : function () {
			self._setupBackgroundClick();
			self._setupFilterClick();
			self._setupCustomizeLeave();
			self._setupBackgroundSize();
			self._setupScrollEffects();
		},
		
		_setupScrollEffects : function () {
			var panel = BG.Panel,
				availableEffects = [
				    'background-zoom',
				    'background-parallax',
				];
			
			panel.$element.on( 'change', '.background-design input[name="scroll-effects"]', function ( e ) {
				var $this = $( this ),
					$target = BG.Menu.getTarget( self );
				
				if ( 'none' == $this.val() ) {
					$target.removeClass( availableEffects.join(' ') );
				} else {
					$target.removeClass( availableEffects.join(' ') );
					$target.addClass( $this.val() );
				}
			} );
		},
		_setupBackgroundSize : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design input[name="background-size"]', function ( e ) {
				var $this = $( this ),
				$target = BG.Menu.getTarget( self );
				
				if ( 'tiled' == $this.val() ) {
					$target.css( 'background-size', 'auto auto' );
					$target.css( 'background-repeat', 'repeat' );
				} else if ( 'cover' == $this.val() ) {
					$target.css( 'background-size', 'cover' );
					$target.css( 'background-repeat', 'no-repeat' );
				}
				
			} );
		},
		
		_setupCustomizeLeave : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'click', '.background-design .back .panel-button', function ( e ) {
				e.preventDefault();
				
				panel.$element.find('.preset-wrapper').show();
				panel.$element.find('.background-design .customize').hide();
				panel.showFooter();
			} );
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
					imageUrl = $this.data('image-url'),
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
					
					$target.data( 'image-url', imageUrl );
					
				} else {
					$target.css( {
						'background' : imageSrc,
					} );
				}
			} );
		},
		
		_initSliders : function () {

			self._initVerticleSlider();
			//self._initOpacitySlider();

		},
		
		_initVerticleSlider : function () {
			
			var defaultPos = 50;
			
			BG.Panel.$element.find( '.background-design .vertical-position .slider' ).slider( {
				min : 0,
				max : 100,
				value : defaultPos,
				range : 'max',
				slide : function( event, ui ) {
					var $this = $( this ),
						$target = BG.Menu.getTarget( self );
					if ( $target.css('background-image' ) ) {
						console.log('here');
						$target.css( 'background-position', '50% ' + ui.value + '%' );
					}
				},
			} ).siblings( '.value' ).html( defaultPos );
		},
		
		_initOpacitySlider : function () {
			var defaultPos = 100;

			BG.Panel.$element.find( '.background-design .image-opacity .slider' ).slider( {
				min : 0,
				max : 100,
				value : defaultPos,
				range : 'max',
				slide : function( event, ui ) {
					
					
				},
			} ).siblings( '.value' ).html( defaultPos );
		},

		openPanel : function () {
			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-background' );

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template( {
				images : BoldgridEditor.sample_backgrounds
			} ) );
			
			self._initSliders();

			panel.$element.find( '.filter[data-default="1"]' ).click();
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );