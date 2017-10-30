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
import blockAlignment from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/block-align.svg';
import colorSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/color.svg';
import backgroundColorSvg from 'svg-inline-loader?classPrefix!../../../../assets/image/icons/customize-nav/background-color.svg';

export class Navigation {

	constructor() {
		this.template = _.template( template );

		this.data = {
			controls: [
				{ name: 'fontColor', icon: colorSvg, label: 'Color' },
				{ name: 'background-color', icon: backgroundColorSvg, label: 'Background Color' },
				{ name: 'margin', icon: marginSvg, label: 'Margin' },
				{ name: 'padding', icon: paddingSvg, label: 'Padding' },
				{ name: 'border', icon: borderSvg, label: 'Border' },
				{ name: 'border-radius', icon: borderRadius, label: 'Border Radius' },
				{ name: 'box-shadow', icon: boxShadow, label: 'Box Shadow' },
				{ name: 'width', icon: widthSvg, label: 'Width' },
				{ name: 'blockAlignment', icon: blockAlignment, label: 'Block Alignment' },
				{ name: 'customClasses', icon: customClasses, label: 'Custom CSS Classes' }
			]
		};
	}

	init() {
		this._render();
		this._setupClick();

		this._bindEvents();

		return this;
	}

	_bindEvents() {
		BG.Panel.$element.on( 'open', () => this.onPanelOpen() );
	}

	enable() {
		this.$element.show();
	}

	disable() {
		this.$element.hide();
	}

	onPanelOpen() {
		this._enableMenuOptions();
		this.activateFirstControl();
		this.disable();
	}

	activateFirstControl() {
		return this.$element.find( '.item.enabled' ).first().click();
	}

	_enableMenuOptions() {
		let $items = this.$element.find( '.item' ).removeClass( 'enabled' ),
			$customize = BG.Panel.$element.find( '.customize' );

		$customize.find( '[data-control-name]' ).each( ( index, el ) => {
			let $el = $( el ),
				name = $el.data( 'control-name' );

			this.$element.find( '[data-control-name="' + name + '"]' ).addClass( 'enabled' );
		} );
	}

	_render() {
		this.$element = $( this.template( this.data ) );
		this.$element.hide();
		BG.Panel.$element.find( '.panel-title' ).after( this.$element );
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

}

export { Navigation as default };
