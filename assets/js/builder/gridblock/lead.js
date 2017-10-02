var $ = jQuery,
	BG = BOLDGRID.EDITOR;

import template from '../../../../includes/template/gridblock/lead.html';

export class Lead {

	constructor() {
	}

	init() {
		console.log( tinymce.activeEditor.iframeElement );
		if ( BoldgridEditor.display_gridblock_lead ) {
			let $iframe = $( tinymce.activeEditor.iframeElement ),
				$template = $( template );

			console.log( $iframe.after( $template ) );
		}
	}

}

export { Save as default };
