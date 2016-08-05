var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name : 'background',

		uploadFrame : null,

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
				event.preventDefault();
				// If the media frame already exists, reopen it.
				if ( self.uploadFrame ) {
					self.uploadFrame.open();
					return;
				}

				// Create a new media frame.
				self.uploadFrame = wp.media({
					title: 'Select Background Image',
					button: {
						text: 'Use this media'
					},
					 // Set to true to allow multiple files to be selected.
					multiple: false
				} );

				// When an image is selected in the media frame.
				self.uploadFrame.on( 'select', function() {

					// Get media attachment details from the frame state.
					var attachment = self.uploadFrame.state().get('selection').first().toJSON();

					// Set As current selection and apply to background.
					self.setImageSelection( 'url(' + attachment.url + ')', 'image' );
					self.setImageBackground( attachment.url );
				} );

				// Finally, open the modal on click.
				self.uploadFrame.open();
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
			self._setupBackgroundColor();
			self._setupScrollEffects();
			self._setupCustomization();
		},

		_setupBackgroundColor : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.background-design [name="section-background-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					value = $this.val(),
					type = $this.data('type');

				$target.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') ).css( 'background-color', '' );

				if ( 'class' == type ) {
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					$target.css( 'background-color', value );
				}
			} );

		},

		_setupCustomization : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.current-selection .settings .panel-button', function ( e ) {
				e.preventDefault();
				self.openCustomization();
			} );
		},

		_setupScrollEffects : function () {
			var panel = BG.Panel,
				availableEffects = [
				    'background-zoom',
				    'background-parallax',
				    'background-fixed',
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
					imageSrc = $this.css('background-image'),
					background = $this.css('background');

				panel.$element.find( '.presets .selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
				self.setImageSelection( imageSrc, $this.data('type'), background );

				// Remove all color classes.
				$target.removeClass( BOLDGRID.EDITOR.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );

				if ( 'image' == $this.data('type') ) {
					self.setImageBackground( imageUrl );
				} else if ( 'color' == $this.data('type') ) {
					$target.addClass( $this.data('class') );
					$target.css( 'background-image', '' );
				} else if ( 'pattern' == $this.data('type') ) {
					$target.css( 'background-size', 'auto auto' );
					$target.css( 'background-repeat', 'repeat' );
					$target.css( 'background-image', imageSrc );
				} else {
					$target.css( {
						'background-image' : imageSrc,
					} );
				}
			} );
		},

		setImageSelection : function ( imageSrc, type, prop ) {
			var $currentSelection = BG.Panel.$element.find( '.current-selection' );
			$currentSelection.css( 'background', '' );

			if ( 'color' == type ) {
				$currentSelection.css( 'background', prop );
			} else {
				$currentSelection.css( 'background-image', imageSrc )
			}

			$currentSelection.attr( 'data-type', type );
		},

		setImageBackground : function ( url ) {
			var $target = BG.Menu.getTarget( self );

			$target.css( {
				'background' : 'url(' + url + ')',
				'background-size' : 'cover'
			} );

			$target.data( 'image-url', url );
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

		openCustomization : function () {
			BG.Panel.$element.find('.preset-wrapper').hide();
			BG.Panel.$element.find('.background-design .customize').show();
			BG.Panel.$element.find('.preset-wrapper').attr('data-type', BG.Panel.$element.find('.current-selection').attr('data-type') );
			BG.Panel.hideFooter();
		},

		_renderGradients : function () {
			var directions = [
				'to left',
				'to bottom',
				'to right',
				'to top',
			];

			BG.Panel.$element.find( '.selection[data-type="gradients"]' ).each( function () {
				var $this = $( this ),
					color1 = $this.data('color-1'),
					color2 = $this.data('color-2'),
					direction = directions[Math.floor(Math.random()*directions.length)];

				$this.css( 'background-image', 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')' );
			} );
		},

		setPaletteGradients : function () {
			var combos = [];
			if ( BoldgridEditor.colors && BoldgridEditor.colors.length ) {
				$.each( [0,1,2,3,4,5], function () {
					var combo = {}, color1, color2;
					combo.colors = [];
					color1 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					color2 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					if ( color1 != color2 ) {
						combo.colors.push( color1 );
						combo.colors.push( color2 );
						combos.push( combo );
					}
				} );
			}

			$.each( combos, function () {
				BoldgridEditor.sample_backgrounds.gradients.unshift( this );
			} );
		},

		openPanel : function () {
			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-background' );

			BoldgridEditor.sample_backgrounds.color = BG.CONTROLS.Color.getPaletteBackgroundColors();

			// Remove all content from the panel.
			panel.clear();

			self.setPaletteGradients();
			panel.$element.find('.panel-body').html( template( {
				images : BoldgridEditor.sample_backgrounds,
			} ) );

			self._renderGradients();
			self._initSliders();

			panel.$element.find( '.filter[data-default="1"]' ).click();

			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );