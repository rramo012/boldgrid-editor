window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};
BOLDGRID.EDITOR.CONTROLS.MEDIA = BOLDGRID.EDITOR.CONTROLS.MEDIA || {};

( function() {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Map = {

		name: 'edit-maps',

		tooltip: 'Edit Map',

		priority: 85,

		iconClasses: 'dashicons dashicons-edit',

		selectors: [ '.boldgrid-google-maps' ],

		init: function() {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		/**
		 * Open the media modal for maps.
		 *
		 * @since 1.3
		 */
		openModal: function() {
			wp.media.editor.open();
			wp.media.frame.setState( 'iframe:google_map' );
			self.setContent();
		},

		/**
		 * Set the tinymce content variable to make sure, when replacing the map works.
		 *
		 * @since 1.4.0.1
		 */
		setContent: function() {
			var $target = BG.Menu.getTarget( this );

			if ( BG.Controls.$container.find( $target ).length ) {
				tinymce.activeEditor.selection.select( $target[0] );
			}
		},

		onMenuClick: function() {
			self.openModal();
		}
	};

	BOLDGRID.EDITOR.CONTROLS.MEDIA.Map.init();
	self = BOLDGRID.EDITOR.CONTROLS.MEDIA.Map;

} )( jQuery );
