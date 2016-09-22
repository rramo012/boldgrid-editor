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

		/**
		 * Panel Settings.
		 * 
		 * @since 1.2.7
		 */
		panel : {
			title : 'Change Icon',
			height : '500px',
			width : '335px',
			includeFooter : true,
			customizeLeaveCallback : true,
			customizeCallback : function () {
				self.openCustomizer();
			},
			customizeSupport : [ 'fontColor', 'fontSize', 'margin', 'rotate' ],
			customizeSupportOptions : {
				margin : {
					horMin : -30
				}
			}
		},
		
		template : wp.template( 'boldgrid-editor-icon' ),

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		/**
		 * Load the control. This is only run once.
		 * 
		 * @since 1.2.7
		 */
		setup : function () {
			self._setupClosePanel();
			self._setupCustomizeLeave();
		},

		/**
		 * When the user clicks on an icon automatically open the panel.
		 * 
		 * @since 1.2.7
		 */
		elementClick : function() {
			self.openPanel();
		},
		
		/**
		 * When a user leaves the customize section highlight the element.
		 * 
		 * @since 1.2.7
		 */
		_setupCustomizeLeave : function () {
			BG.Panel.$element.on( 'bg-customize-exit', function () {
				if ( self.name === BG.Panel.currentControl.name ) {
					self.highlightElement();
				}
			} );
		},
		
		/**
		 * When the user closes the Panel, unselect the current icon.
		 * 
		 * @since 1.2.7
		 */
		_setupClosePanel : function () {
			BG.Panel.$element.on( 'bg-panel-close', function () {
				if ( BG.Panel.currentControl && self.name === BG.Panel.currentControl.name ) {
					self.collapseSelection();
				}
			} );
		},
		
		/**
		 * Unselect current mce selection.
		 * 
		 * @since 1.2.7
		 */
		collapseSelection : function () {
			tinymce.activeEditor.execCommand( 'wp_link_cancel' );
		},
		
		/**
		 * Open customization mode.
		 * 
		 * @since 1.2.7
		 */
		openCustomizer : function () {
			var panel = BG.Panel;
			self.collapseSelection();
			panel.$element.find('.panel-body .customize').show();
			panel.$element.find('.presets').hide();
			panel.$element.trigger( 'bg-open-customization' );
			panel.scrollTo(0);
			panel.hideFooter();
		},
		
		/**
		 * Insert a new icon.
		 * 
		 * @since 1.2.7
		 */
		insertNew : function () {
			var $insertedIcon;
			
			send_to_editor( '<i class="fa fa-cog bg-inserted-icon" aria-hidden="true"> </i>' );
			$insertedIcon = BG.Controls.$container.find( '.bg-inserted-icon' ).last();
			BG.Controls.$container.find( '.bg-inserted-icon' ).removeClass('bg-inserted-icon');
			BG.Controls.$menu.targetData[ self.name ] = $insertedIcon;
			$insertedIcon.click();
		},

		/**
		 * Setup clicking on a panel.
		 * 
		 * @since 1.2.7
		 */
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
		
		/**
		 * Highlight the icon and set the WordPress link option to popup.
		 * 
		 * @since 1.2.7
		 */
		highlightElement : function () {
			var $el = BG.Menu.getTarget( self );
			tinymce.activeEditor.selection.select( $el[0] );
			tinymce.activeEditor.execCommand( 'WP_Link' );
		},

		/**
		 * When the user clicks on the menu item open the panel.
		 * 
		 * @since 1.2.7
		 */
		onMenuClick : function () {
			self.openPanel();
		},
		
		/**
		 * Open the panel, setting the content.
		 * 
		 * @since 1.2.7
		 */
		openPanel : function () {
			var $panel = BG.Panel.$element,
				$menu = BG.Controls.$menu,
				$target = $menu.targetData[ self.name ],
				$selected;
			
			self.highlightElement();

			// Bind Panel Click.
			self.setupPanelClick();

			// Create Markup.
			$panel.find( '.panel-body' ).html( self.template( {
				presets : BoldgridEditor.icons
			} ) );

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