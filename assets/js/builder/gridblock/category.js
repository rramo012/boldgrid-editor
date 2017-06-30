var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BGGB = BOLDGRID.EDITOR.GRIDBLOCK,
		self = {
			currentCategory: null,

			init: function() {
				self.onSelectChange();
			},

			onSelectChange: function() {
				var $select = BGGB.View.$gridblockNav.find( '.boldgrid-gridblock-categories select' );

				self.currentCategory = $select.val();
				$select.on( 'change', function() {
					var $this = $( this );
					self.currentCategory = $select.val();

					self.showGridblocks();
				} );
			},

			showGridblocks: function() {
				var $gridblocks = BGGB.View.$gridblockSection.find( '.gridblock' ),
					$wrapper = BGGB.View.$gridblockSection.find( '.gridblocks' );

				$wrapper.attr( 'filter', self.currentCategory );

				if ( 'all' === self.currentCategory ) {
					$gridblocks.show();
				} else {
					$gridblocks
						.hide()
						.filter( '[data-type="' + self.currentCategory + '"]' )
						.show();
				}
			},

			getSearchType: function() {
				return 'all' !== self.currentCategory ? self.currentCategory : null;
			}

		};

	BGGB.Category = self;

} )( jQuery );
