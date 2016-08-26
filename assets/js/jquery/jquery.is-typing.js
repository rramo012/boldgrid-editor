/**
 * BoldGrid Source Code
 *
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid <wpb@boldgrid.com>
 */
(function( $ ) {

	/**
	 * This is a jQuery plugin that handles the user, typing text
	 * Usage:
	 *
	 * $('textarea').is_typing_boldgrid();
	 *
	 * $('textarea').on('start_typing_boldgrid', function () {
	 * 		console.log("Stop Cool Stuff");
	 * });
	 *
	 * $('textarea').on('end_typing_boldgrid', function () {
	 * 		console.log("Start Cool Stuff");
	 * });
	 *
	 */
	$.fn.is_typing_boldgrid = function() {
		var self = this;
		// Events to be triggered
		var $this = $( this );

		//Register 2 new events
		jQuery.Event( 'end_typing_boldgrid' );
		jQuery.Event( 'start_typing_boldgrid' );

		// Delay used to calculate typing time
		var typing_delay = 1000;

		this.is_typing = false;

		// Declare variables to be used across callbacks
		var last_key_press;

		// Key Press handler
		var keypress = function( e ) {

			if ( ! self.is_typing ) {
				self.is_typing = true;
				$this.trigger( 'start_typing_boldgrid' );
			}

			last_key_press = new Date().getTime();
			var repeat_function = function( current_keypress ) {
				if ( last_key_press == current_keypress ) {
					self.is_typing = false;
					$this.trigger( 'end_typing_boldgrid' );
				}
			};

			setTimeout( repeat_function, typing_delay, last_key_press );
		};

		// Bind relevant events
		$( this ).on( 'keydown is-typing-keydown', keypress );

		return this;
	};

})( jQuery );
