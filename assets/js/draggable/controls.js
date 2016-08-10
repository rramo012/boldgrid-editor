var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

( function ( $ ) {

	BOLDGRID.EDITOR.Controls = {
		$panel : null,
		$menu : null,
		$colorControl : null,
		controls : [],
		$container : null,
		init: function ( $container ) {
			this.$container = $container;

			this.$container.find( 'body' ).css( 'marginTop', '50px' );

			// Init Menu.
			this.$menu = BOLDGRID.EDITOR.Menu.init();

			// Init Panel.
			this.$panel = BOLDGRID.EDITOR.Panel.init();

			// Init Color Control.
			this.colorControl = BOLDGRID.EDITOR.CONTROLS.Color.init();

			this.bindEvents();

			this.setupSliders();

			//Create all controls.
			this.setupControls();
		},

		setupSliders : function () {
			this.$panel.on( "slide", '.section .slider', function( event, ui ) {
				var $this = $( this );
				$this.siblings( '.value' ).html( ui.value );
			} );
		},

		/**
		 * Add a control to the list of controls to be created.
		 */
		registerControl : function ( control ) {
			this.controls.push( control );
		},


		bindEvents : function () {
			this.onEditibleClick();
		},

		onEditibleClick : function () {
			var self = this;
			//TODO this could go into another file.
			this.$container.on( 'click', function ( e ) {
				if ( ! e.boldgrid || ! e.boldgrid.menuItem ) {
					//self.$menu.hide();
				}
			} );

			this.$container.on( 'mouseup', function ( e ) {
				self.$menu.items = [];
			} );

			this.$container.on( 'click', function ( e ) {

				self.$menu.find( 'li[data-action]' ).hide();

				if ( ! self.$menu.items.length ) {
					self.$menu.hide();
					BOLDGRID.EDITOR.Panel.closePanel();
				} else {
					self.$menu.show();
				}

				$.each( self.$menu.items, function () {
					self.$menu.find( '[data-action="menu-' + this + '"]' ).show();

					//If a panel is open.
					BOLDGRID.EDITOR.Menu.reactivateMenu();
				} );

				BOLDGRID.EDITOR.CONTROLS.Color.closePicker();
			} );
		},

		/**
		 * Setup Controls.
		 */
		setupControls : function () {
			var self = this;

			// Sort Controls by priority.
			var compare = function ( a, b ) {

				if ( a.priority < b.priority ) {
					return -1;
				}

				if ( a.priority > b.priority ) {
					return 1;
				}

				return 0;
			}

			this.controls.sort( compare );


			// Bind each menu control.
			$.each( this.controls, function () {
				self.setupControl( this );
			} );
		},

		setupControl : function ( control ) {
			this.bindControlHandler( control );
			BOLDGRID.EDITOR.Menu.createListItem( control );

			if ( control.setup ) {
				control.setup();
			}
		},

		bindControlHandler : function ( control ) {
			var self = this;

			// When the user clicks on an element that has an associated control.
			// Add that control to the list of controls to be made visible.
			this.$container.on( 'click', control.selectors.join(), function ( e ) {
				var $this = $( this );
				if ( 'box' == control.name ) {
					if ( e.boxFound ) {
						return;
					}

					var transparentColors = [
					    'rgba(0, 0, 0, 0)',
					    'transparent'
					];

					if ( $this.closest('.editing-as-row').length ) {
						e.boxFound = true;
					}

					if ( ! e.boxFound && $this.parent().closest('[class*="col-md"]').length ) {
						var $module = BOLDGRID.EDITOR.CONTROLS.Box.findModule( $this );
						var backgroundColor = $module.css('background-color');
						if ( transparentColors.indexOf( backgroundColor ) == -1 ) {
							console.log('box found')
							e.boxFound = true;
						} else {
							return;
						}
					}

				}

				self.$menu.targetData = self.$menu.targetData || {};
				self.$menu.targetData[ control.name ] = $this;

				if ( control.elementClick ) {
					control.elementClick();
				}

				self.$menu.items.push( control.name );
			} );

			// When the user clicks on a menu item, perform the corresponding action.
			this.$menu.on( 'click', '[data-action="menu-' + control.name + '"]', control.onMenuClick );
		}

	};

} )( jQuery )