window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Blockalignment = {
		template: wp.template( 'boldgrid-editor-horizontal-block-alignment' ),

		render: function() {
			BG.Panel.$element
				.find( '.panel-body .customize' )
				.find( '.section.horizontal-block-alignment' )
				.remove();
			BG.Panel.$element.find( '.panel-body .customize' ).append( this.template() );
		},

		bind: function() {
			var currentAlignment = 'center',
				$el = BG.Menu.getCurrentTarget(),
				$inputs = BG.Panel.$element.find( '.section.horizontal-block-alignment input' ),
				marginLeft = parseInt( $el.css( 'margin-left' ) ),
				marginRight = parseInt( $el.css( 'margin-right' ) );

			if ( 0 === marginLeft && 0 === marginRight ) {
				currentAlignment = 'center';
			} else if ( 0 === marginLeft ) {
				currentAlignment = 'left';
			} else if ( 0 === marginRight ) {
				currentAlignment = 'right';
			}

			$inputs.filter( '[value="' + currentAlignment + '"]' ).prop( 'checked', true );

			BG.Panel.$element.on(
				'change',
				'.section [name="horizontal-block-alignment"]',
				function() {
					var $this = $( this ),
						value = $this.attr( 'value' );

					self._applyMargin( $el, value );
				}
			);
		},

		_applyMargin: function( $el, value ) {
			$el.removeAttr( 'align' );

			if ( 'center' === value ) {
				$el.css( 'margin-left', 'auto' );
				$el.css( 'margin-right', 'auto' );
			} else if ( 'left' === value ) {
				$el.css( 'margin-right', '' );
				$el.css( 'margin-left', '0' );
			} else {
				$el.css( 'margin-right', '0' );
				$el.css( 'margin-left', '' );
			}
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Blockalignment;
} ( jQuery ) );
