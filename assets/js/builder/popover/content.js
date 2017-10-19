var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/content.html';

export class Content extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'content';

		this.nestedSelector = this.createNestedSelector();

		return this;
	}

	_bindEvents() {
		super._bindEvents();

		this.setupNestedRow();
	}

	createNestedSelector() {
		let contentSelectors = [];

		_.each( BG.Controls.$container.content_selectors, ( value, index ) => {
			contentSelectors[ index ] = value.replace( 'not(.row .row', 'not(.row .row .row' );
		} );

		return contentSelectors.join( ',' );
	}

	setupNestedRow() {
		this.$element.on( 'updatePosition', () => this._onUpdatePosition() );
		this.$element.find( '.edit-as-row' ).on( 'click', () => this._onEditRow() );
	}

	_onUpdatePosition() {
		if ( this.$target.hasClass( 'row' ) && ! BG.Controls.$container.editting_as_row ) {
			this.$element.addClass( 'nested-row-popover-imhwpb' );
		} else {
			this.$element.removeClass( 'nested-row-popover-imhwpb' );
		}
	}

	_onEditRow() {
		BG.Controls.$container.trigger( 'boldgrid_edit_row', this.$target );

		if ( BG.Controls.$container.editting_as_row ) {
			$.fourpan.dismiss();
		} else {
			$.fourpan.highlight( this.$target );
		}
	}

	getPositionCss( clientRect ) {
		return {
			'top': clientRect.top + ( clientRect.height / 2 ),
			'left': clientRect.left
		};
	}

	getSelectorString() {
		if ( BG.Controls.$container.editting_as_row ) {
			return this.nestedSelector;
		} else {
			return BG.Controls.$container.original_selector_strings.unformatted_content_selectors_string;
		}
	}

}

export { Content as default };
