<style>
.box {
	display: inline-block;
	width: 40px;
	height: 40px;
	margin: 20px;
	border: 1px solid black;
}

</style>
<link rel="stylesheet" type="text/css" href="/wp-content/plugins/boldgrid-editor/assets/css/editor.css">
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

	'shadow-bottom-right shadow-long',
	'shadow-bottom-left shadow-long',
);

$pointers = array(
	'pointer-left',
	'pointer-right',
	'pointer-top',
	'pointer-bottom',
);


foreach ( $shapes as $shape ) {
	echo "<div class='$shape'></div>";
}

foreach ( $shapes as $shape ) {
	foreach ( $pointers as $pointer ) {
		echo "<div class='$shape $pointer'></div>";
	}
}
return;

foreach ( $shapes as $shape ) {
	foreach ( $shadows as $shadow ) {
		echo "<div class='$shape $shadow'></div>";
	}
}
/*
foreach ( $shapes as $shape ) {
	foreach ( $pointers as $pointer ) {
		foreach ( $shadows as $shadow ) {
			echo "<div class='$shape $shadow $pointer'></div>";
		}
	}
}*/
?>