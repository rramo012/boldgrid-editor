var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Width {

	init() {
		this.$postContainer;
		this.$resizeiframe;
		this.resizable = false;
		this.stylesheetWaitTime = 500;

		this._setup();

		return this;
	}

	/**
	 * Create the resizer iframe and append the HTML.
	 *
	 * @since 1.6
	 *
	 * @return {jQuery} iframeElement.
	 */
	createIframe() {
		let $resizeIframe = $( '<iframe id="resizer-iframe"></iframe>' );
		$resizeIframe.attr( 'width', window.innerWidth );
		$resizeIframe.attr( 'height', window.innerHeight );

		$( 'html' ).append( $resizeIframe );
		return $resizeIframe;
	}

	/**
	 * Try to find the posts container.
	 *
	 * @since 1.6
	 *
	 * @return {jQuery} Element wrapping post content.
	 */
	_findPostContainer() {
		let $contents = this.$resizeiframe.contents(),
			$postContainer = $contents.find( 'body' ),
			$article = $contents
				.find( '.post-' + BoldgridEditor.post_id + ', article' )
				.first(),
			$entryContent = $article.find( '.entry-content' ),
			$siteContent = $contents.find( '.site-content' ),
			$existingSection = $article.find( '.boldgrid-section:first' );

		if ( $existingSection.length ) {
			$postContainer = $existingSection;
		} else if ( $entryContent.length ) {
			$postContainer = $entryContent;
		} else if ( $article.length ) {
			$postContainer = $article;
		} else if ( $siteContent.length ) {
			$postContainer = $siteContent;
		}

		return $postContainer;
	}

	/**
	 * After the iframe is loaded, run this process.
	 *
	 * @since 1.6
	 */
	_postIframeProcess() {
		this.$postContainer = this._findPostContainer();
		this.resizable = this.$postContainer.length && this.$postContainer.width() ? true : false;
		$( window ).trigger( 'resize' );
	}

	/**
	 * Create Iframe.
	 *
	 * @since 1.6
	 */
	_setup() {
		if ( ! BoldgridEditor.is_boldgrid_theme || 'post' === BoldgridEditor.post_type  ) {
			this.$resizeiframe = this.createIframe();
			this._setIframeData().done( () => {
				this._postIframeProcess();
			} );
		}
	}

	/**
	 * Load content into a reszable iframe.
	 *
	 * @since 1.6
	 */
	_setIframeData() {
		let $deferred = $.Deferred();

		this.$resizeiframe[0].src = BoldgridEditor.site_url;
		this.$resizeiframe[0].onload = function() {
			$deferred.resolve();
		};

		setTimeout( function() {
			$deferred.resolve();
		}, 3000 );

		return $deferred;
	}

	_setIframeData2( html ) {
		let $deferred = $.Deferred();

		// Replace tags we don't want loaded.
		html = html.replace( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '' );
		html = html.replace( /<img[^>]*>/g, '' );

		// This set timeout is to prevent infinite spinner.
		setTimeout( () => {
			this.$resizeiframe[0]
				.contentWindow
				.document
				.write( html );

			setTimeout( () => {
				$deferred.resolve();
			}, this.stylesheetWaitTime );
		}, 100 );

		return $deferred;
	}

}

export { Width as default };
