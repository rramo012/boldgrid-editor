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
		section = '<div class="boldgrid-section"></div>',
		container = '<div class="' + defaultContainerClass + '"></div>';

	self.updateContent = function ( $context ) {
		
		self.$context = $context;
		
		removeDoubleContainers();
		addSections();
		addContainers();
		//wrapRows();
		//wrapContainers();
		//wrapTopLevel();
		//createGroups();
	};
    
    var addContainers = function () {
    	self.$context.find( '> .boldgrid-section' ).each( function () {
			var $this = $( this );
			
            // If the is doesnt have a container as its only immediate child wrap it up. 
            if ( $this.children().length !== 1 || ! $this.find('> div').is( '.container, .container-fluid') )  {
                var $container =  $( container ).html( $this.html() );
                $this.html( $container );
            }
		} );
    };
    
    var addSections = function () {
    	self.$context.find( '> div' ).each( function () {
			var $this = $( this );
			
			if ( false === $this.is( '.boldgrid-section' ) && ! $this.find( '.boldgrid-section' ).length ){
				
                if (  $this.is( '.row' )  ) {
                    $this.wrap( section );
                } else {
                    $this.addClass( 'boldgrid-section' );
                }
				
			}
		} );
    };
    
	var removeDoubleContainers = function () {
		self.$context.find( '.container-fluid .container' ).each( function () {
			var $this = $( this );
				$this.closest( '.container-fluid' ).removeClass( 'container-fluid' );
		} );
	};
    
    /*
	var wrapTopLevel = function () {
		// Wrap all top level elements in a section > container > row > col.
		$( '.entry-content .bgtfw > *' ).each( function () {
			var $this = $( this );
			
			if ( false === $this.is( '.container, .container-fluid, .boldgrid-section' ) && ! $this.find( '.container, .container-fluid, .boldgrid-section' ).length ){
				
				$this.wrap( section );
				$this.wrap( '<div class="fluid-container"></div>' );
				$this.wrap( '<div class="row"></div>' );
				$this.wrap( '<div class="col-md-12"></div>' );
				
			}
		} );
	};*/
	/*
	var createGroups = function () {
		// Identify all top level elements that are not sections into section groups.
		$( '.entry-content > *' ).not( '.boldgrid-section' ).each( function () {
			var $this = $( this );
			if ( $this.find( '.boldgrid-section' ).length  ) {
				$this.addClass( 'boldgrid-section-group' );
			}
		} );
	};
	*/

	/*
	var wrapContainers = function () {
		// Wrap all .containers in a section.
		$('.entry-content .container-fluid, .entry-content .container').each( function () {
			var $this = $( this ),
			$parentSection = $this.closestContext( '.boldgrid-section', '.entry-content' );

			if ( ! $parentSection.length ) {
				$this.wrap( section );
			}
		} );
	};*/
	/*
	var wrapRows = function () {
		//Wrap all rows in sections.
		$('.entry-content .row:not(.entry-content .row .row)').each( function () {
			var $this = $( this ),
				$container = $this.closestContext( '.container, .container-fluid', '.entry-content' );

			//If the row is not already wrapped, wrap is in a container and an eligble section.
			if ( ! $container.length ) {
				// If this use to be a fluid page,
				//and the row we are wrapping has an immediate full width column.
					//then remove the padding to make it flush.

				//TODO: this is not always true
				if ( defaultContainerClass == 'container-fluid' && $this.find( '> :first' ).is( '.col-md-12' ) ) {
				//	$this.find( '> :first' ).addClass( 'full-width-column' );
				}

				$this.wrap( section );
				$this.wrap( container );

			// This row is already wrapped. We will make sure the wrap is good.
			} else {
				// A container should have only one top level row.
				var $childrenRows = $container.find( ' > .row' );
				if ( $childrenRows.length > 1 ) {
					var $row = null;
					// Take all the attributes from the container and apply them to the row.
					$childrenRows.each( function () {
						var $this = $( this );

						var $newContainer = $( '<div></div>' ).attr( 'class', $container.attr( 'class' ) );

						$this.wrap( section );
						$this.wrap( $newContainer );
						var $section = $this.closest( '.boldgrid-section' );

						if ( $row ) {
							$row.after( $section );
						} else {
							$container.after( $section );
						}

						$row = $section;
						console.log($row);
					} );
				}
				if ( ! $container.find( '> *' ).length ) {
					$container.remove();
				}
			}
		} );
	};*/
	
} )( jQuery );