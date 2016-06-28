var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;

	BOLDGRID.EDITOR.CONTROLS.Icon = {

		name : 'icon',

		section : 'row',

		priority : 10,

		iconClasses : 'genericon genericon-code',

		selectors : [ '.fa' ],

		panel : {
			title : 'Change Icon',
			height : '400px',
			width : '335px',
		},

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		setupPanelClick : function() {
			var controls = BOLDGRID.EDITOR.Controls,
				panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'click', '.panel-selection', function () {
				var $menu = controls.$menu,
					$target = $menu.targetData[ self.name ],
					$this = $( this );

				$target.removeClass (function ( index, css ) {
				    return ( css.match( /(^|\s)fa-\S+/g) || [] ).join( ' ' );
				} );

				$target.addClass( $this.find( 'i' ).attr( 'class' ) );
				panel.$element.find( '.selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		onMenuClick : function () {
			var $panel = BOLDGRID.EDITOR.Panel.$element,
				$menu = BOLDGRID.EDITOR.Controls.$menu,
				$target = $menu.targetData[ self.name ],
				$selected;

			// Bind Panel Click.
			self.setupPanelClick();

			// Create Markup.
			var $ul = $( '<ul></ul>' );
			$.each( BoldgridEditor.icons, function () {
				var $li = $('<li class="panel-selection"><i class="' + this['class'] + '">' +
						'</i><span class="name">' + this.name + '</span></li>');
				$ul.append( $li );
			} );

			$panel.find( '.panel-body' ).html( $ul );

			// Remove Selections.
			$panel.find( '.selected' ).removeClass( 'selected' );

			// Add Selections.
			$selected = $panel.find( 'i[class="' + $target.attr( 'class' ) + '"]' )
				.closest( '.panel-selection' )
				.addClass( 'selected' );

			BOLDGRID.EDITOR.Panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Icon.init();
	self = BOLDGRID.EDITOR.CONTROLS.Icon;

} )( jQuery );