var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;
	
	
	BG.CONTROLS.ExitSection = {
		name : 'exit-section-drag',
		tooltip : 'Exit Section Dragging',
		iconClasses : 'genericon genericon-zoom',
		selectors : [ '.dragging-section' ],
		
		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},
		
		onMenuClick : function ( e ) {
			var $this = $( this );
			BG.Controls.$container.find('html').removeClass('zoomout dragging-section');
			BG.Controls.$container.find('body').attr( 'contenteditable', 'true' );
			BG.Controls.$menu.hide();
		},
	};
		
	BG.CONTROLS.ExitSection.init();

	self = BG.DRAG.Section = {

			currentDrag : false,
			
			$container : null,
			
			$dragHelper : null,
			
			sectionLocations : [],
			
			init : function ( $container ){
				self.$container = $container;
				self.$dragHelper = self.renderHelpers();
				self.bind();
				self.bindHelper();
			},
			
			renderHelpers : function () {
				var $dragHelper = $( '<div id="boldgrid-drag-pointer"></div>' );
				self.$container.find('html').append( $dragHelper );
				return $dragHelper;
			},
			
			bind : function () {
				self.$container
					.on( 'dragstart', '.dragging-section', self.prevent )
					.on( 'mousedown', '.dragging-section .boldgrid-section', self.start )
					.on( 'mousemove', '.dragging-section', self.over )
					.on( 'mouseup dragend', '.dragging-section', self.end );
			},
			
			bindHelper : function () {
				self.$container
					.on( 'mousemove', '.dragging-section', self.overHelper );
			},
			
			overHelper : function ( e ) {
				if ( self.$container.$current_drag || self.currentDrag ) {
					if ( ! self.lastPosEvent || self.lastPosEvent + 25 <= e.timeStamp ) {
						self.lastPosEvent = e.timeStamp;
						self.positionHelper( e.originalEvent );
					}
				}
			},
			
			position : function ( pageY ) {
				self.currentDrag.$clone.offset( {
					top : pageY - self.currentDrag.offsetFromTop
				} );
			},
			
			prevent : function ( e ) {
				return false;
			},
			
			end : function (e){
				if ( self.currentDrag ) {
					self.currentDrag.$clone.remove();
					self.currentDrag.$element.removeClass('section-drag-element');
					self.currentDrag = false;
					self.$container.$body.removeClass('no-select-imhwpb');
					self.$container.find('html').removeClass( 'section-dragging-active' );
				}
				
			},
			
			drag : function ( e ) {
    			var mousePosition = e.originalEvent.pageY,
    				insertAfter = null;
    			
    			if ( ! self.sectionLocations.length ) {
    				return;
    			}
    			
    			$.each( self.sectionLocations, function () {
    				if ( this.midPoint < mousePosition ) {
    					insertAfter = this;
    				}
    			} );
    			
    			if ( ! insertAfter && mousePosition > self.sectionLocations[ self.sectionLocations.length - 1 ].midPoint ) {
    				insertAfter = self.sectionLocations[ self.sectionLocations.length - 1 ];
    			}
    			
    			
    			if ( ! insertAfter && mousePosition < self.sectionLocations[0].midPoint ) {
    				self.sectionLocations[0].$section.before( self.currentDrag.$element );
    				self.calcSectionLocs();
    			}
    			
    			if ( insertAfter ) {
    				insertAfter.$section.after( self.currentDrag.$element );
    				self.calcSectionLocs();
    			}
			},
			
			over : function (e) {
				if ( self.currentDrag ) {
					if ( ! self.lastDragEvent || self.lastDragEvent + 100 <= e.timeStamp ) {
						self.lastDragEvent = e.timeStamp;
						self.drag( e );
					}
				}
			},
			
			positionHelper : function ( event ) {
				self.$dragHelper.css( {
					'top' : event.pageY - 15,
					'left' : event.pageX - 15
				} );
			},
			
			initClonePos : function ( posY ) {
				self.currentDrag.$clone.css( {
					'position' : 'absolute',
					'width' : self.currentDrag.$element.css('width'),
				} );
				
				//@todo: fix this, dunno why this is needed.
				for( var i=0; i < 10; i++ ) {
					self.position( posY );
				}
			},
			
			calcSectionLocs : function (){
				var locs = [];
				
				self.$container.$body.find('> .boldgrid-section').not( self.currentDrag.$clone ).each( function () {
					var pos = this.getBoundingClientRect(),
						midPoint = ( pos.bottom - pos.top ) / 2 + pos.top;
					
					locs.push( {
						$section : $( this ),
						midPoint : midPoint
					} );
				} );
				
				self.sectionLocations = locs;
			},
			
			start : function ( e ) {
				
				var $clone,
					$this = $( this );
				
				self.currentDrag = {
					$element : $this,
					$clone : $this.clone(),
					startPos : { x : e.originalEvent.pageX, y : e.originalEvent.pageY },
					offsetFromTop : e.originalEvent.pageY - $this.offset().top
				};
				
				self.currentDrag.$element.addClass('section-drag-element');
				self.currentDrag.$clone.addClass('section-drag-clone');
				self.$container.setInheritedBg( self.currentDrag.$clone, 1 );
				self.$container.$body.append( self.currentDrag.$clone );
				self.initClonePos( e.originalEvent.pageY );
				self.$container.find('html').addClass( 'section-dragging-active' );
				self.$container.$body.addClass( 'no-select-imhwpb' );
				self.$container.$body.removeAttr('contenteditable');
				self.positionHelper( e.originalEvent );
				self.calcSectionLocs();
			}
	};

} )( jQuery );