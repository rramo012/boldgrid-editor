var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Box = {

		name : 'box',

		priority : 10,

		iconClasses : 'fa fa-columns',

		selectors : [ '.row [class*="col-md"]:not(.row .row [class*="col-md"])' ],
		
		panel : {
			title : 'Text Frame',
			height : '500px',
			width : '310px',
		},
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
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
			var presets = self.getBoxMarkup();
			self.$presets = self.applyUiStyles( presets );
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
				console.log( self.targetClasses );
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
		
		findModule : function ( $target ) {
			var $module,
				$childDiv = $target.find( '> div' ),
				$immediateChildren = $target.find('> *');
			
			if ( $childDiv.length == 1 && $childDiv.not('.row').length && $childDiv.not('[class*="col-md"]').length ) {
				if ( $immediateChildren.length == 1 ) {
					$module = $childDiv;
				}
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
			$.each( BoldgridEditor.builder_config.boxes.shapes, function () {
				$module.removeClass( this );
			} );
			
			$module.css( 'background-color', '' );
			
		},
		
		_saveModuleClasses : function () {
			var $module = self.findModule( BG.Menu.getTarget( self ) );
			self.targetClasses = $module.attr( 'class' );
			self.targetColor = $module.css( 'background-color' );
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
			} ) );
			
			panel.$element.find( '.grid' ).masonry({
				  //columnWidth: '33%',
				itemSelector: '.box',
			} );
			
		},
		
		applyUiStyles : function( presets ) {
			var presetsHtml = '',
				boxUIStyles = [
					'',
					'',
					'',
					'',
					'',
					'box-long',
					'box-wide',
	           	];
			var colors = [
			      		'#1abc9c',
			      		'#2980b9',
			      		'#bdc3c7',
			      		'#e74c3c',
			      		'#34495e',
			      		'#f39c12'
			      	];
			
			var colorCount = 0,
				$newElement;
			$.each( presets, function (  ) {
				$.each( this, function ( index ) {
					console.log( this )
					$newElement = $( this );
					var size = boxUIStyles[ Math.floor( Math.random() * boxUIStyles.length ) ];
				
					$newElement.addClass( size );
					$newElement.css( 'background-color', colors[ colorCount ] );

					if ( index % 4 == 0 && index != 0 ) {
						colorCount++;
					}
					
					if ( colorCount > 5 ) {
						colorCount = 0;
					}
					
					presetsHtml += $newElement[0].outerHTML;
				} );
			} );
			return presetsHtml;
		},
		
		getBoxMarkup : function () {
			var config = BoldgridEditor.builder_config.boxes,
				presets = {};
			
			presets['shapes'] = [];
			presets['shadows'] = [];
			$.each( config.shapes, function ( ) {
				presets['shapes'].push( "<div data-value='" + this + "' class='" + this + "'></div>" );
			} );
	/*		$.each( config.shapes, function ( index, shape ) {
				$.each( config.shadows, function ( index, shadow ) {
					presets['shadows'].push( "<div data-value='" + shape + ' ' + shadow + "' class='" + shape + ' ' + shadow + "'></div>" );
				} );
			} );*/
			return presets;
		}
		
	};

	BOLDGRID.EDITOR.CONTROLS.Box.init();
	self = BOLDGRID.EDITOR.CONTROLS.Box;

} )( jQuery );