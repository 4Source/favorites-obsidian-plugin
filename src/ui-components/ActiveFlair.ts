export default class ActiveFlair {
	constructor(parentEl: HTMLElement) {
		if (parentEl) {
			const flair = Array.from(parentEl.getElementsByClassName('flair')).find(el => el.textContent?.trim().toLowerCase() === 'active');

			if (flair) {
				flair.setAttribute('aria-label', 'Active theme in this vault');
			}
		}
	}
}