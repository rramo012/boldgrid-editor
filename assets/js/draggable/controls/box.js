var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict";

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {


		uiBoxDimensions : {
			'box rounded' : 'box-wide',
			'box rounded-bottom-left rounded-bottom-right' : 'box-long',
			'box rounded-bottom-right rounded-top-right' : 'box-wide',
			'box edged shadow-bottom-right' : 'box-wide',
			'box square border-thin' : 'box-long',
			'box square border-thick' : 'box-wide',
			'box square border-dashed' : 'box-wide',
			'box rounded border-dashed' : 'box-long',
			'box square border-dashed-thick' : 'box-long',
			'box circle border-double-thick' : 'box-wide',
		},

		name : 'box',

		priority : 10,

		iconClasses : 'fa fa-columns',

		selectors : [ '.row [class*="col-md"]:not(.row .row [class*="col-md"])' ],

		panel : {
			title : 'Text Background',
			height : '530px',
			width : '290px',
			includeFooter : true,
			customizeCallback : function () {
				self.openCustomizer();
			},
		},

		colors : {
			title : 'Background Color',
			selectCallback : function ( selection ) {
				console.log( selection );
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
			self._setupCustomizeLeave();
			var presets = self.getBoxMarkup();
			self.$presets = self.applyUiStyles( presets );
			//self.colorControls = BG.CONTROLS.Color.create( self );
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
			    selector: '.box-design .presets .box'
			} );
		},

		_setupPresetClick : function () {
			var panel = BG.Panel;

			panel.$element.on( 'click', '.box-design .presets .box', function ( e ) {
				e.preventDefault();
				var $this = $( this );

				self.addBox( $this );
				panel.clearSelected();

				// Save Classes so that when the user mouse leaves we know that these classes are permanent.
				self._saveModuleClasses();
				$this.addClass( 'selected' );
			} );
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
			var setBackgroundColor,
				$target = BG.Menu.getTarget( self ),
				value = $this.data('value'),
				backgroundColor = $this.css('background-color'),
				$module = self.findModule( $target );

			setBackgroundColor = function ( $module ) {
				$module.css( 'background-color', backgroundColor );
			};

			self.removeModuleClasses( $module );
			$module.css( 'background-color', backgroundColor );
			setBackgroundColor( $module );
			$module.addClass( value );
		},

		removeModuleClasses : function ( $module ) {
			$.each( BoldgridEditor.builder_config.boxes, function () {
				$module.removeClass( this );
			} );

			$module.css( 'background-color', '' );
		},

		colorCallback : function( selection ) {
			console.log( selection );
		},

		applyUiStyles : function( presets ) {
			var $newElement,
				presetsHtml = '',
				colorCount = 0,
				colors = [
				    '#1abc9c',
				    '#2980b9',
				    '#bdc3c7',
				    '#e74c3c',
				    '#34495e',
				    '#f39c12'
				];

			$.each( presets, function ( index ) {
				$newElement = $( this );
				$newElement.css( 'background-color', colors[ colorCount ] );

				if ( index % 4 == 0 && index != 0 ) {
					colorCount++;
				}

				if ( colorCount > 5 ) {
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

		openPanel : function ( e ) {
			var panel =  BG.Panel,
				template = wp.template( 'boldgrid-editor-box' );

			self._saveModuleClasses();

			// Remove all content from the panel.
			panel.clear();

			BOLDGRID.EDITOR.Panel.open( self );
			panel.$element.find('.panel-body').html( template( {
				'presets' : self.$presets,
				'colorControls' : self.colorControls,
			} ) );

			panel.$element.find( '.grid' ).masonry({
				itemSelector: '.box',
			} );

		},

	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );