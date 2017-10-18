var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import Clone from './actions/clone.js';
import Delete from './actions/delete.js';

export class Base {

	constructor( options ) {
		options = options || {};
		options.actions = options.actions || {};

		options.actions.clone = options.actions.clone || new Clone( this );
		options.actions.delete = options.actions.delete || new Delete( this );

		this.options = options;
	}

	init() {
		this.$target;
		this.$element = this._render();
		this.selectorString = this._createSelectorString();

		this._applyInitialStyles();
		this._bindEvents();

		// Init actions.
		this.options.actions.clone.init();
		this.options.actions.delete.init();

		return this;
	}

	_bindEvents() {
		BG.Controls.$container.on( 'mouseenter', this.selectorString, ( event ) => {
			this.updatePosition( event );
		} );

		// Update the current target when it's clicked on.
		this.$element.on( 'mousedown', ( event ) => {
			BG.Service.popover.selection = this;
		} );
	}

	updatePosition( event ) {
		let pos;

		if ( event ) {
			this.$target = $( event.target );
		}

		if ( this.isInvalidTarget() ) {
			this.$element.hide();
			return;
		}

		this.removeBorder();

		if ( BG.Controls.$container.$current_drag ) {
			return false;
		}

		pos = this.$target[0].getBoundingClientRect();

		this.$element.$menu.addClass( 'hidden' );
		this.$element.css( this.getPositionCss( pos ) ).show();
		this.$target.addClass( 'boldgrid-section-hover' );
	}

	isInvalidTarget() {
		return ! this.$target || ! this.$target.length || false === this.$target.is( ':visible' );
	}

	/**
	 * Remove section poppover target border.
	 *
	 * @since 1.2.8
	 */
	removeBorder() {
		if ( this.$target && this.$target.length ) {
			this.$target.removeClass( 'boldgrid-section-hover' );
		}
	}

	_applyInitialStyles() {
		this.$element.hide();
	}

	_createSelectorString() {
		return this.selectors.join( ',' );
	}

	_render() {
		let $popover = $( this.template );
		$popover.$menu = $popover.find( '.popover-menu-imhwpb' );
		BG.Controls.$container.$body.after( $popover );

		return $popover;
	}
}

export { Base as default };
