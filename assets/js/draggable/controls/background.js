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

		priority : 80,

		iconClasses : 'genericon genericon-picture',

		selectors : [ '.boldgrid-section' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Background',
			height : '500px',
			width : '300px',
			scrollTarget : '.presets',
			scrollOffset : 130,
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

				$target.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') );
				BG.Controls.addStyle( $target, 'background-color', '' );

				if ( 'class' == type ) {
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					BG.Controls.addStyle( $target, 'background-color', value );
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
					imageUrl = $this.data('image-url'),
					imageSrc = $this.css('background-image'),
					background = $this.css('background');

				// Remove all color classes.
				$target.removeClass( BOLDGRID.EDITOR.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );

				if ( $this.hasClass( 'selected') ) {
					BG.Controls.addStyle( $target, 'background', '' );
					$this.removeClass( 'selected' );
					return;
				}
				
				panel.$element.find( '.presets .selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
				self.setImageSelection( imageSrc, $this.data('type'), background );

				if ( 'image' == $this.data('type') ) {
					self.setImageBackground( imageUrl );
				} else if ( 'color' == $this.data('type') ) {
					$target.addClass( $this.data('class') );
					BG.Controls.addStyle( $target, 'background-image', '' );
				} else if ( 'pattern' == $this.data('type') ) {
					BG.Controls.addStyle( $target, 'background-size', 'auto auto' );
					BG.Controls.addStyle( $target, 'background-repeat', 'repeat' );
					BG.Controls.addStyle( $target, 'background-image', imageSrc );
				} else {
					BG.Controls.addStyle( $target, 'background-image', imageSrc );
				}
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

			BG.Controls.addStyle( $target, 'background',  'url(' + url + ')' );
			BG.Controls.addStyle( $target, 'background-size', 'cover' );
			
			$target.data( 'image-url', url );
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
			BG.Panel.hideFooter();
		},

		// Randomize gradients.
		// Deprecated
		_renderGradients : function () {
			var directions = [
				'to left',
				'to right',
				'to bottom',
				'to top',
			];
			
			BG.Panel.$element.find( '.selection[data-type="gradients"]' ).each( function () {
				var $this = $( this ),
					color1 = $this.data('color-1'),
					color2 = $this.data('color-2'),
					direction = directions[Math.floor(Math.random()*directions.length)];

				BG.Controls.addStyle( $this, 'background-image', 'linear-gradient(' + direction + ',' + color1 + ',' + color2 + ')' );
			} );
		},

		setPaletteGradients : function () {
			var combos = [];
			if ( BoldgridEditor.colors && BoldgridEditor.colors.length ) {
				$.each( [0,1], function () {
					var color1, color2;
					color1 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					color2 = BoldgridEditor.colors[Math.floor(Math.random()* BoldgridEditor.colors.length)];
					if ( color1 != color2 ) {
						combos.push( 'linear-gradient(to right,' + color1 + ',' + color2 + ')' );
					}
				} );
			}

			$.each( combos, function () {
				BoldgridEditor.sample_backgrounds.gradients.unshift( this );
			} );
		},
		
		preselectBackground : function () {
			var type = 'color',
				$target = BG.Menu.getTarget( self ),
				classes = $target.attr( 'class' ), 
				backgroundColor = $target.css( 'background-color' ), 
				backgroundUrl = $target.css( 'background-image' ),
				$currentSelection = BG.Panel.$element.find( '.current-selection' ),
				hasGradient = backgroundUrl.indexOf( 'linear-gradient' ) != '-1',
				matchFound = false;
			
			//@TODO: update the preview screen when pressing back from the customize section. 
			
			// Set the background color, and background image of the current section to the preview.
			$currentSelection.css( { 
				'background-image' : backgroundUrl,
				'background-color' : backgroundColor
			} );

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
					case 'gradients' :
					case 'image' :
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
				self.activateFilter();
				
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
			} ) );

			self.preselectBackground();
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Background.init();
	self = BOLDGRID.EDITOR.CONTROLS.Background;

} )( jQuery );