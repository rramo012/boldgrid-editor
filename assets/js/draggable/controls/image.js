var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self;

	BOLDGRID.EDITOR.CONTROLS.Image = {
			
		classes : [
			{ name : 'boldgrid-image img-mod-1' },
			{ name : 'boldgrid-image img-mod-2' },
			{ name : 'boldgrid-image img-mod-3' },
			{ name : 'boldgrid-image img-mod-4' },
			{ name : 'boldgrid-image img-mod-5' },
			{ name : 'boldgrid-image img-mod-6' },
			{ name : 'boldgrid-image img-mod-7' },
			{ name : 'boldgrid-image img-mod-8' },
			{ name : 'boldgrid-image img-mod-9' }
		],

		name : 'image',

		priority : 2,

		iconClasses : 'fa fa-cog',

		selectors : [ 'img' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		panel : {
			title : 'Image Design',
			height : '500px',
			width : '340px',
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},
		
		/**
		 * Bind Handlers.
		 */
		setup : function () {
			self._setupPanelClick();
		},
		
		_setupPanelClick : function() {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'click', '.image-design .panel-selection', function () {
				var $this = $( this ),
					preset = $this.data( 'preset' ),
					$target = BOLDGRID.EDITOR.Menu.getTarget( self );
				
				panel.clearSelected();
				$this.addClass( 'selected' );
				
				// Aply changes to editor.
				$target.removeClass ( function ( index, css ) {
				    return (css.match (/(^|\s)img-mod-\S+/g) || []).join(' ');
				} ).addClass( preset );
				
				tinyMCE.activeEditor.selection.collapse(false);
			} );
		},
		
		openPanel : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				$target = BOLDGRID.EDITOR.Menu.getTarget( self ),
				template = wp.template( 'boldgrid-editor-image' );
			
			// Remove all content from the panel.
			panel.clear();
			
			// Set markup for panel.
			panel.$element.find( '.panel-body' ).html( template( {
				'src' : $target.attr( 'src' ),
				'presets' : self.classes,
			} ) );
			
			
			$.each( self.classes, function () {
				if ( $target.hasClass( this.name ) ) {
					panel.$element.find( '[data-preset="' + this.name + '"]' ).addClass( 'selected' );
				}
			} );
			
			// Open Panel.
			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Image.init();
	self = BOLDGRID.EDITOR.CONTROLS.Image;

} )( jQuery );