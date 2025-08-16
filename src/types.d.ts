import { } from 'obsidian';

declare module 'obsidian' {
	interface CommunityItem {
		id: string;

		// ...
	}

	interface CommunityModal {
		update(): void;
		updateItems(): CommunityItem[];
		showItem(item: CommunityItem): void;

		// ...

		// Additional from this plugin
		/**
		 * This is the backup of the original ``updateItems()`` function. Do not use otherwise than restoring!
		 */
		originalUpdateItems?(): CommunityItem[];

		/**
		 * This is the backup of the original ``showItem()`` function. Do not use otherwise than restoring!
		 */
		originalShowItem?(item: CommunityItem): void;
	}

	interface Modal {

		// Additional form this plugin
		/**
		 * This is the backup of the original ``open()`` function. Do not use otherwise than restoring!
		 */
		originalOpen?(): void;
	}
}