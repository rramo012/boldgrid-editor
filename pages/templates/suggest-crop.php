<script type="text/html" id="tmpl-suggest-crop">
	<div class='container-image-crop'>

		<div class='left'>

			<p>
				<strong>Image Crop</strong> 
				<a class="dashicons dashicons-editor-help imgedit-help-toggle"></a>
			</p>

			<p class='imgedit-help'>The aspect ratio is the relationship between the width and height of an image. To crop the image, drag to make your selection and then click "Crop Image".</p>

			<p>The image you are replacing has a different aspect ratio than the new image you have chosen:</p>

			<img src="{{{data.old_image_src}}}" />

			<img src="{{{data.new_image_src}}}" />

			<div class='clear'></div>

			<p>You can crop the image before inserting it into your page, or choose not to crop by clicking <em>Skip Cropping</em>.</p>

		</div>

		<div class='right'>

			<img class="suggest-crop img-responsive" src="{{{data.new_content_src}}}" />

			<p>
				<input type="checkbox" name="force_aspect_ratio" checked>Force aspect ratio?
			</p>

		</div>

		<div class='clear'></div>
	</div>
</script>
<script type="text/html" id="tmpl-suggest-crop-toolbar">
	<div class="media-toolbar">
		<div class="media-toolbar-primary search-form">
			<button type="button" class="button media-button button-secondary button-large media-button-skip">Skip Cropping</button>
			<button type="button" class="button media-button button-primary button-large media-button-select">Crop Image</button>
		</div>
	</div>
</script>
<script type="text/html" id="tmpl-suggest-crop-compare-images">
	<div class='container-image-crop comparing'>
		<span class="spinner inline"></span> Comparing your new image with the image you are replacing. If they have different aspect ratios, you can crop your new image next.
	<div class='container-image-crop'>
</script>
<script type='text/html' id='tmpl-suggest-crop-crop-invalid'>
	<p class='crop-invalid'>
		There was an error cropping your image. Please click <em>OK</em> to insert the uncropped image. <button class='button media-button button-primary button-large crop-fail'>OK</button>
	</p>
</script>