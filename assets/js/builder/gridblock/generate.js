var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		Remote = BG.GRIDBLOCK.Remote;
		self = {
			fetch: function() {

				Remote.gridblockLoadingUI.start();

				return $.ajax( {
					url: 'https://api-dev-rafaelh.boldgrid.com/v1/gridblocks',
					data: {
						'quantity': 10,
						'color_palettes': true,
						'category': 'real_estate'
					}
				}).done( function( gridblocks ) {

					self.format( gridblocks );
					Remote.validateGridblock( gridblocks );

					BG.GRIDBLOCK.View.createGridblocks();
				} ).always( Remote.gridblockLoadingUI.finish );
			},

			format: function( gridblocks ) {
				_.each( gridblocks, function( gridblockData, index ) {
					gridblocks[ index ] = self.addRequiredProperties( gridblockData );
				});
			},

			addRequiredProperties: function( gridblockData ) {
				var $html = $( gridblockData.html );

				gridblockData[ 'preview-html' ] = gridblockData.html;
				gridblockData[ 'html-jquery' ] = $html;
				gridblockData[ 'preview-html-jquery' ] = $html.clone();

				return gridblockData;
			}

		};

	BG.GRIDBLOCK.Generate = self;

} )( jQuery );
