<script type="text/html" id="tmpl-boldgrid-editor-font">
	<div class='section family'>
		<h4>Font</h4>
		<select class='google-fonts'>
  			<option value="pending">Family (Not Working Yet)</option>
		</select>
		<label for="font-color" class='color-preview'></label>
		<input type="text" data-type="" name='font-color' class='color-control' value=''>
	</div>
	<div class='section size'>
		<h4>Font Size (px)</h4>
		<div class="slider"></div>
		<span class='value'></span>
	</div>
	<div class='section effects' data-tooltip-id='text-effect'>
		<h4>Effects</h4>
		<ul>
			<li class='panel-selection'><i class="fa fa-ban" aria-hidden="true"></i></li>
			<# _.each( data.textEffectClasses, function ( preset ) { #>
				<li data-preset="{{preset.name}}" class="panel-selection">
					<span class="{{preset.name}}">A</span>
				</li>
			<# }); #>
		</ul>
	</div>
	<div class='section spacing' data-tooltip-id='spacing'>
		<h4>Spacing</h4>
		<div class='character'>
			<p>Letter Spacing</p>
			<div class="slider"></div>
			<span class='value'></span>
		</div>
		<div class='line'>
			<p>Line Spacing</p>
			<div class="slider"></div>
			<span class='value'></span>
		</div>
	</div>
</script>