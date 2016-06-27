var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.CONTROLS.Icon = {
			
		name : 'icon',

		section : 'row',
	
		priority : 10,
		
		iconClasses : 'genericon genericon-spam',
		
		selectors : [ '.fa' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		menuCallback : function ( e ) {
			e.boldgrid = e.boldgrid || {};
			e.boldgrid.menuItem = true;
			
			var $this = $( this );
			
			var $panel = BOLDGRID.EDITOR.Controls.$panel;
			
			var $ul = $( '<ul></ul>' );
			$.each( BoldgridEditor.icons, function () {
				var $li = $('<li class="panel-selection"><i class="' + this['class'] + '">' +
						'</i><span class="name">' + this.name + '</span></li>');
				$ul.append( $li );
			} );
			
			$panel.find( '.editor-panel-body' ).html( $ul );
			
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Icon.init();
	self = BOLDGRID.EDITOR.CONTROLS.Icon;
	
} )( jQuery );