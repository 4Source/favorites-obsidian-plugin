export default class Flair {
	constructor(parentEl: HTMLElement, text: string, ariaLabel: string | null = null) {
		if (parentEl) {
			const flair = parentEl.createSpan({
				cls: 'flair',
				text: text,
			});
			if (ariaLabel) {
				flair.setAttribute('aria-label', ariaLabel);
			}
		}
	}
}