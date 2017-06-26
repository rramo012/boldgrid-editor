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
		$gridblockNav: null,
		headMarkup: false,
		siteMarkup: '',

		init: function() {
			self.findElements();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.createGridblocks();
			BG.GRIDBLOCK.Loader.loadGridblocks();
			BG.GRIDBLOCK.Category.init();
			self.endlessScroll();
		},

		onLoad: function() {
			self.setupAddGridblock();
			BG.STYLE.Remote.getStyles( BoldgridEditor.site_url );
		},

		emptyGridblockPool: function () {
			var pending = 0;
			_.each( BG.GRIDBLOCK.configs.gridblocks, function ( gridblock ) {
				if ( 'ready' === gridblock.state ) {
					pending++;
				}
			} );

			return pending < 5;
		},

		/**
		 * Setup infinite scroll of gridblocks.
		 *
		 * @since 1.4
		 */
		endlessScroll: function() {
			var throttled,
				loadDistance = 1500,
				$gridblocks = self.$gridblockSection.find( '.gridblocks' );

			throttled = _.throttle( function() {
				var scrollTop = self.$gridblockSection.scrollTop(),
					height = $gridblocks.height(),
					diff = height - scrollTop;

				if ( diff < loadDistance ) {
					BG.GRIDBLOCK.Loader.loadGridblocks();

					if ( self.emptyGridblockPool() ) {
						BG.GRIDBLOCK.Generate.fetch();
					}
				}
			}, 300 );

			self.$gridblockSection.on( 'scroll', throttled );
		},

		/**
		 * When clicking on the add gridblock button. Switch to visual tab before opening.
		 *
		 * @since 1.4
		 */
		setupAddGridblock: function() {
			$( '#insert-gridblocks-button' ).on( 'click', function() {
				$( '.wp-switch-editor.switch-tmce' ).click();
				if ( ! BG.CONTROLS.Section.$container ) {
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
			self.$gridblockNav = $( '.zoom-navbar' );
		},

		/**
		 * Center a single section.
		 *
		 * @since 1.4
		 *
		 * @param  {jQuery} $this Iframe to center.
		 */
		centerSection: function( $iframe, $contents ) {
			var className = 'centered-section',
				$body = $contents.find( 'body' ),
				$section = $body.find( '> .boldgrid-section' ),
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
				.addClass( 'mce-content-body entry-content' )
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
			self.$gridblockSection.trigger( 'scroll' );
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
				if ( ! this.state ) {
					this.state = 'ready';
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
				'type': gridblockData.type,
				'category': gridblockData.category,
				'template': gridblockData.template
			} );
		}
	};

	BG.GRIDBLOCK.View = self;
	$( BG.GRIDBLOCK.View.onLoad );

} )( jQuery );
