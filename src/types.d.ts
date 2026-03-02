import { } from 'obsidian';

declare module 'obsidian' {
	interface App {
		setting: SettingsModal;
		plugins: {
			manifests: Record<string, PluginManifest>;
		};
		customCss: {
			themes: Record<string, ThemeManifest>;
		}
	}

	interface ThemeManifest {
		author: string;
		authorUrl: string;
		dir: string;
		minAppVersion: string;
		name: string;
		version: string;
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