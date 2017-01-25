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
		$gridblockSection: null,
		headMarkup: false,
		siteMarkup: '',

		init: function() {
			self.findElements();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.createGridblocks();
		},

		onLoad: function() {
			self.setupAddGridblock();
			self.getStyles();
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
		 * Center a single section.
		 *
		 * @since 1.4
		 *
		 * @param  {jQuery} $this Iframe to center.
		 */
		centerSection: function( $iframe ) {
			var className = 'centered-section',
				$body = $iframe.find( 'body' ),
				$section = $body.find( '.boldgrid-section:only-of-type, .row:only-of-type' ),
				sectionHeight = $section.length ? $section.height() : false,
				iframeHeight = $iframe.height();

			// If the section height is larger than the iframe height.
			if ( sectionHeight && ( sectionHeight < iframeHeight ) ) {
				$body.addClass( className );
			}  else if ( false !== sectionHeight ) {
				$body.removeClass( className );
			}
		},

		/**
		 * Add body classes to iframe..
		 *
		 * @since 1.4
		 *
		 * @param {jQuery} $iframe iFrame
		 */
		addBodyClasses: function( $iframe ) {
			$iframe.find( 'body' )
				.addClass( BoldgridEditor.body_class )
				.addClass( 'mce-content-body' )
				.css( 'overflow', 'hidden' );
		},

		/**
		 * Add styles to iframe.
		 *
		 * @since 1.4
		 *
		 * @param {jQuery} $iframe iFrame
		 */
		addStyles: function( $iframe ) {
			$iframe.find( 'head' ).html( self.headMarkup );
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
			BG.GRIDBLOCK.Loader.loadGridblocks();
		},

		/**
		 * Fetch the from front end and apply them.
		 *
		 * @since 1.4
		 */
		getStyles: function() {
			$.get( BoldgridEditor.site_url, function( siteMarkup ) {
				var $window = $( window );
				self.siteMarkup = siteMarkup;
				self.headMarkup = self.getHeadStyles( siteMarkup );

				$window.trigger( 'boldgrid_page_html', self.siteMarkup );
				$window.trigger( 'boldgrid_head_styles', self.headMarkup );
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
	$( BG.GRIDBLOCK.View.onLoad );

} )( jQuery );
