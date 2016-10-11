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

				// Delay event, make sure user sees modal.
				setTimeout( function () {
					self.bindEvents();
				}, 1000 );
			}
		},
		
		/**
		 * Bind all events.
		 *
		 * @since 1.3
		 */
		bindEvents : function () {
			self.bindDismissButton();
			self.panelClick();
			BG.Panel.$element.on( 'click', function ( e ) { e.stopPropagation(); } );
		},
		
		/**
		 * Bind the click outside of the pnael to the okay button.
		 *
		 * @since 1.3
		 */
		panelClick : function () {
			$('body').one( 'click', function () {
				self.dismissPanel();
			} );
		},
		
		/**
		 * Bind the event of dismiss to the OKay button.
		 *
		 * @since 1.3
		 */
		bindDismissButton : function () {
			BG.Panel.$element.find('.bg-upgrade-notice .dismiss').one( 'click', function () {
				self.dismissPanel();
			} );
		},
		
		/**
		 * Hide the panel.
		 *
		 * @since 1.3
		 */
		dismissPanel : function () {
			var $body = $('body'); 
			
			$body.addClass( 'fadeout-background' );
			BG.Panel.$element
				.addClass('bounceOutDown')
				.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
					self.removeEffects();
				} );
			
			setTimeout( function () {
				self.removeEffects();
			}, 1000 );
		},
		
		/**
		 * Remove the effects added to the notification.
		 *
		 * @since 1.3
		 */
		removeEffects : function () {
			$('body').removeClass( 'bg-editor-intro-1-3 fadeout-background' );
			BG.Panel.resetPosition();
			BG.Panel.$element.hide();
			BG.Panel.$element.removeClass('animated bounceOutDown bounceInDown');
		},
			
		/**
		 * Display update notification panel.
		 *
		 * @since 1.3
		 */
		displayPanel : function () {
			$('body').addClass('bg-editor-intro-1-3');
			self.initPanel();
			self.renderPanel();
		},
		
		/**
		 * Animate the panel when it appears.
		 *
		 * @since 1.3
		 */
		animatePanel : function () {
			BG.Panel.$element.addClass('animated bounceInDown')
				.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function (e) {
					$('.bg-editor-loading').hide();
				} );
		},
		
		/**
		 * Positon the panel on the screen and display.
		 *
		 * @since 1.3
		 */
		renderPanel : function () {
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