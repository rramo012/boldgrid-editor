var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/column.html';

export class Column extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'column';

		this.selectors = [
			'div[class*="col-md-"]'
		];

		return this;
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top,
			'left': clientRect.left
		};
	}

}

export { Column as default };
