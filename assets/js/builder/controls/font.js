var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;
	
	BOLDGRID.EDITOR.CONTROLS.Font = {

		name : 'font',
		
		tooltip : 'Font',

		priority : 30,

		iconClasses : 'fa fa-text-width',

		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section, ul, ol, dl' ],

		// Ignore images clicked in paragraphs.
		exceptionSelector : 'img, .draggable-tools-imhwpb *',

		templateMarkup : null,
		
		fontClasses : [
		    'bg-font-family-alt',
		    'bg-font-family-body',
		    'bg-font-family-heading',
		    'bg-font-family-menu',
	    ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Text Setting',
			height : '450px',
			width : '268px',
		},

		/**
		 * Constructor.
		 * 
		 * @since 1.2.7
		 */
		setup : function () {
			self._setupEffectClick();
			BG.CONTROLS.Generic.fontColor.bind();
			
			self.templateMarkup = wp.template( 'boldgrid-editor-font' )( {
				'textEffectClasses' : BoldgridEditor.builder_config.textEffectClasses,
				'fonts' : BoldgridEditor.builder_config.fonts,
				'themeFonts' : self.getThemeFonts(),
				'myFonts' : BoldgridEditor.builder_config.components_used.font
			} );
			
			self.bindFontCollpase();

			BG.FontRender.updateFontLink( BG.Controls.$container );
		},
		
		/**
		 * When scrolling on window with font family open, collapse font family.
		 * 
		 * @since 1.3
		 */
		bindFontCollpase : function () {
			var hideFamilySelect = _.debounce( function () {
				var $fontFamily = $('.font-family-dropdown');
				if ( $fontFamily.hasClass('ui-selectmenu-open') ) {
					$fontFamily.removeClass('ui-selectmenu-open');
				}
			}, 50 );
			
			$( window ).on( 'scroll', hideFamilySelect );
		},

		/**
		 * Get the fonts used by the theme.
		 * 
		 * @since 1.2.7
		 */
		getThemeFonts : function () {
			var themeFonts = [];
			
			if ( -1 !== BoldgridEditor.builder_config.theme_features.indexOf('theme-fonts-classes')  ) {
				themeFonts = BoldgridEditor.builder_config.theme_fonts;
			}
			
			return themeFonts;
		},

		/**
		 * Add font effect when clicking on a panel selection.
		 * 
		 * @since 1.2.7
		 */
		_setupEffectClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.section.effects .panel-selection', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ];

				$.each( BoldgridEditor.builder_config.textEffectClasses, function () {
					$target.removeClass( this.name );
				} );

				$target.addClass( $this.data( 'preset' ) );
				$this.siblings().removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},


		/**
		 * Open panel when clicking on menu item.
		 * 
		 * @since 1.2.7
		 */
		onMenuClick : function () {
			self.openPanel();
		},

		/**
		 * Setup Character spacing slider.
		 * 
		 * @since 1.2.7
		 * @param jQuery $el
		 */
		charSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'letter-spacing' ),
				defaultSize = elementSize ? parseInt( elementSize ) : 0;

			BG.Panel.$element.find( '.section.spacing .character .value' ).html( defaultSize );
			BG.Panel.$element.find( '.section.spacing .character .slider' ).slider( {
				step: 0.1,
				min : -0.3,
				max : 5,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Controls.addStyle( $el, 'letter-spacing', ui.value );
				},
			} );
		},

		/**
		 * Setup line spacing slider.
		 * 
		 * @since 1.2.7
		 * @param jQuery $el
		 */
		lineSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'line-height' ),
				defaultSize = BG.Util.convertPxToEm( elementSize, $el.css( 'line-height' ) );

			BG.Panel.$element.find( '.section.spacing .line .value' ).html( defaultSize);
			BG.Panel.$element.find( '.section.spacing .line .slider' ).slider( {
				step: 0.1,
				min : 0.5,
				max : 3,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Controls.addStyle( $el, 'line-height', ui.value + 'em'  );
				},
			} );
		},

		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 * 
		 * @since 1.2.7
		 */
		elementClick : function( e ) {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
				
				if ( BG.Panel.$element.find('label[for="font-color"]').is(':visible') ) {
					e.boldgridRefreshPanel = true;
					BG.CONTROLS.Color.$currentInput = BG.Panel.$element.find('input[name="font-color"]');
				}
			}
		},

		/**
		 * Set the value of the current font color.
		 * 
		 * @since 1.2.7
		 * @param jQuery $target
		 */
		_initTextColor : function ( $target ) {
			var textColor = '#333';
			BG.Panel.$element.find('[name="font-color"]')
				.data('type', 'color')
				.val( textColor );
			
			// Don't display font color for buttons.
			self._hideButtonColor();
		},
		
		/**
		 * If the user is controlling the font of a button, don't display color.
		 * 
		 * @since 1.2.8
		 */
		_hideButtonColor : function () {
			var $clone,
				buttonQuery = '> .btn, > .button-primary, > .button-secondary, > a',
				$colorPreview = BG.Panel.$element.find('.color-preview'),
				$target = BG.Menu.getTarget( self );

			$clone = $target.clone();
			$clone.find( buttonQuery ).remove();

			// If removing all buttons, results in an empty string or white space.
			if ( ! $clone.text().replace(/ /g,'').length && $target.find( buttonQuery ).length ) {

				// Hide color control.
				$colorPreview.hide();
			}
		},

		/**
		 * Set font family dropdown.
		 * 
		 * @since 1.2.7
		 * @param jQuery $target
		 */
		_initFamilyDropdown : function () {
			var renderItem,
				panel = BG.Panel,
				$select, $ul;
			
		    $.widget( "custom.fontfamilyselect", $.ui.selectmenu, {
		        _renderItem: function( ul, item ) {
			    	return $( '<li>' )
			    	    .data( 'ui-autocomplete-item', item )
			    	    .attr( 'data-value', item.label )
			    	    .attr( 'data-type', item.element.data('type') )
			    	    .attr( 'data-index', item.element.data('index') )
			    	    .append( item.label )
			    	    .appendTo( ul );
		        },
			    _renderMenu : function ( ul, items ) {
			    	var self = this;
			    	$.each( items, function( index, item ) {
			    		self._renderItemData( ul, item );
			    	} );
			    	ul.parent().addClass('font-family-dropdown');
			    	ul.addClass( 'selectize-dropdown-content' );
			    	ul.find('[data-type="theme"]:first').before( '<h3 class="seperator">Theme Fonts</h3>' );
			    	ul.find('[data-type="custom"]:first').before( '<h3 class="seperator">My Fonts</h3>' );
			    	ul.find('[data-type="all"]:first').before( '<h3 class="seperator">All Fonts</h3>' );
			    	
			    	setTimeout( function () {
			    		ul.find('.seperator').removeClass('ui-menu-item');
			    	} );
				}
		    } );
		
			panel.$element.find( '.selectize-dropdown-content select' ).fontfamilyselect( {
		    	select: function( event, data ) {
		    		var $target = BG.Menu.getTarget( self );

		    		$select.attr( 'data-value', data.item.label );

		    		// Reset.
		    		$target.removeAttr( 'data-font-family' )
		    			.removeAttr( 'data-font-class' );
		    		
		    		$target.removeClass( self.fontClasses.join(' ') );

		    		if ( "Default" === data.item.label ) {
		    			BG.Controls.addStyle( $target, 'font-family', '' );
		    			return;
		    		}

		    		if ( 'theme' == data.item.element.data( 'type' ) ) {
		    			$target.addClass( data.item.element.data( 'index' ) );
		    			$target.attr( 'data-font-class', data.item.element.data( 'index' ) );
		    			BG.Controls.addStyle( $target, 'font-family', '' );
		    		} else {
		    			$target.attr( 'data-font-family', data.item.label );
		    			BG.Controls.addStyle( $target, 'font-family', data.item.label );
		    		}
		    		
					BG.FontRender.updateFontLink( BG.Controls.$container );
		        }
		    } );
		    	
			$select = self.getFamilySelection();
			
			self.preselectFamily();
		},
		
		/**
		 * Get the current font family selection.
		 * 
		 * @since 1.2.7
		 */
		getFamilySelection : function () {
			return BG.Panel.$element.find('.section.family .ui-selectmenu-button' );
		},
		
		/**
		 * Preselect the font family.
		 * 
		 * @since 1.2.7
		 */
		preselectFamily : function () {
			var fontClass,
				defaultFamily = 'Default',
				$select = self.getFamilySelection(),
				$target = BG.Menu.getTarget( self );
			
			if ( $target.is( '.' + self.fontClasses.join(',.') ) ) {
				fontClass = $target.attr('data-font-class');
				defaultFamily = BG.Panel.$element
					.find('.section.family [data-index="' + fontClass + '"]')
					.data('value');
				
			} else if ( $target.attr('data-font-family') ) {
				defaultFamily = $target.attr('data-font-family');
			}

	    	$select.attr( 'data-value', defaultFamily );
		},

		/**
		 * Preset the text color input.
		 * 
		 * @since 1.2.7
		 */
		setTextColorInput : function () {
			var color, 
				$target = BG.Menu.getTarget( self );
		
			color = BG.CONTROLS.Color.findAncestorColor( $target, 'color' );

			BG.Panel.$element
				.find('input[name="font-color"]')
				.attr( 'value', color );
		},

		/**
		 * Preset the text effect control.
		 * 
		 * @since 1.2.7
		 */
		setTextEffect : function () {
			var $target = BG.Menu.getTarget( self ),
				$section = BG.Panel.$element.find('.panel-body .section.effects'),
				classes = BG.Util.getClassesLike( $target, 'bg-text-fx' );
			
			$section.find('.panel-selection.selected').removeClass('selected');
			
			if ( classes.length ) {
				$section.find('.panel-selection')
				.find( '.'  + classes.join('.') )
				.closest( '.panel-selection' )
				.addClass('selected');
			} else {
				$section.find('.none-selected').addClass('selected');
			}
		},

		/**
		 * Preset controls.
		 * 
		 * @since 1.2.7
		 */
		selectPresets : function () {
			self.setTextColorInput();
			self.setTextEffect();
		},

		/**
		 * Open all panels.
		 * 
		 * @since 1.2.7
		 */
		openPanel : function () {
			var panel = BG.Panel,
				$target = BG.Menu.getTarget( self );

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( self.templateMarkup );
			
			self.charSpacingSlider( $target );
			self.lineSpacingSlider( $target );
			self._initTextColor( $target );
			self._initFamilyDropdown();
			self.selectPresets();
			
			// Open Panel.
			panel.open( self );
			panel.scrollTo(0);
			
			BG.CONTROLS.Generic.fontSize.bind();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;

} )( jQuery );