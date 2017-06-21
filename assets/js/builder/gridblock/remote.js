var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

(function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

		hasLoadedRemote: false,

		/**
		 * Load remote gridblocks. Only done once.
		 *
		 * @since 1.4
		 */
		loadRemoteGridblocks: function() {
			if ( false === self.hasLoadedRemote ) {
				self.hasLoadedRemote = true;
				self.fetchRemoteGridblocks();
			}
		},

		/**
		 * Remove any extra markup from a gridblock.
		 *
		 * @since 1.4
		 *
		 * @param  {Object} gridblockData Gridblock Info.
		 * @return {Object}               Gridblock Info.
		 */
		stripUneededMarkup: function( gridblockData ) {

			//Strip classes for both preview markup and html to insert
			$.each( ['html', 'preview-html'], function() {

				var $html = $( gridblockData[ this ] );
				$html.find( 'img' ).removeClass(function( index, css ) {
					return ( css.match( /(^|\s)wp-image-\S+/g ) || []).join( ' ' );
				}).each( function() {

					//Unwrap all links from images
					var $this = $( this );
					if ( $this.parent().is( 'a' ) ) {
						$this.unwrap();
					}
				});

				gridblockData[ this + '-jquery' ] = $html;
				gridblockData[ this ] = $html.wrapAll( '<div>' ).parent().html();
			});

			return gridblockData;
		},

		/**
		 * Check if a gridblock config already exists in our system.
		 *
		 * @since 1.4
		 *
		 * @param {Object} newGridblock Gridblock data.
		 */
		isUniqueGridblock: function( newGridblock ) {
			var isUniqueGridblock = true,
				$html = newGridblock['html-jquery'].clone();

			$html.find( 'img' ).removeAttr( 'src class' );
			$html.find( 'a' ).removeAttr( 'href' );

			newGridblock.uniqueMarkup = BG.GRIDBLOCK.Filter.createUniqueMarkup( $html );

			$.each( BG.GRIDBLOCK.configs.gridblocks, function() {
				if ( newGridblock.uniqueMarkup === this.uniqueMarkup ) {
					isUniqueGridblock = false;
					return false;
				}
			});

			return isUniqueGridblock;
		},

		/**
		 * Add a set of Gridblocks if they passed the tests, to the final config.
		 *
		 * @since 1.4
		 *
		 * @param {Array} newGridblocks A set of gridblocks to add.
		 */
		validateGridblock: function( newGridblocks ) {
			$.each( newGridblocks, function( index ) {
				var isUnique = self.isUniqueGridblock( this ),
					isSimpleGridblock = BG.GRIDBLOCK.Filter.isSimpleGridblock( this['html-jquery'] ),
					hasFailedDynamic = BG.GRIDBLOCK.Filter.hasFailedDynamic( this['html-jquery'] );

				if ( isUnique && ! hasFailedDynamic && ! isSimpleGridblock ) {
					BG.GRIDBLOCK.Filter.addGridblockConfig( this, index );
				}
			} );
		},

		/**
		 * Handle showing the loading graphic.
		 *
		 * @since 1.4
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
		 * Grab gridblocks from API.
		 *
		 * @since 1.4
		 */
		fetchRemoteGridblocks: function() {
			var data, always, done,
				self = this;

			//Make Api Call to return array
			data = {
				'action': 'boldgrid_gridblock_html',
				'boldgrid_gridblock_image_html_nonce': BoldgridEditor.grid_block_html_nonce,
				'post_id': BoldgridEditor.post_id
			};

			self.gridblockLoadingUI.start();

			always = function() {
				self.gridblockLoadingUI.finish();
			};

			done = function( response ) {
				var newGridblocks = [];
				if ( response.success && response.gridblocks ) {
					$.each( response.gridblocks, function() {
						var gridblockData = this;

						// Remove wp-image classes from markup.
						// Remove wrapping image links.
						gridblockData = self.stripUneededMarkup( gridblockData );

						if ( gridblockData ) {
							newGridblocks.push( gridblockData );
						}
					});

					self.validateGridblock( newGridblocks );
					BG.GRIDBLOCK.View.createGridblocks();
				}

			};

			$.ajax({
				'url': ajaxurl,
				'dataType': 'json',
				'data': data,
				'method':'POST'
			}).always( always )
			  .done( done );
		},

		/**
		 * Given a chunk of markup to install, scan all the images to see which ones are DYNAMIC AND need to be installed.
		 *
		 * @since 1.4
		 *
		 * @param  {Object} gridblockData Gridblock data return from API call.
		 * @return {Object} dynamicImages List of images that need replacing.
		 */
		profileImageData: function( gridblockData ) {
			var dynamicImages = [];
			if ( gridblockData && gridblockData.build_profile_id ) {
				gridblockData.$html.find( 'img' ).each( function() {
					var random, data,
						$this = $( this ),
						dynamicImage = $this.attr( 'data-imhwpb-built-photo-search' ),
						imageProviderId = $this.attr( 'data-image-provider-id' ),
						idFromProvider = $this.attr( 'data-id-from-provider' );

					if ( dynamicImage && ! this.boldgrid_updated_src ) {
						random = getRandomNumber();
						data = {
							'post_id': BoldgridEditor.post_id,
							'id_from_provider': idFromProvider,
							'image_provider_id': imageProviderId,
							'rand_image_id': random
						};

						//Save a random to the element so that we now which src goes to which image
						this.boldgrid_rand_image_id = random;

						dynamicImages.push( data );
					}
				});
			}

			return dynamicImages;
		}

	};

	/**
	 * Get a random number to identify an image.
	 *
	 * @since 1.4
	 *
	 * @return {string} Radnom id for an image.
	 */
	function getRandomNumber() {
		return Math.random().toString().replace( '0.', '' ).substring( 0, 8 );
	}

	BG.GRIDBLOCK.Remote = self;

})( jQuery );
