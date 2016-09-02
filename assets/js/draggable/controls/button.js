var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Button = {

		name : 'button',

		priority : 80,

		tooltip : 'Button Design',

		iconClasses : 'fa fa-cog',

		selectors : [ '.btn', 'a.button', 'a.button-secondary', 'a.button-primary' ],

		classes : [
			{ name : 'btn btn-rounded btn-flat btn-small-caps' },
			{ name : 'btn btn-pill btn-flat' },
			{ name : 'btn btn-flat' },
			
			{ name : 'btn btn-3d btn-rounded' },
			{ name : 'btn btn-3d btn-pill' },
			{ name : 'btn btn-3d' },
			
			{ name : 'btn btn-raised btn-rounded' },
			{ name : 'btn btn-raised btn-pill' },
			{ name : 'btn btn-raised btn-small-caps' },
			
			{ name : 'btn btn-longshadow btn-rounded btn-color-1' },
			{ name : 'btn btn-longshadow btn-small-caps btn-pill btn-color-1' },
			{ name : 'btn btn-longshadow btn-uppercase btn-color-1' },
			
			{ name : 'btn btn-glow btn-rounded' },
			{ name : 'btn btn-glow btn-pill btn-uppercase' },
			{ name : 'btn btn-glow' },
			
			{ name : 'btn btn-block btn-rounded' },
			{ name : 'btn btn-block btn-pill' },
			{ name : 'btn btn-block btn-small-caps' },
		],
		
		sizeClasses : [
			'btn-tiny',
			'btn-small',
			// Normal.
			'', 
			'btn-large',
			'btn-jumbo',
			'btn-giant',
		],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Button Design',
			height : '500px',
			width : '315px',
			includeFooter : true,
			customizeLeaveCallback : true,
			customizeCallback : true,
			customizeSupport : [ 'margin' ],
			customizeSupportOptions : {
				margin : {
					horMin : -30
				}
			}
		},

		setup : function () {
			self.applyColors();
			self._setupPanelClick();
			self._setupCustomizeOpen();
		},

		_setupCustomizeOpen : function () {
			var panel = BOLDGRID.EDITOR.Panel;

			panel.$element.on( 'bg-customize-open', function () {
				if ( panel.currentControl == self ) {
					self.sizeSlider.init();
				}
			} );
		},

		_setupPanelClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.button-design .panel-selection', function () {
				var $this = $( this ),
					preset = $this.data( 'preset' ),
					$target = BG.Menu.getTarget( self ),
					$parent = $target.parent('p');

				panel.clearSelected();
				$this.addClass( 'selected' );
				
				// Remove old p button classes.
				$parent.removeClass ( function ( index, css ) {
				    return (css.match (/(^|\s)p-button-\S+/g) || []).join(' ');
				} );
				
				// Aply changes to editor.
				$target.attr( 'class', '' );
				$target.addClass( preset );
			} );
		},

		insertNew : function () {
			var $insertedButton;

			send_to_editor( '<a class="button-primary bg-inserted-button" href="#">Button</a>' );
			$insertedButton = BG.Controls.$container.find( '.bg-inserted-button' ).last();
			BG.Controls.$container.find( '.bg-inserted-button' ).removeClass('bg-inserted-button');
			BG.Controls.$menu.targetData[ self.name ] = $insertedButton;
			$insertedButton.click();
			self.openPanel();
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},
		
		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},
		
		applyColors : function() {
			var maxIndex = 5,
				currentIndex = 0;
			
			// BG Themes.
			if ( BoldgridEditor.colors ) {
				maxIndex = BoldgridEditor.colors.length;
			}
			
			$.each( self.classes, function ( count ) {
				if ( maxIndex < currentIndex ) {
					currentIndex = 0;
				}
				
				// Adds Default color, which has no class.
				if ( 0 !== currentIndex ) {
					this.name += ' btn-color-' + ( currentIndex );
				}
				
				if ( (count + 1) % 4 === 0 ) {
					currentIndex++;
				}
			} );
		},
		
		sizeSlider : {
			getDefault : function () {
				var defaultIndex = 2,
					$el = BG.Menu.getCurrentTarget();
				
				$.each( self.sizeClasses, function ( index ) {
					if ( $el.hasClass( this ) ) {
						defaultIndex = index;
						return false;
					}
				} );
				
				return defaultIndex;
			},
			init : function () {
				var defaultSize = this.getDefault() + 1,
					$el = BG.Menu.getCurrentTarget();
			
				BG.Panel.$element.find( '.section.button-size-control .value' ).html( defaultSize );
				BG.Panel.$element.find( '.section.button-size-control .slider' ).slider( {
					min : 1,
					max : 6,
					value : defaultSize,
					range : 'max',
					slide : function( event, ui ) {
						//Remove Classes
						$el.removeClass( self.sizeClasses.join(' ') );
						if ( ui.value ) {
							$el.addClass( self.sizeClasses[ ui.value - 1 ] );
						}
					},
				} );
			}
		},
		
		openPanel : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				template = wp.template( 'boldgrid-editor-button' );

			// Remove all content from the panel.
			panel.clear();

			// Set markup for panel.
			panel.$element.find( '.panel-body' ).html( template( {
				'text' : 'Button',
				'presets' : self.classes,
			} ) );
			
			// Open Panel.
			panel.open( self );
			
			panel.$element.removeClass('ui-widget-content');
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Button.init();
	self = BOLDGRID.EDITOR.CONTROLS.Button;

} )( jQuery );