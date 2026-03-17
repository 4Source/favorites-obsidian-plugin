import Flair from './Flair';

export default class InUseFlair extends Flair {
	constructor(parentEl: HTMLElement) {
		super(parentEl, 'In Use', 'Enabled in at least one vault');
	}
}