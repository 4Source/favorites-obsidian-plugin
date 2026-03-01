import { } from 'obsidian';

declare module 'obsidian' {
	interface CommunityItem {
		id: string;
	}

	interface CommunityModal {
		update(): void;
		updateItems(): CommunityItem[];
		showItem(item: CommunityItem): void;
	}

	interface Modal {

	}
}