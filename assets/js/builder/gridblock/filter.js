var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

		configs: BoldgridEditor.gridblocks,

		removedGridlocks: {},

		/**
		 * Setup the GridBlock configuration.
		 *
		 * @since 1.4
		 */
		setupConfigs: function() {
			BG.GRIDBLOCK.configs = {};
			BG.GRIDBLOCK.configs.gridblocks = {};

			$.each( self.configs, function( gridblockId ) {
				this.$html = $( this.html );
				this.$previewHtml = $( this['preview-html'] );

				self.removeInvalidGridblocks( this, gridblockId );
				self.stripSampleData( gridblockId );

				self.translateImageUrls( this.$html );
				self.translateImageUrls( this.$previewHtml );
			} );

			self.setConfig();
		},

		/**
		 * Schedule any invalid gridblocks for removal.
		 *
		 * @since 1.4
		 *
		 * @param  {Object} gridblock   Config for Gridblock.
		 * @param  {integer} gridblockId Index of Gridblock
		 */
		removeInvalidGridblocks: function( gridblock, gridblockId ) {
			var hasFailedDynamic, isSimpleGridblock;

			hasFailedDynamic = self.hasFailedDynamic( gridblock.$html );
			isSimpleGridblock = self.isSimpleGridblock( gridblock.$html );

			if ( isSimpleGridblock || hasFailedDynamic ) {
				self.removeGridblock( gridblockId );
			}
		},

		/**
		 * Find the images that need to be replaced and update the object.
		 *
		 * @since 1.4
		 *
		 * @param  {integer} gridblockId Index of Gridblock in config.
		 */
		storeImageReplacements: function( gridblockId ) {
			var imageReplacements = [],
				config = BG.GRIDBLOCK.configs.gridblocks,
				gridblock = config[ gridblockId ];

			config[ gridblockId ].$html.find( '[data-pending-boldgrid-attribution]' ).each( function() {
				imageReplacements.push( $( this ).data( 'boldgrid-asset-id' ) );
			} );

			if ( gridblock.build_profile_id ) {
				gridblock.$html.find( 'img[data-imhwpb-asset-id]' ).each( function() {
					imageReplacements.push( $( this ).data( 'imhwpb-asset-id' ) );
				} );
			}

			config[ gridblockId ].imageReplacements = imageReplacements;
		},

		/**
		 * Config Methods.
		 *
		 * These are merged into the config object.
		 *
		 * @type {Object}
		 */
		configMethods: {

			/**
			 * Get the jQuery HTML Object.
			 * @return {jQuery} HTML to be added to the page.
			 */
			getHtml: function() {
				return this.$html[0].outerHTML;
			},

			/**
			 * Get the jQuery Preview Object.
			 * @return {jQuery} HTML to be added to be previewed.
			 */
			getPreviewHtml: function() {
				return this.$previewHtml[0].outerHTML;
			},

			/**
			 * Create a placeholder based on the preview object.
			 * @return {jQuery} Element to preview with loading element nested.
			 */
			getPreviewPlaceHolder: function() {
				var $clone = this.$previewHtml.clone();
				$clone.prepend( wp.template( 'boldgrid-editor-gridblock-loading' )() );

				return $clone;
			}
		},

		/**
		 * Remove links from anchors.
		 *
		 * @since 1.4
		 *
		 * @param  {integer} gridblockId Index of gridblock.
		 */
		stripSampleData: function( gridblockId ) {
			var $html = self.configs[ gridblockId ].$html;

			//$html.find( 'img' ).removeAttr( 'src class' );
			$html.find( 'a' ).attr( 'href', '#' );
		},

		/**
		 * Store the configuration into a new object.
		 *
		 * @since 1.4
		 */
		setConfig: function() {
			$.each( self.configs, function( gridblockId ) {
				if ( ! self.removedGridlocks[ gridblockId ] ) {
					delete this.html;
					delete this['preview-html'];
					this.gridblockId = gridblockId;
					this.uniqueMarkup = self.createUniqueMarkup( this.$html );
					_.extend( this, self.configMethods );
					BG.GRIDBLOCK.configs.gridblocks[ gridblockId ] = this;
					self.storeImageReplacements( gridblockId );
				}
			} );
		},

		/**
		 * Add a single Gridblock Object to the config.
		 *
		 * @since 1.4
		 *
		 * @param {Object} gridblockData Gridblock Info.
		 * @param {number} index         Index of gridblock in api return.
		 */
		addGridblockConfig: function( gridblockData, index ) {
			var gridblockId = 'remote-' + index;

			gridblockData.gridblockId = gridblockId;
			gridblockData.$html = gridblockData['html-jquery'];
			gridblockData.$previewHtml = gridblockData['preview-html-jquery'];

			delete gridblockData.html;
			delete gridblockData['preview-html'];
			delete gridblockData['html-jquery'];
			delete gridblockData['preview-html-jquery'];

			_.extend( gridblockData, self.configMethods );
			BG.GRIDBLOCK.configs.gridblocks[ gridblockId ] = gridblockData;

			gridblockData.dynamicImages = BG.GRIDBLOCK.Remote.profileImageData( gridblockData );
			self.storeImageReplacements( gridblockId );
		},

		/**
		 * Remove gridblock from config.
		 *
		 * @since 1.4
		 *
		 * @param  {number} gridblockId Index of gridblock.
		 */
		removeGridblock: function( gridblockId ) {
			self.removedGridlocks[ gridblockId ] = self.configs[ gridblockId ];
		},

		/**
		 * Remove any gridblocks from the config that did not get converted properly.
		 *
		 * @since 1.4
		 *
		 * @param {number} gridblockId Index of gridblock.
		 */
		hasFailedDynamic: function( $html ) {
			var hasFailedDynamic = false;
			$html.find( 'img' ).each( function() {
				var $this = $( this ),
					src = $this.attr( 'src' );

				if ( src && src.indexOf( '//wp-preview' ) > -1 && ! $this.attr( 'data-id-from-provider' ) ) {
					hasFailedDynamic = true;
					return false;
				}
			});

			return hasFailedDynamic;
		},

		/**
		 * Create a string that will be used to check if 2 griblocks are the sameish.
		 *
		 * @since 1.4
		 *
		 * @param  {jQuery} $element Element to create string for.
		 * @return {string}          String with whitespace rmeoved.
		 */
		createUniqueMarkup: function( $element ) {
			$element = $element.clone();
			$element.find( 'img' ).removeAttr( 'src' ).removeAttr( 'class' );
			return $element[0].outerHTML.replace( /\s/g, '' );
		},

		/**
		 * Add the src attributes for images that need them.
		 *
		 * @since 1.2
		 */
		translateImageUrls: function( $context ) {
			var $imagesToTranslate = $context.find( '[data-boldgrid-asset-id]' );

			$imagesToTranslate.each( function() {
				var imageUrl,
					$this = $( this ),
					assetId = $this.data( 'boldgrid-asset-id' );

				if ( IMHWPB.configs && IMHWPB.configs.api_key ) {

					// If the user has an API key place the asset images.
					imageUrl = IMHWPB.configs.asset_server +
						IMHWPB.configs.ajax_calls.get_asset + '?key=' +
						IMHWPB.configs.api_key + '&id=' + assetId;

					$this.attr( 'src', imageUrl );
					$this.attr( 'data-pending-boldgrid-attribution', 1 );
				} else {

					// Otherwise insert place holders.
					self.setPlaceholderSrc( $this );
				}
			} );
		},

		/**
		 * Swap image with a placeholder from placehold.it
		 *
		 * @since 1.0
		 */
		setPlaceholderSrc: function( $this ) {

			// Default to 300.
			var width = ( $this.attr( 'width' ) ) ? $this.attr( 'width' ) : '300',
				height = ( $this.attr( 'height' ) ) ? $this.attr( 'height' ) : '300';

			$this.attr( 'src', '//placehold.it/' + width + 'x' + height + '/cccccc/' );
		},

		removeAttributionAttributes: function( $image ) {
			$image.removeAttr( 'data-boldgrid-asset-id' )
				  .removeAttr( 'data-pending-boldgrid-attribution' );
		},

		/**
		 * Remove Gridblocks that should not be aviailable to users.
		 *
		 * @since 1.4
		 *
		 * @param  {number} gridblockId Index of gridblock.
		 */
		isSimpleGridblock: function( $html ) {
			var valid_num_of_descendents = 3,
				isSimpleGridblock = false,
				$testDiv = $( '<div>' ).html( $html.clone() );

			// Remove spaces from the test div. Causes areas with only spacers to fail tests.
			$testDiv.find( '.mod-space' ).remove();

			$testDiv.find( '.row:not(.row .row)' ).each( function() {
				var $descendents,
					$this = $( this );

				if ( ! $this.siblings().length  ) {
					$descendents = $this.find( '*' );
					if ( $descendents.length <= valid_num_of_descendents ) {
						isSimpleGridblock = true;
						return false;
					}
				}
			});

			$testDiv.find( '.row:not(.row .row) > [class^="col-"] > .row' ).each( function() {
				var $hr,
					$this = $( this );

				if ( ! $this.siblings().length ) {
					$hr = $this.find( 'hr' );
					if ( ! $hr.siblings().length ) {
						isSimpleGridblock = true;
						return false;
					}
				}
			});

			// Hide empty rows.
			$testDiv.find( '.row:not(.row .row):only-of-type > [class^="col-"]:empty:only-of-type' ).each( function() {
				isSimpleGridblock = true;
				return false;
			});

			return isSimpleGridblock;
		}
	};

	BG.GRIDBLOCK.Filter = self;
	BG.GRIDBLOCK.Filter.setupConfigs();

} )( jQuery );
