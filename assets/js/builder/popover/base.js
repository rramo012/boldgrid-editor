var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import Clone from './actions/clone.js';
import Delete from './actions/delete.js';
import GeneralActions from './actions/general.js';

export class Base {

	constructor( options ) {
		options = options || {};
		options.actions = options.actions || {};

		options.actions.clone = options.actions.clone || new Clone( this );
		options.actions.delete = options.actions.delete || new Delete( this );

		this.options = options;
	}

	/**
	 * Setup this class.
	 *
	 * @since 1.6
	 *
	 * @return {object} Class instance.
	 */
	init() {
		this.$target;
		this.$element = this._render();
		this.selectorString = this._createSelectorString();

		this.$element.hide();
		this._bindEvents();

		// Init actions.
		this.options.actions.clone.init();
		this.options.actions.delete.init();
		new GeneralActions().bind( this.$element );

		return this;
	}

	/**
	 * Hide the section handles.
	 *
	 * @since 1.6
	 * @param {object} event Event from listeners.
	 */
	hideHandles( event ) {

		// This check if we're leaving the element but entering the popover.
		if ( event && event.relatedTarget && $( event.relatedTarget ).closest( '.draggable-tools-imhwpb' ).length ) {
			return;
		}

		this._removeBorder();
		this.$element.$menu.addClass( 'hidden' );
		this.$element.hide();
	}

	/**
	 * Update the position of the handles.
	 *
	 * @since 1.6
	 *
	 * @param  {object} event Event from listeners.
	 */
	updatePosition( event ) {
		let pos;
		this._removeBorder();

		if ( event ) {
			this.$target = $( event.target );
		}

		if ( this._isInvalidTarget() ) {
			this.$element.hide();
			return;
		}

		if ( BG.Controls.$container.$current_drag ) {
			return false;
		}

		if ( BG.Controls.$container.is_typing && true === BG.Controls.$container.is_typing ) {
			return false;
		}

		this.$target = this.$target.closest( this.selectorString );

		pos = this.$target[0].getBoundingClientRect();

		this.$element.$menu.addClass( 'hidden' );
		this.$element.css( this.getPositionCss( pos ) ).show();
		this.$target.addClass( 'popover-hover' );
	}

	/**
	 * Bind all event listeners.
	 *
	 * @since 1.6
	 */
	_bindEvents() {
		this._repositionEvents();
		this._hideEvents();
		this._bindSelectedPopover();
	}

	/**
	 * Update the current target when it's clicked on.
	 *
	 * @since 1.6
	 */
	_bindSelectedPopover() {
		this.$element.on( 'mousedown', ( event ) => {
			BG.Service.popover.selection = this;
		} );
	}

	/**
	 * Bind all event that will update the position of the handles.
	 *
	 * @since 1.6
	 */
	_repositionEvents() {
		var updatePosition = _.debounce( ( event )  => {
				this.updatePosition( event );
			}, 300
		);

		BG.Controls.$container.on( 'mouseenter', this.selectorString, ( event ) => {
			updatePosition( event );
		} );

		BG.Controls.$container.on( 'boldgrid_modify_content end_typing_boldgrid', () => {
			this.updatePosition();
		} );
	}

	/**
	 * Bind all events that will hide the handles.
	 *
	 * @since 1.6
	 */
	_hideEvents() {
		var hideHandles = _.debounce( ( event )  => {
				this.hideHandles( event );
			}, 300
		);

		BG.Controls.$container.on( 'mouseleave', this.selectorString, ( event ) => {
			hideHandles( event );
		} );

		this.$element.on( 'mouseleave', ( event ) => {
			hideHandles( event );
		} );

		BG.Controls.$container.find( '[data-action]' ).on( 'click', ( event ) => {
			this.hideHandles( event );
		} );

		BG.Controls.$container.on( 'mouseleave', () => {
			this.hideHandles();
			this.$target = false;
		} );

		BG.Controls.$container.on( 'start_typing_boldgrid', () => {
			this.hideHandles();
		} );
	}

	/**
	 * Check if the popover target exists.
	 *
	 * @since 1.6
	 * @return {Boolean} Is the target still on the page.
	 */
	_isInvalidTarget() {
		return ! this.$target || ! this.$target.length || ! BG.Controls.$container.find( this.$target ).length;
	}

	/**
	 * Remove section poppover target border.
	 *
	 * @since 1.6
	 */
	_removeBorder() {
		if ( this.$target && this.$target.length ) {
			this.$target.removeClass( 'popover-hover' );
		}
	}

	/**
	 * Based on the list of selectors passed used in a child class create a string.
	 *
	 * @since 1.6
	 *
	 * @return {string}
	 */
	_createSelectorString() {
		return this.selectors.join( ',' );
	}

	/**
	 * Render the popover after the body.
	 *
	 * @since 1.6
	 *
	 * @return {jQuery} Popover element.
	 */
	_render() {
		let $popover = $( this.template );
		$popover.$menu = $popover.find( '.popover-menu-imhwpb' );
		BG.Controls.$container.$body.after( $popover );

		return $popover;
	}
}

export { Base as default };
