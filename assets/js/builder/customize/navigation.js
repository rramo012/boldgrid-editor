var $ = window.jQuery,
	BG = BOLDGRID.EDITOR;

import template from '../../../../includes/template/customize/navigation.html';

import marginSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/margin.svg';
import paddingSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/padding.svg';
import borderSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/border.svg';
import boxShadow from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/box-shadow.svg';
import borderRadius from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/border-radius.svg';
import customClasses from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/custom-class.svg';
import widthSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/width.svg';

export class Navigation {

	constructor() {
		this.template = _.template( template );
	}

	getData() {
		return {
			controls: [
				{ name: 'margin', icon: marginSvg },
				{ name: 'padding', icon: paddingSvg },
				{ name: 'border', icon: borderSvg },
				{ name: 'box-shadow', icon: boxShadow },
				{ name: 'border-radius', icon: borderRadius },
				{ name: 'width', icon: widthSvg },
				{ name: 'custom-classes', icon: customClasses }
			]
		};
	}

	_setupClick()  {
		this.$element.find( '.item' ).on( 'click', ( e ) => {
			let $el = $( e.target ).closest( '.item' ),
				name = $el.data( 'control-name' );

			e.preventDefault();

			if ( this.$activeControl ) {
				this.$activeControl.removeClass( 'active' );
				BG.Panel.$element.find( '.customize [data-control-name]' ).hide();
			}

			$el.addClass( 'active' );
			this.$activeControl = $el;

			this.displayControl( name );
		} );
	}

	displayControl( name ) {
		BG.Panel.$element.find( '.customize [data-control-name="' + name + '"]' ).show();
	}

	render() {
		let navData = { controls: [] };
		BG.Panel.$element.find( '.customize [data-control-name]' ).each( ( index, el ) => {
			let $element = $( el ),
				controlName = $element.data( 'control-name' );

				navData.controls.push( { icon: marginSvg, name: controlName } );
		} );

		navData = this.getData();

		this.$element = $( this.template( navData ) );
		BG.Panel.$element.find( '.panel-title' ).after( this.$element );
		this._setupClick();

		this.$element.find( '.item:first-of-type' ).click();
	}
}

export { Navigation as default };
