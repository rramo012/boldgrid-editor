BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.STYLE = BOLDGRID.EDITOR.STYLE || {};

/**
 * Handles setting up the Gridblocks view.
 */
( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

			/**
			 * Fetch the from front end and apply them.
			 *
			 * @since 1.4
			 */
			getStyles: function( url ) {
				$.get( url, function( siteMarkup ) {
					var $window = $( window );
					self.siteMarkup = siteMarkup;
					self.fetchStyles( siteMarkup ).done( function( markup ) {
						BG.GRIDBLOCK.View.headMarkup = markup;
						$window.trigger( 'boldgrid_page_html', self.siteMarkup );
						$window.trigger( 'boldgrid_head_styles', self.headMarkup );
					} );
				} );
			},

			/**
			 * Depending on the browser. Use a different method for loading the styles.
			 *
			 * @return {$.Deferred} Deferred jquery element to be resolved when styles are retreived.
			 */
			fetchStyles: function( siteMarkup ) {
				var $deferred;

				// Disabled, fonts font work ( relative paths in styles )
				//IIf ( 'Firefox' !== BOLDGRID.EDITOR.Controls.browser ) {
				//	$deferred = self.getHeadDownloaded( siteMarkup );
				//} else {

					$deferred = self.getHeadElements( siteMarkup );

				//}

				return $deferred;
			},

			/**
			 * Given markup for a site, get all of the stylesheets.
			 *
			 * @since 1.4
			 *
			 * @param string siteMarkup Markup for an Entire site.
			 * @return string Head markup that represents the styles.
			 */
			getHeadElements: function( siteMarkup ) {
				var $html, headMarkup;

				siteMarkup = siteMarkup.replace( /<body\b[^<]*(?:(?!<\/body>)<[^<]*)*<\/body>/, '' );
				$html = $( '<div>' ).html( siteMarkup );
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

				return $.Deferred().resolve( headMarkup );
			},

			/**
			 * Given markup for a site, get all of the stylesheets markup.
			 *
			 * @since 1.4
			 *
			 * @param string siteMarkup Markup for an Entire site.
			 * @return string Head markup that represents the styles.
			 */
			getHeadDownloaded: function( siteMarkup ) {
				var $html = $( '<div>' ).html( siteMarkup ),
					$deffered = $.Deferred(),
					styles = [],
					pending = [];

				var markAsResolved = function( styleIndex ) {
					var index = pending.indexOf( styleIndex );
					if ( -1 < index ) {
						pending.splice( index, 1 );
					}
				};

				var getMarkup = function() {
					var markup = '';

					$.each( styles, function() {
						if ( ! this.html ) {
							return;
						}

						if ( 'LINK' === this.tagName ) {
							markup += $( '<style type="text/css">' ).html( this.html )[0].outerHTML;
						} else {
							markup += this.html;
						}
					} );

					return markup;
				};

				var isFinished = function() {
					if ( ! pending.length ) {
						$deffered.resolve( getMarkup() );
					}
				};

				$html.find( 'link, style' ).each( function( index ) {
					var $this = $( this ),
						markup = this.outerHTML,
						tagName = $this.prop( 'tagName' );

					if ( 'LINK' === tagName && 'stylesheet' !== $this.attr( 'rel' ) ) {
						markup = '';
					} else if ( 'LINK' === tagName ) {
						markup = '';
						pending.push( index );
						$.get( $this.attr( 'href' ), function( resp ) {
							styles[ index ].html = resp;
							markAsResolved( index );
							isFinished();
						} );
					}

					styles.push( {
						'tagName': tagName,
						'href': $this.attr( 'href' ),
						'html': markup
					} );
				} );

				styles.push( {
					'tagName': 'STYLE',
					'href': '',
					'html': wp.template( 'gridblock-iframe-styles' )()
				} );

				return $deffered;
			}
		};

	BG.STYLE.Remote = self;

} )( jQuery );
