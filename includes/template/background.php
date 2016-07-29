<script type="text/html" id="tmpl-boldgrid-editor-background">
	<div class='background-design'>
		<div class='current-selection' style='background-image: url(https://images.unsplash.com/photo-1468245856972-a0333f3f8293?dpr=1&auto=compress,format&crop=entropy&fit=crop&w=767&h=511&q=80)'>
			<div class='filters'>
				<a href="#" data-type='["color","gradients"]' data-label="Flat Colors & Gradients" class='filter'><i class="fa fa-paint-brush" aria-hidden="true"></i> Color</a>
				<a href="#" data-type='["image"]' data-default="1" data-label="Images" class='filter'><i class="fa fa-picture-o" aria-hidden="true"></i> Image</a>
				<a href="#" data-type='["pattern"]' data-label="Patterns" class='filter'><i class="fa fa-wpforms" aria-hidden="true"></i> Pattern</a>
			</div>
		</div>
		<div class='presets'>
			<div class='title'>
				<h4>Sample Backgrounds</h4>
			</div>
			<ul>
			<# _.each( data.images, function ( typeSet, type ) { #>
				<# _.each( typeSet, function ( image ) { #>
				<# if( 'gradients' == type ) { #>
					<li data-type="{{type}}" class='selection' style="background-image: linear-gradient(to left, {{image.colors[0]}}, {{image.colors[1]}}"></li>
				<# } else { #>
					<li data-type="{{type}}" class='selection' style="background-image: url({{image}})"></li>
				<# } #>
				<# }); #>
			<# }); #>
			</ul>
		</div>
	</div>
</script>