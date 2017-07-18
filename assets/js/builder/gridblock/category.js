var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function() {
	'use strict';

	var BGGB = BOLDGRID.EDITOR.GRIDBLOCK,
		self = {
			currentCategory: null,

			init: function() {
				self.onSelectChange();
			},

			/**
			 * Setup the action of changing the category filter.
			 *
			 * @since 1.5
			 */
			onSelectChange: function() {
				var $select = BGGB.View.$gridblockNav.find( '.boldgrid-gridblock-categories select' );

				self.currentCategory = $select.val();
				$select.on( 'change', function() {
					self.currentCategory = $select.val();
					self.showByCategory();
				} );
			},

			/**
			 * Check if we can display the grid block configuration.
			 *
			 * @since 1.5
			 *
			 * @param  {Object} gridblockConfig Configruation for a Gridblock.
			 * @return {boolean}                Whether or not the gridblock configuration can be displayed.
			 */
			canDisplayGridblock: function( gridblockConfig ) {
				var category = BGGB.Category.currentCategory || 'all';
				return gridblockConfig.type === category || ( 'all' === category && 'saved' !== gridblockConfig.type );
			},

			/**
			 * Show the Gridblocks for the selected category.
			 *
			 * @since 1.5
			 */
			showByCategory: function() {
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

			/**
			 * Return the selected category.
			 *
			 * @since 1.5
			 *
			 * @return {string} Requested category.
			 */
			getSearchType: function() {
				return 'all' !== self.currentCategory ? self.currentCategory : null;
			}

		};

	BGGB.Category = self;

} )( jQuery );
