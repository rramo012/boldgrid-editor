/**
 * BoldGrid Source Code
 *
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid <wpb@boldgrid.com>
 */
(function( $ ) {

	/**
	 * This is a jQuery plugin that handles the user, selecting text
	 * Usage:
	 *
	 * var start_function = function () {
	 * 		console.log("Do cool stuff");
	 * };
	 *
	 * var end_function = function () {
	 * 		console.log("Stop Cool Stuff");
	 * };
	 *
	 * $('p').textSelect( start_function, end_function );
	 */
	$.fn.textSelect = function( startCallback, endCallback ) {

		//How long should the user have to hold down the click event before we recognize that
		//they are selecting
		var selection_delay = 250;

		//Declare variables to be used across callbacks
		var mousedown_timestamp, mousedown, selecting, last_checked_mouse_move;

		//Check for Selection start
		var mousemove = function ( e ) {
		   if ( !selecting && mousedown && mousedown_timestamp + selection_delay < e.timeStamp ) {
		       last_checked_mouse_move = e.timeStamp;
		       selecting = true;
		       startCallback();
		   }
		};

		//Select Stop Handler
		var mouseup = function ( e ) {
		    mousedown = false;
		    selecting = false;
			endCallback();
		};

		//Mousedown Handler
		mousedown = function ( e ) {
			var target = e.originalEvent.originalTarget || e.originalEvent.srcElement;
			if ( target ) {
				var $target = jQuery( target );
				//Make sure the user didnt click on something draggable
				if ( (!$target.is('[draggable="true"]') && !$target.closest('[draggable="true"]').length ) ) {
					if ( (!$target.is('[unselectable="on"]') && !$target.closest('[unselectable="on"]').length ) ) {
						mousedown_timestamp = e.timeStamp;
						mousedown = true;
					}
				}
			}
		};

		//Bind relevant events
		$(this).on( 'mousedown', mousedown )
				.on( 'mouseup dragend drop', mouseup )
				.on( 'mousemove', mousemove );
	};

})( jQuery );
