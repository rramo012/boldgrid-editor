var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Icon = {

		name : 'icon',

		priority : 80,
		
		tooltip : 'Icon Design',

		iconClasses : 'fa fa-cog',

		selectors : [ '.fa' ],

		panel : {
			title : 'Change Icon',
			height : '400px',
			width : '335px',
		},

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		elementClick : function() {
			self.openPanel();
		},
		
		insertNew : function () {
			var $insertedIcon;
			
			send_to_editor( '<i class="fa fa-cog bg-inserted-icon" aria-hidden="true"> </i>' );
			$insertedIcon = BG.Controls.$container.find( '.bg-inserted-icon' ).last();
			BG.Controls.$container.find( '.bg-inserted-icon' ).removeClass('bg-inserted-icon');
			BG.Controls.$menu.targetData[ self.name ] = $insertedIcon;
			$insertedIcon.click();
		},

		setupPanelClick : function() {
			var controls = BOLDGRID.EDITOR.Controls,
				panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'click', '.icon-controls .panel-selection', function () {
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
			self.openPanel();
		},

		openPanel : function () {
			var $panel = BG.Panel.$element,
				$menu = BG.Controls.$menu,
				$target = $menu.targetData[ self.name ],
				$selected;

			// Bind Panel Click.
			self.setupPanelClick();

			// Create Markup.
			var $ul = $( '<ul></ul>' ).addClass('icon-controls');
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