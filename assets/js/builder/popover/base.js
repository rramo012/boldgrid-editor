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

		this.selectors = [
			'.must-be-defined'
		];

		this.debounceTime = 300;
		this.debouncedHide = this._getDebouncedHide();
		this.debouncedUpdate = this._getDebouncedUpdate();
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

		this.$target = this.$target.closest( this.getSelectorString() );

		this.$element.trigger( 'updatePosition' );

		pos = this.$target[0].getBoundingClientRect();

		this.$element.$menu.addClass( 'hidden' );
		this.$element.css( this.getPositionCss( pos ) ).show();
		this.$target.addClass( 'popover-hover' );
	}

	/**
	 * Bind all selectors based on delegated selectors.
	 *
	 * @since 1.6
	 */
	bindSelectorEvents() {
		BG.Controls.$container.on( 'mouseenter.draggable', this.getSelectorString(), ( event ) => {
			this.debouncedUpdate( event );
		} );

		BG.Controls.$container.on( 'mouseleave.draggable', this.getSelectorString(), ( event ) => {
			this.debouncedHide( event );
		} );
	}

	/**
	 * Create a debounced version of the update function.
	 *
	 * @since 1.6
	 *
	 * @return {function} Debounced function.
	 */
	_getDebouncedHide() {
		return _.debounce( ( event )  => {
				this.hideHandles( event );
			}, this.debounceTime
		);
	}

	/**
	 * Create a debounced version of the update function.
	 *
	 * @since 1.6
	 *
	 * @return {function} Debounced function.
	 */
	_getDebouncedUpdate() {
		return _.debounce( ( event )  => {
				this.updatePosition( event );
			}, this.debounceTime
		);
	}

	/**
	 * Bind all event listeners.
	 *
	 * @since 1.6
	 */
	_bindEvents() {
		this._universalEvents();
		this.bindSelectorEvents();
	}

	/**
	 * Bind all events that will hide the handles.
	 *
	 * @since 1.6
	 */
	_universalEvents() {

		this.$element.on( 'mousedown', () => {
			BG.Service.popover.selection = this;
		} );

		BG.Controls.$container.on( 'edit-as-row-enter edit-as-row-leave', () => {
			this.bindSelectorEvents();
			this.hideHandles();
		} );

		BG.Controls.$container.on( 'boldgrid_modify_content end_typing_boldgrid', () => {
			this.updatePosition();
		} );

		this.$element.on( 'mouseleave', ( event ) => {
			this.debouncedHide( event );
		} );

		BG.Controls.$container.find( '[data-action]' ).on( 'click', ( event ) => {
			this.hideHandles( event );
		} );

		BG.Controls.$container.on( 'mouseleave', () => {
			this.debouncedHide( event );
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
