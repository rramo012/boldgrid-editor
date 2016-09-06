var IMHWPB = IMHWPB || {};
IMHWPB.Media = IMHWPB.Media || {};

"use strict";

(function ( $ ) {

	IMHWPB.Media.GridBlocks = {

		init : function () {
			this.fetch_api_gridblocks();
		},

		strip_uneeded_markup : function ( gridblock_data ) {

			//Strip classes for both preview markup and html to insert
			$.each( ['html', 'preview-html'], function () {

				var $html = $( gridblock_data[ this ] );
				$html.find('img').removeClass (function (index, css) {
					return (css.match (/(^|\s)wp-image-\S+/g) || []).join(' ');
				}).each( function () {
					//Unwrap all links from images
					var $this = $(this);
					if ( $this.parent().is( 'a' ) ) {
						$this.unwrap();
					}
				});

				gridblock_data[ this + '-jquery' ] = $html;
				gridblock_data[ this ] = $html.wrapAll('<div>').parent().html();
			});

			return gridblock_data;
		},

		/**
		 * Remove any Gridblocks that are already listed
		 */
		remove_duplicate_gridblocks : function ( new_gridblock ) {

			var $html = $( new_gridblock.html );

			$html.find('img').removeAttr('src class');
			$html.find('a').removeAttr('href');

			new_gridblock.generalized_markup = $html.wrapAll('<div>').parent().html();
			new_gridblock.generalized_markup = new_gridblock.generalized_markup.replace(/ /g,'');

			var is_unique_gridblock = true;
			$.each( IMHWPB.Globals.tabs['basic-gridblocks']['content'], function ( index, displayed_gridblock ) {
				if ( new_gridblock.generalized_markup == displayed_gridblock.generalized_markup ) {
					is_unique_gridblock = false;
				}
			});

			if ( !is_unique_gridblock ) {
				new_gridblock = null;
			}

			return new_gridblock;
		},

		/**
		 * Grab gridblocks from API
		 */
		fetch_api_gridblocks : function () {
			var self = this;
			var $media_upload = $('#media-upload');

			//Make Api Call to return array
			var data = {
				'action': 'boldgrid_gridblock_html',
				'boldgrid_gridblock_image_html_nonce' : IMHWPB.Globals.grid_block_html_nonce,
				'post_id' : IMHWPB.Globals.post_id,
			};

			$media_upload.addClass('loading-gridblocks');

			var always = function ( response ) {
				$media_upload.removeClass('loading-gridblocks');
			};

			var done = function ( response ) {

				var $attachments_modal = $('.attachments[data-tabname="basic-gridblocks"]');
				var post_template = wp.template( 'gridblock-attachment' );

				var attachments = [];

				var plugin_gridblock_contents = IMHWPB.Globals.tabs['basic-gridblocks']['content'];
				if ( response.success && response.gridblocks ) {
					$.each( response.gridblocks, function () {

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

				$attachments_modal.append( attachments.join(' ') );
				IMHWPB.ExistingLayouts.filter_out_nested_hr();
			};

			$.ajax({
				'url' : ajaxurl,
				'dataType': "json",
				'data' : data,
				'method':"POST",
			}).always(always)
			  .done( done );
		},

		format_dynamic_image_data : function ( gridblock_data ) {
			//Find images
			var dynamic_images = [];
			if ( gridblock_data && gridblock_data['build_profile_id'] ) {
				gridblock_data['html-jquery'].find('img').each ( function () {
					var $this = $(this);

					var dynamic_image = $this.attr('data-imhwpb-built-photo-search');
					var image_provider_id = $this.attr('data-image-provider-id');
					var id_from_provider = $this.attr('data-id-from-provider');

					if ( dynamic_image && !this.boldgrid_updated_src ) {
						var random = Math.random().toString().replace('0.','').substring(0, 8);
						var data = {
							'post_id' : IMHWPB.Globals.post_id,
							'id_from_provider' : id_from_provider,
							'image_provider_id' : image_provider_id,
							'rand_image_id' : random,
						};

						//Save a random to the element so that we now which src goes to which image
						this.boldgrid_rand_image_id = random;

						dynamic_images.push( data );
					}
				});
			}

			return dynamic_images;
		},

		remove_attribution_attributes : function ( $image ) {
			$image.removeAttr('data-boldgrid-asset-id')
				  .removeAttr('data-pending-boldgrid-attribution');
		},

		/**
		 * Swap image with a placeholder from placehold.it
		 */
		swap_image_with_placeholder : function ( $this ) {
			var width = ($this.attr('width')) ? $this.attr('width') : '300'; //default to 300
			var height = ($this.attr('height')) ? $this.attr('height') : '300';

			$this.attr( 'src', '//placehold.it/' + width + "x" + height + "/cccccc/" );
		},
		
		/**
		 * Find all images and add a placeholder for each url empty tag.
		 * 
		 * @since 1.2.4
		 * 
		 * @retrin string html.
		 */
		validateImageTags : function ( html ) {
			var self = this,
				$div = $( '<div>' ).html( html );
			
			$div.find( 'img' ).each( function () {
				var $this = $( this );
				if ( ! $this.attr( 'src' ) ) {
					self.swap_image_with_placeholder( $this );
				}
			} );
			
			return $div.html();
		},

		/**
		 * Grab the markup for the selected Gridblock
		 */
		get_selected_html : function () {
			var self = this;
			var html = '';

			$( '.attachment[aria-checked="true"]' ).each( function() {
				var $this = $( this );
				var $wrapper = $this.find('.centered-content-boldgrid');

				var gridblock_data = null;
				var gridblock_id = $this.attr('data-id');
				if ( IMHWPB.Globals.tabs['basic-gridblocks']['content'][ gridblock_id ] ) {
					gridblock_data = IMHWPB.Globals.tabs['basic-gridblocks']['content'][ gridblock_id ];
				}

				// Find images that need to be exchanged for assets.
				var image_replacements = [];
				$wrapper.find('[data-pending-boldgrid-attribution]').each ( function () {
					image_replacements.push( $( this ).data('boldgrid-asset-id') );
				});

				// Get the api data needed for all dynamic images in the gridblock.
				var dynamic_images = self.format_dynamic_image_data( gridblock_data );

				if ( image_replacements.length || dynamic_images.length ) {
					var $deferred = $.Deferred();

					// Make Api Call to return array
					var data = {
						'action': 'boldgrid_gridblock_image',
						'boldgrid_asset_ids': JSON.stringify(image_replacements),
						'boldgrid_gridblock_image_ajax_nonce' : IMHWPB.Globals.grid_block_nonce,
						'dynamic_images' : dynamic_images,
					};

					var add_placeholders = function () {
						// If there are any more images that need to be replaced,
						// Replace them with placeholders
						$wrapper.find('[data-pending-boldgrid-attribution]').each( function (){
							var $this = $(this);
							self.swap_image_with_placeholder( $this );
							self.remove_attribution_attributes( $this );
						});

						// Placeholders for dynamic Images that came from preview server.
						if ( gridblock_data && gridblock_data['build_profile_id'] ) {
							// Find all images that don't have the boldgrid_updated_src prop set to true.
							gridblock_data['html-jquery'].find( 'img[data-imhwpb-built-photo-search]' ).each ( function () {
								var $this = $(this);
								if ( !this.boldgrid_updated_src ) {
									self.swap_image_with_placeholder( $this );
								}
							});
						}
					};

					var add_image_attr = function ( $image, data ) {
						$image.attr('src', data.url );

						// If an attachment_id is set, use it to add the wp-image-## class.
						// This class is required if WordPress is to later add the srcset attribute.
						if( typeof data.attachment_id != 'undefined' && data.attachment_id ) {
							$image.attr( 'class', 'wp-image-' + data.attachment_id );
						}
					};

					// Save the image markup on to the page.
					var update_images = function ( asset_ids, dynamic_image_response ) {
						$.each( asset_ids, function () {
							if ( this.asset_id && this.url ) {
								//Swap image and remove data indicators.
								var $image = $wrapper.find('[data-boldgrid-asset-id="' + this.asset_id + '"]');

								add_image_attr( $image, this );
								self.remove_attribution_attributes( $image );
							}
						});
						if ( gridblock_data && gridblock_data['build_profile_id'] ) {
							//Foreach dynamic image.
							$.each( dynamic_image_response, function ( index, dynamic_image_data ) {
								if ( this.rand_image_id && this.url ) {
									gridblock_data['html-jquery']
										.find( 'img[data-imhwpb-built-photo-search]' ).each ( function () {

											//If the image id matches, update the src
											if ( dynamic_image_data.rand_image_id == this.boldgrid_rand_image_id ) {

												var $image = $(this);
												this.boldgrid_updated_src = true;
												add_image_attr( $image, dynamic_image_data );
											}
									});
								}
							});
						}

						// Add placeholders if still needed
						add_placeholders();
					};

					var success = function ( response ) {
						if ( response.success ) {
							//Use array to replace all urls
							update_images( response['asset_ids'], response['dynamic_images'] );
						}
					};

					var always = function (response) {
						// On failure this will turn all images to placeholders
						update_images( [], [] );

						$('.boldgrid-loading-graphic-wrapper').fadeOut();

						// INSERT MARKUP
						if ( gridblock_data['api_insert'] ) {
							$deferred.resolve( gridblock_data['html-jquery'].wrapAll( '<div>' ).parent().html() );
						} else {
							$deferred.resolve( $this.find('.centered-content-boldgrid').html() );
						}

						parent.IMHWPB.Media.instance.toggle_insert_button(true);

					};

					$('.boldgrid-loading-graphic-wrapper').fadeIn();
					parent.IMHWPB.Media.instance.toggle_insert_button(false);

					$.ajax({
						'url' : ajaxurl,
						'dataType': "json",
						'data' : data,
						'method':"POST",
						'timeout': 15000 // sets timeout to 10 seconds
					}).success(success)
						.always(always);

					html = $deferred;
				} else {

					html = gridblock_data.html;
					if ( gridblock_data && gridblock_data['html-jquery'] ) {
						//Use the jquery html elem first
						html = gridblock_data['html-jquery'].wrapAll( '<div>' ).parent().html();
					} else if ( ! html ) {

						//Use the object.html second
						//if still not found use the html rendered on page
						html = $this.find('.centered-content-boldgrid').html();
					}

					// Final Check, Make sure image tags are not broken.
					html = self.validateImageTags( html );
				}

				//Only allow selecting due to image swapping
				return false;
			} );

			return html;
		}

	};

	$( function () {
		IMHWPB.Media.GridBlocks.init();
	});

})(jQuery);
