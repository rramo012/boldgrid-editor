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

		return this;
	}

	_bindEvents() {
		super._bindEvents();

		let stopPropagation = function( e ) {
			e.stopPropagation();
		};

		this.$element.find( '.context-menu-imhwpb' ).on( 'click', ( e ) => this.menuDirection( e ) );
		this.$element.find( '[data-action]' ).on( 'click', stopPropagation );
		this.$element.find( '[data-action="section-width"]' ).on( 'click', ( e ) => this.sectionWidth( e ) );
		this.$element.find( '[data-action="move-up"]' ).on( 'click', () => this.moveUp() );
		this.$element.find( '[data-action="move-down"]' ).on( 'click', () => this.moveDown() );
		this.$element.find( '[data-action="background"]' ).on( 'click', () => this.background() );
		this.$element.find( '[data-action="save-gridblock"]' ).on( 'click', ( e ) => this._saveGridblock( e ) );
		this.$element.find( '[data-action="add-new"]' ).on( 'click', () => this.addNewSection() );
	}

	/**
	 * When the section menu is too close to the top, point it down.
	 *
	 * @since 1.2.8
	 * @param Event e.
	 */
	menuDirection( e ) {
		var pos = e.screenY - window.screenY,
			menuHeight = 340,
			staticMenuPos = BG.Menu.$mceContainer[0].getBoundingClientRect();

		if ( pos - staticMenuPos.bottom < menuHeight ) {
			this.$element.find( '.popover-menu-imhwpb' ).addClass( 'menu-down' );
		} else {
			this.$element.find( '.popover-menu-imhwpb' ).removeClass( 'menu-down' );
		}

	}

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
		var $newSection = $( this.emptySectionTemplate() ) ;
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
		var $prev = this.$target.prev();

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
		var $next = this.$target.next();
		if ( $next.length ) {
			$next.after( this.$target );
		}

		BG.Controls.$container.trigger( BG.Controls.$container.delete_event );
	}

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
