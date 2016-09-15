var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BG.Util = {
			
		/**
		 * Convert Pixels to Ems.
		 * 
		 * @since 1.2.7
		 * @return string ems;
		 */
		convertPxToEm : function ( px, fontSize ) {
			var ems = 0;
			
			fontSize = fontSize ? parseInt( fontSize ) : 0;
			px = px ? parseInt( px ) : 0;
			
			if ( fontSize && px ) {
				ems =  ( px / fontSize ).toFixed(1);
			}
			
			return ems;
		},
		
		/**
		 * Get classes from an element %like% keyword.
		 * 
		 * @since 1.2.7
		 * @return string classes;
		 */
		getClassesLike : function ( $element, namespace ) {
			var classString = $element.attr('class'),
				allClasses = [],
				classes = [];

			allClasses = classString ? classString.split( ' ' ) : [];
	
			$.each( allClasses, function () {
				if ( this.indexOf( namespace ) === 0 ) {
					classes.push( this );
				}
			} );
			
			return classes;
		}
	};

	self = BOLDGRID.EDITOR.Util;

} )( jQuery );