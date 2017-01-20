var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var self = {

		configs: BoldgridEditor.gridblocks,

		removedGridlocks: {},

		/**
		 * Setup the GridBlock configuration.
		 *
		 * @since 1.4
		 */
		setupConfigs: function() {
			BOLDGRID.EDITOR.GRIDBLOCK.configs = {};
			BOLDGRID.EDITOR.GRIDBLOCK.configs.gridblocks = {};

			$.each( self.configs, function( gridblockId ) {
				this.$html = $( this.html );
				this.$previewHtml = $( this['preview-html'] );

				self.removeFailedDynamic( gridblockId );
				self.removeSimpleGridblocks( gridblockId );
				self.stripSampleData( gridblockId );

				IMHWPB.Media.GridBlocks.translateImageUrls( this.$html );
				IMHWPB.Media.GridBlocks.translateImageUrls( this.$previewHtml );
				self.storeImageReplacements( gridblockId );
			} );

			self.setConfig();
		},

		/**
		 * Find the images that need to be replaced and update the object.
		 *
		 * @since 1.4
		 *
		 * @param  {integer} gridblockId Index of Gridblock in config.
		 */
		storeImageReplacements: function( gridblockId ) {
			var imageReplacements = [];
			self.configs[ gridblockId ].$html.find( '[data-pending-boldgrid-attribution]' ).each( function() {
				imageReplacements.push( $( this ).data( 'boldgrid-asset-id' ) );
			} );

			self.configs[ gridblockId ].imageReplacements = imageReplacements;
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
					_.extend( this, self.configMethods );
					BOLDGRID.EDITOR.GRIDBLOCK.configs.gridblocks[ gridblockId ] = this;
				}
			} );
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
		removeFailedDynamic: function( gridblockId ) {
			self.configs[ gridblockId ].$html.find( 'img' ).each( function() {
				var $this = $( this ),
					src = $this.attr( 'src' );

				if ( src && src.indexOf( '//wp-preview' ) > -1 && ! $this.attr( 'data-id-from-provider' ) ) {
					self.removeGridblock( gridblockId );
					return false;
				}
			});
		},

		/**
		 * Remove Gridblocks that should not be aviailable to users.
		 *
		 * @since 1.4
		 *
		 * @param  {number} gridblockId Index of gridblock.
		 */
		removeSimpleGridblocks: function( gridblockId ) {
			var valid_num_of_descendents = 3,
				$testDiv = $( '<div>' ).html( self.configs[ gridblockId ].$html );

			$testDiv.find( '.row:not(.row .row) > [class^="col-"] > hr' ).each( function() {
				if ( ! $( this ).siblings().length ) {
					self.removeGridblock( gridblockId );
					return false;
				}
			});

			$testDiv.find( '.row:not(.row .row)' ).each( function() {
				var $descendents,
					$this = $( this );

				if ( ! $this.siblings().length  ) {
					$descendents = $this.find( '*' );
					if ( $descendents.length <= valid_num_of_descendents ) {
						self.removeGridblock( gridblockId );
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
						self.removeGridblock( gridblockId );
						return false;
					}
				}
			});

			// Hide empty rows.
			$testDiv.find( '> .row:not(.row .row):only-of-type > [class^="col-"]:empty:only-of-type' ).each( function() {
				self.removeGridblock( gridblockId );
				return false;
			});
		}
	};

	BOLDGRID.EDITOR.GRIDBLOCK.Filter = self;
	BOLDGRID.EDITOR.GRIDBLOCK.Filter.setupConfigs();

} )( jQuery );
