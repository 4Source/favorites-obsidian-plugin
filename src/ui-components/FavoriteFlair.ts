import Flair from './Flair';

export default class FavoriteFlair extends Flair {
	constructor(parentEl: HTMLElement) {
		super(parentEl, 'Favorite', 'Marked as favorite');
	}
}