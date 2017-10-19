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

	/**
	 * Bind all events.
	 *
	 * @since 1.6
	 */
	_bindEvents() {
		super._bindEvents();

		this.$element.on( 'updatePosition', () => this._onUpdatePosition() );
		this.$element.find( '.edit-as-row' ).on( 'click', () => this._onEditRow() );
	}

	/**
	 * Get a position for the popover.
	 *
	 * @since 1.6
	 *
	 * @param  {object} clientRect Current coords.
	 * @return {object}            Css for positioning.
	 */
	getPositionCss( clientRect ) {
		return {
			top: clientRect.top + clientRect.height / 2,
			left: clientRect.left
		};
	}

	/**
	 * Get the current selector string depending on drag mode.
	 *
	 * @since 1.6
	 *
	 * @return {string} Selectors.
	 */
	getSelectorString() {
		if ( BG.Controls.$container.editting_as_row ) {
			return this.nestedSelector;
		} else {
			return BG.Controls.$container.original_selector_strings.unformatted_content_selectors_string;
		}
	}

	/**
	 * Create a selector to be used when nesting rows.
	 *
	 * @since 1.6
	 *
	 * @return {string} DOM query selector string.
	 */
	createNestedSelector() {
		let contentSelectors = [];

		_.each( BG.Controls.$container.content_selectors, ( value, index ) => {
			contentSelectors[index] = value.replace( 'not(.row .row', 'not(.row .row .row' );
		} );

		return contentSelectors.join( ',' );
	}

	/**
	 * Process to occur when updating the position of the popover.
	 *
	 * @since 1.6
	 */
	_onUpdatePosition() {
		if ( this.$target.hasClass( 'row' ) && ! BG.Controls.$container.editting_as_row ) {
			this.$element.addClass( 'nested-row-popover-imhwpb' );
		} else {
			this.$element.removeClass( 'nested-row-popover-imhwpb' );
		}
	}

	/**
	 * When the user clicks on the edit row button, perform the following actions.
	 *
	 * @since 1.6
	 */
	_onEditRow() {
		BG.Controls.$container.trigger( 'boldgrid_edit_row', this.$target );

		if ( BG.Controls.$container.editting_as_row ) {
			$.fourpan.dismiss();
		} else {
			$.fourpan.highlight( this.$target );
		}
	}
}

export { Content as default };
