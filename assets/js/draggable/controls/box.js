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
				panel.showFooter();
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
				$module.css( 'background-color', self.targetColor );
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
			panel.$element.find('.customize').show();
			panel.$element.find('.presets').hide();
			panel.$element.find('.box-design > .title').hide();
			BG.CONTROLS.Color.$colorPicker.iris( 'color',  self.targetColor );
			panel.$element.find('.box-design [name="box-bg-color"]').val( self.targetColor ).change();
			panel.hideFooter();
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
				$module.css( 'background-color', backgroundColor );
			}
		},

		removeModuleClasses : function ( $module ) {
			$.each( BoldgridEditor.builder_config.boxes, function () {
				$module.removeClass( this );
			} );

			$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );
			$module.css( 'background-color', '' );
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
					type = $this.data('type');

				$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join(' ') ).css( 'background-color', '' );

				if ( 'class' == type ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					$module.css( 'background-color', value );
				}

				self._saveModuleClasses();
			} );

		},

		_initPaddingSlider : function () {
			var defaultPos = 1;

			BG.Panel.$element.find( '.box-design .padding .slider' ).slider( {
				min : 0,
				max : 7,
				value : defaultPos,
				step: 0.1,
				range : 'max',
				slide : function( event, ui ) {
					var $this = $( this ),
						$target = BG.Menu.getTarget( self ),
						$module = self.findModule( $target );

					$module.css( 'padding-left', ui.value + 'em' );
					$module.css( 'padding-right', ui.value + 'em' );
				},
			} ).siblings( '.value' ).html( defaultPos );

			BG.Panel.$element.find( '.box-design .padding-top .slider' ).slider( {
				min : 0,
				max : 200,
				value : defaultPos,
				step: 1,
				range : 'max',
				slide : function( event, ui ) {
					var $this = $( this ),
					$target = BG.Menu.getTarget( self ),
					$module = self.findModule( $target );

					$module.css( 'padding-top', ui.value + 'px' );
					$module.css( 'padding-bottom', ui.value + 'px' );
				},
			} ).siblings( '.value' ).html( defaultPos );
		},

		_initMarginSlider : function () {
			var defaultPos = 0;

			BG.Panel.$element.find( '.box-design .margin .slider' ).slider( {
				min : -15,
				max : 50,
				value : defaultPos,
				range : 'max',
				slide : function( event, ui ) {
					var $this = $( this ),
						$target = BG.Menu.getTarget( self ),
						$module = self.findModule( $target );

					$module.css( 'margin-left', ui.value );
					$module.css( 'margin-right', ui.value );
				},
			} ).siblings( '.value' ).html( defaultPos );

			BG.Panel.$element.find( '.box-design .margin-top .slider' ).slider( {
				min : 0,
				max : 200,
				value : defaultPos,
				range : 'max',
				slide : function( event, ui ) {
					var $this = $( this ),
					$target = BG.Menu.getTarget( self ),
					$module = self.findModule( $target );

					$module.css( 'margin-top', ui.value );
					$module.css( 'margin-bottom', ui.value );
				},
			} ).siblings( '.value' ).html( defaultPos );
		},

		applyUiStyles : function( presets ) {
			var $newElement,
				presetsHtml = '',
				colorCount = 0,
				backgrounds = [],
				backgroundColors = BG.CONTROLS.Color.getPaletteBackgroundColors(),
				colors = [
				    '#ffffff',
				    '#2980b9',
				    '#bdc3c7',
				    '#e74c3c',
				    '#34495e',
				    '#f39c12'
				];

			$.each( backgroundColors, function ( colorClass ) {
				backgrounds.push( {
					'color' : this,
					'colorClass' : colorClass,
				} );
			} );

			$.each( colors, function () {
				backgrounds.push( {
					'color' : this
				} );
			} );

			$.each( presets, function ( index ) {
				$newElement = $( this );

				if ( backgrounds[ colorCount ].colorClass ) {
					$newElement.attr( 'data-value', $newElement.data( 'value' ) + ' ' + backgrounds[ colorCount ].colorClass )
					$newElement.css( 'background-color', backgrounds[ colorCount ].color );
				} else {
					$newElement.css( 'background-color', backgrounds[ colorCount ].color );
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
			
			self._initSliders();

			panel.initScroll( self );
			panel.scrollToSelected();
			
			panel.hideFooter();
		},

	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );