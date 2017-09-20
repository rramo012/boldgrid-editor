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
		this.openPanel();
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

		BG.Panel.setContent( LibraryInputTemplate ).open( this );
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
				$button = $form.find( '.bg-editor-button' );

			e.preventDefault();

			BG.Panel.$element.css( 'cursor', 'progress' );
			$button.attr( 'disabled', 'disabled' );

			this.save( {
				title: 'This is the title',
				html: 'This is the html'
			} ).always( function() {
				BG.Panel.$element.css( 'cursor', '' );
				$button.removeAttr( 'disabled' );
			} );
		} );
	}
}

export { Save as default };
