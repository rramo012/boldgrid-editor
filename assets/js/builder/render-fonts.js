var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	"use strict";

	var self;
	
	self = BOLDGRID.EDITOR.FontRender = {
	
		/**
		 * Get array of font families.
		 * 
		 * @since 1.2.7
		 * @return array Families that need to be reuqested.
		 */
		createLinkList : function ( $scope ) {
			var families = {};
			
			$scope.find( '[data-font-family]' ).each( function () {
				var $this = $( this ),
					family = $this.attr( 'data-font-family' );
	
				if ( family ) {
					families[ family ] = families[ family ] || {};
					// Add more props like sans serif and weight.
				}
			} );
			
			return families;
		},
		
		/**
		 * Update font link that has been added to the head.
		 * 
		 * @since 1.2.7
		 * @return array Families that need to be reuqested.
		 */
		updateFontLink : function ( $scope ) {
			var families, familyParam, params,
				baseUrl = 'https://fonts.googleapis.com/css?',
				$head = $scope.find( 'head' ),
				$link = $head.find( '#boldgrid-google-fonts' );
			
			if ( ! $link.length ) {
				$link = $( '<link id="boldgrid-google-fonts" rel="stylesheet">' );
				$head.append( $link );
			}
			
			families = self.createLinkList( $scope );
	
			// Create url encoded array.
			familyParam = [];
			$.each( families, function ( familyName ) {
				familyParam.push( familyName );
			} );
			
			familyParam = familyParam.join('|');
			
			// Create params string.
			if ( familyParam ) {
				params = jQuery.param( { family: familyParam } );
				$link.attr( 'href' , baseUrl + params );
			}
		}
	};
	
	
} )( jQuery );