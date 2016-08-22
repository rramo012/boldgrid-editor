var IMHWPB = IMHWPB || {};
IMHWPB.ExistingLayouts = (function($, IMHWPB) {
	// General Variables
	IMHWPB.ExistingLayouts = {};
	var self = IMHWPB.ExistingLayouts;

	/**
	 * The initialize process
	 */
	self.init = function() {
		//On Load Events
		$( function () {
			self.bind_onload_events();
		});

		return self;
	};

	/**
	 * Call all functions that occur onload
	 */
	self.bind_onload_events = function () {
		self.filter_out_nested_hr();

		$.each( IMHWPB.Globals.tabs['basic-gridblocks']['content'], function ( key ) {
			var $html = $( this.html );
			$html.find('img').removeAttr('src class');
			$html.find('a').removeAttr('href');
			this.generalized_markup = $html.wrapAll('<div>').parent().html();
			this.generalized_markup = this.generalized_markup.replace(/ /g,'');
		} );
	};

	/**
	 * Remove images missing attributes.
	 */
	self.remove_gridblocks_missing_dynamic_attr = function () {
		$('.centered-content-boldgrid img').each( function () {
			var $this = $(this);
			var src = $this.attr('src');
			if ( src && src.indexOf('//wp-preview') > -1 && !$this.attr('data-id-from-provider') ) {
				$this.closest('.attachment').remove();
			}
		});
	}

	/**
	 * Remove HR's
	 * <row>
	 * 		<col>
 	 *			<hr>
	 * 		<col>
	 * <row>
	 */
	self.filter_out_nested_hr = function () {

		self.remove_gridblocks_missing_dynamic_attr();

		$('.centered-content-boldgrid .row:not(.row .row) > [class^="col-"] > hr').each( function () {
			var $this = $(this);
			if ( !$this.siblings().length ) {
				$this.closest('.attachment').remove();
			}
		});

		var valid_num_of_descendents = 3;
		$('.centered-content-boldgrid .row:not(.row .row)').each( function () {
			var $this = $(this);
			if ( !$this.siblings().length  ) {
				$descendents = $this.find('*');
				if ( $descendents.length <= valid_num_of_descendents ) {
					$this.closest('.attachment').remove();
				}
			}
		});


		/**
		 * filters out
		 *
		 * <row>
		 * 		<col>
		 * 			<row>
		 * 				<col>
		 * 					<hr>
		 * 				<col>
		 * 			<row>
		 * 		<col>
		 * <row>
		 */
		$('.centered-content-boldgrid .row:not(.row .row) > [class^="col-"] > .row').each( function () {
			var $this = $(this);
			if ( !$this.siblings().length ) {
				$hr = $this.find('hr');
				if ( !$hr.siblings().length ) {
					$this.closest('.attachment').remove();
				}
			}
		});

		//Hide empty rows
		$('.centered-content-boldgrid > .row:not(.row .row):only-of-type > [class^="col-"]:empty:only-of-type').each( function () {
			var $this = $(this);
			$this.closest('.attachment').remove()
		});
	};

	return self;


})(jQuery, window.IMHWPB || {}).init();
