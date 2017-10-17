window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

import EditorWidth from './tinymce/width';
import StyleUpdater from './style/updater';
import LoadingGraphic from './tinymce/loading';
import { Palette } from './controls/color/palette';
import { Intro } from './notice/intro';
import { Save as LibrarySave } from './library/save';
import { Lead as GridblockLead } from './gridblock/lead';
import PopoverContent from './popover/content';

export class Service {
	init() {

		// Services.
		this.editorWidth = null;
		this.styleUpdater = null;

		this._onWindowLoad();
		this._onEditorLoad();
		this._onEditorPreload();

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

			this.popoverContent = new PopoverContent().init();
		} );
	}

	/**
	 * Before controls are loaded.
	 *
	 * @since 1.6
	 */
	_onEditorPreload() {
		BOLDGRID.EDITOR.$window.on( 'boldgrid_editor_preloaded', () => {
			new Palette().init();
			new Intro().init();
			new LibrarySave().init();
			new GridblockLead().init();
		} );
	}
}

BOLDGRID.EDITOR.Service = new Service().init();
