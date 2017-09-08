import { ColorPalette } from 'boldgrid-controls';

export class Palette {
	constructor() {
		this.panel = {
			title: 'Color Palette',
			height: '600px',
			width: '325px'
		};

		this.workerUrl = BoldgridEditor.plugin_url + '/assets/js/sass-js/sass.worker.js?' + BoldgridEditor.version;

		this.ColorPalette = new ColorPalette( {
			sass: {
				WorkerUrl: this.workerUrl
			}
		} );

	}

	init() {
		BOLDGRID.EDITOR.Controls.registerControl( this );
	}

	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		this.ColorPalette.render( panel.$element.find( '.panel-body' ) );

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}
}

export { Palette as default };
