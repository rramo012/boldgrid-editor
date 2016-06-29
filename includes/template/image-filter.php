<script type="text/html" id="tmpl-boldgrid-editor-image-filter">
	<div class='choices'>
		<div class='presets'>
			<ul>
			<# _.each( data.presets, function ( preset ) { #>
				<li data-preset="{{preset.name}}" class="panel-selection">
					<img src="{{data.src}}">
					<div class="name">{{preset.title}}</div>
				</li>
			<# }); #>
			</ul>
			<a class='button activate-customize'>Customize</a>
		</div>
		<div class='customize'>
			<ul>
			<# _.each( data.customizeSettings, function ( setting ) { #>
				<li class='control'>
					<span class='name'>{{setting.title}}</span>
					<div class="slider" data-control="{{setting.name}}"></div>
				</li>
			<# }); #>
			</ul>
			<a class='button activate-presets'>Presets</a>
		</div>
	</div>
	<div class='preview'>
		<img src="{{data.fullSrc}}">
		<span class='loading'><span class="spinner is-active"></span></span>
		<a class='button button-primary'>Apply Changes</a>
	</div>
</script>