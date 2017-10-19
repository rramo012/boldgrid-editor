var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import { Base } from './base.js';
import template from '../../../../includes/template/popover/section.html';

export class Section extends Base {

	constructor() {
		super();

		this.template = template;

		this.name = 'section';

		this.selectors = [
			'.boldgrid-section'
		];

		this.emptySectionTemplate = wp.template( 'boldgrid-editor-empty-section' );

		this.selectorsString = this.selectors.join( ',' );

		return this;
	}

	/**
	 * Bind all events for this popover.
	 *
	 * @since 1.6
	 */
	_bindEvents() {
		super._bindEvents();

		let stopPropagation = function( e ) {
			e.stopPropagation();
		};

		this.$element.find( '[data-action]' ).on( 'click', stopPropagation );
		this.$element.find( '[data-action="section-width"]' ).on( 'click', ( e ) => this.sectionWidth( e ) );
		this.$element.find( '[data-action="move-up"]' ).on( 'click', () => this.moveUp() );
		this.$element.find( '[data-action="move-down"]' ).on( 'click', () => this.moveDown() );
		this.$element.find( '[data-action="background"]' ).on( 'click', () => this.background() );
		this.$element.find( '[data-action="save-gridblock"]' ).on( 'click', ( e ) => this._saveGridblock( e ) );
		this.$element.find( '[data-action="add-new"]' ).on( 'click', () => this.addNewSection() );
	}

	/**
	 * Get the selector string.
	 *
	 * @since 1.6
	 *
	 * @return {string} DOM query selector string.
	 */
	getSelectorString() {
		return this.selectorsString;
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
			'top': clientRect.bottom + 35,
			'left': 'calc(50% - 38px)',
			'transform': 'translateX(-50%)'
		};
	}

	/**
	 * Add New section under current section.
	 *
	 * @since 1.2.7
	 */
	addNewSection() {
		let $newSection = $( this.emptySectionTemplate() ) ;
		this.$target.after( $newSection );
		this.transistionSection( $newSection );
	}

	/**
	 * Fade the color of a section from grey to transparent.
	 *
	 * @since 1.2.7
	 * @param jQuery $newSection.
	 */
	transistionSection( $newSection ) {
		IMHWPB['tinymce_undo_disabled'] = true;

		$newSection.animate( {
				'background-color': 'transparent'
			}, 1500, 'swing', function() {
				BG.Controls.addStyle( $newSection, 'background-color', '' );
				IMHWPB['tinymce_undo_disabled'] = false;
				tinymce.activeEditor.undoManager.add();
			}
		);
	}

	/**
	 * Move the section up one in the DOM.
	 *
	 * @since 1.2.7
	 */
	moveUp() {
		let $prev = this.$target.prev();

		if ( $prev.length ) {
			$prev.before( this.$target );
		}

		BG.Controls.$container.trigger( BG.Controls.$container.delete_event );
	}

	/**
	 * Save a GridBlock.
	 *
	 * @since 1.6
	 */
	_saveGridblock( e ) {
		BG.Controls.get( 'Library' ).openPanel( {
			html: this.$target[0].outerHTML
		} );
	}

	/**
	 * Move the section down one in the DOM.
	 *
	 * @since 1.2.7
	 */
	moveDown() {
		let $next = this.$target.next();
		if ( $next.length ) {
			$next.after( this.$target );
		}

		BG.Controls.$container.trigger( BG.Controls.$container.delete_event );
	}

	/**
	 * Open the background controls.
	 *
	 * @since 1.6
	 */
	background() {
		this.$target.click();
		BOLDGRID.EDITOR.CONTROLS.Background.openPanel();
	}

	/**
	 * Control whether a container is fluid or not.
	 *
	 * @since 1.2.7
	 */
	sectionWidth() {
		BG.CONTROLS.Container.toggleSectionWidth( this.$target.find( '.container, .container-fluid' ) );
		this.$target.trigger( BG.Controls.$container.delete_event );
	}

}

export { Section as default };
