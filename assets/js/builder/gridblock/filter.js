var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var self = {

		configs: BoldgridEditor.gridblocks,

		removedGridlocks: {},

		validateConfigs: function() {
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

		storeImageReplacements: function( gridblockId ) {
			var imageReplacements = [];
			self.configs[ gridblockId ].$html.find( '[data-pending-boldgrid-attribution]' ).each( function() {
				imageReplacements.push( $( this ).data( 'boldgrid-asset-id' ) );
			} );

			self.configs[ gridblockId ].imageReplacements = imageReplacements;
		},

		configMethods: {
			getHtml: function() {
				return this.$html[0].outerHTML;
			},
			getPreviewHtml: function() {
				return this.$previewHtml[0].outerHTML;
			}
		},

		stripSampleData: function( gridblockId ) {
			var $html = self.configs[ gridblockId ].$html;

			//$html.find( 'img' ).removeAttr( 'src class' );
			$html.find( 'a' ).attr( 'href', '#' );
		},

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

		removeGridblock: function( gridblockId ) {
			self.removedGridlocks[ gridblockId ] = self.configs[ gridblockId ];
		},

		/**
		 * Remove images missing attributes.
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
				var $this = $( this );
				if ( ! $this.siblings().length ) {
					$hr = $this.find( 'hr' );
					if ( ! $hr.siblings().length ) {
						self.removeGridblock( gridblockId );
						return false;
					}
				}
			});

			//Hide empty rows
			$testDiv.find( '> .row:not(.row .row):only-of-type > [class^="col-"]:empty:only-of-type' ).each( function() {
				self.removeGridblock( gridblockId );
				return false;
			});
		}
	};

	BOLDGRID.EDITOR.GRIDBLOCK.Filter = self;
	BOLDGRID.EDITOR.GRIDBLOCK.Filter.validateConfigs();

} )( jQuery );
