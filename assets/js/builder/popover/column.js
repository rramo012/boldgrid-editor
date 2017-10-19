var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/column.html';

export class Column extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'column';

		return this;
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top,
			'left': clientRect.left
		};
	}

	getSelectorString() {
		if ( BG.Controls.$container.editting_as_row ) {
			return BG.Controls.$container.nestedColumnSelector;
		} else {
			return BG.Controls.$container.original_selector_strings.unformatted_column_selectors_string;
		}
	}
}

export { Column as default };
