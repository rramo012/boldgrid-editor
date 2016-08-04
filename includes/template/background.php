<script type="text/html" id="tmpl-boldgrid-editor-background">
	<div class='background-design'>
		<div class='preset-wrapper'>
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
					<li data-type="{{type}}" data-image-url="{{image}}" class='selection' style="background-image: url({{image}})"></li>
				<# } #>
				<# }); #>
			<# }); #>
			</ul>
		</div>
		</div>
		<div class='customize'>
			<div class='back section'>
				<a class='panel-button' href="#"><i class="fa fa-chevron-left" aria-hidden="true"></i> Back</a>
			</div>
			<div class='image-opacity section hidden'>
				<h4>Image Opacity (%)</h4>
				<div class="slider"></div>
				<span class='value'></span>
			</div>
			<div class='background-color section'>
				<h4>Background Color</h4>
				<div class="slider"></div>
				<span class='value'></span>
			</div>
			<div class='vertical-position section'>
				<h4>Verticle Position (%)</h4>
				<div class="slider"></div>
				<span class='value'></span>
			</div>
			<div class='size section'>
				<h4>Size</h4>
    			<label>
					<input type="radio" checked="checked" name="background-size" value="cover">Cover Area
				</label>
    			<label>
	    			<input type="radio" name="background-size" value="tiled">Tiled
				</label>
			</div>
			<div class='scroll-effects section'>
				<h4>Scroll Effects</h4>
    			<label>
					<input type="radio" checked="checked" name="scroll-effects" value="none">None
				</label>
    			<label>
					<input type="radio" name="scroll-effects" value="background-parallax">Parallax
				</label>
    			<label>
	    			<input type="radio" name="scroll-effects" value="background-zoom">Zoom
				</label>
			</div>
		</div>
	</div>
</script>