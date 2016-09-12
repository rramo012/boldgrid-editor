var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Color = {

		$currentInput : null,

		$colorPanel : null,

		$colorPicker : null,
		
		colorTemplate : wp.template( 'boldgrid-editor-color' ),
		
		transparentColors : [
		    'rgba(0, 0, 0, 0)',
		    'transparent'
		],

		colorClasses : [
			'color1-color',
			'color2-color',
			'color3-color',
			'color4-color',
			'color5-color'
		],
		backgroundColorClasses : [
			'color1-background-color',
			'color2-background-color',
			'color3-background-color',
			'color4-background-color',
			'color5-background-color',
		],
		
		borderColorClasses : [
          'color1-border-color',
          'color2-border-color',
          'color3-border-color',
          'color4-border-color',
          'color5-border-color',
        ],

		customColors : BoldgridEditor.saved_colors,

		init : function () {
			self._create();
			self._setupClosePicker();
			self._renderColorOptions();
			self._setupPanelDrag();
			self._setupAddNew();
			self._setupColorPicker();
			self._setupCallback();
			self._setupColorPreview();
			self._setupRemove();
			self._setupAutoHide();
			self._setupResetDefault();
			self._addPanelClasses();

			self._setupOpenCustomization();

			return self;
		},
		
		_addPanelClasses : function () {
			if ( ! BoldgridEditor.is_boldgrid_theme ) {
				self.$colorPanel.addClass('non-bg-theme');
			}
		},
		
		_setupResetDefault : function () {
			self.$colorPanel.on( 'click', '.default-reset', function ( e ) {
				e.preventDefault();
				self.$currentInput.attr('data-type', 'color');
				self.$currentInput.val('').change();
				self.$colorPanel.find('.selected').removeClass( 'selected' );
				self.$currentInput.parent().find('label').css( 'background-color', '#333' );
			} );
		},
		
		_setupOpenCustomization : function () {
			
			BG.Panel.$element.on( 'bg-open-customization', function () {
				self.initColorControls();
			} );
		},

		_setupAutoHide : function () {
			$( 'body' ).on( 'click', function () {
				self.closePicker();
			} );

			self.$colorPanel.on( 'click', function ( e ) {
				e.stopPropagation();
			} );
		},

		getColorClass : function ( type, index ) {
			return 'color' + index + '-' + type;
		},

		openPicker : function ( $input ) {
			self.$colorPanel.show();
			self.$currentInput = $input;
			tinymce.activeEditor.undoManager.add();
		},

		closePicker : function () {
			if ( self.$colorPanel.is(':visible') ) {
				tinymce.activeEditor.undoManager.add();
				self.$colorPanel.hide();
				self.$currentInput = null;
				self.saveCustomColors();
			}
		},
		
		saveCustomColors : function () {
			$('#post input[name="boldgrid-custom-colors"]').val( JSON.stringify( self.customColors ) );
		}, 

		_setupColorPreview : function () {
			BG.Panel.$element.on( 'click', '.color-preview', function ( e ) {
				e.stopPropagation();

				var $currentSelection,
					$preview = $( this ),
					$input = BG.Panel.$element.find('input[name="' + $preview.attr('for') + '"]');

				if ( 'color' == $input.attr('data-type') || ! $input.attr('data-type') ) {
					// Select Color From My Colors.
					self.$colorPanel.find('[data-type="custom"].panel-selection').each( function () {
						var $this = $( this );
						if ( $preview.css( 'background-color' ) == $this.css( 'background-color' ) ) {
							$currentSelection = $this;
							return false;
						}
					} );

				} else if ( 'class' == $input.attr('data-type') ) {
					$currentSelection = self.$colorPanel.find('.panel-selection[data-preset="' + $input.val() + '"]');
				}

				self.$colorPanel.find('.panel-selection.selected').removeClass('selected');
				self.$colorPicker.iris( 'color', $preview.css( 'background-color' ) );
				self.openPicker( $input );

				if ( $currentSelection && $currentSelection.length ) {
					self.selectColor( $currentSelection );
				}

			} );
			BG.Panel.$element.on( 'change', 'input.color-control', function () {
				var $this = $( this ),
					$preview = BG.Panel.$element.find('.color-preview[for="' + $this.attr('name') + '"]');

				$preview.css( 'background-color', self.$colorPicker.iris('color') );
			} );
		},

		_setupClosePicker : function () {
			self.$colorPanel.find('.panel-title .close-icon').on( 'click', function () {
				self.closePicker();
			} );
		},

		_setupPanelDrag : function () {
			this.$colorPanel.draggable( {
				containment: '#wpwrap',
				handle: '.panel-title',
				scroll : false
			} );
		},

		findAncestorColor : function ( $element, property ) {
			var color, elements = [];

			elements.push( $element );
			
			$element.parents().each( function () {
				elements.push( this );
			} );
			
			$.each( elements, function () {
				var $this = $( this ),
					thisColor = $this.css( property );

				if ( false === self.isColorTransparent( thisColor ) ) {
					color = thisColor;
					return false;
				}
			} );
			
			return color;
		},
		
		getPaletteBackgroundColors : function () {
			var backgroundColors = {};

			$.each( BoldgridEditor.colors, function ( index ) {
				backgroundColors[ 'color' + ( index + 1 ) + '-' + 'background-color' ] = this;
			} );

			return backgroundColors;
		},
		
		isColorTransparent : function ( color ) {
			return BG.CONTROLS.Color.transparentColors.indexOf( color ) !== -1 || ! color;
		},
		
		initColorControls : function () {
			var $target = BG.Menu.getTarget( BOLDGRID.EDITOR.Panel.currentControl );
			
			BG.Panel.$element.find( 'input.color-control').each( function () {
				var $this = $( this ),
					type = 'color',
					inputValue = $this.val(),
					$label = $this.prev('label');
				
				// If input is not transparent, set the color.
				if ( false === self.isColorTransparent( inputValue ) ) {
					$label.css( 'background-color', inputValue );
				}
				/*
				if ( $target.is( self.colorClasses.join(',') + ',' + self.backgroundColorClasses.join(',') ) ) {
					 * @TODO This has been commented out because we can not set the type to class. 
					 * In order for this to work correctly. The control would have to set the value 
					 * of the input to an interger value. The implecation of this "bug" is that 
					 * color classes do not preselect when reentering the control.
					//type = 'class';
				}
				 */
				
				$this.attr( 'data-type', type );
			} );
		},

		_setupColorPicker : function () {
			var type = 'color',
				defaultPickerColor = '#e3e',
				$selected = self.$colorPanel.find('.panel-selection.selected[data-preset]');

			if ( $selected.length ) {
				defaultPickerColor = $selected.css('background-color');
			}

			self.$colorPicker = self.$colorPanel.find('.boldgrid-color-picker');
			self.$colorPicker.val( defaultPickerColor );
			self.$colorPicker.wpColorPicker( {
				mode: 'hsl',
				defaultColor: defaultPickerColor,
				change: function( event, ui ){
					var $this = $(this),
						cssColor = ui.color.toCSS(),
						$selection = $this.closest('.color-control')
							.find('.colors .panel-selection.selected[data-preset]');

					if ( $selection.length && $selection.is('[data-type="default"]') ) {
						self._copyColor();
						return;
					}

					$selection = self.$colorPanel.find('.colors .panel-selection.selected[data-preset]');
					if ( $selection.length ) {
						$selection.css( 'background-color', cssColor );
						$selection.attr( 'data-preset', cssColor );
						self.customColors[ $selection.attr('data-index') ] = cssColor;
					}
					
					if ( self.$currentInput ) {
						self.$currentInput.attr( 'data-type', type );
						self.$currentInput.attr( 'value', cssColor );
						self.$currentInput.change();

					}
				},
				hide: false,
				palettes: true
			} );

		},

		_copyColor : function ( defaultPickerColor ) {
			var $controls, selectedBackground;

			selectedBackground = self.$colorPanel
				.find('.colors .panel-selection.selected').css('background-color');

			if ( ! selectedBackground ) {
				selectedBackground = self.$colorPicker.iris( 'color' );
			}

			self.customColors.push( selectedBackground );
			self._renderColorOptions();

			$controls = self.$colorPanel.find('.color-control');
			$controls.find('ul.colors').removeClass( 'selected' );
			self.$colorPicker.iris( 'color', selectedBackground );
			self.selectColor( $controls.find('.my-colors li:last-of-type') );
		},

		_setupAddNew : function () {
			self.$colorPanel.on( 'click', '.colors .panel-selection.custom-color', function () {
				self._copyColor();
			} );
		},

		_renderColorOptions : function () {
			self.$colorPanel.find('.colors-wrap').html( self.colorTemplate( {
				'colors' : self.getColorsFormatted(),
				'customColors' : self.customColors
			} ) );

			BOLDGRID.EDITOR.Tooltip.renderTooltips();
		},
		
		getColorsFormatted : function () {
			var colors = [];
			$.each( BoldgridEditor.colors, function ( key ) {

				var colorNum = key + 1;
				colors.push( {
					'color' : this,
					'number' : colorNum,
				} );
			} );

			return colors;
		},

		_create : function () {
			var html,
				template = wp.template( 'boldgrid-editor-color-panel' );

			self.$colorPanel = $( template() );
			$( 'body' ).append( self.$colorPanel );
		},

		_setupRemove : function () {
			self.$colorPanel.on( 'click', '.color-picker-wrap .cancel', function ( e ) {
				var colorClasses, $selection, $control, $newSelection,
					$this = $( this );

				e.preventDefault();

				$control = $this.closest( '.color-control' );
				$control.find( '.custom-color' ).removeClass( 'selected' );

				$selection = $control.find( '.colors .selected[data-type="custom"]' );
				if ( $selection.length ){
					self.customColors.splice( $selection.attr('data-index'), 1 );
					$selection.remove();
					$newSelection = self.$colorPanel.find('.panel-selection').first();
					self.$colorPicker.iris( 'color', $newSelection.css('background-color') );
					self.selectColor( $newSelection );
				}
			} );
		},

		selectColor : function ( $element ) {
			self.$colorPanel.find( '.selected' ).removeClass( 'selected' );
			$element.addClass( 'selected' );
			if ( $element.is('[data-type="custom"]') ) {
				self.$colorPanel.attr( 'current-selection','custom' );
			} else {
				self.$colorPanel.attr( 'current-selection','default' );
			}
		},

		_setupCallback : function () {
			self.$colorPanel.on( 'click', '.colors .panel-selection', function ( e ) {
				var colorClasses, type,
					$this = $( this );

				// Clicks on add a new color.
				if ( $this.hasClass('custom-color') ) {
					return;
				}
				
				type = 'default' == $this.data('type') ? 'class' : 'color';  

				self.$colorPanel.find('ul.colors .panel-selection').removeClass( 'selected' );
				self.$colorPicker.iris( 'color', $this.css( 'background-color' ) );
				self.selectColor( $this );

				self.$currentInput.val( $this.attr('data-preset') );
				self.$currentInput.attr( 'data-type', type );
				self.$currentInput.change();
				
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;

} )( jQuery );