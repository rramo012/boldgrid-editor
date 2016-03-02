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
IMHWPB.BoldGrid_Editor_Suggest_Crop = function($) {
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
	$(function() {
		self.init();
	});

	/**
	 * Actions to take when someone clicks the "Add Media" button.
	 * 
	 * Check every 100 miliseconds to see if the "Insert into page" button is
	 * visible. When it is, bind its click.
	 * 
	 * @since 1.0.8
	 */
	this.on_click_add_media_button = function() {
		self
				.waitForElement(
						'button.media-button-insert:visible',
						100,
						function() {
							$('.media-button-insert:visible')
									.on(
											'click',
											function() {
												// If this button has not been
												// binded:
												if (!$(this)
														.hasClass(
																'boldgrid-editor-suggest-crop-binded')) {
													$(this)
															.addClass(
																	'boldgrid-editor-suggest-crop-binded')
													self
															.on_image_inserted_into_editor();
												}
											});
						});
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
		self.waitForElement('button.media-button-replace:visible', 100,
				function() {
					$('.media-button-replace:visible').on('click', function() {
						self.on_image_inserted_into_editor();
					});
				});
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
		var template = wp.template('suggest-crop-compare-images');
		self.$mfc.html(template());
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
		self.$skip_button.prop('disabled', true);

		// Disable the crop button so the user can't click it again. Set its
		// text to "Cropping".
		self.$primary_button.prop('disabled', true).text('Cropping...');

		// @var object data Example data: http://pastebin.com/507gY9L8
		var data = {
			'action' : 'suggest_crop_crop',
			'cropDetails' : self.selected_coordinates,
			'path' : self.new_content.attr('src')
		};

		$.post(ajaxurl, data, function(response) {
			// Validate our response and take action.
			self.crop_validate(response);
		});
	}

	/**
	 * Steps to take when a crop fails.
	 * 
	 * @since 1.0.8
	 */
	this.crop_invalid = function() {
		var template = wp.template('suggest-crop-crop-invalid');
		self.$mft.html(template());

		// When the user clicks the "OK" button, close the crop_frame.
		$('button.crop-fail').on('click', function() {
			self.crop_frame.close();
		})
	}

	/**
	 * After an ajax request to crop an image, validate the response.
	 * 
	 * @since 1.0.8
	 * 
	 * @param string
	 *            response An ajax response.
	 */
	this.crop_validate = function(response) {
		// If the ajax request failed or we don't have valid json.
		if (0 == response || !self.isJsonString(response)) {
			self.crop_invalid();
			return;
		}

		// We have a valid json string, parse it.
		// After response has been JSON.parsed:
		// @var object response Example response:
		// http://pastebin.com/d0qXq4wr
		response = JSON.parse(response);

		// Make sure we have all the necessary properties. If we don't, then the
		// data is invalid.
		var have_needed_properties = true;
		var needed_properties = [ 'new_image_height', 'new_image_width',
				'new_image_url' ];

		$.each(needed_properties, function(key, property) {
			if ('undefined' === typeof response[property]) {
				have_needed_properties = false;
				return false;
			}
		});

		if (have_needed_properties) {
			self.crop_valid(response);
		} else {
			self.crop_invalid();
		}
	}

	/**
	 * Steps to take when an image is cropped successfull.
	 * 
	 * @since 1.0.8
	 * 
	 * @param object
	 *            response A json.parsed ajax response.
	 */
	this.crop_valid = function(response) {
		// Get the currently selected text.
		// @var object node Example node: http://pastebin.com/4nwJmLRj
		var node = tinyMCE.activeEditor.selection.getNode();

		// Adjust the src, width, and height of the new image.
		node.src = response.new_image_url;
		node.width = response.new_image_width;
		node.height = response.new_image_height;

		// Reset our crop and skip buttons.
		self.$skip_button.prop('disabled', false);
		self.$primary_button.prop('disabled', false).text(
				self.original_primary_button_text);

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
		// In this.selected_content_set(), we take action similar to the two
		// lines below. @see this.selected_content_set() for more info about the
		// variables we're setting below.
		var new_content = tinyMCE.activeEditor.selection.getContent();
		self.new_content = $(new_content);

		// Get the old image, the image we're replacing.
		var old_img = new Image();
		old_img.onload = function() {
			self.old_image = old_img;
		}
		old_img.src = self.selected_content.attr('src');

		// Get the new image, the image we've chosen as a replacement.
		var new_image = new Image();
		new_image.onload = function() {
			self.new_image = new_image;
		};
		new_image.src = self.new_content.attr('src');
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
		self.selected_content = $(selected_content);
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
		self.selected_coordinates_set_default();

		/**
		 * After adding the image, bind imgAreaSelect to it.
		 * 
		 * Full documentation:
		 * http://odyniec.net/projects/imgareaselect/usage.html
		 */
		self.ias = $('img.suggest-crop').imgAreaSelect({
			aspectRatio : self.aspectRatio,
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
			x1 : 0,
			y1 : 0,
			x2 : self.default_selected_width,
			y2 : self.default_selected_height,
			onInit : function(img, selection) {
				self.selected_coordinates_set(img, selection);
			},
			onSelectEnd : function(img, selection) {
				self.selected_coordinates_set(img, selection);
			}
		});
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
		$('body').on('click', '[aria-label="Change"]', function() {
			self.on_click_change_button();
			self.selected_content_set();
		});

		/**
		 * Bind the click of the "Add Media" button.
		 * 
		 * The "Add Media" button is to the left of the "Add GridBlock" button.
		 */
		$('body').on('click', 'button.add_media', function() {
			self.on_click_add_media_button();
			self.selected_content_set();
		});
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
	this.isJsonString = function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
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
		setTimeout(function() {
			// Fire off a method to get all image data.
			self.image_data_set();

			// Every tenth of a second, check to see if we have our data.
			self.interval_wait_for_image_data_set = setInterval(function() {
				// When this function determines we have the data we need:
				// # It clears this Interval.
				// # It fills our crop_frame.
				self.image_data_when_set();
			}, 100);
		}, 1000);
	}

	/**
	 * Create our crop_frame.
	 * 
	 * See the declaration of crop_frame at the top of this file for more info.
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_create = function() {
		self.crop_frame = wp.media({
			title : 'Crop Image',
			button : {
				text : 'Crop Image'
			}
		});

		self.crop_frame.open();

		self.$mfr = $('.media-frame-router').last();
		self.$mfc = $('.media-frame-content').last();
		self.$mft = $('.media-frame-toolbar').last();
	}

	/**
	 * Open our crop_frame.
	 * 
	 * @since 1.0.8
	 */
	this.crop_frame_open = function() {
		// If the element we're replacing is not an image, abort.
		if ('IMG' != self.selected_content.prop('tagName')) {
			return;
		}

		// If the crop frame is already created, open it and return.
		if (self.crop_frame) {
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
			new_content_src : self.new_content.attr('src')
		};
		var template = wp.template('suggest-crop');
		self.$mfc.html(template(data));

		var template = wp.template('suggest-crop-toolbar');
		self.$mft.html(template());

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
	this.selected_coordinates_set = function(img, selection) {
		self.selected_coordinates = selection;
	}

	/**
	 * Set the initial coordiantes to select when cropping an image.
	 * 
	 * When we are suggesting that the user crop the image, we make it easier by
	 * showing their new image with a selection already outlined. This method
	 * determines exactly what portion of the image to outline.
	 * 
	 * Let's say our original image is 10,000 x 10,000. We're replacing it with
	 * an image 200 x 100. We can't simply take the original image's dimensions
	 * and select it in the new image, the new image may not be big enough.
	 * 
	 * To determine the default coordinates to select, we check if the original
	 * image fits inside the new image. If it doesn't, we decrease the original
	 * image's size in increments of 5% until we get a fitting size.
	 * 
	 * @since 1.0.8
	 */
	this.selected_coordinates_set_default = function() {
		var is_default_selection_too_small;

		// Set our initial values the the values of the original image.
		self.default_selected_width = self.old_image.width;
		self.default_selected_height = self.old_image.height;

		// While the area we want to select is bigger than the new image,
		// decrease the size of the area we want to select.
		while (self.default_selected_width > self.new_image.width
				|| self.default_selected_height > self.new_image.height) {
			// Decrease the size of our default selection by 5%.
			self.default_selected_width = self.default_selected_width * .95;
			self.default_selected_height = self.default_selected_height * .95;

			// Avoid an infinite loop. If we have gotten down to a selection
			// less than 10px in size, something must have gone wrong. Set our
			// default selection to the size of the new image.
			is_default_selection_too_small = (self.default_selected_width < 10 || self.default_selected_height < 10);
			if (is_default_selection_too_small) {
				self.default_selected_width = self.new_image.width;
				self.default_selected_height = self.new_image.height;
				break;
			}
		}

		// Save the aspectRatio we just calculated.
		// @var string aspectRatio Example aspectRatio:
		// "97.02766117170738:145.27925483547529".
		self.aspectRatio = self.default_selected_width + ':'
				+ self.default_selected_height;
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
	this.waitForElement = function(selector, milliseconds, when_found) {
		var interval = setInterval(function() {
			if ($(selector).length > 0) {
				when_found();
				clearInterval(interval);
			}
		}, milliseconds);
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
		var image_data_is_set = (false != self.old_image && false != self.new_image);

		// If we have finished getting all of the image data:
		if (image_data_is_set) {
			// Clear the interval. We know our image_data_is_set, so stop
			// checking.
			clearInterval(self.interval_wait_for_image_data_set);

			// Do our two images have the same dimensions?
			var same_dimensions = ((self.old_image.width / self.old_image.height) == (self.new_image.width / self.new_image.height));

			if (same_dimensions) {
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
		$('.imgedit-help-toggle').on('click', function() {
			$('.imgedit-help').slideToggle();
		});

		/**
		 * ELEMENT: "force aspect ratio".
		 * 
		 * Action to take when "force aspect ratio" is clicked.
		 */
		$('[name="force_aspect_ratio"]').change(function() {
			// If the checkbox is checked, force the aspect ratio.
			if ($(this).is(":checked")) {
				self.ias.setOptions({
					aspectRatio : self.aspectRatio,
					x1 : 0,
					y1 : 0,
					x2 : self.default_selected_width,
					y2 : self.default_selected_height,
				});
			} else {
				self.ias.setOptions({
					aspectRatio : false
				});
			}

			self.ias.update();
		});

		/**
		 * ELEMENT: 'Crop Image' and 'Skip Cropping' buttons.
		 * 
		 * Actions to take when buttons in the lower toolbar are clicked.
		 */
		self.$primary_button = self.$mft.find('.button-primary');

		// Enable the "Crop Image" button.
		self.$primary_button.attr('disabled', false);

		// Bind the click of the "Crop Image" button.
		self.$primary_button.on('click', function() {
			self.crop();
		});

		self.$skip_button = self.$primary_button.siblings('.media-button-skip');

		// Bind the click of the "Skip Cropping" button.
		self.$skip_button.on('click', function() {
			self.crop_frame.close();
		});

		// We just adjusted the buttons, take note of this so we don't do it
		// again.
		self.adjusted_crop_frame_buttons = true;
	}
};

new IMHWPB.BoldGrid_Editor_Suggest_Crop(jQuery);