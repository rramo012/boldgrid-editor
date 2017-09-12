import { Palette } from './color/palette';
import { Intro } from '../notice/intro';

export class Loader {

	init() {
		new Palette().init();
		new Intro().init();
	}

}
