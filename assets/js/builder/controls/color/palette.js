import { Renderer as ColorPalette } from 'boldgrid-controls/src/controls/color';

export class Palette {
	constructor() {
		this.panel = {
			title: 'Color Palette',
			height: '700px',
			width: '300px'
		};

		this.ColorPalette = new ColorPalette();
	}

	init() {
		BOLDGRID.EDITOR.Controls.registerControl( this );
	}

	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		// Set markup for panel.
		this.ColorPalette.render( panel.$element.find( '.panel-body' ) );

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}
}

export { Palette as default };
