import { ColorPalette, StyleUpdater, PaletteConfiguration } from '@boldgrid/controls';

var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Palette {
	constructor() {
		this.paletteConfig = new PaletteConfiguration();

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

	/**
	 * Manually set palette settings.
	 *
	 * Given an object like: {'colors':[red,white,blue], 'neutral-color': 'yellow'}
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} settings Palette Settings.
	 */
	setPaletteSettings( settings ) {
		let $tempDiv = $( '<div>' ).hide();
		$( 'html' ).append( $tempDiv );

		// Pass the color settings to the ColorPalette tool to format to the massive config.
		this.paletteSettings = this.paletteConfig.createSimpleConfig( settings );

		this.renderCustomization( $tempDiv ).on( 'sass_compiled', ( e, data ) => {
			if ( 'activatePalette' === data.source ) {
				$tempDiv.remove();
			}
		} );

		BOLDGRID.COLOR_PALETTE.Modify['first_update'] = false;
	}

	/**
	 * Get the currently saved palette settings.
	 *
	 * @since 1.6
	 *
	 * @return {Object} Palette settings.
	 */
	getPaletteSettings() {
		let settings = this.getSavedPaletteSettings() || this.paletteSettings;

		if ( ! settings && BoldgridEditor.setup_settings && BoldgridEditor.setup_settings.palette ) {
			settings = this.paletteConfig.createSimpleConfig( BoldgridEditor.setup_settings.palette.choice );
		}

		return settings;
	}

	/**
	 * Get the currently saved palette settings.
	 *
	 * @since 1.6
	 *
	 * @return {object} Palette settings.
	 */
	getSavedPaletteSettings() {
		let colorControls,
			paletteSettings,
			config = BoldgridEditor.control_styles.configuration;

		if ( config && config.length ) {
			colorControls = _.find( config, ( value ) => {
				return 'bg-controls-colors' === value.id;
			} );

			paletteSettings = colorControls.options ? colorControls.options.paletteSettings : false;
		}

		return paletteSettings;
	}

	/**
	 * Render the customization of color palettes.
	 *
	 * @since 1.6
	 */
	renderCustomization( $target ) {
		let $control,
			postUpdate = _.debounce( () => {
				this._postPaletteUpdate();
			}, 2000 );

		this.colorPalette = new ColorPalette( {
			sass: {
				workerURL: this.workerUrl,
				basePath: BoldgridEditor['plugin_url'] + '/assets/scss'
			},
			paletteSettings: this.getPaletteSettings()
		} );

		$control = this.colorPalette.render( $target ).on( 'sass_compiled', ( e, data ) => {

			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			this.colorPalette.updateButtons( ( result ) => {
				let scss = result.map.sourcesContent.join( '' );

				this.styleUpdater.update( {
					id: 'bg-controls-buttons',
					css: result.text,
					scss: scss,
					priority: 60
				} );
			} );

			postUpdate();
		} );

		BOLDGRID.COLOR_PALETTE.Modify['first_update'] = false;

		return $control;
	}

	/**
	 * Save the palette settings from control into an config we will save to the DB.
	 *
	 * @since 1.6
	 */
	_savePaletteSettings() {
		let paletteSettings;

		paletteSettings = this.paletteConfig.createSavableState( BOLDGRID.COLOR_PALETTE.Modify.state );
		this.styleUpdater.stylesState[0].options = this.styleUpdater.stylesState[0].options || {};
		this.styleUpdater.stylesState[0].options.paletteSettings = paletteSettings;
		BG.CONTROLS.Color.updatePaletteSettings( paletteSettings );
	}

	/**
	 * Process to occur after a palette updates.
	 *
	 * @since 1.6
	 */
	_postPaletteUpdate() {
		this._savePaletteSettings();
		this._updateInput();
		this.allCss = this.styleUpdater.getStylesheetCss();
	}

	/**
	 * @todo move the style update into a service.
	 */
	getStylesheetCss() {
		if ( ! this.allCss ) {
			this.allCss = this.styleUpdater.getStylesheetCss();
		}

		return this.allCss;
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
