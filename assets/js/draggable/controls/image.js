var BOLDGRID = BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};
BOLDGRID.EDITOR.CONTROLS = BOLDGRID.EDITOR.CONTROLS || {};

( function ( $ ) {
	var self;

	BOLDGRID.EDITOR.CONTROLS.Image = {

		name : 'image',

		section : 'row',

		priority : 10,

		iconClasses : 'genericon genericon-image',

		panel : {
			title : 'Image Filters',
			height : '400px',
			width : '400px',
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
					$target = menu.getTarget( self );

				panel.$element.find( '.selected' ).removeClass( 'selected' );
				$this.addClass( 'selected' );
				
				var caman = Caman( $target[0], function () {
					this.reset();
					this[ $this.data( 'preset' ) ]( '50%' ).render( function ( e ) {
						menu.$element.targetData[ self.name ] = $( caman.canvas );
					} );
					//
				} );
			} );
		},

		presets : [
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

		onMenuClick : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				menu = BOLDGRID.EDITOR.Menu,
				$target = menu.getTarget( self ),
				$selected,
				$ul;

			panel.clear();

			// Target Image Src.
			
			var src = $target.attr( 'src' );
			var classNames = $target.attr( 'class' );
			$.each( BoldgridEditor.images, function () {
				if ( $target.hasClass( 'wp-image-' + this.attachment_id ) ) {
					src = this.thumbnail;
					return false;
				}
			} );
			//isRemote(img)

			$ul = $( '<ul></ul>' );
			$.each( self.presets, function ( ) {
				var $li = $( '<li data-preset="' + this.name + '" class="panel-selection"><img src="' +
					src + '"><div class="name">' + this.title +  '</div></li>');
				$ul.append( $li )
			} );

			panel.$element.find( '.panel-body' ).html( $ul );
			self.setupPanelClick();

			// Run Filters.
			$.each( self.presets, function ( key ) {
			} );
			
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

			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Image.init();
	self = BOLDGRID.EDITOR.CONTROLS.Image;

} )( jQuery );