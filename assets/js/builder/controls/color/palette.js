import { ColorPalette, StyleUpdater } from 'boldgrid-controls';

var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Palette {
	constructor() {
		this.name = 'palette-customization';

		this.panel = {
			title: 'Color Palette',
			height: '600px',
			width: '325px'
		};

		// Instantiate the css loader.
		this.styleUpdater = new StyleUpdater( BG.Controls.$container );
		this.styleUpdater.init();

		this.workerUrl = BoldgridEditor.plugin_url + '/assets/js/sass-js/sass.worker.js?' + BoldgridEditor.version;

		this.colorPalette = new ColorPalette( {
			sass: {
				WorkerUrl: this.workerUrl
			}
		} );
	}

	init() {
		BG.Controls.registerControl( this );
	}

	setup() {
		this.$input = $( '#boldgrid-control-styles' );
	}

	renderCustomization() {
		let panel = BG.Panel,
			$body = panel.$element.find( '.panel-body' ),
			$control = this.colorPalette.render( $body );

		$control.on( 'sass_compiled', ( e, data ) => {
			this.styleUpdater.update( {
				id: 'bg-controls-colors',
				css: data.result.text,
				scss: data.scss
			} );

			this.$input.attr( 'value', JSON.stringify( this.styleUpdater.stylesState ) );
		} );
	}

	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		this.renderCustomization();

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}
}

export { Palette as default };
