var BG = BOLDGRID.EDITOR;

export class Clone {

	constructor( popover ) {
		this.popover = popover;
	}

	init() {
		this.popover.$element.find( '[data-action="duplicate"]' ).on( 'click', () => {
			this.clone();
			this.postClone();
		} );
	}

	clone() {
		let $clone = this.popover.$target.clone();
		this.popover.$target.after( $clone );
	}

	postClone() {
		BG.Controls.$container.trigger( 'boldgrid_clone_element' );
		this.popover.updatePosition();
	}
}

export { Clone as default };
