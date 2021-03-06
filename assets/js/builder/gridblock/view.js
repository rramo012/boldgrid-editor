window.BOLDGRID = window.BOLDGRID || {};
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
			self.$filterSelectWrap = $( '.boldgrid-gridblock-categories' );
			self.gridblockTemplate = wp.template( 'boldgrid-editor-gridblock' );
			self.$filterSelect = self.$filterSelectWrap.find( 'select' );

			self.fetchTypes();

			self.findElements();
			self.positionGridblockContainer();
			self.setupUndoRedo();
			self.createGridblocks();
			BG.GRIDBLOCK.Loader.loadGridblocks();
			BG.GRIDBLOCK.Category.init();
			self.endlessScroll();
			self.templateClass = self.getTemplateClass();
		},

		/**
		 * Get remote Gridblock types.
		 *
		 * @since 1.6
		 */
		fetchTypes() {
			return $.ajax( {
				url: BoldgridEditor.plugin_configs.asset_server +
					BoldgridEditor.plugin_configs.ajax_calls.gridblock_types,
				dataType: 'json',
				timeout: 4000,
				data: {
					'release_channel': BoldgridEditor.boldgrid_settings.theme_release_channel,
					'key': BoldgridEditor.boldgrid_settings.api_key
				}
			} )
			.done( ( data ) => {
				this.setFilterOptions( data );
			} ).fail( () => {
				this.setFilterOptions();
			} );
		},

		/**
		 * Set the filters used for requests.
		 *
		 * @since 1.6
		 */
		setFilterOptions( additionalFilters ) {
			let html = '',
				allFilters = [],
				filters = BoldgridEditor.builder_config.gridblock.filters;

			additionalFilters = additionalFilters || [];
			allFilters = filters.concat( additionalFilters );

			for ( let filter of allFilters ) {
				html += '<option value="' + filter.slug + '">' + filter.title + '</option>';
			}

			self.$filterSelect.html( html );
			self.$filterSelectWrap.fadeIn();
		},

		/**
		 * Process for the opening of te gridblock UI.
		 *
		 * @since 1.6
		 */
		onOpen: function() {
			self.$gridblockSection.trigger( 'scroll' );
			self.updateCustomStyles();
		},

		/**
		 * Update all gridblocks with the latest custom styles.
		 *
		 * @since 1.6
		 */
		updateCustomStyles: function() {
			let stylesheetCss = BG.Service.styleUpdater.getStylesheetCss();

			_.each( BG.GRIDBLOCK.configs.gridblocks, ( gridblock ) => {
				if ( 'iframeCreated' === gridblock.state ) {
					gridblock.$iframeContents
						.find( '#boldgrid-custom-styles' )
						.html( stylesheetCss );
				}
			} );
		},

		/**
		 * Set Gridblock count.
		 *
		 * @since 1.5
		 */
		setGridblockCount: function() {
			let types = _.countBy( BOLDGRID.EDITOR.GRIDBLOCK.configs.gridblocks || [], 'type' );

			self.$gridblockSection.find( '.gridblocks' )
				.attr( 'my-gridblocks-count', ( types.saved || 0 ).toString() )
				.attr( 'library-gridblocks-count', ( types.library || 0 ).toString() );
		},

		/**
		 * Process when page loads.
		 *
		 * @since 1.5
		 */
		onLoad: function() {
			self.setupAddGridblock();
			BG.STYLE.Remote.getStyles( BoldgridEditor.site_url );
		},

		/**
		 * Check if we have enough grodblocks to display.
		 *
		 * @since 1.5
		 *
		 * @return {boolean} Whether or nor we should request more gridblocks.
		 */
		hasGridblocks: function() {
			var pending = 0;
			_.each( BG.GRIDBLOCK.configs.gridblocks, function( gridblock ) {
				if ( 'ready' === gridblock.state && BG.GRIDBLOCK.Category.canDisplayGridblock( gridblock ) ) {
					pending++;
				}
			} );

			// 5 is the threshold for requesting more gridblocks.
			return 5 <= pending;
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

				if ( diff < loadDistance && true === BG.CONTROLS.Section.sectionDragEnabled ) {
					self.updateDisplay();
				}
			}, 800 );

			self.$gridblockSection.on( 'scroll', throttled );
		},

		/**
		 * Update the display of Gridblocks.
		 *
		 * @since 1.5
		 */
		updateDisplay: function() {
			let isSaved = BG.GRIDBLOCK.Category.isSavedCategory( BG.GRIDBLOCK.Category.currentCategory );
			BG.GRIDBLOCK.Loader.loadGridblocks();

			if ( ! isSaved && ! self.hasGridblocks() ) {
				BG.GRIDBLOCK.Generate.fetch();
			}
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
					setTimeout( BG.CONTROLS.Section.enableSectionDrag, 600 );
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
			self.$pageTemplate = $( '#page_template' );
		},

		/**
		 * Get the class associated to templates.
		 *
		 * @since 1.5
		 *
		 * @return {string} class name.
		 */
		getTemplateClass: function() {
			var val = self.$pageTemplate.val() || 'default';
			val = val.split( '.' );
			return 'page-template-' + val[0];
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
				.addClass( 'mce-content-body entry-content centered-section' )
				.addClass( self.templateClass )
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
			let headMarkup = self.headMarkup;

			headMarkup += '<style id="boldgrid-custom-styles">' +
				BG.Service.styleUpdater.getCachedCss() + '</style>';

			$iframe.find( 'head' ).html( headMarkup );
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
			var markup, $gridblockContainer;

			if ( self.$gridblockSection ) {
				$gridblockContainer = self.$gridblockSection.find( '.gridblocks' );
				markup = self.generateInitialMarkup();
				$gridblockContainer.append( markup );
				self.$gridblockSection.trigger( 'scroll' );
				self.setGridblockCount();
			}
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
			gridblockData['requires_premium'] = -1 === BG.GRIDBLOCK.Generate.licenseTypes.indexOf( 'premium' );
			return self.gridblockTemplate( gridblockData );
		}
	};

	BG.GRIDBLOCK.View = self;
	$( BG.GRIDBLOCK.View.onLoad );

} )( jQuery );
