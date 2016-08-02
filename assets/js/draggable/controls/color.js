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
		
		customColors : ['yellow', 'orange'], 
		
		init : function () {
			self._setupColorPicker();
			
			return self;
		},
		
		_setupColorPicker : function () {
			BG.Panel.$element.on( 'click', '.colors .panel-selection.custom-color', function () {
				var $controls, $newControl,
					$this = $( this );
				
				if ( $this.hasClass( 'selected' ) ) {
					return false;
				}
				
				self.customColors.push( 'yellow' );
				BG.Panel.$element.find('.color-control').replaceWith( 
					self.create()
				);
				
				$controls = BG.Panel.$element.find('.color-control');
				$controls.find('.panel-selection').removeClass( 'selected' );
				$newControl = $controls.find('.panel-selection:last-of-type').addClass( 'selected' );
				$controls.find('.panel-selection.custom-color').addClass( 'selected' );
				
				BG.Panel.$element.find('.boldgrid-color-picker').iris( {
					defaultColor: true,
					change: function( event, ui ){
						$newControl.css( 'background-color', ui.color.toCSS() );
					},
					clear: function() {},
					hide: false,
					palettes: true
				} );
				
				BG.Panel.$element.find( '.color-picker-wrap .links' ).show();
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
				var colorClasses, $selection,
					$this = $( this );
				
				e.preventDefault();
				
				$selection = $this.closest( '.color-control' ).find( '.colors .selected[data-type="custom"]' );
				if ( $selection.length ){
					$selection.remove()
				}
				
			} );
		},
		
		_setupCallback : function ( control ) {
			var panel = BG.Panel;
			
			if ( ! control.colors.selectCallback ) {
				return;
			} 

			panel.$element.on( 'click', '.section.colors .panel-selection', function () {
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
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Color;
	
} )( jQuery );