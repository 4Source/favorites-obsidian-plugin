import { App, FuzzyMatch, FuzzySuggestModal, renderResults } from 'obsidian';

export class CommunitySuggestModal<T extends { name: string, author: string }> extends FuzzySuggestModal<T> {
	private items: T[] = [];
	private onSubmit: (result: T) => void;

	constructor(app: App, title: string, items: T[], onSubmit: (result: T) => void) {
		super(app);
		this.setPlaceholder(title);
		this.items = items;
		this.onSubmit = onSubmit;
	}

	getItemText(item: T): string {
		return `${item.name} ${item.author}`;
	}

	getItems(): T[] {
		return this.items;
	}

	onChooseItem(item: T): void {
		this.onSubmit(item);
	}

	renderSuggestion(match: FuzzyMatch<T>, el: HTMLElement) {
		const titleEl = el.createDiv();
		renderResults(titleEl, match.item.name, match.match);

		// Only render the matches in the author name.
		const authorEl = el.createEl('small');
		const offset = -(match.item.name.length + 1);
		renderResults(authorEl, match.item.author, match.match, offset);
	}
}