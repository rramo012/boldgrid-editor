var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/row.html';

export class Row extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'row';

		this.selectors = [
			'.row:not(.row .row)'
		];

		return this;
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top,
			'right': clientRect.left
		};
	}

}

export { Row as default };
