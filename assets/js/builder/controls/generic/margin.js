window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.GENERIC = BOLDGRID.EDITOR.CONTROLS.GENERIC || {};

( function() {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.GENERIC.Margin = {
		template: wp.template( 'boldgrid-editor-margin' ),

		render: function() {
			BG.Panel.$element.find( '.panel-body .customize' ).find( '.section.margin-control' ).remove();
			BG.Panel.$element.find( '.panel-body .customize' ).append( this.template() );
		},

		bind: function( options ) {
			if ( ! options ) {
				options = {};
			}

			let minVert = options.vertMin || 0,
				minHor = options.horMin || -15,
				$target = BG.Menu.getCurrentTarget(),
				defaultMarginVert = $target.css( 'margin-top' ),
				defaultMarginHor = $target.css( 'margin-left' );

			if ( false === options.horizontal ) {
				BG.Panel.$element.find( '.margin-horizontal' ).hide();
			}

			if ( false === options.vertical ) {
				BG.Panel.$element.find( '.margin-top' ).hide();
			}

			defaultMarginVert = defaultMarginVert  ? parseInt( defaultMarginVert ) : 0;
			defaultMarginHor = defaultMarginHor ? parseInt( defaultMarginHor ) : 0;

			BG.Panel.$element.find( '.panel-body .customize .margin-horizontal .slider' ).slider( {
				min: minHor,
				max: 50,
				value: defaultMarginHor,
				range: 'max',
				slide: function( event, ui ) {
					$target = BG.Menu.getCurrentTarget();

					BG.Controls.addStyle( $target, 'margin-left', ui.value );
					BG.Controls.addStyle( $target, 'margin-right', ui.value );
				}
			} ).siblings( '.value' ).html( defaultMarginHor );

			BG.Panel.$element.find( '.panel-body .customize .margin-top .slider' ).slider( {
				min: minVert,
				max: 200,
				value: defaultMarginVert,
				range: 'max',
				slide: function( event, ui ) {
					$target = BG.Menu.getCurrentTarget();

					BG.Controls.addStyle( $target, 'margin-top', ui.value );
					BG.Controls.addStyle( $target, 'margin-bottom', ui.value );
				}
			} ).siblings( '.value' ).html( defaultMarginVert );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.GENERIC.Margin;

} )( jQuery );
