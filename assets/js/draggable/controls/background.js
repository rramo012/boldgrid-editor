var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Background = {

		name : 'background',
		
		tooltip : 'Section Background',

		uploadFrame : null,

		priority : 10,

		iconClasses : 'genericon genericon-picture',

		selectors : [ '.boldgrid-section' ],

		availableEffects : [
			'background-parallax',
			'background-fixed'
		],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Section Background',
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
					self.setImageBackground( attachment.url );
					self.setImageSelection( 'image' );
				} );

				// Finally, open the modal on click.
				self.uploadFrame.open();
			},
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},

		setup : function () {
			self._setupBackgroundClick();
			self._setupFilterClick();
			self._setupCustomizeLeave();
			self._setupBackgroundSize();
			self._setupBackgroundColor();
			self._setupGradientColor();
			self._setupOverlayColor();
			self._setupOverlayReset();
			self._setupScrollEffects();
			self._setupGradientDirection();
			self._setupCustomization();
		},

		_setupBackgroundColor : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.background-design [name="section-background-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					value = $this.val(),
					type = $this.data('type');

				$target.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') );
				BG.Controls.addStyle( $target, 'background-color', '' );

				if ( 'class' == type ) {
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					BG.Controls.addStyle( $target, 'background-color', value );
				}
			} );

		},
		
		_setupOverlayReset : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'click', '.background-design .overlay-color .default-color', function ( e ) {
				e.preventDefault();
				
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ];
				
				$this.closest('.color-controls').find('label').css( 'background-color', 'rgba(255,255,255,.5)' );
				
				$target.removeAttr( 'data-bg-overlaycolor' );
				self.updateBackgroundImage();
			} );
		},

		_setupOverlayColor : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design [name="overlay-color"]', function () {
				var $this = $( this ),
					type = $this.data('type'),
					value = $this.val(),
					$target = BG.Menu.$element.targetData[ self.name ];
				
				if ( 'class' == type ) {
					value = BoldgridEditor.colors[ value - 1 ];
				}

				$target.attr( 'data-bg-overlaycolor', self.getOverlayImage( value ) );

				self.updateBackgroundImage();
			} );
		},
		
		updateBackgroundImage : function () {
			var $target = BG.Menu.$element.targetData[ self.name ],
				overlay = $target.attr( 'data-bg-overlaycolor'),
				image = $target.attr( 'data-image-url' );
			
			if ( overlay && image ) {
				BG.Controls.addStyle( $target, 'background-image' , overlay  + ', url("'+ image + '")' );
			} else if ( image ) {
				BG.Controls.addStyle( $target, 'background-image' , 'url("'+ image + '")' );
			}
		},
		
		getOverlayImage : function ( color ) {
			return 'linear-gradient(to left, ' + color + ', ' + color + ')';
		},
		
		_setupGradientColor : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design [name^="gradient-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					value = $this.val(),
					name = $this.attr('name'),
					type = $this.attr('data-type');
				
				if ( 'class' == type ) {
					value = BoldgridEditor.colors[ value - 1 ];
				}
				
				if ( 'gradient-color-1' === name ) {
					$target.attr( 'data-bg-color-1', value );
				} else {
					$target.attr( 'data-bg-color-2', value );
				}
				
				BG.Controls.addStyle( $target, 'background-image', self.createGradientCss( $target ) );
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
			var panel = BG.Panel;

			panel.$element.on( 'change', '.background-design input[name="scroll-effects"]', function ( e ) {
				var $this = $( this ),
					$target = BG.Menu.getTarget( self );

				if ( 'none' == $this.val() ) {
					$target.removeClass( self.availableEffects.join(' ') );
				} else {
					$target.removeClass( self.availableEffects.join(' ') );
					$target.addClass( $this.val() );
				}
			} );
		},
		_setupGradientDirection : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design input[name="bg-direction"]', function ( e ) {
				var $this = $( this ),
				$target = BG.Menu.getTarget( self );
				
				$target.attr('data-bg-direction', $this.val() );
				BG.Controls.addStyle( $target, 'background-image', self.createGradientCss( $target ) );
			} );
		},
		
		
		createGradientCss : function ( $element ) {
			return 'linear-gradient(' + $element.attr('data-bg-direction') + ',' +
				$element.attr('data-bg-color-1') + ',' + $element.attr('data-bg-color-2') + ')';
		},
		
		_setupBackgroundSize : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.background-design input[name="background-size"]', function ( e ) {
				var $this = $( this ),
				$target = BG.Menu.getTarget( self );

				if ( 'tiled' == $this.val() ) {
					BG.Controls.addStyle( $target, 'background-size', 'auto auto' );
					BG.Controls.addStyle( $target, 'background-repeat', 'repeat' );
				} else if ( 'cover' == $this.val() ) {
					BG.Controls.addStyle( $target, 'background-size', 'cover' );
					BG.Controls.addStyle( $target, 'background-repeat', 'no-repeat' );
				}

			} );
		},

		_setupCustomizeLeave : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .back .panel-button', function ( e ) {
				e.preventDefault();

				panel.$element.find('.preset-wrapper').show();
				panel.$element.find('.background-design .customize').hide();
				self.preselectBackground();
				panel.scrollToSelected();
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
					imageUrl = $this.attr('data-image-url'),
					imageSrc = $this.css('background-image'),
					background = $this.css('background');

				// Remove all color classes.
				$target.removeClass( BOLDGRID.EDITOR.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );

				if ( $this.hasClass( 'selected') ) {
					BG.Controls.addStyle( $target, 'background', '' );
					$target.removeAttr('data-image-url');
					$this.removeClass( 'selected' );
					self.preselectBackground( true );

					return;
				}
				
				panel.$element.find( '.presets .selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
				
				// Reset Gradient attributes.
				$target.removeAttr('data-bg-color-1')
					.removeAttr('data-image-url')
					.removeAttr('data-bg-color-2')
					.removeAttr('data-bg-direction');

				if ( 'image' == $this.data('type') ) {
					self.setImageBackground( imageUrl );
				} else if ( 'color' == $this.data('type') ) {
					$target.addClass( $this.data('class') );
					BG.Controls.addStyle( $target, 'background-image', '' );
				} else if ( 'pattern' == $this.data('type') ) {
					BG.Controls.addStyle( $target, 'background-size', 'auto auto' );
					BG.Controls.addStyle( $target, 'background-repeat', 'repeat' );
					BG.Controls.addStyle( $target, 'background-image', imageSrc );
				} else if ( 'gradients' == $this.data('type') ) {
					BG.Controls.addStyle( $target, 'background-image', imageSrc );
					$target.attr('data-bg-color-1', $this.data('color1') )
						.attr('data-bg-color-2', $this.data('color2') )
						.attr('data-bg-direction', $this.data('direction') );
				} else {
					BG.Controls.addStyle( $target, 'background-image', imageSrc );
				}

				self.setImageSelection( $this.data('type'), background );
			} );
		},
		
		activateFilter : function ( type ) {
			var filterFound = false;

			BG.Panel.$element.find( '.current-selection .filter').each( function () {
				var $this = $( this ),
					filterTypes = $this.data( 'type' );
				
				if ( type && -1 !== filterTypes.indexOf( type ) ) {
					$this.click();
					filterFound = true;
					return false;
				}
				
			} );

			if ( false === filterFound ) {
				BG.Panel.$element.find( '.filter[data-default="1"]' ).click();
			}
		},

		setImageSelection : function ( type, prop ) {
			var $currentSelection = BG.Panel.$element.find( '.current-selection' ),
				$target = BG.Menu.getTarget( self );
			
			$currentSelection.css( 'background', '' );

			if ( 'color' == type ) {
				$currentSelection.css( 'background', prop );
			} else {
				$currentSelection.css( 'background-image', $target.css( 'background-image' ) );
			}

			$currentSelection.attr( 'data-type', type );
		},

		setImageBackground : function ( url ) {
			var $target = BG.Menu.getTarget( self );

			$target.attr( 'data-image-url', url );

			BG.Controls.addStyle( $target, 'background',  '' );
			self.updateBackgroundImage();
			BG.Controls.addStyle( $target, 'background-size', 'cover' );
			
		},

		_initSliders : function () {

			self._initVerticleSlider();
			//self._initOpacitySlider();

		},

		_initVerticleSlider : function () {
			var $target = BG.Menu.getTarget( self ),
				defaultPos = $target.css( 'background-position-y' );
			 
			defaultPos = defaultPos ? parseInt( defaultPos ) : 0;
			
			BG.Panel.$element.find( '.background-design .vertical-position .slider' ).slider( {
				min : 0,
				max : 100,
				value : defaultPos,
				range : 'max',
				slide : function( event, ui ) {
					if ( $target.css('background-image' ) ) {
						BG.Controls.addStyle( $target, 'background-position', '0% ' + ui.value + '%' );
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
			self._initSliders();
			self.selectDefaults();
			BG.Panel.hideFooter();
			BG.Panel.$element.trigger( 'bg-open-customization' );
		},
		
		selectDefaults : function () {
			self.setScrollEffect();
			self.setSize();
			self.setDefaultDirection();
			self.setDefaultBackgroundColors();
		},
		
		setSize : function () {
			var $input = BG.Panel.$element.find( 'input[name="background-size"]' ),
				$target = BG.Menu.getTarget( self );
			
			if ( -1 === $target.css('background-size').indexOf('cover') ) {
				$input.filter('[value="tiled"]').prop( 'checked', true );
			}
		},
		
		setScrollEffect : function () {
			var $target = BG.Menu.getTarget( self );

			$.each( self.availableEffects, function () {
				if ( $target.hasClass( this ) ) {
					BG.Panel.$element.find( 'input[name="scroll-effects"][value="' + this + '"]' )
						.prop( 'checked', true );
					return false;
				} 
			} );
		},
		
		setDefaultDirection : function () {
			var $target = BG.Menu.getTarget( self ),
				direction = $target.attr('data-bg-direction');

			if ( self.backgroundIsGradient( $target.css( 'background-image' ) ) && direction ) {
				BG.Panel.$element
					.find('input[name="bg-direction"][value="' + direction + '"]')
					.prop( 'checked', true );
			} 
		},
		
		setDefaultBackgroundColors : function () {
			var bgColor,
				$target = BG.Menu.getTarget( self );

			if ( self.backgroundIsGradient( $target.css( 'background-image' ) ) ) {
				BG.Panel.$element.find('input[name="gradient-color-1"]').attr( 'value', $target.attr('data-bg-color-1') );
				BG.Panel.$element.find('input[name="gradient-color-2"]').attr( 'value', $target.attr('data-bg-color-2') );
			} else {
				bgColor = BG.CONTROLS.Color.findAncestorColor( $target, 'background-color' );
				BG.Panel.$element.find('input[name="section-background-color"]').attr( 'value', bgColor );
			}
		},

		randomGradientDirection : function () {
			var directions = [
				'to left',
				'to bottom',
			];
			
			return directions [Math.floor( Math.random() * directions.length ) ];
		},
		
		// Randomize gradients.
		// Deprecated
		_renderGradients : function () {


			var gradientData = []; 
			$.each( BoldgridEditor.sample_backgrounds.default_gradients, function () {
				var	color1 = this.colors[0],
					color2 = this.colors[1],
					direction = self.randomGradientDirection();
				
				gradientData.push( {
					color1 : color1,
					color2 : color2,
					direction : direction,
					css : 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')'
				} );
			} );
			
			console.log( JSON.stringify( gradientData ) );
		},

		setPaletteGradients : function () {
			var combos = [];
			if ( BoldgridEditor.colors && BoldgridEditor.colors.length ) {
				$.each( [0,1], function () {
					var color1, color2, direction;
					color1 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					color2 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					if ( color1 != color2 ) {
						direction = self.randomGradientDirection();
						combos.push( {
							color1 : color1, 
							color2 : color2, 
							direction : direction, 
							css : 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')' 
						} );
					}
				} );
			}

			$.each( combos, function () {
				BoldgridEditor.sample_backgrounds.gradients.unshift( this );
			} );
		},
		
		backgroundIsGradient : function ( backgroundUrl ) {
			return backgroundUrl.indexOf( 'linear-gradient' ) !== -1 && -1 === backgroundUrl.indexOf('url');
		},
		
		preselectBackground : function ( keepFilter ) {
			var type = 'color',
				$target = BG.Menu.getTarget( self ),
				classes = $target.attr( 'class' ), 
				backgroundColor = $target.css( 'background-color' ), 
				backgroundUrl = $target.css( 'background-image' ),
				$currentSelection = BG.Panel.$element.find( '.current-selection' ),
				hasGradient = self.backgroundIsGradient( backgroundUrl ),
				matchFound = false;
			
			//@TODO: update the preview screen when pressing back from the customize section. 
			
			// Set the background color, and background image of the current section to the preview.
			self.setImageSelection( 'image' );
			$currentSelection.css( 'background-color', backgroundColor );

			BG.Panel.$element.find( '.selection' ).each( function () {
				var $this = $( this ),
					selectionType = $this.data('type'),
					dataClass = $this.data('class');
				
				switch ( selectionType ) {
					case 'color' :
						if ( dataClass && $target.hasClass( dataClass ) ) {
							$this.addClass( 'selected' );
							type = selectionType;
							matchFound = true;
							self.activateFilter( type );
							return false;
						}
						break;
					case 'image' :
						if ( $this.attr('data-image-url') == $target.attr('data-image-url') ) {
							//Found a match.
							$this.addClass( 'selected' );
							type = selectionType;
							matchFound = true;
							self.activateFilter( type );
							return false;
						}
						break;
					case 'gradients' :
					case 'pattern' :
						if ( $this.css( 'background-image' ) == backgroundUrl ) {
							//Found a match.
							$this.addClass( 'selected' );
							type = selectionType;
							matchFound = true;
							self.activateFilter( type );
							return false;
						}
						break;
				}
			} );
			
			if ( ! matchFound ) {
				if ( ! keepFilter ) {
					self.activateFilter();
				}
				
				if ( hasGradient ) {
					type = 'gradients';
				} else if ( backgroundUrl != 'none' ) {
					type = 'image';
				}
			}
			
			$currentSelection.attr( 'data-type', type );
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
				imageData : BoldgridEditor.builder_config.background_images,
			} ) );

			self.preselectBackground();
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );