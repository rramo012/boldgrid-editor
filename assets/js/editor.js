var IMHWPB = IMHWPB || {};

/**
 * IMHWPB.Editor
 * Class responsible for interfacing between WordPress and tinyMCE
 * DO NOT AUTOFORMAT
 */
IMHWPB.Editor = function( $ ) {
	var self = this;
	//Have we bound the media open event yet?
	this.media_default_bound = false;
	
	/**
	 * The Main Window
	 */
	var $window = $( window );
	
	//Init common selectors that will be retrieved from the draggable class once initialized
	this.row_selector_string = '';
	this.content_selector_string = '';
	this.column_selector_string = '';
	this.currently_selected_size = null;
	
	this.crop = new BoldgridEditor.crop( $ );

	/**
	 * Select alignment from media modal
	 */
	this.select_alignment = function () {
		var $current_selection = $(tinymce.activeEditor.selection.getNode());
		var $alignment_sidebar = $('.attachments-browser select.alignment');
		var $alignment_sidebar_linkto = $('.attachments-browser select.link-to');

		//Bind the media open event
		if (false == self.media_default_bound) {
			self.media_default_bound = true;
			wp.media.frame.on('open', self.select_alignment);
		}
		
		if ( $current_selection.is('img') ) {
			var classes = $current_selection.attr('class');
			var current_classes = [];
			if ( classes ) {
				current_classes = $current_selection.attr('class').split(/\s+/);
			}
			
			var value_selection = 'none';
			$.each(current_classes, function (index, class_item) {
				if ( class_item == "aligncenter" ) {
					value_selection = "center";
					return false;
				} else if ( class_item == "alignnone" ) {
					value_selection = "none";
					return false;
				} else if ( class_item == "alignright" ) {
					value_selection = "right";
					return false;
				} else if ( class_item == "alignleft" ) {
					value_selection = "left";
					return false;
				}
			});
			
			//Choose default link 
			var default_link_setting = null;
			var $wrapped_link = $current_selection.parent('a');
			if ( !$wrapped_link.length ) {
				default_link_setting = 'none';
			}
			
			if ( $alignment_sidebar_linkto.length && default_link_setting ) {
				$alignment_sidebar_linkto.val(default_link_setting).change();
			}
			
			if ( $alignment_sidebar.length ) {
				$alignment_sidebar.val( value_selection ).change();
			}
		}
	};
	
	/**
	 * When the user clicks on attachments in the media modal, auto select the same alignment 
	 * that their current image has 
	 */
	this.select_default_alignment = function () {
		$( document ).on('click', '.attachments-browser .attachment', self.select_alignment);
	};
	
	/**
	 * Get the draggable object that has been insantiated
	 */
	this.draggable = function () {
		var draggable = null;
		if ( IMHWPB.WP_MCE_Draggable && IMHWPB.WP_MCE_Draggable.instance ) {
			draggable = IMHWPB.WP_MCE_Draggable.instance.draggable_instance;
		}
		
		return draggable;
	};
	
	/**
	 * Carry over the height width and classes of the images when replacing images with images
	 */
	this.override_insert_media = function ()  {
		var original_send_to_editor = send_to_editor;
		send_to_editor = function ( attachments ) {
			var args = [];

			//If we are replacing an image with an image
			if ( !attachments.match(/^\[.+?\]/) ) {
				var $current_selection = $(tinymce.activeEditor.selection.getContent());
				var $inserting_content = $(attachments);
				var inserting_media_image = $inserting_content.is('img')
					|| ($inserting_content.is('a') && $inserting_content.find('*').is('img'));
			}
			
			//Only do this rewrite if inserting 1 image
			if (inserting_media_image && $current_selection.is('img') && $inserting_content.find('img').length <= 1) { 
				var classes_to_add = [];
				var classes = $current_selection.attr('class');
				var current_classes = [];
				if ( classes ) {
					current_classes = classes.split(/\s+/);
				}
			
				var width = $current_selection.attr('width');
				var height = $current_selection.attr('height');
				//Find all classes that need to transfered over
				$.each(current_classes, function (index, class_item) {
					if (!class_item.match(/size-/) && !class_item.match(/align/) && !class_item.match(/wp-image-/)) {
						classes_to_add.push(class_item);
					}
				});
				
				var $image_to_insert = null;
				if ( $inserting_content.is('img') ) {
					var $image_to_insert = $inserting_content;
				} else {
					var $image_to_insert = $inserting_content.find('img');
				}

				//Transfer over the classes
				$.each(classes_to_add, function (key, value) {
					$image_to_insert.addClass(value);
				});
				
				//Set height and width
				$image_to_insert.attr('height', height).attr('width', width);
				
				//Instead of running send_to_editor which is found in wp-admin/js/media-upload.js
				//which then runs editor.execCommand( 'mceInsertContent', false, html );
				//Insert with $ and trigger needed events
				//This is because tinymce was deleting columns and paragraphs if the only thing
				//in it was an image.
				
				//If current node is preceded by an anchor, replace that too
				var $current_node = $(tinymce.activeEditor.selection.getNode());
				var $parent = $current_node.parent();
				if ( $parent.length && $parent[0].tagName == 'A' ) {
					$current_node = $parent;
				}

				$current_node.replaceWith($inserting_content[0].outerHTML);
				tinymce.activeEditor.fire('setContent');
				tinymce.activeEditor.focus();
				tinymce.activeEditor.execCommand( 'mceAddUndoLevel' );
				
				/*
				 * When using BoldGrid Connect Search to add an image to the
				 * page, sometimes everything is successful except the closing
				 * of the media modal. Below, we'll close the media modal.
				 */
				if (window.tb_remove) {
					try {
						window.tb_remove();
					} catch (e) {
					}
				}
				
				return;
			} else {
				args.push(attachments);
			}
				
			original_send_to_editor.apply(this, args)
		};
	};
	
	$( function() {
		/**
		 * Select default alignment from the media modal window
		 * If you are replacing an image with an image, then the default alignment should be
		 * used
		 */
		self.select_default_alignment(); 

		//Store the users original screen column value
		self.original_column_val = $('[name="screen_columns"]:checked').val();

		/**
		 * Adding three new buttons
		 */
		tinymce.PluginManager.add('monitor_view_imhwpb', function( editor, url ) {
			editor.addButton( 'monitor_view_imhwpb', {
				title: 'Desktop View',
				icon: 'icon dashicons dashicons-desktop imhwpb-icon',
				classes: 'displaysize-imhwpb widget btn boldgrid-desktop',
				onclick: function(e) {
					self.activate_display('monitor', $(e.target));
				}
			});
		});
		
		/**
		 * Adding a button that is used to change the view to tablet
		 */
		tinymce.PluginManager.add('tablet_view_imhwpb', function( editor, url ) {
			editor.addButton( 'tablet_view_imhwpb', {
				title: 'Tablet View',
				icon: 'icon dashicons dashicons-tablet imhwpb-icon',
				classes: 'displaysize-imhwpb widget btn boldgrid-tablet',
				onclick: function(e) {
					self.activate_display('tablet', $(e.target));
				}
			});
		});
		
		/**
		 * Adding a button that changes the view to phone
		 */
		tinymce.PluginManager.add('phone_view_imhwpb', function( editor, url ) {
			editor.addButton( 'phone_view_imhwpb', {
				title: 'Phone View',
				icon: 'icon dashicons dashicons-smartphone imhwpb-icon',
				classes: 'displaysize-imhwpb widget btn boldgrid-phone',
				onclick: function(e) {
					self.activate_display('phone', $(e.target));
				}
			});
		});
		
		/**
		 * Allowing the user to toggle the draggable fucntionality
		 */
		tinymce.PluginManager.add('toggle_draggable_imhwpb', function( editor, url ) {
			/**
			 * When replacing an image with an image we will carry over the classes, width and 
			 * height of the image being replaced.
			 */
			self.override_insert_media();
			
			editor.addButton( 'toggle_draggable_imhwpb', {
				title: 'BoldGrid Editing',
				icon: 'icon genericon genericon-move',
				classes: 'widget btn',
				onclick: self.toggle_draggable_plugin
			});
			 //Before adding an undo level check to see if this is allowed
			editor.on('BeforeAddUndo', function(e) {
				if (IMHWPB.tinymce_undo_disabled == true) {
					return false;
				}
			});

			//When content is added to editor
			editor.on( 'SetContent', function( e ) {
				self.reset_anchor_spaces(tinymce.activeEditor.getBody(), true);
				
				if ( $.fourpan && $.fourpan.refresh ) {
					$.fourpan.refresh();
				}
				
				if ( e.format == "html" && self.dragging_is_active() ) {
					//Wrap hr tags
					if ( !e.set ) {
						IMHWPB.WP_MCE_Draggable.instance.draggable_instance.validate_markup();
					}
					
					//When content is set, refresh the iframe height
					if ( IMHWPB.WP_MCE_Draggable ) {
						if ( IMHWPB.WP_MCE_Draggable.instance ) {
							if ( IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height ) {
								setTimeout( function () {
									IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height();
								}, 500 );
							}
						}
					}
				}
			} );
			
			editor.on( 'KeyDown', function( e ) {
				if ( !self.draggable ) {
					return true;
				}
				
				var $current_node = $(tinymce.activeEditor.selection.getNode());
				
				var is_column = $current_node.is( self.draggable.column_selectors_string ) ;
				var is_row = $current_node.is( self.draggable.row_selectors_string );
				var is_anchor = $current_node.is('A');
				
				if ( is_column || is_row ) {
					//Any Character
					if ( (e.which >= 48 && e.which <= 90) || (e.which >= 96 && e.which <= 105) ) {
						
						//Do not delete an element with content
						//TODO: I believe this is triggering sometimes on nested content incorrectly
						if ( $current_node.is(':empty') == false ) {
							if ( $current_node.find('> br').siblings().length !== 0 ) {
								return;
							}
						}
						
						//the key pressed was alphanumeric
						if ( is_column ) {
							var $new_paragraph = $('<p></p>');
							var $structure = $new_paragraph;
						} else {
							var $structure = $('<div class="col-md-12"><p></p></div>');
							var $new_paragraph = $structure.find('p');
						}
						
						$current_node.html($structure);
						editor.selection.setCursorLocation( $new_paragraph[0], 0);
					}
				} else if ( is_anchor ) {
					//Backspace or Delete Key
					if ( e.which == '8' || e.which == '46' ) {
						if ( $current_node.html() == '&nbsp;&nbsp;' ||   $current_node.html() == '&nbsp; ' ) {
							$current_node.remove();
							return false;
						}
					}
				}
				
				return true;
			} );
			
			//Every time the user clicks on a new node.
			//re-map to a different section
			editor.on( 'NodeChange', function( e ) {
				
				var $element = $(e.element);
				
				//If the element is an anchor 
					//And the user clicks on the last or first position in the content
					//And that content character is a space
					//Then re-map the node change to the the position after/before it 
				if ( e.element.tagName == 'A' ) {
					var range = tinymce.DOM.createRng();
					var current_range = tinymce.activeEditor.selection.getRng();
					var position = null;
					if ( current_range.startOffset == current_range.endOffset ) {

						if ( current_range.startOffset === 0 ) {
							//If the first character is a space, set the cursor to the second character
							//to preserve the buffer
							if ( e.element.firstChild.data.substr(0,6) == '&nbsp;' ||
									/\s/.test(e.element.firstChild.data.substr(0,1) )) {
								position = 1;
							} 
						} else if ( e.element.firstChild && current_range.startOffset == e.element.firstChild.length ) {
							var final_pos_offset = 0;
							//If the last character is a space, set the cursor to the second to last
							//character to preserve the buffer
							if ( e.element.firstChild.data.substr(-6) == '&nbsp;' ||
									/\s/.test(e.element.firstChild.data.substr(-1) )) {
								final_pos_offset = -1;
							} 
							position = e.element.firstChild.length + final_pos_offset;
						}
					}
					
					//Set the position of the cursor
					if ( position ) {
						range.setStart(e.element.firstChild, position);
						range.setEnd(e.element.firstChild, position);
						tinymce.activeEditor.selection.setRng(range);
					}
				}
				
				if ( e.selectionChange && $element.length ) {
					if ( $element.is('br') ) {
						$element.parent().children().each( function () {
							var $this = $(this);
							if ( $this.is('a') && $this.html() && !$this.find('img').length ) {
								$new_element = $this.find(':first');
								if ( !$new_element.length ) {
									$new_element = $this;
								}
	
								editor.selection.setCursorLocation( $new_element[0], 1);
								return false;
							}
						});
					}
				}
			} );
			
			/**
			 * While resizing a column if you finish resizing over wpview wrap, mouseup isn't triggered
			 * trigger it manually
			 */
			editor.on('SetAttrib', function(e) {
				if (e.attrElm.hasClass('wpview-wrap') && typeof IMHWPB.WP_MCE_Draggable.instance != 'undefined') {
					var draggable = IMHWPB.WP_MCE_Draggable.instance.draggable_instance;
					if ( draggable.resize ) {
						draggable.$master_container.trigger('mouseup', e.attrElm);
					}
				}
			});
			
			/**
			 * On mouse down of the drag tools, prevent tinymce from blocking event.
			 */	
			editor.on( 'mousedown', function( e ) {
				
				if ( ! self.draggable ) {
					return;
				}
				
				var $target = $( e.target ),
					isResizing = ( true === tinymce.activeEditor.boldgridResize ), 
					isPopoverChild = $target.closest( '.draggable-tools-imhwpb' ).length,
					isActionItem = ! self.draggable.ie_version && $target.hasClass( 'action-list' )
						&& ! $target.attr( 'draggable' ),
					isPopover = isPopoverChild && ! isActionItem,
					newDiv;

				if ( isPopover || isResizing ) {
					
					// Stop tinymce DragDropOverrides.
					// https://github.com/tinymce/tinymce/blob/master/js/tinymce/classes/DragDropOverrides.js#L164.
					e.button = true;
					
					// Stop tinymce from preventing out event.
					// https://github.com/tinymce/tinymce/blob/master/js/tinymce/classes/dom/EventUtils.js#L125.
					e.preventDefault = function () {};

					// Fake the target so that cE checking evals a different element.
					newDiv = $( '<div><div></div></div>' );
					newDiv[0].contentEditable = false;
					e.target = newDiv[0];
				}
			} );
			
			editor.on( 'dragstart', function( e ) {
				var $target = $( e.originalTarget );
				if ( $target.hasClass( 'popover-imhwpb' ) ) {
					e.preventDefault();
				}
			} );
			
			 //Prevents boldgrid popovers from appearing when resizing images
			editor.on('ObjectResizeStart', function(e) {
				if ( typeof IMHWPB.WP_MCE_Draggable.instance.draggable_instance.$master_container != 'undefined' ) {
					IMHWPB.WP_MCE_Draggable.instance.draggable_instance.popovers_disabled = true;
					IMHWPB.WP_MCE_Draggable.instance.draggable_instance
						.$master_container.find( '.draggable-tools-imhwpb' ).addClass( "hidden" );
				}
			});
			
			//Once an object is resized, allow boldgrid popovers. 
			editor.on('ObjectResized', function(e) {
				if ( typeof IMHWPB.WP_MCE_Draggable.instance.draggable_instance.$master_container != 'undefined' ) {
					IMHWPB.WP_MCE_Draggable.instance.draggable_instance.popovers_disabled = false;
					IMHWPB.WP_MCE_Draggable.instance.draggable_instance
						.$master_container.find( '.draggable-tools-imhwpb' ).removeClass( "hidden" );
				}
			});

			/**
			 * Before WP retrieves the contents of the editor, we will strip out any extra spaces 
			 * that we wrapped around anchors as well as any other cleanup
			 */
			editor.on('GetContent', function(e) {
				if (e.content) {
					e.content = self.reset_anchor_spaces('<div>' + e.content + '</div>', false);
					if ( IMHWPB.WP_MCE_Draggable.instance && IMHWPB.WP_MCE_Draggable.instance.draggable_instance ) {
						e.content = IMHWPB.WP_MCE_Draggable.instance.draggable_instance.frame_cleanup( e.content );
					}
					
					//On save remove empty trailing paragraph if it exists
					if (e.save) {
						var $markup = jQuery("<div>" + e.content + "</div>");
						var $last_element = $markup.find('> *:last');
						if ( $last_element.is('p') ) {
							var text = $last_element.text();
							var html = $last_element.html();
							if ( text == " " || ( html == '<br>' && !text) || html == '&nbsp;') {
								$last_element.remove();
								e.content = $markup.html();
							}
						}
					}
				}
			});

			/**
			 * When the user does an undo or redo make sure that the editor height is correct
			 */
			editor.on('Undo Redo', function(e) {
				IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height();
			});

			/**
			 * When the editor is initialized load the draggable ability
			 */
			editor.on('init', function( event ) {
				
				IMHWPB.WP_MCE_Draggable.instance = new IMHWPB.WP_MCE_Draggable();
				
				setTimeout( function () {
					IMHWPB.WP_MCE_Draggable.instance.refresh_iframe_height();
				}, 1000);
				
				var $tinymce_iframe = $(event.target.iframeElement).contents();
				if ( BoldgridEditor.body_class ) {
					$tinymce_iframe.find('body').addClass(BoldgridEditor.body_class);
				}
				
				if ( BoldgridEditor.hasDraggableEnabled ) {

					IMHWPB.WP_MCE_Draggable.instance.load_draggable($tinymce_iframe);
					self.draggable = IMHWPB.WP_MCE_Draggable.instance.draggable_instance;
					if ( self.draggable.ie_version && self.draggable.ie_version <= 11 ) {
						$tinymce_iframe.find( 'body' ).addClass( 'dragging-disabled' );
					}

				} else {
					//If this is not a boldgrid theme we will disable by default, 
					//and deactivate style sheets
					IMHWPB.WP_MCE_Draggable.instance
						.set_style_sheet_inactive( 'draggable', true, $(event.target.iframeElement).contents().get(0));
					IMHWPB.WP_MCE_Draggable.instance.draggable_inactive = true;
				}

				//Add a paragraph at the end of the editor to allow the user to click at the end to enter text
				var $last_element = $tinymce_iframe.find('body > *:last');
				if ( !$last_element.is('p') || $last_element.children().length != 1 ) {
					$tinymce_iframe.find('body').append('<p> </p>');
				}
				
				//Add button to floating tinymce toolbar
				self.button_created = false;
				tinymce.activeEditor.on( 'wptoolbar', function( event ) {
				  if ( self.button_created == false  && event.toolbar) {
						var buttons = [];
						buttons.push(tinymce.ui.Factory.create({
							type: 'button',
							  title: 'Change',
							  tooltip: 'Change', 
							  icon: 'icon dashicons dashicons-admin-media imhwpb-icon',
							  onclick: function () {
								  // Mimic the click of the "Edit" button.
								  tinymce.activeEditor.buttons.wp_img_edit.onclick();
								  
								  // Change the media modal to "Replace Image".
								  wp.media.frame.setState( 'replace-image' );
								  
								  // When the image is replaced, run crop.onReplace().
								  wp.media.frame.state( 'replace-image' ).on( 'replace', function( imageData ) {
									  self.crop.onReplace( imageData );
								  });
							  }
						 }));
						
						//Toolbar/ButtonGroup.insert()
						event.toolbar._items[0]._items[0].insert(buttons,3,false);
						event.toolbar.reposition();
						self.button_created = true;
				  }
				} );
			});

			/*
			 * 
			 * Used for debugging
			var all_events = [
				'AddUndo',
				'BeforeAddUndo',
				'BeforeExecCommand',
				'BeforeRenderUI',
				'BeforeSetContent',
				'ExecCommand',
				'GetContent',
				'LoadContent',
				'NodeChange',
				'ObjectResizeStart',
				'ObjectSelected',
				'PostProcess',
				'PreInit',
				'PreProcess',
				'ProgressState',
				'SaveContent',
				'SetAttrib',
				'activate',
				'blur',
				'change',
				'deactivate',
				'focus',
				'hide',
				'init',
				'redo',
				'remove',
				'reset',
				'submit',
				'show',
				'undo',
			];
			
			console.log(all_events.join());
			editor.on( all_events.join(' '), function( e ) {
					console.log(e.type);
			} );*/
		});
	});

	/**
	 * Check if an element is empty after being validated by mce
	 * an element is "empty" if it only has a break tag in and no text
	 * TODO: Function is not working correctly, fix
	 */
	this.mce_element_is_empty = function ( $element ) {
		var $children = $element.children();
		var is_empty = false;
		if ( $element.is(':empty') || ($children.length == 1 && $children.filter('br').length && !$element.text() ) ) {
			is_empty = true;
		}
		
		return is_empty;
	};
	
	/**
	 * Wraps anchor contents in spaces to make it easier for the user to target
	 */
	this.reset_anchor_spaces = function ( markup,  add_spaces ) {
		var $markup = $( markup );

		//Strip out added spaces
		$markup.find('a').each( function () {
			var $this = $(this);
			var html = $this.html();
			//Starting With nbsp? remove
			if ( html.substr(0, 6) == '&nbsp;' ) {
				html = html.substr(6);
			}
			//Ending with nbsp? remove
			if ( html.substr(-6, 6) == '&nbsp;' ) {
				html = html.substr(0, html.length - 6)
			}
			
			if ( add_spaces ) {
				//Wrap all anchors in spaces
				$this.html('&nbsp;' + html + '&nbsp;');
			} else {
				$this.html( html );
			}
		});
		
		return $markup.html();
	};
	
	/**
	 * Check is dragging is set to active by the user
	 */
	this.dragging_is_active = function () {
		return typeof IMHWPB.WP_MCE_Draggable.instance != "undefined" && 
			false == IMHWPB.WP_MCE_Draggable.instance.draggable_inactive;
	};	
	
	/**
	 * Toggle the active state of the draggable plugin
	 */
	this.toggle_draggable_plugin = function ( event ) {
		if ( typeof IMHWPB.WP_MCE_Draggable != 'undefined' && typeof IMHWPB.WP_MCE_Draggable.instance != 'undefined' ) {
			IMHWPB.WP_MCE_Draggable.instance.toggle_draggable_plugin( event );
		}
	};
	
	/**
	 * The action that should happen once a button is clicked
	 */
	this.activate_display = function( type, $element ) {
		var $closest = $element.closest( 'div' );
		if ( $closest.hasClass('mce-disabled') ) {
			return false;
		}
		$('.mce-displaysize-imhwpb').removeClass('boldgrid-highlighted-mce-icon');

		if ( $closest.hasClass( 'mce-active' ) ) {
			$element.closest( 'div' ).removeClass( 'mce-active' );
			self.remove_editor_styles();
			self.currently_selected_size = null;

		} else {
			$( '.mce-displaysize-imhwpb' ).each( function() {
				$( this ).closest( 'div' ).removeClass( 'mce-active' );
			} );
			$element.closest( 'div' ).addClass( 'mce-active' );
			self.set_width( type );
			self.currently_selected_size = type;
		}
		
		if ( IMHWPB.WP_MCE_Draggable.instance && IMHWPB.WP_MCE_Draggable.instance.draggable_inactive == false) {
			IMHWPB.WP_MCE_Draggable.instance.resize_done_event(null, true);
			$window.trigger( 'resize' );
		}
	};

	/**
	 * Remove applied classes
	 */
	this.remove_editor_styles = function() {
		$( '#wp-content-editor-container' ).removeClass(
			'mce-viewsize-phone-imhwpb mce-viewsize-tablet-imhwpb mce-viewsize-monitor-imhwpb' );
	};
	/**
	 * Set the width of the editor
	 */
	this.set_width = function( style ) {
		self.remove_editor_styles();
		$( '#wp-content-editor-container' ).addClass( 'mce-viewsize-' + style + '-imhwpb' );
	};

	
};

IMHWPB.Editor.instance = new IMHWPB.Editor( jQuery );
