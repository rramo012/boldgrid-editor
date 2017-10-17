var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/content.html';

export class Content extends Base {

	constructor() {
		super();

		this.template = template;

		this.selectors = [
			'p',
			'blockquote',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6'
		];

		return this;
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top + ( clientRect.height / 2 ),
			'left': clientRect.left
		};
	}

}

export { Content as default };
