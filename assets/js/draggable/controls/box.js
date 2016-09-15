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
			'bg-box bg-box-square bg-box-border-double-thick' : 'box-wide',
		},

		namespace : 'bg-box',

		name : 'box',

		priority : 20,

		iconClasses : 'genericon genericon-gallery',

		tooltip : 'Column Background',

		selectors : [ '.row [class*="col-md"]' ],

		panel : {
			title : 'Column Background',
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
				
				// On mouse leave apply styles.
				$module.addClass( self.targetClasses );
				BG.Controls.addStyle( $module, 'background-color', self.targetColor );
				self._applyCloneStyles( $module );
			} );
		},
		
		_applyCloneStyles : function ( $module ) {
			if ( self.$targetModuleClone ) {
				$module.attr( 'style', self.$targetModuleClone.attr('style') );
				$module.attr( 'data-mce-style', self.$targetModuleClone.attr('style') );
			}
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
				var $module, style,
					$this = $( this );

				if ( $this.hasClass( 'selected' ) ) {
					$module = self.findModule( BG.Menu.getTarget( self ) );
					self.selfResetBorderClasses( $module );
					panel.clearSelected();
					self.removeModuleClasses( $module );
					panel.hideFooter();
					self._clearModuleClasses();
					self._clearInlineStyles( $module );
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
		
		_clearInlineStyles : function ( $module ) {
			$module.css('padding', '');
			$module.css('margin', '');
			$module.css('background-color', '');
			$module.css('border-color', '');
		},

		_clearModuleClasses : function () {
			self.targetClasses = '';
			self.targetColor = '';
			self.$targetModuleClone = false;
		},

		_saveModuleClasses : function () {
			var $module = self.findModule( BG.Menu.getTarget( self ) );
			self.targetClasses = $module.attr( 'class' );
			self.targetColor = $module.css( 'background-color' );
			self.$targetModuleClone = $module.clone();
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
						$immediateChildren.length == 1;

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
			var style,
				$target = BG.Menu.getTarget( self ),
				value = $this.data('value'),
				backgroundColor = $this.css('background-color'),
				$module = self.findModule( $target );

			self._clearInlineStyles( $module );
			self.selfResetBorderClasses( $module );
			self.removeModuleClasses( $module );
			
			if ( $this.parent('.my-designs').length ) {
				style = BoldgridEditor.builder_config.components_used.box[ $this.data('id') ].style;
				$module.attr( 'style', style );
			}

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
			//self._initMarginSlider();
			BG.CONTROLS.Generic.margin.bind();
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
		
		selfResetBorderClasses : function ( $module ) {
			$module.removeClass( BG.CONTROLS.Color.borderColorClasses.join(' ') );
			BG.Controls.addStyle( $module, 'border-color', '' );
		},
		
		_setupBorderColor : function () {
			var panel = BG.Panel;
			
			panel.$element.on( 'change', '.box-design [name="box-border-color"]', function () {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					$module = self.findModule( $target ),
					value = $this.val(),
					type = $this.attr('data-type');
				
				self.selfResetBorderClasses( $module );
				
				if ( 'class' == type && BG.Controls.hasThemeFeature( 'border-color-classes' ) ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'border-color', value ) );
				} else {
					// Using backgrond color for themes without background colors.
					
					if ( '' !== value ) {
						value = $this.prev('label').css( 'background-color' );
					}
					
					BG.Controls.addStyle( $module, 'border-color', value );
				}
				
				self._saveModuleClasses();
			} );
		},

		_initPaddingSlider : function () {
			var horPaddingEm, vertPaddingEm,
				$target = BG.Menu.getTarget( self ),
				defaultFontSize = 14,
				$module = self.findModule( $target ),
				fontSize = $module.css( 'font-size' ),
				defaultPaddingVert = $module.css( 'padding-top' ),
				defaultPaddingHor = $module.css( 'padding-left' );

			defaultPaddingVert = defaultPaddingVert ? parseInt( defaultPaddingVert ) : 0;
			defaultPaddingHor = defaultPaddingHor ? parseInt( defaultPaddingHor ) : 0;
			
			horPaddingEm = BG.Util.convertPxToEm( defaultPaddingHor, fontSize );
			vertPaddingEm = BG.Util.convertPxToEm( defaultPaddingVert, fontSize );

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
					self._saveModuleClasses();
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
					self._saveModuleClasses();
				},
			} ).siblings( '.value' ).html( vertPaddingEm );
		},
		
		getTarget : function () {
			var $target = BG.Menu.getTarget( self );
			return self.findModule( $target );
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
					self._saveModuleClasses();
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
					self._saveModuleClasses();
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
					$newElement.attr( 'data-value', $newElement.data( 'value' ) + ' ' + backgrounds[ colorCount ].colorClass );
					BG.Controls.addStyle( $newElement, 'background-color', backgrounds[ colorCount ].color );
				} else {
					BG.Controls.addStyle( $newElement, 'background-color', backgrounds[ colorCount ].color );
				}

				$newElement.attr( 'data-id', index );

				if ( index % 4 === 0 && index !== 0 ) {
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
				moduleBoxClasses = [];

			moduleClasses = moduleClasses ? moduleClasses.split( ' ' ) : [];

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
					if ( $this.css('background-color') == $module.css('background-color') ) {
						$this.addClass( 'selected' );
						return false;
					}
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
		
		styleMyDesigns : function () {
			var $body = BG.Controls.$container.$body;
			
			BG.Panel.$element.find('.my-designs > *').each( function (){
				var $this = $( this ),
					id = $this.data('id'),
					$testElement = $this.clone();
				
				$testElement.css( 'display', 'none' );
				$testElement.attr( 'style', BoldgridEditor.builder_config.components_used.box[ id ].style  )
				$body.append( $testElement );
				$this.css( 'background-color', $testElement.css('background-color') );
				$this.css( 'border-color', $testElement.css('border-color') );
				$testElement.remove();
			} );
		},
		
		hideDuplicates : function () {
			var classes = [];
			BG.Panel.$element.find('.my-designs > *').each( function () {
				var $this = $( this ),
					uniqueValue = $this.attr('data-value') + $this.css('background-color');
				
				if ( -1 === classes.indexOf( uniqueValue ) ) {
					classes.push( uniqueValue );
				} else {
					$this.hide();
				}
			} );
		},
		
		_updateMyDesigns : function () {
			
			BG.Controls.$container.$body.find('.bg-box').each( function () {
				var styles, found,
					$this = $( this );
				
				styles = {
					classes : $this.attr('class'),
					style : $this.attr('style')
				};
				
				found = false;
				$.each(  BoldgridEditor.builder_config.components_used.box, function () {
					if ( this.style == styles.style && this.classes == styles.classes ) {
						found = true;
						return false;
					}
				} );
				
				if ( ! found ) {
					BoldgridEditor.builder_config.components_used.box.push( styles );
				}
			} );
		},

		openPanel : function ( e ) {

			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-box' );

			self._saveModuleClasses();
			self._updateMyDesigns();
			
			// Remove all content from the panel.
			panel.clear();

			panel.$element.find('.panel-body').html( template( {
				'presets' : self.$presets,
				'myPresets' : BoldgridEditor.builder_config.components_used.box,
				'colorControls' : self.colorControls
			} ) );
			
			self.styleMyDesigns();
			self.hideDuplicates();

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