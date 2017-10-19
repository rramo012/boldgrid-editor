var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/row.html';

export class Row extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'row';

		return this;
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top,
			'left': clientRect.left + clientRect.width
		};
	}

	getSelectorString() {
		let selectorString = BG.Controls.$container.original_selector_strings.row_selectors_string;

		if ( BG.Controls.$container.editting_as_row ) {
			selectorString = BG.Controls.$container.nested_row_selector_string;
		}

		return selectorString;
	}

}

export { Row as default };
