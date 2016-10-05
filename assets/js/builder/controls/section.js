var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	"use strict"; 

	var self,
		BG = BOLDGRID.EDITOR;

	BOLDGRID.EDITOR.CONTROLS.Section = {
		
		$container : null,

		$popover : null,
		
		$currentSection : [],
			
		/**
		 * Init section controls.
		 * 
		 * @since 1.2.7.
		 */
		init : function ( $container ) {
			self.renderZoomTools();
			self.$container = $container;
			self.createHandles();
			self.bindHandlers();
		},
		
		/**
		 * Hide the section handles.
		 * 
		 * @since 1.2.7
		 * @param Event e.
		 */
		hideHandles : function ( e ) {
			
			if ( e && e.relatedTarget && $( e.relatedTarget ).closest('.section-popover-imhwpb').length ) {
				return;
			}
			
			self.removeBorder();
			
			self.$popover.find('.popover-menu-imhwpb').addClass('hidden');
			self.$popover.hide();
		},
		
		/**
		 * Remove section poppover target border.
		 * 
		 * @since 1.2.8
		 */
		removeBorder : function () {
			if ( self.$currentSection && self.$currentSection.length ) {
				self.$currentSection.removeClass('content-border-imhwpb');
			}
		},
		
		/**
		 * Render handles and attach them to the dom.
		 * 
		 * @since 1.2.7
		 */
		createHandles : function () {

			self.$popover = $( wp.template('boldgrid-editor-drag-handle')() );

			self.$popover.css( {
				'position' : 'fixed',
			} );

			self.$container.find( 'body' ).after( self.$popover );
			
			self.hideHandles();
		},
		
		/**
		 * When the section menu is too close to the top, point it down.
		 * 
		 * @since 1.2.8
		 * @param Event e.
		 */
		menuDirection : function ( e ) {
			var pos = e.screenY - window.screenY,
				menuHeight = 340,
				staticMenuPos = BG.Menu.$mceContainer[0].getBoundingClientRect();
			
			if ( pos - staticMenuPos.bottom < menuHeight ) {
				self.$popover.find('.popover-menu-imhwpb').addClass('menu-down');
			} else {
				self.$popover.find('.popover-menu-imhwpb').removeClass('menu-down');
			}
			
		},

		/**
		 * Bind all events.
		 * 
		 * @since 1.2.7
		 */
		bindHandlers : function () {
			self.$container.find('body').on( 'mouseenter', '> .boldgrid-section', self.positionHandles );
			self.$container.find('body').on( 'mouseleave', '> .boldgrid-section', self.hideHandles );
			self.$popover.on( 'click', '[data-action]', self.hideHandles );
			self.$popover.on( 'click', '[data-action="delete"]', self.deleteSection );
			self.$popover.on( 'click', '[data-action="duplicate"]', self.clone );
			self.$popover.on( 'click', '[data-action="section-width"]', self.sectionWidth );
			self.$popover.on( 'click', '[data-action="move-up"]', self.moveUp );
			self.$popover.on( 'click', '[data-action="move-down"]', self.moveDown );
			self.$popover.on( 'click', '[data-action="background"]', self.background );
			self.$popover.on( 'click', '[data-action="add-new"]', self.addNewSection );
			self.$popover.on( 'click', '[data-action]', function ( e ) { e.stopPropagation(); } );
			self.$popover.on( 'click', '.move-sections', self.enableSectionDrag );
			self.$popover.on( 'click', '.context-menu-imhwpb', self.menuDirection );
			self.$container.on( 'boldgrid_modify_content', self.positionHandles );
			self.$container.on( 'mouseleave', self.hideHandles );
			self.$container.on( 'end_typing_boldgrid.draggable', self.positionHandles );
			$('.exit-row-dragging').on( 'click', self.exitSectionDrag );
			$( window ).on( 'resize', self.updateHtmlSize );
		},
		
		/**
		 * Match the height of the HTML area and the body area.
		 * 
		 * @since 1.2.7
		 */
		updateHtmlSize : function () {
			
			if ( ! $('body').hasClass('boldgrid-zoomout') ) {
				return;
			}
			
			var rect = self.$container.$body[0].getBoundingClientRect(),
				bodyHeight = rect.bottom - rect.top + 50;
			
			self.$container.find('html').css( 'max-height', bodyHeight );
			$('#content_ifr').css( 'max-height', bodyHeight );
		},
		
		/**
		 * Render the controls for the zoomed view.
		 * 
		 * @since 1.2.7
		 */
		renderZoomTools : function () {
			var template = wp.template('boldgrid-editor-zoom-tools');
			$('#wp-content-editor-tools').append( template() );
		},
		
		/**
		 * Exit section dragging mode.
		 * 
		 * @since 1.2.7
		 */
		exitSectionDrag : function () {
			var $body = $('body'), 
				$window = $( window ),
				$frameHtml = self.$container.find('html');
			
			$body.removeClass('focus-on boldgrid-zoomout');
			$window.trigger('resize');
			$frameHtml.removeClass('zoomout dragging-section');
			self.$container.$body.attr( 'contenteditable', 'true' );
			BG.Controls.$menu.hide();
			self.$container.$body.css( 'transform', '' );
			$frameHtml.css( 'max-height', '' );
			$('#content_ifr').css( 'max-height', '' );
			
			$('html, body').animate( {
			     scrollTop: $("#postdivrich").offset().top
			}, 0 );
		},
		
		/**
		 * Enable section dragging mode.
		 * 
		 * @since 1.2.7
		 */
		enableSectionDrag : function () {
			self.$container.find('html').addClass('zoomout dragging-section');
			self.$container.$body.removeAttr( 'contenteditable' );
			BG.Controls.$menu.addClass('section-dragging');
			$('body').addClass('focus-on boldgrid-zoomout');
			$( window ).trigger('resize').scrollTop(0);
			self.updateHtmlSize();
			
			$( '.bg-zoom-controls .slider' ).slider( {
				min : 1,
				max : 6,
				value : 3,
				range : 'max',
				slide : function( event, ui ) {
					self.removeZoomClasses();
					self.$container.$body.addClass( 'zoom-scale-' + ui.value );
					self.updateHtmlSize();
				},
			} );
		},
		
		/**
		 * Remove zoom classes from the body.
		 * 
		 * @since 1.2.7
		 */
		removeZoomClasses : function () {
			self.$container.$body.removeClass ( function ( index, css ) {
				return (css.match (/(^|\s)zoom-scale-\S+/g) || []).join(' ');
			} );
		},
		
		/**
		 * Position the section popovers.
		 * 
		 * @since 1.2.7
		 */
		positionHandles : function() {
			var pos, $this;
			
			if ( this.getBoundingClientRect ) {
				$this = $( this );
			} else {
				$this = self.$currentSection;
			}
			
			if ( ! $this || ! $this.length || false === $this.is(':visible')  ) {
				self.$popover.hide();
				return;
			}
			
			self.removeBorder();

			pos = $this[0].getBoundingClientRect();

			if ( self.currentlyDragging ) {
				return false;
			}

			self.$popover.find('.popover-menu-imhwpb').addClass('hidden');
			
			// Save the current row.
			self.$currentSection = $this;

			self.$popover.css( {
				'top' :  pos.bottom + 35,
				'left' : 'calc(50% - 38px)',
				'transform' :  'translateX(-50%)'
			} );
			
			self.$currentSection.addClass('content-border-imhwpb');
			
			if ( this.getBoundingClientRect ) {
				self.$popover.show();
			}
		},
		
		/**
		 * Add New section under current section.
		 * 
		 * @since 1.2.7
		 */
		addNewSection : function () {
			var $newSection = $( wp.template('boldgrid-editor-empty-section')() ) ;
			self.$currentSection.after( $newSection );
			self.transistionSection( $newSection );
		},
		
		/**
		 * Fade the color of a section from grey to transparent.
		 * 
		 * @since 1.2.7
		 * @param jQuery $newSection.
		 */
		transistionSection : function ( $newSection ) {
			IMHWPB.tinymce_undo_disabled = true;
			$newSection.animate( {
				    'background-color' : 'transparent'
				  }, 1500, 'swing', function(){
						BG.Controls.addStyle( $newSection, 'background-color', '' );
						IMHWPB.tinymce_undo_disabled = false;
						tinymce.activeEditor.undoManager.add();
				  }
			);
		},
		
		/**
		 * Delete a section.
		 * 
		 * @since 1.2.7
		 */
		deleteSection : function () {
			self.$currentSection.remove();
			self.$container.trigger( self.$container.delete_event );
		},
		
		/**
		 * Clone a section.
		 * 
		 * @since 1.2.7
		 */
		clone : function () {
			self.$currentSection.after( self.$currentSection.clone() );
			self.$container.trigger( self.$container.delete_event );
		},
		
		/**
		 * Move the section up one in the DOM.
		 * 
		 * @since 1.2.7
		 */
		moveUp : function () {
			var $prev = self.$currentSection.prev();
			
			if ( $prev.length ) {
				$prev.before( self.$currentSection );
			
			}
			self.$container.trigger( self.$container.delete_event );
		},
		
		/**
		 * Move the section down one in the DOM.
		 * 
		 * @since 1.2.7
		 */
		moveDown : function () {
			var $next = self.$currentSection.next();
			
			if ( $next.length ) {
				$next.after( self.$currentSection );
			}
			
			self.$container.trigger( self.$container.delete_event );
		},
		
		background : function () {
			self.$currentSection.click();
			BOLDGRID.EDITOR.CONTROLS.Background.openPanel();
		},
		
		/**
		 * Control whether a container is fluid or not.
		 * 
		 * @since 1.2.7
		 */
		sectionWidth : function () {
			BG.CONTROLS.Container.toggleSectionWidth( self.$currentSection.find('.container, .container-fluid') );
			self.$container.trigger( self.$container.delete_event );
		}
		
	};

	self = BOLDGRID.EDITOR.CONTROLS.Section;

} )( jQuery );