var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR; 

	BG.CONTROLS.Add = {
			
		$element : null,

		name : 'add',
		
		tooltip : 'Add New Item',

		priority : 1,

		iconClasses : 'genericon genericon-plus add-element-trigger',

		selectors : [ 'html' ],
		
		menuDropDown : {
			title: 'Add New',
			options: [
				{
					'name' : 'Media',
					'class' : 'action add-media dashicons dashicons-admin-media'
				},
				{
					'name' : 'Button',
					'class' : 'action font-awesome add-button'
				},
				{
					'name' : 'Icon',
					'class' : 'action font-awesome add-icon'
				},
				{
					'name' : 'GridBlock',
					'class' : 'action add-gridblock'
				},
				{
					'name' : 'Section',
					'class' : 'action add-row'
				}
			]
		},
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		/**
		 * When clicking on the menu item "Add", drop down menu form more options.
		 * 
		 * @since 1.2.7
		 */
		onMenuClick : function ( e ) {
			var $this = $( this ); 
			$this.toggleClass('active');
		},
		
		/**
		 * Setup.
		 * 
		 * @since 1.2.7
		 */
		setup : function () {
			self.$element = $( '[data-action="menu-add"]' );

			self._setupDimiss();
			self._setupMenuClick();
		},
		
		/**
		 * When clicking an element on the page, collapse menu.
		 * 
		 * @since 1.2.7
		 */
		elementClick : function () {
			self.$element.removeClass('active');
		},

		/**
		 * Bind all events.
		 * 
		 * @since 1.2.7
		 */
		_setupMenuClick : function () {
			BG.Menu.$element.find('.bg-editor-menu-dropdown')
				.on( 'click', '.action.add-gridblock', self.addGridblock )
				.on( 'click', '.action.add-row', self.addSection )
				.on( 'click', '.action.add-button', BG.CONTROLS.Button.insertNew )
				.on( 'click', '.action.add-media', self.openAddMedia )
				.on( 'click', '.action.add-icon', BG.CONTROLS.Icon.insertNew );
		},
		
		/**
		 * Open Add Media.
		 * 
		 * @since 1.2.7
		 */
		openAddMedia : function () {
			wp.media.editor.open();
			wp.media.frame.setState( 'insert' );
		},
		
		/**
		 * Bind Event: On click of document, collapse menu.
		 * 
		 * @since 1.2.7
		 */
		_setupDimiss : function () {
			$( document ).on( 'click', function ( e ) {
				if ( false === $( e.target ).hasClass( 'add-element-trigger' ) ) {
					self.$element.removeClass('active');
				}
			} );
		},

		/**
		 * Scroll to an element on the iFrame.
		 * 
		 * @since 1.2.7
		 */
		scrollToElement : function ( $newSection, duration ) {
			
			$('html, body').animate({
					scrollTop: $newSection.offset().top
			}, duration );
		},
		
		/**
		 * Add a new Section.
		 * 
		 * @since 1.2.7
		 */
		addSection : function () {
			var $container = BOLDGRID.EDITOR.Controls.$container,
				$newSection = $( wp.template('boldgrid-editor-empty-section')() ) ;
			$container.$body.prepend( $newSection );
			
			self.scrollToElement( $newSection, 200 );
			BG.CONTROLS.Section.transistionSection( $newSection );

		},
		
		/**
		 * Add a new Gridblock.
		 * 
		 * @since 1.2.7
		 */
		addGridblock : function () {
			var mce = BOLDGRID.EDITOR.Controls.editorMceInstance();
			if ( mce ) {
				mce.insert_layout_action();
			}
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Add.init();
	self = BOLDGRID.EDITOR.CONTROLS.Add;

} )( jQuery );