window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

import { Padding, Margin, BoxShadow, BorderRadius, Border } from '@boldgrid/controls';

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BG.CONTROLS.Generic = {
		defaultCustomize: wp.template( 'boldgrid-editor-default-customize' ),

		bgControls: {
			'margin': Margin,
			'padding': Padding,
			'box-shadow': BoxShadow,
			'border-radius': BorderRadius,
			'border': Border
		},

		appendBasicBGControl( addOptions, name ) {
			let $control = new name( {
				target: BG.Menu.getCurrentTarget()
			} ).render();

			self.appendControl( $control );

			return $control;
		},

		appendControl( $control ) {
			BG.Panel.$element.find( '.panel-body .customize' ).append( $control );
		},

		createCustomizeSection: function() {
			let $append = BG.Panel.$element.find( '.choices' );

			if ( ! $append.length ) {
				BG.Panel.$element.find( '.panel-body' ).append( self.defaultCustomize() );
			}

			return $append;
		},

		/**
		 * Init Controls.
		 *
		 * @since 1.2.7
		 */
		initControls: function() {
			var customizeOptions = BG.Panel.currentControl.panel.customizeSupport || [],
				customizeSupportOptions = BG.Panel.currentControl.panel.customizeSupportOptions || false;

			// Add customize section if it does not exist.
			if ( customizeOptions.length && ! BG.Panel.$element.find( '.panel-body .customize' ).length ) {
				self.createCustomizeSection();
			}

			$.each( customizeOptions, function() {
				var $control,
					customizationOption = this,
					addOptions = {};

				if ( customizeSupportOptions && customizeSupportOptions[this] ) {
					addOptions = customizeSupportOptions[this];
				}

				if ( self.bgControls[ customizationOption ] ) {
					$control = self.appendBasicBGControl( addOptions, self.bgControls[ customizationOption ] );
				} else {
					customizationOption = customizationOption.replace( '-', '' );
					customizationOption = customizationOption.toLowerCase();
					customizationOption = customizationOption.charAt( 0 ).toUpperCase() + customizationOption.slice( 1 );

					$control = BG.CONTROLS.GENERIC[customizationOption].render( addOptions );
					BG.CONTROLS.GENERIC[customizationOption].bind( addOptions );
				}

				BG.Tooltip.renderTooltips();
				$control.attr( 'data-control-name', this );
			} );
		},

		/**
		 * Setup Customization.
		 *
		 * @since 1.2.7
		 */
		setupInputCustomization: function() {
			BG.Panel.$element.on( 'change', '.class-control input', function() {
				var $this = $( this ),
					name = $this.attr( 'name' ),
					$el = BG.Menu.getCurrentTarget(),
					controlClassnames = [],
					$siblingInputs = $this.closest( '.class-control' ).find( 'input[name="' + name + '"]' );

				// Find other values.
				$siblingInputs.each( function() {
					controlClassnames.push( $( this ).val() );
				} );

				$el.removeClass( controlClassnames.join( ' ' ) );
				$el.addClass( $this.val() );
			} );
		},

		/**
		 * Setup Init.
		 *
		 * @since 1.2.7
		 */
		setupInputInitialization: function() {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'bg-customize-open', function() {
				var $el = BG.Menu.getCurrentTarget();

				panel.$element.find( '.class-control input[default]' ).prop( 'checked', true );

				panel.$element.find( '.class-control input' ).each( function() {
					var $this = $( this );
					if ( $el.hasClass( $this.val() ) ) {
						$this.prop( 'checked', true );
					}
				} );
			} );
		}
	};

	self = BOLDGRID.EDITOR.CONTROLS.Generic;

}( jQuery ) );
