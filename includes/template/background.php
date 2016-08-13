<script type="text/html" id="tmpl-boldgrid-editor-background">
	<div class='background-design'>
		<div class='preset-wrapper'>
		<div class='current-selection'>
			<div class='filters'>
				<a href="#" data-type='["color","gradients"]' data-label="Flat Colors & Gradients" class='filter'><i class="fa fa-paint-brush" aria-hidden="true"></i> Color</a>
				<a href="#" data-type='["image"]' data-default="1" data-label="Images" class='filter'><i class="fa fa-picture-o" aria-hidden="true"></i> Image</a>
				<a href="#" data-type='["pattern"]' data-label="Patterns" class='filter'><i class="fa fa-wpforms" aria-hidden="true"></i> Pattern</a>
			</div>
			<div class='settings'>
				<a href="#" class='panel-button'><i class="fa fa-cog" aria-hidden="true"></i> Settings</a>
			</div>
		</div>
		<div class='presets'>
			<div class='title'>
				<h4>Sample Backgrounds</h4>
			</div>
			<ul>
			<# _.each( data.images, function ( typeSet, type ) { #>
				<# _.each( typeSet, function ( image, index ) { #>
				<# if( 'color' == type ) { #>
					<li data-type="{{type}}" data-class='{{index}}' class='selection' style="background: {{image}}"></li>
				<# } else if( 'gradients' == type ) { #>
					<li data-type="{{type}}" class='selection' style="background-image: {{image}}"></li>
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
			<div class='background-color section color-controls'>
				<h4>Background Color</h4>
				<label for="section-background-color" class='color-preview'></label>
				<input type="text" data-type="" name='section-background-color' class='color-control' value=''>
			</div>
			<div class='vertical-position section'>
				<h4>Verticle Position (%)</h4>
				<div class="slider"></div>
				<span class='value'></span>
			</div>
			<div class='size section' data-tooltip-id='background-size'>
				<h4>Size</h4>
    			<label>
					<input type="radio" checked="checked" name="background-size" value="cover">Cover Area
				</label>
    			<label>
	    			<input type="radio" name="background-size" value="tiled">Tiled
				</label>
			</div>
			<div class='scroll-effects section' data-tooltip-id='background-scroll-effects'>
				<h4>Scroll Effects</h4>
    			<label>
					<input type="radio" checked="checked" name="scroll-effects" value="none">None
				</label>
    			<label>
					<input type="radio" name="scroll-effects" value="background-parallax">Parallax
				</label>
    			<label>
	    			<input type="radio" name="scroll-effects" value="background-fixed">Fixed
				</label>
			</div>
		</div>
	</div>
</script>