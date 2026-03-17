export default class InstalledFlair {
	constructor(parentEl: HTMLElement) {
		if (parentEl) {
			const flair = Array.from(parentEl.getElementsByClassName('flair')).find(el => el.textContent?.trim().toLowerCase() === 'installed');

			if (flair) {
				flair.setAttribute('aria-label', 'Installed in this vault');
			}
		}
	}
}