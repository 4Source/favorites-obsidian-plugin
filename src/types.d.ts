import { } from 'obsidian';

declare module 'obsidian' {
	interface App {
		setting: SettingsModal
	}

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

	interface SettingsModal {
		openTab(settingTab: SettingTab): unknown;
	}

	interface SettingTab {
		id: string;
		setting: unknown;
		containerEl: HTMLElement;
		navEl: HTMLElement;
		app: App;
	}

	interface CommunityPluginsSettingTab extends SettingTab {
		id: 'community-plugins';
		installedPlugins: {
			listEl: HTMLElement
		};

		display(): void;
		render(e: boolean): void;
		renderInstalledPlugin(plugin: CommunityItem, t: unknown, n: unknown, i: unknown, r: unknown): void;
		updateSearch(e: unknown): void
	}
}