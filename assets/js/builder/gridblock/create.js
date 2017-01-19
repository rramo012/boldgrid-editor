var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles adding gridblocks.
 */
( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

		gridblockConfig: BG.GRIDBLOCK.configs,

		$window: $( window ),

		init: function() {

		},

		/**
		 * Grab the markup for the selected Gridblock
		 */
		getHtml: function( gridblockId ) {
			var dynamicImages,
				html = '',
				gridblockData = {};

			if ( self.gridblockConfig.gridblocks[ gridblockId ] ) {
				gridblockData = self.gridblockConfig.gridblocks[ gridblockId ];
			}

			if ( hasDownloadImages( gridblockData ) ) {
				// Need to assign this to config.
				//dynamicImages = IMHWPB.Media.GridBlocks.profileImageData( gridblock_data );
				//
				//
				gridblockData.dynamicImages = [];
				html = self.getDownloadImageMarkup( gridblockData );
			} else {
				html = self.getStaticHtml( gridblockData );
			}

			return html;
		},

		getStaticHtml: function( gridblockData ) {
			var html = gridblockData.html;

			if ( gridblockData.$html ) {
				html = gridblockData.$html[0].outerHTML;
			}

			// Final Check, Make sure image tags are not broken.
			return IMHWPB.Media.GridBlocks.validateImageTags( html );
		},

		getDownloadImageMarkup: function( gridblockData ) {
			var $deferred = $.Deferred();

			// Make Api Call to return array
			var data = {
				'action': 'boldgrid_gridblock_image',
				'boldgrid_asset_ids': JSON.stringify( gridblockData.imageReplacements ),
				'boldgrid_gridblock_image_ajax_nonce': BoldgridEditor.grid_block_nonce,
				'dynamic_images': gridblockData.dynamic_images
			};

			var success = function( response ) {
				if ( response.success ) {

					//Use array to replace all urls
					updateImages( response.asset_ids, response.dynamic_images, gridblockData );
				}
			};

			var always = function() {

				// On failure this will turn all images to placeholders
				updateImages( [], [], gridblockData );

				$deferred.resolve( gridblockData.getHtml() );
			};

			$.ajax({
				'url': ajaxurl,
				'dataType': 'json',
				'data': data,
				'method':'POST',
				'timeout': 15000 // Sets timeout to 15 seconds
			}).success( success )
				.always( always );

			return $deferred;
		}

	};

	function addPlaceholders( gridblockData ) {

		// If there are any more images that need to be replaced,
		// Replace them with placeholders
		gridblockData.$html.find( '[data-pending-boldgrid-attribution]' ).each( function() {
			var $this = $( this );
			IMHWPB.Media.GridBlocks.swap_image_with_placeholder( $this );
			IMHWPB.Media.GridBlocks.remove_attribution_attributes( $this );
		});

		// Placeholders for dynamic Images that came from preview server.
		if ( gridblockData && gridblockData.build_profile_id ) {

			// Find all images that don't have the boldgrid_updated_src prop set to true.
			gridblockData.$html.find( 'img[data-imhwpb-built-photo-search]' ).each( function() {
				var $this = $( this );
				if ( ! this.boldgrid_updated_src ) {
					IMHWPB.Media.GridBlocks.swap_image_with_placeholder( $this );
				}
			});
		}
	}

	function addImageAttr( $image, data ) {
		$image.attr( 'src', data.url );

		// If an attachment_id is set, use it to add the wp-image-## class.
		// This class is required if WordPress is to later add the srcset attribute.
		if ( 'undefined' !== typeof data.attachment_id && data.attachment_id ) {
			$image.attr( 'class', 'wp-image-' + data.attachment_id );
		}
	}

	// Save the image markup on to the page.
	function updateImages( asset_ids, dynamic_image_response, gridblockData ) {
		$.each( asset_ids, function() {
			var $image;

			if ( this.asset_id && this.url ) {

				//Swap image and remove data indicators.
				$image = gridblockData.$html.find( '[data-boldgrid-asset-id="' + this.asset_id + '"]' );

				addImageAttr( $image, this );
				IMHWPB.Media.GridBlocks.remove_attribution_attributes( $image );
			}
		});

		if ( gridblockData && gridblockData.build_profile_id ) {

			//Foreach dynamic image.
			$.each( dynamic_image_response, function( index, dynamic_image_data ) {
				if ( this.rand_image_id && this.url ) {
					gridblock_data.$html
						.find( 'img[data-imhwpb-built-photo-search]' ).each( function() {

							// If the image id matches, update the src.
							if ( dynamic_image_data.rand_image_id == this.boldgrid_rand_image_id ) {
								this.boldgrid_updated_src = true;
								addImageAttr( $( this ), dynamic_image_data );
							}
					});
				}
			});
		}

		// Add placeholders if still needed
		addPlaceholders( gridblockData );
	}

	function hasDownloadImages ( gridblockData ) {
		return ( gridblockData.imageReplacements && gridblockData.imageReplacements.length ) ||
			( gridblockData.dynamicImages && gridblockData.dynamicImages.length );
	}

	BOLDGRID.EDITOR.GRIDBLOCK.Create = self;
	$( BOLDGRID.EDITOR.GRIDBLOCK.Create.init );

} )( jQuery );
