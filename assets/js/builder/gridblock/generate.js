var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {
			/**
			 * Number of Gridblocks created.
			 *
			 * @since 1.5
			 *
			 * @type {Number}
			 */
			gridblockCount: 0,

			/**
			 * Get a set of GridBlocks.
			 *
			 * @since 1.5
			 *
			 * @return {$.deferred} Ajax response.
			 */
			fetch: function() {
				if ( self.fetching ) {
					return false;
				}

				self.fetching = true;
				self.gridblockLoadingUI.start();

				return $.ajax( {
					url: 'https://api-dev-rafaelh.boldgrid.com/v1/gridblocks',
					data: {
						'quantity': 30,
						'color_palettes': true,
						'type': BG.GRIDBLOCK.Category.getSearchType(),
						'color': JSON.stringify( { 'colors': BG.CONTROLS.Color.getGridblockColors() } ),
						'category': self.getCategory()
					}
				}).done( function( gridblocks ) {

					self.addToConfig( gridblocks );
					BG.GRIDBLOCK.View.createGridblocks();

				} ).always( function() {
					self.fetching = false;
					self.gridblockLoadingUI.finish();
				} );
			},

			/**
			 * Handle showing the loading graphic.
			 *
			 * @since 1.5
			 *
			 * @type {Object}
			 */
			gridblockLoadingUI: {
				start: function() {
					$( 'body' ).addClass( 'loading-remote-body' );
				},
				finish: function() {
					$( 'body' ).removeClass( 'loading-remote-body' );
				}
			},

			/**
			 * Get the users installed category.
			 *
			 * @since 1.5
			 *
			 * @return {string} inspiration catgegory.
			 */
			getCategory: function() {
				var category;
				if ( BoldgridEditor && BoldgridEditor.inspiration && BoldgridEditor.inspiration.subcategory_key ) {
					category = BoldgridEditor.inspiration.subcategory_key;
				}

				return category;
			},

			/**
			 * Add a set of Gridblocks to the configuration.
			 *
			 * @since 1.5
			 *
			 * @param {array} gridblocks Collection of GridBlock configs.
			 */
			addToConfig: function( gridblocks ) {
				_.each( gridblocks, function( gridblockData, index ) {
					gridblocks[ index ] = self.addRequiredProperties( gridblockData );
					BG.GRIDBLOCK.Filter.addGridblockConfig( gridblocks[ index ], 'generated-' + self.gridblockCount );

					self.gridblockCount++;
				});
			},

			/**
			 * Set the background image for any remote gridblocks..
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $html Gridblock jqury object.
			 */
			updateBackgroundImages: function( $html ) {
				var backgroundImageOverride = $html.attr( 'gb-background-image' );

				if ( backgroundImageOverride ) {
					$html.css( 'background-image', backgroundImageOverride );
					$html.removeAttr( 'gb-background-image' );
				}
			},

			/**
			 * Set properties of gridblock configurations.
			 *
			 * @since 1.5
			 *
			 * @param {object} gridblockData A Gridblock config.
			 */
			addRequiredProperties: function( gridblockData ) {
				var $html = $( gridblockData.html );

				self.updateBackgroundImages( $html );
				gridblockData[ 'preview-html' ] = gridblockData.html;
				gridblockData[ 'html-jquery' ] = $html;
				gridblockData[ 'preview-html-jquery' ] = $html.clone();

				return gridblockData;
			}

		};

	BG.GRIDBLOCK.Generate = self;

} )( jQuery );
