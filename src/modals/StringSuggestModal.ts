import { App, FuzzySuggestModal } from 'obsidian';

export class StringSuggestModal extends FuzzySuggestModal<string> {
	private items: string[] = [];
	onSubmit: (result: string) => void = () => { };

	constructor(app: App, title: string, items: string[], onSubmit: (result: string) => void) {
		super(app);
		this.setPlaceholder(title);
		this.items = items;
		this.onSubmit = onSubmit;
	}

	getItems(): string[] {
		return this.items;
	}
	getItemText(item: string): string {
		return item;
	}
	onChooseItem(item: string): void {
		this.onSubmit(item);
	}
}