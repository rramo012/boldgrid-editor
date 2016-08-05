var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Color = {

		$currentInput : null,

		$colorPanel : null,

		$colorPicker : null,

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

		customColors : [],

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


			return self;
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
		},

		closePicker : function () {
			self.$colorPanel.hide();
			self.$currentInput = null;
		},

		_setupColorPreview : function () {
			BG.Panel.$element.on( 'click', '.color-preview', function ( e ) {
				e.stopPropagation();

				var $currentSelection,
					$preview = $( this ),
					$input = BG.Panel.$element.find('input[name="' + $preview.attr('for') + '"]');
				
				if ( 'color' == $input.data('type') ) {
					// Select Color From My Colors.
					self.$colorPanel.find('[data-type="custom"].panel-selection').each( function () {
						var $this = $( this );
						if ( $preview.css( 'background-color' ) == $this.css( 'background-color' ) ) {
							$currentSelection = $this;
							return false;
						}
					} );
					
				} else if ( 'class' == $input.data('type') ) {
					$currentSelection = self.$colorPanel.find('.panel-selection[data-preset="' + $input.val() + '"]');
				}
				
				if ( $currentSelection ) {
					self.selectColor( $currentSelection );
				}
				
				self.$colorPicker.iris( 'color', $preview.css( 'background-color' ) );
				self.openPicker( $input );
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

		getPaletteBackgroundColors : function () {
			var backgroundColors = {};

			$.each( BoldgridEditor.colors, function ( index ) {
				backgroundColors[ 'color' + ( index + 1 ) + '-' + 'background-color' ] = this;
			} );

			return backgroundColors;
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
				defaultColor: defaultPickerColor,
				change: function( event, ui ){
					var $this = $(this),
						$selection = $this.closest('.color-control')
							.find('.colors .panel-selection.selected[data-preset]');

					if ( $selection.length && $selection.is('[data-type="default"]') ) {
						self._copyColor();
					}

					$selection = self.$colorPanel.find('.colors .panel-selection.selected[data-preset]');
					$selection.css( 'background-color', ui.color.toCSS() );
					self.customColors[ $selection.data('index') ] = ui.color.toCSS();

					if ( self.$currentInput ) {
						self.$currentInput.val( ui.color.toCSS() );
						self.$currentInput.data( 'type', type );
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
			var template = wp.template( 'boldgrid-editor-color' );

			var colors = [];
			$.each( BoldgridEditor.colors, function ( key ) {

				var colorNum = key + 1;
				colors.push( {
					'color' : this,
					'number' : colorNum,
				} );
			} );

			self.$colorPanel.find('.colors-wrap').html( template( {
				'colors' : colors,
				'customColors' : self.customColors
			} ) );
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
					self.customColors.splice( $selection.data('index'), 1 );
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

				var colorClasses,
					$this = $( this );

				// Clicks on add a new color.
				if ( $this.hasClass('custom-color') ) {
					return;
				}

				self.$colorPanel.find('ul.colors .panel-selection').removeClass( 'selected' );
				self.$colorPicker.iris( 'color', $this.css( 'background-color' ) );
				self.selectColor( $this );
				
				self.$currentInput.val( $this.data('preset') );
				self.$currentInput.data( 'type', 'class' );
				self.$currentInput.change();
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;

} )( jQuery );