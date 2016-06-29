var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;

	BOLDGRID.EDITOR.CONTROLS.Image = {

		preview : null,

		name : 'image',

		section : 'row',

		priority : 10,

		iconClasses : 'genericon genericon-image',

		panel : {
			title : 'Image Filters',
			height : '555px',
			width : '800px',
		},

		selectors : [ 'img', '[data-caman-id]' ],

		init : function () {
			BOLDGRID.EDITOR.Controls.registerControl( this );
		},

		setupPanelClick : function() {
			var panel = BOLDGRID.EDITOR.Panel,
				menu = BOLDGRID.EDITOR.Menu;

			panel.$element.find( '.panel-selection' ).on( 'click', function () {
				var $this = $( this ),
					$target = panel.$element.find( '.preview' ).find( 'img, canvas' );

				panel.$element.find( '.selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );

				panel.$element.addClass( 'rendering' );
				self.preview.reset();
				self.preview[ $this.data( 'preset' ) ]( '50%' ).render( function ( e ) {
				//	menu.$element.targetData[ self.name ] = $( caman.canvas );
					panel.$element.removeClass( 'rendering' );
				} );
				//
			} );

			$( ".slider" ).slider();
		},

		presets : [
           //{ name : 'None', title : 'None' },
			{ name : 'vintage', title : 'Vintage' },
			{ name : 'lomo', title : 'Lomo' },
			{ name : 'clarity', title : 'Clarity' },
			{ name : 'sinCity', title : 'Sin City' },
			{ name : 'sunrise', title : 'Sunrise' },
			{ name : 'crossProcess', title : 'Cross Process' },
			{ name : 'orangePeel', title : 'Orange Peel' },
			{ name : 'love', title : 'Love' },
			{ name : 'grungy', title : 'Grungy' },
			{ name : 'jarques', title : 'Jarques' },
			{ name : 'pinhole', title : 'Pinhole' },
			{ name : 'oldBoot', title : 'Old Boot' },
			{ name : 'glowingSun', title : 'Glowing Sun' },
			{ name : 'hazyDays', title : 'Hazy Days' },
			{ name : 'herMajesty', title : 'Her Majesty' },
			{ name : 'nostalgia', title : 'Nostalgia' },
			{ name : 'hemingway', title : 'Hemingway' },
			{ name : 'concentrate', title : 'Concentrate' }
		],
		customizeSettings : [
		           //{ name : 'None', title : 'None' },
		           { name : 'brightness', title : 'Brightness' },
		           { name : 'vibrance', title : 'Vibrance' },
		           { name : 'hue', title : 'Hue' },
		           { name : 'gamma', title : 'Gamma' },
		           { name : 'clip', title : 'Clip' },
		           { name : 'stackBlur', title : 'Blur' },
		           { name : 'contrast', title : 'Contrast' },
		           { name : 'saturation', title : 'Saturation' },
		           { name : 'exposure', title : 'Exposure' },
		           { name : 'sepia', title : 'Sepia' },
		           { name : 'noise', title : 'Noise' },
		           { name : 'sharpen', title : 'Sharpen' },
           ],

		onMenuClick : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				menu = BOLDGRID.EDITOR.Menu,
				$target = menu.getTarget( self ),
				$selected,
				$ul;

			panel.clear();

			// Target Image Src.

			var fullSrc = $target.attr( 'src' );
			var classNames = $target.attr( 'class' );
			$.each( BoldgridEditor.images, function () {
				if ( $target.hasClass( 'wp-image-' + this.attachment_id ) ) {
					src = this.thumbnail;
					return false;
				}
			} );

			if ( ! src ) {
				src = fullSrc;
			}

			//isRemote(img)

			var template = wp.template( 'boldgrid-editor-image-filter' );
			var html = template( {
				'fullSrc' : fullSrc,
				'src' : src,
				'presets' : self.presets,
				'customizeSettings' : self.customizeSettings
			} ) ;

			panel.$element.find( '.panel-body' ).html( html );

			self.setupPanelClick();

			var count = 0;
			var process = function () {
				Caman( '[data-preset="' + self.presets[ count ].name + '"] img', function () {
					this[ self.presets[ count ].name ]( '50%' ).render( function () {
						count++;
						if ( self.presets[ count ] ) {
							process();
						}
					} );
				} );
			};
			process();


			self.preview = Caman( panel.$element.find( '.preview img' )[0], function () {} );

			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Image.init();
	self = BOLDGRID.EDITOR.CONTROLS.Image;

} )( jQuery );