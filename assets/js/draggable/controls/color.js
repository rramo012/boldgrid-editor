var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Color = {

		colorClasses : [
			'color1-color',
			'color2-color',
			'color3-color',
			'color4-color',
			'color5-color'
		],
		
		customColors : [], 
		
		init : function () {
			self._setupAddNew();
			self._setupColorPicker();
			self._setupAccept();
			self._setupAutoHide();
			
			return self;
		},
		
		_setupAutoHide : function () {
			$('body').on( 'click', function () {
				BG.Panel.$element.find('.color-picker-wrap').hide();
			} );
			BG.Panel.$element.on( 'click', '.iris-picker', function ( e ) {
				e.stopPropagation();
			} );
		},
		
		_setupAccept : function () {
			BG.Panel.$element.on( 'click', '.color-picker-wrap .save', function () {
				$( this ).closest( '.color-control' ).find( '.color-picker-wrap' ).hide();
			} );
		},
		
		_setupColorPicker : function () {
			var defaultPickerColor = '#e3e',
				$controls = BG.Panel.$element.find('.color-control'),
				$selected = $controls.find('.panel-selection.selected[data-preset]');
			
			if ( $selected.length ) {
				defaultPickerColor = $selected.css('background-color');
			}
			
			BG.Panel.$element.find('.boldgrid-color-picker').val( defaultPickerColor );
			BG.Panel.$element.find('.boldgrid-color-picker').iris( {  
				defaultColor: defaultPickerColor,
				change: function( event, ui ){
					var $this = $(this),
						$selection = $this.closest('.color-control')
							.find('.colors .panel-selection.selected[data-preset]');
					
					if ( $selection.length && $selection.is('[data-type="default"]') ) {
						self._copyColor( $selection.css('background-color') );
						return false;
					} else {
						$selection.css( 'background-color', ui.color.toCSS() );
					}
				},
				clear: function() {},
				hide: false,
				palettes: true
			} ).closest('.color-control')
				.show();
			
			BG.Panel.$element.find('.color-picker-wrap').show();
			BG.Panel.$element.find( '.color-picker-wrap .links' ).show();
		},
		
		_copyColor : function ( defaultPickerColor ) {
			var $controls;
			
			self.customColors.push( defaultPickerColor );
			BG.Panel.$element.find('.color-control').replaceWith( 
				self.create()
			);
			
			$controls = BG.Panel.$element.find('.color-control');
			$controls.find('.panel-selection').removeClass( 'selected' );
			$controls.find('.panel-selection:last-of-type').addClass( 'selected' );
			$controls.find('.panel-selection.custom-color').addClass( 'selected' );
			
			self._setupColorPicker();
		},
		
		_setupAddNew : function () {
			BG.Panel.$element.on( 'click', '.colors .panel-selection.custom-color', function () {
				var $selected,
					defaultPickerColor = '#e3e',
					$this = $( this );
				
				if ( $this.hasClass( 'selected' ) ) {
					return false;
				}

				self._copyColor( defaultPickerColor );

			} );
		},

		create : function ( control ) {
			var template = wp.template( 'boldgrid-editor-color' );
			
			var colors = [];
			$.each( BoldgridEditor.colors, function ( key ) {
				
				var colorNum = key + 1; 
				colors.push( {
					'color' : this,
					'colorClass' : 'color' + colorNum + '-color',
				} );
			} );
			
			if ( control ) {
				self._setupCallback( control );
				self._setupRemove( control );
			}
			
			return template( {
				'title' : ( control && control.colors.title ) ? control.colors.title : 'Color',
				'colors' : colors,
				'customColors' : self.customColors
			} );
		},
		
		_setupRemove : function () {
			BG.Panel.$element.on( 'click', '.color-picker-wrap .cancel', function ( e ) {
				var colorClasses, $selection, $control,
					$this = $( this );
				
				e.preventDefault();
				
				$control = $this.closest( '.color-control' );
				$control.find( '.color-picker-wrap' ).hide();
				$control.find('.custom-color').removeClass( 'selected' );
				
				$selection = $control.find( '.colors .selected[data-type="custom"]' );
				if ( $selection.length ){
					self.customColors.splice( $selection.data('index'), 1 );
					$selection.remove();
				}
				
			} );
		},
		
		_setupCallback : function ( control ) {
			var panel = BG.Panel;
			
			if ( ! control.colors.selectCallback ) {
				return;
			} 

			panel.$element.on( 'click', '.section.colors .panel-selection', function ( e ) {
				e.stopPropagation();
				
				var colorClasses, selection,
					$this = $( this );
				
				if ( panel.$element.attr('data-type') != control.name ) {
					return;
				}

				// Clicks on add a new color.
				if ( $this.hasClass('custom-color') ) {
					return;
				}
				
				selection = {
					'class' : $( this ).data('preset')
				};
				
				control.colors.selectCallback( selection );
				
				$this.siblings().removeClass( 'selected' );
				$this.addClass( 'selected' );
				self._setupColorPicker();
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;
	
} )( jQuery );