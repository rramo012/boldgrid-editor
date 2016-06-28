var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;
	
	BOLDGRID.EDITOR.CONTROLS.Image = {
			
		name : 'image',

		section : 'row',
	
		priority : 10,
		
		iconClasses : 'genericon genericon-image',

		panelTitle : 'Image Filters',
		
		selectors : [ 'img' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		setupPanelClick : function() {
			var self = this,
				panel = BOLDGRID.EDITOR.Panel;
			
			panel.$element.on( 'click', '.panel-selection', function () {

			} );
		},
		
		onMenuClick : function () {
			var self = this,
				$panel = BOLDGRID.EDITOR.Panel.$element,
				$menu = BOLDGRID.EDITOR.Controls.$menu,
				$target = $menu.targetData[ self.name ],
				$selected;
			
			$panel.show();
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Image.init();
	self = BOLDGRID.EDITOR.CONTROLS.Image;
	
} )( jQuery );