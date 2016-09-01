var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.VALIDATION = BOLDGRID.EDITOR.VALIDATION || {};

( function ( $ ) {
	"use strict";

	BOLDGRID.EDITOR.VALIDATION.Section = {};
	self = BOLDGRID.EDITOR.VALIDATION.Section;

	$.fn.closestContext = function( sel, context ) {
        var $closest;
        if ( this.is( sel ) ) {
            $closest = this;
        } else {
            $closest = this.parentsUntil( context ).filter( sel ).eq( 0 );
        }

        return $closest;
    };
    
	var defaultContainerClass = 'container',
        sectionClass = 'boldgrid-section',
		section = '<div class="' + sectionClass + '"></div>',
		container = '<div class="' + defaultContainerClass + '"></div>';

	self.updateContent = function ( $context ) {

		defaultContainerClass = BoldgridEditor.default_container || 'container-fluid';
		container = '<div class="' + defaultContainerClass + '"></div>';

		self.$context = $context;
		
		// Wrap all top level P tags in section, container, row, column, paragraph
		wrapParagraphs();
		
		// Add Class boldgrid-section to all parent of containers.
		addSectionClass();
		
		// wrap all containers in sections.
        wrapContainers();
        
        // If row has a parent add the section to the parent.
		addContainers();
        copyClasses();
	};
	
	var wrapParagraphs = function () {
        self.$context.find( '> p' ).each( function () {
			var $this = $( this );
			
			$this.wrap( '<div class="container">' );
            $this.wrap( '<div class="row">' );
            $this.wrap( '<div class="col-md-12">' );
		} );
	};
    
    var copyClasses = function() {
         self.$context.find( '.boldgrid-section > .container-fluid' ).each( function () {
			var $this = $( this ),
                classToAdd = $this.attr('class').replace('container-fluid', '');
             
             $this.attr( 'class', 'container-fluid' );
             $this.parent().addClass( classToAdd );
		} );
    };
    
    var addSectionClass = function () {
        self.$context.find( '.container, container-fluid' ).each( function () {
			var $this = $( this ),
                $parent = $this.parent();
			
            if( $parent.length && $parent[0] != self.$context[0] && false === $parent.hasClass( sectionClass ) ) {
               $parent.addClass( sectionClass );
            }
		} );
    };
    
    var addContainers = function () {
    	self.$context.find( '.row:not(.row .row)' ).each( function () {
			var $this = $( this ),
                $parent = $this.parent();
			
            if ( ! $this.closestContext( '.container, .container-fluid', self.$context ).length ) {
                $this.wrap( container );
            }
            
            if ( ! $this.closestContext( '.boldgrid-section', self.$context ).length  ) {
                if ( $parent.length && $parent[0] != self.$context[0] ) {
                    $parent.addClass( sectionClass );
                } else {
                    $this.parent().wrap( section );
                }
            }
		} );
    };
    
    var wrapContainers = function () {
    	self.$context.find( '.container, .container-fluid' ).each( function () {
			var $this = $( this );
			
			if ( ! $this.parent( '.boldgrid-section' ).length && false === $this.hasClass( sectionClass ) ){
                 $this.wrap( section );
			}
		} );
    };
    
} )( jQuery );