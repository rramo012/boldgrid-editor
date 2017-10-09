window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

import EditorWidth from './tinymce/width';
import StyleUpdater from './style/updater';
import LoadingGraphic from './tinymce/loading';

export class Service {
	init() {

		// Services.
		this.editorWidth = null;
		this.styleUpdater = null;

		this._onWindowLoad();
		this._onEditorLoad();

		return this;
	}

	/**
	 * Services to load when the window loads.
	 *
	 * @since 1.6
	 */
	_onWindowLoad() {
		this.editorWidth = new EditorWidth().init();
		this.loading = new LoadingGraphic().init();
	}

	/**
	 * Services to load when the editor loads.
	 *
	 * @since 1.6
	 */
	_onEditorLoad() {
		BOLDGRID.EDITOR.$window.on( 'boldgrid_editor_loaded', () => {
			this.styleUpdater = new StyleUpdater( BOLDGRID.EDITOR.Controls.$container ).init();
		} );
	}
}

BOLDGRID.EDITOR.Service = new Service().init();
