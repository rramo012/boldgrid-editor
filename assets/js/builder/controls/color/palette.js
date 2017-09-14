import { ColorPalette, StyleUpdater } from 'boldgrid-controls';

var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Palette {

	constructor() {
		this.name = 'Palette';

		this.panel = {
			title: 'Color Palette',
			height: '600px',
			width: '325px'
		};

		this.workerUrl = BoldgridEditor.plugin_url + '/assets/js/sass-js/sass.worker.js?' + BoldgridEditor.version;
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
	 * Universal control setup, runs on mce or DOM loaded.
	 *
	 * @since 1.6
	 */
	setup() {
		this.$input = $( '#boldgrid-control-styles' );
		this._setupStyleLoader();
	}

	/**
	 * Open the palette customization panel.
	 *
	 * @since 1.6.0
	 */
	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		this.renderCustomization( panel.$element.find( '.panel-body' ) );

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}

	updatePalette( settings ) {

		// this.colorPalette.
		console.log( settings );
	}

	/**
	 * Render the customization of color palettes.
	 *
	 * @since 1.6
	 */
	renderCustomization( $target ) {
		this.colorPalette = new ColorPalette( {
			sass: {
				WorkerUrl: this.workerUrl
			},
			paletteSettings: {}
		} );

		this.colorPalette.render( $target ).on( 'sass_compiled', ( e, data ) => {
			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			this._updateInput();
		} );
	}

	/**
	 * Instantiate the css loader.
	 *
	 * @since 1.6
	 */
	_setupStyleLoader() {
		this.styleUpdater = new StyleUpdater( BG.Controls.$container );
		this.styleUpdater.loadSavedConfig( BoldgridEditor.control_styles.configuration || [] );
		this.styleUpdater.setup();
		this._updateInput();
	}

	/**
	 * Update the on page input which will be saved to wordpress.
	 *
	 * @since 1.6
	 */
	_updateInput() {
		this.$input.attr( 'value', JSON.stringify( this.styleUpdater.stylesState ) );
	}

}

export { Palette as default };
