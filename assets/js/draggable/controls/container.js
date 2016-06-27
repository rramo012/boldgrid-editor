var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.CONTROLS.Container = {

		name : 'container',
			
		section : 'row',
	
		priority : 10,
		
		iconClasses : 'genericon genericon-fullscreen',
		
		selectors : [ '.container' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		menuCallback : function ( e ) {
			var $container = BOLDGRID.EDITOR.Controls.
				$menu.targetData[ self.name ].closest( '.container, .container-fluid' );
			
			if ( $container.hasClass( 'container' ) ) {
				$container.addClass( 'container-fluid' );
				$container.removeClass( 'container' );
			} else {
				$container.addClass( 'container' );
				$container.removeClass( 'container-fluid' );
			}
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Container.init();
	self = BOLDGRID.EDITOR.CONTROLS.Container;
	
} )( jQuery );