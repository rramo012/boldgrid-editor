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
/*
				Caman.Event.listen( caman, 'render', function ( e ) {
					console.log( e )
				} );*/
			} );
		},

		presets : {
		   'vintage' : 'Vintage',
		   'lomo' : 'Lomo',
		   'clarity' : 'Clarity',
		   'sinCity' : 'Sin City',
		   'sunrise' : 'Sunrise',
		   'crossProcess' : 'Cross Process',
		   'orangePeel' : 'Orange Peel',
		   'love' : 'Love',
		   'grungy' : 'Grungy',
		   'jarques' : 'Jarques',
		   'pinhole' : 'Pinhole',
		   'oldBoot' : 'Old Boot',
		   'glowingSun' : 'Glowing Sun',
		   'hazyDays' : 'Hazy Days',
		   'herMajesty' : 'Her Majesty',
		   'nostalgia' : 'Nostalgia',
		   'hemingway' : 'Hemingway',
		   'concentrate' : 'Concentrate',
		},

		onMenuClick : function () {
			var panel = BOLDGRID.EDITOR.Panel,
				menu = BOLDGRID.EDITOR.Menu,
				$target = menu.getTarget( self ),
				$selected,
				$ul;

			panel.clear();

			// Target Image Src.
			var src = $target.attr( 'src' );
			//isRemote(img)

			$ul = $( '<ul></ul>' );
			$.each( self.presets, function ( key ) {
				var $li = $( '<li data-preset="' + key + '" class="panel-selection"><img src="' +
					src + '"><div class="name">' + this +  '</div></li>');
				$ul.append( $li )
			} );

			panel.$element.find( '.panel-body' ).html( $ul );
			self.setupPanelClick();

			// Run Filters.
			$.each( self.presets, function ( key ) {
				Caman( '[data-preset="' + key + '"] img', function () {
					this[ key ]( '50%' ).render();
				} );
			} );

			panel.open( self );
		}

	};

	BOLDGRID.EDITOR.CONTROLS.Image.init();
	self = BOLDGRID.EDITOR.CONTROLS.Image;

} )( jQuery );