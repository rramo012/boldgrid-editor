var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;
	
	self = BG.DRAG.Section = {

			/**
			 * @var Object currentDrag Elements and data about the current drag. 
			 * @since 1.2.7
			 */
			currentDrag : false,
			
			/**
			 * @var jQuery $container iFrame.
			 * @since 1.2.7
			 */
			$container : null,
			
			/**
			 * @var jQuery $dragHelper cursor indicator.
			 * @since 1.2.7
			 */
			$dragHelper : null,
			
			/**
			 * @var array sectionLocations. Y locations.
			 * @since 1.2.7
			 */
			sectionLocations : [],
			
			/**
			 * Section dragging. 
			 * 
			 * @since 1.2.7
			 * @param jQuery $container iFrame.
			 */
			init : function ( $container ){
				self.$container = $container;
				self.$dragHelper = self.renderHelpers();
				self.bind();
			},
			
			/**
			 * Attach the mark-up to the DOM. 
			 * 
			 * @since 1.2.7
			 * @return jQuery $dragHelper.
			 */
			renderHelpers : function () {
				var $dragHelper = $( '<div id="boldgrid-drag-pointer"></div>' );
				self.$container.find('html').append( $dragHelper );
				return $dragHelper;
			},
			
			/**
			 * Bind all events used for dragging. 
			 * 
			 * @since 1.2.7
			 */
			bind : function () {
				self.$container
					.on( 'dragstart', '.dragging-section', function () { return false; } )
					.on( 'mousedown', '.dragging-section .boldgrid-section', self.start )
					.on( 'mousemove', '.dragging-section', self.over )
					.on( 'mouseup dragend', '.dragging-section', self.end )
					.on( 'mousemove', '.dragging-section', self.overHelper );
			},
			
			/**
			 * Position the cursor helper on mouse move.
			 * 
			 * @since 1.2.7
			 * @param Event e.
			 */
			overHelper : function ( e ) {
				if ( self.$container.$current_drag || self.currentDrag ) {
					// 25 is polling delay.
					if ( ! self.lastPosEvent || self.lastPosEvent + 25 <= e.timeStamp ) {
						self.lastPosEvent = e.timeStamp;
						self.positionHelper( e.originalEvent );
					}
				}
			},
			
			/**
			 * End the drag progress.
			 * 
			 * @since 1.2.7
			 * @param Event e.
			 */
			end : function ( e ){
				if ( self.currentDrag ) {
					self.currentDrag.$clone.remove();
					self.currentDrag.$element.removeClass('section-drag-element');
					self.currentDrag = false;
					self.$container.$html.removeClass('no-select-imhwpb section-dragging-active');
				}
				
			},
			
			/**
			 * Drag motion. The process of sections interacting with other sections.
			 * 
			 * @since 1.2.7
			 * @param Event e.
			 */
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
    			
    			BG.CONTROLS.Section.updateHtmlSize();
			},

			/**
			 * While the user is moving the mouse and drag has been initiated.
			 * 
			 * @since 1.2.7
			 * @param Event e.
			 */
			over : function ( e ) {
				if ( self.currentDrag ) {
					if ( ! self.lastDragEvent || self.lastDragEvent + 100 <= e.timeStamp ) {
						self.lastDragEvent = e.timeStamp;
						self.drag( e );
					}
					if ( ! self.lastScrollEvent || self.lastScrollEvent + 20 <= e.timeStamp ) {
						self.lastScrollEvent = e.timeStamp;
						// If within 50 px from the bottom scroll down.
						if ( $( window ).height() - e.pageY < 50 ) {
							window.scrollBy( 0, 10 );
						// If within 20% from the top scroll up.
						} else if ( ( e.pageY / $( window ).height() ) < 0.2 ) {
							window.scrollBy( 0, -10 );
						}
					}
				}
			},

			/**
			 * Place the helper at the cursor location.
			 * 
			 * @since 1.2.7
			 * @param Event e.
			 */
			positionHelper : function ( e ) {
				// 15 is the offset from the cursor.
				self.$dragHelper.css( {
					'top' : e.pageY - 15,
					'left' : e.pageX - 15
				} );
			},
			
			/**
			 * Calculate all section locations. Main calcs used for dragging.
			 * 
			 * @since 1.2.7
			 */
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
			
			/**
			 * Drag Start. On Click.
			 * 
			 * @since 1.2.7
			 */
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
				self.$container.find('html').addClass( 'section-dragging-active' );
				self.$container.$html.addClass( 'no-select-imhwpb' );
				self.$container.$body.removeAttr('contenteditable');
				self.positionHelper( e.originalEvent );
				self.calcSectionLocs();
			}
	};

} )( jQuery );