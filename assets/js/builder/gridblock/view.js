var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

/**
 * Handles setting up the Gridblocks view.
 */
( function( $ ) {
	'use strict';

	var self = {
		$tinymceBody: null,
		headMarkup: '',
		$gridblockSection: null,

		init: function() {
			self.findElements();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.createGridblocks();
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
				self.updateHistoryStates();
			} );
			$historyControls.find( '.undo-link' ).on( 'click', function() {
				tinymce.activeEditor.undoManager.undo();
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
				var $this = $( this ),
					className = 'centered-section',
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
			} );
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

			$gridblockContainer.html( markup );
			self.createIframes( $gridblockContainer );
			self.applyStyles();
		},

		/**
		 * Add css to each iframe.
		 *
		 * @since 1.4
		 */
		addFrameStyles: function() {
			self.$gridblockSection.find( 'iframe' ).each( function() {
				$( this ).contents().find( 'head' ).html( self.headMarkup );
			} );
		},

		/**
		 * Fetch the from front end and apply them.
		 *
		 * @since 1.4
		 */
		applyStyles: function() {
			self.headMarkup = '';

			$.get( BoldgridEditor.site_url, function( siteMarkup ) {
				self.headMarkup = self.getHeadStyles( siteMarkup );

				self.addFrameStyles();
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
			$gridblockContainer.find( '.gridblock' ).each( function() {
				var $this = $( this ),
					$iframe = $this.find( 'iframe' ).contents(),
					html = $this.find( '.gridblock-html' ).html();

				$this.find( '.gridblock-html' ).empty();
				$iframe.find( 'body' )
					.addClass( BoldgridEditor.body_class )
					.addClass( 'mce-content-body' )
					.css( 'overflow', 'hidden' )
					.html( html );
			} );
		},

		/**
		 * Create the markup for each GridBlock taht we already have in our system.
		 *
		 * @since 1.4
		 *
		 * @return string markup All the HTML needed for the initial load of the gridblocks view.
		 */
		generateInitialMarkup: function() {
			var markup = '';
			$.each( BOLDGRID.EDITOR.GRIDBLOCK.configs.gridblocks, function( id ) {
				markup += wp.template( 'boldgrid-editor-gridblock' )( {
					'id': id,
					'html': this.getPreviewHtml()
				} );
			} );

			return markup;
		}
	};

	BOLDGRID.EDITOR.GRIDBLOCK.View = self;
	$( BOLDGRID.EDITOR.GRIDBLOCK.View.init );

} )( jQuery );
