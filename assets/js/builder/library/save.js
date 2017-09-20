var $ = window.jQuery,
	BG = BOLDGRID.EDITOR,
	$window = $( window );

import LibraryInputTemplate from '../../../../includes/template/gridblock-library.html';

export class Save {

	constructor() {
		this.name = 'Library';

		this.panel = {
			title: 'GridBlock Library',
			height: '430px',
			width: '600px',
			disableDrag: true,
			autoCenter: true,
			showOverlay: true
		};
	}

	/**
	 * Initialize this controls, usually ryns right after the constructor.
	 *
	 * @since 1.6
	 */
	init() {
		BG.Controls.registerControl( this );
	}

	/**
	 * The DOM load method.
	 *
	 * @since 1.6
	 */
	setup() {
		this.openPanel( {
			html: 'this is the new html'
		} );
		this._bindHandlers();
	}

	/**
	 * Open the panel.
	 *
	 * @since 1.6
	 *
	 * @param  {Object} gridblockData GridBlock data.
	 */
	openPanel( gridblockData ) {
		this.gridblockData = gridblockData;
		this.$html = $( LibraryInputTemplate );
		this._setState( 'save-prompt' );

		BG.Panel.setContent( this.$html ).open( this );
		BG.Panel.centerPanel();
	}

	/**
	 * Save a GridBlock as a post.
	 *
	 * @since 1.6
	 *
	 * @param  {Object} data     Data to save.
	 * @return {$.deferred}      Ajax deffered object.
	 */
	save( data ) {
		data.action = 'boldgrid_editor_save_gridblock';
		data['boldgrid_editor_gridblock_save'] = BoldgridEditor.nonce_gridblock_save;

		return $.ajax( {
			url: ajaxurl,
			dataType: 'json',
			method: 'POST',
			timeout: 5000,
			data: data
		} ).always( ( response ) => {
			console.log( response );
		} ).fail( ( response ) => {
			console.log( response );
		} );
	}

	_setState( state ) {
		this.$html.attr( 'state', state );
	}

	/**
	 * Bind all event handlers.
	 *
	 * @since 1.6
	 */
	_bindHandlers() {
		this._setupFormSubmit();
	}

	/**
	 * Setup handiling of the form submission process.
	 *
	 * @since 1.6
	 */
	_setupFormSubmit() {
		BG.Panel.$element.on( 'submit', '.save-gridblock form', ( e ) => {
			let $form = $( event.target ),
				$button = $form.find( '.bg-editor-button' ),
				$input = $form.find( 'input' );

			e.preventDefault();

			BG.Panel.$element.css( 'cursor', 'progress' );
			$button.attr( 'disabled', 'disabled' );

			this.save( {
				title: $input.val(),
				html: this.gridblockData.html
			} )
			.fail(  () => {
				this._setState( 'save-failed' );
			} )
			.success(  () => {
				this._setState( 'save-success' );
			} )
			.always( () => {
				BG.Panel.$element.css( 'cursor', '' );
				$button.removeAttr( 'disabled' );
			} );
		} );
	}
}

export { Save as default };
