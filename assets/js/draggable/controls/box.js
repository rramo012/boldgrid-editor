var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {


		uiBoxDimensions : {
			'bg-box bg-box-rounded' : 'box-wide',
			'bg-box bg-box-rounded-bottom-left bg-box-rounded-bottom-right' : 'box-long',
			'bg-box bg-box-rounded-bottom-right bg-box-rounded-top-right' : 'box-wide',
			'bg-box bg-box-edged bg-box-shadow-bottom-right' : 'box-wide',
			'bg-box bg-box-square bg-box-border-thin' : 'box-long',
			'bg-box bg-box-square bg-box-border-thick' : 'box-wide',
			'bg-box bg-box-square bg-box-border-dashed' : 'box-wide',
			'bg-box bg-box-rounded bg-box-border-dashed' : 'box-long',
			'bg-box bg-box-square bg-box-border-dashed-thick' : 'box-long',
			'bg-box bg-box-circle bg-box-border-double-thick' : 'box-wide',
		},

		namespace : 'bg-box',

		name : 'box',

		priority : 10,

		iconClasses : 'genericon genericon-gallery',

		tooltip : 'Text Background',

		selectors : [ '.row [class*="col-md"]' ],

		panel : {
			title : 'Text Background',
			height : '530px',
			width : '290px',
			includeFooter : true,
			customizeCallback : function () {
				self.openCustomizer();
			},
		},

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		colorControls : null,

		targetClasses : null,

		targetColor : null,

		$presets : null,

		onMenuClick : function ( e ) {
			self.openPanel();
		},

		setup : function () {
			self._setupPresetClick();
			self._setupPresetHover();
			self._setupPanelLeave();
			self._setupBackgroundColor();
			self._setupBorderColor();
			self._setupCustomizeLeave();
			var presets = self.getBoxMarkup();
			self.$presets = self.applyUiStyles( presets );
		},

		_setupCustomizeLeave : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.box-design .back .panel-button', function ( e ) {
				e.preventDefault();

				panel.$element.find('.presets').show();
				panel.$element.find('.box-design > .title').show();
				panel.$element.find('.box-design .customize').hide();
				self.toggleFooter();
				panel.scrollToSelected();
			} );
		},

		_setupPanelLeave : function () {
			var panel = BG.Panel;

			panel.$element.on( 'mouseleave', '.box-design', function ( e ) {
				e.preventDefault();
				var $module,
					$this = $( this ),
					$target = BG.Menu.getTarget( self );

				$module = self.findModule( $target );
				self.removeModuleClasses( $module );
				$module.addClass( self.targetClasses );
				BG.Controls.addStyle( $module, 'background-color', self.targetColor );
			} );
		},
		_setupPresetHover : function () {
			var panel = BG.Panel;

			panel.$element.hoverIntent( {
				out: function ( e ) {},
			    over: function ( e ) {
					e.preventDefault();
					var $module,
						$this = $( this );

					self.addBox( $this );
				},
			    selector: '.box-design .presets .' + self.namespace
			} );
		},

		_setupPresetClick : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.box-design .presets .' + self.namespace, function ( e ) {
				e.preventDefault();
				var $module,
					$this = $( this );

				if ( $this.hasClass( 'selected' ) ) {
					$module = self.findModule( BG.Menu.getTarget( self ) );
					panel.clearSelected();
					self.removeModuleClasses( $module );
					panel.hideFooter();
					self._clearModuleClasses();
				} else {
					self.addBox( $this );
					panel.clearSelected();

					// Save Classes so that when the user mouse leaves we know that these classes are permanent.
					self._saveModuleClasses();
					$this.addClass( 'selected' );
					panel.showFooter();
				}

			} );
		},

		_clearModuleClasses : function () {
			self.targetClasses = '';
			self.targetColor = '';
		},

		_saveModuleClasses : function () {
			var $module = self.findModule( BG.Menu.getTarget( self ) );
			self.targetClasses = $module.attr( 'class' );
			self.targetColor = $module.css( 'background-color' );
		},

		openCustomizer : function () {
			var panel = BG.Panel;
			self._initSliders();
			panel.$element.find('.customize').show();
			panel.$element.find('.presets').hide();
			panel.$element.find('.box-design > .title').hide();
			panel.$element.find('.box-design [name="box-bg-color"]').val( self.targetColor ).change();
			self.setupBorderColor();
			BG.Panel.$element.trigger( 'bg-open-customization' );
			panel.scrollTo(0);
			panel.hideFooter();
		},
		
		setupBorderColor : function () {
			var $target = BG.Menu.getTarget( self ),
				$control = BG.Panel.$element.find('.border-color-controls'),
				$module = self.findModule( $target );
			
			if ( $module.is('[class*="border"]') ) {
				$control.find( '[name="box-border-color"]' ).val( $module.css('border-color') );
				$control.show();
			} else {
				$control.hide();
			}
		},

		findModule : function ( $target ) {
			var $module,
				$childDiv = $target.find( '> div' ),
				$immediateChildren = $target.find('> *'),
				childIsModule = $childDiv.length == 1 && $childDiv.not('.row').length &&
						$childDiv.not('[class*="col-md"]').length &&
						$immediateChildren.length == 1

			if ( childIsModule ) {
				$module = $childDiv;
			}

			if ( ! $module ) {
				// Create Module.
				$module = $( '<div></div>' );
				$module.html( $immediateChildren );
				$target.html( $module );
			}

			return $module;
		},

		addBox : function ( $this ) {
			var $target = BG.Menu.getTarget( self ),
				value = $this.data('value'),
				backgroundColor = $this.css('background-color'),
				$module = self.findModule( $target );

			self.removeModuleClasses( $module );

			$module.addClass( value );
			if ( ! $module.hasClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) ) ) {
				BG.Controls.addStyle( $module, 'background-color', backgroundColor );
			}
		},

		removeModuleClasses : function ( $module ) {
			$.each( BoldgridEditor.builder_config.boxes, function () {
				$module.removeClass( this );
			} );

			$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );
			BG.Controls.addStyle( $module, 'background-color', '' );
		},

		_initSliders : function () {

			self._initPaddingSlider();
			self._initMarginSlider();
		},

		_setupBackgroundColor : function () {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.box-design [name="box-bg-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					$module = self.findModule( $target ),
					value = $this.val(),
					type = $this.attr('data-type');

				$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') );
				BG.Controls.addStyle( $module, 'background-color', '' );

				if ( 'class' == type ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					BG.Controls.addStyle( $module, 'background-color', value );
				}

				self._saveModuleClasses();
			} );
		},
		
		_setupBorderColor : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.box-design [name="box-border-color"]', function () {
				var $this = $( this ),
				$target = BG.Menu.$element.targetData[ self.name ],
				$module = self.findModule( $target ),
				value = $this.val(),
				type = $this.attr('data-type');
				
				$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') );
				BG.Controls.addStyle( $module, 'background-color', '' );
				
				if ( 'class' == type ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					BG.Controls.addStyle( $module, 'background-color', value );
				}
				
				self._saveModuleClasses();
			} );
		},

		_initPaddingSlider : function () {
			var horPaddingEm, vertPaddingEm, convertPxToEm,
				$target = BG.Menu.getTarget( self ),
				defaultFontSize = 14,
				$module = self.findModule( $target ),
				fontSize = $module.css( 'font-size' ),
				defaultPaddingVert = $module.css( 'padding-top' ),
				defaultPaddingHor = $module.css( 'padding-left' );
			
			convertPxToEm = function ( px, fontSize ) {
				var ems = 0;
				if ( fontSize ) {
					ems =  ( px / fontSize ).toFixed(1);
				}
				
				return ems;
			};

			fontSize = fontSize ? parseInt( fontSize ) : defaultFontSize;
			defaultPaddingVert = defaultPaddingVert ? parseInt( defaultPaddingVert ) : 0;
			defaultPaddingHor = defaultPaddingHor ? parseInt( defaultPaddingHor ) : 0;
			
			horPaddingEm = convertPxToEm( defaultPaddingHor, fontSize );
			vertPaddingEm = convertPxToEm( defaultPaddingVert, fontSize );

			BG.Panel.$element.find( '.box-design .padding .slider' ).slider( {
				min : 0,
				max : 7,
				value : horPaddingEm,
				step: 0.1,
				range : 'max',
				slide : function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );
					
					BG.Controls.addStyle( $module, 'padding-left', ui.value + 'em' );
					BG.Controls.addStyle( $module, 'padding-right', ui.value + 'em' );
				},
			} ).siblings( '.value' ).html( horPaddingEm );

			BG.Panel.$element.find( '.box-design .padding-top .slider' ).slider( {
				min : 0,
				max : 7,
				value : vertPaddingEm,
				step: 0.1,
				range : 'max',
				slide : function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );
					
					BG.Controls.addStyle( $module, 'padding-top', ui.value + 'em' );
					BG.Controls.addStyle( $module, 'padding-bottom', ui.value + 'em' );
				},
			} ).siblings( '.value' ).html( vertPaddingEm );
		},

		_initMarginSlider : function () {
			var $target = BG.Menu.getTarget( self ),
				$module = self.findModule( $target ),
				defaultMarginVert = $module.css( 'margin-top' ),
				defaultMarginHor = $module.css( 'margin-left' );
		
			defaultMarginVert = defaultMarginVert  ? parseInt( defaultMarginVert ) : 0;
			defaultMarginHor = defaultMarginHor ? parseInt( defaultMarginHor ) : 0;
		
			BG.Panel.$element.find( '.box-design .margin .slider' ).slider( {
				min : -15,
				max : 50,
				value : defaultMarginHor,
				range : 'max',
				slide : function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );
					
					BG.Controls.addStyle( $module, 'margin-left', ui.value );
					BG.Controls.addStyle( $module, 'margin-right', ui.value );
				},
			} ).siblings( '.value' ).html( defaultMarginHor );

			BG.Panel.$element.find( '.box-design .margin-top .slider' ).slider( {
				min : 0,
				max : 200,
				value : defaultMarginVert,
				range : 'max',
				slide : function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );
					
					BG.Controls.addStyle( $module, 'margin-top', ui.value );
					BG.Controls.addStyle( $module, 'margin-bottom', ui.value );
				},
			} ).siblings( '.value' ).html( defaultMarginVert );
		},
		
		elementClick : function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},

		applyUiStyles : function( presets ) {
			var $newElement,
				presetsHtml = '',
				colorCount = 0,
				backgrounds = [],
				backgroundColors = BG.CONTROLS.Color.getPaletteBackgroundColors(),
				nonBgThemeColors = [
				    '#2980b9',
				    '#bdc3c7',
				    '#e74c3c',
				    'rgb(224, 224, 224)',
				    '#f39c12',
				    '#ffffff',
				],
				colors = [
				    '#fff',
				    '#000',
				    'rgb(236, 236, 236)'
				];

			
			
			if ( ! BoldgridEditor.is_boldgrid_theme ) {
				colors = nonBgThemeColors;
			} else {
				$.each( backgroundColors, function ( colorClass ) {
					backgrounds.push( {
						'color' : this,
						'colorClass' : colorClass,
					} );
				} );
			}

			$.each( colors, function () {
				backgrounds.push( {
					'color' : this
				} );
			} );

			$.each( presets, function ( index ) {
				$newElement = $( this );

				if ( backgrounds[ colorCount ].colorClass ) {
					$newElement.attr( 'data-value', $newElement.data( 'value' ) + ' ' + backgrounds[ colorCount ].colorClass )
					BG.Controls.addStyle( $newElement, 'background-color', backgrounds[ colorCount ].color );
				} else {
					BG.Controls.addStyle( $newElement, 'background-color', backgrounds[ colorCount ].color );
				}

				$newElement.attr( 'data-id', index );

				if ( index % 4 == 0 && index != 0 ) {
					colorCount++;
				}

				if ( ! backgrounds[ colorCount ] ) {
					colorCount = 0;
				}

				presetsHtml += $newElement[0].outerHTML;
			} );

			return presetsHtml;
		},

		getBoxMarkup : function () {
			var boxDimensionsClass,
				config = BoldgridEditor.builder_config.boxes,
				presets = [];

			$.each( config, function ( ) {
				boxDimensionsClass = self.uiBoxDimensions[ this ] || '';
				boxDimensionsClass += ' ';
				presets.push( "<div data-value='" + this + "' class='" + boxDimensionsClass + this + "'></div>" );
			} );

			return presets;
		},

		preselectBox : function () {
			var $target = BG.Menu.getTarget( self ),
				$module = self.findModule( $target ),
				moduleClasses = $module.attr('class'),
				moduleClasses = moduleClasses ? moduleClasses.split( ' ' ) : [],
				moduleBoxClasses = [];

			$.each( moduleClasses, function () {
				if ( this.indexOf('bg-box') === 0 ) {
					moduleBoxClasses.push( this );
				}
			} );
			
			moduleBoxClasses = moduleBoxClasses.join(' ');
				
			/**
			 * Grab all classes that start with bg-box from the target
			 * Foreach preset
			 * 	   if all the module bg-box styles exist on the the preset, then this preset is selected.
			 */
			BG.Panel.$element.find( '.presets > div' ).each( function () {
				var $this = $( this );

				if ( moduleBoxClasses && $this.hasClass( moduleBoxClasses ) ) {
					$this.addClass( 'selected' );
					return false;
				}
			} );
		},
		
		toggleFooter : function () {
			if ( BG.Panel.$element.find('.selected').length ) {
				BG.Panel.showFooter();
			} else {
				BG.Panel.hideFooter();
			}
		},

		openPanel : function ( e ) {

			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-box' );

			self._saveModuleClasses();

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template( {
				'presets' : self.$presets,
				'colorControls' : self.colorControls,
			} ) );

			BOLDGRID.EDITOR.Panel.open( self );

			self.preselectBox();
			panel.$element.find( '.grid' ).masonry({
				itemSelector: '.' + self.namespace,
			} );
			
			panel.initScroll( self );
			panel.scrollToSelected();
			self.toggleFooter();
			
		},

	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );