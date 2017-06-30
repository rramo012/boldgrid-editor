var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.GRIDBLOCK = BOLDGRID.EDITOR.GRIDBLOCK || {};

( function( $ ) {
	'use strict';

	var BG = BOLDGRID.EDITOR,
		self = {

			/**
			 * Translate all images to encoded versions.
			 *
			 * @since 1.5
			 *
			 * @param  {Object} gridblockData Current Gridblock.
			 */
			translateImages: function( gridblockData ) {
				if ( gridblockData.dynamicImages ) {
					self.replaceImages( gridblockData.$html );
					self.replaceBackgrounds( gridblockData.$html );
				}
			},

			/**
			 * Scan each image, replace image src with encoded version.
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $gridblock Gridblock Object.
			 */
			replaceImages: function( $gridblock ) {
				$gridblock.find( 'img' ).each( function() {
					var $this = $( this ),
						src = $this.attr( 'src' );

					$this.removeAttr( 'src' ).attr( 'dynamicImage', '' );

					self.getDataURL( src ).done( function( result ) {
						$this.attr( 'src', result );
					} );
				} );
			},

			/**
			 * Replace the background url with a new url.
			 *
			 * @since 1.5
			 *
			 * @param  {string} css CSS rule for background image.
			 * @param  {string} url URL to swap.
			 * @return {string}     New CSS rule with the url requested.
			 */
			replaceBackgroundUrl: function( css, url ) {
				return css.replace( /url\(.+?\)/, 'url(' + url + ')' );
			},

			/**
			 * Get the url used in a background.
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $element Element with background.
			 * @return {string}          URL.
			 */
			getBackgroundUrl: function( $element ) {
				var backgroundImage = $element.css( 'background-image' ) || '';
				return backgroundImage.replace( /.*\s?url\([\'\"]?/, '' ).replace( /[\'\"]?\).*/, '' );
			},

			/**
			 * Replace background images with encoded image. Only section for now.
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $gridblock gridblock previewed.
			 */
			replaceBackgrounds: function( $gridblock ) {
				var backgroundImage = $gridblock.css( 'background-image' ) || '',
					hasImage = backgroundImage.match( /url\(?.+?\)/ ),
					imageUrl = self.getBackgroundUrl( $gridblock );

				if ( hasImage ) {
					$gridblock.css( 'background-image', '' );

					self.getDataURL( imageUrl ).done( function( result ) {
						backgroundImage = self.replaceBackgroundUrl( backgroundImage, result );
						$gridblock.css( 'background-image', backgroundImage );
						$gridblock.attr( 'dynamicImage', '' );
					} );
				}
			},

			/**
			 * Get the url for the image based on element type.
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $element Element to check.
			 * @return {string}          URL.
			 */
			getEncodedSrc: function( $element ) {
				var src = '';

				if ( self.isBackgroundImage( $element ) ) {
					src = self.getBackgroundUrl( $element );
				} else {
					src = $element.attr( 'src' );
				}

				return src;
			},

			/**
			 * Check if we are applying a background image.
			 *
			 * @since 1.5
			 *
			 * @param  {jQuery} $element Element to check.
			 * @return {boolean}         Is the element image a background.
			 */
			isBackgroundImage: function( $element ) {
				return 'IMG' !== $element[0].nodeName;
			},

			/**
			 * Add wp-image class to gridblock and apply url.
			 *
			 * @since 1.4
			 *
			 * @param {jQuery} $image Image to have attributes replaced.
			 * @param {Object} data   Image return data.
			 */
			addImageUrl: function( $image, data ) {
				var backgroundImageCss;

				if ( self.isBackgroundImage( $image ) ) {
					backgroundImageCss = $image.css( 'background-image' ) || '';
					backgroundImageCss = self.replaceBackgroundUrl( backgroundImageCss, data.url );
					$image.css( 'background-image', backgroundImageCss );
				} else {
					$image.attr( 'src', data.url );

					// If an attachment_id is set, use it to add the wp-image-## class.
					// This class is required if WordPress is to later add the srcset attribute.
					if ( 'undefined' !== typeof data.attachment_id && data.attachment_id ) {
						$image.addClass( 'wp-image-' + data.attachment_id );
					}
				}
			},

			/**
			 * Get the base64 of an image.
			 *
			 * @since 1.5
			 *
			 * @param  {string} src Remote image path.
			 * @return {$.deferred} Deferred for callbacks.
			 */
			getDataURL: function( src ) {
				var $deferred = $.Deferred(),
					xhr = new XMLHttpRequest();

				xhr.open( 'get', src );
				xhr.responseType = 'blob';
				xhr.onload = function() {

					var fr = new FileReader();
					fr.onload = function() {
						$deferred.resolve( this.result );
					};

					fr.readAsDataURL( xhr.response );
				};

				xhr.send();

				return $deferred;
			}
		};

	BG.GRIDBLOCK.Image = self;

} )( jQuery );
