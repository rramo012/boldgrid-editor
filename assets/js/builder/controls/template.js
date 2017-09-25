var $body = $( 'body' );

export class Template {
	constructor() {
		this.bodyClassName = 'boldgrid-editor-template';
		this.$templateInput = $( '#page_template' );
	}

	/**
	 * Initialize the class.
	 *
	 * @since 1.6
	 */
	init() {
		this.updateBodyClass();

		this.$templateInput.on( 'change', () => {
			this.updateBodyClass();
		} );
	}

	/**
	 * Update the body class when the user changes the template name.
	 *
	 * @since 1.6
	 */
	updateBodyClass() {
		if ( this.isBoldgridTemplate( this.$templateInput.val() ) ) {
			$body.addClass( this.bodyClassName );
		} else {
			$body.removeClass( this.bodyClassName );
		}
	}

	/**
	 * Is the template slug a BG template?
	 *
	 * @since 1.6
	 *
	 * @param  {string}  templateSlug Template slug.
	 * @return {Boolean}              Is the template slug a BG template?
	 */
	isBoldgridTemplate( templateSlug ) {
		return !! BoldgridEditor.internalPageTemplates[ templateSlug ];
	}
}

new Template().init();
