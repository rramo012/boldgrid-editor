<script type="text/html" id="tmpl-boldgrid-editor-color">
<div class='color-control'>
	<div class='title'>
		<h4>{{data.title}}</h4>
	</div>
	<ul class='colors'>
		<li class='panel-selection custom-color'><i class="fa fa-plus" aria-hidden="true"></i></li>
		<# _.each( data.colors, function ( preset ) { #>
			<li data-preset="{{preset.colorClass}}" style='background-color:{{preset.color}}' class="panel-selection"></li>
		<# }); #>
		<# _.each( data.customColors, function ( customColor ) { #>
			<li data-type="custom" data-preset="{{customColor}}" style='background-color:{{customColor}}' class="panel-selection"></li>
		<# }); #>
	</ul>
	<div class='color-picker-wrap'>
		<input type="text" class='boldgrid-color-picker' value="#bada55" />
		<div class="links">
			<a href='#' class='save'>Save</a>
			<a href='#' class='cancel'>Remove</a>
		</div>
	</div>
</div>
</script>