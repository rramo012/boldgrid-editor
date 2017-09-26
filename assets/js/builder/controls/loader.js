import { Palette } from './color/palette';
import { Intro } from '../notice/intro';
import { Save as LibrarySave } from '../library/save';

export class Loader {

	/**
	 * Load controls.
	 *
	 * @since 1.6
	 */
	init() {
		new Palette().init();
		new Intro().init();
		new LibrarySave().init();
	}
}
