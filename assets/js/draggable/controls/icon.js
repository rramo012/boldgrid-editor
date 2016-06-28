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
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		setupPanelClick : function() {
			var self = this,
				controls = BOLDGRID.EDITOR.Controls,
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
			var self = this,
				$panel = BOLDGRID.EDITOR.Panel.$element,
				$menu = BOLDGRID.EDITOR.Controls.$menu,
				$target = $menu.targetData[ self.name ],
				$selected;
			
			self.setupPanelClick();
			
			var $ul = $( '<ul></ul>' );
			$.each( BoldgridEditor.icons, function () {
				var $li = $('<li class="panel-selection"><i class="' + this['class'] + '">' +
						'</i><span class="name">' + this.name + '</span></li>');
				$ul.append( $li );
			} );
			
			$panel.find( '.editor-panel-body' ).html( $ul );
			
			$panel.find( '.selected' ).removeClass( 'selected' );
			
			$selected = $panel.find( 'i[class="' + $target.attr( 'class' ) + '"]' )
				.closest( '.panel-selection' )
				.addClass( 'selected' );
			
			//$selected[0].scrollIntoView();
			console.log( $selected[0].getBoundingClientRect() );
			console.log( $selected.offset().top );
			console.log( $selected.scrollTop() );
			$panel.find( '.editor-panel-body' )[0].scrollTop = $selected.offset().top - 900;
			/*
			$panel.find( '.editor-panel-body' ).animate({
	            scrollTop: $selected.offset().top + 'px'
	        }, 'fast');
			*/
			$panel.show();
		}
		
	};
	
	BOLDGRID.EDITOR.CONTROLS.Icon.init();
	self = BOLDGRID.EDITOR.CONTROLS.Icon;
	
} )( jQuery );