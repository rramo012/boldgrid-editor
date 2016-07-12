var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Font = {

		name : 'font',

		priority : 10,

		iconClasses : 'fa fa-text-width',

		selectors : [ 'p, h1, h2, h3, h4, h5, h6, table, section' ],

		textEffectClasses : [
			{ name : 'mod-text-effect inset-text' },
			{ name : 'mod-text-effect shadows' },
		//	{ name : 'mod-text-effect simple-shadow' },
		//	{ name : 'mod-text-effect gradient' },
			{ name : 'mod-text-effect glow' },
			{ name : 'mod-text-effect closeheavy' },
			{ name : 'mod-text-effect enjoy-css' },
			{ name : 'mod-text-effect retro' },
			{ name : 'mod-text-effect stroke' },
		//	{ name : 'mod-text-effect elegantshadow' },
		//	{ name : 'mod-text-effect deepshadow' },
		//	{ name : 'mod-text-effect neon-text' },
		//	{ name : 'mod-text-effect anaglyph' },
		//	{ name : 'mod-text-effect board-game' },
		//	{ name : 'mod-text-effect long-shadow' },
		///	{ name : 'mod-text-effect rainbow' },
		//	{ name : 'mod-text-effect neon' },
		],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		panel : {
			title : 'Text Setting',
			height : '450px',
			width : '268px',
		},

		setup : function () {
			self._setupEffectClick();
			self._setupColorClick();
		},

		_setupEffectClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.section.effects .panel-selection', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ];

				$.each( self.textEffectClasses, function () {
					$target.removeClass( this.name );
				} );

				$target.addClass( $this.data( 'preset' ) );
				$this.siblings().removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		_setupColorClick : function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.section.colors .panel-selection', function () {
				var colorClasses,
					$this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ];

				colorClasses = [
					'color1-color',
					'color2-color',
					'color3-color',
					'color4-color',
					'color5-color'
				];

				$target.removeClass( colorClasses.join(' ') );
				$target.addClass( $this.data( 'preset' ) );

				$this.siblings().removeClass( 'selected' );
				$this.addClass( 'selected' );
			} );
		},

		onMenuClick : function ( e ) {
			self.openPanel();
		},

		initSizeSlider : function ( $container, $el ) {

			var elementSize = $el.css( 'font-size' ),
				defaultSize = elementSize ?  parseInt( elementSize ) : 14,
				defaultSize = ( defaultSize >= 5 ) ? defaultSize : 14;

			$container.find( '.section.size .value' ).html( defaultSize );
			$container.find( '.section.size .slider' ).slider( {
				min : 5,
				max : 44,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					$container.find( '.section.size .value' ).html( ui.value );
					$el.css( 'font-size', ui.value );
					IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height();
				},
			} );
		},
		charSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'letter-spacing' ),
				defaultSize = 0.2;

			BG.Panel.$element.find( '.section.spacing .character .value' ).html( defaultSize );
			BG.Panel.$element.find( '.section.spacing .character .slider' ).slider( {
				step: 0.1,
				min : -0.1,
				max : 2,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Panel.$element.find( '.section.spacing .character .value' ).html( ui.value );
					$el.css( 'letter-spacing', ui.value );
				},
			} );
		},

		lineSpacingSlider : function ( $el ) {

			var elementSize = $el.css( 'line-height' ),
			defaultSize = 1;

			BG.Panel.$element.find( '.section.spacing .line .value' ).html( defaultSize);
			BG.Panel.$element.find( '.section.spacing .line .slider' ).slider( {
				step: 0.1,
				min : 0.5,
				max : 3,
				value : defaultSize,
				range : 'max',
				slide : function( event, ui ) {
					BG.Panel.$element.find( '.section.spacing .line .value' ).html( ui.value);
					$el.css( 'line-height', ui.value );
				},
			} );
		},

		/**
		 * When the user clicks on an image, if the panel is open, set panel content.
		 */
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},

		openPanel : function () {
			var panel = BG.Panel,
				colorControls = BG.CONTROLS.Color.create(),
				template = wp.template( 'boldgrid-editor-font' ),
				$target = BG.Menu.$element.targetData[ self.name ];

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template( {
				'textEffectClasses' : self.textEffectClasses,
				'colorControls' : colorControls,
			} ) );

			self.initSizeSlider( panel.$element, $target );
			self.charSpacingSlider( $target );
			self.lineSpacingSlider( $target );

			// Open Panel.
			panel.open( self );
		}
	};

	BOLDGRID.EDITOR.CONTROLS.Font.init();
	self = BOLDGRID.EDITOR.CONTROLS.Font;

} )( jQuery );