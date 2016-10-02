var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.MEDIA = BOLDGRID.EDITOR.CONTROLS.MEDIA || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit = {
			
		name : 'edit-media',
		
		tooltip : 'Edit',
		
		priority : 85,
		
		iconClasses : 'dashicons dashicons-edit',
		
		selectors : [ '[data-wpview-type="gallery"]', '[data-wpview-type="ninja_forms"]' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		/**
		 * Open the media modal for edit gallery & form.
		 * 
		 * @since 1.2.9
		 */
		openModal : function () {
			var target = BG.Menu.getTarget( self ).get(0);
			
			if ( target ) {
				wp.mce.views.edit( tinymce.activeEditor, target );
			}
		},
		
		onMenuClick : function ( e ) {
			self.openModal();
		},
	};

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit.init();
	self = BOLDGRID.EDITOR.CONTROLS.MEDIA.Edit;

} )( jQuery );