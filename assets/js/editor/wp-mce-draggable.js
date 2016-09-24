var IMHWPB = IMHWPB || {};

/**
 * IMHWPB.WP_MCE_Draggable Responsible for interfacing with tinymce and the draggable class.
 */
IMHWPB.WP_MCE_Draggable = function() {
	var self = this;
	var $ = jQuery;
	var additional_classes;

	/**
	 * Resize Handle Selector
	 */
	this.resize_selector = '.mce-resizehandle';

	/**
	 * An instance of the Draggable class
	 */
	this.draggable_instance = false;

	/**
	 * The Main Window
	 */
	var $window = $( window );

	this.draggable_inactive = false;

	this.last_resize = null;

	this.phone_width_needed = 620; //480 + 300;
	this.tablet_width_needed = 1250; //890 + 300;
	this.desktop_width_needed = 1270; //1100 + 300;

	this.bootstrap_container = null;

	var menu_items = [];

	this.bind_window_resize = function () {
		$window.on('resize', function ( ) {
			if ( self.draggable_inactive == false ) {
				self.last_resize = new Date().getTime();
				setTimeout( self.resize_done_event, 250, self.last_resize );
			}
		});
	};

	this.highlight_screen_size = function ( type ) {
		self.remove_icon_highlights();
		$('.mce-boldgrid-' + type ).addClass('boldgrid-highlighted-mce-icon');
	};

	this.remove_icon_highlights = function () {
		$('.mce-displaysize-imhwpb').removeClass('boldgrid-highlighted-mce-icon');
	};

	/**
	 * PreInitialization BoldGrid Event
	 */
	var pre_init = $.Event( 'BoldGridPreInit' );

	/**
	 * Initiate the BoldGrid Dragging for the tinymce window
	 */
	this.load_draggable = function( $container ) {

		if ( false == self.draggable_instance ) {

			// Run all function that should run before draggable is initialized
			$( document ).trigger( pre_init, this );

			IMHWPB.WP_MCE_Draggable.draggable_instance = $container.IMHWPB_Draggable( {
				'dragImage' : 'actual',
				'add_media_event_handler' : self.add_media_action,
				'insert_layout_event_handler' : self.insert_layout_action,
				'menu_items' : menu_items,
				'main_container' : true
			}, $ ).init();

			self.draggable_instance = IMHWPB.WP_MCE_Draggable.draggable_instance;
		}

		tinymce.activeEditor.controlManager.setActive( 'toggle_draggable_imhwpb', true );
		self.bind_events();
	};

	/**
	 * The event that should happen when the user selects add media from a
	 * dropdown
	 */
	this.add_media_action = function( ) {
		self.insert_from_media_modal_tab( 'insert' );
	};

	/**
	 * Insert content from the media modal tab to the editor
	 */
	this.insert_from_media_modal_tab = function( tab_slug ) {

		tinymce.activeEditor.selection.setCursorLocation(
			self.draggable_instance.$boldgrid_menu_action_clicked, 0 );

		wp.media.editor.open();
		wp.media.frame.setState( tab_slug );
	}

	/**
	 * The event that should happen when the user selects add layout from a
	 * dropdown
	 */
	this.insert_layout_action = function( ) {
		self.insert_from_media_modal_tab( 'iframe:insert_layout' );
	};

	/**
	 * When the user clicks on a button, set the cursor location inside the button
	 */
	this.set_button_cursor = function ( e ) {
		if ( e.clientX ) {
			var this_button = $(this);
			var buttons = self.draggable_instance.$master_container.find('button:not([data-mce-bogus])').not(this_button);
			self.replace_all_buttons( buttons );
			tinymce.activeEditor.selection.setCursorLocation( this, 1);
		}
	};

	/**
	 * Refresh the buttons on the page, this is done so that they arent left with a
	 */
	this.replace_all_buttons = function( buttons ) {
		buttons.each( function () {
			var html = this.outerHTML;
			$(this).replaceWith(html);
		});

	}

	/**
	 * Bind actions to the common events
	 */
	this.bind_events = function() {

		self.draggable_instance.$master_container
			.on( 'mousedown.draggable_mce', '.draggable-tools-imhwpb',self.boldgrid_tool_click )
			.on( 'mouseup.draggable_mce', '.draggable-tools-imhwpb',self.boldgrid_tool_click )
			.on( 'add_column_dwpb.draggable_mce', self.add_column_done )
			.on( 'drag_start_dwpb.draggable_mce', self.drag_start )
			.on( 'delete_dwpb.draggable_mce', self.delete_element )
			.on( 'drag_end_dwpb.draggable_mce', self.drag_end_event )
			.on( 'add_row_event_dwpb.draggable_mce', self.set_cursor )
			.on( 'boldgrid_edit_row.draggable_mce', self.edit_row )
			.on( 'click.draggable_mce', 'button:not([data-mce-bogus])',  self.set_button_cursor )
			.on( 'click.draggable_mce', 'a',  function (e) {e.preventDefault();} )
			.on( 'resize_start_dwpb.draggable_mce', self.prevent_edit )
			.on( 'resize_done_dwpb.draggable_mce', self.column_resize_done )
			.on( 'boldgrid_modify_content.draggable_mce', self.boldgrid_modify_content )
			;

		//Selection Event
		self.draggable_instance.$master_container.textSelect(self.text_select_start, self.text_select_end);
	};

	/**
	 * When an element is modified, refresh the iframe height
	 */
	this.boldgrid_modify_content = function () {
		self.refresh_iframe_height();
	};

	/**
	 * Delete element
	 */
	this.delete_element = function () {
		self.add_tiny_mce_history();
		self.refresh_iframe_height();
	};

	/**
	 * Drag Start Event
	 */
	this.drag_start = function () {
		tinymce.activeEditor.getBody().setAttribute( 'contenteditable', false );
		tinyMCE.activeEditor.selection.collapse(false);
		self.end_undo_level_mce();
		self.draggable_instance.$master_container.find('html').addClass('drag-progress');
	}

	/**
	 * When the user starts selecting add the class to the html tag of the document so that we
	 * can hide the popovers.
	 */
	this.text_select_start = function () {
		self.draggable_instance.$master_container.find('html').addClass('selecting');
	};

	/**
	 * After the selection process is done remove the class.
	 */
	this.text_select_end = function () {
		self.draggable_instance.$master_container.find('html').removeClass('selecting');
	};

	/**
	 * Put the cursor in the passed element
	 */
	this.set_cursor = function ( event, $new_element) {
		tinymce.activeEditor.selection.setCursorLocation( $new_element, 0 );
	};

	/**
	 * Prevent the edit
	 */
	this.prevent_edit = function () {
		tinyMCE.activeEditor.selection.collapse(false);
		if ( ! self.draggable_instance.ie_version ) {
			tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
		}
	};

	/**
	 * Pausing the creation of undo levels This helps when dragging an element.
	 * Without this we will have multiple entries in the undo levels
	 */
	this.end_undo_level_mce = function() {
		IMHWPB.tinymce_undo_disabled = true;
	};

	/**
	 * Procedure that when dragging is complete
	 */
	this.drag_end_event = function( event, dropped_element ) {
		tinymce.activeEditor.getBody().setAttribute( 'contenteditable', true );
		IMHWPB.tinymce_undo_disabled = false;
		self.add_tiny_mce_history();
		self.initialize_gallery_objects( self.draggable_instance.$master_container );
		self.draggable_instance.$master_container.find('html').removeClass('drag-progress');

		//Set the cursor into the recently dropped element
		if ( tinymce && tinymce.activeEditor.selection && dropped_element) {
			tinymce.activeEditor.selection.setCursorLocation( dropped_element, 0);
		}
	};

	/**
	 * Procedure that occurs when resizing a column is done
	 */
	this.column_resize_done = function() {
		var $temp;
		
		if ( !self.draggable_instance.ie_version ) {
			
			// Blur the editor, allows FF to focus on click and add caret back in.
			tinymce.activeEditor.getBody().blur();
			
			//This action use to add an undo level, but it appears as if contenteditable, is doing that for us.
			tinymce.activeEditor.getBody().setAttribute('contenteditable', true);

			// Stops tinymce from scorlling to top.
			var $temp = $('<a>temp</a>');
			$( tinyMCE.activeEditor.getBody() ).append( $temp );
			tinymce.activeEditor.selection.setCursorLocation( $temp[0], 0 );
			$temp.focus();
			$temp.remove();
		}
		
		$window.trigger( 'resize' );
	};

	/**
	 * Maintain the height of the editor based on the body and not html as wordpress is doing
	 */
	this.refresh_iframe_height = function () {
		// Experientially disabling this.
		return;
		var new_height = tinymce.activeEditor.getBody().getBoundingClientRect().height + 100;
		if (new_height > 700) {
			$(tinymce.activeEditor.iframeElement).css('height', new_height + 'px' );
		}
	};

	/**
	 * Procedure that occurs when adding a column is complete
	 */
	this.add_column_done = function( event, $added_element ) {
		self.add_tiny_mce_history();
		self.initialize_gallery_objects( self.draggable_instance.$master_container );
		tinymce.activeEditor.selection.setCursorLocation( $added_element, 0 );
	};

	/**
	 * Add undo level to tinymce
	 */
	this.add_tiny_mce_history = function() {
		tinymce.activeEditor.execCommand( 'mceAddUndoLevel' );
	};

	/**
	 * Setup the tinymce gallery objects
	 */
	this.initialize_gallery_objects = function( $container ) {
		if ( typeof IMHWPBGallery != "undefined"
			&& typeof IMHWPBGallery.init_gallery != "undefined" ) {
			$container.find( '.masonry' ).removeClass( 'masonry' );
			IMHWPBGallery.init_gallery( $container );
		}
	};

	/**
	 * Procedure that should occur when a user clicks on a boldgrid handle
	 */
	this.boldgrid_tool_click = function() {
		self.remove_mce_resize_handles();

		if ( ! self.draggable_instance.ie_version ) {
			tinyMCE.activeEditor.selection.select(tinyMCE.activeEditor.getBody(), true);
			tinyMCE.activeEditor.selection.collapse(false);
		}
	};

	/**
	 * Deslect a tinymce image
	 */
	this.remove_mce_resize_handles = function() {
		self.draggable_instance.$master_container.find( '[data-mce-selected]' ).removeAttr(
			'data-mce-selected' );
		self.draggable_instance.$master_container.find( '.mce-resizehandle' ).remove();
		$( '.mce-wp-image-toolbar' ).hide();
		self.draggable_instance.$master_container.find( self.resize_selector ).hide();
	};
	
	this.addDeactivateClasses = function () {
		$('html').addClass('draggable-inactive');
		$( tinymce.activeEditor.iframeElement ).contents().find('html').addClass('draggable-inactive');
	};

	/**
	 * Activates and deactivates the draggable plugin
	 */
	this.toggle_draggable_plugin = function( event ) {

		var $container = $( tinymce.activeEditor.iframeElement ),
			currentDocument = $container.contents().get( 0 );

		self.draggable_inactive = self.set_style_sheet_inactive( 'draggable',
			!self.draggable_inactive, currentDocument );

		var $target;
		if ( typeof event != 'undefined' ) {
			$target = $( event.target );
		}

		if ( self.draggable_inactive ) {
			self.remove_icon_highlights();
			self.draggable_instance.unbind_all_events();

			if ( $target ) {
				$target.closest( 'div' ).removeClass( 'mce-active' );
			}

			if ( BoldgridEditor.is_boldgrid_theme == false ) {
				IMHWPB.Editor.instance.remove_editor_styles();
				$('[name="screen_columns"][value="' + IMHWPB.Editor.instance.original_column_val + '"]').click();
			}
			
			self.addDeactivateClasses();
		} else {
			if ( $target ) {
				$target.closest( 'div' ).addClass( 'mce-active' );
			}

			if ( self.draggable_instance.bind_events ) {
				self.draggable_instance.bind_events();
				self.bind_events();
			} else {
				self.load_draggable($(tinymce.activeEditor.iframeElement).contents());
			}
			
			$('html').removeClass('draggable-inactive');
			$container.contents().find('html').removeClass('draggable-inactive');
		}

		// Ajax save state.
		self.saveDraggableState( ! self.draggable_inactive );

		$window.trigger( 'resize' );
	};

	/**
	 * When the user toggles the Drag and Drop, ajax to save choice
	 *
	 * @since 1.0.9
	 */
	this.saveDraggableState = function ( enabled ) {
		$.post( ajaxurl, {
		    action : 'boldgrid_draggable_enabled',
		    draggable_enabled : enabled ? 1 : 0,
		    security : BoldgridEditor.draggableEnableNonce
		} );
	};

	/**
	 * Set a style sheet inactive
	 */
	this.set_style_sheet_inactive = function( name, inactive_bool, doc ) {

		if ( typeof doc == 'undefined' ) {
			doc = document;
		}

		var stylesheet_status;
		var regex = new RegExp( name, 'i' );
		$.each( doc.styleSheets, function( key, stylesheet ) {
			if ( stylesheet.href && stylesheet.href.match( regex ) ) {
				stylesheet.disabled = inactive_bool;
				stylesheet_status = stylesheet.disabled;
				return false;
			}
		} );

		return stylesheet_status;
	};

	/**
	 * Create a hidden iframe that will allows us to view the front end site
	 */
	this.create_front_page_iframe = function () {
		
		if ( BoldgridEditor.is_boldgrid_theme ) {
			return;
		}
		
		var $temp_loaded_container = $('<div class="hidden temp-container">');
		$.get( BoldgridEditor.site_url, function( data ){

			$temp_loaded_container.html( data );

			//Create Iframe
			$('html').append('<iframe id="resizer-iframe" width="1600" height="600"></iframe>');
			self.$resizing_iframe = $('#resizer-iframe');

			//Remove Elements that we dont want loaded
			$temp_loaded_container.find('script, meta, title').remove();
			$temp_loaded_container.find('img').attr('src', '');
			$temp_loaded_container.find('img').attr('srcset', '');
			$temp_loaded_container.find('[onload]').removeAttr('onload');

			$stripped_without_styles = $temp_loaded_container.clone();
			$stripped_without_styles.find('link, style').remove();

			//Apply the bootstrap container class first and if not found
			//Try to match front end window size.
			self.$resizing_iframe[0]
				.contentWindow
				.document
				.write($stripped_without_styles.html());

			$container = self.$resizing_iframe
				.contents()
				.find( 'article[class^="post-"]' )
				.closest('.container, .container-fluid');

			if ( ! $container.length ) {
				$container =  self.$resizing_iframe
					.contents()
					.find( 'article[class^="post-"] .entry-content > :first-child' )
					.closest( '.container, .container-fluid' );
			}

			if ( $container.hasClass('container') ) {
				self.bootstrap_container = 'container';
			} else if ( $container.hasClass('container-fluid') ) {
				self.bootstrap_container = 'container-fluid';
			}

			if ( self.bootstrap_container ) {
				//self.tinymce_body_container.addClass(self.bootstrap_container);
				self.$resizing_iframe.remove(); 
				$window.trigger('resize');
				return;
			} else {
				self.$resizing_iframe[0].src = BoldgridEditor.site_url;
				self.$resizing_iframe[0].onload = function () {
					self.$post_container = self.$resizing_iframe
						.contents()
						.find( 'article[class^="post-"]' );
					$window.trigger('resize');
				};
			}
		});
	};

	/**
	 * Event to fire once the user resizes their window
	 */
	this.resize_done_event = function ( current_resize, force_update ) {

		if ( self.last_resize == current_resize || force_update) {
			var $iframe_html = self.tinymce_body_container.closest('html');
			var $iframe_body = self.tinymce_body_container;
			if ( ! self.bootstrap_container && self.$resizing_iframe ) {
				//Something went wrong
				if ( ! self.$post_container || ! self.$post_container.width() ) {
					return;
				}

				//Set the temporary hidden iframe to the same width as the editor
				//Then find the post width on the front end iframe and set the
				//editor to the same width
				self.$resizing_iframe.attr('width', $iframe_html.width());
				$iframe_body.css('width', self.$post_container.width());
			}

			//No Display Type Selected
			if ( !IMHWPB.Editor.instance.currently_selected_size ) {
				if ( window.innerWidth > 1470 ) {
					all_elements_visible();
				} else if ( window.innerWidth > 1355 ) {
					collapse_sidebar();
				} else if ( window.innerWidth > 1041 ) {
					min_visible();
				} else if (  window.innerWidth <= 1040 ) {
					self.set_num_columns(2);
				}
			//Monitor type Selected
			} else if ( IMHWPB.Editor.instance.currently_selected_size == 'monitor' ) {

				if ( window.innerWidth > 1470 ) {
					all_elements_visible();
				} else if ( window.innerWidth > 1355 ) {
					collapse_sidebar();
				} else {
					min_visible();
				}
			//Tablet type Selected
			} else if ( IMHWPB.Editor.instance.currently_selected_size == 'tablet' ) {

				if ( window.innerWidth > 1250 ) {
					all_elements_visible();
				} else if ( window.innerWidth > 1134 ) {
					collapse_sidebar();
				} else {
					min_visible();
				}
			//Phone type Selected
			} else if ( IMHWPB.Editor.instance.currently_selected_size == 'phone' ) {
				all_elements_visible();
			}

			//Highlight the current display type
			self.update_device_highlighting();
			self.refresh_iframe_height();
			self.$window.trigger( 'resize.boldgrid-gallery' );

		}
	};

	/**
	 * Layout arrangement for Large displays
	 */
	var all_elements_visible = function () {
		self.set_num_columns(2);
		self.$body.removeClass('folded');
		self.$window.trigger('scroll');
	}

	/**
	 * Layout arrangement for Medium displays
	 */
	var collapse_sidebar = function () {
		self.set_num_columns(2);
		self.$body.addClass('folded');
		self.$window.trigger('scroll');
	}

	/**
	 * Layout arrangement for Small displays
	 */
	var min_visible = function () {
		self.set_num_columns(1);
		self.$body.addClass('folded');
		self.$window.trigger('scroll');
	};

	/**
	 * Set the number of columns for the page
	 */
	this.set_num_columns = function (columns) {
		if ( columns == 1 ) {
			self.$post_body.addClass('columns-1').removeClass('columns-2');
		} else {
			self.$post_body.addClass('columns-2').removeClass('columns-1');
		}
	}

	/**
	 * Highlight Current Device
	 */
	this.update_device_highlighting = function () {
		if ( self.$mce_iframe && ! self.draggable_inactive ) {
			var iframe_width = self.$mce_iframe.width();
			if ( iframe_width > 1061 ) {
				self.highlight_screen_size('desktop');
			} else if ( iframe_width  > 837  ) {
				self.highlight_screen_size('tablet');
			} else {
				self.highlight_screen_size('phone');
			}
		}
	};

	/**
	 * What should happen when the user clicks on the collapse menu?
	 * This fires after wordpresses action on the button
	 */
	this.bind_collapse_click = function () {
		$('#collapse-menu').on('click', function () {
			if ( !IMHWPB.Editor.instance.currently_selected_size ) {
				if (  window.innerWidth > 1355 && window.innerWidth < 1470 ) {
					if ( self.$body.hasClass('folded') ) {
						self.set_num_columns(2);
						self.$window.trigger('scroll');
					} else {
						self.set_num_columns(1);
						self.$window.trigger('scroll');
					}
				}
			}
			self.update_device_highlighting();
		});
	};

	this.bind_column_switch = function () {
		$('[name="screen_columns"]').on('click', function (){
			self.update_device_highlighting();
		});
	};

	/**
	 * Add a menu item to boldgrid menus
	 */
	this.add_menu_item = function( title, element_type, callback ) {
		menu_items.push( {
			'title' : title,
			'element_type' : element_type,
			'callback' : callback,
		} );
	};

	/**
	 * Action that occurs when the user clicks edit as row inside the editor.
	 */
	this.edit_row = function ( event , nested_row ) {
		var $p = $(nested_row).find('p, a');
		if ( $p.length ) {
			tinymce.activeEditor.selection.setCursorLocation( $p[0], 0 );
		}

	};

	/**
	 * Bind the controls that set the size of the overlay
	 */
	this.bind_min_max_controls = function () {
		var $maximize_row_button = $('#max-row-overlay');
		var $min_row_button = $('#min-row-overlay');
		$maximize_row_button.on('click', function () {
			self.$resize_div.animate({
				height: "1000px",
			  }, 1000);
		});

		$min_row_button.on('click', function () {
			self.$resize_div.animate({
				height: "0px",
			  }, 1000);
		});
	};

	/**
	 * Setup the controls for resizing the edit row overlay
	 */
	this.create_resize_handle = function() {
		var  $temp_overlay = $( '.temp-overlay' );
		self.$resize_div.resizable( {
			handles : {
				'n' : $( ".resizable-n" )
			},
			start : function( event, ui ) {
				$temp_overlay.addClass( 'active' );
			},
			stop : function( event, ui ) {
				$temp_overlay.removeClass( 'active' );
			}
		} ).bind( "resize", function( e, ui ) {
			$( this ).css( "top", "auto" );
		} ).removeClass('ui-resizable');
	};

	$( function() {

		self.$window = $(window);
		self.$body = $('body');
		self.$post_body = $('#post-body');
		self.$editor_content_container = $('#poststuff');
		self.$overlay_preview = $('#boldgrid-overlay-preview');
		self.$resize_div = $( "#resizable" );

		self.$mce_iframe = $(tinymce.activeEditor.iframeElement);
		self.tinymce_body_container = self.$mce_iframe.contents().find('body');
		
		self.bind_column_switch();
		self.create_front_page_iframe();
		self.bind_window_resize();
		self.bind_collapse_click();
		self.bind_min_max_controls();
		self.create_resize_handle();

	} );
};
