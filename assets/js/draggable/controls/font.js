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

		priority : 10,

		iconClasses : 'fa fa-text-width',

		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section' ],

		templateMarkup : null,
		
		fontClasses : [
		    'bg-font-family-alt',
		    'bg-font-family-body',
		    'bg-font-family-heading',
		    'bg-font-family-menu',
	    ],

		textEffectClasses : [
			{ name : 'mod-text-effect inset-text' },
			{ name : 'mod-text-effect shadows' },
		//	{ name : 'mod-text-effect simple-shadow' },
		//	{ name : 'mod-text-effect gradient' },
			{ name : 'mod-text-effect glow' },
			{ name : 'mod-text-effect closeheavy' },
			{ name : 'mod-text-effect enjoy-css' },
			{ name : 'mod-text-effect retro' },
			{ name : 'mod-text-effect stroke' },
		//	{ name : 'mod-text-effect elegantshadow' },
		//	{ name : 'mod-text-effect deepshadow' },
		//	{ name : 'mod-text-effect neon-text' },
		//	{ name : 'mod-text-effect anaglyph' },
		//	{ name : 'mod-text-effect board-game' },
		//	{ name : 'mod-text-effect long-shadow' },
		///	{ name : 'mod-text-effect rainbow' },
		//	{ name : 'mod-text-effect neon' },
		],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Text Setting',
			height : '450px',
			width : '268px',
		},

		setup : function () {
			self._setupEffectClick();
			self._setupFamilyColor();
			
			self.templateMarkup = wp.template( 'boldgrid-editor-font' )( {
				'textEffectClasses' : self.textEffectClasses,
				'fonts' : BoldgridEditor.builder_config.fonts,
				'themeFonts' : BoldgridEditor.builder_config.theme_fonts,
				'myFonts' : [ ]
			} );
			
			BG.FontRender.updateFontLink( BG.Controls.$container );
		},

		_setupFamilyColor : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.section.family [name="font-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					value = $this.attr( 'value' ),
					type = $this.attr('data-type');
				
				$target.removeClass( BG.CONTROLS.Color.colorClasses.join(' ') );
				BG.Controls.addStyle( $target, 'color', '' );
				
				if ( 'class' == type ) {
					$target.addClass( BG.CONTROLS.Color.getColorClass( 'color', value ) );
				} else {
					BG.Controls.addStyle( $target, 'color', value );
				}
			} );

		},

		_setupEffectClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.section.effects .panel-selection', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ];

				$.each( self.textEffectClasses, function () {
					$target.removeClass( this.name );
				} );

				$target.addClass( $this.data( 'preset' ) );
				$this.siblings().removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},

		_initSizeSlider : function ( $container, $el ) {

			var elementSize = $el.css( 'font-size' ),
				defaultSize = elementSize ?  parseInt( elementSize ) : 14,
				defaultSize = ( defaultSize >= 5 ) ? defaultSize : 14;

			$container.find( '.section.size .value' ).html( defaultSize );
			$container.find( '.section.size .slider' ).slider( {
				min : 5,
				max : 115,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					$container.find( '.section.size .value' ).html( ui.value );
					BG.Controls.addStyle( $el, 'font-size', ui.value );
					IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height();
				},
			} );
		},
		charSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'letter-spacing' ),
				defaultSize = 0.2;

			BG.Panel.$element.find( '.section.spacing .character .value' ).html( defaultSize );
			BG.Panel.$element.find( '.section.spacing .character .slider' ).slider( {
				step: 0.1,
				min : -0.1,
				max : 2,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Controls.addStyle( $el, 'letter-spacing', ui.value );
				},
			} );
		},

		lineSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'line-height' ),
				defaultSize = 1;

			BG.Panel.$element.find( '.section.spacing .line .value' ).html( defaultSize);
			BG.Panel.$element.find( '.section.spacing .line .slider' ).slider( {
				step: 0.1,
				min : 0.5,
				max : 3,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Controls.addStyle( $el, 'line-height', ui.value );
				},
			} );
		},

		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},
		
		_initTextColor : function ( $target ) {
			var textColor = '#333';
			 BG.Panel.$element.find('[name="font-color"]')
			 	.data('type', 'color')
			 	.val( textColor );
		},
		
		_initFamilyDropdown : function () {
			var renderItem,
				panel = BG.Panel,
				$select, $ul;
			
		    $.widget( "custom.fontfamilyselect", $.ui.selectmenu, {
		        _renderItem: function( ul, item ) {
			    	ul.addClass( 'selectize-dropdown-content' );
			    	
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
			    	
			    	ul.find('[data-type="theme"]:first').before( '<h3 class="seperator">Theme Fonts</h3>' );
			    	ul.find('[data-type="custom"]:first').before( '<h3 class="seperator">Custom Fonts</h3>' );
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
		
		getFamilySelection : function () {
			return BG.Panel.$element.find('.section.family .ui-selectmenu-button' );
		},
		
		preselectFamily : function () {
			var fontClass,
				defaultFamily = 'Abel',
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
		
		setTextColorInput : function () {
			var color, 
				$target = BG.Menu.getTarget( self );
		
			color = BG.CONTROLS.Color.findAncestorColor( $target, 'color' );

			BG.Panel.$element
				.find('input[name="font-color"]')
				.attr( 'value', color );
		},
		
		selectPresets : function () {
			self.setTextColorInput();
		},

		openPanel : function () {
			var panel = BG.Panel,
				$target = BG.Menu.getTarget( self );

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( self.templateMarkup );
			
			self._initSizeSlider( panel.$element, $target );
			self.charSpacingSlider( $target );
			self.lineSpacingSlider( $target );
			self._initTextColor( $target );
			self._initFamilyDropdown();
			self.selectPresets();
			
			// Open Panel.
			panel.open( self );
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;

} )( jQuery );