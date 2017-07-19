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

			failure: false,

			/**
			 * Get a set of GridBlocks.
			 *
			 * @since 1.5
			 *
			 * @return {$.deferred} Ajax response.
			 */
			fetch: function() {
				var type;

				if ( self.fetching || self.failure ) {
					return false;
				}

				type = BG.GRIDBLOCK.Category.getSearchType();

				self.fetching = true;
				self.gridblockLoadingUI.start();

				return $.ajax( {
					url: BoldgridEditor.plugin_configs.asset_server +
						BoldgridEditor.plugin_configs.ajax_calls.gridblock_generate,
					data: {

						// If filtered to a type, load 30 otherwise 50.
						'quantity': type ? 30 : 50,
						'color_palettes': BoldgridEditor.is_boldgrid_theme,
						'include_temporary_resources': 1,
						'transparent_backgrounds': 'post' === BoldgridEditor.post_type ? 1 : 0,
						'type': type,
						'color': JSON.stringify( { 'colors': BG.CONTROLS.Color.getGridblockColors() } ),
						'category': self.getCategory()
					}
				}).done( function( gridblocks ) {

					self.addToConfig( gridblocks );
					BG.GRIDBLOCK.View.createGridblocks();

				} ).always( function() {
					self.fetching = false;
					self.gridblockLoadingUI.finish();
				} ).fail( function() {
					self.failure = true;
					BG.GRIDBLOCK.View.$gridblockSection.append( wp.template( 'boldgrid-editor-gridblock-error' )() );
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
