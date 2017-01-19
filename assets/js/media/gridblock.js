var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.MEDIA = BOLDGRID.EDITOR.MEDIA || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	self = {
		$tinymceBody : null,
		$gridblockSection : null,

		init : function () {
			self.findElements();
			self.positionGridblockContainer();
			self.bindHistoryEvents();
			self.createGridblocks();
		},

		bindHistoryEvents : function () {
			var $historyControls = $( '.history-controls' );

			$historyControls.find( '.redo-link' ).on('click', function() {
				tinymce.activeEditor.undoManager.redo();
				self.updateHistoryStates();
			} );
			$historyControls.find( '.undo-link' ).on('click', function() {
				tinymce.activeEditor.undoManager.undo();
				self.updateHistoryStates();
			} );
		},

		updateHistoryStates : function() {
			var $historyControls = $( '.history-controls' );
			$historyControls.find( '.redo-link' ).attr( 'disabled', ! tinymce.activeEditor.undoManager.hasRedo() );
			$historyControls.find( '.undo-link' ).attr( 'disabled', ! tinymce.activeEditor.undoManager.hasUndo() );
		},

		findElements : function () {
			self.$gridblockSection = $('.boldgrid-zoomout-section');
		},

		centerSections : function () {
			self.$gridblockSection.find('iframe').each( function () {
				var $this = $( this ),
					className = 'centered-section',
					$body = $this.contents().find('body'),
					$section = $body.find( '.boldgrid-section:only-of-type, .row:only-of-type' ),
					sectionHeight = $section.length ? $section.height() : false,
					iframeHeight = $this.height();

				// If the section height is larger than the iframe height.
				if ( sectionHeight && ( sectionHeight < iframeHeight ) ) {
					$body.addClass( className );
				}  else if ( sectionHeight !== false ) {
					$body.removeClass( className );
				}
			} );
		},

		positionGridblockContainer : function () {
			$('#wpcontent').after( self.$gridblockSection );
		},

		createGridblocks : function () {
			var markup = self.generateMarkup(),
				$gridblockContainer = self.$gridblockSection.find('.gridblocks');

			$gridblockContainer.html( markup );
			self.createIframes( $gridblockContainer );
			self.getThemeStyles();
		},

		addFrameStyles : function ( headMarkup ) {
			self.$gridblockSection.find('iframe').each( function () {
				var $this = $( this ),
					$iframe = $this.contents(),
					$head = $iframe.find('head');

				$head.html( headMarkup );
				$head.append( wp.template('gridblock-iframe-styles')() );
			} );
		},

		getThemeStyles : function () {
			var headMarkup = '';

			$.get( BoldgridEditor.site_url, function ( data ) {
				var $html = $('<div>').html( data );

				$html.find('link, style').each( function () {
					var $this = $( this ),
						markup = this.outerHTML,
						tagName = $this.prop('tagName');

					if ( 'LINK' === tagName && $this.attr('rel') !== 'stylesheet' ) {
						markup = '';
					}

					headMarkup += markup;
				} );

				self.addFrameStyles( headMarkup );
			} );
		},

		createIframes : function ( $gridblockContainer ) {
			$gridblockContainer.find('.gridblock').each( function () {
				var $this = $( this ),
					$iframe = $this.find( 'iframe' ).contents(),
					html = $this.find('.gridblock-html').html();

				$this.find('.gridblock-html').empty();
				$iframe.find('body').addClass( BoldgridEditor.body_class ).css('overflow', 'hidden').html( html );
				IMHWPB.Media.GridBlocks.translateImageUrls( $iframe.find('body') );
			} );
		},

		generateMarkup : function () {
			var gridblockSection;

			var markup = '';
			$.each( BoldgridEditor.gridblocks, function () {
				markup += wp.template('boldgrid-editor-gridblock')( {
					'html' : this.html
				} );
			} );

			return markup;
		}
	};

	BOLDGRID.EDITOR.MEDIA.Gridblock = self;
	$( BOLDGRID.EDITOR.MEDIA.Gridblock.init );

} )( jQuery );
