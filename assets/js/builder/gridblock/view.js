var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles setting up the Gridblocks view.
 */
( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {
		$tinymceBody: null,
		headMarkup: '',
		$gridblockSection: null,
		openInit: false,

		init: function() {
			self.findElements();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.setupAddGridblock();
			self.createGridblocks();
		},

		/**
		 * When clicking on the add gridblock button. Switch to visual tab before opening.
		 *
		 * @since 1.4
		 */
		setupAddGridblock: function() {
			$( '#insert-gridblocks-button' ).on( 'click', function() {
				if ( ! BG.CONTROLS.Section.$container ) {
					$( '.wp-switch-editor' ).click();
					setTimeout( BG.CONTROLS.Section.enableSectionDrag, 300 );
				} else {
					BG.CONTROLS.Section.enableSectionDrag();
				}

			} );
		},

		/**
		 * Run this function the first time the view is open.
		 *
		 * @since 1.4
		 */
		firstOpen: function() {
			if ( false === self.openInit ) {
				self.openInit = true;
				BG.GRIDBLOCK.View.centerSections();
				BG.GRIDBLOCK.Remote.loadRemoteGridblocks();
			}
		},

		/**
		 * Bind the click event of the undo and redo buttons.
		 *
		 * @since 1.4
		 */
		setupUndoRedo: function() {
			var $historyControls = $( '.history-controls' );

			$historyControls.find( '.redo-link' ).on( 'click', function() {
				tinymce.activeEditor.undoManager.redo();
				$( window ).trigger( 'resize' );
				self.updateHistoryStates();
			} );
			$historyControls.find( '.undo-link' ).on( 'click', function() {
				tinymce.activeEditor.undoManager.undo();
				$( window ).trigger( 'resize' );
				self.updateHistoryStates();
			} );
		},

		/**
		 * Update the undo/redo disabled states.
		 *
		 * @since 1.4
		 */
		updateHistoryStates: function() {
			var $historyControls = $( '.history-controls' );
			$historyControls.find( '.redo-link' ).attr( 'disabled', ! tinymce.activeEditor.undoManager.hasRedo() );
			$historyControls.find( '.undo-link' ).attr( 'disabled', ! tinymce.activeEditor.undoManager.hasUndo() );
		},

		/**
		 * Assign all closure propeties.
		 *
		 * @since 1.4
		 */
		findElements: function() {
			self.$gridblockSection = $( '.boldgrid-zoomout-section' );
		},

		/**
		 * Center align the content of all gridblock options.
		 *
		 * @since 1.4
		 */
		centerSections: function() {
			self.$gridblockSection.find( 'iframe' ).each( function() {
				self.centerSection( $( this ) );
			} );
		},

		/**
		 * Center a single section.
		 *
		 * @since 1.4
		 *
		 * @param  {jQuery} $this Iframe to center.
		 */
		centerSection: function( $this ) {
			var className = 'centered-section',
				$body = $this.contents().find( 'body' ),
				$section = $body.find( '.boldgrid-section:only-of-type, .row:only-of-type' ),
				sectionHeight = $section.length ? $section.height() : false,
				iframeHeight = $this.height();

			// If the section height is larger than the iframe height.
			if ( sectionHeight && ( sectionHeight < iframeHeight ) ) {
				$body.addClass( className );
			}  else if ( false !== sectionHeight ) {
				$body.removeClass( className );
			}
		},

		/**
		 * Move the Gridblock section under the wp-content div.
		 *
		 * @since 1.4
		 */
		positionGridblockContainer: function() {
			$( '#wpcontent' ).after( self.$gridblockSection );
		},

		/**
		 * Create a list of GridBlocks.
		 *
		 * @since 1.4
		 */
		createGridblocks: function() {
			var markup = self.generateInitialMarkup(),
				$gridblockContainer = self.$gridblockSection.find( '.gridblocks' );

			$gridblockContainer.append( markup );
			self.createIframes( $gridblockContainer );
			self.applyStyles();
		},

		/**
		 * Add css to each iframe.
		 *
		 * @since 1.4
		 */
		addFrameStyles: function() {
			self.$gridblockSection.find( '[data-styles="0"]' ).each( function() {
				var $this = $( this ),
					$iframe = $this.find( 'iframe' ),
					$head = $iframe.contents().find( 'head' );

				$head.html( self.headMarkup );
				self.centerSection( $iframe );

				$iframe.on( 'load', function() {
					if ( self.headMarkup ) {
						$this.attr( 'data-styles', 1 );
						$head.html( self.headMarkup );
						self.centerSection( $iframe );
					}
				} );
			} );
		},

		/**
		 * Fetch the from front end and apply them.
		 *
		 * @since 1.4
		 */
		applyStyles: function() {
			if ( self.addedStyles ) {
				self.addFrameStyles();
				return;
			}

			self.headMarkup = '';
			$.get( BoldgridEditor.site_url, function( siteMarkup ) {
				self.headMarkup = self.getHeadStyles( siteMarkup );
				self.addFrameStyles();
				self.addedStyles = true;

				self.$gridblockSection.find( '[data-styles="0"]' ).attr( 'data-styles', 1 );
			} );
		},

		/**
		 * Given markup for a site, get all of the stylesheets.
		 *
		 * @since 1.4
		 *
		 * @param string siteMarkup Markup for an Entire site.
		 * @return string Head markup that represents the styles.
		 */
		getHeadStyles: function( siteMarkup ) {
			var $html = $( '<div>' ).html( siteMarkup ),
				headMarkup = '';

			$html.find( 'link, style' ).each( function() {
				var $this = $( this ),
					markup = this.outerHTML,
					tagName = $this.prop( 'tagName' );

				if ( 'LINK' === tagName && 'stylesheet' !== $this.attr( 'rel' ) ) {
					markup = '';
				}

				headMarkup += markup;
			} );

			headMarkup += wp.template( 'gridblock-iframe-styles' )();

			return headMarkup;
		},

		/**
		 * Create all iframes within the gridblocks.
		 *
		 * @since 1.4
		 *
		 * @param  jQuery $gridblockContainer Container of Gridblocks.
		 */
		createIframes: function( $gridblockContainer ) {
			$gridblockContainer.find( '[data-gridblock="0"]' ).each( function() {
				var load,
					$gridblock = $( this ),
					$iframe = $( '<iframe></iframe>' ),
					html = $gridblock.find( '.gridblock-html' ).html();

				$gridblock.prepend( $iframe );

				$gridblock.find( '.gridblock-html' ).empty();
				$gridblock.attr( 'data-gridblock', 1 );

				load = function() {
					$iframe.contents()
						.find( 'body' )
						.addClass( BoldgridEditor.body_class )
						.addClass( 'mce-content-body' )
						.css( 'overflow', 'hidden' )
						.html( html );

					$iframe.contents().find( 'head' ).html( self.headMarkup );
				};

				load();
				$iframe.on( 'load', load );
			} );
		},

		/**
		 * Create the markup for each GridBlock that we already have in our system.
		 *
		 * @since 1.4
		 *
		 * @return string markup All the HTML needed for the initial load of the gridblocks view.
		 */
		generateInitialMarkup: function() {
			var markup = '';
			$.each( BG.GRIDBLOCK.configs.gridblocks, function() {
				if ( ! this.rendered ) {
					this.rendered = true;
					markup += self.getGridblockHtml( this );
				}
			} );

			return markup;
		},

		/**
		 * Get the html for a GridBlock.
		 *
		 * @since 1.4
		 *
		 * @param  {Object} gridblockData Gridblock Info
		 * @return {string}               Markup to add in gridblock iframe.
		 */
		getGridblockHtml: function( gridblockData ) {
			return wp.template( 'boldgrid-editor-gridblock' )( {
				'id': gridblockData.gridblockId,
				'html': gridblockData.getPreviewHtml()
			} );
		}
	};

	BG.GRIDBLOCK.View = self;
	$( BG.GRIDBLOCK.View.init );

} )( jQuery );
