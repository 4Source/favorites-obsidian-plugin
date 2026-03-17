import Flair from './Flair';

export default class KnownFlair extends Flair {
	constructor(parentEl: HTMLElement) {
		super(parentEl, 'Known', 'Installed at least once in a vault');
	}
}
