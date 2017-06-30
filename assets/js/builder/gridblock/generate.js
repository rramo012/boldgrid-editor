var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		Remote = BG.GRIDBLOCK.Remote;
		self = {
			gridblockCount: 0,

			fetch: function() {
				if ( self.fetching ) {
					return false;
				}

				self.fetching = true;
				Remote.gridblockLoadingUI.start();

				return $.ajax( {
					url: 'https://api-dev-rafaelh.boldgrid.com/v1/gridblocks',
					data: {
						'quantity': 10,
						'color_palettes': true,
						'type': BG.GRIDBLOCK.Category.getSearchType(),
						'color': JSON.stringify( { 'colors': BG.CONTROLS.Color.getGridblockColors() } ),
						'category': 'real_estate'
					}
				}).done( function( gridblocks ) {

					self.addToConfig( gridblocks );
					BG.GRIDBLOCK.View.createGridblocks();

				} ).always( function () {
					self.fetching = false;
					Remote.gridblockLoadingUI.finish();
				} );
			},

			addToConfig: function( gridblocks ) {
				_.each( gridblocks, function( gridblockData, index ) {
					gridblocks[ index ] = self.addRequiredProperties( gridblockData );
					BG.GRIDBLOCK.Filter.addGridblockConfig( gridblocks[ index ], 'generated-' + self.gridblockCount );

					self.gridblockCount++;
				});
			},

			updateBackgroundImages: function( $html ) {
				var backgroundImageOverride = $html.attr('gb-background-image');

				if ( backgroundImageOverride ) {
					$html.css( 'background-image', backgroundImageOverride );
					$html.removeAttr( 'gb-background-image' );
				}
			},

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
