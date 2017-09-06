// import { Colors } from 'boldgrid-controls';
// import { ColorPalette } from 'boldgrid-controls/colors';

export class Palette {
	constructor() {
		this.panel = {
			title: 'Color Palette',
			height: '700px',
			width: '500px'
		};

	}

	init() {
		BOLDGRID.EDITOR.Controls.registerControl( this );
	}

	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		// Set markup for panel.
		panel.$element.find( '.panel-body' ).html( 'So that just happened' );

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}
}

export { Palette as default };
