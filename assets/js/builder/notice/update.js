var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.NOTICE = BOLDGRID.EDITOR.NOTICE || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BG.NOTICE.Update = {
			
		title : 'New Release: BoldGrid Editor 1.3',
			
		template : wp.template( 'boldgrid-upgrade-notice' ),
		
		init : function() {
			if ( BoldgridEditor.display_update_notice ) {
				self.displayPanel();
			}
		},
			
		/**
		 * Display update notification panel.
		 *
		 * @since 1.3
		 */
		displayPanel : function () {
			self.initPanel();
			self.renderPanel();
		},
		
		/**
		 * Animate the panel when it appears.
		 *
		 * @since 1.3
		 */
		animatePanel : function () {
			BG.Panel.$element.addClass('animated bounceInDown');
		},
		
		/**
		 * Positon the panel on the screen and display.
		 *
		 * @since 1.3
		 */
		renderPanel : function () {
			BG.Panel.centerPanel();
			BG.Panel.$element.show();
			self.animatePanel();
		},
		
		/**
		 * Setup the parameters needed for the panel to be created.
		 *
		 * @since 1.3
		 */
		initPanel : function () {
			var $panel = BG.Panel.$element,
				content = self.template();

			BG.Panel.setDimensions( 800, 400 );
			BG.Panel.setTitle( self.title );
			BG.Panel.setContent( content );
		}
		
	};

	self = BG.NOTICE.Update;

} )( jQuery );