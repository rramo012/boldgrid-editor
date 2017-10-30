var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

export class Advanced {
	constructor() {
		this.name = 'Advanced';

		this.panel = {
			title: 'Advanced',
			height: '600px',
			width: '375px',
			customizeCallback: true,
			customizeSupport: [
				'margin',
				'padding',
				'border',
				'width',
				'box-shadow',
				'border-radius',
				'background-color',
				'blockAlignment',
				'customClasses'
			]
		};
	}

	/**
	 * Initialize this controls, usually runs right after the constructor.
	 *
	 * @since 1.6
	 */
	init() {
		BG.Controls.registerControl( this );
	}

	/**
	 * Open the palette customization panel.
	 *
	 * @since 1.6.0
	 */
	openPanel( $target ) {
		BG.Menu.$element.targetData[ this.name ] = $target;

		BG.Panel.clear();
		BG.Panel.showFooter();
		BG.Panel.open( this );
		BG.Panel.enterCustomization( this );
	}
}

export { Advanced as default };
