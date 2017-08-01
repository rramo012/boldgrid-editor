var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.Feedback = {

		init: function() {
			self.$input = $( '[name="boldgrid-record-feedback"]' );
			self.bindEvents();
		},

		bindEvents: function() {
			$( window )
				.on( 'boldgrid_added_gridblock', addGridblock );
		},

		add: function( options ) {
			var val = self.$input.val() || '[]';
			val = JSON.parse( val );
			val.push( options );
			self.$input.attr( 'value', JSON.stringify( val ) );
		},

		addGridblock: function( data ) {
			BG.Feedback.add( {
				'action': 'installed_gridblock',
				'data': data
			} );
		}

	};

	self = BOLDGRID.EDITOR.Feedback;
	BOLDGRID.EDITOR.Feedback.init();

} )( jQuery );
