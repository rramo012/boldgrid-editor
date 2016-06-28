var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.Panel = {
			
		$element : null,
			
		/**
		 * Initialize the panel.
		 */
		init : function () {

			this.create();
			this.onPanelClose();
			this.setupPanelDrag();
			
		},
		create : function () {
			this.$element = $( BoldgridEditor.instancePanel );
			$( 'body' ).append( this.$element );
		},
		
		setupPanelDrag : function() {
			this.$element.draggable( { 
				containment: '#wpwrap',
				handle: '.editor-panel-title',
				scroll : false
			} );
		},
		
		onPanelClose : function() {
			this.$element.on( 'click', '.close-icon', function () {
				self.$element.hide();
			} );
		},

	};
	
	self = BOLDGRID.EDITOR.Panel;
	
} )( jQuery );