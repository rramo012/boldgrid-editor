<script type="text/html" id="tmpl-boldgrid-editor-color">
	<h4>Color</h4>
	<ul class='colors'>
		<# _.each( data.colors, function ( preset ) { #>
			<li data-preset="{{preset.colorClass}}" style='background-color:{{preset.color}}' class="panel-selection"></li>
		<# }); #>
	</ul>
</script>