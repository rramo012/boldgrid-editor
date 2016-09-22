var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Generic = {
			
		defaultCustomize : wp.template( 'boldgrid-editor-default-customize' ),
			
		
		createCustomizeSection : function () {
			BG.Panel.$element.find( '.choices' ).append( self.defaultCustomize() );
		},
		
		/**
		 * Init Controls.
		 * 
		 * @since 1.2.7
		 */
		initControls : function () {
			
			var customizeOptions = BG.Panel.currentControl.panel.customizeSupport || [],
				customizeSupportOptions = BG.Panel.currentControl.panel.customizeSupportOptions || false;
			
			// Add customize section if it does not exist.
			if ( customizeOptions.length && ! BG.Panel.$element.find( '.panel-body .customize' ).length ) {
				self.createCustomizeSection();
			}
			
			$.each( customizeOptions, function () {
				var addOptions = {};
				
				if ( customizeSupportOptions && customizeSupportOptions[ this ] ) {
					addOptions = customizeSupportOptions[ this ];
				}
				
				self[ this ].render( addOptions );
				self[ this ].bind( addOptions );
			} );
		},
		
		/**
		 * Setup Customization.
		 * 
		 * @since 1.2.7
		 */
		setupInputCustomization : function () {
			BG.Panel.$element.on( 'change', '.class-control input', function () {
				var $this = $( this ),
					name = $this.attr('name'),
					$el = BG.Menu.getCurrentTarget(),
					controlClassnames = [],
					$siblingInputs = $this.closest('.class-control').find('input[name="' + name + '"]');
				
				// Find other values.
				$siblingInputs.each( function () {
					controlClassnames.push( $( this ).attr('value') );
				} );
				
				$el.removeClass( controlClassnames.join(' ') );
				$el.addClass( $this.val() );
			} );
		},
		
		/**
		 * Setup Init.
		 * 
		 * @since 1.2.7
		 */
		setupInputInitialization : function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'bg-customize-open', function () {
				var $el = BG.Menu.getCurrentTarget();

				panel.$element.find( '.class-control input[default]' ).prop( 'checked', true );

				panel.$element.find( '.class-control input' ).each( function () {
					var $this = $( this );
					if ( $el.hasClass( $this.attr('value') ) ) {
						$this.prop( 'checked', true );
					}
				} );
			} );
		},
		
		/**
		 * Generic Margin Control.
		 * 
		 * @since 1.2.7
		 */
		margin : {
			template : wp.template('boldgrid-editor-margin'),
			
			render : function () {
				BG.Panel.$element.find('.panel-body .customize').find( '.section.margin-control' ).remove();
				BG.Panel.$element.find('.panel-body .customize').append( this.template() );
			},
			
			bind : function ( options ) {
				if ( ! options ) {
					options = {};
				}
				
				var minVert = options.vertMin || 0,
					minHor = options.horMin || -15,
					$target = BG.Menu.getCurrentTarget(),
					defaultMarginVert = $target.css( 'margin-top' ),
					defaultMarginHor = $target.css( 'margin-left' );
		
				defaultMarginVert = defaultMarginVert  ? parseInt( defaultMarginVert ) : 0;
				defaultMarginHor = defaultMarginHor ? parseInt( defaultMarginHor ) : 0;
			
				BG.Panel.$element.find( '.panel-body .customize .margin .slider' ).slider( {
					min : minHor,
					max : 50,
					value : defaultMarginHor,
					range : 'max',
					slide : function( event, ui ) {
						$target = BG.Menu.getCurrentTarget();
						
						BG.Controls.addStyle( $target, 'margin-left', ui.value );
						BG.Controls.addStyle( $target, 'margin-right', ui.value );
					},
				} ).siblings( '.value' ).html( defaultMarginHor );
	
				BG.Panel.$element.find( '.panel-body .customize .margin-top .slider' ).slider( {
					min : minVert,
					max : 200,
					value : defaultMarginVert,
					range : 'max',
					slide : function( event, ui ) {
						$target = BG.Menu.getCurrentTarget();
						
						BG.Controls.addStyle( $target, 'margin-top', ui.value );
						BG.Controls.addStyle( $target, 'margin-bottom', ui.value );
					},
				} ).siblings( '.value' ).html( defaultMarginVert );
			}
		},
	
		/**
		 * Generic rotate control.
		 * 
		 * @since 1.2.7
		 */
		rotate  : {
			classes : [
			    'fa-rotate-90',
			    'fa-rotate-180',
			    'fa-rotate-270',
			],
			getDefault : function () {
				var $el = BG.Menu.getCurrentTarget(),
					value = 0;
				
				if ( $el.hasClass('fa-rotate-90') ) {
					value = 90;
				} else if ( $el.hasClass('fa-rotate-180') ) {
					value = 180;
				} else if ( $el.hasClass('fa-rotate-270') ) {
					value = 270;
				}
				
				return value;
			},
			template : wp.template('boldgrid-editor-rotate'),
			render : function () {
				BG.Panel.$element.find('.panel-body .customize').find( '.section.rotate-control' ).remove();
				BG.Panel.$element.find('.panel-body .customize').append( this.template() );
			},
			bind : function () {
				var defaultSize = this.getDefault(),
					$el = BG.Menu.getCurrentTarget();
				
				BG.Panel.$element.find( '.section.rotate-control .value' ).html( defaultSize );
				BG.Panel.$element.find( '.section.rotate-control .slider' ).slider( {
					min : 0,
					step: 90,
					max : 270,
					value : defaultSize,
					range : 'max',
					slide : function( event, ui ) {
						//Remove Classes
						$el.removeClass( self.rotate.classes.join(' ') );
						if ( ui.value ) {
							$el.addClass( 'fa-rotate-' + ui.value );
						}
					},
				} );
			}
		},
		
		/**
		 * Insert Link Control.
		 * 
		 * @since 1.2.7
		 */
		insertLink  : {
			template : wp.template('boldgrid-editor-insert-link'),
			render : function () {
				BG.Panel.$element.find('.panel-body .customize').find( '.section.insert-link' ).remove();
				BG.Panel.$element.find('.panel-body .customize').append( this.template() );
			},
			bind : function () {
				
				BG.Panel.$element.find( '.section.insert-link' ).on( 'click', function () {
					var $el = BG.Menu.getTarget( BG.Panel.currentControl );

					tinymce.activeEditor.selection.select( $el[0] );
					tinymce.activeEditor.execCommand( 'WP_Link' );
				} );
			}
		},
		
		/**
		 * Generic Font Size control.
		 * 
		 * @since 1.2.7
		 */
		fontSize  : {
			template : wp.template('boldgrid-editor-font-size'),
			render : function () {
				BG.Panel.$element.find('.panel-body .customize').find( '.section.size' ).remove();
				BG.Panel.$element.find('.panel-body .customize').append( this.template() );
			},
			bind : function () {
				var $el = BG.Menu.getTarget( BG.Panel.currentControl ),
					elementSize = $el.css( 'font-size' ),
					defaultSize = elementSize ?  parseInt( elementSize ) : 14;
				
				defaultSize = ( defaultSize >= 5 ) ? defaultSize : 14;
	
				BG.Panel.$element.find( '.section.size .value' ).html( defaultSize );
				BG.Panel.$element.find( '.section.size .slider' ).slider( {
					min : 5,
					max : 115,
					value : defaultSize,
					range : 'max',
					slide : function( event, ui ) {
						BG.Panel.$element.find( '.section.size .value' ).html( ui.value );
						BG.Controls.addStyle( $el, 'font-size', ui.value );
					},
				} );
			}
		},
		
		/**
		 * Generic Font Color control.
		 * 
		 * @since 1.2.7
		 */
		fontColor  : {
			
			bound : false,
			
			template : wp.template('boldgrid-editor-font-color'),
			
			render : function () {
				var $target = BG.Menu.getTarget( BG.Panel.currentControl );
				
				BG.Panel.$element.find('.panel-body .customize').find( '.section.font-color' ).remove();
				BG.Panel.$element.find('.panel-body .customize').append( this.template() );
				
				BG.Panel.$element.on( 'bg-customize-open', function () {
					BG.Panel.$element.find('.panel-body .customize')
						.find( '.section.font-color label' ).css( 'background-color', $target.css('color') );
				} );
			},
			
			bind : function () {
				var panel = BG.Panel;
				
				if ( this.bound ) {
					return false;
				}

				panel.$element.on( 'change', '.section [name="font-color"]', function () {
					var $this = $( this ),
						$target = BG.Menu.getTarget( BG.Panel.currentControl ),
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
				
				this.bound = true;
			}
		}

	};

	self = BOLDGRID.EDITOR.CONTROLS.Generic;

} )( jQuery );