var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.MEDIA = BOLDGRID.EDITOR.MEDIA || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	self = {

		init : function () {
			this.registerListeners();
		},

		registerListeners : function () {
			$( self.createGridblocks );
		},

		createGridblocks : function () {
			var markup = self.generateMarkup(),
				$gridblockContainer = $('.boldgrid-zoomout-section .gridblocks');

			$gridblockContainer.html( markup );
			self.createIframes( $gridblockContainer );
			self.getThemeStyles();
		},

		addFrameStyles : function ( headMarkup ) {
			$('.boldgrid-zoomout-section iframe').each( function () {
				var $this = $( this ),
					$iframe = $this.contents();

				$iframe.find('head').html( headMarkup );
			} );
		},

		getThemeStyles : function () {
			var headMarkup = '';

			$.get( BoldgridEditor.site_url, function ( data ) {
				var $html = $('<div>').html( data );

				$html.find('link').each( function () {
					var $this = $( this );
					if ( $this.attr('rel') === 'stylesheet' ) {
						headMarkup += this.outerHTML;
					}
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
				$iframe.find('body').css('overflow', 'hidden').html( html );
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
		},

		onOpenGridblock : function () {

		}

	};

	BOLDGRID.EDITOR.MEDIA.Gridblock = self;
	BOLDGRID.EDITOR.MEDIA.Gridblock.init();

} )( jQuery );
