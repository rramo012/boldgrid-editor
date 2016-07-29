<style>
.box {
	display: inline-block;
	width: 150px;
	height: 150px;
	margin: 10px;
}


.box.box-long {
	height: 300px;
}
.box.box-wide {
	width: 300px;
}


</style>
<link rel="stylesheet" type="text/css" href="/wordpress/wp-content/plugins/boldgrid-editor/assets/css/editor.css">
<script   src="https://code.jquery.com/jquery-1.12.4.min.js"   integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="   crossorigin="anonymous"></script>
<script   src="/wordpress/wp-content/plugins/boldgrid-gallery/boldgrid/assets/js/masonry/masonry.min.js"></script>
<script>

$( function() {
	var colors = [
		'#1abc9c',
		'#2980b9',
		'#bdc3c7',
		'#e74c3c',
		'#34495e',
		'#f39c12'
	];
	var boxUIStyles = [
		'',
		'',
		'',
		'',
		'box-long',
		'box-wide',
	];


	var numBoxes = $( '.box' ).length;
	var boxPerColor = Math.floor( numBoxes / 6 );

	var colorCount = 0
	$( '.box' ).each( function ( index ) {
		$( this ).css( 'background-color', colors[ colorCount ] );
		var rand = boxUIStyles[Math.floor(Math.random() * boxUIStyles.length)];
		$( this ).addClass( rand );

		if ( index % 4 == 0 && index != 0 ) {
			colorCount++;
		}
		if ( colorCount > 5 ) {
			colorCount = 0;
		}
	} );

	$('.grid').masonry({
		  columnWidth: 200,
		  itemSelector: '.box'
	} );

} );

</script>
<div class='grid'>

<?php
$shapes = array (
	'box square',
	'box edged',
	'box rounded',
	'box circle',

	'box rounded-top-left',
	'box rounded-top-right',
	'box rounded-bottom-left',
	'box rounded-bottom-right',

	'box rounded-bottom-left rounded-top-right',
	'box rounded-bottom-left rounded-bottom-right',
	'box rounded-bottom-left rounded-top-left',

	'box rounded-bottom-right rounded-top-left',
	'box rounded-bottom-right rounded-top-right',

	'box rounded-top-left rounded-top-right',
	'box rounded-top-right rounded-bottom-left',
);

$shadows = array(
	'shadow-bottom-left',
	'shadow-bottom-right',

	//'shadow-bottom-right shadow-long',
	//'shadow-bottom-left shadow-long',
);

$pointers = array(
	'pointer pointer-left',
	'pointer pointer-right',
	'pointer pointer-top',
	'pointer pointer-bottom',
);

$boxes = array();

foreach ( $shapes as $shape ) {
	$boxes['shapes'][] = "<div class='$shape'></div>";
}

foreach ( $shapes as $shape ) {

	if ( strpos( $shape, 'circle' ) ) {
		continue;
	}

	foreach ( $pointers as $pointer ) {
		//$boxes['pointers'][] = "<div class='$shape $pointer'></div>";
	}
}

//shuffle( $boxes['pointers'] );


foreach ( $shapes as $shape ) {
	foreach ( $shadows as $shadow ) {
		$boxes['shadows'][] = "<div class='$shape $shadow'></div>";
	}
}

foreach ( $boxes as $type => $box_type ) {
	foreach ( $box_type as $count => $box ) {
		if ( 'pointers' == $type && $count > 10 ) {
		//	continue;
		}
		echo $box;
	}
}


return;
foreach ( $shapes as $shape ) {
	foreach ( $pointers as $pointer ) {
		foreach ( $shadows as $shadow ) {
			echo "<div class='$shape $shadow $pointer'></div>";
		}
	}
}
?>

</div>