var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BG.Util = {

		/**
		 * Convert Pixels to Ems.
		 *
		 * @since 1.2.7
		 * @return string ems;
		 */
		convertPxToEm: function( px, fontSize ) {
			var ems = 0;

			fontSize = fontSize ? parseInt( fontSize ) : 0;
			px = px ? parseInt( px ) : 0;

			if ( fontSize && px ) {
				ems =  ( px / fontSize ).toFixed( 1 );
			}

			return ems;
		},

		/**
		 * Get classes from an element %like% keyword.
		 *
		 * @since 1.2.7
		 * @return string classes;
		 */
		getClassesLike: function( $element, namespace ) {
			var classString = $element.attr( 'class' ),
				allClasses = [],
				classes = [];

			allClasses = classString ? classString.split( ' ' ) : [];

			$.each( allClasses, function() {
				if ( 0 === this.indexOf( namespace ) ) {
					classes.push( this );
				}
			} );

			return classes;
		},

		/**
		 * Check the users browser.
		 *
		 * @since 1.4
		 *
		 * @return {string} User browser.
		 */
		checkBrowser: function() {
			var browser,
				chrome = navigator.userAgent.search( 'Chrome' ),
				firefox = navigator.userAgent.search( 'Firefox' ),
				ie8 = navigator.userAgent.search( 'MSIE 8.0' ),
				ie9 = navigator.userAgent.search( 'MSIE 9.0' );

			if ( chrome > -1 ) {
				browser = 'Chrome';
			} else if ( firefox > -1 ) {
				browser = 'Firefox';
			} else if ( ie9 > -1 ) {
				browser = 'MSIE 9.0';
			} else if ( ie8 > -1 ) {
				browser = 'MSIE 8.0';
			}
			return browser;
		}
	};

	self = BOLDGRID.EDITOR.Util;

} )( jQuery );
