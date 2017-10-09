window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function( $ ) {
	'use strict';

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {

		uiBoxDimensions: {
			'bg-box bg-box-rounded': 'box-wide',
			'bg-box bg-box-rounded-bottom-left bg-box-rounded-bottom-right': 'box-long',
			'bg-box bg-box-rounded-bottom-right bg-box-rounded-top-right': 'box-wide',
			'bg-box bg-box-edged bg-box-shadow-bottom-right': 'box-wide',
			'bg-box bg-box-square bg-box-border-thin': 'box-long',
			'bg-box bg-box-square bg-box-border-thick': 'box-wide',
			'bg-box bg-box-square bg-box-border-dashed': 'box-wide',
			'bg-box bg-box-rounded bg-box-border-dashed': 'box-long',
			'bg-box bg-box-square bg-box-border-dashed-thick': 'box-long',
			'bg-box bg-box-square bg-box-border-double-thick': 'box-wide'
		},

		namespace: 'bg-box',

		name: 'box',

		priority: 20,

		iconClasses: 'genericon genericon-gallery',

		tooltip: 'Column Background',

		selectors: [ '.row [class*="col-md"]' ],

		panel: {
			title: 'Column Background',
			height: '530px',
			width: '290px',
			customizeSupport: [ 'margin', 'customClasses' ],
			includeFooter: true,
			customizeCallback: function() {
				self.openCustomizer();
			}
		},

		init: function() {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		colorControls: null,

		targetClasses: null,

		targetColor: null,

		$presets: null,

		onMenuClick: function() {
			self.openPanel();
		},

		/**
		 * Setup listeners and Init.
		 *
		 * @since 1.2.7
		 */
		setup: function() {
			self._setupPresetClick();
			self._setupPresetHover();
			self._setupPanelLeave();
			self._setupBackgroundColor();
			self._setupBorderColor();
			self._setupCustomizeLeave();
			self._setupSliderChange();

			self.presetsMarkup = self.getBoxMarkup();
		},

		/**
		 * After slider changes, save state of modified element.
		 *
		 * @since 1.2.7
		 */
		_setupSliderChange: function() {
			BG.Panel.$element.on( 'slidechange', '.box-design .slider', function() {
				self._saveModuleClasses();
			} );
		},

		/**
		 * Bind Event: Leaving the customization view of a panel.
		 *
		 * @since 1.2.7
		 */
		_setupCustomizeLeave: function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.box-design .back .panel-button', function( e ) {
				e.preventDefault();

				panel.$element.find( '.presets' ).show();
				panel.$element.find( '.box-design > .title' ).show();
				panel.$element.find( '.box-design .customize' ).hide();
				panel.scrollToSelected();
				BG.Panel.showFooter();
			} );
		},

		/**
		 * Bind Event: Mouse leave on the box panel.
		 *
		 * @since 1.2.7
		 */
		_setupPanelLeave: function() {
			var panel = BG.Panel;

			panel.$element.on( 'mouseleave', '.box-design', function( e ) {
				e.preventDefault();
				let $module,
					$target = BG.Menu.getTarget( self );

				$module = self.findModule( $target );
				self.removeModuleClasses( $module );

				// On mouse leave apply styles.
				$module.addClass( self.targetClasses );

				if ( ! self.targetClasses || -1 === self.targetClasses.indexOf( '-background-color' ) ) {
					BG.Controls.addStyle( $module, 'background-color', self.targetColor );
				}

				self._applyCloneStyles( $module );
			} );
		},

		/**
		 * Apply clones from a cloned element.
		 *
		 * @since 1.2.7
		 * @param jQuery $module.
		 */
		_applyCloneStyles: function( $module ) {
			if ( self.$targetModuleClone ) {
				$module.attr( 'style', self.$targetModuleClone.attr( 'style' ) || '' );
				$module.attr( 'data-mce-style', self.$targetModuleClone.attr( 'style' ) || '' );
			}
		},

		/**
		 * Bind Event: Hovering over a selection.
		 *
		 * @since 1.2.7
		 */
		_setupPresetHover: function() {
			var panel = BG.Panel;

			panel.$element.hoverIntent( {
				out: function() {},
				over: function( e ) {
					var $this = $( this );

					e.preventDefault();

					self.addBox( $this );
				},
				selector: '.box-design .presets .' + self.namespace
			} );
		},

		/**
		 * Bind Event: When clicking preset add classes.
		 *
		 * @since 1.2.7
		 * @param jQuery $module.
		 */
		_setupPresetClick: function() {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.box-design .presets .' + self.namespace, function( e ) {
				var $module,
					$this = $( this );

				e.preventDefault();

				if ( $this.hasClass( 'selected' ) ) {
					$module = self.findModule( BG.Menu.getTarget( self ) );
					self.selfResetBorderClasses( $module );
					panel.clearSelected();
					self.removeModuleClasses( $module );
					self._clearModuleClasses();
					self._clearInlineStyles( $module );
				} else {

					self.addBox( $this );
					panel.clearSelected();

					// Save Classes so that when the user mouse leaves we know that these classes are permanent.
					self._saveModuleClasses();
					$this.addClass( 'selected' );
				}

			} );
		},

		/**
		 * Remove Inline styles from $module.
		 *
		 * @since 1.2.7
		 * @param jQuery $module.
		 */
		_clearInlineStyles: function( $module ) {
			$module.css( 'padding', '' );
			$module.css( 'margin', '' );
			$module.css( 'background-color', '' );
			$module.css( 'border-color', '' );
		},

		/**
		 * Clear stored module classes.
		 *
		 * @since 1.2.7
		 */
		_clearModuleClasses: function() {
			self.targetClasses = '';
			self.targetColor = '';
			self.$targetModuleClone = false;
		},

		/**
		 * Store selected module classes.
		 *
		 * @since 1.2.7
		 */
		_saveModuleClasses: function() {
			var $module = self.findModule( BG.Menu.getTarget( self ) );
			self.targetClasses = $module.attr( 'class' );
			self.targetColor = $module[0].style['background-color'];
			self.$targetModuleClone = $module.clone();
		},

		/**
		 * On customization open.
		 *
		 * @since 1.2.7
		 */
		openCustomizer: function() {
			var panel = BG.Panel;
			self._initSliders();
			panel.$element.find( '.customize' ).show();
			panel.$element.find( '.presets' ).hide();
			panel.$element.find( '.box-design > .title' ).hide();
			panel.$element.find( '.box-design [name="box-bg-color"]' ).val( self.getTarget().css( 'background-color' ) );
			self.setupBorderColor();
			BG.Panel.$element.trigger( 'bg-open-customization' );
			panel.scrollTo( 0 );
			BG.Panel.hideFooter();
		},

		/**
		 * Hide/Show border control if available on module.
		 *
		 * @since 1.2.7
		 */
		setupBorderColor: function() {
			var $target = BG.Menu.getTarget( self ),
				$control = BG.Panel.$element.find( '.border-color-controls' ),
				$module = self.findModule( $target );

			if ( $module.is( '[class*="border"]' ) ) {
				$control.find( '[name="box-border-color"]' ).val( $module.css( 'border-color' ) );
				$control.show();
			} else {
				$control.hide();
			}
		},

		/**
		 * Find the module on the column.
		 *
		 * @since 1.2.7
		 * @param jQuery $target.
		 * @return jQuery $module.
		 */
		findModule: function( $target ) {
			var $module,
				$childDiv = $target.find( '> div' ),
				$immediateChildren = $target.find( '> *' ),
				childIsModule =
					1 === $childDiv.length &&
					$childDiv.not( '.row' ).length &&
					$childDiv.not( '[class*="col-md"]' ).length &&
					1 === $immediateChildren.length;

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

		/**
		 * Add box to a column.
		 *
		 * @since 1.2.7
		 * @param jQuery $this
		 */
		addBox: function( $this ) {
			var style,
				$target = BG.Menu.getTarget( self ),
				value = $this.data( 'value' ),
				backgroundColor = $this.css( 'background-color' ),
				$module = self.findModule( $target );

			self._clearInlineStyles( $module );
			self.selfResetBorderClasses( $module );
			self.removeModuleClasses( $module );

			if ( $this.parent( '.my-designs' ).length ) {
				style = BoldgridEditor.builder_config.components_used.box[ $this.data( 'id' ) ].style;
				$module.attr( 'style', style );
			}

			$module.addClass( value );
			if ( $module.attr( 'class' ) && -1 === $module.attr( 'class' ).indexOf( '-background-color' ) ) {
				BG.Controls.addStyle( $module, 'background-color', backgroundColor );
			}
		},

		/**
		 * Remove all module classes.
		 *
		 * @since 1.2.7
		 */
		removeModuleClasses: function( $module ) {
			$module.removeClass( function( index, css ) {
				return ( css.match( /(^|\s)bg-box?\S+/g ) || [] ).join( ' ' );
			} );

			$module.removeClass( 'bg-background-color' );
			$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );
			$module.removeClass( BG.CONTROLS.Color.textContrastClasses.join( ' ' ) );
			BG.Controls.addStyle( $module, 'background-color', '' );
		},

		/**
		 * Initialize Sliders.
		 *
		 * @since 1.2.7
		 */
		_initSliders: function() {
			self._initPaddingSlider();
		},

		/**
		 * Init Background color control.
		 *
		 * @since 1.2.7
		 */
		_setupBackgroundColor: function() {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.box-design [name="box-bg-color"]', function() {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					$module = self.findModule( $target ),
					value = $this.val(),
					type = $this.attr( 'data-type' );

				$module.removeClass( BG.CONTROLS.Color.textContrastClasses.join( ' ' ) );
				$module.removeClass( BG.CONTROLS.Color.backgroundColorClasses.join( ' ' ) );
				BG.Controls.addStyle( $module, 'background-color', '' );

				if ( 'class' === type ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'text-contrast', value ) );
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'background-color', value ) );
				} else {
					BG.Controls.addStyle( $module, 'background-color', value );
				}

				self._saveModuleClasses();
			} );
		},

		/**
		 * Remove border styles.
		 *
		 * @since 1.2.7
		 */
		selfResetBorderClasses: function( $module ) {
			$module.removeClass( BG.CONTROLS.Color.borderColorClasses.join( ' ' ) );
			BG.Controls.addStyle( $module, 'border-color', '' );
		},

		/**
		 * Init borderr color control.
		 *
		 * @since 1.2.7
		 */
		_setupBorderColor: function() {
			var panel = BG.Panel;

			panel.$element.on( 'change', '.box-design [name="box-border-color"]', function() {
				var $this = $( this ),
					$target = BG.Menu.$element.targetData[ self.name ],
					$module = self.findModule( $target ),
					value = $this.val(),
					type = $this.attr( 'data-type' );

				self.selfResetBorderClasses( $module );

				if ( 'class' === type && BG.Controls.hasThemeFeature( 'border-color-classes' ) ) {
					$module.addClass( BG.CONTROLS.Color.getColorClass( 'border-color', value ) );
				} else {

					// Using backgrond color for themes without background colors.
					if ( '' !== value ) {
						value = $this.prev( 'label' ).css( 'background-color' );
					}

					BG.Controls.addStyle( $module, 'border-color', value );
				}

				self._saveModuleClasses();
			} );
		},

		/**
		 * Init padding slider.
		 *
		 * @since 1.2.7
		 */
		_initPaddingSlider: function() {
			var horPaddingEm, vertPaddingEm,
				$target = BG.Menu.getTarget( self ),
				$module = self.findModule( $target ),
				fontSize = $module.css( 'font-size' ),
				defaultPaddingVert = $module.css( 'padding-top' ),
				defaultPaddingHor = $module.css( 'padding-left' );

			defaultPaddingVert = defaultPaddingVert ? parseInt( defaultPaddingVert ) : 0;
			defaultPaddingHor = defaultPaddingHor ? parseInt( defaultPaddingHor ) : 0;

			horPaddingEm = BG.Util.convertPxToEm( defaultPaddingHor, fontSize );
			vertPaddingEm = BG.Util.convertPxToEm( defaultPaddingVert, fontSize );

			BG.Panel.$element.find( '.box-design .padding .slider' ).slider( {
				min: 0,
				max: 7,
				value: horPaddingEm,
				step: 0.1,
				range: 'max',
				slide: function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );

					BG.Controls.addStyle( $module, 'padding-left', ui.value + 'em' );
					BG.Controls.addStyle( $module, 'padding-right', ui.value + 'em' );
				}
			} ).siblings( '.value' ).html( horPaddingEm );

			BG.Panel.$element.find( '.box-design .padding-top .slider' ).slider( {
				min: 0,
				max: 7,
				value: vertPaddingEm,
				step: 0.1,
				range: 'max',
				slide: function( event, ui ) {
					$target = BG.Menu.getTarget( self );
					$module = self.findModule( $target );

					BG.Controls.addStyle( $module, 'padding-top', ui.value + 'em' );
					BG.Controls.addStyle( $module, 'padding-bottom', ui.value + 'em' );
				}
			} ).siblings( '.value' ).html( vertPaddingEm );
		},

		/**
		 * Get the current target. An override method.
		 *
		 * @since 1.2.7
		 */
		getTarget: function() {
			var $target = BG.Menu.getTarget( self );
			return self.findModule( $target );
		},

		/**
		 * When the user clicks on an element if the panel is already open, refresh it.
		 *
		 * @since 1.2.7
		 */
		elementClick: function() {
			if ( BOLDGRID.EDITOR.Panel.isOpenControl( this ) ) {
				self.openPanel();
			}
		},

		/**
		 * Add colors to boxes.
		 *
		 * @since 1.2.7
		 * @return array presets.
		 */
		updateUiStyles: function() {
			let $newElement,
				presets = self.presetsMarkup,
				presetsHtml = '',
				colorCount = 0,
				backgrounds = [],
				backgroundColors = BG.CONTROLS.Color.getBackgroundForegroundColors(),
				colors = [ '#fff', '#000', 'rgb(236, 236, 236)' ];

			$.each( backgroundColors, function() {
				backgrounds.push( {
					'color': this.color,
					'colorClass': this.background + ' ' + this.text
				} );
			} );

			$.each( colors, function() {
				backgrounds.push( {
					'color': this
				} );
			} );

			$.each( presets, function( index ) {
				$newElement = $( this );

				if ( backgrounds[ colorCount ].colorClass ) {
					$newElement.attr( 'data-value', $newElement.data( 'value' ) + ' ' + backgrounds[ colorCount ].colorClass );
					$newElement.css( 'background-color', backgrounds[ colorCount ].color );
				} else {
					$newElement.css( 'background-color', backgrounds[ colorCount ].color );
				}

				$newElement.attr( 'data-id', index );

				if ( 0 === index % 4 && 0 !== index ) {
					colorCount++;
				}

				if ( ! backgrounds[ colorCount ] ) {
					colorCount = 0;
				}

				presetsHtml += $newElement[0].outerHTML;
			} );

			self.$presets = presetsHtml;

			return presetsHtml;
		},

		/**
		 * Get the markup for all boxes to be rendered.
		 *
		 * @since 1.2.7
		 * @return array presets.
		 */
		getBoxMarkup: function() {
			var boxDimensionsClass,
				config = BoldgridEditor.builder_config.boxes,
				presets = [];

			$.each( config, function( ) {
				boxDimensionsClass = self.uiBoxDimensions[ this ] || '';
				boxDimensionsClass += ' ';
				presets.push( '<div data-value=\'' + this + '\' class=\'' + boxDimensionsClass + this + '\'></div>' );
			} );

			return presets;
		},

		/**
		 * Preselect current module.
		 *
		 * @since 1.2.7
		 */
		preselectBox: function() {
			var $target = BG.Menu.getTarget( self ),
				$module = self.findModule( $target ),
				moduleClasses = $module.attr( 'class' ),
				moduleBoxClasses = [];

			moduleClasses = moduleClasses ? moduleClasses.split( ' ' ) : [];

			$.each( moduleClasses, function() {
				if ( 0 === this.indexOf( 'bg-box' ) ) {
					moduleBoxClasses.push( this );
				}
			} );

			moduleBoxClasses = moduleBoxClasses.length ?  ( '.' + moduleBoxClasses.join( '.' ) ) : false;

			/**
			 * Grab all classes that start with bg-box from the target
			 * Foreach preset
			 * 	   if all the module bg-box styles exist on the the preset, then this preset is selected.
			 */
			BG.Panel.$element.find( '.presets > div' ).each( function() {
				var $this = $( this );

				if ( moduleBoxClasses && $this.filter( moduleBoxClasses ).length ) {
					if ( $this.css( 'background-color' ) === $module.css( 'background-color' ) ) {
						$this.addClass( 'selected' );
						return false;
					}
				}
			} );
		},

		/**
		 * Add styles to my designs.
		 *
		 * @since 1.2.7
		 */
		styleMyDesigns: function() {
			var $body = BG.Controls.$container.$body;

			BG.Panel.$element.find( '.my-designs > *' ).each( function() {
				var $this = $( this ),
					id = $this.data( 'id' ),
					$testElement = $this.clone();

				$testElement.css( 'display', 'none' );
				$testElement.attr( 'style', BoldgridEditor.builder_config.components_used.box[ id ].style );
				$body.append( $testElement );
				$this.css( 'background-color', $testElement.css( 'background-color' ) );
				$this.css( 'border-color', $testElement.css( 'border-color' ) );
				$testElement.remove();
			} );
		},

		/**
		 * Hide duplicates in my designs.
		 *
		 * @since 1.2.7
		 */
		removeInvalid: function() {
			var classes = [];
			BG.Panel.$element.find( '.my-designs > *' ).each( function() {
				var $this = $( this ),
					backgroundColor = $this.css( 'background-color' ),
					uniqueValue = $this.attr( 'data-value' ) + backgroundColor;

				if ( -1 === classes.indexOf( uniqueValue ) && ! BG.CONTROLS.Color.isColorTransparent( backgroundColor ) ) {
					classes.push( uniqueValue );
				} else {
					$this.remove();
				}
			} );
		},

		/**
		 * Add all designs from the page into the my designs array.
		 *
		 * @since 1.2.7
		 */
		_updateMyDesigns: function() {

			BG.Controls.$container.$body.find( '.bg-box' ).each( function() {
				var styles, found,
					$this = $( this );

				styles = {
					classes: $this.attr( 'class' ),
					style: $this.attr( 'style' )
				};

				found = false;
				$.each( BoldgridEditor.builder_config.components_used.box, function() {
					if ( this.style === styles.style && this.classes === styles.classes ) {
						found = true;
						return false;
					}
				} );

				if ( ! found ) {
					BoldgridEditor.builder_config.components_used.box.push( styles );
				}
			} );
		},

		/**
		 * Open Panel.
		 *
		 * @since 1.2.7
		 * @param Event e.
		 */
		openPanel: function() {

			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-box' );

			self.updateUiStyles();

			self._saveModuleClasses();
			self._updateMyDesigns();

			// Remove all content from the panel.
			panel.clear();

			panel.$element.find( '.panel-body' ).html( template( {
				'presets': self.$presets,
				'myPresets': BoldgridEditor.builder_config.components_used.box,
				'colorControls': self.colorControls
			} ) );

			self.styleMyDesigns();
			self.removeInvalid();

			BOLDGRID.EDITOR.Panel.open( self );

			self.preselectBox();
			panel.$element.find( '.grid' ).masonry( {
				itemSelector: '.' + self.namespace
			} );

			panel.initScroll( self );
			panel.scrollToSelected();
			BG.Panel.showFooter();
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );
