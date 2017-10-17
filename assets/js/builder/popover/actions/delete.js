var BG = BOLDGRID.EDITOR;

export class Delete {

	constructor( popover ) {
		this.popover = popover;
	}

	init() {
		this.popover.$element.find( '[data-action="delete"]' ).on( 'click', ( event ) => {
			event.preventDefault();
			this.delete();
		} );
	}

	delete() {
		this.popover.$target.remove();
		this.popover.$element.hide();
		this.popover.updatePosition();
		BG.Controls.$container.trigger( 'delete_dwpb' );
	}

}

export { Delete as default };
