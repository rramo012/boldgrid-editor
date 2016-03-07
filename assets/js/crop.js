var BoldgridEditor = BoldgridEditor || {};

/**
 * BoldGrid Editor Crop.
 * 
 * This class handles the front-end functionality for suggesting to users they
 * crop an image when replacing another image with different dimensions within
 * the editor.
 * 
 * @since 1.0.8
 */
BoldgridEditor.crop = function( $ ) {
	var self = this;

	/**
	 * A wp.media modal window.
	 * 
	 * This modal modal is created in this.cropFrameCreate().
	 * 
	 * The media modal is created to simply have a modal. We don't need a media
	 * library, just a modal.
	 * 
	 * @since 1.0.8
	 */
	self.cropFrame;

	/**
	 * The coordinates within an image that have been selected by the user.
	 * 
	 * Essentially, when the user selects the area of an image to crop, the
	 * coordinates they want to crop are stored here.
	 * 
	 * The coordinates are set in this.setSelectedCoordinates(), which is
	 * called when imgAreaSelect is initialized and after each time the user
	 * changes the selection.
	 * 
	 * @since 1.0.9
	 * 
	 * @var object self.selectedCoordinates Example self.selectedCoordinates:
	 *      http://pastebin.com/5X02nX14
	 */
	self.selectedCoordinates = null;

	/**
	 * These two items are set to false by default. We set them to false because
	 * we'll be checking to see if they're set to anything else at another
	 * point.
	 * 
	 * Both variables are set in self.imageDataSet.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            oldImage|newImage Example: http://pastebin.com/xiY2rHQr
	 */
	self.newImage = false;
	self.oldImage = false;

	/**
	 * Have we already adjusted the buttons in cropFrame? IE. enabled 'Crop
	 * Image' and added the 'Skip Cropping' button?
	 * 
	 * @since 1.0.8
	 */
	self.adjustedCropFrameButtons = false;

	/**
	 * Get the element the user is trying to replace.
	 * 
	 * The element in question is the dom element currently selected within
	 * tinyMCE.
	 * 
	 * This variable is set by self.selectedContentSet(), which is triggered
	 * when the user clicks either the "Add Media" or "Change" buttons.
	 * 
	 * @since 1.0.8
	 * 
	 * @var object self.selectedContent A jQuery object Example
	 *      self.selectedContent: http://pastebin.com/J4eGHWGz.
	 */
	self.selectedContent = null;

	/**
	 * Document ready event.
	 * 
	 * @since 1.0.8
	 */
	$( function() {
		self.init();
	} );

	/**
	 * Actions to take when someone clicks the "Change" button.
	 * 
	 * Check every 100 miliseconds to see if the "Replace" button is visible.
	 * When it is, bind its click.
	 * 
	 * @since 1.0.8
	 */
	this.onClickChangeButton = function() {
		self.waitForElement( 'button.media-button-replace:visible', 100, function() {
			$( '.media-button-replace:visible' ).on( 'click', function() {
				self.onImageInsertedIntoEditor();
			} );
		} );
	}

	/**
	 * Clear our cropFrame.
	 * 
	 * Remove and empty certain containers that aren't needed.
	 * 
	 * The self.$mfr and self.$mfc vars are declared when we initially created
	 * the cropFrame, in this.cropFrameCreate().
	 * 
	 * @since 1.0.8
	 */
	this.cropFrameClear = function() {
		// If we previously faded out the media modal, its display is none.
		// Reset the display.
		self.$mediaModal.css( 'display', 'block' );

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
	 * @global self.$primaryButton Defined in this.bindCropFrameElements().
	 * @global self.$skipButton Defined in this.bindCropFrameElements().
	 */
	this.crop = function() {
		// Get the current text of our primary button, which is "Crop Image".
		// This method changes that button's text, and then changes it back. We
		// need to get it's original value so we can change it back.
		self.originalPrimaryButtonText = self.$primaryButton.text();

		// Disable the skip button. We're cropping, there's no turning back.
		self.$skipButton.prop( 'disabled', true );

		// Disable the crop button so the user can't click it again. Set its
		// text to "Cropping".
		self.$primaryButton.prop( 'disabled', true ).text( 'Cropping...' );

		// @var object data Example data: http://pastebin.com/507gY9L8
		var data = {
		    action : 'suggest_crop_crop',
		    cropDetails : self.selectedCoordinates,
		    path : self.$mfc.find( '#suggest-crop-sizes option:selected' ).val()
		};

		$.post( ajaxurl, data, function( response ) {
			// Validate our response and take action.
			self.cropValidate( response );
		} );
	}

	/**
	 * Steps to take when a crop fails.
	 * 
	 * @since 1.0.8
	 */
	this.cropInvalid = function() {
		var template = wp.template( 'suggest-crop-crop-invalid' );
		self.$mft.html( template() );

		// When the user clicks the "OK" button, close the cropFrame.
		$( 'button.crop-fail' ).on( 'click', function() {
			self.cropFrame.close();
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
	this.cropValidate = function( response ) {
		// If the ajax request failed or we don't have valid json.
		if ( 0 == response || !self.isJsonString( response ) ) {
			self.cropInvalid();
			return;
		}

		// We have a valid json string, parse it.
		// After response has been JSON.parsed:
		// @var object response Example response:
		// http://pastebin.com/d0qXq4wr
		response = JSON.parse( response );

		// Make sure we have all the necessary properties. If we don't, then the
		// data is invalid.
		var haveNeededProperties = true;
		var neededProperties = [
		    'new_image_height', 'new_image_width', 'new_image_url'
		];

		$.each( neededProperties, function( key, property ) {
			if ( 'undefined' === typeof response[ property ] ) {
				haveNeededProperties = false;
				return false;
			}
		} );

		if ( haveNeededProperties ) {
			self.cropValid( response );
		} else {
			self.cropInvalid();
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
	 *            classAttr Example: "alignnone wp-image-54490 size-medium".
	 * @return integer attachmentId An attachment id.
	 */
	this.getAttachmentIdFromClass = function( classAttr ) {
		// Example classes: ["alignnone", "wp-image-54490", "size-medium"].
		var classes = classAttr.split( ' ' ), attachmentId = 0;

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
	this.cropValid = function( response ) {
		// Get the currently selected text.
		// @var object node Example node: http://pastebin.com/4nwJmLRj
		var node = tinyMCE.activeEditor.selection.getNode();

		// Adjust the src, width, and height of the new image.
		node.src = response.new_image_url;
		node.width = response.new_image_width;
		node.height = response.new_image_height;

		// Reset our crop and skip buttons.
		self.$skipButton.prop( 'disabled', false );
		self.$primaryButton.prop( 'disabled', false ).text( self.originalPrimaryButtonText );

		// Close our cropFrame, we're done!
		self.cropFrame.close();
	}

	/**
	 * Set our image data.
	 * 
	 * Our "image data" is data about both our original image and the image
	 * we're replacing it with. Example image data can be found at the top of
	 * this document above the declaration of self.newImage.
	 * 
	 * This method is triggered by this.onImageInsertedIntoEditor(), which
	 * is triggered when a user clicks either the "Insert into page" or
	 * "Replace" buttons.
	 * 
	 * @since 1.0.8
	 */
	this.imageDataSet = function() {
		var selectedContent = tinyMCE.activeEditor.selection.getContent(), newImageClass = $(
		    selectedContent ).attr( 'class' ), oldImg = new Image(), newImg = new Image();

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
			// Validate our response. If invalid, the cropFrame will close
			// and the user will continue as if nothing happened.
			if ( 0 == response ) {
				self.cropFrame.close();
				clearInterval( self.intervalWaitForImageDataSet );
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
			newImg.onload = function() {
				self.newImage = newImg;
			};
			newImg.src = self.bestSizeSelector;
		} );

		// Get the old image, the image we're replacing.
		oldImg.onload = function() {
			self.oldImage = oldImg;
		};
		oldImg.src = self.selectedContent.attr( 'src' );
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
		var orientation = parseFloat( self.oldImage.width / self.oldImage.height ), $bestSizes;

		// From the list of available sizes, select the ones that are a best
		// fit.
		// If Landscape, width is the important factor, and vice versa.
		if ( orientation < 1 ) {
			$bestSizes = self.$selectDimensions.find( 'option' ).filter( function() {
				return $( this ).attr( 'data-height' ) >= self.oldImage.height;
			} );
		} else {
			$bestSizes = self.$selectDimensions.find( 'option' ).filter( function() {
				return $( this ).attr( 'data-width' ) >= self.oldImage.width;
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
	this.selectedContentSet = function() {
		// Reset our images.
		self.newImage = false;
		self.oldImage = false;

		// @var string selectedContent An <img /> tag.
		// Example self.selectedContent: http://pastebin.com/HbMXk2sL
		var selectedContent = tinyMCE.activeEditor.selection.getContent();

		// Convert 'self.selectedContent' to a jQuery element for easier
		// manipulation.
		// @var object self.selectedContent A jQuery object.
		// Example self.selectedContent: http://pastebin.com/J4eGHWGz
		self.selectedContent = $( selectedContent );
	}

	/**
	 * Select an area on our new image.
	 * 
	 * When the "Crop Image" modal loads, by default we want an area already
	 * selected. This method does just that.
	 * 
	 * @since 1.0.8
	 */
	this.selectedCoordinatesSelect = function() {
		self.defaultCoordinatesCalculateDefault( self.oldImage.width, self.oldImage.height,
		    self.newImage.width, self.newImage.height );

		/**
		 * After adding the image, bind imgAreaSelect to it.
		 * 
		 * Full documentation:
		 * http://odyniec.net/projects/imgareaselect/usage.html
		 */
		self.ias = self.$suggestCrop.imgAreaSelect( {
		    aspectRatio : self.defaultCoordinates.aspectRatio,
		    // When there is a selection within the image, show the drag
		    // handles.
		    handles : true,
		    imageHeight : self.newImage.height,
		    imageWidth : self.newImage.width,
		    instance : true,
		    keys : true,
		    persistent : true,
		    parent : '.container-image-crop .right',
		    // Set the default area to be selected.
		    x1 : self.defaultCoordinates.x1,
		    y1 : self.defaultCoordinates.y1,
		    x2 : self.defaultCoordinates.x2,
		    y2 : self.defaultCoordinates.y2,
		    onInit : function( img, selection ) {
			    self.setSelectedCoordinates( img, selection );
		    },
		    onSelectEnd : function( img, selection ) {
			    self.setSelectedCoordinates( img, selection );
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
			self.onClickChangeButton();
			self.selectedContentSet();
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
	this.onImageInsertedIntoEditor = function() {
		self.cropFrameOpen();

		// Wait 1 second after an image is inserted into the editor.
		setTimeout( function() {
			// Fire off a method to get all image data.
			self.imageDataSet();

			// Every tenth of a second, check to see if we have our data.
			self.intervalWaitForImageDataSet = setInterval( function() {
				// When this function determines we have the data we need:
				// # It clears this Interval.
				// # It fills our cropFrame.
				self.imageDataWhenSet();
			}, 100 );
		}, 1000 );
	}

	/**
	 * When an image size is changed, take action.
	 * 
	 * @since 1.0.9
	 * 
	 * @param string
	 *            imgSrc Example: https://domain.com/file.jpg
	 */
	this.onSizeChange = function( imgSrc ) {
		var newImage;

		// Remove any previous 'on load'.
		self.$suggestCrop.off( 'load' );

		self.$suggestCrop.attr( 'src', imgSrc ).on(
		    'load',
		    function() {
			    newImage = $( this )[ 0 ];

			    // img1 is the old image, the image we're replacing.
			    img1Width = self.oldImage.width;
			    img1Height = self.oldImage.height;
			    // img2 is this image, the new image.
			    img2Width = newImage.naturalWidth;
			    img2Height = newImage.naturalHeight;

			    // Pass all of the above data and calculate which area of the
			    // image
			    // we should select and highlight by default.
			    self.defaultCoordinatesCalculateDefault( img1Width, img1Height, img2Width,
			        img2Height );

			    self.ias.setOptions( {
			        aspectRatio : self.defaultCoordinates.aspectRatio,
			        imageHeight : newImage.naturalHeight,
			        imageWidth : newImage.naturalWidth,
			        x1 : self.defaultCoordinates.x1,
			        y1 : self.defaultCoordinates.y1,
			        x2 : self.defaultCoordinates.x2,
			        y2 : self.defaultCoordinates.y2
			    } );

			    self.setSelectedCoordinates( null, {
			        height : newImage.naturalHeight,
			        width : newImage.naturalWidth,
			        x1 : self.defaultCoordinates.x1,
			        y1 : self.defaultCoordinates.y1,
			        x2 : self.defaultCoordinates.x2,
			        y2 : self.defaultCoordinates.y2
			    } );

			    // self.bindForceAspectRatio();

			    // Because we're reseting the image, reset the force aspect
			    // ratio
			    // to checked.
			    self.$mfc.find( '[name="force_aspect_ratio"]' ).prop( 'checked', true );
		    } );
	}

	/**
	 * Create our cropFrame.
	 * 
	 * See the declaration of cropFrame at the top of this file for more info.
	 * 
	 * @since 1.0.8
	 */
	this.cropFrameCreate = function() {
		self.cropFrame = wp.media( {
		    title : 'Crop Image',
		    button : {
			    text : 'Crop Image'
		    }
		} );

		self.cropFrame.open();

		self.$mfr = $( '.media-frame-router' ).last();
		self.$mfc = $( '.media-frame-content' ).last();
		self.$mft = $( '.media-frame-toolbar' ).last();

		self.$mediaModal = $( '.media-modal' );
	}

	/**
	 * Open our cropFrame.
	 * 
	 * @since 1.0.8
	 */
	this.cropFrameOpen = function() {
		// If the element we're replacing is not an image, abort.
		if ( 'IMG' != self.selectedContent.prop( 'tagName' ) ) {
			return;
		}

		// If the crop frame is already created, open it and return.
		if ( self.cropFrame ) {
			self.cropFrame.open();
			self.cropFrameClear();
			return;
		}

		self.cropFrameCreate();
		self.cropFrameClear();
	}

	/**
	 * Action to take when image aspect ratios match.
	 * 
	 * @since 1.0.9
	 */
	this.cropFrameRatioMatch = function() {
		// Show a 'ratio match!' message.
		var template = wp.template( 'suggest-crop-ratio-match' );
		self.$mfc.html( template() );

		// Give the user 1.5 seconds to read the message, then fade out.
		setTimeout( function() {
			self.$mediaModal.fadeOut( '500', function() {
				self.cropFrame.close();
			} );
		}, 1500 );
	}

	/**
	 * Fill our cropFrame.
	 * 
	 * @since 1.0.8
	 */
	this.cropFrameFill = function() {

		var data = {
		    oldImageSrc : self.oldImage.src,
		    newImageSrc : self.newImage.src,
		    newContentSrc : self.bestSizeSelector
		};
		var template = wp.template( 'suggest-crop' );
		self.$mfc.html( template( data ) );

		// After we've filled in our details, add our <select>.
		self.$suggestCrop = self.$mfc.find( '.suggest-crop' );
		self.$suggestCrop.after( self.$selectDimensions );

		// Bind our select element.
		$( '#suggest-crop-sizes' ).change( function() {
			var imgSrc = $( this ).val();
			self.onSizeChange( imgSrc );
		} );

		var template = wp.template( 'suggest-crop-toolbar' );
		self.$mft.html( template() );

		self.bindCropFrameElements();

		self.selectedCoordinatesSelect();
	}

	/**
	 * Set self.selectedCoordinates, the coordinates of the image the user has
	 * selected.
	 * 
	 * See the declaration of self.selectedCoordinates at the top of this file
	 * for more info.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            img Example img: http://pastebin.com/hA6Y6FJn
	 * @param object
	 *            selection Example selection: http://pastebin.com/4q2Q0nhf
	 */
	this.setSelectedCoordinates = function( img, selection ) {
		self.selectedCoordinates = selection;
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
	this.defaultCoordinatesCalculateDefault = function( img1Width, img1Height, img2Width, img2Height ) {
		var defaultWidth, defaultHeight, data = {};

		// First, try maximizing the width.
		defaultWidth = img2Width;
		defaultHeight = ( img1Height * img2Width ) / img1Width;

		// Calculations below will center our selection.
		data.x1 = 0;
		data.y1 = ( img2Height - defaultHeight ) / 2;
		data.x2 = defaultWidth;
		data.y2 = data.y1 + defaultHeight;

		// If using 'maximum width' does not fit, then maximize our height.
		if ( defaultHeight > img2Height ) {
			defaultHeight = img2Height;
			defaultWidth = ( img1Width * img2Height ) / img1Height;

			// Calculations below will center our selection.
			data.x1 = ( img2Width - defaultWidth ) / 2;
			data.y1 = 0;
			data.x2 = data.x1 + defaultWidth;
			data.y2 = defaultHeight;
		}

		data.aspectRatio = defaultWidth + ':' + defaultHeight;

		// This data will be needed globally, so make it so.
		self.defaultCoordinates = data;
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
	 *            whenFound A function to execute when the element is found.
	 */
	this.waitForElement = function( selector, milliseconds, whenFound ) {
		var interval = setInterval( function() {
			if ( $( selector ).length > 0 ) {
				whenFound();
				clearInterval( interval );
			}
		}, milliseconds );
	}

	/**
	 * Take action when image_data is set.
	 * 
	 * This method is triggered within this.onImageInsertedIntoEditor().
	 * 
	 * @since 1.0.8
	 */
	this.imageDataWhenSet = function() {
		// Do we have the data we need?
		var imageDataIsSet = ( false != self.oldImage && false != self.newImage );

		// If we have finished getting all of the image data:
		if ( imageDataIsSet ) {
			// Clear the interval. We know our imageDataIsSet, so stop
			// checking.
			clearInterval( self.intervalWaitForImageDataSet );

			// Do our two images have the same dimensions?
			var sameDimensions = ( ( self.oldImage.width / self.oldImage.height ) == ( self.newImage.width / self.newImage.height ) );

			if ( sameDimensions ) {
				// The images have the same dimensions, so no need to suggest a
				// crop.
				self.cropFrameRatioMatch();
			} else {
				// Fill in our self.cropFrame, the UI for cropping an image.
				self.cropFrameFill();
			}
		}
	}

	/**
	 * Bind events of elements within our cropFrame.
	 * 
	 * @since 1.0.8
	 */
	this.bindCropFrameElements = function() {
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
		self.$primaryButton = self.$mft.find( '.button-primary' );

		// Enable the "Crop Image" button.
		self.$primaryButton.attr( 'disabled', false );

		// Bind the click of the "Crop Image" button.
		self.$primaryButton.on( 'click', function() {
			self.crop();
		} );

		self.$skipButton = self.$primaryButton.siblings( '.media-button-skip' );

		// Bind the click of the "Skip Cropping" button.
		self.$skipButton.on( 'click', function() {
			self.cropFrame.close();
		} );

		// We just adjusted the buttons, take note of this so we don't do it
		// again.
		self.adjustedCropFrameButtons = true;
	}

	/**
	 * Bind the 'Force aspect ratio' checkbox.
	 * 
	 * @since 1.0.9
	 */
	this.bindForceAspectRatio = function() {
		var $checkBox = self.$mfc.find( '[name="force_aspect_ratio"]' );

		// If the text "Force aspect ratio" is clicked, toggle the checkbox.
		self.$mfc.find( 'span#toggle-force' ).on( 'click', function() {
			$checkBox.click();
		} )

		// Remove any existing bindings.
		$checkBox.off( 'change' );

		$checkBox.on( 'change', function() {
			// If the checkbox is checked, force the aspect ratio.
			if ( $( this ).is( ":checked" ) ) {
				self.ias.setOptions( {
				    aspectRatio : self.defaultCoordinates.aspectRatio,
				    x1 : self.defaultCoordinates.x1,
				    y1 : self.defaultCoordinates.y1,
				    x2 : self.defaultCoordinates.x2,
				    y2 : self.defaultCoordinates.y2
				} );
			} else {
				self.ias.setOptions( {
					aspectRatio : false
				} );
			}
		} );
	}
};

new BoldgridEditor.crop( jQuery );