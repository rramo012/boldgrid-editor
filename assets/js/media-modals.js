var IMHWPB = IMHWPB || {};

/**
 * IMHWPB.BoldGrid_Media_Modals
 * 
 * Class responsible for managing media modals within the editor.
 * 
 * @since 1.0.8
 */
IMHWPB.BoldGrid_Editor_Media_Modals = function( $ ) {
	var self = this;
	
	/**
	 * This function has been copied from wp-includes/js/tinymce/plugins/wpeditimage/plugin.js.
	 * 
	 * Differences to this function compared to the original:
	 * # This function has been renamed from "editImage" to "changeImage".
	 * # var editor has been set to "tinymce.activeEditor".
	 * 
	 * @since 1.0.8
	 * 
	 * @param object img Example img: http://pastebin.com/sz8kaWmK This is data of the image we're replacing.
	 */
	this.changeImage = function( img ) {
        var frame, callback, metadata, editor;
        
        editor = tinymce.activeEditor;

        if ( typeof wp === 'undefined' || ! wp.media ) {
                editor.execCommand( 'mceImage' );
                return;
        }

        metadata = self.extractImageData( img );

        // Manipulate the metadata by reference that is fed into the PostImage model used in the media modal
        wp.media.events.trigger( 'editor:image-edit', {
                editor: editor,
                metadata: metadata,
                image: img
        } );

        frame = wp.media({
                frame: 'image',
                state: 'replace-image',
                metadata: metadata
        } );

        wp.media.events.trigger( 'editor:frame-create', { frame: frame } );

        callback = function( imageData ) {
			editor.focus();
			editor.undoManager.transact( function() {
				self.updateImage( img, imageData );
			} );
			frame.detach();
		};

        frame.state('image-details').on( 'update', callback );
        
        frame.state('replace-image').on( 'replace', callback );
        
        frame.on( 'close', function() {
                editor.focus();
                frame.detach();
        });

        frame.open();
	}

	
	/**
	 * Extract data from an image selected in the editor.
	 * 
	 * This function has been copied from wp-includes/js/tinymce/plugins/wpeditimage/plugin.js.
	 * 
	 * Differences to this function compared to the original:
	 * # dom = "tinymce.activeEditor.dom" instead of "editor.dom".
	 * 
	 * @param object imageNode
	 * @return object metadata Example metadata: http://pastebin.com/QVQUKXMR
	 */
	this.extractImageData = function( imageNode ) {
		var classes, extraClasses, metadata, captionBlock, caption, link, width, height,
		captionClassName = [],
		dom = tinymce.activeEditor.dom,
		isIntRegExp = /^\d+$/;

		// default attributes
		metadata = {
			attachment_id: false,
			size: 'custom',
			caption: '',
			align: 'none',
			extraClasses: '',
			link: false,
			linkUrl: '',
			linkClassName: '',
			linkTargetBlank: false,
			linkRel: '',
			title: ''
		};
	
		metadata.url = dom.getAttrib( imageNode, 'src' );
		metadata.alt = dom.getAttrib( imageNode, 'alt' );
		metadata.title = dom.getAttrib( imageNode, 'title' );
	
		width = dom.getAttrib( imageNode, 'width' );
		height = dom.getAttrib( imageNode, 'height' );
	
		if ( ! isIntRegExp.test( width ) || parseInt( width, 10 ) < 1 ) {
			width = imageNode.naturalWidth || imageNode.width;
		}
	
		if ( ! isIntRegExp.test( height ) || parseInt( height, 10 ) < 1 ) {
			height = imageNode.naturalHeight || imageNode.height;
		}
	
		metadata.customWidth = metadata.width = width;
		metadata.customHeight = metadata.height = height;
	
		classes = tinymce.explode( imageNode.className, ' ' );
		extraClasses = [];
	
		tinymce.each( classes, function( name ) {
	
			if ( /^wp-image/.test( name ) ) {
				metadata.attachment_id = parseInt( name.replace( 'wp-image-', '' ), 10 );
			} else if ( /^align/.test( name ) ) {
				metadata.align = name.replace( 'align', '' );
			} else if ( /^size/.test( name ) ) {
				metadata.size = name.replace( 'size-', '' );
			} else {
				extraClasses.push( name );
			}
	
		} );
	
		metadata.extraClasses = extraClasses.join( ' ' );
	
		// Extract caption
		captionBlock = dom.getParents( imageNode, '.wp-caption' );
	
		if ( captionBlock.length ) {
			captionBlock = captionBlock[0];
	
			classes = captionBlock.className.split( ' ' );
			tinymce.each( classes, function( name ) {
				if ( /^align/.test( name ) ) {
					metadata.align = name.replace( 'align', '' );
				} else if ( name && name !== 'wp-caption' ) {
					captionClassName.push( name );
				}
			} );
	
			metadata.captionClassName = captionClassName.join( ' ' );
	
			caption = dom.select( 'dd.wp-caption-dd', captionBlock );
			if ( caption.length ) {
				caption = caption[0];
	
				metadata.caption = editor.serializer.serialize( caption )
					.replace( /<br[^>]*>/g, '$&\n' ).replace( /^<p>/, '' ).replace( /<\/p>$/, '' );
			}
		}
	
		// Extract linkTo
		if ( imageNode.parentNode && imageNode.parentNode.nodeName === 'A' ) {
			link = imageNode.parentNode;
			metadata.linkUrl = dom.getAttrib( link, 'href' );
			metadata.linkTargetBlank = dom.getAttrib( link, 'target' ) === '_blank' ? true : false;
			metadata.linkRel = dom.getAttrib( link, 'rel' );
			metadata.linkClassName = link.className;
		}

		return metadata;
	}

	/**
	 * This function has been copied from wp-includes/js/tinymce/plugins/wpeditimage/plugin.js.
	 * 
	 * Differences to this function compared to the original:
	 * 
	 * @since 1.0.8
	 * 
	 * @param object imageNode Example imageNode: http://pastebin.com/KknDQR9d This is data from the new image.
	 * @param object imageData Example imageData: http://pastebin.com/k0GJvEj8 This is data from the new image.
	 */
	this.updateImage = function updateImage( imageNode, imageData ) {
		var classes, className, node, html, parent, wrap, linkNode,
		captionNode, dd, dl, id, attrs, linkAttrs, width, height, align,
		editor = tinymce.activeEditor, dom = editor.dom;

		classes = tinymce.explode( imageData.extraClasses, ' ' );
	
		if ( ! classes ) {
			classes = [];
		}
	
		if ( ! imageData.caption ) {
			classes.push( 'align' + imageData.align );
		}
	
		if ( imageData.attachment_id ) {
			classes.push( 'wp-image-' + imageData.attachment_id );
			if ( imageData.size && imageData.size !== 'custom' ) {
				classes.push( 'size-' + imageData.size );
			}
		}
	
		width = imageData.width;
		height = imageData.height;
	
		if ( imageData.size === 'custom' ) {
			width = imageData.customWidth;
			height = imageData.customHeight;
		}
	
		attrs = {
			src: imageData.url,
			width: width || null,
			height: height || null,
			alt: imageData.alt,
			title: imageData.title || null,
			'class': classes.join( ' ' ) || null
		};
	
		dom.setAttribs( imageNode, attrs );
	
		linkAttrs = {
			href: imageData.linkUrl,
			rel: imageData.linkRel || null,
			target: imageData.linkTargetBlank ? '_blank': null,
			'class': imageData.linkClassName || null
		};
	
		if ( imageNode.parentNode && imageNode.parentNode.nodeName === 'A' && ! hasTextContent( imageNode.parentNode ) ) {
			// Update or remove an existing link wrapped around the image
			if ( imageData.linkUrl ) {
				dom.setAttribs( imageNode.parentNode, linkAttrs );
			} else {
				dom.remove( imageNode.parentNode, true );
			}
		} else if ( imageData.linkUrl ) {
			if ( linkNode = dom.getParent( imageNode, 'a' ) ) {
				// The image is inside a link together with other nodes,
				// or is nested in another node, move it out
				dom.insertAfter( imageNode, linkNode );
			}
	
			// Add link wrapped around the image
			linkNode = dom.create( 'a', linkAttrs );
			imageNode.parentNode.insertBefore( linkNode, imageNode );
			linkNode.appendChild( imageNode );
		}
	
		captionNode = editor.dom.getParent( imageNode, '.mceTemp' );
	
		if ( imageNode.parentNode && imageNode.parentNode.nodeName === 'A' && ! hasTextContent( imageNode.parentNode ) ) {
			node = imageNode.parentNode;
		} else {
			node = imageNode;
		}
	
		if ( imageData.caption ) {
			imageData.caption = verifyHTML( imageData.caption );
	
			id = imageData.attachment_id ? 'attachment_' + imageData.attachment_id : null;
			align = 'align' + ( imageData.align || 'none' );
			className = 'wp-caption ' + align;
	
			if ( imageData.captionClassName ) {
				className += ' ' + imageData.captionClassName.replace( /[<>&]+/g,  '' );
			}
	
			if ( ! editor.getParam( 'wpeditimage_html5_captions' ) ) {
				width = parseInt( width, 10 );
				width += 10;
			}
	
			if ( captionNode ) {
				dl = dom.select( 'dl.wp-caption', captionNode );
	
				if ( dl.length ) {
					dom.setAttribs( dl, {
						id: id,
						'class': className,
						style: 'width: ' + width + 'px'
					} );
				}
	
				dd = dom.select( '.wp-caption-dd', captionNode );
	
				if ( dd.length ) {
					dom.setHTML( dd[0], imageData.caption );
				}
	
			} else {
				id = id ? 'id="'+ id +'" ' : '';
	
				// should create a new function for generating the caption markup
				html =  '<dl ' + id + 'class="' + className +'" style="width: '+ width +'px">' +
					'<dt class="wp-caption-dt"></dt><dd class="wp-caption-dd">'+ imageData.caption +'</dd></dl>';
	
				wrap = dom.create( 'div', { 'class': 'mceTemp' }, html );
	
				if ( parent = dom.getParent( node, 'p' ) ) {
					parent.parentNode.insertBefore( wrap, parent );
				} else {
					node.parentNode.insertBefore( wrap, node );
				}
	
				editor.$( wrap ).find( 'dt.wp-caption-dt' ).append( node );
	
				if ( parent && dom.isEmpty( parent ) ) {
					dom.remove( parent );
				}
			}
		} else if ( captionNode ) {
			// Remove the caption wrapper and place the image in new paragraph
			parent = dom.create( 'p' );
			captionNode.parentNode.insertBefore( parent, captionNode );
			parent.appendChild( node );
			dom.remove( captionNode );
		}
	
		if ( wp.media.events ) {
			wp.media.events.trigger( 'editor:image-update', {
				editor: editor,
				metadata: imageData,
				image: imageNode
			} );
		}
	
		editor.nodeChanged();
	}
	
}