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
			height : '600px',
			width : '300px',
			scrollTarget : '.presets',
			sizeOffset : -230,
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		/**
		 * When the user clicks Add Image open the media library.
		 * 
		 * @since 1.2.7
		 */
		_setupAddImage : function () {

			BG.Panel.$element.on( 'click', '.background-design .add-image-controls', function () {
				// If the media frame already exists, reopen it.
				if ( self.uploadFrame ) {
					self.uploadFrame.open();
					return;
				}
	
				// Create a new media frame.
				self.uploadFrame = wp.media({
					title: 'Select Background Image',
					library : { type : 'image' },
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
			} );
		},
		
		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 * 
		 * @since 1.2.7
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},

		/**
		 * Setup Init.
		 * 
		 * @since 1.2.7
		 */
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
			self._setupAddImage();
		},

		/**
		 * Bind Event: Change background section color.
		 * 
		 * @since 1.2.7
		 */
		_setupBackgroundColor : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.background-design [name="section-background-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					value = $this.val(),
					type = $this.attr('data-type'),
					$currentSelection = BG.Panel.$element.find('.current-selection'),
					selectionType = $currentSelection.attr('data-type');

				$target.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') );
				$target.removeClass( BG.CONTROLS.Color.textContrastClasses.join( ' ' ) );
				BG.Controls.addStyle( $target, 'background-color', '' );
				
				// If currently selected is a gradient
				if ( selectionType != 'pattern' ) {
					BG.Controls.addStyle( $target, 'background-image', '' );
					$target.removeAttr('data-bg-color-1');
					$target.removeAttr('data-bg-color-2');
					$target.removeAttr('data-bg-direction');
				}
				if ( selectionType != 'pattern' ) {
					BG.Panel.$element.find('.presets .selected').removeClass('selected');
				}

				if ( 'class' == type ) {
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'text-default', value ) );

				} else {
					BG.Controls.addStyle( $target, 'background-color', value );
				}
				
				self.setImageSelection( selectionType, $target.css('background') );
			} );

		},
		
		/**
		 * Bind Event: Set the default color for overlay.
		 * 
		 * @since 1.2.7
		 */
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

		/**
		 * Bind Event: Change overlay color.
		 * 
		 * @since 1.2.7
		 */
		_setupOverlayColor : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design [name="overlay-color"]', function () {
				var $this = $( this ),
					type = $this.attr('data-type'),
					value = $this.val(),
					$target = BG.Menu.$element.targetData[ self.name ];
				
				if ( 'class' == type ) {
					value = BoldgridEditor.colors[ value - 1 ];
				}

				$target.attr( 'data-bg-overlaycolor', value );

				self.updateBackgroundImage();
			} );
		},
		
		/**
		 * Update background image on page.
		 * 
		 * @since 1.2.7
		 */
		updateBackgroundImage : function () {
			var $target = BG.Menu.$element.targetData[ self.name ],
				overlay = $target.attr( 'data-bg-overlaycolor'),
				image = $target.attr( 'data-image-url' );
			
			if ( overlay && image ) {
				BG.Controls.addStyle( $target, 'background-image' , self.getOverlayImage( overlay ) + ', url("'+ image + '")' );
			} else if ( image ) {
				BG.Controls.addStyle( $target, 'background-image' , 'url("'+ image + '")' );
			}
		},
		
		/**
		 * Create gradient overlay string.
		 * 
		 * @since 1.2.7
		 * @param string color.
		 * @return string color.
		 */
		getOverlayImage : function ( color ) {
			return 'linear-gradient(to left, ' + color + ', ' + color + ')';
		},
		
		/**
		 * Bind Event: Changing Gradient Color.
		 * 
		 * @since 1.2.7
		 */
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

		/**
		 * Bind Event: Clicking Settings.
		 * 
		 * @since 1.2.7
		 */
		_setupCustomization : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.current-selection .settings .panel-button', function ( e ) {
				e.preventDefault();
				self.openCustomization();
			} );
		},

		/**
		 * Bind Event: Input scroll effect changing.
		 * 
		 * @since 1.2.7
		 */
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
		
		/**
		 * Bind Event: Input gradient direction changing.
		 * 
		 * @since 1.2.7
		 */
		_setupGradientDirection : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.background-design input[name="bg-direction"]', function ( e ) {
				var $this = $( this ),
				$target = BG.Menu.getTarget( self );
				
				$target.attr('data-bg-direction', $this.val() );
				BG.Controls.addStyle( $target, 'background-image', self.createGradientCss( $target ) );
			} );
		},
		
		/**
		 * Create the css needed for a linear gradient.
		 * 
		 * @since 1.2.7
		 * @param jQuery $element.
		 */
		createGradientCss : function ( $element ) {
			return 'linear-gradient(' + $element.attr('data-bg-direction') + ',' +
				$element.attr('data-bg-color-1') + ',' + $element.attr('data-bg-color-2') + ')';
		},
		
		/**
		 * Setup background size control.
		 * 
		 * @since 1.2.7
		 */
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
					BG.Controls.addStyle( $target, 'background-repeat', '' );
				}

			} );
		},

		/**
		 * Bind Event: When the user leaves customization.
		 * 
		 * @since 1.2.7
		 */
		_setupCustomizeLeave : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .back .panel-button', function ( e ) {
				e.preventDefault();

				panel.$element.find('.preset-wrapper').show();
				panel.$element.find('.background-design .customize').hide();
				self.preselectBackground();
				panel.scrollToSelected();
			} );
		},

		/**
		 * Bind Event: When the user clicks on a filter.
		 * 
		 * @since 1.2.7
		 */
		_setupFilterClick : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .filter', function ( e ) {
				e.preventDefault();

				var $this = $( this ),
					type = $this.data('type'),
					label = $this.data('label'),
					$currentSelection = panel.$element.find('.current-selection'),
					$presetsBackgroundColor = panel.$element.find('.presets .background-color.section');

				panel.$element.find('.filter').removeClass('selected');
				$this.addClass( 'selected' );

				panel.$element.find('.presets .selection').hide();
				$.each( type, function () {
					panel.$element.find('.presets .selection[data-type="' + this + '"]').show();
				} );

				panel.$element.find( '.presets .title > *' ).text( label );
				panel.$element.find('.presets').attr( 'data-filter', type );
				$currentSelection.attr( 'data-filter', type );
				
				if ( type.length && -1 !== type.indexOf('image') ) {
					$presetsBackgroundColor.hide();
				} else {
					$presetsBackgroundColor.show();
				}
				
				panel.scrollToSelected();
			} );
		},
		
		/**
		 * Remove all color classes.
		 * 
		 * @since 1.2.7
		 * @param jQuery $target.
		 */
		removeColorClasses : function ( $target ) {
			$target.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );
			$target.removeClass( BG.CONTROLS.Color.textContrastClasses.join( ' ' ) );
		},

		/**
		 * Bind Event: When the user clicks on a design.
		 * 
		 * @since 1.2.7
		 */
		_setupBackgroundClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.background-design .selection', function () {
				var $this = $( this ),
					$target = BG.Menu.getTarget( self ),
					imageUrl = $this.attr('data-image-url'),
					imageSrc = $this.css('background-image'),
					background = $this.css('background');

				if ( $this.hasClass( 'selected') ) {
					self.removeColorClasses( $target );
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
				
				if ( 'pattern' !== $this.data('type') ) {
					self.removeColorClasses( $target );
				}

				if ( 'image' == $this.data('type') ) {
					self.setImageBackground( imageUrl );
				} else if ( 'color' == $this.data('type') ) {
					$target.addClass( $this.data('class') );
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'text-default', $this.data('class').replace(/\D/g,'') ) );
					BG.Controls.addStyle( $target, 'background-image', '' );
					self.setDefaultBackgroundColors();
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

		/**
		 * Activate a filter.
		 * 
		 * @since 1.2.7
		 * @param string type.
		 */
		activateFilter : function ( type ) {
			var backgroundImageProp,
				filterFound = false,
				$target = BG.Menu.getTarget( self );

			BG.Panel.$element.find( '.current-selection .filter').each( function () {
				var $this = $( this ),
					filterTypes = $this.data( 'type' );
				
				if ( type && -1 !== filterTypes.indexOf( type ) ) {
					$this.click();
					filterFound = true;
					return false;
				}
				
			} );
			
			if ( ! filterFound && ! type ) {
				backgroundImageProp = $target.css('background-image');
				if ( backgroundImageProp && 'none' !== backgroundImageProp ) {
					// Image filter selection hack, trouble selecting array data type.
					BG.Panel.$element.find( '.filter[data-type]:first-of-type' ).click();
					filterFound = true;
				}
			}
			
			if ( false === filterFound ) {
				BG.Panel.$element.find( '.filter[data-default="1"]' ).click();
			}
		},

		/**
		 * Set Image selection.
		 * 
		 * @since 1.2.7
		 * @param string type.
		 * @param string prop.
		 */
		setImageSelection : function ( type, prop ) {
			var $currentSelection = BG.Panel.$element.find( '.current-selection' ),
				$target = BG.Menu.getTarget( self );
			
			$currentSelection.css( 'background', '' );

			if ( 'color' == type ) {
				$currentSelection.css( 'background-color', prop );
			} else {
				$currentSelection.css( 'background-color', $target.css('background-color') );
				// $target[0].style['background-image'] used instead of jQuery.css because of comaptbility issue with FF. 
				$currentSelection.css( 'background-image', $target[0].style['background-image'] );
			}

			$currentSelection.attr( 'data-type', type );
		},

		/**
		 * Set Image background.
		 * 
		 * @since 1.2.7
		 * @param string url.
		 */
		setImageBackground : function ( url ) {
			var $target = BG.Menu.getTarget( self );

			$target.attr( 'data-image-url', url );

			BG.Controls.addStyle( $target, 'background',  '' );
			self.updateBackgroundImage();
			BG.Controls.addStyle( $target, 'background-size', 'cover' );
		},

		/**
		 * Init all sliders.
		 * 
		 * @since 1.2.7
		 */
		_initSliders : function () {
			self._initVerticleSlider();
		},
		
		/**
		 * Init Vertical position slider.
		 * 
		 * @since 1.2.7
		 */
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

		/**
		 * Open the customization view.
		 * 
		 * @since 1.2.7
		 */
		openCustomization : function () {
			BG.Panel.$element.find('.preset-wrapper').hide();
			BG.Panel.$element.find('.background-design .customize').show();
			BG.Panel.$element.find('.preset-wrapper').attr('data-type', BG.Panel.$element.find('.current-selection').attr('data-type') );
			self._initSliders();
			self.selectDefaults();
			BG.Panel.$element.trigger( 'bg-open-customization' );
		},
		
		/**
		 * Set all defaults.
		 * 
		 * @since 1.2.7
		 */
		selectDefaults : function () {
			self.setScrollEffect();
			self.setSize();
			self.setDefaultDirection();
			self.setDefaultBackgroundColors();
			self.setDefaultOverlayColor();
		},
		
		/**
		 * Set default overlay color.
		 * 
		 * @since 1.2.7
		 */
		setDefaultOverlayColor : function () {
			var $target = BG.Menu.getTarget( self ),
				$overlayColorSection = BG.Panel.$element.find('.overlay-color'),
				overlayColor = $target.attr( 'data-bg-overlaycolor' );
			
			if ( overlayColor ) {
				$overlayColorSection.find('input').attr( 'value', overlayColor );
			}
			
		},
		
		/**
		 * Set default background size.
		 * 
		 * @since 1.2.7
		 */
		setSize : function () {
			var $input = BG.Panel.$element.find( 'input[name="background-size"]' ),
				$target = BG.Menu.getTarget( self );
			
			if ( -1 === $target.css('background-size').indexOf('cover') ) {
				$input.filter('[value="tiled"]').prop( 'checked', true );
			}
		},
		
		/**
		 * Set default scroll direction.
		 * 
		 * @since 1.2.7
		 */
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
		
		/**
		 * Set graadient direction.
		 * 
		 * @since 1.2.7
		 */
		setDefaultDirection : function () {
			var $target = BG.Menu.getTarget( self ),
				direction = $target.attr('data-bg-direction');

			if ( self.backgroundIsGradient( $target.css( 'background-image' ) ) && direction ) {
				BG.Panel.$element
					.find('input[name="bg-direction"][value="' + direction + '"]')
					.prop( 'checked', true );
			} 
		},
		
		/**
		 * Set default background colors.
		 * 
		 * @since 1.2.7
		 */
		setDefaultBackgroundColors : function () {
			var bgColor, $bgControlColor,
				$target = BG.Menu.getTarget( self );

			if ( self.backgroundIsGradient( $target.css( 'background-image' ) ) ) {
				BG.Panel.$element.find('input[name="gradient-color-1"]').attr( 'value', $target.attr('data-bg-color-1') );
				BG.Panel.$element.find('input[name="gradient-color-2"]').attr( 'value', $target.attr('data-bg-color-2') );
			} else {
				bgColor = BG.CONTROLS.Color.findAncestorColor( $target, 'background-color' );
				$bgControlColor = BG.Panel.$element.find('input[name="section-background-color"]');
				$bgControlColor.prev('label').css('background-color', bgColor);
				$bgControlColor.attr( 'value', bgColor );
			}
		},

		/**
		 * Get a random gradient direction.
		 * 
		 * @since 1.2.7
		 * @return string.
		 */
		randomGradientDirection : function () {
			var directions = [
				'to left',
				'to bottom',
			];
			
			return directions[ Math.floor( Math.random() * directions.length ) ];
		},

		/**
		 * Create JSON of gradients. Not used at runtime.
		 * 
		 * @since 1.2.7
		 */
		_createGradients : function () {
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

		/**
		 * Create gradients based on the users palettes.
		 * 
		 * @since 1.2.7
		 */
		setPaletteGradients : function () {
			var combos = [];
			if ( BoldgridEditor.colors && BoldgridEditor.colors.length ) {
				$.each( [ 0, 1 ], function () {
					var color1, color2, direction;
					color1 = BoldgridEditor.colors[ Math.floor( Math.random() * BoldgridEditor.colors.length ) ];
					color2 = BoldgridEditor.colors[ Math.floor( Math.random() * BoldgridEditor.colors.length ) ];
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

		/**
		 * Is the given url a gradient.
		 * 
		 * @since 1.2.7
		 * @param string backgroundUrl.
		 * @return boolean.
		 */
		backgroundIsGradient : function ( backgroundUrl ) {
			return backgroundUrl.indexOf( 'linear-gradient' ) !== -1 && -1 === backgroundUrl.indexOf('url');
		},
		
		/**
		 * Preselect the background being used when opening the panel.
		 * 
		 * @since 1.2.7
		 */
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
						if ( dataClass && $target.hasClass( dataClass ) && 'none' === $target.css( 'background-image' ) ) {
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
				if ( hasGradient ) {
					type = 'gradients';
				} else if ( backgroundUrl != 'none' ) {
					type = 'image';
				}
				
				if ( ! keepFilter ) {
					self.activateFilter( type );
				}
			}
			
			$currentSelection.attr( 'data-type', type );
		},

		/**
		 * Open Panel.
		 * 
		 * @since 1.2.7
		 */
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
			self.setDefaultBackgroundColors();

			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );