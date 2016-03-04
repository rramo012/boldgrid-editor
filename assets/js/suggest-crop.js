var IMHWPB = IMHWPB || {};

/**
 * BoldGrid Editor Suggest Crop.
 * 
 * This class handles the front-end functionality for suggesting to users they
 * crop an image when replacing another image with different dimensions within
 * the editor.
 * 
 * @since 1.0.8
 */
IMHWPB.BoldGrid_Editor_Suggest_Crop = function( $ ) {
	var self = this;

	/**
	 * A wp.media modal window.
	 * 
	 * This modal modal is created in this.crop_frame_create().
	 * 
	 * The media modal is created to simply have a modal. We don't need a media
	 * library, just a modal.
	 * 
	 * @since 1.0.8
	 */
	self.crop_frame;

	/**
	 * The coordinates within an image that have been selected by the user.
	 * 
	 * Essentially, when the user selects the area of an image to crop, the
	 * coordinates they want to crop are stored here.
	 * 
	 * The coordinates are set in this.selected_coordinates_set(), which is
	 * called when imgAreaSelect is initialized and after each time the user
	 * changes the selection.
	 * 
	 * @since 1.0.9
	 * 
	 * @var object self.selected_coordinates Example self.selected_coordinates:
	 *      http://pastebin.com/5X02nX14
	 */
	self.selected_coordinates = null;

	/**
	 * These two items are set to false by default. We set them to false because
	 * we'll be checking to see if they're set to anything else at another
	 * point.
	 * 
	 * Both variables are set in self.image_data_set.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            old_image|new_image Example: http://pastebin.com/xiY2rHQr
	 */
	self.new_image = false;
	self.old_image = false;

	/**
	 * Have we already adjusted the buttons in crop_frame? IE. enabled 'Crop
	 * Image' and added the 'Skip Cropping' button?
	 * 
	 * @since 1.0.8
	 */
	self.adjusted_crop_frame_buttons = false;

	/**
	 * Get the element the user is trying to replace.
	 * 
	 * The element in question is the dom element currently selected within
	 * tinyMCE.
	 * 
	 * This variable is set by self.selected_content_set(), which is triggered
	 * when the user clicks either the "Add Media" or "Change" buttons.
	 * 
	 * @since 1.0.8
	 * 
	 * @var object self.selected_content A jQuery object Example
	 *      self.selected_content: http://pastebin.com/J4eGHWGz.
	 */
	self.selected_content = null;

	/**
	 * Document ready event.
	 * 
	 * @since 1.0.8
	 */
	$( function() {
		self.init();
	} );

	/**
	 * Actions to take when someone clicks the "Add Media" button.
	 * 
	 * Check every 100 miliseconds to see if the "Insert into page" button is
	 * visible. When it is, bind its click.
	 * 
	 * @since 1.0.8
	 */
	this.on_click_add_media_button = function() {
		self.waitForElement( 'button.media-button-insert:visible', 100, function() {
			$( '.media-button-insert:visible' ).on( 'click', function() {
				// If this button has not been
				// binded:
				if ( !$( this ).hasClass( 'boldgrid-editor-suggest-crop-binded' ) ) {
					$( this ).addClass( 'boldgrid-editor-suggest-crop-binded' )
					self.on_image_inserted_into_editor();
				}
			} );
		} );
	}

	/**
	 * Actions to take when someone clicks the "Change" button.
	 * 
	 * Check every 100 miliseconds to see if the "Replace" button is visible.
	 * When it is, bind its click.
	 * 
	 * @since 1.0.8
	 */
	this.on_click_change_button = function() {
		self.waitForElement( 'button.media-button-replace:visible', 100, function() {
			$( '.media-button-replace:visible' ).on( 'click', function() {
				self.on_image_inserted_into_editor();
			} );
		} );
	}

	/**
	 * Clear our crop_frame.
	 * 
	 * Remove and empty certain containers that aren't needed.
	 * 
	 * The self.$mfr and self.$mfc vars are declared when we initially created
	 * the crop_frame, in this.crop_frame_create().
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_clear = function() {
		// Remove the tabs, "Upload Files / Media Library".
		self.$mfr.remove();

		// Empty the contents of the content frame.
		self.$mfc.empty();

		// Empty the toolbar.
		self.$mft.empty();

		// Show a message that we're comparing our two images.
		var template = wp.template( 'suggest-crop-compare-images' );
		self.$mfc.html( template() );
	}

	/**
	 * Crop an image.
	 * 
	 * Makes an ajax call to crop an image.
	 * 
	 * @since 1.0.8
	 * @global self.$primary_button Defined in this.bind_crop_frame_elements().
	 * @global self.$skip_button Defined in this.bind_crop_frame_elements().
	 */
	this.crop = function() {
		// Get the current text of our primary button, which is "Crop Image".
		// This method changes that button's text, and then changes it back. We
		// need to get it's original value so we can change it back.
		self.original_primary_button_text = self.$primary_button.text();

		// Disable the skip button. We're cropping, there's no turning back.
		self.$skip_button.prop( 'disabled', true );

		// Disable the crop button so the user can't click it again. Set its
		// text to "Cropping".
		self.$primary_button.prop( 'disabled', true ).text( 'Cropping...' );

		// @var object data Example data: http://pastebin.com/507gY9L8
		var data = {
		    action : 'suggest_crop_crop',
		    cropDetails : self.selected_coordinates,
		    path : self.$mfc.find( '#suggest-crop-sizes option:selected' ).val()
		};

		$.post( ajaxurl, data, function( response ) {
			// Validate our response and take action.
			self.crop_validate( response );
		} );
	}

	/**
	 * Steps to take when a crop fails.
	 * 
	 * @since 1.0.8
	 */
	this.crop_invalid = function() {
		var template = wp.template( 'suggest-crop-crop-invalid' );
		self.$mft.html( template() );

		// When the user clicks the "OK" button, close the crop_frame.
		$( 'button.crop-fail' ).on( 'click', function() {
			self.crop_frame.close();
		} );
	}

	/**
	 * After an ajax request to crop an image, validate the response.
	 * 
	 * @since 1.0.8
	 * 
	 * @param string
	 *            response An ajax response.
	 */
	this.crop_validate = function( response ) {
		// If the ajax request failed or we don't have valid json.
		if ( 0 == response || !self.isJsonString( response ) ) {
			self.crop_invalid();
			return;
		}

		// We have a valid json string, parse it.
		// After response has been JSON.parsed:
		// @var object response Example response:
		// http://pastebin.com/d0qXq4wr
		response = JSON.parse( response );

		// Make sure we have all the necessary properties. If we don't, then the
		// data is invalid.
		var have_needed_properties = true;
		var needed_properties = [
		    'new_image_height', 'new_image_width', 'new_image_url'
		];

		$.each( needed_properties, function( key, property ) {
			if ( 'undefined' === typeof response[ property ] ) {
				have_needed_properties = false;
				return false;
			}
		} );

		if ( have_needed_properties ) {
			self.crop_valid( response );
		} else {
			self.crop_invalid();
		}
	}

	/**
	 * Get an img's attachment id from its class attribute.
	 * 
	 * If we pass in "alignnone wp-image-54490 size-medium", this function will
	 * parse out and return "54490".
	 * 
	 * @since 1.0.9
	 * 
	 * @param string
	 *            class_attr Example: "alignnone wp-image-54490 size-medium".
	 * @return integer attachmentId An attachment id.
	 */
	this.getAttachmentIdFromClass = function( class_attr ) {
		// Example classes: ["alignnone", "wp-image-54490", "size-medium"].
		var classes = class_attr.split( ' ' ), attachmentId = 0;

		$.each( classes, function( i, className ) {
			if ( className.startsWith( 'wp-image-' ) ) {
				attachmentId = className.replace( 'wp-image-', '' );
				return false;
			}
		} );

		return parseInt( attachmentId );
	}

	/**
	 * Steps to take when an image is cropped successfull.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            response A json.parsed ajax response.
	 */
	this.crop_valid = function( response ) {
		// Get the currently selected text.
		// @var object node Example node: http://pastebin.com/4nwJmLRj
		var node = tinyMCE.activeEditor.selection.getNode();

		// Adjust the src, width, and height of the new image.
		node.src = response.new_image_url;
		node.width = response.new_image_width;
		node.height = response.new_image_height;

		// Reset our crop and skip buttons.
		self.$skip_button.prop( 'disabled', false );
		self.$primary_button.prop( 'disabled', false ).text( self.original_primary_button_text );

		// Close our crop_frame, we're done!
		self.crop_frame.close();
	}

	/**
	 * Set our image data.
	 * 
	 * Our "image data" is data about both our original image and the image
	 * we're replacing it with. Example image data can be found at the top of
	 * this document above the declaration of self.new_image.
	 * 
	 * This method is triggered by this.on_image_inserted_into_editor(), which
	 * is triggered when a user clicks either the "Insert into page" or
	 * "Replace" buttons.
	 * 
	 * @since 1.0.8
	 */
	this.image_data_set = function() {
		var selectedContent = tinyMCE.activeEditor.selection.getContent(), newImageClass = $(
		    selectedContent ).attr( 'class' ), old_img = new Image(), new_img = new Image();

		// Get the attachment id of the new image.
		self.newImageAttachmentId = self.getAttachmentIdFromClass( newImageClass );

		// Get a list of sizes available for our new image. We'll place
		// these in a <select> element to allow the user to select which
		// image size to crop from.
		var data = {
		    action : 'suggest_crop_get_dimensions',
		    attachment_id : self.newImageAttachmentId
		};
		jQuery.post( ajaxurl, data, function( response ) {
			// Validate our response. If invalid, the crop_frame will close
			// and the user will continue as if nothing happened.
			if ( 0 == response ) {
				self.crop_frame.close();
				clearInterval( self.interval_wait_for_image_data_set );
				return false;
			}

			response = JSON.parse( response );

			// Create our <select> element filled with image sizes of our
			// new image.
			var template = wp.template( 'suggest-crop-sizes' );
			self.$selectDimensions = $( template( response ) );

			self.selectBestFit();

			// Get the new image, the image we've chosen as a replacement.
			// We've waited up until this point to get the data, as
			// self.bestSizeSelector (used below) was not set until
			// self.selectBestFit() (used above) finished running.
			new_img.onload = function() {
				self.new_image = new_img;
			};
			new_img.src = self.bestSizeSelector;
		} );

		// Get the old image, the image we're replacing.
		old_img.onload = function() {
			self.old_image = old_img;
		};
		old_img.src = self.selected_content.attr( 'src' );
	}

	/**
	 * Select our best image size.
	 * 
	 * Within our <select> of image dimensions available, select by default the
	 * image of best fit.
	 * 
	 * @since 1.0.9
	 */
	this.selectBestFit = function() {
		// Determine the orientation of our old image.
		// Portrait is > 1, Landscape is < 1, Square is 0.
		var orientation = parseFloat( self.old_image.width / self.old_image.height ), $bestSizes;

		// From the list of available sizes, select the ones that are a best
		// fit.
		// If Landscape, width is the important factor, and vice versa.
		if ( orientation < 1 ) {
			$bestSizes = self.$selectDimensions.find( 'option' ).filter( function() {
				return $( this ).attr( 'data-height' ) >= self.old_image.height;
			} );
		} else {
			$bestSizes = self.$selectDimensions.find( 'option' ).filter( function() {
				return $( this ).attr( 'data-width' ) >= self.old_image.width;
			} );
		}

		// Set self.bestSizeSelector to the URL of the best size. The
		// best size is essentially one size higher than a perfect fix.
		if ( 1 == $bestSizes.length ) {
			self.bestSizeSelector = $bestSizes.eq( 0 ).val();
		} else if ( 0 == $bestSizes.length ) {
			self.bestSizeSelector = self.$selectDimensions.find( 'option' ).last().val();
		} else {
			self.bestSizeSelector = $bestSizes.eq( 1 ).val();
		}

		// Select the best sized <option> in our <select>.
		self.$selectDimensions.find( 'option[value="' + self.bestSizeSelector + '"]' ).prop(
		    'selected', true );
	}

	/**
	 * Get the item currently selected in the editor.
	 * 
	 * We need to know what image we're replacing.
	 * 
	 * This method is ran after the user clicks the "Change" or "Add Media"
	 * buttons.
	 * 
	 * @since 1.0.8
	 */
	this.selected_content_set = function() {
		// Reset our images.
		self.new_image = false;
		self.old_image = false;

		// @var string selected_content An <img /> tag.
		// Example self.selected_content: http://pastebin.com/HbMXk2sL
		var selected_content = tinyMCE.activeEditor.selection.getContent();

		// Convert 'self.selected_content' to a jQuery element for easier
		// manipulation.
		// @var object self.selected_content A jQuery object.
		// Example self.selected_content: http://pastebin.com/J4eGHWGz
		self.selected_content = $( selected_content );
	}

	/**
	 * Select an area on our new image.
	 * 
	 * When the "Crop Image" modal loads, by default we want an area already
	 * selected. This method does just that.
	 * 
	 * @since 1.0.8
	 */
	this.selected_coordinates_select = function() {
		self.selected_coordinates_calculate_default( self.old_image.width, self.old_image.height,
		    self.new_image.width, self.new_image.height );

		/**
		 * After adding the image, bind imgAreaSelect to it.
		 * 
		 * Full documentation:
		 * http://odyniec.net/projects/imgareaselect/usage.html
		 */
		self.ias = self.$suggestCrop.imgAreaSelect( {
		    aspectRatio : self.selectedCoordinates.aspectRatio,
		    // When there is a selection within the image, show the drag
		    // handles.
		    handles : true,
		    imageHeight : self.new_image.height,
		    imageWidth : self.new_image.width,
		    instance : true,
		    keys : true,
		    persistent : true,
		    parent : '.container-image-crop .right',
		    // Set the default area to be selected.
		    x1 : self.selectedCoordinates.x1,
		    y1 : self.selectedCoordinates.y1,
		    x2 : self.selectedCoordinates.x2,
		    y2 : self.selectedCoordinates.y2,
		    onInit : function( img, selection ) {
			    self.selected_coordinates_set( img, selection );
		    },
		    onSelectEnd : function( img, selection ) {
			    self.selected_coordinates_set( img, selection );
		    }
		} );
	}

	/**
	 * Init.
	 * 
	 * @since 1.0.8
	 */
	this.init = function() {
		/**
		 * Bind the click of the "Change" button.
		 * 
		 * The "Change" button displays when you click on an image within the
		 * editor. It is next to the "Edit" button.
		 */
		$( 'body' ).on( 'click', '[aria-label="Change"]', function() {
			self.on_click_change_button();
			self.selected_content_set();
		} );

		/**
		 * Bind the click of the "Add Media" button.
		 * 
		 * The "Add Media" button is to the left of the "Add GridBlock" button.
		 */
		$( 'body' ).on( 'click', 'button.add_media', function() {
			self.on_click_add_media_button();
			self.selected_content_set();
		} );
	}

	/**
	 * Is a string a valid json string?
	 * 
	 * @since 1.0.8
	 * 
	 * @param string
	 *            str
	 * @return bool
	 */
	this.isJsonString = function( str ) {
		try {
			JSON.parse( str );
		} catch ( e ) {
			return false;
		}
		return true;
	}

	/**
	 * Actions to take when an image is inserted into the editor.
	 * 
	 * Images are inserted into the editor when the user clicks either the
	 * "Replace" or "Insert into page" buttons.
	 * 
	 * This method is binded to the click of the "Replace" and "Insert into
	 * page" buttons.
	 * 
	 * @since 1.0.8
	 */
	this.on_image_inserted_into_editor = function() {
		self.crop_frame_open();

		// Wait 1 second after an image is inserted into the editor.
		setTimeout( function() {
			// Fire off a method to get all image data.
			self.image_data_set();

			// Every tenth of a second, check to see if we have our data.
			self.interval_wait_for_image_data_set = setInterval( function() {
				// When this function determines we have the data we need:
				// # It clears this Interval.
				// # It fills our crop_frame.
				self.image_data_when_set();
			}, 100 );
		}, 1000 );
	}

	/**
	 * When an image size is changed, take action.
	 * 
	 * @since 1.0.9
	 * 
	 * @param string
	 *            img_src Example: https://domain.com/file.jpg
	 */
	this.onSizeChange = function( img_src ) {
		var newImage;

		// Remove any previous 'on load'.
		self.$suggestCrop.off( 'load' );

		self.$suggestCrop.attr( 'src', img_src ).on(
		    'load',
		    function() {
			    newImage = $( this )[ 0 ];

			    // img1 is the old image, the image we're replacing.
			    img1Width = self.old_image.width;
			    img1Height = self.old_image.height;
			    // img2 is this image, the new image.
			    img2Width = newImage.naturalWidth;
			    img2Height = newImage.naturalHeight;

			    // Pass all of the above data and calculate which area of the
			    // image
			    // we should select and highlight by default.
			    self.selected_coordinates_calculate_default( img1Width, img1Height, img2Width,
			        img2Height );

			    self.ias.setOptions( {
			        aspectRatio : self.selectedCoordinates.aspectRatio,
			        imageHeight : newImage.naturalHeight,
			        imageWidth : newImage.naturalWidth,
			        x1 : self.selectedCoordinates.x1,
			        y1 : self.selectedCoordinates.y1,
			        x2 : self.selectedCoordinates.x2,
			        y2 : self.selectedCoordinates.y2
			    } );

			    self.selected_coordinates_set( null, {
			        height : newImage.naturalHeight,
			        width : newImage.naturalWidth,
			        x1 : self.selectedCoordinates.x1,
			        y1 : self.selectedCoordinates.y1,
			        x2 : self.selectedCoordinates.x2,
			        y2 : self.selectedCoordinates.y2
			    } );

			    self.bindForceAspectRatio();

			    // Because we're reseting the image, reset the force aspect
			    // ratio
			    // to checked.
			    self.$mfc.find( '[name="force_aspect_ratio"]' ).prop( 'checked', true );
		    } );
	}

	/**
	 * Create our crop_frame.
	 * 
	 * See the declaration of crop_frame at the top of this file for more info.
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_create = function() {
		self.crop_frame = wp.media( {
		    title : 'Crop Image',
		    button : {
			    text : 'Crop Image'
		    }
		} );

		self.crop_frame.open();

		self.$mfr = $( '.media-frame-router' ).last();
		self.$mfc = $( '.media-frame-content' ).last();
		self.$mft = $( '.media-frame-toolbar' ).last();
	}

	/**
	 * Open our crop_frame.
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_open = function() {
		// If the element we're replacing is not an image, abort.
		if ( 'IMG' != self.selected_content.prop( 'tagName' ) ) {
			return;
		}

		// If the crop frame is already created, open it and return.
		if ( self.crop_frame ) {
			self.crop_frame.open();
			self.crop_frame_clear();
			return;
		}

		self.crop_frame_create();
		self.crop_frame_clear();
	}

	/**
	 * Fill our crop_frame.
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_fill = function() {

		var data = {
		    old_image_src : self.old_image.src,
		    new_image_src : self.new_image.src,
		    new_content_src : self.bestSizeSelector
		};
		var template = wp.template( 'suggest-crop' );
		self.$mfc.html( template( data ) );

		// After we've filled in our details, add our <select>.
		self.$suggestCrop = self.$mfc.find( '.suggest-crop' );
		self.$suggestCrop.after( self.$selectDimensions );

		// Bind our select element.
		$( '#suggest-crop-sizes' ).change( function() {
			var img_src = $( this ).val();
			self.onSizeChange( img_src );
		} );

		var template = wp.template( 'suggest-crop-toolbar' );
		self.$mft.html( template() );

		self.bind_crop_frame_elements();

		self.selected_coordinates_select();
	}

	/**
	 * Set self.selected_coordinates, the coordinates of the image the user has
	 * selected.
	 * 
	 * See the declaration of self.selected_coordinates at the top of this file
	 * for more info.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            img Example img: http://pastebin.com/hA6Y6FJn
	 * @param object
	 *            selection Example selection: http://pastebin.com/4q2Q0nhf
	 */
	this.selected_coordinates_set = function( img, selection ) {
		self.selected_coordinates = selection;
	}

	/**
	 * Determine what area of the image to crop by default.
	 * 
	 * @since 1.0.9
	 * 
	 * @param integer
	 *            img1Width
	 * @param integer
	 *            img1Height
	 * @param integer
	 *            img2Width
	 * @param integer
	 *            img2Height
	 */
	this.selected_coordinates_calculate_default = function( img1Width, img1Height, img2Width, img2Height ) {
		var default_width, default_height, data = {};

		// First, try maximizing the width.
		default_width = img2Width;
		default_height = ( img1Height * img2Width ) / img1Width;

		// Calculations below will center our selection.
		data.x1 = 0;
		data.y1 = ( img2Height - default_height ) / 2;
		data.x2 = default_width;
		data.y2 = data.y1 + default_height;

		// If using 'maximum width' does not fit, then maximize our height.
		if ( default_height > img2Height ) {
			default_height = img2Height;
			default_width = ( img1Width * img2Height ) / img1Height;

			// Calculations below will center our selection.
			data.x1 = ( img2Width - default_width ) / 2;
			data.y1 = 0;
			data.x2 = data.x1 + default_width;
			data.y2 = default_height;
		}

		data.aspectRatio = default_width + ':' + default_height;

		// This data will be needed globally, so make it so.
		self.selectedCoordinates = data;
	}

	/**
	 * 
	 * Wait for an element to exist and then take action.
	 * 
	 * This function has been inspired by:
	 * http://codeception.com/docs/modules/WebDriver#waitForElement.
	 * 
	 * @since 1.0.8
	 * 
	 * @param string
	 *            selector A jQuery selector.
	 * @param int
	 *            milliseconds How often to check if the element exists.
	 * @param function
	 *            when_found A function to execute when the element is found.
	 */
	this.waitForElement = function( selector, milliseconds, when_found ) {
		var interval = setInterval( function() {
			if ( $( selector ).length > 0 ) {
				when_found();
				clearInterval( interval );
			}
		}, milliseconds );
	}

	/**
	 * Take action when image_data is set.
	 * 
	 * This method is triggered within this.on_image_inserted_into_editor().
	 * 
	 * @since 1.0.8
	 */
	this.image_data_when_set = function() {
		// Do we have the data we need?
		var image_data_is_set = ( false != self.old_image && false != self.new_image );

		// If we have finished getting all of the image data:
		if ( image_data_is_set ) {
			// Clear the interval. We know our image_data_is_set, so stop
			// checking.
			clearInterval( self.interval_wait_for_image_data_set );

			// Do our two images have the same dimensions?
			var same_dimensions = ( ( self.old_image.width / self.old_image.height ) == ( self.new_image.width / self.new_image.height ) );

			if ( same_dimensions ) {
				// The images have the same dimensions, so no need to suggest a
				// crop.
				self.crop_frame.close();
			} else {
				// Fill in our self.crop_frame, the UI for cropping an image.
				self.crop_frame_fill();
			}
		}
	}

	/**
	 * Bind events of elements within our crop_frame.
	 * 
	 * @since 1.0.8
	 */
	this.bind_crop_frame_elements = function() {
		/**
		 * ELEMENT: help button.
		 * 
		 * Action to take when the user clicks the help button.
		 */
		$( '.imgedit-help-toggle' ).on( 'click', function() {
			$( '.imgedit-help' ).slideToggle();
		} );

		self.bindForceAspectRatio();

		/**
		 * ELEMENT: 'Crop Image' and 'Skip Cropping' buttons.
		 * 
		 * Actions to take when buttons in the lower toolbar are clicked.
		 */
		self.$primary_button = self.$mft.find( '.button-primary' );

		// Enable the "Crop Image" button.
		self.$primary_button.attr( 'disabled', false );

		// Bind the click of the "Crop Image" button.
		self.$primary_button.on( 'click', function() {
			self.crop();
		} );

		self.$skip_button = self.$primary_button.siblings( '.media-button-skip' );

		// Bind the click of the "Skip Cropping" button.
		self.$skip_button.on( 'click', function() {
			self.crop_frame.close();
		} );

		// We just adjusted the buttons, take note of this so we don't do it
		// again.
		self.adjusted_crop_frame_buttons = true;
	}

	/**
	 * Bind the 'Force aspect ratio' checkbox.
	 * 
	 * @since 1.0.9
	 */
	this.bindForceAspectRatio = function() {
		// Remove any existing bindings.
		$( '[name="force_aspect_ratio"]' ).off( 'change' );

		$( '[name="force_aspect_ratio"]' ).on( 'change', function() {
			// If the checkbox is checked, force the aspect ratio.
			if ( $( this ).is( ":checked" ) ) {
				self.ias.setOptions( {
				    aspectRatio : self.selectedCoordinates.aspectRatio,
				    x1 : self.selectedCoordinates.x1,
				    y1 : self.selectedCoordinates.y1,
				    x2 : self.selectedCoordinates.x2,
				    y2 : self.selectedCoordinates.y2
				} );
			} else {
				self.ias.setOptions( {
					aspectRatio : false
				} );
			}
		} );
	}
};

new IMHWPB.BoldGrid_Editor_Suggest_Crop( jQuery );