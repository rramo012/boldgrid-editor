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

		this.selectors = [ '.must-be-defined' ];

		this.debounceTime = 300;
		this._hideCb = this._getDebouncedHide();
		this._showCb = this._getDebouncedUpdate();

		this.hideHandleEvents = [
			'bge_row_resize_start',
			'start_typing_boldgrid',
			'resize_clicked',
			'drag_end_dwpb',
			'clear_dwpb',
			'add_column_dwpb'
		];
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
		let $target;

		if ( event && event.relatedTarget ) {
			$target = $( event.relatedTarget );

			// This check if we're leaving the element but entering the popover.
			if ( $target.closest( '.draggable-tools-imhwpb' ).length ) {
				return;
			}
		}

		// Allow child class to prevent this action.
		if ( this.preventMouseLeave && this.preventMouseLeave( $target ) ) {
			return;
		}

		this._removeBorder();
		this.$element.$menu.addClass( 'hidden' );
		this.$element.hide();
		this.$element.trigger( 'hide' );
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

		if ( BG.Controls.$container.$current_drag || BG.Controls.$container.resize ) {
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
		BG.Controls.$container.on( 'mouseenter.draggable', this.getSelectorString(), event => {
			this.debouncedUpdate( event );
		} );

		BG.Controls.$container.on( 'mouseleave.draggable', this.getSelectorString(), event => {
			this.debouncedHide( event );
		} );
	}

	debouncedHide( event ) {
		this._hideCb( event );
		this.mostRecentAction = 'leave';
	}

	debouncedUpdate( event ) {
		this._showCb( event );
		this.mostRecentAction = 'enter';
	}

	/**
	 * Create a debounced version of the update function.
	 *
	 * @since 1.6
	 *
	 * @return {function} Debounced function.
	 */
	_getDebouncedHide() {
		return _.debounce( event => {

			// Only proceed of if this was the most recently triggered action.
			if ( 'leave' === this.mostRecentAction ) {
				this.hideHandles( event );
			}
		}, this.debounceTime );
	}

	/**
	 * Create a debounced version of the update function.
	 *
	 * @since 1.6
	 *
	 * @return {function} Debounced function.
	 */
	_getDebouncedUpdate() {
		return _.debounce( event => {

			// Only proceed of if this was the most recently triggered action.
			if ( 'enter' === this.mostRecentAction ) {
				this.updatePosition( event );
			}

		}, this.debounceTime );
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

		this.$element.on( 'mouseleave', event => {
			this.debouncedHide( event );
		} );

		BG.Controls.$container.find( '[data-action]' ).on( 'click', event => {
			this.hideHandles( event );
		} );

		BG.Controls.$container.on( 'mouseleave', () => {
			this.debouncedHide( event );
		} );

		BG.Controls.$container.on( this.hideHandleEvents.join( ' ' ), () => {
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
