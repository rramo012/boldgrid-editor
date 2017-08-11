var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Hr = {

		name: 'hr',

		tooltip: 'Horizontal Rule Styles',

		priority: 80,

		iconClasses: 'genericon genericon-minus',

		selectors: [ '.row .row' ],

		panel: {
			title: 'Horizontal Rule Styles',
			height: '450px',
			width: '275px',
			includeFooter: true,
			customizeLeaveCallback: true,
			customizeSupport: [ 'fontColor', 'margin' ],
			customizeCallback: true
		},

		init: function() {
			BG.Controls.registerControl( this );
		},

		/**
		 * On customization open.
		 *
		 * @since 1.2.7
		 */
		openCustomizer: function() {
			var panel = BG.Panel;
			panel.$element.find( '.customize' ).show();
			panel.$element.find( '.presets' ).hide();
			panel.$element.find( '.hr-design > .title' ).hide();
			BG.Panel.$element.trigger( 'bg-open-customization' );
			panel.scrollTo( 0 );
			BG.Panel.hideFooter();
		},

		onMenuClick: function() {
			self.openPanel();
		},

		getTarget: function() {
			return self.$currentTarget;
		},

		setupPanelClick: function() {
			var controls = BOLDGRID.EDITOR.Controls,
				panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'click', '.hr-design .panel-selection', function() {
				var $menu = controls.$menu,
					$target = BG.Menu.getCurrentTarget(),
					$this = $( this );

				$target.removeClass(function( index, css ) {
					return ( css.match( /(^|\s)bg-hr-\S+/g ) || [] ).join( ' ' );
				} );

				$target.addClass( $this.attr( 'data-preset' ) );
				panel.$element.find( '.selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		preselect: function() {
			var $target = BG.Menu.getCurrentTarget(),
				classes = BG.Util.getClassesLike( $target, 'bg-hr' );

			classes = classes.join( ' ' );
			BG.Panel.clearSelected();
			BG.Panel.$element.find( '[data-preset="' + classes + '"]:first' ).addClass( 'selected' );
		},

		openPanel: function() {
			var panel = BG.Panel,
				template = wp.template( 'boldgrid-editor-hr' );

			// Remove all content from the panel.
			self.$currentTarget = BOLDGRID.EDITOR.Menu.getTarget( self ).find( 'hr:first' );
			panel.clear();

			// Set markup for panel.
			panel.$element.find( '.panel-body' ).html( template( {
				text: 'Horizontal Rule',
				presets: BoldgridEditor.builder_config.component_library.hr.styles,
				myPresets: BoldgridEditor.builder_config.component_library.hr || {}
			} ) );

			panel.showFooter();

			// Open Panel.
			panel.open( self );
			self.preselect();
			self.setupPanelClick();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Hr.init();
	self = BOLDGRID.EDITOR.CONTROLS.Hr;

} )( jQuery );
