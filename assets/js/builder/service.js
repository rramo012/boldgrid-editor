window.BOLDGRID = window.BOLDGRID || {};
BOLDGRID.EDITOR = BOLDGRID.EDITOR || {};

import EditorWidth from './tinymce/width';

BOLDGRID.EDITOR.Service = BOLDGRID.EDITOR.Service || {};

// Instantiate a set the instance to a Service Manager.
BOLDGRID.EDITOR.Service = {
	editorWidth: new EditorWidth().init()
};
