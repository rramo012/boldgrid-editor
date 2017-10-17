<script type="text/html" id="tmpl-boldgrid-editor-font">
	<div class="choices supports-customization">
	<div class='section family presets selected'>
		<h4>Font</h4>
		<div class="font-family-select selectize-dropdown-content">
			<select>
				<# _.each( data.themeFonts, function ( family, index ) { #>
  				<option class='option' data-type="theme" data-index="{{index}}" data-value="{{family}}">{{family}}</option>
				<# }); #>
				<# _.each( data.myFonts, function ( family, index ) { #>
  				<option class='option' data-type="custom" data-index="{{index}}" data-value="{{family}}">{{family}}</option>
				<# }); #>
  				<option class='option' data-type="all"  data-index="" data-value="default">Default</option>
				<# _.each( data.fonts.items, function ( font, index ) { #>
  				<option class='option' data-type="all"  data-index="{{index}}" data-value="{{font.family}}">{{font.family}}</option>
				<# }); #>
			</select>
		</div>
		<label for="font-color" class='color-preview'></label>
		<input type="text" data-type="" name='font-color' class='color-control' value=''>
	</div>
	<div class='section size presets'>
		<h4>Font Size (px)</h4>
		<div class="slider"></div>
		<span class='value'></span>
	</div>
	<div class='section effects presets' data-tooltip-id='text-effect'>
		<h4>Effects</h4>
		<ul>
			<li class='panel-selection none-selected'><i class="fa fa-ban" aria-hidden="true"></i></li>
			<# _.each( data.textEffectClasses, function ( preset ) { #>
				<li data-preset="{{preset.name}}" class="panel-selection">
					<span class="{{preset.name}}">B</span>
				</li>
			<# }); #>
		</ul>
	</div>
	<div class='section spacing presets' data-tooltip-id='spacing'>
		<h4>Spacing</h4>
		<div class='character'>
			<p>Letter Spacing (px)</p>
			<div class="slider"></div>
			<span class='value'></span>
		</div>
		<div class='line'>
			<p>Line Spacing (em)</p>
			<div class="slider"></div>
			<span class='value'></span>
		</div>
	</div>
	</div>
</script>
