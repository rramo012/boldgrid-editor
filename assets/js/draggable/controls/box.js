var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {

		name : 'box',

		priority : 10,

		iconClasses : 'fa fa-columns',

		selectors : [ '.row [class*="col-md"]:not(.row .row [class*="col-md"])' ],

		panel : {
			title : 'Text Frame',
			height : '400px',
			width : '335px',
		},
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		setup : function () {
			self._setupPresetClick();
		},
		
		_setupPresetClick : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'click', '.box-design .panel-selection', function ( e ) {
				e.preventDefault();
				var $module, 
					$this = $( this ),
					$target = BG.Menu.getTarget( self ),
					$childDiv = $target.find( '> div' ),
					$immediateChildren = $target.find('> *');
				
				if ( $childDiv.length == 1 && $childDiv.not('.row').length && $childDiv.not('[class*="col-md"]').length ) {
					if ( $immediateChildren.length == 1 ) {
						$module = $childDiv;
					}
				}
				
				if ( ! $module ) {
					// Create Module.
					$module = $( '<div class="well"></div>' );
					$module.html( $immediateChildren );
					$target.html( $module );
				} else {
					$module.toggleClass( 'well' );
				}
				
			} );
		},

		openPanel : function ( e ) {
			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-box' );

			console.log( BoldgridEditor.builder_config );
			
			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template() );
			
			BOLDGRID.EDITOR.Panel.open( self );
		},
		
		createBoxMarkup : function () {
			
		}
		
	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );