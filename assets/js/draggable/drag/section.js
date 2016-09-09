var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.DRAG = BOLDGRID.EDITOR.DRAG || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	self = BG.DRAG.Section = {

			currentDrag : false,
			
			$container : null,
			
			init : function ( $container ){
				self.$container = $container;
				
				self.bind();
			},
			
			bind : function () {
				self.$container
					.on( 'dragstart', self.prevent )
					.on( 'mousedown', '.boldgrid-section', self.start )
					.on( 'mousemove', self.over )
					.on( 'mouseup dragend', self.end );
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
				}
				
				self.currentDrag = false;
				self.$container.$body.removeClass('no-select-imhwpb');
			},
			
			over : function (e) {
				if ( self.currentDrag ) {
					self.position( e.originalEvent.pageY );
				}
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
			
			start : function ( e ) {
				
				var $clone,
					$this = $( this );
				
				self.currentDrag = {
					$element : $this,
					$clone : $this.clone(),
					startPos : { x : e.originalEvent.pageX, y : e.originalEvent.pageY },
					offsetFromTop : e.originalEvent.pageY - $this.offset().top
				};
				
				self.currentDrag.$clone.addClass('section-drag-element');
				self.$container.setInheritedBg( self.currentDrag.$clone, 1 );
				self.$container.$body.append( self.currentDrag.$clone );
				self.initClonePos( e.originalEvent.pageY );
				self.$container.$body.addClass( 'no-select-imhwpb' );
			}
	};

} )( jQuery );