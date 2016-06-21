var IMHWPB = IMHWPB || {};
IMHWPB.EDITOR = IMHWPB.EDITOR || {};

( function ( $ ) {
	
	IMHWPB.EDITOR.Instance = {
		$panel : null,
		$menu : null,
		$container : null,
		init: function ( $container ) {
			this.$container = $container;
			
			this.$container.find( 'body' ).css( 'marginTop', '50px' );
			
			this.loadConfigs();
			this.bindHandlers();
			this.initMenu();
			this.initPanel();
		},
		loadConfigs : function () {
			
		},
		bindHandlers : function () {
			this.onEditibleClick();
			this.onContainerToggle();
			this.onDesignClick();
		},
		onEditibleClick : function () {
			var self = this;
			//TODO this could go into another file.
			this.$container.on( 'click', function ( e ) {
				if ( ! e.boldgrid || ! e.boldgrid.menuItem ) {
					self.$menu.hide();
					self.$panel.hide();
				}
			} );
			this.$container.on( 'click', 'img, i, a', function ( e ) {
				e.boldgrid = e.boldgrid || {};
				e.boldgrid.menuItem = true;
				var $this = $( this );
				var current_bounding_rect = $this[0].getBoundingClientRect();
				self.$menu.hide().css( {
					'top' : current_bounding_rect.top - 40,
					'left' : current_bounding_rect.left - 10,
				} ).fadeIn();
				self.$menu.$target = $this;
			} );
		},
		onContainerToggle : function () {
			var self = this;
			var toggleContainer = function ( event ) {
				var $container = self.$menu.$target.closest( '.container, .container-fluid' );
				if ( $container.hasClass( 'container' ) ) {
					$container.addClass( 'container-fluid' );
					$container.removeClass( 'container' );
				} else {
					$container.addClass( 'container' );
					$container.removeClass( 'container-fluid' );
				}
			}

			//TODO this could go into another file.
			this.$container.on( 'click', '[data-action="toggle-container"]', toggleContainer );
			
		},
		onDesignClick : function () {
			var self = this;
			var editButton = function ( e ) {
				e.boldgrid = e.boldgrid || {};
				e.boldgrid.menuItem = true;
				var $this = $( this );
				var current_bounding_rect = $this[0].getBoundingClientRect();
				self.$panel.css( {
					'top' : current_bounding_rect.top - 40,
					'left' : current_bounding_rect.left - 10,
				} ).show();
			};
			
			//TODO this could go into another file.
			this.$container.on( 'click', '[data-action="edit-icon"]', editButton );
		},
		initMenu : function() {
			console.log( this.$container );
			
			this.$menu = $( BoldgridEditor.instanceMenu );
			this.$container
				.find( 'body' )
				.append( this.$menu );
		},
		initPanel : function() {

			this.$panel = $( BoldgridEditor.instancePanel );
			this.$container
				.find( 'body' )
				.append( this.$panel );
		}
	};
	
} )( jQuery )