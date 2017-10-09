var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { ColorPalette, StyleUpdater, PaletteConfiguration } from '@boldgrid/controls';

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

		this.colorPalette = new ColorPalette( {
			sass: {
				workerURL: this.workerUrl,
				basePath: BoldgridEditor['plugin_url'] + '/assets/scss'
			}
		} );
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
		this._setupParentLoader();
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
	}

	/**
	 * Get the currently saved palette settings.
	 *
	 * @since 1.6
	 *
	 * @return {Object} Palette settings.
	 */
	getPaletteSettings() {
		let settings = this.updatedPaletteSettings || this.getLivePalettes() || this.paletteSettings;

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
	getLivePalettes() {
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
		let $control;

		$control = this.colorPalette.render( $target, this.getPaletteSettings() ).on( 'sass_compiled', ( e, data ) => {

			BG.Service.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			this.styleUpdaterParent.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss,
				priority: 60
			} );

			this._postPaletteUpdate();
		} );

		return $control;
	}

	/**
	 * Save the palette settings from control into an config we will save to the DB.
	 *
	 * @since 1.6
	 */
	_savePaletteSettings() {
		let paletteSettings;

		paletteSettings = this.paletteConfig.createSavableState( BOLDGRID.COLOR_PALETTE.Modify.format_current_palette_state() );
		BG.Service.styleUpdater.stylesState[0].options = BG.Service.styleUpdater.stylesState[0].options || {};
		BG.Service.styleUpdater.stylesState[0].options.paletteSettings = paletteSettings;
		BG.CONTROLS.Color.updatePaletteSettings( paletteSettings );

		this.updatedPaletteSettings = paletteSettings;
	}

	/**
	 * Process to occur after a palette updates.
	 *
	 * @since 1.6
	 */
	_postPaletteUpdate() {
		this._savePaletteSettings();
		BG.Service.styleUpdater.updateInput();
	}

	/**
	 * Setup a style loader for the parent window (wordpress admin).
	 *
	 * @since 1.6
	 */
	_setupParentLoader() {
		let configs = BoldgridEditor.control_styles.configuration || [],
			state = _.find( configs, ( config ) => {
				return 'bg-controls-colors' === config.id;
			} );

		state = state ? [ state ] : [];
		this.styleUpdaterParent = new StyleUpdater( document );
		this.styleUpdaterParent.loadSavedConfig( state );
		this.styleUpdaterParent.setup();
	}

}

export { Palette as default };
