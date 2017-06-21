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

		$window: $( window ),

		/**
		 * Grab the markup for the selected Gridblock
		 *
		 * @since 1.4
		 *
		 * @param  {number} gridblockId Unique id for a gridblock.
		 * @return {string}             Html requested.
		 */
		getHtml: function( gridblockId ) {
			var html = '',
				gridblockData = {};

			if ( BG.GRIDBLOCK.configs.gridblocks[ gridblockId ] ) {
				gridblockData = BG.GRIDBLOCK.configs.gridblocks[ gridblockId ];
			}

			if ( hasDownloadImages( gridblockData ) ) {
				// Need to assign this to config.
				html = self.getDownloadImageMarkup( gridblockData );

			} else {
				html = self.getStaticHtml( gridblockData );
			}

			return html;
		},

		/**
		 * If the gridblock doesn't have any images to replace, just return the html.
		 *
		 * @since 1.4
		 *
		 * @param  {object} gridblockData Get the static html.
		 * @return {string}               Html of gridblock.
		 */
		getStaticHtml: function( gridblockData ) {
			var html = gridblockData.html;

			if ( gridblockData.$html ) {
				html = gridblockData.$html[0].outerHTML;
			}

			// Final Check, Make sure image tags are not broken.
			return self.validateImageTags( html );
		},

		/**
		 * Find all images and add a placeholder for each url empty tag.
		 *
		 * @since 1.2.4
		 *
		 * @return {string}  Html of Gridblock.
		 */
		validateImageTags: function( html ) {
			var $div = $( '<div>' ).html( html );

			$div.find( 'img' ).each( function() {
				var $this = $( this );
				if ( ! $this.attr( 'src' ) ) {
					BG.GRIDBLOCK.Filter.setPlaceholderSrc( $this );
				}
			} );

			return $div.html();
		},

		/**
		 * Get the markup for pages that need images replaced.
		 *
		 * @since 1.4
		 *
		 * @param  {object} gridblockData Gridblock info.
		 * @return {$.Deffered}           Deferred Object.
		 */
		getDownloadImageMarkup: function( gridblockData ) {
			var $deferred = $.Deferred();

			// Make Api Call to return array
			var data = {
				'action': 'boldgrid_gridblock_image',
				'boldgrid_asset_ids': JSON.stringify( gridblockData.imageReplacements ),
				'boldgrid_gridblock_image_ajax_nonce': BoldgridEditor.grid_block_nonce,
				'dynamic_images': gridblockData.dynamicImages
			};

			var success = function( response ) {
				if ( response.success ) {

					//Use array to replace all urls.
					updateImages( response.asset_ids, response.dynamic_images, gridblockData );
				}
			};

			var always = function() {

				// On failure this will turn all images to placeholders.
				updateImages( [], [], gridblockData );

				$deferred.resolve( gridblockData.getHtml() );
			};

			$.ajax({
				'url': ajaxurl,
				'dataType': 'json',
				'data': data,
				'method':'POST',

				// Sets timeout to 15 seconds.
				'timeout': 15000
			}).success( success )
				.always( always );

			return $deferred;
		}

	};

	/**
	 * Add placeholders to images that were not replaced correctly.
	 *
	 * @since 1.4
	 *
	 * @param {object} gridblockData Gridblock info.
	 */
	function addPlaceholders( gridblockData ) {

		// If there are any more images that need to be replaced,
		// Replace them with placeholders
		gridblockData.$html.find( '[data-pending-boldgrid-attribution]' ).each( function() {
			var $this = $( this );
			BG.GRIDBLOCK.Filter.setPlaceholderSrc( $this );
			BG.GRIDBLOCK.Filter.setPlaceholderSrc( $this );
		});

		// Placeholders for dynamic Images that came from preview server.
		if ( gridblockData && gridblockData.build_profile_id ) {

			// Find all images that don't have the boldgrid_updated_src prop set to true.
			gridblockData.$html.find( 'img[data-imhwpb-built-photo-search]' ).each( function() {
				var $this = $( this );
				if ( ! this.boldgrid_updated_src ) {
					BG.GRIDBLOCK.Filter.setPlaceholderSrc( $this );
				}
			});
		}
	}

	/**
	 * Add wp-image class to gridblock.
	 *
	 * @since 1.4
	 *
	 * @param {jQuery} $image Image to have attributes replaced.
	 * @param {Object} data   Image return data.
	 */
	function addImageAttr( $image, data ) {
		$image.attr( 'src', data.url );

		// If an attachment_id is set, use it to add the wp-image-## class.
		// This class is required if WordPress is to later add the srcset attribute.
		if ( 'undefined' !== typeof data.attachment_id && data.attachment_id ) {
			$image.attr( 'class', 'wp-image-' + data.attachment_id );
		}
	}

	/**
	 * Insert user images to the static gridblock content.
	 *
	 * @since 1.4
	 *
	 * @param  {Object} asset_ids              Asset Ids and the usrl created on the wp.
	 * @param  {Object} dynamic_image_response Image ids and the url created on the wp.
	 * @param  {Object} gridblockData          Gridblock info.
	 */
	function updateImages( asset_ids, dynamic_image_response, gridblockData ) {
		$.each( asset_ids, function() {
			var $image;

			if ( this.asset_id && this.url ) {

				// Swap image and remove data indicators.
				$image = gridblockData.$html.find(
					'[data-boldgrid-asset-id="' + this.asset_id + '"], [data-imhwpb-asset-id="' + this.asset_id + '"]' );

				addImageAttr( $image, this );
				BG.GRIDBLOCK.Filter.removeAttributionAttributes( $image );
			}
		});

		if ( gridblockData && gridblockData.build_profile_id ) {

			//Foreach dynamic image.
			$.each( dynamic_image_response, function( index, dynamic_image_data ) {
				if ( this.rand_image_id && this.url ) {
					gridblockData.$html.find( 'img[data-imhwpb-built-photo-search]' ).each( function() {

						// If the image id matches, update the src.
						if ( String( dynamic_image_data.rand_image_id ) === String( this.boldgrid_rand_image_id ) ) {
							this.boldgrid_updated_src = true;
							addImageAttr( $( this ), dynamic_image_data );
						}
					});
				}
			});
		}

		/*
		 *  At this point we've placed all images with user images.
		 *  Update the gridblock config to reflect the updates.
		 *  (gridblockData.dynamicImages && gridblockData.imageReplacements)
		 */
		 gridblockData.dynamicImages = BG.GRIDBLOCK.Remote.profileImageData( gridblockData );
		 BG.GRIDBLOCK.Filter.storeImageReplacements( gridblockData.gridblockId );

		// Add placeholders if still needed
		addPlaceholders( gridblockData );
	}

	/**
	 * Check if this gridblock has images that need replacing.
	 *
	 * @since 1.4
	 *
	 * @param  {object}  gridblockData Gridblock Info.
	 * @return {Boolean}               Boolean.
	 */
	function hasDownloadImages ( gridblockData ) {
		return ( gridblockData.imageReplacements && gridblockData.imageReplacements.length ) ||
			( gridblockData.dynamicImages && gridblockData.dynamicImages.length );
	}

	BG.GRIDBLOCK.Create = self;

} )( jQuery );
