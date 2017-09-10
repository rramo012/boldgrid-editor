import { ColorPalette } from 'boldgrid-controls';

var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Palette {
	constructor() {
		this.panel = {
			title: 'Color Palette',
			height: '600px',
			width: '325px'
		};

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

	renderChange() {
		let panel = BG.Panel,
			$body = panel.$element.find( '.panel-body' ),
			$control = this.colorPalette.render( $body );

		$control.on( 'sass_compiled', ( e, data ) => {
			this.addCss( BG.Controls.$container, 'bg-control-colors', data.result.text );
		} );
	}

	openPanel() {
		let panel = BOLDGRID.EDITOR.Panel;

		panel.clear();

		this.renderChange();

		panel.showFooter();

		// Open Panel.
		panel.open( this );
	}
}

export { Palette as default };
