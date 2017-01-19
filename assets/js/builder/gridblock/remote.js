var IMHWPB = IMHWPB || {};
IMHWPB.Media = IMHWPB.Media || {};

(function( $ ) {
	'use strict';

	IMHWPB.Media.GridBlocks = {

		init: function() {
			//This.fetch_api_gridblocks();
		},

		strip_uneeded_markup: function( gridblock_data ) {

			//Strip classes for both preview markup and html to insert
			$.each( ['html', 'preview-html'], function() {

				var $html = $( gridblock_data[ this ] );
				$html.find( 'img' ).removeClass(function( index, css ) {
					return ( css.match( /(^|\s)wp-image-\S+/g ) || []).join( ' ' );
				}).each( function() {
					//Unwrap all links from images
					var $this = $( this );
					if ( $this.parent().is( 'a' ) ) {
						$this.unwrap();
					}
				});

				gridblock_data[ this + '-jquery' ] = $html;
				gridblock_data[ this ] = $html.wrapAll( '<div>' ).parent().html();
			});

			return gridblock_data;
		},

		/**
		 * Remove any Gridblocks that are already listed
		 */
		remove_duplicate_gridblocks: function( new_gridblock ) {

			var $html = $( new_gridblock.html );

			$html.find( 'img' ).removeAttr( 'src class' );
			$html.find( 'a' ).removeAttr( 'href' );

			new_gridblock.generalized_markup = $html.wrapAll( '<div>' ).parent().html();
			new_gridblock.generalized_markup = new_gridblock.generalized_markup.replace( / /g, '' );

			var is_unique_gridblock = true;
			$.each( IMHWPB.Globals.tabs['basic-gridblocks'].content, function( index, displayed_gridblock ) {
				if ( new_gridblock.generalized_markup == displayed_gridblock.generalized_markup ) {
					is_unique_gridblock = false;
				}
			});

			if ( ! is_unique_gridblock ) {
				new_gridblock = null;
			}

			return new_gridblock;
		},

		/**
		 * Grab gridblocks from API
		 */
		fetch_api_gridblocks: function() {
			var self = this;
			var $media_upload = $( '#media-upload' );

			//Make Api Call to return array
			var data = {
				'action': 'boldgrid_gridblock_html',
				'boldgrid_gridblock_image_html_nonce': IMHWPB.Globals.grid_block_html_nonce,
				'post_id': IMHWPB.Globals.post_id
			};

			$media_upload.addClass( 'loading-gridblocks' );

			var always = function( response ) {
				$media_upload.removeClass( 'loading-gridblocks' );
			};

			var done = function( response ) {

				var $attachments_modal = $( '.attachments[data-tabname="basic-gridblocks"]' );
				var post_template = wp.template( 'gridblock-attachment' );

				var attachments = [];

				var plugin_gridblock_contents = IMHWPB.Globals.tabs['basic-gridblocks'].content;
				if ( response.success && response.gridblocks ) {
					$.each( response.gridblocks, function() {

						var gridblock_data = this;

						//Remove wp-image classes from markup
						//Remove wrapping image links
						gridblock_data = self.strip_uneeded_markup( gridblock_data );
						gridblock_data = self.remove_duplicate_gridblocks( gridblock_data );

						if ( gridblock_data ) {
							plugin_gridblock_contents.push( gridblock_data );
							var markup = post_template( gridblock_data );
							var $markup = $( markup );

							var new_index = plugin_gridblock_contents.length - 1;
							$markup.attr( 'data-id', new_index );

							attachments.push( $markup[0].outerHTML );
						}
					});
				}

				$attachments_modal.append( attachments.join( ' ' ) );
				IMHWPB.ExistingLayouts.filter_out_nested_hr();
			};

			$.ajax({
				'url': ajaxurl,
				'dataType': 'json',
				'data': data,
				'method':'POST'
			}).always( always )
			  .done( done );
		},

		profileImageData: function( gridblock_data ) {
			//Find images
			var dynamic_images = [];
			if ( gridblock_data && gridblock_data.build_profile_id ) {
				gridblock_data['html-jquery'].find( 'img' ).each( function() {
					var $this = $( this );

					var dynamic_image = $this.attr( 'data-imhwpb-built-photo-search' );
					var image_provider_id = $this.attr( 'data-image-provider-id' );
					var id_from_provider = $this.attr( 'data-id-from-provider' );

					if ( dynamic_image && ! this.boldgrid_updated_src ) {
						var random = Math.random().toString().replace( '0.', '' ).substring( 0, 8 );
						var data = {
							'post_id': IMHWPB.Globals.post_id,
							'id_from_provider': id_from_provider,
							'image_provider_id': image_provider_id,
							'rand_image_id': random
						};

						//Save a random to the element so that we now which src goes to which image
						this.boldgrid_rand_image_id = random;

						dynamic_images.push( data );
					}
				});
			}

			return dynamic_images;
		},

		remove_attribution_attributes: function( $image ) {
			$image.removeAttr( 'data-boldgrid-asset-id' )
				  .removeAttr( 'data-pending-boldgrid-attribution' );
		},

		/**
		 * Swap image with a placeholder from placehold.it
		 */
		swap_image_with_placeholder: function( $this ) {
			var width = ( $this.attr( 'width' ) ) ? $this.attr( 'width' ) : '300'; //Default to 300
			var height = ( $this.attr( 'height' ) ) ? $this.attr( 'height' ) : '300';

			$this.attr( 'src', '//placehold.it/' + width + 'x' + height + '/cccccc/' );
		},

		/**
		 * Find all images and add a placeholder for each url empty tag.
		 *
		 * @since 1.2.4
		 *
		 * @retrin string html.
		 */
		validateImageTags: function( html ) {
			var self = this,
				$div = $( '<div>' ).html( html );

			$div.find( 'img' ).each( function() {
				var $this = $( this );
				if ( ! $this.attr( 'src' ) ) {
					self.swap_image_with_placeholder( $this );
				}
			} );

			return $div.html();
		},

		/**
		 * Add the src attributes for images that need them
		 */
		translateImageUrls: function( $context ) {
			var $imagesToTranslate = $context.find( '[data-boldgrid-asset-id]' );

			$imagesToTranslate.each( function() {
				var $this = $( this ),
					assetId = $this.data( 'boldgrid-asset-id' );

				if ( IMHWPB.configs && IMHWPB.configs.api_key ) {
					// If the user has an API key place the asset images.
					var imageUrl = IMHWPB.configs.asset_server +
						IMHWPB.configs.ajax_calls.get_asset + '?key=' +
						IMHWPB.configs.api_key + '&id=' + assetId;

					$this.attr( 'src', imageUrl );
					$this.attr( 'data-pending-boldgrid-attribution', 1 );
				} else {
					// Otherwise insert place holders.
					self.swap_image_with_placeholder( $this );
				}
			} );
		}

	};

	$( function() {
		IMHWPB.Media.GridBlocks.init();
	});

})( jQuery );
